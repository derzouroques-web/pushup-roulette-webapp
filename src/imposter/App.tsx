import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { RANDOM_THEME_ID, THEMES, type Theme, type Word } from './words';

type Phase = 'setup' | 'pass' | 'reveal' | 'play' | 'result';

interface Round {
  theme: Theme;
  word: Word;
  imposters: number[];
  starter: number;
}

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;
const STORAGE_KEY = 'imposter-settings-v1';
const USED_KEY = 'imposter-used-words-v1';

interface Settings {
  players: string[];
  themeId: string;
  imposterCount: number;
  hint: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  players: ['Player 1', 'Player 2', 'Player 3', 'Player 4'],
  themeId: RANDOM_THEME_ID,
  imposterCount: 1,
  hint: true,
};

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    const players =
      Array.isArray(parsed.players) && parsed.players.length >= MIN_PLAYERS
        ? parsed.players.slice(0, MAX_PLAYERS).map(String)
        : DEFAULT_SETTINGS.players;
    return {
      players,
      themeId:
        typeof parsed.themeId === 'string' &&
        (parsed.themeId === RANDOM_THEME_ID || THEMES.some((t) => t.id === parsed.themeId))
          ? parsed.themeId
          : DEFAULT_SETTINGS.themeId,
      imposterCount: parsed.imposterCount === 2 ? 2 : 1,
      hint: typeof parsed.hint === 'boolean' ? parsed.hint : true,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(s: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* storage unavailable (private mode) — game still works */
  }
}

function randInt(max: number) {
  if (window.crypto?.getRandomValues) {
    const buf = new Uint32Array(1);
    window.crypto.getRandomValues(buf);
    return buf[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function pickWord(theme: Theme): Word {
  let used: Record<string, string[]> = {};
  try {
    used = JSON.parse(localStorage.getItem(USED_KEY) || '{}');
  } catch {
    used = {};
  }
  let usedForTheme = used[theme.id] ?? [];
  let pool = theme.words.filter((w) => !usedForTheme.includes(w.word));
  if (pool.length === 0) {
    usedForTheme = [];
    pool = theme.words;
  }
  const word = pool[randInt(pool.length)];
  used[theme.id] = [...usedForTheme, word.word];
  try {
    localStorage.setItem(USED_KEY, JSON.stringify(used));
  } catch {
    /* ignore */
  }
  return word;
}

function buildRound(settings: Settings): Round {
  const theme =
    settings.themeId === RANDOM_THEME_ID
      ? THEMES[randInt(THEMES.length)]
      : THEMES.find((t) => t.id === settings.themeId) ?? THEMES[0];
  const word = pickWord(theme);
  const n = settings.players.length;
  const count = Math.min(settings.imposterCount, n - 2);
  const imposters: number[] = [];
  while (imposters.length < count) {
    const i = randInt(n);
    if (!imposters.includes(i)) imposters.push(i);
  }
  return { theme, word, imposters, starter: randInt(n) };
}

function vibrate(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* ignore */
  }
}

export default function App() {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [phase, setPhase] = useState<Phase>('setup');
  const [round, setRound] = useState<Round | null>(null);
  const [current, setCurrent] = useState(0);
  const [roundNumber, setRoundNumber] = useState(0);

  useEffect(() => saveSettings(settings), [settings]);

  // Warn before accidentally leaving mid-game (back swipe / reload).
  useEffect(() => {
    if (phase === 'setup') return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [phase]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase, current]);

  const names = useMemo(
    () => settings.players.map((p, i) => p.trim() || `Player ${i + 1}`),
    [settings.players],
  );

  const startRound = () => {
    setRound(buildRound(settings));
    setCurrent(0);
    setRoundNumber((r) => r + 1);
    setPhase('pass');
  };

  const nextPlayer = () => {
    if (current + 1 >= names.length) {
      setPhase('play');
    } else {
      setCurrent(current + 1);
      setPhase('pass');
    }
  };

  return (
    <div className="app-shell">
      {phase === 'setup' && (
        <SetupScreen settings={settings} setSettings={setSettings} onStart={startRound} />
      )}
      {phase === 'pass' && round && (
        <PassScreen
          name={names[current]}
          index={current}
          total={names.length}
          onReady={() => setPhase('reveal')}
          onQuit={() => setPhase('setup')}
        />
      )}
      {phase === 'reveal' && round && (
        <RevealScreen
          key={`${roundNumber}-${current}`}
          name={names[current]}
          isImposter={round.imposters.includes(current)}
          round={round}
          hint={settings.hint}
          nextName={current + 1 < names.length ? names[current + 1] : null}
          onDone={nextPlayer}
        />
      )}
      {phase === 'play' && round && (
        <PlayScreen
          round={round}
          names={names}
          onReveal={() => {
            vibrate([60, 40, 120]);
            setPhase('result');
          }}
        />
      )}
      {phase === 'result' && round && (
        <ResultScreen
          round={round}
          names={names}
          onAgain={startRound}
          onSetup={() => setPhase('setup')}
        />
      )}
    </div>
  );
}

/* ---------------------------------- Setup --------------------------------- */

function SetupScreen({
  settings,
  setSettings,
  onStart,
}: {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
  onStart: () => void;
}) {
  const [showRules, setShowRules] = useState(false);
  const { players, themeId, imposterCount, hint } = settings;
  const canTwoImposters = players.length >= 5;

  const update = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));

  const setPlayer = (i: number, value: string) =>
    update({ players: players.map((p, j) => (j === i ? value : p)) });

  const addPlayer = () => {
    if (players.length >= MAX_PLAYERS) return;
    update({ players: [...players, `Player ${players.length + 1}`] });
  };

  const removePlayer = (i: number) => {
    if (players.length <= MIN_PLAYERS) return;
    const next = players.filter((_, j) => j !== i);
    update({
      players: next,
      imposterCount: next.length < 5 ? 1 : imposterCount,
    });
  };

  return (
    <main className="screen gap-6 pb-32">
      <a
        href="/"
        className="-mb-4 inline-flex h-10 items-center gap-1 self-start rounded-full bg-white/10 px-4 text-sm font-semibold text-white/70 active:bg-white/20"
      >
        ← All games
      </a>
      <header className="text-center">
        <div className="text-6xl" aria-hidden>
          🕵️
        </div>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Imposter</h1>
        <p className="mt-1 text-base text-white/60">One phone. One secret word. One liar.</p>
      </header>

      <section className="panel">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="section-title">Players</h2>
          <span className="text-sm text-white/50">
            {players.length} / {MAX_PLAYERS}
          </span>
        </div>
        <ul className="flex flex-col gap-2">
          {players.map((p, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold">
                {i + 1}
              </span>
              <input
                className="input"
                value={p}
                maxLength={16}
                enterKeyHint="next"
                autoComplete="off"
                autoCapitalize="words"
                aria-label={`Player ${i + 1} name`}
                onFocus={(e) => e.currentTarget.select()}
                onChange={(e) => setPlayer(i, e.target.value)}
              />
              <button
                type="button"
                className="icon-btn"
                onClick={() => removePlayer(i)}
                disabled={players.length <= MIN_PLAYERS}
                aria-label={`Remove player ${i + 1}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
        {players.length < MAX_PLAYERS && (
          <button type="button" className="btn-ghost mt-3 w-full" onClick={addPlayer}>
            + Add player
          </button>
        )}
      </section>

      <section className="panel">
        <h2 className="section-title mb-3">Theme</h2>
        <div className="grid grid-cols-2 gap-2">
          <ThemeTile
            emoji="🎲"
            label="Random"
            selected={themeId === RANDOM_THEME_ID}
            onClick={() => update({ themeId: RANDOM_THEME_ID })}
          />
          {THEMES.map((t) => (
            <ThemeTile
              key={t.id}
              emoji={t.emoji}
              label={t.name}
              selected={themeId === t.id}
              onClick={() => update({ themeId: t.id })}
            />
          ))}
        </div>
      </section>

      <section className="panel flex flex-col gap-4">
        <div>
          <h2 className="section-title mb-3">Imposters</h2>
          <div className="segmented">
            {[1, 2].map((n) => (
              <button
                key={n}
                type="button"
                className={imposterCount === n ? 'active' : ''}
                disabled={n === 2 && !canTwoImposters}
                onClick={() => update({ imposterCount: n })}
              >
                {n} {n === 1 ? 'imposter' : 'imposters'}
              </button>
            ))}
          </div>
          {!canTwoImposters && (
            <p className="mt-2 text-sm text-white/45">2 imposters needs 5+ players.</p>
          )}
        </div>

        <label className="flex cursor-pointer items-center justify-between gap-4">
          <span>
            <span className="block font-semibold">Hint for the imposter</span>
            <span className="block text-sm text-white/50">The imposter sees the theme</span>
          </span>
          <input
            type="checkbox"
            className="switch"
            checked={hint}
            onChange={(e) => update({ hint: e.target.checked })}
          />
        </label>
      </section>

      <section className="panel">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => setShowRules((v) => !v)}
          aria-expanded={showRules}
        >
          <h2 className="section-title">How to play</h2>
          <span className="text-white/60">{showRules ? '−' : '+'}</span>
        </button>
        {showRules && (
          <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-[15px] leading-snug text-white/80">
            <li>Pass the phone around. Each player taps to see their role in secret.</li>
            <li>Everyone gets the same secret word, except the imposter.</li>
            <li>Take turns saying ONE word linked to the secret word. Don't make it too easy!</li>
            <li>After 1–2 rounds of clues, discuss and vote for who you think is the imposter.</li>
            <li>Reveal! If you caught the imposter, they get one last chance to guess the word.</li>
          </ol>
        )}
      </section>

      <div className="bottom-bar">
        <button type="button" className="btn-primary w-full" onClick={onStart}>
          Start game
        </button>
      </div>
    </main>
  );
}

function ThemeTile({
  emoji,
  label,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`theme-tile ${selected ? 'selected' : ''}`}
    >
      <span className="text-3xl" aria-hidden>
        {emoji}
      </span>
      <span className="font-semibold">{label}</span>
    </button>
  );
}

/* ---------------------------------- Pass ---------------------------------- */

function PassScreen({
  name,
  index,
  total,
  onReady,
  onQuit,
}: {
  name: string;
  index: number;
  total: number;
  onReady: () => void;
  onQuit: () => void;
}) {
  return (
    <main className="screen justify-between">
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          className="text-sm text-white/50 underline-offset-4 active:underline"
          onClick={() => {
            if (window.confirm('Quit this round and go back to setup?')) onQuit();
          }}
        >
          ← Quit
        </button>
        <Dots index={index} total={total} />
        <span className="w-12" />
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="pass-icon" aria-hidden>
          📱
        </div>
        <p className="mt-8 text-lg text-white/60">Pass the phone to</p>
        <h1 className="mt-1 break-all text-5xl font-black tracking-tight">{name}</h1>
        <p className="mt-6 max-w-xs text-base text-white/50">
          Make sure nobody else can see the screen.
        </p>
      </div>

      <div className="pb-4">
        <button type="button" className="btn-primary w-full" onClick={onReady}>
          I'm {name} — show my role
        </button>
      </div>
    </main>
  );
}

function Dots({ index, total }: { index: number; total: number }) {
  return (
    <div className="flex gap-1.5" aria-label={`Player ${index + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-2 rounded-full transition-all ${
            i === index ? 'w-6 bg-white' : i < index ? 'w-2 bg-white/60' : 'w-2 bg-white/20'
          }`}
        />
      ))}
    </div>
  );
}

/* --------------------------------- Reveal --------------------------------- */

function RevealScreen({
  name,
  isImposter,
  round,
  hint,
  nextName,
  onDone,
}: {
  name: string;
  isImposter: boolean;
  round: Round;
  hint: boolean;
  nextName: string | null;
  onDone: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [seen, setSeen] = useState(false);

  const reveal = () => {
    if (revealed) return;
    setRevealed(true);
    setSeen(true);
    vibrate(isImposter ? [80, 50, 80] : 40);
  };

  return (
    <main className="screen justify-between">
      <p className="pt-2 text-center text-lg text-white/60">
        <span className="font-bold text-white">{name}</span>, your role:
      </p>

      <button
        type="button"
        className={`flip-card ${revealed ? 'flipped' : ''}`}
        onClick={reveal}
        aria-label={revealed ? 'Your role' : 'Tap to reveal your role'}
      >
        <div className="flip-inner">
          <div className="flip-face flip-front">
            <span className="text-7xl" aria-hidden>
              🤫
            </span>
            <span className="mt-6 text-2xl font-black">Tap to reveal</span>
            <span className="mt-2 text-white/60">Only you should look</span>
          </div>
          <div className={`flip-face flip-back ${isImposter ? 'imposter' : 'crew'}`}>
            {isImposter ? (
              <>
                <span className="text-7xl" aria-hidden>
                  🕵️
                </span>
                <span className="mt-4 text-sm font-bold tracking-[0.25em] text-white/80 uppercase">
                  You are the
                </span>
                <span className="text-5xl font-black tracking-tight">IMPOSTER</span>
                {hint ? (
                  <span className="mt-6 rounded-full bg-black/25 px-4 py-2 text-base font-semibold">
                    Theme: {round.theme.emoji} {round.theme.name}
                  </span>
                ) : (
                  <span className="mt-6 text-base text-white/80">No hint this time!</span>
                )}
                <span className="mt-4 max-w-[16rem] text-sm text-white/80">
                  Blend in. Listen to the clues and guess the secret word.
                </span>
              </>
            ) : (
              <>
                <span className="text-sm font-bold tracking-[0.25em] text-white/80 uppercase">
                  Secret word
                </span>
                <span className="mt-4 text-8xl" aria-hidden>
                  {round.word.emoji}
                </span>
                <span className="mt-4 text-center text-5xl leading-none font-black tracking-tight">
                  {round.word.word}
                </span>
                <span className="mt-6 rounded-full bg-black/25 px-4 py-2 text-base font-semibold">
                  {round.theme.emoji} {round.theme.name}
                </span>
                <span className="mt-4 max-w-[16rem] text-sm text-white/80">
                  Find the imposter. Don't make your clue too obvious!
                </span>
              </>
            )}
          </div>
        </div>
      </button>

      <div className="pb-4">
        <button
          type="button"
          className="btn-primary w-full"
          disabled={!seen}
          onClick={() => {
            setRevealed(false);
            // let the card flip back before moving on
            window.setTimeout(onDone, 250);
          }}
        >
          {seen
            ? nextName
              ? `Hide & pass to ${nextName}`
              : 'Hide & start the game'
            : 'Tap the card first'}
        </button>
      </div>
    </main>
  );
}

/* ---------------------------------- Play ---------------------------------- */

function PlayScreen({
  round,
  names,
  onReveal,
}: {
  round: Round;
  names: string[];
  onReveal: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const order = names.map((_, i) => (round.starter + i) % names.length);

  return (
    <main className="screen gap-6 pb-32">
      <header className="pt-4 text-center">
        <p className="text-sm font-bold tracking-[0.25em] text-white/50 uppercase">Everyone is ready</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Give your clues!</h1>
        <p className="mt-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-base font-semibold">
          Theme: {round.theme.emoji} {round.theme.name}
        </p>
      </header>

      <section className="panel">
        <h2 className="section-title mb-1">Clue order</h2>
        <p className="mb-3 text-sm text-white/55">Each player says ONE word. Go around 1–2 times.</p>
        <ol className="flex flex-col gap-2">
          {order.map((p, i) => (
            <li
              key={p}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
                i === 0 ? 'bg-amber-400/15 ring-1 ring-amber-300/50' : 'bg-white/5'
              }`}
            >
              <span className="w-6 text-center font-bold text-white/50">{i + 1}</span>
              <span className="flex-1 truncate text-lg font-semibold">{names[p]}</span>
              {i === 0 && <span className="text-sm font-bold text-amber-300">Starts ⭐</span>}
            </li>
          ))}
        </ol>
      </section>

      <section className="panel text-[15px] leading-snug text-white/75">
        <p>
          🗣️ <b>Then discuss</b> and agree on who the imposter is. Point at them on the count of 3!
        </p>
      </section>

      <div className="bottom-bar">
        {confirming ? (
          <div className="flex gap-2">
            <button type="button" className="btn-ghost flex-1" onClick={() => setConfirming(false)}>
              Not yet
            </button>
            <button type="button" className="btn-danger flex-[2]" onClick={onReveal}>
              Yes, reveal!
            </button>
          </div>
        ) : (
          <button type="button" className="btn-danger w-full" onClick={() => setConfirming(true)}>
            We voted — reveal the imposter
          </button>
        )}
      </div>
    </main>
  );
}

/* --------------------------------- Result --------------------------------- */

function ResultScreen({
  round,
  names,
  onAgain,
  onSetup,
}: {
  round: Round;
  names: string[];
  onAgain: () => void;
  onSetup: () => void;
}) {
  const many = round.imposters.length > 1;
  return (
    <main className="screen gap-6 pb-40">
      <header className="pt-6 text-center">
        <p className="text-sm font-bold tracking-[0.25em] text-white/50 uppercase">
          The {many ? 'imposters were' : 'imposter was'}
        </p>
        <div className="pop-in mt-4 flex flex-col items-center gap-2">
          <span className="text-7xl" aria-hidden>
            🕵️
          </span>
          {round.imposters.map((i) => (
            <h1 key={i} className="text-5xl font-black tracking-tight break-all text-rose-400">
              {names[i]}
            </h1>
          ))}
        </div>
      </header>

      <section className="panel flex flex-col items-center text-center">
        <p className="text-sm font-bold tracking-[0.25em] text-white/50 uppercase">The secret word</p>
        <span className="mt-3 text-6xl" aria-hidden>
          {round.word.emoji}
        </span>
        <p className="mt-2 text-4xl font-black">{round.word.word}</p>
        <p className="mt-2 text-white/55">
          {round.theme.emoji} {round.theme.name}
        </p>
      </section>

      <section className="panel text-[15px] leading-snug text-white/75">
        <p>
          ✅ Caught the imposter? They get <b>one guess</b> at the word. Right guess = imposter
          steals the win!
        </p>
        <p className="mt-2">❌ Wrong person voted? The imposter wins.</p>
      </section>

      <div className="bottom-bar flex flex-col gap-2">
        <button type="button" className="btn-primary w-full" onClick={onAgain}>
          Play again
        </button>
        <button type="button" className="btn-ghost w-full" onClick={onSetup}>
          Change players or theme
        </button>
      </div>
    </main>
  );
}
