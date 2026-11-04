# QueryQuest

> **Real-world problems. SQL-powered solutions.**

QueryQuest is a lightweight, game-based SQL learning platform where students learn SQL by stepping into authentic business environments called **Worlds** and solving realistic operational problems.

Instead of reading dry tutorials or filling in artificial trivia, students join organizations as junior database analysts, inspect live database schemas, write real SQL queries, troubleshoot broken inventory workflows, and compile dynamic executive business reports.

---

## 🌟 Key Features

- **Genuine In-Browser SQLite Engine**:
  - Powered by WebAssembly (`sql.js`) executing inside a dedicated **Web Worker**.
  - Off-main-thread query processing prevents UI lag, stutters, and page freezes.
  - Safe execution timeouts watchdog against infinite cartesian joins or recursive CTEs.
- **Professional SQL Editor**:
  - Embedded **Monaco Editor** with SQL syntax highlighting, auto-completion, line numbers, formatting, and query history.
  - Direct keyboard shortcuts (`Ctrl+Enter` to run, `Ctrl+Shift+Enter` to submit objective).
- **Intelligent Validation Engine**:
  - Validates actual business outcomes, not superficial string matches or regex keywords.
  - Supports multiple valid SQL approaches (case-insensitive column matching, order-insensitivity when appropriate, numeric normalization).
  - Inspects SQLite schema catalog (`PRAGMA table_info`, `PRAGMA foreign_key_list`) and live database record mutations.
- **Progressive Hint & Diagnostic Feedback**:
  - 3-tier progressive hint system (Conceptual &rarr; Directional &rarr; Detailed SQL snippet).
  - Translates raw SQLite error messages into contextual educational guidance with targeted suggestions.
  - Full educational solution breakdowns accessible on completion or after repeated attempts.
- **Local Persistence via IndexedDB**:
  - Persists database binary snapshots per world so modifications and table states survive browser refreshes.
  - Checkpoints and clean database reset capabilities.
- **Live SQL Business Reports**:
  - Compiles executive deliverable reports with real-time aggregated metrics, velocity rankings, and lightweight SVG charts generated directly from SQLite.
- **Gamification & Learning Analytics**:
  - XP progression, levels, badges, and streaks designed to reward problem-solving and understanding over mere typing speed.
- **SQL Foundation Reference Hub**:
  - 9 integrated modules covering Database Fundamentals, SQLite Data Types, DDL, DML, DQL, Constraints, Joins, Aggregates, and Advanced SQL with SQLite dialect guidance.

---

## 🛒 World 1: Supermarket Operations (Complete & Playable)

Step into **FreshMart Hypermarkets** as a Junior Database Executive:
1. **Initialize Supermarket Store Workspace**: Design and create the `store_branches` table with PRIMARY KEY and NOT NULL constraints.
2. **Create Product Categories Catalog**: Deploy the `categories` schema with AUTOINCREMENT and UNIQUE constraints.
3. **Register New Vendor Partnership**: Insert vendor partnership records into `suppliers`.
4. **Identify Low Stock & Depleted Shelves**: Query `inventory` to catch stock deficits (`quantity_on_hand < reorder_level`).
5. **Correct Product Pricing Discrepancy**: Apply targeted `UPDATE ... WHERE` to fix wholesale coffee bean audit errors.
6. **Purge Discontinued Inventory Records**: Execute referentially safe `DELETE` operations on obsolete SKUs.
7. **Investigate Checkout Lane Error**: Join `products` and `inventory` to diagnose an out-of-stock barcode scan error at Register 2.
8. **Trace Customer Order Fulfillment**: Build a 3-table relational `JOIN` connecting `customers`, `orders`, and `order_items`.
9. **Analyze Category-Wise Revenue Performance**: Group sales by merchandise line with `GROUP BY`, `SUM()`, and `HAVING total_revenue > 1000`.
10. **Generate Final Supermarket Operations Deliverable**: Compute top best-selling products velocity and compile the live Executive Audit Report.

---

## 🚀 Performance & Lightweight Architecture

Unlike heavy 3D game engines that consume hundreds of megabytes of RAM and GPU, QueryQuest is engineered for extreme efficiency:
- **Production Bundle**: Under **100 kB** gzipped JavaScript (+ WebAssembly binary).
- **Download Budget**: Zero continuous 3D rendering loops or idle CPU drain.
- **Instant Boot**: Boots in milliseconds in any modern browser.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **SQL Editor**: Monaco Editor (`@monaco-editor/react`)
- **SQL Engine**: SQLite 3 compiled to WebAssembly (`sql.js`) in a dedicated Web Worker
- **State Management**: Zustand
- **Local Persistence**: IndexedDB (`idb`)
- **Testing**: Vitest, React Testing Library, Playwright

---

## 💻 Getting Started

### Prerequisites

- Node.js 18+ (tested on Node 20 / 24)
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/queryquest.git
cd queryquest

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser at `http://localhost:3000` to start solving missions.

### Running Unit & Integration Tests

```bash
# Run Vitest test suite
npm test

# Run tests in watch mode
npm run test:watch
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🗺️ Roadmap & Additional Worlds

- [x] Phase 1: Application Foundation & Dashboard
- [x] Phase 2: Core Web Worker SQLite WASM Engine & Monaco Editor
- [x] Phase 3: Mission & Validation Engine with Multi-Solution Support
- [x] Phase 4: World 1 — Supermarket Operations (10 missions & live report)
- [x] Phase 5: SQL Foundation Hub (9 reference modules) & Gamification
- [ ] World 2: Airport Operations (Concourse gates, radar states, baggage routing)
- [ ] World 3: Warehouse Management (Pallet staging, cross-docking, supplier lead times)
- [ ] World 4: Hospital Administration (Doctor appointments, emergency admissions, bed allocation)
- [ ] World 5: Bank Operations (ACID transactions, atomic transfers, audit log fraud detection)
