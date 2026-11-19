import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  description?: string;
}

export function StatCard({
  label,
  value,
  change,
  changeType = 'neutral',
  icon,
  description,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200/80 p-4 shadow-subtle hover:border-zinc-300 transition-colors">
      <div className="flex items-center justify-between text-zinc-500">
        <span className="text-xs font-medium text-zinc-500">{label}</span>
        {icon && <span className="p-1.5 rounded-md bg-zinc-100 text-zinc-700">{icon}</span>}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight text-zinc-950 font-mono">
          {value}
        </span>
        {change && (
          <span
            className={`inline-flex items-center text-[11px] font-medium ${
              changeType === 'positive'
                ? 'text-emerald-600'
                : changeType === 'negative'
                ? 'text-rose-600'
                : 'text-zinc-500'
            }`}
          >
            {changeType === 'positive' && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
            {changeType === 'negative' && <ArrowDownRight className="w-3 h-3 mr-0.5" />}
            {change}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-1.5 text-[11px] text-zinc-400 font-normal">{description}</p>
      )}
    </div>
  );
}
