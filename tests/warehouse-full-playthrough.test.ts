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

    it('wh_m1: verifies table creation for temperature_logs', async () => {
      const m1 = WAREHOUSE_MISSIONS[0];
      const execRes = await executeSql(m1.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = createValidationContext(m1.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m1.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const schema = getDatabaseSchema();
      expect(schema['temperature_logs']).toBeDefined();
      const colNames = schema['temperature_logs'].columns.map(c => c.name);
      expect(colNames).toEqual(expect.arrayContaining(['log_id', 'zone_id', 'recorded_temp', 'recorded_at', 'is_alert']));
    });

    it('wh_m2: verifies precision tooling product insertion', async () => {
      const m2 = WAREHOUSE_MISSIONS[1];
      const execRes = await executeSql(m2.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = createValidationContext(m2.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m2.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const res = db.exec("SELECT sku, product_name, category, unit_weight_kg FROM products WHERE product_id = 7;");
      expect(res[0].values[0]).toEqual(['SKU-TOOL-407', 'Laser Leveling Transit Kit', 'Tools', 3.8]);
    });

    it('wh_m3: queries overcapacity bins accurately', async () => {
      const m3 = WAREHOUSE_MISSIONS[2];
      const execRes = await executeSql(m3.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = createValidationContext(m3.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m3.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      // Verify exact 3 saturated bins: BIN-A-02 (80/80), BIN-B-02 (200/200), BIN-C-01 (60/60)
      const rows = execRes.results![0].values;
      expect(rows.length).toBe(3);
      const binCodes = rows.map(r => r[0]);
      expect(binCodes).toContain('BIN-A-02');
      expect(binCodes).toContain('BIN-B-02');
      expect(binCodes).toContain('BIN-C-01');
    });

    it('wh_m4: updates shipment APX-9041 to In Transit', async () => {
      const m4 = WAREHOUSE_MISSIONS[3];
      const execRes = await executeSql(m4.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = createValidationContext(m4.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m4.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const res = db.exec("SELECT status FROM shipments WHERE tracking_number = 'APX-9041';");
      expect(res[0].values[0][0]).toBe('In Transit');
    });

    it('wh_m5: executes multi-table JOIN for cold chain inventory with descending quantity', async () => {
      const m5 = WAREHOUSE_MISSIONS[4];
      const execRes = await executeSql(m5.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = createValidationContext(m5.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m5.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const rows = execRes.results![0].values;
      expect(rows.length).toBe(2);
      // Row 1: BIN-C-01 with 60 qty
      expect(rows[0][2]).toBe('BIN-C-01');
      expect(rows[0][3]).toBe(60);
      // Row 2: BIN-C-02 with 35 qty
      expect(rows[1][2]).toBe('BIN-C-02');
      expect(rows[1][3]).toBe(35);
    });

    it('wh_m6: aggregates carrier freight volume with HAVING filter and order', async () => {
      const m6 = WAREHOUSE_MISSIONS[5];
      const execRes = await executeSql(m6.sampleSolution);
      expect(execRes.success).toBe(true);

      const ctx = createValidationContext(m6.sampleSolution, execRes);
      const feedback = await ValidationEngine.validate(m6.validationRules, ctx);
      expect(feedback.passed).toBe(true);

      const rows = execRes.results![0].values;
      expect(rows.length).toBe(3);
      // High volume carrier order: TCI (44) > Delhivery (33) > BlueDart (20)
      expect(rows[0]).toEqual(['TCI Freight', 2, 44]);
      expect(rows[1]).toEqual(['Delhivery Freight', 2, 33]);
      expect(rows[2]).toEqual(['BlueDart Express', 2, 20]);
    });
  });

  describe('3. Intentional Error & Diagnostic Testing', () => {
    beforeEach(async () => {
      await initFreshDb();
    });

    describe('wh_m1 Errors & Diagnostics', () => {
      it('should diagnose syntax error with trailing comma', () => {
        const badSql = `CREATE TABLE temperature_logs (
          log_id INTEGER PRIMARY KEY AUTOINCREMENT,
          zone_id INTEGER NOT NULL,
        );`;
        try {
          db.exec(badSql);
          expect.fail('Should have thrown syntax error');
        } catch (err: any) {
          const diag = generateSqlDiagnostic(err.message, badSql);
          expect(diag).toMatch(/Syntax error near "\)"/i);
        }
      });

      it('should fail validation when table is created without required columns', async () => {
        const incompleteSql = `CREATE TABLE temperature_logs (
          log_id INTEGER PRIMARY KEY AUTOINCREMENT,
          zone_id INTEGER NOT NULL
        );`;
        const execRes = await executeSql(incompleteSql);
        expect(execRes.success).toBe(true);

        const m1 = WAREHOUSE_MISSIONS[0];
        const ctx = createValidationContext(incompleteSql, execRes);
        const feedback = await ValidationEngine.validate(m1.validationRules, ctx);

        expect(feedback.passed).toBe(false);
        expect(feedback.message).toContain("column 'recorded_temp' is missing");
      });

      it('should fail validation if table name is misspelled', async () => {
        const wrongTableSql = `CREATE TABLE temp_logs (
          log_id INTEGER PRIMARY KEY AUTOINCREMENT,
          zone_id INTEGER NOT NULL,
          recorded_temp REAL NOT NULL,
          recorded_at TEXT NOT NULL,
          is_alert INTEGER DEFAULT 0
        );`;
        const execRes = await executeSql(wrongTableSql);
        const m1 = WAREHOUSE_MISSIONS[0];
        const ctx = createValidationContext(wrongTableSql, execRes);
        const feedback = await ValidationEngine.validate(m1.validationRules, ctx);

        expect(feedback.passed).toBe(false);
        expect(feedback.message).toContain("Table 'temperature_logs' does not exist");
      });
    });

    describe('wh_m2 Errors & Diagnostics', () => {
      it('should diagnose unique constraint violation when duplicate product_id or sku is inserted', () => {
        const dupSql = `INSERT INTO products (product_id, sku, product_name, category, unit_weight_kg)
          VALUES (1, 'SKU-TOOL-407', 'Laser Leveling Transit Kit', 'Tools', 3.8);`;
        try {
          db.exec(dupSql);
          expect.fail('Should fail with UNIQUE constraint');
        } catch (err: any) {
          const diag = generateSqlDiagnostic(err.message, dupSql);
          expect(diag).toMatch(/unique constraint violation/i);
        }
      });

      it('should diagnose non-existent column in products INSERT', () => {
        const badColSql = `INSERT INTO products (product_id, sku, item_name, category, unit_weight_kg)
          VALUES (7, 'SKU-TOOL-407', 'Laser Leveling Kit', 'Tools', 3.8);`;
        try {
          db.exec(badColSql);
          expect.fail('Should fail with no such column');
        } catch (err: any) {
          const diag = generateSqlDiagnostic(err.message, badColSql);
          expect(diag).toMatch(/Column "item_name" does not exist/i);
        }
      });

      it('should fail validation when wrong SKU is inserted', async () => {
        const wrongSkuSql = `INSERT INTO products (product_id, sku, product_name, category, unit_weight_kg)
          VALUES (7, 'SKU-WRONG-999', 'Laser Leveling Transit Kit', 'Tools', 3.8);`;
        const execRes = await executeSql(wrongSkuSql);
        const m2 = WAREHOUSE_MISSIONS[1];
        const ctx = createValidationContext(wrongSkuSql, execRes);
        const feedback = await ValidationEngine.validate(m2.validationRules, ctx);

        expect(feedback.passed).toBe(false);
        expect(feedback.message).toContain('Verify SKU-TOOL-407 is inserted into products');
      });
    });

    describe('wh_m3 Errors & Diagnostics', () => {
      it('should fail validation when strict greater than is used (> max_capacity)', async () => {
        const strictSql = `SELECT bin_code, quantity, max_capacity
          FROM inventory_bins
          WHERE quantity > max_capacity;`;
        const execRes = await executeSql(strictSql);
        expect(execRes.success).toBe(true);
        expect(execRes.results?.length ?? 0).toBe(0);

        const m3 = WAREHOUSE_MISSIONS[2];
        const ctx = createValidationContext(strictSql, execRes);
        const feedback = await ValidationEngine.validate(m3.validationRules, ctx);

        expect(feedback.passed).toBe(false);
        expect(feedback.message).toMatch(/Your query did not return any data rows|Returned 0 record\(s\)/);
      });

      it('should diagnose non-existent column stock_level', () => {
        const badColSql = `SELECT bin_code, stock_level FROM inventory_bins WHERE quantity >= max_capacity;`;
        try {
          db.exec(badColSql);
          expect.fail('Should fail with no such column');
        } catch (err: any) {
          const diag = generateSqlDiagnostic(err.message, badColSql);
          expect(diag).toMatch(/Column "stock_level" does not exist/i);
        }
      });

      it('should diagnose non-existent table bins', () => {
        const badTableSql = `SELECT bin_code, quantity, max_capacity FROM bins WHERE quantity >= max_capacity;`;
        try {
          db.exec(badTableSql);
          expect.fail('Should fail with no such table');
        } catch (err: any) {
          const diag = generateSqlDiagnostic(err.message, badTableSql);
          expect(diag).toMatch(/Table "bins" was not found in the database/i);
        }
      });
    });

    describe('wh_m4 Errors & Diagnostics', () => {
      it('should diagnose syntax error in UPDATE statement', () => {
        const badUpdateSql = `UPDATE shipments SET status == 'In Transit' WHERE tracking_number = 'APX-9041';`;
        try {
          db.exec(badUpdateSql);
          expect.fail('Should fail with syntax error');
        } catch (err: any) {
          const diag = generateSqlDiagnostic(err.message, badUpdateSql);
          expect(diag).toMatch(/syntax error near "=="|syntax error/i);
        }
      });

      it('should fail validation when updating a non-existent tracking number', async () => {
        const wrongTrackSql = `UPDATE shipments SET status = 'In Transit' WHERE tracking_number = 'APX-9999';`;
        const execRes = await executeSql(wrongTrackSql);
        const m4 = WAREHOUSE_MISSIONS[3];
        const ctx = createValidationContext(wrongTrackSql, execRes);
        const feedback = await ValidationEngine.validate(m4.validationRules, ctx);

        expect(feedback.passed).toBe(false);
        expect(feedback.message).toContain('Verify APX-9041 status is In Transit');
      });

      it('should diagnose non-existent column shipment_state', () => {
        const badColSql = `UPDATE shipments SET shipment_state = 'In Transit' WHERE tracking_number = 'APX-9041';`;
        try {
          db.exec(badColSql);
          expect.fail('Should fail with no such column');
        } catch (err: any) {
          const diag = generateSqlDiagnostic(err.message, badColSql);
          expect(diag).toMatch(/Column "shipment_state" does not exist/i);
        }
      });
    });

    describe('wh_m5 Errors & Diagnostics', () => {
      it('should fail validation when JOIN condition is invalid', async () => {
        // Wrong join: connecting inventory_bins to zones via bin_id instead of zone_id
        const badJoinSql = `SELECT p.sku, p.product_name, b.bin_code, b.quantity, z.zone_name
          FROM products p
          JOIN inventory_bins b ON p.product_id = b.product_id
          JOIN zones z ON b.bin_id = z.zone_id
          WHERE z.temp_controlled = 1
          ORDER BY b.quantity DESC;`;
        const execRes = await executeSql(badJoinSql);
        expect(execRes.success).toBe(true);

        const m5 = WAREHOUSE_MISSIONS[4];
        const ctx = createValidationContext(badJoinSql, execRes);
        const feedback = await ValidationEngine.validate(m5.validationRules, ctx);

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

        const m5 = WAREHOUSE_MISSIONS[4];
        const ctx = createValidationContext(warmZoneSql, execRes);
        const feedback = await ValidationEngine.validate(m5.validationRules, ctx);

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

        const m5 = WAREHOUSE_MISSIONS[4];
        const ctx = createValidationContext(ascSql, execRes);
        const feedback = await ValidationEngine.validate(m5.validationRules, ctx);

        expect(feedback.passed).toBe(false);
        expect(feedback.message).toContain('Ensure ORDER BY clause is applied');
      });

      it('should diagnose non-existent column z.cold_chain', () => {
        const badColSql = `SELECT p.sku, p.product_name FROM products p JOIN inventory_bins b ON p.product_id = b.product_id JOIN zones z ON b.zone_id = z.zone_id WHERE z.cold_chain = 1;`;
        try {
          db.exec(badColSql);
          expect.fail('Should fail with no such column');
        } catch (err: any) {
          const diag = generateSqlDiagnostic(err.message, badColSql);
          expect(diag).toMatch(/Column "z\.cold_chain" does not exist|Column "cold_chain" does not exist/i);
        }
      });
    });

    describe('wh_m6 Errors & Diagnostics', () => {
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

        const m6 = WAREHOUSE_MISSIONS[5];
        const ctx = createValidationContext(highHavingSql, execRes);
        const feedback = await ValidationEngine.validate(m6.validationRules, ctx);

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

        const m6 = WAREHOUSE_MISSIONS[5];
        const ctx = createValidationContext(noGroupBySql, execRes);
        const feedback = await ValidationEngine.validate(m6.validationRules, ctx);

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

        const m6 = WAREHOUSE_MISSIONS[5];
        const ctx = createValidationContext(ascSql, execRes);
        const feedback = await ValidationEngine.validate(m6.validationRules, ctx);

        expect(feedback.passed).toBe(false);
        expect(feedback.message).toContain('Ensure ORDER BY clause is applied');
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
        'table_architect',
        'cargo_supervisor',
        'join_master',
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
