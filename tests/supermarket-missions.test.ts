import { describe, it, expect, beforeAll } from 'vitest';
import initSqlJs from 'sql.js';
import { SUPERMARKET_MISSIONS } from '../src/modules/worlds/supermarket/missions';
import { SUPERMARKET_BASE_SCHEMA } from '../src/modules/worlds/supermarket/schema';
import { SUPERMARKET_FULL_SEED, SUPERMARKET_CATALOG_AND_SALES_SEED } from '../src/modules/worlds/supermarket/dataset';

describe('World 1: Supermarket Operations Missions & SQL Solutions', () => {
  let db: any;

  beforeAll(async () => {
    const SQL = await initSqlJs();
    db = new SQL.Database();
    db.exec('PRAGMA foreign_keys = ON;');
    db.exec(SUPERMARKET_BASE_SCHEMA);
    db.exec(SUPERMARKET_FULL_SEED);
    db.exec(SUPERMARKET_CATALOG_AND_SALES_SEED);
  });

  it('should have 10 sequential missions defined', () => {
    expect(SUPERMARKET_MISSIONS.length).toBe(10);
    SUPERMARKET_MISSIONS.forEach((m, idx) => {
      expect(m.order).toBe(idx + 1);
      expect(m.title).toBeTruthy();
      expect(m.hints.length).toBe(3);
      expect(m.sampleSolution).toBeTruthy();
      expect(m.validationRules.length).toBeGreaterThan(0);
    });
  });

  it('Mission 1: store_branches table creation works', () => {
    const m1 = SUPERMARKET_MISSIONS[0];
    db.exec(m1.sampleSolution);
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='store_branches';");
    expect(tables.length).toBe(1);
    expect(tables[0].values.length).toBe(1);
  });

  it('Mission 3: Register vendor FreshRoots Organics', () => {
    const m3 = SUPERMARKET_MISSIONS[2];
    db.exec(m3.sampleSolution);
    const res = db.exec("SELECT company_name, city FROM suppliers WHERE company_name LIKE '%FreshRoots%';");
    expect(res.length).toBe(1);
    expect(res[0].values[0][0]).toBe('FreshRoots Organics');
    expect(res[0].values[0][1]).toBe('Bengaluru');
  });

  it('Mission 4: Find products running low on stock (quantity_on_hand < reorder_level)', () => {
    const m4 = SUPERMARKET_MISSIONS[3];
    const res = db.exec(m4.sampleSolution);
    expect(res.length).toBe(1);
    const rows = res[0].values;
    expect(rows.length).toBeGreaterThan(0);
    // Every returned row must have quantity < reorder
    for (const [_, qty, reorder] of rows) {
      expect(qty).toBeLessThan(reorder);
    }
  });

  it('Mission 5: Correct Arabica coffee beans price to 480.00', () => {
    const m5 = SUPERMARKET_MISSIONS[4];
    db.exec(m5.sampleSolution);
    const res = db.exec('SELECT unit_price FROM products WHERE product_id = 1;');
    expect(res[0].values[0][0]).toBe(480);
  });

  it('Mission 6: Purge discontinued products', () => {
    const m6 = SUPERMARKET_MISSIONS[5];
    db.exec(m6.sampleSolution);
    const res = db.exec("SELECT COUNT(*) FROM products WHERE status = 'Discontinued';");
    expect(res[0].values[0][0]).toBe(0);
  });

  it('Mission 7: Investigate Wireless Optical Mouse inventory error', () => {
    const m7 = SUPERMARKET_MISSIONS[6];
    const res = db.exec(m7.sampleSolution);
    expect(res.length).toBe(1);
    const [name, qty, aisle] = res[0].values[0];
    expect(name).toBe('Wireless Optical Mouse');
    expect(qty).toBe(0); // 0 stock caused the checkout error!
    expect(aisle).toBe('Aisle 4');
  });

  it('Mission 8: 3-table JOIN connects customers, orders, order_items', () => {
    const m8 = SUPERMARKET_MISSIONS[7];
    const res = db.exec(m8.sampleSolution);
    expect(res.length).toBe(1);
    expect(res[0].columns).toEqual(['customer_id', 'first_name', 'order_id', 'product_id', 'quantity']);
    expect(res[0].values.length).toBeGreaterThanOrEqual(15);
  });

  it('Mission 9: Category-wise sales aggregate with HAVING > 1000', () => {
    const m9 = SUPERMARKET_MISSIONS[8];
    const res = db.exec(m9.sampleSolution);
    expect(res.length).toBe(1);
    const rows = res[0].values;
    expect(rows.length).toBeGreaterThan(0);
    for (const [cat, rev] of rows) {
      expect(rev).toBeGreaterThan(1000);
    }
  });

  it('Mission 10: Top 3 best-selling products', () => {
    const m10 = SUPERMARKET_MISSIONS[9];
    const res = db.exec(m10.sampleSolution);
    expect(res.length).toBe(1);
    const rows = res[0].values;
    expect(rows.length).toBe(3);
    expect(rows[0][1]).toBeGreaterThanOrEqual(rows[1][1]);
    expect(rows[1][1]).toBeGreaterThanOrEqual(rows[2][1]);
  });
});

