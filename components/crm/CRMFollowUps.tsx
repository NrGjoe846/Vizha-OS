'use client';

import React, { useState } from 'react';
import { Lead, CRMFollowUp } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import {
  Calendar,
  Clock,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  User,
  Plus,
  Send,
  Check,
  X
} from 'lucide-react';

interface CRMFollowUpsProps {
  leads: Lead[];
  onCompleteFollowUp: (followUpId: string, outcome: string) => void;
  onScheduleFollowUp: (leadId: string, followUp: Omit<CRMFollowUp, 'id' | 'leadId' | 'isCompleted'>) => void;
  onSelectLead: (lead: Lead) => void;
}

export function CRMFollowUps({
  leads,
  onCompleteFollowUp,
  onScheduleFollowUp,
  onSelectLead
}: CRMFollowUpsProps) {
  const [filterView, setFilterView] = useState<'today' | 'overdue' | 'all'>('today');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [isOutcomeModalOpen, setIsOutcomeModalOpen] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<CRMFollowUp | null>(null);
  const [outcomeVal, setOutcomeVal] = useState<string>('interested');

  const [newFollowUpData, setNewFollowUpData] = useState({
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '11:00 AM',
    assignedTo: 'Rajesh Verma',
    priority: 'high' as const,
    activityType: 'call' as const,
    notes: 'Follow up on proposal review and confirm meeting.'
  });

  const today = new Date().toISOString().split('T')[0];

  // Flatten all follow-ups across all leads
  const allFollowUps: (CRMFollowUp & { parentLead?: Lead })[] = [];
  leads.forEach(l => {
    (l.followUps || []).forEach(fu => {
      allFollowUps.push({ ...fu, parentLead: l });
    });
  });

  const overdueList = allFollowUps.filter(f => !f.isCompleted && f.scheduledDate < today);
  const todayList = allFollowUps.filter(f => !f.isCompleted && f.scheduledDate === today);
  const upcomingList = allFollowUps.filter(f => !f.isCompleted && f.scheduledDate > today);
  const completedList = allFollowUps.filter(f => f.isCompleted);

  const displayedList =
    filterView === 'overdue'
      ? overdueList
      : filterView === 'today'
      ? todayList
      : allFollowUps.filter(f => !f.isCompleted);

  // Check leads with zero scheduled actions (Violation of non-negotiable rule in Section 6)
  const leadsMissingNextAction = leads.filter(l =>
    l.stage !== 'converted' && l.stage !== 'lost' && (!l.followUps || l.followUps.every(f => f.isCompleted))
  );

  const handleSaveFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find(l => l.id === selectedLeadId);
    if (!lead) return;

    onScheduleFollowUp(lead.id, {
      leadTitle: lead.title,
      clientName: lead.clientName,
      scheduledDate: newFollowUpData.scheduledDate,
      scheduledTime: newFollowUpData.scheduledTime,
      assignedTo: newFollowUpData.assignedTo,
      priority: newFollowUpData.priority,
      activityType: newFollowUpData.activityType,
      notes: newFollowUpData.notes
    });

    setIsScheduleModalOpen(false);
  };

  const handleConfirmOutcome = () => {
    if (!selectedFollowUp) return;
    onCompleteFollowUp(selectedFollowUp.id, outcomeVal);
    setIsOutcomeModalOpen(false);
    setSelectedFollowUp(null);
  };

  return (
    <div className="space-y-6">
      {/* Policy Warning Banner if leads are missing next action */}
      {leadsMissingNextAction.length > 0 && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Next Action Policy Alert:</span>{' '}
              {leadsMissingNextAction.length} active opportunities have no scheduled next step.
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 border-amber-300 text-amber-900 bg-white"
            onClick={() => {
              if (leadsMissingNextAction[0]) {
                setSelectedLeadId(leadsMissingNextAction[0].id);
                setIsScheduleModalOpen(true);
              }
            }}
          >
            Fix Next Action
          </Button>
        </div>
      )}

      {/* Control Strip */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => setFilterView('today')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              filterView === 'today' ? 'bg-white shadow-2xs text-zinc-950 font-semibold' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Today ({todayList.length})
          </button>
          <button
            onClick={() => setFilterView('overdue')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              filterView === 'overdue' ? 'bg-white shadow-2xs text-rose-700 font-semibold' : 'text-zinc-600 hover:text-rose-600'
            }`}
          >
            Overdue ({overdueList.length})
          </button>
          <button
            onClick={() => setFilterView('all')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              filterView === 'all' ? 'bg-white shadow-2xs text-zinc-950 font-semibold' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            All Pending ({todayList.length + overdueList.length + upcomingList.length})
          </button>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsScheduleModalOpen(true)}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          Schedule Follow-up
        </Button>
      </div>

      {/* Follow-up Tasks List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sales Interaction Schedule & Cadence</CardTitle>
              <CardDescription>
                Phone outreach, WhatsApp discussions, physical site surveys, and meeting commitments
              </CardDescription>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              Completed Today: {completedList.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {displayedList.length > 0 ? (
            <div className="divide-y divide-zinc-100">
              {displayedList.map((item) => {
                const isOverdue = item.scheduledDate < today;

                return (
                  <div
                    key={item.id}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50/70 transition-colors ${
                      isOverdue ? 'bg-rose-50/20' : ''
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-950 text-xs">{item.clientName}</span>
                        <span className="text-[11px] text-zinc-500 truncate">({item.leadTitle})</span>
                        <Badge
                          variant={
                            item.priority === 'urgent'
                              ? 'danger'
                              : item.priority === 'high'
                              ? 'warning'
                              : 'neutral'
                          }
                          dot
                        >
                          {item.priority}
                        </Badge>
                      </div>

                      <p className="text-xs text-zinc-700">{item.notes}</p>

                      <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                        <span className={`flex items-center gap-1 ${isOverdue ? 'text-rose-700 font-bold' : ''}`}>
                          <Calendar className="w-3 h-3" />
                          {item.scheduledDate} &bull; {item.scheduledTime}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 text-zinc-600">
                          <User className="w-3 h-3" /> {item.assignedTo}
                        </span>
                        <span>&bull;</span>
                        <span className="uppercase text-[10px] bg-zinc-100 px-1.5 py-0.2 rounded border border-zinc-200">
                          {item.activityType}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      {item.parentLead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => onSelectLead(item.parentLead!)}
                        >
                          Lead 360
                        </Button>
                      )}

                      <Button
                        variant="primary"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => {
                          setSelectedFollowUp(item);
                          setIsOutcomeModalOpen(true);
                        }}
                        icon={<Check className="w-3 h-3" />}
                      >
                        Record Outcome
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-400 text-xs">
              No follow-ups scheduled in this view.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Record Outcome Modal */}
      {isOutcomeModalOpen && selectedFollowUp && (
        <Modal
          isOpen={isOutcomeModalOpen}
          onClose={() => setIsOutcomeModalOpen(false)}
          title={`Log Outcome for ${selectedFollowUp.clientName}`}
          description={`Action: ${selectedFollowUp.activityType.toUpperCase()} - ${selectedFollowUp.notes}`}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setIsOutcomeModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmOutcome}>
                Save Outcome & Complete
              </Button>
            </>
          }
        >
          <div className="space-y-3.5">
            <Select
              label="Interaction Outcome"
              value={outcomeVal}
              onChange={(e) => setOutcomeVal(e.target.value)}
            >
              <option value="interested">Interested - Progressing</option>
              <option value="proposal_requested">Proposal / Quotation Requested</option>
              <option value="meeting_scheduled">Site Visit / Meeting Scheduled</option>
              <option value="price_negotiation">Price & Terms Negotiation</option>
              <option value="call_back_later">Call Back Later / Busy</option>
              <option value="not_reachable">Not Reachable / No Answer</option>
              <option value="booking_confirmed">Booking Confirmed!</option>
              <option value="not_interested">Not Interested / Disqualified</option>
            </Select>

            <p className="text-xs text-zinc-500">
              Completing this interaction will archive this follow-up, append the activity to the customer timeline, and prompt for next steps.
            </p>
          </div>
        </Modal>
      )}

      {/* Schedule Follow-up Modal */}
      {isScheduleModalOpen && (
        <Modal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          title="Schedule Next Follow-Up"
          description="Commit to a specific next touchpoint to maintain commercial momentum."
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setIsScheduleModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveFollowUp}>
                Schedule Action
              </Button>
            </>
          }
        >
          <form onSubmit={handleSaveFollowUp} className="space-y-3.5">
            <Select
              label="Select Opportunity / Client"
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
            >
              {leads.map(l => (
                <option key={l.id} value={l.id}>
                  {l.clientName} &bull; {l.title} ({l.leadNumber || l.id})
                </option>
              ))}
            </Select>

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Activity Channel"
                value={newFollowUpData.activityType}
                onChange={(e) => setNewFollowUpData({ ...newFollowUpData, activityType: e.target.value as any })}
              >
                <option value="call">Phone Call</option>
                <option value="whatsapp">WhatsApp Message</option>
                <option value="meeting">In-Person Meeting</option>
                <option value="site_visit">Venue / Site Visit</option>
                <option value="email">Email</option>
              </Select>

              <Select
                label="Priority Level"
                value={newFollowUpData.priority}
                onChange={(e) => setNewFollowUpData({ ...newFollowUpData, priority: e.target.value as any })}
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Scheduled Date"
                type="date"
                value={newFollowUpData.scheduledDate}
                onChange={(e) => setNewFollowUpData({ ...newFollowUpData, scheduledDate: e.target.value })}
              />
              <Input
                label="Scheduled Time"
                value={newFollowUpData.scheduledTime}
                onChange={(e) => setNewFollowUpData({ ...newFollowUpData, scheduledTime: e.target.value })}
              />
            </div>

            <Input
              label="Action Objective & Notes"
              required
              placeholder="e.g. Present revised proposal with DJ & Lighting breakdown"
              value={newFollowUpData.notes}
              onChange={(e) => setNewFollowUpData({ ...newFollowUpData, notes: e.target.value })}
            />
          </form>
        </Modal>
      )}
    </div>
  );
}
