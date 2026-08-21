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
};
