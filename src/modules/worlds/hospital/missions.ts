import { Mission } from '../../../types/mission';

export const HOSPITAL_MISSIONS: Mission[] = [
  {
    id: 'hp_m1',
    order: 1,
    title: 'Filter Wards Exceeding Average Occupancy via Scalar Subquery',
    role: 'Healthcare Information Analyst',
    storyline:
      'Welcome to Metro General Hospital System! Joint Commission clinical oversight requires real-time monitoring of inpatient bed saturation. Hospital Director Dr. Elena requests an automated audit to identify care units currently carrying above-average patient loads.',
    businessProblem:
      'Hardcoding fixed bed occupancy thresholds produces inaccurate alerts as hospital census dynamically fluctuates. A scalar subquery is needed to calculate the campus-wide average occupied beds dynamically and filter units exceeding that threshold.',
    objective:
      'Write a query using a scalar subquery in the WHERE clause to select ward_name, ward_type, total_beds, and occupied_beds from "wards" where occupied_beds > (SELECT AVG(occupied_beds) FROM wards).',
    requiredOutcome:
      'A report listing hospital wards with occupied beds higher than the campus-wide average.',
    checklist: [
      'SELECT ward_name, ward_type, total_beds, occupied_beds',
      'FROM wards',
      'WHERE occupied_beds > (SELECT AVG(occupied_beds) FROM wards)',
    ],
    sqlTopics: ['Scalar Subquery', 'WHERE Clause Subquery', 'AVG() Aggregation', 'Bed Utilization'],
    hints: [
      'Use a subquery inside the WHERE clause to dynamically compute the average occupied beds: (SELECT AVG(occupied_beds) FROM wards).',
      'Compare occupied_beds against the result of that scalar subquery using the greater-than (>) operator.',
      'SELECT ward_name, ward_type, total_beds, occupied_beds FROM wards WHERE occupied_beds > (SELECT AVG(occupied_beds) FROM wards);',
    ],
    sampleSolution: `SELECT ward_name, ward_type, total_beds, occupied_beds
FROM wards
WHERE occupied_beds > (SELECT AVG(occupied_beds) FROM wards);`,
    solutionExplanation:
      'Scalar subqueries evaluate to a single atomic value, enabling dynamic comparisons against dataset-wide aggregates without hardcoding changing numbers.',
    initialSqlPlaceholder: `-- Mission 1: Scalar subquery for wards with above-average occupied beds\n-- Write your SQL query below\n`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify wards exceeding average occupied beds via scalar subquery',
        expectedQuery:
          'SELECT ward_name, ward_type, total_beds, occupied_beds FROM wards WHERE occupied_beds > (SELECT AVG(occupied_beds) FROM wards);',
      },
    ],
    xpReward: 100,
  },
  {
    id: 'hp_m2',
    order: 2,
    title: 'Identify Active Intensive Care Physicians with EXISTS Subquery',
    role: 'Healthcare Information Analyst',
    storyline:
      'Trauma triage dispatch must know which attending physicians currently oversee active admissions inside the Intensive Care Unit (ward_id = 1). Nurse Supervisor Tara asks for a correlated EXISTS subquery.',
    businessProblem:
      'Using outer joins can duplicate physician rows if a doctor has multiple admissions. A correlated subquery with EXISTS efficiently tests for row existence without altering the cardinality of the doctors table.',
    objective:
      'Select doctor_id, first_name, last_name, and specialty from "doctors" d where an active admission (status = "Admitted") exists in ward_id = 1 using EXISTS (SELECT 1 FROM admissions a WHERE a.doctor_id = d.doctor_id AND a.ward_id = 1 AND a.status = \'Admitted\').',
    requiredOutcome:
      'A list of doctors who currently have at least one active patient admitted in ward 1 (ICU).',
    checklist: [
      'SELECT d.doctor_id, d.first_name, d.last_name, d.specialty FROM doctors d',
      'Use WHERE EXISTS (SELECT 1 FROM admissions a ...)',
      'Correlate a.doctor_id = d.doctor_id',
      'Filter with a.ward_id = 1 AND a.status = \'Admitted\'',
    ],
    sqlTopics: ['Correlated Subquery', 'EXISTS Operator', 'Physician Roster', 'Clinical Triage'],
    hints: [
      'Use WHERE EXISTS (...) referencing outer table d with a.doctor_id = d.doctor_id.',
      'Filter the inner query by a.ward_id = 1 and a.status = \'Admitted\'.',
      "SELECT d.doctor_id, d.first_name, d.last_name, d.specialty FROM doctors d WHERE EXISTS (SELECT 1 FROM admissions a WHERE a.doctor_id = d.doctor_id AND a.ward_id = 1 AND a.status = 'Admitted');",
    ],
    sampleSolution: `SELECT d.doctor_id, d.first_name, d.last_name, d.specialty
FROM doctors d
WHERE EXISTS (
  SELECT 1 FROM admissions a
  WHERE a.doctor_id = d.doctor_id
    AND a.ward_id = 1
    AND a.status = 'Admitted'
);`,
    solutionExplanation:
      'Correlated subqueries with EXISTS evaluate per-row conditions in the outer query, returning TRUE immediately upon encountering the first matching record for optimal query performance.',
    initialSqlPlaceholder: `-- Mission 2: Correlated subquery with EXISTS for ICU attending doctors\n-- Write your SQL query below\n`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify active ICU attending physicians using correlated EXISTS subquery',
        expectedQuery:
          "SELECT d.doctor_id, d.first_name, d.last_name, d.specialty FROM doctors d WHERE EXISTS (SELECT 1 FROM admissions a WHERE a.doctor_id = d.doctor_id AND a.ward_id = 1 AND a.status = 'Admitted');",
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
    title: 'Analyze High Bed Saturation with Common Table Expression (CTE)',
    role: 'Healthcare Information Analyst',
    storyline:
      'Hospital operations leadership requires an executive audit of care wings operating at near-full capacity. Chief Medical Officer Dr. Vasquez asks you to compute unit occupancy rates and isolate wards operating at or above 80% capacity using a Common Table Expression.',
    businessProblem:
      'Calculating derived occupancy percentages repeatedly in multiple clauses makes SQL queries cumbersome and error-prone. A CTE isolates the occupancy percentage calculation into an elegant, reusable temporary result set.',
    objective:
      'Define a CTE named "WardStats" that selects ward_name, total_beds, occupied_beds, and calculates occupancy_rate as ROUND((CAST(occupied_beds AS REAL) / total_beds) * 100.0, 2) from "wards". In the primary query, select ward_name, total_beds, occupied_beds, and occupancy_rate from WardStats where occupancy_rate >= 80.0 ordered by occupancy_rate descending.',
    requiredOutcome:
      'A CTE query outputting wards with an occupancy rate of 80% or greater, sorted from highest to lowest occupancy.',
    checklist: [
      'Define WITH WardStats AS (...)',
      'Compute ROUND((CAST(occupied_beds AS REAL) / total_beds) * 100.0, 2) AS occupancy_rate',
      'SELECT ward_name, total_beds, occupied_beds, occupancy_rate FROM WardStats',
      'Filter with WHERE occupancy_rate >= 80.0',
      'ORDER BY occupancy_rate DESC',
    ],
    sqlTopics: ['Common Table Expressions (CTE)', 'WITH Clause', 'Derived Metrics', 'ORDER BY DESC'],
    hints: [
      'Begin with WITH WardStats AS (SELECT ward_name, total_beds, occupied_beds, ROUND((CAST(occupied_beds AS REAL) / total_beds) * 100.0, 2) AS occupancy_rate FROM wards).',
      'In the outer query, query WardStats filtering WHERE occupancy_rate >= 80.0 and ordering by occupancy_rate DESC.',
      'WITH WardStats AS (\n  SELECT ward_name, total_beds, occupied_beds, ROUND((CAST(occupied_beds AS REAL) / total_beds) * 100.0, 2) AS occupancy_rate FROM wards\n) SELECT ward_name, total_beds, occupied_beds, occupancy_rate FROM WardStats WHERE occupancy_rate >= 80.0 ORDER BY occupancy_rate DESC;',
    ],
    sampleSolution: `WITH WardStats AS (
  SELECT
    ward_name,
    total_beds,
    occupied_beds,
    ROUND((CAST(occupied_beds AS REAL) / total_beds) * 100.0, 2) AS occupancy_rate
  FROM wards
)
SELECT ward_name, total_beds, occupied_beds, occupancy_rate
FROM WardStats
WHERE occupancy_rate >= 80.0
ORDER BY occupancy_rate DESC;`,
    solutionExplanation:
      'Common Table Expressions (WITH clauses) improve query modularity and readability by structuring intermediate calculations into named logical blocks before final filtering and ordering.',
    initialSqlPlaceholder: `-- Mission 3: CTE for wards with occupancy rate >= 80%\n-- Write your SQL query below\n`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify ward occupancy CTE analysis for rates >= 80%',
        expectedQuery:
          'WITH WardStats AS (SELECT ward_name, total_beds, occupied_beds, ROUND((CAST(occupied_beds AS REAL) / total_beds) * 100.0, 2) AS occupancy_rate FROM wards) SELECT ward_name, total_beds, occupied_beds, occupancy_rate FROM WardStats WHERE occupancy_rate >= 80.0 ORDER BY occupancy_rate DESC;',
        orderSensitive: true,
      },
    ],
    xpReward: 130,
  },
  {
    id: 'hp_m4',
    order: 4,
    title: 'Rank Inpatient Care Units with Window Function DENSE_RANK()',
    role: 'Healthcare Information Analyst',
    storyline:
      'The Facilities Planning Committee is evaluating patient density to allocate emergency relief funding and auxiliary beds. Department Head Dr. Menon requests a strict ranking of all hospital wards by occupied bed count using modern SQL window functions.',
    businessProblem:
      'Traditional aggregation with GROUP BY collapses individual ward attributes. Window functions compute ranks across the entire result set while retaining granular ward details.',
    objective:
      'Select ward_name, ward_type, occupied_beds, and DENSE_RANK() OVER (ORDER BY occupied_beds DESC) AS occupancy_rank from "wards" ordered by occupancy_rank ascending.',
    requiredOutcome:
      'A ranked report of all hospital wards ordered by their occupancy ranking from highest occupied beds (rank 1) to lowest.',
    checklist: [
      'SELECT ward_name, ward_type, occupied_beds',
      'Compute DENSE_RANK() OVER (ORDER BY occupied_beds DESC) AS occupancy_rank',
      'FROM wards',
      'ORDER BY occupancy_rank ASC',
    ],
    sqlTopics: ['Window Functions', 'DENSE_RANK()', 'OVER Clause', 'Analytical Ranking'],
    hints: [
      'Use the window function syntax: DENSE_RANK() OVER (ORDER BY occupied_beds DESC) AS occupancy_rank.',
      'Select ward_name, ward_type, occupied_beds, and the ranked column.',
      'SELECT ward_name, ward_type, occupied_beds, DENSE_RANK() OVER (ORDER BY occupied_beds DESC) AS occupancy_rank FROM wards ORDER BY occupancy_rank ASC;',
    ],
    sampleSolution: `SELECT ward_name, ward_type, occupied_beds,
       DENSE_RANK() OVER (ORDER BY occupied_beds DESC) AS occupancy_rank
FROM wards
ORDER BY occupancy_rank ASC;`,
    solutionExplanation:
      'The DENSE_RANK() window function assigns consecutive ranks without gaps, providing clean and standardized operational tiering across hospital infrastructure.',
    initialSqlPlaceholder: `-- Mission 4: Window function ranking of wards by occupied beds\n-- Write your SQL query below\n`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify ward ranking via DENSE_RANK() window function',
        expectedQuery:
          'SELECT ward_name, ward_type, occupied_beds, DENSE_RANK() OVER (ORDER BY occupied_beds DESC) AS occupancy_rank FROM wards ORDER BY occupancy_rank ASC;',
        orderSensitive: true,
      },
    ],
    xpReward: 140,
  },
  {
    id: 'hp_m5',
    order: 5,
    title: 'Analyze Admission Intervals with Window Function LAG()',
    role: 'Healthcare Information Analyst',
    storyline:
      'Clinical Epidemiology is studying inpatient intake cadence to spot sudden surges and calculate intervals between patient arrivals. The chief statistician asks you to track admission chronological progression using the LAG window function.',
    businessProblem:
      'Comparing a current row with a prior row in SQL traditionally required self-joins on generated sequence IDs. Modern SQL offset window functions like LAG() access previous row data directly and efficiently.',
    objective:
      'Select admission_id, patient_id, admission_date, and LAG(admission_date) OVER (ORDER BY admission_date) AS prev_admission_date from "admissions" ordered by admission_date ascending.',
    requiredOutcome:
      'A chronological log of patient admissions with each record displaying the admission date of the immediately preceding intake.',
    checklist: [
      'SELECT admission_id, patient_id, admission_date',
      'Use LAG(admission_date) OVER (ORDER BY admission_date) AS prev_admission_date',
      'FROM admissions',
      'ORDER BY admission_date ASC',
    ],
    sqlTopics: ['Window Functions', 'LAG() Offset', 'Time-Series Analysis', 'Chronological Tracking'],
    hints: [
      'Syntax: LAG(column_name) OVER (ORDER BY order_column) AS alias.',
      'Select admission_id, patient_id, admission_date, and LAG(admission_date) OVER (ORDER BY admission_date) AS prev_admission_date.',
      'SELECT admission_id, patient_id, admission_date, LAG(admission_date) OVER (ORDER BY admission_date) AS prev_admission_date FROM admissions ORDER BY admission_date ASC;',
    ],
    sampleSolution: `SELECT admission_id, patient_id, admission_date,
       LAG(admission_date) OVER (ORDER BY admission_date) AS prev_admission_date
FROM admissions
ORDER BY admission_date ASC;`,
    solutionExplanation:
      'LAG() provides seamless access to the previous row within a partitioned or ordered window, allowing healthcare analysts to calculate admission velocity and triage spacing.',
    initialSqlPlaceholder: `-- Mission 5: Window function LAG for admission date progression\n-- Write your SQL query below\n`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify previous admission date calculation using LAG() window function',
        expectedQuery:
          'SELECT admission_id, patient_id, admission_date, LAG(admission_date) OVER (ORDER BY admission_date) AS prev_admission_date FROM admissions ORDER BY admission_date ASC;',
        orderSensitive: true,
      },
    ],
    xpReward: 160,
  },
  {
    id: 'hp_m6',
    order: 6,
    title: 'Execute Atomic Patient Discharge & Bed Reclaim (ACID Transaction)',
    role: 'Healthcare Information Analyst',
    storyline:
      'ICU patient Siddharth Varma (admission_id = 101) has completed critical recovery and is cleared for discharge today (2026-11-16). To ensure strict data consistency, the Electronic Health Record system requires patient status update and ward bed count decrement to occur within a single atomic ACID transaction.',
    businessProblem:
      'If a server crashes after updating the admission record but before decrementing the ward occupied bed count, the hospital registry becomes inconsistent (phantom occupied bed). An ACID transaction guarantees that either both updates succeed together or neither takes effect.',
    objective:
      'Execute an atomic transaction using BEGIN TRANSACTION and COMMIT that updates "admissions" to set status = "Discharged" and discharge_date = "2026-11-16" WHERE admission_id = 101, and updates "wards" to decrement occupied_beds = occupied_beds - 1 WHERE ward_id = 1.',
    requiredOutcome:
      'Admission 101 marked as Discharged with discharge_date = 2026-11-16 and ICU (ward_id = 1) occupied_beds decremented from 12 to 11, committed atomically.',
    checklist: [
      'Start with BEGIN TRANSACTION;',
      'UPDATE admissions SET status = \'Discharged\', discharge_date = \'2026-11-16\' WHERE admission_id = 101;',
      'UPDATE wards SET occupied_beds = occupied_beds - 1 WHERE ward_id = 1;',
      'Finalize with COMMIT;',
    ],
    sqlTopics: ['ACID Transactions', 'BEGIN TRANSACTION', 'COMMIT', 'Data Integrity', 'Atomic Operations'],
    hints: [
      'Wrap both UPDATE statements between BEGIN TRANSACTION; and COMMIT;.',
      'First update admissions for admission_id = 101, then update wards for ward_id = 1.',
      "BEGIN TRANSACTION;\nUPDATE admissions SET status = 'Discharged', discharge_date = '2026-11-16' WHERE admission_id = 101;\nUPDATE wards SET occupied_beds = occupied_beds - 1 WHERE ward_id = 1;\nCOMMIT;",
    ],
    sampleSolution: `BEGIN TRANSACTION;
UPDATE admissions
SET status = 'Discharged', discharge_date = '2026-11-16'
WHERE admission_id = 101;
UPDATE wards
SET occupied_beds = occupied_beds - 1
WHERE ward_id = 1;
COMMIT;`,
    solutionExplanation:
      'ACID transactions preserve relational invariants across multiple related tables. Wrapping dual updates in a transaction guarantees that hospital census and admission ledgers remain perfectly synchronized without risk of partial writes.',
    initialSqlPlaceholder: `-- Mission 6: ACID transaction for atomic discharge and bed reclaim\n-- Write your SQL query below\n`,
    validationRules: [
      {
        type: 'ROW_EXISTS',
        description: 'Verify admission 101 is marked Discharged with discharge date 2026-11-16',
        expectedTable: 'admissions',
        expectedWhereClause:
          "admission_id = 101 AND status = 'Discharged' AND discharge_date = '2026-11-16'",
        expectedRowCount: 1,
      },
      {
        type: 'ROW_EXISTS',
        description: 'Verify ICU (ward_id = 1) occupied_beds is decremented to 11',
        expectedTable: 'wards',
        expectedWhereClause: 'ward_id = 1 AND occupied_beds = 11',
        expectedRowCount: 1,
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
