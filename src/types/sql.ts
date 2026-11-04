export interface SqlColumn {
  name: string;
  type: string;
  notnull?: number;
  dflt_value?: any;
  pk?: number;
}

export interface SqlForeignKey {
  id: number;
  seq: number;
  table: string;
  from: string;
  to: string;
  on_update: string;
  on_delete: string;
  match: string;
}

export interface SqlTableSchema {
  name: string;
  columns: SqlColumn[];
  foreignKeys: SqlForeignKey[];
  rowCount?: number;
}

export interface SqlDatabaseSchema {
  [tableName: string]: SqlTableSchema;
}

export interface SqlQueryResult {
  columns: string[];
  values: any[][];
}

export interface SqlExecutionResponse {
  success: boolean;
  query: string;
  action: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'CREATE' | 'ALTER' | 'DROP' | 'TRANSACTION' | 'OTHER';
  table?: string | null;
  results?: SqlQueryResult[];
  rowsAffected: number;
  executionTimeMs: number;
  error?: string;
  hint?: string;
}

export interface SqlExecutionOptions {
  timeoutMs?: number;
}

export interface QueryHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  success: boolean;
  rowsAffected?: number;
  rowsReturned?: number;
  executionTimeMs?: number;
}
