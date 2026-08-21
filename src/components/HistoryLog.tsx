import React from 'react';
import type { SpinResult } from '../types';
import { RED_NUMBERS } from '../utils/constants';
import { History, CheckCircle2, AlertCircle, XCircle, Flame, Coins } from 'lucide-react';

interface HistoryLogProps {
  history: SpinResult[];
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 border border-slate-700/60 text-center flex flex-col items-center justify-center gap-2 text-slate-400">
        <History className="w-8 h-8 text-slate-600 mb-1" />
        <h4 className="font-bold text-white">No Spin History Yet</h4>
        <p className="text-xs">Spin the wheel to log pushup sets for your session!</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-amber-400" /> Spin History ({history.length} spins)
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase bg-slate-900/80 text-slate-400 border-b border-slate-700">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Player</th>
              <th className="p-3">Landed</th>
              <th className="p-3">Side Bet</th>
              <th className="p-3">Pushups Done</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {[...history].reverse().map((spin, idx) => {
              const isRed = RED_NUMBERS.has(spin.number);
              const isZero = spin.number === 0;

              return (
                <tr key={spin.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono text-xs text-slate-500">{history.length - idx}</td>
                  <td className="p-3 font-bold text-white">{spin.playerName}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs ${
                        isZero
                          ? 'bg-emerald-600 text-white'
                          : isRed
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-900 text-amber-300 border border-slate-700'
                      }`}
                    >
                      {spin.number}
                    </span>
                  </td>
                  <td className="p-3">
                    {spin.sideBet && spin.sideBet !== 'none' ? (
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase border ${
                          spin.sideBetWon
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-red-500/20 text-red-300 border-red-500/40'
                        }`}
                      >
                        <Coins className="w-3 h-3" />
                        {spin.sideBet} ({spin.sideBetWon ? 'Win 0.5x' : 'Loss 1.5x'})
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500 italic">None</span>
                    )}
                  </td>
                  <td className="p-3 font-semibold">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Flame className="w-3.5 h-3.5" /> {spin.pushupsDone} / {spin.pushupsAssigned}
                    </span>
                  </td>
                  <td className="p-3">
                    {spin.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <CheckCircle2 className="w-3 h-3" /> Done
                      </span>
                    )}
                    {spin.status === 'partial' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        <AlertCircle className="w-3 h-3" /> Partial
                      </span>
                    )}
                    {spin.status === 'passed' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                        <XCircle className="w-3 h-3" /> Skipped
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
