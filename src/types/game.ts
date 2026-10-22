export type Player = 'X' | 'O';
export type CellValue = Player | null;

export type BoardGrid = CellValue[];

export type GameMode = 'AI' | 'PVP' | 'BLITZ';
export type AIDifficulty = 'EASY' | 'MEDIUM' | 'IMPOSSIBLE';
export type GridSize = 3 | 4;

export type SymbolTheme = 'CLASSIC' | 'CYBER' | 'MEDIEVAL' | 'GEOMETRIC';
export type AppThemeId = 'CYBER' | 'ROYALE' | 'NORDIC' | 'SYNTHWAVE';

export interface WinningLineInfo {
  combination: number[];
  type: 'row' | 'col' | 'diag-main' | 'diag-anti';
  index: number; // 0, 1, 2... index of row or col
}

export interface MoveRecord {
  player: Player;
  cellIndex: number;
  row: number;
  col: number;
  timestamp: number;
}

export interface GameStats {
  gamesPlayed: number;
  xWins: number;
  oWins: number;
  draws: number;
  currentStreak: {
    winner: Player | null;
    count: number;
  };
  highestStreak: {
    winner: Player | null;
    count: number;
  };
}

export interface PlayerProfile {
  name: string;
  symbol: Player;
  avatarColor: string;
}
