import React, { useState } from 'react';
import { Flame, Trophy, BookOpen, Volume2, VolumeX, Sparkles, Sun, Moon } from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { soundService } from '../../services/sound/sound-effects';
import { AchievementsModal } from './AchievementsModal';
import { FoundationModal } from '../foundation/FoundationModal';

export const Header: React.FC = () => {
  const { profile, levelInfo } = useUserStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isFoundationOpen, setIsFoundationOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundService.isMuted);

  const isLight = theme === 'slate-100';

  const toggleSound = () => {
    const muted = soundService.toggleMute();
    setIsMuted(muted);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-30 w-full border-b ${
          isLight
            ? 'border-slate-200 bg-white/85 text-slate-800'
            : 'border-slate-800 bg-slate-950/80 text-slate-100'
        } backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors duration-150`}
      >
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="QueryQuest Logo Badge"
            className="h-10 sm:h-11 w-auto object-contain drop-shadow-md hover:scale-105 transition-transform select-none"
          />
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`font-black text-xl tracking-tight ${
                  isLight
                    ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-600'
                    : 'bg-gradient-to-r from-white via-slate-200 to-emerald-300'
                } bg-clip-text text-transparent`}
              >
                QueryQuest
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                v1.0 MVP
              </span>
            </div>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'} hidden sm:block`}>
              Real-world problems. SQL-powered solutions.
            </p>
          </div>
        </div>

        {/* User Stats & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* SQL Foundation Button */}
          <button
            onClick={() => setIsFoundationOpen(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              isLight
                ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
                : 'bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/60'
            } border text-xs font-medium transition-colors`}
            title="Browse SQL Foundation reference guides"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-500" />
            <span className="hidden md:inline">SQL Foundation</span>
          </button>

          {/* Achievements Button */}
          <button
            onClick={() => setIsAchievementsOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
              isLight
                ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
                : 'bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/60'
            } border text-xs font-medium transition-colors`}
            title="View unlocked badges & achievements"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Achievements</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[10px] font-bold">
              {profile.achievements.length}
            </span>
          </button>

          {/* Daily Streak */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>{profile.streakDays}d Streak</span>
          </div>

          {/* User Level & XP Bar */}
          <div
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl ${
              isLight
                ? 'bg-white border-slate-200 shadow-sm text-slate-800'
                : 'bg-slate-900 border-slate-800 text-slate-100'
            } border`}
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
              L{levelInfo.level}
            </div>
            <div className="hidden lg:flex flex-col w-24">
              <div
                className={`flex justify-between text-[10px] ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                } font-medium`}
              >
                <span>{levelInfo.currentLevelXp} XP</span>
                <span>{levelInfo.nextLevelXp} XP</span>
              </div>
              <div
                className={`w-full h-1.5 ${
                  isLight ? 'bg-slate-200' : 'bg-slate-800'
                } rounded-full overflow-hidden mt-0.5`}
              >
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>{profile.xp} XP</span>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors border ${
              isLight
                ? 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border-slate-200'
                : 'text-slate-400 hover:text-slate-100 bg-slate-900 hover:bg-slate-850 border-slate-800'
            }`}
            title={isLight ? 'Switch to Dark Theme (Slate 950)' : 'Switch to Slate 100 Theme'}
          >
            {isLight ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg transition-colors border ${
              isLight
                ? 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border-slate-200'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-850 border-slate-800'
            }`}
            title={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
          </button>
        </div>
      </header>

      {/* Modals */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
      />
      <FoundationModal
        isOpen={isFoundationOpen}
        onClose={() => setIsFoundationOpen(false)}
      />
    </>
  );
};

