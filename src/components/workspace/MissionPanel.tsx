import React, { useState } from 'react';
import { useMissionStore } from '../../stores/useMissionStore';
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
    <div className="h-full flex flex-col bg-slate-900/90 border-r border-slate-800 text-slate-200 overflow-hidden w-full lg:w-[410px] flex-shrink-0">
      {/* Top Mission Selector Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/40 relative">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            {activeMission.role}
          </span>
          <span className="text-[11px] font-bold text-amber-400">
            +{activeMission.xpReward} XP
          </span>
        </div>

        {/* Mission Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/60 transition-colors text-left"
          >
            <div className="flex items-center gap-2 truncate">
              <span
                className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : activeMission.order}
              </span>
              <span className="text-xs font-semibold text-slate-100 truncate">
                {activeMission.title}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 max-h-72 overflow-y-auto">
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
                        ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                        : isLocked
                        ? 'opacity-40 cursor-not-allowed text-slate-500'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[11px] text-slate-500">#{m.order}</span>
                      <span className="truncate">{m.title}</span>
                    </div>
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isLocked ? (
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
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
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 leading-relaxed text-slate-300">
          <p className="italic text-slate-400">{activeMission.storyline}</p>
        </div>

        {/* Business Problem */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-300 text-[11px] uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>The Operational Breakdown</span>
          </div>
          <p className="text-slate-300 leading-relaxed bg-amber-500/5 border border-amber-500/15 p-3 rounded-xl">
            {activeMission.businessProblem}
          </p>
        </div>

        {/* Objective */}
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200">
          <span className="font-bold block text-emerald-400 text-xs mb-1">
            Mission Objective
          </span>
          <p className="leading-relaxed">{activeMission.objective}</p>
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider block">
            Task Checklist
          </span>
          <div className="space-y-1.5">
            {activeMission.checklist.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-slate-300 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60"
              >
                <div className="w-4 h-4 rounded border border-slate-700 bg-slate-850 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  )}
                </div>
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progressive Hints */}
        <div className="space-y-2 pt-1 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Progressive Hints ({hintsRevealed}/3)
            </span>
            {hintsRevealed < 3 && (
              <button
                onClick={revealNextHint}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                Reveal Hint {hintsRevealed + 1}
              </button>
            )}
          </div>

          {hintsRevealed === 0 && (
            <p className="text-[11px] text-slate-500 italic">
              Try solving the problem first. If you get stuck, reveal progressive hints step-by-step.
            </p>
          )}

          {hintsRevealed >= 1 && (
            <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-700/60 text-slate-300 text-xs leading-relaxed animate-in fade-in">
              <strong className="text-amber-300 block text-[11px] mb-0.5">
                Hint 1 (Conceptual):
              </strong>
              {activeMission.hints[0]}
            </div>
          )}

          {hintsRevealed >= 2 && (
            <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-700/60 text-slate-300 text-xs leading-relaxed animate-in fade-in">
              <strong className="text-amber-300 block text-[11px] mb-0.5">
                Hint 2 (Directional):
              </strong>
              {activeMission.hints[1]}
            </div>
          )}

          {hintsRevealed >= 3 && (
            <div className="p-2.5 rounded-lg bg-slate-850 border border-slate-700/60 text-slate-300 text-xs leading-relaxed animate-in fade-in">
              <strong className="text-amber-300 block text-[11px] mb-0.5">
                Hint 3 (Detailed Structure):
              </strong>
              <pre className="mt-1 font-mono text-[11px] text-emerald-300 whitespace-pre-wrap bg-slate-900 p-2 rounded">
                {activeMission.hints[2]}
              </pre>
            </div>
          )}
        </div>

        {/* Solution Review (Available if completed or 3+ attempts) */}
        {canSeeSolution && (
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                {showExplanation ? 'Hide Solution Breakdown' : 'View Educational Breakdown'}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showExplanation ? 'rotate-180' : ''}`}
              />
            </button>

            {showExplanation && (
              <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  {activeMission.solutionExplanation}
                </p>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Canonical SQL Approach:
                  </span>
                  <pre className="p-2 rounded bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
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
        <div className="p-4 border-t border-slate-800 bg-emerald-950/30">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Mission Completed!
            </span>
            <span className="text-xs font-semibold text-slate-300">
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
