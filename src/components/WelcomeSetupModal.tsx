import React, { useState } from 'react';
import type { Player, GameSettings, WorkoutMode } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { DEFAULT_AVATARS, PLAYER_COLORS } from '../utils/constants';
import { Users, User, Trophy, Flame, Sparkles, Target, ChevronRight, ChevronLeft, Check, Dumbbell, Feather, X } from 'lucide-react';

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

  const [step, setStep] = useState<number>(1);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');

  const [playerCount, setPlayerCount] = useState<number>(currentPlayers.length || 1);
  const [workoutMode, setWorkoutMode] = useState<WorkoutMode>(currentSettings.workoutMode);
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
        totalPushups: 0,
        totalSpins: 0,
        completedSpins: 0,
        maxSingleSpin: 0,
        streak: 0,
      },
    ];
  });

  const totalSteps = 3;

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

  const goToNextStep = () => {
    if (step < totalSteps) {
      setSlideDirection('next');
      setStep(s => s + 1);
    } else {
      handleFinalizeSetup();
    }
  };

  const goToPrevStep = () => {
    if (step > 1) {
      setSlideDirection('prev');
      setStep(s => s - 1);
    }
  };

  const handleFinalizeSetup = () => {
    onConfirmSetup(playerDrafts, {
      workoutMode,
      targetRepsGoal: targetGoal,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Top Header & Step Progress */}
        <div className="p-5 bg-gradient-to-r from-amber-600/20 via-yellow-600/20 to-slate-900 border-b border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-xl shadow-md border border-yellow-200/40 shrink-0">
                🎰
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                  <span>{t('onboardingWelcome')}</span>
                </h2>
                <p className="text-[11px] text-amber-400 font-semibold">
                  {t('stepLabel').replace('{current}', step.toString()).replace('{total}', totalSteps.toString())}
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

          {/* Stepper Dots Bar */}
          <div className="flex items-center gap-2 pt-1">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex-1 flex items-center">
                <div
                  className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                    s === step
                      ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                      : s < step
                      ? 'bg-amber-600'
                      : 'bg-slate-800'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Animated Content Container */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 relative min-h-[320px]">
          {/* STEP 1: How many players */}
          {step === 1 && (
            <div
              key="step-1"
              className={`space-y-4 transition-all duration-300 ${
                slideDirection === 'next' ? 'animate-in fade-in slide-in-from-right-4' : 'animate-in fade-in slide-in-from-left-4'
              }`}
            >
              <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl">
                <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t('onboardingIntro')}</span>
                </p>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-amber-400 mb-2.5 block">
                  {t('playerCountLabel')}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Solo Option */}
                  <button
                    type="button"
                    onClick={() => handlePlayerCountChange(1)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-2.5 ${
                      playerCount === 1
                        ? 'bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/15 ring-2 ring-amber-500'
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

                  {/* Duo Option */}
                  <button
                    type="button"
                    onClick={() => handlePlayerCountChange(2)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-2.5 ${
                      playerCount === 2
                        ? 'bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/15 ring-2 ring-amber-500'
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

                  {/* Squad Option */}
                  <button
                    type="button"
                    onClick={() => handlePlayerCountChange(playerCount >= 3 ? playerCount : 3)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-2.5 ${
                      playerCount >= 3
                        ? 'bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/15 ring-2 ring-amber-500'
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

                {/* 3+ players custom selector */}
                {playerCount >= 3 && (
                  <div className="mt-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">
                      {t('customPlayerCount')}:
                    </span>
                    <div className="flex items-center gap-1.5">
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
            </div>
          )}

          {/* STEP 2: Workout Mode & Session Target */}
          {step === 2 && (
            <div
              key="step-2"
              className={`space-y-4 transition-all duration-300 ${
                slideDirection === 'next' ? 'animate-in fade-in slide-in-from-right-4' : 'animate-in fade-in slide-in-from-left-4'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-black text-white">
                    {t('selectModeTitle')}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t('selectModeDesc')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Normal */}
                <button
                  type="button"
                  onClick={() => setWorkoutMode('normal')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    workoutMode === 'normal'
                      ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500 shadow-md'
                      : 'bg-slate-800/70 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xs font-black text-white flex items-center gap-1.5">
                    <Dumbbell className="w-3.5 h-3.5 text-amber-400" /> {t('modeNormalTitle')}
                  </span>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {t('modeNormalDesc')}
                  </p>
                </button>

                {/* Easy */}
                <button
                  type="button"
                  onClick={() => setWorkoutMode('easy')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                    workoutMode === 'easy'
                      ? 'bg-sky-500/20 border-sky-500 ring-2 ring-sky-500 shadow-md'
                      : 'bg-slate-800/70 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xs font-black text-white flex items-center gap-1.5">
                    <Feather className="w-3.5 h-3.5 text-sky-400" /> {t('modeEasyTitle')}
                  </span>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {t('modeEasyDesc')}
                  </p>
                </button>
              </div>

              {/* Session Target Selector */}
              <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 flex flex-col gap-2.5">
                <div>
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-400" /> {t('targetGoalLabel')}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {t('targetGoalHelp')}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[50, 100, 150, 200, 250, 300].map(goal => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setTargetGoal(goal)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        targetGoal === goal
                          ? 'bg-amber-500 text-slate-950 shadow font-extrabold'
                          : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={targetGoal}
                    onChange={e => setTargetGoal(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-amber-400 font-bold text-center focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Profile, Avatar & Final Workout Summary */}
          {step === 3 && (
            <div
              key="step-3"
              className={`space-y-4 transition-all duration-300 ${
                slideDirection === 'next' ? 'animate-in fade-in slide-in-from-right-4' : 'animate-in fade-in slide-in-from-left-4'
              }`}
            >
              {/* Profile Card */}
              {playerCount === 1 && (
                <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 space-y-3">
                  <span className="text-xs font-extrabold uppercase text-amber-400 block tracking-wider">
                    {t('chooseAvatar')}
                  </span>

                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shadow-md shrink-0"
                      style={{ borderColor: playerDrafts[0]?.color, backgroundColor: `${playerDrafts[0]?.color}22` }}
                    >
                      {playerDrafts[0]?.avatar}
                    </div>

                    <input
                      type="text"
                      value={playerDrafts[0]?.name || ''}
                      onChange={e => handleUpdatePlayerDraft(0, { name: e.target.value })}
                      placeholder="Your Name"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Avatar Picker List */}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {DEFAULT_AVATARS.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleUpdatePlayerDraft(0, { avatar: emoji })}
                        className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all cursor-pointer ${
                          playerDrafts[0]?.avatar === emoji
                            ? 'bg-amber-500/25 border-amber-400 scale-110 shadow'
                            : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Multiplayer Lineup Setup */}
              {playerCount > 1 && (
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-wider text-amber-400 block">
                    {t('setupPlayersTitle')} ({playerDrafts.length})
                  </label>

                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {playerDrafts.map((player, idx) => (
                      <div
                        key={player.id}
                        className="flex items-center gap-2.5 p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/70"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border shadow-sm shrink-0"
                          style={{ borderColor: player.color, backgroundColor: `${player.color}22` }}
                        >
                          {player.avatar}
                        </div>

                        <input
                          type="text"
                          value={player.name}
                          onChange={e => handleUpdatePlayerDraft(idx, { name: e.target.value })}
                          placeholder={`Player ${idx + 1}`}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 font-bold focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Workout Recap Summary Card */}
              <div className="p-4 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 rounded-2xl border border-amber-500/30 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
                    {t('summaryTitle')}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-bold">MODE</span>
                    <span className="text-white font-extrabold">
                      {t(workoutMode === 'easy' ? 'modeEasyTitle' : 'modeNormalTitle')}
                      {playerCount > 1 ? ` · ${playerCount} Players` : ''}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-bold">{t('summaryTarget')}</span>
                    <span className="text-amber-400 font-extrabold">
                      {targetGoal} {t('pushupsUnit')}{playerCount > 1 ? ` / ${t('perPlayer')}` : ''}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 text-center font-bold pt-2">
                  🎯 {t('readyToStart')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={goToPrevStep}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              {t('prevStep')}
            </button>
          ) : !isInitialLaunch && onClose ? (
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
            onClick={goToNextStep}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {step === totalSteps ? (
              <>
                <Check className="w-4 h-4" />
                {t('startGameBtn')}
              </>
            ) : (
              <>
                <span>{t('nextStep')}</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
