import { Mission } from '../../../types/mission';

export const WAREHOUSE_MISSIONS: Mission[] = [
  {
    id: 'wh_m1',
    order: 1,
    title: 'Deploy Cold Chain Temperature Log Schema',
    role: 'Logistics Data Specialist',
    storyline:
      'Welcome to Apex Global Logistics Hub! With thousands of perishable food pallets stored in Zone C, regulatory compliance requires automated temperature logging. Lead Operations Manager Rajesh asks you to build the temperature log schema.',
    businessProblem:
      'Perishable products spoil if temperature spikes exceed -18°C. Without a dedicated database table, IoT sensors cannot commit live temperature readings.',
    objective:
      'Create a table named "temperature_logs" with log_id (INTEGER PRIMARY KEY AUTOINCREMENT), zone_id (INTEGER NOT NULL), recorded_temp (REAL NOT NULL), recorded_at (TEXT NOT NULL), and is_alert (INTEGER DEFAULT 0).',
    requiredOutcome:
      'A new temperature_logs table ready to store IoT sensor telemetry for cold chain audits.',
    checklist: [
      'Use CREATE TABLE temperature_logs',
      'Define log_id INTEGER PRIMARY KEY AUTOINCREMENT',
      'Include zone_id INTEGER NOT NULL',
      'Include recorded_temp REAL NOT NULL',
      'Include recorded_at TEXT NOT NULL',
      'Include is_alert INTEGER DEFAULT 0',
    ],
    sqlTopics: ['CREATE TABLE', 'PRIMARY KEY', 'DEFAULT constraints', 'REAL types'],
    hints: [
      'Use CREATE TABLE temperature_logs (...) with appropriate column types.',
      'Specify is_alert INTEGER DEFAULT 0 for binary alert flags.',
      'CREATE TABLE temperature_logs (\n  log_id INTEGER PRIMARY KEY AUTOINCREMENT,\n  zone_id INTEGER NOT NULL,\n  recorded_temp REAL NOT NULL,\n  recorded_at TEXT NOT NULL,\n  is_alert INTEGER DEFAULT 0\n);',
    ],
    sampleSolution: `CREATE TABLE temperature_logs (
  log_id INTEGER PRIMARY KEY AUTOINCREMENT,
  zone_id INTEGER NOT NULL,
  recorded_temp REAL NOT NULL,
  recorded_at TEXT NOT NULL,
  is_alert INTEGER DEFAULT 0
);`,
    solutionExplanation:
      'Deploying explicit telemetry logging tables prevents food spoilage lawsuits and guarantees adherence to international ISO cold-chain logistics standards.',
    initialSqlPlaceholder: `-- Mission 1: Create cold chain temperature log table\nCREATE TABLE temperature_logs (\n  \n);`,
    validationRules: [
      {
        type: 'TABLE_EXISTS',
        description: 'Verify temperature_logs table exists with required columns',
        expectedTable: 'temperature_logs',
        expectedColumns: [
          'log_id',
          'zone_id',
          'recorded_temp',
          'recorded_at',
          'is_alert',
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
    id: 'wh_m2',
    order: 2,
    title: 'Catalog Inbound Precision Tooling SKU',
    role: 'Logistics Data Specialist',
    storyline:
      'A new supplier shipment of precision industrial tools has arrived at Bay 4. Inventory Controller Sunita needs this item cataloged before bin slotting begins.',
    businessProblem:
      'Warehouse pickers cannot generate barcode labels or allocate bin rack space until new SKUs exist in the master product catalog.',
    objective:
      'Insert a new row into "products" with: product_id = 7, sku = "SKU-TOOL-407", product_name = "Laser Leveling Transit Kit", category = "Tools", and unit_weight_kg = 3.8.',
    requiredOutcome:
      'New tooling SKU added to products table with SKU code SKU-TOOL-407.',
    checklist: [
      'Use INSERT INTO products (...)',
      'Specify product_id, sku, product_name, category, unit_weight_kg',
      'Enclose text values in single quotes',
    ],
    sqlTopics: ['INSERT INTO', 'Product Cataloging', 'SKU Management'],
    hints: [
      'Use INSERT INTO products (product_id, sku, product_name, category, unit_weight_kg) VALUES (...);',
      'Ensure string values like \'SKU-TOOL-407\' are quoted.',
      "INSERT INTO products (product_id, sku, product_name, category, unit_weight_kg) VALUES (7, 'SKU-TOOL-407', 'Laser Leveling Transit Kit', 'Tools', 3.8);",
    ],
    sampleSolution: `INSERT INTO products (product_id, sku, product_name, category, unit_weight_kg)
VALUES (7, 'SKU-TOOL-407', 'Laser Leveling Transit Kit', 'Tools', 3.8);`,
    solutionExplanation:
      'Cataloging SKUs accurately ensures weight capacities are computed correctly for forklift rack placements and pallet staging.',
    initialSqlPlaceholder: `-- Mission 2: Register SKU-TOOL-407 into products\nINSERT INTO products (\n  product_id, sku, product_name, category, unit_weight_kg\n) VALUES (\n  \n);`,
    validationRules: [
      {
        type: 'ROW_EXISTS',
        description: 'Verify SKU-TOOL-407 is inserted into products',
        expectedTable: 'products',
        expectedWhereClause: "sku = 'SKU-TOOL-407' AND product_name LIKE '%Laser%'",
        expectedRowCount: 1,
      },
    ],
    xpReward: 120,
    badge: {
      id: 'cargo_supervisor',
      title: 'Cargo Slotting Specialist',
      icon: 'Boxes',
    },
  },
  {
    id: 'wh_m3',
    order: 3,
    title: 'Audit Overcapacity Inventory Bins',
    role: 'Logistics Data Specialist',
    storyline:
      'Forklift drivers report tight clearance in Zone A and Zone C. Warehouse Safety Supervisor Arun asks for a list of bins that have reached or exceeded 100% capacity.',
    businessProblem:
      'Overfilled storage bins risk structural rack collapse and worker injuries during automated picking cycles.',
    objective:
      'Select bin_code, quantity, and max_capacity from "inventory_bins" where quantity >= max_capacity.',
    requiredOutcome:
      'A report of all saturated storage bins where quantity meets or exceeds max_capacity.',
    checklist: [
      'SELECT bin_code, quantity, max_capacity',
      'FROM inventory_bins',
      'WHERE quantity >= max_capacity',
    ],
    sqlTopics: ['SELECT', 'Comparison Operators (>=)', 'Capacity Audits'],
    hints: [
      'Use SELECT bin_code, quantity, max_capacity FROM inventory_bins WHERE ...;',
      'Filter with quantity >= max_capacity.',
      'SELECT bin_code, quantity, max_capacity FROM inventory_bins WHERE quantity >= max_capacity;',
    ],
    sampleSolution: `SELECT bin_code, quantity, max_capacity
FROM inventory_bins
WHERE quantity >= max_capacity;`,
    solutionExplanation:
      'Evaluating inventory thresholds with comparison operators flags hazardous overstocking conditions before physical pallet damage occurs.',
    initialSqlPlaceholder: `-- Mission 3: Query overcapacity bins\nSELECT bin_code, quantity, max_capacity\nFROM inventory_bins\nWHERE ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify overcapacity storage bin results',
        expectedQuery:
          'SELECT bin_code, quantity, max_capacity FROM inventory_bins WHERE quantity >= max_capacity;',
      },
    ],
    xpReward: 130,
  },
  {
    id: 'wh_m4',
    order: 4,
    title: 'Dispatch Outbound Staged Freight',
    role: 'Logistics Data Specialist',
    storyline:
      'BlueDart Express has finished loading 12 pallets for the Bengaluru distribution run (tracking APX-9041). The dock supervisor signs the bill of lading and needs the status updated to In Transit.',
    businessProblem:
      'Real-time shipment tracking requires immediate database status transitions so downstream fulfillment centers can schedule forklift receiving crews.',
    objective:
      'Update "shipments" to set status = "In Transit" for the shipment with tracking_number = "APX-9041".',
    requiredOutcome:
      'Shipment APX-9041 updated to In Transit status.',
    checklist: [
      'Use UPDATE shipments',
      'SET status = \'In Transit\'',
      'WHERE tracking_number = \'APX-9041\'',
    ],
    sqlTopics: ['UPDATE', 'Status Transitions', 'Logistics Dispatch'],
    hints: [
      'Syntax: UPDATE shipments SET status = \'In Transit\' WHERE condition;',
      'Specify tracking_number = \'APX-9041\'.',
      "UPDATE shipments SET status = 'In Transit' WHERE tracking_number = 'APX-9041';",
    ],
    sampleSolution: `UPDATE shipments
SET status = 'In Transit'
WHERE tracking_number = 'APX-9041';`,
    solutionExplanation:
      'Targeted UPDATE operations maintain synchronization between dock floor operations and enterprise supply chain portals.',
    initialSqlPlaceholder: `-- Mission 4: Dispatch APX-9041 to In Transit\nUPDATE shipments\nSET status = '...'\nWHERE tracking_number = '...';`,
    validationRules: [
      {
        type: 'ROW_EXISTS',
        description: 'Verify APX-9041 status is In Transit',
        expectedTable: 'shipments',
        expectedWhereClause: "tracking_number = 'APX-9041' AND status = 'In Transit'",
        expectedRowCount: 1,
      },
    ],
    xpReward: 140,
  },
  {
    id: 'wh_m5',
    order: 5,
    title: 'Cross-Reference Perishable Cold Chain Inventory',
    role: 'Logistics Data Specialist',
    storyline:
      'Quality Control needs a full audit of all temperature-controlled inventory. You must connect product catalog SKUs with their active bin storage location and zone descriptions.',
    businessProblem:
      'Auditors need to verify that perishable dairy and fruit purees are correctly stored in cold chain vaults (temp_controlled = 1) rather than ambient dry bays.',
    objective:
      'Join "products", "inventory_bins", and "zones". Select p.sku, p.product_name, b.bin_code, b.quantity, and z.zone_name for all zones where temp_controlled = 1. Order by b.quantity descending.',
    requiredOutcome:
      'A joined table displaying perishable inventory in cold zones, sorted highest quantity first.',
    checklist: [
      'JOIN products p -> inventory_bins b ON p.product_id = b.product_id',
      'JOIN zones z ON b.zone_id = z.zone_id',
      'SELECT p.sku, p.product_name, b.bin_code, b.quantity, z.zone_name',
      'WHERE z.temp_controlled = 1',
      'ORDER BY b.quantity DESC',
    ],
    sqlTopics: ['Multi-table JOIN', 'Filtering boolean flags', 'ORDER BY DESC'],
    hints: [
      'Chain the joins: products p JOIN inventory_bins b ON ... JOIN zones z ON ...',
      'Filter with z.temp_controlled = 1 and order by b.quantity DESC.',
      'SELECT p.sku, p.product_name, b.bin_code, b.quantity, z.zone_name FROM products p JOIN inventory_bins b ON p.product_id = b.product_id JOIN zones z ON b.zone_id = z.zone_id WHERE z.temp_controlled = 1 ORDER BY b.quantity DESC;',
    ],
    sampleSolution: `SELECT p.sku, p.product_name, b.bin_code, b.quantity, z.zone_name
FROM products p
JOIN inventory_bins b ON p.product_id = b.product_id
JOIN zones z ON b.zone_id = z.zone_id
WHERE z.temp_controlled = 1
ORDER BY b.quantity DESC;`,
    solutionExplanation:
      'Multi-table relational queries link abstract product specifications with physical warehouse geography to enforce strict quality control standards.',
    initialSqlPlaceholder: `-- Mission 5: Join products, inventory_bins, and zones for cold storage\nSELECT p.sku, p.product_name, b.bin_code, b.quantity, z.zone_name\nFROM products p\nJOIN inventory_bins b ON ...\nJOIN zones z ON ...\nWHERE z.temp_controlled = 1\nORDER BY ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify cold storage inventory query',
        orderSensitive: true,
        expectedQuery:
          'SELECT p.sku, p.product_name, b.bin_code, b.quantity, z.zone_name FROM products p JOIN inventory_bins b ON p.product_id = b.product_id JOIN zones z ON b.zone_id = z.zone_id WHERE z.temp_controlled = 1 ORDER BY b.quantity DESC;',
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
    id: 'wh_m6',
    order: 6,
    title: 'Audit Carrier Freight Dispatch Volume',
    role: 'Logistics Data Specialist',
    storyline:
      'VP of Logistics Priya is negotiating annual contract tariffs with commercial freight carriers. She requires a consolidated audit showing total shipments and total pallets handled by high-volume carriers (total_pallets > 15).',
    businessProblem:
      'Carrier volume discounts require aggregated historical shipping manifests grouped by commercial carrier.',
    objective:
      'Group "shipments" by carrier. Select carrier, COUNT(shipment_id) AS total_shipments, and SUM(pallet_count) AS total_pallets. Filter for total_pallets > 15 using HAVING and order by total_pallets descending.',
    requiredOutcome:
      'An aggregated carrier scorecard for high-volume freight lines (total_pallets > 15).',
    checklist: [
      'SELECT carrier, COUNT(shipment_id) AS total_shipments, SUM(pallet_count) AS total_pallets',
      'FROM shipments',
      'GROUP BY carrier',
      'HAVING total_pallets > 15',
      'ORDER BY total_pallets DESC',
    ],
    sqlTopics: ['GROUP BY', 'SUM / COUNT', 'HAVING clause', 'ORDER BY DESC'],
    hints: [
      'Compute COUNT(shipment_id) AS total_shipments and SUM(pallet_count) AS total_pallets.',
      'Filter aggregate results with HAVING total_pallets > 15 and order by total_pallets DESC.',
      'SELECT carrier, COUNT(shipment_id) AS total_shipments, SUM(pallet_count) AS total_pallets FROM shipments GROUP BY carrier HAVING total_pallets > 15 ORDER BY total_pallets DESC;',
    ],
    sampleSolution: `SELECT carrier, COUNT(shipment_id) AS total_shipments, SUM(pallet_count) AS total_pallets
FROM shipments
GROUP BY carrier
HAVING total_pallets > 15
ORDER BY total_pallets DESC;`,
    solutionExplanation:
      'Applying GROUP BY and HAVING filters across shipment freight tables enables enterprise procurement teams to leverage volume freight discounts.',
    initialSqlPlaceholder: `-- Mission 6: Carrier freight volume summary\nSELECT carrier, COUNT(shipment_id) AS total_shipments, SUM(pallet_count) AS total_pallets\nFROM shipments\nGROUP BY ...\nHAVING total_pallets > 15\nORDER BY ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify carrier freight volume aggregation',
        orderSensitive: true,
        expectedQuery:
          'SELECT carrier, COUNT(shipment_id) AS total_shipments, SUM(pallet_count) AS total_pallets FROM shipments GROUP BY carrier HAVING total_pallets > 15 ORDER BY total_pallets DESC;',
      },
    ],
    xpReward: 250,
    badge: {
      id: 'warehouse_master',
      title: 'Warehouse Logistics Certified',
      icon: 'Award',
    },
  },
];
