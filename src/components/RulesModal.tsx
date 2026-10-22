import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Keyboard, Zap, Grid, Trophy } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <BookOpen className="w-4 h-4" />
              </span>
              Arena Rules & Keyboard Controls
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5 pt-5 text-sm text-slate-300">
            {/* Rule 1: Grid Dimensions */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
                <Grid className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Winning Formations</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  <strong className="text-cyan-300">3x3 Classic:</strong> Form 3 identical symbols along any row, column, or diagonal.
                  <br />
                  <strong className="text-cyan-300">4x4 Extended:</strong> Form 4 unbroken symbols along any row, column, or diagonal.
                </p>
              </div>
            </div>

            {/* Rule 2: Blitz Mode */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Blitz Duel Timer</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  In Blitz Mode, players must commit their move before the countdown expires. When the clock hits zero, turn immediately passes to the opponent!
                </p>
              </div>
            </div>

            {/* Rule 3: AI Bot Difficulty */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 shrink-0 mt-0.5">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">AI Engine Modes</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  <strong>Novice:</strong> Casual play with frequent openings.
                  <br />
                  <strong>Tactician:</strong> Spots and defends direct threats.
                  <br />
                  <strong>Mastermind:</strong> Unbeatable Minimax game-tree calculation with alpha-beta pruning.
                </p>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="pt-3 border-t border-slate-800">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <Keyboard className="w-4 h-4 text-cyan-400" />
                Keyboard Shortcuts
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Claim Cell</span>
                  <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded font-mono text-cyan-300 font-bold">
                    1 - 9
                  </kbd>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Restart Game</span>
                  <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded font-mono text-cyan-300 font-bold">
                    Space
                  </kbd>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Mute Audio</span>
                  <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded font-mono text-cyan-300 font-bold">
                    M
                  </kbd>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Watch Replay</span>
                  <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded font-mono text-cyan-300 font-bold">
                    R
                  </kbd>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-800">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
