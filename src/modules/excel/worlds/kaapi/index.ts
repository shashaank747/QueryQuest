import { ExcelWorldDefinition, ExcelWorkbookData, createSheetFromMatrix } from '../types';

const kaapiMatrix: (string | number | boolean | null)[][] = [
  // Row 1 (Header: index 0)
  [
    'Item Code',
    'Dish Name',
    'Category',
    'Units Sold',
    'Unit Price (₹)',
    'Line Revenue (₹)',
    'Menu Classification',
    'GST Amount (₹)',
  ],
  // Row 2 (index 1) - Filter Kaapi
  ['KAP-01', 'Degree Filter Kaapi', 'Beverage', 145, 30, null, null, 217.5],
  // Row 3 (index 2) - Masala Dosa
  ['KAP-02', 'Crispy Masala Dosa', 'Tiffin', 110, 65, 7150, 'STAR', 357.5],
  // Row 4 (index 3) - Button Idli
  ['KAP-03', 'Steamed Button Idli (2pc)', 'Tiffin', 95, 40, 3800, 'STAR', 190.0],
  // Row 5 (index 4) - Medu Vada
  ['KAP-04', 'Medu Vada (1pc)', 'Tiffin', 85, 35, 2975, 'STAR', 148.75],
  // Row 6 (index 5) - Khara Bath
  ['KAP-05', 'Khara Bath (Upma)', 'Tiffin', 42, 45, 1890, 'REGULAR', 94.5],
  // Row 7 (index 6) - Kesari Bath
  ['KAP-06', 'Kesari Bath', 'Dessert', 38, 45, 1710, 'REGULAR', 85.5],
  // Row 8 (index 7) - Bisi Bele Bath
  ['KAP-07', 'Bisi Bele Bath', 'Meal', 54, 75, 4050, 'REGULAR', 202.5],
  // Row 9 (index 8) - Mysore Pak
  ['KAP-08', 'Mysore Pak', 'Dessert', 26, 50, 1300, 'REGULAR', 65.0],
  // Row 10 (index 9) - Summary
  ['Morning Total / Avg', null, null, null, null, null, null, null],
  // Row 11 (index 10) - Star Dish Count
  ['Star Dishes Count', null, null, null, null, null, null, null],
];

const kaapiSheet = createSheetFromMatrix('Morning Sales Register', kaapiMatrix, 25, 10);

kaapiSheet.cells['A10'].style = { bold: true };
kaapiSheet.cells['A11'].style = { bold: true };

const kaapiInitialWorkbook: ExcelWorkbookData = {
  sheets: {
    'Morning Sales Register': kaapiSheet,
  },
  activeSheet: 'Morning Sales Register',
};

export const kaapiWorld: ExcelWorldDefinition = {
  id: 'kaapi',
  name: 'Query & Kaapi — Tiffin & Filter Coffee',
  industry: 'Hospitality & Culinary Operations',
  tagline: 'Morning shift sales registers, dish price averages, coffee revenue, and star dishes with IF.',
  description:
    'Step into Query & Kaapi Tiffin Room & Roastery as Kitchen POS & Inventory Systems Lead. Reconcile morning rush sales, calculate Degree Filter Coffee revenue, audit menu price averages, and classify high-velocity star dishes with IF logic.',
  thumbnailUrl: '/images/kaapi-world.jpg',
  storyIntro: {
    roleTitle: 'Kitchen POS & Inventory Systems Lead',
    organization: 'Query & Kaapi Tiffin Room & Roastery',
    background:
      'It is 10:30 AM and the frantic morning breakfast rush is settling down. Master Roaster & Head Chef Suresh Shetty needs the daily shift register closed and audited before the afternoon tiffin prep begins. Your spreadsheet formulas will balance kitchen receipts, determine morning turnover, and classify star menu performers.',
    keyResponsibilities: [
      'Sum breakfast rush orders across all South Indian tiffin and roastery categories',
      'Compute the arithmetic average menu item price for management pricing reviews',
      'Calculate line item sales by multiplying quantities and prices in the digital register',
      'Apply IF decision logic and COUNTIF to distinguish Star items from Regular menu items',
    ],
  },
  difficulty: 'Beginner',
  estimatedTime: '30 mins',
  iconName: 'Coffee',
  accentColor: 'amber',
  spreadsheetName: 'query_kaapi_register.xlsx',
  excelTopics: ['SUM', 'AVERAGE', 'IF', 'COUNTIF', 'Multiplication (*)', 'Cell Referencing'],
  isAvailable: true,
  initialWorkbook: kaapiInitialWorkbook,
  missions: [
    {
      id: 'kaapi_xl_1',
      order: 1,
      title: 'Tally Total Morning Units Sold',
      role: 'Kitchen POS & Inventory Systems Lead',
      storyline:
        'Head Chef Suresh Shetty wants to know the total number of food and beverage portions prepared during the peak 7:00 AM – 10:30 AM morning rush.',
      businessProblem:
        'Aggregate unit counts verify kitchen inventory usage and raw ingredient consumption.',
      objective:
        'In cell D10, write an Excel formula using SUM to calculate total units sold across cells D2 through D9.',
      targetCell: 'D10',
      sheetName: 'Morning Sales Register',
      requiredOutcome: 'Cell D10 evaluates to 595 using formula =SUM(D2:D9).',
      checklist: [
        'Select target cell D10',
        'Enter formula =SUM(D2:D9)',
        'Verify total units sold equals 595',
      ],
      excelTopics: ['SUM', 'Range Selection'],
      hints: [
        'The SUM function adds all numbers in a specified cell range.',
        'Units sold are listed in column D from row 2 to row 9.',
        'Enter: =SUM(D2:D9)',
      ],
      sampleSolutionFormula: '=SUM(D2:D9)',
      solutionExplanation:
        '=SUM(D2:D9) totals all units sold across all 8 menu items, giving 595 total portions.',
      initialFormulaPlaceholder: '=SUM(',
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
          description: 'Cell D10 evaluates to 595',
          expectedValue: 595,
        },
      ],
      xpReward: 100,
      badge: {
        id: 'tiffin_accountant',
        title: 'Tiffin Accountant',
        icon: 'Receipt',
      },
    },
    {
      id: 'kaapi_xl_2',
      order: 2,
      title: 'Calculate Average Menu Item Price',
      role: 'Kitchen POS & Inventory Systems Lead',
      storyline:
        'The restaurant partners are reviewing price points across tiffins, meals, and roastery drinks to ensure competitive pricing.',
      businessProblem:
        'Average item pricing provides a quick benchmark against neighboring South Indian darshinis.',
      objective:
        'In cell E10, compute the average unit price across dishes in cells E2:E9 using AVERAGE.',
      targetCell: 'E10',
      sheetName: 'Morning Sales Register',
      requiredOutcome: 'Cell E10 evaluates to 48.125 using formula =AVERAGE(E2:E9).',
      checklist: [
        'Select target cell E10',
        'Enter formula =AVERAGE(E2:E9)',
        'Verify average price evaluates to approximately ₹48.13',
      ],
      excelTopics: ['AVERAGE', 'Pricing Analytics'],
      hints: [
        'The AVERAGE function computes the mean of a range.',
        'Prices are located in column E from row 2 to 9.',
        'Enter: =AVERAGE(E2:E9)',
      ],
      sampleSolutionFormula: '=AVERAGE(E2:E9)',
      solutionExplanation:
        '=AVERAGE(E2:E9) sums all dish prices (₹385) and divides by 8 items, giving an average price of ₹48.125.',
      initialFormulaPlaceholder: '=AVERAGE(',
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
          description: 'Cell E10 evaluates to 48.125 ±0.05',
          expectedValue: 48.125,
          numericTolerance: 0.05,
        },
      ],
      xpReward: 110,
    },
    {
      id: 'kaapi_xl_3',
      order: 3,
      title: 'Calculate Degree Filter Kaapi Line Revenue',
      role: 'Kitchen POS & Inventory Systems Lead',
      storyline:
        'Our flagship Degree Filter Kaapi is the top seller. Compute the total line revenue generated by multiplying units sold by unit price.',
      businessProblem:
        'Line-by-line revenue calculation forms the bedrock of sales reconciliation.',
      objective:
        'In cell F2, multiply Units Sold (D2) by Unit Price (E2) using formula =D2*E2.',
      targetCell: 'F2',
      sheetName: 'Morning Sales Register',
      requiredOutcome: 'Cell F2 evaluates to 4350 using formula =D2*E2.',
      checklist: [
        'Select target cell F2',
        'Enter formula =D2*E2',
        'Verify line revenue evaluates to ₹4,350',
      ],
      excelTopics: ['Multiplication (*)', 'Cell Referencing'],
      hints: [
        'In Excel, use the asterisk symbol (*) to multiply two cell values.',
        'D2 holds units sold (145) and E2 holds unit price (₹30).',
        'Enter: =D2*E2',
      ],
      sampleSolutionFormula: '=D2*E2',
      solutionExplanation:
        '=D2*E2 multiplies 145 cups of coffee by ₹30 per cup to generate ₹4,350 in coffee revenue.',
      initialFormulaPlaceholder: '=D2*',
      validationRules: [
        {
          type: 'EXACT_FORMULA',
          targetCell: 'F2',
          description: 'Formula multiplies D2 by E2 (=D2*E2)',
          expectedFormula: '=D2*E2',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'F2',
          description: 'Cell F2 evaluates to 4350',
          expectedValue: 4350,
        },
      ],
      xpReward: 100,
    },
    {
      id: 'kaapi_xl_4',
      order: 4,
      title: 'Classify Star Menu Item with IF',
      role: 'Kitchen POS & Inventory Systems Lead',
      storyline:
        'Chef Suresh categorizes menu items with sales of 80 units or more as "STAR" performers for priority kitchen prep.',
      businessProblem:
        'Automated classification saves management from manual grading and speeds up supplier ingredient restocking.',
      objective:
        'In cell G2, write an IF formula checking if Units Sold (D2) is greater than or equal to 80 (>=80). If true, return "STAR"; otherwise "REGULAR".',
      targetCell: 'G2',
      sheetName: 'Morning Sales Register',
      requiredOutcome: 'Cell G2 evaluates to "STAR" using an IF logical formula.',
      checklist: [
        'Select target cell G2',
        'Enter formula =IF(D2>=80, "STAR", "REGULAR")',
        'Verify returned classification is "STAR"',
      ],
      excelTopics: ['IF', 'Logical Tests (>=)', 'Categorization'],
      hints: [
        'The IF syntax: =IF(condition, value_if_true, value_if_false).',
        'Check if D2 is greater than or equal to 80: =IF(D2>=80, "STAR", "REGULAR").',
        'Enter: =IF(D2>=80, "STAR", "REGULAR")',
      ],
      sampleSolutionFormula: '=IF(D2>=80, "STAR", "REGULAR")',
      solutionExplanation:
        'Since D2 is 145 (>= 80), the IF statement evaluates to TRUE, tagging Degree Filter Kaapi as a "STAR" item.',
      initialFormulaPlaceholder: '=IF(D2>=80, ',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'G2',
          description: 'Formula uses IF logic comparing D2 >= 80',
          expectedFormula: 'IF(D2>=80',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'G2',
          description: 'Cell G2 evaluates to "STAR"',
          expectedValue: 'STAR',
        },
      ],
      xpReward: 120,
      badge: {
        id: 'star_sommelier',
        title: 'Star Sommelier',
        icon: 'Sparkles',
      },
    },
    {
      id: 'kaapi_xl_5',
      order: 5,
      title: 'Audit Total Morning Shift Revenue',
      role: 'Kitchen POS & Inventory Systems Lead',
      storyline:
        'The cash register drawer must be reconciled with total recorded POS revenue before morning shift staff clock out.',
      businessProblem:
        'Consolidating total revenue ensures accounting accuracy and prevents drawer shortages.',
      objective:
        'In cell F10, sum line revenues across cells F2:F9 using =SUM(F2:F9).',
      targetCell: 'F10',
      sheetName: 'Morning Sales Register',
      requiredOutcome: 'Cell F10 evaluates to 27225 using formula =SUM(F2:F9).',
      checklist: [
        'Select target cell F10',
        'Enter formula =SUM(F2:F9)',
        'Verify total revenue evaluates to ₹27,225',
      ],
      excelTopics: ['SUM', 'Financial Register'],
      hints: [
        'Line revenues are in column F from row 2 through row 9.',
        'Use SUM to total the range: =SUM(F2:F9).',
        'Enter: =SUM(F2:F9)',
      ],
      sampleSolutionFormula: '=SUM(F2:F9)',
      solutionExplanation:
        '=SUM(F2:F9) aggregates all morning menu item sales to ₹27,225 total revenue.',
      initialFormulaPlaceholder: '=SUM(F2:F9)',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'F10',
          description: 'Formula uses SUM over F2:F9',
          expectedFormula: 'SUM(F2:F9)',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'F10',
          description: 'Cell F10 evaluates to 27225',
          expectedValue: 27225,
        },
      ],
      xpReward: 130,
    },
    {
      id: 'kaapi_xl_6',
      order: 6,
      title: 'Count High-Velocity Star Dishes',
      role: 'Kitchen POS & Inventory Systems Lead',
      storyline:
        'Chef Suresh needs the total count of distinct menu items that earned the "STAR" ranking this morning.',
      businessProblem:
        'Knowing how many items achieved Star status informs kitchen line prep station staffing.',
      objective:
        'In cell G11, use COUNTIF over cells G2:G9 to count occurrences of "STAR".',
      targetCell: 'G11',
      sheetName: 'Morning Sales Register',
      requiredOutcome: 'Cell G11 evaluates to 4 using formula =COUNTIF(G2:G9, "STAR").',
      checklist: [
        'Select target cell G11',
        'Enter formula =COUNTIF(G2:G9, "STAR")',
        'Verify Star dish count evaluates to 4',
      ],
      excelTopics: ['COUNTIF', 'Menu Engineering'],
      hints: [
        'COUNTIF counts cells in a range matching a string: =COUNTIF(range, criteria).',
        'Pass range G2:G9 and criteria "STAR".',
        'Enter: =COUNTIF(G2:G9, "STAR")',
      ],
      sampleSolutionFormula: '=COUNTIF(G2:G9, "STAR")',
      solutionExplanation:
        '=COUNTIF(G2:G9, "STAR") counts the 4 popular items with >= 80 portions sold (Filter Kaapi, Masala Dosa, Button Idli, Medu Vada).',
      initialFormulaPlaceholder: '=COUNTIF(G2:G9, ',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'G11',
          description: 'Formula uses COUNTIF over G2:G9 for "STAR"',
          expectedFormula: 'COUNTIF(G2:G9,"STAR")',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'G11',
          description: 'Cell G11 evaluates to 4',
          expectedValue: 4,
        },
      ],
      xpReward: 150,
      badge: {
        id: 'roastery_master',
        title: 'Roastery Master',
        icon: 'Award',
      },
    },
  ],
  reportConfig: {
    title: 'Query & Kaapi — Morning Shift Sales Register Audit',
    subtitle: 'Generated dynamically from live Excel kitchen register',
    executiveSummaryTemplate:
      'This culinary operations audit tracks breakfast rush velocity, Degree Kaapi beverage turnover, menu price averages, and star dish sales distributions.',
    metrics: [
      {
        id: 'total_portions_sold',
        title: 'Morning Portions Sold',
        cellReference: 'D10',
        description: 'Total tiffin and beverage portions served during rush.',
        type: 'stat',
        format: 'number',
      },
      {
        id: 'morning_gross_rev',
        title: 'Morning Shift Revenue',
        cellReference: 'F10',
        description: 'Total sales turnover registered across food and beverage.',
        type: 'stat',
        format: 'currency',
      },
      {
        id: 'avg_dish_price',
        title: 'Average Menu Price',
        cellReference: 'E10',
        description: 'Mean price per tiffin menu offering.',
        type: 'stat',
        format: 'currency',
      },
      {
        id: 'star_dish_count',
        title: 'High-Velocity Star Dishes',
        cellReference: 'G11',
        description: 'Number of menu items surpassing 80 units sold.',
        type: 'kpi',
        format: 'number',
      },
    ],
  },
};
