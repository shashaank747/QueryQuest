import React, { useState, useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';
import { useExcelStore } from '../../stores/useExcelStore';
import { useThemeStore } from '../../stores/useThemeStore';

export const ExcelFormulaBar: React.FC = () => {
  const {
    activeCell,
    formulaBarValue,
    setActiveCell,
    setFormulaBarValue,
    updateActiveCellContent,
    setIsEditing,
  } = useExcelStore();

  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';

  const [nameBoxInput, setNameBoxInput] = useState(activeCell);
  const inputRef = useRef<HTMLInputElement>(null);

  // Synchronize name box with active cell changes
  useEffect(() => {
    setNameBoxInput(activeCell);
  }, [activeCell]);

  const handleNameBoxKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = nameBoxInput.trim().toUpperCase();
      if (/^[A-Z]+[1-9][0-9]*$/.test(trimmed)) {
        setActiveCell(trimmed);
      } else {
        setNameBoxInput(activeCell);
      }
    } else if (e.key === 'Escape') {
      setNameBoxInput(activeCell);
    }
  };

  const handleFormulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormulaBarValue(val);
    updateActiveCellContent(val);
    setIsEditing(true);
  };

  const handleFormulaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditing(false);
      // Move active cell down 1 row
      const match = activeCell.match(/^([A-Z]+)([1-9][0-9]*)$/);
      if (match) {
        const colStr = match[1];
        const nextRow = parseInt(match[2], 10) + 1;
        setActiveCell(`${colStr}${nextRow}`);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setIsEditing(false);
      // Move active cell right 1 column
      // Simple A->B->C
      const match = activeCell.match(/^([A-Z]+)([1-9][0-9]*)$/);
      if (match) {
        const colCharCode = match[1].charCodeAt(0);
        const rowStr = match[2];
        const nextCol = String.fromCharCode(colCharCode + 1);
        setActiveCell(`${nextCol}${rowStr}`);
      }
    }
  };

  const handleAccept = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div
      className={`flex items-center px-2 py-1 border-b text-xs select-none ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}
    >
      {/* 1. Name Box */}
      <div className="flex items-center mr-2">
        <input
          type="text"
          value={nameBoxInput}
          onChange={(e) => setNameBoxInput(e.target.value.toUpperCase())}
          onKeyDown={handleNameBoxKeyDown}
          onBlur={() => setNameBoxInput(activeCell)}
          className={`w-16 h-6 px-1.5 font-mono font-bold text-center rounded border transition-colors ${
            isLight
              ? 'bg-slate-50 border-slate-300 text-slate-800 focus:bg-white focus:border-emerald-500'
              : 'bg-slate-800 border-slate-700 text-slate-100 focus:bg-slate-750 focus:border-emerald-500'
          } outline-none`}
          title="Name Box: Click or type cell coordinate (e.g. D12) and press Enter"
        />
      </div>

      {/* 2. Formula Buttons (Cancel, Accept, fx) */}
      <div className="flex items-center gap-0.5 px-1 mr-2 border-l border-r border-slate-200 dark:border-slate-800">
        <button
          onClick={handleCancel}
          className="w-5 h-5 rounded hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors"
          title="Cancel (Esc)"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleAccept}
          className="w-5 h-5 rounded hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-500 flex items-center justify-center transition-colors"
          title="Enter / Commit (Enter)"
        >
          <Check className="w-3.5 h-3.5" />
        </button>

        <div className="w-5 h-5 flex items-center justify-center font-serif italic font-black text-sm text-[#107c41] dark:text-emerald-400 select-none">
          fx
        </div>
      </div>

      {/* 3. Interactive Formula Input Bar */}
      <div className="flex-1 flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={formulaBarValue}
          onChange={handleFormulaChange}
          onKeyDown={handleFormulaKeyDown}
          onFocus={() => setIsEditing(true)}
          placeholder="Enter formula or value (e.g. =SUM(D2:D11) or Basmati Rice)"
          className={`w-full h-6 px-2.5 font-mono text-xs rounded border transition-all ${
            isLight
              ? 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500'
              : 'bg-slate-850 border-slate-700 text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
          } outline-none`}
        />
      </div>
    </div>
  );
};
