import { describe, it, expect, beforeAll } from 'vitest';
import initSqlJs from 'sql.js';
import { airportWorld } from '../src/modules/worlds/airport';
import { warehouseWorld } from '../src/modules/worlds/warehouse';
import { hospitalWorld } from '../src/modules/worlds/hospital';
import { bankWorld } from '../src/modules/worlds/bank';
import { ValidationEngine } from '../src/modules/validation/validation-engine';
import { ValidationContext } from '../src/types/validation';
import { SqlExecutionResponse, SqlDatabaseSchema } from '../src/types/sql';
import { WorldDefinition } from '../src/types/world';

function createWorldPlaythroughSuite(world: WorldDefinition) {
  describe(`World: ${world.name} (${world.id})`, () => {
    let db: any;

    beforeAll(async () => {
      const SQL = await initSqlJs();
      db = new SQL.Database();
      db.exec('PRAGMA foreign_keys = ON;');
      if (world.initialSchemaSql) {
        db.exec(world.initialSchemaSql);
      }
      if (world.initialDatasetSql) {
        db.exec(world.initialDatasetSql);
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

    it('should have isAvailable set to true and at least 6 missions', () => {
      expect(world.isAvailable).toBe(true);
      expect(world.missions.length).toBeGreaterThanOrEqual(6);
      expect(world.initialSchemaSql.length).toBeGreaterThan(0);
      expect(world.initialDatasetSql.length).toBeGreaterThan(0);
    });

    world.missions.forEach((mission) => {
      it(`Mission ${mission.order}: ${mission.title} should validate sampleSolution`, async () => {
        const sql = mission.sampleSolution;
        const execRes = await executeSql(sql);
        expect(execRes.success, `Query execution failed: ${execRes.error}`).toBe(true);

        const ctx = getContext(sql, execRes);
        const feedback = await ValidationEngine.validate(mission.validationRules, ctx);
        expect(feedback.passed, `Validation failed for ${mission.title}: ${feedback.message} - ${feedback.details?.hint || ''}`).toBe(true);
      });
    });

    it('should have valid business report queries', async () => {
      expect(world.reportConfig.metrics.length).toBeGreaterThan(0);
      for (const metric of world.reportConfig.metrics) {
        const res = await executeSql(metric.query);
        expect(res.success, `Metric query failed for ${metric.title}: ${res.error}`).toBe(true);
      }
    });
  });
}

createWorldPlaythroughSuite(airportWorld);
createWorldPlaythroughSuite(warehouseWorld);
createWorldPlaythroughSuite(hospitalWorld);
createWorldPlaythroughSuite(bankWorld);
