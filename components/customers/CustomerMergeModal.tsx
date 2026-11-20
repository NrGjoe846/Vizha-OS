'use client';

import React, { useState } from 'react';
import { Client, EventModel, Quotation, Invoice } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select, Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/format';
import { GitMerge, AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface CustomerMergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  events: EventModel[];
  quotations: Quotation[];
  invoices: Invoice[];
  initialClient?: Client | null;
  onConfirmMerge: (masterId: string, secondaryId: string, reason: string) => void;
}

export function CustomerMergeModal({
  isOpen,
  onClose,
  clients,
  events,
  quotations,
  invoices,
  initialClient,
  onConfirmMerge
}: CustomerMergeModalProps) {
  const [masterId, setMasterId] = useState<string>(initialClient?.id || clients[0]?.id || '');
  const [secondaryId, setSecondaryId] = useState<string>(
    clients.find(c => c.id !== (initialClient?.id || clients[0]?.id))?.id || ''
  );
  const [mergeReason, setMergeReason] = useState<string>('Duplicate profile cleanup and consolidation of accounts.');

  const master = clients.find(c => c.id === masterId);
  const secondary = clients.find(c => c.id === secondaryId);

  // Events, quotes, invoices belonging to secondary
  const secondaryEvents = events.filter(e => e.clientId === secondaryId);
  const secondaryQuotes = quotations.filter(q => q.clientId === secondaryId);
  const secondaryInvoices = invoices.filter(i => i.clientId === secondaryId);

  // Find candidate duplicate pairs in the directory for helpful suggestion
  const candidatePairs: { client1: Client; client2: Client; reason: string }[] = [];
  for (let i = 0; i < clients.length; i++) {
    for (let j = i + 1; j < clients.length; j++) {
      const c1 = clients[i];
      const c2 = clients[j];
      const p1 = c1.phone.replace(/[^0-9]/g, '');
      const p2 = c2.phone.replace(/[^0-9]/g, '');
      const e1 = c1.email.trim().toLowerCase();
      const e2 = c2.email.trim().toLowerCase();

      if (p1 && p2 && p1 === p2) {
        candidatePairs.push({ client1: c1, client2: c2, reason: `Exact Phone Match (${c1.phone})` });
      } else if (e1 && e2 && e1 === e2) {
        candidatePairs.push({ client1: c1, client2: c2, reason: `Exact Email Match (${c1.email})` });
      }
    }
  }

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterId || !secondaryId || masterId === secondaryId) return;
    onConfirmMerge(masterId, secondaryId, mergeReason);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Merge Duplicate Customer Master Records"
      description="Consolidate duplicate customer profiles into a single authoritative master record while preserving all events, contracts, quotations, and financial transaction histories."
      maxWidth="3xl"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExecute}
            disabled={!masterId || !secondaryId || masterId === secondaryId || !mergeReason}
            icon={<GitMerge className="w-3.5 h-3.5" />}
          >
            Execute Non-Destructive Merge
          </Button>
        </>
      }
    >
      <form onSubmit={handleExecute} className="space-y-4 text-xs">
        {/* Important Rule Notice */}
        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
          <p className="text-[11px] leading-relaxed">
            <strong>Mandatory Governance Rule:</strong> Merging is irreversible. The surviving master record retains its code, while all contacts, addresses, historical events, quotations, and invoices from the secondary profile are reassigned to the master. The secondary profile will be archived with a merge pointer.
          </p>
        </div>

        {/* Suggested Duplicate Matches */}
        {candidatePairs.length > 0 && (
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
            <span className="font-bold text-amber-900 block text-[11px]">Suggested Duplicate Matches Detected:</span>
            <div className="space-y-1">
              {candidatePairs.map((pair, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] text-amber-950">
                  <span>
                    <strong>{pair.client1.name}</strong> ({pair.client1.customerCode || pair.client1.id}) &bull; <strong>{pair.client2.name}</strong> ({pair.client2.customerCode || pair.client2.id}) — {pair.reason}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMasterId(pair.client1.id);
                      setSecondaryId(pair.client2.id);
                    }}
                    className="text-[10px] font-bold text-amber-800 underline hover:text-amber-950"
                  >
                    Select Pair
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3.5">
          {/* Master Selection */}
          <div className="p-3.5 bg-emerald-50/50 border border-emerald-200/80 rounded-xl space-y-2">
            <span className="font-bold text-emerald-950 block text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Surviving Master Record (Primary)
            </span>
            <Select
              value={masterId}
              onChange={(e) => setMasterId(e.target.value)}
              className="text-xs"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.customerCode || c.id} &bull; {c.city})
                </option>
              ))}
            </Select>

            {master && (
              <div className="text-[11px] text-zinc-600 space-y-0.5 pt-1 font-mono">
                <p>Code: <strong>{master.customerCode || master.id}</strong></p>
                <p>Phone: {master.phone}</p>
                <p>Email: {master.email}</p>
                <p>Total Bookings: {master.totalBookings}</p>
              </div>
            )}
          </div>

          {/* Secondary Selection */}
          <div className="p-3.5 bg-rose-50/40 border border-rose-200/80 rounded-xl space-y-2">
            <span className="font-bold text-rose-950 block text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Duplicate Record to Merge & Archive
            </span>
            <Select
              value={secondaryId}
              onChange={(e) => setSecondaryId(e.target.value)}
              className="text-xs"
            >
              {clients
                .filter(c => c.id !== masterId)
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.customerCode || c.id} &bull; {c.city})
                  </option>
                ))}
            </Select>

            {secondary && (
              <div className="text-[11px] text-zinc-600 space-y-0.5 pt-1 font-mono">
                <p>Code: <strong>{secondary.customerCode || secondary.id}</strong></p>
                <p>Phone: {secondary.phone}</p>
                <p>Email: {secondary.email}</p>
                <p>Total Bookings: {secondary.totalBookings}</p>
              </div>
            )}
          </div>
        </div>

        {/* Transfer Impact Summary */}
        {secondary && (
          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1 text-xs font-mono">
            <span className="font-bold text-zinc-900 block font-sans">Records Scheduled for Automatic Reassignment:</span>
            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
              <div>Events to Reassign: <strong>{secondaryEvents.length}</strong></div>
              <div>Quotations to Reassign: <strong>{secondaryQuotes.length}</strong></div>
              <div>Invoices to Reassign: <strong>{secondaryInvoices.length}</strong></div>
              <div>Contacts to Combine: <strong>{secondary.contacts?.length || 0}</strong></div>
              <div>Addresses to Combine: <strong>{secondary.addresses?.length || 0}</strong></div>
              <div>Documents to Combine: <strong>{secondary.documents?.length || 0}</strong></div>
            </div>
          </div>
        )}

        <Input
          label="Mandatory Merge Justification / Audit Reason"
          required
          placeholder="e.g. Duplicate enquiry via Instagram and Website form by same individual."
          value={mergeReason}
          onChange={(e) => setMergeReason(e.target.value)}
        />
      </form>
    </Modal>
  );
}
