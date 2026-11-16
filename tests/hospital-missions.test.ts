import { describe, it, expect, beforeEach } from 'vitest';
import initSqlJs from 'sql.js';
import { hospitalWorld } from '../src/modules/worlds/hospital';
import { HOSPITAL_BASE_SCHEMA } from '../src/modules/worlds/hospital/schema';
import { HOSPITAL_INITIAL_DATASET } from '../src/modules/worlds/hospital/dataset';
import { HOSPITAL_MISSIONS } from '../src/modules/worlds/hospital/missions';
import { ValidationEngine } from '../src/modules/validation/validation-engine';
import { ValidationContext } from '../src/types/validation';
import { SqlExecutionResponse, SqlDatabaseSchema } from '../src/types/sql';
import { ALL_ACHIEVEMENTS, calculateLevel } from '../src/modules/gamification/achievements';

describe('World 4: Hospital Administration Comprehensive Playthrough & Diagnostic Audit', () => {
  let db: any;

  const createFreshDb = async () => {
    const SQL = await initSqlJs();
    const newDb = new SQL.Database();
    newDb.exec('PRAGMA foreign_keys = ON;');
    newDb.exec(HOSPITAL_BASE_SCHEMA);
    newDb.exec(HOSPITAL_INITIAL_DATASET);
    return newDb;
  };

  const getDatabaseSchema = (database: any): SqlDatabaseSchema => {
    const tablesRes = database.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
    const schema: SqlDatabaseSchema = {};
    if (tablesRes.length > 0) {
      for (const row of tablesRes[0].values) {
        const tableName = row[0];
        const colsRes = database.exec(`PRAGMA table_info("${tableName}");`);
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

  const executeSql = async (database: any, sql: string): Promise<SqlExecutionResponse> => {
    try {
      const results = database.exec(sql);
      const formattedResults = results.map((r: any) => ({
        columns: r.columns,
        values: r.values,
      }));
      return {
        success: true,
        query: sql,
        action: 'SELECT',
        results: formattedResults,
        rowsAffected: database.getRowsModified ? database.getRowsModified() : 0,
        executionTimeMs: 1,
      };
    } catch (err: any) {
      return {
        success: false,
        query: sql,
        action: 'OTHER',
        rowsAffected: 0,
        executionTimeMs: 1,
        error: err?.message || String(err),
      };
    }
  };

  const buildContext = (
    database: any,
    studentSql: string,
    execResponse: SqlExecutionResponse
  ): ValidationContext => ({
    studentSql,
    executionResponse: execResponse,
    executeSql: async (sql) => executeSql(database, sql),
    getSchema: async () => getDatabaseSchema(database),
    getTableData: async (tableName, limit = 50) => {
      const res = database.exec(`SELECT * FROM "${tableName}" LIMIT ${limit};`);
      return res.length > 0 ? res[0].values : [];
    },
  });

  describe('Part 1: Schema, Metadata, & Sequential Solution Playthrough', () => {
    beforeEach(async () => {
      db = await createFreshDb();
    });

    it('should have 6 properly ordered missions with full metadata', () => {
      expect(HOSPITAL_MISSIONS).toHaveLength(6);
      HOSPITAL_MISSIONS.forEach((m, idx) => {
        expect(m.order).toBe(idx + 1);
        expect(m.id).toBe(`hp_m${idx + 1}`);
        expect(m.title).toBeTruthy();
        expect(m.role).toBe('Healthcare Information Analyst');
        expect(m.storyline).toBeTruthy();
        expect(m.businessProblem).toBeTruthy();
        expect(m.objective).toBeTruthy();
        expect(m.requiredOutcome).toBeTruthy();
        expect(m.checklist.length).toBeGreaterThanOrEqual(3);
        expect(m.hints).toHaveLength(3);
        expect(m.sampleSolution).toBeTruthy();
        expect(m.validationRules.length).toBeGreaterThan(0);
        expect(m.xpReward).toBeGreaterThan(0);
      });
    });

    it('Mission 1: Filter Wards Exceeding Average Occupancy via Scalar Subquery', async () => {
      const m1 = HOSPITAL_MISSIONS[0];
      const execRes = await executeSql(db, m1.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, m1.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m1.validationRules, ctx);
      expect(feedback.passed).toBe(true);
      expect(execRes.results[0].values.length).toBeGreaterThan(0);
    });

    it('Mission 2: Identify Active Intensive Care Physicians with EXISTS Subquery', async () => {
      const m2 = HOSPITAL_MISSIONS[1];
      const execRes = await executeSql(db, m2.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, m2.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m2.validationRules, ctx);
      expect(feedback.passed).toBe(true);
      expect(execRes.results[0].values.length).toBeGreaterThan(0);
    });

    it('Mission 3: Analyze High Bed Saturation with CTE', async () => {
      const m3 = HOSPITAL_MISSIONS[2];
      const execRes = await executeSql(db, m3.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, m3.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m3.validationRules, ctx);
      expect(feedback.passed).toBe(true);
      expect(execRes.results[0].values.length).toBeGreaterThan(0);
    });

    it('Mission 4: Rank Inpatient Care Units with DENSE_RANK()', async () => {
      const m4 = HOSPITAL_MISSIONS[3];
      const execRes = await executeSql(db, m4.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, m4.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m4.validationRules, ctx);
      expect(feedback.passed).toBe(true);
      expect(execRes.results[0].values.length).toBe(5);
    });

    it('Mission 5: Analyze Admission Intervals with LAG()', async () => {
      const m5 = HOSPITAL_MISSIONS[4];
      const execRes = await executeSql(db, m5.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, m5.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m5.validationRules, ctx);
      expect(feedback.passed).toBe(true);
      expect(execRes.results[0].values.length).toBe(6);
    });

    it('Mission 6: Atomic Patient Discharge & Bed Reclaim (ACID Transaction)', async () => {
      const m6 = HOSPITAL_MISSIONS[5];
      const execRes = await executeSql(db, m6.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, m6.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m6.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const checkAdm = db.exec("SELECT status, discharge_date FROM admissions WHERE admission_id = 101;");
      expect(checkAdm[0].values[0]).toEqual(['Discharged', '2026-11-16']);
      const checkWard = db.exec("SELECT occupied_beds FROM wards WHERE ward_id = 1;");
      expect(checkWard[0].values[0][0]).toBe(11);
    });

    it('Sequential full chain playthrough of all 6 missions end-to-end', async () => {
      for (const mission of HOSPITAL_MISSIONS) {
        const execRes = await executeSql(db, mission.sampleSolution);
        expect(execRes.success, `Execution failed on ${mission.id}: ${execRes.error}`).toBe(true);
        const ctx = buildContext(db, mission.sampleSolution, execRes);
        const feedback = await ValidationEngine.validate(mission.validationRules, ctx);
        expect(feedback.passed, `Validation failed on ${mission.id}: ${feedback.message}`).toBe(true);
      }
    });
  });

  describe('Part 2: Purposeful Intentional Errors & Diagnostic Verification', () => {
    beforeEach(async () => {
      db = await createFreshDb();
    });

    it('hp_m1: Intentional Error - Syntax mistake in scalar subquery', async () => {
      const invalidSql = `SELECT ward_name, ward_type, total_beds, occupied_beds FROM wards WHERE occupied_beds > (SELECT AVG(occupied_beds FROM wards);`;
      const execRes = await executeSql(db, invalidSql);
      expect(execRes.success).toBe(false);
      expect(execRes.error).toContain('syntax error');
    });

    it('hp_m1: Intentional Error - Inverted operator returns non-matching rows', async () => {
      const invertedSql = `SELECT ward_name, ward_type, total_beds, occupied_beds FROM wards WHERE occupied_beds < (SELECT AVG(occupied_beds) FROM wards);`;
      const execRes = await executeSql(db, invertedSql);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, invertedSql, execRes);
      const feedback = await ValidationEngine.validate(HOSPITAL_MISSIONS[0].validationRules, ctx);
      expect(feedback.passed).toBe(false);
    });

    it('hp_m2: Intentional Error - Uncorrelated subquery returns all doctors', async () => {
      const badExistsSql = `SELECT d.doctor_id, d.first_name, d.last_name, d.specialty FROM doctors d WHERE EXISTS (SELECT 1 FROM admissions a WHERE a.ward_id = 1 AND a.status = 'Admitted');`;
      const execRes = await executeSql(db, badExistsSql);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, badExistsSql, execRes);
      const feedback = await ValidationEngine.validate(HOSPITAL_MISSIONS[1].validationRules, ctx);
      expect(feedback.passed).toBe(false);
    });

    it('hp_m3: Intentional Error - Inverted threshold in CTE', async () => {
      const badCteSql = `WITH WardStats AS (SELECT ward_name, total_beds, occupied_beds, ROUND((CAST(occupied_beds AS REAL) / total_beds) * 100.0, 2) AS occupancy_rate FROM wards) SELECT ward_name, total_beds, occupied_beds, occupancy_rate FROM WardStats WHERE occupancy_rate < 80.0 ORDER BY occupancy_rate DESC;`;
      const execRes = await executeSql(db, badCteSql);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, badCteSql, execRes);
      const feedback = await ValidationEngine.validate(HOSPITAL_MISSIONS[2].validationRules, ctx);
      expect(feedback.passed).toBe(false);
    });

    it('hp_m4: Intentional Error - Missing OVER clause in DENSE_RANK() causes error', async () => {
      const badRankSql = `SELECT ward_name, ward_type, occupied_beds, DENSE_RANK() AS occupancy_rank FROM wards;`;
      const execRes = await executeSql(db, badRankSql);
      expect(execRes.success).toBe(false);
      expect(execRes.error).toMatch(/misuse of window function|syntax error|OVER/i);
    });

    it('hp_m5: Intentional Error - Omitted ORDER BY in LAG() window function', async () => {
      const badLagSql = `SELECT admission_id, patient_id, admission_date, LAG(admission_date) OVER () AS prev_admission_date FROM admissions;`;
      const execRes = await executeSql(db, badLagSql);
      // SQLite requires ORDER BY for LAG without default
      const ctx = buildContext(db, badLagSql, execRes);
      const feedback = await ValidationEngine.validate(HOSPITAL_MISSIONS[4].validationRules, ctx);
      expect(feedback.passed).toBe(false);
    });

    it('hp_m6: Intentional Error - Wrong admission target in transaction update', async () => {
      const wrongTargetSql = `BEGIN TRANSACTION;
UPDATE admissions SET status = 'Discharged', discharge_date = '2026-11-16' WHERE admission_id = 999;
UPDATE wards SET occupied_beds = occupied_beds - 1 WHERE ward_id = 1;
COMMIT;`;
      const execRes = await executeSql(db, wrongTargetSql);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, wrongTargetSql, execRes);
      const feedback = await ValidationEngine.validate(HOSPITAL_MISSIONS[5].validationRules, ctx);
      expect(feedback.passed).toBe(false);
    });
  });

  describe('Part 3: Gamification, XP Rewards, & Achievement Verification', () => {
    it('should award correct XP for each hospital mission totaling 900 XP', () => {
      const expectedXps = [100, 120, 130, 140, 160, 250];
      const actualXps = HOSPITAL_MISSIONS.map((m) => m.xpReward);
      expect(actualXps).toEqual(expectedXps);

      const totalXp = HOSPITAL_MISSIONS.reduce((sum, m) => sum + m.xpReward, 0);
      expect(totalXp).toBe(900);
    });

    it('should have valid achievement definitions in ALL_ACHIEVEMENTS', () => {
      const hospitalMaster = ALL_ACHIEVEMENTS.find((a) => a.id === 'hospital_master');
      expect(hospitalMaster).toBeDefined();
      expect(hospitalMaster?.title).toBe('Healthcare Administration Certified');
      expect(hospitalMaster?.category).toBe('worlds');
      expect(hospitalMaster?.xpReward).toBe(300);

      const clinicalGuardian = ALL_ACHIEVEMENTS.find((a) => a.id === 'clinical_guardian');
      expect(clinicalGuardian).toBeDefined();
      expect(clinicalGuardian?.title).toBe('Clinical Data Guardian');
      expect(clinicalGuardian?.category).toBe('missions');
      expect(clinicalGuardian?.xpReward).toBe(120);

      const tableArchitect = ALL_ACHIEVEMENTS.find((a) => a.id === 'table_architect');
      expect(tableArchitect).toBeDefined();

      const joinMaster = ALL_ACHIEVEMENTS.find((a) => a.id === 'join_master');
      expect(joinMaster).toBeDefined();
    });

    it('should compute exact level progression as missions are completed', () => {
      let cumulativeXp = 0;

      // Start: 0 XP -> Level 1
      expect(calculateLevel(cumulativeXp).level).toBe(1);

      // hp_m1: +100 XP -> 100 XP
      cumulativeXp += HOSPITAL_MISSIONS[0].xpReward;
      let levelInfo = calculateLevel(cumulativeXp);
      expect(levelInfo.level).toBe(1);
      expect(levelInfo.currentLevelXp).toBe(100);
      expect(levelInfo.progressPercent).toBe(40);

      // hp_m2: +120 XP -> 220 XP
      cumulativeXp += HOSPITAL_MISSIONS[1].xpReward;
      levelInfo = calculateLevel(cumulativeXp);
      expect(levelInfo.level).toBe(1);
      expect(levelInfo.currentLevelXp).toBe(220);
      expect(levelInfo.progressPercent).toBe(88);

      // hp_m3: +130 XP -> 350 XP (Levels up to Level 2!)
      cumulativeXp += HOSPITAL_MISSIONS[2].xpReward;
      levelInfo = calculateLevel(cumulativeXp);
      expect(levelInfo.level).toBe(2);
      expect(levelInfo.currentLevelXp).toBe(100);
      expect(levelInfo.progressPercent).toBe(40);

      // hp_m4: +140 XP -> 490 XP
      cumulativeXp += HOSPITAL_MISSIONS[3].xpReward;
      levelInfo = calculateLevel(cumulativeXp);
      expect(levelInfo.level).toBe(2);
      expect(levelInfo.currentLevelXp).toBe(240);
      expect(levelInfo.progressPercent).toBe(96);

      // hp_m5: +160 XP -> 650 XP (Levels up to Level 3!)
      cumulativeXp += HOSPITAL_MISSIONS[4].xpReward;
      levelInfo = calculateLevel(cumulativeXp);
      expect(levelInfo.level).toBe(3);
      expect(levelInfo.currentLevelXp).toBe(150);
      expect(levelInfo.progressPercent).toBe(60);

      // hp_m6: +250 XP -> 900 XP (Levels up to Level 4!)
      cumulativeXp += HOSPITAL_MISSIONS[5].xpReward;
      levelInfo = calculateLevel(cumulativeXp);
      expect(levelInfo.level).toBe(4);
      expect(levelInfo.currentLevelXp).toBe(150);
      expect(levelInfo.progressPercent).toBe(60);

      // World Master Bonus: +300 XP -> 1200 XP (Levels up to Level 5!)
      const worldMasterReward = ALL_ACHIEVEMENTS.find((a) => a.id === 'hospital_master')!.xpReward;
      cumulativeXp += worldMasterReward;
      levelInfo = calculateLevel(cumulativeXp);
      expect(levelInfo.level).toBe(5);
      expect(levelInfo.currentLevelXp).toBe(200);
      expect(levelInfo.progressPercent).toBe(80);
    });
  });

  describe('Part 4: Post-Playthrough Hospital Executive Business Report Metrics', () => {
    beforeEach(async () => {
      db = await createFreshDb();
      // Run complete playthrough so database represents final operational state
      for (const m of HOSPITAL_MISSIONS) {
        await executeSql(db, m.sampleSolution);
      }
    });

    it('should execute all 6 report metrics without errors and with valid numbers', async () => {
      const metrics = hospitalWorld.reportConfig.metrics;
      expect(metrics).toHaveLength(6);

      for (const metric of metrics) {
        const res = await executeSql(db, metric.query);
        expect(res.success, `Metric '${metric.id}' failed: ${res.error}`).toBe(true);
        expect(res.results?.[0]?.values.length).toBeGreaterThan(0);
      }

      // Check Active Inpatient Admissions: 4 (since 104 was discharged in m4, 105 was already discharged)
      const resAdmitted = await executeSql(db, metrics[0].query);
      expect(resAdmitted.results[0].values[0][0]).toBe(4);

      // Check Total Hospital Beds: 88
      const resBeds = await executeSql(db, metrics[1].query);
      expect(resBeds.results[0].values[0][0]).toBe(88);

      // Check Critical Ward Occupancy Rate: 86.4% (19 / 22 beds after mission 6 discharge)
      const resRate = await executeSql(db, metrics[2].query);
      expect(resRate.results[0].values[0][0]).toBe('86.4%');
    });
  });
});
