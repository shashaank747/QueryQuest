# Quest Query

<p align="center">
  <img src="public/logo.png" alt="Quest Query - Learn SQL Through Real-World Missions" width="380" />
</p>

<p align="center">
  <strong>Real-world problems. Data-powered solutions.</strong>
</p>

<p align="center">
  <a href="https://query-quest-livid.vercel.app/"><img src="https://img.shields.io/badge/Live_Demo-query--quest--livid.vercel.app-10b981.svg?style=flat-square&logo=vercel" alt="Live Demo on Vercel" /></a>
  <a href="#-data-tracks-hub"><img src="https://img.shields.io/badge/Tracks-Excel_•_MySQL_•_Power_BI-0ea5e9.svg?style=flat-square" alt="Data Tracks" /></a>
  <a href="#-tier-based-world-progression--locking"><img src="https://img.shields.io/badge/Worlds-6_Interactive_Worlds-f59e0b.svg?style=flat-square" alt="6 Worlds" /></a>
  <a href="#-industry-worlds--curriculum"><img src="https://img.shields.io/badge/Missions-43_Enterprise_Scenarios-10b981.svg?style=flat-square" alt="43 Missions" /></a>
  <a href="#-technology-stack"><img src="https://img.shields.io/badge/SQLite-WASM_In--Browser-0284c7.svg?style=flat-square" alt="SQLite WASM" /></a>
  <a href="#-technology-stack"><img src="https://img.shields.io/badge/Editor-Monaco_IDE-6366f1.svg?style=flat-square" alt="Monaco Editor" /></a>
  <a href="#-test-suite-execution"><img src="https://img.shields.io/badge/Tests-219_Passed-emerald.svg?style=flat-square" alt="Test Status" /></a>
  <a href="#-license"><img src="https://img.shields.io/badge/License-MIT-amber.svg?style=flat-square" alt="License" /></a>
</p>

---

## 🌐 Live Application

Play **Quest Query** instantly in your browser with zero installation:  
👉 **[https://query-quest-livid.vercel.app/](https://query-quest-livid.vercel.app/)**

> **Zero Server Overhead**: The entire relational database engine runs client-side inside your browser using **SQLite 3 compiled to WebAssembly**. All queries, schema mutations, and data persistence happen locally with 0ms server latency.

---

## 📖 Overview

**Quest Query** is an immersive enterprise data simulation platform where learners master real data tools by stepping into authentic organizations and solving live operational crises.

Traditional courses teach syntax in sterile isolation with trivial queries like `SELECT * FROM employees`. **Quest Query** places you inside realistic operational environments: you investigate actual corporate schemas, troubleshoot broken inventory pipelines, reconcile multi-terminal flight delays, ensure atomic financial transfers, and generate boardroom-ready executive intelligence.

---

## 🎯 Data Tracks Hub

Quest Query features a curated track selection portal introducing the essential pillars of modern corporate data analytics:

```
                                  ┌────────────────────────┐
                                  │   QUEST QUERY PORTAL   │
                                  └───────────┬────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    ▼                         ▼                         ▼
         ┌────────────────────┐    ┌────────────────────┐    ┌────────────────────┐
         │       Excel        │    │       MySQL        │    │      Power BI      │
         │  (Spreadsheets &   │    │ (Enterprise World  │    │   (Dashboards &    │
         │Financial Modeling) │    │    Simulation)     │    │        DAX)        │
         │   [Coming Soon]    │    │   [Playable Now]   │    │   [Coming Soon]    │
         └────────────────────┘    └──────────┬─────────┘    └────────────────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
         ┌─────────────────────────┐                     ┌─────────────────────────┐
         │ TIER 1: BEGINNER (100%) │  ──(Complete 2)──▶  │ TIER 2: INTERMEDIATE    │
         │ Supermarket, Namma Metro│                     │ Airport, Warehouse      │
         │  [Unlocked by Default]  │                     │   [Requires 2/2 T1]     │
         └─────────────────────────┘                     └────────────┬────────────┘
                                                                      │
                                                          (Complete 2)│
                                                                      ▼
                                                         ┌─────────────────────────┐
                                                         │ TIER 3: ADVANCED        │
                                                         │ Hospital, Bank          │
                                                         │   [Requires 2/2 T2]     │
                                                         └─────────────────────────┘
```

### 1. Excel (Spreadsheets & Financial Modeling) &bull; *Coming Soon*
- Master the corporate workhorse: dynamic multi-tier commissions, supplier inventory reconciliation, financial 3-statement modeling, and what-if scenarios.
- Topics: `XLOOKUP`, nested dynamic arrays, pivot intelligence, and sensitivity solvers.
- 15 planned hands-on workbooks.

### 2. MySQL (Relational Databases & Enterprise Simulation) &bull; *Playable Now*
- The flagship Quest Query simulation: 6 interactive industry worlds and 43 progressive missions running on an in-browser SQLite WASM engine.
- Structured across 3 pedagogical tiers: **Beginner** (100% single-table mastery), **Intermediate** (relational multi-table joins & dates), and **Advanced** (subqueries, CTEs, self-joins, window functions & ACID transactions).
- 100% playable client-side with zero latency.

### 3. Power BI (Business Intelligence & Dashboards) &bull; *Coming Soon*
- Transform raw corporate data into interactive executive war-rooms.
- Topics: Star schemas, DAX time-intelligence measures, KPI gauges, and cross-filtering visual storytelling.
- 12 planned dashboards.

---

## 🔒 Tier-Based World Progression & Locking System (3x3 Model)

To guarantee a pedagogically sound learning curve, Quest Query organizes worlds into **Skill Tiers** with a **"Play Any 2 to Unlock Next Tier"** progression rule:

1. **Tier 1: Beginner Worlds** (*Supermarket Operations* & *Namma Metro — Transit Command*):
   - **Unlocked by default** for all players.
   - **Zero-Join Focus**: Dedicated 100% to single-table mastery (table creation, strict constraints, batch inserts, range/pattern filtering, conditional updates, safe deletes, and single-table aggregations).
   - Playing a 2nd world in the tier acts as **spaced repetition & revision**, reinforcing identical SQL concepts in a completely fresh business domain.
2. **Tier 2: Intermediate Worlds** (*Airport Operations* & *Warehouse Management*):
   - Unlocked once any **2 Beginner Worlds** reach 100% completion.
   - Dedicated to relational normalization, `FOREIGN KEY` references, `INNER JOIN`, multi-table chains, `LEFT JOIN` discrepancy detection, date/time math, and `CASE WHEN`.
3. **Tier 3: Advanced Worlds** (*Hospital Administration* & *Bank Operations*):
   - Unlocked once any **2 Intermediate Worlds** reach 100% completion.
   - Dedicated to subqueries, Common Table Expressions (`WITH`), relational self-joins, analytical window functions (`LAG`, `LEAD`, `DENSE_RANK`), and ACID transactions.
4. **Visual & Behavioral Guards**:
   - Locked cards display frosted overlays, padlock icons, and live unlock progress (e.g. `"Complete 1 more Beginner World to unlock"`).
   - Enter/Resume buttons are disabled with descriptive status badges.
   - State guards in `useWorldStore.setActiveWorld` block unauthorized direct activation of locked worlds.

---

## 📸 Industry Worlds & Curriculum

Quest Query features **6 distinct industry worlds** with **43 hands-on scenario missions**:

| World | Tier | Industry | Operational Reference | Missions | SQL Focus | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Supermarket Operations** | Beginner | Retail & Consumer Goods | Checkout POS, inventory aisles, supplier manifests | 10 | `CREATE TABLE`, `PRIMARY KEY`, `INSERT`, `SELECT`, `WHERE`, `UPDATE`, `DELETE`, `GROUP BY`, `HAVING` | **Unlocked (Playable)** |
| **2. Namma Metro — Transit Command** | Beginner | Public Transit & Mobility | BMRCL OCC room, station lines, smart-cards, footfall | 9 | `CREATE TABLE`, `AUTOINCREMENT`, `UNIQUE`, `CHECK`, `INSERT`, `WHERE`, `BETWEEN`, `IN`, `LIKE`, `IS NULL`, `UPDATE`, `DELETE`, Aggregations | **Unlocked (Playable)** |
| **3. Airport Operations** | Intermediate | Aviation & Transportation | Radar tracking, flight schedules (FIDS), passenger gates | 6 | `CREATE TABLE`, `INSERT`, `SELECT`, `WHERE`, `UPDATE`, `JOIN`, `GROUP BY`, Aggregations | **Playable (Requires 2/2 T1)** |
| **4. Warehouse Management** | Intermediate | Logistics & Supply Chain | Automated conveyors, pallet racks, temperature vaults | 6 | `CREATE TABLE`, `INSERT`, `SELECT`, `WHERE`, `UPDATE`, `JOIN`, `GROUP BY`, `HAVING` | **Playable (Requires 2/2 T1)** |
| **5. Hospital Administration** | Advanced | Healthcare & Clinical | Emergency admissions, doctor clinic rosters, bed wards | 6 | `CREATE TABLE`, `INSERT`, `SELECT`, `WHERE`, `UPDATE`, `JOIN`, `GROUP BY`, Aggregations | **Playable (Requires 2/2 T2)** |
| **6. Bank Operations** | Advanced | Banking & Financial Services | Ledger balances, wire transfers, fraud anomaly audits | 6 | `CREATE TABLE`, `INSERT`, `SELECT`, `WHERE`, `UPDATE`, `JOIN`, `GROUP BY`, Aggregations | **Playable (Requires 2/2 T2)** |

---

## 🎴 3D Collectible World Cards

The dashboard presents industry worlds as interactive **3D collectible physical cards**:

- **Front Face**: High-resolution operational cover banner (`h-44`), role badge, difficulty indicator, estimated time, mastered SQL tags, mission progress bar, and immediate "Enter World" / "Locked" action.
- **Back Face (Operational Dossier)**: Company profile, database file name (`supermarket.db`), operational context brief, key responsibilities, and comprehensive SQL topics.
- **Physical 3D Depth**: Realistic 14px slab thickness with multi-shaded edge walls.
- **Gentle Cursor Tilt**: Subtle reactive tilt dynamics responding smoothly to mouse movement.
- **Card Flip Mechanics**: 1-click flip button or drag gesture with smooth spring physics.
- **Auto-Reset Safety Timer**: Automatically flips cards back to the front face after 60 seconds of inactivity.

---

## 🛒 Curriculum Details: All 6 Worlds (43 Missions)

### World 1: Supermarket Operations &bull; FreshMart Hypermarkets (Beginner &bull; 10 Missions)
1. **Initialize Supermarket Store Workspace**: `CREATE TABLE store_branches` with `INTEGER PRIMARY KEY` and `NOT NULL`.
2. **Create Product Categories Catalog**: `CREATE TABLE categories` with `AUTOINCREMENT` and `UNIQUE` constraints.
3. **Register New Vendor Partnership**: `INSERT INTO suppliers` with vendor contact information.
4. **Identify Low Stock & Depleted Shelves**: Filter `inventory` where `quantity_on_hand < reorder_level`.
5. **Correct Product Pricing Discrepancy**: Update pricing data with `UPDATE products SET unit_price = ...`.
6. **Purge Discontinued Inventory Records**: Execute referentially safe `DELETE` queries.
7. **Investigate Checkout Lane Error**: Join `products` and `inventory` to diagnose out-of-stock POS scanner exceptions.
8. **Trace Customer Order Fulfillment**: Multi-table `JOIN` linking `customers`, `orders`, and `order_items`.
9. **Analyze Category-Wise Revenue Performance**: Group department sales with `GROUP BY`, `SUM()`, and `HAVING`.
10. **Generate Final Supermarket Operations Deliverable**: Compute product velocity rankings and compile the live Executive Audit Report.

### World 2: Namma Metro — Transit Command &bull; BMRCL Control Room (Beginner &bull; 9 Missions)
1. **Booting the Grid**: `CREATE TABLE stations` with `INTEGER PRIMARY KEY`, `NOT NULL`, and `DEFAULT 'Operational'`.
2. **Smart Card Vault**: `CREATE TABLE smart_cards` with `AUTOINCREMENT`, `UNIQUE`, and `CHECK (balance_inr >= 0)`.
3. **Commissioning the Hubs**: Batch `INSERT INTO stations` loading 8 flagship transit stations (Majestic, Indiranagar, MG Road, Whitefield, etc.).
4. **Network Recon**: Query `station_name AS hub_name` and `daily_footfall AS commuters` sorted by footfall `DESC`.
5. **Corridor & Fare Audit**: Query stations on Purple and Yellow lines with `IN ('Purple', 'Yellow')` and `BETWEEN 25 AND 50`.
6. **Feeder Parking & Name Scan**: Match stations lacking parking (`IS NULL`) or containing "Road" (`LIKE '%Road%'`) with `status = 'Operational'`.
7. **Rush-Hour Fare & Status Update**: Update newly certified stretch via `UPDATE stations SET status = 'Operational', base_fare_inr = 45 WHERE status = 'Under_Trial'`.
8. **Purging Ghost Stations**: Execute `DELETE FROM stations WHERE status = 'Closed'` to remove migration test entries.
9. **End-of-Day Executive Telemetry**: Single aggregate query computing `COUNT(*)`, `SUM()`, `ROUND(AVG(), 2)`, `MIN()`, and `MAX()`.

### World 3: Airport Operations &bull; SkyHarbor International (Intermediate &bull; 6 Missions)
1. **Initialize Flights Tracking Table**: `CREATE TABLE flights` with aircraft codes, routes, and departure times.
2. **Log Passenger Manifest Registrations**: `INSERT INTO passengers` with booking references.
3. **Identify Delayed Flights**: Filter radar logs where `status = 'DELAYED'` or `departure_time` exceeds schedule.
4. **Update Flight Gate Assignments**: Reassign terminal gates via `UPDATE flights SET gate = ...`.
5. **Join Flights with Airline Carriers**: Link flight records with carrier partner manifests using `INNER JOIN`.
6. **Analyze Terminal Passenger Traffic**: Aggregate departures and passenger volume per terminal with `GROUP BY` and `COUNT()`.

### World 4: Warehouse Management &bull; Apex Global Logistics (Intermediate &bull; 6 Missions)
1. **Deploy Pallet Storage Schema**: `CREATE TABLE storage_bins` with zone codes and weight capacities.
2. **Receive Inbound Stock Manifest**: Record inbound pallet quantities into `inventory_stock`.
3. **Audit Low-Stock Pallet Bins**: Query storage bins with stock levels falling below emergency reorder thresholds.
4. **Relocate Pallet to High-Bay Storage**: Update bin location coordinates for fragile freight.
5. **Reconcile Inbound Shipments with Vendors**: Join shipment tables with supplier directories to audit lead times.
6. **Evaluate Departmental Space Utilization**: Calculate total cubic volume and utilized bins using `GROUP BY` and `HAVING`.

### World 5: Hospital Administration &bull; Metro General Hospital (Advanced &bull; 6 Missions)
1. **Initialize Ward & Bed Allocation Registry**: `CREATE TABLE beds` with ward identifiers and availability flags.
2. **Admit Inpatient Case Records**: Insert patient intake manifests with attending physician associations.
3. **Filter Active Emergency Admissions**: Query patient admissions filtered by triage urgency status.
4. **Discharge Patient & Release Ward Bed**: Update patient record status to `DISCHARGED` and bed status to `AVAILABLE`.
5. **Correlate Patients with Attending Doctors**: Multi-table relational query connecting `patients`, `admissions`, and `physicians`.
6. **Analyze Average Departmental Length of Stay**: Compute patient occupancy times across medical departments using aggregations.

### World 6: Bank Operations &bull; Apex National Trust (Advanced &bull; 6 Missions)
1. **Create Customer Accounts Ledger**: `CREATE TABLE accounts` with balance constraints and account tiers.
2. **Open High-Yield Savings Accounts**: Record new client account profiles with initial balances.
3. **Audit High-Value Transactions**: Detect anomalous wire transfers exceeding compliance monitoring thresholds.
4. **Execute Balance Ledger Update**: Safely adjust account balances following an audited deposit.
5. **Join Transactions with Customer Profiles**: Link suspicious transfers with account holder details for AML compliance.
6. **Calculate Branch Daily Liquidity**: Aggregate total transaction volume and end-of-day balances per branch.

---

## 🌟 Core Features & Architecture

### 1. Zero-Latency In-Browser WASM SQLite Engine
- **SQLite 3 compiled to WebAssembly** via `sql.js`.
- **Dedicated Web Worker** (`sql.worker.ts`) offloads compilation and execution from the main UI thread.
- **Cartesian Watchdog**: 10-second watchdog timer prevents runaway infinite queries.
- **Referential Integrity**: Full foreign key enforcement (`PRAGMA foreign_keys = ON;`).
- **Live Catalog Introspection**: Parses `sqlite_master` and SQLite pragmas to extract schemas, keys, and relations in real-time.

### 2. Professional Monaco SQL Editor & IDE
- **Syntax Highlighting & Autocomplete**: Complete SQLite grammar with keyword suggestion providers.
- **Pixel-Perfect Caret Alignment**: Monaco font metrics are dynamically remeasured (`remeasureFonts()`) on mount and font load.
- **Resizable 3-Column Workspace**:
  - **Left**: Mission briefing, storyline context, and 3 progressive hints.
  - **Center**: Monaco SQL Editor + Live Query Results Terminal.
  - **Right**: Collapsible Schema Explorer with live table preview modals.
- **Smart Splitters**: Persistent panel dimensions saved to `localStorage`.
- **Editor Controls**: Run Query (`Ctrl+Enter`), Submit (`Ctrl+Shift+Enter`), Select All (`Ctrl+A`), Reset Starter, Query History (last 15 queries).

### 3. Intelligent Mission Validation Engine
- Validates **actual database state changes and result sets**, not superficial string matching.
- **Column Order & Case Insensitive**: Supports flexible, valid student solutions.
- **Numeric Normalization**: Normalizes floating points and decimal representations.
- **Validation Rules**: `EXACT_MATCH`, `SUBSET_MATCH`, `MIN_ROWS`, `TABLE_EXISTS`, and `DML_STATE_CHECK`.

### 4. Real-Time Telemetry & Performance Analytics
- On-demand performance modal tracking problem-solving time, query attempts, hint reliance, and error counts.
- Dynamic operational rank calculations (*SQL Apprentice* to *Principal Data Architect*).
- Complete log of passing SQL solutions with one-click clipboard copying.

### 5. Dynamic Executive Business Reports
- Real-time business intelligence memo computed from live database queries: KPI stat counters, lightweight SVG revenue charts, velocity rankings, and printable/PDF exports.

### 6. Gamification, Badges & Audio Synthesizer
- **XP Progression & Levels**: Real-time level-up calculation with milestone achievements.
- **Procedural Sound Engine**: Web Audio API procedural sound synthesizer (click feedback, success chimes, level-up melodies) with instant mute toggle.
- **Offline Persistence**: Client-side storage via IndexedDB (`idb`) preserves binary database snapshots and completed mission states across sessions.

---

## ⚡ Performance & Bundle Metrics

| Metric | Measurement |
| :--- | :--- |
| **Gzipped JavaScript Bundle** | **~195 kB** (`dist/assets/index-*.js` including Monaco, SQLite WASM client, Lucide icons) |
| **Gzipped CSS Bundle** | **~10.2 kB** (`dist/assets/index-*.css`) |
| **Web Worker Bundle** | **45.3 kB** (`dist/assets/sql.worker-*.js`) |
| **Initial Boot Time** | **< 300 ms** in modern browsers |
| **Main Thread Overhead** | **0 ms** during query execution (isolated Web Worker) |

---

## 🛠️ Technology Stack

- **UI & Framework**: React 18, TypeScript, Tailwind CSS, Zustand, Lucide Icons, Motion
- **SQL Editor**: Monaco Editor (`@monaco-editor/react`) with dynamic remeasuring & Consolas monospace stack
- **SQL Engine**: SQLite 3 compiled to WebAssembly via `sql.js` (Web Worker isolation)
- **Local Persistence**: IndexedDB (`idb`)
- **Audio Synthesizer**: Web Audio API Procedural Synthesizer
- **Testing**: Vitest, React Testing Library, Playwright
- **Build Tooling**: Vite 6, PostCSS, TypeScript 5
- **Cloud Hosting**: Vercel Edge Network (`vercel.json` SPA routing, WASM headers, immutable caching)

---

## 💻 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node 20 / 22 / 24)
- npm 9+

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/shashaank747/QueryQuest.git
cd QueryQuest

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

### Test Suite Execution

```bash
# Run complete automated test suite (12 suites, 209 unit & scenario tests)
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

## 🚀 Deploy to Vercel

Quest Query is pre-configured for automated zero-config deployment on Vercel:

1. Push your repository to GitHub (`shashaank747/QueryQuest`).
2. Import the repository in [Vercel](https://vercel.com/new).
3. Vercel automatically detects the **Vite** framework and utilizes [`vercel.json`](vercel.json) to handle:
   - Single Page Application routing (rewrites to `/index.html`)
   - `application/wasm` MIME-type headers for `sql-wasm.wasm`
   - Cache-Control optimizations for hashed assets

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

## 👨‍💻 Creator & Engineering

Designed & Developed by **Shashaank Sajjanar**  
- **GitHub**: [@shashaank747](https://github.com/shashaank747)  
- **Live App**: [https://query-quest-livid.vercel.app/](https://query-quest-livid.vercel.app/)

---

## 📄 License

Quest Query is open-source software licensed under the **MIT License**.
