'use client';

import React, { useState } from 'react';
import { useERP } from '@/lib/store';
import {
  Receipt,
  Plus,
  Printer,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Eye,
  DollarSign
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { StatCard } from '@/components/ui/StatCard';

export default function InvoicesPage() {
  const { invoices, addInvoice, recordPayment, clients, events } = useERP();
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Payment form
  const [paymentData, setPaymentData] = useState({
    amount: 500000,
    paymentMethod: 'RTGS / Bank Transfer',
    referenceNo: 'HDFC261118001'
  });

  // Create invoice form
  const [invoiceData, setInvoiceData] = useState({
    clientName: clients[0]?.name || 'Rahul Oberoi',
    clientEmail: clients[0]?.email || 'rahul@oberoiglobal.com',
    clientGstin: clients[0]?.gstin || '27AABCO1234F1Z8',
    eventTitle: events[0]?.title || 'The Royal Oberoi Grand Wedding',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '2026-12-15',
    subtotal: 1000000,
    taxRate: 18,
    taxAmount: 180000,
    totalAmount: 1180000,
    notes: 'Payment milestone 1: Mobilization advance.',
    items: [
      {
        id: '1',
        description: 'Turnkey Event Production & Vendor Retainer',
        quantity: 1,
        unitPrice: 1000000,
        amount: 1000000
      }
    ]
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    recordPayment(selectedInvoice.id, paymentData);
    setIsPaymentModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    addInvoice(invoiceData);
    setIsCreateModalOpen(false);
  };

  const totalBilled = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalReceived = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalDue = invoices.reduce((acc, i) => acc + i.balanceDue, 0);

  const filteredInvoices = invoices.filter(i =>
    i.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Tax Invoices & GST Billing"
        description="Milestone billing schedules, 18% GST tax invoices, collection tracking, and payment receipts."
        badge={
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
            {invoices.length} Invoices
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <div className="w-52">
              <Input
                placeholder="Search invoices..."
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
              Generate Invoice
            </Button>
          </div>
        }
      />

      {/* Financial Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Billed (with 18% GST)"
          value={`₹${(totalBilled).toLocaleString()}`}
          icon={<Receipt className="w-4 h-4" />}
          description="Cumulative invoice billings"
        />
        <StatCard
          label="Collections Received"
          value={`₹${(totalReceived).toLocaleString()}`}
          changeType="positive"
          icon={<CreditCard className="w-4 h-4" />}
          description="Bank transfers & verified receipts"
        />
        <StatCard
          label="Outstanding Balance Due"
          value={`₹${(totalDue).toLocaleString()}`}
          changeType={totalDue > 0 ? 'negative' : 'positive'}
          icon={<AlertCircle className="w-4 h-4" />}
          description="Pending client remittances"
        />
      </div>

      {/* Invoices Master Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200/80 text-zinc-500 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Client / GSTIN</th>
                <th className="py-3 px-4">Production Event</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Paid</th>
                <th className="py-3 px-4">Balance Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-zinc-900">{inv.invoiceNo}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-zinc-900">{inv.clientName}</p>
                    {inv.clientGstin && (
                      <p className="text-[10px] font-mono text-zinc-400">{inv.clientGstin}</p>
                    )}
                  </td>
                  <td className="py-3 px-4 text-zinc-600 truncate max-w-xs">{inv.eventTitle}</td>
                  <td className="py-3 px-4 font-mono text-zinc-500 text-[11px]">{inv.dueDate}</td>
                  <td className="py-3 px-4 font-mono font-medium text-zinc-950">₹{inv.totalAmount.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono text-emerald-600">₹{inv.paidAmount.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-zinc-900">₹{inv.balanceDue.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        inv.status === 'paid'
                          ? 'success'
                          : inv.status === 'partial'
                          ? 'warning'
                          : 'danger'
                      }
                      dot
                    >
                      {inv.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedInvoice(inv)}
                      icon={<Eye className="w-3.5 h-3.5" />}
                    >
                      View
                    </Button>

                    {inv.status !== 'paid' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setPaymentData({
                            amount: inv.balanceDue,
                            paymentMethod: 'RTGS / Bank Transfer',
                            referenceNo: `REF${Date.now().toString().slice(-6)}`
                          });
                          setIsPaymentModalOpen(true);
                        }}
                      >
                        Pay
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Record Payment Modal */}
      {isPaymentModalOpen && selectedInvoice && (
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title={`Record Payment for ${selectedInvoice.invoiceNo}`}
          description={`Outstanding balance: ₹${selectedInvoice.balanceDue.toLocaleString()}`}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setIsPaymentModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleRecordPayment}>
                Confirm Remittance
              </Button>
            </>
          }
        >
          <form onSubmit={handleRecordPayment} className="space-y-3.5">
            <Input
              label="Payment Amount (₹)"
              type="number"
              max={selectedInvoice.balanceDue}
              value={paymentData.amount}
              onChange={(e) => setPaymentData({ ...paymentData, amount: Number(e.target.value) })}
            />

            <Select
              label="Payment Method"
              value={paymentData.paymentMethod}
              onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
            >
              <option value="RTGS / Bank Transfer">RTGS / Bank Transfer</option>
              <option value="NEFT">NEFT</option>
              <option value="UPI / QR">UPI Instant Remittance</option>
              <option value="Corporate Cheque">Corporate Cheque</option>
            </Select>

            <Input
              label="Bank Reference / UTR Number"
              required
              value={paymentData.referenceNo}
              onChange={(e) => setPaymentData({ ...paymentData, referenceNo: e.target.value })}
            />
          </form>
        </Modal>
      )}

      {/* Invoice Detail / Print Modal */}
      {selectedInvoice && !isPaymentModalOpen && (
        <Modal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          title={`Tax Invoice ${selectedInvoice.invoiceNo}`}
          description={`Issued to ${selectedInvoice.clientName}`}
          maxWidth="2xl"
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                icon={<Printer className="w-3.5 h-3.5" />}
              >
                Print / PDF
              </Button>
              <Button variant="primary" size="sm" onClick={() => setSelectedInvoice(null)}>
                Close
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs text-zinc-800">
            <div className="flex justify-between items-start pb-4 border-b border-zinc-100">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400">Bill To</span>
                <p className="font-semibold text-zinc-900 text-sm mt-0.5">{selectedInvoice.clientName}</p>
                <p className="text-zinc-500">{selectedInvoice.clientEmail}</p>
                {selectedInvoice.clientGstin && (
                  <p className="font-mono text-zinc-500 mt-1">GSTIN: {selectedInvoice.clientGstin}</p>
                )}
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-zinc-400">Invoice Timeline</span>
                <p className="font-mono text-zinc-900 mt-0.5">Date: {selectedInvoice.issueDate}</p>
                <p className="font-mono text-rose-600">Due: {selectedInvoice.dueDate}</p>
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
                  {selectedInvoice.items.map((item: any, i: number) => (
                    <tr key={i}>
                      <td className="p-2.5 text-zinc-900">{item.description}</td>
                      <td className="p-2.5 text-center font-mono">{item.quantity}</td>
                      <td className="p-2.5 text-right font-mono">₹{item.unitPrice.toLocaleString()}</td>
                      <td className="p-2.5 text-right font-mono font-medium text-zinc-900">₹{item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Math Breakdown */}
            <div className="flex justify-end">
              <div className="w-64 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Taxable Value:</span>
                  <span>₹{selectedInvoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>18% GST (CGST+SGST):</span>
                  <span>₹{selectedInvoice.taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-zinc-950 pt-2 border-t border-zinc-200 text-sm">
                  <span>Invoice Total:</span>
                  <span>₹{selectedInvoice.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Amount Paid:</span>
                  <span>₹{selectedInvoice.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-rose-600 font-bold border-t border-zinc-100 pt-1">
                  <span>Balance Due:</span>
                  <span>₹{selectedInvoice.balanceDue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* New Invoice Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Generate Tax Invoice"
        description="Issue an official milestone invoice with 18% GST."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateInvoice}>
              Issue Invoice
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateInvoice} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Billable Client"
              value={invoiceData.clientName}
              onChange={(e) => {
                const c = clients.find(cl => cl.name === e.target.value);
                setInvoiceData({
                  ...invoiceData,
                  clientName: e.target.value,
                  clientEmail: c?.email || '',
                  clientGstin: c?.gstin || ''
                });
              }}
            >
              {clients.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </Select>

            <Select
              label="Production Event"
              value={invoiceData.eventTitle}
              onChange={(e) => setInvoiceData({ ...invoiceData, eventTitle: e.target.value })}
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
              value={invoiceData.issueDate}
              onChange={(e) => setInvoiceData({ ...invoiceData, issueDate: e.target.value })}
            />
            <Input
              label="Due Date"
              type="date"
              value={invoiceData.dueDate}
              onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Taxable Subtotal (₹)"
              type="number"
              value={invoiceData.subtotal}
              onChange={(e) => {
                const sub = Number(e.target.value);
                const tax = Math.round(sub * 0.18);
                setInvoiceData({
                  ...invoiceData,
                  subtotal: sub,
                  taxAmount: tax,
                  totalAmount: sub + tax
                });
              }}
            />
            <Input
              label="GST (18%)"
              type="number"
              disabled
              value={invoiceData.taxAmount}
            />
          </div>

          <div className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-lg flex items-center justify-between font-mono text-xs">
            <span className="font-semibold text-zinc-900">Total Due (incl. GST):</span>
            <span className="font-bold text-zinc-950 text-sm">₹{invoiceData.totalAmount.toLocaleString()}</span>
          </div>
        </form>
      </Modal>
    </div>
  );
}
