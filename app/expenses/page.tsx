'use client';

import React, { useState } from 'react';
import { useERP } from '@/lib/store';
import {
  CreditCard,
  Plus,
  Check,
  X,
  Search,
  Filter,
  DollarSign,
  TrendingDown
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { StatCard } from '@/components/ui/StatCard';

export default function ExpensesPage() {
  const { expenses, addExpense, updateExpenseStatus, events } = useERP();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
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

  const totalSpent = expenses.reduce((acc, e) => acc + (e.status === 'approved' ? e.amount : 0), 0);
  const pendingSpent = expenses.reduce((acc, e) => acc + (e.status === 'pending' ? e.amount : 0), 0);

  const categories = [
    { id: 'all', label: 'All Expenses', count: expenses.length },
    { id: 'Audio & Visual', label: 'Sound & AV' },
    { id: 'Floral & Decor', label: 'Décor & Floral' },
    { id: 'Catering & F&B', label: 'Catering' },
    { id: 'Licensing & Permits', label: 'Licensing' },
  ];

  const filteredExpenses = expenses.filter(e => {
    const matchesCategory = filterCategory === 'all' || e.category === filterCategory;
    const matchesSearch =
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.eventTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Budgets & Expenses"
        description="Direct production disbursements, vendor advances, staging hires, municipal NOC licenses, and approvals."
        badge={
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
            {expenses.length} Records
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <div className="w-52">
              <Input
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-3.5 h-3.5" />}
              />
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Log Expense
            </Button>
          </div>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Approved Production Spend"
          value={`₹${(totalSpent).toLocaleString()}`}
          changeType="neutral"
          icon={<CreditCard className="w-4 h-4" />}
          description="Disbursed and approved vendor outlays"
        />
        <StatCard
          label="Pending Approvals"
          value={`₹${(pendingSpent).toLocaleString()}`}
          changeType="negative"
          icon={<TrendingDown className="w-4 h-4" />}
          description="Awaiting project director sign-off"
        />
      </div>

      {/* Filter Tabs */}
      <Tabs
        items={categories}
        activeId={filterCategory}
        onChange={setFilterCategory}
      />

      {/* Expenses Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200/80 text-zinc-500 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Production Event</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Vendor Payee</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-zinc-500 text-[11px]">{exp.expenseDate}</td>
                  <td className="py-3 px-4 font-medium text-zinc-900 truncate max-w-xs">{exp.eventTitle}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-700">{exp.description}</td>
                  <td className="py-3 px-4 text-zinc-500">{exp.vendorName}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-zinc-950">₹{exp.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        exp.status === 'approved'
                          ? 'success'
                          : exp.status === 'pending'
                          ? 'warning'
                          : 'danger'
                      }
                      dot
                    >
                      {exp.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    {exp.status === 'pending' ? (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          className="h-6 px-2 text-[10px]"
                          onClick={() => updateExpenseStatus(exp.id, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-[10px] text-rose-600"
                          onClick={() => updateExpenseStatus(exp.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <span className="text-[11px] text-zinc-400 font-mono">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Log Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Production Expense"
        description="Record an operational disbursement or vendor bill."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreate}>
              Save Expense
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-3.5">
          <Select
            label="Production Event"
            value={formData.eventId}
            onChange={(e) => {
              const ev = events.find(item => item.id === e.target.value);
              setFormData({
                ...formData,
                eventId: e.target.value,
                eventTitle: ev?.title || ''
              });
            }}
          >
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>{ev.title}</option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Expense Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Audio & Visual">Audio & Visual</option>
              <option value="Floral & Decor">Floral & Decor</option>
              <option value="Catering & F&B">Catering & F&B</option>
              <option value="Licensing & Permits">Licensing & Permits</option>
              <option value="Security & Gate Logistics">Security & Gate</option>
              <option value="Artist & Entertainment">Artist & Entertainment</option>
            </Select>

            <Input
              label="Disbursement Date"
              type="date"
              value={formData.expenseDate}
              onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
            />
          </div>

          <Input
            label="Line Item Description"
            required
            placeholder="e.g. Line array rigging & moving head hire advance"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Vendor / Payee Entity"
              placeholder="e.g. Aura Pro Audio & Rigging"
              value={formData.vendorName}
              onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
            />
            <Input
              label="Amount (₹)"
              type="number"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
