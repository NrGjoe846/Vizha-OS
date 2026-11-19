'use client';

import React, { useState } from 'react';
import { useERP } from '@/lib/store';
import {
  Wallet,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  DollarSign,
  TrendingDown
} from 'lucide-react';

export default function ExpensesPage() {
  const { expenses, addExpense, updateExpenseStatus, events } = useERP();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    eventId: events[0]?.id || 'evt-2026-001',
    eventTitle: events[0]?.title || 'The Royal Oberoi Grand Wedding',
    category: 'Audio & Visual',
    description: '',
    amount: 150000,
    vendorName: 'SoundCraft Pro Audio & Visuals',
    status: 'approved' as const,
    expenseDate: new Date().toISOString().split('T')[0]
  });

  const filteredExpenses = filterCategory === 'all'
    ? expenses
    : expenses.filter(e => e.category === filterCategory);

  const totalSpent = expenses.reduce((acc, e) => acc + (e.status === 'approved' ? e.amount : 0), 0);
  const pendingSpent = expenses.reduce((acc, e) => acc + (e.status === 'pending' ? e.amount : 0), 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Budgets & Expense Tracking</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              {expenses.length} Expense Items
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Vendor advances, equipment hire, municipal NOC licensing, and operational disbursement logs.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Log Direct Expense</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Approved Production Spend</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">₹{totalSpent.toLocaleString('en-IN')}</p>
            <p className="text-xs text-slate-400 mt-1">Cleared by Finance Team</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Approvals</span>
            <p className="text-2xl font-extrabold text-amber-600 mt-2">₹{pendingSpent.toLocaleString('en-IN')}</p>
            <p className="text-xs text-slate-400 mt-1">Awaiting Lead Accountant Sign-off</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Production Event</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Vendor / Payee</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 text-slate-500">{exp.expenseDate}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{exp.description}</td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-[200px] truncate">{exp.eventTitle}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">{exp.vendorName}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      exp.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : exp.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {exp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {exp.status === 'pending' && (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => updateExpenseStatus(exp.id, 'approved')}
                          className="p-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          title="Approve"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateExpenseStatus(exp.id, 'rejected')}
                          className="p-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Expense */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900">Record Direct Event Expense</h2>

            <form onSubmit={handleCreate} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Production Event</label>
                <select
                  value={formData.eventTitle}
                  onChange={(e) => {
                    const sel = events.find(ev => ev.title === e.target.value);
                    setFormData({
                      ...formData,
                      eventTitle: e.target.value,
                      eventId: sel?.id || 'evt-2026-001'
                    });
                  }}
                  className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  {events.map(ev => (
                    <option key={ev.id} value={ev.title}>{ev.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expense Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Police Sound NOC & Decibel Clearance Fee"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Audio & Visual">Audio & Visual</option>
                    <option value="Floral & Decor">Floral & Decor</option>
                    <option value="Catering & Bar">Catering & Bar</option>
                    <option value="Licensing & NOC">Licensing & NOC</option>
                    <option value="Logistics & Fleet">Logistics & Fleet</option>
                    <option value="Security">Security</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vendor / Payee</label>
                <input
                  type="text"
                  placeholder="e.g. Municipal Police Department"
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
