/**
 * Core Excel Engine Types & Coordinate Utilities
 */

export type CellValue = string | number | boolean | Date | null;

export type CellError =
  | '#VALUE!'
  | '#REF!'
  | '#DIV/0!'
  | '#N/A'
  | '#NAME?'
  | '#NUM!'
  | '#NULL!';

export type ComputedValue = CellValue | CellError;

export type CellFormat =
  | 'general'
  | 'currency'
  | 'percent'
  | 'number'
  | 'date'
  | 'text';

export interface CellFormatOptions {
  currencySymbol?: string;
  decimalPlaces?: number;
  dateFormat?: string;
  thousandsSeparator?: boolean;
}

export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: 'left' | 'center' | 'right';
  fill?: string;
  color?: string;
  fontSize?: number;
  border?: boolean | string;
  wrapText?: boolean;
}

export interface CellData {
  raw?: CellValue;
  formula?: string; // Starts with '=', e.g. "=SUM(B2:B10)"
  value?: ComputedValue;
  format?: CellFormat;
  formatOptions?: CellFormatOptions;
  style?: CellStyle;
  displayValue?: string;
}

export interface SheetData {
  name: string;
  cells: Record<string, CellData>; // Keyed by normalized cell ID, e.g. "A1", "B4"
  rowCount: number;
  colCount: number;
}

export interface WorkbookData {
  sheets: Record<string, SheetData>;
  activeSheet: string;
  sheetOrder?: string[];
}

export interface CellCoord {
  col: number; // 1-based (1 = A, 2 = B, ...)
  row: number; // 1-based (1, 2, 3, ...)
  absCol?: boolean; // true if '$' prefix before column
  absRow?: boolean; // true if '$' prefix before row
  sheet?: string;
}

export interface CellRange {
  start: CellCoord;
  end: CellCoord;
  sheet?: string;
}

export interface RangeValue {
  type: 'range';
  sheet: string;
  start: CellCoord;
  end: CellCoord;
  values: ComputedValue[][]; // 2D grid of values [rowIdx][colIdx]
}

export type EvalResult = ComputedValue | RangeValue;

export interface EvaluationContext {
  workbook: WorkbookData;
  currentSheet: string;
  visitedCells?: Set<string>;
}

// -------------------------------------------------------------
// Coordinate Utilities
// -------------------------------------------------------------

/**
 * Converts a 1-based column index to letter(s): 1 -> A, 26 -> Z, 27 -> AA
 */
export function colToLetter(col: number): string {
  if (col < 1) return 'A';
  let letter = '';
  let temp = col;
  while (temp > 0) {
    const rem = (temp - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    temp = Math.floor((temp - 1) / 26);
  }
  return letter;
}

/**
 * Converts column letter(s) to 1-based index: A -> 1, Z -> 26, AA -> 27
 */
export function letterToCol(colStr: string): number {
  if (!colStr) return 0;
  let col = 0;
  const upper = colStr.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    const code = upper.charCodeAt(i);
    if (code < 65 || code > 90) return 0;
    col = col * 26 + (code - 64);
  }
  return col;
}

/**
 * Formats a CellCoord into an A1 representation (e.g. $A$1, Sheet2!B4)
 */
export function cellCoordToA1(coord: CellCoord): string {
  const sheetPrefix = coord.sheet
    ? coord.sheet.includes(' ')
      ? `'${coord.sheet}'!`
      : `${coord.sheet}!`
    : '';
  const colPrefix = coord.absCol ? '$' : '';
  const rowPrefix = coord.absRow ? '$' : '';
  return `${sheetPrefix}${colPrefix}${colToLetter(coord.col)}${rowPrefix}${coord.row}`;
}

/**
 * Converts (col, row) coordinates to standard A1 key (e.g. (2, 4) -> "B4")
 */
export function coordsToCellId(
  col: number,
  row: number,
  options?: { absCol?: boolean; absRow?: boolean; sheet?: string }
): string {
  return cellCoordToA1({
    col,
    row,
    absCol: options?.absCol,
    absRow: options?.absRow,
    sheet: options?.sheet,
  });
}

/**
 * Parses an A1-style reference (e.g. "A1", "$B$4", "Sheet1!C10", "'Sales 2024'!$D$5")
 */
export function parseCellCoord(ref: string): CellCoord | null {
  if (!ref || typeof ref !== 'string') return null;
  const trimmed = ref.trim();
  const match = trimmed.match(
    /^(?:(?:'([^']+)'|([A-Za-z0-9_]+))!)?(\$?)([A-Za-z]+)(\$?)([1-9][0-9]*)$/
  );
  if (!match) return null;

  const sheet = match[1] || match[2] || undefined;
  const absCol = match[3] === '$';
  const colStr = match[4];
  const absRow = match[5] === '$';
  const row = parseInt(match[6], 10);
  const col = letterToCol(colStr);

  if (col < 1 || isNaN(row) || row < 1) return null;

  return {
    col,
    row,
    absCol,
    absRow,
    sheet,
  };
}

/**
 * Parses a range string like "A1:B10" or "Sheet1!A1:C5"
 */
export function parseRange(rangeStr: string): CellRange | null {
  if (!rangeStr || typeof rangeStr !== 'string') return null;
  const trimmed = rangeStr.trim();
  const parts = trimmed.split(':');
  if (parts.length !== 2) return null;

  const startCoord = parseCellCoord(parts[0]);
  if (!startCoord) return null;

  let endCoord = parseCellCoord(parts[1]);
  if (!endCoord) {
    // End coord might not have sheet name prefix, inherit from start
    if (startCoord.sheet) {
      endCoord = parseCellCoord(`${startCoord.sheet}!${parts[1]}`);
    }
    if (!endCoord) return null;
  }

  const sheet = startCoord.sheet || endCoord.sheet;

  // Normalize so start is top-left, end is bottom-right
  const minCol = Math.min(startCoord.col, endCoord.col);
  const maxCol = Math.max(startCoord.col, endCoord.col);
  const minRow = Math.min(startCoord.row, endCoord.row);
  const maxRow = Math.max(startCoord.row, endCoord.row);

  return {
    start: {
      col: minCol,
      row: minRow,
      absCol: startCoord.absCol,
      absRow: startCoord.absRow,
      sheet,
    },
    end: {
      col: maxCol,
      row: maxRow,
      absCol: endCoord.absCol,
      absRow: endCoord.absRow,
      sheet,
    },
    sheet,
  };
}

/**
 * Returns an array of cell coordinates (e.g. ["A1", "A2", "B1", "B2"]) within a range
 */
export function getCellsInRange(range: string | CellRange): string[] {
  const parsedRange = typeof range === 'string' ? parseRange(range) : range;
  if (!parsedRange) return [];

  const cells: string[] = [];
  const minCol = Math.min(parsedRange.start.col, parsedRange.end.col);
  const maxCol = Math.max(parsedRange.start.col, parsedRange.end.col);
  const minRow = Math.min(parsedRange.start.row, parsedRange.end.row);
  const maxRow = Math.max(parsedRange.start.row, parsedRange.end.row);

  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      cells.push(`${colToLetter(c)}${r}`);
    }
  }

  return cells;
}

/**
 * Normalizes a cell reference to uppercase without unnecessary spaces
 */
export function normalizeCellRef(ref: string): string {
  const coord = parseCellCoord(ref);
  if (!coord) return ref.trim().toUpperCase();
  return cellCoordToA1(coord);
}

/**
 * Checks if a string is an Excel error value
 */
export function isCellError(value: any): value is CellError {
  return (
    typeof value === 'string' &&
    ['#VALUE!', '#REF!', '#DIV/0!', '#N/A', '#NAME?', '#NUM!', '#NULL!'].includes(
      value
    )
  );
}
