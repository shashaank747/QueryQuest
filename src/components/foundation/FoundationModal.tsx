import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { SQL_FOUNDATION_MODULES, FoundationModule } from '../../modules/foundation/modules';
import { Badge } from '../ui/Badge';
import { useThemeStore } from '../../stores/useThemeStore';
import { Code2, AlertCircle, Copy, Check } from 'lucide-react';

interface FoundationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FoundationModal: React.FC<FoundationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';

  const [selectedModule, setSelectedModule] = useState<FoundationModule>(
    SQL_FOUNDATION_MODULES[0]
  );
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(selectedModule.syntaxExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SQL Foundation Reference Hub"
      subtitle="Core relational database concepts and SQLite syntax guides before entering industry worlds"
      maxWidth="4xl"
    >
      <div className="flex flex-col md:flex-row gap-6 min-h-[480px]">
        {/* Module Sidebar */}
        <div className={`w-full md:w-64 border-b md:border-b-0 md:border-r pr-0 md:pr-4 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          {SQL_FOUNDATION_MODULES.map((mod) => {
            const isSelected = selectedModule.id === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setSelectedModule(mod)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between whitespace-nowrap md:whitespace-normal ${
                  isSelected
                    ? isLight
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold shadow-sm'
                      : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                    : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-mono ${
                    isLight ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    M{mod.id}
                  </span>
                  <span>{mod.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Module Detail */}
        <div className="flex-1 flex flex-col gap-4">
          <div className={`flex items-center justify-between border-b pb-3 ${
            isLight ? 'border-slate-200' : 'border-slate-800/80'
          }`}>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  isLight ? 'text-emerald-700' : 'text-emerald-400'
                }`}>
                  Module {selectedModule.id}
                </span>
                <Badge variant="sky">{selectedModule.category}</Badge>
              </div>
              <h3 className={`text-lg font-bold mt-0.5 ${
                isLight ? 'text-slate-900' : 'text-slate-100'
              }`}>
                {selectedModule.title}
              </h3>
            </div>
          </div>

          <div className="space-y-4 text-xs leading-relaxed">
            <p className={`text-sm font-medium ${
              isLight ? 'text-slate-800' : 'text-slate-200'
            }`}>
              {selectedModule.summary}
            </p>

            <div className={`p-3.5 rounded-xl border whitespace-pre-line leading-relaxed ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}>
              {selectedModule.explanation}
            </div>

            {/* SQL Code Block */}
            <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px] font-mono">
                <span className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                  SQL Syntax Blueprint
                </span>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-sans">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="font-sans">Copy SQL</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed">
                <code>{selectedModule.syntaxExample}</code>
              </pre>
            </div>

            {/* Dialect note */}
            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
              isLight
                ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-200'
            }`}>
              <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                isLight ? 'text-amber-600' : 'text-amber-400'
              }`} />
              <div>
                <strong className={`font-semibold block ${
                  isLight ? 'text-amber-950' : 'text-amber-300'
                }`}>
                  SQLite Dialect Rule:
                </strong>
                {selectedModule.sqliteNotes}
              </div>
            </div>

            {/* Key concepts */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className={`text-[11px] font-medium mr-1 ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Topics:
              </span>
              {selectedModule.keyConcepts.map((kc, i) => (
                <span
                  key={i}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-mono ${
                    isLight
                      ? 'bg-slate-100 text-slate-700 border border-slate-200'
                      : 'bg-slate-800 text-slate-300 border border-slate-700/60'
                  }`}
                >
                  {kc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
