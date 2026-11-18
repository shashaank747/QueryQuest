import React from 'react';
import { Plus, X } from 'lucide-react';
import { useExcelStore } from '../../stores/useExcelStore';
import { useThemeStore } from '../../stores/useThemeStore';

export const ExcelSheetTabs: React.FC = () => {
  const {
    workbook,
    activeSheet,
    isEditing,
    setActiveSheet,
    addSheet,
    deleteSheet,
    getSelectionStats,
  } = useExcelStore();

  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';

  const sheetNames = workbook.sheetOrder || Object.keys(workbook.sheets);
  const stats = getSelectionStats();

  return (
    <div
      className={`flex items-center justify-between px-2 py-1 border-t text-xs select-none ${
        isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'
      }`}
    >
      {/* 1. Sheet Tabs List */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {sheetNames.map((sheetName) => {
          const isActive = activeSheet === sheetName;
          return (
            <div
              key={sheetName}
              onClick={() => setActiveSheet(sheetName)}
              className={`group flex items-center gap-1.5 px-3 py-1 rounded-t-md font-medium text-xs cursor-pointer border-t border-l border-r transition-all ${
                isActive
                  ? isLight
                    ? 'bg-white border-slate-300 text-[#107c41] font-bold shadow-sm'
                    : 'bg-slate-850 border-slate-700 text-emerald-400 font-bold'
                  : isLight
                  ? 'bg-slate-200/60 hover:bg-slate-200 border-transparent text-slate-600'
                  : 'bg-slate-900 hover:bg-slate-800 border-transparent text-slate-400'
              }`}
            >
              <span>{sheetName}</span>
              {sheetNames.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSheet(sheetName);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:text-rose-500 rounded p-0.5 transition-opacity"
                  title="Delete Sheet"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          );
        })}

        {/* Add Sheet (+) Button */}
        <button
          onClick={() => addSheet()}
          className="w-6 h-6 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center transition-colors"
          title="Add New Sheet"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Live Excel Status Bar (Ready/Edit, Average, Count, Sum) */}
      <div className="flex items-center gap-3 text-[11px] font-mono text-slate-600 dark:text-slate-400">
        <span
          className={`px-1.5 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider ${
            isEditing
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
          }`}
        >
          {isEditing ? 'Edit' : 'Ready'}
        </span>

        {stats.count > 0 && (
          <div className="flex items-center gap-3 border-l border-slate-300 dark:border-slate-800 pl-3">
            <span>
              Average: <strong>{stats.avg.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>
            </span>
            <span>
              Count: <strong>{stats.count}</strong>
            </span>
            <span>
              Sum: <strong>{stats.sum.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>
            </span>
          </div>
        )}

        <div className="hidden sm:flex items-center gap-1 text-[10px] font-sans text-slate-400 border-l border-slate-300 dark:border-slate-800 pl-3">
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};
