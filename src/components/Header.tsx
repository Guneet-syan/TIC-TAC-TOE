import React from 'react';
import { Volume2, VolumeX, Palette, RotateCcw, BarChart2, BookOpen, Settings2 } from 'lucide-react';
import { GameMode } from '../types/game';

interface HeaderProps {
  gameMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetGame: () => void;
  onOpenThemeMenu: () => void;
  onOpenStats: () => void;
  onOpenRules: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  gameMode,
  onSelectMode,
  isMuted,
  onToggleMute,
  onResetGame,
  onOpenThemeMenu,
  onOpenStats,
  onOpenRules,
  onOpenSettings,
}) => {
  return (
    <header className="w-full max-w-5xl mx-auto flex items-center justify-between gap-4 md:gap-8 px-4 py-3.5 border-b border-slate-800/80 backdrop-blur-md">
      {/* Zone 1: Wordmark in characterful display face */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-rose-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <span className="font-black text-black text-lg select-none">#</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-white whitespace-nowrap">
            Tic-Tac-Toe Arena
          </h1>
          <span className="hidden sm:inline text-xs text-slate-400 font-mono tracking-wider">
            CHAMPIONSHIP EDITION
          </span>
        </div>
      </div>

      {/* Zone 2: Interactive Mode Tabs (Segmented functional controls) */}
      <nav className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto">
        <button
          onClick={() => onSelectMode('AI')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            gameMode === 'AI'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Play against smart AI"
        >
          vs AI Bot
        </button>
        <button
          onClick={() => onSelectMode('PVP')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            gameMode === 'PVP'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Local pass-and-play duel"
        >
          Pass & Play
        </button>
        <button
          onClick={() => onSelectMode('BLITZ')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            gameMode === 'BLITZ'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Rapid-fire turn countdowns"
        >
          ⚡ Blitz Duel
        </button>
      </nav>

      {/* Zone 3: Functional tool actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={onToggleMute}
          className="p-2 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
          title={isMuted ? 'Unmute sound (M)' : 'Mute sound (M)'}
          aria-label="Toggle Sound"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        <button
          onClick={onOpenThemeMenu}
          className="p-2 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
          title="Themes & Styles"
          aria-label="Themes"
        >
          <Palette className="w-4 h-4 text-purple-400" />
        </button>

        <button
          onClick={onOpenStats}
          className="p-2 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
          title="Match Statistics"
          aria-label="Statistics"
        >
          <BarChart2 className="w-4 h-4 text-emerald-400" />
        </button>

        <button
          onClick={onOpenRules}
          className="p-2 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
          title="How to Play & Shortcuts"
          aria-label="Rules"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
          title="Settings & Grid Size"
          aria-label="Settings"
        >
          <Settings2 className="w-4 h-4 text-slate-300" />
        </button>

        <button
          onClick={onResetGame}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 rounded-lg transition-colors"
          title="Reset board (Space)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Game</span>
        </button>
      </div>
    </header>
  );
};
