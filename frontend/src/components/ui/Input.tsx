import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 focus-within:text-violet-600 dark:focus-within:text-violet-400">
        {label && (
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full rounded-xl border bg-white/50 dark:bg-slate-900/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50 
            ${error ? 'border-red-500 placeholder:text-red-300' : 'border-slate-200 dark:border-slate-700/50'}
            ${icon ? 'pl-10' : ''}
            ${className}`}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
