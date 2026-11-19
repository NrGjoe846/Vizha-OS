'use client';

import React, { useState } from 'react';
import { useERP } from '@/lib/store';
import {
  FileText,
  Plus,
  Printer,
  Check,
  X,
  Search,
  Eye,
  Download,
  Calendar,
  Building,
  Layers,
  Sparkles
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/format';

export default function QuotationsPage() {
  const {
    quotations,
    addQuotation,
    updateQuotationStatus,
    generateMilestoneInvoices,
    clients,
    events
  } = useERP();

  const [selectedQuotation, setSelectedQuotation] = useState<any | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    clientId: clients[0]?.id || '',
    clientName: clients[0]?.name || 'Rahul Oberoi',
    clientEmail: clients[0]?.email || 'rahul@oberoiglobal.com',
    eventId: events[0]?.id || '',
    eventTitle: events[0]?.title || 'The Royal Oberoi Grand Wedding & Sangeet',
    issueDate: new Date().toISOString().split('T')[0],
    validUntil: '2026-12-31',
    subtotal: 3500000,
    taxRate: 18,
    taxAmount: 630000,
    discount: 50000,
    totalAmount: 4080000,
    status: 'draft' as const,
    items: [
      {
        id: '1',
        description: 'Sound, Intelligent Rigging, Moving Heads & LED Video Wall',
        quantity: 1,
        unitPrice: 1500000,
        amount: 1500000
      },
      {
        id: '2',
        description: 'Floral Decor, Mandap Conceptualization & Crystal Chandeliers',
        quantity: 1,
        unitPrice: 2000000,
        amount: 2000000
      }
    ]
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addQuotation(formData);
    setIsCreateModalOpen(false);
    setSuccessBanner('Proposal created successfully as draft.');
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleGenerateMilestones = (quoteId: string) => {
    const invs = generateMilestoneInvoices(quoteId);
    setSuccessBanner(`Successfully generated ${invs.length} structured milestone invoices (50% / 40% / 10%) in the accounts ledger.`);
    setTimeout(() => setSuccessBanner(null), 5000);
    if (selectedQuotation && selectedQuotation.id === quoteId) {
      setSelectedQuotation({ ...selectedQuotation, milestonesGenerated: true });
    }
  };

  const filteredQuotations = quotations.filter(q =>
    q.quotationNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Proposals & Quotations"
        description="Itemized commercial scopes of work, 18% GST calculations, client approval tracking, and 1-click milestone invoice generation."
        badge={
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
            {quotations.length} Quotations
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <div className="w-52">
              <Input
                placeholder="Search quotations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-3.5 h-3.5" />}
              />
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              New Proposal
            </Button>
          </div>
        }
      />

      {successBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-emerald-600 hover:text-emerald-900 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Quotations Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200/80 text-zinc-500 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Quotation #</th>
                <th className="py-3 px-4">Client & Event</th>
                <th className="py-3 px-4">Date Issued</th>
                <th className="py-3 px-4">Subtotal</th>
                <th className="py-3 px-4">18% GST</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Billing Schedule</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {filteredQuotations.map((q) => (
                <tr key={q.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-zinc-900">{q.quotationNo}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-zinc-900">{q.clientName}</p>
                    <p className="text-[11px] text-zinc-500 truncate max-w-xs">{q.eventTitle}</p>
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-500 text-[11px]">{q.issueDate}</td>
                  <td className="py-3 px-4 font-mono text-zinc-600">₹{formatCurrency(q.subtotal)}</td>
                  <td className="py-3 px-4 font-mono text-zinc-500 text-[11px]">₹{formatCurrency(q.taxAmount)}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-zinc-950">₹{formatCurrency(q.totalAmount)}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        q.status === 'approved'
                          ? 'success'
                          : q.status === 'sent'
                          ? 'info'
                          : q.status === 'rejected'
                          ? 'danger'
                          : 'neutral'
                      }
                      dot
                    >
                      {q.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    {q.milestonesGenerated ? (
                      <Badge variant="success">Milestones Invoiced</Badge>
                    ) : q.status === 'approved' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[11px] h-7 bg-amber-50/60 border-amber-200 text-amber-900 hover:bg-amber-100/70"
                        onClick={() => handleGenerateMilestones(q.id)}
                        icon={<Layers className="w-3 h-3 text-amber-600" />}
                      >
                        Generate Milestones
                      </Button>
                    ) : (
                      <span className="text-[11px] text-zinc-400 font-mono">Requires approval</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedQuotation(q)}
                      icon={<Eye className="w-3.5 h-3.5" />}
                    >
                      View
                    </Button>

                    {q.status === 'draft' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuotationStatus(q.id, 'sent')}
                      >
                        Send
                      </Button>
                    )}
                    {q.status === 'sent' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => updateQuotationStatus(q.id, 'approved')}
                      >
                        Approve
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quotation Detail / Print View Modal */}
      {selectedQuotation && (
        <Modal
          isOpen={!!selectedQuotation}
          onClose={() => setSelectedQuotation(null)}
          title={`Quotation ${selectedQuotation.quotationNo}`}
          description={`Issued to ${selectedQuotation.clientName} for ${selectedQuotation.eventTitle}`}
          maxWidth="2xl"
          footer={
            <>
              {selectedQuotation.status === 'approved' && !selectedQuotation.milestonesGenerated && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleGenerateMilestones(selectedQuotation.id)}
                  icon={<Layers className="w-3.5 h-3.5" />}
                >
                  Generate Milestones (50% / 40% / 10%)
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                icon={<Printer className="w-3.5 h-3.5" />}
              >
                Print / PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedQuotation(null)}>
                Close
              </Button>
            </>
          }
        >
          <div className="space-y-5 text-xs text-zinc-800">
            <div className="flex justify-between items-start pb-4 border-b border-zinc-100">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400">Client Info</span>
                <p className="font-semibold text-zinc-900 text-sm mt-0.5">{selectedQuotation.clientName}</p>
                <p className="text-zinc-500">{selectedQuotation.clientEmail}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-zinc-400">Validity</span>
                <p className="font-mono text-zinc-900 mt-0.5">Valid Until: {selectedQuotation.validUntil}</p>
                <p className="text-zinc-500">Date: {selectedQuotation.issueDate}</p>
                <div className="mt-1">
                  <Badge variant={selectedQuotation.status === 'approved' ? 'success' : 'neutral'}>
                    Status: {selectedQuotation.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Scope Items */}
            <div className="border border-zinc-200/80 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-zinc-50 border-b border-zinc-200/60 font-mono text-[10px] uppercase text-zinc-500">
                  <tr>
                    <th className="p-2.5">Scope Description</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Unit Price</th>
                    <th className="p-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {selectedQuotation.items.map((item: any, i: number) => (
                    <tr key={i}>
                      <td className="p-2.5 text-zinc-900">{item.description}</td>
                      <td className="p-2.5 text-center font-mono">{item.quantity}</td>
                      <td className="p-2.5 text-right font-mono">₹{formatCurrency(item.unitPrice)}</td>
                      <td className="p-2.5 text-right font-mono font-medium text-zinc-900">₹{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Math Breakdown */}
            <div className="flex justify-end">
              <div className="w-64 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal:</span>
                  <span>₹{formatCurrency(selectedQuotation.subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>18% GST:</span>
                  <span>₹{formatCurrency(selectedQuotation.taxAmount)}</span>
                </div>
                {selectedQuotation.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount:</span>
                    <span>-₹{formatCurrency(selectedQuotation.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-zinc-950 pt-2 border-t border-zinc-200 text-sm">
                  <span>Grand Total:</span>
                  <span>₹{formatCurrency(selectedQuotation.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Structured Milestones Explanation */}
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs space-y-1">
              <p className="font-semibold text-zinc-900 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-zinc-600" />
                Standard 3-Stage Milestone Billing Structure
              </p>
              <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px] text-zinc-600">
                <div className="p-2 bg-white rounded border border-zinc-200/60">
                  <span className="font-semibold text-zinc-900 block">Stage 1: 50%</span>
                  Advance token to book dates & lock venue.
                </div>
                <div className="p-2 bg-white rounded border border-zinc-200/60">
                  <span className="font-semibold text-zinc-900 block">Stage 2: 40%</span>
                  Production & setup advance due 14 days before.
                </div>
                <div className="p-2 bg-white rounded border border-zinc-200/60">
                  <span className="font-semibold text-zinc-900 block">Stage 3: 10%</span>
                  Post-event reconciliation & settlement.
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* New Proposal Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Draft Commercial Proposal"
        description="Compose an itemized quotation with 18% GST calculation."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreate}>
              Save Proposal
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Select Client"
              value={formData.clientName}
              onChange={(e) => {
                const c = clients.find(cl => cl.name === e.target.value);
                setFormData({
                  ...formData,
                  clientId: c?.id || '',
                  clientName: e.target.value,
                  clientEmail: c?.email || ''
                });
              }}
            >
              {clients.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </Select>

            <Select
              label="Associated Production Event"
              value={formData.eventTitle}
              onChange={(e) => {
                const ev = events.find(event => event.title === e.target.value);
                setFormData({
                  ...formData,
                  eventId: ev?.id || '',
                  eventTitle: e.target.value
                });
              }}
            >
              {events.map(ev => (
                <option key={ev.id} value={ev.title}>{ev.title}</option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Issue Date"
              type="date"
              value={formData.issueDate}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
            />
            <Input
              label="Validity Expiry"
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Subtotal (₹)"
              type="number"
              value={formData.subtotal}
              onChange={(e) => {
                const sub = Number(e.target.value);
                const tax = Math.round(sub * 0.18);
                const total = sub + tax - formData.discount;
                setFormData({ ...formData, subtotal: sub, taxAmount: tax, totalAmount: total });
              }}
            />
            <Input
              label="GST (18%)"
              type="number"
              disabled
              value={formData.taxAmount}
            />
            <Input
              label="Discount (₹)"
              type="number"
              value={formData.discount}
              onChange={(e) => {
                const disc = Number(e.target.value);
                const total = formData.subtotal + formData.taxAmount - disc;
                setFormData({ ...formData, discount: disc, totalAmount: total });
              }}
            />
          </div>

          <div className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-lg flex items-center justify-between font-mono text-xs">
            <span className="font-semibold text-zinc-900">Calculated Total:</span>
            <span className="font-bold text-zinc-950 text-sm">₹{formatCurrency(formData.totalAmount)}</span>
          </div>
        </form>
      </Modal>
    </div>
  );
}
