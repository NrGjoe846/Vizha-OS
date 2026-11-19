'use client';

import React, { useState } from 'react';
import {
  Lead,
  LeadStage,
  CRMActivity,
  CRMFollowUp,
  CRMEventFunction,
  CRMLeadScore,
  CRMNegotiation,
  CRMLossRecord
} from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/format';
import { CRM_STAGES } from './CRMKanban';
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  Building,
  User,
  Plus,
  Flame,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Send,
  Trash2,
  ArrowRight,
  Sparkles,
  Layers,
  MapPin,
  Check,
  XCircle,
  Copy
} from 'lucide-react';

interface CRMLeadWorkspaceModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStage: (leadId: string, stage: LeadStage, remarks?: string) => void;
  onAddActivity: (leadId: string, activity: Omit<CRMActivity, 'id' | 'leadId' | 'timestamp'>) => void;
  onScheduleFollowUp: (leadId: string, followUp: Omit<CRMFollowUp, 'id' | 'leadId' | 'isCompleted'>) => void;
  onCompleteFollowUp: (followUpId: string, outcome: string) => void;
  onUpdateScore: (leadId: string, score: CRMLeadScore) => void;
  onSaveFunctions: (leadId: string, functions: CRMEventFunction[]) => void;
  onSaveNegotiation: (leadId: string, negotiation: CRMNegotiation) => void;
  onAssignLead: (leadId: string, newSalesperson: string, reason: string) => void;
  onMarkLost: (leadId: string, lossRecord: CRMLossRecord) => void;
  onReopenLead: (leadId: string) => void;
  onExecuteHandover: (leadId: string, handoverNotes: string, manager: string) => void;
  onDraftQuotation: (leadId: string) => void;
}

export function CRMLeadWorkspaceModal({
  lead,
  isOpen,
  onClose,
  onUpdateStage,
  onAddActivity,
  onScheduleFollowUp,
  onCompleteFollowUp,
  onUpdateScore,
  onSaveFunctions,
  onSaveNegotiation,
  onAssignLead,
  onMarkLost,
  onReopenLead,
  onExecuteHandover,
  onDraftQuotation
}: CRMLeadWorkspaceModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'scoring' | 'negotiation' | 'timeline' | 'handover'>('overview');

  // Activity form
  const [activityForm, setActivityForm] = useState({
    type: 'call' as const,
    title: '',
    description: '',
    outcome: 'interested' as const,
    nextAction: '',
    durationMinutes: 15
  });

  // Follow-up form
  const [followUpForm, setFollowUpForm] = useState({
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '11:00 AM',
    assignedTo: lead.assignedTo,
    priority: 'high' as const,
    activityType: 'call' as const,
    notes: ''
  });

  // Reassignment form
  const [assignForm, setAssignForm] = useState({
    newOwner: 'Rajesh Verma',
    reason: 'Client relationship specialization'
  });

  // Loss recording form
  const [lossForm, setLossForm] = useState({
    lossReason: 'Budget mismatch' as const,
    competitorName: '',
    lossNotes: '',
    eligibleForNurture: true
  });

  // Handover form
  const [handoverManager, setHandoverManager] = useState('Priya Sharma');
  const [handoverNotes, setHandoverNotes] = useState(
    'Client requires VIP catering tasting prior to rehearsal and silent generator backup.'
  );

  // Scoring weights state
  const [scoringData, setScoringData] = useState<CRMLeadScore>(
    lead.score || {
      budgetScore: 18,
      dateScore: 15,
      engagementScore: 15,
      intentScore: 18,
      requirementScore: 10,
      decisionMakerScore: 8,
      feasibilityScore: 4,
      totalScore: 88,
      category: 'Hot Lead'
    }
  );

  // Multi-function event state
  const [functionsList, setFunctionsList] = useState<CRMEventFunction[]>(
    lead.functions || [
      {
        id: 'fn-1',
        functionName: `${lead.eventType} Main Celebration`,
        date: lead.eventDate,
        startTime: '18:00',
        endTime: '23:30',
        venueName: lead.venueName || lead.eventLocation || 'Ballroom',
        guestCount: lead.guestCount,
        theme: 'Contemporary Grandeur',
        servicesNeeded: ['Sound & AV', 'Stage Lighting', 'Catering', 'Floral Decor']
      }
    ]
  );

  // Negotiation state
  const [negotiationData, setNegotiationData] = useState<CRMNegotiation>(
    lead.negotiation || {
      initialBudget: lead.estimatedBudget,
      proposedPrice: Math.round(lead.estimatedBudget * 1.05),
      negotiatedPrice: lead.estimatedBudget,
      expectedCost: Math.round(lead.estimatedBudget * 0.72),
      expectedGrossMargin: 28,
      discountRequested: 0,
      discountApproved: true,
      approvalNotes: 'Standard commercial margin met.'
    }
  );

  const [newFunctionInput, setNewFunctionInput] = useState({
    functionName: '',
    date: lead.eventDate,
    venueName: '',
    guestCount: 200,
    theme: '',
    servicesNeededStr: 'Sound & AV, Lighting, Decor'
  });

  const workspaceTabs = [
    { id: 'overview', label: 'Lead 360 Overview' },
    { id: 'requirements', label: 'Event Functions', count: functionsList.length },
    { id: 'scoring', label: '100-Pt Qualification', count: scoringData.totalScore },
    { id: 'negotiation', label: 'Commercial & Price' },
    { id: 'timeline', label: 'Communication Timeline', count: lead.activities?.length || 0 },
    { id: 'handover', label: lead.stage === 'converted' ? 'Handover Dossier' : 'Won Handover' }
  ];

  const handleScoreChange = (key: keyof CRMLeadScore, val: number) => {
    const updated = { ...scoringData, [key]: val };
    const total =
      updated.budgetScore +
      updated.dateScore +
      updated.engagementScore +
      updated.intentScore +
      updated.requirementScore +
      updated.decisionMakerScore +
      updated.feasibilityScore;

    const category: 'Hot Lead' | 'Warm Lead' | 'Cold Lead' =
      total >= 80 ? 'Hot Lead' : total >= 50 ? 'Warm Lead' : 'Cold Lead';

    const finalScore: CRMLeadScore = {
      ...updated,
      totalScore: total,
      category
    };

    setScoringData(finalScore);
    onUpdateScore(lead.id, finalScore);
  };

  const handleAddFunction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFunctionInput.functionName) return;

    const newFn: CRMEventFunction = {
      id: `fn-${Date.now()}`,
      functionName: newFunctionInput.functionName,
      date: newFunctionInput.date,
      venueName: newFunctionInput.venueName || 'Venue TBD',
      guestCount: newFunctionInput.guestCount,
      theme: newFunctionInput.theme,
      servicesNeeded: newFunctionInput.servicesNeededStr.split(',').map(s => s.trim())
    };

    const nextList = [...functionsList, newFn];
    setFunctionsList(nextList);
    onSaveFunctions(lead.id, nextList);
    setNewFunctionInput({
      functionName: '',
      date: lead.eventDate,
      venueName: '',
      guestCount: 200,
      theme: '',
      servicesNeededStr: 'Sound & AV, Lighting, Decor'
    });
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityForm.title) return;

    onAddActivity(lead.id, {
      type: activityForm.type,
      title: activityForm.title,
      description: activityForm.description,
      performedBy: lead.assignedTo,
      outcome: activityForm.outcome,
      nextAction: activityForm.nextAction,
      durationMinutes: activityForm.durationMinutes
    });

    setActivityForm({
      type: 'call',
      title: '',
      description: '',
      outcome: 'interested',
      nextAction: '',
      durationMinutes: 15
    });
  };

  const handleScheduleFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpForm.notes) return;

    onScheduleFollowUp(lead.id, {
      leadTitle: lead.title,
      clientName: lead.clientName,
      scheduledDate: followUpForm.scheduledDate,
      scheduledTime: followUpForm.scheduledTime,
      assignedTo: followUpForm.assignedTo,
      priority: followUpForm.priority,
      activityType: followUpForm.activityType,
      notes: followUpForm.notes
    });

    setFollowUpForm({ ...followUpForm, notes: '' });
  };

  const handleSaveNegotiationTerms = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNegotiation(lead.id, negotiationData);
  };

  const handleMarkLeadLost = (e: React.FormEvent) => {
    e.preventDefault();
    onMarkLost(lead.id, {
      lossReason: lossForm.lossReason,
      competitorName: lossForm.competitorName,
      lossNotes: lossForm.lossNotes,
      lostDate: new Date().toISOString().split('T')[0],
      eligibleForNurture: lossForm.eligibleForNurture
    });
  };

  const handleExecuteHandover = (e: React.FormEvent) => {
    e.preventDefault();
    onExecuteHandover(lead.id, handoverNotes, handoverManager);
    onClose();
  };

  const currentStageMeta = CRM_STAGES.find(s => s.key === lead.stage);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${lead.leadNumber || 'OPPORTUNITY'} — ${lead.title}`}
      description={`${lead.eventType} • ${lead.clientName} • Assigned to ${lead.assignedTo}`}
      maxWidth="5xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono text-zinc-400">Pipeline Stage:</span>
            <select
              value={lead.stage}
              onChange={(e) => onUpdateStage(lead.id, e.target.value as LeadStage)}
              className="text-xs font-semibold bg-zinc-100 border border-zinc-300 rounded px-2 py-1 text-zinc-900 focus:outline-none"
            >
              {CRM_STAGES.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            {!lead.quotationId && lead.stage !== 'converted' && lead.stage !== 'lost' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDraftQuotation(lead.id)}
                icon={<FileText className="w-3.5 h-3.5" />}
              >
                Draft Proposal
              </Button>
            )}

            {lead.stage === 'lost' ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onReopenLead(lead.id)}
              >
                Reopen & Nurture
              </Button>
            ) : lead.stage !== 'converted' ? (
              <Button
                variant="primary"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setActiveTab('handover')}
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                Close Won & Handover
              </Button>
            ) : null}

            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Top Header Identity Strip */}
        <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">Client</span>
              <p className="font-bold text-zinc-900 text-sm">{lead.clientName}</p>
              {lead.companyName && <p className="text-[11px] text-zinc-500">{lead.companyName}</p>}
            </div>
            <div className="border-l border-zinc-200 pl-3">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">Contact</span>
              <p className="font-mono text-zinc-800">{lead.phone}</p>
              <p className="text-zinc-500">{lead.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono text-right">
            <div>
              <span className="text-[10px] uppercase text-zinc-400 block">Estimated Budget</span>
              <span className="font-bold text-zinc-950 text-sm">₹{formatCurrency(lead.estimatedBudget)}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-zinc-400 block">Lead Score</span>
              <span
                className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded text-xs ${
                  scoringData.category === 'Hot Lead'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : scoringData.category === 'Warm Lead'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-zinc-200 text-zinc-700'
                }`}
              >
                <Flame className="w-3 h-3" />
                {scoringData.totalScore}/100 ({scoringData.category})
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs
          items={workspaceTabs}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as any)}
        />

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 bg-white border border-zinc-200/80 rounded-xl space-y-2.5">
                <h5 className="font-bold text-zinc-900 uppercase font-mono text-[10px] tracking-wider text-zinc-400">
                  Opportunity Profile
                </h5>
                <div className="space-y-1.5 text-zinc-700">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Event Category:</span>
                    <span className="font-semibold text-zinc-900">{lead.eventType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Target Event Date:</span>
                    <span className="font-mono font-medium">{lead.eventDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Expected Guests:</span>
                    <span className="font-mono">{lead.guestCount} Attendees</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Proposed Venue / City:</span>
                    <span>{lead.venueName || lead.eventLocation || lead.city || 'TBD'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Lead Source & Campaign:</span>
                    <span className="font-medium text-purple-700">{lead.source} {lead.campaign ? `(${lead.campaign})` : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Salesperson Owner:</span>
                    <span className="font-medium text-zinc-900">{lead.assignedTo} ({lead.branchName || 'Mumbai HQ'})</span>
                  </div>
                </div>

                {lead.notes && (
                  <div className="p-2.5 bg-zinc-50 rounded border border-zinc-100 text-zinc-600 mt-2">
                    <span className="font-semibold text-zinc-800 block text-[10px] uppercase font-mono">Special Notes:</span>
                    {lead.notes}
                  </div>
                )}
              </div>

              {/* Ownership & Reassignment */}
              <div className="p-3.5 bg-white border border-zinc-200/80 rounded-xl space-y-3">
                <h5 className="font-bold text-zinc-900 uppercase font-mono text-[10px] tracking-wider text-zinc-400">
                  Lead Ownership & Transfer
                </h5>
                <p className="text-zinc-500 text-[11px]">
                  Currently managed by <strong className="text-zinc-900">{lead.assignedTo}</strong>. Transfers are logged in the audit trail.
                </p>

                <div className="space-y-2">
                  <Select
                    label="Reassign Lead Owner"
                    value={assignForm.newOwner}
                    onChange={(e) => setAssignForm({ ...assignForm, newOwner: e.target.value })}
                  >
                    <option value="Rajesh Verma">Rajesh Verma (Head of Acquisition)</option>
                    <option value="Priya Sharma">Priya Sharma (Senior Producer)</option>
                    <option value="Vikram Rathore">Vikram Rathore (Production Lead)</option>
                  </Select>

                  <Input
                    label="Transfer Justification"
                    placeholder="e.g. VIP HNI client alignment"
                    value={assignForm.reason}
                    onChange={(e) => setAssignForm({ ...assignForm, reason: e.target.value })}
                  />

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      onAssignLead(lead.id, assignForm.newOwner, assignForm.reason);
                    }}
                  >
                    Confirm Reassignment
                  </Button>
                </div>

                {lead.transferHistory && lead.transferHistory.length > 0 && (
                  <div className="pt-2 border-t border-zinc-100 text-[10px] font-mono text-zinc-500 space-y-1">
                    <span className="font-semibold text-zinc-700 block">Transfer History:</span>
                    {lead.transferHistory.map((t, idx) => (
                      <div key={idx}>
                        {t.date}: {t.fromUser} &rarr; {t.toUser} ({t.reason})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Loss Trigger if opportunity failed */}
            {lead.stage !== 'lost' && (
              <div className="p-3 bg-rose-50/50 border border-rose-200/60 rounded-xl flex items-center justify-between">
                <div>
                  <h6 className="font-semibold text-rose-900">Mark Opportunity as Lost / Disqualified</h6>
                  <p className="text-zinc-500 text-[11px]">Mandatory loss reason tracking for competitive sales intelligence.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-rose-700 border-rose-300 hover:bg-rose-100"
                  onClick={() => setActiveTab('handover')}
                >
                  Record Loss Reason
                </Button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MULTI-FUNCTION REQUIREMENTS */}
        {activeTab === 'requirements' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <h5 className="font-bold text-zinc-900">Multi-Function Event Architecture</h5>
                <p className="text-zinc-500 text-[11px]">Sub-events, function-wise guest counts, venue dates, and staging needs.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {functionsList.map((fn, idx) => (
                <div key={fn.id} className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-900 text-sm">{fn.functionName}</span>
                    <span className="font-mono text-zinc-500">{fn.date} &bull; {fn.guestCount} Guests</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Venue: {fn.venueName}</span>
                    {fn.theme && <span className="font-medium text-purple-700">&bull; Theme: {fn.theme}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {fn.servicesNeeded.map((srv, sIdx) => (
                      <span key={sIdx} className="bg-white border border-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded text-[10px]">
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Sub-Function Form */}
            <form onSubmit={handleAddFunction} className="p-3 border border-dashed border-zinc-300 rounded-xl space-y-3 bg-zinc-50/40">
              <span className="font-bold text-zinc-900 block text-xs">Add Function / Sub-Event</span>
              <div className="grid grid-cols-2 gap-2.5">
                <Input
                  label="Function Name"
                  required
                  placeholder="e.g. Sangeet & Cocktail Night, Reception"
                  value={newFunctionInput.functionName}
                  onChange={(e) => setNewFunctionInput({ ...newFunctionInput, functionName: e.target.value })}
                />
                <Input
                  label="Function Date"
                  type="date"
                  value={newFunctionInput.date}
                  onChange={(e) => setNewFunctionInput({ ...newFunctionInput, date: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <Input
                  label="Venue / Lawn"
                  placeholder="e.g. Grand Banquet Lawns"
                  value={newFunctionInput.venueName}
                  onChange={(e) => setNewFunctionInput({ ...newFunctionInput, venueName: e.target.value })}
                />
                <Input
                  label="Guest Count"
                  type="number"
                  value={newFunctionInput.guestCount}
                  onChange={(e) => setNewFunctionInput({ ...newFunctionInput, guestCount: Number(e.target.value) })}
                />
                <Input
                  label="Theme / Aesthetic"
                  placeholder="e.g. Royal Gilded Marigold"
                  value={newFunctionInput.theme}
                  onChange={(e) => setNewFunctionInput({ ...newFunctionInput, theme: e.target.value })}
                />
              </div>

              <Input
                label="Required Services (comma separated)"
                placeholder="Sound & AV, Catering, Floral Mandap, Fireworks"
                value={newFunctionInput.servicesNeededStr}
                onChange={(e) => setNewFunctionInput({ ...newFunctionInput, servicesNeededStr: e.target.value })}
              />

              <Button variant="primary" size="sm" type="submit" icon={<Plus className="w-3.5 h-3.5" />}>
                Add Function to Scope
              </Button>
            </form>
          </div>
        )}

        {/* TAB 3: 100-POINT QUALIFICATION SCORING */}
        {activeTab === 'scoring' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
              <div>
                <h5 className="font-bold text-zinc-900">Lead Qualification & Scoring Matrix</h5>
                <p className="text-zinc-500 text-[11px]">100-point algorithmic evaluation across commercial suitability criteria.</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-zinc-400 block uppercase">Total Score</span>
                <span className="text-base font-bold text-zinc-950">{scoringData.totalScore} / 100</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3 bg-zinc-50 rounded-lg space-y-1.5 border border-zinc-200/70">
                <div className="flex justify-between">
                  <span className="font-semibold text-zinc-800">1. Budget Suitability</span>
                  <span className="font-mono text-zinc-900">{scoringData.budgetScore} / 20 pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={scoringData.budgetScore}
                  onChange={(e) => handleScoreChange('budgetScore', Number(e.target.value))}
                  className="w-full accent-zinc-900"
                />
                <span className="text-[10px] text-zinc-400">Client budget meets minimum package thresholds.</span>
              </div>

              <div className="p-3 bg-zinc-50 rounded-lg space-y-1.5 border border-zinc-200/70">
                <div className="flex justify-between">
                  <span className="font-semibold text-zinc-800">2. Event Date Confirmed</span>
                  <span className="font-mono text-zinc-900">{scoringData.dateScore} / 15 pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={scoringData.dateScore}
                  onChange={(e) => handleScoreChange('dateScore', Number(e.target.value))}
                  className="w-full accent-zinc-900"
                />
                <span className="text-[10px] text-zinc-400">Fixed calendar dates without tentative shifts.</span>
              </div>

              <div className="p-3 bg-zinc-50 rounded-lg space-y-1.5 border border-zinc-200/70">
                <div className="flex justify-between">
                  <span className="font-semibold text-zinc-800">3. Customer Engagement</span>
                  <span className="font-mono text-zinc-900">{scoringData.engagementScore} / 15 pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={scoringData.engagementScore}
                  onChange={(e) => handleScoreChange('engagementScore', Number(e.target.value))}
                  className="w-full accent-zinc-900"
                />
                <span className="text-[10px] text-zinc-400">Responsiveness across calls, WhatsApp, and email.</span>
              </div>

              <div className="p-3 bg-zinc-50 rounded-lg space-y-1.5 border border-zinc-200/70">
                <div className="flex justify-between">
                  <span className="font-semibold text-zinc-800">4. Purchase Intent</span>
                  <span className="font-mono text-zinc-900">{scoringData.intentScore} / 20 pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={scoringData.intentScore}
                  onChange={(e) => handleScoreChange('intentScore', Number(e.target.value))}
                  className="w-full accent-zinc-900"
                />
                <span className="text-[10px] text-zinc-400">High motivation to book within current month.</span>
              </div>

              <div className="p-3 bg-zinc-50 rounded-lg space-y-1.5 border border-zinc-200/70">
                <div className="flex justify-between">
                  <span className="font-semibold text-zinc-800">5. Requirement Clarity</span>
                  <span className="font-mono text-zinc-900">{scoringData.requirementScore} / 10 pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={scoringData.requirementScore}
                  onChange={(e) => handleScoreChange('requirementScore', Number(e.target.value))}
                  className="w-full accent-zinc-900"
                />
                <span className="text-[10px] text-zinc-400">Clear expectations on artists, catering, and staging.</span>
              </div>

              <div className="p-3 bg-zinc-50 rounded-lg space-y-1.5 border border-zinc-200/70">
                <div className="flex justify-between">
                  <span className="font-semibold text-zinc-800">6. Decision Maker Direct Access</span>
                  <span className="font-mono text-zinc-900">{scoringData.decisionMakerScore} / 10 pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={scoringData.decisionMakerScore}
                  onChange={(e) => handleScoreChange('decisionMakerScore', Number(e.target.value))}
                  className="w-full accent-zinc-900"
                />
                <span className="text-[10px] text-zinc-400">Dealing directly with primary signer/HNI principal.</span>
              </div>

              <div className="p-3 bg-zinc-50 rounded-lg space-y-1.5 border border-zinc-200/70 sm:col-span-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-zinc-800">7. Production Feasibility</span>
                  <span className="font-mono text-zinc-900">{scoringData.feasibilityScore} / 10 pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={scoringData.feasibilityScore}
                  onChange={(e) => handleScoreChange('feasibilityScore', Number(e.target.value))}
                  className="w-full accent-zinc-900"
                />
                <span className="text-[10px] text-zinc-400">Fleet equipment & lead times align with dates.</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COMMERCIAL NEGOTIATION */}
        {activeTab === 'negotiation' && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
              <h5 className="font-bold text-zinc-900">Commercial Negotiation & Margin Control</h5>
              <form onSubmit={handleSaveNegotiationTerms} className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    label="Customer Initial Budget"
                    type="number"
                    value={negotiationData.initialBudget}
                    onChange={(e) => setNegotiationData({ ...negotiationData, initialBudget: Number(e.target.value) })}
                  />
                  <Input
                    label="Proposed Selling Price"
                    type="number"
                    value={negotiationData.proposedPrice}
                    onChange={(e) => setNegotiationData({ ...negotiationData, proposedPrice: Number(e.target.value) })}
                  />
                  <Input
                    label="Agreed Negotiated Price"
                    type="number"
                    value={negotiationData.negotiatedPrice}
                    onChange={(e) => {
                      const np = Number(e.target.value);
                      const margin = Math.round(((np - negotiationData.expectedCost) / (np || 1)) * 100);
                      setNegotiationData({ ...negotiationData, negotiatedPrice: np, expectedGrossMargin: margin });
                    }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Input
                    label="Estimated Event Cost"
                    type="number"
                    value={negotiationData.expectedCost}
                    onChange={(e) => {
                      const ec = Number(e.target.value);
                      const margin = Math.round(((negotiationData.negotiatedPrice - ec) / (negotiationData.negotiatedPrice || 1)) * 100);
                      setNegotiationData({ ...negotiationData, expectedCost: ec, expectedGrossMargin: margin });
                    }}
                  />
                  <Input
                    label="Gross Margin (%)"
                    type="number"
                    disabled
                    value={negotiationData.expectedGrossMargin}
                  />
                  <Input
                    label="Discount Waiver (₹)"
                    type="number"
                    value={negotiationData.discountRequested}
                    onChange={(e) => setNegotiationData({ ...negotiationData, discountRequested: Number(e.target.value) })}
                  />
                </div>

                <Input
                  label="Discount / Margin Approval Notes"
                  placeholder="e.g. Approved by Vikramaditya Singhania for 3-year exclusivity"
                  value={negotiationData.approvalNotes || ''}
                  onChange={(e) => setNegotiationData({ ...negotiationData, approvalNotes: e.target.value })}
                />

                <div className="flex justify-between items-center pt-2">
                  <span className="font-mono text-zinc-500">
                    Gross Profit Contribution: <strong className="text-emerald-700">₹{formatCurrency(negotiationData.negotiatedPrice - negotiationData.expectedCost)}</strong>
                  </span>
                  <Button variant="primary" size="sm" type="submit">
                    Save Negotiation Terms
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: COMMUNICATION TIMELINE & FOLLOW-UPS */}
        {activeTab === 'timeline' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Log Activity */}
              <form onSubmit={handleAddActivity} className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2.5">
                <span className="font-bold text-zinc-900 block">Log Sales Activity</span>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    label="Activity Type"
                    value={activityForm.type}
                    onChange={(e) => setActivityForm({ ...activityForm, type: e.target.value as any })}
                  >
                    <option value="call">Phone Call</option>
                    <option value="whatsapp">WhatsApp Discussion</option>
                    <option value="meeting">Customer Meeting</option>
                    <option value="site_visit">Venue Site Inspection</option>
                    <option value="email">Email</option>
                    <option value="note">Internal Note</option>
                  </Select>

                  <Select
                    label="Outcome"
                    value={activityForm.outcome}
                    onChange={(e) => setActivityForm({ ...activityForm, outcome: e.target.value as any })}
                  >
                    <option value="interested">Interested</option>
                    <option value="proposal_requested">Proposal Requested</option>
                    <option value="meeting_scheduled">Meeting Scheduled</option>
                    <option value="price_negotiation">Price Negotiation</option>
                    <option value="call_back_later">Call Back Later</option>
                    <option value="not_reachable">Not Reachable</option>
                    <option value="booking_confirmed">Booking Confirmed</option>
                  </Select>
                </div>

                <Input
                  label="Activity Summary"
                  required
                  placeholder="e.g. Discussed mandap floral options and revised catering menu"
                  value={activityForm.title}
                  onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                />

                <Input
                  label="Next Action Commitment"
                  placeholder="e.g. Send revised quotation by 4 PM tomorrow"
                  value={activityForm.nextAction}
                  onChange={(e) => setActivityForm({ ...activityForm, nextAction: e.target.value })}
                />

                <Button variant="primary" size="sm" type="submit" icon={<Send className="w-3.5 h-3.5" />}>
                  Append to Timeline
                </Button>
              </form>

              {/* Schedule Follow-up */}
              <form onSubmit={handleScheduleFollowUp} className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2.5">
                <span className="font-bold text-zinc-900 block">Schedule Next Follow-Up</span>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Date"
                    type="date"
                    value={followUpForm.scheduledDate}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, scheduledDate: e.target.value })}
                  />
                  <Input
                    label="Time"
                    value={followUpForm.scheduledTime}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, scheduledTime: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Select
                    label="Channel"
                    value={followUpForm.activityType}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, activityType: e.target.value as any })}
                  >
                    <option value="call">Call</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="meeting">Meeting</option>
                    <option value="site_visit">Site Visit</option>
                  </Select>

                  <Select
                    label="Priority"
                    value={followUpForm.priority}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, priority: e.target.value as any })}
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </Select>
                </div>

                <Input
                  label="Follow-up Objective"
                  required
                  placeholder="e.g. Confirm advance booking token"
                  value={followUpForm.notes}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, notes: e.target.value })}
                />

                <Button variant="primary" size="sm" type="submit" icon={<Clock className="w-3.5 h-3.5" />}>
                  Commit Follow-Up
                </Button>
              </form>
            </div>

            {/* Timeline Stream */}
            <div className="space-y-2 pt-2 border-t border-zinc-200">
              <h5 className="font-bold text-zinc-900">Communication & Activity History</h5>
              {lead.activities && lead.activities.length > 0 ? (
                <div className="divide-y divide-zinc-100">
                  {lead.activities.map((act) => (
                    <div key={act.id} className="py-2.5 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-900">{act.title}</span>
                          <span className="uppercase text-[9px] font-mono bg-zinc-100 px-1 py-0.2 rounded border border-zinc-200">
                            {act.type}
                          </span>
                          {act.outcome && (
                            <Badge variant="neutral" className="text-[10px]">
                              {act.outcome.replace('_', ' ')}
                            </Badge>
                          )}
                        </div>
                        {act.description && <p className="text-zinc-600 mt-0.5">{act.description}</p>}
                        {act.nextAction && (
                          <p className="text-[11px] font-mono text-indigo-700 mt-1">
                            Next Action: {act.nextAction}
                          </p>
                        )}
                      </div>
                      <div className="text-right font-mono text-[10px] text-zinc-400 shrink-0">
                        <span>{act.timestamp}</span>
                        <span className="block text-zinc-500">{act.performedBy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-400 text-center py-4">No activities logged yet.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: OPERATIONS HANDOVER OR LOSS ANALYSIS */}
        {activeTab === 'handover' && (
          <div className="space-y-4 text-xs">
            {lead.stage === 'lost' ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold">
                  <XCircle className="w-4 h-4" />
                  <span>Opportunity Marked Lost</span>
                </div>
                {lead.lossRecord && (
                  <div className="space-y-1 text-zinc-700">
                    <p><strong>Primary Loss Reason:</strong> {lead.lossRecord.lossReason}</p>
                    {lead.lossRecord.competitorName && (
                      <p><strong>Competitor Selected:</strong> {lead.lossRecord.competitorName}</p>
                    )}
                    {lead.lossRecord.lossNotes && (
                      <p><strong>Analysis:</strong> {lead.lossRecord.lossNotes}</p>
                    )}
                    <p className="text-[10px] font-mono text-zinc-400">Date Closed: {lead.lossRecord.lostDate}</p>
                  </div>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onReopenLead(lead.id)}
                >
                  Reopen Opportunity & Nurture
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Handover to Operations Workflow */}
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h5 className="font-bold text-zinc-950 text-sm">Event Operations Handover Protocol</h5>
                      <p className="text-zinc-600 text-[11px]">
                        Converts this won commercial opportunity into an active production event, generates the client record, locks contractual deliverables, and assigns the Lead Event Producer.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleExecuteHandover} className="space-y-3 pt-2">
                    <Select
                      label="Assign Event Producer (Operations Lead)"
                      value={handoverManager}
                      onChange={(e) => setHandoverManager(e.target.value)}
                    >
                      <option value="Priya Sharma">Priya Sharma (Senior Event Producer)</option>
                      <option value="Vikram Rathore">Vikram Rathore (Production & AV Lead)</option>
                      <option value="Vikramaditya Singhania">Vikramaditya Singhania (Executive Director)</option>
                    </Select>

                    <Input
                      label="Operations Handover Notes & Special Client Commitments"
                      required
                      placeholder="Specific client expectations, dietary caveats, sound restrictions, or VIP logistics..."
                      value={handoverNotes}
                      onChange={(e) => setHandoverNotes(e.target.value)}
                    />

                    <div className="p-3 bg-white rounded-lg border border-emerald-200/80 space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span>Contract Commercial Value:</span>
                        <strong className="text-zinc-900">₹{formatCurrency(negotiationData.negotiatedPrice || lead.estimatedBudget)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Scheduled Event Date:</span>
                        <span>{lead.eventDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sub-Functions Transferred:</span>
                        <span>{functionsList.length} Functions</span>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 w-full justify-center text-xs py-2"
                      icon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Execute Controlled Operations Handover
                    </Button>
                  </form>
                </div>

                {/* Mark Lost Section */}
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
                  <h5 className="font-bold text-zinc-900">Record Loss & Disqualification</h5>
                  <form onSubmit={handleMarkLeadLost} className="space-y-3">
                    <Select
                      label="Mandatory Loss Reason"
                      value={lossForm.lossReason}
                      onChange={(e) => setLossForm({ ...lossForm, lossReason: e.target.value as any })}
                    >
                      <option value="Budget mismatch">Budget mismatch</option>
                      <option value="Competitor selected">Competitor selected</option>
                      <option value="Date unavailable">Date unavailable</option>
                      <option value="Venue unavailable">Venue unavailable</option>
                      <option value="Customer cancelled">Customer cancelled event</option>
                      <option value="No response">No response / Ghosted</option>
                      <option value="Price too high">Price too high</option>
                      <option value="Duplicate enquiry">Duplicate enquiry</option>
                      <option value="Other">Other</option>
                    </Select>

                    <Input
                      label="Competitor Selected (if applicable)"
                      placeholder="e.g. Wizcraft, DNA Entertainment"
                      value={lossForm.competitorName}
                      onChange={(e) => setLossForm({ ...lossForm, competitorName: e.target.value })}
                    />

                    <Input
                      label="Loss Analysis & Feedback"
                      placeholder="Key reasons cited by customer..."
                      value={lossForm.lossNotes}
                      onChange={(e) => setLossForm({ ...lossForm, lossNotes: e.target.value })}
                    />

                    <Button variant="outline" size="sm" type="submit" className="text-rose-700 border-rose-300">
                      Confirm Opportunity Lost
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
