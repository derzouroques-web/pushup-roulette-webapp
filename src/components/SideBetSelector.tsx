import React from 'react';
import type { SideBetType } from '../types';
import { Coins, TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SideBetSelectorProps {
  selectedBet: SideBetType;
  onSelectBet: (bet: SideBetType) => void;
  disabled?: boolean;
}

export const SideBetSelector: React.FC<SideBetSelectorProps> = ({
  selectedBet,
  onSelectBet,
  disabled = false,
}) => {
  const { t } = useLanguage();

  const bets: Array<{ id: SideBetType; title: string; subtitle: string; icon: string; bgClass: string }> = [
    { id: 'none', title: t('betNoneTitle'), subtitle: t('betNoneSubtitle'), icon: '🛡️', bgClass: 'bg-slate-900 border-slate-700 text-slate-300' },
    { id: 'red', title: t('betRedTitle'), subtitle: t('betRedSubtitle'), icon: '🔴', bgClass: 'bg-red-950/90 border-red-500/70 text-red-200' },
    { id: 'black', title: t('betBlackTitle'), subtitle: t('betBlackSubtitle'), icon: '🖤', bgClass: 'bg-slate-950 border-slate-700 text-gray-100' },
    { id: 'odd', title: t('betOddTitle'), subtitle: t('betOddSubtitle'), icon: '⚡', bgClass: 'bg-amber-950/90 border-amber-500/70 text-amber-200' },
    { id: 'even', title: t('betEvenTitle'), subtitle: t('betEvenSubtitle'), icon: '🔢', bgClass: 'bg-emerald-950/90 border-emerald-500/70 text-emerald-200' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-4 border border-amber-500/30 shadow-xl flex flex-col gap-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-amber-400" />
          <h4 className="text-base font-black text-white flex items-center gap-2">
            <span>{t('sideBetTitle')}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase font-extrabold tracking-wider">
              {t('riskReward')}
            </span>
          </h4>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/30">
            <TrendingDown className="w-3.5 h-3.5" /> {t('sideBetWin')}
          </span>
          <span className="text-red-400 flex items-center gap-1 bg-red-950/60 px-2 py-0.5 rounded-lg border border-red-500/30">
            <TrendingUp className="w-3.5 h-3.5" /> {t('sideBetLose')}
          </span>
        </div>
      </div>

      {/* Side Bet Choice Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {bets.map(bet => {
          const isSelected = selectedBet === bet.id;

          return (
            <button
              key={bet.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectBet(bet.id)}
              className={`p-3 min-h-[105px] rounded-2xl border transition-all flex flex-col items-center justify-between cursor-pointer ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isSelected
                  ? 'ring-2 ring-amber-400 scale-105 shadow-xl shadow-amber-500/25 bg-gradient-to-b from-amber-500/30 via-slate-900 to-slate-950 border-amber-400 text-white'
                  : `${bet.bgClass} hover:border-slate-500`
              }`}
            >
              <span className="text-2xl mt-0.5">{bet.icon}</span>
              <div className="flex flex-col items-center gap-0.5 my-1">
                <span className="text-sm font-black tracking-wide text-white leading-tight">{bet.title}</span>
                <span className="text-[11px] font-semibold text-slate-300 leading-tight">{bet.subtitle}</span>
              </div>

              {isSelected && bet.id !== 'none' ? (
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black uppercase tracking-tighter shadow">
                  {t('betActive')}
                </span>
              ) : (
                <span className="h-4" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

