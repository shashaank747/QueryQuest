import { Mission } from '../../../types/mission';

export const SUPERMARKET_MISSIONS: Mission[] = [
  {
    id: 'sm_m1',
    order: 1,
    title: 'Initialize Supermarket Store Workspace',
    role: 'Junior Database Executive',
    storyline:
      'Welcome to FreshMart Hypermarkets! The leadership team is transitioning from manual binders to SQLite. Your first assignment from Manager Devendra is to establish our store registry schema.',
    businessProblem:
      'The company operates multiple city branches, but branch data is currently unorganized. We need a reliable relational table to register each branch location.',
    objective:
      'Create a table named "store_branches" with columns: branch_id (INTEGER PRIMARY KEY), branch_name (TEXT NOT NULL), city (TEXT NOT NULL), and opening_year (INTEGER).',
    requiredOutcome:
      'A new table named store_branches with the specified column definitions and PRIMARY KEY constraint.',
    checklist: [
      'Use CREATE TABLE store_branches',
      'Define branch_id as INTEGER PRIMARY KEY',
      'Include branch_name TEXT NOT NULL',
      'Include city TEXT NOT NULL',
      'Include opening_year INTEGER',
    ],
    sqlTopics: ['CREATE TABLE', 'PRIMARY KEY', 'Data Types', 'NOT NULL'],
    hints: [
      'Begin your query with CREATE TABLE store_branches (...).',
      'Inside parentheses, declare each column separated by commas. Mark branch_id as INTEGER PRIMARY KEY.',
      'CREATE TABLE store_branches (\n  branch_id INTEGER PRIMARY KEY,\n  branch_name TEXT NOT NULL,\n  city TEXT NOT NULL,\n  opening_year INTEGER\n);',
    ],
    sampleSolution: `CREATE TABLE store_branches (
  branch_id INTEGER PRIMARY KEY,
  branch_name TEXT NOT NULL,
  city TEXT NOT NULL,
  opening_year INTEGER
);`,
    solutionExplanation:
      'CREATE TABLE creates a relational table in SQLite. Specifying INTEGER PRIMARY KEY automatically provides unique row identification and indexed lookups. NOT NULL prevents accidental missing values in crucial fields.',
    initialSqlPlaceholder: `-- Mission 1: Create the store branches workspace table\nCREATE TABLE store_branches (\n  \n);`,
    validationRules: [
      {
        type: 'TABLE_EXISTS',
        description: 'Verify store_branches table was created with required columns',
        expectedTable: 'store_branches',
        expectedColumns: ['branch_id', 'branch_name', 'city', 'opening_year'],
      },
    ],
    xpReward: 100,
    badge: {
      id: 'badge_db_init',
      title: 'Workspace Architect',
      icon: 'Building2',
    },
  },
  {
    id: 'sm_m2',
    order: 2,
    title: 'Create Product Categories Catalog',
    role: 'Junior Database Executive',
    storyline:
      'Excellent job with the branches table! Now, Head of Merchandising Priya asks you to establish the product categorization schema so thousands of retail items can be cataloged properly.',
    businessProblem:
      'Without an official categories table, cashiers and stock clerks cannot classify items, leading to billing confusion.',
    objective:
      'Create a table named "categories" with category_id (INTEGER PRIMARY KEY AUTOINCREMENT), category_name (TEXT NOT NULL UNIQUE), and description (TEXT).',
    requiredOutcome:
      'Table categories with category_id as primary key and category_name constrained with UNIQUE.',
    checklist: [
      'CREATE TABLE categories',
      'category_id INTEGER PRIMARY KEY AUTOINCREMENT',
      'category_name TEXT NOT NULL UNIQUE',
      'description TEXT',
    ],
    sqlTopics: ['CREATE TABLE', 'AUTOINCREMENT', 'UNIQUE constraint'],
    hints: [
      'Syntax: CREATE TABLE categories (column_name TYPE CONSTRAINTS, ...);',
      'For unique names, use: category_name TEXT NOT NULL UNIQUE',
      'CREATE TABLE categories (\n  category_id INTEGER PRIMARY KEY AUTOINCREMENT,\n  category_name TEXT NOT NULL UNIQUE,\n  description TEXT\n);',
    ],
    sampleSolution: `CREATE TABLE categories (
  category_id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_name TEXT NOT NULL UNIQUE,
  description TEXT
);`,
    solutionExplanation:
      'UNIQUE ensures no two categories share the same name, preventing accidental duplicate departments in the store.',
    initialSqlPlaceholder: `-- Mission 2: Create categories table\nCREATE TABLE categories (\n  \n);`,
    validationRules: [
      {
        type: 'TABLE_EXISTS',
        description: 'Verify categories table structure',
        expectedTable: 'categories',
        expectedColumns: ['category_id', 'category_name', 'description'],
      },
    ],
    xpReward: 100,
  },
  {
    id: 'sm_m3',
    order: 3,
    title: 'Register New Vendor Partnership',
    role: 'Junior Database Executive',
    storyline:
      'FreshMart has finalized an agreement with a premium local agricultural supplier. The procurement manager sends an invoice memo requesting their immediate addition to the suppliers database.',
    businessProblem:
      'FreshRoots Organics must be registered so inbound shipments can be linked to their supplier ID.',
    objective:
      'Insert a new row into "suppliers" with: company_name = "FreshRoots Organics", contact_name = "Kavita Rao", phone = "+91 98888 77777", and city = "Bengaluru".',
    requiredOutcome:
      'A new record in the suppliers table with company_name FreshRoots Organics.',
    checklist: [
      'Use INSERT INTO suppliers (...)',
      'Specify company_name, contact_name, phone, city',
      'Provide corresponding string values enclosed in single quotes',
    ],
    sqlTopics: ['INSERT INTO', 'VALUES', 'String literals'],
    hints: [
      'Use INSERT INTO suppliers (company_name, contact_name, phone, city) VALUES (...);',
      'Remember to wrap string literals in single quotes, e.g., \'FreshRoots Organics\'.',
      "INSERT INTO suppliers (company_name, contact_name, phone, city) VALUES ('FreshRoots Organics', 'Kavita Rao', '+91 98888 77777', 'Bengaluru');",
    ],
    sampleSolution: `INSERT INTO suppliers (company_name, contact_name, phone, city)
VALUES ('FreshRoots Organics', 'Kavita Rao', '+91 98888 77777', 'Bengaluru');`,
    solutionExplanation:
      'INSERT INTO adds new tuples into a relation. By listing the column names explicitly, SQLite maps the values safely even if column orders change.',
    initialSqlPlaceholder: `-- Mission 3: Register FreshRoots Organics into suppliers\nINSERT INTO suppliers (\n  company_name, contact_name, phone, city\n) VALUES (\n  \n);`,
    validationRules: [
      {
        type: 'ROW_EXISTS',
        description: 'Verify FreshRoots Organics is inserted into suppliers',
        expectedTable: 'suppliers',
        expectedWhereClause: "company_name LIKE '%FreshRoots%'",
        expectedRowCount: 1,
      },
    ],
    xpReward: 120,
    badge: {
      id: 'badge_vendor_reg',
      title: 'Supply Chain Partner',
      icon: 'Truck',
    },
  },
  {
    id: 'sm_m4',
    order: 4,
    title: 'Identify Low Stock & Depleted Shelves',
    role: 'Junior Database Executive',
    storyline:
      'Store inventory supervisor Imran Khan is preparing the morning restocking manifest. He notices multiple shelves are sparse and needs an urgent query to pinpoint products in need of replenishment.',
    businessProblem:
      'Stockouts lead to lost revenue and customer frustration. Products whose quantity on hand has fallen strictly below their reorder level must be identified.',
    objective:
      'Write a SELECT query on "inventory" returning product_id, quantity_on_hand, and reorder_level where quantity_on_hand < reorder_level.',
    requiredOutcome:
      'Result set containing records from inventory where quantity_on_hand is less than reorder_level.',
    checklist: [
      'SELECT product_id, quantity_on_hand, reorder_level',
      'FROM inventory',
      'WHERE quantity_on_hand < reorder_level',
    ],
    sqlTopics: ['SELECT', 'WHERE', 'Comparison operators (<)'],
    hints: [
      'Select product_id, quantity_on_hand, and reorder_level from the inventory table.',
      'Filter with a WHERE condition comparing the two columns: quantity_on_hand < reorder_level.',
      'SELECT product_id, quantity_on_hand, reorder_level FROM inventory WHERE quantity_on_hand < reorder_level;',
    ],
    sampleSolution: `SELECT product_id, quantity_on_hand, reorder_level
FROM inventory
WHERE quantity_on_hand < reorder_level;`,
    solutionExplanation:
      'The WHERE clause filters rows based on a boolean predicate. By comparing quantity_on_hand with reorder_level directly across each row, SQL isolates stock deficits instantly.',
    initialSqlPlaceholder: `-- Mission 4: Find products running low on stock\nSELECT product_id, quantity_on_hand, reorder_level\nFROM inventory\nWHERE ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify all products below reorder level are returned',
        expectedQuery:
          'SELECT product_id, quantity_on_hand, reorder_level FROM inventory WHERE quantity_on_hand < reorder_level;',
      },
    ],
    xpReward: 130,
  },
  {
    id: 'sm_m5',
    order: 5,
    title: 'Correct Product Pricing Discrepancy',
    role: 'Junior Database Executive',
    storyline:
      'The pricing compliance auditor flagged an error: Arabica Roasted Coffee Beans 500g (product_id = 1) is currently listed in the database at ₹450.00, but the revised vendor pricing requires it to be ₹480.00.',
    businessProblem:
      'Underpricing premium coffee beans is reducing gross margin on every morning sale.',
    objective:
      'Update the "products" table to set unit_price = 480.00 for product_id = 1.',
    requiredOutcome:
      'The unit_price for product_id 1 is updated to 480.00 while other products remain unchanged.',
    checklist: [
      'Use UPDATE products',
      'SET unit_price = 480.00',
      'WHERE product_id = 1',
    ],
    sqlTopics: ['UPDATE', 'SET', 'WHERE clause safety'],
    hints: [
      'Use the UPDATE command targeting the products table.',
      'Remember the WHERE clause! Without WHERE product_id = 1, all products will be changed.',
      'UPDATE products SET unit_price = 480.00 WHERE product_id = 1;',
    ],
    sampleSolution: `UPDATE products
SET unit_price = 480.00
WHERE product_id = 1;`,
    solutionExplanation:
      'UPDATE modifies existing records. Always include a precise WHERE filter matching the primary key to prevent unintended updates to other records in production.',
    initialSqlPlaceholder: `-- Mission 5: Update the price of product_id 1 to 480.00\nUPDATE products\nSET ...\nWHERE ...;`,
    validationRules: [
      {
        type: 'ROW_EXISTS',
        description: 'Verify product_id 1 has unit_price = 480',
        expectedTable: 'products',
        expectedWhereClause: 'product_id = 1 AND unit_price = 480',
        expectedRowCount: 1,
      },
    ],
    xpReward: 140,
  },
  {
    id: 'sm_m6',
    order: 6,
    title: 'Purge Discontinued Inventory Records',
    role: 'Junior Database Executive',
    storyline:
      'FreshMart has completed its annual catalog cleanup. Several trial products have been permanently discontinued and written off from the warehouse balance sheet.',
    businessProblem:
      'Discontinued products clutter POS searches and confuse floor clerks. Management wants all items with status = "Discontinued" permanently deleted from the products table.',
    objective:
      'Delete all records from "products" where status = "Discontinued".',
    requiredOutcome:
      'Zero records in products with status = "Discontinued". Active items must remain untouched.',
    checklist: [
      'Use DELETE FROM products',
      'WHERE status = \'Discontinued\'',
    ],
    sqlTopics: ['DELETE FROM', 'WHERE filtering'],
    hints: [
      'Use DELETE FROM products WHERE condition.',
      'Match the text status exactly using single quotes: status = \'Discontinued\'.',
      "DELETE FROM products WHERE status = 'Discontinued';",
    ],
    sampleSolution: `DELETE FROM products
WHERE status = 'Discontinued';`,
    solutionExplanation:
      'DELETE FROM removes matching rows from a table. The condition status = \'Discontinued\' targets only obsolete items, keeping active products safe.',
    initialSqlPlaceholder: `-- Mission 6: Remove discontinued products\nDELETE FROM products\nWHERE ...;`,
    validationRules: [
      {
        type: 'ROW_ABSENT',
        description: 'Verify no discontinued items remain in products',
        expectedTable: 'products',
        expectedWhereClause: "status = 'Discontinued'",
      },
    ],
    xpReward: 150,
  },
  {
    id: 'sm_m7',
    order: 7,
    title: 'Investigate Checkout Lane Error',
    role: 'Junior Database Executive',
    storyline:
      'Cashier Tanvi at Register 2 reports a live issue: A shopper attempted to purchase a Wireless Optical Mouse (product_id = 6), but the checkout terminal threw an out-of-stock validation error!',
    businessProblem:
      'Manager Devendra wants you to correlate product details with actual shelf inventory to verify the quantity and aisle location.',
    objective:
      'Write an INNER JOIN between "products" and "inventory" on product_id. Select product_name, quantity_on_hand, and aisle_number for product_id = 6.',
    requiredOutcome:
      'A single row displaying the Wireless Optical Mouse with its quantity_on_hand (0) and aisle_number (Aisle 4).',
    checklist: [
      'SELECT product_name, quantity_on_hand, aisle_number',
      'FROM products JOIN inventory ON products.product_id = inventory.product_id',
      'WHERE products.product_id = 6',
    ],
    sqlTopics: ['INNER JOIN', 'ON clause', 'Multi-table correlation'],
    hints: [
      'Join products (p) and inventory (i) using: JOIN inventory ON products.product_id = inventory.product_id',
      'Select the required columns: product_name, quantity_on_hand, aisle_number.',
      'SELECT p.product_name, i.quantity_on_hand, i.aisle_number FROM products p JOIN inventory i ON p.product_id = i.product_id WHERE p.product_id = 6;',
    ],
    sampleSolution: `SELECT p.product_name, i.quantity_on_hand, i.aisle_number
FROM products p
JOIN inventory i ON p.product_id = i.product_id
WHERE p.product_id = 6;`,
    solutionExplanation:
      'An INNER JOIN combines rows from two tables based on a common attribute (product_id). This allows operational analysts to bridge catalog descriptions with live warehouse stock.',
    initialSqlPlaceholder: `-- Mission 7: Join products and inventory to investigate product 6\nSELECT p.product_name, i.quantity_on_hand, i.aisle_number\nFROM products p\nJOIN inventory i ON ...\nWHERE ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify joined product and inventory details for product_id 6',
        expectedQuery:
          'SELECT p.product_name, i.quantity_on_hand, i.aisle_number FROM products p JOIN inventory i ON p.product_id = i.product_id WHERE p.product_id = 6;',
      },
    ],
    xpReward: 160,
    badge: {
      id: 'badge_investigator',
      title: 'Data Investigator',
      icon: 'Search',
    },
  },
  {
    id: 'sm_m8',
    order: 8,
    title: 'Trace Customer Order Fulfillment',
    role: 'Junior Database Executive',
    storyline:
      'Customer Loyalty Lead Diya wants an audit trail connecting registered customers to the exact items they have ordered across all store transactions.',
    businessProblem:
      'Orders and items reside across multiple normalized tables (customers, orders, order_items). We must link them together.',
    objective:
      'Join "customers", "orders", and "order_items". Select customer_id, first_name, order_id, product_id, and quantity. Order results by order_id, then product_id.',
    requiredOutcome:
      'A multi-table joined dataset ordered by order_id, then product_id.',
    checklist: [
      'SELECT c.customer_id, c.first_name, o.order_id, oi.product_id, oi.quantity',
      'FROM customers c JOIN orders o ON c.customer_id = o.customer_id',
      'JOIN order_items oi ON o.order_id = oi.order_id',
      'ORDER BY o.order_id, oi.product_id',
    ],
    sqlTopics: ['Multi-table JOIN', 'ORDER BY multiple columns', 'Aliasing'],
    hints: [
      'Chain two JOINs: customers -> orders -> order_items.',
      'Use table aliases (c, o, oi) for clarity and brevity.',
      'SELECT c.customer_id, c.first_name, o.order_id, oi.product_id, oi.quantity FROM customers c JOIN orders o ON c.customer_id = o.customer_id JOIN order_items oi ON o.order_id = oi.order_id ORDER BY o.order_id, oi.product_id;',
    ],
    sampleSolution: `SELECT c.customer_id, c.first_name, o.order_id, oi.product_id, oi.quantity
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
ORDER BY o.order_id, oi.product_id;`,
    solutionExplanation:
      'Relational normalization splits business transactions into logical entities. Multi-table JOINs recombine these normalized records cleanly without data redundancy.',
    initialSqlPlaceholder: `-- Mission 8: Connect customers, orders, and order_items\nSELECT c.customer_id, c.first_name, o.order_id, oi.product_id, oi.quantity\nFROM customers c\nJOIN orders o ON ...\nJOIN order_items oi ON ...\nORDER BY ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify 3-table join order details',
        expectedQuery:
          'SELECT c.customer_id, c.first_name, o.order_id, oi.product_id, oi.quantity FROM customers c JOIN orders o ON c.customer_id = o.customer_id JOIN order_items oi ON o.order_id = oi.order_id ORDER BY o.order_id, oi.product_id;',
        orderSensitive: true,
      },
    ],
    xpReward: 180,
    badge: {
      id: 'badge_join_master',
      title: 'Join Master',
      icon: 'GitFork',
    },
  },
  {
    id: 'sm_m9',
    order: 9,
    title: 'Analyze Category-Wise Revenue Performance',
    role: 'Junior Database Executive',
    storyline:
      'Finance Director Mehta is reviewing departmental revenue for the executive board. He requests an aggregated breakdown of sales by category, focusing on top-performing departments.',
    businessProblem:
      'The board needs to know total revenue per product category, filtering only for categories that generated over ₹1,000 in total sales.',
    objective:
      'Calculate total sales revenue per category. Select category_name and SUM(oi.quantity * oi.unit_price) AS total_revenue. Group by category_name, filter for total_revenue > 1000 using HAVING, and sort by total_revenue descending.',
    requiredOutcome:
      'Aggregated category revenue table with total_revenue > 1000, sorted highest to lowest.',
    checklist: [
      'JOIN categories, products, order_items',
      'GROUP BY c.category_name',
      'Calculate SUM(oi.quantity * oi.unit_price) AS total_revenue',
      'Filter with HAVING total_revenue > 1000',
      'ORDER BY total_revenue DESC',
    ],
    sqlTopics: ['GROUP BY', 'SUM', 'HAVING clause', 'Arithmetic expressions'],
    hints: [
      'In SQL, total revenue is computed as SUM(quantity * unit_price).',
      'Remember: Aggregate conditions cannot go into WHERE. Use HAVING total_revenue > 1000.',
      'SELECT c.category_name, SUM(oi.quantity * oi.unit_price) AS total_revenue FROM categories c JOIN products p ON c.category_id = p.category_id JOIN order_items oi ON p.product_id = oi.product_id GROUP BY c.category_name HAVING total_revenue > 1000 ORDER BY total_revenue DESC;',
    ],
    sampleSolution: `SELECT c.category_name, SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM categories c
JOIN products p ON c.category_id = p.category_id
JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY c.category_name
HAVING total_revenue > 1000
ORDER BY total_revenue DESC;`,
    solutionExplanation:
      'GROUP BY groups rows sharing the same category name into summary rows. The HAVING clause applies filters after aggregate computation, unlike WHERE which filters individual rows beforehand.',
    initialSqlPlaceholder: `-- Mission 9: Calculate category-wise sales > 1000\nSELECT c.category_name, SUM(...) AS total_revenue\nFROM categories c\nJOIN products p ON ...\nJOIN order_items oi ON ...\nGROUP BY ...\nHAVING ...\nORDER BY ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify category revenue aggregate calculation',
        expectedQuery:
          'SELECT c.category_name, SUM(oi.quantity * oi.unit_price) AS total_revenue FROM categories c JOIN products p ON c.category_id = p.category_id JOIN order_items oi ON p.product_id = oi.product_id GROUP BY c.category_name HAVING total_revenue > 1000 ORDER BY total_revenue DESC;',
        orderSensitive: true,
      },
    ],
    xpReward: 200,
  },
  {
    id: 'sm_m10',
    order: 10,
    title: 'Generate Final Supermarket Operations Deliverable',
    role: 'Junior Database Executive',
    storyline:
      'Congratulations! You have resolved data issues, audited inventory, and structured the store database. As your capstone assignment, generate the definitive Best-Selling Products metric for the quarterly executive report.',
    businessProblem:
      'The executive operations summary requires the top 3 best-selling products by total units sold across all order items to prioritize warehouse space.',
    objective:
      'Join "products" and "order_items". Select product_name and SUM(oi.quantity) AS units_sold. Group by product_name, order by units_sold descending, and limit to 3.',
    requiredOutcome:
      'Top 3 products with their total units sold, ordered from highest to lowest.',
    checklist: [
      'SELECT p.product_name, SUM(oi.quantity) AS units_sold',
      'FROM products p JOIN order_items oi ON p.product_id = oi.product_id',
      'GROUP BY p.product_name',
      'ORDER BY units_sold DESC',
      'LIMIT 3',
    ],
    sqlTopics: ['GROUP BY', 'SUM', 'ORDER BY DESC', 'LIMIT', 'Final Report Metric'],
    hints: [
      'Aggregate order items grouped by product_name.',
      'Order by units_sold descending and cap the result with LIMIT 3.',
      'SELECT p.product_name, SUM(oi.quantity) AS units_sold FROM products p JOIN order_items oi ON p.product_id = oi.product_id GROUP BY p.product_name ORDER BY units_sold DESC LIMIT 3;',
    ],
    sampleSolution: `SELECT p.product_name, SUM(oi.quantity) AS units_sold
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY p.product_name
ORDER BY units_sold DESC
LIMIT 3;`,
    solutionExplanation:
      'By grouping orders by product and sorting by total units sold with LIMIT 3, SQL delivers executive-ready business intelligence directly from raw transaction logs.',
    initialSqlPlaceholder: `-- Mission 10: Top 3 best-selling products\nSELECT p.product_name, SUM(oi.quantity) AS units_sold\nFROM products p\nJOIN order_items oi ON ...\nGROUP BY ...\nORDER BY ...\nLIMIT 3;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify top 3 best-selling products',
        expectedQuery:
          'SELECT p.product_name, SUM(oi.quantity) AS units_sold FROM products p JOIN order_items oi ON p.product_id = oi.product_id GROUP BY p.product_name ORDER BY units_sold DESC LIMIT 3;',
        orderSensitive: true,
      },
    ],
    xpReward: 250,
    badge: {
      id: 'badge_supermarket_complete',
      title: 'Retail Data Analyst',
      icon: 'Award',
    },
  },
];
