import { BoardGrid, CellValue, GridSize, Player } from '../types/game';
import { checkGameState, getWinningLines } from './gameLogic';

// Get all currently empty cell indices
export function getAvailableMoves(board: BoardGrid): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
}

// Find immediate winning move for a given player if exists
function findWinningMove(board: BoardGrid, size: GridSize, player: Player): number | null {
  const winLines = getWinningLines(size);
  const targetCount = size - 1;

  for (const line of winLines) {
    let playerCount = 0;
    let emptyIndex: number | null = null;
    let otherCount = 0;

    for (const idx of line.combination) {
      if (board[idx] === player) {
        playerCount++;
      } else if (board[idx] === null) {
        emptyIndex = idx;
      } else {
        otherCount++;
      }
    }

    if (playerCount === targetCount && otherCount === 0 && emptyIndex !== null) {
      return emptyIndex;
    }
  }

  return null;
}

// Minimax evaluation for 3x3 (Optimal & Unbeatable)
function minimax3x3(
  board: BoardGrid,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player,
  alpha: number,
  beta: number
): { score: number; move?: number } {
  const state = checkGameState(board, 3);

  if (state.winner === aiPlayer) {
    return { score: 10 - depth };
  }
  if (state.winner === humanPlayer) {
    return { score: depth - 10 };
  }
  if (state.winner === 'DRAW') {
    return { score: 0 };
  }

  const availableMoves = getAvailableMoves(board);

  if (isMaximizing) {
    let maxScore = -Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = aiPlayer;
      const result = minimax3x3(board, depth + 1, false, aiPlayer, humanPlayer, alpha, beta);
      board[move] = null;

      if (result.score > maxScore) {
        maxScore = result.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, maxScore);
      if (beta <= alpha) break;
    }

    return { score: maxScore, move: bestMove };
  } else {
    let minScore = Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = humanPlayer;
      const result = minimax3x3(board, depth + 1, true, aiPlayer, humanPlayer, alpha, beta);
      board[move] = null;

      if (result.score < minScore) {
        minScore = result.score;
        bestMove = move;
      }
      beta = Math.min(beta, minScore);
      if (beta <= alpha) break;
    }

    return { score: minScore, move: bestMove };
  }
}

// Heuristic score for 4x4
function evaluate4x4Heuristic(board: BoardGrid, aiPlayer: Player, humanPlayer: Player): number {
  const winLines = getWinningLines(4);
  let totalScore = 0;

  for (const line of winLines) {
    let aiCount = 0;
    let humanCount = 0;

    for (const idx of line.combination) {
      if (board[idx] === aiPlayer) aiCount++;
      if (board[idx] === humanPlayer) humanCount++;
    }

    if (aiCount > 0 && humanCount > 0) {
      // Line is blocked for both
      continue;
    }
    if (aiCount === 4) return 1000;
    if (humanCount === 4) return -1000;

    if (aiCount === 3) totalScore += 50;
    else if (aiCount === 2) totalScore += 10;
    else if (aiCount === 1) totalScore += 1;

    if (humanCount === 3) totalScore -= 50;
    else if (humanCount === 2) totalScore -= 10;
    else if (humanCount === 1) totalScore -= 1;
  }

  return totalScore;
}

// Minimax with depth limit for 4x4
function minimax4x4(
  board: BoardGrid,
  depth: number,
  maxDepth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player,
  alpha: number,
  beta: number
): { score: number; move?: number } {
  const state = checkGameState(board, 4);

  if (state.winner === aiPlayer) return { score: 1000 - depth };
  if (state.winner === humanPlayer) return { score: depth - 1000 };
  if (state.winner === 'DRAW') return { score: 0 };
  if (depth >= maxDepth) {
    return { score: evaluate4x4Heuristic(board, aiPlayer, humanPlayer) };
  }

  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return { score: 0 };

  if (isMaximizing) {
    let maxScore = -Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = aiPlayer;
      const result = minimax4x4(board, depth + 1, maxDepth, false, aiPlayer, humanPlayer, alpha, beta);
      board[move] = null;

      if (result.score > maxScore) {
        maxScore = result.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, maxScore);
      if (beta <= alpha) break;
    }
    return { score: maxScore, move: bestMove };
  } else {
    let minScore = Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = humanPlayer;
      const result = minimax4x4(board, depth + 1, maxDepth, true, aiPlayer, humanPlayer, alpha, beta);
      board[move] = null;

      if (result.score < minScore) {
        minScore = result.score;
        bestMove = move;
      }
      beta = Math.min(beta, minScore);
      if (beta <= alpha) break;
    }
    return { score: minScore, move: bestMove };
  }
}

// Main AI move selection API
export function getAIMove(
  board: BoardGrid,
  size: GridSize,
  difficulty: 'EASY' | 'MEDIUM' | 'IMPOSSIBLE',
  aiPlayer: Player = 'O'
): number {
  const humanPlayer: Player = aiPlayer === 'X' ? 'O' : 'X';
  const availableMoves = getAvailableMoves(board);

  if (availableMoves.length === 0) return 0;
  if (availableMoves.length === board.length) {
    // If starting on empty board, pick center or corner
    if (size === 3) {
      const preferred = [4, 0, 2, 6, 8];
      return preferred[Math.floor(Math.random() * preferred.length)];
    } else {
      const center4x4 = [5, 6, 9, 10];
      return center4x4[Math.floor(Math.random() * center4x4.length)];
    }
  }

  // 1. Easy Mode: Mostly random with occasional block
  if (difficulty === 'EASY') {
    if (Math.random() < 0.3) {
      // 30% chance to take an immediate winning move if present
      const winMove = findWinningMove(board, size, aiPlayer);
      if (winMove !== null) return winMove;
    }
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }

  // 2. Medium Mode: Smart tactical play
  if (difficulty === 'MEDIUM') {
    // Always take immediate win if available
    const winMove = findWinningMove(board, size, aiPlayer);
    if (winMove !== null) return winMove;

    // Block opponent's winning move with 85% probability
    if (Math.random() < 0.85) {
      const blockMove = findWinningMove(board, size, humanPlayer);
      if (blockMove !== null) return blockMove;
    }

    // Try center
    if (size === 3 && board[4] === null && Math.random() < 0.7) {
      return 4;
    }

    // Otherwise choose random smart move
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }

  // 3. Impossible Mode: Unbeatable Minimax
  const boardCopy = [...board];
  if (size === 3) {
    const result = minimax3x3(boardCopy, 0, true, aiPlayer, humanPlayer, -Infinity, Infinity);
    return result.move !== undefined ? result.move : availableMoves[0];
  } else {
    // 4x4 with depth limit 3 or 4 for responsiveness
    // Check immediate win/block first
    const winMove = findWinningMove(board, size, aiPlayer);
    if (winMove !== null) return winMove;

    const blockMove = findWinningMove(board, size, humanPlayer);
    if (blockMove !== null) return blockMove;

    const result = minimax4x4(boardCopy, 0, 3, true, aiPlayer, humanPlayer, -Infinity, Infinity);
    return result.move !== undefined ? result.move : availableMoves[0];
  }
}
