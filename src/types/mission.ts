import { ValidationRule } from './validation';

export interface Mission {
  id: string;
  order: number;
  title: string;
  role: string;
  storyline: string;
  businessProblem: string;
  objective: string;
  requiredOutcome: string;
  checklist: string[];
  sqlTopics: string[];
  hints: [string, string, string]; // Progressive: 1) Conceptual, 2) Directional, 3) Detailed
  sampleSolution: string;
  solutionExplanation: string;
  initialSqlPlaceholder?: string;
  validationRules: ValidationRule[];
  xpReward: number;
  badge?: {
    id: string;
    title: string;
    icon: string;
  };
}

export interface MissionProgress {
  missionId: string;
  status: 'locked' | 'unlocked' | 'in_progress' | 'completed';
  completedAt?: number;
  attemptsCount: number;
  hintsRevealed: number; // 0 to 3
  bestSql?: string;
}
