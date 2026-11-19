import { ExcelWorldDefinition, ExcelWorkbookData, createSheetFromMatrix } from '../types';

const bankMatrix: (string | number | boolean | null)[][] = [
  // Row 1 (Header: index 0)
  [
    'Txn ID',
    'Customer Name',
    'Account Type',
    'Deposit (₹)',
    'Withdrawal (₹)',
    'Net Flow (₹)',
    'Risk Flag',
    'Txn Channel',
  ],
  // Row 2 (index 1) - TXN-901
  ['TXN-901', 'Reliance Corp', 'Corporate', 450000, 0, null, null, 'RTGS'],
  // Row 3 (index 2) - TXN-902
  ['TXN-902', 'Priya Sharma', 'Savings', 25000, 8000, 17000, 'CLEARED', 'UPI'],
  // Row 4 (index 3) - TXN-903
  ['TXN-903', 'Infosys Vendor', 'Current', 280000, 0, 280000, 'FLAGGED', 'NEFT'],
  // Row 5 (index 4) - TXN-904
  ['TXN-904', 'Rahul Verma', 'Savings', 5000, 12000, -7000, 'CLEARED', 'ATM'],
  // Row 6 (index 5) - TXN-905
  ['TXN-905', 'Wipro Logistics', 'Corporate', 320000, 0, 320000, 'FLAGGED', 'RTGS'],
  // Row 7 (index 6) - TXN-906
  ['TXN-906', 'Sneha Patel', 'Savings', 18000, 5000, 13000, 'CLEARED', 'IMPS'],
  // Row 8 (index 7) - TXN-907
  ['TXN-907', 'Tata Steel Sub', 'Corporate', 150000, 0, 150000, 'CLEARED', 'NEFT'],
  // Row 9 (index 8) - TXN-908
  ['TXN-908', 'Vikram Malhotra', 'Current', 75000, 20000, 55000, 'CLEARED', 'Branch'],
  // Row 10 (index 9) - TXN-909
  ['TXN-909', 'Deepak Kumar', 'Savings', 12000, 15000, -3000, 'CLEARED', 'ATM'],
  // Row 11 (index 10) - Summary Row
  ['Vault Totals / Outliers', null, null, null, null, null, null, null],
  // Row 12 (index 11) - Average Deposit
  ['Average Inflow Volume', null, null, null, null, null, null, null],
];

const bankSheet = createSheetFromMatrix('Treasury & Transactions', bankMatrix, 25, 10);

bankSheet.cells['A11'].style = { bold: true };
bankSheet.cells['A12'].style = { bold: true };

const bankInitialWorkbook: ExcelWorkbookData = {
  sheets: {
    'Treasury & Transactions': bankSheet,
  },
  activeSheet: 'Treasury & Transactions',
};

export const bankWorld: ExcelWorldDefinition = {
  id: 'bank',
  name: 'Bank Operations',
  industry: 'Banking & Financial Services',
  tagline: 'Account ledger balancing, cumulative transaction streams, and fraud outlier thresholds.',
  description:
    'Join Apex National Trust as a Core Banking Financial Analyst. Audit customer deposit accounts, balance vault transaction ledgers, enforce AML anti-money laundering thresholds with IF logic, and detect fraud outliers.',
  thumbnailUrl: '/images/bank-world.jpg',
  storyIntro: {
    roleTitle: 'Core Banking Financial Analyst',
    organization: 'Apex National Trust',
    background:
      'Apex National Trust clears millions in domestic remittances, commercial trade settlements, and branch cash transfers every hour. Chief Compliance Officer Rajiv Mehra requires an automated audit spreadsheet to balance vault cash flows, reconcile corporate deposits, flag transactions exceeding anti-money laundering thresholds, and compute average inflow volume.',
    keyResponsibilities: [
      'Reconcile transaction net cash flows by subtracting withdrawals from deposits',
      'Consolidate branch vault totals across daily deposits and withdrawals with SUM',
      'Deploy automated AML compliance IF checks to flag transactions over ₹200,000',
      'Quantify regulatory risk exposure with COUNTIF and compute mean transaction size',
    ],
  },
  difficulty: 'Advanced',
  estimatedTime: '45 mins',
  iconName: 'Landmark',
  accentColor: 'indigo',
  spreadsheetName: 'apex_national_trust_ledger.xlsx',
  excelTopics: ['SUM', 'AVERAGE', 'COUNTIF', 'IF', 'Subtraction (-)', 'Financial Auditing'],
  isAvailable: true,
  initialWorkbook: bankInitialWorkbook,
  missions: [
    {
      id: 'bank_xl_1',
      order: 1,
      title: 'Calculate Transaction Net Cash Flow',
      role: 'Core Banking Financial Analyst',
      storyline:
        'Chief Compliance Officer Rajiv Mehra is auditing transaction TXN-901 for Reliance Corp (row 2). Calculate the net cash flow by subtracting Withdrawal from Deposit.',
      businessProblem:
        'Determining net directional movement of funds establishes whether an account is accumulating liquidity or suffering capital drain.',
      objective:
        'In cell F2, calculate net flow by subtracting Withdrawal (E2) from Deposit (D2) using formula =D2-E2.',
      targetCell: 'F2',
      sheetName: 'Treasury & Transactions',
      requiredOutcome: 'Cell F2 evaluates to 450000 using formula =D2-E2.',
      checklist: [
        'Select target cell F2',
        'Enter formula =D2-E2',
        'Verify net cash flow evaluates to ₹450,000',
      ],
      excelTopics: ['Basic Arithmetic', 'Subtraction (-)'],
      hints: [
        'Net directional liquidity is computed by subtracting total debits (withdrawals) from total credits (deposits).',
        'Subtract Withdrawal (E2) from Deposit (D2).',
        'Enter: =D2-E2',
      ],
      sampleSolutionFormula: '=D2-E2',
      solutionExplanation:
        '=D2-E2 subtracts ₹0 withdrawal from ₹450,000 deposit, resulting in ₹450,000 net inflow.',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'EXACT_FORMULA',
          targetCell: 'F2',
          description: 'Formula subtracts E2 from D2 (=D2-E2)',
          expectedFormula: '=D2-E2',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'F2',
          description: 'Cell F2 evaluates to 450000',
          expectedValue: 450000,
        },
      ],
      xpReward: 100,
    },
    {
      id: 'bank_xl_2',
      order: 2,
      title: 'Consolidate Total Vault Deposits',
      role: 'Core Banking Financial Analyst',
      storyline:
        'The head cashier needs the consolidated deposit sum across all 9 transactions to balance the branch reserve account.',
      businessProblem:
        'Vault imbalances between digital core ledgers and physical currency trigger regulatory audit fines.',
      objective:
        'In cell D11, sum all deposit amounts across cells D2:D10 using the SUM function.',
      targetCell: 'D11',
      sheetName: 'Treasury & Transactions',
      requiredOutcome: 'Cell D11 evaluates to 1335000 using formula =SUM(D2:D10).',
      checklist: [
        'Select target cell D11',
        'Enter formula =SUM(D2:D10)',
        'Verify total deposits evaluate to ₹1,335,000',
      ],
      excelTopics: ['SUM', 'Financial Ledger Consolidation'],
      hints: [
        'Deposit amounts are in column D from row 2 through row 10.',
        'Use SUM to aggregate range D2:D10.',
        'Enter: =SUM(D2:D10)',
      ],
      sampleSolutionFormula: '=SUM(D2:D10)',
      solutionExplanation:
        '=SUM(D2:D10) totals all 9 deposits to ₹1,335,000 (₹13.35 Lakhs).',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'D11',
          description: 'Formula uses SUM over D2:D10',
          expectedFormula: 'SUM(D2:D10)',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'D11',
          description: 'Cell D11 evaluates to 1335000',
          expectedValue: 1335000,
        },
      ],
      xpReward: 100,
      badge: {
        id: 'vault_custodian',
        title: 'Vault Custodian',
        icon: 'Lock',
      },
    },
    {
      id: 'bank_xl_3',
      order: 3,
      title: 'Consolidate Total Vault Withdrawals',
      role: 'Core Banking Financial Analyst',
      storyline:
        'Now calculate the aggregate outflow by summing all customer withdrawals across column E.',
      businessProblem:
        'Tracking total outflows ensures the branch maintains sufficient liquid cash reserves.',
      objective:
        'In cell E11, sum all withdrawal amounts across cells E2:E10 using the SUM function.',
      targetCell: 'E11',
      sheetName: 'Treasury & Transactions',
      requiredOutcome: 'Cell E11 evaluates to 60000 using formula =SUM(E2:E10).',
      checklist: [
        'Select target cell E11',
        'Enter formula =SUM(E2:E10)',
        'Verify total withdrawals evaluate to ₹60,000',
      ],
      excelTopics: ['SUM', 'Treasury Cash Outflows'],
      hints: [
        'Withdrawal figures are in column E from row 2 through row 10.',
        'Use SUM: =SUM(E2:E10).',
        'Enter: =SUM(E2:E10)',
      ],
      sampleSolutionFormula: '=SUM(E2:E10)',
      solutionExplanation:
        '=SUM(E2:E10) consolidates all withdrawals across ATMs and branches to ₹60,000.',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'E11',
          description: 'Formula uses SUM over E2:E10',
          expectedFormula: 'SUM(E2:E10)',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'E11',
          description: 'Cell E11 evaluates to 60000',
          expectedValue: 60000,
        },
      ],
      xpReward: 100,
    },
    {
      id: 'bank_xl_4',
      order: 4,
      title: 'Enforce AML High-Value Outlier Flag with IF',
      role: 'Core Banking Financial Analyst',
      storyline:
        'Reserve Bank AML (Anti-Money Laundering) regulations mandate that any deposit exceeding ₹200,000 must be marked as "FLAGGED" for regulatory scrutiny.',
      businessProblem:
        'Failure to identify high-value deposits results in regulatory sanctions and audit penalties.',
      objective:
        'In cell G2, write an IF formula checking if Deposit (D2) is greater than 200000 (>200000). If true, return "FLAGGED"; otherwise return "CLEARED".',
      targetCell: 'G2',
      sheetName: 'Treasury & Transactions',
      requiredOutcome: 'Cell G2 evaluates to "FLAGGED" using formula =IF(D2>200000, "FLAGGED", "CLEARED").',
      checklist: [
        'Select target cell G2',
        'Enter formula =IF(D2>200000, "FLAGGED", "CLEARED")',
        'Verify risk flag evaluates to "FLAGGED"',
      ],
      excelTopics: ['IF', 'Logical Tests (>200000)', 'Compliance Auditing'],
      hints: [
        'The IF function checks a logical test and returns custom text outputs: =IF(condition, value_if_true, value_if_false).',
        'Check if D2 exceeds 200000: =IF(D2>200000, "FLAGGED", "CLEARED").',
        'Enter: =IF(D2>200000, "FLAGGED", "CLEARED")',
      ],
      sampleSolutionFormula: '=IF(D2>200000, "FLAGGED", "CLEARED")',
      solutionExplanation:
        'Because D2 is ₹450,000 (> ₹200,000), the formula returns "FLAGGED".',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'G2',
          description: 'Formula uses IF comparing D2 > 200000',
          expectedFormula: 'IF(D2>200000',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'G2',
          description: 'Cell G2 evaluates to "FLAGGED"',
          expectedValue: 'FLAGGED',
        },
      ],
      xpReward: 130,
      badge: {
        id: 'compliance_officer',
        title: 'Compliance Officer',
        icon: 'ShieldCheck',
      },
    },
    {
      id: 'bank_xl_5',
      order: 5,
      title: 'Count Flagged High-Risk Transactions',
      role: 'Core Banking Financial Analyst',
      storyline:
        'Compliance Director Rajiv Mehra needs the total number of flagged transactions in today’s batch to dispatch the Suspicious Activity Report (SAR).',
      businessProblem:
        'SAR reports must be submitted within 24 hours of batch reconciliation.',
      objective:
        'In cell G11, use COUNTIF over cells G2:G10 to count cells containing "FLAGGED".',
      targetCell: 'G11',
      sheetName: 'Treasury & Transactions',
      requiredOutcome: 'Cell G11 evaluates to 3 using formula =COUNTIF(G2:G10, "FLAGGED").',
      checklist: [
        'Select target cell G11',
        'Enter formula =COUNTIF(G2:G10, "FLAGGED")',
        'Verify flagged count evaluates to 3',
      ],
      excelTopics: ['COUNTIF', 'Compliance Metrics'],
      hints: [
        'COUNTIF syntax: =COUNTIF(range, criteria).',
        'Inspect G2:G10 with criteria "FLAGGED".',
        'Enter: =COUNTIF(G2:G10, "FLAGGED")',
      ],
      sampleSolutionFormula: '=COUNTIF(G2:G10, "FLAGGED")',
      solutionExplanation:
        '=COUNTIF(G2:G10, "FLAGGED") counts 3 corporate high-value deposits (TXN-901, TXN-903, TXN-905).',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'G11',
          description: 'Formula uses COUNTIF over G2:G10 for "FLAGGED"',
          expectedFormula: 'COUNTIF(G2:G10,"FLAGGED")',
        },
        {
          type: 'EXACT_VALUE',
          targetCell: 'G11',
          description: 'Cell G11 evaluates to 3',
          expectedValue: 3,
        },
      ],
      xpReward: 140,
    },
    {
      id: 'bank_xl_6',
      order: 6,
      title: 'Calculate Average Deposit Inflow Volume',
      role: 'Core Banking Financial Analyst',
      storyline:
        'The Treasury Asset-Liability Committee requires the arithmetic mean deposit size across today’s transactions for liquidity modeling.',
      businessProblem:
        'Average deposit ticket size helps liquidity managers predict daily intraday clearing house collateral requirements.',
      objective:
        'In cell D12, calculate the average deposit size across cells D2:D10 using the AVERAGE function.',
      targetCell: 'D12',
      sheetName: 'Treasury & Transactions',
      requiredOutcome: 'Cell D12 evaluates to approximately 148333.33 using formula =AVERAGE(D2:D10).',
      checklist: [
        'Select target cell D12',
        'Enter formula =AVERAGE(D2:D10)',
        'Verify average deposit evaluates to approximately ₹148,333.33',
      ],
      excelTopics: ['AVERAGE', 'Liquidity Analysis'],
      hints: [
        'Deposit amounts are in column D rows 2 to 10.',
        'Use AVERAGE: =AVERAGE(D2:D10).',
        'Enter: =AVERAGE(D2:D10)',
      ],
      sampleSolutionFormula: '=AVERAGE(D2:D10)',
      solutionExplanation:
        '=AVERAGE(D2:D10) divides total deposits (₹1,335,000) by 9 transactions, yielding ₹148,333.33.',
      initialFormulaPlaceholder: '=',
      validationRules: [
        {
          type: 'FORMULA_CONTAINS',
          targetCell: 'D12',
          description: 'Formula uses AVERAGE over D2:D10',
          expectedFormula: 'AVERAGE(D2:D10)',
        },
        {
          type: 'VALUE_TOLERANCE',
          targetCell: 'D12',
          description: 'Cell D12 evaluates to 148333.33 ±1.0',
          expectedValue: 148333.33,
          numericTolerance: 1.0,
        },
      ],
      xpReward: 140,
      badge: {
        id: 'treasury_auditor',
        title: 'Treasury Auditor',
        icon: 'Coins',
      },
    },
  ],
  reportConfig: {
    title: 'Apex National Trust — Treasury & AML Compliance Audit',
    subtitle: 'Generated dynamically from live Excel banking ledger',
    executiveSummaryTemplate:
      'This financial operations audit analyzes customer deposit inflows, cash outflows, net liquidity balances, and high-value AML risk flags across Apex National Trust commercial branches.',
    metrics: [
      {
        id: 'total_deposits',
        title: 'Total Vault Deposits',
        cellReference: 'D11',
        description: 'Aggregate customer funds deposited into vault reserves.',
        type: 'stat',
        format: 'currency',
      },
      {
        id: 'total_withdrawals',
        title: 'Total Vault Withdrawals',
        cellReference: 'E11',
        description: 'Aggregate cash and transfer withdrawals cleared.',
        type: 'stat',
        format: 'currency',
      },
      {
        id: 'flagged_aml_txns',
        title: 'AML Flagged Transactions',
        cellReference: 'G11',
        description: 'Transfers exceeding ₹200,000 compliance reporting ceiling.',
        type: 'kpi',
        format: 'number',
      },
      {
        id: 'avg_deposit_size',
        title: 'Mean Deposit Ticket',
        cellReference: 'D12',
        description: 'Average deposit ticket volume across retail and corporate.',
        type: 'stat',
        format: 'currency',
      },
    ],
  },
};
