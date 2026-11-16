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

    it('Mission 1: Deploy Emergency Medical On-Call Roster (CREATE TABLE)', async () => {
      const m1 = HOSPITAL_MISSIONS[0];
      const execRes = await executeSql(db, m1.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, m1.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m1.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      // Verify table columns in sqlite_master
      const cols = db.exec("PRAGMA table_info(emergency_roster);")[0].values.map((c: any[]) => c[1]);
      expect(cols).toEqual(['roster_id', 'doctor_id', 'shift_date', 'shift_type', 'pager_number']);
    });

    it('Mission 2: Register Pediatric Cardiology Attending (INSERT INTO)', async () => {
      const m2 = HOSPITAL_MISSIONS[1];
      const execRes = await executeSql(db, m2.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, m2.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m2.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const res = db.exec("SELECT first_name, last_name, specialty, department_id, is_on_call FROM doctors WHERE doctor_id = 7;");
      expect(res[0].values[0]).toEqual(['Neil', 'Armstrong', 'Pediatric Cardiology', 4, 1]);
    });

    it('Mission 3: Audit Saturated Hospital Wards (SELECT WHERE)', async () => {
      const m3 = HOSPITAL_MISSIONS[2];
      const execRes = await executeSql(db, m3.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, m3.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m3.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      // Verify exactly 2 saturated wards: ICU (12/12) and Post-Op Recovery Wing (16/16)
      expect(execRes.results[0].values).toHaveLength(2);
      const wardNames = execRes.results[0].values.map((v: any[]) => v[0]);
      expect(wardNames).toContain('Intensive Care Unit (ICU)');
      expect(wardNames).toContain('Post-Op Recovery Wing');
    });

    it('Mission 4: Discharge Inpatient & Reclaim Hospital Bed (UPDATE)', async () => {
      const m4 = HOSPITAL_MISSIONS[3];
      const execRes = await executeSql(db, m4.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, m4.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m4.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const check = db.exec("SELECT status, discharge_date FROM admissions WHERE admission_id = 104;");
      expect(check[0].values[0]).toEqual(['Discharged', '2026-11-16']);
    });

    it('Mission 5: Correlate Active Inpatients with Attending Physicians (Multi-table JOIN)', async () => {
      // Must run Mission 4 first so admission 104 is discharged
      await executeSql(db, HOSPITAL_MISSIONS[3].sampleSolution);

      const m5 = HOSPITAL_MISSIONS[4];
      const execRes = await executeSql(db, m5.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, m5.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m5.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      // 4 active admissions: 101 (Nov 12), 102 (Nov 13), 103 (Nov 14), 106 (Nov 15)
      expect(execRes.results[0].values).toHaveLength(4);
      const dates = execRes.results[0].values.map((r: any[]) => r[6]);
      expect(dates).toEqual(['2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15']);
    });

    it('Mission 6: Analyze Hospital Bed Capacity by Care Specialty (GROUP BY & Aggregation)', async () => {
      const m6 = HOSPITAL_MISSIONS[5];
      const execRes = await executeSql(db, m6.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, m6.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m6.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      // Verify descending order of total_occupied
      const rows = execRes.results[0].values;
      expect(rows).toHaveLength(4);
      // General Inpatient: 26, Critical Care: 20, Step-Down Care: 16, Specialized Care: 14
      expect(rows[0][0]).toBe('General Inpatient');
      expect(rows[0][3]).toBe(26);
      expect(rows[1][0]).toBe('Critical Care');
      expect(rows[1][3]).toBe(20);
      expect(rows[2][0]).toBe('Step-Down Care');
      expect(rows[2][3]).toBe(16);
      expect(rows[3][0]).toBe('Specialized Care');
      expect(rows[3][3]).toBe(14);
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

    it('hp_m1: Intentional Error - Syntax mistake (unclosed parenthesis)', async () => {
      const invalidSql = `CREATE TABLE emergency_roster (roster_id INTEGER PRIMARY KEY;`;
      const execRes = await executeSql(db, invalidSql);
      expect(execRes.success).toBe(false);
      expect(execRes.error).toContain('syntax error');

      const ctx = buildContext(db, invalidSql, execRes);
      const feedback = await ValidationEngine.validate(HOSPITAL_MISSIONS[0].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('SQL error');
    });

    it('hp_m1: Intentional Error - Missing required column (omits pager_number)', async () => {
      const incompleteSql = `CREATE TABLE emergency_roster (
        roster_id INTEGER PRIMARY KEY AUTOINCREMENT,
        doctor_id INTEGER NOT NULL,
        shift_date TEXT NOT NULL,
        shift_type TEXT NOT NULL
      );`;
      const execRes = await executeSql(db, incompleteSql);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, incompleteSql, execRes);
      const feedback = await ValidationEngine.validate(HOSPITAL_MISSIONS[0].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('pager_number');
      expect(feedback.details?.expected).toContain('pager_number');
    });

    it('hp_m1: Intentional Error - Wrong table name (creates on_call_roster instead of emergency_roster)', async () => {
      const wrongTableSql = `CREATE TABLE on_call_roster (
        roster_id INTEGER PRIMARY KEY AUTOINCREMENT,
        doctor_id INTEGER NOT NULL,
        shift_date TEXT NOT NULL,
        shift_type TEXT NOT NULL,
        pager_number TEXT NOT NULL
      );`;
      const execRes = await executeSql(db, wrongTableSql);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, wrongTableSql, execRes);
      const feedback = await ValidationEngine.validate(HOSPITAL_MISSIONS[0].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain("Table 'emergency_roster' does not exist");
      expect(feedback.details?.hint).toContain('CREATE TABLE emergency_roster');
    });

    it('hp_m2: Intentional Error - Missing doctor/department relationship / Foreign Key violation', async () => {
      // department_id = 999 does not exist in departments
      const fkViolationSql = `INSERT INTO doctors (doctor_id, first_name, last_name, specialty, department_id, is_on_call)
        VALUES (7, 'Neil', 'Armstrong', 'Pediatric Cardiology', 999, 1);`;
      const execRes = await executeSql(db, fkViolationSql);
      expect(execRes.success).toBe(false);
      expect(execRes.error?.toLowerCase()).toContain('foreign key');

      const ctx = buildContext(db, fkViolationSql, execRes);
      const feedback = await ValidationEngine.validate(HOSPITAL_MISSIONS[1].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('SQL error');
    });

    it('hp_m2: Intentional Error - Wrong doctor attributes / incomplete WHERE clause satisfaction', async () => {
      // Insert with wrong specialty
      const wrongSpecialtySql = `INSERT INTO doctors (doctor_id, first_name, last_name, specialty, department_id, is_on_call)
        VALUES (7, 'Neil', 'Armstrong', 'General Surgery', 4, 1);`;
      const execRes = await executeSql(db, wrongSpecialtySql);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, wrongSpecialtySql, execRes);
      const feedback = await ValidationEngine.validate(HOSPITAL_MISSIONS[1].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('Verify Dr. Armstrong is registered in doctors');
      expect(feedback.details?.expected).toContain("specialty = 'Pediatric Cardiology'");
    });

    it('hp_m3: Intentional Error - Filter omission (omitting WHERE clause returns all 5 wards)', async () => {
      const omittedFilterSql = `SELECT ward_name, ward_type, total_beds, occupied_beds FROM wards;`;
      const execRes = await executeSql(db, omittedFilterSql);
      expect(execRes.success).toBe(true);
      expect(execRes.results[0].values).toHaveLength(5);

      const ctx = buildContext(db, omittedFilterSql, execRes);
      const feedback = await ValidationEngine.validate(HOSPITAL_MISSIONS[2].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('Returned 5 record(s), but 2 were expected');
      expect(feedback.details?.hint).toContain('WHERE filter');
    });

    it('hp_m3: Intentional Error - Inverted comparison filter (occupied_beds < total_beds)', async () => {
      const invertedFilterSql = `SELECT ward_name, ward_type, total_beds, occupied_beds FROM wards WHERE occupied_beds < total_beds;`;
      const execRes = await executeSql(db, invertedFilterSql);
      expect(execRes.success).toBe(true);
      expect(execRes.results[0].values).toHaveLength(3); // 3 non-saturated wards

      const ctx = buildContext(db, invertedFilterSql, execRes);
      const feedback = await ValidationEngine.validate(HOSPITAL_MISSIONS[2].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('Returned 3 record(s), but 2 were expected');
    });

    it('hp_m4: Intentional Error - Filter omission / wrong admission target in UPDATE', async () => {
      // Student accidentally targets admission_id = 101 instead of 104
      const wrongTargetSql = `UPDATE admissions SET discharge_date = '2026-11-16', status = 'Discharged' WHERE admission_id = 101;`;
      const execRes = await executeSql(db, wrongTargetSql);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, wrongTargetSql, execRes);
      const feedback = await ValidationEngine.validate(HOSPITAL_MISSIONS[3].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('admission 104 is discharged');
      expect(feedback.details?.expected).toContain('admission_id = 104');
    });

    it('hp_m5: Intentional Error - Missing doctor/patient relationship / Wrong JOIN ON keys', async () => {
      // Connects admissions to doctors using patient_id instead of doctor_id
      const wrongJoinSql = `SELECT p.first_name, p.last_name, p.blood_group, d.first_name AS doc_first_name, d.last_name AS doc_last_name, d.specialty, a.admission_date
        FROM patients p
        JOIN admissions a ON p.patient_id = a.patient_id
        JOIN doctors d ON a.patient_id = d.doctor_id
        WHERE a.status = 'Admitted'
        ORDER BY a.admission_date ASC;`;
      const execRes = await executeSql(db, wrongJoinSql);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, wrongJoinSql, execRes);
      const feedback = await ValidationEngine.validate(HOSPITAL_MISSIONS[4].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toMatch(/records returned do not match|data values returned do not match|Returned \d+ record\(s\)/);
    });

    it('hp_m5: Intentional Error - Status filter omission (includes Discharged patient 105)', async () => {
      const omittedFilterSql = `SELECT p.first_name, p.last_name, p.blood_group, d.first_name AS doc_first_name, d.last_name AS doc_last_name, d.specialty, a.admission_date
        FROM patients p
        JOIN admissions a ON p.patient_id = a.patient_id
        JOIN doctors d ON a.doctor_id = d.doctor_id
        ORDER BY a.admission_date ASC;`;
      const execRes = await executeSql(db, omittedFilterSql);
      expect(execRes.success).toBe(true);
      // Returns 6 rows instead of 5 (or 4 if m4 ran)
      expect(execRes.results[0].values.length).toBeGreaterThan(4);

      const ctx = buildContext(db, omittedFilterSql, execRes);
      const feedback = await ValidationEngine.validate(HOSPITAL_MISSIONS[4].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.details?.hint).toContain('WHERE filter');
    });

    it('hp_m5: Intentional Error - Order violation (ORDER BY admission_date DESC instead of ASC)', async () => {
      // First discharge 104 so row counts match
      await executeSql(db, HOSPITAL_MISSIONS[3].sampleSolution);

      const wrongOrderSql = `SELECT p.first_name, p.last_name, p.blood_group, d.first_name AS doc_first_name, d.last_name AS doc_last_name, d.specialty, a.admission_date
        FROM patients p
        JOIN admissions a ON p.patient_id = a.patient_id
        JOIN doctors d ON a.doctor_id = d.doctor_id
        WHERE a.status = 'Admitted'
        ORDER BY a.admission_date DESC;`;
      const execRes = await executeSql(db, wrongOrderSql);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, wrongOrderSql, execRes);
      const feedback = await ValidationEngine.validate(HOSPITAL_MISSIONS[4].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('ordering');
    });

    it('hp_m6: Intentional Error - Wrong grouping column (GROUP BY total_beds instead of ward_type)', async () => {
      const wrongGroupingSql = `SELECT ward_type, COUNT(ward_id) AS total_wards, SUM(total_beds) AS total_capacity, SUM(occupied_beds) AS total_occupied
        FROM wards
        GROUP BY total_beds
        ORDER BY total_occupied DESC;`;
      const execRes = await executeSql(db, wrongGroupingSql);
      expect(execRes.success).toBe(true);
      // Grouping by total_beds produces 5 groups instead of 4 ward_type groups
      expect(execRes.results[0].values).toHaveLength(5);

      const ctx = buildContext(db, wrongGroupingSql, execRes);
      const feedback = await ValidationEngine.validate(HOSPITAL_MISSIONS[5].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('Returned 5 record(s), but 4 were expected');
    });

    it('hp_m6: Intentional Error - Reversed ordering (ORDER BY total_occupied ASC instead of DESC)', async () => {
      const wrongOrderSql = `SELECT ward_type, COUNT(ward_id) AS total_wards, SUM(total_beds) AS total_capacity, SUM(occupied_beds) AS total_occupied
        FROM wards
        GROUP BY ward_type
        ORDER BY total_occupied ASC;`;
      const execRes = await executeSql(db, wrongOrderSql);
      expect(execRes.success).toBe(true);

      const ctx = buildContext(db, wrongOrderSql, execRes);
      const feedback = await ValidationEngine.validate(HOSPITAL_MISSIONS[5].validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('ordering');
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

      // Check Critical Ward Occupancy Rate: 90.9% (20 / 22 beds)
      const resRate = await executeSql(db, metrics[2].query);
      expect(resRate.results[0].values[0][0]).toBe('90.9%');
    });
  });
});
