'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useERP } from '@/lib/store';
import {
  LayoutDashboard,
  Kanban,
  Calendar,
  Users,
  MapPin,
  Truck,
  FileText,
  Receipt,
  CreditCard,
  Package,
  UserCheck,
  QrCode,
  BarChart2,
  ExternalLink,
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
  const { leads, events, invoices, isMobileMenuOpen, setIsMobileMenuOpen } = useERP() as any;

  const pendingLeadsCount = leads?.filter((l: any) => l.stage !== 'converted' && l.stage !== 'lost').length || 0;
  const activeEventsCount = events?.filter((e: any) => e.status !== 'completed' && e.status !== 'cancelled').length || 0;
  const unpaidInvoicesCount = invoices?.filter((i: any) => i.status !== 'paid').length || 0;

  const sections: NavSection[] = [
    {
      title: 'Platform',
      items: [
        { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Analytics', href: '/reports', icon: BarChart2 },
      ]
    },
    {
      title: 'Sales & CRM',
      items: [
        { label: 'Leads Pipeline', href: '/leads', icon: Kanban, badge: pendingLeadsCount },
        { label: 'Customer Directory', href: '/clients', icon: Users },
        { label: 'Quotations', href: '/quotations', icon: FileText },
      ]
    },
    {
      title: 'Productions',
      items: [
        { label: 'Events & Run of Show', href: '/events', icon: Calendar, badge: activeEventsCount },
        { label: 'Venues', href: '/venues', icon: MapPin },
        { label: 'Vendors', href: '/vendors', icon: Truck },
        { label: 'Inventory Fleet', href: '/inventory', icon: Package },
      ]
    },
    {
      title: 'Gate & Admissions',
      items: [
        { label: 'Guest List & RSVP', href: '/guests', icon: UserCheck },
        { label: 'Tickets & QR Scanner', href: '/tickets', icon: QrCode, highlight: true },
      ]
    },
    {
      title: 'Finance',
      items: [
        { label: 'Invoices & GST', href: '/invoices', icon: Receipt, badge: unpaidInvoicesCount },
        { label: 'Expenses', href: '/expenses', icon: CreditCard },
      ]
    },
    {
      title: 'Portals',
      items: [
        { label: 'Client Portal', href: '/portal/client', icon: ExternalLink, external: true },
        { label: 'Vendor Portal', href: '/portal/vendor', icon: ExternalLink, external: true },
      ]
    }
  ];

  const renderNavContent = () => (
    <div className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
      {sections.map((sec, idx) => (
        <div key={idx}>
          <p className="px-2.5 text-[10px] font-mono font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
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
                  onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-zinc-950 text-white shadow-2xs font-semibold'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-zinc-400 group-hover:text-zinc-700'
                      }`}
                      strokeWidth={1.75}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-medium ${
                          isActive
                            ? 'bg-zinc-800 text-zinc-300'
                            : 'bg-zinc-100 text-zinc-600 border border-zinc-200/80'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.external && (
                      <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded bg-zinc-100 text-zinc-500">
                        Ext
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-60 bg-white border-r border-zinc-200/80 flex-col shrink-0 min-h-[calc(100vh-3.5rem)] no-print select-none">
        {renderNavContent()}

        {/* Footer System Status */}
        <div className="p-3 bg-zinc-50/70 border-t border-zinc-200/80 text-[11px] text-zinc-500 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px]">Supabase &bull; Connected</span>
          </div>
          <span className="text-[10px] text-zinc-400">v2.0</span>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-out Drawer */}
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
              <span className="font-bold text-sm tracking-tight text-zinc-950 font-sans">
                Vizha OS Navigation
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-700"
              >
                ✕
              </button>
            </div>

            {renderNavContent()}

            <div className="p-3 bg-zinc-50 border-t border-zinc-200/80 text-[11px] text-zinc-500 flex items-center justify-between font-mono">
              <span className="text-[10px]">Supabase Live</span>
              <span className="text-[10px] text-zinc-400">v2.0</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
