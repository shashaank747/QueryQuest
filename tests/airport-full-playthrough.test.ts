import { describe, it, expect, beforeAll } from 'vitest';
import initSqlJs from 'sql.js';
import { airportWorld } from '../src/modules/worlds/airport';
import { AIRPORT_BASE_SCHEMA } from '../src/modules/worlds/airport/schema';
import { AIRPORT_INITIAL_DATASET } from '../src/modules/worlds/airport/dataset';
import { AIRPORT_MISSIONS } from '../src/modules/worlds/airport/missions';
import { ValidationEngine } from '../src/modules/validation/validation-engine';
import { generateSqlDiagnostic } from '../src/modules/sql-engine/diagnostics';
import { calculateLevel, ALL_ACHIEVEMENTS } from '../src/modules/gamification/achievements';
import { ValidationContext } from '../src/types/validation';
import { SqlExecutionResponse, SqlDatabaseSchema } from '../src/types/sql';

describe('World 2: Airport Operations Full Playthrough & Audit Suite', () => {
  let db: any;

  beforeAll(async () => {
    const SQL = await initSqlJs();
    db = new SQL.Database();
    db.exec('PRAGMA foreign_keys = ON;');
    db.exec(AIRPORT_BASE_SCHEMA);
    db.exec(AIRPORT_INITIAL_DATASET);
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
    try {
      const results = db.exec(sql);
      const formattedResults = results.map((r: any) => ({
        columns: r.columns,
        values: r.values,
      }));
      return {
        success: true,
        query: sql,
        action: 'SELECT',
        results: formattedResults,
        rowsAffected: db.getRowsModified ? db.getRowsModified() : 0,
        executionTimeMs: 1,
      };
    } catch (err: any) {
      const errorMsg = err?.message || String(err);
      const hint = generateSqlDiagnostic(errorMsg, trimmed);
      return {
        success: false,
        query: sql,
        action: 'OTHER',
        rowsAffected: 0,
        executionTimeMs: 1,
        error: errorMsg,
        hint,
      };
    }
  };

  const getContext = (studentSql: string, execResponse: SqlExecutionResponse): ValidationContext => ({
    studentSql,
    executionResponse: execResponse,
    executeSql,
    getSchema: async () => getDatabaseSchema(),
    getTableData: async (tableName: string, limit = 50) => {
      const res = db.exec(`SELECT * FROM "${tableName}" LIMIT ${limit};`);
      return res.length > 0 ? res[0].values : [];
    },
  });

  describe('World Definition & Metadata Audit', () => {
    it('should have valid world definition for Airport Operations', () => {
      expect(airportWorld.id).toBe('airport');
      expect(airportWorld.name).toBe('Airport Operations');
      expect(airportWorld.industry).toBe('Aviation & Transportation');
      expect(airportWorld.isAvailable).toBe(true);
      expect(airportWorld.missions.length).toBe(6);
      expect(airportWorld.initialSchemaSql).toBe(AIRPORT_BASE_SCHEMA);
      expect(airportWorld.initialDatasetSql).toBe(AIRPORT_INITIAL_DATASET);
      expect(airportWorld.reportConfig.metrics.length).toBe(6);
    });

    it('should have all 6 missions properly ordered and configured', () => {
      AIRPORT_MISSIONS.forEach((m, idx) => {
        expect(m.order).toBe(idx + 1);
        expect(m.id).toBe(`ap_m${idx + 1}`);
        expect(m.title).toBeTruthy();
        expect(m.role).toBe('Flight Data Operations Analyst');
        expect(m.storyline).toBeTruthy();
        expect(m.businessProblem).toBeTruthy();
        expect(m.objective).toBeTruthy();
        expect(m.requiredOutcome).toBeTruthy();
        expect(m.checklist.length).toBeGreaterThan(0);
        expect(m.hints.length).toBe(3);
        expect(m.sampleSolution).toBeTruthy();
        expect(m.solutionExplanation).toBeTruthy();
        expect(m.initialSqlPlaceholder).toBeTruthy();
        expect(m.validationRules.length).toBeGreaterThan(0);
        expect(m.xpReward).toBeGreaterThan(0);
      });
    });
  });

  describe('Mission 1 (ap_m1): Deploy Runway Inspection Safety Log', () => {
    const m1 = AIRPORT_MISSIONS[0];

    it('intentional error: trailing comma causes syntax error near ")"', async () => {
      const badSql = `CREATE TABLE runway_inspections (
        inspection_id INTEGER PRIMARY KEY AUTOINCREMENT,
        runway_name TEXT NOT NULL,
        inspector_name TEXT NOT NULL,
        surface_condition TEXT NOT NULL,
        friction_index REAL,
      );`;
      const res = await executeSql(badSql);
      expect(res.success).toBe(false);
      expect(res.hint).toContain('Syntax error near ")"');

      const ctx = getContext(badSql, res);
      const feedback = await ValidationEngine.validate(m1.validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('syntax error');
    });

    it('intentional error: CREATE DATABASE is caught with educational diagnostic', async () => {
      const createDbSql = 'CREATE DATABASE skyharbor_db;';
      const diag = generateSqlDiagnostic('syntax error', createDbSql);
      expect(diag).toContain('You do NOT need to run "CREATE DATABASE" — simply create tables directly with CREATE TABLE');
    });

    it('intentional error: missing required column fails validation', async () => {
      // Create with misspelled column 'inspector' instead of 'inspector_name'
      const badTableSql = `CREATE TABLE runway_inspections (
        inspection_id INTEGER PRIMARY KEY AUTOINCREMENT,
        runway_name TEXT NOT NULL,
        inspector TEXT NOT NULL,
        surface_condition TEXT NOT NULL,
        friction_index REAL
      );`;
      const res = await executeSql(badTableSql);
      expect(res.success).toBe(true);

      const ctx = getContext(badTableSql, res);
      const feedback = await ValidationEngine.validate(m1.validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain("column 'inspector_name' is missing");

      // Clean up bad table
      db.exec('DROP TABLE IF EXISTS runway_inspections;');
    });

    it('sampleSolution passes validation and creates runway_inspections table', async () => {
      const res = await executeSql(m1.sampleSolution);
      expect(res.success).toBe(true);

      const ctx = getContext(m1.sampleSolution, res);
      const feedback = await ValidationEngine.validate(m1.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='runway_inspections';");
      expect(tables.length).toBe(1);
    });
  });

  describe('Mission 2 (ap_m2): Register Trans-Atlantic Partner Airline', () => {
    const m2 = AIRPORT_MISSIONS[1];

    it('intentional error: duplicate UNIQUE constraint violation on iata_code', async () => {
      // 'SE' already exists in seed data
      const duplicateIataSql = `INSERT INTO airlines (airline_id, airline_name, iata_code, country, fleet_size)
        VALUES (10, 'Duplicate Air', 'SE', 'India', 20);`;
      const res = await executeSql(duplicateIataSql);
      expect(res.success).toBe(false);
      expect(res.error).toContain('UNIQUE constraint failed');
      expect(res.hint).toContain('Unique constraint violation on airlines.iata_code');
    });

    it('intentional error: NOT NULL constraint violation on country', async () => {
      const missingCountrySql = `INSERT INTO airlines (airline_id, airline_name, iata_code)
        VALUES (11, 'Stateless Air', 'XX');`;
      const res = await executeSql(missingCountrySql);
      expect(res.success).toBe(false);
      expect(res.error).toContain('NOT NULL constraint failed');
      expect(res.hint).toContain('NOT NULL constraint violation on airlines.country');
    });

    it('intentional error: unquoted string literal produces helpful column error hint', async () => {
      const unquotedSql = `INSERT INTO airlines (airline_id, airline_name, iata_code, country, fleet_size)
        VALUES (6, Celtic, 'CE', 'Ireland', 52);`;
      const res = await executeSql(unquotedSql);
      expect(res.success).toBe(false);
      expect(res.error).toContain('no such column: Celtic');
      expect(res.hint).toContain("ensure string literals use single quotes ('value')");
    });

    it('sampleSolution passes validation and registers Celtic Express (CE)', async () => {
      const res = await executeSql(m2.sampleSolution);
      expect(res.success).toBe(true);

      const ctx = getContext(m2.sampleSolution, res);
      const feedback = await ValidationEngine.validate(m2.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const verify = db.exec("SELECT airline_name, iata_code, country, fleet_size FROM airlines WHERE iata_code = 'CE';");
      expect(verify.length).toBe(1);
      expect(verify[0].values[0]).toEqual(['Celtic Express', 'CE', 'Ireland', 52]);
    });
  });

  describe('Mission 3 (ap_m3): Audit Delayed Flight Operations', () => {
    const m3 = AIRPORT_MISSIONS[2];

    it('intentional error: wrong column name produces diagnostic hint', async () => {
      const wrongColSql = `SELECT flight_no, destination, scheduled_departure, passenger_count
        FROM flights WHERE status = 'Delayed';`;
      const res = await executeSql(wrongColSql);
      expect(res.success).toBe(false);
      expect(res.error).toContain('no such column: flight_no');
      expect(res.hint).toContain('Column "flight_no" does not exist');
    });

    it('intentional error: aggregate in WHERE clause produces educational advice', async () => {
      const aggWhereSql = `SELECT flight_number, destination, scheduled_departure, passenger_count
        FROM flights WHERE passenger_count > AVG(passenger_count);`;
      const res = await executeSql(aggWhereSql);
      expect(res.success).toBe(false);
      expect(res.error).toContain('misuse of aggregate');
      expect(res.hint).toContain('Misuse of aggregate function: In SQL, aggregate functions like COUNT(), SUM(), AVG() cannot be placed directly inside a WHERE clause');
    });

    it('intentional error: wrong flight status filter (Landed) fails validation', async () => {
      const landedSql = `SELECT flight_number, destination, scheduled_departure, passenger_count
        FROM flights WHERE status = 'Landed';`;
      const res = await executeSql(landedSql);
      expect(res.success).toBe(true);

      const ctx = getContext(landedSql, res);
      const feedback = await ValidationEngine.validate(m3.validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('Returned 1 record(s), but 2 were expected');
    });

    it('sampleSolution passes validation and selects delayed flights', async () => {
      const res = await executeSql(m3.sampleSolution);
      expect(res.success).toBe(true);
      expect(res.results?.[0]?.values.length).toBe(2);

      const ctx = getContext(m3.sampleSolution, res);
      const feedback = await ValidationEngine.validate(m3.validationRules, ctx);
      expect(feedback.passed).toBe(true);
      expect(feedback.message).toContain('Objective completed successfully');
    });
  });

  describe('Mission 4 (ap_m4): Reassign Gate & Update Boarding Status', () => {
    const m4 = AIRPORT_MISSIONS[3];

    it('intentional error: invalid foreign key gate_id violates constraint', async () => {
      const badFkSql = `UPDATE flights SET gate_id = 999, status = 'Boarding' WHERE flight_number = 'GA-305';`;
      const res = await executeSql(badFkSql);
      expect(res.success).toBe(false);
      expect(res.error).toContain('FOREIGN KEY constraint failed');
      expect(res.hint).toContain('Foreign key constraint failed: You are referencing an identifier that does not exist in the parent table');
    });

    it('intentional error: updating wrong flight leaves GA-305 unchanged and fails validation', async () => {
      const wrongFlightSql = `UPDATE flights SET gate_id = 6, status = 'Boarding' WHERE flight_number = 'NON_EXISTENT';`;
      const res = await executeSql(wrongFlightSql);
      expect(res.success).toBe(true);

      const ctx = getContext(wrongFlightSql, res);
      const feedback = await ValidationEngine.validate(m4.validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('Verify GA-305 is updated to gate_id 6 and Boarding status');
    });

    it('sampleSolution passes validation and updates GA-305 to gate 6 and Boarding', async () => {
      const res = await executeSql(m4.sampleSolution);
      expect(res.success).toBe(true);

      const ctx = getContext(m4.sampleSolution, res);
      const feedback = await ValidationEngine.validate(m4.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const verify = db.exec("SELECT gate_id, status FROM flights WHERE flight_number = 'GA-305';");
      expect(verify[0].values[0]).toEqual([6, 'Boarding']);
    });
  });

  describe('Mission 5 (ap_m5): Correlate Heavy Baggage with Flight Manifests', () => {
    const m5 = AIRPORT_MISSIONS[4];

    it('intentional error: invalid JOIN condition (f.flight_id = b.baggage_id) fails validation', async () => {
      const badJoinSql = `SELECT f.flight_number, f.destination, b.passenger_name, b.weight_kg
        FROM flights f
        JOIN baggage b ON f.flight_id = b.baggage_id
        WHERE b.weight_kg > 25.0
        ORDER BY b.weight_kg DESC;`;
      const res = await executeSql(badJoinSql);
      expect(res.success).toBe(true);

      const ctx = getContext(badJoinSql, res);
      const feedback = await ValidationEngine.validate(m5.validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('records returned do not match the expected values or ordering');
    });

    it('intentional error: wrong weight threshold (> 20.0 instead of > 25.0) returns extra rows', async () => {
      const wrongThresholdSql = `SELECT f.flight_number, f.destination, b.passenger_name, b.weight_kg
        FROM flights f
        JOIN baggage b ON f.flight_id = b.flight_id
        WHERE b.weight_kg > 20.0
        ORDER BY b.weight_kg DESC;`;
      const res = await executeSql(wrongThresholdSql);
      expect(res.success).toBe(true);

      const ctx = getContext(wrongThresholdSql, res);
      const feedback = await ValidationEngine.validate(m5.validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('Returned 7 record(s), but 3 were expected');
    });

    it('intentional error: ascending order violates orderSensitive requirement', async () => {
      const ascSql = `SELECT f.flight_number, f.destination, b.passenger_name, b.weight_kg
        FROM flights f
        JOIN baggage b ON f.flight_id = b.flight_id
        WHERE b.weight_kg > 25.0
        ORDER BY b.weight_kg ASC;`;
      const res = await executeSql(ascSql);
      expect(res.success).toBe(true);

      const ctx = getContext(ascSql, res);
      const feedback = await ValidationEngine.validate(m5.validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('Ensure ORDER BY clause is applied');
    });

    it('sampleSolution passes validation with exact 3 heavy baggage records ordered descending', async () => {
      const res = await executeSql(m5.sampleSolution);
      expect(res.success).toBe(true);
      expect(res.results?.[0]?.values.length).toBe(3);

      const ctx = getContext(m5.sampleSolution, res);
      const feedback = await ValidationEngine.validate(m5.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const values = res.results![0].values;
      expect(values[0]).toEqual(['GA-305', 'New York', 'David Miller', 31.2]);
      expect(values[1]).toEqual(['SA-612', 'Dubai', 'Omar Al-Mansoor', 28.4]);
      expect(values[2]).toEqual(['SE-101', 'Mumbai', 'Priya Iyer', 26.3]);
    });
  });

  describe('Mission 6 (ap_m6): Analyze Terminal Passenger Throughput', () => {
    const m6 = AIRPORT_MISSIONS[5];

    it('intentional error: omitting GROUP BY collapses records into a single row', async () => {
      const noGroupSql = `SELECT t.terminal_name, COUNT(f.flight_id) AS total_flights, SUM(f.passenger_count) AS total_passengers
        FROM terminals t
        JOIN gates g ON t.terminal_id = g.terminal_id
        JOIN flights f ON g.gate_id = f.gate_id
        ORDER BY total_passengers DESC;`;
      const res = await executeSql(noGroupSql);
      expect(res.success).toBe(true);

      const ctx = getContext(noGroupSql, res);
      const feedback = await ValidationEngine.validate(m6.validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('Returned 1 record(s), but 2 were expected');
    });

    it('intentional error: ascending order violates orderSensitive requirement', async () => {
      const ascSql = `SELECT t.terminal_name, COUNT(f.flight_id) AS total_flights, SUM(f.passenger_count) AS total_passengers
        FROM terminals t
        JOIN gates g ON t.terminal_id = g.terminal_id
        JOIN flights f ON g.gate_id = f.gate_id
        GROUP BY t.terminal_name
        ORDER BY total_passengers ASC;`;
      const res = await executeSql(ascSql);
      expect(res.success).toBe(true);

      const ctx = getContext(ascSql, res);
      const feedback = await ValidationEngine.validate(m6.validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('Ensure ORDER BY clause is applied');
    });

    it('sampleSolution passes validation with multi-table aggregation across terminals', async () => {
      const res = await executeSql(m6.sampleSolution);
      expect(res.success).toBe(true);
      expect(res.results?.[0]?.values.length).toBe(2);

      const ctx = getContext(m6.sampleSolution, res);
      const feedback = await ValidationEngine.validate(m6.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const values = res.results![0].values;
      // Terminal 2 (International) should be first with 1400 passengers
      expect(values[0][0]).toBe('Terminal 2 (International)');
      expect(values[0][1]).toBe(6);
      expect(values[0][2]).toBe(1400);

      // Terminal 1 (Domestic) should be second with 628 passengers
      expect(values[1][0]).toBe('Terminal 1 (Domestic)');
      expect(values[1][1]).toBe(4);
      expect(values[1][2]).toBe(628);
    });
  });

  describe('Gamification, XP Calculations & Achievement Awards Audit', () => {
    it('should verify individual mission XP rewards sum to 900 XP', () => {
      const xpRewards = AIRPORT_MISSIONS.map((m) => m.xpReward);
      expect(xpRewards).toEqual([100, 120, 130, 140, 160, 250]);
      const totalXp = xpRewards.reduce((sum, val) => sum + val, 0);
      expect(totalXp).toBe(900);
    });

    it('should verify level progression across mission completions', () => {
      // Starting Level 1 at 0 XP
      expect(calculateLevel(0)).toEqual({
        level: 1,
        currentLevelXp: 0,
        nextLevelXp: 250,
        progressPercent: 0,
      });

      // After Mission 1 (+100 XP = 100 XP)
      expect(calculateLevel(100)).toEqual({
        level: 1,
        currentLevelXp: 100,
        nextLevelXp: 250,
        progressPercent: 40,
      });

      // After Mission 2 (+120 XP = 220 XP)
      expect(calculateLevel(220)).toEqual({
        level: 1,
        currentLevelXp: 220,
        nextLevelXp: 250,
        progressPercent: 88,
      });

      // After Mission 3 (+130 XP = 350 XP -> Level 2)
      expect(calculateLevel(350)).toEqual({
        level: 2,
        currentLevelXp: 100,
        nextLevelXp: 250,
        progressPercent: 40,
      });

      // After Mission 4 (+140 XP = 490 XP)
      expect(calculateLevel(490)).toEqual({
        level: 2,
        currentLevelXp: 240,
        nextLevelXp: 250,
        progressPercent: 96,
      });

      // After Mission 5 (+160 XP = 650 XP -> Level 3)
      expect(calculateLevel(650)).toEqual({
        level: 3,
        currentLevelXp: 150,
        nextLevelXp: 250,
        progressPercent: 60,
      });

      // After Mission 6 (+250 XP = 900 XP -> Level 4)
      expect(calculateLevel(900)).toEqual({
        level: 4,
        currentLevelXp: 150,
        nextLevelXp: 250,
        progressPercent: 60,
      });

      // With 4 achievement unlocks (+50 bonus XP each = +200 XP -> 1100 XP -> Level 5)
      expect(calculateLevel(1100)).toEqual({
        level: 5,
        currentLevelXp: 100,
        nextLevelXp: 250,
        progressPercent: 40,
      });
    });

    it('should verify all mission badges exist in the global ALL_ACHIEVEMENTS registry', () => {
      const missionBadges = AIRPORT_MISSIONS.map((m) => m.badge?.id).filter(Boolean) as string[];
      expect(missionBadges).toEqual(['table_architect', 'flight_tracker', 'join_master', 'airport_master']);

      missionBadges.forEach((badgeId) => {
        const found = ALL_ACHIEVEMENTS.find((a) => a.id === badgeId);
        expect(found, `Achievement ${badgeId} must be present in ALL_ACHIEVEMENTS`).toBeDefined();
        expect(found?.title).toBeTruthy();
        expect(found?.description).toBeTruthy();
        expect(found?.icon).toBeTruthy();
        expect(found?.xpReward).toBeGreaterThan(0);
      });
    });

    it('should verify airport_master world completion badge metadata', () => {
      const airportMaster = ALL_ACHIEVEMENTS.find((a) => a.id === 'airport_master');
      expect(airportMaster).toBeDefined();
      expect(airportMaster?.title).toBe('Aviation Operations Certified');
      expect(airportMaster?.category).toBe('worlds');
      expect(airportMaster?.xpReward).toBe(300);
      expect(airportMaster?.icon).toBe('Award');
    });

    it('should verify flight_tracker mission achievement metadata', () => {
      const flightTracker = ALL_ACHIEVEMENTS.find((a) => a.id === 'flight_tracker');
      expect(flightTracker).toBeDefined();
      expect(flightTracker?.title).toBe('Flight Radar Specialist');
      expect(flightTracker?.category).toBe('missions');
      expect(flightTracker?.xpReward).toBe(120);
      expect(flightTracker?.icon).toBe('Plane');
    });
  });

  describe('Post-Playthrough Executive Report Metrics Audit', () => {
    it('all 6 executive report queries execute successfully on the modified database', async () => {
      const metrics = airportWorld.reportConfig.metrics;
      expect(metrics.length).toBe(6);

      for (const m of metrics) {
        const res = await executeSql(m.query);
        expect(res.success, `Metric query failed for ${m.title}: ${res.error}`).toBe(true);
        expect(res.results?.length).toBeGreaterThan(0);
        expect(res.results?.[0]?.values.length).toBeGreaterThan(0);
      }
    });

    it('verifies exact metric outputs match simulated operational state', async () => {
      // 1. Total Active Flights: 10
      const flightsRes = await executeSql('SELECT COUNT(*) AS total_flights FROM flights;');
      expect(flightsRes.results![0].values[0][0]).toBe(10);

      // 2. Delayed Flight Alerts: exactly 1 (SA-612, since GA-305 was transitioned to Boarding in M4)
      const delayedRes = await executeSql('SELECT COUNT(*) AS delayed_count FROM flights WHERE status = "Delayed";');
      expect(delayedRes.results![0].values[0][0]).toBe(1);

      // 3. Boarding Flights: exactly 2 (PF-410 + GA-305)
      const boardingRes = await executeSql('SELECT COUNT(*) AS boarding_count FROM flights WHERE status = "Boarding";');
      expect(boardingRes.results![0].values[0][0]).toBe(2);

      // 4. Partner Airlines: 6 (5 initial + Celtic Express from M2)
      const airlinesRes = await executeSql('SELECT COUNT(*) AS total_airlines FROM airlines;');
      expect(airlinesRes.results![0].values[0][0]).toBe(6);

      // 5. Runway safety log table created in M1 exists
      const runwayRes = await executeSql("SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='runway_inspections';");
      expect(runwayRes.results![0].values[0][0]).toBe(1);
    });
  });
});
