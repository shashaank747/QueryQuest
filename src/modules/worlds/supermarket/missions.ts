import { Mission } from '../../../types/mission';

export const SUPERMARKET_MISSIONS: Mission[] = [
  {
    id: 'sm_m1',
    order: 1,
    title: 'Initialize Supermarket Store Workspace',
    role: 'Junior Database Executive',
    storyline:
      'Welcome to FreshMart Hypermarkets! The leadership team is transitioning from manual binders to SQLite. The database environment (supermarket.db) is already connected and active for you. Your first assignment from Manager Devendra is to establish our store registry schema.',
    businessProblem:
      'The company operates multiple city branches, but branch data is currently unorganized. We need a reliable relational table to register each branch location.',
    objective:
      'Create a table named "store_branches" with columns: branch_id (INTEGER PRIMARY KEY), branch_name (TEXT NOT NULL), city (TEXT NOT NULL), and opening_year (INTEGER). Note: In SQLite, you do not need "CREATE DATABASE" — run "CREATE TABLE" directly.',
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
      'In SQLite, the active database is already open. Do not write "CREATE DATABASE" — begin directly with CREATE TABLE store_branches (...).',
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
      id: 'table_architect',
      title: 'Table Architect',
      icon: 'Database',
    },
  },
  {
    id: 'sm_m2',
    order: 2,
    title: 'Create Store Departments Registry',
    role: 'Junior Database Executive',
    storyline:
      'Excellent job with the branches table! Now, Head of Merchandising Priya asks you to establish the hypermarket departments schema so major retail zones (Produce, Bakery, Electronics, Dairy, Household) can be cataloged properly.',
    businessProblem:
      'Without an official departments registry, staff cannot route inventory shipments to designated floor sections, causing stocking bottlenecks.',
    objective:
      'Create a table named "departments" with department_id (INTEGER PRIMARY KEY AUTOINCREMENT), department_name (TEXT NOT NULL UNIQUE), and description (TEXT).',
    requiredOutcome:
      'Table departments with department_id as auto-incrementing primary key and department_name constrained with UNIQUE.',
    checklist: [
      'CREATE TABLE departments',
      'department_id INTEGER PRIMARY KEY AUTOINCREMENT',
      'department_name TEXT NOT NULL UNIQUE',
      'description TEXT',
    ],
    sqlTopics: ['CREATE TABLE', 'AUTOINCREMENT', 'UNIQUE constraint'],
    hints: [
      'Syntax: CREATE TABLE departments (column_name TYPE CONSTRAINTS, ...);',
      'For unique names, use: department_name TEXT NOT NULL UNIQUE',
      'CREATE TABLE departments (\n  department_id INTEGER PRIMARY KEY AUTOINCREMENT,\n  department_name TEXT NOT NULL UNIQUE,\n  description TEXT\n);',
    ],
    sampleSolution: `CREATE TABLE departments (
  department_id INTEGER PRIMARY KEY AUTOINCREMENT,
  department_name TEXT NOT NULL UNIQUE,
  description TEXT
);`,
    solutionExplanation:
      'UNIQUE ensures no two departments share the same name, preventing accidental duplicate departments in the store directory.',
    initialSqlPlaceholder: `-- Mission 2: Create departments table\nCREATE TABLE departments (\n  \n);`,
    validationRules: [
      {
        type: 'TABLE_EXISTS',
        description: 'Verify departments table structure',
        expectedTable: 'departments',
        expectedColumns: ['department_id', 'department_name', 'description'],
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
      id: 'supply_partner',
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
    title: 'Search Catalog for Organic Products',
    role: 'Junior Database Executive',
    storyline:
      'Health-conscious shoppers are asking our customer service desk for organic food items. Floor Supervisor Imran Khan wants a quick catalog search to find all active organic products so staff can guide shoppers to the right shelves.',
    businessProblem:
      'Floor clerks are unable to quickly find organic products across departments. Management needs a query to locate all active items with "Organic" in their product name.',
    objective:
      'Write a SELECT query on the "products" table returning product_id, product_name, category_id, and unit_price for all products where product_name contains "Organic" and status is "Active".',
    requiredOutcome:
      'Result set containing active products with "Organic" in their name, displaying product_id, product_name, category_id, and unit_price.',
    checklist: [
      'SELECT product_id, product_name, category_id, unit_price',
      'FROM products',
      "WHERE product_name LIKE '%Organic%'",
      "AND status = 'Active'",
    ],
    sqlTopics: ['SELECT', 'WHERE', 'LIKE operator', 'Wildcard (%)', 'Logical AND'],
    hints: [
      "Use the LIKE operator with the '%' wildcard on product_name to search for text patterns: product_name LIKE '%Organic%'.",
      "Add a condition checking status = 'Active' using AND so only active inventory is returned.",
      "SELECT product_id, product_name, category_id, unit_price FROM products WHERE product_name LIKE '%Organic%' AND status = 'Active';",
    ],
    sampleSolution: `SELECT product_id, product_name, category_id, unit_price
FROM products
WHERE product_name LIKE '%Organic%' AND status = 'Active';`,
    solutionExplanation:
      "The LIKE operator performs pattern matching against string data. By wrapping 'Organic' in '%' wildcards (%Organic%), SQLite matches any product name containing 'Organic' anywhere in the title, and the AND status = 'Active' filter excludes obsolete items.",
    initialSqlPlaceholder: `-- Mission 7: Find active organic products in the catalog\nSELECT product_id, product_name, category_id, unit_price\nFROM products\nWHERE ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify active organic products matching the LIKE pattern are returned',
        expectedQuery:
          "SELECT product_id, product_name, category_id, unit_price FROM products WHERE product_name LIKE '%Organic%' AND status = 'Active';",
      },
    ],
    xpReward: 160,
    badge: {
      id: 'data_investigator',
      title: 'Data Investigator',
      icon: 'Search',
    },
  },
  {
    id: 'sm_m8',
    order: 8,
    title: 'Filter Mid-Tier Customer Orders',
    role: 'Junior Database Executive',
    storyline:
      'Store Operations Manager Devendra is conducting a mid-quarter sales analysis. He wants an audit of completed orders within the mid-tier basket range (₹500 to ₹2,500) to optimize register checkout promotions.',
    businessProblem:
      'Management needs to isolate completed orders whose total amount falls between ₹500 and ₹2,500, ordered from highest value to lowest value.',
    objective:
      'Query the "orders" table for orders where status = "Completed" and total_amount is BETWEEN 500 AND 2500. Select order_id, customer_id, order_date, and total_amount, sorted by total_amount in descending order.',
    requiredOutcome:
      'A list of completed orders with total_amount between 500 and 2500, sorted descending by total_amount.',
    checklist: [
      'SELECT order_id, customer_id, order_date, total_amount',
      'FROM orders',
      "WHERE status = 'Completed'",
      'AND total_amount BETWEEN 500 AND 2500',
      'ORDER BY total_amount DESC',
    ],
    sqlTopics: ['SELECT', 'WHERE', 'BETWEEN operator', 'ORDER BY DESC'],
    hints: [
      "Use the BETWEEN operator to specify an inclusive numeric range: total_amount BETWEEN 500 AND 2500.",
      "Ensure you filter for status = 'Completed' and sort the results with ORDER BY total_amount DESC.",
      "SELECT order_id, customer_id, order_date, total_amount FROM orders WHERE status = 'Completed' AND total_amount BETWEEN 500 AND 2500 ORDER BY total_amount DESC;",
    ],
    sampleSolution: `SELECT order_id, customer_id, order_date, total_amount
FROM orders
WHERE status = 'Completed' AND total_amount BETWEEN 500 AND 2500
ORDER BY total_amount DESC;`,
    solutionExplanation:
      'The BETWEEN operator cleanly tests whether an expression falls within an inclusive boundary (equivalent to total_amount >= 500 AND total_amount <= 2500). Sorting by total_amount DESC displays highest-value baskets first.',
    initialSqlPlaceholder: `-- Mission 8: Filter completed orders between 500 and 2500\nSELECT order_id, customer_id, order_date, total_amount\nFROM orders\nWHERE ...\nORDER BY ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify completed orders in the 500-2500 range sorted descending',
        expectedQuery:
          "SELECT order_id, customer_id, order_date, total_amount FROM orders WHERE status = 'Completed' AND total_amount BETWEEN 500 AND 2500 ORDER BY total_amount DESC;",
        orderSensitive: true,
      },
    ],
    xpReward: 180,
  },
  {
    id: 'sm_m9',
    order: 9,
    title: 'Summarize High-Volume Payment Methods',
    role: 'Junior Database Executive',
    storyline:
      'Finance Director Mehta is reviewing store payment channels to negotiate merchant processing fee rates. He needs a summary of total revenue and transaction volumes for payment methods that generated over ₹2,000 in revenue.',
    businessProblem:
      'The accounting team needs aggregated revenue and transaction counts grouped by payment method, filtering only for methods generating more than ₹2,000 in total sales.',
    objective:
      'Query the "payments" table to calculate transaction count and total revenue grouped by payment_method. Select payment_method, COUNT(payment_id) AS total_transactions, and SUM(amount) AS total_revenue. Filter groups using HAVING total_revenue > 2000, and sort by total_revenue descending.',
    requiredOutcome:
      'Aggregated summary showing payment_method, total_transactions, and total_revenue for methods with total_revenue > 2000, ordered from highest to lowest revenue.',
    checklist: [
      'SELECT payment_method, COUNT(payment_id) AS total_transactions, SUM(amount) AS total_revenue',
      'FROM payments',
      'GROUP BY payment_method',
      'HAVING total_revenue > 2000',
      'ORDER BY total_revenue DESC',
    ],
    sqlTopics: ['GROUP BY', 'COUNT', 'SUM', 'HAVING clause', 'ORDER BY DESC'],
    hints: [
      'Group records by payment_method and compute COUNT(payment_id) AS total_transactions and SUM(amount) AS total_revenue.',
      'Filter aggregated group sums using the HAVING clause: HAVING total_revenue > 2000.',
      'SELECT payment_method, COUNT(payment_id) AS total_transactions, SUM(amount) AS total_revenue FROM payments GROUP BY payment_method HAVING total_revenue > 2000 ORDER BY total_revenue DESC;',
    ],
    sampleSolution: `SELECT payment_method, COUNT(payment_id) AS total_transactions, SUM(amount) AS total_revenue
FROM payments
GROUP BY payment_method
HAVING total_revenue > 2000
ORDER BY total_revenue DESC;`,
    solutionExplanation:
      'GROUP BY aggregates individual payment transactions by payment_method. Aggregate functions COUNT() and SUM() calculate totals per group, and HAVING filters the aggregated sums (total_revenue > 2000), unlike WHERE which filters single rows before grouping.',
    initialSqlPlaceholder: `-- Mission 9: Summarize payment methods with revenue > 2000\nSELECT payment_method, COUNT(payment_id) AS total_transactions, SUM(amount) AS total_revenue\nFROM payments\nGROUP BY ...\nHAVING ...\nORDER BY ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify grouped payment revenue and transaction counts with HAVING filter',
        expectedQuery:
          'SELECT payment_method, COUNT(payment_id) AS total_transactions, SUM(amount) AS total_revenue FROM payments GROUP BY payment_method HAVING total_revenue > 2000 ORDER BY total_revenue DESC;',
        orderSensitive: true,
      },
    ],
    xpReward: 200,
    badge: {
      id: 'aggregate_wizard',
      title: 'Aggregate Wizard',
      icon: 'BarChart2',
    },
  },
  {
    id: 'sm_m10',
    order: 10,
    title: 'Generate Final Supermarket Operations Deliverable',
    role: 'Junior Database Executive',
    storyline:
      'Congratulations on structuring the store database and auditing transactions! As your capstone assignment, Head of Customer Loyalty Diya requests the definitive Top 3 Customers report by total spending across all store orders for the quarterly executive meeting.',
    businessProblem:
      'The executive operations summary requires the top 3 customers by total spending, along with their order counts, to invite them to the VIP loyalty program.',
    objective:
      'Query the "orders" table. Select customer_id, COUNT(order_id) AS total_orders, and SUM(total_amount) AS total_spent. Group by customer_id, order by total_spent descending, and limit the results to 3.',
    requiredOutcome:
      'Top 3 customers with their total order count and total spent, ordered from highest to lowest spending.',
    checklist: [
      'SELECT customer_id, COUNT(order_id) AS total_orders, SUM(total_amount) AS total_spent',
      'FROM orders',
      'GROUP BY customer_id',
      'ORDER BY total_spent DESC',
      'LIMIT 3',
    ],
    sqlTopics: ['GROUP BY', 'COUNT', 'SUM', 'ORDER BY DESC', 'LIMIT', 'Final Report Metric'],
    hints: [
      'Aggregate the orders table grouped by customer_id using COUNT(order_id) and SUM(total_amount).',
      'Order the results by total_spent descending and cap with LIMIT 3.',
      'SELECT customer_id, COUNT(order_id) AS total_orders, SUM(total_amount) AS total_spent FROM orders GROUP BY customer_id ORDER BY total_spent DESC LIMIT 3;',
    ],
    sampleSolution: `SELECT customer_id, COUNT(order_id) AS total_orders, SUM(total_amount) AS total_spent
FROM orders
GROUP BY customer_id
ORDER BY total_spent DESC
LIMIT 3;`,
    solutionExplanation:
      'By grouping orders by customer_id and computing aggregate metrics (order count and total expenditure), SQL provides concise customer-level insights. Sorting by total_spent descending with LIMIT 3 isolates the highest-value patrons directly from raw transaction records.',
    initialSqlPlaceholder: `-- Mission 10: Top 3 spending customers\nSELECT customer_id, COUNT(order_id) AS total_orders, SUM(total_amount) AS total_spent\nFROM orders\nGROUP BY ...\nORDER BY ...\nLIMIT 3;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify top 3 spending customers from orders',
        expectedQuery:
          'SELECT customer_id, COUNT(order_id) AS total_orders, SUM(total_amount) AS total_spent FROM orders GROUP BY customer_id ORDER BY total_spent DESC LIMIT 3;',
        orderSensitive: true,
      },
    ],
    xpReward: 250,
    badge: {
      id: 'supermarket_master',
      title: 'Supermarket Operations Certified',
      icon: 'Award',
    },
  },
];

