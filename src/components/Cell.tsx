import React from 'react';
import { motion } from 'motion/react';
import { CellValue, Player, SymbolTheme } from '../types/game';
import { SYMBOL_SETS, ThemeConfig } from '../utils/themes';

interface CellProps {
  index: number;
  value: CellValue;
  isWinningCell: boolean;
  isDraw: boolean;
  disabled: boolean;
  currentTurn: Player;
  symbolTheme: SymbolTheme;
  theme: ThemeConfig;
  onClick: () => void;
  gridSize: 3 | 4;
}

export const Cell: React.FC<CellProps> = ({
  index,
  value,
  isWinningCell,
  isDraw,
  disabled,
  currentTurn,
  symbolTheme,
  theme,
  onClick,
  gridSize,
}) => {
  const symbolConfig = SYMBOL_SETS[symbolTheme];

  // Render symbol graphic
  const renderSymbol = (val: Player, isGhost: boolean = false) => {
    const isX = val === 'X';
    const colorClass = isX ? theme.xColor : theme.oColor;
    const glowClass = isX ? theme.xGlow : theme.oGlow;

    if (symbolConfig.renderType === 'svg-classic') {
      if (isX) {
        return (
          <motion.svg
            className={`w-[60%] h-[60%] ${colorClass} ${!isGhost ? glowClass : 'opacity-25'}`}
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="14"
            strokeLinecap="round"
          >
            <motion.line
              x1="20"
              y1="20"
              x2="80"
              y2="80"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            />
            <motion.line
              x1="80"
              y1="20"
              x2="20"
              y2="80"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.22, delay: 0.1, ease: 'easeOut' }}
            />
          </motion.svg>
        );
      } else {
        return (
          <motion.svg
            className={`w-[60%] h-[60%] ${colorClass} ${!isGhost ? glowClass : 'opacity-25'}`}
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="14"
            strokeLinecap="round"
          >
            <motion.circle
              cx="50"
              cy="50"
              r="34"
              initial={{ pathLength: 0, rotate: -90, opacity: 0 }}
              animate={{ pathLength: 1, rotate: 270, opacity: 1 }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
            />
          </motion.svg>
        );
      }
    }

    // Text / Icon based symbol
    const label = isX ? symbolConfig.xLabel : symbolConfig.oLabel;
    return (
      <motion.span
        initial={{ scale: 0, rotate: -20, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
        className={`text-4xl sm:text-5xl font-black select-none ${colorClass} ${!isGhost ? glowClass : 'opacity-25'}`}
      >
        {label}
      </motion.span>
    );
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || value !== null}
      whileHover={!disabled && value === null ? { scale: 1.03 } : {}}
      whileTap={!disabled && value === null ? { scale: 0.95 } : {}}
      className={`group relative flex items-center justify-center rounded-2xl border transition-all duration-200 aspect-square select-none outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
        gridSize === 3 ? 'min-h-[90px] sm:min-h-[115px]' : 'min-h-[70px] sm:min-h-[85px]'
      } ${
        isWinningCell
          ? 'bg-amber-400/20 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.6)] z-10 scale-[1.05] animate-pulse ring-2 ring-amber-400'
          : isDraw
          ? 'bg-slate-800/30 border-slate-700/40 opacity-70 grayscale-[50%]'
          : `${theme.cellDefaultBg} ${theme.cellBorder} ${theme.cellHoverBg}`
      }`}
      aria-label={`Cell ${index + 1}, currently ${value || 'empty'}`}
    >
      {/* Keyboard hotkey hint in top-right for 3x3 */}
      {gridSize === 3 && value === null && !disabled && (
        <span className="absolute top-1.5 right-2 text-[10px] font-mono text-slate-400/30 group-hover:text-slate-300 transition-colors pointer-events-none">
          {index + 1}
        </span>
      )}

      {/* Render placed symbol */}
      {value && renderSymbol(value)}

      {/* Ghost hover preview */}
      {value === null && !disabled && (
        <div className="hidden group-hover:flex items-center justify-center w-full h-full pointer-events-none transition-opacity">
          {renderSymbol(currentTurn, true)}
        </div>
      )}
    </motion.button>
  );
};
