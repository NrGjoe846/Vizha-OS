'use client';

import React from 'react';
import { useERP } from '@/lib/store';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Calendar,
  Users,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function ReportsPage() {
  const { events, invoices, expenses, leads, venues } = useERP();

  const totalInvoiced = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + (e.status === 'approved' ? e.amount : 0), 0);
  const netOperatingProfit = totalCollected - totalExpenses;
  const margin = totalCollected > 0 ? Math.round((netOperatingProfit / totalCollected) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Executive Analytics & Reports</h1>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
            FY 2026-2027
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Financial performance, gross profit margins, pipeline forecast, and venue utilization metrics.
        </p>
      </div>

      {/* Top Margin & Profit Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Collected Revenue</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">₹{(totalCollected / 100000).toFixed(1)}L</p>
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24% vs last quarter</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Approved Production Cost</span>
          <p className="text-2xl font-extrabold text-rose-600 mt-2">₹{(totalExpenses / 100000).toFixed(1)}L</p>
          <p className="text-xs text-slate-400 mt-2">Direct vendor & staging costs</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Operating Profit</span>
          <p className="text-2xl font-extrabold text-indigo-600 mt-2">₹{(netOperatingProfit / 100000).toFixed(1)}L</p>
          <p className="text-xs text-indigo-600 font-semibold mt-2">Cleared & realized margin</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Profit Margin</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-2">{margin}%</p>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${margin}%` }}></div>
          </div>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Category Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Event Portfolio & Production Types</h2>
          <div className="space-y-3">
            {[
              { type: 'Luxury Weddings & Galas', share: 55, color: 'bg-indigo-600' },
              { type: 'Corporate Summits & Expos', share: 25, color: 'bg-cyan-500' },
              { type: 'Live Music Festivals & Concerts', share: 15, color: 'bg-purple-500' },
              { type: 'Product Launches', share: 5, color: 'bg-amber-500' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">{item.type}</span>
                  <span className="text-slate-900 font-bold">{item.share}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.share}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Production Spend Categories</h2>
          <div className="space-y-3">
            {[
              { cat: 'Audio, Visual & LED Video Walls', pct: 38, amount: '₹14.2L' },
              { cat: 'Floral Art, Thematic Mandaps & Chandeliers', pct: 32, amount: '₹12.0L' },
              { cat: 'Gourmet Catering & Bar Mixology', pct: 18, amount: '₹6.8L' },
              { cat: 'Licensing, Police NOC & Municipal Stamps', pct: 12, amount: '₹4.5L' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <p className="font-semibold text-slate-900">{item.cat}</p>
                  <p className="text-[10px] text-slate-400">{item.pct}% of total disbursements</p>
                </div>
                <span className="font-mono font-bold text-slate-900">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
