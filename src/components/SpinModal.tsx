import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import type { Player, GameSettings, SideBetType } from '../types';
import { RED_NUMBERS, getWorkoutTargetPushups } from '../utils/constants';
import { Flame, CheckCircle, SkipForward, Timer, Gift, X, Trophy, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SpinModalProps {
  landedNumber: number;
  player: Player;
  settings: GameSettings;
  sideBet?: SideBetType;
  onLogResult: (pushupsDone: number, status: 'completed' | 'partial' | 'passed') => void;
  onStartRestTimer: () => void;
  onClose: () => void;
}

export const SpinModal: React.FC<SpinModalProps> = ({
  landedNumber,
  player,
  settings,
  sideBet = 'none',
  onLogResult,
  onStartRestTimer,
  onClose,
}) => {
  const { t } = useLanguage();
  const isRed = RED_NUMBERS.has(landedNumber);
  const isZero = landedNumber === 0;

  // Evaluate side bet outcome
  let sideBetWon: boolean | undefined = undefined;
  let sideBetMultiplier = 1.0;

  if (sideBet && sideBet !== 'none') {
    if (sideBet === 'red') {
      sideBetWon = isRed;
    } else if (sideBet === 'black') {
      sideBetWon = !isRed && !isZero;
    } else if (sideBet === 'odd') {
      sideBetWon = !isZero && (landedNumber % 2 !== 0);
    } else if (sideBet === 'even') {
      sideBetWon = !isZero && (landedNumber % 2 === 0);
    } else if (sideBet === 'low') {
      sideBetWon = landedNumber >= 1 && landedNumber <= 18;
    } else if (sideBet === 'high') {
      sideBetWon = landedNumber >= 19 && landedNumber <= 36;
    }

    sideBetMultiplier = sideBetWon ? 0.5 : 1.5;
  }

  // Combined multiplier calculation
  const effectiveMultiplier = settings.multiplier * player.difficultyMultiplier * sideBetMultiplier;
  let baseTarget = landedNumber * effectiveMultiplier;
  if (settings.maxRepCap > 0 && baseTarget > settings.maxRepCap) {
    baseTarget = settings.maxRepCap;
  }
  const targetPushups = Math.round(baseTarget);

  const [customReps, setCustomReps] = useState<number>(targetPushups);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCompleteFull = () => {
    // Trigger festive confetti burst
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#ef4444', '#ffffff']
    });

    onLogResult(targetPushups, 'completed');
  };

  const handleCompletePartial = () => {
    onLogResult(customReps, 'partial');
  };

  const handlePass = () => {
    onLogResult(0, 'passed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 max-w-lg w-full border border-slate-800 shadow-2xl flex flex-col items-center text-center gap-4 relative max-h-[90vh] overflow-y-auto">
        {/* Grab Handle Bar for Mobile */}
        <div className="w-12 h-1 bg-slate-700 rounded-full sm:hidden mb-1" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Active Player Header */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-extrabold uppercase tracking-wider">
          <span>{player.avatar}</span>
          <span>{t('playerResult', { name: player.name })}</span>
        </div>

        {/* Big Landed Number Display */}
        <div className="relative my-1">
          <div
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center border-4 shadow-2xl transition-transform ${
              isZero
                ? 'bg-emerald-600 border-emerald-400 neon-glow-green text-white'
                : isRed
                ? 'bg-red-600 border-red-400 neon-glow-red text-white'
                : 'bg-slate-950 border-amber-500 neon-glow-gold text-amber-300'
            }`}
          >
            <span className="text-4xl sm:text-5xl font-black tracking-tighter drop-shadow-lg">{landedNumber}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-90 mt-0.5">
              {isZero ? t('greenZeroPocket') : isRed ? t('redPocket') : t('blackPocket')}
            </span>
          </div>
        </div>

        {/* Side Bet Outcome Alert Banner */}
        {sideBet !== 'none' && sideBetWon !== undefined && (
          <div
            className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left text-xs font-bold shadow-sm ${
              sideBetWon
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                : 'bg-red-950/80 border-red-500/50 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {sideBetWon ? (
                <Trophy className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <div>
                <span className="block font-black uppercase text-[11px]">
                  {sideBetWon ? t('sideBetWonHeader') : t('sideBetLostHeader')}
                </span>
                <span className="text-[11px] font-normal opacity-90">
                  {sideBetWon ? t('sideBetWonSub', { bet: sideBet }) : t('sideBetLostSub', { bet: sideBet })}
                </span>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded-lg text-[10px] font-black shrink-0 ${
                sideBetWon ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'
              }`}
            >
              {sideBetWon ? '0.5x' : '1.5x'}
            </span>
          </div>
        )}

        {/* Pushups Challenge Banner */}
        {isZero ? (
          <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-2xl p-3.5 w-full text-emerald-200">
            <div className="flex items-center justify-center gap-2 text-base font-extrabold text-emerald-300 mb-0.5">
              <Gift className="w-5 h-5" /> {t('zeroBonusTitle')}
            </div>
            <p className="text-xs text-emerald-300/80">
              {t('zeroBonusDesc')}
            </p>
          </div>
        ) : (
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 w-full flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2 text-2xl font-black text-amber-400">
              <Flame className="w-6 h-6 text-amber-500" />
              <span>{targetPushups} {t('targetPushups')}</span>
            </div>

            {/* Workout Goal Pushup Progress Preview */}
            {(() => {
              const workoutGoal = getWorkoutTargetPushups(settings, 1);
              const nextTotal = player.totalPushups + targetPushups;
              const nextPercent = Math.min(100, Math.round((nextTotal / workoutGoal) * 100));

              return (
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" /> Objectif:
                  </span>
                  <span className="text-amber-300">
                    {nextTotal >= workoutGoal
                      ? t('spinGoalReachedPreview')
                      : t('spinGoalPreview')
                          .replace('{reps}', targetPushups.toString())
                          .replace('{next}', nextTotal.toString())
                          .replace('{goal}', workoutGoal.toString())
                          .replace('{percent}', nextPercent.toString())}
                  </span>
                </div>
              );
            })()}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full mt-1">
          {!isZero && !showCustomInput && (
            <button
              onClick={handleCompleteFull}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-black text-sm shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle className="w-5 h-5" />
              {t('completeReps', { count: targetPushups })}
            </button>
          )}

          {!isZero && showCustomInput && (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
              <label className="text-xs text-slate-300 font-semibold">{t('customAmount')}:</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={customReps}
                  onChange={(e) => setCustomReps(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-center font-bold text-lg"
                />
                <button
                  onClick={handleCompletePartial}
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 cursor-pointer text-xs"
                >
                  {t('saveCustom')}
                </button>
              </div>
            </div>
          )}

          {!isZero && !showCustomInput && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowCustomInput(true)}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
              >
                {t('partialReps')}
              </button>
              <button
                onClick={handlePass}
                className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 text-xs font-bold border border-slate-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5" /> {t('passTurn')}
              </button>
            </div>
          )}

          {isZero && (
            <button
              onClick={handlePass}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-lg hover:brightness-110 transition-all cursor-pointer"
            >
              {t('zeroBonusTitle')} 🚀
            </button>
          )}

          {/* Quick Rest Timer Launcher */}
          <button
            onClick={onStartRestTimer}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Timer className="w-4 h-4" /> {t('startRestTimer', { seconds: settings.defaultRestTime })}
          </button>
        </div>
      </div>
    </div>
  );
};
