'use client';

import React, { useState } from 'react';
import { useERP } from '@/lib/store';
import {
  FileSpreadsheet,
  Plus,
  Printer,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function QuotationsPage() {
  const { quotations, addQuotation, updateQuotationStatus, clients, events } = useERP();
  const [selectedQuotation, setSelectedQuotation] = useState<any | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    clientName: clients[0]?.name || 'Rahul Oberoi',
    clientEmail: clients[0]?.email || 'rahul@oberoiglobal.com',
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
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Proposals & Quotations</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              {quotations.length} Proposals
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build itemized event proposals, calculate 18% GST deliverables, and export printable scopes of work.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Quotation</span>
        </button>
      </div>

      {/* Printable Preview */}
      {selectedQuotation && (
        <div className="bg-white rounded-2xl border-2 border-indigo-200 p-8 shadow-xl relative animate-in fade-in duration-200 print-card">
          <div className="flex items-center justify-between pb-6 border-b border-slate-200">
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900">EventFlow ERP &bull; Event Proposal</span>
              <p className="text-xs text-slate-500 mt-1">Comprehensive production quotation with 18% GST estimate</p>
            </div>
            <div className="flex items-center gap-2 no-print">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Proposal</span>
              </button>
              <button
                onClick={() => setSelectedQuotation(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 my-6 text-xs">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PROPOSAL FOR:</p>
              <h4 className="text-sm font-bold text-slate-900 mt-1">{selectedQuotation.clientName}</h4>
              <p className="text-slate-600">{selectedQuotation.clientEmail}</p>
              <p className="text-slate-800 font-semibold mt-2">Production: {selectedQuotation.eventTitle}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">QUOTATION REF:</p>
              <h4 className="text-sm font-mono font-extrabold text-indigo-700 mt-1">{selectedQuotation.quotationNo}</h4>
              <p className="text-slate-600 mt-0.5">Issue Date: {selectedQuotation.issueDate}</p>
              <p className="text-slate-600">Valid Until: {selectedQuotation.validUntil}</p>
            </div>
          </div>

          <table className="w-full text-xs text-left my-6 border border-slate-200">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Scope Item Description</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                <th className="py-2.5 px-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedQuotation.items.map((item: any, i: number) => (
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

          <div className="flex justify-end my-6 text-xs">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Scope Deliverables Subtotal:</span>
                <span className="font-mono font-semibold">₹{selectedQuotation.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Client Discount Applied:</span>
                <span className="font-mono">-₹{selectedQuotation.discount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (18% Applicable):</span>
                <span className="font-mono">₹{selectedQuotation.taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total Estimate:</span>
                <span className="font-mono text-indigo-700">₹{selectedQuotation.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quotation Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Quotation #</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Event Target</th>
                <th className="py-3 px-4 text-right">Taxable Subtotal</th>
                <th className="py-3 px-4 text-right">Estimate (18% GST)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotations.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{q.quotationNo}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-900">{q.clientName}</p>
                    <p className="text-[10px] text-slate-400">{q.clientEmail}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium truncate max-w-[200px]">{q.eventTitle}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-600">₹{q.subtotal.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">₹{q.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4">
                    <select
                      value={q.status}
                      onChange={(e) => updateQuotationStatus(q.id, e.target.value as any)}
                      className="text-[10px] font-bold uppercase rounded px-2 py-0.5 border border-slate-200 bg-slate-50 text-slate-700"
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setSelectedQuotation(q)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold transition-colors"
                    >
                      Preview / Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Quotation */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900">Create Production Quotation</h2>

            <form onSubmit={handleCreate} className="space-y-3.5 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Client Profile</label>
                  <select
                    value={formData.clientName}
                    onChange={(e) => {
                      const sel = clients.find(c => c.name === e.target.value);
                      setFormData({
                        ...formData,
                        clientName: e.target.value,
                        clientEmail: sel?.email || ''
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Event</label>
                  <select
                    value={formData.eventTitle}
                    onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    {events.map(ev => (
                      <option key={ev.id} value={ev.title}>{ev.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Taxable Subtotal (₹)</label>
                <input
                  type="number"
                  value={formData.subtotal}
                  onChange={(e) => {
                    const sub = Number(e.target.value);
                    const tax = Math.round(sub * 0.18);
                    setFormData({
                      ...formData,
                      subtotal: sub,
                      taxAmount: tax,
                      totalAmount: sub + tax - formData.discount,
                      items: [
                        {
                          id: '1',
                          description: 'Event Scope Deliverables & Fabrication',
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
                <span>18% GST Estimate:</span>
                <span className="font-mono font-bold text-slate-900">₹{formData.taxAmount.toLocaleString('en-IN')}</span>
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
                  Generate Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
