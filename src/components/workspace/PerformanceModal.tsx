import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { WorldDefinition } from '../../types/world';
import { useThemeStore } from '../../stores/useThemeStore';
import { useMissionStore } from '../../stores/useMissionStore';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Code2,
  Sparkles,
  Copy,
  Check,
  Zap,
  Target,
  BarChart3,
  Layers,
} from 'lucide-react';

interface PerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  world: WorldDefinition;
}

function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds < 1) return '0s';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

export const PerformanceModal: React.FC<PerformanceModalProps> = ({
  isOpen,
  onClose,
  world,
}) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';
  const { progressMap, getMissionTimeSpent } = useMissionStore();

  const [expandedMissionId, setExpandedMissionId] = useState<string | null>(null);
  const [copiedMissionId, setCopiedMissionId] = useState<string | null>(null);

  // Compute aggregate statistics
  const missions = world.missions;
  const completedMissions = missions.filter(
    (m) => progressMap[m.id]?.status === 'completed'
  );
  const completedCount = completedMissions.length;
  const totalCount = missions.length;
  const percentComplete = Math.round((completedCount / totalCount) * 100);

  let totalTimeSeconds = 0;
  let totalAttempts = 0;
  let totalMistakes = 0;
  let totalHintsUsed = 0;
  let completedTimeSeconds = 0;

  missions.forEach((m) => {
    const prog = progressMap[m.id];
    const timeSpent = getMissionTimeSpent(m.id);
    totalTimeSeconds += timeSpent;
    if (prog?.status === 'completed') {
      completedTimeSeconds += timeSpent;
    }
    totalAttempts += prog?.attemptsCount || 0;
    totalMistakes += prog?.errorsCount || 0;
    totalHintsUsed += prog?.hintsRevealed || 0;
  });

  const accuracyRate =
    totalAttempts > 0
      ? Math.max(0, Math.round(((totalAttempts - totalMistakes) / totalAttempts) * 100))
      : 100;

  const avgTimePerTask =
    completedCount > 0
      ? formatDuration(Math.round(completedTimeSeconds / completedCount))
      : '--';

  // Performance Rank determination
  let rankTitle = 'SQL Apprentice';
  let rankDesc = 'Begin working through business missions to build operational telemetry.';
  let rankBadgeColor = 'text-sky-500 bg-sky-500/10 border-sky-500/20';

  if (completedCount === totalCount) {
    if (accuracyRate >= 85) {
      rankTitle = 'Principal Data Architect ⭐⭐⭐';
      rankDesc = 'Phenomenal precision. Flawless schema modeling and queries with minimal errors.';
      rankBadgeColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    } else {
      rankTitle = 'Senior Operations Restorer ⭐⭐';
      rankDesc = 'Successfully navigated operational hurdles and restored full database integrity.';
      rankBadgeColor = 'text-teal-500 bg-teal-500/10 border-teal-500/20';
    }
  } else if (completedCount >= 5) {
    rankTitle = 'Operational SQL Specialist ⭐⭐';
    rankDesc = 'Over halfway through industry scenarios. Demonstrating solid relational schema handling.';
    rankBadgeColor = 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
  } else if (completedCount >= 1) {
    rankTitle = 'Junior Database Technician ⭐';
    rankDesc = 'Gaining hands-on momentum. Continue executing queries to improve speed and accuracy.';
    rankBadgeColor = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  }

  // Collect all unique mastered concepts from completed missions
  const masteredTopics = Array.from(
    new Set(completedMissions.flatMap((m) => m.sqlTopics))
  );

  const toggleExpand = (id: string) => {
    setExpandedMissionId((prev) => (prev === id ? null : id));
  };

  const handleCopySql = (sql: string, missionId: string) => {
    navigator.clipboard.writeText(sql);
    setCopiedMissionId(missionId);
    setTimeout(() => setCopiedMissionId(null), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="World Performance & Analytics"
      subtitle={`${world.name} • ${world.industry}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Top 4 Key Performance Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Card 1: Tasks Completed */}
          <div
            className={`p-3.5 rounded-xl border ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-850 border-slate-800'
            } flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1">
              <span>Missions</span>
              <Target className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <div
                className={`text-2xl font-black ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {completedCount}{' '}
                <span className="text-sm font-medium text-slate-400">
                  / {totalCount}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
              <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                {percentComplete}% completed
              </div>
            </div>
          </div>

          {/* Card 2: Total Time Spent */}
          <div
            className={`p-3.5 rounded-xl border ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-850 border-slate-800'
            } flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1">
              <span>Time Spent</span>
              <Clock className="w-4 h-4 text-sky-500" />
            </div>
            <div>
              <div
                className={`text-2xl font-black ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {formatDuration(totalTimeSeconds)}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                Avg. {avgTimePerTask} / task
              </div>
            </div>
          </div>

          {/* Card 3: Mistakes & Accuracy */}
          <div
            className={`p-3.5 rounded-xl border ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-850 border-slate-800'
            } flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1">
              <span>Accuracy</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <div
                className={`text-2xl font-black ${
                  accuracyRate >= 80
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-500'
                }`}
              >
                {accuracyRate}%
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                {totalMistakes} mistakes • {totalAttempts} runs
              </div>
            </div>
          </div>

          {/* Card 4: Progressive Hints Reliance */}
          <div
            className={`p-3.5 rounded-xl border ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-850 border-slate-800'
            } flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1">
              <span>Hints Used</span>
              <HelpCircle className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <div
                className={`text-2xl font-black ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {totalHintsUsed}{' '}
                <span className="text-sm font-medium text-slate-400">
                  / {totalCount * 3}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                {totalHintsUsed === 0
                  ? 'Pure independent solver'
                  : `${totalHintsUsed} hints revealed`}
              </div>
            </div>
          </div>
        </div>

        {/* Evaluation Banner */}
        <div
          className={`p-4 rounded-xl border ${
            isLight
              ? 'bg-gradient-to-r from-emerald-50/60 to-sky-50/60 border-slate-200'
              : 'bg-gradient-to-r from-emerald-950/20 to-sky-950/20 border-slate-800'
          } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border font-bold text-lg ${rankBadgeColor}`}
            >
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Current Assessment
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${rankBadgeColor}`}
                >
                  {rankTitle}
                </span>
              </div>
              <p
                className={`text-xs mt-0.5 ${
                  isLight ? 'text-slate-600' : 'text-slate-300'
                }`}
              >
                {rankDesc}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex-shrink-0">
            <Zap className="w-3.5 h-3.5" />
            <span>
              {completedCount === totalCount
                ? 'World 100% Mastered'
                : `${totalCount - completedCount} Missions Remaining`}
            </span>
          </div>
        </div>

        {/* Mastered SQL Concepts */}
        {masteredTopics.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>SQL Concepts Mastered in this World ({masteredTopics.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {masteredTopics.map((topic) => (
                <span
                  key={topic}
                  className={`px-2 py-1 rounded-md text-[11px] font-mono font-medium border ${
                    isLight
                      ? 'bg-slate-100 border-slate-200 text-slate-700'
                      : 'bg-slate-850 border-slate-800 text-slate-300'
                  }`}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Per-Task Performance Breakdown */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              <span>Task Breakdown & Mistakes Log</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Click a task to inspect mistakes & solution
            </span>
          </div>

          <div className="space-y-2">
            {missions.map((mission) => {
              const prog = progressMap[mission.id];
              const isCompleted = prog?.status === 'completed';
              const isUnlocked = prog?.status === 'unlocked' || prog?.status === 'in_progress';
              const isLocked = !isCompleted && !isUnlocked;
              const timeSpent = getMissionTimeSpent(mission.id);
              const attempts = prog?.attemptsCount || 0;
              const errors = prog?.errorsCount || 0;
              const hints = prog?.hintsRevealed || 0;
              const mistakesList = prog?.mistakes || [];
              const isExpanded = expandedMissionId === mission.id;

              return (
                <div
                  key={mission.id}
                  className={`rounded-xl border transition-all ${
                    isLight
                      ? 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                      : 'bg-slate-850/80 border-slate-800 hover:border-slate-700'
                  } overflow-hidden`}
                >
                  {/* Task Summary Row */}
                  <div
                    onClick={() => toggleExpand(mission.id)}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : isUnlocked
                            ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30 animate-pulse'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <span>#{mission.order}</span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-xs sm:text-sm ${
                              isLight ? 'text-slate-800' : 'text-slate-100'
                            }`}
                          >
                            {mission.title}
                          </span>
                          {isCompleted && (
                            <Badge variant="emerald" size="sm">
                              Completed
                            </Badge>
                          )}
                          {isUnlocked && !isCompleted && (
                            <Badge variant="sky" size="sm">
                              In Progress
                            </Badge>
                          )}
                          {isLocked && (
                            <Badge variant="slate" size="sm">
                              Locked
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          {mission.objective}
                        </p>
                      </div>
                    </div>

                    {/* Right Metrics in Task Row */}
                    <div className="flex items-center gap-3 self-end sm:self-auto text-xs font-mono">
                      {/* Time taken */}
                      <div
                        className="flex items-center gap-1 text-slate-500 dark:text-slate-400"
                        title="Time taken to complete this task"
                      >
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{timeSpent > 0 ? formatDuration(timeSpent) : '--'}</span>
                      </div>

                      {/* Attempts */}
                      <div
                        className={`flex items-center gap-1 ${
                          attempts === 1 && isCompleted
                            ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                        title="Total SQL query execution attempts"
                      >
                        <span>{attempts} {attempts === 1 ? 'try' : 'tries'}</span>
                      </div>

                      {/* Mistakes */}
                      <div
                        className={`flex items-center gap-1 px-2 py-0.5 rounded ${
                          errors > 0
                            ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        }`}
                        title="Mistakes or validation errors encountered"
                      >
                        {errors > 0 ? (
                          <>
                            <AlertTriangle className="w-3 h-3 text-rose-500" />
                            <span>{errors} {errors === 1 ? 'mistake' : 'mistakes'}</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>0 mistakes</span>
                          </>
                        )}
                      </div>

                      {/* Expand Chevron */}
                      <button
                        type="button"
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Task Detail: Mistakes Log & Winning Query */}
                  {isExpanded && (
                    <div
                      className={`p-4 border-t ${
                        isLight
                          ? 'border-slate-200 bg-white'
                          : 'border-slate-800 bg-slate-900/60'
                      } space-y-3 animate-in fade-in duration-200`}
                    >
                      {/* Mistakes Log */}
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                          <span>Mistakes & Error Log ({mistakesList.length})</span>
                        </div>
                        {mistakesList.length > 0 ? (
                          <div className="space-y-1.5">
                            {mistakesList.map((err, i) => (
                              <div
                                key={i}
                                className="px-3 py-2 rounded-lg bg-rose-500/5 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-mono text-xs flex items-start gap-2"
                              >
                                <span className="font-bold text-rose-500 flex-shrink-0">
                                  #{i + 1}
                                </span>
                                <span className="break-words">{err}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                            <span>
                              Flawless execution! No runtime errors or constraint failures recorded for this mission.
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Hints Breakdown */}
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                        <span>
                          Progressive Hints Unlocked:{' '}
                          <strong className="text-slate-700 dark:text-slate-200">
                            {hints} / 3
                          </strong>
                        </span>
                        <span>
                          Topics: {mission.sqlTopics.join(', ')}
                        </span>
                      </div>

                      {/* Best Solution Query Snippet */}
                      {prog?.bestSql && (
                        <div className="pt-2">
                          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            <div className="flex items-center gap-1.5">
                              <Code2 className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Solved Query</span>
                            </div>
                            <button
                              onClick={() => handleCopySql(prog.bestSql!, mission.id)}
                              className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                            >
                              {copiedMissionId === mission.id ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy SQL</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre
                            className={`p-3 rounded-lg text-xs font-mono overflow-x-auto ${
                              isLight
                                ? 'bg-slate-100 text-slate-800 border border-slate-200'
                                : 'bg-slate-950 text-slate-200 border border-slate-800'
                            }`}
                          >
                            <code>{prog.bestSql}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Footer Actions */}
      <div className="flex items-center justify-between pt-4 mt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="text-xs text-slate-400">
          Analytics persist in local storage & SQLite state
        </div>
        <Button variant="primary" size="sm" onClick={onClose}>
          Continue Mission
        </Button>
      </div>
    </Modal>
  );
};
