import React, { useState } from 'react';
import { useTrackStore, TrackId } from '../../stores/useTrackStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  FileSpreadsheet,
  BarChart3,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Send,
  Code,
  Keyboard,
  Gamepad2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  EXCEL_MODULES,
  EXCEL_TIERS,
  ExcelTierNumber,
} from '../../modules/excel/curriculum';

interface TrackDetail {
  id: TrackId;
  name: string;
  tagline: string;
  badgeColor: string;
  icon: React.ReactNode;
  overview: string;
  modules: {
    title: string;
    focus: string;
    skills: string[];
  }[];
}

const TRACK_DETAILS: Record<'excel' | 'powerbi', TrackDetail> = {
  excel: {
    id: 'excel',
    name: 'Excel Analytics Track',
    tagline: 'Spreadsheet Engineering & Financial Modeling',
    badgeColor: 'emerald',
    icon: <FileSpreadsheet className="w-6 h-6 text-emerald-500" />,
    overview:
      'Master the backbone of corporate decision-making. Move beyond basic cell editing to build resilient, automated workbooks that reconcile complex inventory, forecast multi-year financial statements, and automate operational reporting.',
    modules: [],
  },
  powerbi: {
    id: 'powerbi',
    name: 'Power BI Track',
    tagline: 'Business Intelligence & Executive Visual Analytics',
    badgeColor: 'amber',
    icon: <BarChart3 className="w-6 h-6 text-amber-500" />,
    overview:
      'Transform raw corporate databases into compelling executive war-rooms. Master star-schema data modeling, calculate complex DAX time intelligence metrics, and design interactive dashboards that boardroom executives rely on.',
    modules: [
      {
        title: 'Aviation Fleet On-Time & Delay Cockpit',
        focus: 'Airline Operations',
        skills: ['Star Schema Modeling', 'Decomposition Trees', 'Map Visuals', 'Drill-through'],
      },
      {
        title: 'Hospital Bed Utilization & Patient Flow',
        focus: 'Healthcare Administration',
        skills: ['DAX Time Intelligence', 'DATESYTD', 'Capacity Gauges', 'SLA Indicators'],
      },
      {
        title: 'Omnichannel Supermarket Basket Intelligence',
        focus: 'Retail Merchandising',
        skills: ['Cross-Filtering', 'Customer LTV', 'Matrix Heatmaps', 'Custom Tooltips'],
      },
      {
        title: 'Carrier Freight SLA & Cost Scorecard',
        focus: 'Logistics & Supply Chain',
        skills: ['Dynamic Measures', 'Row-Level Security', 'KPI Scorecards'],
      },
      {
        title: 'Banking Risk & Transaction Anomaly Monitor',
        focus: 'Financial Crime & Audit',
        skills: ['DAX CALCULATE & FILTER', 'Key Influencers', 'Executive Summary Visuals'],
      },
    ],
  },
};

export const TrackPreviewModal: React.FC = () => {
  const { previewTrack, setPreviewTrack } = useTrackStore();
  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedTier, setSelectedTier] = useState<ExcelTierNumber | 'all'>('all');

  if (!previewTrack || previewTrack === 'mysql') return null;

  const detail = TRACK_DETAILS[previewTrack];

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // Confetti fallback
      }
    }
  };

  const isExcel = previewTrack === 'excel';

  const tierTabs = [
    { id: 'all' as const, label: 'All 16 Modules', count: EXCEL_MODULES.length },
    ...EXCEL_TIERS.map((t) => ({
      id: t.tier,
      label: t.tabLabel,
      count: t.moduleCount,
    })),
  ];

  const filteredExcelModules =
    selectedTier === 'all'
      ? EXCEL_MODULES
      : EXCEL_MODULES.filter((m) => m.tier === selectedTier);

  return (
    <Modal
      isOpen={!!previewTrack}
      onClose={() => {
        setPreviewTrack(null);
        setIsSubscribed(false);
        setEmail('');
        setSelectedTier('all');
      }}
      title=""
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div
            className={`p-3.5 rounded-2xl ${
              detail.badgeColor === 'emerald'
                ? 'bg-emerald-500/10 border border-emerald-500/20'
                : 'bg-amber-500/10 border border-amber-500/20'
            }`}
          >
            {detail.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-1 flex-wrap">
              <h2
                className={`text-2xl font-black tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {detail.name}
              </h2>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  detail.badgeColor === 'emerald'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                } flex items-center gap-1`}
              >
                <Clock className="w-3 h-3" />
                Coming Soon
              </span>
            </div>
            <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {detail.tagline}
            </p>
          </div>
        </div>

        {/* Overview Box */}
        <div
          className={`p-4 rounded-xl border ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-700'
              : 'bg-slate-900/60 border-slate-800 text-slate-300'
          } text-sm leading-relaxed`}
        >
          {detail.overview}
        </div>

        {/* Modules Section */}
        <div>
          {isExcel ? (
            <div className="space-y-3.5">
              {/* Excel Header with Stats */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-500" />
                  <h3
                    className={`text-sm font-bold uppercase tracking-wider ${
                      isLight ? 'text-slate-900' : 'text-slate-200'
                    }`}
                  >
                    Curriculum Modules ({filteredExcelModules.length})
                  </h3>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>16 Modules Across 4 Skill Tiers</span>
                </div>
              </div>

              {/* Tier Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
                {tierTabs.map((tab) => {
                  const isActive = selectedTier === tab.id;
                  return (
                    <button
                      key={String(tab.id)}
                      onClick={() => setSelectedTier(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 font-bold'
                          : isLight
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? 'bg-emerald-600/90 text-white'
                            : isLight
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Excel Modules List */}
              <div className="space-y-3">
                {filteredExcelModules.map((mod) => (
                  <div
                    key={mod.id}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                      isLight
                        ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Module Title & Badges */}
                    <div className="flex items-start justify-between gap-2.5 mb-2 flex-wrap">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                            mod.tier === 1
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : mod.tier === 2
                              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                              : mod.tier === 3
                              ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                              : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          #{mod.number}
                        </span>
                        <div>
                          <h4
                            className={`font-bold text-sm leading-tight ${
                              isLight ? 'text-slate-900' : 'text-slate-100'
                            }`}
                          >
                            {mod.title}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {mod.tierName}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          isLight
                            ? 'bg-slate-100 text-slate-700 border border-slate-200'
                            : 'bg-slate-800/80 text-slate-300 border border-slate-700/60'
                        }`}
                      >
                        {mod.focus}
                      </span>
                    </div>

                    {/* Description */}
                    <p
                      className={`text-xs mb-3 leading-relaxed ${
                        isLight ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      {mod.description}
                    </p>

                    {/* Core Concepts */}
                    <div className="mb-2.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                        <span>Core Concepts</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {mod.coreConcepts.map((concept, cIdx) => (
                          <span
                            key={cIdx}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                              isLight
                                ? 'bg-slate-100 text-slate-700 border border-slate-200'
                                : 'bg-slate-800/90 text-slate-300 border border-slate-700/50'
                            }`}
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Function Tags */}
                    {mod.functions.length > 0 && (
                      <div className="mb-2.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                          <Code className="w-3 h-3 text-cyan-500" />
                          <span>Functions & Formulas</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {mod.functions.map((fn, fIdx) => (
                            <span
                              key={fIdx}
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                isLight
                                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                                  : 'bg-cyan-950/40 text-cyan-300 border border-cyan-800/50'
                              }`}
                            >
                              {fn}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Shortcuts & Game Mechanics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      {/* Shortcuts */}
                      {mod.shortcuts.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                            <Keyboard className="w-3 h-3 text-amber-500" />
                            <span>Key Shortcuts</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {mod.shortcuts.map((sc, scIdx) => (
                              <span
                                key={scIdx}
                                className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded ${
                                  isLight
                                    ? 'bg-amber-50/80 text-amber-900 border border-amber-200/80'
                                    : 'bg-amber-950/30 text-amber-300 border border-amber-800/40'
                                }`}
                              >
                                {sc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Game Mechanics */}
                      {mod.gameMechanics.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                            <Gamepad2 className="w-3 h-3 text-purple-500" />
                            <span>Game Mechanics</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {mod.gameMechanics.map((gm, gmIdx) => (
                              <span
                                key={gmIdx}
                                className={`text-[9.5px] font-medium px-1.5 py-0.5 rounded ${
                                  isLight
                                    ? 'bg-purple-50 text-purple-800 border border-purple-200'
                                    : 'bg-purple-950/30 text-purple-300 border border-purple-800/40'
                                }`}
                              >
                                {gm}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Power BI Modules Header */}
              <div className="flex items-center justify-between mb-3">
                <h3
                  className={`text-sm font-bold uppercase tracking-wider ${
                    isLight ? 'text-slate-900' : 'text-slate-200'
                  } flex items-center gap-2`}
                >
                  <Layers className="w-4 h-4 text-amber-500" />
                  Planned Business Modules ({detail.modules.length})
                </h3>
                <span className="text-xs text-slate-500">Interactive Case Studies</span>
              </div>

              <div className="space-y-2.5">
                {detail.modules.map((mod, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isLight
                        ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            detail.badgeColor === 'emerald'
                              ? 'bg-emerald-500/20 text-emerald-500'
                              : 'bg-amber-500/20 text-amber-500'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span
                          className={`font-bold text-sm ${
                            isLight ? 'text-slate-900' : 'text-slate-100'
                          }`}
                        >
                          {mod.title}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                          isLight
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-slate-850 text-slate-400 border border-slate-700/50'
                        }`}
                      >
                        {mod.focus}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap pl-7">
                      {mod.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            isLight
                              ? 'bg-slate-100 text-slate-600 border border-slate-200'
                              : 'bg-slate-800 text-slate-300 border border-slate-700/60'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notification Form / Early Access */}
        <div
          className={`p-4 rounded-xl border ${
            isLight
              ? 'bg-gradient-to-br from-emerald-50/60 to-slate-50 border-emerald-200/60'
              : 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <h4
              className={`text-sm font-bold ${
                isLight ? 'text-slate-900' : 'text-slate-100'
              }`}
            >
              Get Notified When {detail.name} Launches
            </h4>
          </div>
          <p
            className={`text-xs ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            } mb-3`}
          >
            We are actively building the in-browser simulator for this track. Leave your email or click notify to vote for its release priority!
          </p>

          {isSubscribed ? (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>You're on the priority notification list! We'll alert you as soon as this track goes live.</span>
            </div>
          ) : (
            <form onSubmit={handleNotifyMe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`flex-1 px-3.5 py-2 rounded-lg text-xs border outline-none transition-all ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    : 'bg-slate-950 border-slate-700 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                }`}
              />
              <Button type="submit" variant="primary" size="sm" className="whitespace-nowrap flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                <span>Notify Me</span>
              </Button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <Button
            variant="outline"
            onClick={() => {
              setPreviewTrack(null);
              setIsSubscribed(false);
              setEmail('');
              setSelectedTier('all');
            }}
          >
            Close Preview
          </Button>
        </div>
      </div>
    </Modal>
  );
};
