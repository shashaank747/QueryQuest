import { Mission } from '../../../types/mission';

export const BANK_MISSIONS: Mission[] = [
  {
    id: 'bk_m1',
    order: 1,
    title: 'Deploy Suspicious Activity Reporting Schema',
    role: 'Core Banking Database Analyst',
    storyline:
      'Welcome to Apex National Trust! Federal financial regulators mandate automated relational tracking for high-risk Anti-Money Laundering (AML) triggers. Chief Compliance Officer Devendra asks you to deploy the suspicious activity table.',
    businessProblem:
      'Compliance officers currently log transaction audit alerts in unencrypted documents, exposing the bank to regulatory penalties under banking audit standards.',
    objective:
      'Create a table named "suspicious_activity_flags" with flag_id (INTEGER PRIMARY KEY AUTOINCREMENT), account_id (INTEGER NOT NULL), reason TEXT NOT NULL, risk_score (INTEGER NOT NULL), and flagged_at (TEXT NOT NULL).',
    requiredOutcome:
      'A new suspicious_activity_flags table ready to log automated AML alerts and financial compliance risk scores.',
    checklist: [
      'Use CREATE TABLE suspicious_activity_flags',
      'Define flag_id INTEGER PRIMARY KEY AUTOINCREMENT',
      'Include account_id INTEGER NOT NULL',
      'Include reason TEXT NOT NULL',
      'Include risk_score INTEGER NOT NULL',
      'Include flagged_at TEXT NOT NULL',
    ],
    sqlTopics: ['CREATE TABLE', 'PRIMARY KEY', 'Column Constraints', 'Financial Auditing DDL'],
    hints: [
      'Use CREATE TABLE suspicious_activity_flags (...) with the specified columns.',
      'Specify flag_id INTEGER PRIMARY KEY AUTOINCREMENT.',
      'CREATE TABLE suspicious_activity_flags (\n  flag_id INTEGER PRIMARY KEY AUTOINCREMENT,\n  account_id INTEGER NOT NULL,\n  reason TEXT NOT NULL,\n  risk_score INTEGER NOT NULL,\n  flagged_at TEXT NOT NULL\n);',
    ],
    sampleSolution: `CREATE TABLE suspicious_activity_flags (
  flag_id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  reason TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  flagged_at TEXT NOT NULL
);`,
    solutionExplanation:
      'Centralized compliance tables allow automated banking risk engines to flag structuring, sudden deposit surges, and illicit transaction sequences.',
    initialSqlPlaceholder: `-- Mission 1: Create suspicious activity flags table\nCREATE TABLE suspicious_activity_flags (\n  \n);`,
    validationRules: [
      {
        type: 'TABLE_EXISTS',
        description: 'Verify suspicious_activity_flags table exists with required columns',
        expectedTable: 'suspicious_activity_flags',
        expectedColumns: [
          'flag_id',
          'account_id',
          'reason',
          'risk_score',
          'flagged_at',
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
    id: 'bk_m2',
    order: 2,
    title: 'Open Commercial High-Net-Worth Account',
    role: 'Core Banking Database Analyst',
    storyline:
      'Apex Sovereign Capital has deposited ₹50,000,000 to establish an institutional liquidity account at the Bengaluru Tech Hub branch (branch_id = 3). Commercial Banking VP Tanya asks for its immediate database opening.',
    businessProblem:
      'Institutional wire transfers cannot clear until the core ledger account number is committed to the accounts relational table.',
    objective:
      'Insert a new row into "accounts" with: account_id = 8, account_number = "ACC-BLR-3003", customer_name = "Apex Sovereign Capital", account_type = "Commercial", balance = 50000000.0, status = "Active", and branch_id = 3.',
    requiredOutcome:
      'New commercial account record created in accounts with balance 50000000.0.',
    checklist: [
      'Use INSERT INTO accounts (...)',
      'Specify account_id, account_number, customer_name, account_type, balance, status, branch_id',
      'Provide matching values with text enclosed in single quotes',
    ],
    sqlTopics: ['INSERT INTO', 'Commercial Accounts', 'Ledger Balances'],
    hints: [
      'Use INSERT INTO accounts (account_id, account_number, customer_name, account_type, balance, status, branch_id) VALUES (...);',
      'Wrap string fields in single quotes.',
      "INSERT INTO accounts (account_id, account_number, customer_name, account_type, balance, status, branch_id) VALUES (8, 'ACC-BLR-3003', 'Apex Sovereign Capital', 'Commercial', 50000000.0, 'Active', 3);",
    ],
    sampleSolution: `INSERT INTO accounts (account_id, account_number, customer_name, account_type, balance, status, branch_id)
VALUES (8, 'ACC-BLR-3003', 'Apex Sovereign Capital', 'Commercial', 50000000.0, 'Active', 3);`,
    solutionExplanation:
      'Inserting normalized account records establishes foreign key integrity with branches and prepares the core database for incoming transaction logs.',
    initialSqlPlaceholder: `-- Mission 2: Register ACC-BLR-3003 into accounts\nINSERT INTO accounts (\n  account_id, account_number, customer_name, account_type, balance, status, branch_id\n) VALUES (\n  \n);`,
    validationRules: [
      {
        type: 'ROW_EXISTS',
        description: 'Verify ACC-BLR-3003 is registered in accounts',
        expectedTable: 'accounts',
        expectedWhereClause: "account_number = 'ACC-BLR-3003' AND balance = 50000000.0",
        expectedRowCount: 1,
      },
    ],
    xpReward: 120,
    badge: {
      id: 'ledger_auditor',
      title: 'Ledger Audit Specialist',
      icon: 'Landmark',
    },
  },
  {
    id: 'bk_m3',
    order: 3,
    title: 'Audit High-Value Cash Withdrawals',
    role: 'Core Banking Database Analyst',
    storyline:
      'Banking regulations require mandatory reporting for liquid cash debits equal to or exceeding ₹50,000. Senior Risk Auditor Meenakshi needs an immediate extract of all qualifying transactions.',
    businessProblem:
      'Central bank compliance requires daily auditing of high-value cash withdrawals to prevent unauthorized branch treasury depletion and tax evasion.',
    objective:
      'Select account_id, txn_type, amount, and channel from "transactions" where txn_type = "WITHDRAWAL" and amount >= 50000.',
    requiredOutcome:
      'A targeted list of high-value cash withdrawals meeting the AML threshold (>= 50,000).',
    checklist: [
      'SELECT account_id, txn_type, amount, channel',
      'FROM transactions',
      'WHERE txn_type = \'WITHDRAWAL\' AND amount >= 50000',
    ],
    sqlTopics: ['SELECT', 'Compound Conditions (AND)', 'Threshold Auditing'],
    hints: [
      'Use SELECT account_id, txn_type, amount, channel FROM transactions WHERE ...;',
      'Combine conditions with AND: txn_type = \'WITHDRAWAL\' AND amount >= 50000.',
      "SELECT account_id, txn_type, amount, channel FROM transactions WHERE txn_type = 'WITHDRAWAL' AND amount >= 50000;",
    ],
    sampleSolution: `SELECT account_id, txn_type, amount, channel
FROM transactions
WHERE txn_type = 'WITHDRAWAL' AND amount >= 50000;`,
    solutionExplanation:
      'Compound boolean filters in WHERE clauses allow bank compliance systems to automatically isolate transactions requiring regulatory currency transaction reports (CTRs).',
    initialSqlPlaceholder: `-- Mission 3: Query withdrawals >= 50000\nSELECT account_id, txn_type, amount, channel\nFROM transactions\nWHERE ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify high-value cash withdrawals query',
        expectedQuery:
          "SELECT account_id, txn_type, amount, channel FROM transactions WHERE txn_type = 'WITHDRAWAL' AND amount >= 50000;",
      },
    ],
    xpReward: 130,
  },
  {
    id: 'bk_m4',
    order: 4,
    title: 'Freeze Compromised Payment Card',
    role: 'Core Banking Database Analyst',
    storyline:
      'Fraud monitoring detected abnormal international POS authorization requests on card 4532-8812-9901-3321. Customer Aarav Malhotra confirmed the card was misplaced and requested an emergency freeze.',
    businessProblem:
      'To prevent fraudulent card sweeps, the bank payment gateway must immediately decline authorizations by setting is_active = 0 in the cards database.',
    objective:
      'Update "cards" to set is_active = 0 for card_number = "4532-8812-9901-3321".',
    requiredOutcome:
      'Card 4532-8812-9901-3321 deactivated (is_active = 0).',
    checklist: [
      'Use UPDATE cards',
      'SET is_active = 0',
      'WHERE card_number = \'4532-8812-9901-3321\'',
    ],
    sqlTopics: ['UPDATE', 'Boolean flag modification', 'Card Security'],
    hints: [
      'Syntax: UPDATE cards SET is_active = 0 WHERE condition;',
      'Specify card_number = \'4532-8812-9901-3321\'.',
      "UPDATE cards SET is_active = 0 WHERE card_number = '4532-8812-9901-3321';",
    ],
    sampleSolution: `UPDATE cards
SET is_active = 0
WHERE card_number = '4532-8812-9901-3321';`,
    solutionExplanation:
      'Immediate UPDATE execution on customer security flags cuts off card network authorization paths and protects depositor funds.',
    initialSqlPlaceholder: `-- Mission 4: Freeze compromised card\nUPDATE cards\nSET is_active = 0\nWHERE card_number = '4532-8812-9901-3321';`,
    validationRules: [
      {
        type: 'ROW_EXISTS',
        description: 'Verify card is deactivated',
        expectedTable: 'cards',
        expectedWhereClause: "card_number = '4532-8812-9901-3321' AND is_active = 0",
        expectedRowCount: 1,
      },
    ],
    xpReward: 140,
  },
  {
    id: 'bk_m5',
    order: 5,
    title: 'Trace Multi-Million Commercial Wire Transfers',
    role: 'Core Banking Database Analyst',
    storyline:
      'Treasury Operations is reconciling RTGS and inter-bank clearing feeds. The Chief Risk Officer requires a cross-table audit of all major transactions (amount >= 1,000,000) linked to account ownership details.',
    businessProblem:
      'Transactions reference account_id as a foreign key. Auditors need the account number, customer legal entity name, and channel combined in a single view.',
    objective:
      'Join "accounts" and "transactions". Select a.customer_name, a.account_number, t.amount, t.channel, and t.txn_timestamp where t.amount >= 1000000.0. Order by t.amount descending.',
    requiredOutcome:
      'A joined table linking customer account details with high-value transactions (>= 1,000,000), ordered highest amount first.',
    checklist: [
      'JOIN accounts a -> transactions t ON a.account_id = t.account_id',
      'SELECT a.customer_name, a.account_number, t.amount, t.channel, t.txn_timestamp',
      'WHERE t.amount >= 1000000.0',
      'ORDER BY t.amount DESC',
    ],
    sqlTopics: ['INNER JOIN', 'Large Financial Thresholds', 'ORDER BY DESC'],
    hints: [
      'Join accounts (a) and transactions (t) using ON a.account_id = t.account_id.',
      'Filter for t.amount >= 1000000.0 and order by t.amount DESC.',
      'SELECT a.customer_name, a.account_number, t.amount, t.channel, t.txn_timestamp FROM accounts a JOIN transactions t ON a.account_id = t.account_id WHERE t.amount >= 1000000.0 ORDER BY t.amount DESC;',
    ],
    sampleSolution: `SELECT a.customer_name, a.account_number, t.amount, t.channel, t.txn_timestamp
FROM accounts a
JOIN transactions t ON a.account_id = t.account_id
WHERE t.amount >= 1000000.0
ORDER BY t.amount DESC;`,
    solutionExplanation:
      'Relational JOINs bridge banking ledger transaction streams with customer master records, providing treasury officers with full audit visibility.',
    initialSqlPlaceholder: `-- Mission 5: Join accounts and transactions for wires >= 1000000\nSELECT a.customer_name, a.account_number, t.amount, t.channel, t.txn_timestamp\nFROM accounts a\nJOIN transactions t ON ...\nWHERE t.amount >= 1000000.0\nORDER BY ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify high-value wire transfers query',
        expectedQuery:
          'SELECT a.customer_name, a.account_number, t.amount, t.channel, t.txn_timestamp FROM accounts a JOIN transactions t ON a.account_id = t.account_id WHERE t.amount >= 1000000.0 ORDER BY t.amount DESC;',
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
    id: 'bk_m6',
    order: 6,
    title: 'Calculate Branch Deposit Liquidity Reserves',
    role: 'Core Banking Database Analyst',
    storyline:
      'Bank Managing Director Aditya is preparing the quarterly report for the central monetary authority. He requests a consolidated summary of total accounts and aggregate customer deposit balances grouped by branch location.',
    businessProblem:
      'Central bank reserve requirements require computing cumulative branch liabilities by aggregating balances across checking, savings, and commercial accounts.',
    objective:
      'Join "branches" and "accounts". Select b.branch_name, b.city, COUNT(a.account_id) AS total_accounts, and SUM(a.balance) AS total_deposits. Group by b.branch_name, b.city and order by total_deposits descending.',
    requiredOutcome:
      'An aggregated branch liquidity table showing total accounts and deposit balances, sorted highest balance first.',
    checklist: [
      'JOIN branches b -> accounts a ON b.branch_id = a.branch_id',
      'SELECT b.branch_name, b.city, COUNT(a.account_id) AS total_accounts, SUM(a.balance) AS total_deposits',
      'GROUP BY b.branch_name, b.city',
      'ORDER BY total_deposits DESC',
    ],
    sqlTopics: ['Multi-table GROUP BY', 'SUM / COUNT Aggregation', 'Liquidity Analysis', 'ORDER BY DESC'],
    hints: [
      'Join branches b and accounts a ON b.branch_id = a.branch_id.',
      'Group by b.branch_name, b.city and compute COUNT(a.account_id) and SUM(a.balance).',
      'SELECT b.branch_name, b.city, COUNT(a.account_id) AS total_accounts, SUM(a.balance) AS total_deposits FROM branches b JOIN accounts a ON b.branch_id = a.branch_id GROUP BY b.branch_name, b.city ORDER BY total_deposits DESC;',
    ],
    sampleSolution: `SELECT b.branch_name, b.city, COUNT(a.account_id) AS total_accounts, SUM(a.balance) AS total_deposits
FROM branches b
JOIN accounts a ON b.branch_id = a.branch_id
GROUP BY b.branch_name, b.city
ORDER BY total_deposits DESC;`,
    solutionExplanation:
      'Aggregating depositor funds by branch location enables bank treasury management to maintain adequate cash reserves and comply with statutory liquidity ratios (SLR).',
    initialSqlPlaceholder: `-- Mission 6: Branch deposit liquidity summary\nSELECT b.branch_name, b.city, COUNT(a.account_id) AS total_accounts, SUM(a.balance) AS total_deposits\nFROM branches b\nJOIN accounts a ON ...\nGROUP BY ...\nORDER BY ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify branch deposit liquidity aggregation',
        expectedQuery:
          'SELECT b.branch_name, b.city, COUNT(a.account_id) AS total_accounts, SUM(a.balance) AS total_deposits FROM branches b JOIN accounts a ON b.branch_id = a.branch_id GROUP BY b.branch_name, b.city ORDER BY total_deposits DESC;',
      },
    ],
    xpReward: 250,
    badge: {
      id: 'bank_master',
      title: 'Commercial Banking Certified',
      icon: 'Award',
    },
  },
];
