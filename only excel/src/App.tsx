import React, { useEffect } from 'react';
import { useExcelStore } from './stores/useExcelStore';
import { useThemeStore } from './stores/useThemeStore';
import { useTrackStore } from './stores/useTrackStore';
import { useUserStore } from './stores/useUserStore';
import { Header } from './components/Header';
import { ExcelWorldGrid } from './components/ExcelWorldGrid';
import { ExcelWorkspaceLayout } from './components/ExcelWorkspaceLayout';
import { FileSpreadsheet, ArrowRight, Sparkles, Table2, Layers, Award } from 'lucide-react';

export const App: React.FC = () => {
  const { activeWorld } = useExcelStore();
  const { theme } = useThemeStore();
  const { selectedTrack, setSelectedTrack } = useTrackStore();
  const { initUser } = useUserStore();

  useEffect(() => {
    initUser();
  }, [initUser]);

  // If a world is active, render full-screen Excel Workspace Layout
  if (activeWorld) {
    return <ExcelWorkspaceLayout />;
  }

  const isLight = theme === 'slate-100';

  return (
    <div
      className={`min-h-screen ${
        isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-950 text-slate-100'
      } flex flex-col font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-150`}
    >
      <Header />

      <main className="flex-1">
        {selectedTrack === 'excel' ? (
          <ExcelWorldGrid />
        ) : (
          /* Welcome / Track Launcher Screen */
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-20 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Spreadsheet Simulation Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 max-w-2xl">
              Master Modern Excel Through{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Real Business Outages
              </span>
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mb-8 leading-relaxed">
              Step into authentic corporate roles across 7 industries. Troubleshoot live supply chains,
              audit hospital finances, reconcile airport turnaround costs, and master formulas from basic arithmetic to advanced XLOOKUP and dynamic arrays.
            </p>

            <div className="w-full max-w-md p-6 rounded-2xl border transition-all duration-200 shadow-xl mb-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#107c41] to-emerald-700 flex items-center justify-center text-white shadow-md">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Excel Simulation Track</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">7 Worlds • 42 Missions • Full AST Engine</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <Table2 className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                  <span className="text-[11px] font-bold block text-slate-700 dark:text-slate-300">Live Grid</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <Layers className="w-4 h-4 mx-auto mb-1 text-teal-500" />
                  <span className="text-[11px] font-bold block text-slate-700 dark:text-slate-300">Office Ribbon</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <Award className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                  <span className="text-[11px] font-bold block text-slate-700 dark:text-slate-300">Instant XP</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedTrack('excel')}
                className="w-full py-3.5 px-6 rounded-xl text-sm font-black text-white bg-gradient-to-r from-emerald-600 via-[#107c41] to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Launch Quest Query (Excel)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`border-t ${
          isLight
            ? 'border-slate-200 bg-white/80 text-slate-600'
            : 'border-slate-800/80 bg-slate-950/80 text-slate-400'
        } py-6 px-4 text-center text-xs backdrop-blur-md transition-colors`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-slate-700 dark:text-slate-300">Excel Quest Studio</span>
            <span>—</span>
            <span>Standalone Spreadsheet Simulation</span>
          </div>
          <div>
            <span>Equipped with 7 Enterprise Worlds, Office Ribbon & AST Formula Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
