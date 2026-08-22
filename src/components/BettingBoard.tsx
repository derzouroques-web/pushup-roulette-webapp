import React from 'react';
import { RED_NUMBERS } from '../utils/constants';
import type { SpinResult } from '../types';
import { RotateCcw, LayoutGrid } from 'lucide-react';
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
    <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800/80 shadow-xl flex flex-col gap-3">
      {/* Header Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-amber-400 shrink-0" />
          <h3 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{t('boardTitle')}</span>
          </h3>
        </div>

        {/* Clean Stat Chips */}
        <div className="flex items-center gap-2 text-[11px] font-bold">
          <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300">
            Active: <strong className="text-emerald-400">{activeCount}/37</strong>
          </span>
          <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300 hidden sm:inline-block">
            Pool: <strong className="text-amber-400">{remainingTotalPushups} reps</strong>
          </span>

          {eliminationMode && (
            <button
              onClick={onResetPool}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-extrabold rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              {t('resetPool')}
            </button>
          )}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="flex flex-col gap-1.5">
        {/* Zero Header Button */}
        <button
          onClick={() => onToggleEliminate(0)}
          className={`relative py-2.5 rounded-xl font-black text-center transition-all border ${
            lastLandedNumber === 0
              ? 'ring-2 ring-yellow-400 scale-[1.01] z-10'
              : ''
          } ${
            eliminatedNumbers.has(0)
              ? 'bg-slate-950 text-slate-600 border-slate-800 line-through opacity-40'
              : 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40'
          }`}
        >
          <div className="flex items-center justify-center gap-2 text-sm">
            <span>0</span>
            <span className="text-[10px] uppercase font-bold opacity-80">(Bonus Rest)</span>
          </div>
          {frequencyMap.has(0) && (
            <span className="absolute top-1 right-2 px-1.5 py-0.2 text-[9px] bg-slate-950 text-emerald-300 rounded-full border border-emerald-500/30 font-bold">
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
                  className={`relative py-2.5 rounded-xl font-black text-base transition-all border flex items-center justify-center ${
                    isLastLanded ? 'ring-2 ring-yellow-400 scale-[1.02] z-10 shadow-lg' : ''
                  } ${
                    isEliminated
                      ? 'bg-slate-950 text-slate-600 border-slate-800 line-through opacity-40'
                      : isRed
                      ? 'bg-red-700/90 hover:bg-red-600 text-white border-red-500/40 shadow-sm'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-100 border-slate-800'
                  }`}
                >
                  <span>{num}</span>

                  {/* Hit count indicator badge */}
                  {hits > 0 && (
                    <span className="absolute top-1 right-1.5 px-1.5 py-0.2 text-[9px] bg-slate-900/90 text-amber-300 rounded-full border border-amber-500/30 font-bold">
                      ×{hits}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
