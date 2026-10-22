import React from 'react';
import { Bot, User, Flame, Clock } from 'lucide-react';
import { AIDifficulty, GameMode, GameStats, Player, PlayerProfile } from '../types/game';
import { ThemeConfig } from '../utils/themes';

interface ScoreBoardProps {
  playerX: PlayerProfile;
  playerO: PlayerProfile;
  currentTurn: Player;
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
  stats: GameStats;
  theme: ThemeConfig;
  blitzTimeLeft: number;
  blitzMaxTime: number;
  isGameActive: boolean;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  playerX,
  playerO,
  currentTurn,
  gameMode,
  aiDifficulty,
  stats,
  theme,
  blitzTimeLeft,
  blitzMaxTime,
  isGameActive,
}) => {
  const isXTurn = currentTurn === 'X' && isGameActive;
  const isOTurn = currentTurn === 'O' && isGameActive;

  // Blitz time fraction for circular countdown SVG
  const progressRatio = blitzMaxTime > 0 ? blitzTimeLeft / blitzMaxTime : 1;
  const strokeDashoffset = 100 - progressRatio * 100;
  const isUrgent = blitzTimeLeft <= 3 && gameMode === 'BLITZ' && isGameActive;

  return (
    <div className="w-full max-w-xl mx-auto px-4 pt-3 pb-1">
      <div className="grid grid-cols-3 items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
        {/* Player X Card */}
        <div
          className={`flex flex-col items-center p-2.5 sm:p-3 rounded-xl transition-all duration-300 relative ${
            isXTurn
              ? 'bg-slate-800/90 border border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.25)] scale-[1.02]'
              : 'bg-slate-900/40 border border-transparent opacity-80'
          }`}
        >
          {isXTurn && (
            <span className="absolute -top-2.5 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-rose-500 text-white rounded-full shadow-sm animate-pulse">
              Your Turn
            </span>
          )}

          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-xs sm:text-sm text-slate-100 truncate max-w-[80px] sm:max-w-[110px]">
              {playerX.name}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className={`text-2xl sm:text-3xl font-black font-mono tabular-nums ${theme.xColor}`}>
              {stats.xWins}
            </span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">Wins</span>
          </div>

          {stats.currentStreak.winner === 'X' && stats.currentStreak.count > 1 && (
            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-amber-400">
              <Flame className="w-3 h-3 text-orange-500 fill-orange-500 animate-bounce" />
              <span>{stats.currentStreak.count} Streak</span>
            </div>
          )}
        </div>

        {/* Center: Match Summary / Blitz Timer */}
        <div className="flex flex-col items-center justify-center text-center">
          {gameMode === 'BLITZ' && isGameActive ? (
            <div className="relative flex flex-col items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={isUrgent ? 'text-rose-500' : 'text-amber-400'}
                  strokeDasharray="100, 100"
                  strokeDashoffset={strokeDashoffset}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`font-mono text-sm font-bold tabular-nums ${isUrgent ? 'text-rose-400 animate-ping' : 'text-amber-300'}`}>
                  {blitzTimeLeft}s
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-mono">
                Blitz Timer
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                Draws
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-slate-300 tabular-nums my-0.5">
                {stats.draws}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Match #{stats.gamesPlayed + 1}
              </span>
            </div>
          )}
        </div>

        {/* Player O Card */}
        <div
          className={`flex flex-col items-center p-2.5 sm:p-3 rounded-xl transition-all duration-300 relative ${
            isOTurn
              ? 'bg-slate-800/90 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.25)] scale-[1.02]'
              : 'bg-slate-900/40 border border-transparent opacity-80'
          }`}
        >
          {isOTurn && (
            <span className="absolute -top-2.5 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-cyan-500 text-slate-950 rounded-full shadow-sm animate-pulse">
              {gameMode === 'AI' ? 'AI Thinking' : 'Your Turn'}
            </span>
          )}

          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
              {gameMode === 'AI' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            </div>
            <span className="font-semibold text-xs sm:text-sm text-slate-100 truncate max-w-[80px] sm:max-w-[110px]">
              {gameMode === 'AI'
                ? `AI (${aiDifficulty.charAt(0) + aiDifficulty.slice(1).toLowerCase()})`
                : playerO.name}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className={`text-2xl sm:text-3xl font-black font-mono tabular-nums ${theme.oColor}`}>
              {stats.oWins}
            </span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">Wins</span>
          </div>

          {stats.currentStreak.winner === 'O' && stats.currentStreak.count > 1 && (
            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-amber-400">
              <Flame className="w-3 h-3 text-orange-500 fill-orange-500 animate-bounce" />
              <span>{stats.currentStreak.count} Streak</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
