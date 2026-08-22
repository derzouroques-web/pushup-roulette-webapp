import React from 'react';
import type { GameView } from '../types';
import { Dices, History, BarChart3 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MobileBottomNavProps {
  activeTab: GameView;
  onSelectTab: (tab: GameView) => void;
  historyCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  historyCount,
}) => {
  const { t } = useLanguage();

  const tabs: Array<{ id: GameView; label: string; icon: React.ReactNode; badge?: number }> = [
    { id: 'game', label: t('tabGame'), icon: <Dices className="w-5 h-5" /> },
    { id: 'history', label: t('tabHistory'), icon: <History className="w-5 h-5" />, badge: historyCount },
    { id: 'stats', label: t('tabStats'), icon: <BarChart3 className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-4 py-2 flex items-center justify-around shadow-2xl">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer relative ${
              isActive
                ? 'text-amber-400 font-extrabold'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <div className="relative">
              {tab.icon}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-sm">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] tracking-tight">{tab.label}</span>

            {/* Active Indicator Bar */}
            {isActive && (
              <span className="w-4 h-0.5 rounded-full bg-amber-400 absolute -bottom-1 shadow-glow" />
            )}
          </button>
        );
      })}
    </div>
  );
};
