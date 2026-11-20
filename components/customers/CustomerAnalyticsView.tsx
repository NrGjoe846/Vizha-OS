'use client';

import React from 'react';
import { Client } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/format';
import {
  TrendingUp,
  Award,
  Users,
  MapPin,
  Building,
  DollarSign,
  PieChart,
  Repeat,
  AlertTriangle
} from 'lucide-react';

interface CustomerAnalyticsViewProps {
  clients: Client[];
}

export function CustomerAnalyticsView({ clients }: CustomerAnalyticsViewProps) {
  const total = clients.length || 1;

  // Type Distribution
  const typeMap = clients.reduce((acc, c) => {
    const type = c.customerType || 'Individual';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Location Distribution
  const cityMap = clients.reduce((acc, c) => {
    const city = c.city || 'Other';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Category Distribution
  const categoryMap = clients.reduce((acc, c) => {
    const cat = c.category || 'Regular';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Top revenue customers
  const topRevenueCustomers = [...clients]
    .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
    .slice(0, 5);

  // Outstanding receivables list
  const outstandingClients = clients
    .filter(c => (c.totalOutstanding || 0) > 0)
    .sort((a, b) => (b.totalOutstanding || 0) - (a.totalOutstanding || 0));

  const totalOutstanding = clients.reduce((sum, c) => sum + (c.totalOutstanding || 0), 0);
  const totalSpent = clients.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Customer Classification Breakdown */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xs">Customer Classification</CardTitle>
              <CardDescription>Legal & organizational profile distribution</CardDescription>
            </div>
            <Badge variant="neutral" className="font-mono text-xs">
              {clients.length} Master Accounts
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-2">
          {Object.entries(typeMap).map(([type, count]) => {
            const pct = Math.round((count / total) * 100);
            return (
              <div key={type} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-zinc-800">{type}</span>
                  <span className="font-mono text-zinc-500">{count} ({pct}%)</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-900 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(8, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Geographic / City Distribution */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xs flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                <span>Geographic Presence</span>
              </CardTitle>
              <CardDescription>Primary operating cities & regional hubs</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-2">
          {Object.entries(cityMap).map(([city, count]) => {
            const pct = Math.round((count / total) * 100);
            return (
              <div key={city} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-zinc-800">{city}</span>
                  <span className="font-mono text-zinc-500">{count} Accounts</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(8, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Customer Segments & Tiering */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xs flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-zinc-500" />
                <span>Strategic Tiering</span>
              </CardTitle>
              <CardDescription>VIP, Premium, Corporate and Partner segments</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-2">
          {Object.entries(categoryMap).map(([cat, count]) => (
            <div key={cat} className="p-2.5 bg-zinc-50 border border-zinc-200/70 rounded-lg flex justify-between items-center text-xs">
              <span className="font-medium text-zinc-800">{cat}</span>
              <span className="font-mono font-bold text-zinc-900 bg-white px-2 py-0.5 rounded border border-zinc-200">
                {count} Accounts
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top Revenue Contributors */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Top Revenue Contributing Accounts</span>
              </CardTitle>
              <CardDescription>Lifetime cumulative business value delivered across productions</CardDescription>
            </div>
            <span className="font-mono font-bold text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              Total Business: ₹{formatCurrency(totalSpent)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-2.5">
            {topRevenueCustomers.map((c, idx) => (
              <div key={c.id} className="p-3 bg-zinc-50/70 border border-zinc-200/80 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-zinc-900 text-white font-mono flex items-center justify-center font-bold text-xs shrink-0">
                    #{idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900 truncate">{c.name}</span>
                      <span className="font-mono text-[10px] text-zinc-400">{c.customerCode || c.id}</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 truncate">{c.companyName || c.customerType} &bull; {c.city}</p>
                  </div>
                </div>

                <div className="text-right font-mono shrink-0">
                  <span className="font-bold text-zinc-950 text-sm block">₹{formatCurrency(c.totalSpent || 0)}</span>
                  <span className="text-[10px] text-zinc-500">{c.totalBookings || 0} Confirmed Events</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Outstanding Receivables Aging */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xs text-rose-700 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Outstanding Receivables</span>
              </CardTitle>
              <CardDescription>Accounts with pending balance dues</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-2 text-xs">
          {outstandingClients.length > 0 ? (
            outstandingClients.map(c => (
              <div key={c.id} className="p-2.5 bg-rose-50/50 border border-rose-200/70 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-zinc-900 block truncate">{c.name}</span>
                  <span className="text-[10px] font-mono text-zinc-400">{c.customerCode || c.id}</span>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-rose-700 block">₹{formatCurrency(c.totalOutstanding || 0)}</span>
                  <span className="text-[10px] text-zinc-500">Unpaid balance</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-zinc-400 text-xs py-4 text-center">Zero outstanding balances across all accounts.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
