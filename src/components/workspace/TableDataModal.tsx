import React from 'react';
import { Modal } from '../ui/Modal';
import { SqlQueryResult } from '../../types/sql';

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
        <div className="p-8 text-center text-xs text-slate-500">
          This table is currently empty (0 records).
        </div>
      ) : (
        <div className="border border-slate-800 rounded-xl overflow-hidden max-h-[60vh] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono tracking-wider sticky top-0 border-b border-slate-800">
              <tr>
                <th className="px-3 py-2 text-slate-600 w-10 text-center">#</th>
                {data.columns.map((c, i) => (
                  <th key={i} className="px-3 py-2 font-semibold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
              {data.values.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className="hover:bg-slate-800/40 odd:bg-slate-900/40 even:bg-slate-900/10"
                >
                  <td className="px-3 py-2 text-center text-[11px] text-slate-600">
                    {rIdx + 1}
                  </td>
                  {row.map((val, cIdx) => (
                    <td key={cIdx} className="px-3 py-2 truncate max-w-xs">
                      {val === null || val === undefined ? (
                        <span className="text-slate-600 italic">NULL</span>
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
