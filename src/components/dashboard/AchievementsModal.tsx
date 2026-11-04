import React from 'react';
import { Modal } from '../ui/Modal';
import { ALL_ACHIEVEMENTS } from '../../modules/gamification/achievements';
import { useUserStore } from '../../stores/useUserStore';
import {
  Trophy,
  Terminal,
  Database,
  Search,
  GitFork,
  BarChart2,
  Award,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Terminal: <Terminal className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  Search: <Search className="w-5 h-5" />,
  GitFork: <GitFork className="w-5 h-5" />,
  BarChart2: <BarChart2 className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
};

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { profile } = useUserStore();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Achievements & Badges"
      subtitle="Earn badges and bonus XP by solving business challenges and mastering SQL"
      maxWidth="2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {ALL_ACHIEVEMENTS.map((item) => {
          const isUnlocked = profile.achievements.includes(item.id);
          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                isUnlocked
                  ? 'bg-slate-850/80 border-emerald-500/30 text-slate-100 shadow-md'
                  : 'bg-slate-900/40 border-slate-800/80 text-slate-400 opacity-60'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-center flex-shrink-0 ${
                  isUnlocked
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
              >
                {iconMap[item.icon] || <Trophy className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold truncate text-slate-200">
                    {item.title}
                  </h4>
                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      +{item.xpReward} XP
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                      <Lock className="w-3 h-3" />
                      {item.xpReward} XP
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
