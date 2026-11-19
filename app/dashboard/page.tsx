'use client';

import React from 'react';
import Link from 'next/link';
import { useERP } from '@/lib/store';
import {
  Calendar,
  Kanban,
  Receipt,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  QrCode,
  Sparkles,
  MapPin,
  TrendingUp,
  Circle
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/format';

export default function DashboardPage() {
  const { currentUser, events, leads, invoices, expenses, guests, toggleEventSchedule, toggleEventTask } = useERP();

  // Calculations
  const activeEvents = events.filter(e => e.status !== 'completed' && e.status !== 'cancelled');
  const totalBudget = activeEvents.reduce((acc, e) => acc + e.budget, 0);
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              Overview &bull; {currentUser.branchName || 'Headquarters'}
            </span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-950">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Signed in as <span className="font-medium text-zinc-800">{currentUser.roleTitle}</span>. Here is the operational pulse across active productions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/events">
            <Button variant="outline" size="sm" icon={<Calendar className="w-3.5 h-3.5" />}>
              Events
            </Button>
          </Link>
          <Link href="/leads">
            <Button variant="outline" size="sm" icon={<Kanban className="w-3.5 h-3.5" />}>
              Pipeline
            </Button>
          </Link>
          <Link href="/tickets">
            <Button variant="primary" size="sm" icon={<QrCode className="w-3.5 h-3.5" />}>
              Gate Scanner
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Productions"
          value={activeEvents.length}
          change="+2 this month"
          changeType="positive"
          icon={<Calendar className="w-4 h-4" />}
          description={`₹${(totalBudget / 100000).toFixed(1)}L combined budget`}
        />
        <StatCard
          label="Sales Pipeline"
          value={`₹${(pipelineValue / 100000).toFixed(1)}L`}
          change={`${leads.length} active leads`}
          changeType="neutral"
          icon={<Kanban className="w-4 h-4" />}
          description="Qualified and proposal stages"
        />
        <StatCard
          label="Receivables Due"
          value={`₹${(pendingReceivables / 1000).toFixed(0)}k`}
          change={`₹${(totalCollected / 1000).toFixed(0)}k received`}
          changeType={pendingReceivables > 0 ? 'negative' : 'positive'}
          icon={<Receipt className="w-4 h-4" />}
          description={`${invoices.filter(i => i.status !== 'paid').length} invoices awaiting payment`}
        />
        <StatCard
          label="Gate Check-Ins"
          value={`${checkInRate}%`}
          change={`${checkedInGuests} of ${totalGuests} checked in`}
          changeType="positive"
          icon={<Users className="w-4 h-4" />}
          description="Live barcode & QR gate admissions"
        />
      </div>

      {/* Main 2-Column Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Production Run-of-Show */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    <span>Run of Show Timeline</span>
                    <Badge variant="purple" dot className="ml-2 font-mono">Live Cue</Badge>
                  </CardTitle>
                  <CardDescription>
                    {featuredEvent ? `${featuredEvent.title} • ${featuredEvent.venueName}` : 'No active production scheduled'}
                  </CardDescription>
                </div>
                {featuredEvent && (
                  <Link href={`/events/${featuredEvent.id}`}>
                    <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Details
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-4">
              {featuredEvent?.schedules && featuredEvent.schedules.length > 0 ? (
                <div className="space-y-2.5">
                  {featuredEvent.schedules.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleEventSchedule(featuredEvent.id, item.id)}
                      className={`group flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        item.isCompleted
                          ? 'bg-zinc-50/50 border-zinc-200/60 opacity-60'
                          : 'bg-white border-zinc-200/80 hover:border-zinc-300 hover:shadow-2xs'
                      }`}
                    >
                      <button
                        type="button"
                        className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                          item.isCompleted
                            ? 'bg-zinc-900 border-zinc-900 text-white'
                            : 'border-zinc-300 hover:border-zinc-500'
                        }`}
                      >
                        {item.isCompleted && <CheckCircle2 className="w-3 h-3" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs font-medium tracking-tight ${item.isCompleted ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>
                            {item.title}
                          </p>
                          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200/60 shrink-0">
                            {item.timeSlot}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">{item.description}</p>
                        {item.cueNotes && (
                          <p className="text-[10px] font-mono text-amber-700 bg-amber-50/80 px-2 py-0.5 rounded mt-1.5 inline-block border border-amber-200/50">
                            Cue: {item.cueNotes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 py-4 text-center">No schedule cues available.</p>
              )}
            </CardContent>
          </Card>

          {/* Active Events Overview Strip */}
          <Card>
            <CardHeader>
              <CardTitle>Active Productions</CardTitle>
              <CardDescription>Multi-branch live events in progress or confirmed</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-100">
                {activeEvents.slice(0, 4).map((evt) => (
                  <div key={evt.id} className="p-4 flex items-center justify-between hover:bg-zinc-50/60 transition-colors">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link href={`/events/${evt.id}`} className="text-xs font-semibold text-zinc-900 hover:underline truncate">
                          {evt.title}
                        </Link>
                        <Badge
                          variant={evt.status === 'confirmed' ? 'success' : evt.status === 'in_progress' ? 'purple' : 'default'}
                          dot
                        >
                          {evt.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                        <span>{evt.clientName}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-zinc-400" />
                          {evt.venueName}
                        </span>
                        <span>&bull;</span>
                        <span className="font-mono">{evt.startDate}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-mono font-medium text-zinc-900">
                        ₹{formatCurrency(evt.budget)}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        {evt.guestCount} guests
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Production Tasks & CRM Quick Pulse */}
        <div className="space-y-6">
          {/* Production Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Production Checklist</CardTitle>
              <CardDescription>Milestone verification items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-4">
              {featuredEvent?.tasks && featuredEvent.tasks.length > 0 ? (
                featuredEvent.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleEventTask(featuredEvent.id, task.id)}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg border border-zinc-200/70 hover:bg-zinc-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => {}}
                      className="mt-0.5 rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${task.isCompleted ? 'line-through text-zinc-400' : 'text-zinc-800 font-medium'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-zinc-500">{task.assignedTo}</span>
                        <span className="text-[10px] font-mono text-zinc-400">&bull; {task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400 text-center py-3">No active tasks.</p>
              )}
            </CardContent>
          </Card>

          {/* Recent CRM Inquiries */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Leads</CardTitle>
                  <CardDescription>Latest client inquiries</CardDescription>
                </div>
                <Link href="/leads">
                  <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3 h-3" />}>
                    Board
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-100">
                {leads.slice(0, 4).map((lead) => (
                  <div key={lead.id} className="p-3.5 hover:bg-zinc-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-zinc-900 truncate">{lead.title}</p>
                      <Badge variant="neutral" className="capitalize text-[10px]">
                        {lead.stage.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-1">
                      <span>{lead.clientName}</span>
                      <span className="font-mono font-medium text-zinc-800">
                        ₹{formatCurrency(lead.estimatedBudget)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
