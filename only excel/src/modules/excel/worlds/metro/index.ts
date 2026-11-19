import { ExcelWorldDefinition, ExcelWorkbookData, createSheetFromMatrix } from '../types';

const metroMatrix: (string | number | boolean | null)[][] = [
  // Row 1 (Header: index 0)
  [
    'Station Code',
    'Station Name',
    'Line',
    'Daily Ridership',
    'Peak Hour Footfall',
    'Avg Fare (₹)',
    'Feeder Parking Bays',
    'Occupied Bays',
    'Avail Bays',
    'Daily Fare Rev (₹)',
  ],
  // Row 2 (index 1) - Majestic
  ['STN-01', 'Nadaprabhu Kempegowda (Majestic)', 'Interchange', 68000, 18500, 35, 450, 420, null, 2380000],
  // Row 3 (index 2) - MG Road
  ['STN-02', 'MG Road', 'Purple', 42000, 12000, 30, 200, 185, 15, 1260000],
  // Row 4 (index 3) - Indiranagar
  ['STN-03', 'Indiranagar', 'Purple', 39000, 11500, 28, 180, 170, 10, 1092000],
  // Row 5 (index 4) - Baiyappanahalli
  ['STN-04', 'Baiyappanahalli', 'Purple', 48000, 14200, 32, 600, 540, 60, 1536000],
  // Row 6 (index 5) - Whitefield
  ['STN-05', 'Whitefield (Kadugodi)', 'Purple', 52000, 16000, 45, 800, 720, 80, 2340000],
  // Row 7 (index 6) - Yeshwantpur
  ['STN-06', 'Yeshwantpur', 'Green', 36000, 9800, 30, 350, 290, 60, 1080000],
  // Row 8 (index 7) - National College
  ['STN-07', 'National College', 'Green', 24000, 6500, 25, 150, 110, 40, 600000],
  // Row 9 (index 8) - Silk Institute
  ['STN-08', 'Silk Institute', 'Green', 31000, 8500, 38, 400, 310, 90, 1178000],
  // Row 10 (index 9) - Summary
  ['Network Total / Avg', null, null, null, null, null, null, null, null, null],
  // Row 11 (index 10) - High Congestion Count
  ['High Peak Stations (>10k)', null, null, null, null, null, null, null, null, null],
];

const metroSheet = createSheetFromMatrix('Network Telemetry', metroMatrix, 25, 11);

metroSheet.cells['A10'].style = { bold: true };
metroSheet.cells['A11'].style = { bold: true };

const metroInitialWorkbook: ExcelWorkbookData = {
  sheets: {
    'Network Telemetry': metroSheet,
  },
  activeSheet: 'Network Telemetry',
};

export const metroWorld: ExcelWorldDefinition = {
  id: 'metro',
  name: 'Namma Metro — Transit Command',
  industry: 'Public Transit & Urban Mobility',
  tagline: 'Station ridership totals, fare averages, smart-card balance status, and feeder parking counts.',
  description:
    'Join Bangalore Metro Rail Corporation (BMRCL) Central Operations Control as a Transit Telemetry Analyst. Model commuter footfalls across Purple and Green Lines, monitor peak-hour crush loads at Majestic, and balance station feeder parking.',
  thumbnailUrl: '/images/metro-world.jpg',
  storyIntro: {
    roleTitle: 'Junior Transit Telemetry Analyst',
    organization: 'BMRCL Central Operations Control Room (OCC)',
    background:
      'The morning 8:30 AM rush is sweeping across Bengaluru’s arterial corridors. Chief Controller Ananya Rao requires real-time automated spreadsheet analytics on the central telemetry grid. You must calculate network daily ridership totals, compute average peak crush footfalls, track feeder parking space deficits, and consolidate passenger fare collection.',
    keyResponsibilities: [
      'Aggregate network-wide passenger volume across Purple, Green, and Interchange lines',
      'Compute average peak-hour passenger surges to identify station crowding bottlenecks',
      'Track multimodal feeder-bus parking bay availability in real time',
      'Audit network fare collections and high-congestion commuter hubs with COUNTIF',
    ],
  },
  difficulty: 'Beginner',
  estimatedTime: '35 mins',
  iconName: 'TrainFront',
  accentColor: 'purple',
  spreadsheetName: 'namma_metro_operations.xlsx',
  excelTopics: ['SUM', 'AVERAGE', 'COUNTIF', 'Subtraction', 'Cell Referencing'],
  isAvailable: true,
  initialWorkbook: metroInitialWorkbook,
  missions: [
    {
      id: 'metro_xl_1',
      order: 1,
      title: 'Calculate Total Daily Network Ridership',
      role: 'Junior Transit Telemetry Analyst',
      storyline:
        'Chief Controller Ananya Rao needs the consolidated daily passenger volume across all 8 key metro stations to verify whether the morning ridership target of 300,000 passengers has been achieved.',
      businessProblem:
        'Data from automated fare gates (AFC) across stations must be summed into a single network telemetry total.',
      objective:
        'In cell D10, write an Excel formula using SUM to aggregate daily ridership across cells D2 through D9.',
      targetCell: 'D10',
      sheetName: 'Network Telemetry',
      requiredOutcome: 'Cell D10 evaluates to 340000 using formula =SUM(D2:D9).',
      checklist: [
        'Select target cell D10',
        'Enter formula =SUM(D2:D9)',
        'Verify total passenger count evaluates to 340,000',
      ],
      excelTopics: ['SUM', 'Range Selection'],
      hints: [
        'The SUM function aggregates numerical values across contiguous ranges.',
        'Use range D2:D9 representing ridership from Majestic to Silk Institute.',
        'Enter: =SUM(D2:D9)',
      ],
      sampleSolutionFormula: '=SUM(D2:D9)',
      solutionExplanation:
        '=SUM(D2:D9) aggregates daily passenger numbers from all 8 stations, returning 340,000 daily commuters.',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'D10',
          description: 'Formula utilizes SUM over range D2:D9',
          expectedFormula: 'SUM(D2:D9)',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'D10',
          description: 'Cell D10 evaluates to 340000',
          expectedValue: 340000,
        },
      ],
      xpReward: 100,
      badge: {
        id: 'transit_dispatcher',
        title: 'Transit Dispatcher',
        icon: 'Activity',
      },
    },
    {
      id: 'metro_xl_2',
      order: 2,
      title: 'Determine Average Peak Hour Footfall',
      role: 'Junior Transit Telemetry Analyst',
      storyline:
        'Train scheduling requires the average peak-hour passenger influx per station to size train frequency and headways.',
      businessProblem:
        'Understanding average peak congestion helps the control room distribute train sets efficiently between the Purple and Green lines.',
      objective:
        'In cell E10, calculate the average peak-hour passenger footfall across stations in E2:E9 using AVERAGE.',
      targetCell: 'E10',
      sheetName: 'Network Telemetry',
      requiredOutcome: 'Cell E10 evaluates to 12125 using formula =AVERAGE(E2:E9).',
      checklist: [
        'Select target cell E10',
        'Enter formula =AVERAGE(E2:E9)',
        'Verify average peak footfall evaluates to 12,125',
      ],
      excelTopics: ['AVERAGE', 'Peak Surge Metrics'],
      hints: [
        'The AVERAGE function computes the mean of values in a range.',
        'The peak-hour footfalls are located in column E from row 2 to 9.',
        'Enter: =AVERAGE(E2:E9)',
      ],
      sampleSolutionFormula: '=AVERAGE(E2:E9)',
      solutionExplanation:
        '=AVERAGE(E2:E9) totals the peak footfalls (97,000) and divides by 8 stations, resulting in 12,125 commuters per station.',
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
          description: 'Cell E10 evaluates to 12125 ±0.5',
          expectedValue: 12125,
          numericTolerance: 0.5,
        },
      ],
      xpReward: 120,
    },
    {
      id: 'metro_xl_3',
      order: 3,
      title: 'Calculate Majestic Feeder Parking Availability',
      role: 'Junior Transit Telemetry Analyst',
      storyline:
        'The smart parking gate at Nadaprabhu Kempegowda Station (Majestic) is displaying an error. You must calculate the remaining available parking bays.',
      businessProblem:
        'Commuters heading to Majestic need live feeds of parking vacancy to prevent traffic jams on the feeder ramps.',
      objective:
        'In cell I2, calculate available parking bays by subtracting Occupied Bays (H2) from Feeder Parking Bays (G2).',
      targetCell: 'I2',
      sheetName: 'Network Telemetry',
      requiredOutcome: 'Cell I2 evaluates to 30 using formula =G2-H2.',
      checklist: [
        'Select target cell I2',
        'Enter formula =G2-H2',
        'Verify available parking evaluates to 30',
      ],
      excelTopics: ['Basic Arithmetic', 'Cell Referencing'],
      hints: [
        'Subtract occupied bays from total parking capacity.',
        'G2 holds total capacity (450) and H2 holds occupied count (420).',
        'Enter: =G2-H2',
      ],
      sampleSolutionFormula: '=G2-H2',
      solutionExplanation:
        '=G2-H2 calculates 450 - 420 = 30 parking bays remaining at Majestic.',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'EXACT_FORMULA',
          targetCell: 'I2',
          description: 'Formula subtracts H2 from G2 (=G2-H2)',
          expectedFormula: '=G2-H2',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'I2',
          description: 'Cell I2 evaluates to 30',
          expectedValue: 30,
        },
      ],
      xpReward: 100,
    },
    {
      id: 'metro_xl_4',
      order: 4,
      title: 'Count High-Congestion Stations',
      role: 'Junior Transit Telemetry Analyst',
      storyline:
        'Station operations requires a count of critical surge stations where peak footfall exceeds 10,000 commuters per hour so crowd-control marshals can be deployed.',
      businessProblem:
        'Rapid identification of heavy stations allows OCC to dispatch extra crowd management personnel.',
      objective:
        'In cell E11, use COUNTIF over E2:E9 to count stations having peak footfall greater than 10000 (">10000").',
      targetCell: 'E11',
      sheetName: 'Network Telemetry',
      requiredOutcome: 'Cell E11 evaluates to 5 using formula =COUNTIF(E2:E9, ">10000").',
      checklist: [
        'Select target cell E11',
        'Enter formula =COUNTIF(E2:E9, ">10000")',
        'Verify the count equals 5 stations',
      ],
      excelTopics: ['COUNTIF', 'Congestion Thresholds'],
      hints: [
        'COUNTIF syntax: =COUNTIF(range, criteria).',
        'Inspect peak hour footfalls in E2:E9 with criteria ">10000".',
        'Enter: =COUNTIF(E2:E9, ">10000")',
      ],
      sampleSolutionFormula: '=COUNTIF(E2:E9, ">10000")',
      solutionExplanation:
        '=COUNTIF(E2:E9, ">10000") identifies the 5 high-density stations: Majestic (18.5k), Whitefield (16k), Baiyappanahalli (14.2k), MG Road (12k), and Indiranagar (11.5k).',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'E11',
          description: 'Formula uses COUNTIF with >10000 criterion',
          expectedFormula: 'COUNTIF(E2:E9,">10000")',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'E11',
          description: 'Cell E11 evaluates to 5',
          expectedValue: 5,
        },
      ],
      xpReward: 140,
      badge: {
        id: 'crowd_marshal',
        title: 'Crowd Marshal',
        icon: 'Users',
      },
    },
    {
      id: 'metro_xl_5',
      order: 5,
      title: 'Calculate Average Passenger Ticket Fare',
      role: 'Junior Transit Telemetry Analyst',
      storyline:
        'The tariff regulatory authority needs the average ticket fare collected across all active metro stations.',
      businessProblem:
        'Benchmarking average ticket price guides fare subsidies and commuter pass discount tiers.',
      objective:
        'In cell F10, compute the average fare across cells F2:F9 using the AVERAGE function.',
      targetCell: 'F10',
      sheetName: 'Network Telemetry',
      requiredOutcome: 'Cell F10 evaluates to 32.875 using formula =AVERAGE(F2:F9).',
      checklist: [
        'Select target cell F10',
        'Enter formula =AVERAGE(F2:F9)',
        'Verify average fare evaluates to approximately 32.88',
      ],
      excelTopics: ['AVERAGE', 'Fare Analytics'],
      hints: [
        'Average fare figures are stored in column F rows 2 through 9.',
        'Use the AVERAGE function: =AVERAGE(F2:F9).',
        'Enter: =AVERAGE(F2:F9)',
      ],
      sampleSolutionFormula: '=AVERAGE(F2:F9)',
      solutionExplanation:
        '=AVERAGE(F2:F9) computes the arithmetic mean of fares (₹263 / 8 stations = ₹32.875).',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'F10',
          description: 'Formula uses AVERAGE over F2:F9',
          expectedFormula: 'AVERAGE(F2:F9)',
        },
        {
          type: 'VALUE_TOLERANCE',
          targetCell: 'F10',
          description: 'Cell F10 evaluates to 32.875 ±0.05',
          expectedValue: 32.875,
          numericTolerance: 0.05,
        },
      ],
      xpReward: 110,
    },
    {
      id: 'metro_xl_6',
      order: 6,
      title: 'Consolidate Total Daily Fare Revenue',
      role: 'Junior Transit Telemetry Analyst',
      storyline:
        'The Managing Director of BMRCL requires the network-wide gross fare collection across all 8 stations for the daily finance ledger.',
      businessProblem:
        'Daily fare revenue reconciliation determines cash flow for transit operations and power consumption.',
      objective:
        'In cell J10, sum the daily fare collections across cells J2:J9 using =SUM(J2:J9).',
      targetCell: 'J10',
      sheetName: 'Network Telemetry',
      requiredOutcome: 'Cell J10 evaluates to 11466000 using formula =SUM(J2:J9).',
      checklist: [
        'Select target cell J10',
        'Enter formula =SUM(J2:J9)',
        'Verify total fare revenue evaluates to ₹11,466,000',
      ],
      excelTopics: ['SUM', 'Financial Consolidation'],
      hints: [
        'Daily fare revenues are in column J from row 2 to row 9.',
        'Sum the range J2:J9.',
        'Enter: =SUM(J2:J9)',
      ],
      sampleSolutionFormula: '=SUM(J2:J9)',
      solutionExplanation:
        '=SUM(J2:J9) consolidates all station revenues to ₹11,466,000 (₹1.146 Crore).',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'J10',
          description: 'Formula uses SUM over J2:J9',
          expectedFormula: 'SUM(J2:J9)',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'J10',
          description: 'Cell J10 evaluates to 11466000',
          expectedValue: 11466000,
        },
      ],
      xpReward: 150,
      badge: {
        id: 'telemetry_commander',
        title: 'Telemetry Commander',
        icon: 'Gauge',
      },
    },
  ],
  reportConfig: {
    title: 'BMRCL Namma Metro — Executive Transit Telemetry Report',
    subtitle: 'Generated dynamically from live Excel operations grid',
    executiveSummaryTemplate:
      'This operational telemetry audit synthesizes station passenger ridership, morning peak crowd footfalls, multimodal feeder parking capacity, and farebox collections across Namma Metro network.',
    metrics: [
      {
        id: 'total_ridership',
        title: 'Network Daily Ridership',
        cellReference: 'D10',
        description: 'Total daily commuter journeys logged across stations.',
        type: 'stat',
        format: 'number',
      },
      {
        id: 'peak_surge_avg',
        title: 'Avg Peak Hour Footfall',
        cellReference: 'E10',
        description: 'Mean passenger influx per station during peak rush hours.',
        type: 'stat',
        format: 'number',
      },
      {
        id: 'high_surge_stations',
        title: 'High Congestion Hubs',
        cellReference: 'E11',
        description: 'Stations with peak footfall exceeding 10,000 commuters.',
        type: 'kpi',
        format: 'number',
      },
      {
        id: 'total_fare_revenue',
        title: 'Total Fare Revenue',
        cellReference: 'J10',
        description: 'Consolidated network daily farebox collections.',
        type: 'stat',
        format: 'currency',
      },
    ],
  },
};
