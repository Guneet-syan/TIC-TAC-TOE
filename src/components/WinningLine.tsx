import React from 'react';
import { motion } from 'motion/react';
import { GridSize, WinningLineInfo } from '../types/game';

interface WinningLineProps {
  winningLine: WinningLineInfo;
  gridSize: GridSize;
  strokeColor: string;
}

export const WinningLine: React.FC<WinningLineProps> = ({
  winningLine,
  gridSize,
  strokeColor,
}) => {
  const { type, index } = winningLine;

  let x1 = 0;
  let y1 = 0;
  let x2 = 0;
  let y2 = 0;

  if (type === 'row') {
    const yPct = ((index + 0.5) / gridSize) * 100;
    x1 = 4;
    y1 = yPct;
    x2 = 96;
    y2 = yPct;
  } else if (type === 'col') {
    const xPct = ((index + 0.5) / gridSize) * 100;
    x1 = xPct;
    y1 = 4;
    x2 = xPct;
    y2 = 96;
  } else if (type === 'diag-main') {
    x1 = 6;
    y1 = 6;
    x2 = 94;
    y2 = 94;
  } else if (type === 'diag-anti') {
    x1 = 94;
    y1 = 6;
    x2 = 6;
    y2 = 94;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer wide neon glow */}
        <motion.line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={strokeColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeOpacity="0.5"
          filter="url(#neon-glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />

        {/* Crisp intense laser core */}
        <motion.line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </svg>
    </div>
  );
};
