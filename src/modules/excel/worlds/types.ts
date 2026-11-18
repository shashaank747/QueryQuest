/**
 * Excel Worlds & Mission Architecture Types
 * 
 * Provides types for:
 * - Cell coordinates and cell data (interoperable with Excel engine)
 * - Sheet and Workbook structure
 * - Excel Mission definition and validation rules
 * - Excel World Definition mirroring SQL worlds
 */

import {
  CellValue,
  ComputedValue,
  CellFormat,
  CellStyle,
  CellData,
  SheetData,
  WorkbookData,
} from '../engine/types';

export type ExcelCellFormat = CellFormat;
export type ExcelCellStyle = CellStyle;
export type ExcelCellData = CellData;
export type ExcelSheetData = SheetData;
export type ExcelWorkbookData = WorkbookData;

export type ExcelValidationType =
  | 'EXACT_FORMULA'
  | 'FORMULA_CONTAINS'
  | 'FORMULA_MATCH'
  | 'EXACT_VALUE'
  | 'VALUE_TOLERANCE'
  | 'FORMAT_CHECK'
  | 'NON_EMPTY';

export interface ExcelValidationRule {
  type: ExcelValidationType;
  targetCell: string; // e.g. "D12", "F2", "G10"
  sheetName?: string; // defaults to activeSheet
  description: string;
  expectedFormula?: string; // e.g. "=SUM(D2:D11)"
  formulaPattern?: string; // regex pattern string e.g. "^=SUM\\(D2:D11\\)$" or "COUNTIF"
  expectedValue?: CellValue;
  numericTolerance?: number; // e.g. 0.05
  expectedFormat?: ExcelCellFormat;
}

export interface ExcelMissionValidationResult {
  passed: boolean;
  score: number; // 0 to 100
  passedRules: number;
  totalRules: number;
  feedback: string[];
  errors: string[];
}

export interface ExcelMission {
  id: string;
  order: number;
  title: string;
  role: string;
  storyline: string;
  businessProblem: string;
  objective: string;
  targetCell: string; // Coordinate where the user enters the formula or value, e.g. "D12"
  sheetName?: string;
  requiredOutcome: string;
  checklist: string[];
  excelTopics: string[];
  hints: [string, string, string]; // 1: Conceptual, 2: Directional, 3: Exact formula syntax
  sampleSolutionFormula: string;
  solutionExplanation: string;
  initialFormulaPlaceholder?: string;
  validationRules: ExcelValidationRule[];
  xpReward: number;
  badge?: {
    id: string;
    title: string;
    icon: string;
  };
}

export interface ExcelReportMetric {
  id: string;
  title: string;
  cellReference: string;
  sheetName?: string;
  description: string;
  format?: ExcelCellFormat;
  type: 'stat' | 'kpi' | 'table';
}

export interface ExcelReportConfig {
  title: string;
  subtitle: string;
  executiveSummaryTemplate: string;
  metrics: ExcelReportMetric[];
}

export interface ExcelWorldDefinition {
  id: string;
  name: string;
  industry: string;
  tagline: string;
  description: string;
  thumbnailUrl: string;
  storyIntro: {
    roleTitle: string;
    organization: string;
    background: string;
    keyResponsibilities: string[];
  };
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  iconName: string;
  accentColor: string;
  spreadsheetName: string;
  excelTopics: string[];
  isAvailable: boolean;
  initialWorkbook: ExcelWorkbookData;
  missions: ExcelMission[];
  reportConfig: ExcelReportConfig;
}

// ==========================================
// Cell & Coordinate Helper Utilities
// ==========================================

/**
 * Convert column index (0-based) to letter: 0 -> "A", 25 -> "Z", 26 -> "AA"
 */
export function colIndexToLetter(col: number): string {
  let temp = col;
  let letter = '';
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

/**
 * Convert column letter to 0-based index: "A" -> 0, "Z" -> 25, "AA" -> 26
 */
export function letterToColIndex(letter: string): number {
  const clean = letter.toUpperCase().replace(/[^A-Z]/g, '');
  let result = 0;
  for (let i = 0; i < clean.length; i++) {
    result = result * 26 + (clean.charCodeAt(i) - 64);
  }
  return result - 1;
}

/**
 * Parse cell address "B4" or "$B$4" into { col: 1, row: 3 } (0-based)
 */
export function parseCellAddress(address: string): { col: number; row: number; colLetter: string; rowNumber: number } {
  const clean = address.replace(/\$/g, '').toUpperCase().trim();
  const match = clean.match(/^([A-Z]+)([0-9]+)$/);
  if (!match) {
    throw new Error(`Invalid cell address format: "${address}"`);
  }
  const colLetter = match[1];
  const rowNumber = parseInt(match[2], 10);
  return {
    col: letterToColIndex(colLetter),
    row: rowNumber - 1,
    colLetter,
    rowNumber,
  };
}

/**
 * Format 0-based col and row into cell address string e.g. (1, 3) -> "B4"
 */
export function formatCellAddress(col: number, row: number): string {
  return `${colIndexToLetter(col)}${row + 1}`;
}

/**
 * Normalize formula for comparison:
 * - strips surrounding spaces
 * - converts function names and cell references to uppercase
 * - strips internal spaces
 * - strips '$' absolute locks
 */
export function normalizeFormula(formula: string): string {
  if (!formula) return '';
  let normalized = formula.trim();
  if (!normalized.startsWith('=')) {
    normalized = '=' + normalized;
  }
  // Remove absolute referencing dollar signs: $A$1 -> A1
  normalized = normalized.replace(/\$/g, '');
  // Remove spaces
  normalized = normalized.replace(/\s+/g, '');
  // Uppercase
  return normalized.toUpperCase();
}

/**
 * Helper to build an ExcelSheetData from a 2D matrix of values or CellData.
 * Row 0 is formatted as header (bold, centered).
 */
export function createSheetFromMatrix(
  name: string,
  matrix: (CellValue | Partial<ExcelCellData>)[][],
  rowCount = 35,
  colCount = 12
): ExcelSheetData {
  const cells: Record<string, ExcelCellData> = {};

  matrix.forEach((rowValues, rowIndex) => {
    rowValues.forEach((cellVal, colIndex) => {
      const addr = formatCellAddress(colIndex, rowIndex);
      if (cellVal === null || cellVal === undefined) {
        return;
      }

      if (typeof cellVal === 'object' && !(cellVal instanceof Date)) {
        const partial = cellVal as Partial<ExcelCellData>;
        cells[addr] = {
          raw: (partial.raw !== undefined ? partial.raw : partial.value) ?? null,
          value: (partial.value !== undefined ? partial.value : partial.raw) as ComputedValue,
          formula: partial.formula,
          format: partial.format ?? 'general',
          style: {
            bold: rowIndex === 0 ? true : partial.style?.bold,
            align: rowIndex === 0 ? 'center' : partial.style?.align,
            ...partial.style,
          },
        };
      } else {
        const isString = typeof cellVal === 'string';
        const isFormula = isString && (cellVal as string).startsWith('=');
        const isHeader = rowIndex === 0;

        cells[addr] = {
          raw: isFormula ? null : (cellVal as CellValue),
          value: isFormula ? undefined : (cellVal as ComputedValue),
          formula: isFormula ? (cellVal as string) : undefined,
          format: typeof cellVal === 'number' ? 'number' : isString ? 'text' : 'general',
          style: {
            bold: isHeader,
            align: isHeader ? 'center' : typeof cellVal === 'number' ? 'right' : 'left',
          },
        };
      }
    });
  });

  return {
    name,
    cells,
    rowCount: Math.max(rowCount, matrix.length + 5),
    colCount: Math.max(colCount, (matrix[0]?.length || 0) + 3),
  };
}
