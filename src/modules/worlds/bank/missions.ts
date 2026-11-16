import { Mission } from '../../../types/mission';

export const BANK_MISSIONS: Mission[] = [
  {
    id: 'bk_m1',
    order: 1,
    title: 'Audit Peer-Group Outliers with Correlated Subqueries',
    role: 'Core Banking Database Analyst',
    storyline:
      'Chief Risk Officer Devendra is preparing the quarterly financial solvency audit. A flat balance threshold fails to identify high-risk anomalies because commercial accounts naturally hold vastly greater balances than personal savings or checking accounts. He asks you to isolate every account whose current balance exceeds the average balance of its specific account type.',
    businessProblem:
      'Evaluating balances against a single global average generates false alerts for modest commercial deposits while missing extreme outlier concentrations in retail checking and savings portfolios. Accurate risk monitoring requires evaluating balances relative to the peer average of each account type.',
    objective:
      'Write a correlated subquery that selects a.account_number, a.customer_name, a.account_type, and a.balance from "accounts a" where a.balance > (SELECT AVG(balance) FROM accounts WHERE account_type = a.account_type) ordered by a.balance DESC.',
    requiredOutcome:
      'A prioritized list of accounts whose balances exceed their account type cohort averages, sorted highest balance first.',
    checklist: [
      'Query from accounts with alias a',
      'SELECT a.account_number, a.customer_name, a.account_type, a.balance',
      'Filter with correlated subquery: WHERE a.balance > (SELECT AVG(balance) FROM accounts WHERE account_type = a.account_type)',
      'ORDER BY a.balance DESC',
    ],
    sqlTopics: ['Correlated Subqueries', 'Subqueries in WHERE', 'AVG() Aggregate', 'ORDER BY DESC'],
    hints: [
      'A correlated subquery executes once for each candidate row in the outer query, referencing outer column values like a.account_type.',
      'Compute the subquery: (SELECT AVG(balance) FROM accounts WHERE account_type = a.account_type) and filter with WHERE a.balance > (...).',
      'SELECT a.account_number, a.customer_name, a.account_type, a.balance FROM accounts a WHERE a.balance > (SELECT AVG(balance) FROM accounts WHERE account_type = a.account_type) ORDER BY a.balance DESC;',
    ],
    sampleSolution: `SELECT a.account_number, a.customer_name, a.account_type, a.balance
FROM accounts a
WHERE a.balance > (SELECT AVG(balance) FROM accounts WHERE account_type = a.account_type)
ORDER BY a.balance DESC;`,
    solutionExplanation:
      'A correlated subquery depends on the outer query for its values—here, account_type = a.account_type. For every account evaluated by SQLite, the subquery calculates the dynamic average balance for that specific account tier (Savings, Checking, or Commercial) and returns only those accounts outperforming their peer group average.',
    initialSqlPlaceholder: `-- Mission 1: Correlated subquery for peer-group balance outliers
SELECT a.account_number, a.customer_name, a.account_type, a.balance
FROM accounts a
WHERE a.balance > (
  -- Correlated subquery computing AVG(balance) per account_type
  
)
ORDER BY a.balance DESC;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify correlated subquery identifying accounts above their account_type average balance',
        expectedQuery:
          'SELECT a.account_number, a.customer_name, a.account_type, a.balance FROM accounts a WHERE a.balance > (SELECT AVG(balance) FROM accounts WHERE account_type = a.account_type) ORDER BY a.balance DESC;',
        orderSensitive: true,
      },
    ],
    xpReward: 100,
    badge: {
      id: 'subquery_architect',
      title: 'Subquery Specialist',
      icon: 'Filter',
    },
  },
  {
    id: 'bk_m2',
    order: 2,
    title: 'Common Table Expressions (CTE): High-Value Account Transference',
    role: 'Core Banking Database Analyst',
    storyline:
      'Treasury VP Tanya needs a targeted compliance extract connecting institutional commercial accounts to their active transaction streams. To maintain readability and support downstream analytical queries, compliance standards require using a Common Table Expression (WITH clause) to filter tier-1 accounts (balance >= ₹10,000,000) before joining with transactions.',
    businessProblem:
      'Deeply nested subqueries and redundant join filters make compliance scripts difficult to audit and maintain. CTEs create modular, reusable temporary views that improve query clarity and operational debugging.',
    objective:
      'Define a CTE named "HighValueAccounts" that selects account_id, account_number, customer_name, and balance from accounts where balance >= 10000000.0. Then join HighValueAccounts hva with transactions t on hva.account_id = t.account_id to select hva.customer_name, hva.account_number, hva.balance, t.txn_type, and t.amount, ordered by t.amount DESC.',
    requiredOutcome:
      'A joined report of tier-1 institutional accounts and their transaction entries, sorted by transaction amount descending.',
    checklist: [
      'Define CTE: WITH HighValueAccounts AS (SELECT account_id, account_number, customer_name, balance FROM accounts WHERE balance >= 10000000.0)',
      'Join HighValueAccounts hva with transactions t ON hva.account_id = t.account_id',
      'SELECT hva.customer_name, hva.account_number, hva.balance, t.txn_type, t.amount',
      'ORDER BY t.amount DESC',
    ],
    sqlTopics: ['Common Table Expressions (CTE)', 'WITH Clause', 'INNER JOIN', 'Large Financial Thresholds', 'ORDER BY DESC'],
    hints: [
      'Use WITH HighValueAccounts AS (...) to define a temporary named result set, followed immediately by your SELECT query.',
      'Join the CTE (hva) with transactions (t) using ON hva.account_id = t.account_id, and order by t.amount DESC.',
      'WITH HighValueAccounts AS (SELECT account_id, account_number, customer_name, balance FROM accounts WHERE balance >= 10000000.0) SELECT hva.customer_name, hva.account_number, hva.balance, t.txn_type, t.amount FROM HighValueAccounts hva JOIN transactions t ON hva.account_id = t.account_id ORDER BY t.amount DESC;',
    ],
    sampleSolution: `WITH HighValueAccounts AS (
  SELECT account_id, account_number, customer_name, balance
  FROM accounts
  WHERE balance >= 10000000.0
)
SELECT hva.customer_name, hva.account_number, hva.balance, t.txn_type, t.amount
FROM HighValueAccounts hva
JOIN transactions t ON hva.account_id = t.account_id
ORDER BY t.amount DESC;`,
    solutionExplanation:
      'Common Table Expressions (CTEs) define clean temporary result sets before the main SELECT query runs. Here, HighValueAccounts encapsulates the ₹10M balance filter, allowing the main query to join directly against transactions cleanly.',
    initialSqlPlaceholder: `-- Mission 2: Common Table Expression for Tier-1 accounts
WITH HighValueAccounts AS (
  SELECT account_id, account_number, customer_name, balance
  FROM accounts
  WHERE balance >= 10000000.0
)
SELECT hva.customer_name, hva.account_number, hva.balance, t.txn_type, t.amount
FROM HighValueAccounts hva
JOIN transactions t ON hva.account_id = t.account_id
ORDER BY t.amount DESC;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify CTE query joining HighValueAccounts with transactions ordered by amount DESC',
        expectedQuery:
          'WITH HighValueAccounts AS (SELECT account_id, account_number, customer_name, balance FROM accounts WHERE balance >= 10000000.0) SELECT hva.customer_name, hva.account_number, hva.balance, t.txn_type, t.amount FROM HighValueAccounts hva JOIN transactions t ON hva.account_id = t.account_id ORDER BY t.amount DESC;',
        orderSensitive: true,
      },
    ],
    xpReward: 120,
    badge: {
      id: 'cte_pioneer',
      title: 'CTE Architect',
      icon: 'Layers',
    },
  },
  {
    id: 'bk_m3',
    order: 3,
    title: 'Window Functions: Cumulative Cash Flow with SUM() OVER',
    role: 'Core Banking Database Analyst',
    storyline:
      'Senior Risk Auditor Meenakshi needs to audit chronological cash turnover across all customer accounts. Collapsing records with a standard GROUP BY would lose the exact timeline of individual deposits and withdrawals. Instead, she requires an analytical window function that preserves all transaction rows while computing a running cumulative total per account.',
    businessProblem:
      'Traditional GROUP BY aggregation collapses individual events into aggregate totals, erasing the chronological transaction progression. Window functions allow analysts to calculate cumulative totals across time without sacrificing row-level audit details.',
    objective:
      'Select transaction_id, account_id, txn_type, amount, txn_timestamp, and compute SUM(amount) OVER (PARTITION BY account_id ORDER BY txn_timestamp) AS running_total from "transactions", ordered by account_id and txn_timestamp.',
    requiredOutcome:
      'A comprehensive transaction audit log showing the running cumulative sum of transaction amounts partitioned by account and ordered by timestamp.',
    checklist: [
      'SELECT transaction_id, account_id, txn_type, amount, txn_timestamp',
      'Compute SUM(amount) OVER (PARTITION BY account_id ORDER BY txn_timestamp) AS running_total',
      'FROM transactions',
      'ORDER BY account_id, txn_timestamp',
    ],
    sqlTopics: ['Window Functions', 'OVER Clause', 'PARTITION BY', 'Cumulative SUM()', 'Ledger Audit Trails'],
    hints: [
      'Window functions calculate values across a set of rows related to the current row without collapsing the output.',
      'Inside the OVER clause, use PARTITION BY account_id ORDER BY txn_timestamp to restart the running sum for each account.',
      'SELECT transaction_id, account_id, txn_type, amount, txn_timestamp, SUM(amount) OVER (PARTITION BY account_id ORDER BY txn_timestamp) AS running_total FROM transactions ORDER BY account_id, txn_timestamp;',
    ],
    sampleSolution: `SELECT transaction_id, account_id, txn_type, amount, txn_timestamp,
       SUM(amount) OVER (PARTITION BY account_id ORDER BY txn_timestamp) AS running_total
FROM transactions
ORDER BY account_id, txn_timestamp;`,
    solutionExplanation:
      'The SUM(amount) OVER (PARTITION BY account_id ORDER BY txn_timestamp) window function divides rows into independent partitions per account and calculates a cumulative sum chronologically up to each row, preserving every single transaction in the output.',
    initialSqlPlaceholder: `-- Mission 3: Cumulative running total per account using SUM() OVER
SELECT transaction_id, account_id, txn_type, amount, txn_timestamp,
       SUM(amount) OVER (PARTITION BY account_id ORDER BY txn_timestamp) AS running_total
FROM transactions
ORDER BY account_id, txn_timestamp;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify windowed running total partitioned by account_id ordered by txn_timestamp',
        expectedQuery:
          'SELECT transaction_id, account_id, txn_type, amount, txn_timestamp, SUM(amount) OVER (PARTITION BY account_id ORDER BY txn_timestamp) AS running_total FROM transactions ORDER BY account_id, txn_timestamp;',
        orderSensitive: true,
      },
    ],
    xpReward: 140,
    badge: {
      id: 'window_specialist',
      title: 'Window Function Specialist',
      icon: 'TrendingUp',
    },
  },
  {
    id: 'bk_m4',
    order: 4,
    title: 'Window Functions: Offset Audit with LAG() OVER',
    role: 'Core Banking Database Analyst',
    storyline:
      'The Automated Fraud Detection Unit is analyzing transaction patterns for rapid sequential debits and sudden volumetric surges. To evaluate volatility between consecutive events on the same account, Compliance Officer Devendra asks you to display the previous transaction amount alongside each transaction using the LAG() window function.',
    businessProblem:
      'Detecting sudden spikes or rapid consecutive transactions previously required complex, slow self-joins on timestamps. LAG() provides direct relational access to preceding row values within a partition.',
    objective:
      'Select transaction_id, account_id, txn_type, amount, txn_timestamp, and compute LAG(amount) OVER (PARTITION BY account_id ORDER BY txn_timestamp) AS prev_amount from "transactions", ordered by account_id and txn_timestamp.',
    requiredOutcome:
      "Each transaction displayed with the prior transaction amount for the same account (or NULL if it is the account's first recorded transaction).",
    checklist: [
      'SELECT transaction_id, account_id, txn_type, amount, txn_timestamp',
      'Compute LAG(amount) OVER (PARTITION BY account_id ORDER BY txn_timestamp) AS prev_amount',
      'FROM transactions',
      'ORDER BY account_id, txn_timestamp',
    ],
    sqlTopics: ['Window Functions', 'LAG() OVER', 'Offset Window Functions', 'Fraud Detection Auditing'],
    hints: [
      'LAG(column) accesses data from the preceding row within the defined partition window.',
      'Specify the window clause as OVER (PARTITION BY account_id ORDER BY txn_timestamp).',
      'SELECT transaction_id, account_id, txn_type, amount, txn_timestamp, LAG(amount) OVER (PARTITION BY account_id ORDER BY txn_timestamp) AS prev_amount FROM transactions ORDER BY account_id, txn_timestamp;',
    ],
    sampleSolution: `SELECT transaction_id, account_id, txn_type, amount, txn_timestamp,
       LAG(amount) OVER (PARTITION BY account_id ORDER BY txn_timestamp) AS prev_amount
FROM transactions
ORDER BY account_id, txn_timestamp;`,
    solutionExplanation:
      'The LAG(amount) OVER (PARTITION BY account_id ORDER BY txn_timestamp) analytical function evaluates each account partition chronologically and retrieves the amount from the previous row. If no prior transaction exists for an account, it returns NULL.',
    initialSqlPlaceholder: `-- Mission 4: Retrieve previous transaction amount using LAG() OVER
SELECT transaction_id, account_id, txn_type, amount, txn_timestamp,
       LAG(amount) OVER (PARTITION BY account_id ORDER BY txn_timestamp) AS prev_amount
FROM transactions
ORDER BY account_id, txn_timestamp;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify offset audit query using LAG() OVER partitioned by account_id',
        expectedQuery:
          'SELECT transaction_id, account_id, txn_type, amount, txn_timestamp, LAG(amount) OVER (PARTITION BY account_id ORDER BY txn_timestamp) AS prev_amount FROM transactions ORDER BY account_id, txn_timestamp;',
        orderSensitive: true,
      },
    ],
    xpReward: 160,
    badge: {
      id: 'offset_auditor',
      title: 'Offset Audit Specialist',
      icon: 'GitCommit',
    },
  },
  {
    id: 'bk_m5',
    order: 5,
    title: 'Window Functions: Partitioned Ranking with DENSE_RANK() OVER',
    role: 'Core Banking Database Analyst',
    storyline:
      'Managing Director Aditya is preparing executive reports for regional branch managers in Mumbai, New Delhi, and Bengaluru. Rather than an unpartitioned nationwide list, branch executives need a competitive ranking of customer accounts specifically within each branch based on balance descending, without gaps in ranking sequence.',
    businessProblem:
      'National-level rankings fail to give branch managers actionable visibility into their local high-net-worth customer tiers. Window ranking functions allow per-branch competitive stratification without subquery duplication.',
    objective:
      'Select account_number, customer_name, branch_id, balance, and compute DENSE_RANK() OVER (PARTITION BY branch_id ORDER BY balance DESC) AS branch_rank from "accounts", ordered by branch_id and branch_rank.',
    requiredOutcome:
      'A categorized customer ranking report where accounts are ranked from 1 to N within each branch based on ledger balance.',
    checklist: [
      'SELECT account_number, customer_name, branch_id, balance',
      'Compute DENSE_RANK() OVER (PARTITION BY branch_id ORDER BY balance DESC) AS branch_rank',
      'FROM accounts',
      'ORDER BY branch_id, branch_rank',
    ],
    sqlTopics: ['Window Functions', 'DENSE_RANK() OVER', 'Partitioned Ranking', 'Executive Branch Reporting'],
    hints: [
      'DENSE_RANK() assigns consecutive rankings (1, 2, 3...) based on the ORDER BY clause inside the window specification.',
      'Partition by branch_id so that ranking resets to 1 for every individual branch location.',
      'SELECT account_number, customer_name, branch_id, balance, DENSE_RANK() OVER (PARTITION BY branch_id ORDER BY balance DESC) AS branch_rank FROM accounts ORDER BY branch_id, branch_rank;',
    ],
    sampleSolution: `SELECT account_number, customer_name, branch_id, balance,
       DENSE_RANK() OVER (PARTITION BY branch_id ORDER BY balance DESC) AS branch_rank
FROM accounts
ORDER BY branch_id, branch_rank;`,
    solutionExplanation:
      'The DENSE_RANK() OVER (PARTITION BY branch_id ORDER BY balance DESC) window function groups accounts by branch_id, ranks accounts in descending order of balance within each branch, and ensures rank numbers increase without gaps.',
    initialSqlPlaceholder: `-- Mission 5: Partitioned account ranking using DENSE_RANK() OVER
SELECT account_number, customer_name, branch_id, balance,
       DENSE_RANK() OVER (PARTITION BY branch_id ORDER BY balance DESC) AS branch_rank
FROM accounts
ORDER BY branch_id, branch_rank;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify partitioned branch ranking query using DENSE_RANK() OVER',
        expectedQuery:
          'SELECT account_number, customer_name, branch_id, balance, DENSE_RANK() OVER (PARTITION BY branch_id ORDER BY balance DESC) AS branch_rank FROM accounts ORDER BY branch_id, branch_rank;',
        orderSensitive: true,
      },
    ],
    xpReward: 180,
    badge: {
      id: 'ranking_expert',
      title: 'Ranking Authority',
      icon: 'Award',
    },
  },
  {
    id: 'bk_m6',
    order: 6,
    title: 'ACID Transactions: Atomic Funds Transfer',
    role: 'Core Banking Database Analyst',
    storyline:
      'Customer Aarav Malhotra (account_id = 2) has initiated an urgent inter-account funds transfer of ₹50,000 to Simran Khurana (account_id = 4). In core banking ledgers, debiting the source account, crediting the destination account, and inserting the transaction audit log must occur as a single indivisible unit of work. Chief Compliance Officer Devendra requires you to execute this multi-statement operation within an ACID transaction block.',
    businessProblem:
      'If a database crash or network disconnect occurs after the debit but before the credit, ₹50,000 would vanish from the ledger, violating fundamental double-entry balance sheet integrity. ACID transactions guarantee atomicity (all-or-nothing execution).',
    objective:
      'Execute an atomic funds transfer wrapped in a transaction:\nBEGIN TRANSACTION;\nUPDATE accounts SET balance = balance - 50000.0 WHERE account_id = 2;\nUPDATE accounts SET balance = balance + 50000.0 WHERE account_id = 4;\nINSERT INTO transactions (account_id, txn_type, amount, txn_timestamp, channel) VALUES (2, \'TRANSFER\', 50000.0, \'2026-11-16 16:00:00\', \'Internal Transfer\');\nCOMMIT;',
    requiredOutcome:
      'Account 2 debited to 800000.0, Account 4 credited to 195000.0, and an internal transfer audit record inserted into transactions, all committed atomically.',
    checklist: [
      'Start the atomic block with BEGIN TRANSACTION;',
      'UPDATE accounts SET balance = balance - 50000.0 WHERE account_id = 2;',
      'UPDATE accounts SET balance = balance + 50000.0 WHERE account_id = 4;',
      'INSERT INTO transactions (account_id, txn_type, amount, txn_timestamp, channel) VALUES (2, \'TRANSFER\', 50000.0, \'2026-11-16 16:00:00\', \'Internal Transfer\');',
      'Seal and persist changes with COMMIT;',
    ],
    sqlTopics: ['ACID Transactions', 'BEGIN TRANSACTION', 'COMMIT', 'Atomic Funds Transfer', 'Ledger Integrity'],
    hints: [
      'Enclose multiple UPDATE and INSERT statements between BEGIN TRANSACTION; and COMMIT; to guarantee atomicity.',
      'Debit Account 2 by 50000.0, credit Account 4 by 50000.0, and insert the TRANSFER transaction for Account 2.',
      `BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 50000.0 WHERE account_id = 2;
UPDATE accounts SET balance = balance + 50000.0 WHERE account_id = 4;
INSERT INTO transactions (account_id, txn_type, amount, txn_timestamp, channel) VALUES (2, 'TRANSFER', 50000.0, '2026-11-16 16:00:00', 'Internal Transfer');
COMMIT;`,
    ],
    sampleSolution: `BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 50000.0 WHERE account_id = 2;
UPDATE accounts SET balance = balance + 50000.0 WHERE account_id = 4;
INSERT INTO transactions (account_id, txn_type, amount, txn_timestamp, channel)
VALUES (2, 'TRANSFER', 50000.0, '2026-11-16 16:00:00', 'Internal Transfer');
COMMIT;`,
    solutionExplanation:
      'ACID transactions (Atomicity, Consistency, Isolation, Durability) ensure that all constituent statements either succeed together or leave the database completely unchanged upon failure. Wrapping the debit, credit, and journal log in a transaction protects against partial updates.',
    initialSqlPlaceholder: `-- Mission 6: Atomic funds transfer between Account 2 and Account 4
BEGIN TRANSACTION;

-- 1. Debit ₹50,000 from Account 2
UPDATE accounts SET balance = balance - 50000.0 WHERE account_id = 2;

-- 2. Credit ₹50,000 to Account 4
UPDATE accounts SET balance = balance + 50000.0 WHERE account_id = 4;

-- 3. Log internal transfer transaction record
INSERT INTO transactions (account_id, txn_type, amount, txn_timestamp, channel)
VALUES (2, 'TRANSFER', 50000.0, '2026-11-16 16:00:00', 'Internal Transfer');

COMMIT;`,
    validationRules: [
      {
        type: 'ROW_EXISTS',
        description: 'Verify Account 2 balance debited by 50,000 (balance = 800000.0)',
        expectedTable: 'accounts',
        expectedWhereClause: 'account_id = 2 AND balance = 800000.0',
        expectedRowCount: 1,
      },
      {
        type: 'ROW_EXISTS',
        description: 'Verify Account 4 balance credited by 50,000 (balance = 195000.0)',
        expectedTable: 'accounts',
        expectedWhereClause: 'account_id = 4 AND balance = 195000.0',
        expectedRowCount: 1,
      },
      {
        type: 'ROW_EXISTS',
        description: 'Verify transfer transaction record inserted with channel "Internal Transfer"',
        expectedTable: 'transactions',
        expectedWhereClause:
          "account_id = 2 AND txn_type = 'TRANSFER' AND amount = 50000.0 AND channel = 'Internal Transfer'",
        expectedRowCount: 1,
      },
    ],
    xpReward: 250,
    badge: {
      id: 'acid_master',
      title: 'ACID Transaction Master',
      icon: 'ShieldCheck',
    },
  },
];
