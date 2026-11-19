'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, icon, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] duration-100';

    const variants = {
      primary: 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm border border-zinc-900',
      secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border border-zinc-200/80',
      outline: 'bg-white text-zinc-800 border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 shadow-sm',
      ghost: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
      danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm border border-rose-600',
    };

    const sizes = {
      sm: 'h-8 px-2.5 text-xs rounded-md gap-1.5',
      md: 'h-9 px-3.5 text-xs rounded-md gap-2',
      lg: 'h-10 px-4 text-sm rounded-md gap-2',
      icon: 'h-8 w-8 p-0 rounded-md',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
