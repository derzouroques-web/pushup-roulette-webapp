import React, { useState } from 'react';
import type { Player } from '../types';
import { DEFAULT_AVATARS, PLAYER_COLORS } from '../utils/constants';
import { UserPlus, Trophy, Flame, Zap, Trash2, Crown, X, Target } from 'lucide-react';

interface PlayerManagerProps {
  players: Player[];
  activePlayerId: string;
  onSelectActivePlayer: (id: string) => void;
  onAddPlayer: (player: Omit<Player, 'id' | 'totalPushups' | 'totalSpins' | 'completedSpins' | 'maxSingleSpin' | 'streak'>) => void;
  onRemovePlayer: (id: string) => void;
}

export const PlayerManager: React.FC<PlayerManagerProps> = ({
  players,
  activePlayerId,
  onSelectActivePlayer,
  onAddPlayer,
  onRemovePlayer,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATARS[0]);
  const [selectedColor, setSelectedColor] = useState(PLAYER_COLORS[0]);
  const [difficulty, setDifficulty] = useState(1.0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    onAddPlayer({
      name: newPlayerName.trim(),
      avatar: selectedAvatar,
      color: selectedColor,
      difficultyMultiplier: difficulty,
    });

    setNewPlayerName('');
    setShowAddModal(false);
  };

  // Sort players by total pushups completed descending for leaderboard order
  const sortedPlayers = [...players].sort((a, b) => b.totalPushups - a.totalPushups);
  const highestPushupCount = sortedPlayers[0]?.totalPushups || 1;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl flex flex-col gap-4 min-h-[320px]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Player Roster & Leaderboard</span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {players.length} Players Active
              </span>
            </h3>
            <p className="text-xs text-slate-400">Click any player card to manually set active spinner turn</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md hover:brightness-110 transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" /> Add Player
        </button>
      </div>

      {/* Players List - Expanded Full Width Layout */}
      <div className="flex flex-col gap-3">
        {players.map(player => {
          const isActive = player.id === activePlayerId;
          const rankIndex = sortedPlayers.findIndex(p => p.id === player.id);
          const progressPercentage = Math.min(100, Math.round((player.totalPushups / (highestPushupCount || 1)) * 100));

          return (
            <div
              key={player.id}
              onClick={() => onSelectActivePlayer(player.id)}
              className={`relative p-4.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/15 via-slate-900/90 to-amber-500/10 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-2 ring-amber-400/40'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Active Turn Badge */}
              {isActive && (
                <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow">
                  Active Turn 🎯
                </span>
              )}

              {/* Main Info Row */}
              <div className="flex items-center justify-between gap-3">
                {/* Left: Avatar & Name */}
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner border-2"
                      style={{ borderColor: player.color, backgroundColor: `${player.color}22` }}
                    >
                      {player.avatar}
                    </div>
                    {rankIndex === 0 && (
                      <Crown className="w-6 h-6 text-amber-400 absolute -top-2.5 -left-2.5 filter drop-shadow animate-pulse" />
                    )}
                    {rankIndex === 1 && (
                      <span className="absolute -top-2 -left-2 text-sm" title="2nd Place">🥈</span>
                    )}
                    {rankIndex === 2 && (
                      <span className="absolute -top-2 -left-2 text-sm" title="3rd Place">🥉</span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-white text-base">{player.name}</h4>
                      {player.difficultyMultiplier !== 1.0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700 font-bold">
                          {player.difficultyMultiplier * 100}% Difficulty
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1 font-bold text-amber-400 text-sm">
                        <Flame className="w-4 h-4 text-amber-500" /> {player.totalPushups} Total Reps
                      </span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <Zap className="w-3.5 h-3.5 text-blue-400" /> {player.totalSpins} Spins
                      </span>
                      {player.maxSingleSpin > 0 && (
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <Target className="w-3.5 h-3.5" /> Max Set: {player.maxSingleSpin} reps
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                  {players.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemovePlayer(player.id);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Remove Player"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar Row */}
              <div className="w-full bg-slate-950/80 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(5, progressPercentage)}%`,
                    backgroundColor: player.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Player Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="glass-panel-gold rounded-3xl p-6 max-w-md w-full border border-amber-500/40 shadow-2xl max-h-[90vh] overflow-y-auto my-auto relative flex flex-col gap-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" /> Add New Player
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Player Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Iron Chest Mark"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Avatar Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Choose Avatar</label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_AVATARS.map(avatar => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-all cursor-pointer ${
                        selectedAvatar === avatar
                          ? 'bg-amber-500/30 border-amber-400 scale-110 shadow-md'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Player Theme Color</label>
                <div className="flex flex-wrap gap-2">
                  {PLAYER_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                        selectedColor === color ? 'scale-125 border-white shadow-lg' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Difficulty Handicapping */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Pushup Handicap Multiplier: <strong className="text-amber-400">{difficulty * 100}%</strong>
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(parseFloat(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-sm cursor-pointer"
                >
                  <option value={0.5}>50% - Light (Beginner)</option>
                  <option value={0.75}>75% - Moderate</option>
                  <option value={1.0}>100% - Standard (1x)</option>
                  <option value={1.25}>125% - Hardcore</option>
                  <option value={1.5}>150% - Beast Mode</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:brightness-110 shadow-lg cursor-pointer"
                >
                  Join Game
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
