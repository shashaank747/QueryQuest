import React, { useState } from 'react';
import { useSqlStore } from '../../stores/useSqlStore';
import { useWorldStore } from '../../stores/useWorldStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { TableDataModal } from './TableDataModal';
import {
  Database,
  RefreshCw,
  Table,
  Key,
  Link,
  Eye,
  ChevronRight,
  ChevronDown,
  Search,
} from 'lucide-react';

export const SchemaExplorer: React.FC = () => {
  const {
    schema,
    isLoadingSchema,
    refreshSchema,
    previewTable,
    activeTablePreview,
    closeTablePreview,
    setQuery,
    query,
  } = useSqlStore();
  const { activeWorld } = useWorldStore();
  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';

  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({
    products: true,
    categories: true,
  });
  const [search, setSearch] = useState('');

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) => ({
      ...prev,
      [tableName]: !prev[tableName],
    }));
  };

  const tableNames = Object.keys(schema).filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const insertIntoEditor = (text: string) => {
    setQuery(query ? `${query} ${text}` : text);
  };

  return (
    <>
      <div
        className={`h-full flex flex-col ${
          isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900/90 border-slate-800 text-slate-200'
        } border-l overflow-hidden w-full lg:w-[280px] flex-shrink-0 transition-colors duration-150`}
      >
        {/* Header */}
        <div
          className={`p-3.5 border-b ${
            isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950/40'
          } flex items-center justify-between flex-shrink-0`}
        >
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-500" />
            <div>
              <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'} block`}>
                Database Explorer
              </span>
              <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {activeWorld?.dbFileName || 'sqlite.db'}
              </span>
            </div>
          </div>

          <button
            onClick={() => refreshSchema()}
            disabled={isLoadingSchema}
            className={`p-1.5 rounded-lg ${
              isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            } transition-colors`}
            title="Refresh database schema"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoadingSchema ? 'animate-spin text-emerald-500' : ''}`}
            />
          </button>
        </div>

        {/* Filter Input */}
        <div className={`p-2 border-b ${isLight ? 'border-slate-200 bg-slate-50/50' : 'border-slate-800/80 bg-slate-950/20'}`}>
          <div className="relative">
            <Search className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-slate-500'} absolute left-2.5 top-1/2 -translate-y-1/2`} />
            <input
              type="text"
              placeholder="Search tables..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-8 pr-2 py-1.5 ${
                isLight ? 'bg-white border-slate-200 text-slate-800 placeholder-slate-400' : 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500'
              } border rounded-lg text-xs focus:outline-none focus:border-emerald-500`}
            />
          </div>
        </div>

        {/* Tables Tree */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
          {tableNames.length === 0 ? (
            <div className={`p-4 text-center ${isLight ? 'text-slate-400' : 'text-slate-500'} text-xs`}>
              {Object.keys(schema).length === 0
                ? 'No tables created yet. Complete Mission 1 to build your first table!'
                : 'No matching tables found.'}
            </div>
          ) : (
            tableNames.map((tableName) => {
              const table = schema[tableName];
              const isExpanded = !!expandedTables[tableName];

              return (
                <div
                  key={tableName}
                  className={`rounded-xl border ${
                    isLight ? 'border-slate-200 bg-slate-50/80' : 'border-slate-800/60 bg-slate-950/40'
                  } overflow-hidden`}
                >
                  {/* Table Header Row */}
                  <div
                    className={`flex items-center justify-between p-2 ${
                      isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-850/60'
                    } transition-colors group`}
                  >
                    <button
                      onClick={() => toggleTable(tableName)}
                      className={`flex items-center gap-1.5 flex-1 min-w-0 text-left font-semibold ${
                        isLight ? 'text-slate-800 hover:text-emerald-700' : 'text-slate-200 hover:text-emerald-400'
                      } transition-colors`}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      )}
                      <Table className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate font-mono text-xs">{tableName}</span>
                    </button>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {table.rowCount !== undefined && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                            isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {table.rowCount}
                        </span>
                      )}
                      <button
                        onClick={() => previewTable(tableName)}
                        className={`p-1 rounded ${
                          isLight ? 'text-slate-400 hover:text-emerald-600 hover:bg-slate-200' : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
                        } transition-colors`}
                        title="Preview table data"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Columns List */}
                  {isExpanded && (
                    <div className={`p-2 pt-0 border-t ${isLight ? 'border-slate-200' : 'border-slate-800/40'} space-y-1`}>
                      {table.columns.map((col) => (
                        <div
                          key={col.name}
                          onClick={() => insertIntoEditor(col.name)}
                          className={`flex items-center justify-between py-1 px-1.5 rounded ${
                            isLight ? 'hover:bg-slate-200/50' : 'hover:bg-slate-800/50'
                          } cursor-pointer transition-colors group/col`}
                          title="Click to insert column into SQL editor"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            {col.pk ? (
                              <Key className="w-3 h-3 text-amber-500 flex-shrink-0" />
                            ) : (
                              <span className={`w-3 h-3 flex-shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>•</span>
                            )}
                            <span
                              className={`font-mono text-[11px] ${
                                isLight ? 'text-slate-700 group-hover/col:text-emerald-700' : 'text-slate-300 group-hover/col:text-emerald-300'
                              } truncate`}
                            >
                              {col.name}
                            </span>
                          </div>
                          <span className={`font-mono text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'} uppercase`}>
                            {col.type || 'ANY'}
                          </span>
                        </div>
                      ))}

                      {/* Foreign Keys Summary */}
                      {table.foreignKeys && table.foreignKeys.length > 0 && (
                        <div className={`mt-1 pt-1 border-t ${isLight ? 'border-slate-200' : 'border-slate-800/40'} space-y-0.5`}>
                          {table.foreignKeys.map((fk) => (
                            <div
                              key={fk.id}
                              className={`text-[10px] ${isLight ? 'text-sky-600' : 'text-sky-400/90'} font-mono flex items-center gap-1 px-1`}
                            >
                              <Link className="w-2.5 h-2.5 text-sky-500 flex-shrink-0" />
                              <span className="truncate">
                                {fk.from} → {fk.table}({fk.to})
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Table Data Preview Modal */}
      <TableDataModal
        tableName={activeTablePreview?.tableName || null}
        results={activeTablePreview?.results || []}
        onClose={closeTablePreview}
      />
    </>
  );
};
