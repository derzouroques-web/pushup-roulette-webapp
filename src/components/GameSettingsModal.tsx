import React from 'react';
import type { GameSettings } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Settings, X, Volume2, VolumeX } from 'lucide-react';

interface GameSettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onClose: () => void;
}

export const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel-gold rounded-3xl p-6 max-w-md w-full border border-amber-500/40 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto my-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" /> {t('gameRulesSettings')}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Form */}
        <div className="flex flex-col gap-4 text-sm">
          {/* Elimination Mode Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="pr-3">
              <label className="font-bold text-white block mb-0.5">{t('eliminationModeTitle')}</label>
              <p className="text-xs text-slate-400">
                {t('eliminationModeDesc')}
              </p>
            </div>
            <button
              onClick={() => onUpdateSettings({ eliminationMode: !settings.eliminationMode })}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 cursor-pointer ${
                settings.eliminationMode ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                  settings.eliminationMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Max Rep Cap */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div>
              <label className="font-bold text-white block mb-0.5">{t('repCapTitle')}</label>
              <p className="text-xs text-slate-400">{t('repCapDesc')}</p>
            </div>
            <select
              value={settings.maxRepCap}
              onChange={(e) => onUpdateSettings({ maxRepCap: parseInt(e.target.value) })}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-400 font-bold cursor-pointer"
            >
              <option value={0}>{t('uncapped')}</option>
              <option value={10}>Max 10 Reps</option>
              <option value={15}>Max 15 Reps</option>
              <option value={20}>Max 20 Reps</option>
              <option value={25}>Max 25 Reps</option>
              <option value={30}>Max 30 Reps</option>
            </select>
          </div>

          {/* Default Rest Duration */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div>
              <label className="font-bold text-white block mb-0.5">{t('defaultRestTime')}</label>
              <p className="text-xs text-slate-400">{t('defaultRestTime')} ({t('seconds')})</p>
            </div>
            <select
              value={settings.defaultRestTime}
              onChange={(e) => onUpdateSettings({ defaultRestTime: parseInt(e.target.value) })}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-amber-400 font-bold cursor-pointer"
            >
              <option value={30}>30 {t('seconds')}</option>
              <option value={45}>45 {t('seconds')}</option>
              <option value={60}>60 {t('seconds')}</option>
              <option value={90}>90 {t('seconds')}</option>
              <option value={120}>2 mins</option>
            </select>
          </div>

          {/* Sound FX Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-amber-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
              <div>
                <label className="font-bold text-white block mb-0.5">{t('soundEffects')}</label>
                <p className="text-xs text-slate-400">{t('soundEffectsDesc')}</p>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-1 cursor-pointer ${
                settings.soundEnabled ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold shadow-lg hover:brightness-110 cursor-pointer"
        >
          {t('closeSettings')}
        </button>
      </div>
    </div>
  );
};
