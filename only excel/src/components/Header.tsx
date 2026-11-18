import React, { useState } from 'react';
import { Volume2, VolumeX, Sun, Moon, FileSpreadsheet, Trophy } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';
import { useThemeStore } from '../stores/useThemeStore';
import { useExcelStore } from '../stores/useExcelStore';
import { soundService } from '../services/sound/sound-effects';

export const Header: React.FC = () => {
  const { profile, levelInfo } = useUserStore();
  const { theme, toggleTheme } = useThemeStore();
  const { activeWorld, setActiveWorld } = useExcelStore();
  const [isMuted, setIsMuted] = useState(soundService.isMuted);

  const isLight = theme === 'slate-100';

  const toggleSound = () => {
    const muted = soundService.toggleMute();
    setIsMuted(muted);
  };

  const handleHomeClick = () => {
    setActiveWorld(null);
  };

  return (
    <header
      className={`sticky top-0 z-30 w-full border-b ${
        isLight
          ? 'border-slate-200 bg-white/90 text-slate-800'
          : 'border-slate-800 bg-slate-950/85 text-slate-100'
      } backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors duration-150`}
    >
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleHomeClick}
          className="flex items-center gap-3 text-left group focus:outline-none"
          title="Return to Worlds Dashboard"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#107c41] to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-900/30 group-hover:scale-105 transition-transform">
            <FileSpreadsheet className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`font-black text-xl tracking-tight ${
                  isLight
                    ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-600'
                    : 'bg-gradient-to-r from-white via-slate-200 to-emerald-300'
                } bg-clip-text text-transparent`}
              >
                Excel Quest
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Studio
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
              Interactive Spreadsheet Simulation & Industry Scenarios
            </p>
          </div>
        </button>

        {activeWorld && (
          <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-400">Current World:</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              {activeWorld.name}
            </span>
            <button
              onClick={handleHomeClick}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline ml-2"
            >
              Exit to Worlds
            </button>
          </div>
        )}
      </div>

      {/* Right Controls: Stats, Sound, Theme */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Level & XP Chip */}
        <div
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-700 shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-200'
          }`}
        >
          <div className="flex items-center gap-1 font-bold text-amber-500">
            <Trophy className="w-3.5 h-3.5" />
            <span>Lvl {levelInfo.level}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
            <span>{profile.xp} XP</span>
            <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          className={`p-2 rounded-xl border transition-colors ${
            isLight
              ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
              : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
          }`}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          aria-label="Toggle Sound"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-xl border transition-colors ${
            isLight
              ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-amber-500'
              : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-sky-400'
          }`}
          title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle Theme"
        >
          {isLight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
