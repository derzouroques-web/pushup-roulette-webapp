import React from 'react';
import type { Player, GameSettings } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Trophy, Target, Sparkles, LayoutGrid, Dumbbell, ShieldAlert, Users, RotateCcw } from 'lucide-react';

interface WorkoutProgressHUDProps {
  player: Player;
  players: Player[];
  settings: GameSettings;
  eliminatedNumbers: Set<number>;
  onOpenSetupModal: () => void;
}

export const WorkoutProgressHUD: React.FC<WorkoutProgressHUDProps> = ({
  player,
  players,
  settings,
  eliminatedNumbers,
  onOpenSetupModal,
}) => {
  const { t } = useLanguage();

  const isSolo = players.length === 1;
  const isTargetGoal = Boolean(settings.targetRepsGoal && settings.targetRepsGoal > 0);

  // Calculate board clearance metrics
  const totalModePockets = settings.halfBoardMode && settings.halfBoardMode !== 'none' ? 19 : 37;
  const activePocketsCount = Math.max(0, 37 - eliminatedNumbers.size);
  const clearedPocketsCount = Math.min(totalModePockets, Math.max(0, totalModePockets - activePocketsCount));
  const boardPercent = Math.min(100, Math.round((clearedPocketsCount / totalModePockets) * 100));

  // Calculate target goal metrics
  const targetGoal = settings.targetRepsGoal || 100;
  const goalPercent = Math.min(100, Math.round((player.totalPushups / targetGoal) * 100));
  const repsLeft = Math.max(0, targetGoal - player.totalPushups);

  // Calculate remaining pool pushups
  const remainingPoolPushups = Array.from({ length: 37 }, (_, i) => i)
    .filter(n => !eliminatedNumbers.has(n))
    .reduce((a, b) => a + b, 0);

  // Mode badge helper
  const getModeBadge = () => {
    if (!isSolo) {
      return {
        icon: <Users className="w-3.5 h-3.5 text-blue-400" />,
        label: t('modeMultiplayerBadge').replace('{count}', players.length.toString()),
        color: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
      };
    }
    if (settings.soloPreset === 'casual') {
      return {
        icon: <Dumbbell className="w-3.5 h-3.5 text-amber-400" />,
        label: `${t('modeCasualBadge')}${settings.halfBoardMode && settings.halfBoardMode !== 'none' ? ' • ½ Board' : ''}`,
        color: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
      };
    }
    if (settings.soloPreset === 'standard') {
      return {
        icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" />,
        label: t('modeStandardBadge'),
        color: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
      };
    }
    if (settings.soloPreset === 'target') {
      return {
        icon: <Target className="w-3.5 h-3.5 text-yellow-400" />,
        label: `${t('modeTargetBadge')} (${targetGoal} Reps)`,
        color: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300',
      };
    }
    if (settings.soloPreset === 'gauntlet') {
      return {
        icon: <ShieldAlert className="w-3.5 h-3.5 text-red-400" />,
        label: t('modeGauntletBadge'),
        color: 'bg-red-500/15 border-red-500/30 text-red-300',
      };
    }
    return {
      icon: <Trophy className="w-3.5 h-3.5 text-amber-400" />,
      label: 'Pushup Roulette',
      color: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    };
  };

  const badge = getModeBadge();

  return (
    <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800/90 shadow-xl flex flex-col gap-3.5">
      {/* Top Mode Header with Setup trigger */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-black uppercase tracking-wider ${badge.color}`}>
            {badge.icon}
            <span>{badge.label}</span>
          </div>
        </div>

        <button
          onClick={onOpenSetupModal}
          className="text-[11px] font-bold text-slate-400 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t('changeGameSetup')}</span>
        </button>
      </div>

      {/* Main Dynamic Progress Bar */}
      {isTargetGoal ? (
        /* 🎯 TARGET REPS GOAL PROGRESS */
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <Target className="w-4 h-4 text-amber-400" />
              <span>{t('targetGoalProgress')}:</span>
              <strong className="text-white font-extrabold text-sm">{player.totalPushups} / {targetGoal}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                goalPercent >= 100
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {goalPercent}%
              </span>
            </div>
          </div>

          {/* Glowing Animated Bar */}
          <div className="relative w-full h-3.5 bg-slate-950 rounded-full border border-slate-800 overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full transition-all duration-700 shadow-md shadow-amber-500/30"
              style={{ width: `${goalPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>
              {goalPercent >= 100
                ? t('goalReached')
                : t('repsRemaining').replace('{count}', repsLeft.toString())}
            </span>
            <span className="opacity-75">Milestone Target: {targetGoal}</span>
          </div>
        </div>
      ) : (
        /* 🎲 BOARD CLEARANCE PROGRESS */
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <LayoutGrid className="w-4 h-4 text-amber-400" />
              <span>{t('boardClearanceProgress')}:</span>
              <strong className="text-white font-extrabold text-sm">
                {clearedPocketsCount} / {totalModePockets}
              </strong>
            </div>
            <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
              boardPercent >= 100
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {boardPercent}%
            </span>
          </div>

          {/* Board Clearance Progress Bar */}
          <div className="relative w-full h-3.5 bg-slate-950 rounded-full border border-slate-800 overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full transition-all duration-700 shadow-md shadow-amber-500/30"
              style={{ width: `${boardPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>
              {boardPercent >= 100
                ? t('boardCompleted')
                : t('pocketsCleared').replace('{cleared}', clearedPocketsCount.toString()).replace('{total}', totalModePockets.toString())}
            </span>
            <span>
              {t('poolRepsRemaining').replace('{count}', remainingPoolPushups.toString())}
            </span>
          </div>
        </div>
      )}

      {/* Quick Session Stats Chips */}
      <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-800/60 text-center">
        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Reps</span>
          <span className="text-sm font-black text-amber-400">{player.totalPushups}</span>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Streak</span>
          <span className="text-sm font-black text-emerald-400">🔥 {player.streak}</span>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Spins</span>
          <span className="text-sm font-black text-white">{player.totalSpins}</span>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Max Spin</span>
          <span className="text-sm font-black text-yellow-400">{player.maxSingleSpin}</span>
        </div>
      </div>
    </div>
  );
};
