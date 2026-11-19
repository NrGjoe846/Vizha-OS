'use client';

import React from 'react';
import Link from 'next/link';
import { useERP } from '@/lib/store';
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Receipt,
  FileText,
  ArrowRight,
  ShieldCheck,
  User
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function ClientPortalPage() {
  const { events, quotations, invoices, currentUser } = useERP();

  const clientEvent = events[0];
  const clientQuotation = quotations[0];
  const clientInvoice = invoices[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Client Self-Service Portal"
        description={`Welcome, ${currentUser.name}. Track your contracted event production, minute-by-minute timeline, proposals, and invoices.`}
        badge={<Badge variant="purple" dot>Client Session</Badge>}
        actions={
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              Return to ERP Console
            </Button>
          </Link>
        }
      />

      {/* Production Overview Card */}
      {clientEvent && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400">Contracted Production</span>
                <CardTitle className="text-base mt-0.5">{clientEvent.title}</CardTitle>
              </div>
              <Badge variant="success" dot className="capitalize">
                {clientEvent.status.replace('_', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                <span className="truncate">{clientEvent.venueName}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>{clientEvent.startDate} to {clientEvent.endDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Producer: {clientEvent.managerName}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline Section */}
      {clientEvent && (
        <Card>
          <CardHeader>
            <CardTitle>Minute-by-Minute Itinerary</CardTitle>
            <CardDescription>Live staging run-of-show sequence for your event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="divide-y divide-zinc-100">
              {clientEvent.schedules.map((sch) => (
                <div key={sch.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800">
                        {sch.timeSlot}
                      </span>
                      <h4 className="text-xs font-semibold text-zinc-950">{sch.title}</h4>
                    </div>
                    <p className="text-xs text-zinc-500">{sch.description}</p>
                  </div>
                  <span className="text-[11px] text-zinc-400 shrink-0 font-medium">
                    {sch.leadPerson}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financials Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clientQuotation && (
          <Card className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-950">Proposal {clientQuotation.quotationNo}</span>
              </div>
              <p className="text-[11px] font-mono text-zinc-500">Total: ₹{clientQuotation.totalAmount.toLocaleString()}</p>
            </div>
            <Link href="/quotations">
              <Button variant="outline" size="sm">
                View Proposal
              </Button>
            </Link>
          </Card>
        )}

        {clientInvoice && (
          <Card className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-950">Tax Invoice {clientInvoice.invoiceNo}</span>
              </div>
              <p className="text-[11px] font-mono text-zinc-500">Balance: ₹{clientInvoice.balanceDue.toLocaleString()}</p>
            </div>
            <Link href="/invoices">
              <Button variant="outline" size="sm">
                View Invoice
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
