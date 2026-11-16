import { Mission } from '../../../types/mission';

export const KAAPI_MISSIONS: Mission[] = [
  {
    id: 'kaapi_m1',
    order: 1,
    title: 'Booting the Menu Board',
    role: 'Kitchen POS & Inventory Systems Lead',
    storyline:
      'The digital menu display is completely blank! Before we roll up the shutters, initialize the menu_items table with default spice and availability rules so Chef Suresh can price the morning tiffin items.',
    businessProblem:
      'Without an active menu table, billing kiosks cannot ring up orders, and the kitchen KDS screens remain unresponsive.',
    objective:
      'Create a table named "menu_items" with item_id (INTEGER PRIMARY KEY), item_name (TEXT NOT NULL), category (TEXT NOT NULL), spice_level (TEXT DEFAULT "Mild"), price_inr (INTEGER NOT NULL), orders_today (INTEGER DEFAULT 0), calories (INTEGER), and status (TEXT DEFAULT "Available").',
    requiredOutcome:
      'A newly created menu_items table with primary key, not null constraints, and specified default values.',
    checklist: [
      'Use CREATE TABLE menu_items (...)',
      'Define item_id INTEGER PRIMARY KEY',
      'Define item_name TEXT NOT NULL',
      'Define category TEXT NOT NULL',
      'Include spice_level TEXT DEFAULT "Mild"',
      'Define price_inr INTEGER NOT NULL',
      'Include orders_today INTEGER DEFAULT 0',
      'Include calories INTEGER',
      'Include status TEXT DEFAULT "Available"',
    ],
    sqlTopics: ['CREATE TABLE', 'PRIMARY KEY', 'NOT NULL', 'DEFAULT'],
    hints: [
      'Start with CREATE TABLE menu_items (...); and define each column with its datatype and constraint.',
      'Set spice_level DEFAULT \'Mild\', orders_today DEFAULT 0, and status DEFAULT \'Available\'.',
      `CREATE TABLE menu_items (
  item_id INTEGER PRIMARY KEY,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  spice_level TEXT DEFAULT 'Mild',
  price_inr INTEGER NOT NULL,
  orders_today INTEGER DEFAULT 0,
  calories INTEGER,
  status TEXT DEFAULT 'Available'
);`,
    ],
    sampleSolution: `CREATE TABLE menu_items (
  item_id INTEGER PRIMARY KEY,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  spice_level TEXT DEFAULT 'Mild',
  price_inr INTEGER NOT NULL,
  orders_today INTEGER DEFAULT 0,
  calories INTEGER,
  status TEXT DEFAULT 'Available'
);`,
    solutionExplanation:
      'Relational schemas enforce operational rules. Declaring item_id as PRIMARY KEY ensures each menu SKU is distinct. DEFAULT clauses ensure newly entered seasonal specials automatically default to Mild spice and Available status without tedious manual inputs.',
    initialSqlPlaceholder: `-- Mission 1: Initialize menu_items table\nCREATE TABLE menu_items (\n  \n);`,
    validationRules: [
      {
        type: 'TABLE_EXISTS',
        description: 'Verify menu_items table exists with required columns',
        expectedTable: 'menu_items',
        expectedColumns: [
          'item_id',
          'item_name',
          'category',
          'spice_level',
          'price_inr',
          'orders_today',
          'calories',
          'status',
        ],
      },
    ],
    xpReward: 100,
    badge: {
      id: 'menu_architect',
      title: 'Menu Architect',
      icon: 'Coffee',
    },
  },
  {
    id: 'kaapi_m2',
    order: 2,
    title: 'Davara Loyalty Pass Vault',
    role: 'Kitchen POS & Inventory Systems Lead',
    storyline:
      'Our morning regulars rely on prepaid Filter Coffee passes. Set up kaapi_passes so duplicate phone numbers are blocked and cups_left can never drop below zero.',
    businessProblem:
      'Without an automated balance check, kiosks allow customers to overdraft prepaid coffee credits into negative values.',
    objective:
      'Create a table named "kaapi_passes" with pass_id (INTEGER PRIMARY KEY AUTOINCREMENT), member_phone (TEXT UNIQUE NOT NULL), pass_tier (TEXT NOT NULL), cups_left (INTEGER CHECK (cups_left >= 0)), and preferred_roast (TEXT).',
    requiredOutcome:
      'An active kaapi_passes ledger enforcing mobile phone uniqueness and non-negative coffee credit balances.',
    checklist: [
      'Use CREATE TABLE kaapi_passes (...)',
      'Define pass_id INTEGER PRIMARY KEY AUTOINCREMENT',
      'Define member_phone TEXT UNIQUE NOT NULL',
      'Define pass_tier TEXT NOT NULL',
      'Enforce cups_left INTEGER CHECK (cups_left >= 0)',
      'Include preferred_roast TEXT',
    ],
    sqlTopics: ['CREATE TABLE', 'AUTOINCREMENT', 'UNIQUE', 'CHECK constraint'],
    hints: [
      'Use CREATE TABLE kaapi_passes (...) with pass_id as INTEGER PRIMARY KEY AUTOINCREMENT.',
      'Add the constraint CHECK (cups_left >= 0) to ensure remaining cup balances cannot drop below zero.',
      `CREATE TABLE kaapi_passes (
  pass_id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_phone TEXT UNIQUE NOT NULL,
  pass_tier TEXT NOT NULL,
  cups_left INTEGER CHECK (cups_left >= 0),
  preferred_roast TEXT
);`,
    ],
    sampleSolution: `CREATE TABLE kaapi_passes (
  pass_id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_phone TEXT UNIQUE NOT NULL,
  pass_tier TEXT NOT NULL,
  cups_left INTEGER CHECK (cups_left >= 0),
  preferred_roast TEXT
);`,
    solutionExplanation:
      'The CHECK constraint acts as a database-level firewall. Any checkout attempt attempting to decrement cups_left below zero immediately triggers a constraint violation, ensuring the brass-tumbler kaapi credits remain strictly balanced.',
    initialSqlPlaceholder: `-- Mission 2: Create kaapi_passes ledger\nCREATE TABLE kaapi_passes (\n  \n);`,
    validationRules: [
      {
        type: 'TABLE_EXISTS',
        description: 'Verify kaapi_passes table exists with required columns',
        expectedTable: 'kaapi_passes',
        expectedColumns: [
          'pass_id',
          'member_phone',
          'pass_tier',
          'cups_left',
          'preferred_roast',
        ],
      },
      {
        type: 'CUSTOM',
        description: 'Verify CHECK (cups_left >= 0) constraint blocks negative coffee balances',
        customValidator: async (context) => {
          const testNegSql = `INSERT INTO kaapi_passes (member_phone, pass_tier, cups_left) VALUES ('9880011223', 'Degree_Daily', -2);`;
          const res = await context.executeSql(testNegSql);
          if (res.success) {
            await context.executeSql(`DELETE FROM kaapi_passes WHERE member_phone = '9880011223';`);
            return {
              passed: false,
              message: 'The CHECK constraint is missing or not enforcing non-negative balances. CHECK (cups_left >= 0) must block negative credit counts.',
              details: {
                hint: 'Define cups_left as: cups_left INTEGER CHECK (cups_left >= 0)',
              },
            };
          }
          return { passed: true, message: 'CHECK constraint verified: negative balances are blocked.' };
        },
      },
    ],
    xpReward: 100,
    badge: {
      id: 'kaapi_vault_keeper',
      title: 'Kaapi Vault Keeper',
      icon: 'ShieldCheck',
    },
  },
  {
    id: 'kaapi_m3',
    order: 3,
    title: 'Stocking the Morning Counter',
    role: 'Kitchen POS & Inventory Systems Lead',
    storyline:
      'The stone-ground batter is fermented and first-drop decoction is ready! Load our 8 signature South Indian items into menu_items so the POS terminals can take breakfast orders.',
    businessProblem:
      'Breakfast orders cannot be rung up until the master menu catalog is populated with current pricing.',
    objective:
      'Insert all 8 items into "menu_items":\n1. (301, "Mysore Masala Dosa", "Dosa", "Medium", 85, 120, 350, "Available")\n2. (302, "Ghee Podi Idli", "Idli_Vada", "Spicy", 60, 95, NULL, "Available")\n3. (303, "Medu Vada", "Idli_Vada", "Mild", 45, 110, 220, "Available")\n4. (304, "Degree Filter Kaapi", "Kaapi", "None", 40, 210, 80, "Available")\n5. (305, "Ven Pongal", "Idli_Vada", "Mild", 70, 65, 290, "Available")\n6. (306, "Pineapple Kesari", "Sweet", "None", 55, 40, 310, "Available")\n7. (307, "Karupatti Kaapi", "Kaapi", "None", 50, 0, NULL, "Seasonal")\n8. (308, "Rava Onion Dosa", "Dosa", "Medium", 75, 0, 380, "Discontinued").',
    requiredOutcome:
      'All 8 menu items loaded cleanly into menu_items table.',
    checklist: [
      'Use INSERT INTO menu_items (...) VALUES (...)',
      'Provide values for all 8 items',
      'Use NULL for calories on Ghee Podi Idli and Karupatti Kaapi',
    ],
    sqlTopics: ['INSERT INTO', 'VALUES', 'Batch Insert', 'NULL Handling'],
    hints: [
      'Use INSERT INTO menu_items (item_id, item_name, category, spice_level, price_inr, orders_today, calories, status) VALUES (...), (...);',
      'For missing calories, write NULL without quotes.',
      `INSERT INTO menu_items (item_id, item_name, category, spice_level, price_inr, orders_today, calories, status) VALUES
  (301, 'Mysore Masala Dosa', 'Dosa', 'Medium', 85, 120, 350, 'Available'),
  (302, 'Ghee Podi Idli', 'Idli_Vada', 'Spicy', 60, 95, NULL, 'Available'),
  (303, 'Medu Vada', 'Idli_Vada', 'Mild', 45, 110, 220, 'Available'),
  (304, 'Degree Filter Kaapi', 'Kaapi', 'None', 40, 210, 80, 'Available'),
  (305, 'Ven Pongal', 'Idli_Vada', 'Mild', 70, 65, 290, 'Available'),
  (306, 'Pineapple Kesari', 'Sweet', 'None', 55, 40, 310, 'Available'),
  (307, 'Karupatti Kaapi', 'Kaapi', 'None', 50, 0, NULL, 'Seasonal'),
  (308, 'Rava Onion Dosa', 'Dosa', 'Medium', 75, 0, 380, 'Discontinued');`,
    ],
    sampleSolution: `INSERT INTO menu_items (item_id, item_name, category, spice_level, price_inr, orders_today, calories, status) VALUES
  (301, 'Mysore Masala Dosa', 'Dosa', 'Medium', 85, 120, 350, 'Available'),
  (302, 'Ghee Podi Idli', 'Idli_Vada', 'Spicy', 60, 95, NULL, 'Available'),
  (303, 'Medu Vada', 'Idli_Vada', 'Mild', 45, 110, 220, 'Available'),
  (304, 'Degree Filter Kaapi', 'Kaapi', 'None', 40, 210, 80, 'Available'),
  (305, 'Ven Pongal', 'Idli_Vada', 'Mild', 70, 65, 290, 'Available'),
  (306, 'Pineapple Kesari', 'Sweet', 'None', 55, 40, 310, 'Available'),
  (307, 'Karupatti Kaapi', 'Kaapi', 'None', 50, 0, NULL, 'Seasonal'),
  (308, 'Rava Onion Dosa', 'Dosa', 'Medium', 75, 0, 380, 'Discontinued');`,
    solutionExplanation:
      'Multi-row batch insertions populate the menu inventory atomically. The NULL keyword accurately denotes missing nutrition laboratory data for freshly created culinary specials.',
    initialSqlPlaceholder: `-- Mission 3: Stock 8 items into menu_items\nINSERT INTO menu_items (\n  \n) VALUES \n  \n;`,
    validationRules: [
      {
        type: 'ROW_COUNT',
        description: 'Verify 8 items exist in menu_items',
        expectedTable: 'menu_items',
        expectedRowCount: 8,
      },
      {
        type: 'ROW_EXISTS',
        description: 'Verify Degree Filter Kaapi item data',
        expectedTable: 'menu_items',
        expectedWhereClause: "item_name = 'Degree Filter Kaapi' AND price_inr = 40",
      },
      {
        type: 'ROW_EXISTS',
        description: 'Verify Karupatti Kaapi item data',
        expectedTable: 'menu_items',
        expectedWhereClause: "item_name = 'Karupatti Kaapi' AND status = 'Seasonal'",
      },
      {
        type: 'ROW_EXISTS',
        description: 'Verify Rava Onion Dosa item data',
        expectedTable: 'menu_items',
        expectedWhereClause: "item_name = 'Rava Onion Dosa' AND status = 'Discontinued'",
      },
    ],
    xpReward: 100,
    badge: {
      id: 'tiffin_curator',
      title: 'Tiffin Curator',
      icon: 'UtensilsCrossed',
    },
  },
  {
    id: 'kaapi_m4',
    order: 4,
    title: 'Overhead Menu Board',
    role: 'Kitchen POS & Inventory Systems Lead',
    storyline:
      'Let’s organize the counter display—first pull all unique menu categories, then show our dishes ranked from best-seller to lowest orders.',
    businessProblem:
      'Customers entering the shop need to see the popular breakfast specials clearly ranked on the overhead monitor.',
    objective:
      'Query item_name AS dish_name, category, and orders_today AS plates_served from menu_items, sorted by orders_today in descending order (DESC).',
    requiredOutcome:
      'A ranked list of dishes with custom column aliases showing the highest volume items first.',
    checklist: [
      'SELECT item_name AS dish_name, category, orders_today AS plates_served',
      'FROM menu_items',
      'ORDER BY orders_today DESC',
    ],
    sqlTopics: ['SELECT', 'Column Aliases (AS)', 'ORDER BY DESC'],
    hints: [
      'Use item_name AS dish_name and orders_today AS plates_served.',
      'Add ORDER BY orders_today DESC to sort from highest orders to lowest.',
      `SELECT item_name AS dish_name, category, orders_today AS plates_served\nFROM menu_items\nORDER BY orders_today DESC;`,
    ],
    sampleSolution: `SELECT item_name AS dish_name, category, orders_today AS plates_served
FROM menu_items
ORDER BY orders_today DESC;`,
    solutionExplanation:
      'Column aliases like dish_name and plates_served transform raw internal database column identifiers into clear, user-facing headings suitable for POS digital menu boards.',
    initialSqlPlaceholder: `-- Mission 4: Query best-selling dishes ranked by orders\nSELECT \nFROM menu_items\n;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify dishes ranked descending by orders served',
        expectedQuery: `SELECT item_name AS dish_name, category, orders_today AS plates_served FROM menu_items ORDER BY orders_today DESC;`,
        orderSensitive: true,
      },
    ],
    xpReward: 100,
    badge: {
      id: 'board_designer',
      title: 'Board Designer',
      icon: 'Tv',
    },
  },
  {
    id: 'kaapi_m5',
    order: 5,
    title: 'Express Breakfast & Kaapi Filter',
    role: 'Kitchen POS & Inventory Systems Lead',
    storyline:
      'Morning office-goers want quick grabs between ₹40 and ₹95 from our "Idli_Vada" or "Kaapi" sections. Filter those exact items.',
    businessProblem:
      'The morning express counter requires a dedicated quick-order ticket subset filtering out heavy dosas and sweets.',
    objective:
      'Select all columns from menu_items where category IN ("Idli_Vada", "Kaapi") AND price_inr BETWEEN 40 AND 95, ordered by price_inr ASC.',
    requiredOutcome:
      'Filtered menu items matching express category and price boundary constraints.',
    checklist: [
      'SELECT * FROM menu_items',
      'WHERE category IN ("Idli_Vada", "Kaapi")',
      'AND price_inr BETWEEN 40 AND 95',
      'ORDER BY price_inr ASC',
    ],
    sqlTopics: ['WHERE', 'IN', 'BETWEEN ... AND', 'ORDER BY'],
    hints: [
      'Use category IN (\'Idli_Vada\', \'Kaapi\') to match both sections.',
      'Use price_inr BETWEEN 40 AND 95 to filter the price range inclusively.',
      `SELECT * FROM menu_items\nWHERE category IN ('Idli_Vada', 'Kaapi')\n  AND price_inr BETWEEN 40 AND 95\nORDER BY price_inr ASC;`,
    ],
    sampleSolution: `SELECT * FROM menu_items
WHERE category IN ('Idli_Vada', 'Kaapi')
  AND price_inr BETWEEN 40 AND 95
ORDER BY price_inr ASC;`,
    solutionExplanation:
      'Combining the IN operator with BETWEEN allows precise filtering across multiple categorical dimensions and numerical ranges in a clean, readable syntax.',
    initialSqlPlaceholder: `-- Mission 5: Filter express tiffin and coffee items\nSELECT * FROM menu_items\nWHERE \n;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify Idli_Vada and Kaapi items priced between 40 and 95',
        expectedQuery: `SELECT * FROM menu_items WHERE category IN ('Idli_Vada', 'Kaapi') AND price_inr BETWEEN 40 AND 95 ORDER BY price_inr ASC;`,
        orderSensitive: false,
      },
    ],
    xpReward: 100,
    badge: {
      id: 'express_barista',
      title: 'Express Barista',
      icon: 'Zap',
    },
  },
  {
    id: 'kaapi_m6',
    order: 6,
    title: 'Dosa Lineup & Calorie Audit',
    role: 'Kitchen POS & Inventory Systems Lead',
    storyline:
      'Two quick checks for the nutrition board: pull every "Dosa" variety (LIKE "%Dosa%"), plus any active item still missing its calories count (IS NULL).',
    businessProblem:
      'Food safety regulations mandate publishing nutritional data for all active items on the digital board.',
    objective:
      'Query all menu items where (item_name LIKE "%Dosa%" OR calories IS NULL) AND status != "Discontinued".',
    requiredOutcome:
      'A filtered list of active dosa varieties and uncalibrated items needing laboratory calorie testing.',
    checklist: [
      'SELECT * FROM menu_items',
      'WHERE (item_name LIKE "%Dosa%" OR calories IS NULL)',
      'AND status != "Discontinued"',
    ],
    sqlTopics: ['LIKE', 'Wildcards (%)', 'IS NULL', 'Logical AND / OR'],
    hints: [
      'Use item_name LIKE \'%Dosa%\' to match any dish with Dosa in its name.',
      'Use calories IS NULL to identify uncalibrated items.',
      `SELECT * FROM menu_items\nWHERE (item_name LIKE '%Dosa%' OR calories IS NULL)\n  AND status != 'Discontinued';`,
    ],
    sampleSolution: `SELECT * FROM menu_items
WHERE (item_name LIKE '%Dosa%' OR calories IS NULL)
  AND status != 'Discontinued';`,
    solutionExplanation:
      'Parenthesizing the OR condition guarantees that the exclusion of discontinued items (status != "Discontinued") applies uniformly across both dosa varieties and null-calorie specials.',
    initialSqlPlaceholder: `-- Mission 6: Dosa lineup and missing calories audit\nSELECT * FROM menu_items\nWHERE \n;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify active dosas and null-calorie items',
        expectedQuery: `SELECT * FROM menu_items WHERE (item_name LIKE '%Dosa%' OR calories IS NULL) AND status != 'Discontinued';`,
        orderSensitive: false,
      },
    ],
    xpReward: 100,
    badge: {
      id: 'dosa_connoisseur',
      title: 'Dosa Connoisseur',
      icon: 'Award',
    },
  },
  {
    id: 'kaapi_m7',
    order: 7,
    title: 'Launching Karupatti Kaapi',
    role: 'Kitchen POS & Inventory Systems Lead',
    storyline:
      'Fresh palm jaggery just arrived from the roastery! Switch our "Seasonal" item (Karupatti Kaapi) to "Available" under status and set its price_inr to 65.',
    businessProblem:
      'The morning crowd is asking for Karupatti Kaapi, but the POS terminal marks it Seasonal and blocks ordering.',
    objective:
      'Execute an UPDATE statement on menu_items setting status = "Available" and price_inr = 65 WHERE status = "Seasonal".',
    requiredOutcome:
      'Karupatti Kaapi updated to Available with price set to 65.',
    checklist: [
      'Use UPDATE menu_items',
      'SET status = "Available", price_inr = 65',
      'WHERE status = "Seasonal"',
    ],
    sqlTopics: ['UPDATE', 'SET', 'Conditional WHERE'],
    hints: [
      'Use UPDATE menu_items SET status = \'Available\', price_inr = 65 WHERE status = \'Seasonal\';',
      'Always include the WHERE clause to avoid updating all menu prices indiscriminately.',
      `UPDATE menu_items\nSET status = 'Available', price_inr = 65\nWHERE status = 'Seasonal';`,
    ],
    sampleSolution: `UPDATE menu_items
SET status = 'Available', price_inr = 65
WHERE status = 'Seasonal';`,
    solutionExplanation:
      'UPDATE modifies existing records in place. Specifying the target condition in the WHERE clause ensures only seasonal specials are activated, preserving the integrity of all other menu items.',
    initialSqlPlaceholder: `-- Mission 7: Activate seasonal Karupatti Kaapi\nUPDATE menu_items\nSET \nWHERE \n;`,
    validationRules: [
      {
        type: 'ROW_EXISTS',
        description: 'Verify Karupatti Kaapi is Available with price 65',
        expectedTable: 'menu_items',
        expectedWhereClause: "item_name = 'Karupatti Kaapi' AND status = 'Available' AND price_inr = 65",
      },
      {
        type: 'ROW_ABSENT',
        description: 'Verify no items remain Seasonal',
        expectedTable: 'menu_items',
        expectedWhereClause: "status = 'Seasonal'",
      },
    ],
    xpReward: 100,
    badge: {
      id: 'roastery_specialist',
      title: 'Roastery Specialist',
      icon: 'Flame',
    },
  },
  {
    id: 'kaapi_m8',
    order: 8,
    title: 'Clearing Off-Menu Items',
    role: 'Kitchen POS & Inventory Systems Lead',
    storyline:
      'An old "Discontinued" dish left over from last month’s menu is still cluttering the billing screen. Purge it safely from menu_items.',
    businessProblem:
      'Waitstaff keep accidentally punching in discontinued items during rush hours, confusing the kitchen cooks.',
    objective:
      'Execute a DELETE statement removing any record from menu_items where status = "Discontinued".',
    requiredOutcome:
      'Decommissioned dish purged, reducing active menu SKUs from 8 to 7.',
    checklist: [
      'Use DELETE FROM menu_items',
      'WHERE status = "Discontinued"',
    ],
    sqlTopics: ['DELETE FROM', 'Targeted WHERE'],
    hints: [
      'Use DELETE FROM menu_items WHERE status = \'Discontinued\';',
      'Make sure you specify WHERE status = \'Discontinued\' so other dishes are preserved.',
      `DELETE FROM menu_items\nWHERE status = 'Discontinued';`,
    ],
    sampleSolution: `DELETE FROM menu_items
WHERE status = 'Discontinued';`,
    solutionExplanation:
      'DELETE physically purges obsolete or deprecated records from relational tables. Running targeted deletions keeps billing screen menus crisp and eliminates erroneous order submissions.',
    initialSqlPlaceholder: `-- Mission 8: Delete discontinued items\nDELETE FROM menu_items\nWHERE \n;`,
    validationRules: [
      {
        type: 'ROW_COUNT',
        description: 'Verify table row count dropped to 7',
        expectedTable: 'menu_items',
        expectedRowCount: 7,
      },
      {
        type: 'ROW_ABSENT',
        description: 'Verify no Discontinued items remain in table',
        expectedTable: 'menu_items',
        expectedWhereClause: "status = 'Discontinued'",
      },
    ],
    xpReward: 100,
    badge: {
      id: 'menu_purifier',
      title: 'Menu Purifier',
      icon: 'Trash2',
    },
  },
  {
    id: 'kaapi_m9',
    order: 9,
    title: 'Morning Shift Closing Register',
    role: 'Kitchen POS & Inventory Systems Lead',
    storyline:
      '11:30 AM breakfast rush complete! Compile the final morning shift metrics for Chef Suresh in a single executive summary row.',
    businessProblem:
      'Chef Suresh needs the breakfast shift operational summary to reconcile kitchen food cost and tally total orders served.',
    objective:
      'Write a single aggregate SELECT query computing:\n1. total_dishes (COUNT(*))\n2. total_orders_served (SUM(orders_today))\n3. avg_dish_price (ROUND(AVG(price_inr), 2))\n4. lowest_price_inr (MIN(price_inr))\n5. top_dish_orders (MAX(orders_today))\nFROM menu_items.',
    requiredOutcome:
      'A single summary row with 5 executive breakfast performance indicators.',
    checklist: [
      'COUNT(*) AS total_dishes',
      'SUM(orders_today) AS total_orders_served',
      'ROUND(AVG(price_inr), 2) AS avg_dish_price',
      'MIN(price_inr) AS lowest_price_inr',
      'MAX(orders_today) AS top_dish_orders',
      'FROM menu_items',
    ],
    sqlTopics: ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'ROUND'],
    hints: [
      'Compute all 5 aggregate functions in one SELECT statement.',
      'Use ROUND(AVG(price_inr), 2) to format average price to 2 decimal places.',
      `SELECT 
  COUNT(*) AS total_dishes,
  SUM(orders_today) AS total_orders_served,
  ROUND(AVG(price_inr), 2) AS avg_dish_price,
  MIN(price_inr) AS lowest_price_inr,
  MAX(orders_today) AS top_dish_orders
FROM menu_items;`,
    ],
    sampleSolution: `SELECT 
  COUNT(*) AS total_dishes,
  SUM(orders_today) AS total_orders_served,
  ROUND(AVG(price_inr), 2) AS avg_dish_price,
  MIN(price_inr) AS lowest_price_inr,
  MAX(orders_today) AS top_dish_orders
FROM menu_items;`,
    solutionExplanation:
      'Single-table aggregations distill thousands of register events into essential operational intelligence. Chef Suresh can instantly evaluate breakfast footfall, average item price, and peak order demand in a single glance.',
    initialSqlPlaceholder: `-- Mission 9: Morning Shift Closing Register\nSELECT \nFROM menu_items;\n`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify 5 aggregate metrics match exact morning shift summary',
        expectedQuery: `SELECT COUNT(*) AS total_dishes, SUM(orders_today) AS total_orders_served, ROUND(AVG(price_inr), 2) AS avg_dish_price, MIN(price_inr) AS lowest_price_inr, MAX(orders_today) AS top_dish_orders FROM menu_items;`,
      },
    ],
    xpReward: 250,
    badge: {
      id: 'degree_kaapi_master',
      title: 'Degree Kaapi Master',
      icon: 'Award',
    },
  },
];
