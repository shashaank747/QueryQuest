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
`;

