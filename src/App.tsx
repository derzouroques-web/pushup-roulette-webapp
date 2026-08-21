import React, { useState, useEffect } from 'react';
import type { Player, SpinResult, GameSettings, GameView, SideBetType } from './types';
import { DEFAULT_SETTINGS, RED_NUMBERS } from './utils/constants';
import { audioEngine } from './utils/audio';
import { RouletteCanvas } from './components/RouletteCanvas';
import { BettingBoard } from './components/BettingBoard';
import { PlayerManager } from './components/PlayerManager';
import { SpinModal } from './components/SpinModal';
import { RestTimer } from './components/RestTimer';
import { GameSettingsModal } from './components/GameSettingsModal';
import { HistoryLog } from './components/HistoryLog';
import { StatsDashboard } from './components/StatsDashboard';
import { SideBetSelector } from './components/SideBetSelector';
import { History, BarChart3, Settings, Volume2, VolumeX, Timer } from 'lucide-react';

export const App: React.FC = () => {
  // State initialization
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 'p1',
      name: 'Player 1',
      avatar: '💪',
      color: '#f59e0b',
      difficultyMultiplier: 1.0,
      totalPushups: 0,
      totalSpins: 0,
      completedSpins: 0,
      maxSingleSpin: 0,
      streak: 0,
    },
    {
      id: 'p2',
      name: 'Player 2',
      avatar: '🔥',
      color: '#ef4444',
      difficultyMultiplier: 1.0,
      totalPushups: 0,
      totalSpins: 0,
      completedSpins: 0,
      maxSingleSpin: 0,
      streak: 0,
    },
  ]);

  const [activePlayerId, setActivePlayerId] = useState<string>('p1');
  const [eliminatedNumbers, setEliminatedNumbers] = useState<Set<number>>(new Set());
  const [history, setHistory] = useState<SpinResult[]>([]);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [currentSideBet, setCurrentSideBet] = useState<SideBetType>('none');

  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [landedNumber, setLandedNumber] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<GameView>('game');
  const [showSpinModal, setShowSpinModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showRestTimer, setShowRestTimer] = useState<boolean>(false);

  // Sync sound settings with AudioEngine
  useEffect(() => {
    audioEngine.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const activePlayer = players.find(p => p.id === activePlayerId) || players[0];

  // Initiate Wheel Spin
  const handleStartSpin = () => {
    if (isSpinning) return;

    // Check if pool is empty in elimination mode
    if (settings.eliminationMode && eliminatedNumbers.size >= 37) {
      alert('All numbers have been eliminated! Resetting wheel pool automatically.');
      setEliminatedNumbers(new Set());
    }

    setIsSpinning(true);
    setShowSpinModal(false);
  };

  // Called when Canvas Wheel stops physics loop
  const handleSpinEnd = (winningNumber: number) => {
    setIsSpinning(false);
    setLandedNumber(winningNumber);
    setShowSpinModal(true);

    // If elimination mode is active, add number to eliminated set
    if (settings.eliminationMode) {
      setEliminatedNumbers(prev => new Set(prev).add(winningNumber));
    }
  };

  // Log pushups result from SpinModal
  const handleLogResult = (pushupsDone: number, status: 'completed' | 'partial' | 'passed') => {
    if (landedNumber === null) return;

    const pocketColor = landedNumber === 0 ? 'green' : RED_NUMBERS.has(landedNumber) ? 'red' : 'black';

    // Evaluate side bet outcome for history record
    let sideBetWon: boolean | undefined = undefined;
    let sideBetMultiplier = 1.0;
    if (currentSideBet !== 'none') {
      if (currentSideBet === 'red') sideBetWon = pocketColor === 'red';
      else if (currentSideBet === 'black') sideBetWon = pocketColor === 'black';
      else if (currentSideBet === 'odd') sideBetWon = landedNumber !== 0 && (landedNumber % 2 !== 0);
      else if (currentSideBet === 'even') sideBetWon = landedNumber !== 0 && (landedNumber % 2 === 0);
      else if (currentSideBet === 'low') sideBetWon = landedNumber >= 1 && landedNumber <= 18;
      else if (currentSideBet === 'high') sideBetWon = landedNumber >= 19 && landedNumber <= 36;

      sideBetMultiplier = sideBetWon ? 0.5 : 1.5;
    }

    // Calculate target pushups
    let baseTarget = landedNumber * settings.multiplier * activePlayer.difficultyMultiplier * sideBetMultiplier;
    if (settings.maxRepCap > 0 && baseTarget > settings.maxRepCap) {
      baseTarget = settings.maxRepCap;
    }
    const targetPushups = Math.round(baseTarget);

    const newRecord: SpinResult = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      playerId: activePlayer.id,
      playerName: activePlayer.name,
      number: landedNumber,
      pocketColor,
      pushupsAssigned: targetPushups,
      pushupsDone,
      status,
      wasEliminated: settings.eliminationMode,
      sideBet: currentSideBet,
      sideBetWon,
      sideBetMultiplier,
    };

    setHistory(prev => [...prev, newRecord]);

    // Update active player stats
    setPlayers(prevPlayers =>
      prevPlayers.map(p => {
        if (p.id === activePlayer.id) {
          return {
            ...p,
            totalPushups: p.totalPushups + pushupsDone,
            totalSpins: p.totalSpins + 1,
            completedSpins: status === 'completed' ? p.completedSpins + 1 : p.completedSpins,
            maxSingleSpin: Math.max(p.maxSingleSpin, pushupsDone),
            streak: status === 'completed' ? p.streak + 1 : 0,
          };
        }
        return p;
      })
    );

    setShowSpinModal(false);

    // Auto advance turn to next player if multiple players exist
    if (settings.autoAdvanceTurn && players.length > 1) {
      const currentIndex = players.findIndex(p => p.id === activePlayer.id);
      const nextIndex = (currentIndex + 1) % players.length;
      setActivePlayerId(players[nextIndex].id);
    }
  };

  // Player management callbacks
  const handleAddPlayer = (newPlayerData: Omit<Player, 'id' | 'totalPushups' | 'totalSpins' | 'completedSpins' | 'maxSingleSpin' | 'streak'>) => {
    const newPlayer: Player = {
      ...newPlayerData,
      id: Date.now().toString(),
      totalPushups: 0,
      totalSpins: 0,
      completedSpins: 0,
      maxSingleSpin: 0,
      streak: 0,
    };
    setPlayers(prev => [...prev, newPlayer]);
  };

  const handleRemovePlayer = (id: string) => {
    if (players.length <= 1) return;
    const filtered = players.filter(p => p.id !== id);
    setPlayers(filtered);
    if (activePlayerId === id) {
      setActivePlayerId(filtered[0].id);
    }
  };

  const handleToggleEliminateNumber = (num: number) => {
    setEliminatedNumbers(prev => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  const handleResetPool = () => {
    setEliminatedNumbers(new Set());
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-gray-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-amber-500/30 px-4 py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-2xl shadow-lg border border-yellow-200 neon-glow-gold">
              🎰
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                <span className="text-gold-gradient">ROULETTE</span>
                <span className="text-white">PUSHUP</span>
              </h1>
              <p className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">
                Casino Fitness Challenge
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('game')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'game'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎯 Push Up Game
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" /> History ({history.length})
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Analytics
            </button>
          </nav>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRestTimer(!showRestTimer)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-amber-400 transition-colors cursor-pointer"
              title="Rest Timer"
            >
              <Timer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-slate-300 transition-colors cursor-pointer"
              title="Toggle Audio FX"
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-slate-300 transition-colors cursor-pointer"
              title="Game Rules & Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'game' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Roulette Wheel & Active Turn Banner (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Turn Callout */}
              <div className="glass-panel-gold rounded-2xl p-4 border border-amber-500/40 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 shadow-md"
                    style={{ borderColor: activePlayer.color, backgroundColor: `${activePlayer.color}22` }}
                  >
                    {activePlayer.avatar}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">Current Spinner</span>
                    <h2 className="text-lg font-black text-white">{activePlayer.name}</h2>
                    <p className="text-xs text-slate-400">{activePlayer.totalPushups} total pushups logged</p>
                  </div>
                </div>

                <button
                  onClick={handleStartSpin}
                  disabled={isSpinning}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer ${
                    isSpinning
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:brightness-110 neon-glow-gold'
                  }`}
                >
                  {isSpinning ? 'Spinning...' : 'Spin Wheel 🎲'}
                </button>
              </div>

              {/* Side Bet Selector */}
              <SideBetSelector
                selectedBet={currentSideBet}
                onSelectBet={setCurrentSideBet}
                disabled={isSpinning}
              />

              {/* Canvas Roulette Wheel */}
              <div className="glass-panel rounded-3xl p-4 border border-slate-700/60 shadow-2xl flex items-center justify-center">
                <RouletteCanvas
                  eliminatedNumbers={eliminatedNumbers}
                  isSpinning={isSpinning}
                  onSpinStart={() => setIsSpinning(true)}
                  onSpinEnd={handleSpinEnd}
                  disabled={isSpinning}
                />
              </div>
            </div>

            {/* Right Column: Player Cards & Betting Board (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Player Leaderboard Manager */}
              <PlayerManager
                players={players}
                activePlayerId={activePlayerId}
                onSelectActivePlayer={setActivePlayerId}
                onAddPlayer={handleAddPlayer}
                onRemovePlayer={handleRemovePlayer}
              />

              {/* Casino Betting Board Grid */}
              <BettingBoard
                eliminatedNumbers={eliminatedNumbers}
                history={history}
                eliminationMode={settings.eliminationMode}
                onToggleEliminate={handleToggleEliminateNumber}
                onResetPool={handleResetPool}
                lastLandedNumber={landedNumber}
              />
            </div>
          </div>
        )}

        {activeTab === 'history' && <HistoryLog history={history} />}
        {activeTab === 'stats' && <StatsDashboard players={players} history={history} />}
      </main>

      {/* Floating Modals */}
      {showSpinModal && landedNumber !== null && (
        <SpinModal
          landedNumber={landedNumber}
          player={activePlayer}
          settings={settings}
          sideBet={currentSideBet}
          onLogResult={handleLogResult}
          onStartRestTimer={() => {
            setShowSpinModal(false);
            setShowRestTimer(true);
          }}
          onClose={() => setShowSpinModal(false)}
        />
      )}

      {showSettingsModal && (
        <GameSettingsModal
          settings={settings}
          onUpdateSettings={(newSettings) => setSettings(prev => ({ ...prev, ...newSettings }))}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {showRestTimer && (
        <RestTimer
          initialSeconds={settings.defaultRestTime}
          onClose={() => setShowRestTimer(false)}
        />
      )}
    </div>
  );
};

export default App;
