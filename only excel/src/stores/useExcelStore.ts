import { create } from 'zustand';
import confetti from 'canvas-confetti';
import {
  CellData,
  CellFormat,
  CellFormatOptions,
  CellStyle,
  WorkbookData,
  createEmptyWorkbook,
  evaluateWorkbook,
  formatCellValue,
  getCellsInRange,
  setCellValue,
} from '../modules/excel/engine';
import {
  ExcelWorldDefinition,
  ExcelMissionValidationResult,
  validateExcelMission,
  EXCEL_WORLDS_REGISTRY,
} from '../modules/excel/worlds';
import { soundService } from '../services/sound/sound-effects';
import { useUserStore } from './useUserStore';

export interface SelectionStats {
  sum: number;
  avg: number;
  count: number;
}

export interface ExcelWorldProgress {
  completedMissionsCount: number;
  totalMissionsCount: number;
  percentComplete: number;
  isCompleted: boolean;
}

export interface ExcelClipboardItem {
  type: 'copy' | 'cut';
  cellId: string;
  sheetName: string;
  data: Partial<CellData>;
}

export interface ExcelState {
  // Spreadsheet core state
  workbook: WorkbookData;
  activeSheet: string;
  activeCell: string; // e.g. "A1"
  selectedRange: { start: string; end: string } | null;
  formulaBarValue: string;
  isEditing: boolean;
  clipboard: ExcelClipboardItem | null;

  // World and Mission state
  activeWorld: ExcelWorldDefinition | null;
  activeMissionIndex: number;
  revealedHintsCount: number;
  validationFeedback: ExcelMissionValidationResult | null;
  isValidating: boolean;
  isWorldCompletedModalOpen: boolean;
  worldProgress: Record<string, ExcelWorldProgress>;

  // Core Actions
  loadWorkbook: (workbook: WorkbookData) => void;
  setActiveCell: (cellId: string) => void;
  setSelectedRange: (range: { start: string; end: string } | null) => void;
  setActiveSheet: (sheetName: string) => void;
  addSheet: (sheetName?: string) => void;
  deleteSheet: (sheetName: string) => void;
  setFormulaBarValue: (val: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  updateActiveCellContent: (content: string) => void;
  updateCellContent: (sheetName: string, cellId: string, content: string) => void;
  applyFormatToActive: (format: CellFormat, options?: CellFormatOptions) => void;
  applyStyleToActive: (style: Partial<CellStyle>) => void;
  recalculate: () => void;
  getSelectionStats: () => SelectionStats;

  // Clipboard Actions
  copyActiveCell: () => void;
  cutActiveCell: () => void;
  pasteToActiveCell: () => void;

  // World & Mission Actions
  loadWorld: (world: ExcelWorldDefinition) => void;
  setActiveWorld: (world: ExcelWorldDefinition | null) => void;
  selectMission: (index: number) => void;
  revealNextHint: () => void;
  validateCurrentMission: () => Promise<boolean>;
  advanceToNextMission: () => void;
  closeWorldCompletedModal: () => void;
  isWorldUnlocked: (worldId: string) => boolean;
  getWorldUnlockRequirement: (worldId: string) => {
    isUnlocked: boolean;
    requiredTier: string;
    completedInTier: number;
    requiredCount: number;
    description: string;
  };
}

export const useExcelStore = create<ExcelState>((set, get) => ({
  workbook: evaluateWorkbook(createEmptyWorkbook('Sheet1', 50, 26)),
  activeSheet: 'Sheet1',
  activeCell: 'A1',
  selectedRange: null,
  formulaBarValue: '',
  isEditing: false,
  clipboard: null,

  activeWorld: null,
  activeMissionIndex: 0,
  revealedHintsCount: 0,
  validationFeedback: null,
  isValidating: false,
  isWorldCompletedModalOpen: false,
  worldProgress: {},

  loadWorkbook: (workbook) => {
    const evaluated = evaluateWorkbook(JSON.parse(JSON.stringify(workbook)));
    const activeSheet = evaluated.activeSheet || Object.keys(evaluated.sheets)[0] || 'Sheet1';
    const activeCell = 'A1';
    const cell = evaluated.sheets[activeSheet]?.cells[activeCell];
    const formulaBarValue = cell?.formula || (cell?.raw !== undefined ? String(cell.raw) : '');

    set({
      workbook: evaluated,
      activeSheet,
      activeCell,
      selectedRange: null,
      formulaBarValue,
      isEditing: false,
    });
  },

  setActiveCell: (cellId) => {
    const upperId = cellId.toUpperCase().replace(/\$/g, '');
    const { workbook, activeSheet } = get();
    const cell = workbook.sheets[activeSheet]?.cells[upperId];
    const formulaBarValue = cell?.formula || (cell?.raw !== undefined ? String(cell.raw) : '');

    set({
      activeCell: upperId,
      formulaBarValue,
      isEditing: false,
    });
  },

  setSelectedRange: (range) => set({ selectedRange: range }),

  setActiveSheet: (sheetName) => {
    const { workbook } = get();
    if (workbook.sheets[sheetName]) {
      const activeCell = 'A1';
      const cell = workbook.sheets[sheetName].cells[activeCell];
      const formulaBarValue = cell?.formula || (cell?.raw !== undefined ? String(cell.raw) : '');

      set({
        activeSheet: sheetName,
        activeCell,
        selectedRange: null,
        formulaBarValue,
        isEditing: false,
      });
    }
  },

  addSheet: (sheetName) => {
    const { workbook } = get();
    const clonedWb = JSON.parse(JSON.stringify(workbook));
    const name = sheetName || `Sheet${Object.keys(clonedWb.sheets).length + 1}`;
    if (!clonedWb.sheets[name]) {
      clonedWb.sheets[name] = {
        name,
        cells: {},
        rowCount: 50,
        colCount: 26,
      };
      if (clonedWb.sheetOrder) {
        clonedWb.sheetOrder.push(name);
      } else {
        clonedWb.sheetOrder = Object.keys(clonedWb.sheets);
      }
      set({ workbook: clonedWb, activeSheet: name, activeCell: 'A1', formulaBarValue: '' });
    }
  },

  deleteSheet: (sheetName) => {
    const { workbook, activeSheet } = get();
    const sheetKeys = Object.keys(workbook.sheets);
    if (sheetKeys.length <= 1) return; // Cannot delete only sheet

    const clonedWb = JSON.parse(JSON.stringify(workbook));
    delete clonedWb.sheets[sheetName];
    if (clonedWb.sheetOrder) {
      clonedWb.sheetOrder = clonedWb.sheetOrder.filter((s: string) => s !== sheetName);
    }
    const remainingSheets = Object.keys(clonedWb.sheets);
    const newActive = activeSheet === sheetName ? remainingSheets[0] : activeSheet;
    clonedWb.activeSheet = newActive;
    evaluateWorkbook(clonedWb);

    set({ workbook: clonedWb, activeSheet: newActive, activeCell: 'A1', formulaBarValue: '' });
  },

  setFormulaBarValue: (val) => set({ formulaBarValue: val }),

  setIsEditing: (isEditing) => set({ isEditing }),

  updateActiveCellContent: (content) => {
    const { workbook, activeSheet, activeCell } = get();
    const clonedWb = JSON.parse(JSON.stringify(workbook));
    setCellValue(clonedWb, activeSheet, activeCell, content);

    const cell = clonedWb.sheets[activeSheet]?.cells[activeCell];
    const formulaBarValue = cell?.formula || (cell?.raw !== undefined ? String(cell.raw) : '');

    set({
      workbook: clonedWb,
      formulaBarValue,
    });
  },

  updateCellContent: (sheetName, cellId, content) => {
    const { workbook, activeCell } = get();
    const clonedWb = JSON.parse(JSON.stringify(workbook));
    setCellValue(clonedWb, sheetName, cellId, content);

    const cell = clonedWb.sheets[sheetName]?.cells[activeCell];
    const formulaBarValue = cell?.formula || (cell?.raw !== undefined ? String(cell.raw) : '');

    set({
      workbook: clonedWb,
      formulaBarValue,
    });
  },

  applyFormatToActive: (format, options) => {
    const { workbook, activeSheet, activeCell, selectedRange } = get();
    const clonedWb = JSON.parse(JSON.stringify(workbook));
    const targetCells = selectedRange
      ? getCellsInRange(`${selectedRange.start}:${selectedRange.end}`)
      : [activeCell];

    const sheet = clonedWb.sheets[activeSheet];
    if (sheet) {
      for (const cId of targetCells) {
        if (!sheet.cells[cId]) sheet.cells[cId] = {};
        sheet.cells[cId].format = format;
        if (options) sheet.cells[cId].formatOptions = options;
        sheet.cells[cId].displayValue = formatCellValue(
          sheet.cells[cId].value ?? sheet.cells[cId].raw,
          format,
          sheet.cells[cId].formatOptions
        );
      }
    }

    set({ workbook: clonedWb });
  },

  applyStyleToActive: (style) => {
    const { workbook, activeSheet, activeCell, selectedRange } = get();
    const clonedWb = JSON.parse(JSON.stringify(workbook));
    const targetCells = selectedRange
      ? getCellsInRange(`${selectedRange.start}:${selectedRange.end}`)
      : [activeCell];

    const sheet = clonedWb.sheets[activeSheet];
    if (sheet) {
      for (const cId of targetCells) {
        if (!sheet.cells[cId]) sheet.cells[cId] = {};
        sheet.cells[cId].style = {
          ...sheet.cells[cId].style,
          ...style,
        };
      }
    }

    set({ workbook: clonedWb });
  },

  recalculate: () => {
    const { workbook } = get();
    const clonedWb = JSON.parse(JSON.stringify(workbook));
    evaluateWorkbook(clonedWb);
    set({ workbook: clonedWb });
  },

  getSelectionStats: (): SelectionStats => {
    const { workbook, activeSheet, activeCell, selectedRange } = get();
    const sheet = workbook.sheets[activeSheet];
    if (!sheet) return { sum: 0, avg: 0, count: 0 };

    const cellsToInspect = selectedRange
      ? getCellsInRange(`${selectedRange.start}:${selectedRange.end}`)
      : [activeCell];

    let sum = 0;
    let numericCount = 0;

    for (const cId of cellsToInspect) {
      const cell = sheet.cells[cId];
      if (!cell) continue;
      const val = cell.value !== undefined ? cell.value : cell.raw;
      const num = Number(val);
      if (typeof val === 'number' || (!isNaN(num) && val !== null && val !== '')) {
        sum += num;
        numericCount++;
      }
    }

    return {
      sum,
      avg: numericCount > 0 ? sum / numericCount : 0,
      count: numericCount,
    };
  },

  // Clipboard implementations
  copyActiveCell: () => {
    const { workbook, activeSheet, activeCell } = get();
    const cell = workbook.sheets[activeSheet]?.cells[activeCell];
    if (!cell) return;
    set({
      clipboard: {
        type: 'copy',
        cellId: activeCell,
        sheetName: activeSheet,
        data: JSON.parse(JSON.stringify(cell)),
      },
    });
  },

  cutActiveCell: () => {
    const { workbook, activeSheet, activeCell } = get();
    const cell = workbook.sheets[activeSheet]?.cells[activeCell];
    if (!cell) return;
    set({
      clipboard: {
        type: 'cut',
        cellId: activeCell,
        sheetName: activeSheet,
        data: JSON.parse(JSON.stringify(cell)),
      },
    });
    // Clear active cell
    get().updateActiveCellContent('');
  },

  pasteToActiveCell: () => {
    const { clipboard, workbook, activeSheet, activeCell } = get();
    if (!clipboard || !clipboard.data) return;

    const clonedWb = JSON.parse(JSON.stringify(workbook));
    const sheet = clonedWb.sheets[activeSheet];
    if (!sheet) return;

    const contentToPaste = clipboard.data.formula
      ? clipboard.data.formula
      : clipboard.data.raw !== undefined
      ? String(clipboard.data.raw)
      : '';

    setCellValue(clonedWb, activeSheet, activeCell, contentToPaste);

    if (clipboard.data.style) {
      sheet.cells[activeCell].style = {
        ...sheet.cells[activeCell].style,
        ...clipboard.data.style,
      };
    }
    if (clipboard.data.format) {
      sheet.cells[activeCell].format = clipboard.data.format;
      sheet.cells[activeCell].formatOptions = clipboard.data.formatOptions;
    }

    evaluateWorkbook(clonedWb);
    const updatedCell = sheet.cells[activeCell];
    const formulaBarValue =
      updatedCell?.formula || (updatedCell?.raw !== undefined ? String(updatedCell.raw) : '');

    set({
      workbook: clonedWb,
      formulaBarValue,
      clipboard: clipboard.type === 'cut' ? null : clipboard,
    });
  },

  // World and Mission Progression
  loadWorld: (world) => {
    // Clone world's initial workbook
    const initialWb = JSON.parse(JSON.stringify(world.initialWorkbook));
    const evaluated = evaluateWorkbook(initialWb);
    const activeSheet = evaluated.activeSheet || Object.keys(evaluated.sheets)[0];

    // Find first mission and target cell
    const firstMission = world.missions[0];
    const targetCell = firstMission?.targetCell || 'A1';
    const cell = evaluated.sheets[activeSheet]?.cells[targetCell];
    const formulaBarValue = cell?.formula || (cell?.raw !== undefined ? String(cell.raw) : '');

    set({
      activeWorld: world,
      activeMissionIndex: 0,
      workbook: evaluated,
      activeSheet,
      activeCell: targetCell,
      selectedRange: null,
      formulaBarValue,
      isEditing: false,
      revealedHintsCount: 0,
      validationFeedback: null,
      isWorldCompletedModalOpen: false,
    });
  },

  setActiveWorld: (world) => {
    if (world) {
      get().loadWorld(world);
    } else {
      set({
        activeWorld: null,
        activeMissionIndex: 0,
        validationFeedback: null,
        isWorldCompletedModalOpen: false,
      });
    }
  },

  selectMission: (index) => {
    const { activeWorld, workbook } = get();
    if (!activeWorld || index < 0 || index >= activeWorld.missions.length) return;

    const mission = activeWorld.missions[index];
    const targetCell = mission.targetCell || 'A1';
    const targetSheet = mission.sheetName || activeWorld.initialWorkbook.activeSheet;

    const activeSheet = workbook.sheets[targetSheet] ? targetSheet : get().activeSheet;
    const cell = workbook.sheets[activeSheet]?.cells[targetCell];
    const formulaBarValue = cell?.formula || (cell?.raw !== undefined ? String(cell.raw) : '');

    set({
      activeMissionIndex: index,
      activeSheet,
      activeCell: targetCell,
      formulaBarValue,
      revealedHintsCount: 0,
      validationFeedback: null,
    });
  },

  revealNextHint: () => {
    const { revealedHintsCount } = get();
    if (revealedHintsCount < 3) {
      soundService.playHintPing();
      set({ revealedHintsCount: revealedHintsCount + 1 });
    }
  },

  validateCurrentMission: async () => {
    const { activeWorld, activeMissionIndex, workbook, worldProgress } = get();
    if (!activeWorld) return false;

    const mission = activeWorld.missions[activeMissionIndex];
    if (!mission) return false;

    set({ isValidating: true });

    // Validate using validator engine
    const result = validateExcelMission(mission, workbook);

    if (result.passed) {
      soundService.playSuccessChime();

      // Confetti celebration
      try {
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
          const testCanvas = document.createElement('canvas');
          if (testCanvas.getContext && testCanvas.getContext('2d')) {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#10b981', '#06b6d4', '#107c41', '#fbbf24'],
            });
          }
        }
      } catch {
        // Safe fallback in test environments
      }

      // Award XP
      if (mission.xpReward) {
        try {
          await useUserStore.getState().addXp(mission.xpReward);
        } catch {
          // Fallback
        }
      }

      // Update world progress
      const prevProg = worldProgress[activeWorld.id] || {
        completedMissionsCount: 0,
        totalMissionsCount: activeWorld.missions.length,
        percentComplete: 0,
        isCompleted: false,
      };

      const newCompletedCount = Math.max(prevProg.completedMissionsCount, activeMissionIndex + 1);
      const isCompleted = newCompletedCount >= activeWorld.missions.length;
      const updatedWorldProgress: Record<string, ExcelWorldProgress> = {
        ...worldProgress,
        [activeWorld.id]: {
          completedMissionsCount: newCompletedCount,
          totalMissionsCount: activeWorld.missions.length,
          percentComplete: Math.round((newCompletedCount / activeWorld.missions.length) * 100),
          isCompleted,
        },
      };

      const isLastMission = activeMissionIndex === activeWorld.missions.length - 1;

      set({
        validationFeedback: result,
        isValidating: false,
        worldProgress: updatedWorldProgress,
        isWorldCompletedModalOpen: isLastMission,
      });

      if (isCompleted) {
        try {
          await useUserStore.getState().markWorldCompleted(activeWorld.id);
        } catch {
          // Fallback
        }
      }

      return true;
    } else {
      soundService.playErrorBuzz();
      set({
        validationFeedback: result,
        isValidating: false,
      });
      return false;
    }
  },

  advanceToNextMission: () => {
    const { activeWorld, activeMissionIndex } = get();
    if (!activeWorld) return;
    if (activeMissionIndex < activeWorld.missions.length - 1) {
      get().selectMission(activeMissionIndex + 1);
    }
  },

  closeWorldCompletedModal: () => set({ isWorldCompletedModalOpen: false }),

  isWorldUnlocked: (worldId: string): boolean => {
    return get().getWorldUnlockRequirement(worldId).isUnlocked;
  },

  getWorldUnlockRequirement: (worldId: string) => {
    const world = EXCEL_WORLDS_REGISTRY.find((w) => w.id === worldId);
    if (!world) {
      return {
        isUnlocked: false,
        requiredTier: 'Unknown',
        completedInTier: 0,
        requiredCount: 0,
        description: 'World not found',
      };
    }

    if (world.difficulty === 'Beginner') {
      return {
        isUnlocked: true,
        requiredTier: 'Beginner',
        completedInTier: 0,
        requiredCount: 0,
        description: 'Unlocked by default',
      };
    }

    const { worldProgress } = get();
    const isDone = (id: string) => {
      if (worldProgress[id]?.isCompleted) return true;
      try {
        const { profile } = useUserStore.getState();
        if (profile?.completedWorlds?.includes(id)) return true;
      } catch {
        // Fallback
      }
      return false;
    };

    const beginnerWorlds = EXCEL_WORLDS_REGISTRY.filter((w) => w.difficulty === 'Beginner');
    const intermediateWorlds = EXCEL_WORLDS_REGISTRY.filter((w) => w.difficulty === 'Intermediate');

    const completedBeginner = beginnerWorlds.filter((w) => isDone(w.id)).length;
    const completedIntermediate = intermediateWorlds.filter((w) => isDone(w.id)).length;

    if (world.difficulty === 'Intermediate') {
      const required = Math.min(2, beginnerWorlds.length);
      const isUnlocked = completedBeginner >= required;
      const remaining = Math.max(0, required - completedBeginner);
      return {
        isUnlocked,
        requiredTier: 'Beginner',
        completedInTier: completedBeginner,
        requiredCount: required,
        description: isUnlocked
          ? 'Unlocked'
          : `Complete ${remaining} more Beginner World${remaining > 1 ? 's' : ''} to unlock`,
      };
    }

    if (world.difficulty === 'Advanced') {
      const required = Math.min(2, intermediateWorlds.length);
      const isUnlocked = completedIntermediate >= required;
      const remaining = Math.max(0, required - completedIntermediate);
      return {
        isUnlocked,
        requiredTier: 'Intermediate',
        completedInTier: completedIntermediate,
        requiredCount: required,
        description: isUnlocked
          ? 'Unlocked'
          : `Complete ${remaining} more Intermediate World${remaining > 1 ? 's' : ''} to unlock`,
      };
    }

    return {
      isUnlocked: true,
      requiredTier: 'Unknown',
      completedInTier: 0,
      requiredCount: 0,
      description: 'Unlocked',
    };
  },
}));
