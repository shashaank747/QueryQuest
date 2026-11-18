import React, { useState } from 'react';
import { EXCEL_WORLDS_REGISTRY } from '../../modules/excel/worlds';
import { useExcelStore } from '../../stores/useExcelStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { useTrackStore } from '../../stores/useTrackStore';
import { ExcelWorldCard } from './ExcelWorldCard';
import { Sparkles, ArrowLeft, FileSpreadsheet } from 'lucide-react';

export const ExcelWorldGrid: React.FC = () => {
  const { isWorldUnlocked } = useExcelStore();
  const { theme } = useThemeStore();
  const { setSelectedTrack } = useTrackStore();
  const [filter, setFilter] = useState<'all' | 'unlocked'>('all');

  const isLight = theme === 'slate-100';
  const worlds = EXCEL_WORLDS_REGISTRY;

  const filteredWorlds =
    filter === 'unlocked' ? worlds.filter((w) => isWorldUnlocked(w.id)) : worlds;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
      {/* Track Back Button & Breadcrumbs */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => setSelectedTrack(null)}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            isLight
              ? 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm'
              : 'bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5 text-emerald-500" />
          <span>Back to All Tracks (Excel, MySQL, Power BI)</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Quest Query</span>
          <span>/</span>
          <span className="text-emerald-500 flex items-center gap-1 font-bold">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Excel Track ({worlds.length} Worlds)
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Progressive 3-Tier Spreadsheet Curriculum &bull; 7 Industry Worlds</span>
        </div>
        <h1
          className={`text-3xl sm:text-5xl font-black tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          } mb-4`}
        >
          Master Excel by Solving Real Business Outages
        </h1>
        <p
          className={`text-sm sm:text-base ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          } leading-relaxed`}
        >
          Step into authentic corporate spreadsheets across 7 enterprise environments. Formulate dynamic
          lookup chains with XLOOKUP, model multi-tier conditional logic, reconcile supplier inventories,
          and forecast financial ledgers with zero latency.
        </p>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-[#107c41] text-white shadow-md shadow-emerald-900/20'
                : isLight
                ? 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Industry Worlds ({worlds.length})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === 'unlocked'
                ? 'bg-[#107c41] text-white shadow-md shadow-emerald-900/20'
                : isLight
                ? 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Unlocked Worlds ({worlds.filter((w) => isWorldUnlocked(w.id)).length})
          </button>
        </div>
      </div>

      {/* World Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorlds.map((world) => (
          <ExcelWorldCard key={world.id} world={world} />
        ))}
      </div>
    </div>
  );
};
