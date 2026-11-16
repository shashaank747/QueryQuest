import { describe, it, expect, beforeAll } from 'vitest';
import initSqlJs from 'sql.js';
import { SUPERMARKET_MISSIONS } from '../src/modules/worlds/supermarket/missions';
import { SUPERMARKET_BASE_SCHEMA } from '../src/modules/worlds/supermarket/schema';
import { SUPERMARKET_FULL_SEED, SUPERMARKET_CATALOG_AND_SALES_SEED } from '../src/modules/worlds/supermarket/dataset';
import { ValidationEngine } from '../src/modules/validation/validation-engine';
import { ValidationContext } from '../src/types/validation';
import { SqlExecutionResponse, SqlDatabaseSchema } from '../src/types/sql';

describe('World 1: Supermarket Operations Full Playthrough Simulation', () => {
  let db: any;

  beforeAll(async () => {
    const SQL = await initSqlJs();
    db = new SQL.Database();
    db.exec('PRAGMA foreign_keys = ON;');
    db.exec(SUPERMARKET_BASE_SCHEMA);
    db.exec(SUPERMARKET_FULL_SEED);
    db.exec(SUPERMARKET_CATALOG_AND_SALES_SEED);
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
        rowsAffected: 0,
        executionTimeMs: 1,
      };
    } catch (err: any) {
      return {
        success: false,
        query: sql,
        action: 'OTHER',
        rowsAffected: 0,
        executionTimeMs: 0,
        error: err.message,
      };
    }
  };

  for (let i = 0; i < SUPERMARKET_MISSIONS.length; i++) {
    const mission = SUPERMARKET_MISSIONS[i];
    it(`Mission ${mission.order}: ${mission.title} passes validation with sample solution`, async () => {
      const solution = mission.sampleSolution;
      // Execute the student's solution
      const execRes = await executeSql(solution);

      const context: ValidationContext = {
        studentSql: solution,
        executionResponse: execRes,
        executeSql: async (sql) => executeSql(sql),
        getSchema: async () => getDatabaseSchema(),
        getTableData: async (tableName) => {
          const res = await executeSql(`SELECT * FROM "${tableName}" LIMIT 20;`);
          return res.results?.[0]?.values || [];
        },
      };

      const feedback = await ValidationEngine.validate(mission.validationRules, context);
      expect(feedback.passed, `Mission ${mission.order} (${mission.title}) failed validation: ${feedback.message} - ${feedback.details?.hint || ''}`).toBe(true);
    });
  }
});
