import {
  ExcelMission,
  ExcelWorkbookData,
  ExcelMissionValidationResult,
  normalizeFormula,
} from './types';

/**
 * Validates a user's workbook state against an ExcelMission's validation rules.
 */
export function validateExcelMission(
  mission: ExcelMission,
  workbook: ExcelWorkbookData
): ExcelMissionValidationResult {
  const rules = mission.validationRules;
  if (!rules || rules.length === 0) {
    return {
      passed: true,
      score: 100,
      passedRules: 0,
      totalRules: 0,
      feedback: ['No validation rules configured for this mission.'],
      errors: [],
    };
  }

  let passedRules = 0;
  const feedback: string[] = [];
  const errors: string[] = [];

  for (const rule of rules) {
    const targetSheetName = rule.sheetName || mission.sheetName || workbook.activeSheet;
    const sheet = workbook.sheets[targetSheetName];

    if (!sheet) {
      errors.push(`Sheet "${targetSheetName}" could not be found in the active workbook.`);
      continue;
    }

    const cell = sheet.cells[rule.targetCell];
    const cellValue = cell
      ? cell.value !== undefined && cell.value !== null
        ? cell.value
        : cell.raw ?? null
      : null;
    const cellFormula = cell?.formula || '';

    let rulePassed = false;
    let ruleError = '';

    switch (rule.type) {
      case 'EXACT_FORMULA': {
        if (!rule.expectedFormula) {
          rulePassed = true;
          break;
        }
        const normCell = normalizeFormula(cellFormula);
        const normExpected = normalizeFormula(rule.expectedFormula);
        if (normCell === normExpected) {
          rulePassed = true;
        } else {
          ruleError = `Target cell ${rule.targetCell}: Expected formula equivalent to "${rule.expectedFormula}", but received "${cellFormula || '(empty)'}".`;
        }
        break;
      }

      case 'FORMULA_CONTAINS': {
        const expectedPattern = (rule.expectedFormula || rule.formulaPattern || '').toUpperCase();
        const normCell = normalizeFormula(cellFormula);
        if (normCell.includes(expectedPattern.replace(/\s+/g, ''))) {
          rulePassed = true;
        } else {
          ruleError = `Target cell ${rule.targetCell}: Formula must utilize function or syntax "${expectedPattern}". Current: "${cellFormula || '(none)'}".`;
        }
        break;
      }

      case 'FORMULA_MATCH': {
        if (!rule.formulaPattern) {
          rulePassed = true;
          break;
        }
        try {
          const regex = new RegExp(rule.formulaPattern, 'i');
          const normCell = normalizeFormula(cellFormula);
          if (regex.test(normCell) || regex.test(cellFormula)) {
            rulePassed = true;
          } else {
            ruleError = `Target cell ${rule.targetCell}: Formula did not match pattern /${rule.formulaPattern}/i. Current formula: "${cellFormula}".`;
          }
        } catch {
          ruleError = `Invalid regex pattern in validation rule: ${rule.formulaPattern}`;
        }
        break;
      }

      case 'EXACT_VALUE': {
        if (rule.expectedValue === undefined) {
          rulePassed = true;
          break;
        }
        if (typeof rule.expectedValue === 'string') {
          const strVal = String(cellValue ?? '').trim().toUpperCase();
          const strExp = rule.expectedValue.trim().toUpperCase();
          if (strVal === strExp) {
            rulePassed = true;
          } else {
            ruleError = `Target cell ${rule.targetCell}: Expected value "${rule.expectedValue}", but evaluated to "${cellValue ?? '(empty)'}".`;
          }
        } else if (typeof rule.expectedValue === 'number') {
          const numVal = Number(cellValue);
          const tolerance = rule.numericTolerance ?? 0.001;
          if (!isNaN(numVal) && Math.abs(numVal - rule.expectedValue) <= tolerance) {
            rulePassed = true;
          } else {
            ruleError = `Target cell ${rule.targetCell}: Expected numeric value ${rule.expectedValue}, but calculated ${cellValue ?? 'NaN'}.`;
          }
        } else if (typeof rule.expectedValue === 'boolean') {
          if (Boolean(cellValue) === rule.expectedValue) {
            rulePassed = true;
          } else {
            ruleError = `Target cell ${rule.targetCell}: Expected boolean ${rule.expectedValue}, but received ${cellValue}.`;
          }
        }
        break;
      }

      case 'VALUE_TOLERANCE': {
        const numVal = Number(cellValue);
        const expectedNum = Number(rule.expectedValue);
        const tol = rule.numericTolerance ?? 0.05;
        if (!isNaN(numVal) && !isNaN(expectedNum) && Math.abs(numVal - expectedNum) <= tol) {
          rulePassed = true;
        } else {
          ruleError = `Target cell ${rule.targetCell}: Numeric result ${cellValue} differs from expected ${expectedNum} (tolerance ±${tol}).`;
        }
        break;
      }

      case 'FORMAT_CHECK': {
        if (cell?.format === rule.expectedFormat) {
          rulePassed = true;
        } else {
          ruleError = `Target cell ${rule.targetCell}: Expected number format "${rule.expectedFormat}", but found "${cell?.format || 'general'}".`;
        }
        break;
      }

      case 'NON_EMPTY': {
        if (cellValue !== null && cellValue !== undefined && cellValue !== '') {
          rulePassed = true;
        } else {
          ruleError = `Target cell ${rule.targetCell} must not be empty.`;
        }
        break;
      }

      default:
        rulePassed = true;
    }

    if (rulePassed) {
      passedRules++;
      feedback.push(`✓ ${rule.description}`);
    } else {
      errors.push(ruleError || `✗ ${rule.description}`);
    }
  }

  const passed = passedRules === rules.length;
  const score = Math.round((passedRules / rules.length) * 100);

  return {
    passed,
    score,
    passedRules,
    totalRules: rules.length,
    feedback,
    errors,
  };
}
