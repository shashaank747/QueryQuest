import React, { useState } from 'react';
import {
  Trophy,
  Target,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  RotateCw,
  FileSpreadsheet,
  AlertCircle,
} from 'lucide-react';
import { useExcelStore } from '../../stores/useExcelStore';
import { useThemeStore } from '../../stores/useThemeStore';

export const ExcelMissionPanel: React.FC = () => {
  const {
    activeWorld,
    activeMissionIndex,
    revealedHintsCount,
    validationFeedback,
    isValidating,
    worldProgress,
    selectMission,
    revealNextHint,
    validateCurrentMission,
    advanceToNextMission,
    setActiveCell,
  } = useExcelStore();

  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';

  const [isHintsOpen, setIsHintsOpen] = useState(false);

  if (!activeWorld) {
    return (
      <div className="p-6 text-center text-xs text-slate-500">
        No active Excel world loaded.
      </div>
    );
  }

  const missions = activeWorld.missions;
  const currentMission = missions[activeMissionIndex] || missions[0];
  const progress = worldProgress[activeWorld.id] || {
    completedMissionsCount: 0,
    totalMissionsCount: missions.length,
    percentComplete: 0,
    isCompleted: false,
  };

  const isCurrentMissionPassed = validationFeedback?.passed;

  return (
    <div
      className={`h-full flex flex-col justify-between overflow-y-auto p-4 sm:p-5 select-none ${
        isLight
          ? 'bg-white border-r border-slate-200 text-slate-800'
          : 'bg-slate-900 border-r border-slate-800 text-slate-100'
      }`}
    >
      <div className="space-y-4">
        {/* World Header & Progression Breadcrumb */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{activeWorld.industry}</span>
            </div>
            <h2 className="font-black text-base tracking-tight mt-0.5">
              {activeWorld.name}
            </h2>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {progress.completedMissionsCount} / {missions.length} Done
            </span>
          </div>
        </div>

        {/* Mission Selector Tabs (1..6) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {missions.map((m, idx) => {
            const isSelected = activeMissionIndex === idx;
            const isCompleted = idx < progress.completedMissionsCount;

            return (
              <button
                key={m.id}
                onClick={() => selectMission(idx)}
                className={`flex-1 min-w-[36px] py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-[#107c41] text-white shadow-md shadow-emerald-900/20'
                    : isCompleted
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30'
                    : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-400'
                }`}
                title={`Mission ${idx + 1}: ${m.title}`}
              >
                <span>{idx + 1}</span>
                {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
              </button>
            );
          })}
        </div>

        {/* Mission Title & Role Badge */}
        <div className="rounded-2xl p-4 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
              Mission {activeMissionIndex + 1} of {missions.length}
            </span>
            <span className="text-[11px] font-extrabold text-amber-500 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              +{currentMission.xpReward} XP
            </span>
          </div>

          <h3 className="text-base font-black tracking-tight mb-1 text-slate-900 dark:text-white">
            {currentMission.title}
          </h3>

          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2">
            Role: {currentMission.role}
          </p>

          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {currentMission.storyline}
          </p>
        </div>

        {/* Target Cell Objective Goal */}
        <div
          onClick={() => setActiveCell(currentMission.targetCell)}
          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
            isLight
              ? 'bg-emerald-50/60 border-emerald-200 hover:bg-emerald-50'
              : 'bg-emerald-950/20 border-emerald-800/60 hover:bg-emerald-950/40'
          }`}
          title="Click to select this target cell in the spreadsheet grid"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Target Coordinate
              </div>
              <div className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
                Cell {currentMission.targetCell}
              </div>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 underline">
            Jump to Cell →
          </span>
        </div>

        {/* Objectives Checklist */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Deliverable Objectives
          </h4>
          <div className="space-y-1.5">
            {currentMission.checklist.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 p-2 rounded-lg text-xs ${
                  isLight ? 'bg-slate-50 text-slate-700' : 'bg-slate-800/60 text-slate-300'
                }`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                    isCurrentMissionPassed
                      ? 'text-emerald-500'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progressive 3-Tier Hints Drawer */}
        <div
          className={`rounded-xl border transition-all ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-850/60 border-slate-800'
          }`}
        >
          <button
            onClick={() => setIsHintsOpen(!isHintsOpen)}
            className="w-full p-3 flex items-center justify-between text-left font-bold text-xs"
          >
            <div className="flex items-center gap-2 text-amber-500">
              <Lightbulb className="w-4 h-4" />
              <span>Progressive Hints ({revealedHintsCount} / 3 Revealed)</span>
            </div>
            {isHintsOpen ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {isHintsOpen && (
            <div className="p-3 pt-0 space-y-2.5 border-t border-slate-200 dark:border-slate-800/80 mt-1">
              {revealedHintsCount === 0 && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  Stuck? You can reveal progressive hints step-by-step from conceptual advice down to exact formula syntax.
                </p>
              )}

              {/* Hint 1: Conceptual */}
              {revealedHintsCount >= 1 && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
                  <div className="font-bold text-amber-600 dark:text-amber-400 text-[10px] uppercase mb-0.5">
                    Hint 1 &bull; Conceptual Direction
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 text-xs">
                    {currentMission.hints[0]}
                  </p>
                </div>
              )}

              {/* Hint 2: Directional */}
              {revealedHintsCount >= 2 && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
                  <div className="font-bold text-amber-600 dark:text-amber-400 text-[10px] uppercase mb-0.5">
                    Hint 2 &bull; Formula Structure
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 text-xs">
                    {currentMission.hints[1]}
                  </p>
                </div>
              )}

              {/* Hint 3: Exact Syntax */}
              {revealedHintsCount >= 3 && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 text-[10px] uppercase mb-0.5">
                    Hint 3 &bull; Exact Formula Solution
                  </div>
                  <p className="font-mono text-xs text-emerald-700 dark:text-emerald-300 font-bold mb-1">
                    {currentMission.sampleSolutionFormula}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    {currentMission.hints[2]}
                  </p>
                </div>
              )}

              {revealedHintsCount < 3 && (
                <button
                  onClick={revealNextHint}
                  className="w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Reveal Hint {revealedHintsCount + 1} of 3</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Validation Feedback Banner */}
        {validationFeedback && (
          <div
            className={`p-3.5 rounded-xl border text-xs ${
              validationFeedback.passed
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-900 dark:text-emerald-100'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-900 dark:text-rose-100'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              {validationFeedback.passed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Objective Complete! +{currentMission.xpReward} XP</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Discrepancy Detected</span>
                </>
              )}
            </div>

            {/* Error or Feedback details */}
            {validationFeedback.errors.length > 0 ? (
              <div className="space-y-1 mt-1 text-[11px]">
                {validationFeedback.errors.map((err, i) => (
                  <p key={i} className="text-rose-700 dark:text-rose-300">
                    &bull; {err}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                Formula verified and computed numbers match executive ledger expectations.
              </p>
            )}

            {/* Next Mission Button */}
            {validationFeedback.passed && activeMissionIndex < missions.length - 1 && (
              <button
                onClick={advanceToNextMission}
                className="w-full mt-3 py-2 px-3 rounded-lg text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1.5 shadow"
              >
                <span>Advance to Mission {activeMissionIndex + 2}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action: Verify Sheet Button */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={validateCurrentMission}
          disabled={isValidating}
          className="w-full py-3 px-4 rounded-xl text-sm font-black text-white bg-gradient-to-r from-emerald-600 via-[#107c41] to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isValidating ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Auditing Cells...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify Sheet & Submit Solution</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
