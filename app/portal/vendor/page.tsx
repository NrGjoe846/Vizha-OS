'use client';

import React from 'react';
import Link from 'next/link';
import { useERP } from '@/lib/store';
import {
  Truck,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function VendorPortalPage() {
  const { events, currentUser } = useERP();

  const assignedEvent = events[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Vendor Partner Portal"
        description={`Welcome, ${currentUser.name}. Access your active dispatch work orders, rigging schedules, and staging assignments.`}
        badge={<Badge variant="purple" dot>Work Order #WO-2026-902</Badge>}
        actions={
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              Return to ERP Console
            </Button>
          </Link>
        }
      />

      {/* Production Assignment */}
      {assignedEvent && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400">Assigned Production</span>
                <CardTitle className="text-base mt-0.5">{assignedEvent.title}</CardTitle>
              </div>
              <Badge variant="success" dot>
                Work Order Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                <span className="truncate">{assignedEvent.venueName}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Rigging Date: {assignedEvent.startDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Show Producer: {assignedEvent.managerName}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Rigging Scope */}
      {assignedEvent && (
        <Card>
          <CardHeader>
            <CardTitle>Technical Scope & Rigging Schedule</CardTitle>
            <CardDescription>Minute-by-minute AV line checks, sound cues, and staging transitions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="divide-y divide-zinc-100">
              {assignedEvent.schedules.map((sch) => (
                <div key={sch.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800">
                        {sch.timeSlot}
                      </span>
                      <h4 className="text-xs font-semibold text-zinc-950">{sch.title}</h4>
                    </div>
                    <p className="text-xs text-zinc-500">{sch.description}</p>
                    {sch.cueNotes && (
                      <div className="text-[10px] font-mono text-amber-800 bg-amber-50/70 px-2 py-0.5 rounded border border-amber-200/50 inline-block mt-1">
                        Trigger: {sch.cueNotes}
                      </div>
                    )}
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

      {/* Subcontractor Purchase Order Details */}
      <Card className="p-4 flex items-center justify-between text-xs">
        <div className="space-y-0.5">
          <p className="font-semibold text-zinc-950">Subcontractor Purchase Order #PO-AV-4401</p>
          <p className="text-zinc-500 font-mono text-[11px]">Contract Value: ₹15,00,000 &bull; Advance 50% Released</p>
        </div>
        <Link href="/expenses">
          <Button variant="outline" size="sm">
            Disbursement Ledger
          </Button>
        </Link>
      </Card>
    </div>
  );
}
