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
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
    modules: [
      {
        title: 'Retail Inventory Reconciliation',
        focus: 'Supply Chain Operations',
        skills: ['XLOOKUP', 'INDEX & MATCH', 'Data Cleaning', 'Fuzzy Matching'],
      },
      {
        title: 'Corporate 3-Statement P&L Model',
        focus: 'Corporate Finance',
        skills: ['Dynamic Arrays (FILTER, SORT)', 'Multi-scenario What-If', 'Variance Analysis'],
      },
      {
        title: 'Sales Commission & Tiered Bonus Engine',
        focus: 'HR & Revenue Operations',
        skills: ['Nested Logic', 'Conditional Formatting', 'Formula Auditing'],
      },
      {
        title: 'Warehouse Lead-Time & Safety Stock Forecast',
        focus: 'Logistics Engineering',
        skills: ['Goal Seek', 'Solver', 'Data Tables', 'Standard Deviation'],
      },
      {
        title: 'Executive KPI Pivot & Slicer Dashboard',
        focus: 'Business Intelligence',
        skills: ['Pivot Tables', 'Calculated Fields', 'Interactive Slicers'],
      },
    ],
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

  return (
    <Modal
      isOpen={!!previewTrack}
      onClose={() => {
        setPreviewTrack(null);
        setIsSubscribed(false);
        setEmail('');
      }}
      title=""
      maxWidth="xl"
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

        {/* Planned Modules */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3
              className={`text-sm font-bold uppercase tracking-wider ${
                isLight ? 'text-slate-900' : 'text-slate-200'
              } flex items-center gap-2`}
            >
              <Layers className="w-4 h-4 text-emerald-500" />
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
            }}
          >
            Close Preview
          </Button>
        </div>
      </div>
    </Modal>
  );
};
