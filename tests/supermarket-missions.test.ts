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

  it('Mission 2: departments table creation works', () => {
    const m2 = SUPERMARKET_MISSIONS[1];
    db.exec(m2.sampleSolution);
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='departments';");
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

  it('Mission 7: Search catalog for active organic products', () => {
    const m7 = SUPERMARKET_MISSIONS[6];
    const res = db.exec(m7.sampleSolution);
    expect(res.length).toBe(1);
    expect(res[0].columns).toEqual(['product_id', 'product_name', 'category_id', 'unit_price']);
    const rows = res[0].values;
    expect(rows.length).toBeGreaterThan(0);
    for (const [_, name] of rows) {
      expect(name).toContain('Organic');
    }
  });

  it('Mission 8: Filter completed orders between 500 and 2500', () => {
    const m8 = SUPERMARKET_MISSIONS[7];
    const res = db.exec(m8.sampleSolution);
    expect(res.length).toBe(1);
    expect(res[0].columns).toEqual(['order_id', 'customer_id', 'order_date', 'total_amount']);
    const rows = res[0].values;
    expect(rows.length).toBeGreaterThan(0);
    for (let i = 0; i < rows.length; i++) {
      const amount = rows[i][3];
      expect(amount).toBeGreaterThanOrEqual(500);
      expect(amount).toBeLessThanOrEqual(2500);
      if (i > 0) {
        expect(amount).toBeLessThanOrEqual(rows[i - 1][3]);
      }
    }
  });

  it('Mission 9: Summarize payment methods with total revenue > 2000', () => {
    const m9 = SUPERMARKET_MISSIONS[8];
    const res = db.exec(m9.sampleSolution);
    expect(res.length).toBe(1);
    expect(res[0].columns).toEqual(['payment_method', 'total_transactions', 'total_revenue']);
    const rows = res[0].values;
    expect(rows.length).toBeGreaterThan(0);
    for (const [_, count, rev] of rows) {
      expect(rev).toBeGreaterThan(2000);
      expect(count).toBeGreaterThan(0);
    }
  });

  it('Mission 10: Top 3 spending customers deliverable', () => {
    const m10 = SUPERMARKET_MISSIONS[9];
    const res = db.exec(m10.sampleSolution);
    expect(res.length).toBe(1);
    expect(res[0].columns).toEqual(['customer_id', 'total_orders', 'total_spent']);
    const rows = res[0].values;
    expect(rows.length).toBe(3);
    expect(rows[0][2]).toBeGreaterThanOrEqual(rows[1][2]);
    expect(rows[1][2]).toBeGreaterThanOrEqual(rows[2][2]);
  });
});

