'use client';

import React from 'react';
import Link from 'next/link';
import { useERP } from '@/lib/store';
import {
  Sparkles,
  CalendarDays,
  MapPin,
  Clock,
  CheckCircle2,
  Receipt,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function ClientPortalPage() {
  const { events, quotations, invoices, currentUser } = useERP();

  const clientEvent = events[0];
  const clientQuotation = quotations[0];
  const clientInvoice = invoices[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-purple-900 to-indigo-950 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md mb-3 border border-white/20">
          <ShieldCheck className="w-3.5 h-3.5 text-rose-300" />
          <span>Client Self-Service Portal &bull; VIP Access</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Hello, {currentUser.name}
        </h1>
        <p className="text-indigo-200 text-xs mt-1">
          Review your upcoming production schedule, minute-by-minute itineraries, and payment receipts.
        </p>
      </div>

      {/* Confirmed Production Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Confirmed Production</span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">{clientEvent.title}</h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-bold uppercase bg-emerald-100 text-emerald-800">
            {clientEvent.status.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>{clientEvent.venueName}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-indigo-600" />
            <span>{clientEvent.startDate} &rarr; {clientEvent.endDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Senior Producer: {clientEvent.managerName}</span>
          </div>
        </div>
      </div>

      {/* Minute-by-Minute Timeline for Client */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Minute-by-Minute Itinerary</h3>
        <div className="space-y-3">
          {clientEvent.schedules.map((sch) => (
            <div key={sch.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-start justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {sch.timeSlot}
                  </span>
                  <span className="font-bold text-slate-900">{sch.title}</span>
                </div>
                <p className="text-slate-600 mt-1">{sch.description}</p>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                Lead: {sch.leadPerson}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Statement & Invoices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Approved Quotation</h4>
            <span className="text-xs font-bold font-mono text-indigo-700">{clientQuotation.quotationNo}</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">₹{clientQuotation.totalAmount.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-500">Includes 18% GST and itemized production deliverables</p>
          <Link
            href="/quotations"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-2"
          >
            <span>View Printable Scope of Work</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Disbursement Account</h4>
            <span className="text-xs font-bold font-mono text-indigo-700">{clientInvoice.invoiceNo}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] text-slate-400">Total Paid:</span>
              <p className="text-xl font-bold text-emerald-600">₹{clientInvoice.paidAmount.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400">Balance Payable:</span>
              <p className="text-xl font-bold text-rose-600">₹{clientInvoice.balanceDue.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <Link
            href="/invoices"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 pt-2"
          >
            <span>View GST Tax Receipt</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
