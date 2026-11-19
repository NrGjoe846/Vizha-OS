import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  dot?: boolean;
}

export function Badge({
  className = '',
  variant = 'default',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-zinc-100 text-zinc-800 border-zinc-200/80',
    neutral: 'bg-zinc-100 text-zinc-600 border-zinc-200/60',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/70',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/70',
    info: 'bg-sky-50 text-sky-700 border-sky-200/70',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/70',
  };

  const dotColors = {
    default: 'bg-zinc-500',
    neutral: 'bg-zinc-400',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    purple: 'bg-purple-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border tracking-tight ${variants[variant]} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
