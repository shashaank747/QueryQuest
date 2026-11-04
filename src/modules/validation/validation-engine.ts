import {
  ValidationContext,
  ValidationFeedback,
  ValidationRule,
} from '../../types/validation';
import { SqlQueryResult } from '../../types/sql';

export class ValidationEngine {
  /**
   * Evaluates all validation rules for a mission against the current database state and student's query.
   */
  static async validate(
    rules: ValidationRule[],
    context: ValidationContext
  ): Promise<ValidationFeedback> {
    if (!context.executionResponse.success) {
      return {
        passed: false,
        message: 'Your query resulted in a SQL error. Correct the syntax error before submitting.',
        details: {
          hint: context.executionResponse.hint || context.executionResponse.error,
        },
      };
    }

    for (const rule of rules) {
      const result = await this.evaluateRule(rule, context);
      if (!result.passed) {
        return result; // Return early on first failed requirement
      }
    }

    return {
      passed: true,
      message: 'Excellent work! Objective completed successfully.',
    };
  }

  private static async evaluateRule(
    rule: ValidationRule,
    context: ValidationContext
  ): Promise<ValidationFeedback> {
    switch (rule.type) {
      case 'TABLE_EXISTS':
        return this.validateTableExists(rule, context);

      case 'COLUMN_EXISTS':
        return this.validateColumnsExist(rule, context);

      case 'ROW_EXISTS':
        return this.validateRowExists(rule, context);

      case 'ROW_ABSENT':
        return this.validateRowAbsent(rule, context);

      case 'ROW_COUNT':
        return this.validateRowCount(rule, context);

      case 'SELECT_EXACT':
        return this.validateSelectExact(rule, context);

      case 'CUSTOM':
        if (rule.customValidator) {
          return await rule.customValidator(context);
        }
        return { passed: true, message: 'Valid' };

      default:
        return { passed: true, message: 'Valid' };
    }
  }

  private static async validateTableExists(
    rule: ValidationRule,
    context: ValidationContext
  ): Promise<ValidationFeedback> {
    const tableName = rule.expectedTable;
    if (!tableName) return { passed: false, message: 'Invalid validation rule configuration.' };

    const schema = await context.getSchema();
    const table = schema[tableName] || schema[tableName.toLowerCase()];

    if (!table) {
      return {
        passed: false,
        message: `Table '${tableName}' does not exist in the database.`,
        details: {
          expected: `Table named '${tableName}'`,
          hint: `Did you run CREATE TABLE ${tableName} (...)? Check spelling carefully.`,
        },
      };
    }

    // Check expected columns if specified
    if (rule.expectedColumns && rule.expectedColumns.length > 0) {
      const existingColNames = table.columns.map((c: any) => c.name.toLowerCase());
      for (const col of rule.expectedColumns) {
        if (!existingColNames.includes(col.toLowerCase())) {
          return {
            passed: false,
            message: `Table '${tableName}' exists, but column '${col}' is missing.`,
            details: {
              expected: `Column '${col}' in table '${tableName}'`,
              actual: `Columns present: ${table.columns.map((c: any) => c.name).join(', ')}`,
              hint: `Verify your CREATE TABLE column definitions.`,
            },
          };
        }
      }
    }

    return { passed: true, message: `Table '${tableName}' verified successfully.` };
  }

  private static async validateColumnsExist(
    rule: ValidationRule,
    context: ValidationContext
  ): Promise<ValidationFeedback> {
    const tableName = rule.expectedTable;
    if (!tableName || !rule.expectedColumns) {
      return { passed: false, message: 'Invalid column verification rule.' };
    }

    const schema = await context.getSchema();
    const table = schema[tableName] || schema[tableName.toLowerCase()];
    if (!table) {
      return { passed: false, message: `Table '${tableName}' does not exist.` };
    }

    const colNames = table.columns.map((c: any) => c.name.toLowerCase());
    const missing = rule.expectedColumns.filter(c => !colNames.includes(c.toLowerCase()));

    if (missing.length > 0) {
      return {
        passed: false,
        message: `Missing column(s) in '${tableName}': ${missing.join(', ')}`,
        details: {
          expected: rule.expectedColumns.join(', '),
          actual: colNames.join(', '),
        },
      };
    }

    return { passed: true, message: 'All expected columns exist.' };
  }

  private static async validateRowExists(
    rule: ValidationRule,
    context: ValidationContext
  ): Promise<ValidationFeedback> {
    const tableName = rule.expectedTable;
    const where = rule.expectedWhereClause || '1=1';
    if (!tableName) return { passed: false, message: 'Invalid validation rule.' };

    const checkSql = `SELECT COUNT(*) as count FROM "${tableName}" WHERE ${where};`;
    const res = await context.executeSql(checkSql);

    if (!res.success || !res.results || res.results.length === 0) {
      return {
        passed: false,
        message: `Could not verify records in '${tableName}'.`,
      };
    }

    const count = Number(res.results[0].values[0][0]);
    const minRequired = rule.expectedRowCount ?? 1;

    if (count < minRequired) {
      return {
        passed: false,
        message: rule.description || `Required record was not found in table '${tableName}'.`,
        details: {
          expected: `At least ${minRequired} record(s) matching condition: ${where}`,
          actual: `Found ${count} matching record(s).`,
          hint: `Ensure you ran the INSERT or UPDATE statement with the required values.`,
        },
      };
    }

    return { passed: true, message: 'Required records found.' };
  }

  private static async validateRowAbsent(
    rule: ValidationRule,
    context: ValidationContext
  ): Promise<ValidationFeedback> {
    const tableName = rule.expectedTable;
    const where = rule.expectedWhereClause;
    if (!tableName || !where) return { passed: false, message: 'Invalid validation rule.' };

    const checkSql = `SELECT COUNT(*) as count FROM "${tableName}" WHERE ${where};`;
    const res = await context.executeSql(checkSql);

    if (res.success && res.results && res.results.length > 0) {
      const count = Number(res.results[0].values[0][0]);
      if (count > 0) {
        return {
          passed: false,
          message: rule.description || `Record matching '${where}' still exists in '${tableName}'.`,
          details: {
            expected: `0 records matching condition`,
            actual: `${count} record(s) still remain`,
            hint: `Make sure your DELETE statement deleted the target record.`,
          },
        };
      }
    }

    return { passed: true, message: 'Record successfully removed.' };
  }

  private static async validateRowCount(
    rule: ValidationRule,
    context: ValidationContext
  ): Promise<ValidationFeedback> {
    const tableName = rule.expectedTable;
    if (!tableName) return { passed: false, message: 'Invalid validation rule.' };

    const checkSql = `SELECT COUNT(*) FROM "${tableName}";`;
    const res = await context.executeSql(checkSql);
    const count = Number(res.results?.[0]?.values?.[0]?.[0] || 0);

    if (rule.expectedRowCount !== undefined && count !== rule.expectedRowCount) {
      return {
        passed: false,
        message: `Table '${tableName}' has ${count} records, but ${rule.expectedRowCount} were expected.`,
        details: {
          expected: rule.expectedRowCount,
          actual: count,
        },
      };
    }

    return { passed: true, message: 'Row count verified.' };
  }

  private static async validateSelectExact(
    rule: ValidationRule,
    context: ValidationContext
  ): Promise<ValidationFeedback> {
    const studentRes = context.executionResponse.results?.[0];
    if (!studentRes) {
      return {
        passed: false,
        message: 'Your query did not return any data rows. A SELECT query is required.',
      };
    }

    if (!rule.expectedQuery) {
      return { passed: true, message: 'Valid' };
    }

    // Execute reference query against database to calculate ground truth
    const groundTruthRes = await context.executeSql(rule.expectedQuery);
    if (!groundTruthRes.success || !groundTruthRes.results || !groundTruthRes.results[0]) {
      console.warn('Ground truth query failed:', groundTruthRes.error);
      return { passed: false, message: 'Internal validation query error.' };
    }

    const expected = groundTruthRes.results[0];
    const actual = studentRes;

    // Compare row counts
    if (actual.values.length !== expected.values.length) {
      return {
        passed: false,
        message: `Returned ${actual.values.length} record(s), but ${expected.values.length} were expected.`,
        details: {
          expected: `${expected.values.length} rows`,
          actual: `${actual.values.length} rows`,
          hint: `Review your WHERE filter, JOIN conditions, or HAVING clause.`,
        },
        metrics: {
          rowsMatched: actual.values.length,
          expectedRows: expected.values.length,
        },
      };
    }

    // Compare values
    const orderSensitive = rule.orderSensitive ?? false;
    const isValuesMatch = this.compareResultSets(actual, expected, orderSensitive);

    if (!isValuesMatch) {
      return {
        passed: false,
        message: orderSensitive
          ? 'The records returned do not match the expected values or ordering. Ensure ORDER BY clause is applied.'
          : 'The data values returned do not match the expected solution. Check your selected columns and filter values.',
        details: {
          expected: expected.values.slice(0, 3),
          actual: actual.values.slice(0, 3),
          hint: rule.description,
        },
      };
    }

    return {
      passed: true,
      message: 'Query returned the exact expected business results!',
      metrics: {
        rowsMatched: actual.values.length,
        expectedRows: expected.values.length,
      },
    };
  }

  private static compareResultSets(
    actual: SqlQueryResult,
    expected: SqlQueryResult,
    orderSensitive: boolean
  ): boolean {
    if (actual.values.length !== expected.values.length) return false;
    if (actual.values.length === 0) return true;

    // Normalize rows into comparable canonical strings
    const normalizeRow = (row: any[]): string =>
      row
        .map((val) => {
          if (val === null || val === undefined) return '__null__';
          if (typeof val === 'number') return Number(val).toFixed(2);
          return String(val).trim().toLowerCase();
        })
        .join('|');

    if (orderSensitive) {
      for (let i = 0; i < actual.values.length; i++) {
        if (normalizeRow(actual.values[i]) !== normalizeRow(expected.values[i])) {
          return false;
        }
      }
      return true;
    } else {
      // Order-insensitive multiset comparison
      const actualCount = new Map<string, number>();
      for (const row of actual.values) {
        const key = normalizeRow(row);
        actualCount.set(key, (actualCount.get(key) || 0) + 1);
      }

      for (const row of expected.values) {
        const key = normalizeRow(row);
        const count = actualCount.get(key);
        if (!count || count <= 0) {
          return false;
        }
        actualCount.set(key, count - 1);
      }

      return true;
    }
  }
}

