import { Mission } from './mission';

export interface WorldReportMetric {
  id: string;
  title: string;
  query: string;
  description: string;
  type: 'stat' | 'table' | 'bar_chart' | 'pie_chart';
  valueKey?: string;
  labelKey?: string;
}

export interface WorldReportConfig {
  title: string;
  subtitle: string;
  executiveSummaryTemplate: string;
  metrics: WorldReportMetric[];
}

export interface WorldDefinition {
  id: string;
  name: string;
  industry: string;
  tagline: string;
  description: string;
  thumbnailUrl?: string;
  storyIntro: {
    roleTitle: string;
    organization: string;
    background: string;
    keyResponsibilities: string[];
  };
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  iconName: string;
  accentColor: string; // e.g., 'emerald', 'sky', 'amber', 'rose', 'indigo'
  dbFileName: string;
  sqlTopics: string[];
  isAvailable: boolean;
  missions: Mission[];
  initialSchemaSql: string;
  initialDatasetSql: string;
  reportConfig: WorldReportConfig;
}

export interface WorldProgress {
  worldId: string;
  completedMissionsCount: number;
  totalMissionsCount: number;
  isCompleted: boolean;
  percentComplete: number;
  unlockedAt?: number;
  completedAt?: number;
}

