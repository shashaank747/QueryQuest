import { describe, it, expect, beforeEach } from 'vitest';
import initSqlJs from 'sql.js';
import { SUPERMARKET_MISSIONS } from '../src/modules/worlds/supermarket/missions';
import { SUPERMARKET_BASE_SCHEMA } from '../src/modules/worlds/supermarket/schema';
import { SUPERMARKET_FULL_SEED, SUPERMARKET_CATALOG_AND_SALES_SEED } from '../src/modules/worlds/supermarket/dataset';
import { ValidationEngine } from '../src/modules/validation/validation-engine';
import { ValidationContext } from '../src/types/validation';
import { SqlExecutionResponse, SqlDatabaseSchema } from '../src/types/sql';
import { generateSqlDiagnostic } from '../src/modules/sql-engine/diagnostics';
import { ALL_ACHIEVEMENTS, calculateLevel } from '../src/modules/gamification/achievements';
import { useUserStore } from '../src/stores/useUserStore';

describe('Supermarket Operations Audit & Playthrough Verification', () => {
  let db: any;

  const createFreshDb = async () => {
    const SQL = await initSqlJs();
    const newDb = new SQL.Database();
    newDb.exec('PRAGMA foreign_keys = ON;');
    newDb.exec(SUPERMARKET_BASE_SCHEMA);
    newDb.exec(SUPERMARKET_FULL_SEED);
    newDb.exec(SUPERMARKET_CATALOG_AND_SALES_SEED);
    return newDb;
  };

  beforeEach(async () => {
    db = await createFreshDb();
  });

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
    try {
      const results = activeDb.exec(sql);
      const formattedResults = results.map((r: any) => ({
        columns: r.columns,
        values: r.values,
      }));
      return {
        success: true,
        query: sql,
        action: 'SELECT',
        results: formattedResults,
        rowsAffected: 0,
        executionTimeMs: 1,
      };
    } catch (err: any) {
      const hint = generateSqlDiagnostic(err.message, sql);
      return {
        success: false,
        query: sql,
        action: 'OTHER',
        rowsAffected: 0,
        executionTimeMs: 0,
        error: err.message,
        hint,
      };
    }
  };

  const createValidationContext = (execRes: SqlExecutionResponse, activeDb = db): ValidationContext => ({
    studentSql: execRes.query,
    executionResponse: execRes,
    executeSql: async (sql) => executeSql(sql, activeDb),
    getSchema: async () => getDatabaseSchema(activeDb),
    getTableData: async (tableName) => {
      const res = await executeSql(`SELECT * FROM "${tableName}" LIMIT 20;`, activeDb);
      return res.results?.[0]?.values || [];
    },
  });

  describe('Section 1 & 2: Step-by-Step Mission Playthrough & Solution Validation', () => {
    it('executes all 10 missions sequentially in order and passes all validation rules', async () => {
      expect(SUPERMARKET_MISSIONS).toHaveLength(10);

      for (let i = 0; i < SUPERMARKET_MISSIONS.length; i++) {
        const mission = SUPERMARKET_MISSIONS[i];
        expect(mission.order).toBe(i + 1);

        const execRes = await executeSql(mission.sampleSolution);
        expect(execRes.success, `Mission ${mission.order} (${mission.title}) sample solution failed execution`).toBe(true);

        const ctx = createValidationContext(execRes);
        const feedback = await ValidationEngine.validate(mission.validationRules, ctx);
        expect(feedback.passed, `Mission ${mission.order} failed validation: ${feedback.message}`).toBe(true);
      }
    });
  });

  describe('Section 3: Intentional Error Handling & Diagnostic Feedback', () => {
    it('Mission 1 (CREATE TABLE): detects syntax errors, wrong table names, and missing columns', async () => {
      const m1 = SUPERMARKET_MISSIONS[0];

      // 1. Syntax error
      const syntaxErrorQuery = 'CREATE TABLE store_branches (branch_id INT';
      const syntaxRes = await executeSql(syntaxErrorQuery);
      expect(syntaxRes.success).toBe(false);
      expect(syntaxRes.hint).toMatch(/syntax error|incomplete|parenthes/i);

      // 2. Wrong table name
      const wrongTableDb = await createFreshDb();
      const wrongTableRes = await executeSql('CREATE TABLE wrong_branches (branch_id INTEGER PRIMARY KEY);', wrongTableDb);
      const wrongTableFeedback = await ValidationEngine.validate(m1.validationRules, createValidationContext(wrongTableRes, wrongTableDb));
      expect(wrongTableFeedback.passed).toBe(false);
      expect(wrongTableFeedback.message).toContain("Table 'store_branches' does not exist");

      // 3. Missing column
      const missingColDb = await createFreshDb();
      const missingColRes = await executeSql('CREATE TABLE store_branches (branch_id INTEGER PRIMARY KEY, branch_name TEXT, city TEXT);', missingColDb);
      const missingColFeedback = await ValidationEngine.validate(m1.validationRules, createValidationContext(missingColRes, missingColDb));
      expect(missingColFeedback.passed).toBe(false);
      expect(missingColFeedback.message).toContain("column 'opening_year' is missing");
    });

    it('Mission 2 (CREATE TABLE departments): detects missing column definitions', async () => {
      const m2 = SUPERMARKET_MISSIONS[1];
      const partialDb = await createFreshDb();
      const partialRes = await executeSql('CREATE TABLE departments (department_id INTEGER PRIMARY KEY);', partialDb);
      const feedback = await ValidationEngine.validate(m2.validationRules, createValidationContext(partialRes, partialDb));
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain("column 'department_name' is missing");
    });

    it('Mission 3 (INSERT INTO suppliers): detects non-existent column, non-existent table, and wrong data', async () => {
      const m3 = SUPERMARKET_MISSIONS[2];

      // 1. Non-existent column
      const badColRes = await executeSql("INSERT INTO suppliers (company_name, non_existent_col) VALUES ('FreshRoots Organics', 'test');");
      expect(badColRes.success).toBe(false);
      expect(badColRes.hint).toContain('Column "non_existent_col" does not exist');

      // 2. Non-existent table
      const badTableRes = await executeSql("INSERT INTO wrong_suppliers (company_name) VALUES ('FreshRoots Organics');");
      expect(badTableRes.success).toBe(false);
      expect(badTableRes.hint).toContain('Table "wrong_suppliers" was not found');

      // 3. Column/value mismatch
      const mismatchRes = await executeSql("INSERT INTO suppliers (company_name) VALUES ('FreshRoots', 'ExtraVal');");
      expect(mismatchRes.success).toBe(false);
      expect(mismatchRes.hint).toContain('Column and value count mismatch');

      // 4. Incorrect data inserted
      const wrongDataDb = await createFreshDb();
      const wrongDataRes = await executeSql("INSERT INTO suppliers (company_name, contact_name, phone, city) VALUES ('Wrong Brand', 'Rao', '123', 'City');", wrongDataDb);
      const feedback = await ValidationEngine.validate(m3.validationRules, createValidationContext(wrongDataRes, wrongDataDb));
      expect(feedback.passed).toBe(false);
      expect(feedback.details?.expected).toContain("company_name LIKE '%FreshRoots%'");
    });

    it('Mission 4 (SELECT low stock): detects aggregate function in WHERE and incorrect filter predicate', async () => {
      const m4 = SUPERMARKET_MISSIONS[3];

      // 1. Aggregate misuse in WHERE
      const aggWhereRes = await executeSql('SELECT product_id FROM inventory WHERE SUM(quantity_on_hand) < 10;');
      expect(aggWhereRes.success).toBe(false);
      expect(aggWhereRes.hint).toContain('Misuse of aggregate function');

      // 2. Inverted/incorrect WHERE filter
      const wrongFilterRes = await executeSql('SELECT product_id, quantity_on_hand, reorder_level FROM inventory WHERE quantity_on_hand > reorder_level;');
      const feedback = await ValidationEngine.validate(m4.validationRules, createValidationContext(wrongFilterRes));
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('record(s)');
    });

    it('Mission 5 (UPDATE price): detects non-existent column and incorrect target row', async () => {
      const m5 = SUPERMARKET_MISSIONS[4];

      // 1. Non-existent column
      const badColRes = await executeSql('UPDATE products SET invalid_price = 480 WHERE product_id = 1;');
      expect(badColRes.success).toBe(false);
      expect(badColRes.hint).toContain('Column "invalid_price" does not exist');

      // 2. Wrong WHERE filter (wrong product updated)
      const wrongRowDb = await createFreshDb();
      const wrongRowRes = await executeSql('UPDATE products SET unit_price = 480 WHERE product_id = 999;', wrongRowDb);
      const feedback = await ValidationEngine.validate(m5.validationRules, createValidationContext(wrongRowRes, wrongRowDb));
      expect(feedback.passed).toBe(false);
    });

    it('Mission 6 (DELETE discontinued): detects wrong table and incomplete purge', async () => {
      const m6 = SUPERMARKET_MISSIONS[5];

      // 1. Wrong table
      const badTableRes = await executeSql("DELETE FROM discontinued_products WHERE status = 'Discontinued';");
      expect(badTableRes.success).toBe(false);
      expect(badTableRes.hint).toContain('Table "discontinued_products" was not found');

      // 2. Incomplete deletion (wrong status filtered)
      const wrongDelDb = await createFreshDb();
      const wrongDelRes = await executeSql("DELETE FROM products WHERE status = 'Unknown';", wrongDelDb);
      const feedback = await ValidationEngine.validate(m6.validationRules, createValidationContext(wrongDelRes, wrongDelDb));
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain("discontinued");
    });

    it('Mission 7 (JOIN product & inventory): detects missing join or wrong product_id filter', async () => {
      const m7 = SUPERMARKET_MISSIONS[6];

      // Wrong product ID
      const wrongFilterRes = await executeSql('SELECT p.product_name, i.quantity_on_hand, i.aisle_number FROM products p JOIN inventory i ON p.product_id = i.product_id WHERE p.product_id = 1;');
      const feedback = await ValidationEngine.validate(m7.validationRules, createValidationContext(wrongFilterRes));
      expect(feedback.passed).toBe(false);
    });

    it('Mission 8 (Multi-table JOIN): detects missing ORDER BY clause when orderSensitive is true', async () => {
      const m8 = SUPERMARKET_MISSIONS[7];

      // Query without proper ORDER BY
      const unorderedRes = await executeSql('SELECT c.customer_id, c.first_name, o.order_id, oi.product_id, oi.quantity FROM customers c JOIN orders o ON c.customer_id = o.customer_id JOIN order_items oi ON o.order_id = oi.order_id ORDER BY c.customer_id DESC;');
      const feedback = await ValidationEngine.validate(m8.validationRules, createValidationContext(unorderedRes));
      expect(feedback.passed).toBe(false);
      expect(feedback.message).toContain('ORDER BY');
    });

    it('Mission 9 (GROUP BY & HAVING): catches aggregate in WHERE and incorrect HAVING threshold', async () => {
      const m9 = SUPERMARKET_MISSIONS[8];

      // 1. Aggregate in WHERE clause
      const aggWhereRes = await executeSql(`
        SELECT c.category_name, SUM(oi.quantity * oi.unit_price) AS total_revenue
        FROM categories c
        JOIN products p ON c.category_id = p.category_id
        JOIN order_items oi ON p.product_id = oi.product_id
        WHERE SUM(oi.quantity * oi.unit_price) > 1000
        GROUP BY c.category_name;
      `);
      expect(aggWhereRes.success).toBe(false);
      expect(aggWhereRes.hint).toContain('Misuse of aggregate function');

      // 2. Incorrect HAVING threshold
      const wrongHavingRes = await executeSql(`
        SELECT c.category_name, SUM(oi.quantity * oi.unit_price) AS total_revenue
        FROM categories c
        JOIN products p ON c.category_id = p.category_id
        JOIN order_items oi ON p.product_id = oi.product_id
        GROUP BY c.category_name
        HAVING total_revenue > 10000
        ORDER BY total_revenue DESC;
      `);
      const feedback = await ValidationEngine.validate(m9.validationRules, createValidationContext(wrongHavingRes));
      expect(feedback.passed).toBe(false);
    });

    it('Mission 10 (Best-Selling Products): catches missing LIMIT and inverted sort order', async () => {
      const m10 = SUPERMARKET_MISSIONS[9];

      // 1. Missing LIMIT 3 (returns all rows)
      const noLimitRes = await executeSql(`
        SELECT p.product_name, SUM(oi.quantity) AS units_sold
        FROM products p
        JOIN order_items oi ON p.product_id = oi.product_id
        GROUP BY p.product_name
        ORDER BY units_sold DESC;
      `);
      const noLimitFeedback = await ValidationEngine.validate(m10.validationRules, createValidationContext(noLimitRes));
      expect(noLimitFeedback.passed).toBe(false);
      expect(noLimitFeedback.message).toContain('Returned');

      // 2. Inverted ORDER BY (ASC instead of DESC)
      const ascRes = await executeSql(`
        SELECT p.product_name, SUM(oi.quantity) AS units_sold
        FROM products p
        JOIN order_items oi ON p.product_id = oi.product_id
        GROUP BY p.product_name
        ORDER BY units_sold ASC
        LIMIT 3;
      `);
      const ascFeedback = await ValidationEngine.validate(m10.validationRules, createValidationContext(ascRes));
      expect(ascFeedback.passed).toBe(false);
    });
  });

  describe('Section 4: XP Calculations & Gamification Achievements Verification', () => {
    it('verifies XP values for all 10 Supermarket missions and level progression', () => {
      const expectedXps = [100, 100, 120, 130, 140, 150, 160, 180, 200, 250];

      let cumulativeXp = 0;
      SUPERMARKET_MISSIONS.forEach((mission, idx) => {
        expect(mission.xpReward).toBe(expectedXps[idx]);
        cumulativeXp += mission.xpReward;
      });

      // Total XP from all 10 Supermarket missions
      expect(cumulativeXp).toBe(1530);

      // Verify level progression calculations
      const levelProgress = calculateLevel(cumulativeXp);
      expect(levelProgress.level).toBe(7); // 1530 / 250 = 6 + 1 = Level 7
      expect(levelProgress.currentLevelXp).toBe(30);
      expect(levelProgress.progressPercent).toBe(12);
    });

    it('verifies key gamification achievements exist with proper metadata and XP', () => {
      const achievementKeys = [
        'supermarket_master',
        'sql_novice',
        'bug_hunter',
        'table_architect',
        'supply_partner',
        'data_investigator',
        'join_master',
        'aggregate_wizard',
        'first_query',
      ];

      achievementKeys.forEach((key) => {
        const ach = ALL_ACHIEVEMENTS.find((a) => a.id === key);
        expect(ach, `Achievement ${key} must be defined in ALL_ACHIEVEMENTS`).toBeDefined();
        expect(ach?.xpReward).toBeGreaterThan(0);
        expect(ach?.title).toBeTruthy();
        expect(ach?.description).toBeTruthy();
      });

      const smMaster = ALL_ACHIEVEMENTS.find((a) => a.id === 'supermarket_master');
      expect(smMaster?.xpReward).toBe(300);

      const sqlNovice = ALL_ACHIEVEMENTS.find((a) => a.id === 'sql_novice');
      expect(sqlNovice?.xpReward).toBe(100);

      const bugHunter = ALL_ACHIEVEMENTS.find((a) => a.id === 'bug_hunter');
      expect(bugHunter?.xpReward).toBe(120);
    });

    it('unlockAchievement awards the configured xpReward from ALL_ACHIEVEMENTS', async () => {
      useUserStore.setState({
        profile: {
          id: 'test_user',
          username: 'Test User',
          role: 'Junior Database Executive',
          xp: 0,
          level: 1,
          streakDays: 1,
          lastActiveDate: '2024-01-01',
          completedWorlds: [],
          achievements: [],
          totalQueriesRun: 0,
          successfulQueriesRun: 0,
        },
      });

      // Unlock supermarket_master (300 XP)
      const unlocked = await useUserStore.getState().unlockAchievement('supermarket_master');
      expect(unlocked).toBe(true);
      expect(useUserStore.getState().profile.xp).toBe(300);
      expect(useUserStore.getState().profile.achievements).toContain('supermarket_master');

      // Duplicate unlock does not re-award XP
      const duplicateUnlocked = await useUserStore.getState().unlockAchievement('supermarket_master');
      expect(duplicateUnlocked).toBe(false);
      expect(useUserStore.getState().profile.xp).toBe(300);

      // Unlock bug_hunter (120 XP)
      await useUserStore.getState().unlockAchievement('bug_hunter');
      expect(useUserStore.getState().profile.xp).toBe(420);
    });
  });
});
