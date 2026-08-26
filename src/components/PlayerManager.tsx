import React, { useState } from 'react';
import type { Player } from '../types';
import { DEFAULT_AVATARS, PLAYER_COLORS } from '../utils/constants';
import { UserPlus, Trophy, Trash2, Crown, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PlayerManagerProps {
  players: Player[];
  activePlayerId: string;
  onSelectActivePlayer: (id: string) => void;
  onAddPlayer: (player: Omit<Player, 'id' | 'totalPushups' | 'totalSpins' | 'completedSpins' | 'maxSingleSpin' | 'streak'>) => void;
  onRemovePlayer: (id: string) => void;
  targetGoal?: number;
}

export const PlayerManager: React.FC<PlayerManagerProps> = ({
  players,
  activePlayerId,
  onSelectActivePlayer,
  onAddPlayer,
  onRemovePlayer,
  targetGoal,
}) => {
  const { t } = useLanguage();
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
    <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800/80 shadow-xl flex flex-col gap-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{t('playersLeaderboard')}</span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {players.length}
            </span>
          </h3>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow hover:brightness-110 transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-3.5 h-3.5" /> {t('addPlayer')}
        </button>
      </div>

      {/* Quick Horizontal Player Avatar Selector for Mobile */}
      {players.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
          {players.map(player => {
            const isActive = player.id === activePlayerId;
            return (
              <button
                key={player.id}
                onClick={() => onSelectActivePlayer(player.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-base">{player.avatar}</span>
                <span className="truncate max-w-[80px]">{player.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Clean Leaderboard List */}
      <div className="flex flex-col gap-2.5">
        {players.map(player => {
          const isActive = player.id === activePlayerId;
          const rankIndex = sortedPlayers.findIndex(p => p.id === player.id);
          const maxBase = targetGoal && targetGoal > 0 ? targetGoal : (highestPushupCount || 1);
          const progressPercentage = Math.min(100, Math.round((player.totalPushups / maxBase) * 100));

          return (
            <div
              key={player.id}
              onClick={() => onSelectActivePlayer(player.id)}
              className={`relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                isActive
                  ? 'bg-slate-900 border-amber-500/60 shadow-md shadow-amber-500/5 ring-1 ring-amber-500/40'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Main Info Row */}
              <div className="flex items-center justify-between gap-3">
                {/* Left: Avatar & Name */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner border"
                      style={{ borderColor: player.color, backgroundColor: `${player.color}22` }}
                    >
                      {player.avatar}
                    </div>
                    {rankIndex === 0 && (
                      <Crown className="w-4 h-4 text-amber-400 absolute -top-1.5 -left-1.5 filter drop-shadow" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-white text-sm">{player.name}</h4>
                      {isActive && (
                        <span className="text-[9px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-extrabold uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="font-extrabold text-amber-400">
                        {player.totalPushups} {targetGoal && targetGoal > 0 ? `/ ${targetGoal}` : ''} reps
                      </span>
                      <span>•</span>
                      <span>{player.totalSpins} spins</span>
                    </div>
                  </div>
                </div>

                {/* Right: Remove Button */}
                {players.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemovePlayer(player.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    title={t('removePlayer')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Progress Bar Row */}
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800/60">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progressPercentage}%`,
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 max-w-md w-full border border-slate-800 shadow-2xl relative flex flex-col gap-4 animate-fade-in">
            {/* Grab Bar for Mobile */}
            <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto sm:hidden mb-1" />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" /> {t('addPlayer')}
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('playerNamePlaceholder')}</label>
                <input
                  type="text"
                  required
                  placeholder="Player Name"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>

              {/* Avatar Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t('selectAvatar')}</label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_AVATARS.map(avatar => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-all cursor-pointer ${
                        selectedAvatar === avatar
                          ? 'bg-amber-500/30 border-amber-400 scale-105 shadow-md'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Theme Color</label>
                <div className="flex flex-wrap gap-2">
                  {PLAYER_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                        selectedColor === color ? 'scale-110 border-white shadow-lg' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Difficulty Handicapping */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('difficultyHandicap')}: <strong className="text-amber-400">{difficulty * 100}%</strong>
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(parseFloat(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400 text-sm cursor-pointer"
                >
                  <option value={0.75}>{t('diffBeginner')}</option>
                  <option value={1.0}>{t('diffNormal')}</option>
                  <option value={1.5}>{t('diffPro')}</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg cursor-pointer"
                >
                  {t('savePlayer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
