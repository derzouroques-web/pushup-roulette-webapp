import { useEffect, useMemo, useRef, useState, type Dispatch, type PointerEvent, type SetStateAction } from 'react';
import {
  BackLink,
  GameHeader,
  PlayerList,
  PushupPicker,
  Rules,
  ToggleRow,
} from '../shared/components';
import { useConfetti, useLeaveGuard, useWakeLock } from '../shared/hooks';
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

type Phase = 'setup' | 'duel' | 'champion';
/** 0 = bottom player, 1 = top player (sitting opposite, sees the screen upside down). */
type Side = 0 | 1;

const STORAGE_KEY = 'duel-settings-v1';
const BEST_OF = [3, 5, 7] as const;
type BestOf = (typeof BEST_OF)[number];

interface Settings {
  players: string[];
  bestOf: BestOf;
  pushups: number;
  fakeouts: boolean;
  sound: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  players: ['Player 1', 'Player 2'],
  bestOf: 5,
  pushups: 10,
  fakeouts: true,
  sound: true,
};

function loadSettings(): Settings {
  const p = loadJSON<Settings>(STORAGE_KEY);
  if (!p) return DEFAULT_SETTINGS;
  return {
    players: cleanPlayers(p.players, 2, 2, DEFAULT_SETTINGS.players),
    bestOf: BEST_OF.includes(p.bestOf as BestOf) ? (p.bestOf as BestOf) : 5,
    pushups: cleanPushups(p.pushups),
    fakeouts: p.fakeouts !== false,
    sound: p.sound !== false,
  };
}

interface MatchResult {
  winner: Side;
  scores: [number, number];
  best: [number | null, number | null];
}

export default function App() {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [phase, setPhase] = useState<Phase>('setup');
  const [result, setResult] = useState<MatchResult | null>(null);
  const [matchId, setMatchId] = useState(0);

  useEffect(() => {
    saveJSON(STORAGE_KEY, settings);
  }, [settings]);
  useEffect(() => {
    setMuted(!settings.sound);
  }, [settings.sound]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);
  useLeaveGuard(phase === 'duel');
  useWakeLock(phase === 'duel');

  const names = useMemo(
    () => settings.players.map((p, i) => p.trim() || `Player ${i + 1}`),
    [settings.players],
  );

  const start = () => {
    sound.unlock();
    setResult(null);
    setMatchId((m) => m + 1);
    setPhase('duel');
  };

  return (
    <div className="app-shell">
      {phase === 'setup' && (
        <SetupScreen settings={settings} setSettings={setSettings} onStart={start} />
      )}
      {phase === 'duel' && (
        <DuelScreen
          key={matchId}
          names={names}
          target={Math.ceil(settings.bestOf / 2)}
          fakeouts={settings.fakeouts}
          onQuit={() => setPhase('setup')}
          onMatchOver={(r) => {
            setResult(r);
            setPhase('champion');
          }}
        />
      )}
      {phase === 'champion' && result && (
        <ChampionScreen
          names={names}
          result={result}
          pushups={settings.pushups}
          onRematch={start}
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
  const update = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));

  return (
    <main className="screen gap-6 pb-32">
      <BackLink />
      <GameHeader emoji="⚡" title="Reaction Duel" tagline="Two thumbs. One phone. Fastest wins." />

      <section className="panel">
        <h2 className="section-title mb-3">Players</h2>
        <PlayerList
          players={settings.players}
          min={2}
          max={2}
          labels={['⬇️', '⬆️']}
          onChange={(players) => update({ players })}
        />
        <p className="mt-3 text-sm text-white/50">
          ⬇️ sits at the bottom of the phone, ⬆️ sits opposite and sees it upside down.
        </p>
      </section>

      <section className="panel flex flex-col gap-5">
        <div>
          <h2 className="section-title mb-3">Match length</h2>
          <div className="segmented">
            {BEST_OF.map((n) => (
              <button
                key={n}
                type="button"
                className={settings.bestOf === n ? 'active' : ''}
                aria-pressed={settings.bestOf === n}
                onClick={() => update({ bestOf: n })}
              >
                <span className="block leading-tight">Best of {n}</span>
                <span className="block text-xs font-semibold opacity-60">first to {Math.ceil(n / 2)}</span>
              </button>
            ))}
          </div>
        </div>

        <PushupPicker value={settings.pushups} onChange={(v) => update({ pushups: v })} />

        <ToggleRow
          title="Fake-outs"
          subtitle="The screen flashes other colours to trick you"
          checked={settings.fakeouts}
          onChange={(v) => update({ fakeouts: v })}
        />
        <ToggleRow
          title="Sound"
          subtitle="Beep on green, buzz on a false start"
          checked={settings.sound}
          onChange={(v) => update({ sound: v })}
        />
      </section>

      <Rules open={showRules} onToggle={() => setShowRules((v) => !v)}>
        <li>Put the phone flat on a table between you. Each player gets one half of the screen.</li>
        <li>Tap ▶ in the middle to start a round, then wait with your thumb ready.</li>
        <li>When your half turns <b className="text-emerald-400">GREEN</b>, tap it. Fastest thumb wins the round.</li>
        <li>Tap too early (or on a fake-out colour) and your opponent gets the point.</li>
        <li>Win the match, and the loser does the push-ups. 💪</li>
      </Rules>

      <div className="bottom-bar">
        <button type="button" className="btn-primary w-full" onClick={onStart}>
          Start duel
        </button>
      </div>
    </main>
  );
}

/* ---------------------------------- Duel ---------------------------------- */

type RoundState =
  | { kind: 'idle' }
  | { kind: 'wait' }
  | { kind: 'decoy'; color: string }
  | { kind: 'go' }
  | { kind: 'won'; winner: Side; ms: number }
  | { kind: 'foul'; fouler: Side };

const DECOYS = ['amber', 'blue', 'purple'];

function DuelScreen({
  names,
  target,
  fakeouts,
  onQuit,
  onMatchOver,
}: {
  names: string[];
  target: number;
  fakeouts: boolean;
  onQuit: () => void;
  onMatchOver: (r: MatchResult) => void;
}) {
  const [round, setRound] = useState<RoundState>({ kind: 'idle' });
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [canNext, setCanNext] = useState(true);
  const [confirmQuit, setConfirmQuit] = useState(false);

  // Taps can land in the same frame, before React re-renders, so the live
  // round state is mirrored in refs and checked synchronously.
  const kindRef = useRef<RoundState['kind']>('idle');
  const goAtRef = useRef(0);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => clearTimers, []);

  const set = (r: RoundState) => {
    kindRef.current = r.kind;
    setRound(r);
  };

  const startRound = () => {
    if (!canNext) return;
    clearTimers();
    sound.unlock();
    setConfirmQuit(false);
    set({ kind: 'wait' });
    const goIn = randBetween(1800, 5000);
    if (fakeouts) {
      // Up to two decoy flashes, each well clear of the real green.
      const count = randInt(3);
      for (let i = 0; i < count; i++) {
        const at = randBetween(600, goIn - 700);
        if (at < 600) continue;
        later(() => {
          if (kindRef.current !== 'wait') return;
          set({ kind: 'decoy', color: DECOYS[randInt(DECOYS.length)] });
          later(() => {
            if (kindRef.current === 'decoy') set({ kind: 'wait' });
          }, 380);
        }, at);
      }
    }
    later(() => {
      set({ kind: 'go' });
      goAtRef.current = performance.now();
      requestAnimationFrame((t) => {
        // Time from the frame that actually shows green.
        goAtRef.current = t;
      });
      sound.go();
    }, goIn);
  };

  // Scores and best times also live in refs so a tap always sees the latest.
  const scoresRef = useRef<[number, number]>([0, 0]);
  const bestRef = useRef<[number | null, number | null]>([null, null]);

  const award = (winner: Side, next: RoundState) => {
    clearTimers();
    set(next);
    setCanNext(false);
    const nextScores: [number, number] = [...scoresRef.current];
    nextScores[winner] += 1;
    scoresRef.current = nextScores;
    setScores(nextScores);
    if (nextScores[winner] >= target) {
      sound.win();
      vibrate([80, 50, 80, 50, 200]);
      later(() => onMatchOver({ winner, scores: nextScores, best: bestRef.current }), 1300);
    } else {
      // Short lock so a late, frantic tap can't start the next round.
      later(() => setCanNext(true), 900);
    }
  };

  const tap = (side: Side, e: PointerEvent) => {
    const kind = kindRef.current;
    if (kind === 'wait' || kind === 'decoy') {
      sound.fail();
      vibrate([200, 60, 200]);
      award((1 - side) as Side, { kind: 'foul', fouler: side });
    } else if (kind === 'go') {
      // Pointer timestamps share performance.now()'s clock in modern browsers.
      const at = e.timeStamp > 1 ? e.timeStamp : performance.now();
      const ms = Math.max(1, Math.round(at - goAtRef.current));
      vibrate(40);
      const nextBest: [number | null, number | null] = [...bestRef.current];
      const prev = nextBest[side];
      if (prev === null || ms < prev) nextBest[side] = ms;
      bestRef.current = nextBest;
      award(side, { kind: 'won', winner: side, ms });
    }
  };

  const active = round.kind === 'wait' || round.kind === 'decoy' || round.kind === 'go';

  return (
    <div className="duel">
      <Half side={1} name={names[1]} score={scores[1]} target={target} round={round} onTap={tap} />

      <div className="duel-bar">
        {confirmQuit ? (
          <>
            <button type="button" className="duel-btn" onClick={() => setConfirmQuit(false)} aria-label="Keep playing">
              ↩
            </button>
            <button type="button" className="duel-btn danger" onClick={onQuit} aria-label="Quit the duel">
              Quit
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="duel-btn ghost"
              onClick={() => {
                clearTimers();
                set({ kind: 'idle' });
                setCanNext(true);
                setConfirmQuit(true);
              }}
              aria-label="Pause or quit"
            >
              ✕
            </button>
            <button
              type="button"
              className="duel-btn go"
              onClick={startRound}
              disabled={active || !canNext}
              aria-label={round.kind === 'idle' ? 'Start round' : 'Next round'}
            >
              {active ? '•••' : '▶'}
            </button>
            <span className="duel-btn spacer" aria-hidden />
          </>
        )}
      </div>

      <Half side={0} name={names[0]} score={scores[0]} target={target} round={round} onTap={tap} />
    </div>
  );
}

function Half({
  side,
  name,
  score,
  target,
  round,
  onTap,
}: {
  side: Side;
  name: string;
  score: number;
  target: number;
  round: RoundState;
  onTap: (side: Side, e: PointerEvent) => void;
}) {
  let tone = 'idle';
  let big = 'Ready?';
  let small = 'Tap ▶ in the middle to start';

  switch (round.kind) {
    case 'wait':
      tone = 'wait';
      big = 'Wait…';
      small = 'Tap when it turns green';
      break;
    case 'decoy':
      tone = `decoy-${round.color}`;
      big = 'Wait…';
      small = 'Tap when it turns green';
      break;
    case 'go':
      tone = 'go';
      big = 'TAP!';
      small = '';
      break;
    case 'won':
      if (round.winner === side) {
        tone = 'win';
        big = `${round.ms} ms`;
        small = 'You win the round! 🏆';
      } else {
        tone = 'lose';
        big = 'Too slow';
        small = 'Point to your opponent';
      }
      break;
    case 'foul':
      if (round.fouler === side) {
        tone = 'foul';
        big = 'Too early!';
        small = 'False start. Point to your opponent ❌';
      } else {
        tone = 'win';
        big = '+1';
        small = 'They jumped the gun 😏';
      }
      break;
  }

  return (
    <div
      className={`half ${tone} ${side === 1 ? 'flipped' : ''}`}
      onPointerDown={(e) => onTap(side, e)}
      role="button"
      aria-label={`${name}'s side`}
    >
      <div className="half-top">
        <span className="truncate text-lg font-bold">{name}</span>
        <span className="flex gap-1.5" aria-label={`${score} of ${target}`}>
          {Array.from({ length: target }).map((_, i) => (
            <span key={i} className={`h-3 w-3 rounded-full ${i < score ? 'bg-white' : 'bg-white/25'}`} />
          ))}
        </span>
      </div>
      <div className="half-main">
        <span className="half-big">{big}</span>
        {small && <span className="half-small">{small}</span>}
      </div>
    </div>
  );
}

/* -------------------------------- Champion -------------------------------- */

function ChampionScreen({
  names,
  result,
  pushups,
  onRematch,
  onSetup,
}: {
  names: string[];
  result: MatchResult;
  pushups: number;
  onRematch: () => void;
  onSetup: () => void;
}) {
  useConfetti();
  const loser = (1 - result.winner) as Side;
  const fastest = result.best.filter((b): b is number => b !== null);
  const record = fastest.length ? Math.min(...fastest) : null;
  const recordHolder = record === null ? null : result.best.indexOf(record);

  return (
    <main className="screen gap-6 pb-44">
      <header className="pt-8 text-center">
        <div className="trophy" aria-hidden>
          🏆
        </div>
        <p className="mt-4 text-sm font-bold tracking-[0.25em] text-amber-300/80 uppercase">Duel winner</p>
        <h1 className="pop-in mt-1 text-5xl font-black tracking-tight break-all text-amber-300">
          {names[result.winner]}
        </h1>
        <p className="mt-2 text-2xl font-black text-white/80">
          {result.scores[result.winner]} – {result.scores[loser]}
        </p>
      </header>

      <section className="panel flex flex-col items-center text-center">
        <span className="text-5xl" aria-hidden>
          💪
        </span>
        <p className="mt-3 text-lg text-white/70">
          <b className="text-white">{names[loser]}</b>, drop and give us
        </p>
        <p className="mt-1 text-5xl font-black">{pushups} push-ups</p>
      </section>

      <section className="panel">
        <h2 className="section-title mb-3">Fastest thumbs</h2>
        <ul className="flex flex-col gap-2">
          {([0, 1] as Side[]).map((s) => (
            <li
              key={s}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
                s === recordHolder ? 'bg-emerald-400/15 ring-1 ring-emerald-300/50' : 'bg-white/5'
              }`}
            >
              <span className="flex-1 truncate text-lg font-semibold">{names[s]}</span>
              <span className="font-black text-white/80">
                {result.best[s] === null ? '—' : `${result.best[s]} ms`}
              </span>
              {s === recordHolder && <span aria-label="fastest">⚡</span>}
            </li>
          ))}
        </ul>
      </section>

      <div className="bottom-bar flex flex-col gap-2">
        <button type="button" className="btn-primary w-full" onClick={onRematch}>
          Rematch
        </button>
        <button type="button" className="btn-ghost w-full" onClick={onSetup}>
          Change players or settings
        </button>
      </div>
    </main>
  );
}
