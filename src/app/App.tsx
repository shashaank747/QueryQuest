import React, { useEffect } from 'react';
import { useWorldStore } from '../stores/useWorldStore';
import { useUserStore } from '../stores/useUserStore';
import { useThemeStore } from '../stores/useThemeStore';
import { Header } from '../components/dashboard/Header';
import { WorldGrid } from '../components/dashboard/WorldGrid';
import { WorkspaceLayout } from '../components/workspace/WorkspaceLayout';

export const App: React.FC = () => {
  const { activeWorld, initWorlds } = useWorldStore();
  const { initUser } = useUserStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    initUser();
    initWorlds();
  }, []);

  if (activeWorld) {
    return <WorkspaceLayout />;
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
        <WorldGrid />
      </main>
      <footer
        className={`border-t ${
          isLight ? 'border-slate-200 bg-white/70 text-slate-500' : 'border-slate-800/80 bg-slate-950/60 text-slate-500'
        } py-6 px-4 text-center text-xs`}
      >
        <p className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
          QueryQuest — Real-world problems. SQL-powered solutions.
        </p>
        <p className={`mt-1 text-[11px] ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
          Powered by browser-based SQLite 3 (WebAssembly) &bull; Zero server setup required
        </p>
      </footer>
    </div>
  );
};

export default App;

