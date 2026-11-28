import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { DECKS, DEFAULT_DECKS, type Prompt } from './prompts';
import {
  BackLink,
  GameHeader,
  PlayerList,
  PushupPicker,
  Rules,
  ToggleRow,
} from '../shared/components';
import { useLeaveGuard, useWakeLock } from '../shared/hooks';
import {
  cleanPlayers,
  cleanPushups,
  loadJSON,
  randBetween,
  randInt,
  saveJSON,
  setMuted,
  sound,
  vibrate,
} from '../shared/utils';

type Phase = 'setup' | 'ready' | 'play' | 'boom';

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 16;
const STORAGE_KEY = 'hotpotato-settings-v1';
const USED_KEY = 'hotpotato-used-prompts-v1';

const FUSES = {
  short: { label: 'Short', hint: '10–20 s', min: 10, max: 20 },
  normal: { label: 'Normal', hint: '15–35 s', min: 15, max: 35 },
  long: { label: 'Long', hint: '30–60 s', min: 30, max: 60 },
} as const;
type Fuse = keyof typeof FUSES;

interface Settings {
  players: string[];
  decks: string[];
  fuse: Fuse;
  pushups: number;
  newPromptEachPass: boolean;
  sound: boolean;
  /** Push-ups each player has been caught with, aligned with `players`. */
  tally: number[];
}

const DEFAULT_SETTINGS: Settings = {
  players: ['Player 1', 'Player 2', 'Player 3', 'Player 4'],
  decks: DEFAULT_DECKS,
  fuse: 'normal',
  pushups: 10,
  newPromptEachPass: false,
  sound: true,
  tally: [0, 0, 0, 0],
};

function loadSettings(): Settings {
  const p = loadJSON<Settings>(STORAGE_KEY);
  if (!p) return DEFAULT_SETTINGS;
  const players = cleanPlayers(p.players, MIN_PLAYERS, MAX_PLAYERS, DEFAULT_SETTINGS.players);
  const decks = Array.isArray(p.decks) ? p.decks.filter((id) => DECKS.some((d) => d.id === id)) : [];
  return {
    players,
    decks: decks.length ? decks : DEFAULT_DECKS,
    fuse: typeof p.fuse === 'string' && p.fuse in FUSES ? p.fuse : 'normal',
    pushups: cleanPushups(p.pushups),
    newPromptEachPass: p.newPromptEachPass === true,
    sound: p.sound !== false,
    tally: players.map((_, i) => {
      const v = Array.isArray(p.tally) ? Number(p.tally[i]) : 0;
      return Number.isFinite(v) && v > 0 ? Math.floor(v) : 0;
    }),
  };
}

/** Picks a prompt from the chosen decks, avoiding recent repeats across sessions. */
function pickPrompt(deckIds: string[], avoid?: Prompt): Prompt {
  const all = DECKS.filter((d) => deckIds.includes(d.id)).flatMap((d) => d.prompts);
  const pool = all.length ? all : DECKS[0].prompts;
  let used: string[] = [];
  try {
    used = JSON.parse(localStorage.getItem(USED_KEY) || '[]');
  } catch {
    used = [];
  }
  let fresh = pool.filter((p) => !used.includes(p.text) && p.text !== avoid?.text);
  if (fresh.length === 0) {
    used = [];
    fresh = pool.filter((p) => p.text !== avoid?.text);
  }
  const prompt = fresh[randInt(fresh.length)] ?? pool[0];
  // Remember roughly the last ~80% of the pool so prompts cycle before repeating.
  used = [...used, prompt.text].slice(-Math.max(1, Math.floor(pool.length * 0.8)));
  try {
    localStorage.setItem(USED_KEY, JSON.stringify(used));
  } catch {
    /* ignore */
  }
  return prompt;
}

export default function App() {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [phase, setPhase] = useState<Phase>('setup');
  const [prompt, setPrompt] = useState<Prompt>(() => pickPrompt(settings.decks));
  const [starter, setStarter] = useState(0);
  const [passes, setPasses] = useState(0);
  const [caught, setCaught] = useState<number | null>(null);

  useEffect(() => {
    saveJSON(STORAGE_KEY, settings);
  }, [settings]);
  useEffect(() => {
    setMuted(!settings.sound);
  }, [settings.sound]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);
  useLeaveGuard(phase !== 'setup');
  useWakeLock(phase === 'ready' || phase === 'play');

  const names = useMemo(
    () => settings.players.map((p, i) => p.trim() || `Player ${i + 1}`),
    [settings.players],
  );

  const newRound = (startWith: number | null) => {
    sound.unlock();
    setPrompt((prev) => pickPrompt(settings.decks, prev));
    setStarter(startWith ?? randInt(names.length));
    setPasses(0);
    setCaught(null);
    setPhase('ready');
  };

  const toggleCaught = (i: number) => {
    const prev = caught;
    const next = prev === i ? null : i;
    setSettings((s) => ({
      ...s,
      tally: s.tally.map((v, j) => {
        let out = v;
        if (j === prev) out -= s.pushups;
        if (j === next) out += s.pushups;
        return Math.max(0, out);
      }),
    }));
    setCaught(next);
    vibrate(25);
  };

  return (
    <div className="app-shell">
      {phase === 'setup' && (
        <SetupScreen settings={settings} setSettings={setSettings} onStart={() => newRound(null)} />
      )}
      {phase === 'ready' && (
        <ReadyScreen
          prompt={prompt}
          starter={names[starter]}
          onShuffle={() => setPrompt((p) => pickPrompt(settings.decks, p))}
          onLight={() => {
            sound.unlock();
            setPhase('play');
          }}
          onQuit={() => setPhase('setup')}
        />
      )}
      {phase === 'play' && (
        <PlayScreen
          prompt={prompt}
          passes={passes}
          fuse={settings.fuse}
          onPass={() => {
            setPasses((n) => n + 1);
            if (settings.newPromptEachPass) setPrompt((p) => pickPrompt(settings.decks, p));
          }}
          onNewPrompt={() => setPrompt((p) => pickPrompt(settings.decks, p))}
          onExplode={() => setPhase('boom')}
          onQuit={() => setPhase('setup')}
        />
      )}
      {phase === 'boom' && (
        <BoomScreen
          names={names}
          tally={settings.tally}
          pushups={settings.pushups}
          passes={passes}
          caught={caught}
          onToggleCaught={toggleCaught}
          onNext={() => newRound(caught)}
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
  const { players, decks, fuse, pushups, tally } = settings;
  const update = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));
  const hasTally = tally.some((v) => v > 0);
  const promptCount = DECKS.filter((d) => decks.includes(d.id)).reduce((n, d) => n + d.prompts.length, 0);

  const toggleDeck = (id: string) => {
    const next = decks.includes(id) ? decks.filter((d) => d !== id) : [...decks, id];
    if (next.length) update({ decks: next });
  };

  return (
    <main className="screen gap-6 pb-32">
      <BackLink />
      <GameHeader emoji="💣" title="Hot Potato" tagline="Name it, pass it, don’t get caught." />

      <section className="panel">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="section-title">Players</h2>
          <span className="text-sm text-white/50">
            {players.length} / {MAX_PLAYERS}
          </span>
        </div>
        <PlayerList
          players={players}
          min={MIN_PLAYERS}
          max={MAX_PLAYERS}
          onChange={(next, removed) =>
            update({
              players: next,
              tally:
                removed !== undefined
                  ? tally.filter((_, j) => j !== removed)
                  : next.map((_, i) => tally[i] ?? 0),
            })
          }
          badge={(i) =>
            tally[i] > 0 ? (
              <span
                className="shrink-0 rounded-full bg-orange-500/15 px-2.5 py-1 text-sm font-bold text-orange-300"
                aria-label={`${tally[i]} push-ups`}
              >
                💪 {tally[i]}
              </span>
            ) : null
          }
        />
        {hasTally && (
          <div className="mt-3 flex items-center justify-between gap-3 text-sm text-white/50">
            <span>💪 Push-ups each player owes</span>
            <button
              type="button"
              className="shrink-0 font-semibold text-white/70 underline underline-offset-4"
              onClick={() => {
                if (window.confirm('Reset everyone’s push-ups to 0?')) update({ tally: players.map(() => 0) });
              }}
            >
              Reset
            </button>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="section-title">Prompt packs</h2>
          <span className="text-sm text-white/50">{promptCount} prompts</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {DECKS.map((d) => (
            <button
              key={d.id}
              type="button"
              aria-pressed={decks.includes(d.id)}
              onClick={() => toggleDeck(d.id)}
              className={`theme-tile ${decks.includes(d.id) ? 'selected' : ''}`}
            >
              <span className="text-3xl" aria-hidden>
                {d.emoji}
              </span>
              <span className="font-semibold leading-tight">{d.name}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-white/45">Pick as many as you like.</p>
      </section>

      <section className="panel flex flex-col gap-5">
        <div>
          <h2 className="section-title mb-1">Fuse</h2>
          <p className="mb-3 text-sm text-white/50">It’s random every round. Nobody knows when it blows.</p>
          <div className="segmented">
            {(Object.keys(FUSES) as Fuse[]).map((f) => (
              <button
                key={f}
                type="button"
                className={fuse === f ? 'active' : ''}
                aria-pressed={fuse === f}
                onClick={() => update({ fuse: f })}
              >
                <span className="block leading-tight">{FUSES[f].label}</span>
                <span className="block text-xs font-semibold opacity-60">{FUSES[f].hint}</span>
              </button>
            ))}
          </div>
        </div>

        <PushupPicker value={pushups} onChange={(v) => update({ pushups: v })} />

        <ToggleRow
          title="New prompt every pass"
          subtitle="Off: everyone answers the same prompt, no repeats"
          checked={settings.newPromptEachPass}
          onChange={(v) => update({ newPromptEachPass: v })}
        />
        <ToggleRow
          title="Sound"
          subtitle="Ticking and a big boom"
          checked={settings.sound}
          onChange={(v) => update({ sound: v })}
        />
      </section>

      <Rules open={showRules} onToggle={() => setShowRules((v) => !v)}>
        <li>Sit in a circle. The phone shows a prompt, like “Name… a fruit”.</li>
        <li>Holding the phone? Say an answer out loud, tap the bomb, and pass it to the next person.</li>
        <li>No repeats, no stalling! If the group says your answer doesn’t count, keep going.</li>
        <li>The fuse is secret and random. Whoever is holding the phone when it blows does the push-ups. 💥</li>
        <li>The loser starts the next round.</li>
      </Rules>

      <div className="bottom-bar">
        <button type="button" className="btn-primary w-full" onClick={onStart}>
          Start game
        </button>
      </div>
    </main>
  );
}

/* ---------------------------------- Ready --------------------------------- */

function PromptCard({ prompt }: { prompt: Prompt }) {
  return (
    <div key={prompt.text} className="prompt-card pop-in">
      <span className="text-sm font-bold tracking-[0.25em] text-white/70 uppercase">Name…</span>
      <span className="mt-2 text-5xl" aria-hidden>
        {prompt.emoji}
      </span>
      <span className="mt-2 text-center text-3xl leading-tight font-black tracking-tight">{prompt.text}</span>
    </div>
  );
}

function QuitButton({ onQuit }: { onQuit: () => void }) {
  return (
    <button
      type="button"
      className="text-sm text-white/50 underline-offset-4 active:underline"
      onClick={() => {
        if (window.confirm('Quit this round and go back to setup?')) onQuit();
      }}
    >
      ← Quit
    </button>
  );
}

function ReadyScreen({
  prompt,
  starter,
  onShuffle,
  onLight,
  onQuit,
}: {
  prompt: Prompt;
  starter: string;
  onShuffle: () => void;
  onLight: () => void;
  onQuit: () => void;
}) {
  return (
    <main className="screen justify-between gap-6">
      <div className="flex items-center justify-between pt-2">
        <QuitButton onQuit={onQuit} />
      </div>

      <div className="flex flex-col items-center gap-6 text-center">
        <PromptCard prompt={prompt} />
        <button type="button" className="btn-ghost px-5 text-base" onClick={onShuffle}>
          🔀 Different prompt
        </button>
        <div>
          <p className="text-lg text-white/60">Give the phone to</p>
          <p className="mt-1 text-4xl font-black tracking-tight break-all">{starter}</p>
          <p className="mt-2 text-white/50">They go first.</p>
        </div>
      </div>

      <div className="pb-4">
        <button type="button" className="btn-fire w-full" onClick={onLight}>
          🔥 Light the fuse
        </button>
      </div>
    </main>
  );
}

/* ---------------------------------- Play ---------------------------------- */

function PlayScreen({
  prompt,
  passes,
  fuse,
  onPass,
  onNewPrompt,
  onExplode,
  onQuit,
}: {
  prompt: Prompt;
  passes: number;
  fuse: Fuse;
  onPass: () => void;
  onNewPrompt: () => void;
  onExplode: () => void;
  onQuit: () => void;
}) {
  const [beat, setBeat] = useState(0);
  const [bump, setBump] = useState(0);
  const explodeRef = useRef(onExplode);
  useEffect(() => {
    explodeRef.current = onExplode;
  }, [onExplode]);

  // The fuse: a hidden random deadline. Ticks speed up as it burns down, with
  // a little jitter so you can't count your way to the end.
  useEffect(() => {
    const { min, max } = FUSES[fuse];
    const total = randBetween(min, max) * 1000;
    const deadline = Date.now() + total;
    let timer = 0;
    const loop = () => {
      const remaining = deadline - Date.now();
      if (remaining <= 0) {
        sound.boom();
        vibrate([500, 80, 300]);
        explodeRef.current();
        return;
      }
      const progress = 1 - remaining / total;
      sound.tick(1 + progress * 0.6);
      setBeat((b) => b + 1);
      const interval = Math.max(160, 900 - 740 * progress * progress) * randBetween(0.85, 1.15);
      timer = window.setTimeout(loop, Math.min(interval, remaining));
    };
    timer = window.setTimeout(loop, 400);
    return () => window.clearTimeout(timer);
  }, [fuse]);

  const pass = () => {
    sound.pass();
    vibrate(20);
    setBump((b) => b + 1);
    onPass();
  };

  return (
    <main className="screen gap-5 select-none">
      <div className="flex items-center justify-between pt-2">
        <QuitButton onQuit={onQuit} />
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-white/70">
          🔁 {passes} {passes === 1 ? 'pass' : 'passes'}
        </span>
      </div>

      <PromptCard prompt={prompt} />

      <button type="button" className="bomb-pad" onClick={pass} aria-label="Answered! Tap, then pass the phone">
        <span key={bump} className={`bomb ${bump ? 'bump' : ''}`} aria-hidden>
          <span key={beat} className="bomb-ring" />
          💣
        </span>
        <span className="mt-4 text-2xl font-black">Said it? Tap &amp; pass!</span>
        <span className="mt-1 text-white/55">Then hand the phone to your left</span>
      </button>

      <button type="button" className="mx-auto pb-3 text-sm font-semibold text-white/45" onClick={onNewPrompt}>
        Stuck? 🔀 New prompt (the fuse keeps burning)
      </button>
    </main>
  );
}

/* ---------------------------------- Boom ---------------------------------- */

function BoomScreen({
  names,
  tally,
  pushups,
  passes,
  caught,
  onToggleCaught,
  onNext,
  onSetup,
}: {
  names: string[];
  tally: number[];
  pushups: number;
  passes: number;
  caught: number | null;
  onToggleCaught: (i: number) => void;
  onNext: () => void;
  onSetup: () => void;
}) {
  // Whoever was mid-tap when it blew shouldn't hit a button by accident.
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setArmed(true), 900);
    return () => window.clearTimeout(t);
  }, []);

  const shame = names
    .map((name, i) => ({ name, i, n: tally[i] ?? 0 }))
    .filter((p) => p.n > 0)
    .sort((a, b) => b.n - a.n);

  return (
    <main className="screen gap-6 pb-44">
      <div className="boom-flash" aria-hidden />
      <header className="pt-8 text-center">
        <div className="boom-emoji" aria-hidden>
          💥
        </div>
        <h1 className="pop-in mt-2 text-6xl font-black tracking-tight text-orange-400">BOOM!</h1>
        <p className="mt-3 text-lg text-white/70">Whoever’s holding the phone does</p>
        <p className="mt-1 text-5xl font-black">{pushups} push-ups</p>
        <p className="mt-2 text-sm text-white/45">
          The bomb survived {passes} {passes === 1 ? 'pass' : 'passes'}.
        </p>
      </header>

      <section className="panel">
        <h2 className="section-title">Who got caught?</h2>
        <p className="mt-1 mb-3 text-sm text-white/55">Tap their name to add the push-ups. They start next round.</p>
        <div className="flex flex-wrap gap-2">
          {names.map((name, i) => (
            <button
              key={i}
              type="button"
              disabled={!armed}
              aria-pressed={caught === i}
              className={`chip ${caught === i ? 'on' : ''}`}
              onClick={() => onToggleCaught(i)}
            >
              {caught === i ? '💪 ' : ''}
              {name}
            </button>
          ))}
        </div>
      </section>

      {shame.length > 0 && (
        <section className="panel">
          <h2 className="section-title mb-3">Wall of shame</h2>
          <ol className="flex flex-col gap-2">
            {shame.map((p, rank) => (
              <li key={p.i} className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
                <span className="w-6 text-center font-bold text-white/50">{rank + 1}</span>
                <span className="flex-1 truncate text-lg font-semibold">{p.name}</span>
                <span className="font-black text-orange-300">💪 {p.n}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="bottom-bar flex flex-col gap-2">
        <button type="button" className="btn-primary w-full" disabled={!armed} onClick={onNext}>
          Next round
        </button>
        <button type="button" className="btn-ghost w-full" disabled={!armed} onClick={onSetup}>
          Change players or packs
        </button>
      </div>
    </main>
  );
}
