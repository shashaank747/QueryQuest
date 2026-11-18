import { describe, it, expect, beforeAll } from 'vitest';
import initSqlJs from 'sql.js';
import { metroWorld } from '../src/modules/worlds/metro';
import { METRO_BASE_SCHEMA } from '../src/modules/worlds/metro/schema';
import { METRO_INITIAL_DATASET } from '../src/modules/worlds/metro/dataset';
import { METRO_MISSIONS } from '../src/modules/worlds/metro/missions';
import { ValidationEngine } from '../src/modules/validation/validation-engine';
import { generateSqlDiagnostic } from '../src/modules/sql-engine/diagnostics';
import { calculateLevel } from '../src/modules/gamification/achievements';
import { ValidationContext } from '../src/types/validation';
import { SqlExecutionResponse, SqlDatabaseSchema } from '../src/types/sql';

describe('World 2: Namma Metro — Transit Command (Full 9-Mission Playthrough & Audit Suite)', () => {
  let db: any;

  beforeAll(async () => {
    const SQL = await initSqlJs();
    db = new SQL.Database();
    db.exec('PRAGMA foreign_keys = ON;');
    if (metroWorld.initialSchemaSql) {
      db.exec(metroWorld.initialSchemaSql);
    }
    if (metroWorld.initialDatasetSql) {
      db.exec(metroWorld.initialDatasetSql);
    }
  });

  const getDatabaseSchema = (): SqlDatabaseSchema => {
    const tablesRes = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
    const schema: SqlDatabaseSchema = {};
    if (tablesRes.length > 0) {
      for (const row of tablesRes[0].values) {
        const tableName = row[0];
        const colsRes = db.exec(`PRAGMA table_info("${tableName}");`);
        const columns = colsRes[0].values.map((col: any[]) => ({
          name: col[1],
          type: col[2],
          notnull: col[3],
          dflt_value: col[4],
          pk: col[5],
        }));
        schema[tableName] = {
          name: tableName,
          columns,
          foreignKeys: [],
        };
      }
    }
    return schema;
  };

  const executeSql = async (sql: string): Promise<SqlExecutionResponse> => {
    const trimmed = sql.trim();
    const startTime = performance.now();
    try {
      const results = db.exec(sql);
      const executionTimeMs = performance.now() - startTime;
      const formattedResults = results.map((r: any) => ({
        columns: r.columns,
        values: r.values,
      }));
      return {
        query: sql,
        action: 'SELECT',
        results: formattedResults,
        executionTimeMs,
        affectedRows: db.getRowsModified ? db.getRowsModified() : 0,
        rowsAffected: db.getRowsModified ? db.getRowsModified() : 0,
        success: true,
      };
    } catch (err: any) {
      const executionTimeMs = performance.now() - startTime;
      const errorMsg = err?.message || String(err);
      const hint = generateSqlDiagnostic(errorMsg, trimmed);
      return {
        query: sql,
        action: 'OTHER',
        results: [],
        executionTimeMs,
        affectedRows: 0,
        rowsAffected: 0,
        success: false,
        error: errorMsg,
        hint,
      };
    }
  };

  const createContext = (studentSql: string, executionResponse: SqlExecutionResponse): ValidationContext => ({
    studentSql,
    executionResponse,
    executeSql,
    getSchema: async () => getDatabaseSchema(),
    getTableData: async (tableName: string, limit = 50) => {
      const res = db.exec(`SELECT * FROM "${tableName}" LIMIT ${limit};`);
      if (res.length === 0) return [];
      const cols = res[0].columns;
      return res[0].values.map((row: any[]) => {
        const obj: Record<string, any> = {};
        cols.forEach((col: string, idx: number) => {
          obj[col] = row[idx];
        });
        return obj;
      });
    },
  });

  describe('World Definition & Metadata Audit', () => {
    it('verifies World Definition metadata for Namma Metro', () => {
      expect(metroWorld.id).toBe('metro');
      expect(metroWorld.name).toBe('Namma Metro — Transit Command');
      expect(metroWorld.industry).toBe('Public Transit & Urban Mobility');
      expect(metroWorld.difficulty).toBe('Beginner');
      expect(metroWorld.estimatedTime).toBe('40 mins');
      expect(metroWorld.iconName).toBe('TrainFront');
      expect(metroWorld.accentColor).toBe('purple');
      expect(metroWorld.dbFileName).toBe('metro.db');
      expect(metroWorld.isAvailable).toBe(true);
      expect(metroWorld.missions.length).toBe(9);
      expect(metroWorld.initialSchemaSql).toBe(METRO_BASE_SCHEMA);
      expect(metroWorld.initialDatasetSql).toBe(METRO_INITIAL_DATASET);
      expect(metroWorld.reportConfig.metrics.length).toBe(5);
    });

    it('verifies story intro and responsibilities', () => {
      expect(metroWorld.storyIntro.roleTitle).toBe('Junior Transit Data Engineer');
      expect(metroWorld.storyIntro.organization).toBe('BMRCL Central Operations Control Room (OCC)');
      expect(metroWorld.storyIntro.background).toBeTruthy();
      expect(metroWorld.storyIntro.keyResponsibilities.length).toBe(5);
    });

    it('verifies all 9 missions have complete metadata and 3 hints each', () => {
      METRO_MISSIONS.forEach((m, idx) => {
        expect(m.order).toBe(idx + 1);
        expect(m.id).toBe(`metro_m${idx + 1}`);
        expect(m.title).toBeTruthy();
        expect(m.role).toBe('Junior Transit Data Engineer');
        expect(m.storyline).toBeTruthy();
        expect(m.businessProblem).toBeTruthy();
        expect(m.objective).toBeTruthy();
        expect(m.requiredOutcome).toBeTruthy();
        expect(m.checklist.length).toBeGreaterThanOrEqual(2);
        expect(m.hints.length).toBe(3);
        expect(m.sampleSolution).toBeTruthy();
        expect(m.solutionExplanation).toBeTruthy();
        expect(m.initialSqlPlaceholder).toBeTruthy();
        expect(m.validationRules.length).toBeGreaterThanOrEqual(1);
        expect(m.xpReward).toBeGreaterThan(0);
        expect(m.badge).toBeDefined();
        expect(m.badge?.id).toBeTruthy();
        expect(m.badge?.title).toBeTruthy();
        expect(m.badge?.icon).toBeTruthy();
      });
    });

    it('verifies cumulative XP rewards sum to 1050 XP', () => {
      const totalXp = METRO_MISSIONS.reduce((sum, m) => sum + m.xpReward, 0);
      expect(totalXp).toBe(1050);
    });
  });

  describe('Mission 1 (metro_m1): Booting the Grid (CREATE TABLE stations)', () => {
    const m1 = METRO_MISSIONS[0];

    it('intentional error: syntax error in CREATE TABLE triggers diagnostic', async () => {
      const badSql = `CREATE TABLE stations (
        station_id INTEGER PRIMARY KEY,
        station_name TEXT NOT NULL
      `; // Missing closing parenthesis
      const res = await executeSql(badSql);
      expect(res.success).toBe(false);
      expect(res.hint).toMatch(/syntax error|incomplete|parenthesis/i);

      const ctx = createContext(badSql, res);
      const feedback = await ValidationEngine.validate(m1.validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toMatch(/SQL error/i);
    });

    it('intentional error: missing required column fails table validation', async () => {
      // Create temporary incomplete table under different name to test validation failure
      const incompleteSql = `CREATE TABLE wrong_stations (
        station_id INTEGER PRIMARY KEY,
        station_name TEXT NOT NULL
      );`;
      const res = await executeSql(incompleteSql);
      expect(res.success).toBe(true);

      const ctx = createContext(incompleteSql, res);
      const feedback = await ValidationEngine.validate(m1.validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toMatch(/stations.*does not exist/i);

      // Clean up
      db.exec('DROP TABLE IF EXISTS wrong_stations;');
    });

    it('sampleSolution passes validation and defines stations schema with primary key', async () => {
      const sql = m1.sampleSolution;
      const res = await executeSql(sql);
      expect(res.success).toBe(true);

      const ctx = createContext(sql, res);
      const feedback = await ValidationEngine.validate(m1.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const schema = getDatabaseSchema();
      expect(schema['stations']).toBeDefined();
      const cols = schema['stations'].columns;
      expect(cols.map((c) => c.name)).toEqual([
        'station_id',
        'station_name',
        'line_color',
        'zone',
        'base_fare_inr',
        'daily_footfall',
        'parking_slots',
        'status',
      ]);
      const pkCol = cols.find((c) => c.name === 'station_id');
      expect(pkCol?.pk).toBe(1);
    });

    it('submitting CREATE TABLE IF NOT EXISTS variant passes validation', async () => {
      const alternateSql = `CREATE TABLE IF NOT EXISTS stations (
        station_id INTEGER PRIMARY KEY,
        station_name TEXT NOT NULL,
        line_color TEXT NOT NULL,
        zone TEXT NOT NULL,
        base_fare_inr INTEGER NOT NULL,
        daily_footfall INTEGER DEFAULT 0,
        parking_slots INTEGER,
        status TEXT DEFAULT 'Operational'
      );`;
      const res = await executeSql(alternateSql);
      expect(res.success).toBe(true);

      const ctx = createContext(alternateSql, res);
      const feedback = await ValidationEngine.validate(m1.validationRules, ctx);
      expect(feedback.passed).toBe(true);
    });
  });

  describe('Mission 2 (metro_m2): Smart Card Vault (CREATE TABLE smart_cards)', () => {
    const m2 = METRO_MISSIONS[1];

    it('intentional error: missing closing paren triggers diagnostic', async () => {
      const badSql = `CREATE TABLE smart_cards ( card_id INTEGER PRIMARY KEY`;
      const res = await executeSql(badSql);
      expect(res.success).toBe(false);
      expect(res.hint).toMatch(/syntax error|incomplete|parenthesis/i);

      const ctx = createContext(badSql, res);
      const feedback = await ValidationEngine.validate(m2.validationRules, ctx);
      expect(feedback.passed).toBe(false);
    });

    it('sampleSolution passes validation and defines smart_cards schema', async () => {
      const sql = m2.sampleSolution;
      const res = await executeSql(sql);
      expect(res.success).toBe(true);

      const ctx = createContext(sql, res);
      const feedback = await ValidationEngine.validate(m2.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const schema = getDatabaseSchema();
      expect(schema['smart_cards']).toBeDefined();
      expect(schema['smart_cards'].columns.map((c) => c.name)).toEqual([
        'card_id',
        'card_serial',
        'holder_type',
        'balance_inr',
        'last_station',
      ]);
    });

    it('verifies CHECK constraint blocks negative balances in SQLite', async () => {
      const negSql = `INSERT INTO smart_cards (card_serial, holder_type, balance_inr) VALUES ('NM-FAIL-01', 'Regular', -100);`;
      const res = await executeSql(negSql);
      expect(res.success).toBe(false);
      expect(res.error).toMatch(/CHECK constraint failed/i);
    });

    it('verifies UNIQUE constraint blocks duplicate card serials in SQLite', async () => {
      const ins1 = `INSERT INTO smart_cards (card_serial, holder_type, balance_inr) VALUES ('NM-UNIQ-01', 'Regular', 100);`;
      const res1 = await executeSql(ins1);
      expect(res1.success).toBe(true);

      const ins2 = `INSERT INTO smart_cards (card_serial, holder_type, balance_inr) VALUES ('NM-UNIQ-01', 'Student', 150);`;
      const res2 = await executeSql(ins2);
      expect(res2.success).toBe(false);
      expect(res2.error).toMatch(/UNIQUE constraint failed/i);

      // Clean up test card
      db.exec(`DELETE FROM smart_cards WHERE card_serial = 'NM-UNIQ-01';`);
    });

    it('verifies AUTOINCREMENT generates sequential card IDs', async () => {
      const insA = `INSERT INTO smart_cards (card_serial, holder_type, balance_inr) VALUES ('NM-AUTO-01', 'Regular', 50);`;
      const insB = `INSERT INTO smart_cards (card_serial, holder_type, balance_inr) VALUES ('NM-AUTO-02', 'Senior', 75);`;
      await executeSql(insA);
      await executeSql(insB);

      const rowsRes = db.exec(`SELECT card_id, card_serial FROM smart_cards WHERE card_serial LIKE 'NM-AUTO-%' ORDER BY card_id ASC;`);
      expect(rowsRes[0].values.length).toBe(2);
      expect(rowsRes[0].values[0][1]).toBe('NM-AUTO-01');
      expect(rowsRes[0].values[1][1]).toBe('NM-AUTO-02');
      expect(rowsRes[0].values[1][0]).toBeGreaterThan(rowsRes[0].values[0][0]);

      // Clean up test cards
      db.exec(`DELETE FROM smart_cards WHERE card_serial LIKE 'NM-AUTO-%';`);
    });
  });

  describe('Mission 3 (metro_m3): Commissioning the Hubs (INSERT 8 stations)', () => {
    const m3 = METRO_MISSIONS[2];

    it('intentional error: missing comma in VALUES triggers diagnostic', async () => {
      const badSql = `INSERT INTO stations (station_id, station_name, line_color, zone, base_fare_inr, daily_footfall, parking_slots, status) VALUES
        (101 'Majestic', 'Purple', 'Central', 30, 85000, NULL, 'Operational');`;
      const res = await executeSql(badSql);
      expect(res.success).toBe(false);
      expect(res.hint).toMatch(/syntax error|comma/i);
    });

    it('sampleSolution passes validation and inserts 8 flagship stations', async () => {
      const sql = m3.sampleSolution;
      const res = await executeSql(sql);
      expect(res.success).toBe(true);

      const ctx = createContext(sql, res);
      const feedback = await ValidationEngine.validate(m3.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const countRes = db.exec('SELECT COUNT(*) FROM stations;');
      expect(countRes[0].values[0][0]).toBe(8);

      // Verify specific stations
      const majestic = db.exec("SELECT line_color, daily_footfall, parking_slots FROM stations WHERE station_name = 'Majestic';");
      expect(majestic[0].values[0][0]).toBe('Purple');
      expect(majestic[0].values[0][1]).toBe(85000);
      expect(majestic[0].values[0][2]).toBeNull();

      const ecity = db.exec("SELECT status, parking_slots FROM stations WHERE station_name = 'Electronic City';");
      expect(ecity[0].values[0][0]).toBe('Under_Trial');
      expect(ecity[0].values[0][1]).toBe(300);

      const terminal = db.exec("SELECT status, parking_slots FROM stations WHERE station_name = 'Test Terminal';");
      expect(terminal[0].values[0][0]).toBe('Closed');
      expect(terminal[0].values[0][1]).toBeNull();
    });

    it('re-running validation confirms row count remains 8', async () => {
      const ctx = createContext(m3.sampleSolution, {
        query: m3.sampleSolution,
        action: 'SELECT',
        results: [],
        executionTimeMs: 1,
        affectedRows: 0,
        rowsAffected: 0,
        success: true,
      });
      const feedback = await ValidationEngine.validate(m3.validationRules, ctx);
      expect(feedback.passed).toBe(true);
    });
  });

  describe('Mission 4 (metro_m4): Network Recon (SELECT, AS, ORDER BY DESC)', () => {
    const m4 = METRO_MISSIONS[3];

    it('intentional error: non-existent column generates diagnostic', async () => {
      const badSql = `SELECT station_title, line_color FROM stations ORDER BY daily_footfall DESC;`;
      const res = await executeSql(badSql);
      expect(res.success).toBe(false);
      expect(res.hint).toMatch(/station_title/i);
    });

    it('intentional error: ASC sort order fails orderSensitive validation', async () => {
      const wrongOrderSql = `SELECT station_name AS hub_name, line_color, daily_footfall AS commuters
        FROM stations
        ORDER BY daily_footfall ASC;`;
      const res = await executeSql(wrongOrderSql);
      expect(res.success).toBe(true);

      const ctx = createContext(wrongOrderSql, res);
      const feedback = await ValidationEngine.validate(m4.validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toMatch(/ORDER BY|ordering/i);
    });

    it('sampleSolution passes validation and ranks hubs by footfall DESC', async () => {
      const sql = m4.sampleSolution;
      const res = await executeSql(sql);
      expect(res.success).toBe(true);

      const ctx = createContext(sql, res);
      const feedback = await ValidationEngine.validate(m4.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const results = res.results[0];
      expect(results.columns).toEqual(['hub_name', 'line_color', 'commuters']);
      expect(results.values.length).toBe(8);
      // Top hub must be Majestic (85,000)
      expect(results.values[0][0]).toBe('Majestic');
      expect(results.values[0][2]).toBe(85000);
      // Lowest footfall stations (0) at the bottom
      const lastRow = results.values[results.values.length - 1];
      expect(lastRow[2]).toBe(0);
    });

    it('alternate valid query: ordering by alias commuters DESC passes validation', async () => {
      const aliasOrderSql = `SELECT station_name AS hub_name, line_color, daily_footfall AS commuters
        FROM stations
        ORDER BY commuters DESC;`;
      const res = await executeSql(aliasOrderSql);
      expect(res.success).toBe(true);

      const ctx = createContext(aliasOrderSql, res);
      const feedback = await ValidationEngine.validate(m4.validationRules, ctx);
      expect(feedback.passed).toBe(true);
    });

    it('alternate valid query: lowercase SQL with table qualification passes validation', async () => {
      const lowerSql = `select stations.station_name as hub_name, stations.line_color, stations.daily_footfall as commuters
        from stations
        order by stations.daily_footfall desc;`;
      const res = await executeSql(lowerSql);
      expect(res.success).toBe(true);

      const ctx = createContext(lowerSql, res);
      const feedback = await ValidationEngine.validate(m4.validationRules, ctx);
      expect(feedback.passed).toBe(true);
    });
  });

  describe('Mission 5 (metro_m5): Corridor & Fare Audit (WHERE IN and BETWEEN)', () => {
    const m5 = METRO_MISSIONS[4];

    it('intentional error: misspelled BETWEEN keyword triggers diagnostic', async () => {
      const badSql = `SELECT * FROM stations WHERE line_color IN ('Purple', 'Yellow') AND base_fare_inr BETWEN 25 AND 50;`;
      const res = await executeSql(badSql);
      expect(res.success).toBe(false);
      expect(res.hint).toMatch(/syntax error/i);
    });

    it('intentional error: wrong line filter fails validation', async () => {
      const wrongLineSql = `SELECT * FROM stations WHERE line_color IN ('Green') AND base_fare_inr BETWEEN 25 AND 50;`;
      const res = await executeSql(wrongLineSql);
      expect(res.success).toBe(true);

      const ctx = createContext(wrongLineSql, res);
      const feedback = await ValidationEngine.validate(m5.validationRules, ctx);
      expect(feedback.passed).toBe(false);
    });

    it('intentional error: wrong fare range fails validation', async () => {
      const wrongRangeSql = `SELECT * FROM stations WHERE line_color IN ('Purple', 'Yellow') AND base_fare_inr BETWEEN 10 AND 20;`;
      const res = await executeSql(wrongRangeSql);
      expect(res.success).toBe(true);

      const ctx = createContext(wrongRangeSql, res);
      const feedback = await ValidationEngine.validate(m5.validationRules, ctx);
      expect(feedback.passed).toBe(false);
    });

    it('sampleSolution passes validation and returns 4 stations in fare bracket', async () => {
      const sql = m5.sampleSolution;
      const res = await executeSql(sql);
      expect(res.success).toBe(true);

      const ctx = createContext(sql, res);
      const feedback = await ValidationEngine.validate(m5.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const rows = res.results[0].values;
      expect(rows.length).toBe(4);
      const names = rows.map((r: any[]) => r[1]);
      expect(names).toContain('Indiranagar'); // Purple, 25
      expect(names).toContain('Majestic');    // Purple, 30
      expect(names).toContain('Whitefield');  // Purple, 45
      expect(names).toContain('Electronic City'); // Yellow, 50
      // MG Road (20) and Test Terminal (15) excluded by fare range; Green line excluded
      expect(names).not.toContain('MG Road');
      expect(names).not.toContain('Silk Institute');
    });

    it('alternate valid query: chained OR and <= / >= operators passes validation', async () => {
      const alternateSql = `SELECT * FROM stations
        WHERE (line_color = 'Purple' OR line_color = 'Yellow')
          AND base_fare_inr >= 25 AND base_fare_inr <= 50
        ORDER BY base_fare_inr ASC;`;
      const res = await executeSql(alternateSql);
      expect(res.success).toBe(true);

      const ctx = createContext(alternateSql, res);
      const feedback = await ValidationEngine.validate(m5.validationRules, ctx);
      expect(feedback.passed).toBe(true);
    });

    it('alternate valid query: inverted IN list order passes validation', async () => {
      const invertedSql = `SELECT * FROM stations
        WHERE line_color IN ('Yellow', 'Purple')
          AND base_fare_inr BETWEEN 25 AND 50
        ORDER BY base_fare_inr ASC;`;
      const res = await executeSql(invertedSql);
      expect(res.success).toBe(true);

      const ctx = createContext(invertedSql, res);
      const feedback = await ValidationEngine.validate(m5.validationRules, ctx);
      expect(feedback.passed).toBe(true);
    });
  });

  describe('Mission 6 (metro_m6): Feeder Parking & Name Scan (LIKE, IS NULL, OR)', () => {
    const m6 = METRO_MISSIONS[5];

    it('intentional error: malformed LIKE clause triggers diagnostic', async () => {
      const badSql = `SELECT * FROM stations WHERE station_name LIKE;`;
      const res = await executeSql(badSql);
      expect(res.success).toBe(false);
      expect(res.hint).toMatch(/syntax error/i);
    });

    it('intentional error: missing parentheses around OR includes Closed test station and fails validation', async () => {
      // AND binds tighter than OR, so Test Terminal (status Closed, parking NULL) erroneously leaks through
      const unparenthesizedSql = `SELECT * FROM stations
        WHERE parking_slots IS NULL OR station_name LIKE '%Road%' AND status = 'Operational';`;
      const res = await executeSql(unparenthesizedSql);
      expect(res.success).toBe(true);

      const rows = res.results[0].values;
      expect(rows.length).toBe(4); // Erroneously includes Test Terminal

      const ctx = createContext(unparenthesizedSql, res);
      const feedback = await ValidationEngine.validate(m6.validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toMatch(/Returned 4 record\(s\), but 3 were expected/);
    });

    it('sampleSolution passes validation and isolates 3 operational feeder candidate hubs', async () => {
      const sql = m6.sampleSolution;
      const res = await executeSql(sql);
      expect(res.success).toBe(true);

      const ctx = createContext(sql, res);
      const feedback = await ValidationEngine.validate(m6.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const rows = res.results[0].values;
      expect(rows.length).toBe(3);
      const stationNames = rows.map((r: any[]) => r[1]);
      expect(stationNames).toContain('Majestic'); // NULL parking, Operational
      expect(stationNames).toContain('MG Road');  // NULL parking and Road, Operational
      expect(stationNames).toContain('RV Road');  // Parking=90 but has Road, Operational
      // Test Terminal (Closed) and Electronic City (Under_Trial) excluded
      expect(stationNames).not.toContain('Test Terminal');
      expect(stationNames).not.toContain('Electronic City');
    });

    it('alternate valid query: commuted AND with status check first passes validation', async () => {
      const alternateSql = `SELECT * FROM stations
        WHERE status = 'Operational'
          AND (parking_slots IS NULL OR station_name LIKE '%Road%');`;
      const res = await executeSql(alternateSql);
      expect(res.success).toBe(true);

      const ctx = createContext(alternateSql, res);
      const feedback = await ValidationEngine.validate(m6.validationRules, ctx);
      expect(feedback.passed).toBe(true);
    });
  });

  describe('Mission 7 (metro_m7): Rush-Hour Fare & Status Update (UPDATE Electronic City)', () => {
    const m7 = METRO_MISSIONS[6];

    it('intentional error: missing SET keyword in UPDATE triggers diagnostic', async () => {
      const badSql = `UPDATE stations status = 'Operational' WHERE status = 'Under_Trial';`;
      const res = await executeSql(badSql);
      expect(res.success).toBe(false);
      expect(res.hint).toMatch(/syntax error|SET/i);
    });

    it('intentional error: setting wrong fare value fails ROW_EXISTS validation', async () => {
      const wrongFareSql = `UPDATE stations SET status = 'Operational', base_fare_inr = 99 WHERE status = 'Under_Trial';`;
      const res = await executeSql(wrongFareSql);
      expect(res.success).toBe(true);

      const ctx = createContext(wrongFareSql, res);
      const feedback = await ValidationEngine.validate(m7.validationRules, ctx);
      expect(feedback.passed).toBe(false);

      // Revert test change back to Under_Trial
      db.exec("UPDATE stations SET status = 'Under_Trial', base_fare_inr = 50 WHERE station_name = 'Electronic City';");
    });

    it('sampleSolution passes validation and transitions Electronic City to Operational', async () => {
      const sql = m7.sampleSolution;
      const res = await executeSql(sql);
      expect(res.success).toBe(true);

      const ctx = createContext(sql, res);
      const feedback = await ValidationEngine.validate(m7.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const checkRes = db.exec("SELECT status, base_fare_inr FROM stations WHERE station_name = 'Electronic City';");
      expect(checkRes[0].values[0][0]).toBe('Operational');
      expect(checkRes[0].values[0][1]).toBe(45);

      // Verify no stations remain Under_Trial
      const trialRes = db.exec("SELECT COUNT(*) FROM stations WHERE status = 'Under_Trial';");
      expect(trialRes[0].values[0][0]).toBe(0);

      // Verify other stations were untouched (Majestic remains fare 30)
      const majesticRes = db.exec("SELECT base_fare_inr FROM stations WHERE station_name = 'Majestic';");
      expect(majesticRes[0].values[0][0]).toBe(30);
    });

    it('re-running validation confirms Electronic City remains Operational with fare 45', async () => {
      const ctx = createContext(m7.sampleSolution, {
        query: m7.sampleSolution,
        action: 'UPDATE',
        results: [],
        executionTimeMs: 1,
        affectedRows: 0,
        rowsAffected: 0,
        success: true,
      });
      const feedback = await ValidationEngine.validate(m7.validationRules, ctx);
      expect(feedback.passed).toBe(true);
    });
  });

  describe('Mission 8 (metro_m8): Purging Ghost Stations (DELETE FROM stations WHERE status = "Closed")', () => {
    const m8 = METRO_MISSIONS[7];

    it('intentional error: missing FROM keyword triggers diagnostic', async () => {
      const badSql = `DELETE stations WHERE status = 'Closed';`;
      const res = await executeSql(badSql);
      expect(res.success).toBe(false);
      expect(res.hint).toMatch(/syntax error|FROM/i);
    });

    it('sampleSolution passes validation and drops table row count from 8 to 7', async () => {
      const sql = m8.sampleSolution;
      const res = await executeSql(sql);
      expect(res.success).toBe(true);

      const ctx = createContext(sql, res);
      const feedback = await ValidationEngine.validate(m8.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const countRes = db.exec('SELECT COUNT(*) FROM stations;');
      expect(countRes[0].values[0][0]).toBe(7);

      // Verify Test Terminal was purged
      const ghostRes = db.exec("SELECT COUNT(*) FROM stations WHERE station_name = 'Test Terminal';");
      expect(ghostRes[0].values[0][0]).toBe(0);

      // Verify 0 Closed stations remain
      const closedRes = db.exec("SELECT COUNT(*) FROM stations WHERE status = 'Closed';");
      expect(closedRes[0].values[0][0]).toBe(0);
    });

    it('re-running validation confirms table row count is 7 and no Closed stations exist', async () => {
      const ctx = createContext(m8.sampleSolution, {
        query: m8.sampleSolution,
        action: 'DELETE',
        results: [],
        executionTimeMs: 1,
        affectedRows: 0,
        rowsAffected: 0,
        success: true,
      });
      const feedback = await ValidationEngine.validate(m8.validationRules, ctx);
      expect(feedback.passed).toBe(true);
    });
  });

  describe('Mission 9 (metro_m9): End-of-Day Executive Telemetry (COUNT, SUM, AVG, MIN, MAX, ROUND)', () => {
    const m9 = METRO_MISSIONS[8];

    it('intentional error: syntax error in aggregate function triggers diagnostic', async () => {
      const badSql = `SELECT COUNT(*, SUM(daily_footfall) FROM stations;`;
      const res = await executeSql(badSql);
      expect(res.success).toBe(false);
      expect(res.hint).toMatch(/syntax error/i);
    });

    it('intentional error: omitting aggregate metrics fails validation', async () => {
      const partialSql = `SELECT COUNT(*) AS total_stations, SUM(daily_footfall) AS total_footfall FROM stations;`;
      const res = await executeSql(partialSql);
      expect(res.success).toBe(true);

      const ctx = createContext(partialSql, res);
      const feedback = await ValidationEngine.validate(m9.validationRules, ctx);
      expect(feedback.passed).toBe(false);
    });

    it('sampleSolution passes validation and returns 5 executive transit performance indicators', async () => {
      const sql = m9.sampleSolution;
      const res = await executeSql(sql);
      expect(res.success).toBe(true);

      const ctx = createContext(sql, res);
      const feedback = await ValidationEngine.validate(m9.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const cols = res.results[0].columns;
      expect(cols).toEqual(['total_stations', 'total_footfall', 'avg_fare', 'lowest_fare', 'peak_station_footfall']);

      const vals = res.results[0].values[0];
      expect(vals[0]).toBe(7);          // 7 active commissioned stations
      expect(vals[1]).toBe(276000);     // Total daily footfall (85k + 42k + 38k + 52k + 28k + 31k + 0)
      expect(vals[2]).toBe(32.86);      // ROUND(AVG(base_fare_inr), 2)
      expect(vals[3]).toBe(20);         // MIN(base_fare_inr) at MG Road
      expect(vals[4]).toBe(85000);      // MAX(daily_footfall) at Majestic
    });

    it('alternate valid query: COUNT(station_id) and unrounded AVG passes validation', async () => {
      const alternateSql = `SELECT 
        COUNT(station_id) AS total_stations,
        SUM(daily_footfall) AS total_footfall,
        AVG(base_fare_inr) AS avg_fare,
        MIN(base_fare_inr) AS lowest_fare,
        MAX(daily_footfall) AS peak_station_footfall
      FROM stations;`;
      const res = await executeSql(alternateSql);
      expect(res.success).toBe(true);

      const ctx = createContext(alternateSql, res);
      const feedback = await ValidationEngine.validate(m9.validationRules, ctx);
      expect(feedback.passed).toBe(true);
    });
  });

  describe('Post-Playthrough Executive Analytics & Report Metrics Audit', () => {
    it('executes all 5 reportConfig analytical queries successfully against final database state', async () => {
      expect(metroWorld.reportConfig.metrics.length).toBe(5);

      for (const metric of metroWorld.reportConfig.metrics) {
        const res = await executeSql(metric.query);
        expect(res.success, `Metric query failed for ${metric.title}: ${res.error}`).toBe(true);
        expect(res.results.length).toBeGreaterThan(0);
        expect(res.results[0].values.length).toBeGreaterThan(0);
      }
    });

    it('verifies exact metric outputs for executive leadership briefing', async () => {
      // 1. Total stations
      const m1Res = await executeSql(metroWorld.reportConfig.metrics[0].query);
      expect(m1Res.results[0].values[0][0]).toBe(7);

      // 2. Formatted total daily footfall
      const m2Res = await executeSql(metroWorld.reportConfig.metrics[1].query);
      expect(m2Res.results[0].values[0][0]).toBe('276,000');

      // 3. Formatted average base fare with INR symbol
      const m3Res = await executeSql(metroWorld.reportConfig.metrics[2].query);
      expect(m3Res.results[0].values[0][0]).toBe('₹32.86');

      // 4. Ridership by transit line
      const m4Res = await executeSql(metroWorld.reportConfig.metrics[3].query);
      const lineRows = m4Res.results[0].values;
      expect(lineRows.length).toBe(3);
      // Purple line should have highest ridership (217,000)
      expect(lineRows[0][0]).toBe('Purple');
      expect(lineRows[0][1]).toBe(217000);
      // Green line (59,000)
      expect(lineRows[1][0]).toBe('Green');
      expect(lineRows[1][1]).toBe(59000);
      // Yellow line (0)
      expect(lineRows[2][0]).toBe('Yellow');
      expect(lineRows[2][1]).toBe(0);

      // 5. Top 5 High-footfall hubs
      const m5Res = await executeSql(metroWorld.reportConfig.metrics[4].query);
      const hubRows = m5Res.results[0].values;
      expect(hubRows.length).toBe(5);
      expect(hubRows[0][0]).toBe('Majestic');
      expect(hubRows[0][2]).toBe(85000);
      expect(hubRows[1][0]).toBe('Whitefield');
      expect(hubRows[1][2]).toBe(52000);
      expect(hubRows[2][0]).toBe('Indiranagar');
      expect(hubRows[2][2]).toBe(42000);
      expect(hubRows[3][0]).toBe('MG Road');
      expect(hubRows[3][2]).toBe(38000);
      expect(hubRows[4][0]).toBe('RV Road');
      expect(hubRows[4][2]).toBe(31000);
    });
  });

  describe('Gamification, Badge Uniqueness & Progression Audit', () => {
    it('verifies all 9 mission badges have distinct IDs and titles', () => {
      const badgeIds = new Set<string>();
      const badgeTitles = new Set<string>();

      METRO_MISSIONS.forEach((m) => {
        expect(m.badge).toBeDefined();
        if (m.badge) {
          expect(badgeIds.has(m.badge.id)).toBe(false);
          expect(badgeTitles.has(m.badge.title)).toBe(false);
          badgeIds.add(m.badge.id);
          badgeTitles.add(m.badge.title);
        }
      });

      expect(badgeIds.size).toBe(9);
    });

    it('verifies level progression from 0 XP to 1050 XP', () => {
      // 0 XP -> Level 1
      const initial = calculateLevel(0);
      expect(initial.level).toBe(1);
      expect(initial.currentLevelXp).toBe(0);

      // 100 XP (after M1) -> Level 1
      const m1Lvl = calculateLevel(100);
      expect(m1Lvl.level).toBe(1);
      expect(m1Lvl.currentLevelXp).toBe(100);

      // 500 XP (after M5) -> Level 3 (500 / 250 + 1 = 3)
      const m5Lvl = calculateLevel(500);
      expect(m5Lvl.level).toBe(3);
      expect(m5Lvl.currentLevelXp).toBe(0);

      // 1050 XP (after M9: 800 + 250) -> Level 5 (1050 / 250 + 1 = 5)
      const finalLvl = calculateLevel(1050);
      expect(finalLvl.level).toBe(5);
      expect(finalLvl.currentLevelXp).toBe(50);
      expect(finalLvl.progressPercent).toBe(20);
    });
  });
});
