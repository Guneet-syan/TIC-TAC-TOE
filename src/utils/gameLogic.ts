import { BoardGrid, CellValue, GameStats, GridSize, Player, WinningLineInfo } from '../types/game';

// Generate all possible winning line combinations for a 3x3 or 4x4 grid
export function getWinningLines(size: GridSize): WinningLineInfo[] {
  const lines: WinningLineInfo[] = [];

  // Rows
  for (let r = 0; r < size; r++) {
    const combination: number[] = [];
    for (let c = 0; c < size; c++) {
      combination.push(r * size + c);
    }
    lines.push({
      combination,
      type: 'row',
      index: r,
    });
  }

  // Columns
  for (let c = 0; c < size; c++) {
    const combination: number[] = [];
    for (let r = 0; r < size; r++) {
      combination.push(r * size + c);
    }
    lines.push({
      combination,
      type: 'col',
      index: c,
    });
  }

  // Main diagonal (top-left to bottom-right)
  const mainDiag: number[] = [];
  for (let i = 0; i < size; i++) {
    mainDiag.push(i * size + i);
  }
  lines.push({
    combination: mainDiag,
    type: 'diag-main',
    index: 0,
  });

  // Anti diagonal (top-right to bottom-left)
  const antiDiag: number[] = [];
  for (let i = 0; i < size; i++) {
    antiDiag.push(i * size + (size - 1 - i));
  }
  lines.push({
    combination: antiDiag,
    type: 'diag-anti',
    index: 1,
  });

  return lines;
}

// Check game status on board
export function checkGameState(
  board: BoardGrid,
  size: GridSize
): {
  winner: Player | 'DRAW' | null;
  winningLine: WinningLineInfo | null;
} {
  const winLines = getWinningLines(size);

  for (const line of winLines) {
    const firstCell = board[line.combination[0]];
    if (!firstCell) continue;

    let hasWon = true;
    for (let i = 1; i < line.combination.length; i++) {
      if (board[line.combination[i]] !== firstCell) {
        hasWon = false;
        break;
      }
    }

    if (hasWon) {
      return {
        winner: firstCell,
        winningLine: line,
      };
    }
  }

  // Check if all cells filled (draw)
  const isFull = board.every((cell) => cell !== null);
  if (isFull) {
    return {
      winner: 'DRAW',
      winningLine: null,
    };
  }

  return {
    winner: null,
    winningLine: null,
  };
}

// Convert index to human readable format (e.g. Row 2, Col 3)
export function getCellCoordinates(index: number, size: GridSize): { row: number; col: number; label: string } {
  const row = Math.floor(index / size);
  const col = index % size;
  const rowNames = ['Top', 'Center', 'Bottom', 'Fourth'];
  const colNames = ['Left', 'Center', 'Right', 'Far Right'];

  let label = `R${row + 1} C${col + 1}`;
  if (size === 3) {
    label = `${rowNames[row]} ${colNames[col]}`;
  }

  return { row, col, label };
}

// LocalStorage helpers for persistent match statistics
const STATS_STORAGE_KEY = 'ttt_arena_stats_v1';

export function loadGameStats(): GameStats {
  try {
    const stored = localStorage.getItem(STATS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // fallback
  }

  return {
    gamesPlayed: 0,
    xWins: 0,
    oWins: 0,
    draws: 0,
    currentStreak: { winner: null, count: 0 },
    highestStreak: { winner: null, count: 0 },
  };
}

export function saveGameStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // fallback
  }
}

export function updateStatsAfterGame(
  currentStats: GameStats,
  result: Player | 'DRAW'
): GameStats {
  const updated: GameStats = {
    ...currentStats,
    gamesPlayed: currentStats.gamesPlayed + 1,
  };

  if (result === 'X') {
    updated.xWins += 1;
    if (updated.currentStreak.winner === 'X') {
      updated.currentStreak.count += 1;
    } else {
      updated.currentStreak = { winner: 'X', count: 1 };
    }
  } else if (result === 'O') {
    updated.oWins += 1;
    if (updated.currentStreak.winner === 'O') {
      updated.currentStreak.count += 1;
    } else {
      updated.currentStreak = { winner: 'O', count: 1 };
    }
  } else {
    updated.draws += 1;
    // Draw maintains streak or resets? Usually draw freezes or resets streak
    updated.currentStreak = { winner: null, count: 0 };
  }

  if (updated.currentStreak.count > updated.highestStreak.count) {
    updated.highestStreak = { ...updated.currentStreak };
  }

  saveGameStats(updated);
  return updated;
}
