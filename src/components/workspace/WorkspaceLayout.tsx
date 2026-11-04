import React, { useEffect, useState } from 'react';
import { useWorldStore } from '../../stores/useWorldStore';
import { useSqlStore } from '../../stores/useSqlStore';
import { useMissionStore } from '../../stores/useMissionStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { WorkspaceHeader } from './WorkspaceHeader';
import { MissionPanel } from './MissionPanel';
import { SqlEditor } from './SqlEditor';
import { QueryResults } from './QueryResults';
import { SchemaExplorer } from './SchemaExplorer';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { BusinessReportModal } from '../report/BusinessReportModal';
import {
  Trophy,
  FileText,
  ArrowRight,
  Code2,
  Database,
  ListTodo,
} from 'lucide-react';

const DEFAULT_LEFT_WIDTH = 380;
const DEFAULT_RIGHT_WIDTH = 280;
const MIN_LEFT_WIDTH = 240;
const MIN_RIGHT_WIDTH = 200;
const MIN_CENTER_WIDTH = 360;

const getInitialLeftWidth = (): number => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('queryquest_left_width');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= MIN_LEFT_WIDTH && parsed <= 700) {
        return parsed;
      }
    }
  }
  return DEFAULT_LEFT_WIDTH;
};

const getInitialRightWidth = (): number => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('queryquest_right_width');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= MIN_RIGHT_WIDTH && parsed <= 600) {
        return parsed;
      }
    }
  }
  return DEFAULT_RIGHT_WIDTH;
};

export const WorkspaceLayout: React.FC = () => {
  const { activeWorld } = useWorldStore();
  const { initializeForWorld } = useSqlStore();
  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';
  const {
    loadMissionsForWorld,
    isWorldCompletedModalOpen,
    closeWorldCompletedModal,
  } = useMissionStore();

  const [activeMobileTab, setActiveMobileTab] = useState<'mission' | 'editor' | 'schema'>('editor');
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Resizable sidebar states
  const [leftWidth, setLeftWidth] = useState<number>(getInitialLeftWidth);
  const [rightWidth, setRightWidth] = useState<number>(getInitialRightWidth);
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    if (activeWorld) {
      initializeForWorld(activeWorld);
      loadMissionsForWorld(activeWorld);
    }
  }, [activeWorld]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setIsDesktop(windowWidth >= 1024);

      setLeftWidth((prev) => {
        const maxLeft = Math.max(MIN_LEFT_WIDTH, windowWidth - rightWidth - MIN_CENTER_WIDTH);
        return Math.min(Math.max(prev, MIN_LEFT_WIDTH), maxLeft);
      });
      setRightWidth((prev) => {
        const maxRight = Math.max(MIN_RIGHT_WIDTH, windowWidth - leftWidth - MIN_CENTER_WIDTH);
        return Math.min(Math.max(prev, MIN_RIGHT_WIDTH), maxRight);
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [leftWidth, rightWidth]);

  // Mouse drag handler for splitters
  useEffect(() => {
    if (!isDraggingLeft && !isDraggingRight) return;

    const handleMouseMove = (e: MouseEvent) => {
      const windowWidth = window.innerWidth;

      if (isDraggingLeft) {
        const maxLeft = Math.max(MIN_LEFT_WIDTH, windowWidth - rightWidth - MIN_CENTER_WIDTH);
        const newWidth = Math.min(Math.max(e.clientX, MIN_LEFT_WIDTH), maxLeft);
        setLeftWidth(newWidth);
        localStorage.setItem('queryquest_left_width', String(newWidth));
      } else if (isDraggingRight) {
        const maxRight = Math.max(MIN_RIGHT_WIDTH, windowWidth - leftWidth - MIN_CENTER_WIDTH);
        const newWidth = Math.min(Math.max(windowWidth - e.clientX, MIN_RIGHT_WIDTH), maxRight);
        setRightWidth(newWidth);
        localStorage.setItem('queryquest_right_width', String(newWidth));
      }
    };

    const handleMouseUp = () => {
      setIsDraggingLeft(false);
      setIsDraggingRight(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingLeft, isDraggingRight, leftWidth, rightWidth]);

  const handleResetLeft = () => {
    setLeftWidth(DEFAULT_LEFT_WIDTH);
    localStorage.setItem('queryquest_left_width', String(DEFAULT_LEFT_WIDTH));
  };

  const handleResetRight = () => {
    setRightWidth(DEFAULT_RIGHT_WIDTH);
    localStorage.setItem('queryquest_right_width', String(DEFAULT_RIGHT_WIDTH));
  };

  if (!activeWorld) return null;

  return (
    <div
      className={`h-screen w-screen flex flex-col ${
        isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-950 text-slate-100'
      } overflow-hidden transition-colors duration-150`}
    >
      {/* Workspace Header */}
      <WorkspaceHeader />

      {/* Mobile Tab Switcher */}
      <div
        className={`flex lg:hidden items-center justify-around border-b ${
          isLight ? 'border-slate-200 bg-white text-slate-700' : 'border-slate-800 bg-slate-900 text-slate-300'
        } py-1.5 px-2 text-xs`}
      >
        <button
          onClick={() => setActiveMobileTab('mission')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold ${
            activeMobileTab === 'mission'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400'
          }`}
        >
          <ListTodo className="w-3.5 h-3.5" />
          <span>Mission</span>
        </button>
        <button
          onClick={() => setActiveMobileTab('editor')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold ${
            activeMobileTab === 'editor'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>SQL Workspace</span>
        </button>
        <button
          onClick={() => setActiveMobileTab('schema')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold ${
            activeMobileTab === 'schema'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Schema</span>
        </button>
      </div>

      {/* Main 3-Column Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Column: Mission Panel */}
        <div
          style={isDesktop ? { width: `${leftWidth}px` } : undefined}
          className={`${
            activeMobileTab === 'mission' ? 'flex w-full' : 'hidden'
          } lg:flex h-full flex-shrink-0 overflow-hidden relative`}
        >
          <MissionPanel />
        </div>

        {/* Left Splitter Resizer Handle */}
        <div
          onMouseDown={() => setIsDraggingLeft(true)}
          onDoubleClick={handleResetLeft}
          className={`hidden lg:flex w-1.5 relative z-20 cursor-col-resize select-none items-center justify-center transition-colors group flex-shrink-0 ${
            isDraggingLeft
              ? 'bg-emerald-500'
              : isLight
              ? 'bg-slate-200 hover:bg-emerald-500/50'
              : 'bg-slate-800 hover:bg-emerald-500/50'
          }`}
          title="Drag to resize Mission Panel (Double-click to reset)"
        >
          <div
            className={`w-0.5 h-7 rounded-full transition-colors ${
              isDraggingLeft
                ? 'bg-white'
                : isLight
                ? 'bg-slate-400 group-hover:bg-emerald-600'
                : 'bg-slate-600 group-hover:bg-emerald-400'
            }`}
          />
        </div>

        {/* Center Column: SQL Editor (top 52%) + Query Results (bottom 48%) */}
        <div
          className={`${
            activeMobileTab === 'editor' ? 'flex' : 'hidden'
          } lg:flex flex-1 flex-col h-full min-w-[320px] overflow-hidden`}
        >
          <div className={`h-[52%] border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <SqlEditor />
          </div>
          <div className="h-[48%]">
            <QueryResults />
          </div>
        </div>

        {/* Right Splitter Resizer Handle */}
        <div
          onMouseDown={() => setIsDraggingRight(true)}
          onDoubleClick={handleResetRight}
          className={`hidden lg:flex w-1.5 relative z-20 cursor-col-resize select-none items-center justify-center transition-colors group flex-shrink-0 ${
            isDraggingRight
              ? 'bg-emerald-500'
              : isLight
              ? 'bg-slate-200 hover:bg-emerald-500/50'
              : 'bg-slate-800 hover:bg-emerald-500/50'
          }`}
          title="Drag to resize Schema Explorer (Double-click to reset)"
        >
          <div
            className={`w-0.5 h-7 rounded-full transition-colors ${
              isDraggingRight
                ? 'bg-white'
                : isLight
                ? 'bg-slate-400 group-hover:bg-emerald-600'
                : 'bg-slate-600 group-hover:bg-emerald-400'
            }`}
          />
        </div>

        {/* Right Column: Schema Explorer */}
        <div
          style={isDesktop ? { width: `${rightWidth}px` } : undefined}
          className={`${
            activeMobileTab === 'schema' ? 'flex w-full' : 'hidden'
          } lg:flex h-full flex-shrink-0 overflow-hidden relative`}
        >
          <SchemaExplorer />
        </div>

        {/* Transparent global drag shield to prevent event drops over Monaco/text */}
        {(isDraggingLeft || isDraggingRight) && (
          <div
            className="fixed inset-0 z-50 cursor-col-resize select-none"
            style={{ userSelect: 'none', cursor: 'col-resize' }}
          />
        )}
      </div>

      {/* World Completion Modal */}
      <Modal
        isOpen={isWorldCompletedModalOpen}
        onClose={closeWorldCompletedModal}
        title="World Completed!"
        subtitle={`Congratulations! You have resolved all 10 missions in ${activeWorld.name}`}
        maxWidth="lg"
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 mx-auto flex items-center justify-center shadow-2xl shadow-amber-500/30 text-slate-950">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Certification Unlocked
            </span>
            <h3 className="text-xl font-black text-white mt-1">
              Retail Data Analyst
            </h3>
            <p className="text-xs text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
              You engineered tables, audited inventories, solved checkout lane errors, and calculated category-wise sales metrics like a seasoned database analyst.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-around font-mono text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Total XP Earned</span>
              <span className="font-bold text-emerald-400 text-sm">+1,570 XP</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[10px]">Missions Solved</span>
              <span className="font-bold text-sky-400 text-sm">10 / 10</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                closeWorldCompletedModal();
                setIsReportOpen(true);
              }}
              icon={<FileText className="w-4 h-4 text-emerald-400" />}
            >
              Inspect Final Business Report
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={closeWorldCompletedModal}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continue Practice
            </Button>
          </div>
        </div>
      </Modal>

      {/* Standalone Report Modal */}
      <BusinessReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        world={activeWorld}
      />
    </div>
  );
};
