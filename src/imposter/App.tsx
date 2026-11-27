import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import confetti from 'canvas-confetti';
import { RANDOM_THEME_ID, THEMES, type Theme, type Word } from './words';

type Phase = 'setup' | 'pass' | 'reveal' | 'play' | 'result' | 'champion';

interface Round {
  theme: Theme;
  word: Word;
  imposters: number[];
  starter: number;
}

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;
const WIN_TARGET = 5;
const STORAGE_KEY = 'imposter-settings-v1';
const USED_KEY = 'imposter-used-words-v1';

interface Settings {
  players: string[];
  themeId: string;
  imposterCount: number;
  hint: boolean;
  /** Points per player, aligned with `players`. First to WIN_TARGET wins the match. */
  scores: number[];
}

const DEFAULT_SETTINGS: Settings = {
  players: ['Player 1', 'Player 2', 'Player 3', 'Player 4'],
  themeId: RANDOM_THEME_ID,
  imposterCount: 1,
  hint: true,
  scores: [0, 0, 0, 0],
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
      scores: players.map((_, i) => {
        const v = Array.isArray(parsed.scores) ? Number(parsed.scores[i]) : 0;
        return Number.isFinite(v) && v > 0 ? Math.min(Math.floor(v), WIN_TARGET) : 0;
      }),
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
  // Players given a point in the current round (so a second tap can undo it).
  const [awarded, setAwarded] = useState<number[]>([]);
  const [champion, setChampion] = useState<number | null>(null);

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
    // A finished match (someone already at the target) starts over from 0.
    if (settings.scores.some((v) => v >= WIN_TARGET)) {
      setSettings((s) => ({ ...s, scores: s.players.map(() => 0) }));
    }
    setRound(buildRound(settings));
    setAwarded([]);
    setChampion(null);
    setCurrent(0);
    setRoundNumber((r) => r + 1);
    setPhase('pass');
  };

  const toggleWin = (i: number) => {
    const has = awarded.includes(i);
    const scores = settings.scores.map((v, j) =>
      j === i ? Math.max(0, Math.min(WIN_TARGET, v + (has ? -1 : 1))) : v,
    );
    setSettings((s) => ({ ...s, scores }));
    setAwarded((a) => (has ? a.filter((x) => x !== i) : [...a, i]));
    if (!has && scores[i] >= WIN_TARGET) {
      setChampion(i);
      setPhase('champion');
      vibrate([100, 60, 100, 60, 250]);
    } else {
      vibrate(has ? 15 : 35);
    }
  };

  const resetScores = () => setSettings((s) => ({ ...s, scores: s.players.map(() => 0) }));

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
        <SetupScreen
          settings={settings}
          setSettings={setSettings}
          onStart={startRound}
          onResetScores={resetScores}
        />
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
          scores={settings.scores}
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
          scores={settings.scores}
          awarded={awarded}
          onToggleWin={toggleWin}
          onAgain={startRound}
          onSetup={() => setPhase('setup')}
        />
      )}
      {phase === 'champion' && champion !== null && (
        <ChampionScreen
          winner={champion}
          names={names}
          scores={settings.scores}
          onNewMatch={() => {
            resetScores();
            startRound();
          }}
          onUndo={() => {
            toggleWin(champion);
            setPhase('result');
          }}
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
  onResetScores,
}: {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
  onStart: () => void;
  onResetScores: () => void;
}) {
  const [showRules, setShowRules] = useState(false);
  const { players, themeId, imposterCount, hint, scores } = settings;
  const hasScores = scores.some((v) => v > 0);
  const canTwoImposters = players.length >= 5;

  const update = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));

  const setPlayer = (i: number, value: string) =>
    update({ players: players.map((p, j) => (j === i ? value : p)) });

  const addPlayer = () => {
    if (players.length >= MAX_PLAYERS) return;
    update({ players: [...players, `Player ${players.length + 1}`], scores: [...scores, 0] });
  };

  const removePlayer = (i: number) => {
    if (players.length <= MIN_PLAYERS) return;
    const next = players.filter((_, j) => j !== i);
    update({
      players: next,
      scores: scores.filter((_, j) => j !== i),
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
              {scores[i] > 0 && (
                <span
                  className="shrink-0 rounded-full bg-amber-400/15 px-2.5 py-1 text-sm font-bold text-amber-300"
                  aria-label={`${scores[i]} points`}
                >
                  🏆 {scores[i]}
                </span>
              )}
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
        <div className="mt-3 flex items-center justify-between gap-3 text-sm text-white/50">
          <span>🏆 First to {WIN_TARGET} points wins the match</span>
          {hasScores && (
            <button
              type="button"
              className="shrink-0 font-semibold text-white/70 underline underline-offset-4"
              onClick={() => {
                if (window.confirm('Reset all scores to 0?')) onResetScores();
              }}
            >
              Reset scores
            </button>
          )}
        </div>
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
            <li>Tap the winners to give them a point. First to {WIN_TARGET} points wins the match! 🏆</li>
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
  scores,
  onReveal,
}: {
  round: Round;
  names: string[];
  scores: number[];
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
              <span className="w-10 text-right text-sm font-bold text-white/45" aria-label={`${scores[p]} points`}>
                🏆{scores[p]}
              </span>
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
  scores,
  awarded,
  onToggleWin,
  onAgain,
  onSetup,
}: {
  round: Round;
  names: string[];
  scores: number[];
  awarded: number[];
  onToggleWin: (i: number) => void;
  onAgain: () => void;
  onSetup: () => void;
}) {
  const many = round.imposters.length > 1;
  return (
    <main className="screen gap-6 pb-44">
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

      <section className="panel">
        <h2 className="section-title">Who won this round?</h2>
        <p className="mt-1 mb-3 text-sm text-white/55">
          Tap a name to give +1 point. Tap again to undo. First to {WIN_TARGET} wins!
        </p>
        <ul className="flex flex-col gap-2">
          {names.map((name, i) => {
            const on = awarded.includes(i);
            const isImp = round.imposters.includes(i);
            return (
              <li key={i}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => onToggleWin(i)}
                  className={`win-row ${on ? 'awarded' : ''}`}
                >
                  <span className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
                    <span className="flex w-full min-w-0 items-center gap-2">
                      <span className="truncate text-lg font-bold">{name}</span>
                      {isImp && (
                        <span className="shrink-0 rounded-full bg-rose-500/20 px-2 py-0.5 text-xs font-bold text-rose-300">
                          🕵️ Imposter
                        </span>
                      )}
                    </span>
                    <ScoreDots score={scores[i]} />
                  </span>
                  <span className={`win-badge ${on ? 'on' : ''}`}>{on ? '+1 ✓' : '+1'}</span>
                </button>
              </li>
            );
          })}
        </ul>
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
          Next round
        </button>
        <button type="button" className="btn-ghost w-full" onClick={onSetup}>
          Change players or theme
        </button>
      </div>
    </main>
  );
}

function ScoreDots({ score }: { score: number }) {
  return (
    <span className="flex items-center gap-1" aria-label={`${score} of ${WIN_TARGET} points`}>
      {Array.from({ length: WIN_TARGET }).map((_, i) => (
        <span
          key={i}
          className={`h-2.5 w-2.5 rounded-full transition-colors ${
            i < score ? 'bg-amber-400' : 'bg-white/15'
          }`}
        />
      ))}
      <span className="ml-1.5 text-xs font-bold text-white/50">
        {score}/{WIN_TARGET}
      </span>
    </span>
  );
}

/* -------------------------------- Champion -------------------------------- */

function ChampionScreen({
  winner,
  names,
  scores,
  onNewMatch,
  onUndo,
}: {
  winner: number;
  names: string[];
  scores: number[];
  onNewMatch: () => void;
  onUndo: () => void;
}) {
  useEffect(() => {
    const colors = ['#fbbf24', '#f472b6', '#a78bfa', '#34d399', '#ffffff'];
    const fire = (originX: number, angle: number) =>
      confetti({
        particleCount: 70,
        angle,
        spread: 70,
        startVelocity: 55,
        origin: { x: originX, y: 0.75 },
        colors,
        disableForReducedMotion: true,
      });
    fire(0, 60);
    fire(1, 120);
    const t = window.setTimeout(() => {
      fire(0.2, 75);
      fire(0.8, 105);
    }, 450);
    return () => {
      window.clearTimeout(t);
      confetti.reset();
    };
  }, []);

  const standings = names
    .map((name, i) => ({ name, i, score: scores[i] }))
    .sort((a, b) => b.score - a.score);

  return (
    <main className="screen gap-6 pb-44">
      <header className="pt-8 text-center">
        <div className="trophy" aria-hidden>
          🏆
        </div>
        <p className="mt-4 text-sm font-bold tracking-[0.25em] text-amber-300/80 uppercase">
          Match winner
        </p>
        <h1 className="pop-in mt-1 text-5xl font-black tracking-tight break-all text-amber-300">
          {names[winner]}
        </h1>
        <p className="mt-2 text-white/60">First to {WIN_TARGET} points. Bow down! 👑</p>
      </header>

      <section className="panel">
        <h2 className="section-title mb-3">Final standings</h2>
        <ol className="flex flex-col gap-2">
          {standings.map((p, rank) => (
            <li
              key={p.i}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
                p.i === winner ? 'bg-amber-400/15 ring-1 ring-amber-300/50' : 'bg-white/5'
              }`}
            >
              <span className="w-7 text-center text-lg" aria-hidden>
                {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `${rank + 1}`}
              </span>
              <span className="flex-1 truncate text-lg font-semibold">{p.name}</span>
              <span className="font-black text-white/80">{p.score}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="bottom-bar flex flex-col gap-2">
        <button type="button" className="btn-primary w-full" onClick={onNewMatch}>
          New match
        </button>
        <button type="button" className="btn-ghost w-full" onClick={onUndo}>
          Oops, undo that point
        </button>
      </div>
    </main>
  );
}
