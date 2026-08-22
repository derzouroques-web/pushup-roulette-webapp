import React from 'react';
import type { SideBetType } from '../types';
import { Coins } from 'lucide-react';
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

  const bets: Array<{ id: SideBetType; title: string; icon: string; activeColor: string }> = [
    { id: 'none', title: t('betNoneTitle'), icon: '🛡️', activeColor: 'from-slate-700 to-slate-800 text-slate-100 border-slate-500' },
    { id: 'red', title: t('betRedTitle'), icon: '🔴', activeColor: 'from-red-600 to-red-800 text-white border-red-400' },
    { id: 'black', title: t('betBlackTitle'), icon: '🖤', activeColor: 'from-slate-800 to-slate-950 text-white border-slate-600' },
    { id: 'odd', title: t('betOddTitle'), icon: '⚡', activeColor: 'from-amber-600 to-amber-800 text-white border-amber-400' },
    { id: 'even', title: t('betEvenTitle'), icon: '🔢', activeColor: 'from-emerald-600 to-emerald-800 text-white border-emerald-400' },
  ];

  return (
    <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800/80 backdrop-blur-md shadow-lg flex flex-col gap-2.5">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
          <Coins className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{t('sideBetTitle')}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-bold">
          <span className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
            {t('sideBetWin')}
          </span>
          <span className="text-red-400 bg-red-950/80 px-2 py-0.5 rounded-full border border-red-500/30">
            {t('sideBetLose')}
          </span>
        </div>
      </div>

      {/* Segmented Pill Selector - Horizontal Scroll on Small Devices */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
        {bets.map(bet => {
          const isSelected = selectedBet === bet.id;

          return (
            <button
              key={bet.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectBet(bet.id)}
              className={`flex-1 min-w-[70px] sm:min-w-0 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer shrink-0 ${
                disabled ? 'opacity-40 cursor-not-allowed' : ''
              } ${
                isSelected
                  ? `bg-gradient-to-b ${bet.activeColor} shadow-lg scale-[1.02] ring-1 ring-white/30`
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="text-base leading-none">{bet.icon}</span>
              <span className="truncate max-w-[64px] text-[11px] leading-tight">{bet.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
