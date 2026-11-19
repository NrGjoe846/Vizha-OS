'use client';

import React, { useState } from 'react';
import { useERP } from '@/lib/store';
import { LeadStage, Lead } from '@/lib/types';
import {
  Kanban,
  Plus,
  Phone,
  Mail,
  Calendar,
  Building,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Users
} from 'lucide-react';

const STAGES: { key: LeadStage; label: string; color: string }[] = [
  { key: 'new', label: 'New Inquiries', color: 'border-blue-400 bg-blue-50/50' },
  { key: 'contacted', label: 'Contacted', color: 'border-cyan-400 bg-cyan-50/50' },
  { key: 'qualified', label: 'Qualified Scope', color: 'border-indigo-400 bg-indigo-50/50' },
  { key: 'proposal_sent', label: 'Proposal Sent', color: 'border-amber-400 bg-amber-50/50' },
  { key: 'negotiating', label: 'Negotiating', color: 'border-purple-400 bg-purple-50/50' },
  { key: 'converted', label: 'Won & Converted', color: 'border-emerald-400 bg-emerald-50/50' },
  { key: 'lost', label: 'Closed / Lost', color: 'border-slate-300 bg-slate-50/50' }
];

export default function LeadsPage() {
  const { leads, addLead, updateLeadStage, convertLead } = useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conversionSuccess, setConversionSuccess] = useState<string | null>(null);

  // New Lead form state
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    companyName: '',
    email: '',
    phone: '',
    eventType: 'Luxury Wedding',
    estimatedBudget: 5000000,
    guestCount: 350,
    eventDate: '2026-12-25',
    source: 'Website',
    priority: 'high' as 'low' | 'medium' | 'high' | 'urgent',
    stage: 'new' as LeadStage,
    assignedTo: 'Rajesh Verma',
    notes: ''
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    addLead(formData);
    setIsModalOpen(false);
    setFormData({
      title: '',
      clientName: '',
      companyName: '',
      email: '',
      phone: '',
      eventType: 'Luxury Wedding',
      estimatedBudget: 5000000,
      guestCount: 350,
      eventDate: '2026-12-25',
      source: 'Website',
      priority: 'high',
      stage: 'new',
      assignedTo: 'Rajesh Verma',
      notes: ''
    });
  };

  const handleConvert = (lead: Lead) => {
    const result = convertLead(lead.id);
    setConversionSuccess(`Lead converted successfully! Registered Client "${result.client.name}" and Production Event "${result.event.title}" (${result.event.code}).`);
    setTimeout(() => setConversionSuccess(null), 6000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">CRM & Lead Pipeline</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              {leads.length} Opportunities
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track client inquiries through discovery, qualification, quotation approval, and 1-click conversion to live productions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Lead Inquiry</span>
        </button>
      </div>

      {/* Conversion Banner Alert */}
      {conversionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl flex items-center gap-3 animate-in fade-in duration-200 shadow-sm">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold flex-1">{conversionSuccess}</p>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 overflow-x-auto pb-6">
        {STAGES.map((col) => {
          const colLeads = leads.filter(l => l.stage === col.key);
          const colValue = colLeads.reduce((acc, l) => acc + l.estimatedBudget, 0);

          return (
            <div
              key={col.key}
              className={`rounded-2xl border flex flex-col min-w-[240px] max-w-xs shadow-xs p-3 ${col.color}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 mb-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{col.label}</h3>
                  <span className="text-[10px] text-slate-500 font-semibold">₹{(colValue / 100000).toFixed(1)}L</span>
                </div>
                <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-white text-slate-700 border border-slate-200 shadow-xs">
                  {colLeads.length}
                </span>
              </div>

              {/* Cards in this stage */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                        lead.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : lead.priority === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {lead.priority}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{lead.source}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{lead.title}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 font-medium">{lead.clientName}</p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Budget:</span>
                      <span className="font-bold text-slate-900">₹{(lead.estimatedBudget / 100000).toFixed(1)}L</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span>Guests: {lead.guestCount}</span>
                      <span>{lead.eventType}</span>
                    </div>

                    {/* Stage Selector / Action */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <select
                        value={lead.stage}
                        onChange={(e) => updateLeadStage(lead.id, e.target.value as LeadStage)}
                        className="text-[10px] font-medium bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-slate-700 outline-none hover:bg-slate-100"
                      >
                        {STAGES.map((s) => (
                          <option key={s.key} value={s.key}>
                            {s.label}
                          </option>
                        ))}
                      </select>

                      {lead.stage !== 'converted' && lead.stage !== 'lost' && (
                        <button
                          onClick={() => handleConvert(lead)}
                          title="Convert to Client & Confirmed Event"
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold shadow-xs transition-colors flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Convert</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {colLeads.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs italic">
                    No leads in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create New Lead */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-lg font-bold text-slate-900">Log New Lead Inquiry</h2>
            <p className="text-xs text-slate-500 mt-0.5">Enter prospective client & event details for pipeline tracking</p>

            <form onSubmit={handleCreateLead} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry / Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3-Day Luxury Wedding & Reception"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Client Contact Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Oberoi"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Family Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Oberoi Enterprises"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="client@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98200 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Event Type</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Luxury Wedding">Luxury Wedding</option>
                    <option value="Corporate Summit">Corporate Summit</option>
                    <option value="Music Festival">Music Festival</option>
                    <option value="Product Launch">Product Launch</option>
                    <option value="Milestone Gala">Milestone Gala</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Budget (₹)</label>
                  <input
                    type="number"
                    value={formData.estimatedBudget}
                    onChange={(e) => setFormData({ ...formData, estimatedBudget: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Guest Count</label>
                  <input
                    type="number"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Website">Website Form</option>
                    <option value="Referral">Client Referral</option>
                    <option value="Social Media">Instagram / LinkedIn</option>
                    <option value="Cold Call">Cold Call / Sales</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Requirement Notes</label>
                <textarea
                  rows={2}
                  placeholder="Special client requests, venue preferences, theme notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
