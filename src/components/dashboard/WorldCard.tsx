import React from 'react';
import { WorldDefinition } from '../../types/world';
import { useWorldStore } from '../../stores/useWorldStore';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
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
} from 'lucide-react';

interface WorldCardProps {
  world: WorldDefinition;
}

const iconComponentMap: Record<string, React.ReactNode> = {
  ShoppingCart: <ShoppingCart className="w-6 h-6" />,
  Plane: <Plane className="w-6 h-6" />,
  Boxes: <Boxes className="w-6 h-6" />,
  Activity: <Activity className="w-6 h-6" />,
  Landmark: <Landmark className="w-6 h-6" />,
};

export const WorldCard: React.FC<WorldCardProps> = ({ world }) => {
  const { setActiveWorld, worldProgress } = useWorldStore();
  const progress = worldProgress[world.id] || {
    completedMissionsCount: 0,
    totalMissionsCount: world.missions.length,
    percentComplete: 0,
    isCompleted: false,
  };

  const difficultyVariants: Record<string, 'emerald' | 'amber' | 'rose'> = {
    Beginner: 'emerald',
    Intermediate: 'amber',
    Advanced: 'rose',
  };

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
        world.isAvailable
          ? 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/20'
          : 'bg-slate-900/40 border-slate-800/60 opacity-80'
      }`}
    >
      {/* Top Banner & Category */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
              world.isAvailable
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
          >
            {iconComponentMap[world.iconName] || <ShoppingCart className="w-6 h-6" />}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={difficultyVariants[world.difficulty] || 'slate'} size="sm">
              {world.difficulty}
            </Badge>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <Clock className="w-3 h-3" />
              <span>{world.estimatedTime}</span>
            </div>
          </div>
        </div>

        {/* Industry & Title */}
        <div className="text-[11px] font-bold tracking-wider text-emerald-400/90 uppercase mb-1">
          {world.industry}
        </div>
        <h3 className="text-xl font-bold text-slate-100 group-hover:text-white transition-colors">
          {world.name}
        </h3>
        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {world.description}
        </p>

        {/* SQL Topics Tags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {world.sqlTopics.slice(0, 4).map((topic, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50 font-mono"
            >
              {topic}
            </span>
          ))}
          {world.sqlTopics.length > 4 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-500 font-mono">
              +{world.sqlTopics.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer & Action */}
      <div className="p-6 pt-3 border-t border-slate-800/60 bg-slate-950/30">
        {world.isAvailable ? (
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-medium">
                {progress.isCompleted ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> All 10 Missions Completed
                  </span>
                ) : (
                  `${progress.completedMissionsCount} of ${progress.totalMissionsCount} Missions`
                )}
              </span>
              <span className="font-bold text-slate-300">
                {progress.percentComplete}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
                style={{ width: `${progress.percentComplete}%` }}
              />
            </div>

            <Button
              variant="primary"
              className="w-full"
              onClick={() => setActiveWorld(world.id)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {progress.completedMissionsCount > 0 ? 'Resume Operations' : 'Enter World'}
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Coming in Next Phase
              </span>
              <span className="font-mono text-[11px]">Roadmap</span>
            </div>
            <Button variant="secondary" className="w-full" disabled>
              Preview Only
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
