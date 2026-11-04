import {
  SqlDatabaseSchema,
  SqlExecutionResponse,
  SqlQueryResult,
} from '../../types/sql';
import { generateSqlDiagnostic } from './diagnostics';

export class SqlWorkerClient {
  private worker: Worker | null = null;
  private pendingRequests: Map<
    string,
    {
      resolve: (value: any) => void;
      reject: (reason?: any) => void;
      timer: ReturnType<typeof setTimeout>;
    }
  > = new Map();
  private isReady = false;

  constructor() {
    this.spawnWorker();
  }

  private spawnWorker() {
    if (typeof window === 'undefined') return;

    this.worker = new Worker(
      new URL('./sql.worker.ts', import.meta.url),
      { type: 'module' }
    );

    this.worker.onmessage = (e: MessageEvent) => {
      const { id, success, error, ...data } = e.data;
      const pending = this.pendingRequests.get(id);

      if (pending) {
        clearTimeout(pending.timer);
        this.pendingRequests.delete(id);

        if (success) {
          pending.resolve(data);
        } else {
          pending.reject(new Error(error || 'Worker operation failed'));
        }
      }
    };

    this.worker.onerror = (err) => {
      console.error('SQL Worker Error:', err);
    };
  }

  private send<T = any>(type: string, payload?: any, timeoutMs = 8000): Promise<T> {
    if (!this.worker) {
      this.spawnWorker();
    }

    const id = Math.random().toString(36).substring(2, 11);

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingRequests.delete(id);
        // If a query freezes the worker, terminate and restart
        if (type === 'EXECUTE') {
          console.warn('SQL execution timed out, restarting worker thread...');
          this.terminate();
          this.spawnWorker();
          reject(new Error('Query execution timed out (exceeded 8s). Check for infinite recursion or massive cartesian joins.'));
        } else {
          reject(new Error(`Worker request ${type} timed out.`));
        }
      }, timeoutMs);

      this.pendingRequests.set(id, { resolve, reject, timer });
      this.worker?.postMessage({ id, type, payload });
    });
  }

  async init(binary?: Uint8Array): Promise<boolean> {
    try {
      const res = await this.send<{ isInitialized: boolean }>('INIT', { binary }, 12000);
      this.isReady = res.isInitialized;
      return this.isReady;
    } catch (e) {
      console.error('Failed to initialize SQLite Worker:', e);
      throw e;
    }
  }

  async execute(sql: string, timeoutMs = 8000): Promise<SqlExecutionResponse> {
    const trimmed = sql.trim();
    if (!trimmed) {
      return {
        success: false,
        query: '',
        action: 'OTHER',
        rowsAffected: 0,
        executionTimeMs: 0,
        error: 'Please enter a SQL query to execute.',
      };
    }

    try {
      const data = await this.send<{
        query: string;
        action: any;
        results: SqlQueryResult[];
        rowsAffected: number;
        executionTimeMs: number;
      }>('EXECUTE', { sql: trimmed }, timeoutMs);

      return {
        success: true,
        query: trimmed,
        action: data.action,
        results: data.results || [],
        rowsAffected: data.rowsAffected || 0,
        executionTimeMs: data.executionTimeMs || 0,
      };
    } catch (err: any) {
      const errorMsg = err?.message || String(err);
      const hint = generateSqlDiagnostic(errorMsg, trimmed);
      return {
        success: false,
        query: trimmed,
        action: 'OTHER',
        rowsAffected: 0,
        executionTimeMs: 0,
        error: errorMsg,
        hint,
      };
    }
  }

  async getSchema(): Promise<SqlDatabaseSchema> {
    const data = await this.send<{ schema: SqlDatabaseSchema }>('GET_SCHEMA');
    return data.schema || {};
  }

  async previewTable(tableName: string, limit = 25): Promise<SqlQueryResult[]> {
    const data = await this.send<{ results: SqlQueryResult[] }>('PREVIEW_TABLE', {
      tableName,
      limit,
    });
    return data.results || [];
  }

  async exportDb(): Promise<Uint8Array> {
    const data = await this.send<{ binary: Uint8Array }>('EXPORT_DB');
    return data.binary;
  }

  async loadDb(binary: Uint8Array): Promise<boolean> {
    await this.send('LOAD_DB', { binary });
    return true;
  }

  async resetDb(schemaSql: string, datasetSql: string): Promise<SqlDatabaseSchema> {
    const data = await this.send<{ schema: SqlDatabaseSchema }>('RESET_DB', {
      schemaSql,
      datasetSql,
    }, 15000);
    return data.schema || {};
  }

  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.pendingRequests.forEach(({ timer, reject }) => {
      clearTimeout(timer);
      reject(new Error('Worker terminated'));
    });
    this.pendingRequests.clear();
    this.isReady = false;
  }

  get ready(): boolean {
    return this.isReady;
  }
}

// Singleton worker instance
export const sqlEngine = new SqlWorkerClient();

