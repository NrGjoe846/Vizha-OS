'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useERP } from '@/lib/store';
import {
  LayoutDashboard,
  Kanban,
  CalendarDays,
  Users,
  MapPin,
  Truck,
  FileSpreadsheet,
  Receipt,
  Wallet,
  Boxes,
  UserCheck2,
  QrCode,
  BarChart3,
  ExternalLink,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: number;
  highlight?: boolean;
  external?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const { leads, events, invoices } = useERP() as any;

  const pendingLeadsCount = leads?.filter((l: any) => l.stage !== 'converted' && l.stage !== 'lost').length || 0;
  const activeEventsCount = events?.filter((e: any) => e.status !== 'completed' && e.status !== 'cancelled').length || 0;
  const unpaidInvoicesCount = invoices?.filter((i: any) => i.status !== 'paid').length || 0;

  const sections: NavSection[] = [
    {
      title: 'CORE ERP',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Analytics & Reports', href: '/reports', icon: BarChart3 },
      ]
    },
    {
      title: 'CRM & CLIENTS',
      items: [
        { label: 'CRM Leads Pipeline', href: '/leads', icon: Kanban, badge: pendingLeadsCount },
        { label: 'Clients Directory', href: '/clients', icon: Users },
        { label: 'Proposals & Quotations', href: '/quotations', icon: FileSpreadsheet },
      ]
    },
    {
      title: 'OPERATIONS & STAGING',
      items: [
        { label: 'Events & Run of Show', href: '/events', icon: CalendarDays, badge: activeEventsCount },
        { label: 'Partner Venues', href: '/venues', icon: MapPin },
        { label: 'Vendors & Suppliers', href: '/vendors', icon: Truck },
        { label: 'Inventory & AV Gear', href: '/inventory', icon: Boxes },
      ]
    },
    {
      title: 'GATE & GUEST LOGISTICS',
      items: [
        { label: 'Guests & RSVPs', href: '/guests', icon: UserCheck2 },
        { label: 'Ticketing & QR Scanner', href: '/tickets', icon: QrCode, highlight: true },
      ]
    },
    {
      title: 'FINANCE & BILLING',
      items: [
        { label: 'Invoices & GST Billing', href: '/invoices', icon: Receipt, badge: unpaidInvoicesCount },
        { label: 'Budgets & Expenses', href: '/expenses', icon: Wallet },
      ]
    },
    {
      title: 'EXTERNAL PORTALS',
      items: [
        { label: 'Client Portal', href: '/portal/client', icon: ExternalLink, external: true },
        { label: 'Vendor Portal', href: '/portal/vendor', icon: ExternalLink, external: true },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800 no-print">
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        {sections.map((sec, idx) => (
          <div key={idx}>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              {sec.title}
            </p>
            <nav className="space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                        : item.highlight
                        ? 'text-amber-300 hover:bg-slate-800/80 hover:text-amber-200'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.external && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400">Portal</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer System Status */}
      <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Prisma + Supabase v2</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">v2.0.0</span>
      </div>
    </aside>
  );
}
