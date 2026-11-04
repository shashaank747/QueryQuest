import React, { useState } from 'react';
import { useMissionStore } from '../../stores/useMissionStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { Button } from '../ui/Button';
import {
  CheckCircle2,
  Lock,
  Lightbulb,
  HelpCircle,
  ArrowRight,
  Briefcase,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';

export const MissionPanel: React.FC = () => {
  const {
    missions,
    activeMission,
    progressMap,
    selectMission,
    revealNextHint,
    advanceToNextMission,
  } = useMissionStore();
  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!activeMission) return null;

  const currentProg = progressMap[activeMission.id] || {
    status: 'unlocked',
    attemptsCount: 0,
    hintsRevealed: 0,
  };

  const isCompleted = currentProg.status === 'completed';
  const hintsRevealed = currentProg.hintsRevealed;
  const canSeeSolution = isCompleted || currentProg.attemptsCount >= 3;

  return (
    <div
      className={`h-full flex flex-col ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900/90 border-slate-800 text-slate-200'
      } border-r overflow-hidden w-full lg:w-[410px] flex-shrink-0 transition-colors duration-150`}
    >
      {/* Top Mission Selector Header */}
      <div
        className={`p-4 border-b ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/40'
        } relative`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            {activeMission.role}
          </span>
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
            +{activeMission.xpReward} XP
          </span>
        </div>

        {/* Mission Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full flex items-center justify-between p-2 rounded-xl ${
              isLight
                ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 shadow-sm'
                : 'bg-slate-850 hover:bg-slate-800 border-slate-700/60 text-slate-100'
            } border transition-colors text-left`}
          >
            <div className="flex items-center gap-2 truncate">
              <span
                className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : isLight
                    ? 'bg-slate-100 text-slate-700'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : activeMission.order}
              </span>
              <span
                className={`text-xs font-semibold ${
                  isLight ? 'text-slate-900' : 'text-slate-100'
                } truncate`}
              >
                {activeMission.title}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </button>

          {isDropdownOpen && (
            <div
              className={`absolute top-full left-0 right-0 mt-1 z-30 ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
              } border rounded-xl shadow-2xl p-1.5 max-h-72 overflow-y-auto`}
            >
              {missions.map((m) => {
                const prog = progressMap[m.id];
                const isLocked = prog?.status === 'locked';
                const isDone = prog?.status === 'completed';
                const isCurrent = m.id === activeMission.id;

                return (
                  <button
                    key={m.id}
                    disabled={isLocked}
                    onClick={() => {
                      selectMission(m.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                      isCurrent
                        ? isLight
                          ? 'bg-emerald-50 text-emerald-800 font-semibold'
                          : 'bg-emerald-500/15 text-emerald-300 font-semibold'
                        : isLocked
                        ? 'opacity-40 cursor-not-allowed text-slate-400'
                        : isLight
                        ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[11px] text-slate-400">#{m.order}</span>
                      <span className="truncate">{m.title}</span>
                    </div>
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : isLocked ? (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Mission Content Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Storyline Context */}
        <div
          className={`p-3.5 rounded-xl ${
            isLight
              ? 'bg-slate-50 border-slate-200 text-slate-700'
              : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
          } border leading-relaxed`}
        >
          <p className={`italic ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {activeMission.storyline}
          </p>
        </div>

        {/* Business Problem */}
        <div className="space-y-1.5">
          <div
            className={`flex items-center gap-1.5 font-bold ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            } text-[11px] uppercase tracking-wider`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>The Operational Breakdown</span>
          </div>
          <p
            className={`leading-relaxed ${
              isLight
                ? 'bg-amber-50/80 border-amber-200 text-slate-800'
                : 'bg-amber-500/5 border-amber-500/15 text-slate-300'
            } border p-3 rounded-xl`}
          >
            {activeMission.businessProblem}
          </p>
        </div>

        {/* Objective */}
        <div
          className={`p-3.5 rounded-xl ${
            isLight
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
          } border`}
        >
          <span
            className={`font-bold block ${
              isLight ? 'text-emerald-800' : 'text-emerald-400'
            } text-xs mb-1`}
          >
            Mission Objective
          </span>
          <p className="leading-relaxed">{activeMission.objective}</p>
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          <span
            className={`font-bold ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            } text-[11px] uppercase tracking-wider block`}
          >
            Task Checklist
          </span>
          <div className="space-y-1.5">
            {activeMission.checklist.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-700'
                    : 'bg-slate-950/40 border-slate-800/60 text-slate-300'
                } p-2 rounded-lg border`}
              >
                <div
                  className={`w-4 h-4 rounded border ${
                    isLight ? 'border-slate-300 bg-white' : 'border-slate-700 bg-slate-850'
                  } flex items-center justify-center flex-shrink-0 mt-0.5`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <div className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-slate-400' : 'bg-slate-600'}`} />
                  )}
                </div>
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progressive Hints */}
        <div className={`space-y-2 pt-1 border-t ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
          <div className="flex items-center justify-between">
            <span
              className={`font-bold ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              } text-[11px] uppercase tracking-wider flex items-center gap-1.5`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Progressive Hints ({hintsRevealed}/3)
            </span>
            {hintsRevealed < 3 && (
              <button
                onClick={revealNextHint}
                className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 transition-colors"
              >
                Reveal Hint {hintsRevealed + 1}
              </button>
            )}
          </div>

          {hintsRevealed === 0 && (
            <p className={`text-[11px] ${isLight ? 'text-slate-400' : 'text-slate-500'} italic`}>
              Try solving the problem first. If you get stuck, reveal progressive hints step-by-step.
            </p>
          )}

          {hintsRevealed >= 1 && (
            <div
              className={`p-2.5 rounded-lg ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-slate-850 border-slate-700/60 text-slate-300'
              } border text-xs leading-relaxed animate-in fade-in`}
            >
              <strong className="text-amber-600 dark:text-amber-300 block text-[11px] mb-0.5">
                Hint 1 (Conceptual):
              </strong>
              {activeMission.hints[0]}
            </div>
          )}

          {hintsRevealed >= 2 && (
            <div
              className={`p-2.5 rounded-lg ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-slate-850 border-slate-700/60 text-slate-300'
              } border text-xs leading-relaxed animate-in fade-in`}
            >
              <strong className="text-amber-600 dark:text-amber-300 block text-[11px] mb-0.5">
                Hint 2 (Directional):
              </strong>
              {activeMission.hints[1]}
            </div>
          )}

          {hintsRevealed >= 3 && (
            <div
              className={`p-2.5 rounded-lg ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-slate-850 border-slate-700/60 text-slate-300'
              } border text-xs leading-relaxed animate-in fade-in`}
            >
              <strong className="text-amber-600 dark:text-amber-300 block text-[11px] mb-0.5">
                Hint 3 (Detailed Structure):
              </strong>
              <pre
                className={`mt-1 font-mono text-[11px] ${
                  isLight ? 'text-emerald-700 bg-white border border-slate-200' : 'text-emerald-300 bg-slate-900'
                } whitespace-pre-wrap p-2 rounded`}
              >
                {activeMission.hints[2]}
              </pre>
            </div>
          )}
        </div>

        {/* Solution Review (Available if completed or 3+ attempts) */}
        {canSeeSolution && (
          <div className={`pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-slate-850 hover:bg-slate-800 border-slate-700 text-slate-300'
              } border text-xs font-semibold transition-colors`}
            >
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
                {showExplanation ? 'Hide Solution Breakdown' : 'View Educational Breakdown'}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showExplanation ? 'rotate-180' : ''}`}
              />
            </button>

            {showExplanation && (
              <div
                className={`mt-2 p-3 rounded-xl ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'
                } border space-y-2 text-xs`}
              >
                <p className="leading-relaxed">{activeMission.solutionExplanation}</p>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Canonical SQL Approach:
                  </span>
                  <pre
                    className={`p-2 rounded ${
                      isLight ? 'bg-white border border-slate-200 text-emerald-700' : 'bg-slate-900 text-emerald-300'
                    } font-mono text-[11px] overflow-x-auto whitespace-pre-wrap`}
                  >
                    {activeMission.sampleSolution}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Completion Banner / Next Mission Button */}
      {isCompleted && (
        <div
          className={`p-4 border-t ${
            isLight ? 'border-emerald-200 bg-emerald-50/70' : 'border-slate-800 bg-emerald-950/30'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Mission Completed!
            </span>
            <span className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              +{activeMission.xpReward} XP
            </span>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={advanceToNextMission}
            className="w-full"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Advance to Next Mission
          </Button>
        </div>
      )}
    </div>
  );
};
