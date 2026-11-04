import React from 'react';
import { useThemeStore } from '../../stores/useThemeStore';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const { theme } = useThemeStore();
  const isLight = theme === 'slate-100';

  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantClasses = {
    primary: isLight
      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 focus:ring-emerald-500 border border-emerald-600'
      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50 focus:ring-emerald-500 border border-emerald-500/30',
    success: isLight
      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 focus:ring-emerald-500 border border-emerald-600'
      : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-950/50 focus:ring-green-500 border border-green-500/30',
    secondary: isLight
      ? 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm focus:ring-slate-400'
      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 focus:ring-slate-500 shadow-sm',
    outline: isLight
      ? 'bg-transparent hover:bg-slate-200/50 text-slate-700 border border-slate-300 focus:ring-slate-400'
      : 'bg-transparent hover:bg-slate-800/60 text-slate-300 border border-slate-700 focus:ring-slate-500',
    ghost: isLight
      ? 'bg-transparent hover:bg-slate-200/60 text-slate-600 hover:text-slate-900 focus:ring-slate-400'
      : 'bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 focus:ring-slate-500',
    danger: isLight
      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 focus:ring-rose-500 border border-rose-600'
      : 'bg-rose-600/90 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/40 focus:ring-rose-500 border border-rose-500/30',
  };

  const ringOffsetClass = isLight ? 'focus:ring-offset-slate-100' : 'focus:ring-offset-slate-900';

  return (
    <button
      className={`${baseClasses} ${ringOffsetClass} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

