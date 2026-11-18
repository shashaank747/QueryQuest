import { describe, it, expect } from 'vitest';
import {
  EXCEL_WORLDS_REGISTRY,
  getAllExcelWorlds,
  getExcelWorldById,
  getExcelMissionById,
  validateExcelMission,
  parseCellAddress,
  formatCellAddress,
  colIndexToLetter,
  letterToColIndex,
  normalizeFormula,
  ExcelWorkbookData,
} from '../src/modules/excel';

describe('Excel Industry Worlds Architecture', () => {
  it('registers exactly 7 industry worlds mirroring MySQL roster', () => {
    expect(EXCEL_WORLDS_REGISTRY).toHaveLength(7);
    const worldIds = EXCEL_WORLDS_REGISTRY.map((w) => w.id);
    expect(worldIds).toEqual([
      'supermarket',
      'metro',
      'kaapi',
      'airport',
      'warehouse',
      'hospital',
      'bank',
    ]);
  });

  it('provides working registry lookup helper functions', () => {
    expect(getAllExcelWorlds()).toHaveLength(7);

    const supermarket = getExcelWorldById('supermarket');
    expect(supermarket).toBeDefined();
    expect(supermarket?.name).toBe('Supermarket Operations');

    const metro = getExcelWorldById('metro');
    expect(metro).toBeDefined();
    expect(metro?.name).toContain('Namma Metro');

    const invalid = getExcelWorldById('non_existent');
    expect(invalid).toBeUndefined();

    const m1 = getExcelMissionById('supermarket', 'sm_xl_1');
    expect(m1).toBeDefined();
    expect(m1?.order).toBe(1);

    const invalidMission = getExcelMissionById('supermarket', 'invalid_id');
    expect(invalidMission).toBeUndefined();
  });

  describe('World Metadata & Configuration', () => {
    for (const world of EXCEL_WORLDS_REGISTRY) {
      it(`world "${world.id}" conforms to full ExcelWorldDefinition schema`, () => {
        expect(world.id).toBeTruthy();
        expect(world.name).toBeTruthy();
        expect(world.industry).toBeTruthy();
        expect(world.tagline).toBeTruthy();
        expect(world.description).toBeTruthy();
        expect(world.thumbnailUrl).toMatch(/^\/images\/[a-z0-9_-]+-world\.jpg$/);
        expect(['Beginner', 'Intermediate', 'Advanced']).toContain(world.difficulty);
        expect(world.estimatedTime).toBeTruthy();
        expect(world.iconName).toBeTruthy();
        expect(world.accentColor).toBeTruthy();
        expect(world.spreadsheetName).toMatch(/\.xlsx$/);
        expect(world.excelTopics.length).toBeGreaterThan(0);
        expect(world.isAvailable).toBe(true);

        // Story Intro
        expect(world.storyIntro).toBeDefined();
        expect(world.storyIntro.roleTitle).toBeTruthy();
        expect(world.storyIntro.organization).toBeTruthy();
        expect(world.storyIntro.background).toBeTruthy();
        expect(world.storyIntro.keyResponsibilities.length).toBeGreaterThanOrEqual(3);

        // Initial Workbook
        expect(world.initialWorkbook).toBeDefined();
        expect(world.initialWorkbook.activeSheet).toBeTruthy();
        const activeSheet = world.initialWorkbook.sheets[world.initialWorkbook.activeSheet];
        expect(activeSheet).toBeDefined();
        expect(Object.keys(activeSheet.cells).length).toBeGreaterThanOrEqual(10);

        // Report Config
        expect(world.reportConfig).toBeDefined();
        expect(world.reportConfig.title).toBeTruthy();
        expect(world.reportConfig.subtitle).toBeTruthy();
        expect(world.reportConfig.executiveSummaryTemplate).toBeTruthy();
        expect(world.reportConfig.metrics.length).toBeGreaterThanOrEqual(3);
      });
    }
  });

  describe('Sequential Mission Design & Playability', () => {
    for (const world of EXCEL_WORLDS_REGISTRY) {
      describe(`World: ${world.name} (${world.id})`, () => {
        it('has exactly 6 sequential missions ordered 1 through 6', () => {
          expect(world.missions).toHaveLength(6);
          const orders = world.missions.map((m) => m.order);
          expect(orders).toEqual([1, 2, 3, 4, 5, 6]);
        });

        it('all missions possess complete pedagogical properties', () => {
          for (const mission of world.missions) {
            expect(mission.id).toBeTruthy();
            expect(mission.title).toBeTruthy();
            expect(mission.role).toBeTruthy();
            expect(mission.storyline).toBeTruthy();
            expect(mission.businessProblem).toBeTruthy();
            expect(mission.objective).toBeTruthy();
            expect(mission.targetCell).toMatch(/^[A-Z]+[0-9]+$/);
            expect(mission.requiredOutcome).toBeTruthy();
            expect(mission.checklist.length).toBeGreaterThanOrEqual(2);
            expect(mission.excelTopics.length).toBeGreaterThanOrEqual(1);
            expect(mission.hints).toHaveLength(3);
            expect(mission.hints[0]).toBeTruthy();
            expect(mission.hints[1]).toBeTruthy();
            expect(mission.hints[2]).toBeTruthy();
            expect(mission.sampleSolutionFormula).toBeTruthy();
            expect(mission.solutionExplanation).toBeTruthy();
            expect(mission.xpReward).toBeGreaterThanOrEqual(100);
            expect(mission.validationRules.length).toBeGreaterThanOrEqual(1);
          }
        });

        it('every mission passes 100% validation when simulated with sample solutions', () => {
          for (const mission of world.missions) {
            // Clone initial workbook
            const wb: ExcelWorkbookData = JSON.parse(JSON.stringify(world.initialWorkbook));
            const sheetName = mission.sheetName || wb.activeSheet;
            const sheet = wb.sheets[sheetName];

            // Extract expected value from validation rules
            const valueRule = mission.validationRules.find((r) => r.type === 'EXACT_VALUE' || r.type === 'VALUE_TOLERANCE');
            const expectedVal = valueRule ? valueRule.expectedValue : 100;

            // Populate target cell with the sample solution formula and computed value
            sheet.cells[mission.targetCell] = {
              value: typeof expectedVal === 'number' || typeof expectedVal === 'string' ? expectedVal : null,
              formula: mission.sampleSolutionFormula,
              computed: expectedVal ?? null,
              format: 'general',
            };

            const result = validateExcelMission(mission, wb);
            if (!result.passed) {
              console.error(`Failed mission ${world.id} - ${mission.id}:`, result.errors);
            }
            expect(result.passed).toBe(true);
            expect(result.score).toBe(100);
            expect(result.passedRules).toBe(mission.validationRules.length);
            expect(result.errors).toHaveLength(0);
          }
        });
      });
    }
  });

  describe('Validation Engine Rules & Tolerances', () => {
    it('catches missing target sheets', () => {
      const world = getExcelWorldById('supermarket')!;
      const mission = world.missions[0];
      const emptyWb: ExcelWorkbookData = {
        sheets: {},
        activeSheet: 'NonExistent',
      };
      const result = validateExcelMission(mission, emptyWb);
      expect(result.passed).toBe(false);
      expect(result.errors[0]).toContain('could not be found');
    });

    it('rejects incorrect formulas', () => {
      const world = getExcelWorldById('supermarket')!;
      const mission = world.missions[0]; // requires =SUM(E2:E11) in E12
      const wb: ExcelWorkbookData = JSON.parse(JSON.stringify(world.initialWorkbook));
      wb.sheets['Inventory & Sales'].cells['E12'] = {
        value: 420,
        formula: '=AVERAGE(E2:E11)',
        computed: 420,
      };
      const result = validateExcelMission(mission, wb);
      expect(result.passed).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('rejects incorrect computed values', () => {
      const world = getExcelWorldById('supermarket')!;
      const mission = world.missions[0];
      const wb: ExcelWorkbookData = JSON.parse(JSON.stringify(world.initialWorkbook));
      wb.sheets['Inventory & Sales'].cells['E12'] = {
        value: 999,
        formula: '=SUM(E2:E11)',
        computed: 999, // wrong value
      };
      const result = validateExcelMission(mission, wb);
      expect(result.passed).toBe(false);
      expect(result.errors[0]).toContain('Expected numeric value');
    });

    it('allows numeric tolerance for floating-point calculations', () => {
      const world = getExcelWorldById('supermarket')!;
      const mission = world.missions[4]; // Average Daily Sales: 22.9
      const wb: ExcelWorkbookData = JSON.parse(JSON.stringify(world.initialWorkbook));
      wb.sheets['Inventory & Sales'].cells['I12'] = {
        value: 22.91, // slightly off, within ±0.05 tolerance
        formula: '=AVERAGE(I2:I11)',
        computed: 22.91,
      };
      const result = validateExcelMission(mission, wb);
      expect(result.passed).toBe(true);
    });
  });

  describe('Coordinate & Formula Utilities', () => {
    it('converts column index to letter and back', () => {
      expect(colIndexToLetter(0)).toBe('A');
      expect(colIndexToLetter(1)).toBe('B');
      expect(colIndexToLetter(25)).toBe('Z');
      expect(colIndexToLetter(26)).toBe('AA');

      expect(letterToColIndex('A')).toBe(0);
      expect(letterToColIndex('B')).toBe(1);
      expect(letterToColIndex('Z')).toBe(25);
      expect(letterToColIndex('AA')).toBe(26);
    });

    it('parses and formats cell addresses', () => {
      const p = parseCellAddress('D12');
      expect(p.col).toBe(3);
      expect(p.row).toBe(11);
      expect(p.colLetter).toBe('D');
      expect(p.rowNumber).toBe(12);

      expect(formatCellAddress(3, 11)).toBe('D12');

      const absolute = parseCellAddress('$F$5');
      expect(absolute.col).toBe(5);
      expect(absolute.row).toBe(4);
    });

    it('normalizes formula string differences cleanly', () => {
      expect(normalizeFormula(' =sum( $d$2 : $d$11 ) ')).toBe('=SUM(D2:D11)');
      expect(normalizeFormula('if(e2<f2, "reorder", "ok")')).toBe('=IF(E2<F2,"REORDER","OK")');
      expect(normalizeFormula('=XLOOKUP( H2 , A2:A9 , C2:C9 )')).toBe('=XLOOKUP(H2,A2:A9,C2:C9)');
    });
  });
});
