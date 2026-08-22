import React from 'react';
import type { SpinResult } from '../types';
import { RED_NUMBERS } from '../utils/constants';
import { History, Flame } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HistoryLogProps {
  history: SpinResult[];
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ history }) => {
  const { t } = useLanguage();

  if (history.length === 0) {
    return (
      <div className="bg-slate-900/80 rounded-2xl p-8 border border-slate-800/80 text-center flex flex-col items-center justify-center gap-2 text-slate-400">
        <History className="w-8 h-8 text-slate-600 mb-1" />
        <h4 className="font-bold text-white">{t('noHistory')}</h4>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-slate-800/80 shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <History className="w-4 h-4 text-amber-400" /> {t('historyTitle')} ({history.length})
        </h3>
      </div>

      {/* Trade Republic Style Timeline List Feed */}
      <div className="flex flex-col gap-2.5">
        {[...history].reverse().map((spin, idx) => {
          const isRed = RED_NUMBERS.has(spin.number);
          const isZero = spin.number === 0;

          return (
            <div
              key={spin.id}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              {/* Left: Number Pocket + Player Name */}
              <div className="flex items-center gap-3">
                <span
                  className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shrink-0 border ${
                    isZero
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-sm'
                      : isRed
                      ? 'bg-red-600 border-red-400 text-white shadow-sm'
                      : 'bg-slate-900 border-slate-700 text-amber-300'
                  }`}
                >
                  {spin.number}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-white text-sm">{spin.playerName}</h4>
                    {spin.sideBet && spin.sideBet !== 'none' && (
                      <span
                        className={`px-1.5 py-0.2 rounded-md text-[10px] font-black uppercase ${
                          spin.sideBetWon
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {spin.sideBet} {spin.sideBetWon ? 'Win' : 'Loss'}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    #{history.length - idx} • {new Date(spin.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Right: Reps & Status */}
              <div className="flex flex-col items-end gap-0.5">
                <span className="font-black text-amber-400 text-sm flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" /> {spin.pushupsDone} / {spin.pushupsAssigned}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {spin.status === 'completed' && <span className="text-emerald-400">{t('completed')}</span>}
                  {spin.status === 'partial' && <span className="text-amber-400">{t('partial')}</span>}
                  {spin.status === 'passed' && <span className="text-slate-500">{t('passed')}</span>}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
