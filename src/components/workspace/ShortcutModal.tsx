import React from 'react';
import { Modal } from '../ui/Modal';
import { useThemeStore } from '../../stores/useThemeStore';

interface ShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutModal: React.FC<ShortcutModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';

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
            className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <span className={`font-medium ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`}>{sc.desc}</span>
            <kbd className={`px-2 py-1 rounded font-mono text-[11px] font-semibold shadow-sm border ${
              isLight
                ? 'bg-white border-slate-300 text-emerald-700 shadow-slate-100'
                : 'bg-slate-800 border-slate-700 text-emerald-400'
            }`}>
              {sc.key}
            </kbd>
          </div>
        ))}
      </div>
    </Modal>
  );
};
