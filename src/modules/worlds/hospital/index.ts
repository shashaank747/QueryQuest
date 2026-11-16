import { WorldDefinition } from '../../../types/world';
import { HOSPITAL_BASE_SCHEMA } from './schema';
import { HOSPITAL_INITIAL_DATASET } from './dataset';
import { HOSPITAL_MISSIONS } from './missions';

export const hospitalWorld: WorldDefinition = {
  id: 'hospital',
  name: 'Hospital Administration',
  industry: 'Healthcare & Clinical Services',
  tagline: 'Manage patient admissions, doctor schedules, and ward bed allocations.',
  description:
    'Coordinate clinical department workflows, doctor appointments, emergency bed allocations, and confidential medical billing.',
  thumbnailUrl: '/images/hospital-world.jpg',
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
  sqlTopics: ['CREATE TABLE', 'INSERT', 'SELECT', 'WHERE', 'UPDATE', 'JOIN', 'GROUP BY', 'Aggregation'],
  isAvailable: true,
  missions: HOSPITAL_MISSIONS,
  initialSchemaSql: HOSPITAL_BASE_SCHEMA,
  initialDatasetSql: HOSPITAL_INITIAL_DATASET,
  reportConfig: {
    title: 'Metro General Hospital Administration — Executive Clinical Audit',
    subtitle: 'Generated dynamically from live SQLite relational database records',
    executiveSummaryTemplate:
      'This clinical audit provides executive metrics on inpatient admissions, department physician coverage, and critical ward bed utilization across the hospital campus.',
    metrics: [
      {
        id: 'total_admitted_patients',
        title: 'Active Inpatient Admissions',
        query: 'SELECT COUNT(*) AS active_admissions FROM admissions WHERE status = "Admitted";',
        description: 'Current active inpatient admissions undergoing medical treatment.',
        type: 'stat',
        valueKey: 'active_admissions',
      },
      {
        id: 'total_hospital_beds',
        title: 'Total Campus Bed Capacity',
        query: 'SELECT SUM(total_beds) AS total_beds FROM wards;',
        description: 'Aggregate licensed inpatient beds across all hospital wings.',
        type: 'stat',
        valueKey: 'total_beds',
      },
      {
        id: 'critical_ward_saturation',
        title: 'Critical Ward Occupancy Rate',
        query:
          'SELECT printf("%.1f%%", (CAST(SUM(occupied_beds) AS REAL) / SUM(total_beds)) * 100) AS occ_rate FROM wards WHERE ward_type = "Critical Care";',
        description: 'Current bed saturation rate across ICU and CCU units.',
        type: 'stat',
        valueKey: 'occ_rate',
      },
      {
        id: 'occupancy_by_ward_type',
        title: 'Bed Occupancy by Care Specialty',
        query:
          'SELECT ward_type, SUM(occupied_beds) AS occupied FROM wards GROUP BY ward_type ORDER BY occupied DESC;',
        description: 'Occupied bed distribution across specialized clinical care units.',
        type: 'bar_chart',
        labelKey: 'ward_type',
        valueKey: 'occupied',
      },
      {
        id: 'physician_department_roster',
        title: 'Physician Coverage by Department',
        query:
          'SELECT dept.department_name, COUNT(doc.doctor_id) AS total_doctors, SUM(doc.is_on_call) AS on_call_doctors FROM departments dept JOIN doctors doc ON dept.department_id = doc.department_id GROUP BY dept.department_name ORDER BY total_doctors DESC;',
        description: 'Medical attending coverage and emergency on-call allocations.',
        type: 'table',
      },
      {
        id: 'saturated_wards_list',
        title: 'Critical Ward Bed Saturation Alerts (>= 100%)',
        query:
          'SELECT ward_name, ward_type, occupied_beds, total_beds FROM wards WHERE occupied_beds >= total_beds;',
        description: 'Hospital care units requiring immediate patient bed reassignment.',
        type: 'table',
      },
    ],
  },
};
