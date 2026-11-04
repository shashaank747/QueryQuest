import React, { useEffect, useState } from 'react';
import { useWorldStore } from '../../stores/useWorldStore';
import { useSqlStore } from '../../stores/useSqlStore';
import { useMissionStore } from '../../stores/useMissionStore';
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

export const WorkspaceLayout: React.FC = () => {
  const { activeWorld } = useWorldStore();
  const { initializeForWorld } = useSqlStore();
  const {
    loadMissionsForWorld,
    isWorldCompletedModalOpen,
    closeWorldCompletedModal,
  } = useMissionStore();

  const [activeMobileTab, setActiveMobileTab] = useState<'mission' | 'editor' | 'schema'>('editor');
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    if (activeWorld) {
      initializeForWorld(activeWorld);
      loadMissionsForWorld(activeWorld);
    }
  }, [activeWorld]);

  if (!activeWorld) return null;

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Workspace Header */}
      <WorkspaceHeader />

      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden items-center justify-around border-b border-slate-800 bg-slate-900 py-1.5 px-2 text-xs">
        <button
          onClick={() => setActiveMobileTab('mission')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold ${
            activeMobileTab === 'mission'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
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
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
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
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Schema</span>
        </button>
      </div>

      {/* Main 3-Column Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Mission Panel */}
        <div
          className={`${
            activeMobileTab === 'mission' ? 'flex' : 'hidden'
          } lg:flex h-full`}
        >
          <MissionPanel />
        </div>

        {/* Center Column: SQL Editor (top 52%) + Query Results (bottom 48%) */}
        <div
          className={`${
            activeMobileTab === 'editor' ? 'flex' : 'hidden'
          } lg:flex flex-1 flex-col h-full min-w-0 border-r border-slate-800`}
        >
          <div className="h-[52%] border-b border-slate-800">
            <SqlEditor />
          </div>
          <div className="h-[48%]">
            <QueryResults />
          </div>
        </div>

        {/* Right Column: Schema Explorer */}
        <div
          className={`${
            activeMobileTab === 'schema' ? 'flex' : 'hidden'
          } lg:flex h-full`}
        >
          <SchemaExplorer />
        </div>
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
