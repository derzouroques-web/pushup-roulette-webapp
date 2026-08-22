import React from 'react';
import { RED_NUMBERS } from '../utils/constants';
import type { SpinResult } from '../types';
import { RotateCcw, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BettingBoardProps {
  eliminatedNumbers: Set<number>;
  history: SpinResult[];
  eliminationMode: boolean;
  onToggleEliminate: (num: number) => void;
  onResetPool: () => void;
  lastLandedNumber?: number | null;
}

export const BettingBoard: React.FC<BettingBoardProps> = ({
  eliminatedNumbers,
  history,
  eliminationMode,
  onToggleEliminate,
  onResetPool,
  lastLandedNumber,
}) => {
  const { t } = useLanguage();

  // Count frequency of each number landed
  const frequencyMap = new Map<number, number>();
  history.forEach(spin => {
    frequencyMap.set(spin.number, (frequencyMap.get(spin.number) || 0) + 1);
  });

  // Numbers 1-36 in 12 rows of 3 columns
  const boardRows: number[][] = [];
  for (let i = 1; i <= 36; i += 3) {
    boardRows.push([i, i + 1, i + 2]);
  }

  const activeCount = 37 - eliminatedNumbers.size;
  const remainingTotalPushups = Array.from({ length: 37 }, (_, i) => i)
    .filter(n => !eliminatedNumbers.has(n))
    .reduce((a, b) => a + b, 0);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl flex flex-col gap-4">
      {/* Header Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🎰 {t('boardTitle')}</span>
            {eliminationMode && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {t('eliminationModeOn')}
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400">
            Pool: <strong className="text-emerald-400">{activeCount} / 37</strong> numbers active ({remainingTotalPushups} potential pushups in pool)
          </p>
        </div>

        {eliminationMode && (
          <button
            onClick={onResetPool}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t('resetPool')}
          </button>
        )}
      </div>

      {/* Grid Layout */}
      <div className="overflow-x-auto">
        <div className="min-w-[320px] flex flex-col gap-1.5">
          {/* Zero Header Button */}
          <button
            onClick={() => onToggleEliminate(0)}
            className={`relative py-3 rounded-lg font-bold text-center transition-all border ${
              lastLandedNumber === 0
                ? 'ring-2 ring-yellow-400 scale-[1.02] z-10'
                : ''
            } ${
              eliminatedNumbers.has(0)
                ? 'bg-slate-900/80 text-gray-600 border-slate-800 line-through opacity-50'
                : 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">0</span>
              <span className="text-[10px] uppercase font-normal opacity-80">(Bonus Rest)</span>
            </div>
            {frequencyMap.has(0) && (
              <span className="absolute top-1 right-2 px-1.5 py-0.2 text-[10px] bg-slate-950/80 text-emerald-300 rounded-full border border-emerald-500/30">
                ×{frequencyMap.get(0)}
              </span>
            )}
          </button>

          {/* 36 Numbers Grid */}
          <div className="grid grid-cols-3 gap-1.5">
            {boardRows.map(row =>
              row.map(num => {
                const isRed = RED_NUMBERS.has(num);
                const isEliminated = eliminatedNumbers.has(num);
                const isLastLanded = lastLandedNumber === num;
                const hits = frequencyMap.get(num) || 0;

                return (
                  <button
                    key={num}
                    onClick={() => onToggleEliminate(num)}
                    className={`relative py-3 rounded-lg font-bold text-lg transition-all border flex flex-col items-center justify-center ${
                      isLastLanded ? 'ring-2 ring-yellow-400 scale-105 z-10 shadow-lg shadow-yellow-500/20' : ''
                    } ${
                      isEliminated
                        ? 'bg-slate-900/90 text-slate-600 border-slate-800 line-through opacity-45'
                        : isRed
                        ? 'bg-red-700/90 hover:bg-red-600 text-white border-red-500/50 shadow-sm shadow-red-950'
                        : 'bg-slate-900 hover:bg-slate-800 text-gray-100 border-slate-700/80'
                    }`}
                  >
                    <span>{num}</span>

                    {/* Hit count indicator badge */}
                    {hits > 0 && (
                      <span className="absolute top-1 right-1.5 px-1.5 py-0.2 text-[9px] bg-slate-950/90 text-amber-300 rounded-full border border-amber-500/40">
                        ×{hits}
                      </span>
                    )}

                    {/* Removed icon status */}
                    {isEliminated && (
                      <span className="absolute bottom-1 text-[9px] text-red-400 no-underline font-semibold flex items-center gap-0.5">
                        <Trash2 className="w-2.5 h-2.5" /> Out
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Footer Legend */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/40">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-red-600 inline-block"></span> Red (18)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-slate-900 border border-slate-700 inline-block"></span> Black (18)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-emerald-600 inline-block"></span> Green (0)
          </span>
        </div>
        <p className="text-[11px] text-slate-400 italic">
          💡 Click any number to manually remove/restore from pool
        </p>
      </div>
    </div>
  );
};
