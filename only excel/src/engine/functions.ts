import {
  ComputedValue,
  EvalResult,
  isCellError,
} from './types';
import { parseAnyDate } from './format';

/**
 * Normalizes an EvalResult into a scalar ComputedValue.
 * If a RangeValue is passed to a scalar context, Excel returns the top-left cell.
 */
export function toScalar(val: EvalResult | undefined): ComputedValue {
  if (val === undefined || val === null) return null;
  if (typeof val === 'object' && 'type' in val && val.type === 'range') {
    if (val.values.length > 0 && val.values[0].length > 0) {
      return val.values[0][0];
    }
    return null;
  }
  return val as ComputedValue;
}

/**
 * Flattens all arguments (scalars and 2D RangeValues) into a flat array of ComputedValues.
 */
export function flattenArgs(args: EvalResult[]): ComputedValue[] {
  const result: ComputedValue[] = [];
  for (const arg of args) {
    if (arg === undefined || arg === null) {
      continue;
    }
    if (typeof arg === 'object' && 'type' in arg && arg.type === 'range') {
      for (const row of arg.values) {
        for (const cell of row) {
          result.push(cell);
        }
      }
    } else {
      result.push(arg as ComputedValue);
    }
  }
  return result;
}

/**
 * Converts a 1D or 2D RangeValue or array into a flat 1D array of values.
 */
export function to1DArray(arg: EvalResult): ComputedValue[] {
  if (typeof arg === 'object' && arg !== null && 'type' in arg && arg.type === 'range') {
    const list: ComputedValue[] = [];
    for (const row of arg.values) {
      for (const cell of row) {
        list.push(cell);
      }
    }
    return list;
  }
  return [toScalar(arg)];
}

/**
 * Converts a RangeValue or scalar into a 2D array of ComputedValues.
 */
export function to2DArray(arg: EvalResult): ComputedValue[][] {
  if (typeof arg === 'object' && arg !== null && 'type' in arg && arg.type === 'range') {
    return arg.values;
  }
  return [[toScalar(arg)]];
}

/**
 * Excel-compliant criteria matcher for SUMIF, COUNTIF, AVERAGEIF, etc.
 * Supports:
 * - Comparison operators: ">50", "<=10", "<>0", "=Apple"
 * - Wildcards: "*berry", "???"
 * - Plain exact match (case-insensitive for strings)
 */
export function matchesCriteria(cellValue: any, criteria: any): boolean {
  if (criteria === null || criteria === undefined || criteria === '') {
    return cellValue === null || cellValue === undefined || cellValue === '';
  }

  const critStr = String(criteria);

  // Check for operators at start: >=, <=, <>, >, <, =
  const opMatch = critStr.match(/^(>=|<=|<>|>|<|=)(.*)$/);
  if (opMatch) {
    const op = opMatch[1];
    const targetStr = opMatch[2].trim();
    const targetNum = Number(targetStr);
    const cellNum = typeof cellValue === 'number' ? cellValue : Number(cellValue);

    if (
      !isNaN(targetNum) &&
      !isNaN(cellNum) &&
      cellValue !== null &&
      cellValue !== ''
    ) {
      switch (op) {
        case '>':
          return cellNum > targetNum;
        case '>=':
          return cellNum >= targetNum;
        case '<':
          return cellNum < targetNum;
        case '<=':
          return cellNum <= targetNum;
        case '<>':
          return cellNum !== targetNum;
        case '=':
          return cellNum === targetNum;
      }
    } else {
      // Lexicographic string comparison
      const cStr =
        cellValue === null || cellValue === undefined
          ? ''
          : String(cellValue).toLowerCase();
      const tStr = targetStr.toLowerCase();
      switch (op) {
        case '>':
          return cStr > tStr;
        case '>=':
          return cStr >= tStr;
        case '<':
          return cStr < tStr;
        case '<=':
          return cStr <= tStr;
        case '<>':
          return cStr !== tStr;
        case '=':
          return cStr === tStr;
      }
    }
  }

  // Check wildcards: * and ?
  if (critStr.includes('*') || critStr.includes('?')) {
    const cStr =
      cellValue === null || cellValue === undefined ? '' : String(cellValue);
    const escaped = critStr
      .replace(/([.+^$[\]\\(){}|])/g, '\\$1')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    const regex = new RegExp(`^${escaped}$`, 'i');
    return regex.test(cStr);
  }

  // Exact numeric match
  if (typeof cellValue === 'number' && !isNaN(Number(critStr))) {
    return cellValue === Number(critStr);
  }

  // Boolean match
  if (typeof cellValue === 'boolean') {
    return cellValue === (critStr.toUpperCase() === 'TRUE');
  }

  // Case-insensitive string match
  const cStr =
    cellValue === null || cellValue === undefined
      ? ''
      : String(cellValue).toLowerCase();
  return cStr === critStr.toLowerCase();
}

/**
 * Excel Built-in Function Implementations
 */
export const EXCEL_FUNCTIONS: Record<
  string,
  (args: EvalResult[]) => ComputedValue
> = {
  // -------------------------------------------------------------
  // Math & Statistical Functions
  // -------------------------------------------------------------

  SUM: (args: EvalResult[]): ComputedValue => {
    let sum = 0;
    const flat = flattenArgs(args);
    for (const val of flat) {
      if (isCellError(val)) return val;
      if (typeof val === 'number') {
        sum += val;
      } else if (typeof val === 'string' && val.trim() !== '') {
        // Direct string argument parsed as number if applicable
        const num = Number(val);
        if (!isNaN(num)) sum += num;
      }
    }
    return sum;
  },

  AVERAGE: (args: EvalResult[]): ComputedValue => {
    let sum = 0;
    let count = 0;
    const flat = flattenArgs(args);
    for (const val of flat) {
      if (isCellError(val)) return val;
      if (typeof val === 'number') {
        sum += val;
        count++;
      }
    }
    if (count === 0) return '#DIV/0!';
    return sum / count;
  },

  COUNT: (args: EvalResult[]): ComputedValue => {
    let count = 0;
    const flat = flattenArgs(args);
    for (const val of flat) {
      if (typeof val === 'number') {
        count++;
      }
    }
    return count;
  },

  COUNTA: (args: EvalResult[]): ComputedValue => {
    let count = 0;
    const flat = flattenArgs(args);
    for (const val of flat) {
      if (val !== null && val !== undefined && val !== '') {
        count++;
      }
    }
    return count;
  },

  COUNTBLANK: (args: EvalResult[]): ComputedValue => {
    if (args.length === 0) return 0;
    let blanks = 0;
    const flat = flattenArgs(args);
    for (const val of flat) {
      if (val === null || val === undefined || val === '') {
        blanks++;
      }
    }
    return blanks;
  },

  MIN: (args: EvalResult[]): ComputedValue => {
    let minVal: number | null = null;
    const flat = flattenArgs(args);
    for (const val of flat) {
      if (isCellError(val)) return val;
      if (typeof val === 'number') {
        if (minVal === null || val < minVal) {
          minVal = val;
        }
      }
    }
    return minVal === null ? 0 : minVal;
  },

  MAX: (args: EvalResult[]): ComputedValue => {
    let maxVal: number | null = null;
    const flat = flattenArgs(args);
    for (const val of flat) {
      if (isCellError(val)) return val;
      if (typeof val === 'number') {
        if (maxVal === null || val > maxVal) {
          maxVal = val;
        }
      }
    }
    return maxVal === null ? 0 : maxVal;
  },

  ROUND: (args: EvalResult[]): ComputedValue => {
    if (args.length < 1) return '#VALUE!';
    const num = Number(toScalar(args[0]));
    const digits = args.length > 1 ? Number(toScalar(args[1])) : 0;
    if (isNaN(num) || isNaN(digits)) return '#VALUE!';
    const factor = Math.pow(10, digits);
    return Math.round(num * factor) / factor;
  },

  ROUNDUP: (args: EvalResult[]): ComputedValue => {
    if (args.length < 1) return '#VALUE!';
    const num = Number(toScalar(args[0]));
    const digits = args.length > 1 ? Number(toScalar(args[1])) : 0;
    if (isNaN(num) || isNaN(digits)) return '#VALUE!';
    const factor = Math.pow(10, digits);
    const sign = num >= 0 ? 1 : -1;
    return (sign * Math.ceil(Math.abs(num) * factor)) / factor;
  },

  ROUNDDOWN: (args: EvalResult[]): ComputedValue => {
    if (args.length < 1) return '#VALUE!';
    const num = Number(toScalar(args[0]));
    const digits = args.length > 1 ? Number(toScalar(args[1])) : 0;
    if (isNaN(num) || isNaN(digits)) return '#VALUE!';
    const factor = Math.pow(10, digits);
    const sign = num >= 0 ? 1 : -1;
    return (sign * Math.floor(Math.abs(num) * factor)) / factor;
  },

  ABS: (args: EvalResult[]): ComputedValue => {
    if (args.length < 1) return '#VALUE!';
    const num = Number(toScalar(args[0]));
    return isNaN(num) ? '#VALUE!' : Math.abs(num);
  },

  INT: (args: EvalResult[]): ComputedValue => {
    if (args.length < 1) return '#VALUE!';
    const num = Number(toScalar(args[0]));
    return isNaN(num) ? '#VALUE!' : Math.floor(num);
  },

  MOD: (args: EvalResult[]): ComputedValue => {
    if (args.length < 2) return '#VALUE!';
    const num = Number(toScalar(args[0]));
    const div = Number(toScalar(args[1]));
    if (isNaN(num) || isNaN(div)) return '#VALUE!';
    if (div === 0) return '#DIV/0!';
    return ((num % div) + div) % div;
  },

  POWER: (args: EvalResult[]): ComputedValue => {
    if (args.length < 2) return '#VALUE!';
    const base = Number(toScalar(args[0]));
    const exp = Number(toScalar(args[1]));
    if (isNaN(base) || isNaN(exp)) return '#VALUE!';
    return Math.pow(base, exp);
  },

  SQRT: (args: EvalResult[]): ComputedValue => {
    if (args.length < 1) return '#VALUE!';
    const num = Number(toScalar(args[0]));
    if (isNaN(num)) return '#VALUE!';
    if (num < 0) return '#NUM!';
    return Math.sqrt(num);
  },

  // -------------------------------------------------------------
  // Logic Functions
  // -------------------------------------------------------------

  AND: (args: EvalResult[]): ComputedValue => {
    if (args.length === 0) return '#VALUE!';
    const flat = flattenArgs(args);
    for (const val of flat) {
      if (isCellError(val)) return val;
      if (!val) return false;
      if (typeof val === 'number' && val === 0) return false;
    }
    return true;
  },

  OR: (args: EvalResult[]): ComputedValue => {
    if (args.length === 0) return '#VALUE!';
    const flat = flattenArgs(args);
    let hasTrue = false;
    for (const val of flat) {
      if (isCellError(val)) return val;
      if (val === true || (typeof val === 'number' && val !== 0)) {
        hasTrue = true;
      }
    }
    return hasTrue;
  },

  NOT: (args: EvalResult[]): ComputedValue => {
    if (args.length < 1) return '#VALUE!';
    const val = toScalar(args[0]);
    if (isCellError(val)) return val;
    if (typeof val === 'number') return val === 0;
    return !val;
  },

  // -------------------------------------------------------------
  // Conditional Aggregations
  // -------------------------------------------------------------

  SUMIF: (args: EvalResult[]): ComputedValue => {
    if (args.length < 2) return '#VALUE!';
    const range = to1DArray(args[0]);
    const criteria = toScalar(args[1]);
    const sumRange = args.length > 2 ? to1DArray(args[2]) : range;

    let sum = 0;
    const len = Math.min(range.length, sumRange.length);
    for (let i = 0; i < len; i++) {
      const cellVal = range[i];
      if (matchesCriteria(cellVal, criteria)) {
        const sumVal = Number(sumRange[i]);
        if (!isNaN(sumVal)) {
          sum += sumVal;
        }
      }
    }
    return sum;
  },

  COUNTIF: (args: EvalResult[]): ComputedValue => {
    if (args.length < 2) return '#VALUE!';
    const range = to1DArray(args[0]);
    const criteria = toScalar(args[1]);

    let count = 0;
    for (const cellVal of range) {
      if (matchesCriteria(cellVal, criteria)) {
        count++;
      }
    }
    return count;
  },

  AVERAGEIF: (args: EvalResult[]): ComputedValue => {
    if (args.length < 2) return '#VALUE!';
    const range = to1DArray(args[0]);
    const criteria = toScalar(args[1]);
    const avgRange = args.length > 2 ? to1DArray(args[2]) : range;

    let sum = 0;
    let count = 0;
    const len = Math.min(range.length, avgRange.length);
    for (let i = 0; i < len; i++) {
      const cellVal = range[i];
      if (matchesCriteria(cellVal, criteria)) {
        const avgVal = Number(avgRange[i]);
        if (!isNaN(avgVal)) {
          sum += avgVal;
          count++;
        }
      }
    }
    if (count === 0) return '#DIV/0!';
    return sum / count;
  },

  // -------------------------------------------------------------
  // Text Functions
  // -------------------------------------------------------------

  LEFT: (args: EvalResult[]): ComputedValue => {
    if (args.length < 1) return '#VALUE!';
    const text = String(toScalar(args[0]) ?? '');
    const numChars = args.length > 1 ? Number(toScalar(args[1])) : 1;
    if (isNaN(numChars) || numChars < 0) return '#VALUE!';
    return text.substring(0, numChars);
  },

  RIGHT: (args: EvalResult[]): ComputedValue => {
    if (args.length < 1) return '#VALUE!';
    const text = String(toScalar(args[0]) ?? '');
    const numChars = args.length > 1 ? Number(toScalar(args[1])) : 1;
    if (isNaN(numChars) || numChars < 0) return '#VALUE!';
    return text.substring(Math.max(0, text.length - numChars));
  },

  MID: (args: EvalResult[]): ComputedValue => {
    if (args.length < 3) return '#VALUE!';
    const text = String(toScalar(args[0]) ?? '');
    const startNum = Number(toScalar(args[1]));
    const numChars = Number(toScalar(args[2]));
    if (isNaN(startNum) || isNaN(numChars) || startNum < 1 || numChars < 0) {
      return '#VALUE!';
    }
    return text.substring(startNum - 1, startNum - 1 + numChars);
  },

  LEN: (args: EvalResult[]): ComputedValue => {
    if (args.length < 1) return 0;
    const text = String(toScalar(args[0]) ?? '');
    return text.length;
  },

  TRIM: (args: EvalResult[]): ComputedValue => {
    if (args.length < 1) return '';
    const text = String(toScalar(args[0]) ?? '');
    return text.trim().replace(/\s+/g, ' ');
  },

  UPPER: (args: EvalResult[]): ComputedValue => {
    if (args.length < 1) return '';
    const text = String(toScalar(args[0]) ?? '');
    return text.toUpperCase();
  },

  LOWER: (args: EvalResult[]): ComputedValue => {
    if (args.length < 1) return '';
    const text = String(toScalar(args[0]) ?? '');
    return text.toLowerCase();
  },

  PROPER: (args: EvalResult[]): ComputedValue => {
    if (args.length < 1) return '';
    const text = String(toScalar(args[0]) ?? '').toLowerCase();
    return text.replace(/\b\w/g, (c) => c.toUpperCase());
  },

  CONCAT: (args: EvalResult[]): ComputedValue => {
    const flat = flattenArgs(args);
    return flat.map((v) => (v === null || v === undefined ? '' : String(v))).join('');
  },

  TEXTJOIN: (args: EvalResult[]): ComputedValue => {
    if (args.length < 3) return '#VALUE!';
    const delimiter = String(toScalar(args[0]) ?? '');
    const ignoreEmpty = Boolean(toScalar(args[1]));
    const flat = flattenArgs(args.slice(2));

    const parts: string[] = [];
    for (const v of flat) {
      if (v === null || v === undefined || v === '') {
        if (!ignoreEmpty) parts.push('');
      } else {
        parts.push(String(v));
      }
    }
    return parts.join(delimiter);
  },

  // -------------------------------------------------------------
  // Date Functions
  // -------------------------------------------------------------

  TODAY: (): ComputedValue => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  },

  NOW: (): ComputedValue => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  },

  DATE: (args: EvalResult[]): ComputedValue => {
    if (args.length < 3) return '#VALUE!';
    const year = Number(toScalar(args[0]));
    const month = Number(toScalar(args[1]));
    const day = Number(toScalar(args[2]));
    if (isNaN(year) || isNaN(month) || isNaN(day)) return '#VALUE!';

    const d = new Date(year, month - 1, day);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  },

  YEAR: (args: EvalResult[]): ComputedValue => {
    if (args.length < 1) return '#VALUE!';
    const d = parseAnyDate(toScalar(args[0]));
    if (!d) return '#VALUE!';
    return d.getFullYear();
  },

  MONTH: (args: EvalResult[]): ComputedValue => {
    if (args.length < 1) return '#VALUE!';
    const d = parseAnyDate(toScalar(args[0]));
    if (!d) return '#VALUE!';
    return d.getMonth() + 1;
  },

  DAY: (args: EvalResult[]): ComputedValue => {
    if (args.length < 1) return '#VALUE!';
    const d = parseAnyDate(toScalar(args[0]));
    if (!d) return '#VALUE!';
    return d.getDate();
  },

  // -------------------------------------------------------------
  // Lookup Functions
  // -------------------------------------------------------------

  VLOOKUP: (args: EvalResult[]): ComputedValue => {
    if (args.length < 3) return '#VALUE!';
    const lookupValue = toScalar(args[0]);
    const table = to2DArray(args[1]);
    const colIndex = Number(toScalar(args[2]));
    const rangeLookup = args.length > 3 ? Boolean(toScalar(args[3])) : true;

    if (isNaN(colIndex) || colIndex < 1) return '#REF!';
    if (table.length === 0 || colIndex > table[0].length) return '#REF!';

    const targetColIdx = colIndex - 1;

    // Exact match
    if (!rangeLookup) {
      for (let r = 0; r < table.length; r++) {
        const firstColVal = table[r][0];
        if (matchesCriteria(firstColVal, lookupValue)) {
          return table[r][targetColIdx];
        }
      }
      return '#N/A';
    }

    // Approximate match (assumes ascending order)
    let bestRowIdx = -1;
    const lookupNum = Number(lookupValue);
    const isLookupNumeric = !isNaN(lookupNum) && lookupValue !== null && lookupValue !== '';

    for (let r = 0; r < table.length; r++) {
      const firstColVal = table[r][0];
      if (isLookupNumeric) {
        const cellNum = Number(firstColVal);
        if (!isNaN(cellNum) && cellNum <= lookupNum) {
          bestRowIdx = r;
        } else if (!isNaN(cellNum) && cellNum > lookupNum) {
          break;
        }
      } else {
        const cStr = String(firstColVal || '').toLowerCase();
        const lStr = String(lookupValue || '').toLowerCase();
        if (cStr <= lStr) {
          bestRowIdx = r;
        } else {
          break;
        }
      }
    }

    if (bestRowIdx === -1) return '#N/A';
    return table[bestRowIdx][targetColIdx];
  },

  XLOOKUP: (args: EvalResult[]): ComputedValue => {
    if (args.length < 3) return '#VALUE!';
    const lookupValue = toScalar(args[0]);
    const lookupArray = to1DArray(args[1]);
    const returnArray = to1DArray(args[2]);
    const ifNotFound = args.length > 3 && toScalar(args[3]) !== null ? toScalar(args[3]) : '#N/A';
    const matchMode = args.length > 4 ? Number(toScalar(args[4])) : 0;
    const searchMode = args.length > 5 ? Number(toScalar(args[5])) : 1;

    const indices: number[] = [];
    if (searchMode === -1) {
      for (let i = lookupArray.length - 1; i >= 0; i--) indices.push(i);
    } else {
      for (let i = 0; i < lookupArray.length; i++) indices.push(i);
    }

    let bestIndex = -1;

    if (matchMode === 0) {
      // Exact match
      for (const i of indices) {
        if (matchesCriteria(lookupArray[i], lookupValue)) {
          bestIndex = i;
          break;
        }
      }
    } else if (matchMode === 2) {
      // Wildcard match
      for (const i of indices) {
        if (matchesCriteria(lookupArray[i], lookupValue)) {
          bestIndex = i;
          break;
        }
      }
    } else if (matchMode === -1) {
      // Exact or next smaller
      let smallerDiff: number | null = null;
      const targetNum = Number(lookupValue);
      for (const i of indices) {
        if (matchesCriteria(lookupArray[i], lookupValue)) {
          bestIndex = i;
          break;
        }
        const valNum = Number(lookupArray[i]);
        if (!isNaN(valNum) && !isNaN(targetNum) && valNum < targetNum) {
          const diff = targetNum - valNum;
          if (smallerDiff === null || diff < smallerDiff) {
            smallerDiff = diff;
            bestIndex = i;
          }
        }
      }
    } else if (matchMode === 1) {
      // Exact or next larger
      let largerDiff: number | null = null;
      const targetNum = Number(lookupValue);
      for (const i of indices) {
        if (matchesCriteria(lookupArray[i], lookupValue)) {
          bestIndex = i;
          break;
        }
        const valNum = Number(lookupArray[i]);
        if (!isNaN(valNum) && !isNaN(targetNum) && valNum > targetNum) {
          const diff = valNum - targetNum;
          if (largerDiff === null || diff < largerDiff) {
            largerDiff = diff;
            bestIndex = i;
          }
        }
      }
    }

    if (bestIndex !== -1 && bestIndex < returnArray.length) {
      return returnArray[bestIndex];
    }

    return ifNotFound;
  },

  INDEX: (args: EvalResult[]): ComputedValue => {
    if (args.length < 2) return '#VALUE!';
    const grid = to2DArray(args[0]);
    const rowNum = Number(toScalar(args[1]));
    const colNum = args.length > 2 ? Number(toScalar(args[2])) : 1;

    if (isNaN(rowNum) || isNaN(colNum) || rowNum < 1 || colNum < 1) return '#REF!';
    if (rowNum > grid.length) return '#REF!';
    if (colNum > grid[rowNum - 1].length) return '#REF!';

    return grid[rowNum - 1][colNum - 1];
  },

  MATCH: (args: EvalResult[]): ComputedValue => {
    if (args.length < 2) return '#VALUE!';
    const lookupValue = toScalar(args[0]);
    const list = to1DArray(args[1]);
    const matchType = args.length > 2 ? Number(toScalar(args[2])) : 1;

    if (matchType === 0) {
      // Exact match
      for (let i = 0; i < list.length; i++) {
        if (matchesCriteria(list[i], lookupValue)) {
          return i + 1; // 1-based index
        }
      }
      return '#N/A';
    }

    if (matchType === 1) {
      // Largest value <= lookupValue (assumes sorted ascending)
      let bestIdx = -1;
      const lookupNum = Number(lookupValue);
      const isNum = !isNaN(lookupNum) && lookupValue !== null && lookupValue !== '';

      for (let i = 0; i < list.length; i++) {
        const cell = list[i];
        if (isNum) {
          const cNum = Number(cell);
          if (!isNaN(cNum) && cNum <= lookupNum) {
            bestIdx = i;
          } else if (!isNaN(cNum) && cNum > lookupNum) {
            break;
          }
        } else {
          const cStr = String(cell || '').toLowerCase();
          const lStr = String(lookupValue || '').toLowerCase();
          if (cStr <= lStr) {
            bestIdx = i;
          } else {
            break;
          }
        }
      }

      if (bestIdx === -1) return '#N/A';
      return bestIdx + 1;
    }

    if (matchType === -1) {
      // Smallest value >= lookupValue (assumes sorted descending)
      let bestIdx = -1;
      const lookupNum = Number(lookupValue);
      const isNum = !isNaN(lookupNum) && lookupValue !== null && lookupValue !== '';

      for (let i = 0; i < list.length; i++) {
        const cell = list[i];
        if (isNum) {
          const cNum = Number(cell);
          if (!isNaN(cNum) && cNum >= lookupNum) {
            bestIdx = i;
          } else if (!isNaN(cNum) && cNum < lookupNum) {
            break;
          }
        } else {
          const cStr = String(cell || '').toLowerCase();
          const lStr = String(lookupValue || '').toLowerCase();
          if (cStr >= lStr) {
            bestIdx = i;
          } else {
            break;
          }
        }
      }

      if (bestIdx === -1) return '#N/A';
      return bestIdx + 1;
    }

    return '#N/A';
  },
};
