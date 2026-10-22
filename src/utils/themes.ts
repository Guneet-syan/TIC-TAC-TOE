import { AppThemeId, SymbolTheme } from '../types/game';

export interface ThemeConfig {
  id: AppThemeId;
  name: string;
  tagline: string;
  bgGradient: string;
  boardBg: string;
  boardBorder: string;
  gridLineColor: string;
  cellDefaultBg: string;
  cellHoverBg: string;
  cellBorder: string;
  xColor: string;
  xGlow: string;
  oColor: string;
  oGlow: string;
  accentColor: string;
  winningLineColor: string;
}

export const THEMES: Record<AppThemeId, ThemeConfig> = {
  CYBER: {
    id: 'CYBER',
    name: 'Cyber Neon',
    tagline: 'High-tech neon grid with radiant glow',
    bgGradient: 'bg-radial from-slate-900 via-slate-950 to-black',
    boardBg: 'bg-slate-900/80 backdrop-blur-md',
    boardBorder: 'border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)]',
    gridLineColor: 'border-slate-800/80',
    cellDefaultBg: 'bg-slate-900/60 hover:bg-slate-800/60',
    cellHoverBg: 'hover:border-cyan-500/40',
    cellBorder: 'border-slate-800',
    xColor: 'text-rose-500',
    xGlow: 'drop-shadow-[0_0_15px_rgba(244,63,94,0.7)]',
    oColor: 'text-cyan-400',
    oGlow: 'drop-shadow-[0_0_15px_rgba(6,182,212,0.7)]',
    accentColor: 'cyan',
    winningLineColor: '#06b6d4',
  },
  ROYALE: {
    id: 'ROYALE',
    name: 'Casino Royale',
    tagline: 'Deep velvet felt and polished gold brass',
    bgGradient: 'bg-radial from-[#0d2a1d] via-[#071911] to-[#040e09]',
    boardBg: 'bg-[#082016]/90 backdrop-blur-md',
    boardBorder: 'border-amber-500/40 shadow-[0_0_45px_rgba(234,179,8,0.2)]',
    gridLineColor: 'border-emerald-900/60',
    cellDefaultBg: 'bg-[#0b281d]/80 hover:bg-[#0f3527]/90',
    cellHoverBg: 'hover:border-amber-400/50',
    cellBorder: 'border-emerald-900/70',
    xColor: 'text-amber-400',
    xGlow: 'drop-shadow-[0_0_14px_rgba(251,191,36,0.75)]',
    oColor: 'text-emerald-400',
    oGlow: 'drop-shadow-[0_0_14px_rgba(52,211,153,0.75)]',
    accentColor: 'amber',
    winningLineColor: '#fbbf24',
  },
  NORDIC: {
    id: 'NORDIC',
    name: 'Nordic Slate',
    tagline: 'Architectural minimalism with arctic blue',
    bgGradient: 'bg-radial from-slate-900 via-slate-950 to-slate-950',
    boardBg: 'bg-slate-900/90 backdrop-blur-md',
    boardBorder: 'border-slate-700/60 shadow-[0_0_40px_rgba(148,163,184,0.1)]',
    gridLineColor: 'border-slate-800',
    cellDefaultBg: 'bg-slate-800/40 hover:bg-slate-800/80',
    cellHoverBg: 'hover:border-sky-400/40',
    cellBorder: 'border-slate-800/90',
    xColor: 'text-sky-400',
    xGlow: 'drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]',
    oColor: 'text-indigo-300',
    oGlow: 'drop-shadow-[0_0_12px_rgba(165,180,252,0.6)]',
    accentColor: 'sky',
    winningLineColor: '#38bdf8',
  },
  SYNTHWAVE: {
    id: 'SYNTHWAVE',
    name: 'Retro Sunset',
    tagline: '80s arcade sunset glow and ultraviolet hues',
    bgGradient: 'bg-radial from-[#251034] via-[#14081c] to-[#08020c]',
    boardBg: 'bg-[#1b0c27]/85 backdrop-blur-md',
    boardBorder: 'border-fuchsia-500/40 shadow-[0_0_50px_rgba(217,70,239,0.2)]',
    gridLineColor: 'border-purple-950/80',
    cellDefaultBg: 'bg-[#220d32]/70 hover:bg-[#2e1245]',
    cellHoverBg: 'hover:border-orange-400/50',
    cellBorder: 'border-purple-900/60',
    xColor: 'text-orange-400',
    xGlow: 'drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]',
    oColor: 'text-fuchsia-400',
    oGlow: 'drop-shadow-[0_0_15px_rgba(232,121,249,0.8)]',
    accentColor: 'fuchsia',
    winningLineColor: '#f43f5e',
  },
};

export interface SymbolConfig {
  id: SymbolTheme;
  name: string;
  xLabel: string;
  oLabel: string;
  renderType: 'svg-classic' | 'icon-cyber' | 'icon-medieval' | 'icon-geometric';
}

export const SYMBOL_SETS: Record<SymbolTheme, SymbolConfig> = {
  CLASSIC: {
    id: 'CLASSIC',
    name: 'Classic X & O',
    xLabel: 'X',
    oLabel: 'O',
    renderType: 'svg-classic',
  },
  CYBER: {
    id: 'CYBER',
    name: 'Cyber (⚡ / 🪐)',
    xLabel: '⚡',
    oLabel: '🪐',
    renderType: 'icon-cyber',
  },
  MEDIEVAL: {
    id: 'MEDIEVAL',
    name: 'Battle (⚔️ / 🛡️)',
    xLabel: '⚔️',
    oLabel: '🛡️',
    renderType: 'icon-medieval',
  },
  GEOMETRIC: {
    id: 'GEOMETRIC',
    name: 'Geometric (▲ / ●)',
    xLabel: '▲',
    oLabel: '●',
    renderType: 'icon-geometric',
  },
};
