import { describe, it, expect } from 'vitest';
import { ValidationEngine } from '../src/modules/validation/validation-engine';
import { ValidationRule, ValidationContext } from '../src/types/validation';
import { SqlExecutionResponse } from '../src/types/sql';

describe('ValidationEngine', () => {
  it('should pass TABLE_EXISTS when table and expected columns exist', async () => {
    const rules: ValidationRule[] = [
      {
        type: 'TABLE_EXISTS',
        description: 'Check products table exists',
        expectedTable: 'products',
        expectedColumns: ['product_id', 'product_name', 'unit_price'],
      },
    ];

    const mockContext: ValidationContext = {
      studentSql: 'CREATE TABLE products (product_id INTEGER, product_name TEXT, unit_price REAL);',
      executionResponse: {
        success: true,
        query: 'CREATE TABLE...',
        action: 'CREATE',
        rowsAffected: 0,
        executionTimeMs: 1.2,
      },
      executeSql: async () => ({
        success: true,
        query: '',
        action: 'SELECT',
        rowsAffected: 0,
        executionTimeMs: 0,
      }),
      getSchema: async () => ({
        products: {
          name: 'products',
          columns: [
            { name: 'product_id', type: 'INTEGER' },
            { name: 'product_name', type: 'TEXT' },
            { name: 'unit_price', type: 'REAL' },
          ],
          foreignKeys: [],
        },
      }),
      getTableData: async () => [],
    };

    const feedback = await ValidationEngine.validate(rules, mockContext);
    expect(feedback.passed).toBe(true);
  });

  it('should fail TABLE_EXISTS when column is missing', async () => {
    const rules: ValidationRule[] = [
      {
        type: 'TABLE_EXISTS',
        description: 'Check products table exists',
        expectedTable: 'products',
        expectedColumns: ['product_id', 'product_name', 'unit_price'],
      },
    ];

    const mockContext: ValidationContext = {
      studentSql: 'CREATE TABLE products (product_id INTEGER, product_name TEXT);',
      executionResponse: {
        success: true,
        query: 'CREATE TABLE...',
        action: 'CREATE',
        rowsAffected: 0,
        executionTimeMs: 1.2,
      },
      executeSql: async () => ({
        success: true,
        query: '',
        action: 'SELECT',
        rowsAffected: 0,
        executionTimeMs: 0,
      }),
      getSchema: async () => ({
        products: {
          name: 'products',
          columns: [
            { name: 'product_id', type: 'INTEGER' },
            { name: 'product_name', type: 'TEXT' },
          ],
          foreignKeys: [],
        },
      }),
      getTableData: async () => [],
    };

    const feedback = await ValidationEngine.validate(rules, mockContext);
    expect(feedback.passed).toBe(false);
    expect(feedback.message).toContain("column 'unit_price' is missing");
  });

  it('should validate SELECT_EXACT query results correctly regardless of column alias', async () => {
    const rules: ValidationRule[] = [
      {
        type: 'SELECT_EXACT',
        description: 'Verify low stock products',
        expectedQuery: 'SELECT product_id, quantity_on_hand FROM inventory WHERE quantity_on_hand < 20;',
      },
    ];

    const mockContext: ValidationContext = {
      studentSql: 'SELECT product_id, quantity_on_hand FROM inventory WHERE quantity_on_hand < 20;',
      executionResponse: {
        success: true,
        query: 'SELECT...',
        action: 'SELECT',
        rowsAffected: 0,
        executionTimeMs: 2.1,
        results: [
          {
            columns: ['product_id', 'quantity_on_hand'],
            values: [
              [2, 18],
              [4, 12],
              [5, 14],
            ],
          },
        ],
      },
      executeSql: async () => ({
        success: true,
        query: '',
        action: 'SELECT',
        rowsAffected: 0,
        executionTimeMs: 1.5,
        results: [
          {
            columns: ['product_id', 'quantity_on_hand'],
            values: [
              [2, 18],
              [4, 12],
              [5, 14],
            ],
          },
        ],
      }),
      getSchema: async () => ({}),
      getTableData: async () => [],
    };

    const feedback = await ValidationEngine.validate(rules, mockContext);
    expect(feedback.passed).toBe(true);
  });

  it('should detect mismatch when returned rows count does not match expected', async () => {
    const rules: ValidationRule[] = [
      {
        type: 'SELECT_EXACT',
        description: 'Verify low stock products',
        expectedQuery: 'SELECT product_id FROM inventory WHERE quantity_on_hand < 20;',
      },
    ];

    const mockContext: ValidationContext = {
      studentSql: 'SELECT product_id FROM inventory;',
      executionResponse: {
        success: true,
        query: 'SELECT...',
        action: 'SELECT',
        rowsAffected: 0,
        executionTimeMs: 1.2,
        results: [
          {
            columns: ['product_id'],
            values: [[1], [2], [3], [4], [5]],
          },
        ],
      },
      executeSql: async () => ({
        success: true,
        query: '',
        action: 'SELECT',
        rowsAffected: 0,
        executionTimeMs: 1.2,
        results: [
          {
            columns: ['product_id'],
            values: [[2], [4]],
          },
        ],
      }),
      getSchema: async () => ({}),
      getTableData: async () => [],
    };

    const feedback = await ValidationEngine.validate(rules, mockContext);
    expect(feedback.passed).toBe(false);
    expect(feedback.message).toContain('Returned 5 record(s), but 2 were expected');
  });
});

