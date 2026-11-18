# Excel Quest Studio 📊⚡

> **Standalone Interactive Spreadsheet Simulation & Business Formula Engine**  
> Master enterprise Microsoft Excel through authentic, high-stakes corporate outages across 7 real-world industry worlds.

---

## 🌟 Overview

**Excel Quest Studio** is a complete, self-contained educational simulation and spreadsheet game powered by a custom AST formula parser, dependency-graph evaluation engine, and a pixel-accurate Microsoft Excel-styled user interface.

Users take on realistic operational roles—from **Inventory Analyst at a Supermarket** to **Treasury Operations Analyst at a Bank**—solving live financial models, flight turnarounds, patient occupancy metrics, metro fare calculations, and inventory audits.

---

## 🚀 Key Features

### 1. 🧮 Custom AST Formula Evaluation Engine (`src/engine/`)
- **Recursive-descent AST Parser**: Parses full formulas with arithmetic (`+`, `-`, `*`, `/`, `^`), unary negation/percentages, comparisons (`=`, `<>`, `>`, `<`, `>=`, `<=`), cell references (`A1`, `$B$4`), cross-sheet references (`Sheet1!A1`), and range slices (`A1:B10`).
- **Comprehensive Function Library (`functions.ts`)**:
  - **Math & Stats**: `SUM`, `AVERAGE`, `COUNT`, `COUNTA`, `COUNTBLANK`, `MIN`, `MAX`, `ROUND`, `ROUNDUP`, `ROUNDDOWN`, `ABS`, `INT`, `MOD`, `PRODUCT`, `SUMPRODUCT`, `MEDIAN`.
  - **Logical**: `IF`, `IFS`, `AND`, `OR`, `NOT`, `XOR`, `IFERROR`, `SWITCH`.
  - **Lookups**: `VLOOKUP`, `HLOOKUP`, `INDEX`, `MATCH`, `XLOOKUP`.
  - **Conditional Aggregations**: `SUMIF`, `SUMIFS`, `COUNTIF`, `COUNTIFS`, `AVERAGEIF`, `AVERAGEIFS`.
  - **Text Operations**: `CONCATENATE`, `CONCAT`, `TEXTJOIN`, `LEFT`, `RIGHT`, `MID`, `LEN`, `TRIM`, `UPPER`, `LOWER`, `PROPER`, `FIND`, `SEARCH`, `SUBSTITUTE`, `REPLACE`, `TEXT`.
  - **Date & Time**: `TODAY`, `NOW`, `DATE`, `YEAR`, `MONTH`, `DAY`, `DAYS`, `DATEDIF`, `EDATE`, `EOMONTH`, `WEEKDAY`, `NETWORKDAYS`.
  - **Finance**: `PMT`, `PV`, `FV`, `RATE`, `NPER`, `NPV`, `IRR`.
  - **Advanced / Dynamic Arrays**: `UNIQUE`, `SORT`, `FILTER`, `SEQUENCE`, `CHOOSEROWS`, `CHOOSECOLS`.
- **Topological Sorting & Cycle Detection**: Builds a cell-level dependency graph, detects circular references (`#CYCLE!`), and evaluates cells in topological order.
- **Robust Error System**: Handles `#DIV/0!`, `#VALUE!`, `#REF!`, `#NAME?`, `#NUM!`, `#N/A`, `#CYCLE!`.

---

### 2. 🏢 7 Enterprise Industry Worlds (`src/worlds/`)
Each world features 6 structured operational missions across 3 difficulty tiers (42 total missions):
1. **Supermarket Operations** (*Retail & FMCG*) — Revenue, margins, COGS, dynamic inventory pricing.
2. **Namma Metro — Transit Command** (*Public Transit*) — Fare matrices, peak-hour ridership, commuter analytics.
3. **Query & Kaapi — Tiffin & Filter Coffee** (*Hospitality & F&B*) — Ingredient cost models, combo discounts, batch profit analysis.
4. **Airport Operations** (*Aviation*) — Turnaround delay penalties, gate slot fees, de-icing labor calculations.
5. **Warehouse Management** (*Logistics & Supply Chain*) — Inventory turnover, holding costs, safety stock, lead times.
6. **Hospital Administration** (*Healthcare Finance*) — Bed occupancy, doctor shift schedules, insurance claim copay reconciliations.
7. **Bank Operations** (*Fintech & Treasury*) — Loan amortization (`PMT`), EMI schedules, debt-service ratios, compound interest.

---

### 3. 🖥️ Interactive Spreadsheet Studio UI (`src/components/`)
- **Excel Ribbon (`ExcelRibbon.tsx`)**:
  - Microsoft Excel green header (`#107c41`).
  - Tabs: **Home**, **Formulas**, **Insert**, **Data**, **View**.
  - Font styling, alignments, borders, currency formats (`$`, `₹`), decimals, percentage toggles, and AutoSum shortcuts.
- **Formula Bar (`ExcelFormulaBar.tsx`)**:
  - Synchronized Name Box (active cell coordinate / range).
  - Formula indicator (`fx`) with live, bidirectional two-way editing.
- **High-Performance Grid (`ExcelGrid.tsx`)**:
  - Column headers (`A`..`Z`) and row headers (`1`..`100`).
  - Keyboard navigation (arrows, Enter, Tab, Escape, F2).
  - Cell range drag selection and formatting preview.
- **Sheet Tabs & Live Status Bar (`ExcelSheetTabs.tsx`)**:
  - Multi-sheet switching.
  - Live calculations: Average, Count, and Sum for active selections.
- **Mission Briefing Panel (`ExcelMissionPanel.tsx`)**:
  - Real-world storyline context, objective checklists, progressive hints drawer, and instant automated grading.
- **Audio & Sound Effects**:
  - Web Audio API procedural synthesis for key clicks, error alerts, and victory chimes (zero external audio file dependencies).

---

## 🛠️ Tech Stack

- **React 18** with **TypeScript**
- **Vite** build tooling
- **Tailwind CSS** styling
- **Zustand** state management
- **Lucide React** icons
- **Canvas-Confetti** particle celebrations
- **Vitest** & **React Testing Library** for automated test suites

---

## 📂 Project Architecture

```
only excel/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── README.md
├── public/
│   ├── favicon.svg
│   ├── logo.png
│   └── images/                     # Industry world cover thumbnails
│       ├── airport-world.jpg
│       ├── bank-world.jpg
│       ├── hospital-world.jpg
│       ├── kaapi-world.jpg
│       ├── metro-world.jpg
│       ├── supermarket-world.jpg
│       └── warehouse-world.jpg
├── src/
│   ├── main.tsx
│   ├── index.css
│   ├── App.tsx                     # Main standalone application entry
│   ├── curriculum.ts               # Official 4-tier 16-module curriculum
│   ├── engine/                     # Core spreadsheet evaluation engine
│   │   ├── types.ts
│   │   ├── parser.ts
│   │   ├── functions.ts
│   │   ├── format.ts
│   │   ├── evaluator.ts
│   │   └── index.ts
│   ├── worlds/                     # 7 Industry worlds & missions
│   │   ├── types.ts
│   │   ├── registry.ts
│   │   ├── validator.ts
│   │   ├── supermarket/
│   │   ├── metro/
│   │   ├── kaapi/
│   │   ├── airport/
│   │   ├── warehouse/
│   │   ├── hospital/
│   │   ├── bank/
│   │   └── index.ts
│   ├── components/                 # UI components
│   │   ├── Header.tsx
│   │   ├── ExcelRibbon.tsx
│   │   ├── ExcelFormulaBar.tsx
│   │   ├── ExcelGrid.tsx
│   │   ├── ExcelSheetTabs.tsx
│   │   ├── ExcelMissionPanel.tsx
│   │   ├── ExcelWorldCard.tsx
│   │   ├── ExcelWorldGrid.tsx
│   │   ├── ExcelWorkspaceLayout.tsx
│   │   └── ui/                     # Shared UI widgets (Modal, Button, FlipCard)
│   ├── stores/                     # Zustand state stores
│   │   ├── useExcelStore.ts
│   │   ├── useThemeStore.ts
│   │   ├── useTrackStore.ts
│   │   └── useUserStore.ts
│   ├── services/
│   │   └── sound/sound-effects.ts
│   └── test/
│       └── setup.ts
└── tests/                          # Automated Vitest test suites
    ├── excel-engine.test.ts        # AST parser, formula & graph evaluation
    ├── excel-worlds.test.ts        # World registry & mission validations
    ├── excel-curriculum.test.ts    # 16-module curriculum integrity
    ├── excel-ui.test.ts            # Store actions & UI state
    └── excel-browser-integration.test.tsx # End-to-end component rendering
```

---

## ⚡ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3001` in your browser.

### 3. Run Automated Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```

---

## 📜 License
MIT © 2026 Quest Query Team
