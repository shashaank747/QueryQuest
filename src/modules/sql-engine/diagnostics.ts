/**
 * Diagnostic assistant for SQL beginners.
 * Translates raw SQLite error messages into contextual educational advice.
 */

export function generateSqlDiagnostic(errorMessage: string, sql: string): string {
  const err = errorMessage.toLowerCase();
  const trimmed = sql.trim();

  if (err.includes('syntax error')) {
    const nearMatch = errorMessage.match(/near\s+["'](.*?)["']/i);
    if (nearMatch && nearMatch[1]) {
      const token = nearMatch[1];
      if (token === ')') {
        return `Syntax error near ")": You may have a trailing comma before the closing parenthesis or mismatched brackets.`;
      }
      if (token === '(') {
        return `Syntax error near "(": Check whether the preceding keyword (like VALUES) is missing or spelled correctly.`;
      }
      return `Syntax error near "${token}". Verify spelling of SQL keywords (e.g. SELECT, FROM, WHERE, GROUP BY, INSERT INTO) and check for missing commas or quotes.`;
    }
    return `There is a syntax error in your query. Double-check your SQL keywords, table names, and matching parentheses/quotes.`;
  }

  if (err.includes('no such table')) {
    const tableMatch = errorMessage.match(/no such table:\s*([\w_]+)/i);
    const tbl = tableMatch ? tableMatch[1] : 'the table';
    return `Table "${tbl}" was not found in the database. Check the Database Explorer panel on the right for available table names and spelling.`;
  }

  if (err.includes('no such column')) {
    const colMatch = errorMessage.match(/no such column:\s*([\w_]+)/i);
    const col = colMatch ? colMatch[1] : 'the column';
    return `Column "${col}" does not exist. Check the column names and spelling in the Database Explorer panel. Also ensure string literals use single quotes ('value') instead of double quotes.`;
  }

  if (err.includes('unique constraint failed')) {
    const match = errorMessage.match(/unique constraint failed:\s*(.+)/i);
    const target = match ? match[1] : 'a column';
    return `Unique constraint violation on ${target}. A record with this primary key or unique identifier already exists.`;
  }

  if (err.includes('not null constraint failed')) {
    const match = errorMessage.match(/not null constraint failed:\s*(.+)/i);
    const target = match ? match[1] : 'a column';
    return `NOT NULL constraint violation on ${target}. This field is required and cannot be omitted or set to NULL.`;
  }

  if (err.includes('foreign key constraint failed')) {
    return `Foreign key constraint failed: You are referencing an identifier that does not exist in the parent table. Ensure the parent record exists before linking.`;
  }

  if (err.includes('misuse of aggregate:')) {
    return `Misuse of aggregate function: In SQL, aggregate functions like COUNT(), SUM(), AVG() cannot be placed directly inside a WHERE clause. Use a HAVING clause or subquery instead.`;
  }

  if (/drop\s+database/i.test(trimmed)) {
    return `SQLite operates in an isolated world file. DROP DATABASE is not supported; use DROP TABLE to remove specific tables.`;
  }

  return `Database error: ${errorMessage}. Review your query structure and the schema explorer.`;
}
