import { Mission } from '../../../types/mission';

export const METRO_MISSIONS: Mission[] = [
  {
    id: 'metro_m1',
    order: 1,
    title: 'Booting the Grid',
    role: 'Junior Transit Data Engineer',
    storyline:
      'The main station registry was wiped during the midnight server migration. Before the first train leaves Whitefield at 5:00 AM, initialize the stations table so the signaling and dispatch system has a home.',
    businessProblem:
      'Without an active stations table, network signaling nodes cannot resolve platform track numbers, and automated fare gates fail to initialize across the city.',
    objective:
      'Create a table named "stations" with station_id (INTEGER PRIMARY KEY), station_name (TEXT NOT NULL), line_color (TEXT NOT NULL), zone (TEXT NOT NULL), base_fare_inr (INTEGER NOT NULL), daily_footfall (INTEGER DEFAULT 0), parking_slots (INTEGER), and status (TEXT DEFAULT "Operational").',
    requiredOutcome:
      'A newly created stations table ready to receive commuter telemetry and line coordinates.',
    checklist: [
      'Use CREATE TABLE stations (...)',
      'Define station_id INTEGER PRIMARY KEY',
      'Define station_name TEXT NOT NULL',
      'Define line_color TEXT NOT NULL',
      'Define zone TEXT NOT NULL',
      'Define base_fare_inr INTEGER NOT NULL',
      'Include daily_footfall INTEGER DEFAULT 0',
      'Include parking_slots INTEGER',
      'Include status TEXT DEFAULT "Operational"',
    ],
    sqlTopics: ['CREATE TABLE', 'PRIMARY KEY', 'NOT NULL', 'DEFAULT'],
    hints: [
      'Start with CREATE TABLE stations (...); and define each column with its datatype and constraint.',
      'Make sure station_id is marked as INTEGER PRIMARY KEY, and base_fare_inr has NOT NULL.',
      `CREATE TABLE stations (
  station_id INTEGER PRIMARY KEY,
  station_name TEXT NOT NULL,
  line_color TEXT NOT NULL,
  zone TEXT NOT NULL,
  base_fare_inr INTEGER NOT NULL,
  daily_footfall INTEGER DEFAULT 0,
  parking_slots INTEGER,
  status TEXT DEFAULT 'Operational'
);`,
    ],
    sampleSolution: `CREATE TABLE stations (
  station_id INTEGER PRIMARY KEY,
  station_name TEXT NOT NULL,
  line_color TEXT NOT NULL,
  zone TEXT NOT NULL,
  base_fare_inr INTEGER NOT NULL,
  daily_footfall INTEGER DEFAULT 0,
  parking_slots INTEGER,
  status TEXT DEFAULT 'Operational'
);`,
    solutionExplanation:
      'Relational database systems enforce operational integrity at the schema layer. By declaring station_id as PRIMARY KEY, we ensure every station is uniquely identifiable, while NOT NULL and DEFAULT guarantee predictable signaling queries.',
    initialSqlPlaceholder: `-- Mission 1: Initialize BMRCL stations table\n-- Write your SQL query below\n`,
    validationRules: [
      {
        type: 'TABLE_EXISTS',
        description: 'Verify stations table exists with required columns',
        expectedTable: 'stations',
        expectedColumns: [
          'station_id',
          'station_name',
          'line_color',
          'zone',
          'base_fare_inr',
          'daily_footfall',
          'parking_slots',
          'status',
        ],
      },
      {
        type: 'CUSTOM',
        description: 'Verify station_id is designated as PRIMARY KEY',
        customValidator: async (context) => {
          const schema = await context.getSchema();
          const table = schema['stations'] || schema['stations'.toLowerCase()];
          if (!table) return { passed: false, message: 'Table stations not found.' };
          const pkCol = table.columns.find((c: any) => c.pk === 1 || c.pk === true);
          if (!pkCol || pkCol.name.toLowerCase() !== 'station_id') {
            return {
              passed: false,
              message: 'The station_id column must be designated as PRIMARY KEY.',
              details: {
                hint: 'Define station_id as: station_id INTEGER PRIMARY KEY',
              },
            };
          }
          return { passed: true, message: 'Primary key constraint verified on station_id.' };
        },
      },
    ],
    xpReward: 100,
    badge: {
      id: 'grid_architect',
      title: 'Grid Architect',
      icon: 'Train',
    },
  },
  {
    id: 'metro_m2',
    order: 2,
    title: 'Smart Card Vault',
    role: 'Junior Transit Data Engineer',
    storyline:
      'Commuters are tapping in at Indiranagar and MG Road. Set up the smart_cards ledger with strict guardrails—no duplicate card serials and zero negative balances allowed across the contactless gate network.',
    businessProblem:
      'Unenforced balance rules risk fare evasion, while duplicate card serials cause cross-account debit collisions.',
    objective:
      'Create a table named "smart_cards" with card_id (INTEGER PRIMARY KEY AUTOINCREMENT), card_serial (TEXT UNIQUE NOT NULL), holder_type (TEXT NOT NULL), balance_inr (INTEGER CHECK (balance_inr >= 0)), and last_station (TEXT).',
    requiredOutcome:
      'An active smart_cards ledger enforcing uniqueness and non-negative wallet balances.',
    checklist: [
      'Use CREATE TABLE smart_cards (...)',
      'Define card_id INTEGER PRIMARY KEY AUTOINCREMENT',
      'Define card_serial TEXT UNIQUE NOT NULL',
      'Define holder_type TEXT NOT NULL',
      'Enforce balance_inr INTEGER CHECK (balance_inr >= 0)',
      'Include last_station TEXT',
    ],
    sqlTopics: ['CREATE TABLE', 'AUTOINCREMENT', 'UNIQUE', 'CHECK constraint'],
    hints: [
      'Use CREATE TABLE smart_cards (...) with card_id as INTEGER PRIMARY KEY AUTOINCREMENT.',
      'Add the constraint CHECK (balance_inr >= 0) to ensure card balances cannot drop below zero.',
      `CREATE TABLE smart_cards (
  card_id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_serial TEXT UNIQUE NOT NULL,
  holder_type TEXT NOT NULL,
  balance_inr INTEGER CHECK (balance_inr >= 0),
  last_station TEXT
);`,
    ],
    sampleSolution: `CREATE TABLE smart_cards (
  card_id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_serial TEXT UNIQUE NOT NULL,
  holder_type TEXT NOT NULL,
  balance_inr INTEGER CHECK (balance_inr >= 0),
  last_station TEXT
);`,
    solutionExplanation:
      'The CHECK constraint is evaluated on every INSERT and UPDATE. If any transaction attempts to set balance_inr to a negative value, SQLite rejects the operation and throws a constraint failure, protecting transit revenue.',
    initialSqlPlaceholder: `-- Mission 2: Create smart_cards ledger\n-- Write your SQL query below\n`,
    validationRules: [
      {
        type: 'TABLE_EXISTS',
        description: 'Verify smart_cards table exists with required columns',
        expectedTable: 'smart_cards',
        expectedColumns: [
          'card_id',
          'card_serial',
          'holder_type',
          'balance_inr',
          'last_station',
        ],
      },
      {
        type: 'CUSTOM',
        description: 'Verify CHECK (balance_inr >= 0) constraint blocks negative balances',
        customValidator: async (context) => {
          const testNegSql = `INSERT INTO smart_cards (card_serial, holder_type, balance_inr) VALUES ('NM-TEST-NEG', 'Regular', -50);`;
          const res = await context.executeSql(testNegSql);
          if (res.success) {
            await context.executeSql(`DELETE FROM smart_cards WHERE card_serial = 'NM-TEST-NEG';`);
            return {
              passed: false,
              message: 'The CHECK constraint is missing or not enforcing non-negative balances. CHECK (balance_inr >= 0) must block negative values.',
              details: {
                hint: 'Define balance_inr as: balance_inr INTEGER CHECK (balance_inr >= 0)',
              },
            };
          }
          return { passed: true, message: 'CHECK constraint verified: negative balances are blocked.' };
        },
      },
      {
        type: 'CUSTOM',
        description: 'Verify UNIQUE constraint on card_serial blocks duplicate cards',
        customValidator: async (context) => {
          const insert1 = `INSERT INTO smart_cards (card_serial, holder_type, balance_inr) VALUES ('NM-TEST-UNIQ', 'Regular', 100);`;
          const insert2 = `INSERT INTO smart_cards (card_serial, holder_type, balance_inr) VALUES ('NM-TEST-UNIQ', 'Regular', 200);`;
          await context.executeSql(insert1);
          const res2 = await context.executeSql(insert2);
          await context.executeSql(`DELETE FROM smart_cards WHERE card_serial = 'NM-TEST-UNIQ';`);
          if (res2.success) {
            return {
              passed: false,
              message: 'The UNIQUE constraint on card_serial is missing. Duplicate card serials must be rejected.',
              details: {
                hint: 'Define card_serial as: card_serial TEXT UNIQUE NOT NULL',
              },
            };
          }
          return { passed: true, message: 'UNIQUE constraint verified: duplicate card serials are blocked.' };
        },
      },
    ],
    xpReward: 100,
    badge: {
      id: 'card_vault_warden',
      title: 'Card Vault Warden',
      icon: 'ShieldCheck',
    },
  },
  {
    id: 'metro_m3',
    order: 3,
    title: 'Commissioning the Hubs',
    role: 'Junior Transit Data Engineer',
    storyline:
      'The tables are live, now feed in the core network hubs! Load our flagship stations into the stations registry so dispatchers can monitor the morning rush across the Purple, Green, and Yellow corridors.',
    businessProblem:
      'Transit dispatch displays remain blank until station entries are populated.',
    objective:
      'Insert the 8 flagship stations into the "stations" table: (101, "Majestic", "Purple", "Central", 30, 85000, NULL, "Operational"), (102, "Indiranagar", "Purple", "East", 25, 42000, 120, "Operational"), (103, "MG Road", "Purple", "Central", 20, 38000, NULL, "Operational"), (104, "Whitefield", "Purple", "East", 45, 52000, 250, "Operational"), (105, "Silk Institute", "Green", "South", 40, 28000, 180, "Operational"), (106, "RV Road", "Green", "South", 25, 31000, 90, "Operational"), (107, "Electronic City", "Yellow", "South", 50, 0, 300, "Under_Trial"), (108, "Test Terminal", "Yellow", "West", 15, 0, NULL, "Closed").',
    requiredOutcome:
      'All 8 stations successfully loaded into the stations table.',
    checklist: [
      'Use INSERT INTO stations (...) VALUES (...)',
      'Provide values for all 8 station entries',
      'Ensure NULL is provided for parking_slots on MG Road, Majestic, and Test Terminal',
    ],
    sqlTopics: ['INSERT INTO', 'VALUES', 'Batch Insert', 'NULL Handling'],
    hints: [
      'Use INSERT INTO stations (station_id, station_name, line_color, zone, base_fare_inr, daily_footfall, parking_slots, status) VALUES (...), (...);',
      'For NULL values, write NULL without quotes.',
      `INSERT INTO stations (station_id, station_name, line_color, zone, base_fare_inr, daily_footfall, parking_slots, status) VALUES
  (101, 'Majestic', 'Purple', 'Central', 30, 85000, NULL, 'Operational'),
  (102, 'Indiranagar', 'Purple', 'East', 25, 42000, 120, 'Operational'),
  (103, 'MG Road', 'Purple', 'Central', 20, 38000, NULL, 'Operational'),
  (104, 'Whitefield', 'Purple', 'East', 45, 52000, 250, 'Operational'),
  (105, 'Silk Institute', 'Green', 'South', 40, 28000, 180, 'Operational'),
  (106, 'RV Road', 'Green', 'South', 25, 31000, 90, 'Operational'),
  (107, 'Electronic City', 'Yellow', 'South', 50, 0, 300, 'Under_Trial'),
  (108, 'Test Terminal', 'Yellow', 'West', 15, 0, NULL, 'Closed');`,
    ],
    sampleSolution: `INSERT INTO stations (station_id, station_name, line_color, zone, base_fare_inr, daily_footfall, parking_slots, status) VALUES
  (101, 'Majestic', 'Purple', 'Central', 30, 85000, NULL, 'Operational'),
  (102, 'Indiranagar', 'Purple', 'East', 25, 42000, 120, 'Operational'),
  (103, 'MG Road', 'Purple', 'Central', 20, 38000, NULL, 'Operational'),
  (104, 'Whitefield', 'Purple', 'East', 45, 52000, 250, 'Operational'),
  (105, 'Silk Institute', 'Green', 'South', 40, 28000, 180, 'Operational'),
  (106, 'RV Road', 'Green', 'South', 25, 31000, 90, 'Operational'),
  (107, 'Electronic City', 'Yellow', 'South', 50, 0, 300, 'Under_Trial'),
  (108, 'Test Terminal', 'Yellow', 'West', 15, 0, NULL, 'Closed');`,
    solutionExplanation:
      'Multi-row INSERT statements batch rows into a single atomic database operation, ensuring that station catalogs populate quickly with zero partial states.',
    initialSqlPlaceholder: `-- Mission 3: Insert 8 flagship stations into stations\n-- Write your SQL query below\n`,
    validationRules: [
      {
        type: 'ROW_COUNT',
        description: 'Verify 8 stations exist in the stations table',
        expectedTable: 'stations',
        expectedRowCount: 8,
      },
      {
        type: 'ROW_EXISTS',
        description: 'Verify Majestic station data',
        expectedTable: 'stations',
        expectedWhereClause: "station_name = 'Majestic' AND daily_footfall = 85000",
      },
      {
        type: 'ROW_EXISTS',
        description: 'Verify Electronic City station data',
        expectedTable: 'stations',
        expectedWhereClause: "station_name = 'Electronic City' AND status = 'Under_Trial'",
      },
      {
        type: 'ROW_EXISTS',
        description: 'Verify Test Terminal station data',
        expectedTable: 'stations',
        expectedWhereClause: "station_name = 'Test Terminal' AND status = 'Closed'",
      },
    ],
    xpReward: 100,
    badge: {
      id: 'network_dispatcher',
      title: 'Network Dispatcher',
      icon: 'Layers',
    },
  },
  {
    id: 'metro_m4',
    order: 4,
    title: 'Network Recon',
    role: 'Junior Transit Data Engineer',
    storyline:
      'The Transport Minister’s office wants a quick snapshot of active metro lines and our busiest hubs ranked from highest to lowest footfall to prepare for crowd control deployment.',
    businessProblem:
      'Transit leadership needs an immediate passenger volume ranking to deploy reserve crowd marshals to high-density hubs.',
    objective:
      'Query station_name AS hub_name, line_color, and daily_footfall AS commuters from stations, sorted by daily_footfall in descending order (DESC).',
    requiredOutcome:
      'A sorted list of hubs with custom column aliases showing highest commuter footfall first.',
    checklist: [
      'SELECT station_name AS hub_name, line_color, daily_footfall AS commuters',
      'FROM stations',
      'ORDER BY daily_footfall DESC',
    ],
    sqlTopics: ['SELECT', 'Column Aliases (AS)', 'ORDER BY DESC'],
    hints: [
      'Use AS to alias station_name to hub_name, and daily_footfall to commuters.',
      'Append ORDER BY daily_footfall DESC at the end of your query.',
      `SELECT station_name AS hub_name, line_color, daily_footfall AS commuters\nFROM stations\nORDER BY daily_footfall DESC;`,
    ],
    sampleSolution: `SELECT station_name AS hub_name, line_color, daily_footfall AS commuters
FROM stations
ORDER BY daily_footfall DESC;`,
    solutionExplanation:
      'Column aliases improve report readability for non-technical stakeholders. ORDER BY with DESC prioritizes the highest footfall hubs (like Majestic at 85,000 daily commuters) at the top of the result set.',
    initialSqlPlaceholder: `-- Mission 4: Query busiest hubs ranked by footfall\n-- Write your SQL query below\n`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify hub footfall ranking sorted descending',
        expectedQuery: `SELECT station_name AS hub_name, line_color, daily_footfall AS commuters FROM stations ORDER BY daily_footfall DESC;`,
        orderSensitive: true,
      },
    ],
    xpReward: 100,
    badge: {
      id: 'footfall_analyst',
      title: 'Footfall Analyst',
      icon: 'BarChart2',
    },
  },
  {
    id: 'metro_m5',
    order: 5,
    title: 'Corridor & Fare Audit',
    role: 'Junior Transit Data Engineer',
    storyline:
      'We are reviewing mid-tier ticket pricing across the Purple and Yellow corridors. Pull every station on those two lines where the base fare sits between ₹25 and ₹50.',
    businessProblem:
      'Commuters on the tech corridor require affordable mid-tier transit options. Operations needs to verify fare caps across Purple and Yellow routes.',
    objective:
      'Select all columns from stations where line_color IN ("Purple", "Yellow") AND base_fare_inr BETWEEN 25 AND 50, ordered by base_fare_inr ASC.',
    requiredOutcome:
      'A filtered station list matching corridor lines and fare boundary constraints.',
    checklist: [
      'SELECT * FROM stations',
      'WHERE line_color IN ("Purple", "Yellow")',
      'AND base_fare_inr BETWEEN 25 AND 50',
      'ORDER BY base_fare_inr ASC',
    ],
    sqlTopics: ['WHERE', 'IN', 'BETWEEN ... AND', 'ORDER BY'],
    hints: [
      'Use line_color IN (\'Purple\', \'Yellow\') to check membership in multiple lines.',
      'Use BETWEEN 25 AND 50 to filter fares inclusively.',
      `SELECT * FROM stations\nWHERE line_color IN ('Purple', 'Yellow')\n  AND base_fare_inr BETWEEN 25 AND 50\nORDER BY base_fare_inr ASC;`,
    ],
    sampleSolution: `SELECT * FROM stations
WHERE line_color IN ('Purple', 'Yellow')
  AND base_fare_inr BETWEEN 25 AND 50
ORDER BY base_fare_inr ASC;`,
    solutionExplanation:
      'The IN operator simplifies multi-value matching compared to chained OR clauses. BETWEEN provides an inclusive numerical range check, filtering stations whose standard ticket fare is between ₹25 and ₹50.',
    initialSqlPlaceholder: `-- Mission 5: Corridor and fare range audit\n-- Write your SQL query below\n`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify Purple and Yellow corridor stations with fares between 25 and 50',
        expectedQuery: `SELECT * FROM stations WHERE line_color IN ('Purple', 'Yellow') AND base_fare_inr BETWEEN 25 AND 50 ORDER BY base_fare_inr ASC;`,
        orderSensitive: false,
      },
    ],
    xpReward: 100,
    badge: {
      id: 'corridor_auditor',
      title: 'Corridor Auditor',
      icon: 'Filter',
    },
  },
  {
    id: 'metro_m6',
    order: 6,
    title: 'Feeder Parking & Name Scan',
    role: 'Junior Transit Data Engineer',
    storyline:
      'BMTC wants to launch electric feeder autos at stations that lack dedicated parking lots, plus all operational stations with "Road" in their name (like MG Road and RV Road).',
    businessProblem:
      'Last-mile connectivity fails where parking is absent or road connectivity is dense.',
    objective:
      'Query all operational stations where parking_slots IS NULL OR station_name LIKE "%Road%", ensuring status = "Operational".',
    requiredOutcome:
      'Targeted station list of operational stations lacking parking facilities or containing "Road" in their title.',
    checklist: [
      'SELECT * FROM stations',
      'WHERE (parking_slots IS NULL OR station_name LIKE "%Road%")',
      'AND status = "Operational"',
    ],
    sqlTopics: ['LIKE', 'Wildcards (%)', 'IS NULL', 'Logical AND / OR'],
    hints: [
      'Use parking_slots IS NULL to identify stations without parking facilities.',
      'Use station_name LIKE \'%Road%\' to match any station with "Road" in its name.',
      `SELECT * FROM stations\nWHERE (parking_slots IS NULL OR station_name LIKE '%Road%')\n  AND status = 'Operational';`,
    ],
    sampleSolution: `SELECT * FROM stations
WHERE (parking_slots IS NULL OR station_name LIKE '%Road%')
  AND status = 'Operational';`,
    solutionExplanation:
      'IS NULL is the only reliable way to check for missing database values (as NULL = NULL is never true). Grouping the OR condition inside parentheses ensures the status = "Operational" check applies globally across the filter.',
    initialSqlPlaceholder: `-- Mission 6: Feeder parking and road scan\n-- Write your SQL query below\n`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify operational stations with missing parking or Road in name',
        expectedQuery: `SELECT * FROM stations WHERE (parking_slots IS NULL OR station_name LIKE '%Road%') AND status = 'Operational';`,
        orderSensitive: false,
      },
    ],
    xpReward: 100,
    badge: {
      id: 'feeder_navigator',
      title: 'Feeder Navigator',
      icon: 'Compass',
    },
  },
  {
    id: 'metro_m7',
    order: 7,
    title: 'Rush-Hour Fare & Status Update',
    role: 'Junior Transit Data Engineer',
    storyline:
      'Safety trials on the Electronic City stretch just cleared regulatory approval! Switch any "Under_Trial" station to "Operational" and set its base_fare_inr to 45.',
    businessProblem:
      'Electronic City station is ready for passenger boarding, but ticket gates are refusing cards while marked Under_Trial in the central database.',
    objective:
      'Execute an UPDATE statement on stations setting status = "Operational" and base_fare_inr = 45 WHERE status = "Under_Trial".',
    requiredOutcome:
      'Electronic City successfully transitioned to Operational with base fare set to 45.',
    checklist: [
      'Use UPDATE stations',
      'SET status = "Operational", base_fare_inr = 45',
      'WHERE status = "Under_Trial"',
    ],
    sqlTopics: ['UPDATE', 'SET', 'Conditional WHERE'],
    hints: [
      'Use UPDATE stations SET column1 = value1, column2 = value2 WHERE condition;',
      'Ensure you include WHERE status = \'Under_Trial\' to prevent updating unrelated stations.',
      `UPDATE stations\nSET status = 'Operational', base_fare_inr = 45\nWHERE status = 'Under_Trial';`,
    ],
    sampleSolution: `UPDATE stations
SET status = 'Operational', base_fare_inr = 45
WHERE status = 'Under_Trial';`,
    solutionExplanation:
      'UPDATE modifies existing records in place. Specifying the target condition in the WHERE clause ensures only the station currently undergoing trials is updated, while all other records remain untouched.',
    initialSqlPlaceholder: `-- Mission 7: Update station trial status and fare\n-- Write your SQL query below\n`,
    validationRules: [
      {
        type: 'ROW_EXISTS',
        description: 'Verify Electronic City is Operational with fare 45',
        expectedTable: 'stations',
        expectedWhereClause: "station_name = 'Electronic City' AND status = 'Operational' AND base_fare_inr = 45",
      },
      {
        type: 'ROW_ABSENT',
        description: 'Verify no stations remain Under_Trial',
        expectedTable: 'stations',
        expectedWhereClause: "status = 'Under_Trial'",
      },
      {
        type: 'ROW_EXISTS',
        description: 'Verify other stations were not inadvertently modified by unconstrained UPDATE',
        expectedTable: 'stations',
        expectedWhereClause: "station_name = 'Majestic' AND base_fare_inr = 30",
      },
    ],
    xpReward: 100,
    badge: {
      id: 'signaling_controller',
      title: 'Signaling Controller',
      icon: 'CheckCircle2',
    },
  },
  {
    id: 'metro_m8',
    order: 8,
    title: 'Purging Ghost Stations',
    role: 'Junior Transit Data Engineer',
    storyline:
      'An old test entry (status = "Closed") left over from the midnight server migration is skewing our capacity dashboards. Remove it safely from the stations table.',
    businessProblem:
      'Ghost test records cause discrepancies in active train route calculations and dispatcher maps.',
    objective:
      'Execute a DELETE statement removing any record from stations where status = "Closed".',
    requiredOutcome:
      'Decommissioned test station purged, reducing active station count from 8 to 7.',
    checklist: [
      'Use DELETE FROM stations',
      'WHERE status = "Closed"',
    ],
    sqlTopics: ['DELETE FROM', 'Targeted WHERE'],
    hints: [
      'Use DELETE FROM stations WHERE status = \'Closed\';',
      'Always include the WHERE clause when running DELETE to avoid clearing the entire table.',
      `DELETE FROM stations\nWHERE status = 'Closed';`,
    ],
    sampleSolution: `DELETE FROM stations
WHERE status = 'Closed';`,
    solutionExplanation:
      'DELETE removes rows matching the WHERE criteria. Without a WHERE clause, all rows in the table would be purged. Always audit target rows before running deletions on production transit databases.',
    initialSqlPlaceholder: `-- Mission 8: Delete closed test stations\n-- Write your SQL query below\n`,
    validationRules: [
      {
        type: 'ROW_COUNT',
        description: 'Verify table row count dropped to 7',
        expectedTable: 'stations',
        expectedRowCount: 7,
      },
      {
        type: 'ROW_ABSENT',
        description: 'Verify no Closed stations remain in table',
        expectedTable: 'stations',
        expectedWhereClause: "status = 'Closed'",
      },
    ],
    xpReward: 100,
    badge: {
      id: 'telemetry_sanitizer',
      title: 'Telemetry Sanitizer',
      icon: 'Trash2',
    },
  },
  {
    id: 'metro_m9',
    order: 9,
    title: 'End-of-Day Executive Telemetry',
    role: 'Junior Transit Data Engineer',
    storyline:
      '8:00 PM shift handover! Compile the final daily network metrics for BMRCL leadership in a single executive summary row.',
    businessProblem:
      'The BMRCL Managing Director needs the daily network operational KPI row to brief the Ministry of Urban Development.',
    objective:
      'Write a single aggregate SELECT query from stations computing: total_stations (COUNT(*)), total_footfall (SUM(daily_footfall)), avg_fare (ROUND(AVG(base_fare_inr), 2)), lowest_fare (MIN(base_fare_inr)), and peak_station_footfall (MAX(daily_footfall)).',
    requiredOutcome:
      'A single summary row with 5 executive transit performance indicators.',
    checklist: [
      'COUNT(*) AS total_stations',
      'SUM(daily_footfall) AS total_footfall',
      'ROUND(AVG(base_fare_inr), 2) AS avg_fare',
      'MIN(base_fare_inr) AS lowest_fare',
      'MAX(daily_footfall) AS peak_station_footfall',
      'FROM stations',
    ],
    sqlTopics: ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'ROUND'],
    hints: [
      'Compute all 5 aggregate functions in one SELECT statement.',
      'Use ROUND(AVG(base_fare_inr), 2) to format the average fare to 2 decimal places.',
      `SELECT 
  COUNT(*) AS total_stations,
  SUM(daily_footfall) AS total_footfall,
  ROUND(AVG(base_fare_inr), 2) AS avg_fare,
  MIN(base_fare_inr) AS lowest_fare,
  MAX(daily_footfall) AS peak_station_footfall
FROM stations;`,
    ],
    sampleSolution: `SELECT 
  COUNT(*) AS total_stations,
  SUM(daily_footfall) AS total_footfall,
  ROUND(AVG(base_fare_inr), 2) AS avg_fare,
  MIN(base_fare_inr) AS lowest_fare,
  MAX(daily_footfall) AS peak_station_footfall
FROM stations;`,
    solutionExplanation:
      'Aggregate functions collapse multiple rows of operational data into compact executive metrics. BMRCL leadership can instantly assess daily ridership volume, ticket pricing averages, and peak station pressure in a single glance.',
    initialSqlPlaceholder: `-- Mission 9: End-of-Day Executive Telemetry\n-- Write your SQL query below\n`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify 5 aggregate metrics match exact executive network summary',
        expectedQuery: `SELECT COUNT(*) AS total_stations, SUM(daily_footfall) AS total_footfall, ROUND(AVG(base_fare_inr), 2) AS avg_fare, MIN(base_fare_inr) AS lowest_fare, MAX(daily_footfall) AS peak_station_footfall FROM stations;`,
      },
    ],
    xpReward: 250,
    badge: {
      id: 'transit_commander',
      title: 'Transit Commander',
      icon: 'Award',
    },
  },
];
