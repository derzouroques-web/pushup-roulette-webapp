import type { RoulettePocket, GameSettings } from '../types';

export const RED_NUMBERS = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
]);

export const EUROPEAN_WHEEL_SEQUENCE = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

export const ROULETTE_POCKETS: RoulettePocket[] = EUROPEAN_WHEEL_SEQUENCE.map(num => ({
  number: num,
  color: num === 0 ? 'green' : RED_NUMBERS.has(num) ? 'red' : 'black'
}));

export const DEFAULT_AVATARS = [
  '💪', '⚡', '🏋️‍♂️', '🔥', '👑', '🐺', '🦁', '🏆', '🎯', '🚀', '🥊', '🛡️'
];

export const PLAYER_COLORS = [
  '#f59e0b', // Amber / Gold
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
];

export const DEFAULT_SETTINGS: GameSettings = {
  eliminationMode: true,
  maxRepCap: 0,
  multiplier: 1,
  defaultRestTime: 60,
  soundEnabled: true,
  autoAdvanceTurn: true,
  zeroPushupBonusRest: true,
  halfBoardMode: 'none',
};

export const getHalfBoardEliminatedSet = (mode: 'low' | 'random' | 'odd' | 'even'): Set<number> => {
  const eliminated = new Set<number>();
  if (mode === 'low') {
    // Keep 1..18, eliminate 19..36
    for (let i = 19; i <= 36; i++) eliminated.add(i);
  } else if (mode === 'odd') {
    // Keep odd (1, 3.. 35), eliminate even (2, 4.. 36)
    for (let i = 2; i <= 36; i += 2) eliminated.add(i);
  } else if (mode === 'even') {
    // Keep even (2, 4.. 36), eliminate odd (1, 3.. 35)
    for (let i = 1; i <= 35; i += 2) eliminated.add(i);
  } else if (mode === 'random') {
    // Randomly eliminate 18 numbers from 1..36
    const numbers = Array.from({ length: 36 }, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    numbers.slice(0, 18).forEach(n => eliminated.add(n));
  }
  return eliminated;
};

