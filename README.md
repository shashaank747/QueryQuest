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
  <a href="#-sequential-world-progression--locking"><img src="https://img.shields.io/badge/Worlds-5_Interactive_Worlds-f59e0b.svg?style=flat-square" alt="5 Worlds" /></a>
  <a href="#-industry-worlds--curriculum"><img src="https://img.shields.io/badge/Missions-34_Enterprise_Scenarios-10b981.svg?style=flat-square" alt="34 Missions" /></a>
  <a href="#-technology-stack"><img src="https://img.shields.io/badge/SQLite-WASM_In--Browser-0284c7.svg?style=flat-square" alt="SQLite WASM" /></a>
  <a href="#-technology-stack"><img src="https://img.shields.io/badge/Editor-Monaco_IDE-6366f1.svg?style=flat-square" alt="Monaco Editor" /></a>
  <a href="#-test-suite-execution"><img src="https://img.shields.io/badge/Tests-209_Passed-emerald.svg?style=flat-square" alt="Test Status" /></a>
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
         │  World 1 (Supermarket)  │  ──(Completed)──▶   │    World 2 (Airport)    │
         │  [Unlocked by Default]  │                     │  [Sequential Unlock]    │
         └─────────────────────────┘                     └────────────┬────────────┘
                                                                      │
                                                          (Completed) │
                                                                      ▼
         ┌─────────────────────────┐                     ┌─────────────────────────┐
         │      World 5 (Bank)     │  ◀──(Completed)──   │  World 3 & 4 (WH/Hosp)  │
         │  [Sequential Unlock]    │                     │  [Sequential Unlock]    │
         └─────────────────────────┘                     └─────────────────────────┘
```

### 1. Excel (Spreadsheets & Financial Modeling) &bull; *Coming Soon*
- Master the corporate workhorse: dynamic multi-tier commissions, supplier inventory reconciliation, financial 3-statement modeling, and what-if scenarios.
- Topics: `XLOOKUP`, nested dynamic arrays, pivot intelligence, and sensitivity solvers.
- 15 planned hands-on workbooks.

### 2. MySQL (Relational Databases & Enterprise Simulation) &bull; *Playable Now*
- The flagship Quest Query simulation: 5 interactive industry worlds and 34 progressive missions running on an in-browser SQLite WASM engine.
- Topics: Schema design, referential integrity (`PK`/`FK`), DDL, DML, multi-table joins, subqueries, aggregations, and ACID transactions.
- 100% playable client-side with zero latency.

### 3. Power BI (Business Intelligence & Dashboards) &bull; *Coming Soon*
- Transform raw corporate data into interactive executive war-rooms.
- Topics: Star schemas, DAX time-intelligence measures, KPI gauges, and cross-filtering visual storytelling.
- 12 planned dashboards.

---

## 🔒 Sequential World Progression & Locking System

To ensure a structured, pedagogically sound learning curve, the MySQL track enforces a **progressive world unlock sequence**:

1. **World 1 (Supermarket Operations)** is open and accessible to all players by default.
2. **Worlds 2 through 5** are locked until the immediate preceding world is 100% completed:
   - **World 2 (Airport Operations)** unlocks upon completing all 10 missions of World 1.
   - **World 3 (Warehouse Management)** unlocks upon completing all 6 missions of World 2.
   - **World 4 (Hospital Administration)** unlocks upon completing all 6 missions of World 3.
   - **World 5 (Bank Operations)** unlocks upon completing all 6 missions of World 4.
3. **Visual & Behavioral Guards**:
   - Locked cards display frosted overlays, padlock icons, and explicit unlock requirements (e.g., `"Complete Airport Operations to unlock"`).
   - Enter/Resume buttons are disabled with descriptive tooltips.
   - Store guards in `useWorldStore.setActiveWorld` strictly block direct activation of locked worlds.
   - Completing a world triggers the **World Completed Celebration Modal**, offering a direct `"Launch Next World: [Name] →"` button.

---

## 📸 Industry Worlds & Curriculum

Quest Query features **5 distinct industry worlds** with **34 hands-on scenario missions**:

| World | Industry | Operational Reference | Difficulty | Missions | SQL Focus | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Supermarket Operations** | Retail & Consumer Goods | Checkout POS, inventory aisles, supplier manifests | Beginner | 10 | `CREATE TABLE`, `PRIMARY KEY`, `FOREIGN KEY`, `INSERT`, `SELECT`, `UPDATE`, `DELETE`, `JOIN`, `GROUP BY`, `HAVING` | **Unlocked (Playable)** |
| **2. Airport Operations** | Aviation & Transportation | Radar tracking, flight schedules (FIDS), passenger gates | Intermediate | 6 | `CREATE TABLE`, `INSERT`, `SELECT`, `WHERE`, `UPDATE`, `JOIN`, `GROUP BY`, Aggregations | **Playable (Requires W1)** |
| **3. Warehouse Management** | Logistics & Supply Chain | Automated conveyors, pallet racks, temperature vaults | Intermediate | 6 | `CREATE TABLE`, `INSERT`, `SELECT`, `WHERE`, `UPDATE`, `JOIN`, `GROUP BY`, `HAVING` | **Playable (Requires W2)** |
| **4. Hospital Administration** | Healthcare & Clinical | Emergency admissions, doctor clinic rosters, bed wards | Advanced | 6 | `CREATE TABLE`, `INSERT`, `SELECT`, `WHERE`, `UPDATE`, `JOIN`, `GROUP BY`, Aggregations | **Playable (Requires W3)** |
| **5. Bank Operations** | Banking & Financial Services | Ledger balances, wire transfers, fraud anomaly audits | Advanced | 6 | `CREATE TABLE`, `INSERT`, `SELECT`, `WHERE`, `UPDATE`, `JOIN`, `GROUP BY`, Aggregations | **Playable (Requires W4)** |

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

## 🛒 Curriculum Details: All 5 Worlds (34 Missions)

### World 1: Supermarket Operations &bull; FreshMart Hypermarkets (10 Missions)
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

### World 2: Airport Operations &bull; SkyHarbor International (6 Missions)
1. **Initialize Flights Tracking Table**: `CREATE TABLE flights` with aircraft codes, routes, and departure times.
2. **Log Passenger Manifest Registrations**: `INSERT INTO passengers` with booking references.
3. **Identify Delayed Flights**: Filter radar logs where `status = 'DELAYED'` or `departure_time` exceeds schedule.
4. **Update Flight Gate Assignments**: Reassign terminal gates via `UPDATE flights SET gate = ...`.
5. **Join Flights with Airline Carriers**: Link flight records with carrier partner manifests using `INNER JOIN`.
6. **Analyze Terminal Passenger Traffic**: Aggregate departures and passenger volume per terminal with `GROUP BY` and `COUNT()`.

### World 3: Warehouse Management &bull; Apex Global Logistics (6 Missions)
1. **Deploy Pallet Storage Schema**: `CREATE TABLE storage_bins` with zone codes and weight capacities.
2. **Receive Inbound Stock Manifest**: Record inbound pallet quantities into `inventory_stock`.
3. **Audit Low-Stock Pallet Bins**: Query storage bins with stock levels falling below emergency reorder thresholds.
4. **Relocate Pallet to High-Bay Storage**: Update bin location coordinates for fragile freight.
5. **Reconcile Inbound Shipments with Vendors**: Join shipment tables with supplier directories to audit lead times.
6. **Evaluate Departmental Space Utilization**: Calculate total cubic volume and utilized bins using `GROUP BY` and `HAVING`.

### World 4: Hospital Administration &bull; Metro General Hospital (6 Missions)
1. **Initialize Ward & Bed Allocation Registry**: `CREATE TABLE beds` with ward identifiers and availability flags.
2. **Admit Inpatient Case Records**: Insert patient intake manifests with attending physician associations.
3. **Filter Active Emergency Admissions**: Query patient admissions filtered by triage urgency status.
4. **Discharge Patient & Release Ward Bed**: Update patient record status to `DISCHARGED` and bed status to `AVAILABLE`.
5. **Correlate Patients with Attending Doctors**: Multi-table relational query connecting `patients`, `admissions`, and `physicians`.
6. **Analyze Average Departmental Length of Stay**: Compute patient occupancy times across medical departments using aggregations.

### World 5: Bank Operations &bull; Apex National Trust (6 Missions)
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
