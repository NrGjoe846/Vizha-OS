'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useERP } from '@/lib/store';
import {
  Printer,
  ArrowLeft,
  CalendarDays,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  QrCode
} from 'lucide-react';

export default function TicketPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { tickets, events } = useERP();

  const ticket = tickets.find(t => t.id === resolvedParams.id || t.ticketNumber === resolvedParams.id) || tickets[0];
  const event = events.find(e => e.title === ticket?.eventTitle) || events[0];

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center font-sans">
      {/* Top Action Bar */}
      <div className="no-print max-w-xl w-full mb-4 flex items-center justify-between">
        <Link
          href="/tickets"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Ticket Roster</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Print E-Ticket Pass</span>
        </button>
      </div>

      {/* Ticket Pass Card */}
      <div className="ticket-card max-w-xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative print-card">
        {/* Header Band */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm font-black shadow">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="font-extrabold text-sm tracking-tight">Vizha<span className="text-amber-400"> OS</span></span>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full text-indigo-300">
              Official Admission Pass
            </span>
          </div>

          <div className="mt-5 relative z-10">
            <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
              {event?.eventType || 'Live Production'}
            </span>
            <h1 className="text-xl sm:text-2xl font-black mt-0.5 leading-snug">{ticket.eventTitle}</h1>
            <p className="text-xs text-indigo-200/90 font-mono mt-1">Ticket Ref: {ticket.ticketNumber}</p>
          </div>
        </div>

        {/* Perforated Cut Line Graphic */}
        <div className="relative h-6 bg-white flex items-center justify-between px-0">
          <div className="w-6 h-6 rounded-full bg-slate-100 -ml-3 border-r border-slate-200"></div>
          <div className="flex-1 border-b-2 border-dashed border-slate-200 mx-2"></div>
          <div className="w-6 h-6 rounded-full bg-slate-100 -mr-3 border-l border-slate-200"></div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 pt-2 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Event Dates</span>
              <p className="font-bold text-slate-900 text-sm">
                {event ? `${event.startDate} to ${event.endDate}` : 'Dates Confirmed'}
              </p>
              <p className="text-slate-500 text-[11px]">Gates Open: 16:00 IST</p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Venue Location</span>
              <p className="font-bold text-slate-900 text-sm truncate">
                {event ? event.venueName : 'Main Production Arena'}
              </p>
              <p className="text-slate-500 text-[11px]">Entry Gate: Turnstile Terminal #1</p>
            </div>
          </div>

          {/* Attendee Info */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Ticket Holder</span>
              <h3 className="font-black text-slate-900 text-base">{ticket.buyerName}</h3>
              <p className="text-xs text-slate-500">{ticket.buyerEmail}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-mono block">
                {ticket.ticketTypeName}
              </span>
              <span className="text-xs font-bold text-slate-700 mt-1 block font-mono">
                Paid: ₹{ticket.pricePaid.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 bg-slate-950 text-white rounded-2xl flex items-center justify-center p-2 shadow-inner">
                <QrCode className="w-16 h-16 text-white" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Security QR Token</span>
                <p className="font-mono font-black text-indigo-700 text-sm">{ticket.qrToken}</p>
                <p className="text-[10px] text-slate-500">Scan at optical gate reader upon entry</p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Authentic</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
          This digital admission pass is governed by event terms & conditions. Strict one-time scan policy enforced.
        </div>
      </div>
    </div>
  );
}
