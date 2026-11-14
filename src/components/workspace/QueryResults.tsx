import React, { useState, useEffect } from 'react';
import { useSqlStore } from '../../stores/useSqlStore';
import { useMissionStore } from '../../stores/useMissionStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { QueryHistoryItem } from '../../types/sql';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  Table,
  Copy,
  Check,
  Info,
  Layers,
} from 'lucide-react';

export const QueryResults: React.FC = () => {
  const { lastResponse, isExecuting, history } = useSqlStore();
  const { validationFeedback } = useMissionStore();
  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';

  const [activeTab, setActiveTab] = useState<'results' | 'output' | 'validation'>('output');
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [copiedQueryId, setCopiedQueryId] = useState<string | null>(null);

  // Auto-switch tabs based on execution result
  useEffect(() => {
    if (validationFeedback) {
      setActiveTab('validation');
    } else if (lastResponse) {
      if (lastResponse.success && lastResponse.action === 'SELECT') {
        setActiveTab('results');
      } else {
        setActiveTab('output');
      }
    }
  }, [lastResponse, validationFeedback]);

  // Default selected history item to latest
  useEffect(() => {
    if (history.length > 0 && (!selectedHistoryId || !history.some((h) => h.id === selectedHistoryId))) {
      setSelectedHistoryId(history[0].id);
    }
  }, [history, selectedHistoryId]);

  const handleCopySql = (id: string, sql: string) => {
    navigator.clipboard.writeText(sql);
    setCopiedQueryId(id);
    setTimeout(() => setCopiedQueryId(null), 1500);
  };

  const selectedItem: QueryHistoryItem | undefined =
    history.find((h) => h.id === selectedHistoryId) || history[0];

  const resultTable = lastResponse?.results?.[0];
  const rowCount = resultTable?.values?.length || 0;

  if (isExecuting) {
    return (
      <div
        className={`h-full flex items-center justify-center ${
          isLight ? 'bg-white text-slate-600' : 'bg-slate-950 text-slate-400'
        } gap-2 text-xs font-mono`}
      >
        <svg
          className="animate-spin h-4 w-4 text-emerald-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span>Executing query in SQLite engine...</span>
      </div>
    );
  }

  return (
    <div
      className={`h-full flex flex-col ${
        isLight ? 'bg-white text-slate-800' : 'bg-slate-950 text-slate-100'
      } overflow-hidden select-text`}
    >
      {/* Workbench Header Toolbar / Tabs */}
      <div
        className={`h-9 px-3 border-b ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-900/80'
        } flex items-center justify-between flex-shrink-0`}
      >
        <div className="flex items-center gap-1">
          {/* Result Grid Tab */}
          <button
            onClick={() => setActiveTab('results')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'results'
                ? isLight
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-semibold'
                  : 'bg-slate-800 text-slate-100 shadow-sm font-semibold'
                : isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-sky-500" />
            <span>Result Grid</span>
            {lastResponse?.success && lastResponse.action === 'SELECT' && (
              <span
                className={`text-[10px] font-mono px-1 rounded ${
                  isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {rowCount}
              </span>
            )}
          </button>

          {/* Action Output Tab (MySQL Workbench style) */}
          <button
            onClick={() => setActiveTab('output')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'output'
                ? isLight
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-semibold'
                  : 'bg-slate-800 text-slate-100 shadow-sm font-semibold'
                : isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-500" />
            <span>Action Output</span>
            {history.length > 0 && (
              <span
                className={`text-[10px] font-mono px-1 rounded ${
                  isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {history.length}
              </span>
            )}
          </button>

          {/* Mission Feedback Tab */}
          {validationFeedback && (
            <button
              onClick={() => setActiveTab('validation')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'validation'
                  ? isLight
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-semibold'
                    : 'bg-slate-800 text-slate-100 shadow-sm font-semibold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {validationFeedback.passed ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
              )}
              <span>Mission Feedback</span>
            </button>
          )}
        </div>

        {/* Status Line */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          {lastResponse && (
            <span
              className={`flex items-center gap-1 ${
                lastResponse.success
                  ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                  : 'text-rose-600 dark:text-rose-400 font-medium'
              }`}
            >
              {lastResponse.success ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <XCircle className="w-3 h-3" />
              )}
              {lastResponse.success
                ? lastResponse.action === 'SELECT'
                  ? `${rowCount} row(s) returned`
                  : `${lastResponse.rowsAffected} row(s) affected`
                : 'Query error'}
            </span>
          )}

          {lastResponse && (
            <span className={`flex items-center gap-1 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
              <Clock className="w-3 h-3" />
              {(lastResponse.executionTimeMs / 1000).toFixed(3)}s
            </span>
          )}
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* ==================== 1. ACTION OUTPUT (MySQL Workbench Grid) ==================== */}
        {activeTab === 'output' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {history.length === 0 ? (
              <div
                className={`flex-1 flex flex-col items-center justify-center p-6 text-center text-xs ${
                  isLight ? 'text-slate-400 bg-slate-50/50' : 'text-slate-500 bg-slate-900/30'
                }`}
              >
                <Terminal className="w-8 h-8 opacity-40 mb-2" />
                <p className="font-semibold text-slate-600 dark:text-slate-400">Action Output Ready</p>
                <p className="text-[11px] mt-0.5 max-w-sm">
                  Execute statements in the SQL editor (Ctrl+Enter). Each query action, duration, and response message will be recorded here.
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Workbench Output Table */}
                <div className="flex-1 overflow-auto border-b border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead
                      className={`sticky top-0 z-10 ${
                        isLight
                          ? 'bg-slate-100 text-slate-600 border-b border-slate-200'
                          : 'bg-slate-900 text-slate-400 border-b border-slate-800'
                      } text-[10px] uppercase font-bold tracking-wider`}
                    >
                      <tr>
                        <th className="w-8 px-2 py-1.5 text-center"></th>
                        <th className="w-10 px-2 py-1.5 text-center">#</th>
                        <th className="w-20 px-2 py-1.5">Time</th>
                        <th className="w-1/3 px-2 py-1.5">Action</th>
                        <th className="px-2 py-1.5">Message / Response</th>
                        <th className="w-24 px-2 py-1.5 text-right">Duration</th>
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        isLight ? 'divide-slate-100' : 'divide-slate-800/60'
                      }`}
                    >
                      {history.map((item, idx) => {
                        const isSelected = selectedItem?.id === item.id;
                        const durationSec = ((item.executionTimeMs || 0) / 1000).toFixed(3);
                        const timeStr = new Date(item.timestamp).toLocaleTimeString();

                        return (
                          <tr
                            key={item.id}
                            onClick={() => setSelectedHistoryId(item.id)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? isLight
                                  ? 'bg-sky-50 text-slate-900 font-semibold'
                                  : 'bg-sky-950/40 text-slate-100 font-semibold'
                                : isLight
                                ? 'hover:bg-slate-50 text-slate-700 odd:bg-white even:bg-slate-50/40'
                                : 'hover:bg-slate-900/60 text-slate-300 odd:bg-slate-950 even:bg-slate-900/20'
                            }`}
                          >
                            {/* Status Icon */}
                            <td className="px-2 py-1.5 text-center">
                              {item.success ? (
                                <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold">
                                  ✓
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold">
                                  ✕
                                </span>
                              )}
                            </td>

                            {/* Sequence # */}
                            <td className="px-2 py-1.5 text-center text-slate-400 text-[11px]">
                              {history.length - idx}
                            </td>

                            {/* Time */}
                            <td className="px-2 py-1.5 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                              {timeStr}
                            </td>

                            {/* Action Query */}
                            <td className="px-2 py-1.5 truncate max-w-xs text-slate-800 dark:text-slate-200">
                              {item.query.replace(/\s+/g, ' ').trim()}
                            </td>

                            {/* Message */}
                            <td
                              className={`px-2 py-1.5 truncate max-w-md ${
                                item.success
                                  ? isLight
                                    ? 'text-slate-600'
                                    : 'text-slate-400'
                                  : 'text-rose-600 dark:text-rose-400 font-medium'
                              }`}
                            >
                              {item.message || (item.success ? '0 row(s) affected' : item.error || 'Execution failed')}
                            </td>

                            {/* Duration */}
                            <td className="px-2 py-1.5 text-right text-slate-400 dark:text-slate-500 whitespace-nowrap text-[11px]">
                              {durationSec}s
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Selected Action Inspector Panel (Docked at bottom of Action Output) */}
                {selectedItem && (
                  <div
                    className={`h-40 border-t ${
                      isLight ? 'border-slate-200 bg-slate-50/70' : 'border-slate-800 bg-slate-900/60'
                    } flex flex-col overflow-hidden text-xs`}
                  >
                    {/* Inspector Header */}
                    <div
                      className={`h-7 px-3 border-b ${
                        isLight ? 'border-slate-200 bg-slate-100/70' : 'border-slate-800 bg-slate-900'
                      } flex items-center justify-between text-[11px] font-mono`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                          Action Inspector
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                            selectedItem.success
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-600 border border-rose-500/30'
                          }`}
                        >
                          {selectedItem.action || (selectedItem.success ? 'SUCCESS' : 'ERROR')}
                        </span>
                        <span className="text-slate-400 text-[10px]">
                          {new Date(selectedItem.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopySql(selectedItem.id, selectedItem.query)}
                        className={`flex items-center gap-1 text-[10px] ${
                          isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                        } px-1.5 py-0.5 rounded transition-colors`}
                        title="Copy executed SQL"
                      >
                        {copiedQueryId === selectedItem.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy SQL</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Inspector Body */}
                    <div className="flex-1 overflow-y-auto p-2.5 space-y-2 font-mono text-xs">
                      {/* Query snippet */}
                      <div
                        className={`p-2 rounded border ${
                          isLight
                            ? 'bg-white border-slate-200 text-slate-800'
                            : 'bg-slate-950 border-slate-800 text-slate-200'
                        } overflow-x-auto`}
                      >
                        <pre className="text-[11px] whitespace-pre-wrap">{selectedItem.query}</pre>
                      </div>

                      {/* Error & Diagnostic or Success Message */}
                      {!selectedItem.success ? (
                        <div className="space-y-1.5">
                          {/* Raw Engine Error */}
                          <div
                            className={`p-2 rounded border ${
                              isLight
                                ? 'bg-rose-50 border-rose-200 text-rose-800'
                                : 'bg-rose-950/40 border-rose-900/60 text-rose-200'
                            }`}
                          >
                            <span className="font-bold text-[10px] block uppercase tracking-wide text-rose-600">
                              Error Code: SQLITE_ERROR
                            </span>
                            <span className="text-[11px]">{selectedItem.error || selectedItem.message}</span>
                          </div>

                          {/* Workbench Advisor Diagnostic */}
                          {selectedItem.hint && (
                            <div
                              className={`p-2 rounded border ${
                                isLight
                                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                                  : 'bg-amber-950/30 border-amber-900/40 text-amber-200'
                              } text-[11px] flex items-start gap-1.5`}
                            >
                              <Info className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <strong className="font-semibold block text-[10px] text-amber-600 dark:text-amber-400 uppercase">
                                  Diagnostic Assistant
                                </strong>
                                <span className="leading-snug">{selectedItem.hint}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className={`p-2 rounded border ${
                            isLight
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                              : 'bg-emerald-950/30 border-emerald-900/40 text-emerald-200'
                          } text-[11px] flex items-center justify-between`}
                        >
                          <span>
                            <strong>Response:</strong> {selectedItem.message || '0 row(s) affected'}. Statement executed successfully.
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Duration: {((selectedItem.executionTimeMs || 0) / 1000).toFixed(3)}s
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================== 2. RESULT GRID (Tabular Dataset) ==================== */}
        {activeTab === 'results' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {!resultTable || rowCount === 0 ? (
              <div
                className={`flex-1 flex flex-col items-center justify-center p-6 text-center text-xs ${
                  isLight ? 'text-slate-400 bg-slate-50/50' : 'text-slate-500 bg-slate-900/30'
                }`}
              >
                <Layers className="w-8 h-8 opacity-40 mb-2" />
                <p className="font-semibold text-slate-600 dark:text-slate-400">0 Rows Returned</p>
                <p className="text-[11px] mt-0.5 max-w-sm">
                  The query executed successfully without returning a tabular result set. See the <strong>Action Output</strong> tab for execution response and affected rows.
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead
                      className={`sticky top-0 z-10 ${
                        isLight
                          ? 'bg-slate-100 text-slate-700 border-b border-slate-200'
                          : 'bg-slate-900 text-slate-300 border-b border-slate-800'
                      } text-[10px] uppercase font-bold tracking-wider`}
                    >
                      <tr>
                        <th
                          className={`w-10 px-2.5 py-1.5 text-center ${
                            isLight ? 'text-slate-400 bg-slate-100' : 'text-slate-500 bg-slate-900'
                          }`}
                        >
                          #
                        </th>
                        {resultTable.columns.map((col, idx) => (
                          <th key={idx} className="px-3 py-1.5 whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody
                      className={`divide-y ${
                        isLight ? 'divide-slate-200 text-slate-800' : 'divide-slate-800/60 text-slate-200'
                      }`}
                    >
                      {resultTable.values.map((row, rowIdx) => (
                        <tr
                          key={rowIdx}
                          className={`${
                            isLight
                              ? 'hover:bg-sky-50/60 odd:bg-white even:bg-slate-50/50'
                              : 'hover:bg-sky-950/30 odd:bg-slate-950 even:bg-slate-900/30'
                          } transition-colors`}
                        >
                          <td
                            className={`px-2.5 py-1.5 text-center text-[10px] ${
                              isLight ? 'text-slate-400 bg-slate-50/60' : 'text-slate-600 bg-slate-900/40'
                            }`}
                          >
                            {rowIdx + 1}
                          </td>
                          {row.map((val, colIdx) => (
                            <td key={colIdx} className="px-3 py-1.5 truncate max-w-xs">
                              {val === null || val === undefined ? (
                                <span className={isLight ? 'text-slate-400 italic text-[11px]' : 'text-slate-600 italic text-[11px]'}>
                                  NULL
                                </span>
                              ) : typeof val === 'number' ? (
                                <span className={isLight ? 'text-sky-600 font-semibold' : 'text-sky-400'}>
                                  {val}
                                </span>
                              ) : (
                                <span>{String(val)}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Result Grid Footer Status Bar */}
                <div
                  className={`h-6 px-3 border-t ${
                    isLight ? 'border-slate-200 bg-slate-100/80 text-slate-600' : 'border-slate-800 bg-slate-900/90 text-slate-400'
                  } flex items-center justify-between text-[10px] font-mono flex-shrink-0`}
                >
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    {rowCount} row(s) returned
                  </span>
                  <span>
                    Read-only Result Set | Execution: {lastResponse?.executionTimeMs || 0}ms
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== 3. MISSION FEEDBACK (Objective Validation) ==================== */}
        {activeTab === 'validation' && validationFeedback && (
          <div className="flex-1 overflow-auto p-4 space-y-3 text-xs">
            {/* Feedback Banner */}
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                validationFeedback.passed
                  ? isLight
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : isLight
                  ? 'bg-rose-50/80 border-rose-300 text-rose-950'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg flex-shrink-0 ${
                  validationFeedback.passed
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                }`}
              >
                {validationFeedback.passed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold">
                  {validationFeedback.passed
                    ? 'Objective Successfully Solved!'
                    : 'Objective Incomplete'}
                </h4>
                <p className="mt-1 leading-relaxed">{validationFeedback.message}</p>

                {validationFeedback.details?.hint && (
                  <div
                    className={`mt-2.5 p-2.5 rounded-lg ${
                      isLight
                        ? 'bg-white border border-slate-200 text-slate-800'
                        : 'bg-slate-900 border border-slate-800 text-slate-300'
                    } text-xs`}
                  >
                    <strong className="text-amber-600 dark:text-amber-400 block text-[11px] mb-0.5">
                      Investigative Hint:
                    </strong>
                    {validationFeedback.details.hint}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
