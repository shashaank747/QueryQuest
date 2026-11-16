import { Mission } from '../../../types/mission';

export const HOSPITAL_MISSIONS: Mission[] = [
  {
    id: 'hp_m1',
    order: 1,
    title: 'Deploy Emergency Medical On-Call Roster',
    role: 'Healthcare Information Analyst',
    storyline:
      'Welcome to Metro General Hospital System! Joint Commission clinical accreditation requires real-time digital tracking of physician emergency coverage. Chief of Staff Dr. Elena asks you to build the emergency call roster table.',
    businessProblem:
      'Paper call sheets pinned to bulletin boards lead to unverified coverage during sudden trauma spikes and code blue incidents.',
    objective:
      'Create a table named "emergency_roster" with roster_id (INTEGER PRIMARY KEY AUTOINCREMENT), doctor_id (INTEGER NOT NULL), shift_date (TEXT NOT NULL), shift_type (TEXT NOT NULL), and pager_number (TEXT NOT NULL).',
    requiredOutcome:
      'A new emergency_roster table ready to log hospital coverage rotations and physician pager numbers.',
    checklist: [
      'Use CREATE TABLE emergency_roster',
      'Define roster_id INTEGER PRIMARY KEY AUTOINCREMENT',
      'Include doctor_id INTEGER NOT NULL',
      'Include shift_date TEXT NOT NULL',
      'Include shift_type TEXT NOT NULL',
      'Include pager_number TEXT NOT NULL',
    ],
    sqlTopics: ['CREATE TABLE', 'PRIMARY KEY', 'NOT NULL constraints', 'Healthcare DDL'],
    hints: [
      'Use CREATE TABLE emergency_roster (...) with the required column specifications.',
      'Set roster_id as INTEGER PRIMARY KEY AUTOINCREMENT.',
      'CREATE TABLE emergency_roster (\n  roster_id INTEGER PRIMARY KEY AUTOINCREMENT,\n  doctor_id INTEGER NOT NULL,\n  shift_date TEXT NOT NULL,\n  shift_type TEXT NOT NULL,\n  pager_number TEXT NOT NULL\n);',
    ],
    sampleSolution: `CREATE TABLE emergency_roster (
  roster_id INTEGER PRIMARY KEY AUTOINCREMENT,
  doctor_id INTEGER NOT NULL,
  shift_date TEXT NOT NULL,
  shift_type TEXT NOT NULL,
  pager_number TEXT NOT NULL
);`,
    solutionExplanation:
      'Standardized schema definitions eliminate physician shift ambiguities and provide reliable operational audit trails for healthcare regulatory compliance.',
    initialSqlPlaceholder: `-- Mission 1: Create emergency roster table\nCREATE TABLE emergency_roster (\n  \n);`,
    validationRules: [
      {
        type: 'TABLE_EXISTS',
        description: 'Verify emergency_roster table exists with required columns',
        expectedTable: 'emergency_roster',
        expectedColumns: [
          'roster_id',
          'doctor_id',
          'shift_date',
          'shift_type',
          'pager_number',
        ],
      },
    ],
    xpReward: 100,
    badge: {
      id: 'table_architect',
      title: 'Table Architect',
      icon: 'Database',
    },
  },
  {
    id: 'hp_m2',
    order: 2,
    title: 'Register Pediatric Cardiology Attending',
    role: 'Healthcare Information Analyst',
    storyline:
      'Metro General has recruited Dr. Neil Armstrong to lead pediatric interventional cardiology. Clinical Credentialing requests his formal entry into the physician registry.',
    businessProblem:
      'New clinical attendings cannot be designated as primary physicians on patient intake charts until registered in the active doctors directory.',
    objective:
      'Insert a new row into "doctors" with: doctor_id = 7, first_name = "Neil", last_name = "Armstrong", specialty = "Pediatric Cardiology", department_id = 4, and is_on_call = 1.',
    requiredOutcome:
      'Dr. Neil Armstrong registered in the doctors table under Pediatrics (department 4).',
    checklist: [
      'Use INSERT INTO doctors (...)',
      'Specify doctor_id, first_name, last_name, specialty, department_id, is_on_call',
      'Enclose names and specialty in single quotes',
    ],
    sqlTopics: ['INSERT INTO', 'Physician Registration', 'Foreign Key Mapping'],
    hints: [
      'Use INSERT INTO doctors (doctor_id, first_name, last_name, specialty, department_id, is_on_call) VALUES (...);',
      'Set department_id = 4 and is_on_call = 1.',
      "INSERT INTO doctors (doctor_id, first_name, last_name, specialty, department_id, is_on_call) VALUES (7, 'Neil', 'Armstrong', 'Pediatric Cardiology', 4, 1);",
    ],
    sampleSolution: `INSERT INTO doctors (doctor_id, first_name, last_name, specialty, department_id, is_on_call)
VALUES (7, 'Neil', 'Armstrong', 'Pediatric Cardiology', 4, 1);`,
    solutionExplanation:
      'Populating clinical directories accurately guarantees proper foreign key attribution when scheduling surgeries and admitting pediatric patients.',
    initialSqlPlaceholder: `-- Mission 2: Register Dr. Neil Armstrong into doctors\nINSERT INTO doctors (\n  doctor_id, first_name, last_name, specialty, department_id, is_on_call\n) VALUES (\n  \n);`,
    validationRules: [
      {
        type: 'ROW_EXISTS',
        description: 'Verify Dr. Armstrong is registered in doctors',
        expectedTable: 'doctors',
        expectedWhereClause: "doctor_id = 7 AND specialty = 'Pediatric Cardiology'",
        expectedRowCount: 1,
      },
    ],
    xpReward: 120,
    badge: {
      id: 'clinical_guardian',
      title: 'Clinical Data Guardian',
      icon: 'Activity',
    },
  },
  {
    id: 'hp_m3',
    order: 3,
    title: 'Audit Saturated Hospital Wards',
    role: 'Healthcare Information Analyst',
    storyline:
      'Bed management alerts dispatch that incoming emergency admissions are backing up in triage. Nurse Supervisor Tara requests an immediate audit of wards at 100% capacity.',
    businessProblem:
      'Diverting emergency ambulances requires identifying exactly which hospital wards are fully saturated (occupied_beds >= total_beds) to activate overflow surge units.',
    objective:
      'Select ward_name, ward_type, total_beds, and occupied_beds from "wards" where occupied_beds >= total_beds.',
    requiredOutcome:
      'A report of wards operating at or over maximum bed capacity.',
    checklist: [
      'SELECT ward_name, ward_type, total_beds, occupied_beds',
      'FROM wards',
      'WHERE occupied_beds >= total_beds',
    ],
    sqlTopics: ['SELECT', 'WHERE clause', 'Bed Capacity Triaging'],
    hints: [
      'Use SELECT ward_name, ward_type, total_beds, occupied_beds FROM wards WHERE ...;',
      'Filter with occupied_beds >= total_beds.',
      'SELECT ward_name, ward_type, total_beds, occupied_beds FROM wards WHERE occupied_beds >= total_beds;',
    ],
    sampleSolution: `SELECT ward_name, ward_type, total_beds, occupied_beds
FROM wards
WHERE occupied_beds >= total_beds;`,
    solutionExplanation:
      'Real-time bed queries prevent emergency room bottlenecks and inform hospital administrators when surge bed expansion is required.',
    initialSqlPlaceholder: `-- Mission 3: Query wards with 100% bed occupancy\nSELECT ward_name, ward_type, total_beds, occupied_beds\nFROM wards\nWHERE ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify saturated hospital ward query',
        expectedQuery:
          'SELECT ward_name, ward_type, total_beds, occupied_beds FROM wards WHERE occupied_beds >= total_beds;',
      },
    ],
    xpReward: 130,
  },
  {
    id: 'hp_m4',
    order: 4,
    title: 'Discharge Inpatient & Reclaim Hospital Bed',
    role: 'Healthcare Information Analyst',
    storyline:
      'Pediatric patient Kavya Krishnan (admission_id = 104) has made a complete recovery and Dr. Oswald has signed the discharge clearance for today (2026-11-16).',
    businessProblem:
      'Pending emergency patients cannot be assigned a pediatric bed until the active admission is formally transitioned to Discharged in the central electronic health records system.',
    objective:
      'Update "admissions" to set discharge_date = "2026-11-16" and status = "Discharged" for admission_id = 104.',
    requiredOutcome:
      'Admission 104 updated with discharge date and Discharged status.',
    checklist: [
      'Use UPDATE admissions',
      'SET discharge_date = \'2026-11-16\', status = \'Discharged\'',
      'WHERE admission_id = 104',
    ],
    sqlTopics: ['UPDATE', 'WHERE clause', 'Clinical Status Transition'],
    hints: [
      'Syntax: UPDATE admissions SET discharge_date = \'2026-11-16\', status = \'Discharged\' WHERE condition;',
      'Specify WHERE admission_id = 104.',
      "UPDATE admissions SET discharge_date = '2026-11-16', status = 'Discharged' WHERE admission_id = 104;",
    ],
    sampleSolution: `UPDATE admissions
SET discharge_date = '2026-11-16', status = 'Discharged'
WHERE admission_id = 104;`,
    solutionExplanation:
      'Disciplined status updates in electronic medical records free up hospital beds in real-time, reducing waiting times for incoming emergency cases.',
    initialSqlPlaceholder: `-- Mission 4: Discharge admission 104\nUPDATE admissions\nSET discharge_date = '2026-11-16', status = 'Discharged'\nWHERE admission_id = 104;`,
    validationRules: [
      {
        type: 'ROW_EXISTS',
        description: 'Verify admission 104 is discharged',
        expectedTable: 'admissions',
        expectedWhereClause: "admission_id = 104 AND status = 'Discharged' AND discharge_date = '2026-11-16'",
        expectedRowCount: 1,
      },
    ],
    xpReward: 140,
  },
  {
    id: 'hp_m5',
    order: 5,
    title: 'Correlate Active Inpatients with Attending Physicians',
    role: 'Healthcare Information Analyst',
    storyline:
      'Hospital Chief Medical Officer requires a unified morning rounds roster. She needs a list of all currently admitted patients, their blood type, and their attending doctor specialty.',
    businessProblem:
      'Doctors, patients, and admissions are stored in normalized relations. A relational query is needed to reconstruct complete clinical care profiles.',
    objective:
      'Join "patients", "admissions", and "doctors". Select p.first_name, p.last_name, p.blood_group, d.first_name AS doc_first_name, d.last_name AS doc_last_name, d.specialty, a.admission_date where a.status = "Admitted". Order by a.admission_date ascending.',
    requiredOutcome:
      'A joined table connecting active inpatients to their assigned attending physicians, ordered chronologically by admission date.',
    checklist: [
      'JOIN patients p -> admissions a ON p.patient_id = a.patient_id',
      'JOIN doctors d ON a.doctor_id = d.doctor_id',
      'SELECT p.first_name, p.last_name, p.blood_group, d.first_name AS doc_first_name, d.last_name AS doc_last_name, d.specialty, a.admission_date',
      'WHERE a.status = \'Admitted\'',
      'ORDER BY a.admission_date ASC',
    ],
    sqlTopics: ['Multi-table JOIN', 'Aliasing', 'Date Ordering', 'Status Filtering'],
    hints: [
      'Chain the joins: patients p JOIN admissions a ON p.patient_id = a.patient_id JOIN doctors d ON a.doctor_id = d.doctor_id.',
      'Filter with a.status = \'Admitted\' and order by a.admission_date ASC.',
      'SELECT p.first_name, p.last_name, p.blood_group, d.first_name AS doc_first_name, d.last_name AS doc_last_name, d.specialty, a.admission_date FROM patients p JOIN admissions a ON p.patient_id = a.patient_id JOIN doctors d ON a.doctor_id = d.doctor_id WHERE a.status = \'Admitted\' ORDER BY a.admission_date ASC;',
    ],
    sampleSolution: `SELECT p.first_name, p.last_name, p.blood_group, d.first_name AS doc_first_name, d.last_name AS doc_last_name, d.specialty, a.admission_date
FROM patients p
JOIN admissions a ON p.patient_id = a.patient_id
JOIN doctors d ON a.doctor_id = d.doctor_id
WHERE a.status = 'Admitted'
ORDER BY a.admission_date ASC;`,
    solutionExplanation:
      'Multi-table joins link clinical demographic information with hospital admissions to provide attending physicians with immediate patient context during morning clinical rounds.',
    initialSqlPlaceholder: `-- Mission 5: Join patients, admissions, and doctors for active inpatients\nSELECT p.first_name, p.last_name, p.blood_group, d.first_name AS doc_first_name, d.last_name AS doc_last_name, d.specialty, a.admission_date\nFROM patients p\nJOIN admissions a ON ...\nJOIN doctors d ON ...\nWHERE a.status = 'Admitted'\nORDER BY ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify active inpatient rounds manifest',
        expectedQuery:
          "SELECT p.first_name, p.last_name, p.blood_group, d.first_name AS doc_first_name, d.last_name AS doc_last_name, d.specialty, a.admission_date FROM patients p JOIN admissions a ON p.patient_id = a.patient_id JOIN doctors d ON a.doctor_id = d.doctor_id WHERE a.status = 'Admitted' ORDER BY a.admission_date ASC;",
        orderSensitive: true,
      },
    ],
    xpReward: 160,
    badge: {
      id: 'join_master',
      title: 'Join Master',
      icon: 'GitFork',
    },
  },
  {
    id: 'hp_m6',
    order: 6,
    title: 'Analyze Hospital Bed Capacity by Care Specialty',
    role: 'Healthcare Information Analyst',
    storyline:
      'The Board of Trustees is reviewing Metro General annual capital allocation. They request an aggregated breakdown of total bed capacity and occupied beds grouped by clinical ward type.',
    businessProblem:
      'Determining whether to fund a new surgical tower or expand pediatric ICU beds requires aggregated bed utilization metrics.',
    objective:
      'Group "wards" by ward_type. Select ward_type, COUNT(ward_id) AS total_wards, SUM(total_beds) AS total_capacity, and SUM(occupied_beds) AS total_occupied. Order by total_occupied descending.',
    requiredOutcome:
      'An aggregated hospital ward capacity breakdown sorted by total occupied beds descending.',
    checklist: [
      'SELECT ward_type, COUNT(ward_id) AS total_wards, SUM(total_beds) AS total_capacity, SUM(occupied_beds) AS total_occupied',
      'FROM wards',
      'GROUP BY ward_type',
      'ORDER BY total_occupied DESC',
    ],
    sqlTopics: ['GROUP BY', 'SUM / COUNT', 'Ward Capacity Analytics', 'ORDER BY DESC'],
    hints: [
      'Group by ward_type and compute COUNT(ward_id), SUM(total_beds), and SUM(occupied_beds).',
      'Order by total_occupied DESC.',
      'SELECT ward_type, COUNT(ward_id) AS total_wards, SUM(total_beds) AS total_capacity, SUM(occupied_beds) AS total_occupied FROM wards GROUP BY ward_type ORDER BY total_occupied DESC;',
    ],
    sampleSolution: `SELECT ward_type, COUNT(ward_id) AS total_wards, SUM(total_beds) AS total_capacity, SUM(occupied_beds) AS total_occupied
FROM wards
GROUP BY ward_type
ORDER BY total_occupied DESC;`,
    solutionExplanation:
      'Aggregating hospital bed inventory by ward specialty delivers actionable insights to healthcare executives for critical facility planning and staffing budgets.',
    initialSqlPlaceholder: `-- Mission 6: Ward capacity summary by care specialty\nSELECT ward_type, COUNT(ward_id) AS total_wards, SUM(total_beds) AS total_capacity, SUM(occupied_beds) AS total_occupied\nFROM wards\nGROUP BY ...\nORDER BY ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify ward capacity aggregation',
        expectedQuery:
          'SELECT ward_type, COUNT(ward_id) AS total_wards, SUM(total_beds) AS total_capacity, SUM(occupied_beds) AS total_occupied FROM wards GROUP BY ward_type ORDER BY total_occupied DESC;',
        orderSensitive: true,
      },
    ],
    xpReward: 250,
    badge: {
      id: 'hospital_master',
      title: 'Healthcare Administration Certified',
      icon: 'Award',
    },
  },
];
