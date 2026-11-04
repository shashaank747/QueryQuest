export interface FoundationModule {
  id: number;
  title: string;
  category: string;
  summary: string;
  explanation: string;
  syntaxExample: string;
  sqliteNotes: string;
  keyConcepts: string[];
}

export const SQL_FOUNDATION_MODULES: FoundationModule[] = [
  {
    id: 1,
    title: 'Database Fundamentals',
    category: 'Architecture',
    summary: 'The building blocks of relational databases, schemas, tables, and relationships.',
    explanation:
      'A relational database organizes data into two-dimensional tables (relations) comprised of rows (records) and columns (attributes). Each record is identified by a unique Primary Key, and relationships between tables are established using Foreign Keys.',
    syntaxExample: `-- A relational structure links parent and child entities
-- Customers (Parent) 1 <---> M Orders (Child)`,
    sqliteNotes:
      'SQLite is a serverless, self-contained, transactional SQL database engine. The entire database is contained within a single disk file.',
    keyConcepts: ['Tables, Rows, and Columns', 'Primary Keys', 'Foreign Keys', 'Relational Schemas'],
  },
  {
    id: 2,
    title: 'SQLite Data Types',
    category: 'Schema Design',
    summary: 'Storage classes in SQLite: INTEGER, TEXT, REAL, BLOB, and NULL handling.',
    explanation:
      'SQLite uses dynamic type affinity with 5 fundamental storage classes:\n- INTEGER: Signed integer (up to 8 bytes)\n- REAL: Floating point number (IEEE 8-byte floating point)\n- TEXT: String stored using database encoding (UTF-8)\n- BLOB: Binary large object stored exactly as input\n- NULL: Represents missing or unknown data.',
    syntaxExample: `CREATE TABLE sample_types (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL DEFAULT 0.0,
  is_active INTEGER CHECK(is_active IN (0, 1)), -- SQLite uses 0/1 for booleans
  created_at TEXT DEFAULT CURRENT_TIMESTAMP     -- Stored as ISO-8601 string
);`,
    sqliteNotes:
      'SQLite does not have dedicated BOOLEAN or DATE types; booleans are stored as INTEGER (0 or 1), and dates as TEXT (ISO-8601 format like "2024-10-01 14:30:00").',
    keyConcepts: ['INTEGER', 'TEXT', 'REAL', 'NULL handling', 'ISO-8601 Dates'],
  },
  {
    id: 3,
    title: 'Database & Table Creation (DDL)',
    category: 'DDL',
    summary: 'Defining schemas with CREATE TABLE, ALTER TABLE, and DROP TABLE.',
    explanation:
      'Data Definition Language (DDL) creates and modifies database structures. CREATE TABLE defines the entity structure, column specifications, and integrity constraints.',
    syntaxExample: `CREATE TABLE IF NOT EXISTS products (
  product_id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_name TEXT NOT NULL,
  unit_price REAL NOT NULL CHECK(unit_price >= 0),
  category_id INTEGER REFERENCES categories(category_id)
);

ALTER TABLE products ADD COLUMN stock_alert INTEGER DEFAULT 0;
DROP TABLE IF EXISTS obsolete_staging;`,
    sqliteNotes:
      'SQLite creates tables within the active file. SQLite supports ALTER TABLE for RENAME TABLE and ADD COLUMN, and in modern versions RENAME COLUMN and DROP COLUMN.',
    keyConcepts: ['CREATE TABLE', 'DROP TABLE', 'ALTER TABLE', 'AUTOINCREMENT'],
  },
  {
    id: 4,
    title: 'Data Manipulation (DML)',
    category: 'DML',
    summary: 'Modifying table records with INSERT, UPDATE, and DELETE.',
    explanation:
      'Data Manipulation Language (DML) manages data inside tables. INSERT adds new rows, UPDATE alters values in existing rows matching a filter, and DELETE removes matching rows.',
    syntaxExample: `-- 1. Insert new row
INSERT INTO customers (first_name, last_name, email)
VALUES ('Dev', 'Sharma', 'dev.s@example.com');

-- 2. Update specific record
UPDATE products
SET unit_price = 480.00
WHERE product_id = 1;

-- 3. Delete matching records
DELETE FROM products
WHERE status = 'Discontinued';`,
    sqliteNotes:
      'Always test your WHERE condition with a SELECT before issuing UPDATE or DELETE to prevent unintended record loss.',
    keyConcepts: ['INSERT INTO ... VALUES', 'UPDATE ... SET', 'DELETE FROM', 'WHERE safety'],
  },
  {
    id: 5,
    title: 'Data Querying (DQL)',
    category: 'Querying',
    summary: 'Retrieving data with SELECT, WHERE, ORDER BY, LIMIT, and logical operators.',
    explanation:
      'The SELECT statement retrieves rows and columns from tables. You filter rows with WHERE, eliminate duplicates with DISTINCT, sort with ORDER BY, and limit result size with LIMIT.',
    syntaxExample: `SELECT DISTINCT category_id, product_name, unit_price
FROM products
WHERE unit_price BETWEEN 100 AND 500
  AND status = 'Active'
ORDER BY unit_price DESC
LIMIT 10;`,
    sqliteNotes:
      'Text matching with LIKE is case-insensitive in SQLite for ASCII characters by default.',
    keyConcepts: ['SELECT & DISTINCT', 'WHERE conditions', 'ORDER BY & LIMIT', 'AND, OR, NOT, IN, BETWEEN, LIKE'],
  },
  {
    id: 6,
    title: 'Constraints and Relationships',
    category: 'Data Integrity',
    summary: 'Enforcing referential integrity and data validity across entities.',
    explanation:
      'Constraints guarantee data validity and referential integrity:\n- PRIMARY KEY: Uniquely identifies each record\n- FOREIGN KEY: Enforces referential integrity with a parent table\n- NOT NULL: Forbids NULL values\n- UNIQUE: Ensures no duplicates in a column\n- CHECK: Validates custom expressions (e.g. price > 0).',
    syntaxExample: `CREATE TABLE order_items (
  item_id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);`,
    sqliteNotes:
      'In SQLite, foreign key enforcement must be explicitly enabled per connection via "PRAGMA foreign_keys = ON;". QueryQuest enables this automatically.',
    keyConcepts: ['PRIMARY KEY', 'FOREIGN KEY', 'CHECK constraints', 'Referential Integrity'],
  },
  {
    id: 7,
    title: 'Joins & Multi-Table Queries',
    category: 'Relational Queries',
    summary: 'Connecting related tables using INNER JOIN, LEFT JOIN, and CROSS JOIN.',
    explanation:
      'Joins combine columns from one or more tables using matching values in relational keys.\n- INNER JOIN returns rows with matches in both tables.\n- LEFT JOIN returns all rows from the left table and matched rows from the right table (NULL if no match).\n- CROSS JOIN produces the Cartesian product.',
    syntaxExample: `SELECT 
  o.order_id,
  c.first_name || ' ' || c.last_name AS customer_name,
  p.product_name,
  oi.quantity,
  oi.unit_price * oi.quantity AS line_total
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN order_items oi ON o.order_id = oi.order_id
INNER JOIN products p ON oi.product_id = p.product_id
WHERE o.status = 'Completed';`,
    sqliteNotes:
      'SQLite natively supports INNER JOIN, LEFT OUTER JOIN, and CROSS JOIN. SQLite does not natively support RIGHT JOIN or FULL OUTER JOIN (emulated via UNION of LEFT JOINs).',
    keyConcepts: ['INNER JOIN', 'LEFT JOIN', 'Table Aliases', 'Join Predicates ON'],
  },
  {
    id: 8,
    title: 'Aggregate Functions & Grouping',
    category: 'Aggregation',
    summary: 'Summarizing data with COUNT, SUM, AVG, MIN, MAX, GROUP BY, and HAVING.',
    explanation:
      'Aggregate functions perform a calculation on a set of rows and return a single value. GROUP BY groups rows that have the same values into summary rows. HAVING filters aggregated groups.',
    syntaxExample: `SELECT 
  category_id,
  COUNT(*) AS total_products,
  ROUND(AVG(unit_price), 2) AS avg_price,
  MIN(unit_price) AS min_price,
  MAX(unit_price) AS max_price
FROM products
WHERE status = 'Active'
GROUP BY category_id
HAVING COUNT(*) >= 3
ORDER BY avg_price DESC;`,
    sqliteNotes:
      'WHERE filters individual rows before aggregation occurs; HAVING filters aggregated groups after the GROUP BY calculation.',
    keyConcepts: ['COUNT, SUM, AVG, MIN, MAX', 'GROUP BY clause', 'HAVING clause'],
  },
  {
    id: 9,
    title: 'Advanced SQL & Subqueries',
    category: 'Advanced',
    summary: 'Subqueries, Common Table Expressions (WITH / CTEs), CASE expressions, and Views.',
    explanation:
      'Modern SQL allows modular, readable data transformations using Subqueries, Common Table Expressions (WITH clauses), conditional CASE expressions, and stored Views.',
    syntaxExample: `-- Common Table Expression (CTE)
WITH HighValueOrders AS (
  SELECT order_id, SUM(quantity * unit_price) AS order_total
  FROM order_items
  GROUP BY order_id
  HAVING order_total > 2000
)
SELECT o.order_id, o.customer_id, hvo.order_total
FROM orders o
JOIN HighValueOrders hvo ON o.order_id = hvo.order_id;`,
    sqliteNotes:
      'SQLite 3.25+ supports Common Table Expressions, recursive CTEs, and standard window functions (ROW_NUMBER, RANK, DENSE_RANK).',
    keyConcepts: ['Subqueries (Scalar & Correlated)', 'Common Table Expressions (CTEs)', 'CASE expressions', 'Views'],
  },
];
