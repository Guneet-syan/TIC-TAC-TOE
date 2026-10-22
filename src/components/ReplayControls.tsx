import React from 'react';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Play, Pause, X } from 'lucide-react';
import { MoveRecord, GridSize } from '../types/game';
import { getCellCoordinates } from '../utils/gameLogic';

interface ReplayControlsProps {
  currentStep: number;
  totalSteps: number;
  moves: MoveRecord[];
  gridSize: GridSize;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onJumpStart: () => void;
  onJumpEnd: () => void;
  onExitReplay: () => void;
}

export const ReplayControls: React.FC<ReplayControlsProps> = ({
  currentStep,
  totalSteps,
  moves,
  gridSize,
  isPlaying,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onJumpStart,
  onJumpEnd,
  onExitReplay,
}) => {
  const currentMove = currentStep > 0 ? moves[currentStep - 1] : null;
  const coordLabel = currentMove ? getCellCoordinates(currentMove.cellIndex, gridSize).label : 'Game Start';

  return (
    <div className="w-full max-w-lg mx-auto mt-4 px-4">
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-md shadow-xl flex flex-col gap-2.5">
        {/* Step Info */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 font-mono font-bold">
              REPLAY MODE
            </span>
            <span className="text-slate-300 font-medium">
              Step {currentStep} of {totalSteps}
            </span>
          </div>

          <button
            onClick={onExitReplay}
            className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Exit Replay</span>
          </button>
        </div>

        {/* Move annotation */}
        <div className="text-center py-1 bg-slate-950/60 rounded-lg border border-slate-800/80">
          <span className="text-xs font-mono text-slate-300">
            {currentMove ? (
              <>
                <span className={currentMove.player === 'X' ? 'text-rose-400 font-bold' : 'text-cyan-400 font-bold'}>
                  Player {currentMove.player}
                </span>{' '}
                → {coordLabel}
              </>
            ) : (
              'Board is empty. Step forward to review moves.'
            )}
          </span>
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onJumpStart}
            disabled={currentStep === 0}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors"
            title="First Move"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onStepBackward}
            disabled={currentStep === 0}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors"
            title="Previous Move (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
            title={isPlaying ? 'Pause' : 'Auto Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="text-xs">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            onClick={onStepForward}
            disabled={currentStep === totalSteps}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors"
            title="Next Move (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onJumpEnd}
            disabled={currentStep === totalSteps}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors"
            title="Last Move"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
