import { describe, it, expect, beforeEach } from 'vitest';
import initSqlJs from 'sql.js';
import { kaapiWorld } from '../src/modules/worlds/kaapi';
import { KAAPI_MISSIONS } from '../src/modules/worlds/kaapi/missions';
import { ValidationEngine } from '../src/modules/validation/validation-engine';
import { ValidationContext } from '../src/types/validation';
import { SqlExecutionResponse, SqlDatabaseSchema } from '../src/types/sql';
import { generateSqlDiagnostic } from '../src/modules/sql-engine/diagnostics';

describe('World 3: Query & Kaapi — Tiffin & Filter Coffee (Comprehensive Audit & Playthrough)', () => {
  let db: any;

  const createFreshDb = async () => {
    const SQL = await initSqlJs();
    const newDb = new SQL.Database();
    newDb.exec('PRAGMA foreign_keys = ON;');
    if (kaapiWorld.initialSchemaSql) {
      newDb.exec(kaapiWorld.initialSchemaSql);
    }
    if (kaapiWorld.initialDatasetSql) {
      newDb.exec(kaapiWorld.initialDatasetSql);
    }
    return newDb;
  };

  const getDatabaseSchema = (activeDb = db): SqlDatabaseSchema => {
    const tablesRes = activeDb.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
    const schema: SqlDatabaseSchema = {};
    if (tablesRes.length > 0) {
      for (const row of tablesRes[0].values) {
        const tableName = row[0];
        const colsRes = activeDb.exec(`PRAGMA table_info("${tableName}");`);
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

  const executeSql = async (sql: string, activeDb = db): Promise<SqlExecutionResponse> => {
    const startTime = performance.now();
    try {
      const results = activeDb.exec(sql);
      const executionTimeMs = performance.now() - startTime;
      return {
        query: sql,
        results: results.map((r: any) => ({
          columns: r.columns,
          values: r.values,
        })),
        executionTimeMs,
        affectedRows: activeDb.getRowsModified ? activeDb.getRowsModified() : 0,
        success: true,
      };
    } catch (err: any) {
      const executionTimeMs = performance.now() - startTime;
      const hint = generateSqlDiagnostic(err.message, sql);
      return {
        query: sql,
        results: [],
        executionTimeMs,
        affectedRows: 0,
        success: false,
        error: err.message,
        hint,
      };
    }
  };

  const createValidationContext = (studentSql: string, executionResponse: SqlExecutionResponse, activeDb = db): ValidationContext => ({
    studentSql,
    executionResponse,
    executeSql: async (sql: string) => executeSql(sql, activeDb),
    getSchema: async () => getDatabaseSchema(activeDb),
    getTableData: async (tableName: string) => {
      const res = activeDb.exec(`SELECT * FROM "${tableName}";`);
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

  // Helper to run missions 1 through N sequentially on a given DB instance
  const runMissionsUpTo = async (upToMissionIndex: number, targetDb = db) => {
    for (let i = 0; i < upToMissionIndex; i++) {
      const mission = KAAPI_MISSIONS[i];
      const execRes = await executeSql(mission.sampleSolution, targetDb);
      if (!execRes.success) {
        throw new Error(`Prerequisite mission ${i + 1} (${mission.title}) failed: ${execRes.error}`);
      }
    }
  };

  beforeEach(async () => {
    db = await createFreshDb();
  });

  // =========================================================================
  // Section 1: World Definition & Configuration Integrity
  // =========================================================================
  describe('Section 1: World Definition & Configuration Integrity', () => {
    it('verifies World Definition metadata for Query & Kaapi', () => {
      expect(kaapiWorld.id).toBe('kaapi');
      expect(kaapiWorld.name).toBe('Query & Kaapi — Tiffin & Filter Coffee');
      expect(kaapiWorld.industry).toBe('Hospitality & Culinary Operations');
      expect(kaapiWorld.difficulty).toBe('Beginner');
      expect(kaapiWorld.estimatedTime).toBe('40 mins');
      expect(kaapiWorld.iconName).toBe('Coffee');
      expect(kaapiWorld.accentColor).toBe('amber');
      expect(kaapiWorld.dbFileName).toBe('kaapi.db');
      expect(kaapiWorld.isAvailable).toBe(true);
      expect(kaapiWorld.missions.length).toBe(9);
      expect(kaapiWorld.sqlTopics.length).toBeGreaterThanOrEqual(10);
      expect(kaapiWorld.reportConfig).toBeDefined();
      expect(kaapiWorld.reportConfig.metrics.length).toBe(5);
    });

    it('verifies storyIntro and narrative background', () => {
      expect(kaapiWorld.storyIntro.roleTitle).toBe('Kitchen POS & Inventory Systems Lead');
      expect(kaapiWorld.storyIntro.organization).toBe('Query & Kaapi Tiffin Room & Roastery');
      expect(kaapiWorld.storyIntro.background).toContain('Chikmagalur coffee');
      expect(kaapiWorld.storyIntro.keyResponsibilities.length).toBe(5);
    });

    it('verifies each mission has complete metadata, starter SQL, hints, badge, and xpReward', () => {
      KAAPI_MISSIONS.forEach((m, idx) => {
        expect(m.id).toBe(`kaapi_m${idx + 1}`);
        expect(m.order).toBe(idx + 1);
        expect(m.title).toBeTruthy();
        expect(m.storyline).toBeTruthy();
        expect(m.businessProblem).toBeTruthy();
        expect(m.objective).toBeTruthy();
        expect(m.requiredOutcome).toBeTruthy();
        expect(m.checklist.length).toBeGreaterThan(0);
        expect(m.hints.length).toBeGreaterThan(0);
        expect(m.sampleSolution).toBeTruthy();
        expect(m.solutionExplanation).toBeTruthy();
        expect(m.initialSqlPlaceholder).toBeTruthy();
        expect(m.validationRules.length).toBeGreaterThan(0);
        expect(m.xpReward).toBeGreaterThan(0);
        expect(m.badge).toBeDefined();
        expect(m.badge.id).toBeTruthy();
        expect(m.badge.title).toBeTruthy();
        expect(m.badge.icon).toBeTruthy();
      });
    });
  });

  // =========================================================================
  // Section 2: Step-by-Step Sequential Mission Playthrough
  // =========================================================================
  describe('Section 2: Step-by-Step Sequential Mission Playthrough', () => {
    it('executes all 9 missions sequentially in order and passes all validation rules', async () => {
      for (let i = 0; i < KAAPI_MISSIONS.length; i++) {
        const mission = KAAPI_MISSIONS[i];
        const execRes = await executeSql(mission.sampleSolution);
        expect(execRes.success, `Mission ${mission.order} (${mission.title}) failed: ${execRes.error}`).toBe(true);

        const context = createValidationContext(mission.sampleSolution, execRes);
        const feedback = await ValidationEngine.validate(mission.validationRules, context);
        expect(feedback.passed, `Mission ${mission.order} validation failed: ${feedback.message}`).toBe(true);
      }
    });

    it('Mission 1: Booting the Menu Board (CREATE TABLE menu_items)', async () => {
      const m1 = KAAPI_MISSIONS[0];
      const execRes = await executeSql(m1.sampleSolution);
      expect(execRes.success).toBe(true);

      const context = createValidationContext(m1.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m1.validationRules, context);
      expect(feedback.passed).toBe(true);

      const schema = getDatabaseSchema();
      expect(schema['menu_items']).toBeDefined();
      const colNames = schema['menu_items'].columns.map((c) => c.name);
      expect(colNames).toEqual([
        'item_id',
        'item_name',
        'category',
        'spice_level',
        'price_inr',
        'orders_today',
        'calories',
        'status',
      ]);

      // Check primary key on item_id
      const pkCol = schema['menu_items'].columns.find((c) => c.name === 'item_id');
      expect(pkCol?.pk).toBe(1);

      // Check default values
      const spiceCol = schema['menu_items'].columns.find((c) => c.name === 'spice_level');
      expect(spiceCol?.dflt_value).toBe("'Mild'");
      const statusCol = schema['menu_items'].columns.find((c) => c.name === 'status');
      expect(statusCol?.dflt_value).toBe("'Available'");
    });

    it('Mission 2: Davara Loyalty Pass Vault (CREATE TABLE kaapi_passes with CHECK constraint)', async () => {
      await runMissionsUpTo(1);
      const m2 = KAAPI_MISSIONS[1];
      const execRes = await executeSql(m2.sampleSolution);
      expect(execRes.success).toBe(true);

      const context = createValidationContext(m2.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m2.validationRules, context);
      expect(feedback.passed).toBe(true);

      const schema = getDatabaseSchema();
      expect(schema['kaapi_passes']).toBeDefined();
      const colNames = schema['kaapi_passes'].columns.map((c) => c.name);
      expect(colNames).toEqual(['pass_id', 'member_phone', 'pass_tier', 'cups_left', 'preferred_roast']);
    });

    it('Mission 3: Stocking the Morning Counter (INSERT 8 signature items)', async () => {
      await runMissionsUpTo(2);
      const m3 = KAAPI_MISSIONS[2];
      const execRes = await executeSql(m3.sampleSolution);
      expect(execRes.success).toBe(true);

      const context = createValidationContext(m3.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m3.validationRules, context);
      expect(feedback.passed).toBe(true);

      const countRes = db.exec('SELECT COUNT(*) FROM menu_items;');
      expect(countRes[0].values[0][0]).toBe(8);

      // Verify individual item data
      const degreeRes = db.exec("SELECT price_inr, orders_today, category FROM menu_items WHERE item_name = 'Degree Filter Kaapi';");
      expect(degreeRes[0].values[0]).toEqual([40, 210, 'Kaapi']);

      const seasonalRes = db.exec("SELECT status, price_inr FROM menu_items WHERE item_name = 'Karupatti Kaapi';");
      expect(seasonalRes[0].values[0]).toEqual(['Seasonal', 50]);

      const discRes = db.exec("SELECT status, price_inr FROM menu_items WHERE item_name = 'Rava Onion Dosa';");
      expect(discRes[0].values[0]).toEqual(['Discontinued', 75]);
    });

    it('Mission 4: Overhead Menu Board (SELECT with aliases, ORDER BY DESC)', async () => {
      await runMissionsUpTo(3);
      const m4 = KAAPI_MISSIONS[3];
      const execRes = await executeSql(m4.sampleSolution);
      expect(execRes.success).toBe(true);

      const context = createValidationContext(m4.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m4.validationRules, context);
      expect(feedback.passed).toBe(true);

      expect(execRes.results[0].columns).toEqual(['dish_name', 'category', 'plates_served']);
      expect(execRes.results[0].values).toHaveLength(8);
      // Top seller Degree Filter Kaapi (210 plates) must be first
      expect(execRes.results[0].values[0][0]).toBe('Degree Filter Kaapi');
      expect(execRes.results[0].values[0][2]).toBe(210);
    });

    it('Mission 5: Express Breakfast & Kaapi Filter (WHERE IN and BETWEEN)', async () => {
      await runMissionsUpTo(3);
      const m5 = KAAPI_MISSIONS[4];
      const execRes = await executeSql(m5.sampleSolution);
      expect(execRes.success).toBe(true);

      const context = createValidationContext(m5.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m5.validationRules, context);
      expect(feedback.passed).toBe(true);

      // Items returned: Ghee Podi Idli (60), Medu Vada (45), Degree Filter Kaapi (40), Ven Pongal (70), Karupatti Kaapi (50)
      expect(execRes.results[0].values).toHaveLength(5);
      const itemNames = execRes.results[0].values.map((r: any[]) => r[1]);
      expect(itemNames).toContain('Degree Filter Kaapi');
      expect(itemNames).toContain('Medu Vada');
      expect(itemNames).toContain('Ghee Podi Idli');
      expect(itemNames).toContain('Ven Pongal');
      expect(itemNames).toContain('Karupatti Kaapi');
      expect(itemNames).not.toContain('Mysore Masala Dosa'); // Dosa category excluded
      expect(itemNames).not.toContain('Pineapple Kesari'); // Sweet category excluded
    });

    it('Mission 6: Dosa Lineup & Calorie Audit (LIKE, IS NULL, OR)', async () => {
      await runMissionsUpTo(3);
      const m6 = KAAPI_MISSIONS[5];
      const execRes = await executeSql(m6.sampleSolution);
      expect(execRes.success).toBe(true);

      const context = createValidationContext(m6.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m6.validationRules, context);
      expect(feedback.passed).toBe(true);

      // Matches: Mysore Masala Dosa (LIKE %Dosa%), Ghee Podi Idli (calories IS NULL), Karupatti Kaapi (calories IS NULL)
      // Excluded: Rava Onion Dosa (discontinued)
      expect(execRes.results[0].values).toHaveLength(3);
      const names = execRes.results[0].values.map((r: any[]) => r[1]);
      expect(names).toContain('Mysore Masala Dosa');
      expect(names).toContain('Ghee Podi Idli');
      expect(names).toContain('Karupatti Kaapi');
      expect(names).not.toContain('Rava Onion Dosa');
    });

    it('Mission 7: Launching Karupatti Kaapi (UPDATE Seasonal to Available with price 65)', async () => {
      await runMissionsUpTo(3);
      const m7 = KAAPI_MISSIONS[6];
      const execRes = await executeSql(m7.sampleSolution);
      expect(execRes.success).toBe(true);

      const context = createValidationContext(m7.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m7.validationRules, context);
      expect(feedback.passed).toBe(true);

      const checkRes = db.exec("SELECT status, price_inr FROM menu_items WHERE item_name = 'Karupatti Kaapi';");
      expect(checkRes[0].values[0][0]).toBe('Available');
      expect(checkRes[0].values[0][1]).toBe(65);

      const seasonalCheck = db.exec("SELECT COUNT(*) FROM menu_items WHERE status = 'Seasonal';");
      expect(seasonalCheck[0].values[0][0]).toBe(0);
    });

    it('Mission 8: Clearing Off-Menu Items (DELETE FROM menu_items WHERE status = "Discontinued")', async () => {
      await runMissionsUpTo(7); // M1 through M7
      const m8 = KAAPI_MISSIONS[7];
      const execRes = await executeSql(m8.sampleSolution);
      expect(execRes.success).toBe(true);

      const context = createValidationContext(m8.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m8.validationRules, context);
      expect(feedback.passed).toBe(true);

      const countRes = db.exec('SELECT COUNT(*) FROM menu_items;');
      expect(countRes[0].values[0][0]).toBe(7);

      const discCheck = db.exec("SELECT COUNT(*) FROM menu_items WHERE status = 'Discontinued';");
      expect(discCheck[0].values[0][0]).toBe(0);
    });

    it('Mission 9: Morning Shift Closing Register (COUNT, SUM, AVG, MIN, MAX, ROUND)', async () => {
      await runMissionsUpTo(8); // M1 through M8
      const m9 = KAAPI_MISSIONS[8];
      const execRes = await executeSql(m9.sampleSolution);
      expect(execRes.success).toBe(true);

      const context = createValidationContext(m9.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m9.validationRules, context);
      expect(feedback.passed).toBe(true);

      const cols = execRes.results[0].columns;
      expect(cols).toEqual(['total_dishes', 'total_orders_served', 'avg_dish_price', 'lowest_price_inr', 'top_dish_orders']);
      const vals = execRes.results[0].values[0];
      expect(vals[0]).toBe(7); // total_dishes (after deleting 1 discontinued)
      expect(vals[1]).toBe(640); // total_orders_served (120+95+110+210+65+40+0)
      expect(vals[2]).toBe(60); // avg_dish_price (420 / 7)
      expect(vals[3]).toBe(40); // lowest_price_inr (Degree Filter Kaapi)
      expect(vals[4]).toBe(210); // top_dish_orders (Degree Filter Kaapi)
    });
  });

  // =========================================================================
  // Section 3: Executive Report Configuration Verification
  // =========================================================================
  describe('Section 3: Executive Report Configuration Verification', () => {
    it('executes all 5 executive report queries cleanly against the final database state', async () => {
      await runMissionsUpTo(9); // Full playthrough
      const { reportConfig } = kaapiWorld;
      expect(reportConfig.metrics).toHaveLength(5);

      for (const metric of reportConfig.metrics) {
        const res = await executeSql(metric.query);
        expect(res.success, `Report metric "${metric.title}" failed: ${res.error}`).toBe(true);
        expect(res.results?.[0]?.values?.length).toBeGreaterThan(0);
      }
    });

    it('validates each report metric values accurately', async () => {
      await runMissionsUpTo(9);
      const { reportConfig } = kaapiWorld;

      // Metric 1: Active Menu Dishes (COUNT)
      const m1Res = await executeSql(reportConfig.metrics[0].query);
      expect(m1Res.results[0].values[0][0]).toBe(7);

      // Metric 2: Morning Shift Plates Served (SUM with formatting)
      const m2Res = await executeSql(reportConfig.metrics[1].query);
      expect(m2Res.results[0].values[0][0]).toBe('640');

      // Metric 3: Average Dish Price (AVG with currency format)
      const m3Res = await executeSql(reportConfig.metrics[2].query);
      expect(m3Res.results[0].values[0][0]).toBe('₹60.00');

      // Metric 4: Orders by Category (GROUP BY bar_chart)
      const m4Res = await executeSql(reportConfig.metrics[3].query);
      const catRows = m4Res.results[0].values;
      expect(catRows).toHaveLength(4);
      // Expected breakdown: Idli_Vada: 270, Kaapi: 210, Dosa: 120, Sweet: 40
      expect(catRows[0]).toEqual(['Idli_Vada', 270]);
      expect(catRows[1]).toEqual(['Kaapi', 210]);
      expect(catRows[2]).toEqual(['Dosa', 120]);
      expect(catRows[3]).toEqual(['Sweet', 40]);

      // Metric 5: Top Best-Selling Tiffin Specials (LIMIT 5 table)
      const m5Res = await executeSql(reportConfig.metrics[4].query);
      const topRows = m5Res.results[0].values;
      expect(topRows).toHaveLength(5);
      expect(topRows[0]).toEqual(['Degree Filter Kaapi', 'Kaapi', 210]);
      expect(topRows[1]).toEqual(['Mysore Masala Dosa', 'Dosa', 120]);
      expect(topRows[2]).toEqual(['Medu Vada', 'Idli_Vada', 110]);
      expect(topRows[3]).toEqual(['Ghee Podi Idli', 'Idli_Vada', 95]);
      expect(topRows[4]).toEqual(['Ven Pongal', 'Idli_Vada', 65]);
    });
  });

  // =========================================================================
  // Section 4: Valid Alternate Query Solutions
  // =========================================================================
  describe('Section 4: Valid Alternate Query Solutions', () => {
    it('Mission 1: accepts uppercase column names and alternate column order', async () => {
      const altDb = await createFreshDb();
      const altSql = `
        CREATE TABLE menu_items (
          ITEM_ID INTEGER PRIMARY KEY,
          ITEM_NAME TEXT NOT NULL,
          CATEGORY TEXT NOT NULL,
          PRICE_INR INTEGER NOT NULL,
          SPICE_LEVEL TEXT DEFAULT 'Mild',
          ORDERS_TODAY INTEGER DEFAULT 0,
          CALORIES INTEGER,
          STATUS TEXT DEFAULT 'Available'
        );
      `;
      const res = await executeSql(altSql, altDb);
      expect(res.success).toBe(true);

      const ctx = createValidationContext(altSql, res, altDb);
      const feedback = await ValidationEngine.validate(KAAPI_MISSIONS[0].validationRules, ctx);
      expect(feedback.passed).toBe(true);
    });

    it('Mission 2: accepts table-level CHECK constraint', async () => {
      const altDb = await createFreshDb();
      await runMissionsUpTo(1, altDb);
      const altSql = `
        CREATE TABLE kaapi_passes (
          pass_id INTEGER PRIMARY KEY AUTOINCREMENT,
          member_phone TEXT UNIQUE NOT NULL,
          pass_tier TEXT NOT NULL,
          cups_left INTEGER,
          preferred_roast TEXT,
          CHECK (cups_left >= 0)
        );
      `;
      const res = await executeSql(altSql, altDb);
      expect(res.success).toBe(true);

      const ctx = createValidationContext(altSql, res, altDb);
      const feedback = await ValidationEngine.validate(KAAPI_MISSIONS[1].validationRules, ctx);
      expect(feedback.passed).toBe(true);
    });

    it('Mission 3: accepts individual multi-statement INSERT queries', async () => {
      const altDb = await createFreshDb();
      await runMissionsUpTo(2, altDb);
      const altSql = `
        INSERT INTO menu_items (item_id, item_name, category, spice_level, price_inr, orders_today, calories, status) VALUES (301, 'Mysore Masala Dosa', 'Dosa', 'Medium', 85, 120, 350, 'Available');
        INSERT INTO menu_items (item_id, item_name, category, spice_level, price_inr, orders_today, calories, status) VALUES (302, 'Ghee Podi Idli', 'Idli_Vada', 'Spicy', 60, 95, NULL, 'Available');
        INSERT INTO menu_items (item_id, item_name, category, spice_level, price_inr, orders_today, calories, status) VALUES (303, 'Medu Vada', 'Idli_Vada', 'Mild', 45, 110, 220, 'Available');
        INSERT INTO menu_items (item_id, item_name, category, spice_level, price_inr, orders_today, calories, status) VALUES (304, 'Degree Filter Kaapi', 'Kaapi', 'None', 40, 210, 80, 'Available');
        INSERT INTO menu_items (item_id, item_name, category, spice_level, price_inr, orders_today, calories, status) VALUES (305, 'Ven Pongal', 'Idli_Vada', 'Mild', 70, 65, 290, 'Available');
        INSERT INTO menu_items (item_id, item_name, category, spice_level, price_inr, orders_today, calories, status) VALUES (306, 'Pineapple Kesari', 'Sweet', 'None', 55, 40, 310, 'Available');
        INSERT INTO menu_items (item_id, item_name, category, spice_level, price_inr, orders_today, calories, status) VALUES (307, 'Karupatti Kaapi', 'Kaapi', 'None', 50, 0, NULL, 'Seasonal');
        INSERT INTO menu_items (item_id, item_name, category, spice_level, price_inr, orders_today, calories, status) VALUES (308, 'Rava Onion Dosa', 'Dosa', 'Medium', 75, 0, 380, 'Discontinued');
      `;
      const res = await executeSql(altSql, altDb);
      expect(res.success).toBe(true);

      const ctx = createValidationContext(altSql, res, altDb);
      const feedback = await ValidationEngine.validate(KAAPI_MISSIONS[2].validationRules, ctx);
      expect(feedback.passed).toBe(true);
    });

    it('Mission 4: accepts ORDER BY alias name (ORDER BY plates_served DESC)', async () => {
      await runMissionsUpTo(3);
      const altSql = `
        SELECT item_name AS dish_name, category, orders_today AS plates_served
        FROM menu_items
        ORDER BY plates_served DESC;
      `;
      const res = await executeSql(altSql);
      expect(res.success).toBe(true);

      const ctx = createValidationContext(altSql, res);
      const feedback = await ValidationEngine.validate(KAAPI_MISSIONS[3].validationRules, ctx);
      expect(feedback.passed).toBe(true);
    });

    it('Mission 5: accepts OR with >= AND <= instead of IN and BETWEEN', async () => {
      await runMissionsUpTo(3);
      const altSql = `
        SELECT * FROM menu_items
        WHERE (category = 'Idli_Vada' OR category = 'Kaapi')
          AND price_inr >= 40 AND price_inr <= 95
        ORDER BY price_inr ASC;
      `;
      const res = await executeSql(altSql);
      expect(res.success).toBe(true);

      const ctx = createValidationContext(altSql, res);
      const feedback = await ValidationEngine.validate(KAAPI_MISSIONS[4].validationRules, ctx);
      expect(feedback.passed).toBe(true);
    });

    it('Mission 6: accepts <> instead of != and reordered WHERE conditions', async () => {
      await runMissionsUpTo(3);
      const altSql = `
        SELECT * FROM menu_items
        WHERE status <> 'Discontinued'
          AND (item_name LIKE '%Dosa%' OR calories IS NULL);
      `;
      const res = await executeSql(altSql);
      expect(res.success).toBe(true);

      const ctx = createValidationContext(altSql, res);
      const feedback = await ValidationEngine.validate(KAAPI_MISSIONS[5].validationRules, ctx);
      expect(feedback.passed).toBe(true);
    });

    it('Mission 7: accepts targeting Karupatti Kaapi by name and reversed SET order', async () => {
      const altDb = await createFreshDb();
      await runMissionsUpTo(3, altDb);
      const altSql = `
        UPDATE menu_items
        SET price_inr = 65, status = 'Available'
        WHERE item_name = 'Karupatti Kaapi';
      `;
      const res = await executeSql(altSql, altDb);
      expect(res.success).toBe(true);

      const ctx = createValidationContext(altSql, res, altDb);
      const feedback = await ValidationEngine.validate(KAAPI_MISSIONS[6].validationRules, ctx);
      expect(feedback.passed).toBe(true);
    });

    it('Mission 8: accepts targeting Rava Onion Dosa by item_name instead of status', async () => {
      const altDb = await createFreshDb();
      await runMissionsUpTo(7, altDb);
      const altSql = `
        DELETE FROM menu_items
        WHERE item_name = 'Rava Onion Dosa';
      `;
      const res = await executeSql(altSql, altDb);
      expect(res.success).toBe(true);

      const ctx = createValidationContext(altSql, res, altDb);
      const feedback = await ValidationEngine.validate(KAAPI_MISSIONS[7].validationRules, ctx);
      expect(feedback.passed).toBe(true);
    });

    it('Mission 9: accepts COUNT(item_id) and unrounded AVG', async () => {
      await runMissionsUpTo(8);
      const altSql = `
        SELECT 
          COUNT(item_id) AS total_dishes,
          SUM(orders_today) AS total_orders_served,
          AVG(price_inr) AS avg_dish_price,
          MIN(price_inr) AS lowest_price_inr,
          MAX(orders_today) AS top_dish_orders
        FROM menu_items;
      `;
      const res = await executeSql(altSql);
      expect(res.success).toBe(true);

      const ctx = createValidationContext(altSql, res);
      const feedback = await ValidationEngine.validate(KAAPI_MISSIONS[8].validationRules, ctx);
      expect(feedback.passed).toBe(true);
    });
  });

  // =========================================================================
  // Section 5: Intentional Error Handling & Diagnostic Feedback
  // =========================================================================
  describe('Section 5: Intentional Error Handling & Diagnostic Feedback', () => {
    it('Mission 1: catches syntax error and missing column in CREATE TABLE', async () => {
      const m1 = KAAPI_MISSIONS[0];

      // 1. Incomplete input syntax error
      const brokenSql = 'CREATE TABLE menu_items (item_id INT PRIMARY KEY, item_name TEXT';
      const brokenRes = await executeSql(brokenSql);
      expect(brokenRes.success).toBe(false);
      expect(brokenRes.hint).toMatch(/Incomplete SQL query|syntax error/i);

      // 2. Missing columns
      const partialDb = await createFreshDb();
      const partialSql = 'CREATE TABLE menu_items (item_id INTEGER PRIMARY KEY, item_name TEXT NOT NULL);';
      const partialRes = await executeSql(partialSql, partialDb);
      const feedback = await ValidationEngine.validate(m1.validationRules, createValidationContext(partialSql, partialRes, partialDb));
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain("column 'category' is missing");
    });

    it('Mission 2: detects missing CHECK constraint and enforces non-negative balance', async () => {
      const m2 = KAAPI_MISSIONS[1];
      const noCheckDb = await createFreshDb();
      await runMissionsUpTo(1, noCheckDb);

      // Create table without CHECK constraint
      const noCheckSql = `
        CREATE TABLE kaapi_passes (
          pass_id INTEGER PRIMARY KEY AUTOINCREMENT,
          member_phone TEXT UNIQUE NOT NULL,
          pass_tier TEXT NOT NULL,
          cups_left INTEGER,
          preferred_roast TEXT
        );
      `;
      const res = await executeSql(noCheckSql, noCheckDb);
      expect(res.success).toBe(true);

      const ctx = createValidationContext(noCheckSql, res, noCheckDb);
      const feedback = await ValidationEngine.validate(m2.validationRules, ctx);
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('CHECK constraint is missing or not enforcing non-negative balances');

      // Test negative balance insertion diagnostic feedback on valid table
      const validDb = await createFreshDb();
      await runMissionsUpTo(2, validDb);
      const negInsert = "INSERT INTO kaapi_passes (member_phone, pass_tier, cups_left) VALUES ('9999911111', 'Regular', -5);";
      const negRes = await executeSql(negInsert, validDb);
      expect(negRes.success).toBe(false);
      expect(negRes.hint).toContain('CHECK constraint violation');
    });

    it('Mission 3: catches missing columns and column count mismatches in INSERT', async () => {
      await runMissionsUpTo(2);

      // Value and column count mismatch
      const mismatchSql = "INSERT INTO menu_items (item_id, item_name) VALUES (301, 'Dosa', 85);";
      const mismatchRes = await executeSql(mismatchSql);
      expect(mismatchRes.success).toBe(false);
      expect(mismatchRes.hint).toContain('Column and value count mismatch');

      // Non-existent column
      const badColSql = "INSERT INTO menu_items (item_id, non_existent) VALUES (301, 'Dosa');";
      const badColRes = await executeSql(badColSql);
      expect(badColRes.success).toBe(false);
      expect(badColRes.hint).toContain('Column "non_existent" does not exist');
    });

    it('Mission 4: catches misuse of aggregate in WHERE and incorrect ORDER BY', async () => {
      await runMissionsUpTo(3);
      const m4 = KAAPI_MISSIONS[3];

      // Misuse of aggregate in WHERE
      const misuseSql = 'SELECT item_name, orders_today FROM menu_items WHERE SUM(orders_today) > 10;';
      const misuseRes = await executeSql(misuseSql);
      expect(misuseRes.success).toBe(false);
      expect(misuseRes.hint).toContain('Misuse of aggregate function');

      // Inverted order (ASC instead of DESC)
      const ascSql = 'SELECT item_name AS dish_name, category, orders_today AS plates_served FROM menu_items ORDER BY orders_today ASC;';
      const ascRes = await executeSql(ascSql);
      const feedback = await ValidationEngine.validate(m4.validationRules, createValidationContext(ascSql, ascRes));
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('ORDER BY');
    });

    it('Mission 5: catches incorrect price range boundaries and missing category', async () => {
      await runMissionsUpTo(3);
      const m5 = KAAPI_MISSIONS[4];

      // Wrong price boundary (BETWEEN 10 AND 30)
      const wrongPriceSql = "SELECT * FROM menu_items WHERE category IN ('Idli_Vada', 'Kaapi') AND price_inr BETWEEN 10 AND 30;";
      const wrongPriceRes = await executeSql(wrongPriceSql);
      const feedback = await ValidationEngine.validate(m5.validationRules, createValidationContext(wrongPriceSql, wrongPriceRes));
      expect(feedback.passed).toBe(false);
    });

    it('Mission 6: detects boolean precedence bug when parentheses around OR are omitted', async () => {
      await runMissionsUpTo(3);
      const m6 = KAAPI_MISSIONS[5];

      // Without parentheses: item_name LIKE '%Dosa%' OR calories IS NULL AND status != 'Discontinued'
      // This causes discontinued Rava Onion Dosa to be included because of AND precedence over OR!
      const badPrecedenceSql = "SELECT * FROM menu_items WHERE item_name LIKE '%Dosa%' OR calories IS NULL AND status != 'Discontinued';";
      const badRes = await executeSql(badPrecedenceSql);
      const feedback = await ValidationEngine.validate(m6.validationRules, createValidationContext(badPrecedenceSql, badRes));
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('record(s)');
    });

    it('Mission 7: detects incomplete UPDATE (wrong price or wrong target row)', async () => {
      const wrongPriceDb = await createFreshDb();
      await runMissionsUpTo(3, wrongPriceDb);
      const m7 = KAAPI_MISSIONS[6];

      // Updated with price 99 instead of 65
      const wrongPriceSql = "UPDATE menu_items SET status = 'Available', price_inr = 99 WHERE status = 'Seasonal';";
      const res = await executeSql(wrongPriceSql, wrongPriceDb);
      const feedback = await ValidationEngine.validate(m7.validationRules, createValidationContext(wrongPriceSql, res, wrongPriceDb));
      expect(feedback.passed).toBe(false);
    });

    it('Mission 8: detects DELETE without WHERE clause (accidental table wipe)', async () => {
      const wipeDb = await createFreshDb();
      await runMissionsUpTo(7, wipeDb);
      const m8 = KAAPI_MISSIONS[7];

      // Accidental purge of entire table
      const wipeSql = 'DELETE FROM menu_items;';
      const res = await executeSql(wipeSql, wipeDb);
      const feedback = await ValidationEngine.validate(m8.validationRules, createValidationContext(wipeSql, res, wipeDb));
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('has 0 records, but 7 were expected');
    });

    it('Mission 9: catches missing aggregate columns or wrong aggregate expressions', async () => {
      await runMissionsUpTo(8);
      const m9 = KAAPI_MISSIONS[8];

      // Missing top_dish_orders column
      const incompleteSql = 'SELECT COUNT(*) AS total_dishes, SUM(orders_today) AS total_orders_served FROM menu_items;';
      const incompleteRes = await executeSql(incompleteSql);
      const feedback = await ValidationEngine.validate(m9.validationRules, createValidationContext(incompleteSql, incompleteRes));
      expect(feedback.passed).toBe(false);
    });
  });

  // =========================================================================
  // Section 6: Gamification XP & Badge Progression
  // =========================================================================
  describe('Section 6: Gamification XP & Badge Progression', () => {
    it('verifies cumulative XP reward across all 9 missions is exactly 1050', () => {
      const expectedXps = [100, 100, 100, 100, 100, 100, 100, 100, 250];
      let totalXp = 0;

      KAAPI_MISSIONS.forEach((m, idx) => {
        expect(m.xpReward).toBe(expectedXps[idx]);
        totalXp += m.xpReward;
      });

      expect(totalXp).toBe(1050);
    });

    it('verifies every mission has a unique, thematic South Indian cafe badge', () => {
      const badgeIds = KAAPI_MISSIONS.map((m) => m.badge.id);
      const uniqueBadgeIds = new Set(badgeIds);
      expect(uniqueBadgeIds.size).toBe(9);

      expect(badgeIds).toEqual([
        'menu_architect',
        'kaapi_vault_keeper',
        'tiffin_curator',
        'board_designer',
        'express_barista',
        'dosa_connoisseur',
        'roastery_specialist',
        'menu_purifier',
        'degree_kaapi_master',
      ]);
    });
  });
});
