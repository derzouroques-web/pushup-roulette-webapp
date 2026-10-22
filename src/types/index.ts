export type PocketColor = 'green' | 'red' | 'black';

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
}

export type HalfBoardMode = 'none' | 'low' | 'random' | 'odd' | 'even';

export interface GameSettings {
  eliminationMode: boolean; // Remove drawn numbers from wheel pool
  maxRepCap: number; // 0 for uncapped (up to 36), or fixed limit e.g. 20
  targetRepsGoal: number; // Total pushups per player for the session
  defaultRestTime: number; // seconds (e.g. 60)
  soundEnabled: boolean;
  autoAdvanceTurn: boolean;
  zeroPushupBonusRest: boolean; // Special rule: 0 gives 2 mins rest bonus
}

export type GameView = 'game' | 'players' | 'history' | 'stats';
