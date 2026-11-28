import type { ReactNode } from 'react';
import { PUSHUP_OPTIONS } from './utils';

export function BackLink() {
  return (
    <a
      href="/"
      className="-mb-4 inline-flex h-10 items-center gap-1 self-start rounded-full bg-white/10 px-4 text-sm font-semibold text-white/70 active:bg-white/20"
    >
      ← All games
    </a>
  );
}

export function GameHeader({ emoji, title, tagline }: { emoji: string; title: string; tagline: string }) {
  return (
    <header className="text-center">
      <div className="text-6xl" aria-hidden>
        {emoji}
      </div>
      <h1 className="mt-2 text-4xl font-black tracking-tight">{title}</h1>
      <p className="mt-1 text-base text-white/60">{tagline}</p>
    </header>
  );
}

/** Editable list of player names. */
export function PlayerList({
  players,
  min,
  max,
  onChange,
  badge,
  labels,
}: {
  players: string[];
  min: number;
  max: number;
  onChange: (players: string[], removedIndex?: number) => void;
  /** Optional chip shown after a name (e.g. a score). */
  badge?: (i: number) => ReactNode;
  /** Optional label instead of the number, e.g. "Top" / "Bottom". */
  labels?: string[];
}) {
  return (
    <>
      <ul className="flex flex-col gap-2">
        {players.map((p, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="flex h-11 min-w-11 shrink-0 items-center justify-center rounded-full bg-white/10 px-2 text-sm font-bold">
              {labels?.[i] ?? i + 1}
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
              onChange={(e) => onChange(players.map((x, j) => (j === i ? e.target.value : x)))}
            />
            {badge?.(i)}
            {max > min && (
              <button
                type="button"
                className="icon-btn"
                onClick={() => onChange(players.filter((_, j) => j !== i), i)}
                disabled={players.length <= min}
                aria-label={`Remove player ${i + 1}`}
              >
                ✕
              </button>
            )}
          </li>
        ))}
      </ul>
      {players.length < max && (
        <button
          type="button"
          className="btn-ghost mt-3 w-full"
          onClick={() => onChange([...players, `Player ${players.length + 1}`])}
        >
          + Add player
        </button>
      )}
    </>
  );
}

/** Segmented picker for the loser's push-up penalty. */
export function PushupPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <h2 className="section-title mb-1">Loser does</h2>
      <p className="mb-3 text-sm text-white/50">Push-ups for whoever loses the round 💪</p>
      <div className="segmented">
        {PUSHUP_OPTIONS.map((n) => (
          <button
            key={n}
            type="button"
            className={value === n ? 'active' : ''}
            aria-pressed={value === n}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ToggleRow({
  title,
  subtitle,
  checked,
  onChange,
}: {
  title: string;
  subtitle: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-white/50">{subtitle}</span>
      </span>
      <input
        type="checkbox"
        className="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

export function Rules({ open, onToggle, children }: { open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <section className="panel">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        onClick={onToggle}
        aria-expanded={open}
      >
        <h2 className="section-title">How to play</h2>
        <span className="text-white/60">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-[15px] leading-snug text-white/80">
          {children}
        </ol>
      )}
    </section>
  );
}
