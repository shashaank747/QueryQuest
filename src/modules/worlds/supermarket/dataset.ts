/**
 * World 1: Supermarket Operations
 * Synthetic realistic business dataset
 */

export const SUPERMARKET_FULL_SEED = `
-- Initial Suppliers
INSERT INTO suppliers (company_name, contact_name, phone, city) VALUES
('Apex Foods Ltd', 'Rohan Sharma', '+91 98200 12345', 'Mumbai'),
('TechSupply India', 'Priya Menon', '+91 98450 54321', 'Bengaluru'),
('DairyBest Co-op', 'Anil Deshmukh', '+91 97654 11223', 'Pune'),
('Global Grain Traders', 'Vikram Patel', '+91 99000 88776', 'Ahmedabad'),
('GreenFarm Organic', 'Sunita Rao', '+91 94480 33445', 'Hyderabad');
`;

export const SUPERMARKET_CATALOG_AND_SALES_SEED = `
-- Products
CREATE TABLE IF NOT EXISTS products (
  product_id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_name TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  supplier_id INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  status TEXT DEFAULT 'Active',
  FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);

INSERT OR IGNORE INTO products (product_id, product_name, category_id, supplier_id, unit_price, status) VALUES
(1, 'Arabica Roasted Coffee Beans 500g', 1, 1, 450.00, 'Active'),
(2, 'Organic Green Tea 100 bags', 1, 1, 280.00, 'Active'),
(3, 'Fresh Cow Milk 1L', 2, 3, 62.00, 'Active'),
(4, 'Pure Salted Butter 500g', 2, 3, 260.00, 'Active'),
(5, 'Paneer Block 200g', 2, 3, 95.00, 'Active'),
(6, 'Wireless Optical Mouse', 3, 2, 499.00, 'Active'),
(7, 'Braided USB-C Cable 2m', 3, 2, 199.00, 'Active'),
(8, 'Ergonomic Laptop Stand', 3, 2, 1299.00, 'Active'),
(9, 'Multigrain Artisan Bread 400g', 4, 1, 55.00, 'Active'),
(10, 'Oat & Honey Digestive Biscuits', 4, 1, 85.00, 'Active'),
(11, 'Basmati Rice Premium 5kg', 5, 4, 620.00, 'Active'),
(12, 'Cold-Pressed Mustard Oil 1L', 5, 4, 190.00, 'Active'),
(13, 'Chana Dal Super Polish 1kg', 5, 4, 115.00, 'Active'),
(14, 'Old Discontinued Soda Can', 1, 1, 35.00, 'Discontinued'),
(15, 'Defective Batch USB Hub', 3, 2, 299.00, 'Discontinued');

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  inventory_id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER UNIQUE NOT NULL,
  quantity_on_hand INTEGER NOT NULL,
  reorder_level INTEGER NOT NULL,
  aisle_number TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

INSERT OR IGNORE INTO inventory (product_id, quantity_on_hand, reorder_level, aisle_number) VALUES
(1, 45, 15, 'Aisle 1'),
(2, 18, 20, 'Aisle 1'),
(3, 85, 30, 'Cold Storage 1'),
(4, 12, 15, 'Cold Storage 2'),
(5, 14, 20, 'Cold Storage 2'),
(6, 0, 10, 'Aisle 4'), -- Stock 0 causes checkout bug!
(7, 60, 25, 'Aisle 4'),
(8, 22, 10, 'Aisle 4'),
(9, 30, 15, 'Aisle 2'),
(10, 110, 40, 'Aisle 2'),
(11, 40, 20, 'Aisle 5'),
(12, 16, 20, 'Aisle 5'),
(13, 75, 25, 'Aisle 5'),
(14, 0, 0, 'Backroom Waste'),
(15, 0, 0, 'Backroom Waste');

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  order_id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  employee_id INTEGER NOT NULL,
  order_date TEXT NOT NULL,
  total_amount REAL NOT NULL,
  status TEXT DEFAULT 'Completed'
);

INSERT OR IGNORE INTO orders (order_id, customer_id, employee_id, order_date, total_amount, status) VALUES
(101, 1, 3, '2024-10-01', 1239.00, 'Completed'),
(102, 2, 3, '2024-10-01', 2598.00, 'Completed'),
(103, 3, 4, '2024-10-02', 377.00, 'Completed'),
(104, 4, 4, '2024-10-03', 1845.00, 'Completed'),
(105, 5, 3, '2024-10-03', 475.00, 'Completed'),
(106, 6, 4, '2024-10-04', 3897.00, 'Completed'),
(107, 7, 3, '2024-10-04', 190.00, 'Completed'),
(108, 8, 4, '2024-10-05', 985.00, 'Completed');

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER UNIQUE NOT NULL,
  payment_method TEXT NOT NULL,
  payment_date TEXT NOT NULL,
  amount REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

INSERT OR IGNORE INTO payments (payment_id, order_id, payment_method, payment_date, amount) VALUES
(1, 101, 'Credit Card', '2024-10-01', 1239.00),
(2, 102, 'UPI', '2024-10-01', 2598.00),
(3, 103, 'Cash', '2024-10-02', 377.00),
(4, 104, 'UPI', '2024-10-03', 1845.00),
(5, 105, 'Debit Card', '2024-10-03', 475.00),
(6, 106, 'Credit Card', '2024-10-04', 3897.00),
(7, 107, 'Cash', '2024-10-04', 190.00),
(8, 108, 'UPI', '2024-10-05', 985.00);
`;
