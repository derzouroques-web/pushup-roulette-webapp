import React from 'react';
import type { Player, SpinResult } from '../types';
import { RED_NUMBERS } from '../utils/constants';
import { Flame, Trophy, Zap, PieChart } from 'lucide-react';

interface StatsDashboardProps {
  players: Player[];
  history: SpinResult[];
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ players, history }) => {
  const totalSessionPushups = history.reduce((acc, s) => acc + s.pushupsDone, 0);
  const totalSpins = history.length;

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
    <div className="flex flex-col gap-6">
      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Session Reps</span>
            <h3 className="text-3xl font-black text-white">{totalSessionPushups}</h3>
            <span className="text-[10px] text-amber-400">Across {totalSpins} spins</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center border border-yellow-500/30">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Current Leader</span>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-1.5">
              <span>{mvp?.avatar}</span> {mvp?.name || 'N/A'}
            </h3>
            <span className="text-[10px] text-yellow-400">{mvp?.totalPushups || 0} pushups completed</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Avg Reps / Spin</span>
            <h3 className="text-3xl font-black text-white">
              {totalSpins > 0 ? (totalSessionPushups / totalSpins).toFixed(1) : 0}
            </h3>
            <span className="text-[10px] text-emerald-400">Pace per turn</span>
          </div>
        </div>
      </div>

      {/* Hot & Cold Numbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hot & Cold Numbers */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 flex flex-col gap-3">
          <h4 className="font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500" /> Hot & Cold Pockets
          </h4>
          <div className="flex flex-col gap-2">
            <div>
              <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block mb-1">🔥 Hot Landed:</span>
              <div className="flex flex-wrap gap-2">
                {hotNumbers.length > 0 ? (
                  hotNumbers.map(n => (
                    <div key={n.num} className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700">
                      <span
                        className={`w-5 h-5 rounded-full font-bold text-[11px] flex items-center justify-center ${
                          n.num === 0 ? 'bg-emerald-600 text-white' : RED_NUMBERS.has(n.num) ? 'bg-red-600 text-white' : 'bg-slate-950 text-amber-300'
                        }`}
                      >
                        {n.num}
                      </span>
                      <span className="text-xs text-slate-300 font-semibold">{n.count}x</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No hot numbers yet</p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] text-blue-400 font-bold uppercase tracking-wider block mb-1">❄️ Unlanded Cold:</span>
              <div className="flex flex-wrap gap-1.5">
                {coldNumbers.map(n => (
                  <span
                    key={n.num}
                    className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center border ${
                      n.num === 0 ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : RED_NUMBERS.has(n.num) ? 'bg-red-950 text-red-300 border-red-800' : 'bg-slate-900 text-slate-400 border-slate-700'
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
        <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 flex flex-col gap-3">
          <h4 className="font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-400" /> Reps by Color Category
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40">
              <span className="block font-bold text-red-400">Red Pockets</span>
              <span className="text-lg font-black text-white">{redPushups}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
              <span className="block font-bold text-slate-300">Black Pockets</span>
              <span className="text-lg font-black text-white">{blackPushups}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40">
              <span className="block font-bold text-emerald-400">Green Zero</span>
              <span className="text-lg font-black text-white">{greenPushups}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
