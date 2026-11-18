import { describe, it, expect, beforeEach } from 'vitest';
import { useExcelStore } from '../src/stores/useExcelStore';
import { useTrackStore } from '../src/stores/useTrackStore';
import { EXCEL_WORLDS_REGISTRY, getExcelWorldById } from '../src/modules/excel/worlds';

describe('Excel Spreadsheet User Interface & Store Integration', () => {
  beforeEach(() => {
    useExcelStore.getState().setActiveWorld(null);
    useExcelStore.getState().setActiveCell('A1');
    useExcelStore.getState().setSelectedRange(null);
    useExcelStore.getState().setFormulaBarValue('');
    useTrackStore.getState().setSelectedTrack(null);
  });

  describe('Track Selection & Track Launching', () => {
    it('allows launching the Excel simulation track', () => {
      expect(useTrackStore.getState().selectedTrack).toBeNull();
      useTrackStore.getState().setSelectedTrack('excel');
      expect(useTrackStore.getState().selectedTrack).toBe('excel');
    });

    it('returns to track selection when clearing selectedTrack', () => {
      useTrackStore.getState().setSelectedTrack('excel');
      expect(useTrackStore.getState().selectedTrack).toBe('excel');

      useTrackStore.getState().setSelectedTrack(null);
      expect(useTrackStore.getState().selectedTrack).toBeNull();
    });
  });

  describe('Excel World Loading & Progression', () => {
    it('loads Supermarket world into activeWorld and initializes workbook', () => {
      const supermarket = getExcelWorldById('supermarket');
      expect(supermarket).toBeDefined();

      useExcelStore.getState().loadWorld(supermarket!);

      const state = useExcelStore.getState();
      expect(state.activeWorld?.id).toBe('supermarket');
      expect(state.activeMissionIndex).toBe(0);
      expect(state.activeSheet).toBe('Inventory & Sales');
      expect(state.workbook.sheets['Inventory & Sales']).toBeDefined();
    });

    it('focuses the target cell coordinate when loading mission', () => {
      const supermarket = getExcelWorldById('supermarket')!;
      useExcelStore.getState().loadWorld(supermarket);

      const state = useExcelStore.getState();
      const firstMission = supermarket.missions[0];
      expect(state.activeCell).toBe(firstMission.targetCell);
    });

    it('switches missions and updates active cell and target coordinate', () => {
      const supermarket = getExcelWorldById('supermarket')!;
      useExcelStore.getState().loadWorld(supermarket);

      useExcelStore.getState().selectMission(1);
      const state = useExcelStore.getState();
      expect(state.activeMissionIndex).toBe(1);
      expect(state.activeCell).toBe(supermarket.missions[1].targetCell);
    });

    it('reveals progressive hints sequentially up to 3', () => {
      const supermarket = getExcelWorldById('supermarket')!;
      useExcelStore.getState().loadWorld(supermarket);

      expect(useExcelStore.getState().revealedHintsCount).toBe(0);
      useExcelStore.getState().revealNextHint();
      expect(useExcelStore.getState().revealedHintsCount).toBe(1);
      useExcelStore.getState().revealNextHint();
      expect(useExcelStore.getState().revealedHintsCount).toBe(2);
      useExcelStore.getState().revealNextHint();
      expect(useExcelStore.getState().revealedHintsCount).toBe(3);
      useExcelStore.getState().revealNextHint(); // Should not exceed 3
      expect(useExcelStore.getState().revealedHintsCount).toBe(3);
    });
  });

  describe('Excel Formula Bar & Cell Editing Synchronization', () => {
    it('synchronizes formula bar input with active cell in real-time', () => {
      const supermarket = getExcelWorldById('supermarket')!;
      useExcelStore.getState().loadWorld(supermarket);

      useExcelStore.getState().setActiveCell('D12');
      useExcelStore.getState().updateActiveCellContent('=SUM(D2:D11)');

      const state = useExcelStore.getState();
      expect(state.formulaBarValue).toBe('=SUM(D2:D11)');
      const cell = state.workbook.sheets[state.activeSheet]?.cells['D12'];
      expect(cell?.formula).toBe('=SUM(D2:D11)');
    });

    it('supports jumping to a cell coordinate via Name Box', () => {
      useExcelStore.getState().setActiveCell('B5');
      expect(useExcelStore.getState().activeCell).toBe('B5');

      useExcelStore.getState().setActiveCell('E20');
      expect(useExcelStore.getState().activeCell).toBe('E20');
    });
  });

  describe('Excel Ribbon Formatting & Styles', () => {
    it('applies bold, italic, and alignment styles to the active cell', () => {
      useExcelStore.getState().setActiveCell('A1');
      useExcelStore.getState().applyStyleToActive({ bold: true, italic: true, align: 'center' });

      const state = useExcelStore.getState();
      const cell = state.workbook.sheets[state.activeSheet]?.cells['A1'];
      expect(cell?.style?.bold).toBe(true);
      expect(cell?.style?.italic).toBe(true);
      expect(cell?.style?.align).toBe('center');
    });

    it('applies currency and percentage number formatting to the active cell', () => {
      useExcelStore.getState().setActiveCell('C2');
      useExcelStore.getState().updateActiveCellContent('1250');
      useExcelStore.getState().applyFormatToActive('currency', { currencySymbol: '₹', decimalPlaces: 2 });

      const state = useExcelStore.getState();
      const cell = state.workbook.sheets[state.activeSheet]?.cells['C2'];
      expect(cell?.format).toBe('currency');
      expect(cell?.displayValue).toContain('₹');
      expect(cell?.displayValue).toContain('1,250');
    });

    it('supports clipboard cut, copy, and paste operations', () => {
      useExcelStore.getState().setActiveCell('A1');
      useExcelStore.getState().updateActiveCellContent('Test Value');
      useExcelStore.getState().copyActiveCell();

      expect(useExcelStore.getState().clipboard).toBeDefined();
      expect(useExcelStore.getState().clipboard?.type).toBe('copy');

      useExcelStore.getState().setActiveCell('B2');
      useExcelStore.getState().pasteToActiveCell();

      const state = useExcelStore.getState();
      const cellB2 = state.workbook.sheets[state.activeSheet]?.cells['B2'];
      expect(cellB2?.raw).toBe('Test Value');
    });
  });

  describe('Excel Sheet Tabs & Status Bar Statistics', () => {
    it('computes selection stats (average, count, sum) for numbers in range', () => {
      useExcelStore.getState().setActiveCell('A1');
      useExcelStore.getState().updateActiveCellContent('10');
      useExcelStore.getState().setActiveCell('A2');
      useExcelStore.getState().updateActiveCellContent('20');
      useExcelStore.getState().setActiveCell('A3');
      useExcelStore.getState().updateActiveCellContent('30');

      useExcelStore.getState().setSelectedRange({ start: 'A1', end: 'A3' });

      const stats = useExcelStore.getState().getSelectionStats();
      expect(stats.count).toBe(3);
      expect(stats.sum).toBe(60);
      expect(stats.avg).toBe(20);
    });

    it('supports adding and switching sheets', () => {
      useExcelStore.getState().addSheet('Financials');
      const state = useExcelStore.getState();
      expect(state.activeSheet).toBe('Financials');
      expect(state.workbook.sheets['Financials']).toBeDefined();
    });
  });

  describe('Mission Validation & Progression Execution', () => {
    it('validates a correct formula for Supermarket Mission 1 and awards XP', async () => {
      const supermarket = getExcelWorldById('supermarket')!;
      useExcelStore.getState().loadWorld(supermarket);

      const m1 = supermarket.missions[0];
      // Target cell D12: Selling Price total
      useExcelStore.getState().setActiveCell(m1.targetCell);
      useExcelStore.getState().updateActiveCellContent(m1.sampleSolutionFormula);

      const passed = await useExcelStore.getState().validateCurrentMission();
      expect(passed).toBe(true);

      const feedback = useExcelStore.getState().validationFeedback;
      expect(feedback?.passed).toBe(true);

      // Verify world progress updated
      const progress = useExcelStore.getState().worldProgress['supermarket'];
      expect(progress.completedMissionsCount).toBeGreaterThanOrEqual(1);
    });

    it('flags an incorrect formula and provides helpful error diagnostics', async () => {
      const supermarket = getExcelWorldById('supermarket')!;
      useExcelStore.getState().loadWorld(supermarket);

      const m1 = supermarket.missions[0];
      useExcelStore.getState().setActiveCell(m1.targetCell);
      useExcelStore.getState().updateActiveCellContent('=SUM(A1:A5)'); // Wrong range

      const passed = await useExcelStore.getState().validateCurrentMission();
      expect(passed).toBe(false);

      const feedback = useExcelStore.getState().validationFeedback;
      expect(feedback?.passed).toBe(false);
      expect(feedback?.errors.length).toBeGreaterThan(0);
    });
  });
});
