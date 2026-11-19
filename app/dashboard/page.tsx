'use client';

import React from 'react';
import Link from 'next/link';
import { useERP } from '@/lib/store';
import {
  CalendarDays,
  Kanban,
  Receipt,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  MapPin,
  QrCode,
  DollarSign
} from 'lucide-react';

export default function DashboardPage() {
  const { currentUser, events, leads, invoices, expenses, guests, toggleEventSchedule, toggleEventTask } = useERP();

  // Calculations
  const activeEvents = events.filter(e => e.status !== 'completed' && e.status !== 'cancelled');
  const totalBudget = activeEvents.reduce((acc, e) => acc + e.budget, 0);
  const totalSpent = activeEvents.reduce((acc, e) => acc + e.actualSpend, 0);

  const pipelineValue = leads
    .filter(l => l.stage !== 'lost')
    .reduce((acc, l) => acc + l.estimatedBudget, 0);

  const totalInvoiced = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const pendingReceivables = invoices.reduce((acc, i) => acc + i.balanceDue, 0);

  const totalGuests = guests.length;
  const checkedInGuests = guests.filter(g => g.isCheckedIn).length;
  const checkInRate = totalGuests > 0 ? Math.round((checkedInGuests / totalGuests) * 100) : 0;

  // Active event for run-of-show
  const featuredEvent = events[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-12">
          <CalendarDays className="w-96 h-96 -rotate-12" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold backdrop-blur-md mb-3 border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Tenant Enterprise ERP &bull; {currentUser.branchName || 'Headquarters'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-indigo-200 text-sm mt-1 max-w-2xl font-light">
            You are logged in as <span className="font-semibold text-white">{currentUser.roleTitle}</span>. Monitor active productions, track lead pipelines, check-in guests, and inspect GST invoicing below.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/events"
              className="px-4 py-2 bg-white text-indigo-900 rounded-xl text-xs font-semibold hover:bg-indigo-50 transition-colors shadow-md flex items-center gap-1.5"
            >
              <CalendarDays className="w-4 h-4 text-indigo-600" />
              <span>Manage Events</span>
            </Link>
            <Link
              href="/leads"
              className="px-4 py-2 bg-indigo-700/60 hover:bg-indigo-700 border border-indigo-500/50 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Kanban className="w-4 h-4 text-indigo-300" />
              <span>CRM Pipeline</span>
            </Link>
            <Link
              href="/tickets"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-colors shadow-md flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4 text-slate-900" />
              <span>Open Gate QR Scanner</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Active Productions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Productions</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">{activeEvents.length} Events</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Allocated Budget:</span>
            <span className="font-semibold text-slate-800">₹{(totalBudget / 100000).toFixed(1)}L</span>
          </div>
        </div>

        {/* Card 2: CRM Pipeline */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sales Pipeline</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">₹{(pipelineValue / 100000).toFixed(1)} Lakhs</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Active Enquiries:</span>
            <span className="font-semibold text-emerald-700">{leads.filter(l => l.stage !== 'converted' && l.stage !== 'lost').length} leads</span>
          </div>
        </div>

        {/* Card 3: Invoiced & Collected */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Collected Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">₹{(totalCollected / 100000).toFixed(1)} Lakhs</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Balance Pending:</span>
            <span className="font-semibold text-rose-600">₹{(pendingReceivables / 100000).toFixed(1)}L</span>
          </div>
        </div>

        {/* Card 4: Guest Logistics */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gate Check-in Ratio</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">{checkInRate}% Admitted</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Checked In:</span>
            <span className="font-semibold text-slate-800">{checkedInGuests} of {totalGuests} guests</span>
          </div>
        </div>
      </div>

      {/* Main Two Columns: Run of Show & Production Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Live Minute-by-Minute Run of Show */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Minute-by-Minute Run of Show</h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800">
                  Live Event
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {featuredEvent.title} &bull; {featuredEvent.venueName}
              </p>
            </div>
            <Link
              href={`/events/${featuredEvent.id}`}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <span>Full Production Deck</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {featuredEvent.schedules.map((sch) => (
              <div
                key={sch.id}
                className={`p-4 rounded-xl border transition-all ${
                  sch.isCompleted
                    ? 'bg-slate-50/80 border-slate-200 opacity-75'
                    : 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleEventSchedule(featuredEvent.id, sch.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        sch.isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 hover:border-indigo-600'
                      }`}
                    >
                      {sch.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 font-mono">
                          {sch.timeSlot}
                        </span>
                        <h3 className={`text-sm font-semibold ${sch.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {sch.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{sch.description}</p>
                      {sch.cueNotes && (
                        <div className="mt-2 text-[11px] bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span><strong className="font-semibold">Cue Note:</strong> {sch.cueNotes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap bg-slate-100 px-2 py-0.5 rounded">
                    Lead: {sch.leadPerson}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Urgent Production Checklist */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Production Checklist</h2>
              <p className="text-xs text-slate-500">Tasks requiring immediate attention</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-rose-50 text-rose-700 rounded-full border border-rose-200">
              {featuredEvent.tasks.filter(t => !t.isCompleted).length} Pending
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {featuredEvent.tasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-xl border transition-all ${
                  task.isCompleted ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <button
                    onClick={() => toggleEventTask(featuredEvent.id, task.id)}
                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                      task.isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-indigo-600'
                    }`}
                  >
                    {task.isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                        {task.category}
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        task.priority === 'urgent' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-[10px] text-slate-400">Due: {task.dueDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              href="/events"
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View All Event Tasks</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Grid: CRM Deals + Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CRM Pipeline Leads */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">CRM Inquiries & Negotiations</h2>
              <p className="text-xs text-slate-500">Prospective client accounts</p>
            </div>
            <Link href="/leads" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              Open Kanban
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {leads.slice(0, 4).map((l) => (
              <div key={l.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{l.title}</h4>
                  <p className="text-[11px] text-slate-500">{l.clientName} &bull; {l.eventType}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900">₹{(l.estimatedBudget / 100000).toFixed(1)}L</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {l.stage.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Invoices & Compliance */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent GST Tax Invoices</h2>
              <p className="text-xs text-slate-500">18% GST compliant enterprise billing</p>
            </div>
            <Link href="/invoices" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
              Manage Billing
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {invoices.map((inv) => (
              <div key={inv.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-slate-900">{inv.invoiceNo}</span>
                    <span className={`text-[10px] px-2 py-0.2 rounded-full font-semibold uppercase ${
                      inv.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inv.status === 'partial'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{inv.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900">₹{inv.totalAmount.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-slate-500">Due: ₹{inv.balanceDue.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
