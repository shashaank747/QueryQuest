import React, { useState, useEffect, useRef } from 'react';
import {
  colToLetter,
  letterToCol,
  parseRange,
} from '../../modules/excel/engine';
import { useExcelStore } from '../../stores/useExcelStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { Target } from 'lucide-react';

export const ExcelGrid: React.FC = () => {
  const {
    workbook,
    activeSheet,
    activeCell,
    selectedRange,
    isEditing,
    activeWorld,
    activeMissionIndex,
    setActiveCell,
    setSelectedRange,
    setIsEditing,
    updateActiveCellContent,
  } = useExcelStore();

  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';

  const sheet = workbook.sheets[activeSheet] || {
    name: activeSheet,
    cells: {},
    rowCount: 50,
    colCount: 26,
  };

  const rowCount = Math.max(sheet.rowCount || 35, 35);
  const colCount = Math.max(sheet.colCount || 16, 16);

  // Active mission's target cell
  const currentMission = activeWorld?.missions[activeMissionIndex];
  const targetCellCoord = currentMission?.targetCell;

  // Inline editing state
  const [inlineEditValue, setInlineEditValue] = useState('');
  const inlineInputRef = useRef<HTMLInputElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Mouse dragging for range selection
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragStartCell, setDragStartCell] = useState<string | null>(null);

  // Parse active cell row and col
  const activeCoordMatch = activeCell.match(/^([A-Z]+)([1-9][0-9]*)$/);
  const activeCol = activeCoordMatch ? letterToCol(activeCoordMatch[1]) : 1;
  const activeRow = activeCoordMatch ? parseInt(activeCoordMatch[2], 10) : 1;

  // Selected range coordinates
  const parsedRange = selectedRange ? parseRange(`${selectedRange.start}:${selectedRange.end}`) : null;

  // When active cell changes, update inline edit value
  useEffect(() => {
    const cell = sheet.cells[activeCell];
    const val = cell?.formula || (cell?.raw !== undefined ? String(cell.raw) : '');
    setInlineEditValue(val);
  }, [activeCell, sheet.cells]);

  // Focus inline input when editing
  useEffect(() => {
    if (isEditing && inlineInputRef.current) {
      inlineInputRef.current.focus();
    }
  }, [isEditing]);

  const handleCellClick = (cellId: string, e: React.MouseEvent) => {
    if (e.shiftKey && activeCell) {
      // Shift+Click creates or expands range
      setSelectedRange({ start: activeCell, end: cellId });
    } else {
      setActiveCell(cellId);
      setSelectedRange(null);
    }
    setIsEditing(false);
  };

  const handleCellMouseDown = (cellId: string) => {
    setIsMouseDown(true);
    setDragStartCell(cellId);
    setActiveCell(cellId);
    setSelectedRange(null);
    setIsEditing(false);
  };

  const handleCellMouseEnter = (cellId: string) => {
    if (isMouseDown && dragStartCell) {
      setSelectedRange({ start: dragStartCell, end: cellId });
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleCellDoubleClick = (cellId: string) => {
    setActiveCell(cellId);
    const cell = sheet.cells[cellId];
    setInlineEditValue(cell?.formula || (cell?.raw !== undefined ? String(cell.raw) : ''));
    setIsEditing(true);
  };

  const handleInlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInlineEditValue(val);
    updateActiveCellContent(val);
  };

  const handleInlineKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditing(false);
      // Move down
      const nextRow = Math.min(activeRow + 1, rowCount);
      setActiveCell(`${colToLetter(activeCol)}${nextRow}`);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setIsEditing(false);
      // Move right
      const nextCol = Math.min(activeCol + 1, colCount);
      setActiveCell(`${colToLetter(nextCol)}${activeRow}`);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  // Keyboard navigation on the grid container
  const handleGridKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isEditing) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (activeRow > 1) {
        setActiveCell(`${colToLetter(activeCol)}${activeRow - 1}`);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (activeRow < rowCount) {
        setActiveCell(`${colToLetter(activeCol)}${activeRow + 1}`);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (activeCol > 1) {
        setActiveCell(`${colToLetter(activeCol - 1)}${activeRow}`);
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (activeCol < colCount) {
        setActiveCell(`${colToLetter(activeCol + 1)}${activeRow}`);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        if (activeCol > 1) setActiveCell(`${colToLetter(activeCol - 1)}${activeRow}`);
      } else {
        if (activeCol < colCount) setActiveCell(`${colToLetter(activeCol + 1)}${activeRow}`);
      }
    } else if (e.key === 'Enter' || e.key === 'F2') {
      e.preventDefault();
      setIsEditing(true);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      updateActiveCellContent('');
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Start typing directly into active cell
      setIsEditing(true);
      setInlineEditValue(e.key);
      updateActiveCellContent(e.key);
    }
  };

  // Check if cell is in selected range
  const isCellInRange = (colIdx: number, rowIdx: number) => {
    if (!parsedRange) return false;
    const minCol = Math.min(parsedRange.start.col, parsedRange.end.col);
    const maxCol = Math.max(parsedRange.start.col, parsedRange.end.col);
    const minRow = Math.min(parsedRange.start.row, parsedRange.end.row);
    const maxRow = Math.max(parsedRange.start.row, parsedRange.end.row);
    return colIdx >= minCol && colIdx <= maxCol && rowIdx >= minRow && rowIdx <= maxRow;
  };

  return (
    <div
      ref={gridContainerRef}
      tabIndex={0}
      onKeyDown={handleGridKeyDown}
      onMouseUp={handleMouseUp}
      className={`flex-1 overflow-auto outline-none select-none relative ${
        isLight ? 'bg-slate-100' : 'bg-slate-950'
      }`}
      style={{ maxHeight: 'calc(100vh - 240px)' }}
    >
      <table className="border-collapse table-fixed w-max text-xs">
        {/* Sticky Header Row (Column Letters: A, B, C...) */}
        <thead>
          <tr className="sticky top-0 z-10">
            {/* Top-Left Corner Cell */}
            <th
              className={`w-12 h-6 min-w-[48px] text-[10px] font-bold border-r border-b sticky left-0 z-20 ${
                isLight ? 'bg-slate-200 border-slate-300 text-slate-600' : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              ◢
            </th>

            {/* Column Headers */}
            {Array.from({ length: colCount }).map((_, colIdx) => {
              const letter = colToLetter(colIdx + 1);
              const isColActive = activeCol === colIdx + 1;
              return (
                <th
                  key={letter}
                  className={`w-28 min-w-[110px] h-6 px-1 font-semibold text-center border-r border-b text-[11px] ${
                    isColActive
                      ? 'bg-emerald-600 text-white font-bold'
                      : isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                  }`}
                >
                  {letter}
                </th>
              );
            })}
          </tr>
        </thead>

        {/* Rows (1, 2, 3...) */}
        <tbody>
          {Array.from({ length: rowCount }).map((_, rIdx) => {
            const rowNumber = rIdx + 1;
            const isRowActive = activeRow === rowNumber;

            return (
              <tr key={rowNumber} className="h-6">
                {/* Row Number Header */}
                <th
                  className={`w-12 h-6 min-w-[48px] text-[10px] font-semibold text-center border-r border-b sticky left-0 z-10 ${
                    isRowActive
                      ? 'bg-emerald-600 text-white font-bold'
                      : isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400'
                  }`}
                >
                  {rowNumber}
                </th>

                {/* Grid Cells */}
                {Array.from({ length: colCount }).map((_, cIdx) => {
                  const colNumber = cIdx + 1;
                  const cellId = `${colToLetter(colNumber)}${rowNumber}`;
                  const cellData = sheet.cells[cellId];
                  const isActive = activeCell === cellId;
                  const inRange = isCellInRange(colNumber, rowNumber);
                  const isTargetCell = targetCellCoord === cellId;

                  // Compute display content
                  let displayContent = '';
                  if (cellData) {
                    if (cellData.displayValue !== undefined) {
                      displayContent = cellData.displayValue;
                    } else if (cellData.value !== undefined && cellData.value !== null) {
                      displayContent = String(cellData.value);
                    } else if (cellData.raw !== undefined && cellData.raw !== null) {
                      displayContent = String(cellData.raw);
                    }
                  }

                  // Styling rules from CellStyle
                  const cellStyle = cellData?.style || {};
                  const isBold = cellStyle.bold;
                  const isItalic = cellStyle.italic;
                  const isUnderline = cellStyle.underline;
                  const textAlign = cellStyle.align || 'left';
                  const customFill = cellStyle.fill;
                  const customColor = cellStyle.color;

                  // Error check
                  const isError =
                    typeof cellData?.value === 'string' && cellData.value.startsWith('#');

                  return (
                    <td
                      key={cellId}
                      onClick={(e) => handleCellClick(cellId, e)}
                      onDoubleClick={() => handleCellDoubleClick(cellId)}
                      onMouseDown={() => handleCellMouseDown(cellId)}
                      onMouseEnter={() => handleCellMouseEnter(cellId)}
                      className={`relative w-28 min-w-[110px] h-6 px-1.5 py-0.5 border-r border-b text-xs truncate cursor-cell transition-colors font-sans ${
                        isLight
                          ? 'border-slate-200 bg-white text-slate-900'
                          : 'border-slate-800/90 bg-slate-900 text-slate-100'
                      } ${inRange && !isActive ? 'bg-emerald-500/15 !border-emerald-500/40' : ''} ${
                        isActive
                          ? 'outline outline-2 outline-[#107c41] z-10 !bg-emerald-50/20 dark:!bg-emerald-950/20'
                          : ''
                      } ${
                        isTargetCell && !isActive
                          ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-transparent animate-pulse bg-amber-500/10'
                          : ''
                      }`}
                      style={{
                        backgroundColor: customFill || undefined,
                        color: isError ? '#ef4444' : customColor || undefined,
                        fontWeight: isBold ? 'bold' : 'normal',
                        fontStyle: isItalic ? 'italic' : 'normal',
                        textDecoration: isUnderline ? 'underline' : 'none',
                        textAlign,
                      }}
                      title={
                        isTargetCell
                          ? `Target Mission Cell: ${cellId}`
                          : cellData?.formula
                          ? `Formula: ${cellData.formula}`
                          : cellId
                      }
                    >
                      {/* Target Cell Badge Indicator */}
                      {isTargetCell && !isEditing && (
                        <div
                          className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[8px] font-black shadow-sm z-20 pointer-events-none"
                          title="Target Cell for Current Objective"
                        >
                          <Target className="w-2.5 h-2.5" />
                        </div>
                      )}

                      {/* Active Cell Corner Fill Handle */}
                      {isActive && !isEditing && (
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#107c41] border border-white dark:border-slate-900 z-20 pointer-events-none" />
                      )}

                      {/* Cell Inline Input (When Editing) */}
                      {isActive && isEditing ? (
                        <input
                          ref={inlineInputRef}
                          type="text"
                          value={inlineEditValue}
                          onChange={handleInlineChange}
                          onKeyDown={handleInlineKeyDown}
                          className="absolute inset-0 w-full h-full px-1.5 font-mono text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none z-30 border border-[#107c41]"
                        />
                      ) : (
                        <span className="block truncate">{displayContent}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
