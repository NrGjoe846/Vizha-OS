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
  DollarSign,
  ArrowRight,
  Building
} from 'lucide-react';

export default function InvoicesPage() {
  const { invoices, addInvoice, recordPayment, clients, events } = useERP();
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Billing & GST Tax Invoices</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              18% GST Compliant
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise invoicing, CGST/SGST breakdown, partial payments, and printable tax receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-200 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 no-print">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Invoiced (Inc. 18% GST)</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">₹{totalBilled.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-400 mt-1">{invoices.length} Registered Tax Invoices</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payments Collected</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-2">₹{totalReceived.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-400 mt-1">Disbursed via RTGS / Corporate IMPS</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Receivables Pending</span>
          <p className="text-2xl font-extrabold text-rose-600 mt-2">₹{totalDue.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Balance due from clients</p>
        </div>
      </div>

      {/* Invoice Detail / Print Preview if selected */}
      {selectedInvoice && (
        <div className="bg-white rounded-2xl border-2 border-indigo-200 p-8 shadow-xl relative animate-in fade-in duration-200 print-card">
          <div className="flex items-center justify-between pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900">EventFlow ERP Solutions Pvt. Ltd.</span>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  ORIGINAL FOR RECIPIENT
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Level 12, Tower B, Bandra Kurla Complex (BKC), Mumbai 400051 &bull; GSTIN: 27AABCE9988D1Z2
              </p>
            </div>

            <div className="flex items-center gap-2 no-print">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>

          {/* Invoice Header Details */}
          <div className="grid grid-cols-2 gap-8 my-6 text-xs">
            <div>
              <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">BILLED TO CLIENT:</p>
              <h4 className="text-sm font-bold text-slate-900 mt-1">{selectedInvoice.clientName}</h4>
              <p className="text-slate-600 mt-0.5">{selectedInvoice.clientEmail}</p>
              {selectedInvoice.clientGstin && (
                <p className="text-slate-700 font-mono font-semibold mt-1">Client GSTIN: {selectedInvoice.clientGstin}</p>
              )}
            </div>

            <div className="text-right">
              <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">TAX INVOICE DETAILS:</p>
              <h4 className="text-sm font-mono font-extrabold text-indigo-700 mt-1">{selectedInvoice.invoiceNo}</h4>
              <p className="text-slate-600 mt-0.5">Issue Date: {selectedInvoice.issueDate}</p>
              <p className="text-slate-600">Due Date: {selectedInvoice.dueDate}</p>
              <p className="text-slate-800 font-semibold mt-1">Event: {selectedInvoice.eventTitle}</p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-xs text-left my-6 border border-slate-200">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                <th className="py-2.5 px-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedInvoice.items.map((item: any, i: number) => (
                <tr key={i}>
                  <td className="py-3 px-3 font-medium text-slate-900">{item.description}</td>
                  <td className="py-3 px-3 text-center font-mono">{item.quantity}</td>
                  <td className="py-3 px-3 text-right font-mono">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">
                    ₹{item.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals & GST Summary */}
          <div className="flex justify-end my-6 text-xs">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Subtotal:</span>
                <span className="font-mono font-semibold">₹{selectedInvoice.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST (9.0%):</span>
                <span className="font-mono">₹{(selectedInvoice.taxAmount / 2).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST (9.0%):</span>
                <span className="font-mono">₹{(selectedInvoice.taxAmount / 2).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount Due:</span>
                <span className="font-mono text-indigo-700">₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-700 font-bold">
                <span>Paid to Date:</span>
                <span className="font-mono">₹{selectedInvoice.paidAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs text-rose-700 font-bold pt-1 border-t border-slate-100">
                <span>Balance Payable:</span>
                <span className="font-mono">₹{selectedInvoice.balanceDue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Payment History */}
          {selectedInvoice.payments.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Disbursement Receipts:</h5>
              <div className="space-y-1.5 text-xs">
                {selectedInvoice.payments.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between p-2 rounded bg-slate-50 text-slate-700 font-mono text-[11px]">
                    <span>Ref: {p.referenceNo} ({p.paymentMethod}) on {p.paymentDate}</span>
                    <span className="font-bold text-emerald-700">₹{p.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Invoices List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden no-print">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">All Registered Tax Invoices</h2>
          <span className="text-xs text-slate-500">{invoices.length} Invoices</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice No</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Production Event</th>
                <th className="py-3 px-4 text-right">Taxable Amount</th>
                <th className="py-3 px-4 text-right">Total (18% GST)</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{inv.invoiceNo}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-900">{inv.clientName}</p>
                    <p className="text-[10px] text-slate-400">{inv.clientEmail}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium truncate max-w-[200px]">{inv.eventTitle}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-700">₹{inv.subtotal.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">₹{inv.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-600">₹{inv.balanceDue.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      inv.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : inv.status === 'partial'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold transition-colors"
                      >
                        Preview / Print
                      </button>
                      {inv.balanceDue > 0 && (
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setIsPaymentModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold shadow-xs transition-colors"
                        >
                          Record Payment
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Record Partial Payment */}
      {isPaymentModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900">Record Payment Disbursement</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Invoice #{selectedInvoice.invoiceNo} &bull; Balance Due: ₹{selectedInvoice.balanceDue.toLocaleString('en-IN')}
            </p>

            <form onSubmit={handleRecordPayment} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Received Amount (₹) *</label>
                <input
                  type="number"
                  max={selectedInvoice.balanceDue}
                  required
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="RTGS / Bank Transfer">RTGS / Bank Transfer</option>
                  <option value="Corporate IMPS / NEFT">Corporate IMPS / NEFT</option>
                  <option value="UPI QR Payment">UPI QR Payment</option>
                  <option value="Corporate Credit Card">Corporate Credit Card</option>
                  <option value="Account Payee Cheque">Account Payee Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Reference / UTR Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC26111899120"
                  value={paymentData.referenceNo}
                  onChange={(e) => setPaymentData({ ...paymentData, referenceNo: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                >
                  Confirm & Update Balance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Invoice */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900">Generate 18% GST Tax Invoice</h2>

            <form onSubmit={handleCreateInvoice} className="space-y-3.5 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Client Profile</label>
                  <select
                    value={invoiceData.clientName}
                    onChange={(e) => {
                      const sel = clients.find(c => c.name === e.target.value);
                      setInvoiceData({
                        ...invoiceData,
                        clientName: e.target.value,
                        clientEmail: sel?.email || '',
                        clientGstin: sel?.gstin || ''
                      });
                    }}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Production Event</label>
                  <select
                    value={invoiceData.eventTitle}
                    onChange={(e) => setInvoiceData({ ...invoiceData, eventTitle: e.target.value })}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {events.map(ev => (
                      <option key={ev.id} value={ev.title}>{ev.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Taxable Subtotal (₹) *</label>
                <input
                  type="number"
                  required
                  value={invoiceData.subtotal}
                  onChange={(e) => {
                    const sub = Number(e.target.value);
                    const tax = Math.round(sub * 0.18);
                    setInvoiceData({
                      ...invoiceData,
                      subtotal: sub,
                      taxAmount: tax,
                      totalAmount: sub + tax,
                      items: [
                        {
                          id: '1',
                          description: 'Turnkey Event Deliverables & Services',
                          quantity: 1,
                          unitPrice: sub,
                          amount: sub
                        }
                      ]
                    });
                  }}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                <span>18% GST (CGST 9% + SGST 9%):</span>
                <span className="font-mono font-bold text-slate-900">₹{invoiceData.taxAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs flex items-center justify-between">
                <span className="font-bold text-indigo-900">Total Invoice Amount:</span>
                <span className="font-mono font-extrabold text-indigo-700">₹{invoiceData.totalAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
                >
                  Issue Tax Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
