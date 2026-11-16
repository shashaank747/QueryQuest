import { describe, it, expect, beforeEach } from 'vitest';
import initSqlJs from 'sql.js';
import { warehouseWorld } from '../src/modules/worlds/warehouse';
import { WAREHOUSE_MISSIONS } from '../src/modules/worlds/warehouse/missions';
import { WAREHOUSE_BASE_SCHEMA } from '../src/modules/worlds/warehouse/schema';
import { WAREHOUSE_INITIAL_DATASET } from '../src/modules/worlds/warehouse/dataset';
import { ValidationEngine } from '../src/modules/validation/validation-engine';
import { generateSqlDiagnostic } from '../src/modules/sql-engine/diagnostics';
import { calculateLevel, ALL_ACHIEVEMENTS } from '../src/modules/gamification/achievements';
import { ValidationContext } from '../src/types/validation';
import { SqlExecutionResponse, SqlDatabaseSchema } from '../src/types/sql';

describe('World 3: Warehouse Management Playthrough & Audit', () => {
  let db: any;

  const initFreshDb = async () => {
    const SQL = await initSqlJs();
    db = new SQL.Database();
    db.exec('PRAGMA foreign_keys = ON;');
    db.exec(WAREHOUSE_BASE_SCHEMA);
    db.exec(WAREHOUSE_INITIAL_DATASET);
  };

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
        executionTimeMs: 0,
        error: err.message,
      };
    }
  };

  const createValidationContext = (studentSql: string, execRes: SqlExecutionResponse): ValidationContext => ({
    studentSql,
    executionResponse: execRes,
    executeSql: async (sql) => executeSql(sql),
    getSchema: async () => getDatabaseSchema(),
    getTableData: async (tableName) => {
      const res = await executeSql(`SELECT * FROM "${tableName}" LIMIT 20;`);
      return res.results?.[0]?.values || [];
    },
  });

  describe('1. Schema & Dataset Integrity', () => {
    beforeEach(async () => {
      await initFreshDb();
    });

    it('should initialize all required tables and verify counts', () => {
      const schema = getDatabaseSchema();
      expect(schema['warehouses']).toBeDefined();
      expect(schema['zones']).toBeDefined();
      expect(schema['products']).toBeDefined();
      expect(schema['inventory_bins']).toBeDefined();
      expect(schema['shipments']).toBeDefined();

      const whCount = db.exec('SELECT COUNT(*) FROM warehouses;')[0].values[0][0];
      const zoneCount = db.exec('SELECT COUNT(*) FROM zones;')[0].values[0][0];
      const prodCount = db.exec('SELECT COUNT(*) FROM products;')[0].values[0][0];
      const binCount = db.exec('SELECT COUNT(*) FROM inventory_bins;')[0].values[0][0];
      const shipCount = db.exec('SELECT COUNT(*) FROM shipments;')[0].values[0][0];

      expect(whCount).toBe(2);
      expect(zoneCount).toBe(4);
      expect(prodCount).toBe(6);
      expect(binCount).toBe(7);
      expect(shipCount).toBe(6);
    });

    it('should enforce foreign key constraint when invalid warehouse_id is inserted into zones', () => {
      expect(() => {
        db.exec("INSERT INTO zones (zone_id, warehouse_id, zone_name, temp_controlled) VALUES (99, 999, 'Invalid Zone', 0);");
      }).toThrow(/FOREIGN KEY constraint failed/i);
    });

    it('should enforce unique constraint on product SKU', () => {
      expect(() => {
        db.exec("INSERT INTO products (sku, product_name, category, unit_weight_kg) VALUES ('SKU-ELEC-101', 'Duplicate SKU', 'Electronics', 5.0);");
      }).toThrow(/UNIQUE constraint failed/i);
    });
  });

  describe('2. Sequential Playthrough of Missions (wh_m1 to wh_m6)', () => {
    beforeEach(async () => {
      await initFreshDb();
    });

    it('should complete all 6 missions sequentially with sample solutions', async () => {
      for (const mission of WAREHOUSE_MISSIONS) {
        const solution = mission.sampleSolution;
        const execRes = await executeSql(solution);
        expect(execRes.success, `Mission ${mission.order} (${mission.id}) query failed: ${execRes.error}`).toBe(true);

        const ctx = createValidationContext(solution, execRes);
        const feedback = await ValidationEngine.validate(mission.validationRules, ctx);
        expect(feedback.passed, `Mission ${mission.order} (${mission.title}) validation failed: ${feedback.message} - ${feedback.details?.hint || ''}`).toBe(true);
      }
    });

    it('wh_m1: queries saturated storage bins with product names', async () => {
      const m1 = WAREHOUSE_MISSIONS[0];
      const execRes = await executeSql(m1.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = createValidationContext(m1.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m1.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const rows = execRes.results![0].values;
      expect(rows.length).toBe(3);
      const binCodes = rows.map(r => r[0]);
      expect(binCodes).toContain('BIN-A-02');
      expect(binCodes).toContain('BIN-B-02');
      expect(binCodes).toContain('BIN-C-01');
    });

    it('wh_m2: traverses 3-table chain for cold chain inventory', async () => {
      const m2 = WAREHOUSE_MISSIONS[1];
      const execRes = await executeSql(m2.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = createValidationContext(m2.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m2.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const rows = execRes.results![0].values;
      expect(rows.length).toBe(2);
      expect(rows[0][2]).toBe('BIN-C-01');
      expect(rows[0][3]).toBe(60);
      expect(rows[1][2]).toBe('BIN-C-02');
      expect(rows[1][3]).toBe(35);
    });

    it('wh_m3: warehouse zone distribution with LEFT JOIN', async () => {
      const m3 = WAREHOUSE_MISSIONS[2];
      const execRes = await executeSql(m3.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = createValidationContext(m3.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m3.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const rows = execRes.results![0].values;
      expect(rows.length).toBe(4);
    });

    it('wh_m4: categorizes storage bin fill levels with CASE WHEN', async () => {
      const m4 = WAREHOUSE_MISSIONS[3];
      const execRes = await executeSql(m4.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = createValidationContext(m4.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m4.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const rows = execRes.results![0].values;
      expect(rows.length).toBe(7);
      const fullBins = rows.filter(r => r[3] === 'Full');
      expect(fullBins.length).toBe(3);
    });

    it('wh_m5: aggregates carrier freight volume with HAVING filter and order', async () => {
      const m5 = WAREHOUSE_MISSIONS[4];
      const execRes = await executeSql(m5.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = createValidationContext(m5.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m5.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const rows = execRes.results![0].values;
      expect(rows.length).toBe(3);
      expect(rows[0]).toEqual(['TCI Freight', 2, 44]);
      expect(rows[1]).toEqual(['Delhivery Freight', 2, 33]);
      expect(rows[2]).toEqual(['BlueDart Express', 2, 20]);
    });

    it('wh_m6: reconciles zone capacity with multi-table JOIN and HAVING', async () => {
      const m6 = WAREHOUSE_MISSIONS[5];
      const execRes = await executeSql(m6.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = createValidationContext(m6.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m6.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const rows = execRes.results![0].values;
      expect(rows.length).toBe(3);
      expect(rows[0]).toEqual(['Zone B - High-Density Racks', 320]);
    });
  });

  describe('3. Intentional Error & Diagnostic Testing', () => {
    beforeEach(async () => {
      await initFreshDb();
    });

    describe('wh_m1 Errors & Diagnostics', () => {
      it('should fail validation when strict greater than is used (> max_capacity)', async () => {
        const strictSql = `SELECT b.bin_code, p.product_name, b.quantity, b.max_capacity
          FROM inventory_bins b
          JOIN products p ON b.product_id = p.product_id
          WHERE b.quantity > b.max_capacity;`;
        const execRes = await executeSql(strictSql);
        expect(execRes.success).toBe(true);
        expect(execRes.results?.length ?? 0).toBe(0);

        const m1 = WAREHOUSE_MISSIONS[0];
        const ctx = createValidationContext(strictSql, execRes);
        const feedback = await ValidationEngine.validate(m1.validationRules, ctx);

        expect(feedback.passed).toBe(false);
        expect(feedback.message).toMatch(/Your query did not return any data rows|Returned 0 record\(s\)/);
      });

      it('should diagnose non-existent column stock_level', () => {
        const badColSql = `SELECT b.bin_code, b.stock_level FROM inventory_bins b JOIN products p ON b.product_id = p.product_id;`;
        try {
          db.exec(badColSql);
          expect.fail('Should fail with no such column');
        } catch (err: any) {
          const diag = generateSqlDiagnostic(err.message, badColSql);
          expect(diag).toMatch(/Column "b\.stock_level" does not exist|Column "stock_level" does not exist/i);
        }
      });

      it('should diagnose missing ON clause syntax error', () => {
        const badSql = `SELECT b.bin_code, p.product_name FROM inventory_bins b JOIN products p WHERE b.quantity >= b.max_capacity;`;
        try {
          db.exec(badSql);
          expect.fail('Should throw syntax error');
        } catch (err: any) {
          const diag = generateSqlDiagnostic(err.message, badSql);
          expect(diag).toMatch(/syntax error|JOIN/i);
        }
      });
    });

    describe('wh_m2 Errors & Diagnostics', () => {
      it('should fail validation when JOIN condition is invalid', async () => {
        const badJoinSql = `SELECT p.sku, p.product_name, b.bin_code, b.quantity, z.zone_name
          FROM products p
          JOIN inventory_bins b ON p.product_id = b.product_id
          JOIN zones z ON b.bin_id = z.zone_id
          WHERE z.temp_controlled = 1
          ORDER BY b.quantity DESC;`;
        const execRes = await executeSql(badJoinSql);
        expect(execRes.success).toBe(true);

        const m2 = WAREHOUSE_MISSIONS[1];
        const ctx = createValidationContext(badJoinSql, execRes);
        const feedback = await ValidationEngine.validate(m2.validationRules, ctx);

        expect(feedback.passed).toBe(false);
      });

      it('should fail validation when filtering for non-cold zones (temp_controlled = 0)', async () => {
        const warmZoneSql = `SELECT p.sku, p.product_name, b.bin_code, b.quantity, z.zone_name
          FROM products p
          JOIN inventory_bins b ON p.product_id = b.product_id
          JOIN zones z ON b.zone_id = z.zone_id
          WHERE z.temp_controlled = 0
          ORDER BY b.quantity DESC;`;
        const execRes = await executeSql(warmZoneSql);
        expect(execRes.success).toBe(true);

        const m2 = WAREHOUSE_MISSIONS[1];
        const ctx = createValidationContext(warmZoneSql, execRes);
        const feedback = await ValidationEngine.validate(m2.validationRules, ctx);

        expect(feedback.passed).toBe(false);
        expect(feedback.message).toContain('Returned 5 record(s), but 2 were expected');
      });

      it('should fail validation when sorting is reversed (ORDER BY b.quantity ASC)', async () => {
        const ascSql = `SELECT p.sku, p.product_name, b.bin_code, b.quantity, z.zone_name
          FROM products p
          JOIN inventory_bins b ON p.product_id = b.product_id
          JOIN zones z ON b.zone_id = z.zone_id
          WHERE z.temp_controlled = 1
          ORDER BY b.quantity ASC;`;
        const execRes = await executeSql(ascSql);
        expect(execRes.success).toBe(true);

        const m2 = WAREHOUSE_MISSIONS[1];
        const ctx = createValidationContext(ascSql, execRes);
        const feedback = await ValidationEngine.validate(m2.validationRules, ctx);

        expect(feedback.passed).toBe(false);
        expect(feedback.message).toContain('Ensure ORDER BY clause is applied');
      });
    });

    describe('wh_m3 Errors & Diagnostics', () => {
      it('should diagnose non-existent column in LEFT JOIN', () => {
        const badColSql = `SELECT w.warehouse_name, w.invalid_col, z.zone_name FROM warehouses w LEFT JOIN zones z ON w.warehouse_id = z.warehouse_id;`;
        try {
          db.exec(badColSql);
          expect.fail('Should fail with no such column');
        } catch (err: any) {
          const diag = generateSqlDiagnostic(err.message, badColSql);
          expect(diag).toMatch(/Column "w\.invalid_col" does not exist|Column "invalid_col" does not exist/i);
        }
      });
    });

    describe('wh_m4 Errors & Diagnostics', () => {
      it('should diagnose syntax error in CASE WHEN without END', () => {
        const badCaseSql = `SELECT bin_code, quantity, max_capacity,
          CASE WHEN quantity >= max_capacity THEN 'Full' ELSE 'Underutilized'
          FROM inventory_bins;`;
        try {
          db.exec(badCaseSql);
          expect.fail('Should fail with syntax error');
        } catch (err: any) {
          const diag = generateSqlDiagnostic(err.message, badCaseSql);
          expect(diag).toMatch(/syntax error/i);
        }
      });

      it('should fail validation when CASE thresholds are inverted', async () => {
        const invertedSql = `SELECT bin_code, quantity, max_capacity,
          CASE
            WHEN quantity >= max_capacity * 0.5 THEN 'Optimal'
            WHEN quantity >= max_capacity THEN 'Full'
            ELSE 'Underutilized'
          END AS fill_level
          FROM inventory_bins;`;
        const execRes = await executeSql(invertedSql);
        expect(execRes.success).toBe(true);

        const m4 = WAREHOUSE_MISSIONS[3];
        const ctx = createValidationContext(invertedSql, execRes);
        const feedback = await ValidationEngine.validate(m4.validationRules, ctx);

        expect(feedback.passed).toBe(false);
      });
    });

    describe('wh_m5 Errors & Diagnostics', () => {
      it('should diagnose misuse of aggregate function in WHERE clause', () => {
        const misuseSql = `SELECT carrier, COUNT(shipment_id) AS total_shipments, SUM(pallet_count) AS total_pallets
          FROM shipments
          WHERE SUM(pallet_count) > 15
          GROUP BY carrier;`;
        try {
          db.exec(misuseSql);
          expect.fail('Should fail with misuse of aggregate');
        } catch (err: any) {
          const diag = generateSqlDiagnostic(err.message, misuseSql);
          expect(diag).toMatch(/Misuse of aggregate function.*cannot be placed directly inside a WHERE clause.*HAVING/i);
        }
      });

      it('should fail validation when HAVING threshold is too high (> 50)', async () => {
        const highHavingSql = `SELECT carrier, COUNT(shipment_id) AS total_shipments, SUM(pallet_count) AS total_pallets
          FROM shipments
          GROUP BY carrier
          HAVING total_pallets > 50
          ORDER BY total_pallets DESC;`;
        const execRes = await executeSql(highHavingSql);
        expect(execRes.success).toBe(true);
        expect(execRes.results?.length ?? 0).toBe(0);

        const m5 = WAREHOUSE_MISSIONS[4];
        const ctx = createValidationContext(highHavingSql, execRes);
        const feedback = await ValidationEngine.validate(m5.validationRules, ctx);

        expect(feedback.passed).toBe(false);
        expect(feedback.message).toMatch(/Your query did not return any data rows|Returned 0 record\(s\)/);
      });

      it('should fail validation when GROUP BY is omitted', async () => {
        const noGroupBySql = `SELECT carrier, COUNT(shipment_id) AS total_shipments, SUM(pallet_count) AS total_pallets
          FROM shipments
          HAVING total_pallets > 15;`;
        const execRes = await executeSql(noGroupBySql);
        expect(execRes.success).toBe(true);
        expect(execRes.results![0].values.length).toBe(1);

        const m5 = WAREHOUSE_MISSIONS[4];
        const ctx = createValidationContext(noGroupBySql, execRes);
        const feedback = await ValidationEngine.validate(m5.validationRules, ctx);

        expect(feedback.passed).toBe(false);
        expect(feedback.message).toContain('Returned 1 record(s), but 3 were expected');
      });

      it('should fail validation when ordering is ascending instead of descending', async () => {
        const ascSql = `SELECT carrier, COUNT(shipment_id) AS total_shipments, SUM(pallet_count) AS total_pallets
          FROM shipments
          GROUP BY carrier
          HAVING total_pallets > 15
          ORDER BY total_pallets ASC;`;
        const execRes = await executeSql(ascSql);
        expect(execRes.success).toBe(true);

        const m5 = WAREHOUSE_MISSIONS[4];
        const ctx = createValidationContext(ascSql, execRes);
        const feedback = await ValidationEngine.validate(m5.validationRules, ctx);

        expect(feedback.passed).toBe(false);
        expect(feedback.message).toContain('Ensure ORDER BY clause is applied');
      });
    });

    describe('wh_m6 Errors & Diagnostics', () => {
      it('should fail validation when HAVING threshold is omitted', async () => {
        const noHavingSql = `SELECT z.zone_name, SUM(b.quantity) AS total_stock
          FROM zones z
          JOIN inventory_bins b ON z.zone_id = b.zone_id
          GROUP BY z.zone_name
          ORDER BY total_stock DESC;`;
        const execRes = await executeSql(noHavingSql);
        expect(execRes.success).toBe(true);

        const m6 = WAREHOUSE_MISSIONS[5];
        const ctx = createValidationContext(noHavingSql, execRes);
        const feedback = await ValidationEngine.validate(m6.validationRules, ctx);

        expect(feedback.passed).toBe(false);
        expect(feedback.message).toContain('Returned 4 record(s), but 3 were expected');
      });
    });
  });

  describe('4. XP Calculations & Achievement Awards', () => {
    it('should have properly defined XP rewards summing to 900 base XP', () => {
      const expectedXps = [100, 120, 130, 140, 160, 250];
      const actualXps = WAREHOUSE_MISSIONS.map(m => m.xpReward);
      expect(actualXps).toEqual(expectedXps);

      const totalBaseXp = actualXps.reduce((acc, xp) => acc + xp, 0);
      expect(totalBaseXp).toBe(900);
    });

    it('should verify all mission badges exist in ALL_ACHIEVEMENTS registry', () => {
      const missionBadgeIds = WAREHOUSE_MISSIONS
        .filter(m => m.badge)
        .map(m => m.badge!.id);

      expect(missionBadgeIds).toEqual([
        'cargo_supervisor',
        'join_master',
        'aggregate_wizard',
        'warehouse_master',
      ]);

      for (const badgeId of missionBadgeIds) {
        const found = ALL_ACHIEVEMENTS.find(a => a.id === badgeId);
        expect(found, `Achievement ${badgeId} not found in ALL_ACHIEVEMENTS`).toBeDefined();
        expect(found?.title).toBeTruthy();
        expect(found?.xpReward).toBeGreaterThan(0);
      }
    });

    it('should simulate user XP accumulation and level progression through the world', () => {
      let cumulativeXp = 0;
      let levelState = calculateLevel(cumulativeXp);
      expect(levelState.level).toBe(1);
      expect(levelState.currentLevelXp).toBe(0);

      // wh_m1: +100 XP (Total 100) -> Level 1 (100/250)
      cumulativeXp += WAREHOUSE_MISSIONS[0].xpReward;
      levelState = calculateLevel(cumulativeXp);
      expect(levelState.level).toBe(1);
      expect(levelState.currentLevelXp).toBe(100);

      // wh_m2: +120 XP (Total 220) -> Level 1 (220/250)
      cumulativeXp += WAREHOUSE_MISSIONS[1].xpReward;
      levelState = calculateLevel(cumulativeXp);
      expect(levelState.level).toBe(1);
      expect(levelState.currentLevelXp).toBe(220);

      // wh_m3: +130 XP (Total 350) -> Level 2 (100/250)
      cumulativeXp += WAREHOUSE_MISSIONS[2].xpReward;
      levelState = calculateLevel(cumulativeXp);
      expect(levelState.level).toBe(2);
      expect(levelState.currentLevelXp).toBe(100);

      // wh_m4: +140 XP (Total 490) -> Level 2 (240/250)
      cumulativeXp += WAREHOUSE_MISSIONS[3].xpReward;
      levelState = calculateLevel(cumulativeXp);
      expect(levelState.level).toBe(2);
      expect(levelState.currentLevelXp).toBe(240);

      // wh_m5: +160 XP (Total 650) -> Level 3 (150/250)
      cumulativeXp += WAREHOUSE_MISSIONS[4].xpReward;
      levelState = calculateLevel(cumulativeXp);
      expect(levelState.level).toBe(3);
      expect(levelState.currentLevelXp).toBe(150);

      // wh_m6: +250 XP (Total 900) -> Level 4 (150/250)
      cumulativeXp += WAREHOUSE_MISSIONS[5].xpReward;
      levelState = calculateLevel(cumulativeXp);
      expect(levelState.level).toBe(4);
      expect(levelState.currentLevelXp).toBe(150);
      expect(levelState.progressPercent).toBe(60);

      // Adding 4 badges unlocked (50 XP bonus each = +200 XP -> Total 1100 XP)
      cumulativeXp += 4 * 50;
      levelState = calculateLevel(cumulativeXp);
      expect(levelState.level).toBe(5);
      expect(levelState.currentLevelXp).toBe(100);
      expect(levelState.progressPercent).toBe(40);
    });
  });

  describe('5. Executive Operations Audit Report Queries', () => {
    beforeEach(async () => {
      await initFreshDb();
      // Apply mutations from wh_m1, wh_m2, wh_m4 to ensure DB is in post-playthrough state
      db.exec(WAREHOUSE_MISSIONS[0].sampleSolution);
      db.exec(WAREHOUSE_MISSIONS[1].sampleSolution);
      db.exec(WAREHOUSE_MISSIONS[3].sampleSolution);
    });

    it('should execute all 6 report metric queries successfully with valid data', async () => {
      const metrics = warehouseWorld.reportConfig.metrics;
      expect(metrics.length).toBe(6);

      for (const m of metrics) {
        const res = await executeSql(m.query);
        expect(res.success, `Metric query '${m.id}' failed: ${res.error}`).toBe(true);
        expect(res.results && res.results.length > 0).toBe(true);
        expect(res.results![0].values.length).toBeGreaterThan(0);
      }
    });

    it('should verify report metrics return expected business values', () => {
      // 1. Total stock units stored
      const totalUnitsRes = db.exec('SELECT printf("%,d", SUM(quantity)) AS total_units FROM inventory_bins;');
      expect(totalUnitsRes[0].values[0][0]).toBe('555');

      // 2. Total freight pallets dispatched
      const totalPalletsRes = db.exec('SELECT SUM(pallet_count) AS total_pallets FROM shipments;');
      expect(totalPalletsRes[0].values[0][0]).toBe(97);

      // 3. Saturated bin alerts (count)
      const satCountRes = db.exec('SELECT COUNT(*) AS saturated_count FROM inventory_bins WHERE quantity >= max_capacity;');
      expect(satCountRes[0].values[0][0]).toBe(3);

      // 4. Stock distribution by zone (4 zones)
      const zoneDistRes = db.exec('SELECT z.zone_name, SUM(b.quantity) as total_qty FROM zones z JOIN inventory_bins b ON z.zone_id = b.zone_id GROUP BY z.zone_name ORDER BY total_qty DESC;');
      expect(zoneDistRes[0].values.length).toBe(4);
      expect(zoneDistRes[0].values[0][0]).toBe('Zone B - High-Density Racks');
      expect(zoneDistRes[0].values[0][1]).toBe(320);

      // 5. Carrier scorecard (3 carriers)
      const carrierRes = db.exec('SELECT carrier, COUNT(shipment_id) as shipments, SUM(pallet_count) as total_pallets FROM shipments GROUP BY carrier ORDER BY total_pallets DESC;');
      expect(carrierRes[0].values.length).toBe(3);
      expect(carrierRes[0].values[0][0]).toBe('TCI Freight');
      expect(carrierRes[0].values[0][2]).toBe(44);

      // 6. Overcapacity bin details
      const overcapRes = db.exec('SELECT b.bin_code, p.product_name, b.quantity, b.max_capacity FROM inventory_bins b JOIN products p ON b.product_id = p.product_id WHERE b.quantity >= b.max_capacity;');
      expect(overcapRes[0].values.length).toBe(3);
    });
  });
});
