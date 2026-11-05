import React, { useEffect } from 'react';
import { useWorldStore } from '../stores/useWorldStore';
import { useUserStore } from '../stores/useUserStore';
import { useThemeStore } from '../stores/useThemeStore';
import { Header } from '../components/dashboard/Header';
import { WorldGrid } from '../components/dashboard/WorldGrid';
import { WorkspaceLayout } from '../components/workspace/WorkspaceLayout';
import { Heart, ExternalLink } from 'lucide-react';

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
          isLight
            ? 'border-slate-200 bg-white/80 text-slate-600'
            : 'border-slate-800/80 bg-slate-950/80 text-slate-400'
        } py-8 px-4 text-center text-xs backdrop-blur-md transition-colors`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
          {/* Brand Info */}
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="QueryQuest" className="h-7 w-auto object-contain select-none" />
            <div className="text-left">
              <p className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                QueryQuest
              </p>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Interactive business SQL simulation & training
              </p>
            </div>
          </div>

          {/* Made by Credits */}
          <div className="flex items-center gap-1.5 text-xs">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>by</span>
            <a
              href="https://github.com/shashaank747"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-bold transition-colors inline-flex items-center gap-1 ${
                isLight
                  ? 'text-emerald-600 hover:text-emerald-700 underline decoration-emerald-500/30'
                  : 'text-emerald-400 hover:text-emerald-300 underline decoration-emerald-500/30'
              }`}
            >
              Shashaank Sajjanar
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>

          {/* Engine note */}
          <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
            <span>Powered by SQLite WASM</span>
            <span className="mx-1.5">&bull;</span>
            <span>Zero server latency</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

