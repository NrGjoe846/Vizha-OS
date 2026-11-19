'use client';

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={id} className="block text-xs font-medium text-zinc-700">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 pointer-events-none text-zinc-400">
              {icon}
            </div>
          )}
          <input
            id={id}
            ref={ref}
            className={`w-full bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 rounded-lg text-xs py-2 transition-all focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-50 disabled:text-zinc-400 ${
              icon ? 'pl-9 pr-3' : 'px-3'
            } ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, children, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={id} className="block text-xs font-medium text-zinc-700">
            {label}
          </label>
        )}
        <select
          id={id}
          ref={ref}
          className={`w-full bg-white border border-zinc-200 text-zinc-900 rounded-lg text-xs px-3 py-2 transition-all focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 ${
            error ? 'border-rose-400' : ''
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
