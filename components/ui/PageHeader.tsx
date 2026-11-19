import React from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200/80">
      <div className="space-y-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span>/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-zinc-700 transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-zinc-600 font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-950 font-sans">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-xs text-zinc-500 max-w-2xl font-normal">{description}</p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
