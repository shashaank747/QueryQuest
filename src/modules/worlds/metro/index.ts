import { WorldDefinition } from '../../../types/world';
import { METRO_BASE_SCHEMA } from './schema';
import { METRO_INITIAL_DATASET } from './dataset';
import { METRO_MISSIONS } from './missions';

export const metroWorld: WorldDefinition = {
  id: 'metro',
  name: 'Namma Metro — Transit Command',
  industry: 'Public Transit & Urban Mobility',
  tagline: 'Rebuild station registries, audit commuter smart-cards, and optimize Bengaluru transit operations.',
  description:
    'Step into the BMRCL Central Operations Control Room as a Junior Transit Data Engineer. Restore the commuter network database, monitor footfall surges at Majestic, and deliver executive transit analytics.',
  thumbnailUrl: '/images/metro-world.jpg',
  storyIntro: {
    roleTitle: 'Junior Transit Data Engineer',
    organization: 'BMRCL Central Operations Control Room (OCC)',
    background:
      'Bengaluru’s rapid transit network is expanding fast—new stations on the Yellow Line are coming online, peak-hour crowds at Nadaprabhu Kempegowda Station (Majestic) are hitting record highs, and the legacy commuter database was wiped during a midnight server migration. Chief Controller Ananya Rao brings you into the Control Room just before the 8:00 AM morning rush. Rebuild the core transit tables, audit smart-card ledgers, and deliver end-of-day telemetry to BMRCL leadership.',
    keyResponsibilities: [
      'Rebuild core station and smart card schemas with strict data integrity constraints',
      'Load live station telemetry and verify passenger footfall metrics',
      'Audit feeder-bus parking availability and investigate fare corridor brackets',
      'Process emergency rush-hour status updates and purge decommissioned test nodes',
      'Deliver executive network telemetry summaries for BMRCL transport leadership',
    ],
  },
  difficulty: 'Beginner',
  estimatedTime: '40 mins',
  iconName: 'TrainFront',
  accentColor: 'purple',
  dbFileName: 'metro.db',
  sqlTopics: [
    'CREATE TABLE',
    'PRIMARY KEY',
    'AUTOINCREMENT',
    'UNIQUE',
    'CHECK',
    'INSERT',
    'SELECT',
    'WHERE',
    'BETWEEN',
    'IN',
    'LIKE',
    'UPDATE',
    'DELETE',
    'Aggregate Functions',
  ],
  isAvailable: true,
  missions: METRO_MISSIONS,
  initialSchemaSql: METRO_BASE_SCHEMA,
  initialDatasetSql: METRO_INITIAL_DATASET,
  reportConfig: {
    title: 'BMRCL Namma Metro — Transit Operations Executive Summary',
    subtitle: 'Generated dynamically from live SQLite transit command database',
    executiveSummaryTemplate:
      'This operational telemetry audit synthesizes station capacity, fare distribution, and corridor ridership across Bengaluru rapid transit lines. Peak-hour passenger throughput and feeder parking readiness are verified for BMRCL leadership.',
    metrics: [
      {
        id: 'total_stations',
        title: 'Active Network Stations',
        query: 'SELECT COUNT(*) as total_stations FROM stations;',
        description: 'Total commissioned passenger stations across all operational lines.',
        type: 'stat',
        valueKey: 'total_stations',
      },
      {
        id: 'total_daily_footfall',
        title: 'Total Daily Commuter Tap-Ins',
        query: 'SELECT printf("%,d", SUM(daily_footfall)) as footfall FROM stations;',
        description: 'Aggregate weekday passenger entries across Purple, Green, and Yellow corridors.',
        type: 'stat',
        valueKey: 'footfall',
      },
      {
        id: 'avg_fare',
        title: 'Average Base Fare',
        query: 'SELECT printf("₹%.2f", AVG(base_fare_inr)) as avg_fare FROM stations;',
        description: 'Mean standard token fare across all operational stations.',
        type: 'stat',
        valueKey: 'avg_fare',
      },
      {
        id: 'footfall_by_line',
        title: 'Daily Commuters by Transit Line',
        query:
          'SELECT line_color, SUM(daily_footfall) as total_ridership FROM stations GROUP BY line_color ORDER BY total_ridership DESC;',
        description: 'Ridership volume distribution across Purple, Green, and Yellow transit lines.',
        type: 'bar_chart',
        labelKey: 'line_color',
        valueKey: 'total_ridership',
      },
      {
        id: 'busiest_hubs',
        title: 'Top High-Footfall Transit Hubs',
        query:
          'SELECT station_name, line_color, daily_footfall FROM stations ORDER BY daily_footfall DESC LIMIT 5;',
        description: 'Highest density transit stations requiring active platform crowd marshals.',
        type: 'table',
      },
    ],
  },
};
