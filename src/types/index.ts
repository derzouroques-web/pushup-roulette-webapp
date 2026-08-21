export type PocketColor = 'green' | 'red' | 'black';

export type SideBetType = 'none' | 'red' | 'black' | 'odd' | 'even' | 'low' | 'high';

export interface RoulettePocket {
  number: number;
  color: PocketColor;
  angle?: number;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  color: string;
  difficultyMultiplier: number; // e.g. 1.0 (Normal), 0.75 (Beginner), 1.5 (Pro)
  totalPushups: number;
  totalSpins: number;
  completedSpins: number;
  maxSingleSpin: number;
  streak: number;
}

export interface SpinResult {
  id: string;
  timestamp: number;
  playerId: string;
  playerName: string;
  number: number;
  pocketColor: PocketColor;
  pushupsAssigned: number;
  pushupsDone: number;
  status: 'completed' | 'partial' | 'passed';
  wasEliminated: boolean;
  sideBet?: SideBetType;
  sideBetWon?: boolean;
  sideBetMultiplier?: number;
}

export interface GameSettings {
  eliminationMode: boolean; // Remove drawn numbers from wheel pool
  maxRepCap: number; // 0 for uncapped (up to 36), or fixed limit e.g. 20
  multiplier: number; // Global pushup multiplier (1x, 2x, 0.5x)
  defaultRestTime: number; // seconds (e.g. 60)
  soundEnabled: boolean;
  autoAdvanceTurn: boolean;
  zeroPushupBonusRest: boolean; // Special rule: 0 gives 2 mins rest bonus
}

export type GameView = 'game' | 'players' | 'history' | 'stats';
