import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Flame, RotateCcw, Play, Trash2 } from 'lucide-react';
import { GameStats, GridSize, MoveRecord } from '../types/game';
import { getCellCoordinates } from '../utils/gameLogic';

interface MatchHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onResetStats: () => void;
  moves: MoveRecord[];
  gridSize: GridSize;
  onStartReplay: () => void;
}

export const MatchHistoryModal: React.FC<MatchHistoryModalProps> = ({
  isOpen,
  onClose,
  stats,
  onResetStats,
  moves,
  gridSize,
  onStartReplay,
}) => {
  if (!isOpen) return null;

  const total = stats.gamesPlayed || 1;
  const xPercent = Math.round((stats.xWins / total) * 100);
  const oPercent = Math.round((stats.oWins / total) * 100);
  const drawPercent = Math.round((stats.draws / total) * 100);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-5 sm:p-7 text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Trophy className="w-4 h-4" />
              </span>
              Career & Match Analytics
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 pt-5">
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Total
                </span>
                <span className="text-xl font-bold text-white font-mono tabular-nums">
                  {stats.gamesPlayed}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                <span className="text-[10px] text-rose-400 uppercase tracking-wider block">
                  X Wins
                </span>
                <span className="text-xl font-bold text-rose-400 font-mono tabular-nums">
                  {stats.xWins}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                <span className="text-[10px] text-cyan-400 uppercase tracking-wider block">
                  O Wins
                </span>
                <span className="text-xl font-bold text-cyan-400 font-mono tabular-nums">
                  {stats.oWins}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                <span className="text-[10px] text-amber-400 uppercase tracking-wider block">
                  Draws
                </span>
                <span className="text-xl font-bold text-amber-400 font-mono tabular-nums">
                  {stats.draws}
                </span>
              </div>
            </div>

            {/* Streak & Rate Breakdown */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  Highest Win Streak
                </span>
                <span className="font-mono font-bold text-amber-400">
                  {stats.highestStreak.count > 0
                    ? `${stats.highestStreak.count} Wins (${stats.highestStreak.winner})`
                    : 'None yet'}
                </span>
              </div>

              {/* Visual Win Rate Bar */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-mono">
                  <span>X: {stats.gamesPlayed > 0 ? `${xPercent}%` : '0%'}</span>
                  <span>Draw: {stats.gamesPlayed > 0 ? `${drawPercent}%` : '0%'}</span>
                  <span>O: {stats.gamesPlayed > 0 ? `${oPercent}%` : '0%'}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden flex">
                  <div style={{ width: `${xPercent}%` }} className="bg-rose-500 h-full" />
                  <div style={{ width: `${drawPercent}%` }} className="bg-amber-400 h-full" />
                  <div style={{ width: `${oPercent}%` }} className="bg-cyan-500 h-full" />
                </div>
              </div>
            </div>

            {/* Current / Last Round Move Log */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Recent Match Moves ({moves.length})
                </span>
                {moves.length > 0 && (
                  <button
                    onClick={() => {
                      onClose();
                      onStartReplay();
                    }}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    <Play className="w-3 h-3" />
                    <span>Watch Replay</span>
                  </button>
                )}
              </div>

              {moves.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800">
                  No moves recorded in current round. Make a move on the board to start tracking.
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto rounded-xl bg-slate-950/60 border border-slate-800 divide-y divide-slate-800/80">
                  {moves.map((m, idx) => {
                    const coord = getCellCoordinates(m.cellIndex, gridSize);
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-3.5 py-2 text-xs font-mono"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 w-5">#{idx + 1}</span>
                          <span
                            className={
                              m.player === 'X'
                                ? 'text-rose-400 font-bold'
                                : 'text-cyan-400 font-bold'
                            }
                          >
                            Player {m.player}
                          </span>
                        </div>
                        <span className="text-slate-300">{coord.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer Reset & Close */}
          <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-800">
            <button
              onClick={onResetStats}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Career Records</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
