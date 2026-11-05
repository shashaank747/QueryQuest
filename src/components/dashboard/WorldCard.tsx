import React, { useState, useEffect } from 'react';
import { WorldDefinition } from '../../types/world';
import { useWorldStore } from '../../stores/useWorldStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { FlipCard } from '../ui/FlipCard';
import {
  ShoppingCart,
  Plane,
  Boxes,
  Activity,
  Landmark,
  Clock,
  ArrowRight,
  Lock,
  CheckCircle2,
  RotateCcw,
  Database,
  Building2,
  Briefcase,
} from 'lucide-react';

interface WorldCardProps {
  world: WorldDefinition;
}

const iconComponentMap: Record<string, React.ReactNode> = {
  ShoppingCart: <ShoppingCart className="w-4 h-4" />,
  Plane: <Plane className="w-4 h-4" />,
  Boxes: <Boxes className="w-4 h-4" />,
  Activity: <Activity className="w-4 h-4" />,
  Landmark: <Landmark className="w-4 h-4" />,
};

const difficultyVariants: Record<string, 'emerald' | 'amber' | 'rose'> = {
  Beginner: 'emerald',
  Intermediate: 'amber',
  Advanced: 'rose',
};

const accentColors: Record<string, { light: string; dark: string; border: string }> = {
  emerald: { light: 'text-emerald-600', dark: 'text-emerald-400', border: 'border-emerald-500/30' },
  sky: { light: 'text-sky-600', dark: 'text-sky-400', border: 'border-sky-500/30' },
  amber: { light: 'text-amber-600', dark: 'text-amber-400', border: 'border-amber-500/30' },
  rose: { light: 'text-rose-600', dark: 'text-rose-400', border: 'border-rose-500/30' },
  indigo: { light: 'text-indigo-600', dark: 'text-indigo-400', border: 'border-indigo-500/30' },
};

export const WorldCard: React.FC<WorldCardProps> = ({ world }) => {
  const { setActiveWorld, worldProgress } = useWorldStore();
  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';
  const [isFlipped, setIsFlipped] = useState(false);

  // Auto-flip back to front after 60 seconds if not turned back by the user
  useEffect(() => {
    if (!isFlipped) return;

    const timer = setTimeout(() => {
      setIsFlipped(false);
    }, 60000);

    return () => clearTimeout(timer);
  }, [isFlipped]);

  const progress = worldProgress[world.id] || {
    completedMissionsCount: 0,
    totalMissionsCount: world.missions.length,
    percentComplete: 0,
    isCompleted: false,
  };

  const activeColor = accentColors[world.accentColor] || accentColors.emerald;

  // Front Face Component
  const frontContent = (
    <div
      className={`w-full h-full flex flex-col justify-between border rounded-[26px] overflow-hidden select-none transition-colors duration-200 ${
        world.isAvailable
          ? isLight
            ? 'bg-white border-slate-200/90 shadow-sm'
            : 'bg-slate-900 border-slate-800'
          : isLight
          ? 'bg-slate-100/80 border-slate-200 opacity-90'
          : 'bg-slate-900/60 border-slate-800/80 opacity-85'
      }`}
    >
      {/* Visual Thumbnail Cover Banner */}
      {world.thumbnailUrl ? (
        <div className="relative w-full h-36 overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-slate-950 flex-shrink-0">
          <img
            src={world.thumbnailUrl}
            alt={world.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 pointer-events-none"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-black/35 pointer-events-none" />

          {/* Top badges on image */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-auto">
            {world.isAvailable ? (
              <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-md">
                Live Case Study
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider bg-slate-900/80 text-slate-400 border border-slate-700/50 backdrop-blur-md">
                Roadmap Preview
              </span>
            )}

            <div className="flex items-center gap-1.5">
              <Badge variant={difficultyVariants[world.difficulty] || 'slate'} size="sm">
                {world.difficulty}
              </Badge>
              <div className="px-1.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 flex items-center gap-1 text-[10.5px] text-white font-medium">
                <Clock className="w-3 h-3 text-slate-300" />
                <span>{world.estimatedTime}</span>
              </div>
              <button
                type="button"
                data-no-flip
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(true);
                }}
                title="Flip card for world details"
                className="p-1 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-slate-200 hover:text-white border border-slate-700/70 hover:border-emerald-400 transition-colors backdrop-blur-md flex items-center justify-center cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Floating category icon overlapping bottom edge */}
          <div className="absolute -bottom-3 left-4 pointer-events-none">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-md ${
                isLight
                  ? `bg-white border-slate-200 ${activeColor.light} shadow-slate-200/60`
                  : `bg-slate-900 border-slate-700 ${activeColor.dark} shadow-black/50`
              }`}
            >
              {iconComponentMap[world.iconName] || <Landmark className="w-4 h-4" />}
            </div>
          </div>
        </div>
      ) : (
        /* Fallback if no thumbnail */
        <div className="p-4 pb-0 flex items-start justify-between">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              isLight
                ? `bg-white border-slate-200 ${activeColor.light}`
                : `bg-slate-900 border-slate-700 ${activeColor.dark}`
            }`}
          >
            {iconComponentMap[world.iconName] || <ShoppingCart className="w-4 h-4" />}
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant={difficultyVariants[world.difficulty] || 'slate'} size="sm">
              {world.difficulty}
            </Badge>
            <div className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10.5px] font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{world.estimatedTime}</span>
            </div>
            <button
              type="button"
              data-no-flip
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(true);
              }}
              title="Flip card for world details"
              className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 text-slate-600 dark:text-slate-300 hover:text-white border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Middle Content */}
      <div className={`px-4 ${world.thumbnailUrl ? 'pt-4' : 'pt-2'} pb-1.5 flex-1 flex flex-col justify-between`}>
        <div>
          <div className="text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-0.5">
            {world.industry}
          </div>
          <h3
            className={`text-lg font-bold tracking-tight leading-snug ${
              isLight ? 'text-slate-900' : 'text-slate-100'
            }`}
          >
            {world.name}
          </h3>
          <p
            className={`text-xs ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            } mt-1 line-clamp-2 leading-relaxed`}
          >
            {world.tagline || world.description}
          </p>
        </div>

        {/* SQL Topics Tags preview */}
        <div className="flex flex-wrap gap-1 mt-2">
          {world.sqlTopics.slice(0, 3).map((topic, i) => (
            <span
              key={i}
              className={`text-[9.5px] px-2 py-0.5 rounded-md ${
                isLight
                  ? 'bg-slate-100 text-slate-700 border border-slate-200'
                  : 'bg-slate-800 text-slate-300 border border-slate-700/60'
              } font-mono`}
            >
              {topic}
            </span>
          ))}
          {world.sqlTopics.length > 3 && (
            <span
              className={`text-[9.5px] px-1.5 py-0.5 rounded-md ${
                isLight ? 'bg-slate-100 text-slate-500' : 'bg-slate-800 text-slate-500'
              } font-mono`}
            >
              +{world.sqlTopics.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer & Primary Action */}
      <div
        className={`px-4 py-2.5 border-t ${
          isLight ? 'border-slate-100 bg-slate-50/70' : 'border-slate-800/60 bg-slate-950/30'
        }`}
      >
        {world.isAvailable ? (
          <div>
            <div
              className={`flex items-center justify-between text-[11px] ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              } mb-1.5`}
            >
              <span className="font-medium">
                {progress.isCompleted ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> All 10 Missions Completed
                  </span>
                ) : (
                  `${progress.completedMissionsCount} of ${progress.totalMissionsCount} Missions`
                )}
              </span>
              <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                {progress.percentComplete}%
              </span>
            </div>

            {/* Progress Bar */}
            <div
              className={`w-full h-1.5 ${
                isLight ? 'bg-slate-200' : 'bg-slate-800'
              } rounded-full overflow-hidden mb-2`}
            >
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
                style={{ width: `${progress.percentComplete}%` }}
              />
            </div>

            <Button
              variant="primary"
              className="w-full py-1.5 text-xs"
              data-no-flip
              onClick={() => setActiveWorld(world.id)}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              {progress.completedMissionsCount > 0 ? 'Resume Operations' : 'Enter World'}
            </Button>
          </div>
        ) : (
          <div>
            <div
              className={`flex items-center justify-between text-[11px] ${
                isLight ? 'text-slate-500' : 'text-slate-500'
              } mb-2`}
            >
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" /> Coming in Next Phase
              </span>
              <span className="font-mono text-[10px]">Roadmap</span>
            </div>
            <Button variant="secondary" className="w-full py-1.5 text-xs" disabled data-no-flip>
              Preview Only
            </Button>
          </div>
        )}

        {/* Subtle Hint */}
        <div className="text-[9.5px] text-center text-slate-400 dark:text-slate-500 mt-1 flex items-center justify-center gap-1">
          <span>Click card or drag to inspect dossier</span>
          <RotateCcw className="w-2.5 h-2.5 opacity-60" />
        </div>
      </div>
    </div>
  );

  // Back Face Component (Full Dossier & Architecture Specs)
  const backContent = (
    <div
      className={`w-full h-full flex flex-col justify-between p-4 border rounded-[26px] overflow-hidden select-none transition-colors duration-200 ${
        isLight
          ? 'bg-gradient-to-br from-white via-slate-50 to-slate-100/90 border-slate-200 text-slate-800'
          : 'bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border-slate-800 text-slate-100'
      }`}
    >
      {/* Dossier Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
            <Briefcase className="w-3 h-3" />
            <span className="truncate max-w-[180px]">{world.storyIntro.roleTitle}</span>
          </div>
          <button
            type="button"
            data-no-flip
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(false);
            }}
            className="px-2 py-0.5 rounded-lg text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>← Front</span>
          </button>
        </div>

        {/* Organization & DB spec */}
        <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold text-xs">
          <Building2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
          <span className="truncate">{world.storyIntro.organization}</span>
        </div>

        <div className="flex items-center gap-2 text-[10.5px] mt-1">
          <div className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800/80 font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1 border border-slate-300/60 dark:border-slate-700/60">
            <Database className="w-3 h-3 text-emerald-500" />
            <span>{world.dbFileName}</span>
          </div>
          <span className="text-slate-400 dark:text-slate-600">•</span>
          <span className="text-slate-500 dark:text-slate-400">{world.industry}</span>
        </div>
      </div>

      {/* Dossier Middle Area (Fits cleanly without scrolling) */}
      <div className="flex-1 flex flex-col justify-between my-2 overflow-hidden">
        {/* Scenario Background */}
        <div
          className={`p-2 rounded-xl border text-xs leading-relaxed ${
            isLight
              ? 'bg-slate-100/70 border-slate-200 text-slate-700'
              : 'bg-slate-950/60 border-slate-800 text-slate-300'
          }`}
        >
          <div className="text-[9.5px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5">
            Operational Context
          </div>
          <p className="line-clamp-2 text-[11px] leading-relaxed">{world.storyIntro.background}</p>
        </div>

        {/* Key Responsibilities */}
        <div>
          <div className="text-[9.5px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1">
            Key Responsibilities
          </div>
          <div className="space-y-1">
            {world.storyIntro.keyResponsibilities.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-start gap-1 text-[11px] leading-snug">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SQL Topics Covered */}
        <div>
          <div className="text-[9.5px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1">
            Mastered SQL Concepts ({world.sqlTopics.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {world.sqlTopics.slice(0, 8).map((topic, idx) => (
              <span
                key={idx}
                className={`text-[9.5px] px-1.5 py-0.5 rounded font-mono border ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-700'
                    : 'bg-slate-800/80 border-slate-700/60 text-slate-300'
                }`}
              >
                {topic}
              </span>
            ))}
            {world.sqlTopics.length > 8 && (
              <span
                className={`text-[9.5px] px-1.5 py-0.5 rounded font-mono border ${
                  isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-500'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                +{world.sqlTopics.length - 8} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dossier Footer Actions */}
      <div
        className={`pt-2 border-t ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}
      >
        {world.isAvailable ? (
          <Button
            variant="primary"
            className="w-full py-1.5 text-xs"
            data-no-flip
            onClick={() => setActiveWorld(world.id)}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            {progress.completedMissionsCount > 0 ? 'Resume Operations' : 'Enter World'}
          </Button>
        ) : (
          <Button variant="secondary" className="w-full py-1.5 text-xs" disabled data-no-flip>
            <Lock className="w-3 h-3 mr-1" /> Preview Only (Coming Soon)
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <FlipCard
      front={frontContent}
      back={backContent}
      flipped={isFlipped}
      onFlipChange={setIsFlipped}
      axis="y"
      flipOnClick={true}
      draggable={true}
      tilt={true}
      tiltMax={3.5}
      glare={true}
      glareOpacity={isLight ? 0.16 : 0.22}
      hoverScale={1.015}
      perspective={1400}
      stiffness={180}
      damping={22}
      width="100%"
      height={440}
      depth={14}
      radius={26}
      background={isLight ? '#ffffff' : '#0f172a'}
      color={isLight ? '#0f172a' : '#f8fafc'}
      edgeBackground={isLight ? '#e2e8f0' : '#1e293b'}
      edgeBorder={isLight ? '#cbd5e1' : '#334155'}
      edgeHighlight={isLight ? '#ffffff' : '#475569'}
      shadow={true}
      shadowColor={isLight ? '#94a3b8' : '#000000'}
      shadowOpacity={isLight ? 0.25 : 0.55}
      ariaLabel={`${world.name} Case Study Card`}
    />
  );
};
