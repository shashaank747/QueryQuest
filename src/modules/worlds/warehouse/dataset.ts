/**
 * World 3: Warehouse Management
 * Seed dataset
 */

export const WAREHOUSE_INITIAL_DATASET = `
-- Warehouses Seed Data
INSERT INTO warehouses (warehouse_id, warehouse_name, location, total_bays) VALUES
  (1, 'Apex Central Logistics Hub', 'Sector 18, Gurugram', 40),
  (2, 'Apex Western Distribution Center', 'Bhiwandi, Mumbai', 60);

-- Zones Seed Data
INSERT INTO zones (zone_id, warehouse_id, zone_name, temp_controlled) VALUES
  (1, 1, 'Zone A - Bulk Storage', 0),
  (2, 1, 'Zone B - High-Density Racks', 0),
  (3, 1, 'Zone C - Cold Chain Vault', 1),
  (4, 2, 'Zone D - Cross-Dock Bay', 0);

-- Products Seed Data
INSERT INTO products (product_id, sku, product_name, category, unit_weight_kg) VALUES
  (1, 'SKU-ELEC-101', 'Industrial Power Inverter 5kVA', 'Electronics', 18.5),
  (2, 'SKU-AUTO-202', 'Hydraulic Brake Rotor Kit', 'Automotive', 12.0),
  (3, 'SKU-FOOD-303', 'Organic Frozen Berry Puree 10kg', 'Perishables', 10.0),
  (4, 'SKU-FOOD-304', 'Pasteurized Dairy Cream Tub 5L', 'Perishables', 5.2),
  (5, 'SKU-TOOL-405', 'Heavy-Duty Pneumatic Nail Gun', 'Tools', 4.5),
  (6, 'SKU-PACK-506', 'Corrugated Shipping Box Pack (100)', 'Packaging', 15.0);

-- Inventory Bins Seed Data
INSERT INTO inventory_bins (bin_id, bin_code, zone_id, product_id, quantity, max_capacity) VALUES
  (1, 'BIN-A-01', 1, 1, 45, 50),
  (2, 'BIN-A-02', 1, 2, 80, 80),
  (3, 'BIN-B-01', 2, 5, 120, 150),
  (4, 'BIN-B-02', 2, 6, 200, 200),
  (5, 'BIN-C-01', 3, 3, 60, 60),
  (6, 'BIN-C-02', 3, 4, 35, 50),
  (7, 'BIN-D-01', 4, 1, 15, 40);

-- Shipments Seed Data
INSERT INTO shipments (shipment_id, tracking_number, destination, carrier, status, pallet_count, dispatch_date) VALUES
  (1, 'APX-9041', 'Bengaluru Fulfillment Center', 'BlueDart Express', 'Staged', 12, '2026-11-16'),
  (2, 'APX-9042', 'Hyderabad Regional Depot', 'Delhivery Freight', 'In Transit', 18, '2026-11-15'),
  (3, 'APX-9043', 'Pune Metro Distribution', 'BlueDart Express', 'Delivered', 8, '2026-11-14'),
  (4, 'APX-9044', 'Chennai Harbor Terminal', 'TCI Freight', 'Staged', 24, '2026-11-16'),
  (5, 'APX-9045', 'Ahmedabad Logistics Park', 'Delhivery Freight', 'In Transit', 15, '2026-11-15'),
  (6, 'APX-9046', 'Kolkata Port Depot', 'TCI Freight', 'In Transit', 20, '2026-11-14');
`;
