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
  ArrowRight,
  Search,
  Filter,
  Users,
  Check,
  ChevronRight
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/format';

const STAGES: { key: LeadStage; label: string }[] = [
  { key: 'new', label: 'New Inquiries' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'qualified', label: 'Qualified' },
  { key: 'proposal_sent', label: 'Proposal Sent' },
  { key: 'negotiating', label: 'Negotiating' },
  { key: 'converted', label: 'Converted' },
  { key: 'lost', label: 'Lost' }
];

export default function LeadsPage() {
  const { leads, addLead, updateLeadStage, convertLead } = useERP();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conversionSuccess, setConversionSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
    setConversionSuccess(`Converted to Client "${result.client.name}" & Event "${result.event.title}"`);
    setTimeout(() => setConversionSuccess(null), 5000);
  };

  const totalPipelineBudget = leads
    .filter(l => l.stage !== 'lost')
    .reduce((acc, l) => acc + l.estimatedBudget, 0);

  const filteredLeads = leads.filter(l =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.eventType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="CRM Pipeline"
        description="Multi-stage commercial deal progression from first inquiry to closed contract."
        badge={
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
            ₹{(totalPipelineBudget / 100000).toFixed(1)}L Pipeline
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <div className="w-52">
              <Input
                placeholder="Search leads..."
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
              New Inquiry
            </Button>
          </div>
        }
      />

      {/* Conversion Banner */}
      {conversionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{conversionSuccess}</span>
          </div>
        </div>
      )}

      {/* 7-Stage Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1400px]">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter(l => l.stage === stage.key);
            const stageBudget = stageLeads.reduce((acc, l) => acc + l.estimatedBudget, 0);

            return (
              <div
                key={stage.key}
                className="w-80 shrink-0 bg-zinc-50/60 rounded-xl border border-zinc-200/80 p-3 flex flex-col max-h-[calc(100vh-14rem)]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-200/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-900 tracking-tight">
                      {stage.label}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white text-zinc-600 border border-zinc-200">
                      {stageLeads.length}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500 font-medium">
                    ₹{(stageBudget / 100000).toFixed(1)}L
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white rounded-lg border border-zinc-200/80 p-3 shadow-2xs hover:border-zinc-300 transition-colors space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-zinc-900 leading-snug">
                          {lead.title}
                        </h4>
                        <Badge
                          variant={lead.priority === 'urgent' ? 'danger' : lead.priority === 'high' ? 'warning' : 'neutral'}
                          dot
                          className="shrink-0"
                        >
                          {lead.priority}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-[11px] text-zinc-500">
                        <p className="font-medium text-zinc-700">{lead.clientName}</p>
                        <p className="text-zinc-400">{lead.eventType} &bull; {lead.guestCount} guests</p>
                        <div className="flex items-center gap-1 font-mono text-zinc-400">
                          <Calendar className="w-3 h-3" />
                          <span>{lead.eventDate}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-zinc-950">
                          ₹{formatCurrency(lead.estimatedBudget)}
                        </span>
                        <span className="text-[10px] text-zinc-400">{lead.assignedTo}</span>
                      </div>

                      {/* Stage Move Controls & Convert */}
                      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-1.5">
                        <select
                          value={lead.stage}
                          onChange={(e) => updateLeadStage(lead.id, e.target.value as LeadStage)}
                          className="text-[10px] bg-zinc-50 border border-zinc-200 rounded px-1.5 py-1 text-zinc-700 focus:outline-none"
                        >
                          {STAGES.map(s => (
                            <option key={s.key} value={s.key}>{s.label}</option>
                          ))}
                        </select>

                        {lead.stage !== 'converted' && lead.stage !== 'lost' && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="text-[10px] h-6 px-2"
                            onClick={() => handleConvert(lead)}
                          >
                            Convert
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="h-24 border border-dashed border-zinc-200 rounded-lg flex items-center justify-center text-zinc-400 text-[11px]">
                      No leads in {stage.label.toLowerCase()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Lead Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Commercial Inquiry"
        description="Add a new lead to the CRM sales pipeline."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateLead}>
              Create Lead
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateLead} className="space-y-3.5">
          <Input
            label="Inquiry / Deal Title"
            required
            placeholder="e.g. Sangeet & Reception Staging"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Client Name"
              required
              placeholder="e.g. Rohit Singhania"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            />
            <Input
              label="Company (Optional)"
              placeholder="e.g. Singhania Group"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email Address"
              type="email"
              placeholder="rohit@singhania.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Phone Number"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Event Type"
              value={formData.eventType}
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
            >
              <option value="Luxury Wedding">Luxury Wedding</option>
              <option value="Corporate Summit">Corporate Summit</option>
              <option value="Music Concert">Music Concert</option>
              <option value="Award Gala">Award Gala</option>
              <option value="Private Celebration">Private Celebration</option>
            </Select>

            <Select
              label="Initial Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Est. Budget (₹)"
              type="number"
              value={formData.estimatedBudget}
              onChange={(e) => setFormData({ ...formData, estimatedBudget: Number(e.target.value) })}
            />
            <Input
              label="Expected Guests"
              type="number"
              value={formData.guestCount}
              onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
            />
            <Input
              label="Target Date"
              type="date"
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Assigned Executive"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            />
            <Input
              label="Lead Source"
              placeholder="e.g. Website, Referral, Instagram"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
