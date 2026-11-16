import { Mission } from '../../../types/mission';

export const WAREHOUSE_MISSIONS: Mission[] = [
  {
    id: 'wh_m1',
    order: 1,
    title: 'First Discovery of Relational INNER JOIN',
    role: 'Logistics Data Specialist',
    storyline:
      'Welcome to Apex Global Logistics Hub! Forklift operators and automated guided vehicles (AGVs) report severe congestion at several pallet racks. Safety regulations require an immediate audit of all storage bins that have reached or exceeded 100% capacity. Floor Operations Manager Rajesh asks you to write an INNER JOIN query linking the physical storage bins to the master product catalog.',
    businessProblem:
      'The inventory_bins table only contains product_id foreign keys. Pickers and forklift drivers cannot recognize numeric product IDs on warehouse floor displays—they need human-readable product names to quickly locate and de-risk overfilled storage bins.',
    objective:
      'Write an INNER JOIN query connecting "inventory_bins" (alias b) and "products" (alias p) on product_id. Select b.bin_code, p.product_name, b.quantity, and b.max_capacity for all bins where b.quantity >= b.max_capacity.',
    requiredOutcome:
      'A joined table displaying bin_code, product_name, quantity, and max_capacity for all saturated storage bins (quantity >= max_capacity).',
    checklist: [
      'SELECT b.bin_code, p.product_name, b.quantity, b.max_capacity',
      'FROM inventory_bins b',
      'JOIN products p ON b.product_id = p.product_id',
      'WHERE b.quantity >= b.max_capacity',
    ],
    sqlTopics: ['INNER JOIN', 'ON clause', 'Table Aliases', 'Comparison Operators (>=)'],
    hints: [
      'Use an INNER JOIN to connect inventory_bins b with products p matching on b.product_id = p.product_id.',
      'Select b.bin_code, p.product_name, b.quantity, and b.max_capacity, and filter with WHERE b.quantity >= b.max_capacity.',
      'SELECT b.bin_code, p.product_name, b.quantity, b.max_capacity\nFROM inventory_bins b\nJOIN products p ON b.product_id = p.product_id\nWHERE b.quantity >= b.max_capacity;',
    ],
    sampleSolution: `SELECT b.bin_code, p.product_name, b.quantity, b.max_capacity
FROM inventory_bins b
JOIN products p ON b.product_id = p.product_id
WHERE b.quantity >= b.max_capacity;`,
    solutionExplanation:
      'An INNER JOIN combines rows from two tables whenever the ON predicate evaluates to true. Linking inventory_bins to products by product_id bridges low-level storage telemetry with descriptive product names.',
    initialSqlPlaceholder: `-- Mission 1: First Discovery of Relational INNER JOIN\nSELECT b.bin_code, p.product_name, b.quantity, b.max_capacity\nFROM inventory_bins b\nJOIN products p ON ...\nWHERE ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify saturated storage bins with product names',
        expectedQuery:
          'SELECT b.bin_code, p.product_name, b.quantity, b.max_capacity FROM inventory_bins b JOIN products p ON b.product_id = p.product_id WHERE b.quantity >= b.max_capacity;',
      },
    ],
    xpReward: 100,
    badge: {
      id: 'cargo_supervisor',
      title: 'Cargo Slotting Specialist',
      icon: 'Boxes',
    },
  },
  {
    id: 'wh_m2',
    order: 2,
    title: 'Multi-Table Supply Chain Relational Chain',
    role: 'Logistics Data Specialist',
    storyline:
      'Quality Control Auditor Neha is conducting an urgent cold-chain compliance review. Perishable food products spoil rapidly if stored outside refrigerated environments. You must verify all products stored in temperature-controlled warehouse zones by traversing a 3-table relational chain.',
    businessProblem:
      'Auditors need to inspect perishable dairy and fruit puree stock. Product specs reside in "products", bin stock in "inventory_bins", and temperature status in "zones". Verifying storage compliance requires connecting all three tables.',
    objective:
      'Join "products" (alias p), "inventory_bins" (alias b) on p.product_id = b.product_id, and "zones" (alias z) on b.zone_id = z.zone_id. Select p.sku, p.product_name, b.bin_code, b.quantity, and z.zone_name for all zones where z.temp_controlled = 1. Order by b.quantity in descending order.',
    requiredOutcome:
      'A multi-table joined dataset displaying perishable inventory stored in cold zones, sorted highest quantity first.',
    checklist: [
      'JOIN products p to inventory_bins b ON p.product_id = b.product_id',
      'JOIN zones z ON b.zone_id = z.zone_id',
      'SELECT p.sku, p.product_name, b.bin_code, b.quantity, z.zone_name',
      'WHERE z.temp_controlled = 1',
      'ORDER BY b.quantity DESC',
    ],
    sqlTopics: ['Multi-table JOIN', 'Chained INNER JOIN', 'Boolean Filtering', 'ORDER BY DESC'],
    hints: [
      'Chain the joins: start FROM products p JOIN inventory_bins b ON p.product_id = b.product_id JOIN zones z ON b.zone_id = z.zone_id.',
      'Filter with WHERE z.temp_controlled = 1 and sort using ORDER BY b.quantity DESC.',
      'SELECT p.sku, p.product_name, b.bin_code, b.quantity, z.zone_name\nFROM products p\nJOIN inventory_bins b ON p.product_id = b.product_id\nJOIN zones z ON b.zone_id = z.zone_id\nWHERE z.temp_controlled = 1\nORDER BY b.quantity DESC;',
    ],
    sampleSolution: `SELECT p.sku, p.product_name, b.bin_code, b.quantity, z.zone_name
FROM products p
JOIN inventory_bins b ON p.product_id = b.product_id
JOIN zones z ON b.zone_id = z.zone_id
WHERE z.temp_controlled = 1
ORDER BY b.quantity DESC;`,
    solutionExplanation:
      'Multi-table relational queries traverse intermediate bridge tables (inventory_bins) to connect domain entities (products) with facility environments (zones), ensuring strict cold-chain compliance.',
    initialSqlPlaceholder: `-- Mission 2: Multi-table join across products, bins, and zones\nSELECT p.sku, p.product_name, b.bin_code, b.quantity, z.zone_name\nFROM products p\nJOIN inventory_bins b ON ...\nJOIN zones z ON ...\nWHERE z.temp_controlled = 1\nORDER BY ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify perishable cold-chain inventory query',
        orderSensitive: true,
        expectedQuery:
          'SELECT p.sku, p.product_name, b.bin_code, b.quantity, z.zone_name FROM products p JOIN inventory_bins b ON p.product_id = b.product_id JOIN zones z ON b.zone_id = z.zone_id WHERE z.temp_controlled = 1 ORDER BY b.quantity DESC;',
      },
    ],
    xpReward: 120,
    badge: {
      id: 'join_master',
      title: 'Join Master',
      icon: 'GitFork',
    },
  },
  {
    id: 'wh_m3',
    order: 3,
    title: 'Warehouse Zone Distribution with LEFT JOIN',
    role: 'Logistics Data Specialist',
    storyline:
      'Apex Logistics operates regional distribution hubs across the country. Infrastructure Director Vikram needs a comprehensive operational directory showing each warehouse facility alongside all of its assigned zones. A LEFT JOIN ensures facilities without configured zones are still visible on executive dashboards.',
    businessProblem:
      'An INNER JOIN would hide newly acquired distribution centers or newly opened hubs that do not yet have operational zones assigned. A LEFT JOIN guarantees complete visibility across all warehouse properties.',
    objective:
      'Perform a LEFT JOIN connecting "warehouses" (alias w) and "zones" (alias z) on w.warehouse_id = z.warehouse_id. Select w.warehouse_name, w.location, and z.zone_name.',
    requiredOutcome:
      'A complete directory of all warehouses and their assigned zones using a LEFT JOIN.',
    checklist: [
      'SELECT w.warehouse_name, w.location, z.zone_name',
      'FROM warehouses w',
      'LEFT JOIN zones z ON w.warehouse_id = z.warehouse_id',
    ],
    sqlTopics: ['LEFT JOIN', 'Outer Joins', 'NULL Handling', 'Facility Management'],
    hints: [
      'Use a LEFT JOIN starting FROM warehouses w LEFT JOIN zones z ON w.warehouse_id = z.warehouse_id.',
      'Select w.warehouse_name, w.location, and z.zone_name from the joined tables.',
      'SELECT w.warehouse_name, w.location, z.zone_name\nFROM warehouses w\nLEFT JOIN zones z ON w.warehouse_id = z.warehouse_id;',
    ],
    sampleSolution: `SELECT w.warehouse_name, w.location, z.zone_name
FROM warehouses w
LEFT JOIN zones z ON w.warehouse_id = z.warehouse_id;`,
    solutionExplanation:
      'LEFT JOIN preserves all rows from the primary left table (warehouses) regardless of whether a matching record exists in the right table (zones). If a warehouse has no zones, zone columns return NULL instead of dropping the facility from the report.',
    initialSqlPlaceholder: `-- Mission 3: Warehouse zone distribution with LEFT JOIN\nSELECT w.warehouse_name, w.location, z.zone_name\nFROM warehouses w\nLEFT JOIN zones z ON ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify warehouse zone distribution with LEFT JOIN',
        expectedQuery:
          'SELECT w.warehouse_name, w.location, z.zone_name FROM warehouses w LEFT JOIN zones z ON w.warehouse_id = z.warehouse_id;',
      },
    ],
    xpReward: 130,
  },
  {
    id: 'wh_m4',
    order: 4,
    title: 'Storage Bin Saturation Analysis with CASE WHEN',
    role: 'Logistics Data Specialist',
    storyline:
      'Warehouse capacity utilization is fluctuating rapidly with peak holiday replenishment. Logistics Operations Lead Priya wants an automated tiering report that categorizes every storage bin into utilization tiers so slotting managers can rebalance stock.',
    businessProblem:
      'Raw numbers like quantity and max_capacity require manual arithmetic to interpret. Floor managers need categorical status flags (\'Full\', \'Optimal\', \'Underutilized\') generated directly within the database query.',
    objective:
      'Query "inventory_bins". Select bin_code, quantity, max_capacity, and use a CASE WHEN expression to evaluate fill level: when quantity >= max_capacity then "Full", when quantity >= max_capacity * 0.5 then "Optimal", else "Underutilized", aliased as fill_level.',
    requiredOutcome:
      'A dataset of storage bins with bin_code, quantity, max_capacity, and calculated fill_level tier.',
    checklist: [
      'SELECT bin_code, quantity, max_capacity',
      'Include CASE WHEN quantity >= max_capacity THEN \'Full\'',
      'Include WHEN quantity >= max_capacity * 0.5 THEN \'Optimal\'',
      'Include ELSE \'Underutilized\' END AS fill_level',
      'FROM inventory_bins',
    ],
    sqlTopics: ['CASE WHEN', 'Conditional Logic', 'Derived Columns', 'Capacity Utilization'],
    hints: [
      'Use a CASE statement inside your SELECT clause: CASE WHEN condition THEN value ... END AS fill_level.',
      'Order conditions from most specific to least: first check quantity >= max_capacity, then quantity >= max_capacity * 0.5, with ELSE \'Underutilized\'.',
      'SELECT bin_code, quantity, max_capacity,\n  CASE\n    WHEN quantity >= max_capacity THEN \'Full\'\n    WHEN quantity >= max_capacity * 0.5 THEN \'Optimal\'\n    ELSE \'Underutilized\'\n  END AS fill_level\nFROM inventory_bins;',
    ],
    sampleSolution: `SELECT bin_code, quantity, max_capacity,
  CASE
    WHEN quantity >= max_capacity THEN 'Full'
    WHEN quantity >= max_capacity * 0.5 THEN 'Optimal'
    ELSE 'Underutilized'
  END AS fill_level
FROM inventory_bins;`,
    solutionExplanation:
      'The CASE expression provides powerful conditional logic inside SQL queries, transforming continuous quantitative metrics into standardized operational categories for decision-makers.',
    initialSqlPlaceholder: `-- Mission 4: Categorize bin fill levels with CASE WHEN\nSELECT bin_code, quantity, max_capacity,\n  CASE\n    WHEN ... THEN 'Full'\n    WHEN ... THEN 'Optimal'\n    ELSE 'Underutilized'\n  END AS fill_level\nFROM inventory_bins;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify storage bin saturation analysis with CASE WHEN',
        expectedQuery:
          "SELECT bin_code, quantity, max_capacity, CASE WHEN quantity >= max_capacity THEN 'Full' WHEN quantity >= max_capacity * 0.5 THEN 'Optimal' ELSE 'Underutilized' END AS fill_level FROM inventory_bins;",
      },
    ],
    xpReward: 140,
  },
  {
    id: 'wh_m5',
    order: 5,
    title: 'Carrier Freight Volume with HAVING',
    role: 'Logistics Data Specialist',
    storyline:
      'VP of Supply Chain Procurement Sunita is renegotiating corporate freight rates with commercial trucking partners. To qualify carriers for tiered volume discounts, she requires a summary of outbound freight lines handling more than 15 total pallets.',
    businessProblem:
      'Aggregate thresholds cannot be filtered in a WHERE clause because aggregation occurs after row-level filtering. Enterprise procurement teams require a HAVING clause to filter on grouped pallet volumes.',
    objective:
      'Group "shipments" by carrier. Select carrier, COUNT(shipment_id) AS total_shipments, and SUM(pallet_count) AS total_pallets. Filter for total_pallets > 15 using HAVING and order by total_pallets descending.',
    requiredOutcome:
      'An aggregated carrier scorecard for high-volume freight lines handling over 15 pallets, ordered by total pallets descending.',
    checklist: [
      'SELECT carrier, COUNT(shipment_id) AS total_shipments, SUM(pallet_count) AS total_pallets',
      'FROM shipments',
      'GROUP BY carrier',
      'HAVING total_pallets > 15',
      'ORDER BY total_pallets DESC',
    ],
    sqlTopics: ['GROUP BY', 'SUM / COUNT', 'HAVING clause', 'ORDER BY DESC'],
    hints: [
      'Compute COUNT(shipment_id) AS total_shipments and SUM(pallet_count) AS total_pallets grouped by carrier.',
      'Apply HAVING total_pallets > 15 (or HAVING SUM(pallet_count) > 15) and sort with ORDER BY total_pallets DESC.',
      'SELECT carrier, COUNT(shipment_id) AS total_shipments, SUM(pallet_count) AS total_pallets\nFROM shipments\nGROUP BY carrier\nHAVING total_pallets > 15\nORDER BY total_pallets DESC;',
    ],
    sampleSolution: `SELECT carrier, COUNT(shipment_id) AS total_shipments, SUM(pallet_count) AS total_pallets
FROM shipments
GROUP BY carrier
HAVING total_pallets > 15
ORDER BY total_pallets DESC;`,
    solutionExplanation:
      'The HAVING clause filters aggregated groups after the GROUP BY reduction occurs, enabling procurement analysts to isolate top-tier commercial logistics providers.',
    initialSqlPlaceholder: `-- Mission 5: Carrier freight volume summary with HAVING\nSELECT carrier, COUNT(shipment_id) AS total_shipments, SUM(pallet_count) AS total_pallets\nFROM shipments\nGROUP BY carrier\nHAVING ...\nORDER BY ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify carrier freight volume aggregation with HAVING',
        orderSensitive: true,
        expectedQuery:
          'SELECT carrier, COUNT(shipment_id) AS total_shipments, SUM(pallet_count) AS total_pallets FROM shipments GROUP BY carrier HAVING total_pallets > 15 ORDER BY total_pallets DESC;',
      },
    ],
    xpReward: 160,
    badge: {
      id: 'aggregate_wizard',
      title: 'Aggregate Wizard',
      icon: 'BarChart2',
    },
  },
  {
    id: 'wh_m6',
    order: 6,
    title: 'Multi-Table Zone Capacity Reconciliation with HAVING',
    role: 'Logistics Data Specialist',
    storyline:
      'The Chief Operating Officer requires an executive reconciliation of inventory density across warehouse zones. To rebalance staffing and material handling equipment (like reach trucks and pallet jacks), operations needs to identify all active zones storing more than 50 total units of stock.',
    businessProblem:
      'Zone descriptions and physical bin quantities live in separate relational tables. Management needs both a multi-table relational join and group-level aggregation with HAVING to pinpoint heavy storage zones.',
    objective:
      'Join "zones" (alias z) and "inventory_bins" (alias b) on z.zone_id = b.zone_id. Group by z.zone_name. Select z.zone_name and SUM(b.quantity) AS total_stock. Filter for zones where total_stock > 50 using HAVING, and order by total_stock in descending order.',
    requiredOutcome:
      'A consolidated zone inventory summary displaying zone_name and total_stock for high-density zones (> 50 units), sorted highest stock first.',
    checklist: [
      'JOIN zones z with inventory_bins b ON z.zone_id = b.zone_id',
      'GROUP BY z.zone_name',
      'SELECT z.zone_name, SUM(b.quantity) AS total_stock',
      'HAVING total_stock > 50',
      'ORDER BY total_stock DESC',
    ],
    sqlTopics: ['Multi-table JOIN', 'GROUP BY', 'SUM Aggregation', 'HAVING clause', 'ORDER BY DESC'],
    hints: [
      'Join zones z to inventory_bins b on z.zone_id = b.zone_id and group by z.zone_name.',
      'Select z.zone_name and SUM(b.quantity) AS total_stock. Filter with HAVING total_stock > 50 and ORDER BY total_stock DESC.',
      'SELECT z.zone_name, SUM(b.quantity) AS total_stock\nFROM zones z\nJOIN inventory_bins b ON z.zone_id = b.zone_id\nGROUP BY z.zone_name\nHAVING total_stock > 50\nORDER BY total_stock DESC;',
    ],
    sampleSolution: `SELECT z.zone_name, SUM(b.quantity) AS total_stock
FROM zones z
JOIN inventory_bins b ON z.zone_id = b.zone_id
GROUP BY z.zone_name
HAVING total_stock > 50
ORDER BY total_stock DESC;`,
    solutionExplanation:
      'Combining multi-table relational JOINs with GROUP BY and HAVING filters produces executive-level capacity summaries, unifying physical geography with live stock telemetry.',
    initialSqlPlaceholder: `-- Mission 6: Zone capacity reconciliation with HAVING\nSELECT z.zone_name, SUM(b.quantity) AS total_stock\nFROM zones z\nJOIN inventory_bins b ON ...\nGROUP BY z.zone_name\nHAVING total_stock > 50\nORDER BY ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify multi-table zone capacity reconciliation with HAVING',
        orderSensitive: true,
        expectedQuery:
          'SELECT z.zone_name, SUM(b.quantity) AS total_stock FROM zones z JOIN inventory_bins b ON z.zone_id = b.zone_id GROUP BY z.zone_name HAVING total_stock > 50 ORDER BY total_stock DESC;',
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
