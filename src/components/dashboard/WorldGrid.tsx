import React, { useState } from 'react';
import { useWorldStore } from '../../stores/useWorldStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { WorldCard } from './WorldCard';
import { Sparkles } from 'lucide-react';

export const WorldGrid: React.FC = () => {
  const { worlds } = useWorldStore();
  const { theme } = useThemeStore();
  const [filter, setFilter] = useState<'all' | 'available'>('all');

  const isLight = theme === 'slate-100';

  const filteredWorlds =
    filter === 'available' ? worlds.filter((w) => w.isAvailable) : worlds;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="mb-10 text-center max-w-3xl mx-auto flex flex-col items-center">
        <div className="mb-6 group">
          <img
            src="/logo.png"
            alt="QueryQuest - Learn SQL Through Real-World Missions"
            className="w-52 sm:w-68 md:w-76 h-auto object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105 select-none"
          />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Business Case Studies</span>
        </div>
        <h1
          className={`text-3xl sm:text-5xl font-black tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          } mb-4`}
        >
          Master SQL by Solving Real-World Breakdowns
        </h1>
        <p
          className={`text-sm sm:text-base ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          } leading-relaxed`}
        >
          No dry tutorials or artificial quizzes. Step into real organizations, inspect genuine
          database schemas, and write authentic SQL to restore broken operations and report insights.
        </p>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : isLight
                ? 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Industry Worlds ({worlds.length})
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === 'available'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : isLight
                ? 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Playable Now (World 1)
          </button>
        </div>
      </div>

      {/* World Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorlds.map((world) => (
          <WorldCard key={world.id} world={world} />
        ))}
      </div>
    </div>
  );
};
