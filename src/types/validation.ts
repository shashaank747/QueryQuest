import { SqlExecutionResponse } from './sql';

export interface ValidationFeedback {
  passed: boolean;
  message: string;
  details?: {
    expected?: string | number | any[];
    actual?: string | number | any[];
    hint?: string;
  };
  metrics?: {
    rowsMatched?: number;
    expectedRows?: number;
  };
}

export type ValidationStrategy =
  | 'SELECT_EXACT'
  | 'SELECT_SUBSET'
  | 'TABLE_EXISTS'
  | 'ROW_EXISTS'
  | 'ROW_COUNT'
  | 'ROW_ABSENT'
  | 'COLUMN_EXISTS'
  | 'CUSTOM';

export interface ValidationRule {
  type: ValidationStrategy;
  description: string;
  expectedQuery?: string; // Query to run to compute canonical ground truth
  expectedTable?: string;
  expectedColumns?: string[];
  expectedRowCount?: number;
  expectedWhereClause?: string;
  orderSensitive?: boolean;
  customValidator?: (context: ValidationContext) => Promise<ValidationFeedback> | ValidationFeedback;
}

export interface ValidationContext {
  studentSql: string;
  executionResponse: SqlExecutionResponse;
  executeSql: (sql: string) => Promise<SqlExecutionResponse>;
  getSchema: () => Promise<Record<string, any>>;
  getTableData: (tableName: string, limit?: number) => Promise<any[]>;
}

