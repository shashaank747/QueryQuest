/**
 * Web Worker for SQLite WebAssembly execution using sql.js.
 * Runs off the main UI thread to prevent lag and frame drops.
 */

import initSqlJs from 'sql.js';

let SQL: any = null;
let db: any = null;
let isInitialized = false;

interface WorkerMessage {
  id: string;
  type: 'INIT' | 'EXECUTE' | 'GET_SCHEMA' | 'EXPORT_DB' | 'LOAD_DB' | 'RESET_DB' | 'PREVIEW_TABLE';
  payload?: any;
}

function determineAction(sql: string): 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'CREATE' | 'ALTER' | 'DROP' | 'TRANSACTION' | 'OTHER' {
  const clean = sql
    .replace(/--[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .trim()
    .toUpperCase();
  if (/^(BEGIN|COMMIT|ROLLBACK)/.test(clean)) return 'TRANSACTION';
  if (/^SELECT\b|^WITH\b|^EXPLAIN\b/.test(clean)) return 'SELECT';
  if (/^INSERT\b/.test(clean)) return 'INSERT';
  if (/^UPDATE\b/.test(clean)) return 'UPDATE';
  if (/^DELETE\b/.test(clean)) return 'DELETE';
  if (/^CREATE\b/.test(clean)) return 'CREATE';
  if (/^ALTER\b/.test(clean)) return 'ALTER';
  if (/^DROP\b/.test(clean)) return 'DROP';
  return 'OTHER';
}

async function initSql(binary?: Uint8Array) {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file: string) => `/${file}`,
    });
  }

  if (binary && binary.byteLength > 0) {
    try {
      db = new SQL.Database(binary);
    } catch (e) {
      console.warn('Failed to load database binary snapshot, initializing fresh database:', e);
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
  }

  db.exec('PRAGMA foreign_keys = ON;');
  isInitialized = true;
}

function extractSchema() {
  if (!db) return {};

  const tablesQuery = `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name ASC;`;
  const tablesRes = db.exec(tablesQuery);
  const schema: Record<string, any> = {};

  if (tablesRes.length > 0 && tablesRes[0].values) {
    for (const [tableName] of tablesRes[0].values) {
      // Get column info
      const colRes = db.exec(`PRAGMA table_info("${tableName}");`);
      const columns = (colRes.length > 0 && colRes[0].values)
        ? colRes[0].values.map((c: any) => ({
            cid: c[0],
            name: c[1],
            type: c[2],
            notnull: c[3],
            dflt_value: c[4],
            pk: c[5],
          }))
        : [];

      // Get foreign key info
      const fkRes = db.exec(`PRAGMA foreign_key_list("${tableName}");`);
      const foreignKeys = (fkRes.length > 0 && fkRes[0].values)
        ? fkRes[0].values.map((f: any) => ({
            id: f[0],
            seq: f[1],
            table: f[2],
            from: f[3],
            to: f[4],
            on_update: f[5],
            on_delete: f[6],
            match: f[7],
          }))
        : [];

      // Get count
      let rowCount = 0;
      try {
        const countRes = db.exec(`SELECT COUNT(*) FROM "${tableName}";`);
        if (countRes.length > 0 && countRes[0].values[0]) {
          rowCount = Number(countRes[0].values[0][0]);
        }
      } catch (e) {
        // Ignored
      }

      schema[tableName] = {
        name: tableName,
        columns,
        foreignKeys,
        rowCount,
      };
    }
  }

  return schema;
}

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { id, type, payload } = e.data;

  try {
    switch (type) {
      case 'INIT': {
        await initSql(payload?.binary);
        self.postMessage({ id, success: true, isInitialized: true });
        break;
      }

      case 'EXECUTE': {
        if (!db || !isInitialized) {
          await initSql();
        }

        const sql = payload.sql || '';
        const startTime = performance.now();
        const action = determineAction(sql);

        // Strip SQL comments to inspect user intentions accurately
        const strippedSql = sql
          .replace(/--[^\n]*/g, '')
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .trim();

        // Disallow dangerous external actions or simulated commands not in SQLite
        if (/^\s*drop\s+database/i.test(strippedSql)) {
          throw new Error('DROP DATABASE is not supported. Use DROP TABLE to remove specific tables.');
        }

        if (/^\s*create\s+database/i.test(strippedSql)) {
          throw new Error('In SQLite, the database is already created and connected. You do not need to run CREATE DATABASE — proceed directly with CREATE TABLE.');
        }

        if (/^\s*use\s+[\w_]+/i.test(strippedSql)) {
          throw new Error('In SQLite, the active world database is already connected. You do not need to run USE — execute your queries directly.');
        }

        // Allow students to cleanly iterate on CREATE TABLE statements without "table already exists" error
        const createTableRegex = /(?:^|;)\s*CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["`]?([a-zA-Z0-9_]+)["`]?/gi;
        let match: RegExpExecArray | null;
        while ((match = createTableRegex.exec(strippedSql)) !== null) {
          const targetTable = match[1];
          try {
            db.exec(`PRAGMA foreign_keys = OFF;`);
            db.exec(`DROP TABLE IF EXISTS "${targetTable}";`);
            db.exec(`PRAGMA foreign_keys = ON;`);
          } catch (e) {
            // Ignored
          }
        }

        // Execute query
        const results = db.exec(sql);
        const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;
        const rowsAffected = db.getRowsModified ? db.getRowsModified() : 0;

        self.postMessage({
          id,
          success: true,
          query: sql,
          action,
          results,
          rowsAffected,
          executionTimeMs,
        });
        break;
      }

      case 'GET_SCHEMA': {
        const schema = extractSchema();
        self.postMessage({ id, success: true, schema });
        break;
      }

      case 'PREVIEW_TABLE': {
        if (!db) throw new Error('Database not initialized');
        const tableName = payload.tableName;
        const limit = payload.limit || 20;
        const results = db.exec(`SELECT * FROM "${tableName}" LIMIT ${limit};`);
        self.postMessage({ id, success: true, results });
        break;
      }

      case 'EXPORT_DB': {
        if (!db) throw new Error('Database not initialized');
        const binary = db.export();
        (self as any).postMessage({ id, success: true, binary }, [binary.buffer]);
        break;
      }

      case 'LOAD_DB': {
        await initSql(payload.binary);
        self.postMessage({ id, success: true });
        break;
      }

      case 'RESET_DB': {
        if (!SQL) await initSql();
        db = new SQL.Database();
        db.exec('PRAGMA foreign_keys = ON;');
        if (payload?.schemaSql) {
          db.exec(payload.schemaSql);
        }
        if (payload?.datasetSql) {
          db.exec(payload.datasetSql);
        }
        const schema = extractSchema();
        self.postMessage({ id, success: true, schema });
        break;
      }

      default:
        throw new Error(`Unknown worker message type: ${type}`);
    }
  } catch (err: any) {
    self.postMessage({
      id,
      success: false,
      error: err?.message || String(err),
    });
  }
};
export {};
