import React, { useEffect } from 'react';
import { useWorldStore } from '../stores/useWorldStore';
import { useUserStore } from '../stores/useUserStore';
import { Header } from '../components/dashboard/Header';
import { WorldGrid } from '../components/dashboard/WorldGrid';
import { WorkspaceLayout } from '../components/workspace/WorkspaceLayout';

export const App: React.FC = () => {
  const { activeWorld, initWorlds } = useWorldStore();
  const { initUser } = useUserStore();

  useEffect(() => {
    initUser();
    initWorlds();
  }, []);

  if (activeWorld) {
    return <WorkspaceLayout />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <Header />
      <main className="flex-1">
        <WorldGrid />
      </main>
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 px-4 text-center text-xs text-slate-500">
        <p className="font-medium text-slate-400">
          QueryQuest — Real-world problems. SQL-powered solutions.
        </p>
        <p className="mt-1 text-[11px] text-slate-600">
          Powered by browser-based SQLite 3 (WebAssembly) &bull; Zero server setup required
        </p>
      </footer>
    </div>
  );
};

export default App;
