import React, { useState, useEffect } from 'react';
import { ExcelWorldDefinition } from '../../modules/excel/worlds';
import { useExcelStore } from '../../stores/useExcelStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { FlipCard } from '../ui/FlipCard';
import {
  FileSpreadsheet,
  Lock,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Building2,
  Briefcase,
} from 'lucide-react';

interface ExcelWorldCardProps {
  world: ExcelWorldDefinition;
}

const difficultyColors: Record<string, { badge: string; border: string }> = {
  Beginner: {
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    border: 'border-emerald-500/40',
  },
  Intermediate: {
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    border: 'border-amber-500/40',
  },
  Advanced: {
    badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    border: 'border-rose-500/40',
  },
};

export const ExcelWorldCard: React.FC<ExcelWorldCardProps> = ({ world }) => {
  const { loadWorld, isWorldUnlocked, getWorldUnlockRequirement, worldProgress } =
    useExcelStore();
  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';

  const [isFlipped, setIsFlipped] = useState(false);

  const isUnlocked = isWorldUnlocked(world.id);
  const unlockReq = getWorldUnlockRequirement(world.id);

  // Auto flip back after 60 seconds
  useEffect(() => {
    if (!isFlipped) return;
    const timer = setTimeout(() => setIsFlipped(false), 60000);
    return () => clearTimeout(timer);
  }, [isFlipped]);

  const progress = worldProgress[world.id] || {
    completedMissionsCount: 0,
    totalMissionsCount: world.missions.length,
    percentComplete: 0,
    isCompleted: false,
  };

  const diffStyle = difficultyColors[world.difficulty] || difficultyColors.Beginner;

  // Front Content
  const frontContent = (
    <div
      className={`w-full h-full flex flex-col justify-between border rounded-[26px] overflow-hidden select-none transition-colors duration-200 ${
        isUnlocked
          ? isLight
            ? 'bg-white border-slate-200/90 shadow-sm'
            : 'bg-slate-900 border-slate-800'
          : isLight
          ? 'bg-slate-100/90 border-slate-200 opacity-85'
          : 'bg-slate-900/60 border-slate-800/80 opacity-75'
      }`}
    >
      {/* Visual Thumbnail Cover Banner */}
      <div className="relative w-full h-44 overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-slate-950 flex-shrink-0">
        <img
          src={world.thumbnailUrl}
          alt={world.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            !isUnlocked ? 'grayscale contrast-125 opacity-60' : ''
          }`}
          loading="lazy"
          onError={(e) => {
            // Fallback gradient if thumbnail image not found
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Difficulty Badge Top Right */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-md backdrop-blur-md ${diffStyle.badge}`}
          >
            {world.difficulty}
          </span>
        </div>

        {/* Lock Overlay if Locked */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center z-20">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 mb-2 shadow-lg">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-white text-xs font-bold uppercase tracking-wider">World Locked</p>
            <p className="text-slate-300 text-[11px] mt-1 max-w-[220px]">
              {unlockReq.description}
            </p>
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{world.industry}</span>
          </div>

          <h3 className="text-xl font-black tracking-tight mb-1 text-slate-900 dark:text-white">
            {world.name}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
            {world.tagline}
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
              <span>{progress.completedMissionsCount} of {world.missions.length} Missions</span>
              <span>{progress.percentComplete}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 rounded-full"
                style={{ width: `${progress.percentComplete}%` }}
              />
            </div>
          </div>

          {/* Topics Chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {world.excelTopics.slice(0, 4).map((topic, i) => (
              <span
                key={i}
                className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md ${
                  isLight
                    ? 'bg-slate-100 text-slate-700 border border-slate-200'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={() => setIsFlipped(true)}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
            }`}
            title="Inspect Story & Objectives"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Story</span>
          </button>

          <button
            onClick={() => isUnlocked && loadWorld(world)}
            disabled={!isUnlocked}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow ${
              isUnlocked
                ? 'bg-[#107c41] hover:bg-emerald-600 text-white shadow-emerald-900/20'
                : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isUnlocked ? (
              <>
                <span>Enter World</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>Locked</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Back Content
  const backContent = (
    <div
      className={`w-full h-full p-6 flex flex-col justify-between border rounded-[26px] select-none ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}
    >
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>{world.storyIntro.organization}</span>
          </div>
          <button
            onClick={() => setIsFlipped(false)}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            title="Flip to front"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-lg font-black tracking-tight mb-2 text-slate-900 dark:text-white">
          {world.storyIntro.roleTitle}
        </h3>

        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 mb-4">
          {world.storyIntro.background}
        </p>

        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
          <span>Key Responsibilities</span>
        </h4>
        <div className="space-y-1.5 mb-4">
          {world.storyIntro.keyResponsibilities.map((resp, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>{resp}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <button
          onClick={() => setIsFlipped(false)}
          className={`py-2 px-3 rounded-xl text-xs font-semibold ${
            isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'
          }`}
        >
          Back
        </button>
        <button
          onClick={() => isUnlocked && loadWorld(world)}
          disabled={!isUnlocked}
          className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black text-white bg-[#107c41] hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1.5 shadow"
        >
          <span>Launch Operations</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <FlipCard
      flipped={isFlipped}
      onFlipChange={setIsFlipped}
      front={frontContent}
      back={backContent}
      className="group h-[460px]"
    />
  );
};
