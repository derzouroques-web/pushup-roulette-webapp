import React from 'react';
import type { Player, GameSettings } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getWorkoutTargetPushups } from '../utils/constants';
import { Target, Dumbbell, Users, RotateCcw, Flame, Feather } from 'lucide-react';

interface WorkoutProgressHUDProps {
  player: Player;
  players: Player[];
  settings: GameSettings;
  eliminatedNumbers: Set<number>;
  onOpenSetupModal: () => void;
  isSpinning?: boolean;
  onStartSpin?: () => void;
}

export const WorkoutProgressHUD: React.FC<WorkoutProgressHUDProps> = ({
  player,
  players,
  settings,
  eliminatedNumbers,
  onOpenSetupModal,
  isSpinning = false,
  onStartSpin,
}) => {
  const { t } = useLanguage();

  const isSolo = players.length === 1;
  const targetPushups = getWorkoutTargetPushups(settings);
  const currentPushups = player.totalPushups;
  const progressPercent = Math.min(100, Math.round((currentPushups / targetPushups) * 100));
  const repsLeft = Math.max(0, targetPushups - currentPushups);

  // Mode badge helper
  const getModeBadge = () => {
    const isEasy = settings.workoutMode === 'easy';
    const playersPrefix = isSolo ? '' : `${players.length}× `;
    return {
      icon: !isSolo
        ? <Users className={`w-3 h-3 ${isEasy ? 'text-sky-400' : 'text-amber-400'}`} />
        : isEasy
        ? <Feather className="w-3 h-3 text-sky-400" />
        : <Dumbbell className="w-3 h-3 text-amber-400" />,
      label: `${playersPrefix}${t(isEasy ? 'modeEasyBadge' : 'modeNormalBadge')} · ${targetPushups}`,
      color: isEasy
        ? 'bg-sky-500/15 border-sky-500/30 text-sky-300'
        : 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    };
  };

  const badge = getModeBadge();

  return (
    <div className="bg-slate-900/90 rounded-2xl p-3 sm:p-3.5 border border-slate-800/90 shadow-lg flex flex-col gap-2.5">
      {/* Top Row: Active Spinner + Mode Badge + Spin Action Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl border shadow-sm shrink-0"
            style={{ borderColor: player.color, backgroundColor: `${player.color}22` }}
          >
            {player.avatar}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-sm sm:text-base font-black text-white leading-tight truncate">
                {player.name}
              </h2>
              <button
                onClick={onOpenSetupModal}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-extrabold uppercase tracking-wide hover:brightness-125 transition-all cursor-pointer ${badge.color}`}
                title={t('changeGameSetup')}
              >
                {badge.icon}
                <span>{badge.label}</span>
                <RotateCcw className="w-2.5 h-2.5 opacity-60 ml-0.5" />
              </button>
            </div>
            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
              {t('currentSpinner')}
            </span>
          </div>
        </div>

        {onStartSpin && (
          <button
            onClick={onStartSpin}
            disabled={isSpinning}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              isSpinning
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:brightness-110 shadow-amber-500/20 active:scale-95'
            }`}
          >
            <span>{isSpinning ? t('spinning') : t('spinWheel')}</span>
          </button>
        )}
      </div>

      {/* Lightweight Pushups Progress Reminder ("Léger Rappel") */}
      <div className="pt-2 border-t border-slate-800/70 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-300">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-slate-400 uppercase font-extrabold">Progression :</span>
            <span className="text-white font-black text-xs sm:text-sm">
              {currentPushups} / {targetPushups} <span className="text-[10px] text-amber-400 font-bold">pompes</span>
            </span>
          </div>
          <span
            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              progressPercent >= 100
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
          >
            {progressPercent}%
          </span>
        </div>

        {/* Thin Sleek Glowing Progress Bar */}
        <div className="w-full h-2 bg-slate-950 rounded-full border border-slate-800 overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm shadow-amber-500/40"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Micro Sub-indicators */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <span>
            {progressPercent >= 100
              ? '🎉 ' + t('goalReached')
              : t('repsRemaining').replace('{count}', repsLeft.toString())}
          </span>
          <div className="flex items-center gap-2 text-[10px]">
            {player.streak > 0 && (
              <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                <Flame className="w-3 h-3" /> {player.streak}
              </span>
            )}
            <span>{player.totalSpins} spins</span>
            <span className="opacity-60">•</span>
            <span className="text-slate-400">{37 - eliminatedNumbers.size} numéros</span>
          </div>
        </div>
      </div>
    </div>
  );
};
