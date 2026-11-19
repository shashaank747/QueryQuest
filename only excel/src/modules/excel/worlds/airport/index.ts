import { ExcelWorldDefinition, ExcelWorkbookData, createSheetFromMatrix } from '../types';

const airportMatrix: (string | number | boolean | null)[][] = [
  // Row 1 (Header: index 0)
  [
    'Flight No',
    'Airline',
    'Assigned Gate',
    'Passengers',
    'Turnaround (Mins)',
    'Delay (Mins)',
    'Flight Status',
    'Lookup Flight',
    'Gate Result',
  ],
  // Row 2 (index 1) - AI-502
  ['AI-502', 'Air India', 'Gate A3', 240, 45, 35, null, 'AI-502', null],
  // Row 3 (index 2) - 6E-210
  ['6E-210', 'IndiGo', 'Gate B2', 180, 35, 0, 'ON-TIME', null, null],
  // Row 4 (index 3) - UK-815
  ['UK-815', 'Vistara', 'Gate A1', 165, 50, 25, 'DELAYED', null, null],
  // Row 5 (index 4) - SG-404
  ['SG-404', 'SpiceJet', 'Gate C4', 190, 40, 0, 'ON-TIME', null, null],
  // Row 6 (index 5) - EK-568
  ['EK-568', 'Emirates', 'Gate T1', 380, 75, 45, 'DELAYED', null, null],
  // Row 7 (index 6) - LH-755
  ['LH-755', 'Lufthansa', 'Gate T3', 320, 80, 10, 'ON-TIME', null, null],
  // Row 8 (index 7) - QP-130
  ['QP-130', 'Akasa Air', 'Gate B4', 175, 35, 0, 'ON-TIME', null, null],
  // Row 9 (index 8) - BA-118
  ['BA-118', 'British Airways', 'Gate T2', 310, 70, 60, 'DELAYED', null, null],
  // Row 10 (index 9) - Summary Row
  ['Concourse Totals / Max', null, null, null, null, null, null, null, null],
  // Row 11 (index 10) - Delayed Flights Count
  ['Delayed Flights Count', null, null, null, null, null, null, null, null],
];

const airportSheet = createSheetFromMatrix('Concourse Radar & Flights', airportMatrix, 25, 11);

airportSheet.cells['A10'].style = { bold: true };
airportSheet.cells['A11'].style = { bold: true };
airportSheet.cells['H2'].style = { bold: true };

const airportInitialWorkbook: ExcelWorkbookData = {
  sheets: {
    'Concourse Radar & Flights': airportSheet,
  },
  activeSheet: 'Concourse Radar & Flights',
};

export const airportWorld: ExcelWorldDefinition = {
  id: 'airport',
  name: 'Airport Operations',
  industry: 'Aviation & Transportation',
  tagline: 'Gate allocation summaries, passenger throughput, and delayed flight lookups with XLOOKUP.',
  description:
    'Step into SkyHarbor International Airport as a Flight Data Operations Analyst. Manage concourse gate allocations, monitor turnaround times, identify delayed flights, and perform fast gate lookups using modern lookup engines.',
  thumbnailUrl: '/images/airport-world.jpg',
  storyIntro: {
    roleTitle: 'Flight Data Operations Analyst',
    organization: 'SkyHarbor International Airport',
    background:
      'SkyHarbor coordinates international widebodies and regional turboprops across terminals A, B, C, and T. During afternoon storm weather, multiple arrivals are holding on approach corridors. The Airport Operations Center (AOC) needs spreadsheet formulas to aggregate passenger loads, isolate delayed airframes, look up tarmac gate assignments with XLOOKUP, and calculate peak runway wait times.',
    keyResponsibilities: [
      'Aggregate concourse passenger footfall to balance gate lounge capacities',
      'Benchmark ground turnaround durations to ensure airline ground crews meet SLAs',
      'Build dynamic IF delay classifiers and aggregate disrupted flights with COUNTIF',
      'Implement precision XLOOKUP and VLOOKUP queries to retrieve gate numbers instantly',
    ],
  },
  difficulty: 'Intermediate',
  estimatedTime: '45 mins',
  iconName: 'Plane',
  accentColor: 'sky',
  spreadsheetName: 'skyharbor_radar_ops.xlsx',
  excelTopics: ['XLOOKUP', 'VLOOKUP', 'SUM', 'AVERAGE', 'MAX', 'IF', 'COUNTIF'],
  isAvailable: true,
  initialWorkbook: airportInitialWorkbook,
  missions: [
    {
      id: 'airport_xl_1',
      order: 1,
      title: 'Calculate Terminal Passenger Throughput',
      role: 'Flight Data Operations Analyst',
      storyline:
        'The Terminal Services Director needs to know the total passenger volume across all 8 scheduled arrival flights to staff immigration and baggage claim belts.',
      businessProblem:
        'Understaffed baggage carousels cause tarmac congestion when multiple widebody aircraft deplane simultaneously.',
      objective:
        'In cell D10, sum the passenger counts across cells D2 through D9 using the SUM function.',
      targetCell: 'D10',
      sheetName: 'Concourse Radar & Flights',
      requiredOutcome: 'Cell D10 evaluates to 1960 using formula =SUM(D2:D9).',
      checklist: [
        'Select target cell D10',
        'Enter formula =SUM(D2:D9)',
        'Verify total passenger throughput evaluates to 1,960',
      ],
      excelTopics: ['SUM', 'Passenger Capacity'],
      hints: [
        'The passenger counts are in column D from row 2 to 9.',
        'Use the SUM function to total range D2:D9.',
        'Enter: =SUM(D2:D9)',
      ],
      sampleSolutionFormula: '=SUM(D2:D9)',
      solutionExplanation:
        '=SUM(D2:D9) adds all 8 flight manifests to yield 1,960 total arriving passengers.',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'D10',
          description: 'Formula uses SUM over D2:D9',
          expectedFormula: 'SUM(D2:D9)',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'D10',
          description: 'Cell D10 evaluates to 1960',
          expectedValue: 1960,
        },
      ],
      xpReward: 100,
      badge: {
        id: 'concourse_controller',
        title: 'Concourse Controller',
        icon: 'PlaneTakeoff',
      },
    },
    {
      id: 'airport_xl_2',
      order: 2,
      title: 'Benchmark Average Turnaround Time',
      role: 'Flight Data Operations Analyst',
      storyline:
        'Ground operations has committed to a target average turnaround under 60 minutes across airlines. Compute the average turnaround time across active gates.',
      businessProblem:
        'Excessive gate dwell time prevents incoming flights from docking, forcing costly runway holding patterns.',
      objective:
        'In cell E10, calculate the average turnaround time across cells E2:E9 using AVERAGE.',
      targetCell: 'E10',
      sheetName: 'Concourse Radar & Flights',
      requiredOutcome: 'Cell E10 evaluates to 53.75 using formula =AVERAGE(E2:E9).',
      checklist: [
        'Select target cell E10',
        'Enter formula =AVERAGE(E2:E9)',
        'Verify average turnaround time evaluates to 53.75 minutes',
      ],
      excelTopics: ['AVERAGE', 'Turnaround Metrics'],
      hints: [
        'Turnaround durations in minutes are recorded in column E from row 2 to 9.',
        'Use the AVERAGE function: =AVERAGE(E2:E9).',
        'Enter: =AVERAGE(E2:E9)',
      ],
      sampleSolutionFormula: '=AVERAGE(E2:E9)',
      solutionExplanation:
        '=AVERAGE(E2:E9) computes the average aircraft turnaround across 8 gates as 53.75 minutes.',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'E10',
          description: 'Formula uses AVERAGE over E2:E9',
          expectedFormula: 'AVERAGE(E2:E9)',
        },
        {
          type: 'VALUE_TOLERANCE',
          targetCell: 'E10',
          description: 'Cell E10 evaluates to 53.75 ±0.05',
          expectedValue: 53.75,
          numericTolerance: 0.05,
        },
      ],
      xpReward: 110,
    },
    {
      id: 'airport_xl_3',
      order: 3,
      title: 'Flag Flight Delay with IF Logic',
      role: 'Flight Data Operations Analyst',
      storyline:
        'Civil aviation regulations state that any arrival delayed by more than 15 minutes must be flagged as "DELAYED" for priority tarmac taxiing.',
      businessProblem:
        'Air traffic controllers need instantaneous visual flags to prioritize de-icing and taxiway routing.',
      objective:
        'In cell G2, write an IF formula checking if Delay (F2) is greater than 15 (>15). If true, return "DELAYED"; otherwise return "ON-TIME".',
      targetCell: 'G2',
      sheetName: 'Concourse Radar & Flights',
      requiredOutcome: 'Cell G2 evaluates to "DELAYED" using formula =IF(F2>15, "DELAYED", "ON-TIME").',
      checklist: [
        'Select target cell G2',
        'Enter formula =IF(F2>15, "DELAYED", "ON-TIME")',
        'Verify returned status evaluates to "DELAYED"',
      ],
      excelTopics: ['IF', 'Logical Tests (>15)', 'SLA Thresholds'],
      hints: [
        'Compare cell F2 against 15: =IF(F2>15, "DELAYED", "ON-TIME").',
        'Make sure to wrap text return strings in double quotation marks.',
        'Enter: =IF(F2>15, "DELAYED", "ON-TIME")',
      ],
      sampleSolutionFormula: '=IF(F2>15, "DELAYED", "ON-TIME")',
      solutionExplanation:
        'Air India flight AI-502 has 35 minutes delay, which exceeds 15, returning "DELAYED".',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'G2',
          description: 'Formula uses IF logic comparing F2 > 15',
          expectedFormula: 'IF(F2>15',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'G2',
          description: 'Cell G2 evaluates to "DELAYED"',
          expectedValue: 'DELAYED',
        },
      ],
      xpReward: 120,
    },
    {
      id: 'airport_xl_4',
      order: 4,
      title: 'Count Delayed Concourse Arrivals',
      role: 'Flight Data Operations Analyst',
      storyline:
        'AOC Duty Manager needs to report how many flights are currently experiencing operational delays.',
      businessProblem:
        'Tracking total delayed arrivals helps the airport operations center allocate extra gate service crews.',
      objective:
        'In cell G11, use COUNTIF over cells G2:G9 to count occurrences of "DELAYED".',
      targetCell: 'G11',
      sheetName: 'Concourse Radar & Flights',
      requiredOutcome: 'Cell G11 evaluates to 4 using formula =COUNTIF(G2:G9, "DELAYED").',
      checklist: [
        'Select target cell G11',
        'Enter formula =COUNTIF(G2:G9, "DELAYED")',
        'Verify delayed count evaluates to 4',
      ],
      excelTopics: ['COUNTIF', 'Operational Disruption Tracking'],
      hints: [
        'Use COUNTIF to aggregate matches in range G2:G9.',
        'Criteria is the string "DELAYED".',
        'Enter: =COUNTIF(G2:G9, "DELAYED")',
      ],
      sampleSolutionFormula: '=COUNTIF(G2:G9, "DELAYED")',
      solutionExplanation:
        '=COUNTIF(G2:G9, "DELAYED") counts 4 delayed flights (AI-502, UK-815, EK-568, BA-118).',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'G11',
          description: 'Formula uses COUNTIF over G2:G9 for "DELAYED"',
          expectedFormula: 'COUNTIF(G2:G9,"DELAYED")',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'G11',
          description: 'Cell G11 evaluates to 4',
          expectedValue: 4,
        },
      ],
      xpReward: 130,
      badge: {
        id: 'radar_auditor',
        title: 'Radar Auditor',
        icon: 'Radio',
      },
    },
    {
      id: 'airport_xl_5',
      order: 5,
      title: 'Dynamic Gate Lookup with XLOOKUP',
      role: 'Flight Data Operations Analyst',
      storyline:
        'A passenger assistance kiosk needs to display the assigned gate for flight AI-502 (specified in cell H2). Use modern XLOOKUP to retrieve the gate from the radar table.',
      businessProblem:
        'Legacy VLOOKUP breaks if columns are rearranged. Modern XLOOKUP provides robust two-way relational queries.',
      objective:
        'In cell I2, use XLOOKUP to look up flight code H2 (or "AI-502") in lookup array A2:A9 and return the corresponding Assigned Gate from C2:C9.',
      targetCell: 'I2',
      sheetName: 'Concourse Radar & Flights',
      requiredOutcome: 'Cell I2 evaluates to "Gate A3" using XLOOKUP (or VLOOKUP).',
      checklist: [
        'Select target cell I2',
        'Enter formula =XLOOKUP(H2, A2:A9, C2:C9)',
        'Verify returned gate is "Gate A3"',
      ],
      excelTopics: ['XLOOKUP', 'VLOOKUP', 'Lookup & Reference'],
      hints: [
        'XLOOKUP syntax: =XLOOKUP(lookup_value, lookup_array, return_array).',
        'Pass H2 as lookup value, A2:A9 as lookup array, and C2:C9 as return array.',
        'Enter: =XLOOKUP(H2, A2:A9, C2:C9)',
      ],
      sampleSolutionFormula: '=XLOOKUP(H2, A2:A9, C2:C9)',
      solutionExplanation:
        '=XLOOKUP(H2, A2:A9, C2:C9) searches for "AI-502" in the flight list and retrieves the corresponding "Gate A3".',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_MATCH',
          targetCell: 'I2',
          description: 'Formula utilizes XLOOKUP or VLOOKUP for flight gate lookup',
          formulaPattern: 'LOOKUP',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'I2',
          description: 'Cell I2 evaluates to "Gate A3"',
          expectedValue: 'Gate A3',
        },
      ],
      xpReward: 160,
      badge: {
        id: 'lookup_maestro',
        title: 'Lookup Maestro',
        icon: 'Search',
      },
    },
    {
      id: 'airport_xl_6',
      order: 6,
      title: 'Find Maximum Runway Delay Time',
      role: 'Flight Data Operations Analyst',
      storyline:
        'The Director of Safety is reviewing extreme weather disruptions and needs the worst flight delay figure recorded today.',
      businessProblem:
        'Identifying peak outlier delays allows the airport to trigger mandatory passenger refreshment vouchers.',
      objective:
        'In cell F10, find the maximum delay recorded across cells F2:F9 using the MAX function.',
      targetCell: 'F10',
      sheetName: 'Concourse Radar & Flights',
      requiredOutcome: 'Cell F10 evaluates to 60 using formula =MAX(F2:F9).',
      checklist: [
        'Select target cell F10',
        'Enter formula =MAX(F2:F9)',
        'Verify maximum delay evaluates to 60 minutes',
      ],
      excelTopics: ['MAX', 'Outlier Analysis'],
      hints: [
        'The MAX function finds the highest value in a numerical range.',
        'Delays are in column F from row 2 to 9.',
        'Enter: =MAX(F2:F9)',
      ],
      sampleSolutionFormula: '=MAX(F2:F9)',
      solutionExplanation:
        '=MAX(F2:F9) identifies the longest tarmac delay of 60 minutes (British Airways BA-118).',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'F10',
          description: 'Formula uses MAX over F2:F9',
          expectedFormula: 'MAX(F2:F9)',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'F10',
          description: 'Cell F10 evaluates to 60',
          expectedValue: 60,
        },
      ],
      xpReward: 120,
    },
  ],
  reportConfig: {
    title: 'SkyHarbor International Airport — Flight Operations Audit',
    subtitle: 'Generated dynamically from live Excel concourse radar',
    executiveSummaryTemplate:
      'This aviation operations audit evaluates terminal gate utilization, airline ground turnaround efficiency, arrival punctuality, and passenger concourse volume.',
    metrics: [
      {
        id: 'total_passengers',
        title: 'Passenger Throughput',
        cellReference: 'D10',
        description: 'Total passengers deplaned across active concourse gates.',
        type: 'stat',
        format: 'number',
      },
      {
        id: 'avg_turnaround',
        title: 'Avg Turnaround (Mins)',
        cellReference: 'E10',
        description: 'Mean aircraft gate turnaround duration.',
        type: 'stat',
        format: 'number',
      },
      {
        id: 'delayed_arrivals',
        title: 'Delayed Arrivals Count',
        cellReference: 'G11',
        description: 'Flights exceeding 15-minute operational delay threshold.',
        type: 'kpi',
        format: 'number',
      },
      {
        id: 'max_delay',
        title: 'Peak Delay (Mins)',
        cellReference: 'F10',
        description: 'Longest recorded arrival tarmac delay.',
        type: 'stat',
        format: 'number',
      },
    ],
  },
};
