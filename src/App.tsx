import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { ScoreBoard } from './components/ScoreBoard';
import { Board } from './components/Board';
import { VictoryModal } from './components/VictoryModal';
import { DrawAnimation } from './components/DrawAnimation';
import { ReplayControls } from './components/ReplayControls';
import { SettingsModal } from './components/SettingsModal';
import { MatchHistoryModal } from './components/MatchHistoryModal';
import { RulesModal } from './components/RulesModal';
import {
  AIDifficulty,
  AppThemeId,
  BoardGrid,
  GameMode,
  GameStats,
  GridSize,
  MoveRecord,
  Player,
  PlayerProfile,
  SymbolTheme,
  WinningLineInfo,
} from './types/game';
import { checkGameState, getCellCoordinates, loadGameStats, saveGameStats, updateStatsAfterGame } from './utils/gameLogic';
import { getAIMove } from './utils/ai';
import { soundManager } from './utils/audio';
import { THEMES } from './utils/themes';
import { Play, RotateCcw, Sparkles } from 'lucide-react';

export default function App() {
  // Grid & Engine Configurations
  const [gridSize, setGridSize] = useState<GridSize>(3);
  const [gameMode, setGameMode] = useState<GameMode>('AI');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('IMPOSSIBLE');
  const [themeId, setThemeId] = useState<AppThemeId>('CYBER');
  const [symbolTheme, setSymbolTheme] = useState<SymbolTheme>('CLASSIC');

  // Blitz Timer Configuration
  const [blitzMaxTime, setBlitzMaxTime] = useState<number>(10);
  const [blitzTimeLeft, setBlitzTimeLeft] = useState<number>(10);

  // Audio settings
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getIsMuted());
  const [volume, setVolume] = useState<number>(() => soundManager.getVolume());

  // Player Profiles
  const [player1Name, setPlayer1Name] = useState<string>('Player 1');
  const [player2Name, setPlayer2Name] = useState<string>('Player 2');

  // Match State
  const [board, setBoard] = useState<BoardGrid>(() => Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'DRAW' | null>(null);
  const [winningLine, setWinningLine] = useState<WinningLineInfo | null>(null);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [moves, setMoves] = useState<MoveRecord[]>([]);
  const [gameStartTime, setGameStartTime] = useState<number>(() => Date.now());
  const [gameDuration, setGameDuration] = useState<number>(0);

  // Replay State
  const [isReplaying, setIsReplaying] = useState<boolean>(false);
  const [replayStep, setReplayStep] = useState<number>(0);
  const [isAutoPlayingReplay, setIsAutoPlayingReplay] = useState<boolean>(false);

  // Modals & Celebrations
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [showDrawModal, setShowDrawModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);

  // Persistent Stats
  const [stats, setStats] = useState<GameStats>(() => loadGameStats());

  // Timer Ref for Replay interval
  const replayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const activeTheme = THEMES[themeId];

  // Helper for Profiles
  const playerXProfile: PlayerProfile = {
    name: player1Name,
    symbol: 'X',
    avatarColor: 'rose',
  };
  const playerOProfile: PlayerProfile = {
    name: gameMode === 'AI' ? 'AI Bot' : player2Name,
    symbol: 'O',
    avatarColor: 'cyan',
  };

  // Reset current board for a new round
  const resetRound = useCallback(
    (newSize: GridSize = gridSize) => {
      setBoard(Array(newSize * newSize).fill(null));
      setCurrentTurn('X');
      setWinner(null);
      setWinningLine(null);
      setIsAiThinking(false);
      setMoves([]);
      setGameStartTime(Date.now());
      setGameDuration(0);
      setIsReplaying(false);
      setReplayStep(0);
      setIsAutoPlayingReplay(false);
      setShowVictoryModal(false);
      setShowDrawModal(false);
      setBlitzTimeLeft(blitzMaxTime > 0 ? blitzMaxTime : 10);
      soundManager.playClick();
    },
    [gridSize, blitzMaxTime]
  );

  // Handle changing Grid Size
  const handleSelectGridSize = (size: GridSize) => {
    if (size !== gridSize) {
      setGridSize(size);
      resetRound(size);
    }
  };

  // Commit a move to the board
  const makeMove = useCallback(
    (cellIndex: number, playerToMove: Player = currentTurn) => {
      if (board[cellIndex] !== null || winner !== null || isAiThinking) {
        return;
      }

      // Play sound
      if (playerToMove === 'X') {
        soundManager.playXMove();
      } else {
        soundManager.playOMove();
      }

      const newBoard = [...board];
      newBoard[cellIndex] = playerToMove;
      setBoard(newBoard);

      const { row, col } = getCellCoordinates(cellIndex, gridSize);
      const newMove: MoveRecord = {
        player: playerToMove,
        cellIndex,
        row,
        col,
        timestamp: Date.now(),
      };
      const updatedMoves = [...moves, newMove];
      setMoves(updatedMoves);

      // Check for win / draw
      const state = checkGameState(newBoard, gridSize);

      if (state.winner) {
        const duration = Math.max(1, Math.round((Date.now() - gameStartTime) / 1000));
        setGameDuration(duration);
        setWinner(state.winner);
        setWinningLine(state.winningLine);

        // Update Career Statistics
        const updatedStats = updateStatsAfterGame(stats, state.winner);
        setStats(updatedStats);

        if (state.winner === 'X' || state.winner === 'O') {
          soundManager.playWinFanfare();
          // Delay modal slightly so user sees the laser cut through the winning line first!
          setTimeout(() => {
            setShowVictoryModal(true);
          }, 650);
        } else {
          soundManager.playDrawSound();
          setTimeout(() => {
            setShowDrawModal(true);
          }, 500);
        }
      } else {
        // Next player turn
        const nextPlayer: Player = playerToMove === 'X' ? 'O' : 'X';
        setCurrentTurn(nextPlayer);
        // Reset blitz timer
        if (blitzMaxTime > 0) {
          setBlitzTimeLeft(blitzMaxTime);
        }
      }
    },
    [board, currentTurn, winner, isAiThinking, gridSize, moves, gameStartTime, stats, blitzMaxTime]
  );

  // AI Turn Trigger
  useEffect(() => {
    if (gameMode === 'AI' && currentTurn === 'O' && winner === null && !isReplaying) {
      setIsAiThinking(true);

      // Organic AI thinking latency
      const delay = Math.floor(Math.random() * 250) + 380;
      const timer = setTimeout(() => {
        const aiCell = getAIMove(board, gridSize, aiDifficulty, 'O');
        setIsAiThinking(false);
        makeMove(aiCell, 'O');
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [gameMode, currentTurn, winner, isReplaying, board, gridSize, aiDifficulty, makeMove]);

  // Blitz Mode Countdown
  useEffect(() => {
    if (gameMode !== 'BLITZ' || winner !== null || isReplaying || blitzMaxTime <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setBlitzTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer expired! Force switch turn or take an available move
          soundManager.playTimerTick(true);
          // Pick a random available cell to keep the game moving fast!
          const available = board
            .map((val, idx) => (val === null ? idx : null))
            .filter((v): v is number => v !== null);

          if (available.length > 0) {
            const randomMove = available[Math.floor(Math.random() * available.length)];
            makeMove(randomMove, currentTurn);
          }
          return blitzMaxTime;
        }

        if (prev <= 4) {
          soundManager.playTimerTick(prev <= 2);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameMode, winner, isReplaying, blitzMaxTime, board, currentTurn, makeMove]);

  // Replay System
  const handleStartReplay = () => {
    setShowVictoryModal(false);
    setShowDrawModal(false);
    setIsReplaying(true);
    setReplayStep(0);
    setIsAutoPlayingReplay(false);
    soundManager.playClick();
  };

  const handleExitReplay = () => {
    setIsReplaying(false);
    setIsAutoPlayingReplay(false);
    soundManager.playClick();
  };

  const computeReplayBoard = (step: number): BoardGrid => {
    const replayBoard = Array(gridSize * gridSize).fill(null);
    for (let i = 0; i < step; i++) {
      if (moves[i]) {
        replayBoard[moves[i].cellIndex] = moves[i].player;
      }
    }
    return replayBoard;
  };

  const handleStepForward = () => {
    if (replayStep < moves.length) {
      setReplayStep((prev) => prev + 1);
      soundManager.playClick();
    }
  };

  const handleStepBackward = () => {
    if (replayStep > 0) {
      setReplayStep((prev) => prev - 1);
      soundManager.playClick();
    }
  };

  // Auto-play replay timer
  useEffect(() => {
    if (!isAutoPlayingReplay) {
      if (replayIntervalRef.current) clearInterval(replayIntervalRef.current);
      return;
    }

    replayIntervalRef.current = setInterval(() => {
      setReplayStep((prev) => {
        if (prev >= moves.length) {
          setIsAutoPlayingReplay(false);
          return prev;
        }
        return prev + 1;
      });
    }, 850);

    return () => {
      if (replayIntervalRef.current) clearInterval(replayIntervalRef.current);
    };
  }, [isAutoPlayingReplay, moves.length]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input is active
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      // 1-9 Keys for cell placement (on 3x3)
      if (gridSize === 3 && /^[1-9]$/.test(e.key) && !isReplaying && winner === null) {
        const cellIndex = parseInt(e.key, 10) - 1;
        makeMove(cellIndex);
      }

      // Space to reset round
      if (e.code === 'Space') {
        e.preventDefault();
        resetRound();
      }

      // M to toggle mute
      if (e.key.toLowerCase() === 'm') {
        const muted = soundManager.toggleMute();
        setIsMuted(muted);
      }

      // R to start replay if game concluded
      if (e.key.toLowerCase() === 'r' && winner !== null && !isReplaying) {
        handleStartReplay();
      }

      // Escape to close open modals
      if (e.key === 'Escape') {
        setShowVictoryModal(false);
        setShowDrawModal(false);
        setShowSettingsModal(false);
        setShowStatsModal(false);
        setShowRulesModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gridSize, isReplaying, winner, makeMove, resetRound]);

  // Audio mute toggle
  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleChangeVolume = (vol: number) => {
    soundManager.setVolume(vol);
    setVolume(vol);
  };

  const handleResetCareerStats = () => {
    const emptyStats: GameStats = {
      gamesPlayed: 0,
      xWins: 0,
      oWins: 0,
      draws: 0,
      currentStreak: { winner: null, count: 0 },
      highestStreak: { winner: null, count: 0 },
    };
    saveGameStats(emptyStats);
    setStats(emptyStats);
    soundManager.playClick();
  };

  // Determine current active board to display (live vs replay)
  const displayedBoard = isReplaying ? computeReplayBoard(replayStep) : board;
  const displayedWinner = isReplaying
    ? replayStep === moves.length
      ? winner
      : null
    : winner;
  const displayedWinningLine = isReplaying
    ? replayStep === moves.length
      ? winningLine
      : null
    : winningLine;

  const currentReplayTurn: Player =
    replayStep < moves.length ? moves[replayStep]?.player || 'X' : currentTurn;

  return (
    <div
      className={`min-h-screen flex flex-col justify-between text-slate-100 transition-colors duration-500 font-sans ${activeTheme.bgGradient}`}
    >
      {/* Top Bar Header */}
      <Header
        gameMode={gameMode}
        onSelectMode={(mode) => {
          setGameMode(mode);
          resetRound();
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onResetGame={() => resetRound()}
        onOpenThemeMenu={() => setShowSettingsModal(true)}
        onOpenStats={() => setShowStatsModal(true)}
        onOpenRules={() => setShowRulesModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* Main Game Stage */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-6">
        {/* Score & Turn HUD */}
        <ScoreBoard
          playerX={playerXProfile}
          playerO={playerOProfile}
          currentTurn={isReplaying ? currentReplayTurn : currentTurn}
          gameMode={gameMode}
          aiDifficulty={aiDifficulty}
          stats={stats}
          theme={activeTheme}
          blitzTimeLeft={blitzTimeLeft}
          blitzMaxTime={blitzMaxTime}
          isGameActive={winner === null && !isReplaying}
        />

        {/* 3D Dynamic Game Board */}
        <Board
          board={displayedBoard}
          gridSize={gridSize}
          currentTurn={currentTurn}
          winner={displayedWinner}
          winningLine={displayedWinningLine}
          symbolTheme={symbolTheme}
          theme={activeTheme}
          onCellClick={(idx) => {
            if (!isReplaying) {
              makeMove(idx);
            }
          }}
          disabled={isAiThinking || winner !== null || isReplaying}
        />

        {/* In-game Status & Controls Bar */}
        {!isReplaying ? (
          <div className="flex items-center gap-3 mt-1 sm:mt-2">
            {winner !== null ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => resetRound()}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Again</span>
                </button>
                <button
                  onClick={handleStartReplay}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Play className="w-4 h-4 text-cyan-400" />
                  <span>Replay</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  {gameMode === 'AI' && currentTurn === 'O'
                    ? 'AI is calculating move...'
                    : `${currentTurn === 'X' ? player1Name : playerOProfile.name}'s turn`}
                </span>
                <span aria-hidden="true" className="text-slate-600">
                  ·
                </span>
                <span>Press Space to reset</span>
              </div>
            )}
          </div>
        ) : (
          <ReplayControls
            currentStep={replayStep}
            totalSteps={moves.length}
            moves={moves}
            gridSize={gridSize}
            isPlaying={isAutoPlayingReplay}
            onTogglePlay={() => setIsAutoPlayingReplay(!isAutoPlayingReplay)}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
            onJumpStart={() => setReplayStep(0)}
            onJumpEnd={() => setReplayStep(moves.length)}
            onExitReplay={handleExitReplay}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 font-mono">
        <div className="flex items-center gap-2">
          <span>Tic-Tac-Toe Arena</span>
          <span aria-hidden="true">·</span>
          <span>{gridSize}x{gridSize} Mode</span>
          <span aria-hidden="true">·</span>
          <span>{activeTheme.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRulesModal(true)}
            className="hover:text-slate-200 transition-colors"
          >
            Shortcuts
          </button>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => setShowStatsModal(true)}
            className="hover:text-slate-200 transition-colors"
          >
            Stats ({stats.gamesPlayed})
          </button>
        </div>
      </footer>

      {/* Modals & Celebrations */}
      <VictoryModal
        isOpen={showVictoryModal}
        winner={(winner as Player) || 'X'}
        winnerProfile={winner === 'X' ? playerXProfile : playerOProfile}
        streakCount={stats.currentStreak.count}
        totalMoves={moves.length}
        durationSeconds={gameDuration}
        theme={activeTheme}
        onPlayAgain={() => resetRound()}
        onStartReplay={handleStartReplay}
        onClose={() => setShowVictoryModal(false)}
      />

      <DrawAnimation
        isOpen={showDrawModal}
        totalMoves={moves.length}
        durationSeconds={gameDuration}
        onPlayAgain={() => resetRound()}
        onStartReplay={handleStartReplay}
        onClose={() => setShowDrawModal(false)}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        gridSize={gridSize}
        onSelectGridSize={handleSelectGridSize}
        aiDifficulty={aiDifficulty}
        onSelectAIDifficulty={(diff) => {
          setAiDifficulty(diff);
          soundManager.playClick();
        }}
        blitzMaxTime={blitzMaxTime}
        onSelectBlitzTime={(sec) => {
          setBlitzMaxTime(sec);
          setBlitzTimeLeft(sec > 0 ? sec : 10);
          soundManager.playClick();
        }}
        themeId={themeId}
        onSelectTheme={(id) => {
          setThemeId(id);
          soundManager.playClick();
        }}
        symbolTheme={symbolTheme}
        onSelectSymbolTheme={(st) => {
          setSymbolTheme(st);
          soundManager.playClick();
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        volume={volume}
        onChangeVolume={handleChangeVolume}
        player1Name={player1Name}
        onChangePlayer1Name={setPlayer1Name}
        player2Name={player2Name}
        onChangePlayer2Name={setPlayer2Name}
      />

      <MatchHistoryModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        stats={stats}
        onResetStats={handleResetCareerStats}
        moves={moves}
        gridSize={gridSize}
        onStartReplay={handleStartReplay}
      />

      <RulesModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />
    </div>
  );
}
