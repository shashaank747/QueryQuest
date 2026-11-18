import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Scissors,
  Copy,
  ClipboardPaste,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  WrapText,
  FoldHorizontal,
  DollarSign,
  Binary,
  Sigma,
  ArrowUpDown,
  Filter,
  Calendar,
  Search,
  ChevronDown,
  RotateCw,
  ArrowLeft,
  FileText,
  Table,
  BarChart3,
  Grid,
} from 'lucide-react';
import { useExcelStore } from '../../stores/useExcelStore';
import { useThemeStore } from '../../stores/useThemeStore';

export type RibbonTab = 'home' | 'insert' | 'formulas' | 'data' | 'view';

export const ExcelRibbon: React.FC = () => {
  const {
    activeWorld,
    activeSheet,
    activeCell,
    workbook,
    applyStyleToActive,
    applyFormatToActive,
    copyActiveCell,
    cutActiveCell,
    pasteToActiveCell,
    updateActiveCellContent,
    setIsEditing,
    recalculate,
    setActiveWorld,
  } = useExcelStore();

  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';

  const [activeTab, setActiveTab] = useState<RibbonTab>('home');
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [fontFamily, setFontFamily] = useState('Calibri');
  const [fontSize, setFontSize] = useState('11');
  const [showFillPalette, setShowFillPalette] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showBordersMenu, setShowBordersMenu] = useState(false);
  const [showAutoSumMenu, setShowAutoSumMenu] = useState(false);

  // Current active cell data for toggling styles
  const currentCell = workbook.sheets[activeSheet]?.cells[activeCell];
  const isBold = currentCell?.style?.bold ?? false;
  const isItalic = currentCell?.style?.italic ?? false;
  const isUnderline = currentCell?.style?.underline ?? false;
  const isWrap = currentCell?.style?.wrapText ?? false;
  const currentAlign = currentCell?.style?.align ?? 'left';

  const handleToggleBold = () => {
    applyStyleToActive({ bold: !isBold });
  };

  const handleToggleItalic = () => {
    applyStyleToActive({ italic: !isItalic });
  };

  const handleToggleUnderline = () => {
    applyStyleToActive({ underline: !isUnderline });
  };

  const handleToggleWrap = () => {
    applyStyleToActive({ wrapText: !isWrap });
  };

  const handleSetAlign = (align: 'left' | 'center' | 'right') => {
    applyStyleToActive({ align });
  };

  const handleFillColor = (color: string) => {
    applyStyleToActive({ fill: color });
    setShowFillPalette(false);
  };

  const handleTextColor = (color: string) => {
    applyStyleToActive({ color });
    setShowColorPalette(false);
  };

  const handleBorders = (borderType: string) => {
    if (borderType === 'none') {
      applyStyleToActive({ border: false });
    } else {
      applyStyleToActive({ border: borderType });
    }
    setShowBordersMenu(false);
  };

  const handleInsertFormulaTemplate = (template: string) => {
    updateActiveCellContent(template);
    setIsEditing(true);
  };

  const handleAutoSum = (funcName: string = 'SUM') => {
    // Insert e.g. "=SUM(" into cell
    handleInsertFormulaTemplate(`=${funcName}(`);
    setShowAutoSumMenu(false);
  };

  return (
    <div className="flex flex-col border-b border-emerald-950/20 shadow-sm select-none relative z-20">
      {/* 1. Iconic Dark Green Excel Top Header Bar */}
      <div className="bg-[#107c41] text-white px-3 py-1.5 flex items-center justify-between text-xs font-medium">
        <div className="flex items-center gap-3">
          {/* Back to Worlds / Grid */}
          <button
            onClick={() => setActiveWorld(null)}
            className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-emerald-700/80 transition-colors text-white font-bold text-[11px]"
            title="Return to Excel Industry Worlds"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Worlds</span>
          </button>

          {/* Excel Brand & Workbook Title */}
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-white/10 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-sm">
                {activeWorld ? activeWorld.spreadsheetName || `${activeWorld.name}.xlsx` : 'Book1.xlsx'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-700/60 border border-emerald-600/50 text-emerald-100 hidden sm:inline">
                Excel Track
              </span>
            </div>
          </div>

          {/* Quick Access Toolbar: Undo, Redo, Recalculate */}
          <div className="hidden md:flex items-center gap-1 ml-4 border-l border-emerald-700/80 pl-3">
            <button
              onClick={() => recalculate()}
              className="p-1 rounded hover:bg-emerald-700/80 text-emerald-100 hover:text-white transition-colors"
              title="Recalculate Workbook"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-emerald-200/90 ml-1">AutoSave On</span>
          </div>
        </div>

        {/* Right side stats/status */}
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-emerald-100 bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-700/50">
            Sheet: <strong>{activeSheet}</strong>
          </span>
          <span className="text-emerald-100 bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-700/50">
            Cell: <strong>{activeCell}</strong>
          </span>
        </div>
      </div>

      {/* 2. Ribbon Tabs Bar */}
      <div
        className={`flex items-center px-2 border-b text-xs font-semibold ${
          isLight
            ? 'bg-slate-50 border-slate-200 text-slate-700'
            : 'bg-slate-900 border-slate-800 text-slate-300'
        }`}
      >
        {/* File Button */}
        <div className="relative">
          <button
            onClick={() => setShowFileMenu(!showFileMenu)}
            className="px-3.5 py-1.5 font-bold text-white bg-[#107c41] hover:bg-emerald-700 transition-colors uppercase tracking-wider text-[11px] flex items-center gap-1"
          >
            File
            <ChevronDown className="w-3 h-3" />
          </button>
          {showFileMenu && (
            <div
              className={`absolute left-0 top-full mt-1 w-48 rounded-lg shadow-xl border py-1 z-50 text-xs ${
                isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-700 text-slate-200'
              }`}
            >
              <div className="px-3 py-1.5 font-bold border-b border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400">
                Workbook Operations
              </div>
              <button
                onClick={() => {
                  recalculate();
                  setShowFileMenu(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-emerald-500/10 flex items-center gap-2"
              >
                <RotateCw className="w-3.5 h-3.5 text-emerald-500" />
                Recalculate Formulas
              </button>
              <button
                onClick={() => {
                  setActiveWorld(null);
                  setShowFileMenu(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-rose-500/10 text-rose-500 flex items-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Exit to Worlds
              </button>
            </div>
          )}
        </div>

        {/* Tab Items */}
        {(['home', 'insert', 'formulas', 'data', 'view'] as RibbonTab[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 capitalize transition-all border-b-2 text-xs ${
                isActive
                  ? 'border-[#107c41] text-[#107c41] dark:text-emerald-400 font-bold bg-white dark:bg-slate-850'
                  : 'border-transparent hover:text-emerald-600 dark:hover:text-emerald-300'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 3. Ribbon Toolbar Body */}
      <div
        className={`px-3 py-2 flex items-center gap-3 overflow-x-auto text-xs min-h-[58px] ${
          isLight ? 'bg-white text-slate-800' : 'bg-slate-850 text-slate-200'
        }`}
      >
        {/* --- HOME TAB TOOLBAR --- */}
        {activeTab === 'home' && (
          <div className="flex items-center gap-3">
            {/* Clipboard Section */}
            <div className="flex items-center gap-1 pr-3 border-r border-slate-200 dark:border-slate-700/80">
              <button
                onClick={pasteToActiveCell}
                className="flex flex-col items-center justify-center px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                title="Paste (Ctrl+V)"
              >
                <ClipboardPaste className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] mt-0.5">Paste</span>
              </button>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={cutActiveCell}
                  className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-750 text-[11px]"
                  title="Cut (Ctrl+X)"
                >
                  <Scissors className="w-3 h-3 text-slate-500" />
                  <span>Cut</span>
                </button>
                <button
                  onClick={copyActiveCell}
                  className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-750 text-[11px]"
                  title="Copy (Ctrl+C)"
                >
                  <Copy className="w-3 h-3 text-slate-500" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* Font Section */}
            <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200 dark:border-slate-700/80">
              <div className="flex flex-col gap-1">
                {/* Family & Size Dropdowns */}
                <div className="flex items-center gap-1">
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className={`h-6 text-[11px] px-1.5 py-0 rounded border ${
                      isLight ? 'border-slate-200 bg-white' : 'border-slate-700 bg-slate-800 text-slate-200'
                    }`}
                  >
                    <option value="Calibri">Calibri</option>
                    <option value="Arial">Arial</option>
                    <option value="Segoe UI">Segoe UI</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Courier New">Courier New</option>
                  </select>

                  <select
                    value={fontSize}
                    onChange={(e) => {
                      setFontSize(e.target.value);
                      applyStyleToActive({ fontSize: parseInt(e.target.value, 10) });
                    }}
                    className={`h-6 text-[11px] px-1 rounded border ${
                      isLight ? 'border-slate-200 bg-white' : 'border-slate-700 bg-slate-800 text-slate-200'
                    }`}
                  >
                    {['9', '10', '11', '12', '14', '16', '18', '24'].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                {/* B, I, U, Fill, FontColor, Borders */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleToggleBold}
                    className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs transition-colors ${
                      isBold
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black border border-emerald-500/40'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-750'
                    }`}
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleToggleItalic}
                    className={`w-6 h-6 rounded flex items-center justify-center italic text-xs transition-colors ${
                      isItalic
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-750'
                    }`}
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleToggleUnderline}
                    className={`w-6 h-6 rounded flex items-center justify-center text-xs transition-colors ${
                      isUnderline
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-750'
                    }`}
                    title="Underline"
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>

                  {/* Borders Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowBordersMenu(!showBordersMenu)}
                      className="w-6 h-6 rounded hover:bg-slate-100 dark:hover:bg-slate-750 flex items-center justify-center text-slate-600 dark:text-slate-300"
                      title="Borders"
                    >
                      <Grid className="w-3.5 h-3.5" />
                    </button>
                    {showBordersMenu && (
                      <div
                        className={`absolute left-0 top-full mt-1 w-36 rounded-lg shadow-xl border p-1 z-50 text-[11px] ${
                          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'
                        }`}
                      >
                        <button
                          onClick={() => handleBorders('all')}
                          className="w-full text-left px-2 py-1 rounded hover:bg-emerald-500/10 flex items-center gap-1.5"
                        >
                          All Borders
                        </button>
                        <button
                          onClick={() => handleBorders('outside')}
                          className="w-full text-left px-2 py-1 rounded hover:bg-emerald-500/10 flex items-center gap-1.5"
                        >
                          Outside Border
                        </button>
                        <button
                          onClick={() => handleBorders('none')}
                          className="w-full text-left px-2 py-1 rounded hover:bg-rose-500/10 text-rose-500 flex items-center gap-1.5"
                        >
                          No Borders
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Fill Color */}
                  <div className="relative">
                    <button
                      onClick={() => setShowFillPalette(!showFillPalette)}
                      className="w-6 h-6 rounded hover:bg-slate-100 dark:hover:bg-slate-750 flex items-center justify-center text-amber-500"
                      title="Fill Color"
                    >
                      <span className="font-bold text-[11px] px-1 bg-amber-400/30 rounded">F</span>
                    </button>
                    {showFillPalette && (
                      <div
                        className={`absolute left-0 top-full mt-1 p-2 rounded-lg shadow-xl border z-50 grid grid-cols-4 gap-1.5 w-32 ${
                          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'
                        }`}
                      >
                        {[
                          { name: 'Yellow', color: '#fef08a' },
                          { name: 'Green', color: '#bbf7d0' },
                          { name: 'Blue', color: '#bfdbfe' },
                          { name: 'Red', color: '#fecaca' },
                          { name: 'Emerald', color: '#d1fae5' },
                          { name: 'Orange', color: '#fed7aa' },
                          { name: 'Slate', color: '#e2e8f0' },
                          { name: 'None', color: '' },
                        ].map((item) => (
                          <button
                            key={item.name}
                            onClick={() => handleFillColor(item.color)}
                            className="w-5 h-5 rounded border border-slate-400/40 hover:scale-110 transition-transform"
                            style={{ backgroundColor: item.color || 'transparent' }}
                            title={item.name}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Text Color */}
                  <div className="relative">
                    <button
                      onClick={() => setShowColorPalette(!showColorPalette)}
                      className="w-6 h-6 rounded hover:bg-slate-100 dark:hover:bg-slate-750 flex items-center justify-center text-rose-600 font-bold"
                      title="Font Color"
                    >
                      <span className="underline decoration-rose-500">A</span>
                    </button>
                    {showColorPalette && (
                      <div
                        className={`absolute left-0 top-full mt-1 p-2 rounded-lg shadow-xl border z-50 grid grid-cols-4 gap-1.5 w-32 ${
                          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'
                        }`}
                      >
                        {[
                          { name: 'Dark', color: '#0f172a' },
                          { name: 'Red', color: '#dc2626' },
                          { name: 'Green', color: '#16a34a' },
                          { name: 'Blue', color: '#2563eb' },
                          { name: 'White', color: '#ffffff' },
                          { name: 'Amber', color: '#d97706' },
                          { name: 'Purple', color: '#9333ea' },
                          { name: 'Default', color: '' },
                        ].map((item) => (
                          <button
                            key={item.name}
                            onClick={() => handleTextColor(item.color)}
                            className="w-5 h-5 rounded border border-slate-400/40 hover:scale-110 transition-transform"
                            style={{ backgroundColor: item.color || '#0f172a' }}
                            title={item.name}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Alignment Section */}
            <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200 dark:border-slate-700/80">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleSetAlign('left')}
                    className={`w-6 h-6 rounded flex items-center justify-center ${
                      currentAlign === 'left'
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300'
                    }`}
                    title="Align Left"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleSetAlign('center')}
                    className={`w-6 h-6 rounded flex items-center justify-center ${
                      currentAlign === 'center'
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300'
                    }`}
                    title="Center"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleSetAlign('right')}
                    className={`w-6 h-6 rounded flex items-center justify-center ${
                      currentAlign === 'right'
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300'
                    }`}
                    title="Align Right"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleToggleWrap}
                    className={`h-5 px-1.5 text-[10px] rounded flex items-center gap-1 ${
                      isWrap
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/40'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-400'
                    }`}
                    title="Wrap Text"
                  >
                    <WrapText className="w-3 h-3" />
                    <span>Wrap</span>
                  </button>
                  <button
                    onClick={() => {
                      // Visual merge marker
                      applyStyleToActive({ align: 'center' });
                    }}
                    className="h-5 px-1.5 text-[10px] rounded flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-400"
                    title="Merge & Center"
                  >
                    <FoldHorizontal className="w-3 h-3" />
                    <span>Merge</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Number Format Section */}
            <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200 dark:border-slate-700/80">
              <div className="flex flex-col gap-1">
                <select
                  onChange={(e) => applyFormatToActive(e.target.value as any)}
                  className={`h-6 text-[11px] px-2 py-0 rounded border ${
                    isLight ? 'border-slate-200 bg-white' : 'border-slate-700 bg-slate-800 text-slate-200'
                  }`}
                  defaultValue="general"
                >
                  <option value="general">General</option>
                  <option value="number">Number</option>
                  <option value="currency">Currency (₹ / $)</option>
                  <option value="percent">Percentage (%)</option>
                  <option value="date">Short Date</option>
                </select>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => applyFormatToActive('currency', { currencySymbol: '₹', decimalPlaces: 2 })}
                    className="h-5 px-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-750 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center"
                    title="Currency (₹ Rupee)"
                  >
                    ₹
                  </button>
                  <button
                    onClick={() => applyFormatToActive('currency', { currencySymbol: '$', decimalPlaces: 2 })}
                    className="h-5 px-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-750 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center"
                    title="Currency ($ Dollar)"
                  >
                    $
                  </button>
                  <button
                    onClick={() => applyFormatToActive('percent', { decimalPlaces: 1 })}
                    className="h-5 px-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-750 text-[11px] font-bold text-cyan-600 dark:text-cyan-400 flex items-center"
                    title="Percentage (%)"
                  >
                    %
                  </button>
                  <button
                    onClick={() => applyFormatToActive('number', { decimalPlaces: 2 })}
                    className="h-5 px-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-750 text-[10px] text-slate-600 dark:text-slate-400 font-mono"
                    title="Add Decimals (.00)"
                  >
                    .00
                  </button>
                </div>
              </div>
            </div>

            {/* Quick AutoSum & Filter Functions */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="flex flex-col items-center justify-center rounded transition-colors">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleAutoSum('SUM')}
                      className="flex items-center gap-1 px-1.5 py-1 rounded-l hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      title="AutoSum (Σ)"
                    >
                      <Sigma className="w-4 h-4" />
                      <span className="text-[10px] font-bold">AutoSum</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAutoSumMenu(!showAutoSumMenu);
                      }}
                      className="p-1 hover:bg-emerald-500/20 rounded-r text-emerald-600 dark:text-emerald-400"
                      title="More AutoSum Functions"
                    >
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
                {showAutoSumMenu && (
                  <div
                    className={`absolute left-0 top-full mt-1 w-36 rounded-lg shadow-xl border p-1 z-50 text-[11px] ${
                      isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-700'
                    }`}
                  >
                    {['SUM', 'AVERAGE', 'COUNT', 'MAX', 'MIN'].map((fn) => (
                      <button
                        key={fn}
                        onClick={() => handleAutoSum(fn)}
                        className="w-full text-left px-2 py-1 rounded hover:bg-emerald-500/10 font-mono text-emerald-600 dark:text-emerald-400 font-bold"
                      >
                        ={fn}()
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => recalculate()}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-750 text-[11px]"
                  title="Sort A to Z"
                >
                  <ArrowUpDown className="w-3 h-3 text-cyan-500" />
                  <span>Sort A-Z</span>
                </button>
                <button
                  onClick={() => recalculate()}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-750 text-[11px]"
                  title="Filter"
                >
                  <Filter className="w-3 h-3 text-amber-500" />
                  <span>Filter</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- FORMULAS TAB TOOLBAR --- */}
        {activeTab === 'formulas' && (
          <div className="flex items-center gap-3">
            {/* Insert Function */}
            <button
              onClick={() => handleInsertFormulaTemplate('=')}
              className="flex flex-col items-center justify-center px-2.5 py-1 rounded hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-colors"
            >
              <div className="font-serif italic font-black text-sm text-[#107c41] dark:text-emerald-400">fx</div>
              <span className="text-[10px] font-bold mt-0.5">Insert Function</span>
            </button>

            {/* Formula Categories */}
            <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700/80 pl-3">
              {/* AutoSum */}
              <button
                onClick={() => handleInsertFormulaTemplate('=SUM(')}
                className="flex flex-col items-center px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-750 text-[11px]"
              >
                <Sigma className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px]">AutoSum</span>
              </button>

              {/* Logical IF */}
              <button
                onClick={() => handleInsertFormulaTemplate('=IF(')}
                className="flex flex-col items-center px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-750 text-[11px]"
                title="Logical IF"
              >
                <Binary className="w-4 h-4 text-sky-500" />
                <span className="text-[10px] font-mono">IF / IFS</span>
              </button>

              {/* Lookup XLOOKUP */}
              <button
                onClick={() => handleInsertFormulaTemplate('=XLOOKUP(')}
                className="flex flex-col items-center px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-750 text-[11px]"
                title="Lookup XLOOKUP"
              >
                <Search className="w-4 h-4 text-purple-500" />
                <span className="text-[10px] font-mono">XLOOKUP</span>
              </button>

              {/* Text */}
              <button
                onClick={() => handleInsertFormulaTemplate('=CONCAT(')}
                className="flex flex-col items-center px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-750 text-[11px]"
                title="Text Functions"
              >
                <FileText className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-mono">CONCAT</span>
              </button>

              {/* Date & Time */}
              <button
                onClick={() => handleInsertFormulaTemplate('=TODAY()')}
                className="flex flex-col items-center px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-750 text-[11px]"
                title="Date & Time"
              >
                <Calendar className="w-4 h-4 text-rose-500" />
                <span className="text-[10px] font-mono">DATE</span>
              </button>

              {/* Financial */}
              <button
                onClick={() => handleInsertFormulaTemplate('=PMT(')}
                className="flex flex-col items-center px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-750 text-[11px]"
                title="Financial Functions"
              >
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-mono">PMT</span>
              </button>
            </div>
          </div>
        )}

        {/* --- INSERT TAB TOOLBAR --- */}
        {activeTab === 'insert' && (
          <div className="flex items-center gap-3">
            <button className="flex flex-col items-center px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-750 text-[11px]">
              <Table className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px]">Table</span>
            </button>
            <button className="flex flex-col items-center px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-750 text-[11px]">
              <BarChart3 className="w-4 h-4 text-cyan-500" />
              <span className="text-[10px]">Column Chart</span>
            </button>
            <button className="flex flex-col items-center px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-750 text-[11px]">
              <FileSpreadsheet className="w-4 h-4 text-purple-500" />
              <span className="text-[10px]">Pivot Table</span>
            </button>
          </div>
        )}

        {/* --- DATA TAB TOOLBAR --- */}
        {activeTab === 'data' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => recalculate()}
              className="flex flex-col items-center px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-750 text-[11px]"
            >
              <ArrowUpDown className="w-4 h-4 text-cyan-500" />
              <span className="text-[10px]">Sort Ascending</span>
            </button>
            <button
              onClick={() => recalculate()}
              className="flex flex-col items-center px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-750 text-[11px]"
            >
              <Filter className="w-4 h-4 text-amber-500" />
              <span className="text-[10px]">Filter Records</span>
            </button>
            <button
              onClick={() => recalculate()}
              className="flex flex-col items-center px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-750 text-[11px]"
            >
              <RotateCw className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px]">Refresh All</span>
            </button>
          </div>
        )}

        {/* --- VIEW TAB TOOLBAR --- */}
        {activeTab === 'view' && (
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-emerald-600 rounded" />
              <span>Gridlines</span>
            </label>
            <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-emerald-600 rounded" />
              <span>Formula Bar</span>
            </label>
            <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-emerald-600 rounded" />
              <span>Headings</span>
            </label>
            <span className="text-[11px] text-slate-400">|</span>
            <span className="text-[11px] text-slate-500">Zoom: 100%</span>
          </div>
        )}
      </div>
    </div>
  );
};
