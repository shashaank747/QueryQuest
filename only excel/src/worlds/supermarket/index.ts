import { ExcelWorldDefinition, ExcelWorkbookData, createSheetFromMatrix } from '../types';

const supermarketMatrix: (string | number | boolean | null)[][] = [
  // Row 1 (Header: index 0)
  [
    'SKU',
    'Item Name',
    'Cost Price (₹)',
    'Selling Price (₹)',
    'Stock Qty',
    'Reorder Level',
    'Status',
    'Unit Margin (₹)',
    'Daily Sales',
    'Payment Channel',
    'Total Revenue (₹)',
  ],
  // Row 2 (index 1) - Basmati Rice
  ['SKU-101', 'Basmati Rice 5kg', 320, 450, 18, 25, null, null, 12, 'UPI', 5400],
  // Row 3 (index 2) - Sunflower Oil
  ['SKU-102', 'Sunflower Oil 1L', 110, 145, 42, 30, 'OK', 35, 28, 'Cash', 4060],
  // Row 4 (index 3) - Atta
  ['SKU-103', 'Aashirvaad Atta 10kg', 360, 440, 14, 20, 'REORDER', 80, 15, 'UPI', 6600],
  // Row 5 (index 4) - Toor Dal
  ['SKU-104', 'Toor Dal 1kg', 130, 175, 55, 40, 'OK', 45, 22, 'Card', 3850],
  // Row 6 (index 5) - Tata Salt
  ['SKU-105', 'Tata Salt 1kg', 18, 28, 120, 50, 'OK', 10, 45, 'UPI', 1260],
  // Row 7 (index 6) - Amul Butter
  ['SKU-106', 'Amul Butter 500g', 220, 275, 12, 20, 'REORDER', 55, 18, 'UPI', 4950],
  // Row 8 (index 7) - Maggi Noodles
  ['SKU-107', 'Maggi Noodles Pack', 85, 110, 65, 35, 'OK', 25, 30, 'Cash', 3300],
  // Row 9 (index 8) - Britannia Bread
  ['SKU-108', 'Britannia Bread', 32, 45, 8, 15, 'REORDER', 13, 25, 'UPI', 1125],
  // Row 10 (index 9) - Surf Excel
  ['SKU-109', 'Surf Excel 1kg', 115, 155, 38, 25, 'OK', 40, 14, 'Card', 2170],
  // Row 11 (index 10) - Colgate
  ['SKU-110', 'Colgate Toothpaste', 70, 98, 48, 30, 'OK', 28, 20, 'UPI', 1960],
  // Row 12 (index 11) - Totals / Averages
  ['Total / Avg', null, null, null, null, null, null, null, null, null, null],
  // Row 13 (index 12) - High Margin Count
  ['High Margin SKUs (>₹50)', null, null, null, null, null, null, null, null, null, null],
];

const supermarketSheet = createSheetFromMatrix('Inventory & Sales', supermarketMatrix, 25, 12);

// Add label styles and currency formats
supermarketSheet.cells['A12'].style = { bold: true };
supermarketSheet.cells['A13'].style = { bold: true };

const supermarketInitialWorkbook: ExcelWorkbookData = {
  sheets: {
    'Inventory & Sales': supermarketSheet,
  },
  activeSheet: 'Inventory & Sales',
};

export const supermarketWorld: ExcelWorldDefinition = {
  id: 'supermarket',
  name: 'Supermarket Operations',
  industry: 'Retail & Consumer Goods',
  tagline: 'Inventory reconciliation, reorder checks, margin formulas, and payment turnover.',
  description:
    'Step into FreshMart Hypermarkets as an Operations Financial Analyst. Build production spreadsheet formulas to audit shelf stock, flag low-inventory deficits, compute gross margins, and calculate checkout turnover.',
  thumbnailUrl: '/images/supermarket-world.jpg',
  storyIntro: {
    roleTitle: 'Operations Financial Analyst',
    organization: 'FreshMart Hypermarkets Ltd.',
    background:
      'FreshMart Hypermarkets manages thousands of daily stockkeeping units across regional superstores. Store Manager Devendra needs your Excel analytics expertise to replace manual tallying with automated calculation models. Your models will prevent shelf stockouts, track profit margins, and deliver executive retail performance summaries.',
    keyResponsibilities: [
      'Reconcile total warehouse inventory across all retail product categories',
      'Implement automated IF logic to flag critical reorder deficits before shelves empty',
      'Model item unit margins and calculate high-margin category counts with COUNTIF',
      'Deliver executive revenue summaries covering payment turnover and daily averages',
    ],
  },
  difficulty: 'Beginner',
  estimatedTime: '35 mins',
  iconName: 'ShoppingCart',
  accentColor: 'emerald',
  spreadsheetName: 'freshmart_operations.xlsx',
  excelTopics: ['SUM', 'AVERAGE', 'IF', 'COUNTIF', 'Arithmetic Operators', 'Cell Referencing'],
  isAvailable: true,
  initialWorkbook: supermarketInitialWorkbook,
  missions: [
    {
      id: 'sm_xl_1',
      order: 1,
      title: 'Reconcile Total Stock Units',
      role: 'Operations Financial Analyst',
      storyline:
        'Store Manager Devendra is conducting the weekly floor audit. Before placing new distributor orders, he needs the exact aggregate count of physical units across all 10 primary catalog items.',
      businessProblem:
        'Manual stock counts from floor staff often contain transcription errors. An automated SUM formula in the summary row ensures real-time accuracy.',
      objective:
        'In cell E12, write an Excel formula using SUM to calculate the total stock quantity across cells E2 through E11.',
      targetCell: 'E12',
      sheetName: 'Inventory & Sales',
      requiredOutcome: 'Cell E12 evaluates to 420 using the formula =SUM(E2:E11).',
      checklist: [
        'Select target cell E12',
        'Enter formula =SUM(E2:E11)',
        'Verify computed total equals 420',
      ],
      excelTopics: ['SUM', 'Continuous Range Selection'],
      hints: [
        'The SUM function aggregates numerical values across a contiguous range of cells.',
        'Begin your formula with =SUM( and specify the starting cell E2 followed by a colon and ending cell E11.',
        'Enter: =SUM(E2:E11)',
      ],
      sampleSolutionFormula: '=SUM(E2:E11)',
      solutionExplanation:
        '=SUM(E2:E11) totals all inventory quantities in column E from row 2 to 11, returning 420 total stock units.',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'E12',
          description: 'Formula utilizes SUM function over range E2:E11',
          expectedFormula: 'SUM(E2:E11)',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'E12',
          description: 'Cell E12 evaluates to 420 total units',
          expectedValue: 420,
        },
      ],
      xpReward: 100,
      badge: {
        id: 'stock_auditor',
        title: 'Stock Auditor',
        icon: 'PackageCheck',
      },
    },
    {
      id: 'sm_xl_2',
      order: 2,
      title: 'Automated Reorder Level Alert',
      role: 'Operations Financial Analyst',
      storyline:
        'Head of Merchandising Priya needs an automated warning for items requiring urgent restocking. For Basmati Rice 5kg in row 2, compare Stock Qty against Reorder Level.',
      businessProblem:
        'When stock dips below safe buffer levels, stockouts cause immediate customer dissatisfaction and lost revenue.',
      objective:
        'In cell G2, write an IF formula that checks whether Stock Qty (E2) is less than Reorder Level (F2). If true, return "REORDER"; otherwise return "OK".',
      targetCell: 'G2',
      sheetName: 'Inventory & Sales',
      requiredOutcome: 'Cell G2 evaluates to "REORDER" using an IF logical formula.',
      checklist: [
        'Select target cell G2',
        'Enter formula =IF(E2<F2, "REORDER", "OK")',
        'Verify returned text is "REORDER"',
      ],
      excelTopics: ['IF', 'Logical Comparison (<)', 'Text Return Values'],
      hints: [
        'The IF function takes three parameters: logical_test, value_if_true, and value_if_false.',
        'Check if E2 is less than F2: =IF(E2<F2, "REORDER", "OK").',
        'Enter: =IF(E2<F2, "REORDER", "OK")',
      ],
      sampleSolutionFormula: '=IF(E2<F2, "REORDER", "OK")',
      solutionExplanation:
        'With E2 (18) being less than F2 (25), the IF condition evaluates to TRUE, flagging the SKU as "REORDER".',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'G2',
          description: 'Formula uses IF logic comparing E2 and F2',
          expectedFormula: 'IF(E2<F2',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'G2',
          description: 'Cell G2 evaluates to "REORDER"',
          expectedValue: 'REORDER',
        },
      ],
      xpReward: 120,
      badge: {
        id: 'replenishment_sentry',
        title: 'Replenishment Sentry',
        icon: 'BellRing',
      },
    },
    {
      id: 'sm_xl_3',
      order: 3,
      title: 'Calculate Gross Unit Margin',
      role: 'Operations Financial Analyst',
      storyline:
        'Finance Director Meera is reviewing product profitability. She needs the gross rupee profit margin per unit for Basmati Rice in row 2.',
      businessProblem:
        'Without exact per-unit margin figures, pricing adjustments and promotional discounts cannot be evaluated safely.',
      objective:
        'In cell H2, calculate the gross profit margin by subtracting Cost Price (C2) from Selling Price (D2).',
      targetCell: 'H2',
      sheetName: 'Inventory & Sales',
      requiredOutcome: 'Cell H2 evaluates to 130 using formula =D2-C2.',
      checklist: [
        'Select target cell H2',
        'Enter formula =D2-C2',
        'Verify resulting gross margin equals 130',
      ],
      excelTopics: ['Basic Arithmetic', 'Cell Subtraction', 'Profit Margin'],
      hints: [
        'Gross profit equals Selling Price minus Cost Price.',
        'Reference cell D2 (Selling Price) and subtract cell C2 (Cost Price).',
        'Enter: =D2-C2',
      ],
      sampleSolutionFormula: '=D2-C2',
      solutionExplanation:
        '=D2-C2 subtracts cost (₹320) from retail price (₹450), generating a gross profit of ₹130 per unit.',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'EXACT_FORMULA',
          targetCell: 'H2',
          description: 'Formula subtracts C2 from D2 (=D2-C2)',
          expectedFormula: '=D2-C2',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'H2',
          description: 'Cell H2 evaluates to 130',
          expectedValue: 130,
        },
      ],
      xpReward: 100,
    },
    {
      id: 'sm_xl_4',
      order: 4,
      title: 'Audit High-Margin Merchandise Count',
      role: 'Operations Financial Analyst',
      storyline:
        'Senior Management wants to know how many products in our sample catalog deliver a healthy profit margin greater than ₹50 per unit.',
      businessProblem:
        'Manual counting across extensive catalogs is prone to human omission. COUNTIF automatically aggregates criteria-matched rows.',
      objective:
        'In cell H13, use COUNTIF over the unit margin range H2:H11 to count items with a margin greater than 50 (">50").',
      targetCell: 'H13',
      sheetName: 'Inventory & Sales',
      requiredOutcome: 'Cell H13 evaluates to 3 using formula =COUNTIF(H2:H11, ">50").',
      checklist: [
        'Select target cell H13',
        'Enter formula =COUNTIF(H2:H11, ">50")',
        'Verify result equals 3 high-margin SKUs',
      ],
      excelTopics: ['COUNTIF', 'Criteria Strings', 'Margin Analysis'],
      hints: [
        'COUNTIF counts cells in a range meeting a specific condition: =COUNTIF(range, criteria).',
        'Pass the range H2:H11 and the criteria string ">50" inside quotation marks.',
        'Enter: =COUNTIF(H2:H11, ">50")',
      ],
      sampleSolutionFormula: '=COUNTIF(H2:H11, ">50")',
      solutionExplanation:
        '=COUNTIF(H2:H11, ">50") inspects margins in column H and counts the 3 SKUs exceeding ₹50 (Basmati Rice ₹130, Atta ₹80, Amul Butter ₹55).',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'H13',
          description: 'Formula uses COUNTIF over H2:H11 with condition >50',
          expectedFormula: 'COUNTIF(H2:H11,">50")',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'H13',
          description: 'Cell H13 evaluates to 3',
          expectedValue: 3,
        },
      ],
      xpReward: 140,
      badge: {
        id: 'margin_hawk',
        title: 'Margin Hawk',
        icon: 'TrendingUp',
      },
    },
    {
      id: 'sm_xl_5',
      order: 5,
      title: 'Calculate Average Daily Unit Sales',
      role: 'Operations Financial Analyst',
      storyline:
        'The supply chain team is recalibrating reorder frequencies. They require the average daily unit sales volume across our catalog items.',
      businessProblem:
        'Without a benchmark average daily sales figure, safety stock models cannot prevent inventory stockouts.',
      objective:
        'In cell I12, calculate the average daily sales volume across cells I2:I11 using the AVERAGE function.',
      targetCell: 'I12',
      sheetName: 'Inventory & Sales',
      requiredOutcome: 'Cell I12 evaluates to 22.9 using formula =AVERAGE(I2:I11).',
      checklist: [
        'Select target cell I12',
        'Enter formula =AVERAGE(I2:I11)',
        'Verify average is approximately 22.9 units',
      ],
      excelTopics: ['AVERAGE', 'Statistical Aggregation'],
      hints: [
        'The AVERAGE function computes the arithmetic mean of a range of numbers.',
        'Specify range I2:I11 inside the parentheses.',
        'Enter: =AVERAGE(I2:I11)',
      ],
      sampleSolutionFormula: '=AVERAGE(I2:I11)',
      solutionExplanation:
        '=AVERAGE(I2:I11) sums all daily unit sales (229) and divides by 10 items to return 22.9 units per day.',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'I12',
          description: 'Formula uses AVERAGE function over I2:I11',
          expectedFormula: 'AVERAGE(I2:I11)',
        },
        {
          type: 'VALUE_TOLERANCE',
          targetCell: 'I12',
          description: 'Cell I12 evaluates to 22.9 ±0.05',
          expectedValue: 22.9,
          numericTolerance: 0.05,
        },
      ],
      xpReward: 120,
    },
    {
      id: 'sm_xl_6',
      order: 6,
      title: 'Consolidate Total Gross Store Sales',
      role: 'Operations Financial Analyst',
      storyline:
        'Executive store closing report: General Manager Devendra requires the grand total sales revenue generated across all completed product lines.',
      businessProblem:
        'Total turnover is the key metric reported daily to executive regional directors.',
      objective:
        'In cell K12, compute the grand total revenue across cells K2:K11 using =SUM(K2:K11).',
      targetCell: 'K12',
      sheetName: 'Inventory & Sales',
      requiredOutcome: 'Cell K12 evaluates to 34675 using formula =SUM(K2:K11).',
      checklist: [
        'Select target cell K12',
        'Enter formula =SUM(K2:K11)',
        'Verify total sales revenue evaluates to 34675',
      ],
      excelTopics: ['SUM', 'Financial Reporting', 'Grand Total Consolidation'],
      hints: [
        'Total Revenue is stored in column K from row 2 to row 11.',
        'Use the SUM function to aggregate the range K2:K11.',
        'Enter: =SUM(K2:K11)',
      ],
      sampleSolutionFormula: '=SUM(K2:K11)',
      solutionExplanation:
        '=SUM(K2:K11) aggregates all line revenues to deliver ₹34,675 total store turnover.',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'K12',
          description: 'Formula aggregates K2:K11 with SUM',
          expectedFormula: 'SUM(K2:K11)',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'K12',
          description: 'Cell K12 evaluates to ₹34,675',
          expectedValue: 34675,
        },
      ],
      xpReward: 150,
      badge: {
        id: 'turnover_titan',
        title: 'Turnover Titan',
        icon: 'CircleDollarSign',
      },
    },
  ],
  reportConfig: {
    title: 'FreshMart Hypermarket — Executive Spreadsheet Operations Audit',
    subtitle: 'Generated dynamically from live Excel workbook calculations',
    executiveSummaryTemplate:
      'This operational spreadsheet audit analyzes catalog inventory, replenishment safety buffers, SKU profit margins, and checkout sales volume across FreshMart retail aisles.',
    metrics: [
      {
        id: 'total_inventory',
        title: 'Total Stock Units',
        cellReference: 'E12',
        description: 'Physical units on hand across all catalog lines.',
        type: 'stat',
        format: 'number',
      },
      {
        id: 'total_revenue',
        title: 'Gross Checkout Sales',
        cellReference: 'K12',
        description: 'Aggregate store turnover generated from inventory sales.',
        type: 'stat',
        format: 'currency',
      },
      {
        id: 'high_margin_skus',
        title: 'High-Margin SKU Count',
        cellReference: 'H13',
        description: 'Product lines generating > ₹50 gross profit margin per unit.',
        type: 'kpi',
        format: 'number',
      },
      {
        id: 'avg_daily_sales',
        title: 'Average Daily Unit Velocity',
        cellReference: 'I12',
        description: 'Average daily unit sales per product line.',
        type: 'stat',
        format: 'number',
      },
    ],
  },
};
