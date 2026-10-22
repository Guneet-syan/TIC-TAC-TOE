import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Flame, RotateCcw, Play, CheckCircle2 } from 'lucide-react';
import { Player, PlayerProfile } from '../types/game';
import { ThemeConfig } from '../utils/themes';

interface VictoryModalProps {
  isOpen: boolean;
  winner: Player;
  winnerProfile: PlayerProfile;
  streakCount: number;
  totalMoves: number;
  durationSeconds: number;
  theme: ThemeConfig;
  onPlayAgain: () => void;
  onStartReplay: () => void;
  onClose: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  winner,
  winnerProfile,
  streakCount,
  totalMoves,
  durationSeconds,
  theme,
  onPlayAgain,
  onStartReplay,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    // Spectacular multi-stage confetti fireworks
    const colors =
      winner === 'X'
        ? ['#f43f5e', '#fb7185', '#fda4af', '#f59e0b', '#fbbf24']
        : ['#06b6d4', '#22d3ee', '#67e8f9', '#3b82f6', '#60a5fa'];

    // Stage 1: Left & Right cannons
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });

    // Stage 2: Center burst after 250ms
    const timer1 = setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors,
      });
    }, 250);

    // Stage 3: Stars and sparkles after 550ms
    const timer2 = setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 120,
        shapes: ['star', 'circle'],
        scalar: 1.2,
        origin: { y: 0.5 },
        colors: ['#ffd700', '#ffffff', ...colors],
      });
    }, 550);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen, winner]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/80 shadow-[0_0_60px_rgba(0,0,0,0.8)] p-6 sm:p-8 text-center"
        >
          {/* Ambient radiant background lighting */}
          <div
            className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none ${
              winner === 'X' ? 'bg-rose-500' : 'bg-cyan-500'
            }`}
          />

          {/* Golden Trophy Emblem */}
          <motion.div
            initial={{ scale: 0, rotate: -25 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.15 }}
            className="relative mx-auto mb-4 w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-xl shadow-amber-500/25 flex items-center justify-center"
          >
            <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-amber-400 animate-pulse" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              className="absolute -inset-1 rounded-2xl border border-dashed border-amber-400/40 pointer-events-none"
            />
          </motion.div>

          {/* Winner Title */}
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs font-bold tracking-widest uppercase text-amber-400 font-mono"
          >
            VICTORY ACHIEVED
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-2xl sm:text-3xl font-black text-white mt-1 mb-2 tracking-tight"
          >
            {winnerProfile.name} Wins!
          </motion.h2>

          <p className="text-sm text-slate-300 max-w-xs mx-auto">
            Dominant tactical play securing the winning sequence.
          </p>

          {/* Match stats snapshot */}
          <div className="grid grid-cols-3 gap-2 my-5 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Total Moves
              </span>
              <span className="text-lg font-bold text-white font-mono tabular-nums">
                {totalMoves}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Duration
              </span>
              <span className="text-lg font-bold text-white font-mono tabular-nums">
                {durationSeconds}s
              </span>
            </div>
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Win Streak
              </span>
              <div className="flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span className="text-lg font-bold text-amber-400 font-mono tabular-nums">
                  {streakCount}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-6">
            <button
              onClick={onPlayAgain}
              className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Next Round</span>
            </button>

            <button
              onClick={onStartReplay}
              className="w-full sm:flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Play className="w-4 h-4 text-cyan-400" />
              <span>Watch Replay</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
