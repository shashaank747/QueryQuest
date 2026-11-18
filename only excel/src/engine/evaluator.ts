import {
  CellData,
  CellValue,
  ComputedValue,
  EvalResult,
  EvaluationContext,
  RangeValue,
  SheetData,
  WorkbookData,
  coordsToCellId,
  isCellError,
} from './types';
import { ASTNode, parseFormula } from './parser';
import { EXCEL_FUNCTIONS, toScalar } from './functions';
import { formatCellValue } from './format';

/**
 * Evaluates an AST Node within the given spreadsheet context.
 */
export function evaluateAST(
  node: ASTNode,
  context: EvaluationContext
): EvalResult {
  switch (node.type) {
    case 'number':
    case 'string':
    case 'boolean':
      return node.value;

    case 'error':
      return node.error;

    case 'null':
      return null;

    case 'cell': {
      const sheetName = node.sheet || context.currentSheet;
      const sheet = context.workbook.sheets[sheetName];
      if (!sheet) return '#REF!';

      const cellKey = coordsToCellId(node.col, node.row);
      const fullCellKey = `${sheetName}!${cellKey}`;

      // Circular reference detection
      if (context.visitedCells?.has(fullCellKey)) {
        return '#REF!';
      }

      const cell = sheet.cells[cellKey];
      if (!cell) return null;

      // If cell has an unevaluated formula
      if (cell.formula && cell.value === undefined) {
        if (!context.visitedCells) context.visitedCells = new Set();
        context.visitedCells.add(fullCellKey);

        const childAst = parseFormula(cell.formula);
        const childVal = evaluateAST(childAst, context);
        cell.value = toScalar(childVal);
        cell.displayValue = formatCellValue(
          cell.value,
          cell.format,
          cell.formatOptions
        );

        context.visitedCells.delete(fullCellKey);
        return cell.value;
      }

      return cell.value !== undefined ? cell.value : (cell.raw ?? null);
    }

    case 'range': {
      const sheetName = node.sheet || context.currentSheet;
      const sheet = context.workbook.sheets[sheetName];
      if (!sheet) return '#REF!';

      const minCol = Math.min(node.start.col, node.end.col);
      const maxCol = Math.max(node.start.col, node.end.col);
      const minRow = Math.min(node.start.row, node.end.row);
      const maxRow = Math.max(node.start.row, node.end.row);

      const gridValues: ComputedValue[][] = [];

      for (let r = minRow; r <= maxRow; r++) {
        const rowVals: ComputedValue[] = [];
        for (let c = minCol; c <= maxCol; c++) {
          const cellKey = coordsToCellId(c, r);
          const cell = sheet.cells[cellKey];
          let val: ComputedValue = null;

          if (cell) {
            if (cell.formula && cell.value === undefined) {
              const fullKey = `${sheetName}!${cellKey}`;
              if (context.visitedCells?.has(fullKey)) {
                val = '#REF!';
              } else {
                if (!context.visitedCells) context.visitedCells = new Set();
                context.visitedCells.add(fullKey);

                const childAst = parseFormula(cell.formula);
                val = toScalar(evaluateAST(childAst, context));
                cell.value = val;
                cell.displayValue = formatCellValue(
                  val,
                  cell.format,
                  cell.formatOptions
                );

                context.visitedCells.delete(fullKey);
              }
            } else {
              val = cell.value !== undefined ? cell.value : (cell.raw ?? null);
            }
          }

          rowVals.push(val);
        }
        gridValues.push(rowVals);
      }

      const rangeVal: RangeValue = {
        type: 'range',
        sheet: sheetName,
        start: node.start,
        end: node.end,
        values: gridValues,
      };

      return rangeVal;
    }

    case 'unary': {
      const argVal = evaluateAST(node.argument, context);
      if (isCellError(argVal)) return argVal;
      const scalar = toScalar(argVal);

      if (node.operator === '+') {
        const num = Number(scalar);
        return isNaN(num) ? '#VALUE!' : num;
      }
      if (node.operator === '-') {
        const num = Number(scalar);
        return isNaN(num) ? '#VALUE!' : -num;
      }
      if (node.operator === '%') {
        const num = Number(scalar);
        return isNaN(num) ? '#VALUE!' : num / 100;
      }
      return '#VALUE!';
    }

    case 'binary': {
      const leftVal = evaluateAST(node.left, context);
      if (isCellError(leftVal)) return leftVal;

      const rightVal = evaluateAST(node.right, context);
      if (isCellError(rightVal)) return rightVal;

      const leftScalar = toScalar(leftVal);
      const rightScalar = toScalar(rightVal);

      // String concatenation
      if (node.operator === '&') {
        const leftStr = leftScalar === null || leftScalar === undefined ? '' : String(leftScalar);
        const rightStr = rightScalar === null || rightScalar === undefined ? '' : String(rightScalar);
        return leftStr + rightStr;
      }

      // Comparisons
      if (node.operator === '=') {
        return matchesExact(leftScalar, rightScalar);
      }
      if (node.operator === '<>') {
        return !matchesExact(leftScalar, rightScalar);
      }

      if (
        node.operator === '<' ||
        node.operator === '<=' ||
        node.operator === '>' ||
        node.operator === '>='
      ) {
        const numL = Number(leftScalar);
        const numR = Number(rightScalar);
        const bothNumeric =
          !isNaN(numL) &&
          !isNaN(numR) &&
          leftScalar !== null &&
          rightScalar !== null &&
          leftScalar !== '' &&
          rightScalar !== '';

        if (bothNumeric) {
          switch (node.operator) {
            case '<':
              return numL < numR;
            case '<=':
              return numL <= numR;
            case '>':
              return numL > numR;
            case '>=':
              return numL >= numR;
          }
        } else {
          const strL = String(leftScalar ?? '').toLowerCase();
          const strR = String(rightScalar ?? '').toLowerCase();
          switch (node.operator) {
            case '<':
              return strL < strR;
            case '<=':
              return strL <= strR;
            case '>':
              return strL > strR;
            case '>=':
              return strL >= strR;
          }
        }
      }

      // Arithmetic: +, -, *, /, ^
      const numL = Number(leftScalar);
      const numR = Number(rightScalar);
      if (isNaN(numL) || isNaN(numR)) {
        return '#VALUE!';
      }

      switch (node.operator) {
        case '+':
          return numL + numR;
        case '-':
          return numL - numR;
        case '*':
          return numL * numR;
        case '/':
          if (numR === 0) return '#DIV/0!';
          return numL / numR;
        case '^':
          return Math.pow(numL, numR);
      }

      return '#VALUE!';
    }

    case 'function': {
      const funcName = node.name.toUpperCase();

      // Short-circuit / lazy forms
      if (funcName === 'IF') {
        if (node.args.length < 2) return '#VALUE!';
        const testRes = evaluateAST(node.args[0], context);
        if (isCellError(testRes)) return testRes;
        const testScalar = toScalar(testRes);
        const isTruthy =
          testScalar === true || (typeof testScalar === 'number' && testScalar !== 0);

        if (isTruthy) {
          return toScalar(evaluateAST(node.args[1], context));
        } else {
          return node.args.length > 2
            ? toScalar(evaluateAST(node.args[2], context))
            : false;
        }
      }

      if (funcName === 'IFS') {
        if (node.args.length === 0 || node.args.length % 2 !== 0) return '#VALUE!';
        for (let i = 0; i < node.args.length; i += 2) {
          const testRes = evaluateAST(node.args[i], context);
          if (isCellError(testRes)) return testRes;
          const testScalar = toScalar(testRes);
          const isTruthy =
            testScalar === true || (typeof testScalar === 'number' && testScalar !== 0);
          if (isTruthy) {
            return toScalar(evaluateAST(node.args[i + 1], context));
          }
        }
        return '#N/A';
      }

      if (funcName === 'IFERROR') {
        if (node.args.length < 2) return '#VALUE!';
        const primaryRes = evaluateAST(node.args[0], context);
        if (isCellError(primaryRes)) {
          return toScalar(evaluateAST(node.args[1], context));
        }
        const scalar = toScalar(primaryRes);
        if (isCellError(scalar)) {
          return toScalar(evaluateAST(node.args[1], context));
        }
        return scalar;
      }

      // Standard functions
      const fn = EXCEL_FUNCTIONS[funcName];
      if (!fn) {
        return '#NAME?';
      }

      const evaledArgs: EvalResult[] = [];
      for (const argNode of node.args) {
        const res = evaluateAST(argNode, context);
        evaledArgs.push(res);
      }

      return fn(evaledArgs);
    }
  }

  return null;
}

/**
 * Case-insensitive / type-coerced equality check
 */
function matchesExact(a: any, b: any): boolean {
  if (typeof a === 'number' && typeof b === 'number') {
    return a === b;
  }
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return a === b;
  }
  if (a === null && b === null) return true;
  if (a === '' && b === null) return true;
  if (a === null && b === '') return true;

  const strA = a === null || a === undefined ? '' : String(a).toLowerCase();
  const strB = b === null || b === undefined ? '' : String(b).toLowerCase();
  return strA === strB;
}

/**
 * Evaluates an Excel formula string within a workbook context.
 */
export function evaluateFormula(
  formula: string,
  context: EvaluationContext
): ComputedValue {
  if (!formula || !formula.startsWith('=')) {
    return formula;
  }

  try {
    const ast = parseFormula(formula);
    const result = evaluateAST(ast, context);
    return toScalar(result);
  } catch (err: any) {
    return '#VALUE!';
  }
}

/**
 * Evaluates a single cell in a sheet, handling formula calculation and formatting.
 */
export function evaluateCell(
  sheetName: string,
  cellId: string,
  workbook: WorkbookData
): ComputedValue {
  const sheet = workbook.sheets[sheetName];
  if (!sheet) return '#REF!';

  const cell = sheet.cells[cellId];
  if (!cell) return null;

  if (cell.formula) {
    const context: EvaluationContext = {
      workbook,
      currentSheet: sheetName,
      visitedCells: new Set([`${sheetName}!${cellId}`]),
    };
    cell.value = evaluateFormula(cell.formula, context);
  } else {
    cell.value = cell.raw !== undefined ? cell.raw : null;
  }

  cell.displayValue = formatCellValue(
    cell.value,
    cell.format,
    cell.formatOptions
  );

  return cell.value;
}

/**
 * Evaluates all cells across an entire sheet.
 */
export function evaluateSheet(
  sheetName: string,
  workbook: WorkbookData
): SheetData {
  const sheet = workbook.sheets[sheetName];
  if (!sheet) {
    throw new Error(`Sheet ${sheetName} not found in workbook.`);
  }

  // Clear previous computed values for formula cells so dependencies recalculate
  for (const cellKey of Object.keys(sheet.cells)) {
    const cell = sheet.cells[cellKey];
    if (cell.formula) {
      delete cell.value;
    }
  }

  for (const cellKey of Object.keys(sheet.cells)) {
    evaluateCell(sheetName, cellKey, workbook);
  }

  return sheet;
}

/**
 * Recalculates all sheets in the workbook in active order.
 */
export function evaluateWorkbook(workbook: WorkbookData): WorkbookData {
  // Clear all formula cache values
  for (const sheetName of Object.keys(workbook.sheets)) {
    const sheet = workbook.sheets[sheetName];
    for (const cellKey of Object.keys(sheet.cells)) {
      if (sheet.cells[cellKey].formula) {
        delete sheet.cells[cellKey].value;
      }
    }
  }

  // Recalculate all sheets
  for (const sheetName of Object.keys(workbook.sheets)) {
    evaluateSheet(sheetName, workbook);
  }

  return workbook;
}

/**
 * Creates an empty SheetData object.
 */
export function createEmptySheet(
  name: string,
  rowCount = 50,
  colCount = 26
): SheetData {
  return {
    name,
    cells: {},
    rowCount,
    colCount,
  };
}

/**
 * Creates an empty WorkbookData object with one initial sheet.
 */
export function createEmptyWorkbook(
  initialSheetName = 'Sheet1',
  rowCount = 50,
  colCount = 26
): WorkbookData {
  const initialSheet = createEmptySheet(initialSheetName, rowCount, colCount);
  return {
    sheets: {
      [initialSheetName]: initialSheet,
    },
    activeSheet: initialSheetName,
    sheetOrder: [initialSheetName],
  };
}

/**
 * Sets a cell's raw or formula value and triggers recalculation.
 */
export function setCellValue(
  workbook: WorkbookData,
  sheetName: string,
  cellId: string,
  input: CellValue | string,
  options?: Partial<CellData>
): WorkbookData {
  let sheet = workbook.sheets[sheetName];
  if (!sheet) {
    sheet = createEmptySheet(sheetName);
    workbook.sheets[sheetName] = sheet;
  }

  const normalizedId = cellId.toUpperCase().replace(/\$/g, '');
  let cell = sheet.cells[normalizedId];
  if (!cell) {
    cell = {};
    sheet.cells[normalizedId] = cell;
  }

  if (typeof input === 'string' && input.startsWith('=')) {
    cell.formula = input;
    delete cell.raw;
  } else {
    cell.raw = input;
    delete cell.formula;
    cell.value = input;
  }

  if (options?.format) cell.format = options.format;
  if (options?.formatOptions) cell.formatOptions = options.formatOptions;
  if (options?.style) cell.style = { ...cell.style, ...options.style };

  // Recalculate
  evaluateWorkbook(workbook);

  return workbook;
}
