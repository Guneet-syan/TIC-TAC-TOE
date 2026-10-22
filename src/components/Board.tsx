import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BoardGrid, CellValue, GridSize, Player, SymbolTheme, WinningLineInfo } from '../types/game';
import { ThemeConfig } from '../utils/themes';
import { Cell } from './Cell';
import { WinningLine } from './WinningLine';

interface BoardProps {
  board: BoardGrid;
  gridSize: GridSize;
  currentTurn: Player;
  winner: Player | 'DRAW' | null;
  winningLine: WinningLineInfo | null;
  symbolTheme: SymbolTheme;
  theme: ThemeConfig;
  onCellClick: (index: number) => void;
  disabled: boolean;
}

export const Board: React.FC<BoardProps> = ({
  board,
  gridSize,
  currentTurn,
  winner,
  winningLine,
  symbolTheme,
  theme,
  onCellClick,
  disabled,
}) => {
  // 3D tilt coordinates
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8; // Max 4 deg tilt
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const isDraw = winner === 'DRAW';
  const hasWon = winner === 'X' || winner === 'O';

  return (
    <div className="relative w-full max-w-[420px] sm:max-w-[460px] mx-auto p-4 sm:p-6 perspective-1000 select-none">
      {/* Background ambient glow behind board */}
      <div
        className={`absolute inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none transition-colors duration-500 ${
          hasWon ? 'bg-amber-400' : isDraw ? 'bg-slate-600' : 'bg-cyan-500'
        }`}
      />

      {/* Tiltable & Shakable Main Board */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={
          hasWon
            ? {
                scale: [1, 1.04, 1.02],
                rotateX: tilt.y,
                rotateY: tilt.x,
              }
            : isDraw
            ? {
                x: [0, -6, 6, -4, 4, -2, 2, 0],
                transition: { duration: 0.5 },
              }
            : {
                rotateX: tilt.y,
                rotateY: tilt.x,
              }
        }
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        style={{ transformStyle: 'preserve-3d' }}
        className={`relative p-3.5 sm:p-5 rounded-3xl border ${theme.boardBg} ${theme.boardBorder} shadow-2xl transition-all duration-300`}
      >
        {/* Dynamic Grid Layout */}
        <div
          className={`grid gap-2 sm:gap-3.5 ${
            gridSize === 3 ? 'grid-cols-3' : 'grid-cols-4'
          }`}
        >
          {board.map((cellValue, idx) => {
            const isWinningCell = winningLine ? winningLine.combination.includes(idx) : false;

            return (
              <Cell
                key={idx}
                index={idx}
                value={cellValue}
                isWinningCell={isWinningCell}
                isDraw={isDraw}
                disabled={disabled}
                currentTurn={currentTurn}
                symbolTheme={symbolTheme}
                theme={theme}
                onClick={() => onCellClick(idx)}
                gridSize={gridSize}
              />
            );
          })}
        </div>

        {/* Winning laser line overlay */}
        {winningLine && (
          <WinningLine
            winningLine={winningLine}
            gridSize={gridSize}
            strokeColor={theme.winningLineColor}
          />
        )}
      </motion.div>
    </div>
  );
};
