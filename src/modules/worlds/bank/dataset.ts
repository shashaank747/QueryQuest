/**
 * World 5: Bank Operations
 * Seed dataset
 */

export const BANK_INITIAL_DATASET = `
-- Branches Seed Data
INSERT INTO branches (branch_id, branch_name, city, vault_cash) VALUES
  (1, 'Financial District Flagship', 'Mumbai', 45000000.0),
  (2, 'Connaught Place Central', 'New Delhi', 32000000.0),
  (3, 'Brigade Road Tech Hub', 'Bengaluru', 28000000.0);

-- Accounts Seed Data
INSERT INTO accounts (account_id, account_number, customer_name, account_type, balance, status, branch_id) VALUES
  (1, 'ACC-MUM-1001', 'Reliance Logistics Corp', 'Commercial', 14500000.0, 'Active', 1),
  (2, 'ACC-MUM-1002', 'Aarav Malhotra', 'Savings', 850000.0, 'Active', 1),
  (3, 'ACC-DEL-2001', 'Oberoi Hospitality Group', 'Commercial', 8200000.0, 'Active', 2),
  (4, 'ACC-DEL-2002', 'Simran Khurana', 'Checking', 145000.0, 'Active', 2),
  (5, 'ACC-BLR-3001', 'Zephyr Technologies LLP', 'Commercial', 22400000.0, 'Active', 3),
  (6, 'ACC-BLR-3002', 'Naveen Deshmukh', 'Savings', 420000.0, 'Active', 3),
  (7, 'ACC-MUM-1003', 'Karan Johar Enterprises', 'Commercial', 34000000.0, 'Active', 1);

-- Transactions Seed Data
INSERT INTO transactions (transaction_id, account_id, txn_type, amount, txn_timestamp, channel) VALUES
  (1, 1, 'DEPOSIT', 500000.0, '2026-11-16 09:15:00', 'Wire Transfer'),
  (2, 2, 'WITHDRAWAL', 75000.0, '2026-11-16 10:20:00', 'Branch Counter'),
  (3, 3, 'DEPOSIT', 1200000.0, '2026-11-16 11:05:00', 'ACH Electronic'),
  (4, 4, 'WITHDRAWAL', 60000.0, '2026-11-16 11:45:00', 'ATM Terminal'),
  (5, 5, 'TRANSFER', 3500000.0, '2026-11-16 12:30:00', 'RTGS Portal'),
  (6, 6, 'WITHDRAWAL', 15000.0, '2026-11-16 13:10:00', 'ATM Terminal'),
  (7, 7, 'DEPOSIT', 4500000.0, '2026-11-16 14:00:00', 'Wire Transfer'),
  (8, 2, 'WITHDRAWAL', 120000.0, '2026-11-16 14:45:00', 'Branch Counter');

-- Cards Seed Data
INSERT INTO cards (card_id, account_id, card_number, card_type, is_active) VALUES
  (1, 2, '4532-8812-9901-3321', 'Debit Platinum', 1),
  (2, 4, '5421-1190-4432-8765', 'Credit Signature', 1),
  (3, 6, '4111-9988-2345-6712', 'Debit Gold', 1);

-- Audit Logs Seed Data
INSERT INTO audit_logs (log_id, event_type, description, created_at) VALUES
  (1, 'VAULT_VERIFICATION', 'Daily start-of-day vault physical count reconciled.', '2026-11-16 08:30:00'),
  (2, 'SECURITY_SCAN', 'RTGS gateway TLS cryptographic verification passed.', '2026-11-16 09:00:00');
`;
