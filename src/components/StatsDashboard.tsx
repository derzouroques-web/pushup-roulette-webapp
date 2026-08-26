import React from 'react';
import type { Player, SpinResult, GameSettings } from '../types';
import { RED_NUMBERS } from '../utils/constants';
import { Flame, Trophy, Zap, PieChart, Target } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface StatsDashboardProps {
  players: Player[];
  history: SpinResult[];
  settings?: GameSettings;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ players, history, settings }) => {
  const { t } = useLanguage();
  const totalSessionPushups = history.reduce((acc, s) => acc + s.pushupsDone, 0);
  const totalSpins = history.length;
  const targetGoal = settings?.targetRepsGoal;
  const goalPercent = targetGoal && targetGoal > 0 ? Math.min(100, Math.round((totalSessionPushups / targetGoal) * 100)) : null;

  // Find MVP (player with most total pushups)
  const mvp = [...players].sort((a, b) => b.totalPushups - a.totalPushups)[0];

  // Frequency count for hot/cold numbers
  const freq = new Map<number, number>();
  history.forEach(s => freq.set(s.number, (freq.get(s.number) || 0) + 1));

  // Sort numbers by hit count
  const sortedNumbers = Array.from({ length: 37 }, (_, i) => i)
    .map(num => ({ num, count: freq.get(num) || 0 }))
    .sort((a, b) => b.count - a.count);

  const hotNumbers = sortedNumbers.filter(n => n.count > 0).slice(0, 5);
  const coldNumbers = sortedNumbers.filter(n => n.count === 0).slice(0, 5);

  // Red vs Black vs Green totals
  let redPushups = 0;
  let blackPushups = 0;
  let greenPushups = 0;

  history.forEach(s => {
    if (s.number === 0) greenPushups += s.pushupsDone;
    else if (RED_NUMBERS.has(s.number)) redPushups += s.pushupsDone;
    else blackPushups += s.pushupsDone;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Target Goal Progress Banner if active */}
      {goalPercent !== null && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-slate-900 border border-amber-500/30 flex flex-col gap-2.5 shadow-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Target className="w-4 h-4 text-amber-400" /> {t('targetGoalProgress')}
            </span>
            <span className="font-black text-white text-sm">
              {totalSessionPushups} / {targetGoal} reps ({goalPercent}%)
            </span>
          </div>

          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-700 shadow"
              style={{ width: `${goalPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 font-medium">
            {goalPercent >= 100
              ? t('goalReached')
              : t('repsRemaining').replace('{count}', Math.max(0, (targetGoal || 100) - totalSessionPushups).toString())}
          </p>
        </div>
      )}

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800/80 shadow-lg flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">{t('totalPushupsOverall')}</span>
            <h3 className="text-2xl font-black text-white">{totalSessionPushups}</h3>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800/80 shadow-lg flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/15 text-yellow-400 flex items-center justify-center border border-yellow-500/30 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">{t('leaderboard')}</span>
            <h3 className="text-base font-extrabold text-white flex items-center gap-1.5 truncate">
              <span>{mvp?.avatar}</span> {mvp?.name || 'N/A'}
            </h3>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800/80 shadow-lg flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">{t('avgPushupsPerSpin')}</span>
            <h3 className="text-2xl font-black text-white">
              {totalSpins > 0 ? (totalSessionPushups / totalSpins).toFixed(1) : 0}
            </h3>
          </div>
        </div>
      </div>

      {/* Hot & Cold Numbers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Hot & Cold Numbers */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800/80 flex flex-col gap-3">
          <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500" /> Hot & Cold Pockets
          </h4>
          <div className="flex flex-col gap-2">
            <div>
              <span className="text-[11px] text-amber-400 font-extrabold uppercase tracking-wider block mb-1">🔥 Hot Landed:</span>
              <div className="flex flex-wrap gap-2">
                {hotNumbers.length > 0 ? (
                  hotNumbers.map(n => (
                    <div key={n.num} className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800">
                      <span
                        className={`w-5 h-5 rounded-full font-black text-[11px] flex items-center justify-center ${
                          n.num === 0 ? 'bg-emerald-600 text-white' : RED_NUMBERS.has(n.num) ? 'bg-red-600 text-white' : 'bg-slate-900 text-amber-300'
                        }`}
                      >
                        {n.num}
                      </span>
                      <span className="text-xs text-slate-300 font-bold">{n.count}x</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No hot numbers yet</p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] text-blue-400 font-extrabold uppercase tracking-wider block mb-1">❄️ Unlanded Cold:</span>
              <div className="flex flex-wrap gap-1.5">
                {coldNumbers.map(n => (
                  <span
                    key={n.num}
                    className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center border ${
                      n.num === 0 ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : RED_NUMBERS.has(n.num) ? 'bg-red-950 text-red-300 border-red-800' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {n.num}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pushup Color Breakdown */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800/80 flex flex-col gap-3">
          <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-400" /> {t('pushupsDistribution')}
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30">
              <span className="block font-extrabold text-red-400 text-[11px]">{t('redNumbers')}</span>
              <span className="text-xl font-black text-white mt-1 block">{redPushups}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="block font-extrabold text-slate-300 text-[11px]">{t('blackNumbers')}</span>
              <span className="text-xl font-black text-white mt-1 block">{blackPushups}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
              <span className="block font-extrabold text-emerald-400 text-[11px]">{t('greenZero')}</span>
              <span className="text-xl font-black text-white mt-1 block">{greenPushups}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
