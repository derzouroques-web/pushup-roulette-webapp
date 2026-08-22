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
import { LanguageSelector } from './components/LanguageSelector';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { History, BarChart3, Settings, Volume2, VolumeX, Timer } from 'lucide-react';

const AppContent: React.FC = () => {
  const { t } = useLanguage();

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
      alert(t('allEliminatedAlert'));
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
    <div className="min-h-screen bg-[#090d14] text-gray-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-lg shadow-md border border-yellow-200/50">
              🎰
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1">
                <span className="text-gold-gradient">{t('appTitle1')}</span>
                <span className="text-white">{t('appTitle2')}</span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('game')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'game'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎯 {t('tabGame')}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" /> {t('tabHistory')} ({history.length})
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> {t('tabStats')}
            </button>
          </nav>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-1.5">
            <LanguageSelector />

            <button
              onClick={() => setShowRestTimer(!showRestTimer)}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-amber-400 transition-colors cursor-pointer"
              title={t('restTimerTooltip')}
            >
              <Timer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 transition-colors cursor-pointer"
              title={t('soundToggleTooltip')}
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 transition-colors cursor-pointer"
              title={t('settingsTooltip')}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area with Bottom Padding for Mobile Nav */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 md:p-6 pb-24 md:pb-6">
        {activeTab === 'game' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
            {/* Left Column: Roulette Wheel & Active Turn Banner (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Active Spinner Turn Callout Card */}
              <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800/80 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border shadow-sm"
                    style={{ borderColor: activePlayer.color, backgroundColor: `${activePlayer.color}22` }}
                  >
                    {activePlayer.avatar}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">{t('currentSpinner')}</span>
                    <h2 className="text-base font-black text-white leading-tight">{activePlayer.name}</h2>
                  </div>
                </div>

                <button
                  onClick={handleStartSpin}
                  disabled={isSpinning}
                  className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer shrink-0 ${
                    isSpinning
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:brightness-110 shadow-amber-500/20'
                  }`}
                >
                  {isSpinning ? t('spinning') : t('spinWheel')}
                </button>
              </div>

              {/* Side Bet Selector */}
              <SideBetSelector
                selectedBet={currentSideBet}
                onSelectBet={setCurrentSideBet}
                disabled={isSpinning}
              />

              {/* Canvas Roulette Wheel Container */}
              <div className="bg-slate-900/80 rounded-3xl p-3 sm:p-4 border border-slate-800/80 shadow-xl flex items-center justify-center">
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
            <div className="lg:col-span-7 flex flex-col gap-4">
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

      {/* Pinned Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        historyCount={history.length}
      />

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

export const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;

