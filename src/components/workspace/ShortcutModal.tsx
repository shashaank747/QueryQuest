import React from 'react';
import { Modal } from '../ui/Modal';

interface ShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutModal: React.FC<ShortcutModalProps> = ({
  isOpen,
  onClose,
}) => {
  const shortcuts = [
    { key: 'Ctrl + Enter / ⌘ + Enter', desc: 'Execute current SQL query in terminal' },
    { key: 'Ctrl + Shift + Enter', desc: 'Submit query for mission validation' },
    { key: 'Ctrl + /', desc: 'Toggle SQL comment (-- line comment)' },
    { key: 'Esc', desc: 'Close any active modal or table preview' },
    { key: 'Tab / Shift + Tab', desc: 'Indent / Unindent SQL line' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Shortcuts"
      subtitle="Speed up your SQL development workflow"
      maxWidth="md"
    >
      <div className="space-y-3">
        {shortcuts.map((sc, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
          >
            <span className="text-slate-300 font-medium">{sc.desc}</span>
            <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] text-emerald-400 font-semibold shadow-sm">
              {sc.key}
            </kbd>
          </div>
        ))}
      </div>
    </Modal>
  );
};
