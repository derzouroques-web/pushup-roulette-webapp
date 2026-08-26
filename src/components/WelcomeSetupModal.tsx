import React, { useState } from 'react';
import type { Player, GameSettings, SoloPreset, HalfBoardMode } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { DEFAULT_AVATARS, PLAYER_COLORS } from '../utils/constants';
import { Users, User, Trophy, Flame, ShieldAlert, Sparkles, Target, Scissors, X } from 'lucide-react';

interface WelcomeSetupModalProps {
  currentPlayers: Player[];
  currentSettings: GameSettings;
  onConfirmSetup: (newPlayers: Player[], newSettings: Partial<GameSettings>) => void;
  onClose?: () => void;
  isInitialLaunch?: boolean;
}

export const WelcomeSetupModal: React.FC<WelcomeSetupModalProps> = ({
  currentPlayers,
  currentSettings,
  onConfirmSetup,
  onClose,
  isInitialLaunch = false,
}) => {
  const { t } = useLanguage();

  const [playerCount, setPlayerCount] = useState<number>(currentPlayers.length || 1);
  const [soloPreset, setSoloPreset] = useState<SoloPreset>(currentSettings.soloPreset || 'casual');
  const [halfBoardMode, setHalfBoardMode] = useState<HalfBoardMode>(currentSettings.halfBoardMode || 'low');
  const [targetGoal, setTargetGoal] = useState<number>(currentSettings.targetRepsGoal || 100);

  // Editable player drafts
  const [playerDrafts, setPlayerDrafts] = useState<Player[]>(() => {
    if (currentPlayers.length > 0) return currentPlayers;
    return [
      {
        id: 'p1',
        name: 'Player 1',
        avatar: '💪',
        color: PLAYER_COLORS[0],
        difficultyMultiplier: 1.0,
        totalPushups: 0,
        totalSpins: 0,
        completedSpins: 0,
        maxSingleSpin: 0,
        streak: 0,
      },
    ];
  });

  // Keep playerDrafts count in sync when playerCount changes
  const handlePlayerCountChange = (count: number) => {
    const clampedCount = Math.max(1, Math.min(8, count));
    setPlayerCount(clampedCount);

    setPlayerDrafts(prev => {
      const next = [...prev];
      if (clampedCount > next.length) {
        for (let i = next.length; i < clampedCount; i++) {
          next.push({
            id: `p${i + 1}`,
            name: `Player ${i + 1}`,
            avatar: DEFAULT_AVATARS[i % DEFAULT_AVATARS.length],
            color: PLAYER_COLORS[i % PLAYER_COLORS.length],
            difficultyMultiplier: 1.0,
            totalPushups: 0,
            totalSpins: 0,
            completedSpins: 0,
            maxSingleSpin: 0,
            streak: 0,
          });
        }
      } else if (clampedCount < next.length) {
        return next.slice(0, clampedCount);
      }
      return next;
    });
  };

  const handleUpdatePlayerDraft = (index: number, updates: Partial<Player>) => {
    setPlayerDrafts(prev =>
      prev.map((p, i) => (i === index ? { ...p, ...updates } : p))
    );
  };

  const handleStartGame = () => {
    let newSettings: Partial<GameSettings> = {
      soloPreset: playerCount === 1 ? soloPreset : undefined,
      halfBoardMode: playerCount === 1 ? halfBoardMode : 'none',
    };

    if (playerCount === 1) {
      if (soloPreset === 'casual') {
        newSettings = {
          ...newSettings,
          multiplier: 0.5,
          maxRepCap: 15,
          targetRepsGoal: 0,
          eliminationMode: true,
          halfBoardMode: halfBoardMode,
        };
      } else if (soloPreset === 'standard') {
        newSettings = {
          ...newSettings,
          multiplier: 0.75,
          maxRepCap: 20,
          targetRepsGoal: 0,
          eliminationMode: true,
          halfBoardMode: 'none',
        };
      } else if (soloPreset === 'target') {
        newSettings = {
          ...newSettings,
          multiplier: 0.75,
          maxRepCap: 20,
          targetRepsGoal: targetGoal,
          eliminationMode: true,
          halfBoardMode: 'none',
        };
      } else if (soloPreset === 'gauntlet') {
        newSettings = {
          ...newSettings,
          multiplier: 1.0,
          maxRepCap: 0,
          targetRepsGoal: 0,
          eliminationMode: true,
          halfBoardMode: 'none',
        };
      }
    } else {
      // Multiplayer defaults
      newSettings = {
        ...newSettings,
        multiplier: 1.0,
        maxRepCap: currentSettings.maxRepCap || 0,
        targetRepsGoal: 0,
        eliminationMode: true,
        halfBoardMode: 'none',
      };
    }

    onConfirmSetup(playerDrafts, newSettings);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-600/20 via-yellow-600/20 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-2xl shadow-md border border-yellow-200/40 shrink-0">
              🎰
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
                <span>{t('welcomeTitle')}</span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {t('welcomeSubtitle')}
              </p>
            </div>
          </div>

          {!isInitialLaunch && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Step 1: Select Player Count */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-amber-400 mb-2.5 block">
              {t('playerCountLabel')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Solo Card */}
              <button
                type="button"
                onClick={() => handlePlayerCountChange(1)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-2 ${
                  playerCount === 1
                    ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500'
                    : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-black text-amber-400">1</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {t('soloMode')}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {t('soloModeDesc')}
                  </p>
                </div>
              </button>

              {/* Duo Card */}
              <button
                type="button"
                onClick={() => handlePlayerCountChange(2)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-2 ${
                  playerCount === 2
                    ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500'
                    : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-black text-amber-400">2</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {t('duoMode')}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {t('duoModeDesc')}
                  </p>
                </div>
              </button>

              {/* Squad Card */}
              <button
                type="button"
                onClick={() => handlePlayerCountChange(playerCount >= 3 ? playerCount : 3)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-2 ${
                  playerCount >= 3
                    ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500'
                    : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Flame className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-black text-amber-400">3+</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {t('squadMode')}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {t('squadModeDesc')}
                  </p>
                </div>
              </button>
            </div>

            {/* If 3+ players selected, allow fine-tuning player count */}
            {playerCount >= 3 && (
              <div className="mt-3 p-3 bg-slate-800/40 rounded-xl border border-slate-700 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  {t('customPlayerCount')}:
                </span>
                <div className="flex items-center gap-2">
                  {[3, 4, 5, 6, 7, 8].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handlePlayerCountChange(num)}
                      className={`w-8 h-8 rounded-lg font-black text-xs transition-all cursor-pointer ${
                        playerCount === num
                          ? 'bg-amber-500 text-slate-950 font-extrabold shadow'
                          : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Step 2A: If Solo Mode -> Solo Balancing Presets */}
          {playerCount === 1 && (
            <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-black text-white">
                    {t('selectSoloPresetTitle')}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {t('selectSoloPresetDesc')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Casual Fitness Preset */}
                <button
                  type="button"
                  onClick={() => setSoloPreset('casual')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                    soloPreset === 'casual'
                      ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500 shadow-sm'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      ⭐ {t('presetCasualTitle')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {t('presetCasualDesc')}
                  </p>
                </button>

                {/* Standard Workout Preset */}
                <button
                  type="button"
                  onClick={() => setSoloPreset('standard')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                    soloPreset === 'standard'
                      ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500 shadow-sm'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      💪 {t('presetStandardTitle')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {t('presetStandardDesc')}
                  </p>
                </button>

                {/* Target Goal Preset */}
                <button
                  type="button"
                  onClick={() => setSoloPreset('target')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                    soloPreset === 'target'
                      ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500 shadow-sm'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-amber-400" /> {t('presetTargetTitle')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {t('presetTargetDesc')}
                  </p>
                </button>

                {/* Hardcore Gauntlet Preset */}
                <button
                  type="button"
                  onClick={() => setSoloPreset('gauntlet')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                    soloPreset === 'gauntlet'
                      ? 'bg-red-500/15 border-red-500 ring-1 ring-red-500 shadow-sm'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-red-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> {t('presetGauntletTitle')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {t('presetGauntletDesc')}
                  </p>
                </button>
              </div>

              {/* Step 2B: Casual Solo Option -> Remove Half of the Options (Half Board) */}
              {soloPreset === 'casual' && (
                <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scissors className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-bold text-white">
                        {t('halfBoardOptionTitle')}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {t('halfBoardOptionDesc')}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setHalfBoardMode('low')}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        halfBoardMode === 'low'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                          : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{t('halfBoardLow')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHalfBoardMode('random')}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        halfBoardMode === 'random'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                          : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{t('halfBoardRandom')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHalfBoardMode('odd')}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        halfBoardMode === 'odd'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                          : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{t('halfBoardOdd')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHalfBoardMode('none')}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        halfBoardMode === 'none'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                          : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{t('halfBoardNone')}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* If Target Goal is chosen, show goal selector */}
              {soloPreset === 'target' && (
                <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">
                      {t('targetGoalLabel')}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {t('targetGoalHelp')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[50, 100, 150, 200].map(goal => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => setTargetGoal(goal)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          targetGoal === goal
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Player Customization (Names & Avatars) */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-amber-400 block">
              {t('setupPlayersTitle')} ({playerDrafts.length})
            </label>

            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {playerDrafts.map((player, idx) => (
                <div
                  key={player.id}
                  className="flex items-center gap-2.5 p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/70"
                >
                  {/* Avatar Picker trigger */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border shadow-sm shrink-0"
                    style={{ borderColor: player.color, backgroundColor: `${player.color}22` }}
                  >
                    {player.avatar}
                  </div>

                  {/* Name Input */}
                  <input
                    type="text"
                    value={player.name}
                    onChange={e => handleUpdatePlayerDraft(idx, { name: e.target.value })}
                    placeholder={`Player ${idx + 1}`}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 font-bold focus:outline-none focus:border-amber-500"
                  />

                  {/* Avatar quick list or handicap */}
                  {playerCount > 1 && (
                    <select
                      value={player.difficultyMultiplier}
                      onChange={e => handleUpdatePlayerDraft(idx, { difficultyMultiplier: parseFloat(e.target.value) })}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-300 font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value={0.75}>{t('diffBeginner')}</option>
                      <option value={1.0}>{t('diffNormal')}</option>
                      <option value={1.5}>{t('diffPro')}</option>
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-3">
          {!isInitialLaunch && onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            >
              {t('cancel')}
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleStartGame}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-sm uppercase tracking-wider hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            {t('startGameBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};
