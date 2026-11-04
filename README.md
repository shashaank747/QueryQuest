# QueryQuest

> **Real-world problems. SQL-powered solutions.**

QueryQuest is a modern, game-based SQL learning platform where students learn SQL by stepping into authentic business environments called **Worlds** and solving realistic operational problems.

Instead of reading dry tutorials or answering disconnected trivia, students enter virtual organizations as junior database analysts, inspect live database schemas, write genuine SQL queries, troubleshoot broken inventory workflows, and compile dynamic executive business reports.

QueryQuest executes **real SQLite queries inside your browser via WebAssembly**, guaranteeing that every query runs against an authentic relational database engine.

---

## 📸 Industry Worlds & Case Studies

QueryQuest features five distinct industry worlds, each designed around realistic relational database scenarios and authentic case study reference environments:

| World | Industry | Reference Environment | Difficulty | Time | SQL Focus | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Supermarket Operations** | Retail & Consumer Goods | Checkout POS station, barcode scanning, grocery aisles | Beginner | 45m | `CREATE TABLE`, `INSERT`, `SELECT`, `UPDATE`, `DELETE`, `JOIN`, `GROUP BY`, `HAVING` | **Playable Now** |
| **Airport Operations** | Aviation & Logistics | Terminal concourse, departure boards (FIDS), aircraft tarmac | Intermediate | 60m | `JOIN`, `LEFT JOIN`, `NULL` handling, Aggregations, Subqueries, CTEs | Coming Soon |
| **Warehouse Management** | Logistics & Supply Chain | Automated conveyors, high-bay pallet racking, forklift telemetry | Intermediate | 50m | CRUD, Multi-table Joins, Date Filtering, Transactions | Coming Soon |
| **Hospital Administration** | Healthcare & Clinical | Clinical reception, admission desks, doctor-patient suites | Advanced | 65m | Multi-way Joins, `GROUP BY`, Date Functions, Window Functions | Coming Soon |
| **Bank Operations** | Banking & Financial Services | Commercial branch counter, tellers, transaction desks | Advanced | 75m | ACID Transactions, `BEGIN`/`COMMIT`/`ROLLBACK`, Audit logs, CTEs | Coming Soon |

---

## 🌟 Core Features & System Architecture

### 1. Genuine Client-Side SQLite Execution Engine
- **WebAssembly Powered**: Runs genuine SQLite 3 compiled to WebAssembly via `sql.js`.
- **Dedicated Web Worker**: All SQL compilation and execution occurs off the main thread in a dedicated Web Worker (`sql.worker.ts`), preventing UI lag, stutters, and page freezes.
- **Cartesian Protection**: 10-second watchdog execution timer guards against accidental infinite cartesian joins or runaway recursive Common Table Expressions.
- **Referential Integrity**: Foreign keys are enforced by default (`PRAGMA foreign_keys = ON;`).
- **Live Catalog Introspection**: Inspects internal tables (`sqlite_master`, `PRAGMA table_info`, `PRAGMA foreign_key_list`) to automatically extract column types, primary keys, and foreign key relations.
- **Microsecond Timing**: Measures query execution down to the exact millisecond (`ms`), reporting affected rows and returned row counts.

### 2. Professional Monaco SQL Editor & IDE
- **Syntax Highlighting & Autocomplete**: Complete SQLite grammar highlighting with SQL keyword suggestions.
- **Resizable 3-Column Layout**:
  - **Left Sidebar**: Mission Briefing, storyline, business problem, and progressive hints.
  - **Center Column**: Monaco SQL Editor (top 52%) + Live Query Results Terminal (bottom 48%).
  - **Right Sidebar**: Database Schema Explorer.
- **Smart Drag Splitters**:
  - Interactive resizers between left/center and center/right panels with hover/active grip indicators.
  - **Strict Minimum Width Constraints**: Left sidebar is limited to stay open at a minimum of **240px**; Right sidebar is limited to stay open at a minimum of **200px**; Center compiler is guaranteed at least **360px** of breathing room (sidebars cannot be collapsed to zero).
  - **Double-Click to Reset**: Double-clicking splitters snaps panels back to their default widths (380px left, 280px right).
  - **Persistent Dimensions**: Custom widths are saved to `localStorage` (`queryquest_left_width`, `queryquest_right_width`).
  - **Full-Screen Drag Shield**: Transparent overlay prevents Monaco editor from capturing mouse events during drag gestures.
- **Editor Controls**:
  - **Run Query** (`Ctrl+Enter` / `⌘+Enter`): Executes the SQL query in sandbox scratchpad mode.
  - **Submit Objective** (`Ctrl+Shift+Enter` / `⌘+Shift+Enter`): Runs query through the multi-solution validation engine against mission objectives.
  - **Select All** button (`Ctrl+A` / `⌘+A`): One-click full text selection.
  - **Reset to Starter** (`RotateCcw`): Re-populates the editor with the mission's default SQL blueprint.
  - **Clear**: Clears the editor canvas.
  - **Query History**: Inspects the last 15 executed queries with execution time, row count, status, and click-to-load.
  - **Keyboard Shortcuts Modal**: Built-in reference for hotkeys.
  - **Accidental Drag Protection**: Configured with `dragAndDrop: false` and `selectOnLineNumbers: true` for clean text highlighting.

### 3. Intelligent Mission Validation Engine
- Validates **actual database results and state changes**, not superficial string matching or brittle regular expressions.
- **Multi-Solution Flexibility**:
  - **Column Order Insensitive**: Students can write `SELECT name, price` or `SELECT price, name`.
  - **Case Insensitive Columns**: Handles `unit_price`, `Unit_Price`, and `UNIT_PRICE` identically.
  - **Numeric Normalization**: Normalizes floats and decimals (`12.5` equals `12.50`).
  - **Whitespace Normalization**: Ignores trailing whitespace, indentation differences, and line endings.
- **Validation Rule Types**:
  - `EXACT_MATCH`: Matches expected result rows and column sets.
  - `SUBSET_MATCH`: Ensures required key records are included.
  - `MIN_ROWS`: Validates minimum threshold of returned records.
  - `ORDER_INSENSITIVE`: Matches output rows regardless of ordering when not explicitly constrained.
  - `TABLE_EXISTS`: Inspects SQLite schema catalog to confirm tables were created with proper column types and constraints.
  - `DML_STATE_CHECK`: Runs secondary inspection queries to verify that `INSERT`, `UPDATE`, or `DELETE` statements mutated target rows without violating foreign keys.

### 4. Interactive Database Schema Explorer
- **Collapsible Table Tree**: Displays all tables in the active world database with live row counts.
- **Instant Search Filter**: Quickly find tables in complex enterprise schemas.
- **Detailed Column Inspector**:
  - Column name and SQLite data type (`INTEGER`, `TEXT`, `REAL`, etc.).
  - Visual badges: `PK` (Primary Key in amber), `FK` (Foreign Key in sky blue), `NOT NULL`, `DEFAULT`.
- **Table Data Preview Modal**: Click the eye icon next to any table to preview its first 100 records in a tabular modal without writing a query manually.
- **One-Click Insert**: Click any table or column name to insert it directly into the Monaco editor.
- **Live Catalog Refresh**: Reloads catalog dynamically after `CREATE TABLE`, `ALTER TABLE`, or `DROP TABLE` operations.

### 5. Progressive Hints & Diagnostic Feedback
- **Educational SQLite Diagnostics**: Translates raw SQLite error messages into targeted guidance:
  - `no such table` &rarr; Suggests checking exact table spelling or creating it first.
  - `no such column` &rarr; Suggests valid column names and table aliases.
  - `near "...": syntax error` &rarr; Highlights missing commas, unclosed quotes, or misspelled keywords.
  - `FOREIGN KEY constraint failed` &rarr; Explains parent/child relationship requirements.
  - `UNIQUE constraint failed` &rarr; Identifies duplicate primary keys.
- **3-Tier Progressive Hints**:
  - Tier 1: Conceptual hint (High-level problem solving approach).
  - Tier 2: Directional hint (Which tables, clauses, or constraints to use).
  - Tier 3: Complete SQL blueprint snippet.
- **Full Solution Breakdown**: Step-by-step explanations available upon mission completion or after 3 attempts.

### 6. Dynamic Executive Business Reports
- Generates live business audit reports calculated entirely from real SQL queries on the active database:
  - **Executive Briefing Memo**: Narrative briefing for senior management.
  - **KPI Stat Counters**: Total gross revenue, stock units on hand, active reorder alerts.
  - **Lightweight SVG Bar Chart**: Visualizes category/department revenue breakdowns.
  - **Product Velocity Rankings Table**: Ranks best-selling products by units sold.
  - **Procurement Reorder List**: Flags low-stock items with shelf and bin locations.
  - **Print / PDF Export**: Formatted for executive sharing.

### 7. SQL Foundation Reference Hub
Integrated 9-module reference guide with practical blueprints and SQLite dialect rules:
- **Module 1**: Database Fundamentals (Tables, rows, schemas, primary keys, relationships).
- **Module 2**: Data Types (`INTEGER`, `TEXT`, `REAL`, `BLOB`, `NULL`, date/time handling).
- **Module 3**: Database & Table Creation (`CREATE TABLE`, `DROP`, `ALTER`, constraints).
- **Module 4**: Data Manipulation (`INSERT`, `UPDATE`, `DELETE`).
- **Module 5**: Data Querying (`SELECT`, `WHERE`, `DISTINCT`, `ORDER BY`, `LIMIT`, logical operators).
- **Module 6**: Constraints & Relationships (`PRIMARY KEY`, `FOREIGN KEY`, `NOT NULL`, `CHECK`, cardinality).
- **Module 7**: Joins (`INNER JOIN`, `LEFT JOIN`, `CROSS JOIN`, SQLite join semantics).
- **Module 8**: Aggregate Functions (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `GROUP BY`, `HAVING`).
- **Module 9**: Advanced SQL (Subqueries, Common Table Expressions `WITH`, `CASE`, `UNION`, Views).

### 8. Adaptive Themes (`slate-100` Light & `slate-950` Dark)
- **Default Theme**: **Slate-100 Light Mode** (`#f1f5f9`), crisp white surface cards (`bg-white`), dark slate typography, and emerald accents.
- **Header Theme Toggle**: Switch seamlessly between `slate-100` light and `slate-950` dark mode.
- **Monaco Synchronization**: Editor switches automatically between `vs` and `vs-dark` themes.
- **Persistence**: Theme selection is saved to `localStorage` (`queryquest_theme`).

### 9. Gamification & Audio Synthesizer
- **XP Progression & Levels**: Earn XP for solving missions, running queries, and completing worlds.
- **Badges & Achievements**: Unlock milestones like *First Query Executed*, *Workspace Architect*, *Join Master*, *Audit Specialist*, and *Report Producer*.
- **Procedural Sound Engine**: Powered by the Web Audio API without any external MP3/WAV downloads. Synthesizes click feedback, run query sounds, success chimes, and level-up flourishes. Can be muted anytime via the header toggle.

### 10. Offline Persistence (IndexedDB)
- Uses `idb` to persist complete SQLite database binary snapshots (`Uint8Array`) per world.
- Changes survive browser reloads and offline sessions.
- **Workspace Reset**: Includes a "Reset DB" feature to re-seed initial clean datasets at any time.

---

## 🛒 World 1: Supermarket Operations (Playable Curriculum)

Students join **FreshMart Hypermarkets Ltd.** as a Junior Database Executive under Operations Manager Devendra.

### Database Schema (9 Tables)
1. `products` (product_id, product_name, category_id, supplier_id, unit_price, cost_price, barcode, status)
2. `categories` (category_id, category_name, department, description)
3. `suppliers` (supplier_id, company_name, contact_name, phone, email, city)
4. `customers` (customer_id, first_name, last_name, email, phone, loyalty_tier)
5. `employees` (employee_id, first_name, last_name, role, department, salary, hire_date)
6. `orders` (order_id, customer_id, employee_id, order_date, total_amount, status)
7. `order_items` (item_id, order_id, product_id, quantity, unit_price, discount)
8. `payments` (payment_id, order_id, payment_method, amount, payment_date, status)
9. `inventory` (inventory_id, product_id, quantity_on_hand, reorder_level, shelf_location, last_restocked)

### Missions
1. **Initialize Supermarket Store Workspace**: `CREATE TABLE store_branches` with `INTEGER PRIMARY KEY` and `NOT NULL` constraints.
2. **Create Product Categories Catalog**: `CREATE TABLE categories` with `AUTOINCREMENT` and `UNIQUE` constraints.
3. **Register New Vendor Partnership**: `INSERT INTO suppliers` with vendor contact information.
4. **Identify Low Stock & Depleted Shelves**: Filter `inventory` where `quantity_on_hand < reorder_level`.
5. **Correct Product Pricing Discrepancy**: Use `UPDATE products SET unit_price = ... WHERE product_name = ...` to fix pricing audits.
6. **Purge Discontinued Inventory Records**: Execute referentially safe `DELETE` queries on obsolete inventory items.
7. **Investigate Checkout Lane Error**: Build an `INNER JOIN` between `products` and `inventory` to diagnose out-of-stock register exceptions.
8. **Trace Customer Order Fulfillment**: Multi-table relational `JOIN` connecting `customers`, `orders`, and `order_items`.
9. **Analyze Category-Wise Revenue Performance**: Group sales by merchandise department using `GROUP BY`, `SUM()`, and `HAVING total_revenue > 1000`.
10. **Generate Final Supermarket Operations Deliverable**: Compute product velocity rankings and compile the live Executive Audit Report.

---

## ⚡ Performance & Bundle Metrics

| Metric | Measurement |
| :--- | :--- |
| **Gzipped JavaScript Bundle** | **~103 kB** (`dist/assets/index-*.js`) |
| **Gzipped CSS Bundle** | **~7.3 kB** (`dist/assets/index-*.css`) |
| **Web Worker Bundle** | **44.4 kB** (`dist/assets/sql.worker-*.js`) |
| **Initial Boot Time** | **< 300 ms** in modern browsers |
| **Main Thread Overhead** | **0 ms** during query execution (dedicated worker) |

---

## 🛠️ Technology Stack

- **UI & State**: React 18, TypeScript, Tailwind CSS, Zustand, Lucide Icons
- **SQL Editor**: Monaco Editor (`@monaco-editor/react`)
- **SQL Engine**: SQLite 3 compiled to WebAssembly via `sql.js` (Web Worker isolation)
- **Local Persistence**: IndexedDB (`idb`)
- **Audio**: Web Audio API Procedural Synthesizer
- **Testing**: Vitest, React Testing Library, Playwright
- **Build Tooling**: Vite 6, PostCSS, TypeScript 5

---

## 💻 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node 20 / 22 / 24)
- npm 9+

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/your-username/quest-quary.git
cd quest-quary

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

### Test Suite Execution

```bash
# Run Vitest automated test suite (18 unit & mission tests)
npm test

# Run tests in watch mode
npm run test:watch
```

### Production Build

```bash
# Type check and build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

---

## ⌨️ Keyboard Shortcuts Reference

| Shortcut | Description |
| :--- | :--- |
| `Ctrl + Enter` / `⌘ + Enter` | Run SQL query in scratchpad mode |
| `Ctrl + Shift + Enter` / `⌘ + Shift + Enter` | Submit query for mission objective validation |
| `Ctrl + A` / `⌘ + A` | Select all query text in the editor |
| `Ctrl + /` / `⌘ + /` | Toggle SQL line comments (`--`) |
| `Tab` / `Shift + Tab` | Indent / Unindent selected lines |
| `Esc` | Close active modals and table preview dialogs |
| `Double-click splitter` | Reset left/right sidebar to default width |

---

## 📄 License

QueryQuest is licensed under the **MIT License**.
