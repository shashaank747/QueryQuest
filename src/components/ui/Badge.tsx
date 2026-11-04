import React from 'react';
import { useThemeStore } from '../../stores/useThemeStore';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'sky' | 'amber' | 'rose' | 'purple' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  className = '',
}) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';

  const darkStyles = {
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    sky: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const lightStyles = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    sky: 'bg-sky-50 text-sky-700 border-sky-300',
    amber: 'bg-amber-50 text-amber-700 border-amber-300',
    rose: 'bg-rose-50 text-rose-700 border-rose-300',
    purple: 'bg-purple-50 text-purple-700 border-purple-300',
    slate: 'bg-slate-200/80 text-slate-700 border-slate-300',
  };

  const variantStyles = isLight ? lightStyles : darkStyles;

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

