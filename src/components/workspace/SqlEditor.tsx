import React, { useState, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useSqlStore } from '../../stores/useSqlStore';
import { useMissionStore } from '../../stores/useMissionStore';
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
    <div className="h-full flex flex-col bg-slate-950 overflow-hidden">
      {/* Editor Toolbar */}
      <div className="h-11 px-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* Run Query Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => runQuery()}
            isLoading={isExecuting}
            icon={<Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />}
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
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
              title="Query history"
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">History</span>
            </button>

            {isHistoryOpen && (
              <div className="absolute right-0 top-full mt-1 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-40 max-h-64 overflow-y-auto">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 mb-1 border-b border-slate-800">
                  Recent Queries ({history.length})
                </div>
                {history.length === 0 ? (
                  <div className="p-3 text-center text-xs text-slate-500">
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
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition-colors group mb-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                        <span className="flex items-center gap-1 font-mono">
                          {item.success ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <X className="w-3 h-3 text-rose-400" />
                          )}
                          {item.executionTimeMs}ms
                        </span>
                        <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="font-mono text-xs text-slate-300 truncate group-hover:text-emerald-300">
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Reset to mission SQL placeholder"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Clear editor */}
          <button
            onClick={handleClear}
            className="px-2 py-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors text-[11px] font-medium"
            title="Clear editor text"
          >
            Clear
          </button>

          {/* Shortcuts guide */}
          <button
            onClick={() => setIsShortcutsOpen(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
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
          theme="vs-dark"
          value={query}
          onChange={(val) => setQuery(val || '')}
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
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
