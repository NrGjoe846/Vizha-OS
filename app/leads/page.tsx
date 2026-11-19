'use client';

import React, { useState } from 'react';
import { useERP } from '@/lib/store';
import { Lead, LeadStage, CRMLossRecord } from '@/lib/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { CRMStats } from '@/components/crm/CRMStats';
import { CRMKanban } from '@/components/crm/CRMKanban';
import { CRMTable } from '@/components/crm/CRMTable';
import { CRMFunnel } from '@/components/crm/CRMFunnel';
import { CRMFollowUps } from '@/components/crm/CRMFollowUps';
import { CRMCampaigns } from '@/components/crm/CRMCampaigns';
import { CRMLeadWorkspaceModal } from '@/components/crm/CRMLeadWorkspaceModal';
import { NewLeadModal } from '@/components/crm/NewLeadModal';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/format';
import {
  Kanban,
  Table,
  BarChart2,
  CalendarCheck,
  Megaphone,
  Plus,
  Sparkles,
  Building2,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function LeadsPage() {
  const {
    leads,
    addLead,
    updateLead,
    updateLeadStage,
    convertLeadToQuotation,
    addLeadActivity,
    scheduleLeadFollowUp,
    completeLeadFollowUp,
    assignLead,
    markLeadLost,
    reopenLead,
    updateLeadScore,
    saveLeadFunctions,
    saveLeadNegotiation,
    executeOperationsHandover,
    campaigns,
    addCampaign,
    selectedBranch,
    setSelectedBranch
  } = useERP();

  const [activeTab, setActiveTab] = useState<'kanban' | 'table' | 'dashboard' | 'followups' | 'campaigns'>('kanban');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  // Loss recording quick modal state
  const [lossModalLead, setLossModalLead] = useState<Lead | null>(null);
  const [lossFormData, setLossFormData] = useState<CRMLossRecord>({
    lossReason: 'Competitor selected',
    competitorName: '',
    lossNotes: '',
    lostDate: new Date().toISOString().split('T')[0],
    eligibleForNurture: true
  });

  // Handover confirmation modal state
  const [handoverLead, setHandoverLead] = useState<Lead | null>(null);
  const [handoverProducer, setHandoverProducer] = useState('Priya Sharma');
  const [handoverNotes, setHandoverNotes] = useState('Client verified deliverables and advance deposit structure.');

  // Branch scoped leads
  const branchFilteredLeads = selectedBranch === 'All Branches'
    ? leads
    : leads.filter(l => l.branchName === selectedBranch || (!l.branchName && selectedBranch === 'Mumbai HQ'));

  const crmNavigationTabs = [
    { id: 'kanban', label: 'Pipeline Board (10 Stages)', icon: <Kanban className="w-3.5 h-3.5" /> },
    { id: 'table', label: 'Opportunities Master List', count: branchFilteredLeads.length, icon: <Table className="w-3.5 h-3.5" /> },
    { id: 'dashboard', label: 'Sales Funnel & Analytics', icon: <BarChart2 className="w-3.5 h-3.5" /> },
    { id: 'followups', label: 'Follow-ups & Cadence', icon: <CalendarCheck className="w-3.5 h-3.5" /> },
    { id: 'campaigns', label: 'Marketing Attribution', count: campaigns.length, icon: <Megaphone className="w-3.5 h-3.5" /> }
  ];

  const handleDraftQuotation = (leadId: string) => {
    const q = convertLeadToQuotation(leadId);
    setNotificationBanner(`Drafted Quotation ${q.quotationNo} for ${q.clientName}. Advanced pipeline to "06. Proposal Sent".`);
    setTimeout(() => setNotificationBanner(null), 5000);
  };

  const handleConfirmLoss = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lossModalLead) return;
    markLeadLost(lossModalLead.id, lossFormData);
    setLossModalLead(null);
    setNotificationBanner(`Opportunity closed as Lost (${lossFormData.lossReason}). Logged in loss intelligence.`);
    setTimeout(() => setNotificationBanner(null), 5000);
  };

  const handleConfirmHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handoverLead) return;
    executeOperationsHandover(handoverLead.id, handoverNotes, handoverProducer);
    setHandoverLead(null);
    setNotificationBanner(`Booking Confirmed! Handover executed to Event Producer ${handoverProducer}. Live Event created.`);
    setTimeout(() => setNotificationBanner(null), 6000);
  };

  return (
    <div className="space-y-6 w-full max-w-[1700px] mx-auto">
      {/* Page Header */}
      <PageHeader
        title="CRM & Sales Pipeline"
        description="Central sales and customer acquisition engine: multi-channel lead capture, 100-point qualification, 10-stage pipeline, and operations handover."
        badge={
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
            {branchFilteredLeads.length} Total Opportunities
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1">
              <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-transparent text-xs font-medium text-zinc-800 focus:outline-none cursor-pointer"
              >
                <option value="All Branches">All Branches Scope</option>
                <option value="Mumbai HQ">Mumbai HQ</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Bangalore Hub">Bangalore Hub</option>
              </select>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsNewLeadModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              New Enquiry
            </Button>
          </div>
        }
      />

      {/* Dynamic Feedback Banner */}
      {notificationBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notificationBanner}</span>
          </div>
          <button onClick={() => setNotificationBanner(null)} className="text-emerald-700 font-bold ml-2">✕</button>
        </div>
      )}

      {/* CRM Stats KPI Strip */}
      <CRMStats leads={branchFilteredLeads} selectedBranch={selectedBranch} />

      {/* Primary Navigation Tabs */}
      <Tabs
        items={crmNavigationTabs}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* TAB 1: KANBAN BOARD */}
      {activeTab === 'kanban' && (
        <CRMKanban
          leads={branchFilteredLeads}
          onSelectLead={(l) => setSelectedLead(l)}
          onUpdateStage={(leadId, stage) => updateLeadStage(leadId, stage)}
          onDraftQuotation={handleDraftQuotation}
          onInitiateHandover={(l) => setHandoverLead(l)}
          onMarkLost={(l) => setLossModalLead(l)}
        />
      )}

      {/* TAB 2: TABLE LIST */}
      {activeTab === 'table' && (
        <CRMTable
          leads={branchFilteredLeads}
          onSelectLead={(l) => setSelectedLead(l)}
          onUpdateStage={(leadId, stage) => updateLeadStage(leadId, stage)}
          onDraftQuotation={handleDraftQuotation}
          onInitiateHandover={(l) => setHandoverLead(l)}
          onMarkLost={(l) => setLossModalLead(l)}
        />
      )}

      {/* TAB 3: FUNNEL & ANALYTICS */}
      {activeTab === 'dashboard' && (
        <CRMFunnel leads={branchFilteredLeads} />
      )}

      {/* TAB 4: FOLLOW-UPS & CADENCE */}
      {activeTab === 'followups' && (
        <CRMFollowUps
          leads={branchFilteredLeads}
          onCompleteFollowUp={completeLeadFollowUp}
          onScheduleFollowUp={scheduleLeadFollowUp}
          onSelectLead={(l) => setSelectedLead(l)}
        />
      )}

      {/* TAB 5: MARKETING CAMPAIGNS */}
      {activeTab === 'campaigns' && (
        <CRMCampaigns
          campaigns={campaigns}
          onAddCampaign={addCampaign}
        />
      )}

      {/* Lead 360 Workspace Modal */}
      {selectedLead && (
        <CRMLeadWorkspaceModal
          lead={leads.find(l => l.id === selectedLead.id) || selectedLead}
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdateStage={(leadId, stage, remarks) => updateLeadStage(leadId, stage, remarks)}
          onAddActivity={addLeadActivity}
          onScheduleFollowUp={scheduleLeadFollowUp}
          onCompleteFollowUp={completeLeadFollowUp}
          onUpdateScore={updateLeadScore}
          onSaveFunctions={saveLeadFunctions}
          onSaveNegotiation={saveLeadNegotiation}
          onAssignLead={assignLead}
          onMarkLost={markLeadLost}
          onReopenLead={reopenLead}
          onExecuteHandover={(leadId, notes, mgr) => executeOperationsHandover(leadId, notes, mgr)}
          onDraftQuotation={handleDraftQuotation}
        />
      )}

      {/* New Lead Intake Modal */}
      {isNewLeadModalOpen && (
        <NewLeadModal
          isOpen={isNewLeadModalOpen}
          onClose={() => setIsNewLeadModalOpen(false)}
          onAddLead={(leadData) => {
            addLead(leadData);
            setNotificationBanner(`Created lead ${leadData.title} for ${leadData.clientName}.`);
            setTimeout(() => setNotificationBanner(null), 4000);
          }}
          existingLeads={leads}
          campaigns={campaigns}
        />
      )}

      {/* Quick Loss Reason Modal */}
      {lossModalLead && (
        <Modal
          isOpen={!!lossModalLead}
          onClose={() => setLossModalLead(null)}
          title={`Mark Opportunity as Lost: ${lossModalLead.title}`}
          description={`Mandatory loss reason tracking for competitive sales intelligence.`}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setLossModalLead(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" className="bg-rose-600 hover:bg-rose-700" onClick={handleConfirmLoss}>
                Confirm Loss
              </Button>
            </>
          }
        >
          <form onSubmit={handleConfirmLoss} className="space-y-3.5 text-xs">
            <Select
              label="Mandatory Loss Reason"
              value={lossFormData.lossReason}
              onChange={(e) => setLossFormData({ ...lossFormData, lossReason: e.target.value as any })}
            >
              <option value="Budget mismatch">Budget mismatch</option>
              <option value="Competitor selected">Competitor selected</option>
              <option value="Date unavailable">Date unavailable</option>
              <option value="Venue unavailable">Venue unavailable</option>
              <option value="Customer cancelled">Customer cancelled</option>
              <option value="No response">No response / Ghosted</option>
              <option value="Price too high">Price too high</option>
              <option value="Duplicate enquiry">Duplicate enquiry</option>
              <option value="Other">Other</option>
            </Select>

            <Input
              label="Competitor Name (if chosen)"
              placeholder="e.g. Wizcraft, DNA Entertainment"
              value={lossFormData.competitorName || ''}
              onChange={(e) => setLossFormData({ ...lossFormData, competitorName: e.target.value })}
            />

            <Input
              label="Loss Analysis & Customer Objections"
              required
              placeholder="Why did the customer decide not to proceed?"
              value={lossFormData.lossNotes || ''}
              onChange={(e) => setLossFormData({ ...lossFormData, lossNotes: e.target.value })}
            />
          </form>
        </Modal>
      )}

      {/* Quick Handover Confirmation Modal */}
      {handoverLead && (
        <Modal
          isOpen={!!handoverLead}
          onClose={() => setHandoverLead(null)}
          title={`Won Booking & Operations Handover`}
          description={`Convert ${handoverLead.title} to an active production and assign the Lead Producer.`}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setHandoverLead(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={handleConfirmHandover}>
                Confirm Handover & Create Event
              </Button>
            </>
          }
        >
          <form onSubmit={handleConfirmHandover} className="space-y-3.5 text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1 font-mono text-[11px]">
              <div className="flex justify-between">
                <span>Contract Value:</span>
                <strong className="text-zinc-950 font-bold">₹{formatCurrency(handoverLead.negotiation?.negotiatedPrice || handoverLead.estimatedBudget)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Client Contact:</span>
                <span>{handoverLead.clientName} ({handoverLead.phone})</span>
              </div>
              <div className="flex justify-between">
                <span>Event Date:</span>
                <span>{handoverLead.eventDate}</span>
              </div>
            </div>

            <Select
              label="Assign Event Producer (Operations Lead)"
              value={handoverProducer}
              onChange={(e) => setHandoverProducer(e.target.value)}
            >
              <option value="Priya Sharma">Priya Sharma (Senior Event Producer)</option>
              <option value="Vikram Rathore">Vikram Rathore (Production & AV Lead)</option>
              <option value="Vikramaditya Singhania">Vikramaditya Singhania (Executive Leadership)</option>
            </Select>

            <Input
              label="Operations Handover Notes"
              required
              value={handoverNotes}
              onChange={(e) => setHandoverNotes(e.target.value)}
            />
          </form>
        </Modal>
      )}
    </div>
  );
}
