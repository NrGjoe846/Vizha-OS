'use client';

import React, { useState } from 'react';
import { Lead, LeadStage } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/format';
import {
  Calendar,
  Clock,
  Phone,
  FileText,
  User,
  ArrowRight,
  AlertTriangle,
  Flame,
  CheckCircle2,
  XCircle,
  Eye,
  Check,
  ChevronRight
} from 'lucide-react';

export const CRM_STAGES: {
  key: LeadStage;
  label: string;
  order: number;
  badgeVariant: 'neutral' | 'info' | 'warning' | 'purple' | 'success' | 'danger';
  description: string;
}[] = [
  { key: 'new', label: '01. New Enquiry', order: 1, badgeVariant: 'neutral', description: 'Inquiry received' },
  { key: 'contacted', label: '02. Contacted', order: 2, badgeVariant: 'info', description: 'First call / email completed' },
  { key: 'qualified', label: '03. Qualified', order: 3, badgeVariant: 'info', description: 'Budget, date & scope verified' },
  { key: 'meeting_scheduled', label: '04. Meeting / Site Visit', order: 4, badgeVariant: 'info', description: 'Consultation or venue tour' },
  { key: 'requirement_finalized', label: '05. Requirement Finalization', order: 5, badgeVariant: 'purple', description: 'Multi-function scope locked' },
  { key: 'proposal_sent', label: '06. Proposal Sent', order: 6, badgeVariant: 'warning', description: 'Itemized quotation submitted' },
  { key: 'negotiating', label: '07. Negotiation', order: 7, badgeVariant: 'warning', description: 'Commercial terms & margins' },
  { key: 'awaiting_confirmation', label: '08. Awaiting Confirmation', order: 8, badgeVariant: 'warning', description: 'Advance token payment pending' },
  { key: 'converted', label: '09. Won / Confirmed', order: 9, badgeVariant: 'success', description: 'Converted to live event production' },
  { key: 'lost', label: '10. Lost / Disqualified', order: 10, badgeVariant: 'danger', description: 'Closed with loss analysis' },
];

interface CRMKanbanProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onUpdateStage: (leadId: string, stage: LeadStage) => void;
  onDraftQuotation: (leadId: string) => void;
  onInitiateHandover: (lead: Lead) => void;
  onMarkLost: (lead: Lead) => void;
}

export function CRMKanban({
  leads,
  onSelectLead,
  onUpdateStage,
  onDraftQuotation,
  onInitiateHandover,
  onMarkLost
}: CRMKanbanProps) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-[2800px]">
        {CRM_STAGES.map((stage) => {
          const stageLeads = leads.filter(l => l.stage === stage.key);
          const stageBudget = stageLeads.reduce((acc, l) => acc + l.estimatedBudget, 0);

          return (
            <div
              key={stage.key}
              className={`w-72 shrink-0 rounded-xl border p-3 flex flex-col max-h-[calc(100vh-14rem)] ${
                stage.key === 'converted'
                  ? 'bg-emerald-50/40 border-emerald-200/80'
                  : stage.key === 'lost'
                  ? 'bg-rose-50/30 border-rose-200/60'
                  : 'bg-zinc-50/70 border-zinc-200/80'
              }`}
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-zinc-200/70">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-900 tracking-tight">
                      {stage.label}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white text-zinc-600 border border-zinc-200 font-medium">
                      {stageLeads.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{stage.description}</p>
                </div>
                <span className="text-[11px] font-mono font-semibold text-zinc-700">
                  ₹{(stageBudget / 100000).toFixed(1)}L
                </span>
              </div>

              {/* Lead Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {stageLeads.map((lead) => {
                  const daysInStage = lead.daysInCurrentStage || 1;
                  const isStagnant = daysInStage >= 5 && stage.key !== 'converted' && stage.key !== 'lost';

                  return (
                    <div
                      key={lead.id}
                      className={`bg-white rounded-lg border p-3 shadow-2xs hover:border-zinc-400 transition-all space-y-2.5 relative group ${
                        isStagnant ? 'border-amber-300 ring-1 ring-amber-200' : 'border-zinc-200/80'
                      }`}
                    >
                      {/* Top Header: ID & Priority */}
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <span className="text-[10px] font-mono text-zinc-400 block leading-tight">
                            {lead.leadNumber || lead.id}
                          </span>
                          <h4
                            onClick={() => onSelectLead(lead)}
                            className="text-xs font-bold text-zinc-900 leading-snug hover:text-indigo-600 cursor-pointer"
                          >
                            {lead.title}
                          </h4>
                        </div>
                        <Badge
                          variant={lead.priority === 'urgent' ? 'danger' : lead.priority === 'high' ? 'warning' : 'neutral'}
                          dot
                          className="shrink-0 text-[10px] px-1.5 py-0"
                        >
                          {lead.priority}
                        </Badge>
                      </div>

                      {/* Client, Type & Guests */}
                      <div className="space-y-0.5 text-[11px] text-zinc-600">
                        <p className="font-semibold text-zinc-800">{lead.clientName}</p>
                        {lead.companyName && (
                          <p className="text-[10px] text-zinc-400 truncate">{lead.companyName}</p>
                        )}
                        <p className="text-[10px] text-zinc-500">
                          {lead.eventType} &bull; {lead.guestCount} guests
                        </p>
                      </div>

                      {/* Date & Scoring Tag */}
                      <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-zinc-100">
                        <span className="flex items-center gap-1 text-zinc-400">
                          <Calendar className="w-3 h-3" />
                          {lead.eventDate}
                        </span>

                        {lead.score && (
                          <span
                            className={`px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5 ${
                              lead.score.category === 'Hot Lead'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : lead.score.category === 'Warm Lead'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-zinc-50 text-zinc-600 border border-zinc-200'
                            }`}
                          >
                            <Flame className="w-2.5 h-2.5" />
                            {lead.score.totalScore} pts
                          </span>
                        )}
                      </div>

                      {/* Budget & Ageing */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-100 font-mono">
                        <span className="font-bold text-zinc-950">
                          ₹{formatCurrency(lead.estimatedBudget)}
                        </span>
                        <span
                          className={`text-[10px] flex items-center gap-0.5 ${
                            isStagnant ? 'text-amber-700 font-semibold' : 'text-zinc-400'
                          }`}
                        >
                          <Clock className="w-2.5 h-2.5" />
                          {daysInStage}d here
                        </span>
                      </div>

                      {/* Quick Action Controls */}
                      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-1 flex-wrap">
                        {/* Stage Selector */}
                        <select
                          value={lead.stage}
                          onChange={(e) => {
                            const newStage = e.target.value as LeadStage;
                            if (newStage === 'lost') {
                              onMarkLost(lead);
                            } else {
                              onUpdateStage(lead.id, newStage);
                            }
                          }}
                          className="text-[10px] bg-zinc-50 border border-zinc-200 rounded px-1.5 py-1 text-zinc-700 focus:outline-none cursor-pointer max-w-[110px] truncate"
                        >
                          {CRM_STAGES.map(s => (
                            <option key={s.key} value={s.key}>{s.label}</option>
                          ))}
                        </select>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[10px] h-6 px-1.5"
                            onClick={() => onSelectLead(lead)}
                            icon={<Eye className="w-3 h-3" />}
                          >
                            360
                          </Button>

                          {!lead.quotationId && lead.stage !== 'converted' && lead.stage !== 'lost' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[10px] h-6 px-1.5"
                              onClick={() => onDraftQuotation(lead.id)}
                            >
                              Quote
                            </Button>
                          )}

                          {lead.stage === 'awaiting_confirmation' && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="text-[10px] h-6 px-2 bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => onInitiateHandover(lead)}
                            >
                              Won & Handover
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {stageLeads.length === 0 && (
                  <div className="h-28 border border-dashed border-zinc-200 rounded-lg flex items-center justify-center text-zinc-400 text-[11px] text-center px-2">
                    No opportunities currently in {stage.label.toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
