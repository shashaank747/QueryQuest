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

  describe('Mission 1 (ap_m1): First Discovery: Correlate Flights with Carrier Profiles', () => {
    const m1 = AIRPORT_MISSIONS[0];

    it('intentional error: syntax error in JOIN', async () => {
      const badSql = `SELECT f.flight_number, a.airline_name
        FROM flights f
        JOIN
        WHERE f.status = 'Delayed';`;
      const res = await executeSql(badSql);
      expect(res.success).toBe(false);
      expect(res.hint).toMatch(/syntax error|JOIN/i);

      const ctx = getContext(badSql, res);
      const feedback = await ValidationEngine.validate(m1.validationRules, ctx);
      expect(feedback.passed).toBe(false);
    });

    it('intentional error: non-existent column produces educational diagnostic', async () => {
      const badColSql = `SELECT f.flight_number, a.carrier_title, f.destination, f.status
        FROM flights f
        JOIN airlines a ON f.airline_id = a.airline_id
        WHERE f.status = 'Delayed';`;
      const res = await executeSql(badColSql);
      expect(res.success).toBe(false);
      expect(res.hint).toContain('carrier_title');
    });

    it('intentional error: wrong status filter fails validation', async () => {
      const wrongFilterSql = `SELECT f.flight_number, a.airline_name, f.destination, f.status
        FROM flights f
        JOIN airlines a ON f.airline_id = a.airline_id
        WHERE f.status = 'On Time';`;
      const res = await executeSql(wrongFilterSql);
      expect(res.success).toBe(true);

      const ctx = getContext(wrongFilterSql, res);
      const feedback = await ValidationEngine.validate(m1.validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toMatch(/Returned|Your query did not return any data rows/);
    });

    it('sampleSolution passes validation and joins delayed flights with airlines', async () => {
      const res = await executeSql(m1.sampleSolution);
      expect(res.success).toBe(true);

      const ctx = getContext(m1.sampleSolution, res);
      const feedback = await ValidationEngine.validate(m1.validationRules, ctx);
      expect(feedback.passed).toBe(true);
      expect(res.results?.[0]?.values.length).toBe(2);
    });
  });

  describe('Mission 2 (ap_m2): Multi-Table Relational Chain: Terminal Gate Locator', () => {
    const m2 = AIRPORT_MISSIONS[1];

    it('intentional error: missing second JOIN produces missing column error', async () => {
      const missingJoinSql = `SELECT f.flight_number, t.terminal_name, g.gate_number, f.destination, f.status
        FROM flights f
        JOIN gates g ON f.gate_id = g.gate_id;`;
      const res = await executeSql(missingJoinSql);
      expect(res.success).toBe(false);
      expect(res.hint).toMatch(/terminal_name|Table "t"/i);
    });

    it('intentional error: wrong join condition fails validation', async () => {
      const wrongJoinSql = `SELECT f.flight_number, t.terminal_name, g.gate_number, f.destination, f.status
        FROM flights f
        JOIN gates g ON f.flight_id = g.gate_id
        JOIN terminals t ON g.terminal_id = t.terminal_id;`;
      const res = await executeSql(wrongJoinSql);
      expect(res.success).toBe(true);

      const ctx = getContext(wrongJoinSql, res);
      const feedback = await ValidationEngine.validate(m2.validationRules, ctx);
      expect(feedback.passed).toBe(false);
    });

    it('sampleSolution passes validation and chains 3 tables', async () => {
      const res = await executeSql(m2.sampleSolution);
      expect(res.success).toBe(true);

      const ctx = getContext(m2.sampleSolution, res);
      const feedback = await ValidationEngine.validate(m2.validationRules, ctx);
      expect(feedback.passed).toBe(true);
      expect(res.results?.[0]?.values.length).toBe(10);
    });
  });

  describe('Mission 3 (ap_m3): Unmatched Record Detection with LEFT JOIN', () => {
    const m3 = AIRPORT_MISSIONS[2];

    it('intentional error: INNER JOIN with IS NULL returns 0 rows and fails validation', async () => {
      const innerJoinSql = `SELECT g.gate_id, g.gate_number, g.status
        FROM gates g
        JOIN flights f ON g.gate_id = f.gate_id
        WHERE f.flight_id IS NULL;`;
      const res = await executeSql(innerJoinSql);
      expect(res.success).toBe(true);

      const ctx = getContext(innerJoinSql, res);
      const feedback = await ValidationEngine.validate(m3.validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toMatch(/Returned 0 record\(s\)|Your query did not return any data rows/);
    });

    it('intentional error: omitting IS NULL filter returns all gates and fails validation', async () => {
      const allGatesSql = `SELECT g.gate_id, g.gate_number, g.status
        FROM gates g
        LEFT JOIN flights f ON g.gate_id = f.gate_id;`;
      const res = await executeSql(allGatesSql);
      expect(res.success).toBe(true);

      const ctx = getContext(allGatesSql, res);
      const feedback = await ValidationEngine.validate(m3.validationRules, ctx);
      expect(feedback.passed).toBe(false);
    });

    it('sampleSolution passes validation and isolates unoccupied gates', async () => {
      const res = await executeSql(m3.sampleSolution);
      expect(res.success).toBe(true);

      const ctx = getContext(m3.sampleSolution, res);
      const feedback = await ValidationEngine.validate(m3.validationRules, ctx);
      expect(feedback.passed).toBe(true);
      expect(res.results?.[0]?.values.length).toBe(3);
    });
  });

  describe('Mission 4 (ap_m4): Flight Capacity Classification with CASE WHEN', () => {
    const m4 = AIRPORT_MISSIONS[3];

    it('intentional error: missing END keyword causes syntax error', async () => {
      const noEndSql = `SELECT flight_number, destination, passenger_count,
        CASE
          WHEN passenger_count >= 250 THEN 'Heavy'
          ELSE 'Light'
        AS capacity_tier
        FROM flights;`;
      const res = await executeSql(noEndSql);
      expect(res.success).toBe(false);
      expect(res.hint).toMatch(/syntax error/i);
    });

    it('intentional error: inverted thresholds produce wrong tier classifications', async () => {
      const invertedSql = `SELECT flight_number, destination, passenger_count,
        CASE
          WHEN passenger_count >= 100 THEN 'Heavy'
          ELSE 'Light'
        END AS capacity_tier
        FROM flights;`;
      const res = await executeSql(invertedSql);
      expect(res.success).toBe(true);

      const ctx = getContext(invertedSql, res);
      const feedback = await ValidationEngine.validate(m4.validationRules, ctx);
      expect(feedback.passed).toBe(false);
    });

    it('sampleSolution passes validation and classifies capacity tiers accurately', async () => {
      const res = await executeSql(m4.sampleSolution);
      expect(res.success).toBe(true);

      const ctx = getContext(m4.sampleSolution, res);
      const feedback = await ValidationEngine.validate(m4.validationRules, ctx);
      expect(feedback.passed).toBe(true);
      expect(res.results?.[0]?.values.length).toBe(10);
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
      expect(missionBadges).toEqual(['flight_tracker', 'join_master', 'airport_master']);

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

      // 2. Delayed Flight Alerts: exactly 2 (SA-612 and SE-101)
      const delayedRes = await executeSql('SELECT COUNT(*) AS delayed_count FROM flights WHERE status = "Delayed";');
      expect(delayedRes.results![0].values[0][0]).toBe(2);

      // 3. Boarding Flights: exactly 1 (PF-410)
      const boardingRes = await executeSql('SELECT COUNT(*) AS boarding_count FROM flights WHERE status = "Boarding";');
      expect(boardingRes.results![0].values[0][0]).toBe(1);

      // 4. Partner Airlines: 5
      const airlinesRes = await executeSql('SELECT COUNT(*) AS total_airlines FROM airlines;');
      expect(airlinesRes.results![0].values[0][0]).toBe(5);
    });
  });
});
