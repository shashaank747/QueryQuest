import React, { useState } from 'react';
import { useSqlStore } from '../../stores/useSqlStore';
import { useMissionStore } from '../../stores/useMissionStore';
import { useThemeStore } from '../../stores/useThemeStore';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  Layers,
  AlertCircle,
  HelpCircle,
  Table,
} from 'lucide-react';

export const QueryResults: React.FC = () => {
  const { lastResponse, isExecuting } = useSqlStore();
  const { validationFeedback } = useMissionStore();
  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';
  const [activeTab, setActiveTab] = useState<'results' | 'validation'>('results');

  // Auto-switch to validation tab when feedback arrives
  React.useEffect(() => {
    if (validationFeedback) {
      setActiveTab('validation');
    }
  }, [validationFeedback]);

  if (isExecuting) {
    return (
      <div
        className={`h-full flex items-center justify-center ${
          isLight ? 'bg-white text-slate-600' : 'bg-slate-950 text-slate-400'
        } gap-2 text-xs`}
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

  if (!lastResponse) {
    return (
      <div
        className={`h-full flex flex-col items-center justify-center ${
          isLight ? 'bg-white text-slate-400' : 'bg-slate-950 text-slate-500'
        } text-xs p-4 text-center`}
      >
        <Database className={`w-8 h-8 ${isLight ? 'text-slate-300' : 'text-slate-700'} mb-2`} />
        <p className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>SQL Terminal Ready</p>
        <p className={`text-[11px] ${isLight ? 'text-slate-400' : 'text-slate-600'} mt-0.5`}>
          Write a query in the editor and click "Run" (Ctrl+Enter) or "Submit Objective"
        </p>
      </div>
    );
  }

  const resultTable = lastResponse.results?.[0];
  const rowCount = resultTable?.values?.length || 0;

  return (
    <div
      className={`h-full flex flex-col ${
        isLight ? 'bg-white text-slate-800' : 'bg-slate-950 text-slate-100'
      } overflow-hidden`}
    >
      {/* Results Header Tabs & Execution Status */}
      <div
        className={`h-10 px-4 border-b ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-900/60'
        } flex items-center justify-between flex-shrink-0`}
      >
        <div className="flex items-center gap-2">
          {/* Tabs */}
          <button
            onClick={() => setActiveTab('results')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'results'
                ? isLight
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'bg-slate-800 text-slate-100 shadow-sm'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-emerald-500" />
            <span>Result Set</span>
            {lastResponse.success && lastResponse.action === 'SELECT' && (
              <span
                className={`text-[10px] font-mono px-1 rounded ${
                  isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {rowCount}
              </span>
            )}
          </button>

          {validationFeedback && (
            <button
              onClick={() => setActiveTab('validation')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'validation'
                  ? isLight
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'bg-slate-800 text-slate-100 shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-slate-200'
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

        {/* Execution Metadata */}
        <div
          className={`flex items-center gap-3 text-[11px] font-mono ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}
        >
          {lastResponse.success ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {lastResponse.action === 'SELECT'
                ? `${rowCount} rows returned`
                : `${lastResponse.action} OK (${lastResponse.rowsAffected} modified)`}
            </span>
          ) : (
            <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
              <XCircle className="w-3 h-3" /> Execution Error
            </span>
          )}

          <span className={`flex items-center gap-1 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
            <Clock className="w-3 h-3" />
            {lastResponse.executionTimeMs} ms
          </span>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-3">
        {activeTab === 'validation' && validationFeedback ? (
          <div className="space-y-3">
            {/* Validation Banner */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                validationFeedback.passed
                  ? isLight
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : isLight
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
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
              <div className="flex-1 text-xs">
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
                        : 'bg-slate-900/90 border border-slate-800 text-slate-300'
                    }`}
                  >
                    <strong className="text-amber-600 dark:text-amber-300 block text-[11px] mb-0.5">
                      Investigative Hint:
                    </strong>
                    {validationFeedback.details.hint}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : !lastResponse.success ? (
          /* Error State with Diagnostic */
          <div
            className={`p-4 rounded-xl ${
              isLight
                ? 'bg-rose-50 border border-rose-200 text-rose-950'
                : 'bg-rose-950/30 border border-rose-500/30 text-rose-200'
            } space-y-3 text-xs`}
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm text-rose-700 dark:text-rose-300">
                  SQLite Syntax or Constraint Error
                </span>
                <p
                  className={`font-mono text-xs mt-1 ${
                    isLight
                      ? 'text-rose-900 bg-white border border-rose-200'
                      : 'text-rose-200/90 bg-rose-950/60 border border-rose-900/60'
                  } p-2.5 rounded-lg`}
                >
                  {lastResponse.error}
                </p>
              </div>
            </div>

            {lastResponse.hint && (
              <div
                className={`p-3 rounded-xl ${
                  isLight
                    ? 'bg-white border border-slate-200 text-slate-700'
                    : 'bg-slate-900 border border-slate-800 text-slate-300'
                } flex items-start gap-2`}
              >
                <HelpCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-600 dark:text-amber-300 block text-[11px]">
                    Educational Diagnostic:
                  </span>
                  <p className="mt-0.5 leading-relaxed">{lastResponse.hint}</p>
                </div>
              </div>
            )}
          </div>
        ) : lastResponse.action !== 'SELECT' ? (
          /* DML / DDL Success */
          <div className="p-6 text-center text-xs text-slate-600 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              {lastResponse.action} Statement Executed Successfully
            </h4>
            <p className={`${isLight ? 'text-slate-600' : 'text-slate-400'} max-w-sm mx-auto`}>
              Rows modified:{' '}
              <strong className="text-emerald-600 dark:text-emerald-400">
                {lastResponse.rowsAffected}
              </strong>
              . Schema and practice database state have been updated.
            </p>
          </div>
        ) : rowCount === 0 || !resultTable ? (
          /* Empty SELECT Result */
          <div className="p-6 text-center text-xs text-slate-400">
            <Layers className={`w-8 h-8 ${isLight ? 'text-slate-300' : 'text-slate-600'} mx-auto mb-2`} />
            <p className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Query Executed With Zero Rows
            </p>
            <p className={`text-[11px] ${isLight ? 'text-slate-400' : 'text-slate-500'} mt-1`}>
              The query succeeded, but no records in the database matched your filter conditions.
            </p>
          </div>
        ) : (
          /* SELECT Results Data Table */
          <div
            className={`border ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            } rounded-xl overflow-hidden shadow-sm`}
          >
            <table className="w-full text-left border-collapse text-xs">
              <thead
                className={`${
                  isLight ? 'bg-slate-100 text-slate-700 border-b border-slate-200' : 'bg-slate-900 text-slate-300 border-b border-slate-800'
                } uppercase text-[10px] font-mono tracking-wider sticky top-0 z-10`}
              >
                <tr>
                  <th className={`px-3 py-2 ${isLight ? 'text-slate-400' : 'text-slate-500'} w-10 text-center`}>
                    #
                  </th>
                  {resultTable.columns.map((col, idx) => (
                    <th key={idx} className="px-3 py-2 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isLight ? 'divide-slate-200 font-mono text-slate-800' : 'divide-slate-800/60 font-mono text-slate-200'
                }`}
              >
                {resultTable.values.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={`${
                      isLight
                        ? 'hover:bg-slate-100/70 odd:bg-white even:bg-slate-50/60'
                        : 'hover:bg-slate-800/40 odd:bg-slate-950/40 even:bg-slate-900/30'
                    } transition-colors`}
                  >
                    <td
                      className={`px-3 py-2 text-center text-[11px] ${
                        isLight ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {rowIdx + 1}
                    </td>
                    {row.map((val, colIdx) => (
                      <td key={colIdx} className="px-3 py-2 truncate max-w-xs">
                        {val === null || val === undefined ? (
                          <span className={isLight ? 'text-slate-400 italic' : 'text-slate-600 italic'}>
                            NULL
                          </span>
                        ) : typeof val === 'number' ? (
                          <span className={isLight ? 'text-sky-600 font-semibold' : 'text-sky-300'}>
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
        )}
      </div>
    </div>
  );
};
