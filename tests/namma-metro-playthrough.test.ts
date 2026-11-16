import { describe, it, expect, beforeAll } from 'vitest';
import initSqlJs from 'sql.js';
import { metroWorld } from '../src/modules/worlds/metro';
import { ValidationEngine } from '../src/modules/validation/validation-engine';
import { ValidationContext } from '../src/types/validation';
import { SqlExecutionResponse, SqlDatabaseSchema } from '../src/types/sql';

describe('World 2: Namma Metro — Transit Command (Full 9-Mission Playthrough)', () => {
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

  it('verifies World Definition metadata for Namma Metro', () => {
    expect(metroWorld.id).toBe('metro');
    expect(metroWorld.name).toBe('Namma Metro — Transit Command');
    expect(metroWorld.difficulty).toBe('Beginner');
    expect(metroWorld.missions.length).toBe(9);
    expect(metroWorld.dbFileName).toBe('metro.db');
  });

  it('Mission 1: Booting the Grid (CREATE TABLE stations)', async () => {
    const mission = metroWorld.missions[0];
    const sql = mission.sampleSolution;
    const execRes = await executeSql(sql);
    expect(execRes.success).toBe(true);

    const context = createContext(sql, execRes);
    const feedback = await ValidationEngine.validate(mission.validationRules, context);
    expect(feedback.passed).toBe(true);

    const schema = getDatabaseSchema();
    expect(schema['stations']).toBeDefined();
    expect(schema['stations'].columns.map((c) => c.name)).toContain('station_id');
    expect(schema['stations'].columns.map((c) => c.name)).toContain('line_color');
  });

  it('Mission 2: Smart Card Vault (CREATE TABLE smart_cards)', async () => {
    const mission = metroWorld.missions[1];
    const sql = mission.sampleSolution;
    const execRes = await executeSql(sql);
    expect(execRes.success).toBe(true);

    const context = createContext(sql, execRes);
    const feedback = await ValidationEngine.validate(mission.validationRules, context);
    expect(feedback.passed).toBe(true);

    const schema = getDatabaseSchema();
    expect(schema['smart_cards']).toBeDefined();
  });

  it('Mission 3: Commissioning the Hubs (INSERT 8 stations)', async () => {
    const mission = metroWorld.missions[2];
    const sql = mission.sampleSolution;
    const execRes = await executeSql(sql);
    expect(execRes.success).toBe(true);

    const context = createContext(sql, execRes);
    const feedback = await ValidationEngine.validate(mission.validationRules, context);
    expect(feedback.passed).toBe(true);

    const countRes = db.exec('SELECT COUNT(*) FROM stations;');
    expect(countRes[0].values[0][0]).toBe(8);
  });

  it('Mission 4: Network Recon (SELECT, AS, ORDER BY DESC)', async () => {
    const mission = metroWorld.missions[3];
    const sql = mission.sampleSolution;
    const execRes = await executeSql(sql);
    expect(execRes.success).toBe(true);

    const context = createContext(sql, execRes);
    const feedback = await ValidationEngine.validate(mission.validationRules, context);
    expect(feedback.passed).toBe(true);

    expect(execRes.results[0].columns).toEqual(['hub_name', 'line_color', 'commuters']);
    // Highest footfall (Majestic) must be first
    expect(execRes.results[0].values[0][0]).toBe('Majestic');
  });

  it('Mission 5: Corridor & Fare Audit (WHERE IN and BETWEEN)', async () => {
    const mission = metroWorld.missions[4];
    const sql = mission.sampleSolution;
    const execRes = await executeSql(sql);
    expect(execRes.success).toBe(true);

    const context = createContext(sql, execRes);
    const feedback = await ValidationEngine.validate(mission.validationRules, context);
    expect(feedback.passed).toBe(true);
  });

  it('Mission 6: Feeder Parking & Name Scan (LIKE, IS NULL, OR)', async () => {
    const mission = metroWorld.missions[5];
    const sql = mission.sampleSolution;
    const execRes = await executeSql(sql);
    expect(execRes.success).toBe(true);

    const context = createContext(sql, execRes);
    const feedback = await ValidationEngine.validate(mission.validationRules, context);
    expect(feedback.passed).toBe(true);
  });

  it('Mission 7: Rush-Hour Fare & Status Update (UPDATE Electronic City)', async () => {
    const mission = metroWorld.missions[6];
    const sql = mission.sampleSolution;
    const execRes = await executeSql(sql);
    expect(execRes.success).toBe(true);

    const context = createContext(sql, execRes);
    const feedback = await ValidationEngine.validate(mission.validationRules, context);
    expect(feedback.passed).toBe(true);

    const checkRes = db.exec("SELECT status, base_fare_inr FROM stations WHERE station_name = 'Electronic City';");
    expect(checkRes[0].values[0][0]).toBe('Operational');
    expect(checkRes[0].values[0][1]).toBe(45);
  });

  it('Mission 8: Purging Ghost Stations (DELETE FROM stations WHERE status = "Closed")', async () => {
    const mission = metroWorld.missions[7];
    const sql = mission.sampleSolution;
    const execRes = await executeSql(sql);
    expect(execRes.success).toBe(true);

    const context = createContext(sql, execRes);
    const feedback = await ValidationEngine.validate(mission.validationRules, context);
    expect(feedback.passed).toBe(true);

    const countRes = db.exec('SELECT COUNT(*) FROM stations;');
    expect(countRes[0].values[0][0]).toBe(7);
  });

  it('Mission 9: End-of-Day Executive Telemetry (COUNT, SUM, AVG, MIN, MAX, ROUND)', async () => {
    const mission = metroWorld.missions[8];
    const sql = mission.sampleSolution;
    const execRes = await executeSql(sql);
    expect(execRes.success).toBe(true);

    const context = createContext(sql, execRes);
    const feedback = await ValidationEngine.validate(mission.validationRules, context);
    expect(feedback.passed).toBe(true);

    const cols = execRes.results[0].columns;
    expect(cols).toEqual(['total_stations', 'total_footfall', 'avg_fare', 'lowest_fare', 'peak_station_footfall']);
    const vals = execRes.results[0].values[0];
    expect(vals[0]).toBe(7); // total_stations after deletion
    expect(vals[4]).toBe(85000); // peak_station_footfall (Majestic)
  });
});
