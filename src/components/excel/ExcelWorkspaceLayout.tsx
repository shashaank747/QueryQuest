import React, { useState } from 'react';
import { useExcelStore } from '../../stores/useExcelStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { ExcelRibbon } from './ExcelRibbon';
import { ExcelFormulaBar } from './ExcelFormulaBar';
import { ExcelGrid } from './ExcelGrid';
import { ExcelSheetTabs } from './ExcelSheetTabs';
import { ExcelMissionPanel } from './ExcelMissionPanel';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  Trophy,
  Award,
  ArrowRight,
  BookOpen,
  LayoutGrid,
} from 'lucide-react';

const DEFAULT_LEFT_WIDTH = 380;
const MIN_LEFT_WIDTH = 280;
const MAX_LEFT_WIDTH = 550;

export const ExcelWorkspaceLayout: React.FC = () => {
  const {
    activeWorld,
    isWorldCompletedModalOpen,
    closeWorldCompletedModal,
    setActiveWorld,
  } = useExcelStore();

  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';

  const [leftWidth, setLeftWidth] = useState(DEFAULT_LEFT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'mission' | 'grid'>('grid');

  if (!activeWorld) {
    return null;
  }

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newWidth = Math.min(Math.max(e.clientX, MIN_LEFT_WIDTH), MAX_LEFT_WIDTH);
    setLeftWidth(newWidth);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`min-h-screen flex flex-col font-sans select-none ${
        isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Mobile Top Tabs Switcher */}
      <div className="lg:hidden flex items-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold">
        <button
          onClick={() => setActiveMobileTab('mission')}
          className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 border-b-2 ${
            activeMobileTab === 'mission'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Mission Briefing</span>
        </button>
        <button
          onClick={() => setActiveMobileTab('grid')}
          className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 border-b-2 ${
            activeMobileTab === 'grid'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Excel Sheet</span>
        </button>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden h-[calc(100vh-50px)]">
        {/* Left Mission Briefing Panel */}
        <aside
          style={{ width: `${leftWidth}px` }}
          className={`hidden lg:block flex-shrink-0 h-full border-r ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}
        >
          <ExcelMissionPanel />
        </aside>

        {/* Mobile View: Mission Tab */}
        {activeMobileTab === 'mission' && (
          <div className="lg:hidden w-full h-full overflow-y-auto">
            <ExcelMissionPanel />
          </div>
        )}

        {/* Resizable Drag Handle (Desktop) */}
        <div
          onMouseDown={handleMouseDown}
          className="hidden lg:block w-1 hover:w-1.5 cursor-col-resize bg-transparent hover:bg-emerald-500 transition-colors z-30"
          title="Drag to resize panel"
        />

        {/* Right Spreadsheet Studio Workspace */}
        <div
          className={`flex-1 flex flex-col h-full overflow-hidden ${
            activeMobileTab === 'grid' ? 'block' : 'hidden lg:flex'
          }`}
        >
          {/* 1. Ribbon Bar */}
          <ExcelRibbon />

          {/* 2. Formula Bar */}
          <ExcelFormulaBar />

          {/* 3. Interactive Spreadsheet Grid */}
          <ExcelGrid />

          {/* 4. Sheet Tabs & Status Bar */}
          <ExcelSheetTabs />
        </div>
      </div>

      {/* World Completed Modal */}
      {isWorldCompletedModalOpen && (
        <Modal
          isOpen={isWorldCompletedModalOpen}
          onClose={closeWorldCompletedModal}
          title=""
        >
          <div className="text-center p-6 space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/20">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <div className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                World Operations Fully Restored
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {activeWorld.name} Completed!
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                Outstanding analysis! You have audited and repaired all 6 spreadsheet models for{' '}
                <strong>{activeWorld.storyIntro.organization}</strong>, delivering executive grade data models.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-around text-center">
              <div>
                <div className="text-xs text-slate-500 font-medium">Missions Solved</div>
                <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {activeWorld.missions.length} / {activeWorld.missions.length}
                </div>
              </div>
              <div className="h-8 w-px bg-emerald-500/20" />
              <div>
                <div className="text-xs text-slate-500 font-medium">Skill Tier</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">
                  {activeWorld.difficulty}
                </div>
              </div>
              <div className="h-8 w-px bg-emerald-500/20" />
              <div>
                <div className="text-xs text-slate-500 font-medium">Total Rewards</div>
                <div className="text-lg font-black text-amber-500 flex items-center justify-center gap-1">
                  <Award className="w-4 h-4" />
                  <span>
                    +{activeWorld.missions.reduce((sum, m) => sum + m.xpReward, 0)} XP
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 text-xs font-bold"
                onClick={() => {
                  closeWorldCompletedModal();
                  setActiveWorld(null);
                }}
              >
                Return to Worlds
              </Button>
              <Button
                variant="primary"
                className="flex-1 text-xs font-bold bg-[#107c41] hover:bg-emerald-600"
                onClick={() => {
                  closeWorldCompletedModal();
                  setActiveWorld(null);
                }}
              >
                <span>Continue Career</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
