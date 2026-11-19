'use client';

import React, { useState } from 'react';
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
  User,
  Check,
  Plus,
  Send,
  Sparkles,
  CreditCard,
  Utensils
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/format';

export default function ClientPortalPage() {
  const {
    events,
    quotations,
    invoices,
    currentUser,
    updateQuotationStatus,
    submitClientRemittance,
    guests,
    addGuest
  } = useERP();

  const [isRemittanceModalOpen, setIsRemittanceModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  // Remittance form
  const [remittanceData, setRemittanceData] = useState({
    amount: 1000000,
    paymentMethod: 'RTGS / Bank Transfer',
    referenceNo: 'HDFC' + Math.floor(100000 + Math.random() * 900000)
  });

  // Guest invitation form
  const [guestData, setGuestData] = useState({
    name: '',
    email: '',
    phone: '',
    group: 'VIP' as const,
    tableNo: 'T-01',
    plusOnes: 1,
    dietaryPref: 'Jain Vegetarian'
  });

  const clientEvent = events[0];
  const clientQuotation = quotations.find(q => q.clientName.toLowerCase().includes('oberoi')) || quotations[0];
  const clientInvoices = invoices.filter(inv => inv.clientName.toLowerCase().includes('oberoi') || inv.id === invoices[0]?.id);
  const eventGuests = guests.filter(g => g.eventId === clientEvent?.id || g.eventTitle === clientEvent?.title);

  const handleApproveProposal = (quoteId: string) => {
    updateQuotationStatus(quoteId, 'approved');
    setFeedbackBanner('Proposal officially approved & signed digitally. Budget locked with production team.');
    setTimeout(() => setFeedbackBanner(null), 5000);
  };

  const handleSubmitRemittance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceId) return;
    submitClientRemittance(selectedInvoiceId, remittanceData);
    setIsRemittanceModalOpen(false);
    setFeedbackBanner(`Remittance advice UTR ${remittanceData.referenceNo} for ₹${formatCurrency(remittanceData.amount)} submitted to accounts team for verification.`);
    setTimeout(() => setFeedbackBanner(null), 6000);
  };

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEvent) return;
    addGuest({
      eventId: clientEvent.id,
      eventTitle: clientEvent.title,
      name: guestData.name,
      email: guestData.email,
      phone: guestData.phone,
      group: guestData.group,
      tableNo: guestData.tableNo,
      plusOnes: guestData.plusOnes,
      dietaryPref: guestData.dietaryPref
    });
    setIsAddGuestModalOpen(false);
    setGuestData({
      name: '',
      email: '',
      phone: '',
      group: 'VIP',
      tableNo: 'T-01',
      plusOnes: 1,
      dietaryPref: 'Jain Vegetarian'
    });
    setFeedbackBanner(`Guest "${guestData.name}" invited successfully.`);
    setTimeout(() => setFeedbackBanner(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Client Self-Service Portal"
        description={`Welcome, ${currentUser.name}. Track your contracted event production, approve proposals, submit payment wire advice, and manage your guest list.`}
        badge={<Badge variant="purple" dot>Client Session</Badge>}
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

      {/* Proposals Section (with digital signing) */}
      {clientQuotation && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Commercial Proposal & Scope</CardTitle>
                <CardDescription>Quotation #{clientQuotation.quotationNo} &bull; Valid Until: {clientQuotation.validUntil}</CardDescription>
              </div>
              <Badge variant={clientQuotation.status === 'approved' ? 'success' : 'warning'} dot>
                {clientQuotation.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="border border-zinc-200/80 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-zinc-50 border-b border-zinc-200/60 font-mono text-[10px] uppercase text-zinc-500">
                  <tr>
                    <th className="p-2.5">Scope Item</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-800">
                  {clientQuotation.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5">{item.description}</td>
                      <td className="p-2.5 text-center font-mono">{item.quantity}</td>
                      <td className="p-2.5 text-right font-mono font-medium">₹{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
              <div className="font-mono text-xs">
                <span className="text-zinc-500">Total Contract Value (incl. 18% GST): </span>
                <span className="font-bold text-zinc-950 text-sm">₹{formatCurrency(clientQuotation.totalAmount)}</span>
              </div>

              {clientQuotation.status !== 'approved' ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApproveProposal(clientQuotation.id)}
                  icon={<Check className="w-3.5 h-3.5" />}
                >
                  Digitally Sign & Approve Proposal
                </Button>
              ) : (
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Contract Signed & Active
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tax Invoices & Remittance Advice Submission */}
      <Card>
        <CardHeader>
          <CardTitle>Milestone Invoices & Payment Remittance</CardTitle>
          <CardDescription>
            Download GST invoices and submit bank transfer wire details (RTGS / NEFT / UPI)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          {clientInvoices.length > 0 ? (
            <div className="divide-y divide-zinc-100">
              {clientInvoices.map((inv) => (
                <div key={inv.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-zinc-900">{inv.invoiceNo}</span>
                      {inv.milestoneTitle && (
                        <span className="text-[11px] bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded border border-zinc-200">
                          {inv.milestoneTitle}
                        </span>
                      )}
                      <Badge variant={inv.status === 'paid' ? 'success' : 'warning'} dot>
                        {inv.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">
                      Due: {inv.dueDate} &bull; Total: ₹{formatCurrency(inv.totalAmount)} &bull; Balance: ₹{formatCurrency(inv.balanceDue)}
                    </p>
                    {inv.pendingRemittance && (
                      <p className="text-[11px] text-amber-700 font-mono mt-1">
                        Remittance Advice Pending: UTR {inv.pendingRemittance.referenceNo} (₹{formatCurrency(inv.pendingRemittance.amount)})
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {inv.status !== 'paid' && !inv.pendingRemittance && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          setSelectedInvoiceId(inv.id);
                          setRemittanceData({
                            amount: inv.balanceDue,
                            paymentMethod: 'RTGS / Bank Transfer',
                            referenceNo: 'HDFC' + Math.floor(100000 + Math.random() * 900000)
                          });
                          setIsRemittanceModalOpen(true);
                        }}
                        icon={<CreditCard className="w-3.5 h-3.5" />}
                      >
                        Submit Wire Advice
                      </Button>
                    )}
                    <Link href="/invoices">
                      <Button variant="outline" size="sm" className="text-xs">
                        View Invoice
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 py-4 text-center">No invoices issued for this account yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Guest List & Invitations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>VIP Guest List & RSVP Manager</CardTitle>
              <CardDescription>
                Invite attendees, designate seating tables, and record dietary preferences.
              </CardDescription>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddGuestModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Guest
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          {eventGuests.length > 0 ? (
            <div className="border border-zinc-200/80 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-zinc-50 border-b border-zinc-200/60 font-mono text-[10px] uppercase text-zinc-500">
                  <tr>
                    <th className="p-2.5">Guest Name</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5 text-center">Table</th>
                    <th className="p-2.5">Dietary Preference</th>
                    <th className="p-2.5 text-center">Passcode</th>
                    <th className="p-2.5 text-right">Admissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-800">
                  {eventGuests.map((g) => (
                    <tr key={g.id}>
                      <td className="p-2.5">
                        <p className="font-semibold text-zinc-900">{g.name}</p>
                        <p className="text-[10px] text-zinc-400">{g.email}</p>
                      </td>
                      <td className="p-2.5">
                        <Badge variant="neutral">{g.group}</Badge>
                      </td>
                      <td className="p-2.5 text-center font-mono font-medium">{g.tableNo}</td>
                      <td className="p-2.5 text-zinc-600">{g.dietaryPref}</td>
                      <td className="p-2.5 text-center font-mono text-[11px] text-zinc-500">{g.passCode}</td>
                      <td className="p-2.5 text-right">
                        <Badge variant={g.isCheckedIn ? 'success' : 'neutral'} dot>
                          {g.isCheckedIn ? 'Admitted' : 'Invited'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-zinc-400 py-6 text-center">No guests added yet. Click &quot;Add Guest&quot; to register your VIPs.</p>
          )}
        </CardContent>
      </Card>

      {/* Wire Remittance Submission Modal */}
      {isRemittanceModalOpen && (
        <Modal
          isOpen={isRemittanceModalOpen}
          onClose={() => setIsRemittanceModalOpen(false)}
          title="Submit Payment Wire / UTR Advice"
          description="Submit your bank transfer details so accounts can reconcile and clear your balance."
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setIsRemittanceModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSubmitRemittance}>
                Submit Advice
              </Button>
            </>
          }
        >
          <form onSubmit={handleSubmitRemittance} className="space-y-3.5">
            <Input
              label="Remitted Amount (₹)"
              type="number"
              value={remittanceData.amount}
              onChange={(e) => setRemittanceData({ ...remittanceData, amount: Number(e.target.value) })}
            />

            <Select
              label="Wire Payment Mode"
              value={remittanceData.paymentMethod}
              onChange={(e) => setRemittanceData({ ...remittanceData, paymentMethod: e.target.value })}
            >
              <option value="RTGS / Bank Transfer">RTGS / Wire Transfer</option>
              <option value="NEFT">NEFT</option>
              <option value="IMPS / UPI">IMPS / UPI Instant Remittance</option>
            </Select>

            <Input
              label="Bank Reference / UTR Number"
              required
              placeholder="e.g. HDFC009981248"
              value={remittanceData.referenceNo}
              onChange={(e) => setRemittanceData({ ...remittanceData, referenceNo: e.target.value })}
            />
          </form>
        </Modal>
      )}

      {/* Add Guest Modal */}
      {isAddGuestModalOpen && (
        <Modal
          isOpen={isAddGuestModalOpen}
          onClose={() => setIsAddGuestModalOpen(false)}
          title="Invite Guest"
          description="Register guest details and allocate table seating."
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setIsAddGuestModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleAddGuest}>
                Add to Guest List
              </Button>
            </>
          }
        >
          <form onSubmit={handleAddGuest} className="space-y-3.5">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Yashvardhan Singhania"
              value={guestData.name}
              onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Email Address"
                type="email"
                placeholder="yash@singhania.com"
                value={guestData.email}
                onChange={(e) => setGuestData({ ...guestData, email: e.target.value })}
              />
              <Input
                label="Phone Number"
                placeholder="+91 98200 11223"
                value={guestData.phone}
                onChange={(e) => setGuestData({ ...guestData, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Category / Group"
                value={guestData.group}
                onChange={(e) => setGuestData({ ...guestData, group: e.target.value as any })}
              >
                <option value="VIP">VIP</option>
                <option value="Family">Family</option>
                <option value="Corporate">Corporate</option>
                <option value="Media">Media</option>
                <option value="General">General</option>
              </Select>

              <Input
                label="Table Allocation"
                placeholder="e.g. Table 04"
                value={guestData.tableNo}
                onChange={(e) => setGuestData({ ...guestData, tableNo: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Plus Ones"
                type="number"
                min={0}
                value={guestData.plusOnes}
                onChange={(e) => setGuestData({ ...guestData, plusOnes: Number(e.target.value) })}
              />
              <Input
                label="Dietary Preferences"
                placeholder="e.g. Jain Vegetarian, Vegan"
                value={guestData.dietaryPref}
                onChange={(e) => setGuestData({ ...guestData, dietaryPref: e.target.value })}
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
