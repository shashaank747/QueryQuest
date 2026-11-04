import React, { useState, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useSqlStore } from '../../stores/useSqlStore';
import { useMissionStore } from '../../stores/useMissionStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { Button } from '../ui/Button';
import {
  Play,
  CheckCircle,
  RotateCcw,
  History,
  Keyboard,
  Check,
  X,
} from 'lucide-react';
import { ShortcutModal } from './ShortcutModal';

export const SqlEditor: React.FC = () => {
  const { query, setQuery, runQuery, isExecuting, history } = useSqlStore();
  const { submitMissionQuery, isValidating, activeMission } = useMissionStore();
  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const editorRef = useRef<any>(null);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      runQuery();
    });

    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter,
      () => {
        submitMissionQuery();
      }
    );
  };

  const handleClear = () => {
    setQuery('');
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleResetToPlaceholder = () => {
    if (activeMission?.initialSqlPlaceholder) {
      setQuery(activeMission.initialSqlPlaceholder);
    }
  };

  return (
    <div
      className={`h-full flex flex-col ${
        isLight ? 'bg-white text-slate-800' : 'bg-slate-950 text-slate-100'
      } overflow-hidden`}
    >
      {/* Editor Toolbar */}
      <div
        className={`h-11 px-4 border-b ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-900/80'
        } flex items-center justify-between flex-shrink-0`}
      >
        <div className="flex items-center gap-2">
          {/* Run Query Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => runQuery()}
            isLoading={isExecuting}
            icon={<Play className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />}
            title="Execute query without completing mission (Ctrl+Enter)"
            className="text-xs font-semibold hover:border-emerald-500/40"
          >
            Run
          </Button>

          {/* Submit Objective Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => submitMissionQuery()}
            isLoading={isValidating || isExecuting}
            icon={<CheckCircle className="w-3.5 h-3.5" />}
            title="Submit query for objective evaluation (Ctrl+Shift+Enter)"
            className="text-xs font-bold"
          >
            Submit Objective
          </Button>
        </div>

        {/* Secondary controls */}
        <div className="flex items-center gap-1.5">
          {/* History dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className={`p-1.5 rounded-lg ${
                isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              } transition-colors flex items-center gap-1 text-xs`}
              title="Query history"
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">History</span>
            </button>

            {isHistoryOpen && (
              <div
                className={`absolute right-0 top-full mt-1 w-72 ${
                  isLight ? 'bg-white border-slate-200 text-slate-800 shadow-xl' : 'bg-slate-900 border-slate-800 text-slate-200 shadow-2xl'
                } border rounded-xl p-2 z-40 max-h-64 overflow-y-auto`}
              >
                <div
                  className={`text-[10px] uppercase font-bold ${
                    isLight ? 'text-slate-500 border-slate-200' : 'text-slate-400 border-slate-800'
                  } px-2 py-1 mb-1 border-b`}
                >
                  Recent Queries ({history.length})
                </div>
                {history.length === 0 ? (
                  <div className="p-3 text-center text-xs text-slate-400">
                    No queries run yet
                  </div>
                ) : (
                  history.slice(0, 15).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setQuery(item.query);
                        setIsHistoryOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg ${
                        isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-800 text-slate-300'
                      } transition-colors group mb-1`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                        <span className="flex items-center gap-1 font-mono">
                          {item.success ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <X className="w-3 h-3 text-rose-500" />
                          )}
                          {item.executionTimeMs}ms
                        </span>
                        <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p
                        className={`font-mono text-xs ${
                          isLight ? 'text-slate-700 group-hover:text-emerald-700' : 'text-slate-300 group-hover:text-emerald-300'
                        } truncate`}
                      >
                        {item.query}
                      </p>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Reset to mission starter */}
          <button
            onClick={handleResetToPlaceholder}
            className={`p-1.5 rounded-lg ${
              isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            } transition-colors`}
            title="Reset to mission SQL placeholder"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Select all text */}
          <button
            onClick={() => {
              if (editorRef.current) {
                editorRef.current.focus();
                editorRef.current.trigger('keyboard', 'editor.action.selectAll', null);
              }
            }}
            className={`px-2 py-1 rounded-lg ${
              isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            } transition-colors text-[11px] font-medium`}
            title="Select all text (Ctrl+A / ⌘+A)"
          >
            Select All
          </button>

          {/* Clear editor */}
          <button
            onClick={handleClear}
            className="px-2 py-1 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors text-[11px] font-medium"
            title="Clear editor text"
          >
            Clear
          </button>

          {/* Shortcuts guide */}
          <button
            onClick={() => setIsShortcutsOpen(true)}
            className={`p-1.5 rounded-lg ${
              isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            } transition-colors`}
            title="Keyboard shortcuts"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language="sql"
          theme={isLight ? 'vs' : 'vs-dark'}
          value={query}
          onChange={(val) => setQuery(val || '')}
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            selectOnLineNumbers: true,
            dragAndDrop: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            fontFamily: '"Fira Code", "JetBrains Mono", Consolas, monospace',
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            suggestOnTriggerCharacters: true,
            multiCursorModifier: 'alt',
          }}
        />
      </div>

      {/* Shortcuts Modal */}
      <ShortcutModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};
