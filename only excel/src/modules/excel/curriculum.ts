/**
 * Excel Analytics Track - Comprehensive 16-Module Curriculum Architecture
 * 
 * Structured across 4 Skill Tiers:
 * - Tier 1: The Grid & Foundations (Beginner Worlds - Modules 1 to 4)
 * - Tier 2: Logic, Text & Lookups (Intermediate Worlds - Modules 5 to 8)
 * - Tier 3: Modern Arrays & Business Intelligence (Advanced Worlds - Modules 9 to 13)
 * - Tier 4: Optimization, Automation & Mastery (Endgame Worlds - Modules 14 to 16)
 */

export type ExcelTierNumber = 1 | 2 | 3 | 4;
export type ExcelTierSlug = 'beginner' | 'intermediate' | 'advanced' | 'endgame';

export interface ExcelTierInfo {
  tier: ExcelTierNumber;
  name: string;
  tabLabel: string;
  slug: ExcelTierSlug;
  badgeColor: string;
  accentColor: string;
  description: string;
  moduleRange: string;
  moduleCount: number;
}

export interface ExcelModule {
  id: string;
  number: number;
  tier: ExcelTierNumber;
  tierName: string;
  tierSlug: ExcelTierSlug;
  title: string;
  focus: string;
  coreConcepts: string[];
  functions: string[];
  shortcuts: string[];
  gameMechanics: string[];
  description: string;
}

export interface ExcelCurriculumStats {
  totalModules: number;
  totalTiers: number;
  totalFunctions: number;
  totalShortcuts: number;
  tierBreakdown: Record<ExcelTierNumber, number>;
}

export const EXCEL_TIERS: ExcelTierInfo[] = [
  {
    tier: 1,
    name: 'Tier 1: The Grid & Foundations',
    tabLabel: 'Tier 1: Foundations',
    slug: 'beginner',
    badgeColor: 'emerald',
    accentColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    description: 'Master grid navigation, keyboard muscle memory, data types, cell referencing, and data hygiene.',
    moduleRange: 'Modules 1–4',
    moduleCount: 4,
  },
  {
    tier: 2,
    name: 'Tier 2: Logic, Text & Lookups',
    tabLabel: 'Tier 2: Logic & Lookups',
    slug: 'intermediate',
    badgeColor: 'blue',
    accentColor: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
    description: 'Construct multi-branching logical gates, parse complex strings, calculate business calendars, and master lookup engines.',
    moduleRange: 'Modules 5–8',
    moduleCount: 4,
  },
  {
    tier: 3,
    name: 'Tier 3: Modern Arrays & Business Intelligence',
    tabLabel: 'Tier 3: Arrays & BI',
    slug: 'advanced',
    badgeColor: 'purple',
    accentColor: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
    description: 'Harness dynamic array spill mechanics, functional programming (LET/LAMBDA), interactive Pivot dashboards, and Power Query ETL.',
    moduleRange: 'Modules 9–13',
    moduleCount: 5,
  },
  {
    tier: 4,
    name: 'Tier 4: Optimization, Automation & Mastery',
    tabLabel: 'Tier 4: Automation & Endgame',
    slug: 'endgame',
    badgeColor: 'amber',
    accentColor: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
    description: 'Corporate financial modeling, Solver optimization, VBA scripting, and forensic performance auditing under stress.',
    moduleRange: 'Modules 14–16',
    moduleCount: 3,
  },
];

export const EXCEL_MODULES: ExcelModule[] = [
  // ==========================================
  // TIER 1: The Grid & Foundations (Beginner Worlds)
  // ==========================================
  {
    id: 'excel-mod-1',
    number: 1,
    tier: 1,
    tierName: 'Tier 1: The Grid & Foundations',
    tierSlug: 'beginner',
    title: 'Grid Navigation & Interface Mechanics',
    focus: 'Keyboard Mastery & Spatial Awareness',
    coreConcepts: [
      'Workbook Architecture & Sheet Topography',
      'Active Cell vs Selection Coordinates',
      'Ribbon Anatomy & Name Box Direct Jumps',
      'Status Bar Instant Metrics & Context Aggregation',
      'Mouse-Free Continuous Grid Traversing',
    ],
    functions: ['SUM', 'AVERAGE', 'COUNT', 'MIN', 'MAX'],
    shortcuts: [
      'Ctrl + Arrow Keys (Edge Jump)',
      'Ctrl + Shift + Arrow Keys (Continuous Range Selection)',
      'Ctrl + Home / End (Extremities Jump)',
      'Ctrl + Space / Shift + Space (Column / Row Selection)',
      'F5 / Ctrl + G (Go To Coordinates)',
    ],
    gameMechanics: [
      'Speed Grid Run',
      'Blindfold Navigation Puzzle',
      'No-Mouse Penalty Challenge',
      'Cell Coordinate Time Trial',
    ],
    description:
      'Build lightning-fast keyboard muscle memory and grid fluidity. Learn to traverse millions of rows and columns without ever reaching for the mouse, mastering the fundamental anatomy of the workbook.',
  },
  {
    id: 'excel-mod-2',
    number: 2,
    tier: 1,
    tierName: 'Tier 1: The Grid & Foundations',
    tierSlug: 'beginner',
    title: 'Data Types, Formatting & Paste Special',
    focus: 'Data Integrity & Executive Presentation',
    coreConcepts: [
      'Underlying Serial Numbers vs Display Masks',
      'Text vs Number vs Boolean Type Quarantine',
      'Custom Number Formats (Accounting, Scale Multipliers, Color Tags)',
      'Paste Special Transformations (Values, Multiply, Transpose, Formats)',
      'Fill Handle Extrapolation & Flash Fill Pattern Recognition',
    ],
    functions: ['VALUE', 'TEXT', 'TRIM', 'N', 'TYPE'],
    shortcuts: [
      'Ctrl + 1 (Format Cells Dialog)',
      'Ctrl + Shift + ~ / $ / % (Quick Formatting Presets)',
      'Ctrl + Alt + V (Paste Special Modal)',
      'Ctrl + E (Flash Fill Pattern Extractor)',
      'Alt + H + O + I (Auto-Fit Column Width)',
    ],
    gameMechanics: [
      'Data Hygiene Quarantine',
      'Format Mimic Match',
      'Transpose Matrix Puzzle',
      'Corrupted Data Restoration',
    ],
    description:
      'Demystify underlying serial numbers, enforce strict data types, and unlock the surgical power of Paste Special and custom format masks to present executive-ready financial figures.',
  },
  {
    id: 'excel-mod-3',
    number: 3,
    tier: 1,
    tierName: 'Tier 1: The Grid & Foundations',
    tierSlug: 'beginner',
    title: 'Cell Referencing & Core Arithmetic',
    focus: 'Formula Mechanics & Mathematical Rigor',
    coreConcepts: [
      'Relative vs Absolute vs Mixed Referencing ($A$1, A$1, $A1)',
      'Multiplication Tables & 2D Grid Formula Architectures',
      'Operator Precedence & PEMDAS Parentheses Scoping',
      'Cross-Sheet Referencing & 3D Sheet Ranges',
      'Named Ranges & Formula Clarity Scope',
    ],
    functions: ['SUM', 'PRODUCT', 'ROUND', 'ROUNDUP', 'ROUNDDOWN', 'MOD', 'ABS'],
    shortcuts: [
      'F4 (Cycle Dollar Sign References)',
      'Ctrl + ` (Toggle Formula Display Mode)',
      'F2 (Edit Active Cell & Color-Coded Range Audit)',
      'Ctrl + D (Fill Down)',
      'Ctrl + R (Fill Right)',
    ],
    gameMechanics: [
      'The Dollar Sign Matrix Lock',
      'Formula Drag Precision Trial',
      'Cross-Sheet Bridge Builder',
      'Math Vault Decryption',
    ],
    description:
      'Internalize the foundational mechanic of spreadsheet engineering: locking rows and columns with precision. Build robust 2D modeling grids and cross-sheet formulas that scale reliably.',
  },
  {
    id: 'excel-mod-4',
    number: 4,
    tier: 1,
    tierName: 'Tier 1: The Grid & Foundations',
    tierSlug: 'beginner',
    title: 'Sorting, Filtering & Data Hygiene',
    focus: 'Structured Tables & Tabular Sanitization',
    coreConcepts: [
      'Structured Tables (Ctrl+T) & Column Header References',
      'Multi-Level Hierarchical Custom Sorting',
      'AutoFilter Wildcards & Number/Date Filters',
      'Deduplication & Blank Record Extraction',
      'Data Validation Rules, Input Alerts & Dropdown Lists',
    ],
    functions: ['SUBTOTAL', 'COUNTA', 'COUNTBLANK', 'UNIQUE', 'SORT'],
    shortcuts: [
      'Ctrl + T (Convert Range to Structured Table)',
      'Ctrl + Shift + L (Toggle AutoFilter)',
      'Alt + Down Arrow (Open Dropdown Filter Menu)',
      'Alt + A + M (Remove Duplicates Wizard)',
      'Alt + A + V + V (Data Validation Modal)',
    ],
    gameMechanics: [
      'Filter Gauntlet',
      'Duplicate Purge Defense',
      'Dropdown Enforcer',
      'Table Expansion Speedrun',
    ],
    description:
      'Convert messy flat ranges into resilient structured Excel tables. Implement data validation barriers, execute complex multi-tier sorts, and sanitize raw corporate data streams.',
  },

  // ==========================================
  // TIER 2: Logic, Text & Lookups (Intermediate Worlds)
  // ==========================================
  {
    id: 'excel-mod-5',
    number: 5,
    tier: 2,
    tierName: 'Tier 2: Logic, Text & Lookups',
    tierSlug: 'intermediate',
    title: 'Logical Gates & Conditional Aggregation',
    focus: 'Conditional Decision Logic & Summary Metrics',
    coreConcepts: [
      'Boolean Logic (TRUE/FALSE) & Double-Unary Coercion (--)',
      'Multi-Branching Conditionals (IF, IFS, SWITCH)',
      'Compound Logical Operators (AND / OR / NOT)',
      'Criteria-Based Aggregation (SUMIFS, COUNTIFS, AVERAGEIFS)',
      'Defensive Error Trapping (IFERROR, IFNA)',
    ],
    functions: ['IF', 'IFS', 'SWITCH', 'AND', 'OR', 'NOT', 'SUMIFS', 'COUNTIFS', 'AVERAGEIFS', 'IFERROR', 'IFNA'],
    shortcuts: [
      'F9 (Evaluate Formula Segment Inline)',
      'Ctrl + Shift + Enter (Legacy CSE Context)',
      'Alt + M + V (Evaluate Formula Dialog)',
      'Alt + = (AutoSum Quick Insert)',
    ],
    gameMechanics: [
      'Logic Gate Circuit Puzzle',
      'Tiered Bonus Calculator',
      'Error Shield Boss Fight',
      'Multi-Criteria KPI Siege',
    ],
    description:
      'Engineer smart branching business rules and high-performance multi-condition aggregation. Build bulletproof logic that handles tiered commissions, operational SLAs, and missing data without crashing.',
  },
  {
    id: 'excel-mod-6',
    number: 6,
    tier: 2,
    tierName: 'Tier 2: Logic, Text & Lookups',
    tierSlug: 'intermediate',
    title: 'Text Parsing & String Manipulation',
    focus: 'Unstructured Data Extraction & String Wrangling',
    coreConcepts: [
      'Substring Extraction & Delimiter Position Locators',
      'String Concatenation & Delimited Joins (TEXTJOIN)',
      'Modern Dynamic Text Slicers (TEXTSPLIT, TEXTBEFORE, TEXTAFTER)',
      'Case Normalization & Non-Printable Character Cleansing',
      'Pattern Replacement & String Sanitization',
    ],
    functions: [
      'LEFT',
      'RIGHT',
      'MID',
      'LEN',
      'FIND',
      'SEARCH',
      'CONCAT',
      'TEXTJOIN',
      'TEXTBEFORE',
      'TEXTAFTER',
      'TEXTSPLIT',
      'SUBSTITUTE',
      'CLEAN',
      'PROPER',
    ],
    shortcuts: [
      'Ctrl + H (Find & Replace Modal)',
      'Alt + A + E (Text to Columns Wizard)',
      'Ctrl + E (Flash Fill Delimiter Auto-Extract)',
    ],
    gameMechanics: [
      'Log File Disassembler',
      'CRM Name & Address Parser',
      'Regex-Style Delimiter Maze',
      'Invoice Code Extractor',
    ],
    description:
      'Surgically dissect messy text feeds, log strings, and mixed customer records. Master modern functions like TEXTSPLIT and TEXTBEFORE alongside classic MID/FIND combinations.',
  },
  {
    id: 'excel-mod-7',
    number: 7,
    tier: 2,
    tierName: 'Tier 2: Logic, Text & Lookups',
    tierSlug: 'intermediate',
    title: 'Date & Time Calculations',
    focus: 'Temporal Modeling & Business Calendars',
    coreConcepts: [
      'Serial Date Storage & Fractional Day Clock Math',
      'Business Working Days & Custom Weekend/Holiday Schedules',
      'Year Fractions & Day Count Conventions',
      'Rolling Monthly Closes & Maturity Dates (EOMONTH, EDATE)',
      'Turnaround Duration & Multi-Shift SLA Tracking',
    ],
    functions: [
      'TODAY',
      'NOW',
      'DATE',
      'YEAR',
      'MONTH',
      'DAY',
      'DATEDIF',
      'EDATE',
      'EOMONTH',
      'NETWORKDAYS.INTL',
      'WORKDAY.INTL',
      'YEARFRAC',
    ],
    shortcuts: [
      'Ctrl + ; (Insert Current Date Stamp)',
      'Ctrl + Shift + : (Insert Current Time Stamp)',
      'Ctrl + 1 -> Number Tab -> Date (Format Inspector)',
    ],
    gameMechanics: [
      'SLA Penalty Clock',
      'Payroll Holiday Shift',
      'Aging Receivables Bucket',
      'Shift Schedule Alignment',
    ],
    description:
      'Calculate exact working business days, rolling financial maturities, and operational response SLAs across custom weekend conventions and regional holiday calendars.',
  },
  {
    id: 'excel-mod-8',
    number: 8,
    tier: 2,
    tierName: 'Tier 2: Logic, Text & Lookups',
    tierSlug: 'intermediate',
    title: 'Lookup & Reference Engines',
    focus: 'Relational Retrieval & Matrix Lookups',
    coreConcepts: [
      'Exact Match vs Approximate Match Banding',
      'XLOOKUP Next-Gen Architecture (2-Way, Reverse, Fallback)',
      'INDEX & MATCH Coordinate-Based Retrieval',
      'Horizontal & Vertical Two-Dimensional Matrix Crossing',
      'Dynamic References vs Volatile Traps (OFFSET, INDIRECT)',
    ],
    functions: ['XLOOKUP', 'VLOOKUP', 'HLOOKUP', 'INDEX', 'MATCH', 'XMATCH', 'CHOOSE', 'OFFSET', 'INDIRECT'],
    shortcuts: [
      'Ctrl + Shift + A (Insert Function Parameter Names)',
      'Alt + M + P (Trace Precedents Arrows)',
      'Alt + M + D (Trace Dependents Arrows)',
      'Alt + M + A + A (Remove All Trace Arrows)',
    ],
    gameMechanics: [
      'Two-Way Matrix Key',
      'Broken VLOOKUP Diagnostic',
      'Inventory SKU Teleporter',
      'Dynamic Rate Card Engine',
    ],
    description:
      'Move from fragile legacy VLOOKUPs to robust 2D INDEX/MATCH and modern XLOOKUP engines capable of handling dynamic pricing tiers, reverse lookups, and multi-criteria matches.',
  },

  // ==========================================
  // TIER 3: Modern Arrays & Business Intelligence (Advanced Worlds)
  // ==========================================
  {
    id: 'excel-mod-9',
    number: 9,
    tier: 3,
    tierName: 'Tier 3: Modern Arrays & Business Intelligence',
    tierSlug: 'advanced',
    title: 'Dynamic Array Formulas & Spill Mechanics',
    focus: 'Spill Ranges & Array Reshaping',
    coreConcepts: [
      'The Dynamic Calc Engine Revolution (# Spill Operator)',
      'Diagnosing & Clearing #SPILL! Collision Errors',
      'Real-Time Dynamic Filtering & Multi-Key Sorting',
      'Deduplication & Sequential Number Generation',
      'Vertical & Horizontal Array Reshaping (VSTACK, HSTACK, WRAP)',
    ],
    functions: [
      'FILTER',
      'SORT',
      'SORTBY',
      'UNIQUE',
      'SEQUENCE',
      'RANDARRAY',
      'VSTACK',
      'HSTACK',
      'CHOOSEROWS',
      'CHOOSECOLS',
      'TOCOL',
      'TOROW',
      'WRAPROWS',
      'WRAPCOLS',
    ],
    shortcuts: [
      'Ctrl + Shift + 8 (Select Entire Spill Range via #)',
      'F9 (Evaluate Array Token in Formula Bar)',
      'Alt + M + E (Error Checking Inspector)',
    ],
    gameMechanics: [
      'Spill Obstacle Clearance',
      'Dynamic Leaderboard Ladder',
      'Multi-Source Stack Assembler',
      'Matrix Unpivot Gauntlet',
    ],
    description:
      'Embrace Excel’s modern calculation engine. Write single-cell formulas that spill dynamically to generate real-time reports, automated leaderboards, and reshaped datasets.',
  },
  {
    id: 'excel-mod-10',
    number: 10,
    tier: 3,
    tierName: 'Tier 3: Modern Arrays & Business Intelligence',
    tierSlug: 'advanced',
    title: 'Functional Programming in Excel (LET & LAMBDA)',
    focus: 'Modular Code, Variables & Custom Functions',
    coreConcepts: [
      'Variable Declaration & Scope with LET',
      'Eliminating Redundant Calculations for Performance',
      'Encapsulating Custom Logic in LAMBDA Functions',
      'Higher-Order Iterative Helpers (MAP, SCAN, REDUCE, BYROW, BYCOL)',
      'Deploying Reusable Functions via Name Manager',
    ],
    functions: ['LET', 'LAMBDA', 'MAP', 'REDUCE', 'SCAN', 'BYROW', 'BYCOL', 'MAKEARRAY', 'ISOMITTED'],
    shortcuts: [
      'Ctrl + F3 (Name Manager Window)',
      'Alt + M + N (Define Name Dialog)',
      'Alt + Enter (New Line in Formula Bar)',
    ],
    gameMechanics: [
      'Formula Golf Optimization',
      'Custom Function Foundry',
      'Recursion Tower',
      'Performance Profiler Challenge',
    ],
    description:
      'Elevate spreadsheet modeling to software engineering. Store intermediate calculations in local variables with LET and package complex custom logic into reusable LAMBDA functions.',
  },
  {
    id: 'excel-mod-11',
    number: 11,
    tier: 3,
    tierName: 'Tier 3: Modern Arrays & Business Intelligence',
    tierSlug: 'advanced',
    title: 'PivotTables, PivotCharts & Dashboards',
    focus: 'Interactive Reporting & Visual Analytics',
    coreConcepts: [
      'Pivot Cache Architecture & Tabular Data Hygiene',
      'Row, Column, Value & Filter Quadrant Orchestration',
      'Value Summarization & Display Modes (% of Parent, Running Total)',
      'Calculated Fields & Calculated Items Formulation',
      'Interactive Slicers, Timelines & Report Connection Wiring',
    ],
    functions: ['GETPIVOTDATA', 'CUBEVALUE', 'CUBEMEMBER'],
    shortcuts: [
      'Alt + N + V (Insert PivotTable)',
      'Alt + F5 (Refresh Active PivotTable)',
      'Ctrl + Alt + F5 (Refresh All Data Connections)',
      'Alt + J + T + S (Insert Slicer)',
    ],
    gameMechanics: [
      'Executive War Room Assembly',
      'Slicer Synced Multi-Card Dashboard',
      'Calculated Field Audit',
      'Drill-Down Investigation',
    ],
    description:
      'Architect executive dashboards with connected PivotTables, visual Slicers, and dynamic KPI scorecards capable of slicing millions of data points in real time.',
  },
  {
    id: 'excel-mod-12',
    number: 12,
    tier: 3,
    tierName: 'Tier 3: Modern Arrays & Business Intelligence',
    tierSlug: 'advanced',
    title: 'Power Query (Automated ETL Pipelines)',
    focus: 'Extract, Transform & Load Without Code',
    coreConcepts: [
      'Power Query Applied Steps & Mashup Pipeline Architecture',
      'Folder Consolidation (Auto-Combining CSV & Excel Batches)',
      'Unpivoting Crosstabular Matrices to Normalized Tables',
      'Relational Merges (Inner, Left, Anti Joins) & Appends',
      'Power Query M Language Fundamentals & Custom Transformations',
    ],
    functions: [
      'Table.SelectRows',
      'Table.TransformColumnTypes',
      'Table.UnpivotOtherColumns',
      'Table.NestedJoin',
      'Table.Combine',
    ],
    shortcuts: [
      'Alt + A + P + T (Get Data Menu)',
      'Alt + F12 (Launch Power Query Editor Window)',
      'Ctrl + Shift + Plus (Add Applied Transformation Step)',
    ],
    gameMechanics: [
      'Corrupted CSV Pipeline Repair',
      'Folder Drop Automation Relay',
      'The Great Unpivot Transformation',
      'Multi-Source Join Reconciler',
    ],
    description:
      'Automate repetitive data prep workflows forever. Ingest dirty raw files from folders, normalize irregular reporting layouts, and construct repeatable ETL pipelines with Power Query.',
  },
  {
    id: 'excel-mod-13',
    number: 13,
    tier: 3,
    tierName: 'Tier 3: Modern Arrays & Business Intelligence',
    tierSlug: 'advanced',
    title: 'Data Modeling & Power Pivot (DAX)',
    focus: 'Star Schemas & Scalable Business Logic',
    coreConcepts: [
      'Star Schema Modeling (Fact vs Dimension Tables)',
      'Relationship Cardinality (1-to-Many) & Cross-Filtering Direction',
      'Calculated Columns vs Explicit DAX Measures',
      'Filter Context Transition & Evaluation Engine Mechanics',
      'DAX Time Intelligence (YTD, Prior Year Variance, Rolling Periods)',
    ],
    functions: [
      'CALCULATE',
      'FILTER',
      'ALL',
      'ALLEXCEPT',
      'RELATED',
      'RELATEDTABLE',
      'TOTALYTD',
      'SAMEPERIODLASTYEAR',
      'DISTINCTCOUNT',
      'DIVIDE',
    ],
    shortcuts: [
      'Alt + B + M (Open Power Pivot Window)',
      'Ctrl + Shift + Enter (Commit DAX Measure in Calculation Area)',
      'Alt + H + D + M (Manage Relationships Window)',
    ],
    gameMechanics: [
      'Relationship Web Architect',
      'Filter Context Maze',
      'Time Intelligence YoY Duel',
      'Grand Total Discrepancy Fix',
    ],
    description:
      'Break through Excel’s 1-million row limit with the Power Pivot VertiPaq engine. Build dimensional star schemas and master DAX filter context to author enterprise-scale metrics.',
  },

  // ==========================================
  // TIER 4: Optimization, Automation & Mastery (Endgame Worlds)
  // ==========================================
  {
    id: 'excel-mod-14',
    number: 14,
    tier: 4,
    tierName: 'Tier 4: Optimization, Automation & Mastery',
    tierSlug: 'endgame',
    title: 'Financial Modeling & What-If Analysis',
    focus: 'Forecasting, Capital Budgeting & Optimization',
    coreConcepts: [
      'Integrated 3-Statement Modeling & Dynamic Drivers',
      'Discounted Cash Flow (DCF) & Capital Budgeting (NPV, IRR, XIRR)',
      'Amortization & Debt Schedules (PMT, IPMT, PPMT)',
      'Sensitivity Analysis via 1-Variable & 2-Variable Data Tables',
      'Goal Seek Convergence & Linear Optimization via Solver',
    ],
    functions: ['NPV', 'XNPV', 'IRR', 'XIRR', 'PMT', 'IPMT', 'PPMT', 'RATE', 'NPER', 'SLN'],
    shortcuts: [
      'Alt + A + W + G (Goal Seek Dialog)',
      'Alt + A + W + T (What-If Data Table Dialog)',
      'Alt + A + Y (Launch Solver Add-in)',
      'Alt + A + W + S (Scenario Manager Window)',
    ],
    gameMechanics: [
      'Corporate M&A Valuation Model',
      'Debt Covenant Tightrope',
      'Solver Supply Chain Optimizer',
      'Multi-Scenario Boardroom Pitch',
    ],
    description:
      'Model complex corporate valuation scenarios, capital allocation decisions, and debt amortization. Use Solver and multi-variable Data Tables to optimize business outcomes under tight constraints.',
  },
  {
    id: 'excel-mod-15',
    number: 15,
    tier: 4,
    tierName: 'Tier 4: Optimization, Automation & Mastery',
    tierSlug: 'endgame',
    title: 'Macros & VBA Automation',
    focus: 'Scripting, Event Triggers & Process Automation',
    coreConcepts: [
      'Macro Recorder Capabilities & Code Hygiene',
      'VBA Object Hierarchy (Application > Workbook > Worksheet > Range)',
      'Variable Scoping, Loops (For Each, Do While) & Decision Branching',
      'Event Triggers (Worksheet_Change, Workbook_Open)',
      'Defensive Error Handling (On Error GoTo) & Safe Mode Execution',
    ],
    functions: [
      'MsgBox',
      'InputBox',
      'Range.Select',
      'Cells.Value',
      'Worksheet.Protect',
      'WorksheetFunction.Match',
    ],
    shortcuts: [
      'Alt + F11 (Visual Basic Editor Window)',
      'Alt + F8 (Macro Run Dialog)',
      'F5 (Execute Sub / Macro)',
      'F8 (Step Into / Line-by-Line Debug)',
    ],
    gameMechanics: [
      'Macro Speed Run',
      'Infinite Loop Escape',
      'Automated Report Dispatcher Bot',
      'Corrupted Workbook Healer Script',
    ],
    description:
      'Automate manual business tasks by writing clean VBA code. Build custom event triggers, automate bulk report generation, and debug workbook scripts in the Visual Basic Editor.',
  },
  {
    id: 'excel-mod-16',
    number: 16,
    tier: 4,
    tierName: 'Tier 4: Optimization, Automation & Mastery',
    tierSlug: 'endgame',
    title: 'Formula Auditing, Debugging & Performance',
    focus: 'Diagnostic Mastery, Volatility Control & Speed',
    coreConcepts: [
      'Precedent & Dependent Dependency Tree Auditing',
      'Dissecting Formula Errors (#N/A, #VALUE!, #REF!, #NUM!, #CALC!)',
      'Volatile Function Hazards (OFFSET, INDIRECT) & Recalc Chains',
      'Circular References & Iterative Calculation Limits',
      'Workbook Bloat Elimination & Calculation Engine Performance Profiling',
    ],
    functions: ['ISERROR', 'ISNUMBER', 'ISTEXT', 'ISBLANK', 'FORMULATEXT', 'INFO', 'CELL'],
    shortcuts: [
      'Ctrl + [ (Jump to Direct Precedents)',
      'Ctrl + ] (Jump to Direct Dependents)',
      'Ctrl + Shift + { (Select All Precedents)',
      'Alt + M + V (Evaluate Formula Step-by-Step)',
      'Alt + M + W (Launch Watch Window)',
    ],
    gameMechanics: [
      'Corrupted Megasheet Forensic Audit',
      'Volatile Function Defusal',
      'Circular Reference Knot Unraveling',
      'Calculation Speed Benchmark Trial',
    ],
    description:
      'The ultimate Excel mastery trial. Audit massive enterprise workbooks riddled with circular references, defuse calculation-choking volatile functions, and optimize performance for real-time operations.',
  },
];

// ==========================================
// Helper Functions & Statistics
// ==========================================

export const TOTAL_EXCEL_MODULES = EXCEL_MODULES.length;
export const TOTAL_EXCEL_TIERS = EXCEL_TIERS.length;

/**
 * Retrieve all 4 Excel skill tiers with metadata.
 */
export function getAllTiers(): ExcelTierInfo[] {
  return [...EXCEL_TIERS];
}

/**
 * Retrieve a specific tier by tier number (1..4) or slug.
 */
export function getTier(tierOrSlug: ExcelTierNumber | ExcelTierSlug): ExcelTierInfo | undefined {
  if (typeof tierOrSlug === 'number') {
    return EXCEL_TIERS.find((t) => t.tier === tierOrSlug);
  }
  return EXCEL_TIERS.find((t) => t.slug === tierOrSlug);
}

/**
 * Retrieve modules filtered by tier number (1..4) or slug ('beginner' | 'intermediate' | 'advanced' | 'endgame').
 */
export function getModulesByTier(tierOrSlug: ExcelTierNumber | ExcelTierSlug): ExcelModule[] {
  if (typeof tierOrSlug === 'number') {
    return EXCEL_MODULES.filter((m) => m.tier === tierOrSlug);
  }
  return EXCEL_MODULES.filter((m) => m.tierSlug === tierOrSlug);
}

/**
 * Retrieve a specific module by module number (1..16).
 */
export function getModuleByNumber(moduleNumber: number): ExcelModule | undefined {
  return EXCEL_MODULES.find((m) => m.number === moduleNumber);
}

/**
 * Retrieve a specific module by ID (e.g. 'excel-mod-1').
 */
export function getModuleById(id: string): ExcelModule | undefined {
  return EXCEL_MODULES.find((m) => m.id === id);
}

/**
 * Compute curriculum statistics including unique functions, shortcuts, and tier distributions.
 */
export function getCurriculumStats(): ExcelCurriculumStats {
  const uniqueFunctions = new Set<string>();
  const uniqueShortcuts = new Set<string>();

  const tierBreakdown: Record<ExcelTierNumber, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  };

  for (const mod of EXCEL_MODULES) {
    tierBreakdown[mod.tier] = (tierBreakdown[mod.tier] || 0) + 1;
    for (const fn of mod.functions) {
      uniqueFunctions.add(fn);
    }
    for (const sc of mod.shortcuts) {
      uniqueShortcuts.add(sc);
    }
  }

  return {
    totalModules: EXCEL_MODULES.length,
    totalTiers: EXCEL_TIERS.length,
    totalFunctions: uniqueFunctions.size,
    totalShortcuts: uniqueShortcuts.size,
    tierBreakdown,
  };
}

export const EXCEL_CURRICULUM_STATS = getCurriculumStats();
