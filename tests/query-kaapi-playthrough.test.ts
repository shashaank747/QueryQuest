import { describe, it, expect, beforeAll } from 'vitest';
import initSqlJs from 'sql.js';
import { kaapiWorld } from '../src/modules/worlds/kaapi';
import { ValidationEngine } from '../src/modules/validation/validation-engine';
import { ValidationContext } from '../src/types/validation';
import { SqlExecutionResponse, SqlDatabaseSchema } from '../src/types/sql';

describe('World 3: Query & Kaapi — Tiffin & Filter Coffee (Full 9-Mission Playthrough)', () => {
  let db: any;

  beforeAll(async () => {
    const SQL = await initSqlJs();
    db = new SQL.Database();
    db.exec('PRAGMA foreign_keys = ON;');
    if (kaapiWorld.initialSchemaSql) {
      db.exec(kaapiWorld.initialSchemaSql);
    }
    if (kaapiWorld.initialDatasetSql) {
      db.exec(kaapiWorld.initialDatasetSql);
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
    const startTime = performance.now();
    try {
      const results = db.exec(sql);
      const executionTimeMs = performance.now() - startTime;
      return {
        query: sql,
        results: results.map((r: any) => ({
          columns: r.columns,
          values: r.values,
        })),
        executionTimeMs,
        affectedRows: db.getRowsModified(),
        success: true,
      };
    } catch (err: any) {
      const executionTimeMs = performance.now() - startTime;
      return {
        query: sql,
        results: [],
        executionTimeMs,
        affectedRows: 0,
        success: false,
        error: err.message,
      };
    }
  };

  const createContext = (studentSql: string, executionResponse: SqlExecutionResponse): ValidationContext => ({
    studentSql,
    executionResponse,
    executeSql,
    getSchema: async () => getDatabaseSchema(),
    getTableData: async (tableName: string) => {
      const res = db.exec(`SELECT * FROM "${tableName}";`);
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

  it('verifies World Definition metadata for Query & Kaapi', () => {
    expect(kaapiWorld.id).toBe('kaapi');
    expect(kaapiWorld.name).toBe('Query & Kaapi — Tiffin & Filter Coffee');
    expect(kaapiWorld.difficulty).toBe('Beginner');
    expect(kaapiWorld.missions.length).toBe(9);
    expect(kaapiWorld.dbFileName).toBe('kaapi.db');
  });

  it('Mission 1: Booting the Menu Board (CREATE TABLE menu_items)', async () => {
    const mission = kaapiWorld.missions[0];
    const sql = mission.sampleSolution;
    const execRes = await executeSql(sql);
    expect(execRes.success).toBe(true);

    const context = createContext(sql, execRes);
    const feedback = await ValidationEngine.validate(mission.validationRules, context);
    expect(feedback.passed).toBe(true);

    const schema = getDatabaseSchema();
    expect(schema['menu_items']).toBeDefined();
    expect(schema['menu_items'].columns.map((c) => c.name)).toContain('item_id');
    expect(schema['menu_items'].columns.map((c) => c.name)).toContain('spice_level');
  });

  it('Mission 2: Davara Loyalty Pass Vault (CREATE TABLE kaapi_passes)', async () => {
    const mission = kaapiWorld.missions[1];
    const sql = mission.sampleSolution;
    const execRes = await executeSql(sql);
    expect(execRes.success).toBe(true);

    const context = createContext(sql, execRes);
    const feedback = await ValidationEngine.validate(mission.validationRules, context);
    expect(feedback.passed).toBe(true);

    const schema = getDatabaseSchema();
    expect(schema['kaapi_passes']).toBeDefined();
  });

  it('Mission 3: Stocking the Morning Counter (INSERT 8 items)', async () => {
    const mission = kaapiWorld.missions[2];
    const sql = mission.sampleSolution;
    const execRes = await executeSql(sql);
    expect(execRes.success).toBe(true);

    const context = createContext(sql, execRes);
    const feedback = await ValidationEngine.validate(mission.validationRules, context);
    expect(feedback.passed).toBe(true);

    const countRes = db.exec('SELECT COUNT(*) FROM menu_items;');
    expect(countRes[0].values[0][0]).toBe(8);
  });

  it('Mission 4: Overhead Menu Board (SELECT, AS, ORDER BY DESC)', async () => {
    const mission = kaapiWorld.missions[3];
    const sql = mission.sampleSolution;
    const execRes = await executeSql(sql);
    expect(execRes.success).toBe(true);

    const context = createContext(sql, execRes);
    const feedback = await ValidationEngine.validate(mission.validationRules, context);
    expect(feedback.passed).toBe(true);

    expect(execRes.results[0].columns).toEqual(['dish_name', 'category', 'plates_served']);
    // Highest ordered item (Degree Filter Kaapi with 210 orders) must be first
    expect(execRes.results[0].values[0][0]).toBe('Degree Filter Kaapi');
  });

  it('Mission 5: Express Breakfast & Kaapi Filter (WHERE IN and BETWEEN)', async () => {
    const mission = kaapiWorld.missions[4];
    const sql = mission.sampleSolution;
    const execRes = await executeSql(sql);
    expect(execRes.success).toBe(true);

    const context = createContext(sql, execRes);
    const feedback = await ValidationEngine.validate(mission.validationRules, context);
    expect(feedback.passed).toBe(true);
  });

  it('Mission 6: Dosa Lineup & Calorie Audit (LIKE, IS NULL, OR)', async () => {
    const mission = kaapiWorld.missions[5];
    const sql = mission.sampleSolution;
    const execRes = await executeSql(sql);
    expect(execRes.success).toBe(true);

    const context = createContext(sql, execRes);
    const feedback = await ValidationEngine.validate(mission.validationRules, context);
    expect(feedback.passed).toBe(true);
  });

  it('Mission 7: Launching Karupatti Kaapi (UPDATE Karupatti Kaapi)', async () => {
    const mission = kaapiWorld.missions[6];
    const sql = mission.sampleSolution;
    const execRes = await executeSql(sql);
    expect(execRes.success).toBe(true);

    const context = createContext(sql, execRes);
    const feedback = await ValidationEngine.validate(mission.validationRules, context);
    expect(feedback.passed).toBe(true);

    const checkRes = db.exec("SELECT status, price_inr FROM menu_items WHERE item_name = 'Karupatti Kaapi';");
    expect(checkRes[0].values[0][0]).toBe('Available');
    expect(checkRes[0].values[0][1]).toBe(65);
  });

  it('Mission 8: Clearing Off-Menu Items (DELETE FROM menu_items WHERE status = "Discontinued")', async () => {
    const mission = kaapiWorld.missions[7];
    const sql = mission.sampleSolution;
    const execRes = await executeSql(sql);
    expect(execRes.success).toBe(true);

    const context = createContext(sql, execRes);
    const feedback = await ValidationEngine.validate(mission.validationRules, context);
    expect(feedback.passed).toBe(true);

    const countRes = db.exec('SELECT COUNT(*) FROM menu_items;');
    expect(countRes[0].values[0][0]).toBe(7);
  });

  it('Mission 9: Morning Shift Closing Register (COUNT, SUM, AVG, MIN, MAX, ROUND)', async () => {
    const mission = kaapiWorld.missions[8];
    const sql = mission.sampleSolution;
    const execRes = await executeSql(sql);
    expect(execRes.success).toBe(true);

    const context = createContext(sql, execRes);
    const feedback = await ValidationEngine.validate(mission.validationRules, context);
    expect(feedback.passed).toBe(true);

    const cols = execRes.results[0].columns;
    expect(cols).toEqual(['total_dishes', 'total_orders_served', 'avg_dish_price', 'lowest_price_inr', 'top_dish_orders']);
    const vals = execRes.results[0].values[0];
    expect(vals[0]).toBe(7); // total_dishes after deletion
    expect(vals[4]).toBe(210); // top_dish_orders (Degree Filter Kaapi)
  });
});
