'use client';

import React from 'react';
import { useERP } from '@/lib/store';
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Calendar,
  Users,
  MapPin,
  Download,
  Printer
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';

export default function ReportsPage() {
  const { events, invoices, expenses, leads, venues } = useERP();

  const totalInvoiced = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + (e.status === 'approved' ? e.amount : 0), 0);
  const netOperatingProfit = totalCollected - totalExpenses;
  const margin = totalCollected > 0 ? Math.round((netOperatingProfit / totalCollected) * 100) : 0;

  // Event category counts
  const eventTypes: Record<string, number> = {};
  events.forEach(e => {
    eventTypes[e.eventType] = (eventTypes[e.eventType] || 0) + 1;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Executive Analytics & P&L"
        description="Consolidated revenue recognition, operational disbursements, gross margin performance, and pipeline yields."
        badge={
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
            FY 2026-2027
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              icon={<Printer className="w-3.5 h-3.5" />}
            >
              Print P&L
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
            >
              Export CSV
            </Button>
          </div>
        }
      />

      {/* 4 Financial KPI StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Collected Revenue"
          value={`₹${(totalCollected / 100000).toFixed(1)}L`}
          change="+24% YoY"
          changeType="positive"
          icon={<DollarSign className="w-4 h-4" />}
          description={`₹${(totalInvoiced / 100000).toFixed(1)}L cumulative billed`}
        />
        <StatCard
          label="Production Disbursements"
          value={`₹${(totalExpenses / 100000).toFixed(1)}L`}
          change={`${expenses.length} approved outlays`}
          changeType="neutral"
          icon={<TrendingDown className="w-4 h-4" />}
          description="Direct vendor and staging costs"
        />
        <StatCard
          label="Net Operating Profit"
          value={`₹${(netOperatingProfit / 100000).toFixed(1)}L`}
          changeType="positive"
          icon={<TrendingUp className="w-4 h-4" />}
          description="Realized operating surplus"
        />
        <StatCard
          label="Gross Profit Margin"
          value={`${margin}%`}
          change="Strong efficiency"
          changeType="positive"
          icon={<BarChart2 className="w-4 h-4" />}
          description="Operating profitability index"
        />
      </div>

      {/* Detailed Analysis Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Production Category Breakdown</CardTitle>
            <CardDescription>Event types by active volume and revenue allocation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {Object.entries(eventTypes).map(([type, count]) => {
              const percentage = Math.round((count / events.length) * 100);

              return (
                <div key={type} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-900">{type}</span>
                    <span className="font-mono text-zinc-500 text-[11px]">{count} Productions ({percentage}%)</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-900 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* CRM Pipeline Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>CRM Pipeline Velocity</CardTitle>
            <CardDescription>Deals progression across commercial sales stages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {['new', 'qualified', 'proposal_sent', 'negotiating', 'converted'].map((stage) => {
              const stageCount = leads.filter(l => l.stage === stage).length;
              const stageBudget = leads.filter(l => l.stage === stage).reduce((acc, l) => acc + l.estimatedBudget, 0);
              const percentage = leads.length > 0 ? Math.round((stageCount / leads.length) * 100) : 0;

              return (
                <div key={stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-900 capitalize">{stage.replace('_', ' ')}</span>
                    <span className="font-mono text-zinc-600 text-[11px]">
                      ₹{(stageBudget / 100000).toFixed(1)}L ({stageCount} deals)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-900 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
