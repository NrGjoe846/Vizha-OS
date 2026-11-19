'use client';

import React, { useState } from 'react';
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
  User,
  Check,
  X,
  Plus,
  Receipt,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/format';

export default function VendorPortalPage() {
  const {
    events,
    currentUser,
    vendorWorkOrders,
    updateWorkOrderStatus,
    submitVendorBill
  } = useERP();

  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [selectedWoId, setSelectedWoId] = useState<string>('');
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  const [billData, setBillData] = useState({
    amount: 150000,
    description: 'Stage audio rigging completion & technician coverage'
  });

  const assignedEvent = events[0];

  const handleAcceptWo = (woId: string) => {
    updateWorkOrderStatus(woId, 'accepted');
    setFeedbackBanner('Work order accepted! Production management notified.');
    setTimeout(() => setFeedbackBanner(null), 4000);
  };

  const handleDeclineWo = (woId: string) => {
    updateWorkOrderStatus(woId, 'declined');
    setFeedbackBanner('Work order declined.');
    setTimeout(() => setFeedbackBanner(null), 4000);
  };

  const handleSubmitBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWoId) return;
    submitVendorBill(selectedWoId, billData);
    setIsBillModalOpen(false);
    setFeedbackBanner(`Bill for ₹${formatCurrency(billData.amount)} submitted successfully to the event producer and finance team for reimbursement.`);
    setTimeout(() => setFeedbackBanner(null), 5000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Vendor Partner Portal"
        description={`Welcome, ${currentUser.name}. Access your active dispatch work orders, accept contracts, submit milestone bills, and view staging cues.`}
        badge={<Badge variant="purple" dot>Partner Session</Badge>}
        actions={
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              Return to ERP Console
            </Button>
          </Link>
        }
      />

      {feedbackBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackBanner}</span>
          </div>
          <button onClick={() => setFeedbackBanner(null)} className="text-emerald-700 hover:text-emerald-950 font-bold ml-2">✕</button>
        </div>
      )}

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
                Production Active
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

      {/* Assigned Work Orders (POs) */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Work Orders & Purchase Orders</CardTitle>
          <CardDescription>
            Review scope of work, contract values, advance payments, and submit completion bills
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {vendorWorkOrders.length > 0 ? (
            <div className="space-y-3">
              {vendorWorkOrders.map((wo) => (
                <div
                  key={wo.id}
                  className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl space-y-3"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-zinc-900">{wo.workOrderNo}</span>
                        <span className="text-[11px] text-zinc-500 font-medium">({wo.vendorCategory})</span>
                        <Badge
                          variant={
                            wo.status === 'accepted'
                              ? 'success'
                              : wo.status === 'invoiced'
                              ? 'purple'
                              : wo.status === 'declined'
                              ? 'danger'
                              : 'warning'
                          }
                          dot
                        >
                          {wo.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-600 mt-1">{wo.scopeOfWork}</p>
                      {wo.cueAssignments && (
                        <p className="text-[11px] font-mono text-zinc-500 mt-1">
                          Assigned Cues: {wo.cueAssignments}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:items-end font-mono text-xs shrink-0">
                      <span className="text-zinc-500">Contract: <strong className="text-zinc-950 font-semibold">₹{formatCurrency(wo.contractAmount)}</strong></span>
                      <span className="text-emerald-700">Advance: ₹{formatCurrency(wo.advancePaid)}</span>
                      <span className="text-zinc-400 text-[10px]">Due: {wo.dueDate}</span>
                    </div>
                  </div>

                  {/* Vendor Action Strip */}
                  <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-end gap-2">
                    {wo.status === 'issued' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs text-rose-600 hover:bg-rose-50"
                          onClick={() => handleDeclineWo(wo.id)}
                          icon={<X className="w-3.5 h-3.5" />}
                        >
                          Decline
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleAcceptWo(wo.id)}
                          icon={<Check className="w-3.5 h-3.5" />}
                        >
                          Accept Work Order
                        </Button>
                      </>
                    )}

                    {wo.status === 'accepted' && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          setSelectedWoId(wo.id);
                          setBillData({
                            amount: Math.max(0, wo.contractAmount - wo.advancePaid),
                            description: `Final Milestone Billing for ${wo.workOrderNo}`
                          });
                          setIsBillModalOpen(true);
                        }}
                        icon={<Receipt className="w-3.5 h-3.5" />}
                      >
                        Submit Milestone Bill
                      </Button>
                    )}

                    {wo.status === 'invoiced' && (
                      <span className="text-xs font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        Bill Under Finance Review
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 py-6 text-center">No active work orders dispatched to your profile.</p>
          )}
        </CardContent>
      </Card>

      {/* Technical Rigging Scope */}
      {assignedEvent && (
        <Card>
          <CardHeader>
            <CardTitle>Master Technical Cue Call Sheet</CardTitle>
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
                        AV Cue Trigger: {sch.cueNotes}
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-400 shrink-0 font-medium">
                    Lead: {sch.leadPerson}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Bill Modal */}
      {isBillModalOpen && (
        <Modal
          isOpen={isBillModalOpen}
          onClose={() => setIsBillModalOpen(false)}
          title="Submit Vendor Invoice / Milestone Claim"
          description="Submit your billing claim to the event producer and finance team."
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setIsBillModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSubmitBill}>
                Submit Bill for Approval
              </Button>
            </>
          }
        >
          <form onSubmit={handleSubmitBill} className="space-y-3.5">
            <Input
              label="Claim Amount (₹)"
              type="number"
              required
              value={billData.amount}
              onChange={(e) => setBillData({ ...billData, amount: Number(e.target.value) })}
            />

            <Input
              label="Work Description / Deliverable Proof"
              required
              placeholder="e.g. Line array truss rig completed, stage sound checked, and live sound support provided."
              value={billData.description}
              onChange={(e) => setBillData({ ...billData, description: e.target.value })}
            />
          </form>
        </Modal>
      )}
    </div>
  );
}
