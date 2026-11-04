import React, { useState } from 'react';
import { useWorldStore } from '../../stores/useWorldStore';
import { useMissionStore } from '../../stores/useMissionStore';
import { useSqlStore } from '../../stores/useSqlStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  ArrowLeft,
  RotateCcw,
  FileText,
  Database,
} from 'lucide-react';
import { BusinessReportModal } from '../report/BusinessReportModal';

export const WorkspaceHeader: React.FC = () => {
  const { activeWorld, setActiveWorld } = useWorldStore();
  const { activeMission, missions, progressMap } = useMissionStore();
  const { resetDatabase, isInitializing } = useSqlStore();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

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
      <header className="h-14 border-b border-slate-800 bg-slate-950 px-4 sm:px-6 flex items-center justify-between flex-shrink-0 z-20">
        {/* Left: Back & World Identity */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveWorld(null)}
            icon={<ArrowLeft className="w-4 h-4" />}
            className="text-slate-400 hover:text-slate-100"
          >
            <span className="hidden sm:inline">Worlds</span>
          </Button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-100">{activeWorld.name}</span>
            <Badge variant="emerald" size="sm">
              {activeWorld.industry}
            </Badge>
          </div>
        </div>

        {/* Center: Mission Progress indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-emerald-400">
            Mission {currentMissionIndex >= 0 ? currentMissionIndex + 1 : 1} of {missions.length}
          </span>
          <span>•</span>
          <span>{completedCount} Completed</span>
        </div>

        {/* Right: Actions (Report, Reset, DB Dialect) */}
        <div className="flex items-center gap-2">
          {/* SQLite Dialect Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
            <Database className="w-3 h-3 text-emerald-400" />
            <span>SQLite 3 (WASM)</span>
          </div>

          {/* Reset DB */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsResetConfirmOpen(true)}
            isLoading={isInitializing}
            icon={<RotateCcw className="w-3.5 h-3.5 text-slate-400" />}
            title="Reset database to initial clean state"
            className="text-slate-400 hover:text-rose-400"
          >
            <span className="hidden sm:inline">Reset DB</span>
          </Button>

          {/* Business Report */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsReportOpen(true)}
            icon={<FileText className="w-3.5 h-3.5 text-emerald-400" />}
            className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
          >
            <span className="hidden sm:inline">Business Report</span>
          </Button>
        </div>
      </header>

      {/* Report Modal */}
      <BusinessReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        world={activeWorld}
      />

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-rose-500" /> Reset Database Workspace?
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
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
