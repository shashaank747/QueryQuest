import {
  CellFormat,
  CellFormatOptions,
  ComputedValue,
  isCellError,
} from './types';

/**
 * Formats a raw or computed cell value into its display string.
 */
export function formatCellValue(
  value: ComputedValue | undefined,
  format: CellFormat = 'general',
  options: CellFormatOptions = {}
): string {
  if (value === undefined || value === null || value === '') {
    return '';
  }

  // Errors always display as their literal error tag (e.g. #VALUE!, #DIV/0!)
  if (isCellError(value)) {
    return value;
  }

  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }

  const numDecimals = options.decimalPlaces !== undefined ? options.decimalPlaces : 2;
  const currencySymbol = options.currencySymbol || '$';
  const useCommas = options.thousandsSeparator !== false;

  // Handle Date instances
  if (value instanceof Date) {
    return formatDate(value, options.dateFormat);
  }

  switch (format) {
    case 'number': {
      const num = Number(value);
      if (isNaN(num)) return String(value);
      return formatNumberWithCommas(num, numDecimals, useCommas);
    }

    case 'currency': {
      const num = Number(value);
      if (isNaN(num)) return String(value);
      const isNegative = num < 0;
      const absFormatted = formatNumberWithCommas(Math.abs(num), numDecimals, useCommas);
      return isNegative ? `-${currencySymbol}${absFormatted}` : `${currencySymbol}${absFormatted}`;
    }

    case 'percent': {
      const num = Number(value);
      if (isNaN(num)) return String(value);
      const percentVal = num * 100;
      const decimals = options.decimalPlaces !== undefined ? options.decimalPlaces : 0;
      return `${formatNumberWithCommas(percentVal, decimals, useCommas)}%`;
    }

    case 'date': {
      // Could be number (Excel serial date where 1 = Jan 1 1900) or date string
      const dateObj = parseAnyDate(value);
      if (!dateObj) return String(value);
      return formatDate(dateObj, options.dateFormat);
    }

    case 'text':
      return String(value);

    case 'general':
    default: {
      if (typeof value === 'number') {
        // Clean up JS floating point quirks like 0.30000000000000004
        if (Number.isInteger(value)) {
          return String(value);
        }
        const rounded = parseFloat(value.toPrecision(12));
        return String(rounded);
      }
      return String(value);
    }
  }
}

/**
 * Formats a number with comma grouping and fixed decimal precision
 */
function formatNumberWithCommas(
  num: number,
  decimals: number,
  useCommas: boolean
): string {
  const fixed = num.toFixed(decimals);
  if (!useCommas) return fixed;

  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/**
 * Parses an Excel serial number, date string, or Date
 */
export function parseAnyDate(val: any): Date | null {
  if (val instanceof Date) return val;

  if (typeof val === 'number') {
    // Excel serial date: 1 = 1900-01-01
    // (Note: Excel leap year bug in 1900 means offset is usually 25569 days to 1970-01-01)
    const msPerDay = 86400000;
    const excelEpoch = new Date(1899, 11, 30).getTime();
    return new Date(excelEpoch + val * msPerDay);
  }

  if (typeof val === 'string') {
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  return null;
}

/**
 * Formats a Date object to YYYY-MM-DD
 */
function formatDate(d: Date, formatPattern?: string): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');

  if (formatPattern === 'MM/DD/YYYY') {
    return `${mm}/${dd}/${yyyy}`;
  }
  if (formatPattern === 'DD/MM/YYYY') {
    return `${dd}/${mm}/${yyyy}`;
  }
  return `${yyyy}-${mm}-${dd}`;
}
