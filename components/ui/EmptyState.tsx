import React from 'react';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center bg-white/50">
      <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-500 mx-auto flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="text-xs font-semibold text-zinc-900 tracking-tight">{title}</h3>
      <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto font-normal">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
