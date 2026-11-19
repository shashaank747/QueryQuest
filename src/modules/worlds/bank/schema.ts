/**
 * World 5: Bank Operations
 * Base schema definition
 */

export const BANK_BASE_SCHEMA = `
-- World 5: Bank Operations Baseline Schema

CREATE TABLE IF NOT EXISTS branches (
  branch_id INTEGER PRIMARY KEY AUTOINCREMENT,
  branch_name TEXT NOT NULL,
  city TEXT NOT NULL,
  vault_cash REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts (
  account_id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  balance REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  branch_id INTEGER NOT NULL,
  FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
);

CREATE TABLE IF NOT EXISTS transactions (
  transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  txn_type TEXT NOT NULL,
  amount REAL NOT NULL,
  txn_timestamp TEXT NOT NULL,
  channel TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);
`;
