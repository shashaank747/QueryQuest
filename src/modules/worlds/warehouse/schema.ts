/**
 * World 3: Warehouse Management
 * Base schema definition
 */

export const WAREHOUSE_BASE_SCHEMA = `
-- World 3: Warehouse Management Baseline Schema

CREATE TABLE IF NOT EXISTS warehouses (
  warehouse_id INTEGER PRIMARY KEY AUTOINCREMENT,
  warehouse_name TEXT NOT NULL,
  location TEXT NOT NULL,
  total_bays INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS zones (
  zone_id INTEGER PRIMARY KEY AUTOINCREMENT,
  warehouse_id INTEGER NOT NULL,
  zone_name TEXT NOT NULL,
  temp_controlled INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id)
);

CREATE TABLE IF NOT EXISTS products (
  product_id INTEGER PRIMARY KEY AUTOINCREMENT,
  sku TEXT NOT NULL UNIQUE,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit_weight_kg REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory_bins (
  bin_id INTEGER PRIMARY KEY AUTOINCREMENT,
  bin_code TEXT NOT NULL UNIQUE,
  zone_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  max_capacity INTEGER NOT NULL,
  FOREIGN KEY (zone_id) REFERENCES zones(zone_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE IF NOT EXISTS shipments (
  shipment_id INTEGER PRIMARY KEY AUTOINCREMENT,
  tracking_number TEXT NOT NULL UNIQUE,
  destination TEXT NOT NULL,
  carrier TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Staged',
  pallet_count INTEGER NOT NULL,
  dispatch_date TEXT NOT NULL
);
`;
