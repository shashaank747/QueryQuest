import React, { useState } from 'react';
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
  ShoppingCart: <ShoppingCart className="w-5 h-5" />,
  Plane: <Plane className="w-5 h-5" />,
  Boxes: <Boxes className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Landmark: <Landmark className="w-5 h-5" />,
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
      className={`w-full h-full flex flex-col justify-between border rounded-[20px] overflow-hidden select-none transition-colors duration-200 ${
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
        <div className="relative w-full h-44 overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-slate-950 flex-shrink-0">
          <img
            src={world.thumbnailUrl}
            alt={world.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 pointer-events-none"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-black/35 pointer-events-none" />

          {/* Top badges on image */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
            {world.isAvailable ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-md">
                Live Case Study
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-slate-400 border border-slate-700/50 backdrop-blur-md">
                Roadmap Preview
              </span>
            )}

            <div className="flex items-center gap-1.5">
              <Badge variant={difficultyVariants[world.difficulty] || 'slate'} size="sm">
                {world.difficulty}
              </Badge>
              <div className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 flex items-center gap-1 text-[11px] text-white font-medium">
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
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Floating category icon overlapping bottom edge */}
          <div className="absolute -bottom-4 left-5 pointer-events-none">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-lg ${
                isLight
                  ? `bg-white border-slate-200 ${activeColor.light} shadow-slate-200/60`
                  : `bg-slate-900 border-slate-700 ${activeColor.dark} shadow-black/50`
              }`}
            >
              {iconComponentMap[world.iconName] || <Landmark className="w-5 h-5" />}
            </div>
          </div>
        </div>
      ) : (
        /* Fallback if no thumbnail */
        <div className="p-5 pb-0 flex items-start justify-between">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
              isLight
                ? `bg-white border-slate-200 ${activeColor.light}`
                : `bg-slate-900 border-slate-700 ${activeColor.dark}`
            }`}
          >
            {iconComponentMap[world.iconName] || <ShoppingCart className="w-5 h-5" />}
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant={difficultyVariants[world.difficulty] || 'slate'} size="sm">
              {world.difficulty}
            </Badge>
            <div className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium flex items-center gap-1">
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
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Middle Content */}
      <div className={`p-5 ${world.thumbnailUrl ? 'pt-6' : 'pt-3'} pb-3 flex-1 flex flex-col justify-between`}>
        <div>
          <div className="text-[11px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-1">
            {world.industry}
          </div>
          <h3
            className={`text-xl font-bold tracking-tight ${
              isLight ? 'text-slate-900' : 'text-slate-100'
            }`}
          >
            {world.name}
          </h3>
          <p
            className={`text-xs ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            } mt-1.5 line-clamp-2 leading-relaxed`}
          >
            {world.tagline || world.description}
          </p>
        </div>

        {/* SQL Topics Tags preview */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {world.sqlTopics.slice(0, 3).map((topic, i) => (
            <span
              key={i}
              className={`text-[10px] px-2 py-0.5 rounded-md ${
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
              className={`text-[10px] px-1.5 py-0.5 rounded-md ${
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
        className={`p-5 pt-3 border-t ${
          isLight ? 'border-slate-100 bg-slate-50/70' : 'border-slate-800/60 bg-slate-950/30'
        }`}
      >
        {world.isAvailable ? (
          <div>
            <div
              className={`flex items-center justify-between text-xs ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              } mb-2`}
            >
              <span className="font-medium">
                {progress.isCompleted ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> All 10 Missions Completed
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
              className={`w-full h-2 ${
                isLight ? 'bg-slate-200' : 'bg-slate-800'
              } rounded-full overflow-hidden mb-3`}
            >
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
                style={{ width: `${progress.percentComplete}%` }}
              />
            </div>

            <Button
              variant="primary"
              className="w-full"
              data-no-flip
              onClick={() => setActiveWorld(world.id)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {progress.completedMissionsCount > 0 ? 'Resume Operations' : 'Enter World'}
            </Button>
          </div>
        ) : (
          <div>
            <div
              className={`flex items-center justify-between text-xs ${
                isLight ? 'text-slate-500' : 'text-slate-500'
              } mb-3`}
            >
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Coming in Next Phase
              </span>
              <span className="font-mono text-[11px]">Roadmap</span>
            </div>
            <Button variant="secondary" className="w-full" disabled data-no-flip>
              Preview Only
            </Button>
          </div>
        )}

        {/* Subtle Hint */}
        <div className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2 flex items-center justify-center gap-1">
          <span>Click card or drag to inspect dossier</span>
          <RotateCcw className="w-2.5 h-2.5 opacity-60" />
        </div>
      </div>
    </div>
  );

  // Back Face Component (Full Dossier & Architecture Specs)
  const backContent = (
    <div
      className={`w-full h-full flex flex-col justify-between p-5 border rounded-[20px] overflow-hidden select-none transition-colors duration-200 ${
        isLight
          ? 'bg-gradient-to-br from-white via-slate-50 to-slate-100/90 border-slate-200 text-slate-800'
          : 'bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border-slate-800 text-slate-100'
      }`}
    >
      {/* Dossier Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            <span className="truncate max-w-[190px]">{world.storyIntro.roleTitle}</span>
          </div>
          <button
            type="button"
            data-no-flip
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(false);
            }}
            className="px-2 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>← Front</span>
          </button>
        </div>

        {/* Organization & DB spec */}
        <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold text-sm">
          <Building2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span className="truncate">{world.storyIntro.organization}</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] mt-1.5">
          <div className="px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800/80 font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1 border border-slate-300/60 dark:border-slate-700/60">
            <Database className="w-3 h-3 text-emerald-500" />
            <span>{world.dbFileName}</span>
          </div>
          <span className="text-slate-400 dark:text-slate-600">•</span>
          <span className="text-slate-500 dark:text-slate-400">{world.industry}</span>
        </div>
      </div>

      {/* Dossier Scrollable Middle Area */}
      <div className="flex-1 my-3 space-y-3 overflow-y-auto pr-1">
        {/* Scenario Background */}
        <div
          className={`p-2.5 rounded-xl border text-xs leading-relaxed ${
            isLight
              ? 'bg-slate-100/70 border-slate-200 text-slate-700'
              : 'bg-slate-950/60 border-slate-800 text-slate-300'
          }`}
        >
          <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            Operational Context
          </div>
          <p className="line-clamp-3 text-[11.5px] leading-relaxed">{world.storyIntro.background}</p>
        </div>

        {/* Key Responsibilities */}
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Key Responsibilities
          </div>
          <div className="space-y-1.5">
            {world.storyIntro.keyResponsibilities.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs leading-snug">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SQL Topics Covered */}
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Mastered SQL Concepts ({world.sqlTopics.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {world.sqlTopics.map((topic, idx) => (
              <span
                key={idx}
                className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-700 shadow-2xs'
                    : 'bg-slate-800/80 border-slate-700/60 text-slate-300'
                }`}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Dossier Footer Actions */}
      <div
        className={`pt-3 border-t ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}
      >
        {world.isAvailable ? (
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              className="flex-1"
              data-no-flip
              onClick={() => setActiveWorld(world.id)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {progress.completedMissionsCount > 0 ? 'Resume Operations' : 'Enter World'}
            </Button>
            <Button
              variant="secondary"
              data-no-flip
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
            >
              ← Front
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              data-no-flip
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
            >
              ← Flip Back to Overview
            </Button>
          </div>
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
      height={530}
      depth={14}
      radius={20}
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
