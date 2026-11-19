'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useERP } from '@/lib/store';
import {
  Printer,
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  QrCode,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function TicketPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { tickets, events } = useERP();

  const ticket = tickets.find(t => t.id === resolvedParams.id || t.ticketNumber === resolvedParams.id) || tickets[0];
  const event = events.find(e => e.title === ticket?.eventTitle) || events[0];

  if (!ticket) {
    return (
      <div className="p-8 text-center text-xs text-zinc-500">
        Ticket not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center font-sans bg-[#fafafa]">
      {/* Top Action Bar */}
      <div className="no-print max-w-lg w-full mb-4 flex items-center justify-between">
        <Link href="/tickets">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
            Back to Tickets
          </Button>
        </Link>
        <Button
          variant="primary"
          size="sm"
          onClick={() => window.print()}
          icon={<Printer className="w-3.5 h-3.5" />}
        >
          Print Badge Pass
        </Button>
      </div>

      {/* Modern Minimalist Pass Card */}
      <div className="max-w-lg w-full bg-white rounded-xl border border-zinc-200 shadow-elevated overflow-hidden print-card">
        {/* Header Band */}
        <div className="bg-zinc-950 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-white text-zinc-950 flex items-center justify-center font-bold text-xs">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-xs tracking-tight">Vizha OS Admissions</span>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              {ticket.ticketTypeName}
            </span>
          </div>

          <div className="mt-5">
            <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
              {event?.eventType || 'Enterprise Production'}
            </span>
            <h1 className="text-lg font-semibold tracking-tight text-white mt-0.5">
              {ticket.eventTitle || event?.title}
            </h1>
            <p className="text-[11px] font-mono text-zinc-400 mt-1">Ref: {ticket.ticketNumber}</p>
          </div>
        </div>

        {/* Perforation Line */}
        <div className="relative h-4 bg-white flex items-center justify-between px-0">
          <div className="w-4 h-4 rounded-full bg-[#fafafa] -ml-2 border-r border-zinc-200"></div>
          <div className="flex-1 border-b border-dashed border-zinc-200 mx-2"></div>
          <div className="w-4 h-4 rounded-full bg-[#fafafa] -mr-2 border-l border-zinc-200"></div>
        </div>

        {/* Pass Details */}
        <div className="p-6 pt-3 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-400">Attendee Name</span>
              <p className="font-semibold text-zinc-950 text-sm mt-0.5">{ticket.buyerName}</p>
              <p className="text-[11px] text-zinc-500 font-mono mt-0.5">{ticket.buyerEmail}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-400">Gate Status</span>
              <div className="mt-1">
                <Badge variant={ticket.isScanned ? 'success' : 'neutral'} dot>
                  {ticket.isScanned ? 'Admitted' : 'Valid Pass'}
                </Badge>
              </div>
              <p className="text-[10px] font-mono text-zinc-400 mt-1">Gate: Turnstile 1-A</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs pt-4 border-t border-zinc-100">
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-400">Event Date</span>
              <p className="font-medium text-zinc-800 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>{event?.startDate || '2026-12-10'}</span>
              </p>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-400">Venue Location</span>
              <p className="font-medium text-zinc-800 flex items-center gap-1.5 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="truncate">{event?.venueName || 'Grand Ballroom'}</span>
              </p>
            </div>
          </div>

          {/* Optical QR Code Area */}
          <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200/80 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Cryptographic Token</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-normal">Present at optical turnstile for instant admission</p>
              <p className="text-[10px] font-mono text-zinc-600 font-medium pt-1">
                Token: {ticket.qrToken}
              </p>
            </div>

            <div className="w-16 h-16 bg-white border border-zinc-200 rounded p-1 flex items-center justify-center shrink-0">
              <QrCode className="w-14 h-14 text-zinc-950" />
            </div>
          </div>
        </div>

        {/* Footer Cues */}
        <div className="p-3 bg-zinc-50 border-t border-zinc-100 text-center text-[10px] font-mono text-zinc-400">
          Non-transferable &bull; Valid Photo ID required at gate admission
        </div>
      </div>
    </div>
  );
}
