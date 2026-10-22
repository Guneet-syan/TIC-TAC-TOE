import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, RotateCcw, Play, X } from 'lucide-react';

interface DrawAnimationProps {
  isOpen: boolean;
  totalMoves: number;
  durationSeconds: number;
  onPlayAgain: () => void;
  onStartReplay: () => void;
  onClose: () => void;
}

export const DrawAnimation: React.FC<DrawAnimationProps> = ({
  isOpen,
  totalMoves,
  durationSeconds,
  onPlayAgain,
  onStartReplay,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas particle drift effect (floating ambient ash/embers)
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      alpha: number;
      color: string;
    }> = [];

    const colors = ['#f59e0b', '#fbbf24', '#64748b', '#94a3b8', '#e2e8f0'];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedY: -(Math.random() * 0.8 + 0.3),
        speedX: (Math.random() - 0.5) * 0.6,
        alpha: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < 0) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 15 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
            x: [0, -3, 3, -2, 2, 0],
          }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{
            scale: { type: 'spring', damping: 20, stiffness: 300 },
            x: { duration: 0.45, ease: 'easeInOut' },
          }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-amber-500/30 shadow-[0_0_60px_rgba(245,158,11,0.2)] p-6 sm:p-8 text-center"
        >
          {/* Particle canvas background */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Draw Emblem */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
            className="relative mx-auto mb-4 w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-600 to-slate-700 p-0.5 shadow-xl flex items-center justify-center"
          >
            <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
              <ShieldAlert className="w-10 h-10 text-amber-400 animate-pulse" />
            </div>
          </motion.div>

          <span className="text-xs font-bold tracking-widest uppercase text-amber-400 font-mono">
            TACTICAL STANDOFF
          </span>

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-black text-white mt-1 mb-2 tracking-tight"
          >
            It's a Draw!
          </motion.h2>

          <p className="text-sm text-slate-300 max-w-xs mx-auto">
            A balanced match with zero mistakes. No victor in the arena this round!
          </p>

          {/* Round stats */}
          <div className="grid grid-cols-2 gap-3 my-5 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Total Placements
              </span>
              <span className="text-lg font-bold text-white font-mono tabular-nums">
                {totalMoves} moves
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
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-6">
            <button
              onClick={onPlayAgain}
              className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Rematch</span>
            </button>

            <button
              onClick={onStartReplay}
              className="w-full sm:flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Play className="w-4 h-4 text-amber-400" />
              <span>Analyze Moves</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
