import React from 'react';
import { useTrackStore } from '../../stores/useTrackStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { TrackPreviewModal } from './TrackPreviewModal';
import {
  FileSpreadsheet,
  Database,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const TrackSelectionPage: React.FC = () => {
  const { setSelectedTrack, setPreviewTrack } = useTrackStore();
  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Enterprise Data Simulation</span>
        </div>

        <h1
          className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight ${
            isLight ? 'text-slate-900' : 'text-white'
          } mb-5 leading-tight`}
        >
          Master Real Data Tools by Solving Corporate Crises
        </h1>

        <p
          className={`text-sm sm:text-lg ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          } leading-relaxed`}
        >
          Welcome to <strong className="font-bold text-emerald-500">Quest Query</strong>.
          Traditional courses teach syntax in sterile isolation—we put you inside live business operations.
          Select your data track below to investigate real schemas, debug broken data pipelines, and deliver executive intelligence.
        </p>
      </div>

      {/* 3 Main Tool Cards: Excel | MySQL | Power BI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16 items-stretch">
        {/* CARD 1: EXCEL */}
        <div
          className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 border ${
            isLight
              ? 'bg-white/90 border-slate-200/80 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5'
              : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5'
          } backdrop-blur-sm group`}
        >
          <div>
            {/* Header & Badges */}
            <div className="flex items-center justify-between mb-5">
              <div className="w-13 h-13 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-3 text-emerald-500 group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20 flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                Coming Soon
              </span>
            </div>

            {/* Title & Subtitle */}
            <h2
              className={`text-2xl font-black tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              } mb-1`}
            >
              Excel
            </h2>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
              Spreadsheets & Financial Modeling
            </p>
            <p
              className={`text-xs sm:text-sm ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              } leading-relaxed mb-6`}
            >
              Master the corporate workhorse. Debug tangled business workbooks, reconcile supplier inventories, build dynamic multi-tier commissions, and forecast multi-year financial statements.
            </p>

            {/* Core Competencies List */}
            <div className="space-y-2 mb-6">
              {[
                'XLOOKUP & Nested Dynamic Arrays',
                'Financial 3-Statement Forecasting',
                'What-If Scenario & Goal Seek Solvers',
                'Multi-Table Pivot Intelligence',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between mb-4 text-[11px] text-slate-500 font-medium">
              <span>15 Planned Workbooks</span>
              <span>Finance & Ops</span>
            </div>
            <button
              onClick={() => setPreviewTrack('excel')}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/60'
              }`}
            >
              <span>Preview Curriculum</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
        </div>

        {/* CARD 2: MYSQL (THE LIVE GAME!) */}
        <div
          className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 border-2 ${
            isLight
              ? 'bg-gradient-to-b from-white via-cyan-50/20 to-white border-cyan-500 shadow-xl shadow-cyan-500/10'
              : 'bg-gradient-to-b from-slate-900/90 via-cyan-950/20 to-slate-900/90 border-cyan-500/80 shadow-2xl shadow-cyan-500/15'
          } backdrop-blur-md group hover:scale-[1.02]`}
        >
          {/* Active Highlight Banner */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-600 via-emerald-600 to-cyan-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>Version 2.0 &bull; 7 Worlds Ready</span>
          </div>

          <div>
            {/* Header & Badges */}
            <div className="flex items-center justify-between mb-5 mt-1">
              <div className="w-13 h-13 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center p-3 text-cyan-400 group-hover:scale-110 transition-transform">
                <Database className="w-7 h-7 text-cyan-500" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Featured Game
              </span>
            </div>

            {/* Title & Subtitle */}
            <h2
              className={`text-2xl sm:text-3xl font-black tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              } mb-1 flex items-center gap-2`}
            >
              <span>MySQL</span>
              <span className="text-xs font-bold text-cyan-500 uppercase px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                SQL Engine
              </span>
            </h2>
            <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-3">
              Relational Databases & Enterprise Simulation
            </p>
            <p
              className={`text-xs sm:text-sm ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              } leading-relaxed mb-6`}
            >
              The flagship Quest Query simulation! Jump into 7 realistic corporate database environments across 3 progressive skill tiers (Beginner, Intermediate, Advanced), fix data outages, optimize complex multi-table joins, and deliver boardroom analytics reports.
            </p>

            {/* Core Competencies List */}
            <div className="space-y-2 mb-6">
              {[
                '7 Interactive Worlds Across 3 Skill Tiers (Beginner, Intermediate, Advanced)',
                '52 Scenario Missions with Strict 3-Tier Progression',
                'Zero-Latency In-Browser WASM SQLite Engine',
                'Real-Time Compiler & Logic Error Diagnostics',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                  <span className={`font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between mb-4 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
              <span>7 Worlds &bull; 52 Missions</span>
              <span>100% In-Browser</span>
            </div>
            <button
              onClick={() => setSelectedTrack('mysql')}
              className="w-full py-3 px-5 rounded-xl text-sm font-black text-white bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 shadow-lg shadow-cyan-600/25 transition-all flex items-center justify-center gap-2 group-hover:gap-3"
            >
              <span>Launch Quest Query (MySQL)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CARD 3: POWER BI */}
        <div
          className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 border ${
            isLight
              ? 'bg-white/90 border-slate-200/80 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5'
              : 'bg-slate-900/60 border-slate-800 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5'
          } backdrop-blur-sm group`}
        >
          <div>
            {/* Header & Badges */}
            <div className="flex items-center justify-between mb-5">
              <div className="w-13 h-13 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center p-3 text-amber-500 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20 flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                Coming Soon
              </span>
            </div>

            {/* Title & Subtitle */}
            <h2
              className={`text-2xl font-black tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              } mb-1`}
            >
              Power BI
            </h2>
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-3">
              Business Intelligence & Dashboards
            </p>
            <p
              className={`text-xs sm:text-sm ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              } leading-relaxed mb-6`}
            >
              Transform raw corporate data into interactive executive war-rooms. Master multi-table star schemas, author complex DAX time intelligence measures, and design boardroom KPI scorecards.
            </p>

            {/* Core Competencies List */}
            <div className="space-y-2 mb-6">
              {[
                'DAX Calculated Measures & Time Intelligence',
                'Enterprise Star Schema & Fact Modeling',
                'Executive KPI Scorecards & Gauges',
                'Cross-Filtering & Visual Storytelling',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between mb-4 text-[11px] text-slate-500 font-medium">
              <span>12 Planned Dashboards</span>
              <span>BI & Executive Visuals</span>
            </div>
            <button
              onClick={() => setPreviewTrack('powerbi')}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/60'
              }`}
            >
              <span>Preview Curriculum</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
        </div>
      </div>

      {/* Starting Info & How Quest Query Works Section */}
      <div
        className={`rounded-3xl p-8 sm:p-10 border ${
          isLight
            ? 'bg-white/80 border-slate-200 shadow-md'
            : 'bg-slate-900/60 border-slate-800 shadow-xl'
        } backdrop-blur-sm mb-12`}
      >
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2
            className={`text-2xl sm:text-3xl font-black tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            } mb-2`}
          >
            How Quest Query Works
          </h2>
          <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            A proven pedagogy built on immersive business problem solving, instant compiler feedback, and verifiable gamified mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div
            className={`p-5 rounded-2xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-850/60 border-slate-800'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-500 flex items-center justify-center mb-4 font-black text-sm">
              01
            </div>
            <h3
              className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'} mb-1.5`}
            >
              Authentic Case Studies
            </h3>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} leading-relaxed`}>
              Enter real industry domains experiencing live operational emergencies—from stock shortages to flight delays.
            </p>
          </div>

          {/* Step 2 */}
          <div
            className={`p-5 rounded-2xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-850/60 border-slate-800'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mb-4 font-black text-sm">
              02
            </div>
            <h3
              className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'} mb-1.5`}
            >
              Zero-Latency Engine
            </h3>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} leading-relaxed`}>
              Runs 100% in your browser using high-speed WebAssembly. Zero installations, zero lag, and instant query execution.
            </p>
          </div>

          {/* Step 3 */}
          <div
            className={`p-5 rounded-2xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-850/60 border-slate-800'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center mb-4 font-black text-sm">
              03
            </div>
            <h3
              className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'} mb-1.5`}
            >
              Smart Error Diagnostics
            </h3>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} leading-relaxed`}>
              Intelligent compiler diagnostics analyze mistakes, missing columns, and logical flaws with helpful mentor hints.
            </p>
          </div>

          {/* Step 4 */}
          <div
            className={`p-5 rounded-2xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-850/60 border-slate-800'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-4 font-black text-sm">
              04
            </div>
            <h3
              className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'} mb-1.5`}
            >
              Earn Badges & Level Up
            </h3>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} leading-relaxed`}>
              Unlock real achievement badges, level up your developer profile, and build your corporate portfolio.
            </p>
          </div>
        </div>
      </div>

      {/* Modal for Excel and Power BI Previews */}
      <TrackPreviewModal />
    </div>
  );
};
