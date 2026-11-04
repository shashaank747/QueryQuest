/**
 * World 1: Supermarket Operations
 * Base schema definition
 */

export const SUPERMARKET_BASE_SCHEMA = `
-- World 1: Supermarket Baseline Schema

CREATE TABLE IF NOT EXISTS suppliers (
  supplier_id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
  customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  membership_level TEXT DEFAULT 'Standard',
  loyalty_points INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS employees (
  employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL,
  salary INTEGER NOT NULL,
  hire_date TEXT NOT NULL
);
`;

