import React, { useState } from 'react';
import { useWorldStore } from '../../stores/useWorldStore';
import { useMissionStore } from '../../stores/useMissionStore';
import { useSqlStore } from '../../stores/useSqlStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  ArrowLeft,
  RotateCcw,
  FileText,
  Database,
  Sun,
  Moon,
  Activity,
} from 'lucide-react';
import { BusinessReportModal } from '../report/BusinessReportModal';
import { PerformanceModal } from './PerformanceModal';

export const WorkspaceHeader: React.FC = () => {
  const { activeWorld, setActiveWorld } = useWorldStore();
  const { activeMission, missions, progressMap } = useMissionStore();
  const { resetDatabase, isInitializing } = useSqlStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isPerformanceOpen, setIsPerformanceOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const isLight = theme === 'slate-100';

  if (!activeWorld) return null;

  const currentMissionIndex = missions.findIndex((m) => m.id === activeMission?.id);
  const completedCount = missions.filter((m) => progressMap[m.id]?.status === 'completed').length;

  const handleResetConfirm = async () => {
    setIsResetConfirmOpen(false);
    await resetDatabase(activeWorld);
    await useMissionStore.getState().resetMissionsProgress(activeWorld);
  };

  return (
    <>
      <header
        className={`h-14 border-b ${
          isLight
            ? 'border-slate-200 bg-white text-slate-800'
            : 'border-slate-800 bg-slate-950 text-slate-100'
        } px-4 sm:px-6 flex items-center justify-between flex-shrink-0 z-20 transition-colors duration-150`}
      >
        {/* Left: Back & World Identity */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveWorld(null)}
            icon={<ArrowLeft className="w-4 h-4" />}
            className={isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-100'}
          >
            <span className="hidden sm:inline">Worlds</span>
          </Button>

          <img
            src="/logo.png"
            alt="QueryQuest"
            className="h-7 w-auto object-contain cursor-pointer hover:scale-105 transition-transform hidden sm:block select-none"
            onClick={() => setActiveWorld(null)}
            title="Return to Worlds Dashboard"
          />

          <div className={`h-4 w-px ${isLight ? 'bg-slate-200' : 'bg-slate-800'} hidden sm:block`} />

          <div className="flex items-center gap-2">
            <span className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              {activeWorld.name}
            </span>
            <Badge variant="emerald" size="sm">
              {activeWorld.industry}
            </Badge>
          </div>
        </div>

        {/* Center: Mission Progress indicator */}
        <div className={`hidden md:flex items-center gap-2 text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            Mission {currentMissionIndex >= 0 ? currentMissionIndex + 1 : 1} of {missions.length}
          </span>
          <span>•</span>
          <span>{completedCount} Completed</span>
        </div>

        {/* Right: Actions (Report, Reset, DB Dialect, Theme) */}
        <div className="flex items-center gap-2">
          {/* SQLite Dialect Pill */}
          <div
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-600'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            } border text-[11px] font-mono`}
          >
            <Database className="w-3 h-3 text-emerald-500" />
            <span>SQLite 3 (WASM)</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors border ${
              isLight
                ? 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border-slate-200'
                : 'text-slate-400 hover:text-slate-100 bg-slate-900 hover:bg-slate-850 border-slate-800'
            }`}
            title={isLight ? 'Switch to Dark Theme' : 'Switch to Slate 100 Theme'}
          >
            {isLight ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Reset DB */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsResetConfirmOpen(true)}
            isLoading={isInitializing}
            icon={<RotateCcw className="w-3.5 h-3.5 text-slate-400" />}
            title="Reset database to initial clean state"
            className="text-slate-400 hover:text-rose-500"
          >
            <span className="hidden sm:inline">Reset DB</span>
          </Button>

          {/* Performance Pill */}
          <button
            onClick={() => setIsPerformanceOpen(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-sm ${
              isLight
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
            }`}
            title="View World Performance & Analytics"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Performance</span>
          </button>

          {/* Business Report */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsReportOpen(true)}
            icon={<FileText className="w-3.5 h-3.5 text-emerald-500" />}
            className="border-emerald-500/30 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/10"
          >
            <span className="hidden sm:inline">Business Report</span>
          </Button>
        </div>
      </header>

      {/* Performance Modal */}
      <PerformanceModal
        isOpen={isPerformanceOpen}
        onClose={() => setIsPerformanceOpen(false)}
        world={activeWorld}
      />

      {/* Report Modal */}
      <BusinessReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        world={activeWorld}
      />

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm ${
          isLight ? 'bg-slate-900/40' : 'bg-slate-950/80'
        }`}>
          <div className={`border rounded-2xl p-6 max-w-md w-full shadow-2xl ${
            isLight
              ? 'bg-white border-slate-200 text-slate-800'
              : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            <h3 className={`text-lg font-bold flex items-center gap-2 ${
              isLight ? 'text-slate-900' : 'text-slate-100'
            }`}>
              <RotateCcw className="w-5 h-5 text-rose-500" /> Reset Database Workspace?
            </h3>
            <p className={`text-xs mt-2 leading-relaxed ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}>
              This will re-initialize the practice SQLite database to its pristine state and reset mission progress for {activeWorld.name}. All table alterations and practice records will be refreshed.
            </p>
            <div className="flex items-center justify-end gap-2.5 mt-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsResetConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleResetConfirm}
              >
                Yes, Reset Workspace
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
