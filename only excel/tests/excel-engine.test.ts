import { describe, it, expect } from 'vitest';
import {
  CellCoord,
  WorkbookData,
  cellCoordToA1,
  colToLetter,
  coordsToCellId,
  createEmptyWorkbook,
  evaluateCell,
  evaluateFormula,
  evaluateSheet,
  evaluateWorkbook,
  formatCellValue,
  getCellsInRange,
  letterToCol,
  parseCellCoord,
  parseRange,
  setCellValue,
} from '../src/modules/excel/engine';

describe('Excel Engine - Coordinate & Range Utilities', () => {
  it('converts column index to letter and vice-versa', () => {
    expect(colToLetter(1)).toBe('A');
    expect(colToLetter(2)).toBe('B');
    expect(colToLetter(26)).toBe('Z');
    expect(colToLetter(27)).toBe('AA');
    expect(colToLetter(28)).toBe('AB');
    expect(colToLetter(52)).toBe('AZ');
    expect(colToLetter(53)).toBe('BA');
    expect(colToLetter(702)).toBe('ZZ');
    expect(colToLetter(703)).toBe('AAA');

    expect(letterToCol('A')).toBe(1);
    expect(letterToCol('b')).toBe(2);
    expect(letterToCol('Z')).toBe(26);
    expect(letterToCol('AA')).toBe(27);
    expect(letterToCol('AB')).toBe(28);
    expect(letterToCol('AZ')).toBe(52);
    expect(letterToCol('BA')).toBe(53);
    expect(letterToCol('ZZ')).toBe(702);
    expect(letterToCol('AAA')).toBe(703);
  });

  it('parses cell coordinates with various absolute and sheet qualifiers', () => {
    const a1 = parseCellCoord('A1');
    expect(a1).toEqual({
      col: 1,
      row: 1,
      absCol: false,
      absRow: false,
      sheet: undefined,
    });

    const absCell = parseCellCoord('$B$4');
    expect(absCell).toEqual({
      col: 2,
      row: 4,
      absCol: true,
      absRow: true,
      sheet: undefined,
    });

    const mixedCell = parseCellCoord('$C5');
    expect(mixedCell).toEqual({
      col: 3,
      row: 5,
      absCol: true,
      absRow: false,
      sheet: undefined,
    });

    const sheetCell = parseCellCoord('Sheet2!D10');
    expect(sheetCell).toEqual({
      col: 4,
      row: 10,
      absCol: false,
      absRow: false,
      sheet: 'Sheet2',
    });

    const quotedSheetCell = parseCellCoord("'March Sales'!$E$20");
    expect(quotedSheetCell).toEqual({
      col: 5,
      row: 20,
      absCol: true,
      absRow: true,
      sheet: 'March Sales',
    });
  });

  it('converts CellCoord back to A1 representation', () => {
    expect(cellCoordToA1({ col: 1, row: 1 })).toBe('A1');
    expect(cellCoordToA1({ col: 2, row: 4, absCol: true, absRow: true })).toBe('$B$4');
    expect(cellCoordToA1({ col: 3, row: 5, absCol: true })).toBe('$C5');
    expect(cellCoordToA1({ col: 4, row: 10, sheet: 'Sheet2' })).toBe('Sheet2!D10');
    expect(cellCoordToA1({ col: 5, row: 20, sheet: 'March Sales', absCol: true, absRow: true })).toBe(
      "'March Sales'!$E$20"
    );
  });

  it('parses ranges and extracts cells in range', () => {
    const range = parseRange('A1:B2');
    expect(range).not.toBeNull();
    expect(range?.start).toEqual({ col: 1, row: 1, absCol: false, absRow: false, sheet: undefined });
    expect(range?.end).toEqual({ col: 2, row: 2, absCol: false, absRow: false, sheet: undefined });

    const cells = getCellsInRange('A1:B2');
    expect(cells).toEqual(['A1', 'B1', 'A2', 'B2']);

    const cellsColumn = getCellsInRange('C3:C5');
    expect(cellsColumn).toEqual(['C3', 'C4', 'C5']);
  });
});

describe('Excel Engine - Arithmetic & PEMDAS Precedence', () => {
  const wb = createEmptyWorkbook('Sheet1');
  const ctx = { workbook: wb, currentSheet: 'Sheet1' };

  it('evaluates basic arithmetic operators', () => {
    expect(evaluateFormula('=1 + 2', ctx)).toBe(3);
    expect(evaluateFormula('=10 - 4', ctx)).toBe(6);
    expect(evaluateFormula('=6 * 7', ctx)).toBe(42);
    expect(evaluateFormula('=40 / 8', ctx)).toBe(5);
    expect(evaluateFormula('=2 ^ 3', ctx)).toBe(8);
  });

  it('respects standard PEMDAS operator precedence', () => {
    expect(evaluateFormula('=1 + 2 * 3', ctx)).toBe(7);
    expect(evaluateFormula('=(1 + 2) * 3', ctx)).toBe(9);
    expect(evaluateFormula('=2 + 3 ^ 2', ctx)).toBe(11);
    expect(evaluateFormula('=2 * 3 ^ 2', ctx)).toBe(18);
    expect(evaluateFormula('=10 - 6 / 2', ctx)).toBe(7);
    expect(evaluateFormula('=(10 - 6) / 2', ctx)).toBe(2);
  });

  it('evaluates percentage % postfix operator', () => {
    expect(evaluateFormula('=50%', ctx)).toBe(0.5);
    expect(evaluateFormula('=100 * 20%', ctx)).toBe(20);
    expect(evaluateFormula('=10 + 20%', ctx)).toBe(10.2);
    expect(evaluateFormula('=(50 + 50)%', ctx)).toBe(1);
  });

  it('evaluates unary negation and plus', () => {
    expect(evaluateFormula('=-5', ctx)).toBe(-5);
    expect(evaluateFormula('=-(-5)', ctx)).toBe(5);
    expect(evaluateFormula('=+10', ctx)).toBe(10);
    expect(evaluateFormula('=-3 ^ 2', ctx)).toBe(9);
  });

  it('evaluates string concatenation & operator', () => {
    expect(evaluateFormula('="Hello " & "World"', ctx)).toBe('Hello World');
    expect(evaluateFormula('="Total: " & 100', ctx)).toBe('Total: 100');
    expect(evaluateFormula('=1 & 2 & 3', ctx)).toBe('123');
  });

  it('evaluates logical comparison operators', () => {
    expect(evaluateFormula('=5 = 5', ctx)).toBe(true);
    expect(evaluateFormula('=5 <> 5', ctx)).toBe(false);
    expect(evaluateFormula('="abc" = "ABC"', ctx)).toBe(true); // Case-insensitive
    expect(evaluateFormula('=10 > 5', ctx)).toBe(true);
    expect(evaluateFormula('=10 < 5', ctx)).toBe(false);
    expect(evaluateFormula('=10 >= 10', ctx)).toBe(true);
    expect(evaluateFormula('=10 <= 9', ctx)).toBe(false);
  });

  it('handles division by zero returning #DIV/0!', () => {
    expect(evaluateFormula('=10 / 0', ctx)).toBe('#DIV/0!');
  });
});

describe('Excel Engine - Cell & Range Referencing', () => {
  it('references single cells in formulas', () => {
    const wb = createEmptyWorkbook('Sheet1');
    setCellValue(wb, 'Sheet1', 'A1', 10);
    setCellValue(wb, 'Sheet1', 'A2', 25);
    setCellValue(wb, 'Sheet1', 'A3', '=A1 + A2');

    expect(wb.sheets['Sheet1'].cells['A3'].value).toBe(35);
  });

  it('references cross-sheet cells', () => {
    const wb = createEmptyWorkbook('Sheet1');
    setCellValue(wb, 'Sheet1', 'A1', 50);
    setCellValue(wb, 'Sheet2', 'B1', 100);
    setCellValue(wb, 'Sheet1', 'A2', '=Sheet2!B1 * 2 + A1');

    expect(wb.sheets['Sheet1'].cells['A2'].value).toBe(250);
  });

  it('evaluates cell ranges in aggregation functions', () => {
    const wb = createEmptyWorkbook('Sheet1');
    setCellValue(wb, 'Sheet1', 'B1', 10);
    setCellValue(wb, 'Sheet1', 'B2', 20);
    setCellValue(wb, 'Sheet1', 'B3', 30);
    setCellValue(wb, 'Sheet1', 'B4', 40);
    setCellValue(wb, 'Sheet1', 'B5', '=SUM(B1:B4)');

    expect(wb.sheets['Sheet1'].cells['B5'].value).toBe(100);
  });

  it('detects circular references and returns #REF!', () => {
    const wb = createEmptyWorkbook('Sheet1');
    setCellValue(wb, 'Sheet1', 'A1', '=B1');
    setCellValue(wb, 'Sheet1', 'B1', '=A1');

    expect(wb.sheets['Sheet1'].cells['A1'].value).toBe('#REF!');
    expect(wb.sheets['Sheet1'].cells['B1'].value).toBe('#REF!');
  });
});

describe('Excel Engine - Math & Statistical Functions', () => {
  it('SUM', () => {
    const wb = createEmptyWorkbook('Sheet1');
    setCellValue(wb, 'Sheet1', 'A1', 10);
    setCellValue(wb, 'Sheet1', 'A2', 20);
    setCellValue(wb, 'Sheet1', 'A3', 'text'); // Should be ignored in range
    setCellValue(wb, 'Sheet1', 'A4', 30);
    setCellValue(wb, 'Sheet1', 'A5', '=SUM(A1:A4, 5, 15)');

    expect(wb.sheets['Sheet1'].cells['A5'].value).toBe(80);
  });

  it('AVERAGE', () => {
    const wb = createEmptyWorkbook('Sheet1');
    setCellValue(wb, 'Sheet1', 'A1', 10);
    setCellValue(wb, 'Sheet1', 'A2', 20);
    setCellValue(wb, 'Sheet1', 'A3', 30);
    setCellValue(wb, 'Sheet1', 'A4', '=AVERAGE(A1:A3)');

    expect(wb.sheets['Sheet1'].cells['A4'].value).toBe(20);

    // Empty range returns #DIV/0!
    setCellValue(wb, 'Sheet1', 'B4', '=AVERAGE(B1:B3)');
    expect(wb.sheets['Sheet1'].cells['B4'].value).toBe('#DIV/0!');
  });

  it('COUNT and COUNTA and COUNTBLANK', () => {
    const wb = createEmptyWorkbook('Sheet1');
    setCellValue(wb, 'Sheet1', 'A1', 10);
    setCellValue(wb, 'Sheet1', 'A2', 'Hello');
    setCellValue(wb, 'Sheet1', 'A3', true);
    setCellValue(wb, 'Sheet1', 'A4', '');
    // A5 is empty

    setCellValue(wb, 'Sheet1', 'B1', '=COUNT(A1:A5)');
    setCellValue(wb, 'Sheet1', 'B2', '=COUNTA(A1:A5)');
    setCellValue(wb, 'Sheet1', 'B3', '=COUNTBLANK(A1:A5)');

    expect(wb.sheets['Sheet1'].cells['B1'].value).toBe(1); // Only A1 is a number
    expect(wb.sheets['Sheet1'].cells['B2'].value).toBe(3); // A1, A2, A3 are non-empty
    expect(wb.sheets['Sheet1'].cells['B3'].value).toBe(2); // A4 (empty string) and A5 (empty)
  });

  it('MIN and MAX', () => {
    const wb = createEmptyWorkbook('Sheet1');
    setCellValue(wb, 'Sheet1', 'A1', 15);
    setCellValue(wb, 'Sheet1', 'A2', 45);
    setCellValue(wb, 'Sheet1', 'A3', -5);
    setCellValue(wb, 'Sheet1', 'A4', 100);

    setCellValue(wb, 'Sheet1', 'B1', '=MIN(A1:A4)');
    setCellValue(wb, 'Sheet1', 'B2', '=MAX(A1:A4)');

    expect(wb.sheets['Sheet1'].cells['B1'].value).toBe(-5);
    expect(wb.sheets['Sheet1'].cells['B2'].value).toBe(100);
  });

  it('ROUND, ROUNDUP, and ROUNDDOWN', () => {
    const wb = createEmptyWorkbook('Sheet1');
    setCellValue(wb, 'Sheet1', 'A1', '=ROUND(2.15, 1)');
    setCellValue(wb, 'Sheet1', 'A2', '=ROUND(2.149, 1)');
    setCellValue(wb, 'Sheet1', 'A3', '=ROUND(1250, -2)');

    setCellValue(wb, 'Sheet1', 'B1', '=ROUNDUP(3.2, 0)');
    setCellValue(wb, 'Sheet1', 'B2', '=ROUNDUP(3.14159, 3)');
    setCellValue(wb, 'Sheet1', 'B3', '=ROUNDDOWN(3.9, 0)');
    setCellValue(wb, 'Sheet1', 'B4', '=ROUNDDOWN(3.14159, 3)');

    expect(wb.sheets['Sheet1'].cells['A1'].value).toBe(2.2);
    expect(wb.sheets['Sheet1'].cells['A2'].value).toBe(2.1);
    expect(wb.sheets['Sheet1'].cells['A3'].value).toBe(1300);

    expect(wb.sheets['Sheet1'].cells['B1'].value).toBe(4);
    expect(wb.sheets['Sheet1'].cells['B2'].value).toBe(3.142);
    expect(wb.sheets['Sheet1'].cells['B3'].value).toBe(3);
    expect(wb.sheets['Sheet1'].cells['B4'].value).toBe(3.141);
  });

  it('ABS, INT, MOD, POWER, and SQRT', () => {
    const wb = createEmptyWorkbook('Sheet1');
    setCellValue(wb, 'Sheet1', 'A1', '=ABS(-42)');
    setCellValue(wb, 'Sheet1', 'A2', '=INT(8.9)');
    setCellValue(wb, 'Sheet1', 'A3', '=MOD(17, 5)');
    setCellValue(wb, 'Sheet1', 'A4', '=POWER(2, 4)');
    setCellValue(wb, 'Sheet1', 'A5', '=SQRT(64)');
    setCellValue(wb, 'Sheet1', 'A6', '=SQRT(-1)');

    expect(wb.sheets['Sheet1'].cells['A1'].value).toBe(42);
    expect(wb.sheets['Sheet1'].cells['A2'].value).toBe(8);
    expect(wb.sheets['Sheet1'].cells['A3'].value).toBe(2);
    expect(wb.sheets['Sheet1'].cells['A4'].value).toBe(16);
    expect(wb.sheets['Sheet1'].cells['A5'].value).toBe(8);
    expect(wb.sheets['Sheet1'].cells['A6'].value).toBe('#NUM!');
  });
});

describe('Excel Engine - Logic Functions', () => {
  it('IF with lazy evaluation', () => {
    const wb = createEmptyWorkbook('Sheet1');
    setCellValue(wb, 'Sheet1', 'A1', 10);
    setCellValue(wb, 'Sheet1', 'B1', '=IF(A1 > 5, "High", "Low")');
    setCellValue(wb, 'Sheet1', 'B2', '=IF(A1 < 5, "High", "Low")');
    // Lazy evaluation test: false branch 1/0 should never execute
    setCellValue(wb, 'Sheet1', 'B3', '=IF(TRUE, 100, 1/0)');

    expect(wb.sheets['Sheet1'].cells['B1'].value).toBe('High');
    expect(wb.sheets['Sheet1'].cells['B2'].value).toBe('Low');
    expect(wb.sheets['Sheet1'].cells['B3'].value).toBe(100);
  });

  it('AND, OR, NOT', () => {
    const wb = createEmptyWorkbook('Sheet1');
    setCellValue(wb, 'Sheet1', 'A1', '=AND(5 > 2, 10 > 3, "a" = "a")');
    setCellValue(wb, 'Sheet1', 'A2', '=AND(5 > 2, 10 < 3)');
    setCellValue(wb, 'Sheet1', 'B1', '=OR(5 < 2, 10 > 3)');
    setCellValue(wb, 'Sheet1', 'B2', '=OR(5 < 2, 10 < 3)');
    setCellValue(wb, 'Sheet1', 'C1', '=NOT(TRUE)');
    setCellValue(wb, 'Sheet1', 'C2', '=NOT(5 < 2)');

    expect(wb.sheets['Sheet1'].cells['A1'].value).toBe(true);
    expect(wb.sheets['Sheet1'].cells['A2'].value).toBe(false);
    expect(wb.sheets['Sheet1'].cells['B1'].value).toBe(true);
    expect(wb.sheets['Sheet1'].cells['B2'].value).toBe(false);
    expect(wb.sheets['Sheet1'].cells['C1'].value).toBe(false);
    expect(wb.sheets['Sheet1'].cells['C2'].value).toBe(true);
  });

  it('IFS multi-condition branching', () => {
    const wb = createEmptyWorkbook('Sheet1');
    setCellValue(wb, 'Sheet1', 'A1', 85);
    setCellValue(
      wb,
      'Sheet1',
      'B1',
      '=IFS(A1 >= 90, "A", A1 >= 80, "B", A1 >= 70, "C", TRUE, "F")'
    );
    expect(wb.sheets['Sheet1'].cells['B1'].value).toBe('B');

    setCellValue(wb, 'Sheet1', 'A2', 45);
    setCellValue(
      wb,
      'Sheet1',
      'B2',
      '=IFS(A2 >= 90, "A", A2 >= 80, "B", A2 >= 70, "C")'
    );
    expect(wb.sheets['Sheet1'].cells['B2'].value).toBe('#N/A');
  });

  it('IFERROR error suppression', () => {
    const wb = createEmptyWorkbook('Sheet1');
    setCellValue(wb, 'Sheet1', 'A1', '=IFERROR(10 / 0, "Error Division")');
    setCellValue(wb, 'Sheet1', 'A2', '=IFERROR(10 / 2, "Error Division")');

    expect(wb.sheets['Sheet1'].cells['A1'].value).toBe('Error Division');
    expect(wb.sheets['Sheet1'].cells['A2'].value).toBe(5);
  });
});

describe('Excel Engine - Conditional Aggregation', () => {
  it('SUMIF with numeric comparisons and sum ranges', () => {
    const wb = createEmptyWorkbook('Sheet1');
    // Categories
    setCellValue(wb, 'Sheet1', 'A1', 'Apple');
    setCellValue(wb, 'Sheet1', 'A2', 'Orange');
    setCellValue(wb, 'Sheet1', 'A3', 'Apple');
    setCellValue(wb, 'Sheet1', 'A4', 'Banana');

    // Quantities
    setCellValue(wb, 'Sheet1', 'B1', 10);
    setCellValue(wb, 'Sheet1', 'B2', 20);
    setCellValue(wb, 'Sheet1', 'B3', 30);
    setCellValue(wb, 'Sheet1', 'B4', 40);

    // Sum quantities for Apple
    setCellValue(wb, 'Sheet1', 'C1', '=SUMIF(A1:A4, "Apple", B1:B4)');
    expect(wb.sheets['Sheet1'].cells['C1'].value).toBe(40); // 10 + 30

    // Sum quantities > 15
    setCellValue(wb, 'Sheet1', 'C2', '=SUMIF(B1:B4, ">15")');
    expect(wb.sheets['Sheet1'].cells['C2'].value).toBe(90); // 20 + 30 + 40
  });

  it('COUNTIF with comparison and wildcard matching', () => {
    const wb = createEmptyWorkbook('Sheet1');
    setCellValue(wb, 'Sheet1', 'A1', 'FreshMart North');
    setCellValue(wb, 'Sheet1', 'A2', 'FreshMart South');
    setCellValue(wb, 'Sheet1', 'A3', 'Metro Express');
    setCellValue(wb, 'Sheet1', 'A4', 'FreshMart Central');

    // Count matching wildcards
    setCellValue(wb, 'Sheet1', 'B1', '=COUNTIF(A1:A4, "FreshMart*")');
    expect(wb.sheets['Sheet1'].cells['B1'].value).toBe(3);

    // Numeric comparison
    setCellValue(wb, 'Sheet1', 'C1', 10);
    setCellValue(wb, 'Sheet1', 'C2', 50);
    setCellValue(wb, 'Sheet1', 'C3', 75);
    setCellValue(wb, 'Sheet1', 'C4', 100);

    setCellValue(wb, 'Sheet1', 'D1', '=COUNTIF(C1:C4, ">=50")');
    expect(wb.sheets['Sheet1'].cells['D1'].value).toBe(3);
  });

  it('AVERAGEIF with criteria', () => {
    const wb = createEmptyWorkbook('Sheet1');
    setCellValue(wb, 'Sheet1', 'A1', 'Beverages');
    setCellValue(wb, 'Sheet1', 'A2', 'Snacks');
    setCellValue(wb, 'Sheet1', 'A3', 'Beverages');
    setCellValue(wb, 'Sheet1', 'A4', 'Produce');

    setCellValue(wb, 'Sheet1', 'B1', 100);
    setCellValue(wb, 'Sheet1', 'B2', 200);
    setCellValue(wb, 'Sheet1', 'B3', 300);
    setCellValue(wb, 'Sheet1', 'B4', 400);

    setCellValue(wb, 'Sheet1', 'C1', '=AVERAGEIF(A1:A4, "Beverages", B1:B4)');
    expect(wb.sheets['Sheet1'].cells['C1'].value).toBe(200); // (100 + 300) / 2
  });
});

describe('Excel Engine - Text Functions', () => {
  const wb = createEmptyWorkbook('Sheet1');
  const ctx = { workbook: wb, currentSheet: 'Sheet1' };

  it('LEFT, RIGHT, MID, LEN', () => {
    expect(evaluateFormula('=LEFT("Bengaluru", 3)', ctx)).toBe('Ben');
    expect(evaluateFormula('=RIGHT("Metro-2024", 4)', ctx)).toBe('2024');
    expect(evaluateFormula('=MID("Supermarket", 6, 6)', ctx)).toBe('market');
    expect(evaluateFormula('=LEN("Excel Engine")', ctx)).toBe(12);
  });

  it('TRIM, UPPER, LOWER, PROPER', () => {
    expect(evaluateFormula('=TRIM("   Hello    World   ")', ctx)).toBe('Hello World');
    expect(evaluateFormula('=UPPER("bengaluru metro")', ctx)).toBe('BENGALURU METRO');
    expect(evaluateFormula('=LOWER("NAMMA METRO")', ctx)).toBe('namma metro');
    expect(evaluateFormula('=PROPER("query and kaapi tiffin")', ctx)).toBe(
      'Query And Kaapi Tiffin'
    );
  });

  it('CONCAT and TEXTJOIN', () => {
    expect(evaluateFormula('=CONCAT("SKU", "-", 100, "X")', ctx)).toBe('SKU-100X');
    expect(
      evaluateFormula('=TEXTJOIN(", ", TRUE, "Apples", "", "Bananas", "Cherries")', ctx)
    ).toBe('Apples, Bananas, Cherries');
    expect(
      evaluateFormula('=TEXTJOIN("-", FALSE, "2024", "", "11")', ctx)
    ).toBe('2024--11');
  });
});

describe('Excel Engine - Date Functions', () => {
  const wb = createEmptyWorkbook('Sheet1');
  const ctx = { workbook: wb, currentSheet: 'Sheet1' };

  it('DATE, YEAR, MONTH, DAY', () => {
    expect(evaluateFormula('=DATE(2024, 11, 18)', ctx)).toBe('2024-11-18');
    expect(evaluateFormula('=YEAR("2024-08-15")', ctx)).toBe(2024);
    expect(evaluateFormula('=MONTH("2024-08-15")', ctx)).toBe(8);
    expect(evaluateFormula('=DAY("2024-08-15")', ctx)).toBe(15);
  });

  it('TODAY and NOW return valid formatted date strings', () => {
    const today = evaluateFormula('=TODAY()', ctx);
    expect(typeof today).toBe('string');
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const now = evaluateFormula('=NOW()', ctx);
    expect(typeof now).toBe('string');
    expect(now).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });
});

describe('Excel Engine - Lookup Functions', () => {
  it('VLOOKUP with exact match and approximate match', () => {
    const wb = createEmptyWorkbook('Sheet1');
    // Product ID | Product Name | Unit Price
    setCellValue(wb, 'Sheet1', 'A1', 'P101');
    setCellValue(wb, 'Sheet1', 'B1', 'Mysore Pak');
    setCellValue(wb, 'Sheet1', 'C1', 45);

    setCellValue(wb, 'Sheet1', 'A2', 'P102');
    setCellValue(wb, 'Sheet1', 'B2', 'Filter Kaapi');
    setCellValue(wb, 'Sheet1', 'C2', 25);

    setCellValue(wb, 'Sheet1', 'A3', 'P103');
    setCellValue(wb, 'Sheet1', 'B3', 'Masala Dosa');
    setCellValue(wb, 'Sheet1', 'C3', 60);

    // Exact match VLOOKUP
    setCellValue(wb, 'Sheet1', 'D1', '=VLOOKUP("P102", A1:C3, 2, FALSE)');
    setCellValue(wb, 'Sheet1', 'D2', '=VLOOKUP("P102", A1:C3, 3, FALSE)');
    expect(wb.sheets['Sheet1'].cells['D1'].value).toBe('Filter Kaapi');
    expect(wb.sheets['Sheet1'].cells['D2'].value).toBe(25);

    // Non-existent item returns #N/A
    setCellValue(wb, 'Sheet1', 'D3', '=VLOOKUP("P999", A1:C3, 2, FALSE)');
    expect(wb.sheets['Sheet1'].cells['D3'].value).toBe('#N/A');

    // Out of bounds column index returns #REF!
    setCellValue(wb, 'Sheet1', 'D4', '=VLOOKUP("P101", A1:C3, 5, FALSE)');
    expect(wb.sheets['Sheet1'].cells['D4'].value).toBe('#REF!');
  });

  it('XLOOKUP with forward/reverse and default fallback', () => {
    const wb = createEmptyWorkbook('Sheet1');
    // Flight Code | Destination | Status
    setCellValue(wb, 'Sheet1', 'A1', 'AI-501');
    setCellValue(wb, 'Sheet1', 'B1', 'London Heathrow');
    setCellValue(wb, 'Sheet1', 'C1', 'On Time');

    setCellValue(wb, 'Sheet1', 'A2', '6E-204');
    setCellValue(wb, 'Sheet1', 'B2', 'Singapore Changi');
    setCellValue(wb, 'Sheet1', 'C2', 'Boarding');

    setCellValue(wb, 'Sheet1', 'A3', 'EK-568');
    setCellValue(wb, 'Sheet1', 'B3', 'Dubai Intl');
    setCellValue(wb, 'Sheet1', 'C3', 'Delayed');

    // Standard XLOOKUP
    setCellValue(wb, 'Sheet1', 'D1', '=XLOOKUP("6E-204", A1:A3, B1:B3)');
    expect(wb.sheets['Sheet1'].cells['D1'].value).toBe('Singapore Changi');

    // XLOOKUP with fallback message
    setCellValue(wb, 'Sheet1', 'D2', '=XLOOKUP("BA-001", A1:A3, B1:B3, "Flight Not Found")');
    expect(wb.sheets['Sheet1'].cells['D2'].value).toBe('Flight Not Found');
  });

  it('INDEX and MATCH combined', () => {
    const wb = createEmptyWorkbook('Sheet1');
    // Station | Ridership | Fare
    setCellValue(wb, 'Sheet1', 'A1', 'Majestic');
    setCellValue(wb, 'Sheet1', 'B1', 85000);
    setCellValue(wb, 'Sheet1', 'C1', 30);

    setCellValue(wb, 'Sheet1', 'A2', 'MG Road');
    setCellValue(wb, 'Sheet1', 'B2', 45000);
    setCellValue(wb, 'Sheet1', 'C2', 20);

    setCellValue(wb, 'Sheet1', 'A3', 'Indiranagar');
    setCellValue(wb, 'Sheet1', 'B3', 60000);
    setCellValue(wb, 'Sheet1', 'C3', 25);

    // MATCH station position
    setCellValue(wb, 'Sheet1', 'D1', '=MATCH("Indiranagar", A1:A3, 0)');
    expect(wb.sheets['Sheet1'].cells['D1'].value).toBe(3);

    // INDEX with row & col
    setCellValue(wb, 'Sheet1', 'D2', '=INDEX(A1:C3, 2, 2)');
    expect(wb.sheets['Sheet1'].cells['D2'].value).toBe(45000);

    // Classic INDEX / MATCH formula
    setCellValue(
      wb,
      'Sheet1',
      'D3',
      '=INDEX(B1:B3, MATCH("Majestic", A1:A3, 0))'
    );
    expect(wb.sheets['Sheet1'].cells['D3'].value).toBe(85000);
  });
});

describe('Excel Engine - Formatting & Display Values', () => {
  it('formats currency with symbols and commas', () => {
    expect(formatCellValue(1234.56, 'currency', { currencySymbol: '$' })).toBe('$1,234.56');
    expect(formatCellValue(-500.5, 'currency', { currencySymbol: '$' })).toBe('-$500.50');
    expect(formatCellValue(78950, 'currency', { currencySymbol: '₹', decimalPlaces: 0 })).toBe(
      '₹78,950'
    );
  });

  it('formats percentages', () => {
    expect(formatCellValue(0.185, 'percent', { decimalPlaces: 1 })).toBe('18.5%');
    expect(formatCellValue(0.25, 'percent', { decimalPlaces: 0 })).toBe('25%');
  });

  it('formats numbers and dates', () => {
    expect(formatCellValue(9876543.21, 'number', { decimalPlaces: 2 })).toBe('9,876,543.21');
    expect(formatCellValue('2024-11-18', 'date')).toBe('2024-11-18');
  });

  it('preserves error strings unaltered in display value', () => {
    expect(formatCellValue('#VALUE!', 'currency')).toBe('#VALUE!');
    expect(formatCellValue('#DIV/0!', 'percent')).toBe('#DIV/0!');
    expect(formatCellValue('#N/A', 'number')).toBe('#N/A');
  });
});

describe('Excel Engine - Full Workbook Recalculation', () => {
  it('updates displayValue and cascading formulas across sheets', () => {
    const wb = createEmptyWorkbook('Summary');
    setCellValue(wb, 'Data', 'A1', 100);
    setCellValue(wb, 'Data', 'A2', 200);

    // Formula referencing Data sheet
    setCellValue(wb, 'Summary', 'B1', '=SUM(Data!A1:A2)', {
      format: 'currency',
      formatOptions: { currencySymbol: '$' },
    });

    expect(wb.sheets['Summary'].cells['B1'].value).toBe(300);
    expect(wb.sheets['Summary'].cells['B1'].displayValue).toBe('$300.00');

    // Update input cell and verify recalculation cascades
    setCellValue(wb, 'Data', 'A1', 500);
    expect(wb.sheets['Summary'].cells['B1'].value).toBe(700);
    expect(wb.sheets['Summary'].cells['B1'].displayValue).toBe('$700.00');
  });
});
