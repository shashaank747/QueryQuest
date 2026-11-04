import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { SQL_FOUNDATION_MODULES, FoundationModule } from '../../modules/foundation/modules';
import { Badge } from '../ui/Badge';
import { Code2, AlertCircle, Copy, Check } from 'lucide-react';

interface FoundationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FoundationModal: React.FC<FoundationModalProps> = ({
  isOpen,
  onClose,
}) => {
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
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 pr-0 md:pr-4 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto">
          {SQL_FOUNDATION_MODULES.map((mod) => {
            const isSelected = selectedModule.id === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setSelectedModule(mod)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between whitespace-nowrap md:whitespace-normal ${
                  isSelected
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-500">
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
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Module {selectedModule.id}
                </span>
                <Badge variant="sky">{selectedModule.category}</Badge>
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-0.5">
                {selectedModule.title}
              </h3>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <p className="text-sm font-medium text-slate-200">
              {selectedModule.summary}
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 whitespace-pre-line leading-relaxed">
              {selectedModule.explanation}
            </div>

            {/* SQL Code Block */}
            <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
              <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/80 border-b border-slate-800 text-slate-400 text-[11px] font-mono">
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
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-amber-300">
                  SQLite Dialect Rule:
                </strong>
                {selectedModule.sqliteNotes}
              </div>
            </div>

            {/* Key concepts */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-slate-400 mr-1">
                Topics:
              </span>
              {selectedModule.keyConcepts.map((kc, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 font-mono"
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
