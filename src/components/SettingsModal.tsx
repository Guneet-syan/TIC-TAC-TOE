import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, VolumeX, Grid, Cpu, Clock, Palette, Sparkles } from 'lucide-react';
import { AIDifficulty, AppThemeId, GridSize, SymbolTheme } from '../types/game';
import { SYMBOL_SETS, THEMES } from '../utils/themes';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gridSize: GridSize;
  onSelectGridSize: (size: GridSize) => void;
  aiDifficulty: AIDifficulty;
  onSelectAIDifficulty: (diff: AIDifficulty) => void;
  blitzMaxTime: number;
  onSelectBlitzTime: (seconds: number) => void;
  themeId: AppThemeId;
  onSelectTheme: (id: AppThemeId) => void;
  symbolTheme: SymbolTheme;
  onSelectSymbolTheme: (st: SymbolTheme) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
  player1Name: string;
  onChangePlayer1Name: (name: string) => void;
  player2Name: string;
  onChangePlayer2Name: (name: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  gridSize,
  onSelectGridSize,
  aiDifficulty,
  onSelectAIDifficulty,
  blitzMaxTime,
  onSelectBlitzTime,
  themeId,
  onSelectTheme,
  symbolTheme,
  onSelectSymbolTheme,
  isMuted,
  onToggleMute,
  volume,
  onChangeVolume,
  player1Name,
  onChangePlayer1Name,
  player2Name,
  onChangePlayer2Name,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-5 sm:p-7 text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Grid className="w-4 h-4" />
              </span>
              Arena Configurations
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 pt-5">
            {/* 1. Grid Size */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Grid Dimension
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => onSelectGridSize(3)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    gridSize === 3
                      ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="block font-bold text-sm">3x3 Classic</span>
                  <span className="text-xs text-slate-400">3 in a row to win</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectGridSize(4)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    gridSize === 4
                      ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="block font-bold text-sm">4x4 Extended</span>
                  <span className="text-xs text-slate-400">4 in a row to win</span>
                </button>
              </div>
            </div>

            {/* 2. AI Difficulty */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                AI Opponent Engine
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['EASY', 'MEDIUM', 'IMPOSSIBLE'] as AIDifficulty[]).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => onSelectAIDifficulty(diff)}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                      aiDifficulty === diff
                        ? 'border-cyan-500 bg-cyan-500/15 text-white font-bold'
                        : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200 text-xs'
                    }`}
                  >
                    <span className="block capitalize">{diff.toLowerCase()}</span>
                    <span className="text-[10px] text-slate-400">
                      {diff === 'EASY' ? 'Casual' : diff === 'MEDIUM' ? 'Tactical' : 'Minimax'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Blitz Countdown Timer */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Blitz Turn Countdown
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '5 Sec', val: 5 },
                  { label: '10 Sec', val: 10 },
                  { label: '15 Sec', val: 15 },
                  { label: 'Off', val: 0 },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => onSelectBlitzTime(item.val)}
                    className={`py-2 px-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                      blitzMaxTime === item.val
                        ? 'border-amber-400 bg-amber-400/15 text-amber-300'
                        : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Visual Themes */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                Visual Palette
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {Object.values(THEMES).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onSelectTheme(t.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      themeId === t.id
                        ? 'border-cyan-400 bg-cyan-500/15 text-white'
                        : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-xs block">{t.name}</span>
                    <span className="text-[11px] text-slate-400 truncate block">{t.tagline}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Symbol Style */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                Symbol Set
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {Object.values(SYMBOL_SETS).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onSelectSymbolTheme(s.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      symbolTheme === s.id
                        ? 'border-rose-400 bg-rose-500/15 text-white'
                        : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-xs block">{s.name}</span>
                    <span className="text-sm font-black text-rose-400 mt-0.5 block">
                      {s.xLabel} vs {s.oLabel}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Sound & Volume */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                  Sound Synthesizer
                </label>
                <button
                  type="button"
                  onClick={onToggleMute}
                  className="text-xs font-semibold text-cyan-400 hover:underline"
                >
                  {isMuted ? 'Turn Sound On' : 'Mute Audio'}
                </button>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* 7. Player Names */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Player Identifiers
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-rose-400 font-semibold block mb-1">
                    Player 1 (X)
                  </span>
                  <input
                    type="text"
                    maxLength={16}
                    value={player1Name}
                    onChange={(e) => onChangePlayer1Name(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-cyan-400 font-semibold block mb-1">
                    Player 2 (O)
                  </span>
                  <input
                    type="text"
                    maxLength={16}
                    value={player2Name}
                    onChange={(e) => onChangePlayer2Name(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-800">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg transition-colors"
            >
              Apply & Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
