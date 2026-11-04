import React from 'react';
import { Modal } from '../ui/Modal';
import { SqlQueryResult } from '../../types/sql';
import { useThemeStore } from '../../stores/useThemeStore';

interface TableDataModalProps {
  tableName: string | null;
  results: SqlQueryResult[];
  onClose: () => void;
}

export const TableDataModal: React.FC<TableDataModalProps> = ({
  tableName,
  results,
  onClose,
}) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';

  if (!tableName) return null;

  const data = results[0];
  const rowCount = data?.values?.length || 0;

  return (
    <Modal
      isOpen={!!tableName}
      onClose={onClose}
      title={`Table Preview: ${tableName}`}
      subtitle={`Displaying first ${rowCount} records from the active SQLite database`}
      maxWidth="3xl"
    >
      {!data || rowCount === 0 ? (
        <div className={`p-8 text-center text-xs ${
          isLight ? 'text-slate-400' : 'text-slate-500'
        }`}>
          This table is currently empty (0 records).
        </div>
      ) : (
        <div className={`border rounded-xl overflow-hidden max-h-[60vh] overflow-y-auto ${
          isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-950'
        }`}>
          <table className="w-full text-left border-collapse text-xs">
            <thead className={`uppercase text-[10px] font-mono tracking-wider sticky top-0 border-b ${
              isLight
                ? 'bg-slate-100 text-slate-600 border-slate-200'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}>
              <tr>
                <th className={`px-3 py-2 w-10 text-center ${
                  isLight ? 'text-slate-400' : 'text-slate-600'
                }`}>#</th>
                {data.columns.map((c, i) => (
                  <th key={i} className="px-3 py-2 font-semibold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y font-mono ${
              isLight
                ? 'divide-slate-200 text-slate-800'
                : 'divide-slate-800/60 text-slate-200'
            }`}>
              {data.values.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className={
                    isLight
                      ? 'hover:bg-slate-50 odd:bg-white even:bg-slate-50/50'
                      : 'hover:bg-slate-800/40 odd:bg-slate-900/40 even:bg-slate-900/10'
                  }
                >
                  <td className={`px-3 py-2 text-center text-[11px] ${
                    isLight ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {rIdx + 1}
                  </td>
                  {row.map((val, cIdx) => (
                    <td key={cIdx} className="px-3 py-2 truncate max-w-xs">
                      {val === null || val === undefined ? (
                        <span className={`italic ${
                          isLight ? 'text-slate-400' : 'text-slate-600'
                        }`}>NULL</span>
                      ) : (
                        String(val)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
};
