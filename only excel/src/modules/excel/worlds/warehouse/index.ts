import { ExcelWorldDefinition, ExcelWorkbookData, createSheetFromMatrix } from '../types';

const warehouseMatrix: (string | number | boolean | null)[][] = [
  // Row 1 (Header: index 0)
  [
    'Zone ID',
    'Zone Type',
    'Max Capacity (Bins)',
    'Occupied Bins',
    'Avail Capacity',
    'Utilization Rate',
    'Overcapacity Alert',
    'Daily Freight (Kg)',
  ],
  // Row 2 (index 1) - ZONE-A1
  ['ZONE-A1', 'High-Bay Pallet', 600, 540, null, null, null, 14500],
  // Row 3 (index 2) - ZONE-A2
  ['ZONE-A2', 'Cold Storage', 400, 320, 80, 0.8, 'NORMAL', 8200],
  // Row 4 (index 3) - ZONE-B1
  ['ZONE-B1', 'Bulk Hazardous', 300, 210, 90, 0.7, 'NORMAL', 6400],
  // Row 5 (index 4) - ZONE-B2
  ['ZONE-B2', 'Mezzanine Pick', 500, 460, 40, 0.92, 'CRITICAL', 11800],
  // Row 6 (index 5) - ZONE-C1
  ['ZONE-C1', 'Fast-Mover Totes', 750, 690, 60, 0.92, 'CRITICAL', 18500],
  // Row 7 (index 6) - ZONE-C2
  ['ZONE-C2', 'Cross-Dock Staging', 450, 315, 135, 0.7, 'NORMAL', 9600],
  // Row 8 (index 7) - ZONE-D1
  ['ZONE-D1', 'Automated Carousel', 350, 280, 70, 0.8, 'NORMAL', 7200],
  // Row 9 (index 8) - ZONE-D2
  ['ZONE-D2', 'Oversized Cargo', 250, 175, 75, 0.7, 'NORMAL', 5800],
  // Row 10 (index 9) - Summary Row
  ['Warehouse Totals / Metrics', null, null, null, null, null, null, null],
  // Row 11 (index 10) - High-Capacity Count
  ['Large Zones (>500 bins)', null, null, null, null, null, null, null],
];

const warehouseSheet = createSheetFromMatrix('Storage & Manifest', warehouseMatrix, 25, 10);

warehouseSheet.cells['A10'].style = { bold: true };
warehouseSheet.cells['A11'].style = { bold: true };

const warehouseInitialWorkbook: ExcelWorkbookData = {
  sheets: {
    'Storage & Manifest': warehouseSheet,
  },
  activeSheet: 'Storage & Manifest',
};

export const warehouseWorld: ExcelWorldDefinition = {
  id: 'warehouse',
  name: 'Warehouse Management',
  industry: 'Logistics & Supply Chain',
  tagline: 'Bin capacity calculations, pallet density, and carrier freight analysis.',
  description:
    'Join Apex Global Logistics Hub as a Logistics Data Specialist. Monitor pallet racking density, calculate available storage capacity, trigger overcapacity warnings, and reconcile outbound carrier freight.',
  thumbnailUrl: '/images/warehouse-world.jpg',
  storyIntro: {
    roleTitle: 'Logistics Data Specialist',
    organization: 'Apex Global Logistics Hub',
    background:
      'Apex operates an automated high-throughput logistics center spanning multi-tier racking, cold storage vaults, and cross-docking bays. With peak holiday inventory arriving by the containerload, General Manager Marcus Vance needs real-time calculations to avoid aisle blockages, calculate pallet space deficits, and ensure fulfillment throughput.',
    keyResponsibilities: [
      'Calculate available bin capacity across storage zones to direct inbound putaways',
      'Aggregate warehouse-wide pallet storage to evaluate distribution center capacity',
      'Compute utilization percentages and trigger automated critical capacity alerts',
      'Consolidate outbound carrier freight tonnage for transport logistics billing',
    ],
  },
  difficulty: 'Intermediate',
  estimatedTime: '40 mins',
  iconName: 'Boxes',
  accentColor: 'indigo',
  spreadsheetName: 'apex_logistics_manifest.xlsx',
  excelTopics: ['SUM', 'COUNTIF', 'IF', 'Division (/)', 'Subtraction (-)', 'Percentage Formatting'],
  isAvailable: true,
  initialWorkbook: warehouseInitialWorkbook,
  missions: [
    {
      id: 'warehouse_xl_1',
      order: 1,
      title: 'Calculate Available Bin Capacity',
      role: 'Logistics Data Specialist',
      storyline:
        'Inbound trucks are queuing at Dock Bay 3. For Zone A1 (High-Bay Pallet), calculate remaining available storage bins by subtracting occupied bins from maximum capacity.',
      businessProblem:
        'Directing forklifts to full aisles causes severe dock bottlenecks and wasted labor.',
      objective:
        'In cell E2, subtract Occupied Bins (D2) from Max Capacity (C2) using formula =C2-D2.',
      targetCell: 'E2',
      sheetName: 'Storage & Manifest',
      requiredOutcome: 'Cell E2 evaluates to 60 using formula =C2-D2.',
      checklist: [
        'Select target cell E2',
        'Enter formula =C2-D2',
        'Verify available capacity evaluates to 60 bins',
      ],
      excelTopics: ['Basic Arithmetic', 'Subtraction (-)'],
      hints: [
        'Subtract occupied storage bins from maximum licensed zone capacity.',
        'Reference cells C2 (Max Capacity) and D2 (Occupied Bins).',
        'Enter: =C2-D2',
      ],
      sampleSolutionFormula: '=C2-D2',
      solutionExplanation:
        '=C2-D2 calculates 600 - 540 = 60 free bin locations remaining in Zone A1.',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'EXACT_FORMULA',
          targetCell: 'E2',
          description: 'Formula subtracts D2 from C2 (=C2-D2)',
          expectedFormula: '=C2-D2',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'E2',
          description: 'Cell E2 evaluates to 60',
          expectedValue: 60,
        },
      ],
      xpReward: 100,
    },
    {
      id: 'warehouse_xl_2',
      order: 2,
      title: 'Consolidate Total Occupied Pallets',
      role: 'Logistics Data Specialist',
      storyline:
        'The distribution center inventory audit requires the aggregate number of occupied bins across all 8 warehouse storage zones.',
      businessProblem:
        'Total inventory count validates physical warehouse utilization against the corporate WMS ledger.',
      objective:
        'In cell D10, sum occupied bins across cells D2:D9 using the SUM function.',
      targetCell: 'D10',
      sheetName: 'Storage & Manifest',
      requiredOutcome: 'Cell D10 evaluates to 2990 using formula =SUM(D2:D9).',
      checklist: [
        'Select target cell D10',
        'Enter formula =SUM(D2:D9)',
        'Verify total occupied bins evaluates to 2,990',
      ],
      excelTopics: ['SUM', 'Continuous Range Aggregation'],
      hints: [
        'Occupied bins are located in column D from row 2 to 9.',
        'Use SUM: =SUM(D2:D9).',
        'Enter: =SUM(D2:D9)',
      ],
      sampleSolutionFormula: '=SUM(D2:D9)',
      solutionExplanation:
        '=SUM(D2:D9) consolidates total inventory across all 8 zones to 2,990 occupied pallet spaces.',
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
          description: 'Cell D10 evaluates to 2990',
          expectedValue: 2990,
        },
      ],
      xpReward: 100,
      badge: {
        id: 'pallet_master',
        title: 'Pallet Master',
        icon: 'Boxes',
      },
    },
    {
      id: 'warehouse_xl_3',
      order: 3,
      title: 'Compute Pallet Density Utilization Rate',
      role: 'Logistics Data Specialist',
      storyline:
        'Calculate the capacity utilization percentage for Zone A1 by dividing Occupied Bins by Max Capacity.',
      businessProblem:
        'Racking density metrics guide space reallocation and seasonal surge overflow planning.',
      objective:
        'In cell F2, divide Occupied Bins (D2) by Max Capacity (C2) using formula =D2/C2.',
      targetCell: 'F2',
      sheetName: 'Storage & Manifest',
      requiredOutcome: 'Cell F2 evaluates to 0.90 using formula =D2/C2.',
      checklist: [
        'Select target cell F2',
        'Enter formula =D2/C2',
        'Verify utilization rate evaluates to 0.9 (90%)',
      ],
      excelTopics: ['Division (/)', 'Percentage Calculations'],
      hints: [
        'In Excel, divide using the forward slash (/).',
        'Divide D2 (540) by C2 (600).',
        'Enter: =D2/C2',
      ],
      sampleSolutionFormula: '=D2/C2',
      solutionExplanation:
        '=D2/C2 divides 540 by 600, yielding 0.90 (or 90% utilization).',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'EXACT_FORMULA',
          targetCell: 'F2',
          description: 'Formula divides D2 by C2 (=D2/C2)',
          expectedFormula: '=D2/C2',
        },
        {
          type: 'VALUE_TOLERANCE',
          targetCell: 'F2',
          description: 'Cell F2 evaluates to 0.90 ±0.01',
          expectedValue: 0.9,
          numericTolerance: 0.01,
        },
      ],
      xpReward: 110,
    },
    {
      id: 'warehouse_xl_4',
      order: 4,
      title: 'Automate Critical Overcapacity Alert',
      role: 'Logistics Data Specialist',
      storyline:
        'Zones operating at 90% capacity or above pose forklift congestion risks and must be flagged as "CRITICAL" for urgent cross-docking.',
      businessProblem:
        'Automated conditional warnings ensure managers take action before warehouse zones hit 100% capacity gridlock.',
      objective:
        'In cell G2, write an IF formula checking if Utilization Rate (F2) is greater than or equal to 0.9 (>=0.9). If true, return "CRITICAL"; otherwise return "NORMAL".',
      targetCell: 'G2',
      sheetName: 'Storage & Manifest',
      requiredOutcome: 'Cell G2 evaluates to "CRITICAL" using formula =IF(F2>=0.9, "CRITICAL", "NORMAL").',
      checklist: [
        'Select target cell G2',
        'Enter formula =IF(F2>=0.9, "CRITICAL", "NORMAL")',
        'Verify returned status evaluates to "CRITICAL"',
      ],
      excelTopics: ['IF', 'Logical Comparison (>=)', 'Operational Alerts'],
      hints: [
        'IF syntax: =IF(logical_test, value_if_true, value_if_false).',
        'Check if F2 is greater than or equal to 0.9.',
        'Enter: =IF(F2>=0.9, "CRITICAL", "NORMAL")',
      ],
      sampleSolutionFormula: '=IF(F2>=0.9, "CRITICAL", "NORMAL")',
      solutionExplanation:
        'Zone A1 operates at 90% (0.90), meeting the >=0.9 threshold and returning "CRITICAL".',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'G2',
          description: 'Formula uses IF logic comparing F2 >= 0.9',
          expectedFormula: 'IF(F2>=0.9',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'G2',
          description: 'Cell G2 evaluates to "CRITICAL"',
          expectedValue: 'CRITICAL',
        },
      ],
      xpReward: 130,
      badge: {
        id: 'capacity_sentry',
        title: 'Capacity Sentry',
        icon: 'ShieldAlert',
      },
    },
    {
      id: 'warehouse_xl_5',
      order: 5,
      title: 'Count Large Storage Zones',
      role: 'Logistics Data Specialist',
      storyline:
        'Logistics Engineering is conducting a footprint study and needs the total number of large storage zones with capacity exceeding 500 bins.',
      businessProblem:
        'High-capacity zones require specialized automated turret trucks.',
      objective:
        'In cell C11, use COUNTIF over cells C2:C9 to count zones having Max Capacity greater than 500 (">500").',
      targetCell: 'C11',
      sheetName: 'Storage & Manifest',
      requiredOutcome: 'Cell C11 evaluates to 2 using formula =COUNTIF(C2:C9, ">500").',
      checklist: [
        'Select target cell C11',
        'Enter formula =COUNTIF(C2:C9, ">500")',
        'Verify large zone count evaluates to 2',
      ],
      excelTopics: ['COUNTIF', 'Capacity Banding'],
      hints: [
        'Use COUNTIF to inspect capacities in C2:C9.',
        'Use criteria ">500" inside quotes.',
        'Enter: =COUNTIF(C2:C9, ">500")',
      ],
      sampleSolutionFormula: '=COUNTIF(C2:C9, ">500")',
      solutionExplanation:
        '=COUNTIF(C2:C9, ">500") identifies the 2 zones exceeding 500 bins: Zone A1 (600) and Zone C1 (750).',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'C11',
          description: 'Formula uses COUNTIF over C2:C9 with >500',
          expectedFormula: 'COUNTIF(C2:C9,">500")',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'C11',
          description: 'Cell C11 evaluates to 2',
          expectedValue: 2,
        },
      ],
      xpReward: 130,
    },
    {
      id: 'warehouse_xl_6',
      order: 6,
      title: 'Sum Outbound Carrier Freight Weight',
      role: 'Logistics Data Specialist',
      storyline:
        'Outbound transport dispatch is booking highway freight haulers and requires the grand total shipping weight in kilograms across all zones.',
      businessProblem:
        'Carrier dispatch needs accurate aggregate tonnage to allocate truck trailer axles and avoid highway weight violations.',
      objective:
        'In cell H10, sum daily freight weight across cells H2:H9 using =SUM(H2:H9).',
      targetCell: 'H10',
      sheetName: 'Storage & Manifest',
      requiredOutcome: 'Cell H10 evaluates to 82000 using formula =SUM(H2:H9).',
      checklist: [
        'Select target cell H10',
        'Enter formula =SUM(H2:H9)',
        'Verify total freight weight evaluates to 82,000 kg',
      ],
      excelTopics: ['SUM', 'Freight Logistics'],
      hints: [
        'Daily freight weights are in column H from row 2 to row 9.',
        'Use SUM to aggregate range H2:H9.',
        'Enter: =SUM(H2:H9)',
      ],
      sampleSolutionFormula: '=SUM(H2:H9)',
      solutionExplanation:
        '=SUM(H2:H9) sums freight across all zones to 82,000 kg (82 Metric Tonnes).',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'H10',
          description: 'Formula uses SUM over H2:H9',
          expectedFormula: 'SUM(H2:H9)',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'H10',
          description: 'Cell H10 evaluates to 82000',
          expectedValue: 82000,
        },
      ],
      xpReward: 150,
      badge: {
        id: 'freight_dispatcher',
        title: 'Freight Dispatcher',
        icon: 'Truck',
      },
    },
  ],
  reportConfig: {
    title: 'Apex Global Logistics Hub — Warehouse Capacity & Manifest Audit',
    subtitle: 'Generated dynamically from live Excel storage grid',
    executiveSummaryTemplate:
      'This logistics operations audit monitors warehouse bin storage density, zone capacity headroom, critical overcapacity alerts, and outbound freight weight across Apex distribution hub.',
    metrics: [
      {
        id: 'total_pallet_stock',
        title: 'Total Occupied Bins',
        cellReference: 'D10',
        description: 'Aggregate pallet positions occupied across storage zones.',
        type: 'stat',
        format: 'number',
      },
      {
        id: 'total_freight_weight',
        title: 'Total Outbound Freight (Kg)',
        cellReference: 'H10',
        description: 'Consolidated daily freight weight staged for carrier shipping.',
        type: 'stat',
        format: 'number',
      },
      {
        id: 'large_zones_count',
        title: 'High-Capacity Zones',
        cellReference: 'C11',
        description: 'Storage zones with capacity exceeding 500 bins.',
        type: 'kpi',
        format: 'number',
      },
      {
        id: 'zone_a1_utilization',
        title: 'Zone A1 Utilization',
        cellReference: 'F2',
        description: 'Storage density percentage in high-bay pallet racking.',
        type: 'stat',
        format: 'percent',
      },
    ],
  },
};
