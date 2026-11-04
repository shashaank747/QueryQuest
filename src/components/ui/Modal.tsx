import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useThemeStore } from '../../stores/useThemeStore';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '2xl',
}) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm animate-in fade-in duration-150 ${
      isLight ? 'bg-slate-900/40' : 'bg-slate-950/80'
    }`}>
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors border ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800 shadow-slate-200/50'
            : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isLight
            ? 'border-slate-200 bg-slate-50/80'
            : 'border-slate-800/80 bg-slate-900/60'
        }`}>
          <div>
            <h3 className={`text-lg font-bold flex items-center gap-2 ${
              isLight ? 'text-slate-900' : 'text-slate-100'
            }`}>{title}</h3>
            {subtitle && (
              <p className={`text-xs mt-0.5 ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isLight
                ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-200/60'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

