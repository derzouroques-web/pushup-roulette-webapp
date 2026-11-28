/** Helpers shared by the pass-the-phone party games. */

export function randInt(max: number) {
  if (max <= 0) return 0;
  if (window.crypto?.getRandomValues) {
    const buf = new Uint32Array(1);
    window.crypto.getRandomValues(buf);
    return buf[0] % max;
  }
  return Math.floor(Math.random() * max);
}

/** Random float in [min, max). */
export function randBetween(min: number, max: number) {
  return min + (randInt(1_000_000) / 1_000_000) * (max - min);
}

export function vibrate(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* ignore */
  }
}

export function loadJSON<T>(key: string): Partial<T> | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Partial<T>) : null;
  } catch {
    return null;
  }
}

export function saveJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode): the game still works */
  }
}

/** Cleans a stored list of player names, falling back when it is unusable. */
export function cleanPlayers(value: unknown, min: number, max: number, fallback: string[]) {
  if (!Array.isArray(value) || value.length < min) return fallback;
  return value.slice(0, max).map((v) => String(v).slice(0, 16));
}

/** Push-up penalties offered by every game. */
export const PUSHUP_OPTIONS = [5, 10, 15, 20] as const;

export function cleanPushups(value: unknown, fallback = 10) {
  return PUSHUP_OPTIONS.includes(value as (typeof PUSHUP_OPTIONS)[number])
    ? (value as number)
    : fallback;
}

/* --------------------------------- Sounds --------------------------------- */
// Tiny Web Audio synth: no audio files to download. The context must be
// unlocked from a tap (iOS), so call `unlock()` from a click handler.

let ctx: AudioContext | null = null;
let muted = false;

export function setMuted(value: boolean) {
  muted = value;
}

function audio(): AudioContext | null {
  if (muted) return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType, volume: number, endFreq?: number) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(a.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

export const sound = {
  unlock() {
    audio();
  },
  tick(pitch = 1) {
    tone(700 * pitch, 0.05, 'square', 0.08, 300 * pitch);
  },
  pass() {
    tone(500, 0.08, 'triangle', 0.15, 900);
  },
  go() {
    tone(880, 0.18, 'square', 0.12);
  },
  fail() {
    tone(220, 0.35, 'sawtooth', 0.15, 90);
  },
  win() {
    [523, 659, 784, 1047].forEach((f, i) => window.setTimeout(() => tone(f, 0.18, 'triangle', 0.15), i * 110));
  },
  boom() {
    const a = audio();
    if (!a) return;
    const t = a.currentTime;
    const length = Math.floor(a.sampleRate * 1.4);
    const buffer = a.createBuffer(1, length, a.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
    }
    const src = a.createBufferSource();
    src.buffer = buffer;
    const filter = a.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000, t);
    filter.frequency.exponentialRampToValueAtTime(60, t + 1.2);
    const gain = a.createGain();
    gain.gain.setValueAtTime(0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
    src.connect(filter).connect(gain).connect(a.destination);
    src.start(t);
    tone(120, 0.6, 'sine', 0.6, 40);
  },
};
