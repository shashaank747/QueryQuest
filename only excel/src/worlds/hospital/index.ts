import { ExcelWorldDefinition, ExcelWorkbookData, createSheetFromMatrix } from '../types';

const hospitalMatrix: (string | number | boolean | null)[][] = [
  // Row 1 (Header: index 0)
  [
    'Ward Name',
    'Department',
    'Licensed Beds',
    'Inpatients',
    'Occupancy Rate',
    'Capacity Alert',
    'Duty Nurses',
    'Patient/Nurse Ratio',
    'Lookup Ward',
    'Inpatients Result',
  ],
  // Row 2 (index 1) - ICU
  ['Intensive Care Unit (ICU)', 'Critical Care', 40, 36, null, null, 18, null, 'Intensive Care Unit (ICU)', null],
  // Row 3 (index 2) - Cardiology
  ['Cardiology Ward', 'Cardiology', 60, 48, 0.8, 'AVAILABLE', 12, 4.0, null, null],
  // Row 4 (index 3) - Pediatrics
  ['Pediatric Wing', 'Pediatrics', 50, 35, 0.7, 'AVAILABLE', 10, 3.5, null, null],
  // Row 5 (index 4) - Surgery
  ['General Surgery', 'Surgery', 80, 72, 0.9, 'NEAR CAPACITY', 16, 4.5, null, null],
  // Row 6 (index 5) - Orthopedics
  ['Orthopedic Ward', 'Orthopedics', 55, 44, 0.8, 'AVAILABLE', 11, 4.0, null, null],
  // Row 7 (index 6) - Neurology
  ['Neurology Unit', 'Neurology', 45, 36, 0.8, 'AVAILABLE', 9, 4.0, null, null],
  // Row 8 (index 7) - Oncology
  ['Oncology Ward', 'Oncology', 50, 45, 0.9, 'NEAR CAPACITY', 15, 3.0, null, null],
  // Row 9 (index 8) - Summary
  ['Hospital Total / Avg', null, null, null, null, null, null, null, null, null],
  // Row 10 (index 9) - Near Capacity Count
  ['High Occupancy Wards (>=85%)', null, null, null, null, null, null, null, null, null],
];

const hospitalSheet = createSheetFromMatrix('Ward Census & Staffing', hospitalMatrix, 25, 12);

hospitalSheet.cells['A9'].style = { bold: true };
hospitalSheet.cells['A10'].style = { bold: true };
hospitalSheet.cells['I2'].style = { bold: true };

const hospitalInitialWorkbook: ExcelWorkbookData = {
  sheets: {
    'Ward Census & Staffing': hospitalSheet,
  },
  activeSheet: 'Ward Census & Staffing',
};

export const hospitalWorld: ExcelWorldDefinition = {
  id: 'hospital',
  name: 'Hospital Administration',
  industry: 'Healthcare & Clinical Services',
  tagline: 'Ward occupancy rates, bed utilization metrics, and staffing ratios.',
  description:
    'Join Metro General Hospital System as a Healthcare Information Analyst. Monitor critical ward bed utilization, calculate nurse-to-patient coverage ratios, configure capacity alarms, and perform clinical census lookups.',
  thumbnailUrl: '/images/hospital-world.jpg',
  storyIntro: {
    roleTitle: 'Healthcare Information Analyst',
    organization: 'Metro General Hospital System',
    background:
      'Metro General operates 380 licensed beds across surgical, critical care, and pediatric departments. Chief Medical Officer Dr. Eleanor Vance needs your spreadsheet modeling to monitor live inpatient censuses, calculate patient-to-nurse staffing ratios, identify wards nearing capacity saturation, and query department censuses dynamically.',
    keyResponsibilities: [
      'Sum hospital-wide inpatient censuses to forecast pharmacy and meal requirements',
      'Model ward bed occupancy percentages to balance emergency room transfer admissions',
      'Deploy automated IF warning gates for wards exceeding safe 85% occupancy ceilings',
      'Compute nurse-to-patient staffing ratios and perform instant ward queries via XLOOKUP',
    ],
  },
  difficulty: 'Advanced',
  estimatedTime: '45 mins',
  iconName: 'Activity',
  accentColor: 'rose',
  spreadsheetName: 'metro_general_clinical.xlsx',
  excelTopics: ['XLOOKUP', 'SUM', 'AVERAGE', 'COUNTIF', 'IF', 'Division (/)', 'Percentage Modeling'],
  isAvailable: true,
  initialWorkbook: hospitalInitialWorkbook,
  missions: [
    {
      id: 'hospital_xl_1',
      order: 1,
      title: 'Aggregate Total Hospital Inpatients',
      role: 'Healthcare Information Analyst',
      storyline:
        'Chief Medical Officer Dr. Vance needs the grand total number of admitted inpatients across all 7 hospital departments for the morning briefing.',
      businessProblem:
        'Inpatient censuses dictate hospital clinical staffing, catering tray prep, and emergency reserve bed buffers.',
      objective:
        'In cell D9, sum inpatient counts across cells D2:D8 using the SUM function.',
      targetCell: 'D9',
      sheetName: 'Ward Census & Staffing',
      requiredOutcome: 'Cell D9 evaluates to 316 using formula =SUM(D2:D8).',
      checklist: [
        'Select target cell D9',
        'Enter formula =SUM(D2:D8)',
        'Verify total admitted patients evaluates to 316',
      ],
      excelTopics: ['SUM', 'Clinical Census Aggregation'],
      hints: [
        'Inpatient counts are in column D from row 2 to 8.',
        'Use SUM to aggregate range D2:D8.',
        'Enter: =SUM(D2:D8)',
      ],
      sampleSolutionFormula: '=SUM(D2:D8)',
      solutionExplanation:
        '=SUM(D2:D8) aggregates censuses across all 7 hospital wards, returning 316 total inpatients.',
      initialFormulaPlaceholder: '=SUM(',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'D9',
          description: 'Formula uses SUM over D2:D8',
          expectedFormula: 'SUM(D2:D8)',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'D9',
          description: 'Cell D9 evaluates to 316',
          expectedValue: 316,
        },
      ],
      xpReward: 100,
      badge: {
        id: 'census_auditor',
        title: 'Census Auditor',
        icon: 'HeartPulse',
      },
    },
    {
      id: 'hospital_xl_2',
      order: 2,
      title: 'Calculate ICU Ward Occupancy Rate',
      role: 'Healthcare Information Analyst',
      storyline:
        'Calculate the bed occupancy rate for the Intensive Care Unit (row 2) by dividing Inpatients by Licensed Beds.',
      businessProblem:
        'Accurate occupancy rates prevent emergency room diversions and ensure specialized clinical beds remain available.',
      objective:
        'In cell E2, divide Inpatients (D2) by Licensed Beds (C2) using formula =D2/C2.',
      targetCell: 'E2',
      sheetName: 'Ward Census & Staffing',
      requiredOutcome: 'Cell E2 evaluates to 0.90 using formula =D2/C2.',
      checklist: [
        'Select target cell E2',
        'Enter formula =D2/C2',
        'Verify ICU occupancy rate evaluates to 0.9 (90%)',
      ],
      excelTopics: ['Division (/)', 'Occupancy Ratios'],
      hints: [
        'Occupancy rate represents inpatients divided by total available licensed beds.',
        'Divide Inpatients (D2) by Licensed Beds (C2).',
        'Enter: =D2/C2',
      ],
      sampleSolutionFormula: '=D2/C2',
      solutionExplanation:
        '=D2/C2 divides 36 inpatients by 40 licensed beds, calculating 0.90 (90% bed occupancy).',
      initialFormulaPlaceholder: '=D2/',
      validationRules: [
        {
          type: 'EXACT_FORMULA',
          targetCell: 'E2',
          description: 'Formula divides D2 by C2 (=D2/C2)',
          expectedFormula: '=D2/C2',
        },
        {
          type: 'VALUE_TOLERANCE',
          targetCell: 'E2',
          description: 'Cell E2 evaluates to 0.90 ±0.01',
          expectedValue: 0.9,
          numericTolerance: 0.01,
        },
      ],
      xpReward: 110,
    },
    {
      id: 'hospital_xl_3',
      order: 3,
      title: 'Automate Critical Capacity Alert',
      role: 'Healthcare Information Analyst',
      storyline:
        'Hospital safety protocols require any ward with occupancy at or above 85% to be flagged as "NEAR CAPACITY" for emergency admission diversion.',
      businessProblem:
        'Delayed capacity warnings lead to stretcher queues in ER hallways during trauma surges.',
      objective:
        'In cell F2, write an IF formula checking if Occupancy Rate (E2) is greater than or equal to 0.85 (>=0.85). If true, return "NEAR CAPACITY"; otherwise return "AVAILABLE".',
      targetCell: 'F2',
      sheetName: 'Ward Census & Staffing',
      requiredOutcome: 'Cell F2 evaluates to "NEAR CAPACITY" using formula =IF(E2>=0.85, "NEAR CAPACITY", "AVAILABLE").',
      checklist: [
        'Select target cell F2',
        'Enter formula =IF(E2>=0.85, "NEAR CAPACITY", "AVAILABLE")',
        'Verify returned alert evaluates to "NEAR CAPACITY"',
      ],
      excelTopics: ['IF', 'Logical Tests (>=0.85)', 'Clinical Safety'],
      hints: [
        'IF syntax: =IF(condition, value_if_true, value_if_false).',
        'Compare E2 against 0.85: =IF(E2>=0.85, "NEAR CAPACITY", "AVAILABLE").',
        'Enter: =IF(E2>=0.85, "NEAR CAPACITY", "AVAILABLE")',
      ],
      sampleSolutionFormula: '=IF(E2>=0.85, "NEAR CAPACITY", "AVAILABLE")',
      solutionExplanation:
        'Because ICU occupancy E2 is 0.90 (>= 0.85), the IF formula triggers "NEAR CAPACITY".',
      initialFormulaPlaceholder: '=IF(E2>=0.85, ',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'F2',
          description: 'Formula uses IF logic comparing E2 >= 0.85',
          expectedFormula: 'IF(E2>=0.85',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'F2',
          description: 'Cell F2 evaluates to "NEAR CAPACITY"',
          expectedValue: 'NEAR CAPACITY',
        },
      ],
      xpReward: 120,
      badge: {
        id: 'triage_officer',
        title: 'Triage Officer',
        icon: 'Stethoscope',
      },
    },
    {
      id: 'hospital_xl_4',
      order: 4,
      title: 'Calculate Patient-to-Nurse Staffing Ratio',
      role: 'Healthcare Information Analyst',
      storyline:
        'The Nursing Operations Board requires the patient-to-nurse staffing ratio for the ICU (row 2). Calculate patients per nurse by dividing Inpatients by Duty Nurses.',
      businessProblem:
        'Safe staffing ratios are strictly mandated by medical accreditation boards to prevent clinician burnout and patient mortality.',
      objective:
        'In cell H2, divide Inpatients (D2) by Duty Nurses (G2) using formula =D2/G2.',
      targetCell: 'H2',
      sheetName: 'Ward Census & Staffing',
      requiredOutcome: 'Cell H2 evaluates to 2.0 using formula =D2/G2.',
      checklist: [
        'Select target cell H2',
        'Enter formula =D2/G2',
        'Verify patient/nurse ratio evaluates to 2.0',
      ],
      excelTopics: ['Division (/)', 'Clinical Staffing Ratios'],
      hints: [
        'Staffing ratios evaluate clinician workloads by dividing patient counts by active duty nursing staff.',
        'Divide Inpatients (D2) by Duty Nurses (G2).',
        'Enter: =D2/G2',
      ],
      sampleSolutionFormula: '=D2/G2',
      solutionExplanation:
        '=D2/G2 divides 36 patients by 18 nurses, resulting in a 2:1 staffing ratio for ICU.',
      initialFormulaPlaceholder: '=D2/',
      validationRules: [
        {
          type: 'EXACT_FORMULA',
          targetCell: 'H2',
          description: 'Formula divides D2 by G2 (=D2/G2)',
          expectedFormula: '=D2/G2',
        },
        {
          type: 'VALUE_TOLERANCE',
          targetCell: 'H2',
          description: 'Cell H2 evaluates to 2.0 ±0.05',
          expectedValue: 2,
          numericTolerance: 0.05,
        },
      ],
      xpReward: 110,
    },
    {
      id: 'hospital_xl_5',
      order: 5,
      title: 'Benchmark Average Hospital Bed Occupancy',
      role: 'Healthcare Information Analyst',
      storyline:
        'Hospital Administration needs the average bed occupancy rate across all active wards to submit in the quarterly healthcare authority compliance filing.',
      businessProblem:
        'State healthcare regulators require hospitals to maintain an overall average bed occupancy below 85% to accommodate regional emergencies.',
      objective:
        'In cell E9, calculate the average occupancy rate across cells E2:E8 using the AVERAGE function.',
      targetCell: 'E9',
      sheetName: 'Ward Census & Staffing',
      requiredOutcome: 'Cell E9 evaluates to approximately 0.8286 using formula =AVERAGE(E2:E8).',
      checklist: [
        'Select target cell E9',
        'Enter formula =AVERAGE(E2:E8)',
        'Verify average occupancy evaluates to approximately 0.83 (83%)',
      ],
      excelTopics: ['AVERAGE', 'Healthcare Benchmarking'],
      hints: [
        'Occupancy rates are in column E from row 2 through row 8.',
        'Use AVERAGE: =AVERAGE(E2:E8).',
        'Enter: =AVERAGE(E2:E8)',
      ],
      sampleSolutionFormula: '=AVERAGE(E2:E8)',
      solutionExplanation:
        '=AVERAGE(E2:E8) computes the mean occupancy across 7 wards as 82.86%.',
      initialFormulaPlaceholder: '=AVERAGE(E2:E8)',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'E9',
          description: 'Formula uses AVERAGE over E2:E8',
          expectedFormula: 'AVERAGE(E2:E8)',
        },
        {
          type: 'VALUE_TOLERANCE',
          targetCell: 'E9',
          description: 'Cell E9 evaluates to 0.8286 ±0.01',
          expectedValue: 0.8286,
          numericTolerance: 0.01,
        },
      ],
      xpReward: 130,
    },
    {
      id: 'hospital_xl_6',
      order: 6,
      title: 'Look Up Ward Inpatients with XLOOKUP',
      role: 'Healthcare Information Analyst',
      storyline:
        'The emergency bed dispatch system has a ward query field in cell I2 ("Intensive Care Unit (ICU)"). Look up the exact number of admitted inpatients from the ward registry.',
      businessProblem:
        'Real-time automated lookups replace manual ward phone calls when placing arriving ambulance trauma patients.',
      objective:
        'In cell J2, use XLOOKUP to look up ward name I2 in lookup range A2:A8 and return the Inpatients count from D2:D8.',
      targetCell: 'J2',
      sheetName: 'Ward Census & Staffing',
      requiredOutcome: 'Cell J2 evaluates to 36 using XLOOKUP (or VLOOKUP).',
      checklist: [
        'Select target cell J2',
        'Enter formula =XLOOKUP(I2, A2:A8, D2:D8)',
        'Verify returned inpatient count evaluates to 36',
      ],
      excelTopics: ['XLOOKUP', 'VLOOKUP', 'Relational Retrieval'],
      hints: [
        'XLOOKUP syntax: =XLOOKUP(lookup_value, lookup_array, return_array).',
        'Pass I2 as the ward to find, A2:A8 as the ward list, and D2:D8 as the inpatients to return.',
        'Enter: =XLOOKUP(I2, A2:A8, D2:D8)',
      ],
      sampleSolutionFormula: '=XLOOKUP(I2, A2:A8, D2:D8)',
      solutionExplanation:
        '=XLOOKUP(I2, A2:A8, D2:D8) matches "Intensive Care Unit (ICU)" and returns 36 inpatients.',
      initialFormulaPlaceholder: '=XLOOKUP(I2, ',
      validationRules: [
        {
          type: 'FORMULA_MATCH',
          targetCell: 'J2',
          description: 'Formula uses XLOOKUP or VLOOKUP for ward census retrieval',
          formulaPattern: 'LOOKUP',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'J2',
          description: 'Cell J2 evaluates to 36',
          expectedValue: 36,
        },
      ],
      xpReward: 160,
      badge: {
        id: 'clinical_director',
        title: 'Clinical Director',
        icon: 'Award',
      },
    },
  ],
  reportConfig: {
    title: 'Metro General Hospital System — Clinical Operations & Bed Census Audit',
    subtitle: 'Generated dynamically from live Excel ward registry',
    executiveSummaryTemplate:
      'This clinical operations audit monitors inpatient admissions, department bed occupancy rates, nurse staffing coverage ratios, and emergency triage ward headroom across Metro General campus.',
    metrics: [
      {
        id: 'total_inpatients',
        title: 'Hospital Inpatient Census',
        cellReference: 'D9',
        description: 'Total patients currently admitted across clinical departments.',
        type: 'stat',
        format: 'number',
      },
      {
        id: 'avg_bed_occupancy',
        title: 'Average Bed Occupancy',
        cellReference: 'E9',
        description: 'Mean bed utilization rate across licensed hospital wards.',
        type: 'stat',
        format: 'percent',
      },
      {
        id: 'icu_staffing_ratio',
        title: 'ICU Patient/Nurse Ratio',
        cellReference: 'H2',
        description: 'Clinician coverage density in intensive care.',
        type: 'stat',
        format: 'number',
      },
      {
        id: 'icu_census_lookup',
        title: 'ICU Inpatients',
        cellReference: 'J2',
        description: 'Active bed count in critical care retrieved via lookup.',
        type: 'stat',
        format: 'number',
      },
    ],
  },
};
