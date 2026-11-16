import { WorldDefinition } from '../../../types/world';
import { BANK_BASE_SCHEMA } from './schema';
import { BANK_INITIAL_DATASET } from './dataset';
import { BANK_MISSIONS } from './missions';

export const bankWorld: WorldDefinition = {
  id: 'bank',
  name: 'Bank Operations',
  industry: 'Banking & Financial Services',
  tagline: 'Audit ledger balances, execute atomic money transfers, and flag suspicious transactions.',
  description:
    'Join a premier commercial bank. Master transaction integrity, investigate high-risk cash movements, and audit branch deposit liquidity.',
  thumbnailUrl: '/images/bank-world.jpg',
  storyIntro: {
    roleTitle: 'Core Banking Database Analyst',
    organization: 'Apex National Trust',
    background:
      'Apex National Trust processes millions in financial transfers. Financial integrity demands absolute consistency through atomic SQL transactions.',
    keyResponsibilities: [
      'Audit high-value wire transfers and investigate liquidity accounts',
      'Detect anomalous cash spikes and duplicate fund transfer requests',
      'Generate branch compliance audit balance sheets',
    ],
  },
  difficulty: 'Advanced',
  estimatedTime: '75 mins',
  iconName: 'Landmark',
  accentColor: 'indigo',
  dbFileName: 'bank.db',
  sqlTopics: ['CREATE TABLE', 'INSERT', 'SELECT', 'WHERE', 'UPDATE', 'JOIN', 'GROUP BY', 'Aggregation'],
  isAvailable: true,
  missions: BANK_MISSIONS,
  initialSchemaSql: BANK_BASE_SCHEMA,
  initialDatasetSql: BANK_INITIAL_DATASET,
  reportConfig: {
    title: 'Apex National Trust — Executive Treasury & Compliance Audit',
    subtitle: 'Generated dynamically from live SQLite relational database records',
    executiveSummaryTemplate:
      'This comprehensive compliance audit tracks customer deposit liabilities, liquid branch reserves, and high-value wire transfers across the banking network.',
    metrics: [
      {
        id: 'total_deposits',
        title: 'Total Depositor Liabilities',
        query: 'SELECT printf("₹%,d", CAST(SUM(balance) AS INTEGER)) AS total_dep FROM accounts;',
        description: 'Aggregate customer balances across all accounts.',
        type: 'stat',
        valueKey: 'total_dep',
      },
      {
        id: 'total_vault_cash',
        title: 'Total Branch Vault Reserves',
        query: 'SELECT printf("₹%,d", CAST(SUM(vault_cash) AS INTEGER)) AS total_vault FROM branches;',
        description: 'Physical currency reserves held across bank branches.',
        type: 'stat',
        valueKey: 'total_vault',
      },
      {
        id: 'large_withdrawals_count',
        title: 'High-Value Cash Flags (>= ₹50k)',
        query:
          'SELECT COUNT(*) AS flag_count FROM transactions WHERE txn_type = "WITHDRAWAL" AND amount >= 50000;',
        description: 'Large cash debits requiring AML compliance monitoring.',
        type: 'stat',
        valueKey: 'flag_count',
      },
      {
        id: 'deposits_by_branch',
        title: 'Deposit Liabilities by Branch',
        query:
          'SELECT b.branch_name, SUM(a.balance) as deposits FROM branches b JOIN accounts a ON b.branch_id = a.branch_id GROUP BY b.branch_name ORDER BY deposits DESC;',
        description: 'Branch liquidity and customer deposit distribution.',
        type: 'bar_chart',
        labelKey: 'branch_name',
        valueKey: 'deposits',
      },
      {
        id: 'large_wires_table',
        title: 'Major Commercial Wire Transfers (>= ₹1M)',
        query:
          'SELECT a.customer_name, a.account_number, t.amount, t.channel, t.txn_timestamp FROM accounts a JOIN transactions t ON a.account_id = t.account_id WHERE t.amount >= 1000000.0 ORDER BY t.amount DESC;',
        description: 'High-volume inter-bank transaction records.',
        type: 'table',
      },
      {
        id: 'branch_summary_table',
        title: 'Branch Summary & Account Volume',
        query:
          'SELECT b.branch_name, b.city, COUNT(a.account_id) AS total_accounts, SUM(a.balance) AS total_deposits FROM branches b JOIN accounts a ON b.branch_id = a.branch_id GROUP BY b.branch_name, b.city ORDER BY total_deposits DESC;',
        description: 'Consolidated branch performance and depositor counts.',
        type: 'table',
      },
    ],
  },
};
