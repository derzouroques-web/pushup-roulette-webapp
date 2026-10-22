import React, { useState } from 'react';
import type { Player, GameSettings } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { DEFAULT_AVATARS, PLAYER_COLORS } from '../utils/constants';
import { Users, Target, Check, X } from 'lucide-react';

interface WelcomeSetupModalProps {
  currentPlayers: Player[];
  currentSettings: GameSettings;
  onConfirmSetup: (newPlayers: Player[], newSettings: Partial<GameSettings>) => void;
  onClose?: () => void;
  isInitialLaunch?: boolean;
}

const createPlayer = (index: number): Player => ({
  id: `p${index + 1}`,
  name: `Player ${index + 1}`,
  avatar: DEFAULT_AVATARS[index % DEFAULT_AVATARS.length],
  color: PLAYER_COLORS[index % PLAYER_COLORS.length],
  totalPushups: 0,
  totalSpins: 0,
  completedSpins: 0,
  maxSingleSpin: 0,
  streak: 0,
});

export const WelcomeSetupModal: React.FC<WelcomeSetupModalProps> = ({
  currentPlayers,
  currentSettings,
  onConfirmSetup,
  onClose,
  isInitialLaunch = false,
}) => {
  const { t } = useLanguage();

  const [playerCount, setPlayerCount] = useState<number>(currentPlayers.length || 1);
  const [targetGoal, setTargetGoal] = useState<number>(currentSettings.targetRepsGoal || 100);

  const handleStart = () => {
    // Keep existing players (names/avatars), add or trim to match the chosen count
    const players = Array.from({ length: playerCount }, (_, i) => currentPlayers[i] ?? createPlayer(i));
    onConfirmSetup(players, { targetRepsGoal: targetGoal });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-600/20 via-yellow-600/20 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-xl shadow-md border border-yellow-200/40 shrink-0">
              🎰
            </div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              {t('onboardingWelcome')}
            </h2>
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

        <div className="p-5 sm:p-6 space-y-5">
          {/* Number of Players */}
          <div className="space-y-2.5">
            <label className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> {t('playerCountLabel')}
            </label>
            <div className="grid grid-cols-8 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPlayerCount(num)}
                  className={`h-10 rounded-xl font-black text-sm transition-all cursor-pointer ${
                    playerCount === num
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Total Pushups */}
          <div className="space-y-2.5">
            <label className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> {t('targetGoalLabel')}
              {playerCount > 1 && <span className="text-slate-400 normal-case">({t('perPlayer')})</span>}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {[50, 100, 150, 200, 250, 300].map(goal => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => setTargetGoal(goal)}
                  className={`h-10 rounded-xl font-black text-sm transition-all cursor-pointer ${
                    targetGoal === goal
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="1"
              max="1000"
              value={targetGoal}
              onChange={e => setTargetGoal(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-center text-lg text-amber-400 font-black focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Start */}
        <div className="p-5 bg-slate-950/90 border-t border-slate-800">
          <button
            type="button"
            onClick={handleStart}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-sm uppercase tracking-wider hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            {t('startGameBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};
