import { WorldDefinition } from '../../types/world';
import { supermarketWorld } from './supermarket';

export const WORLDS_REGISTRY: WorldDefinition[] = [
  supermarketWorld,
  {
    id: 'airport',
    name: 'Airport Operations',
    industry: 'Aviation & Transportation',
    tagline: 'Track flight radar schedules, passenger gates, and aircraft tarmac transitions.',
    description:
      'Manage airlines, terminal concourses, baggage handling systems, and live flight movements across runway states.',
    storyIntro: {
      roleTitle: 'Flight Data Operations Analyst',
      organization: 'SkyHarbor International Airport',
      background:
        'SkyHarbor coordinates 500+ daily flights. With tight turnaround windows and complex multi-terminal logistics, real-time relational analytics keep passengers moving safely.',
      keyResponsibilities: [
        'Track flight movement states: SCHEDULED -> TAXIING -> AIRBORNE -> LANDED',
        'Investigate baggage routing bottlenecks and passenger connections',
        'Analyze gate turnarounds and terminal passenger loads',
      ],
    },
    difficulty: 'Intermediate',
    estimatedTime: '60 mins',
    iconName: 'Plane',
    accentColor: 'sky',
    dbFileName: 'airport.db',
    sqlTopics: ['JOIN', 'LEFT JOIN', 'NULL Handling', 'Aggregation', 'Subqueries', 'CTEs'],
    isAvailable: false,
    missions: [],
    initialSchemaSql: '',
    initialDatasetSql: '',
    reportConfig: {
      title: 'SkyHarbor Airport Operations Report',
      subtitle: 'Terminal throughput and flight punctuality metrics',
      executiveSummaryTemplate: 'Airport analytics preview.',
      metrics: [],
    },
  },
  {
    id: 'warehouse',
    name: 'Warehouse Management',
    industry: 'Logistics & Supply Chain',
    tagline: 'Audit bulk pallets, track cross-dock shipments, and reconcile inventory discrepancies.',
    description:
      'Step into a high-throughput distribution center. Analyze purchase orders, carrier dispatches, and warehouse reorder thresholds.',
    storyIntro: {
      roleTitle: 'Logistics Data Specialist',
      organization: 'Apex Global Logistics Hub',
      background:
        'Apex handles thousands of pallets daily. Precision stock tracking ensures supply chains across the continent avoid costly halts.',
      keyResponsibilities: [
        'Monitor stock movements across warehouse bins',
        'Evaluate vendor shipment punctuality and lead times',
        'Reconcile physical stock against database manifests',
      ],
    },
    difficulty: 'Intermediate',
    estimatedTime: '50 mins',
    iconName: 'Boxes',
    accentColor: 'amber',
    dbFileName: 'warehouse.db',
    sqlTopics: ['CRUD', 'JOIN', 'Date Filtering', 'Subqueries', 'Transactions'],
    isAvailable: false,
    missions: [],
    initialSchemaSql: '',
    initialDatasetSql: '',
    reportConfig: {
      title: 'Apex Logistics Operations Report',
      subtitle: 'Distribution throughput and fulfillment speed',
      executiveSummaryTemplate: 'Warehouse analytics preview.',
      metrics: [],
    },
  },
  {
    id: 'hospital',
    name: 'Hospital Administration',
    industry: 'Healthcare & Clinical Services',
    tagline: 'Manage patient admissions, doctor schedules, and ward bed allocations.',
    description:
      'Coordinate clinical department workflows, doctor appointments, emergency bed allocations, and confidential medical billing.',
    storyIntro: {
      roleTitle: 'Healthcare Information Analyst',
      organization: 'Metro General Hospital System',
      background:
        'Metro General delivers critical care 24/7. Timely scheduling and clean database records directly impact patient care and departmental efficiency.',
      keyResponsibilities: [
        'Coordinate doctor departmental assignments and clinic rosters',
        'Eliminate double-booking conflicts across outpatient suites',
        'Analyze average lengths of stay and emergency room admissions',
      ],
    },
    difficulty: 'Advanced',
    estimatedTime: '65 mins',
    iconName: 'Activity',
    accentColor: 'rose',
    dbFileName: 'hospital.db',
    sqlTopics: ['JOIN', 'GROUP BY', 'Date Functions', 'Subqueries', 'Window Functions'],
    isAvailable: false,
    missions: [],
    initialSchemaSql: '',
    initialDatasetSql: '',
    reportConfig: {
      title: 'Metro General Hospital Administration Report',
      subtitle: 'Clinical departmental analytics and bed utilization',
      executiveSummaryTemplate: 'Hospital analytics preview.',
      metrics: [],
    },
  },
  {
    id: 'bank',
    name: 'Bank Operations',
    industry: 'Banking & Financial Services',
    tagline: 'Audit ledger balances, execute atomic money transfers, and flag suspicious transactions.',
    description:
      'Join a premier commercial bank. Master transaction ACID properties, simulate fund transfers with ROLLBACK protection, and trace audit logs.',
    storyIntro: {
      roleTitle: 'Core Banking Database Analyst',
      organization: 'Apex National Trust',
      background:
        'Apex National Trust processes millions in financial transfers. Financial integrity demands absolute consistency through atomic SQL transactions.',
    keyResponsibilities: [
      'Execute multi-statement transactions using BEGIN, COMMIT, and ROLLBACK',
      'Detect anomalous cash spikes and duplicate fund transfer requests',
      'Generate branch compliance audit balance sheets',
    ],
  },
    difficulty: 'Advanced',
    estimatedTime: '75 mins',
    iconName: 'Landmark',
    accentColor: 'indigo',
    dbFileName: 'bank.db',
    sqlTopics: ['BEGIN/COMMIT/ROLLBACK', 'ACID Transactions', 'CTEs', 'Auditing', 'HAVING'],
    isAvailable: false,
    missions: [],
    initialSchemaSql: '',
    initialDatasetSql: '',
    reportConfig: {
      title: 'Apex National Trust Compliance Report',
      subtitle: 'Financial ledger balances and audit trail integrity',
      executiveSummaryTemplate: 'Banking analytics preview.',
      metrics: [],
    },
  },
];

export function getWorldById(id: string): WorldDefinition | undefined {
  return WORLDS_REGISTRY.find((w) => w.id === id);
}
