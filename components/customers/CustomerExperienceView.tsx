'use client';

import React, { useState } from 'react';
import { Client, CustomerFeedbackRecord, CustomerComplaint } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Star, AlertOctagon, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

interface CustomerExperienceViewProps {
  clients: Client[];
  onSelectCustomer: (client: Client) => void;
  onResolveComplaint: (customerId: string, complaintId: string, resolutionNotes: string) => void;
}

export function CustomerExperienceView({
  clients,
  onSelectCustomer,
  onResolveComplaint
}: CustomerExperienceViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'feedback' | 'complaints'>('feedback');

  const allFeedback: { fb: CustomerFeedbackRecord; client: Client }[] = [];
  const allComplaints: { complaint: CustomerComplaint; client: Client }[] = [];

  clients.forEach(c => {
    (c.feedback || []).forEach(f => {
      allFeedback.push({ fb: f, client: c });
    });
    (c.complaints || []).forEach(comp => {
      allComplaints.push({ complaint: comp, client: c });
    });
  });

  const avgCSAT = allFeedback.length > 0
    ? Math.round(allFeedback.reduce((sum, f) => sum + f.fb.csatScore, 0) / allFeedback.length)
    : 95;

  const avgRating = allFeedback.length > 0
    ? (allFeedback.reduce((sum, f) => sum + f.fb.rating, 0) / allFeedback.length).toFixed(1)
    : '4.8';

  const openComplaintsCount = allComplaints.filter(c => c.complaint.status !== 'resolved' && c.complaint.status !== 'closed').length;

  return (
    <div className="space-y-4">
      {/* Experience Overview KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-zinc-200/80 rounded-xl space-y-1">
          <span className="text-xs text-zinc-500 font-medium">Average CSAT Satisfaction</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-950">{avgCSAT}%</span>
            <span className="text-[11px] font-medium text-emerald-600">Top Quartile</span>
          </div>
          <p className="text-[10px] text-zinc-400">Based on {allFeedback.length} verified post-event evaluations</p>
        </div>

        <div className="p-4 bg-white border border-zinc-200/80 rounded-xl space-y-1">
          <span className="text-xs text-zinc-500 font-medium">Overall Experience Rating</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-950 flex items-center gap-1">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" /> {avgRating} / 5.0
            </span>
          </div>
          <p className="text-[10px] text-zinc-400">Average across decor, catering, sound and hospitality</p>
        </div>

        <div className="p-4 bg-white border border-zinc-200/80 rounded-xl space-y-1">
          <span className="text-xs text-zinc-500 font-medium">Active Complaint Tickets</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${openComplaintsCount > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
              {openComplaintsCount} Pending
            </span>
          </div>
          <p className="text-[10px] text-zinc-400">{allComplaints.length - openComplaintsCount} resolved tickets closed</p>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center gap-2 p-1 bg-zinc-100 rounded-lg border border-zinc-200/70 w-fit text-xs">
        <button
          onClick={() => setActiveSubTab('feedback')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeSubTab === 'feedback' ? 'bg-white text-zinc-950 shadow-xs font-semibold' : 'text-zinc-600'
          }`}
        >
          Customer Reviews ({allFeedback.length})
        </button>
        <button
          onClick={() => setActiveSubTab('complaints')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeSubTab === 'complaints' ? 'bg-white text-zinc-950 shadow-xs font-semibold' : 'text-zinc-600'
          }`}
        >
          Complaint & Issue Tickets ({allComplaints.length})
        </button>
      </div>

      {/* FEEDBACK LIST */}
      {activeSubTab === 'feedback' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {allFeedback.map(({ fb, client }) => (
            <div key={fb.id} className="p-4 bg-white border border-zinc-200/80 rounded-xl space-y-2 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">{fb.eventName || 'Event Production'}</h4>
                  <p className="text-[11px] text-zinc-500">
                    Customer: <button onClick={() => onSelectCustomer(client)} className="font-semibold text-zinc-800 hover:underline">{client.name}</button>
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold text-xs font-mono">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {fb.rating} / 5.0
                </div>
              </div>

              <p className="text-zinc-700 italic text-[11px] bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                "{fb.comments}"
              </p>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1 border-t border-zinc-100">
                <span>CSAT: <strong>{fb.csatScore}%</strong> &bull; NPS: <strong>{fb.recommendationScore}/10</strong></span>
                <span>Date: {fb.feedbackDate}</span>
              </div>
            </div>
          ))}

          {allFeedback.length === 0 && (
            <div className="col-span-full py-12 text-center text-zinc-400">
              No feedback records logged yet.
            </div>
          )}
        </div>
      )}

      {/* COMPLAINTS LIST */}
      {activeSubTab === 'complaints' && (
        <div className="space-y-3">
          {allComplaints.map(({ complaint, client }) => (
            <div key={complaint.id} className="p-4 bg-white border border-zinc-200/80 rounded-xl space-y-2 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-900">{complaint.ticketNo}</span>
                    <Badge
                      variant={complaint.status === 'resolved' || complaint.status === 'closed' ? 'success' : 'danger'}
                      className="text-[10px]"
                    >
                      {complaint.status}
                    </Badge>
                    <span className="text-[10px] font-mono uppercase bg-zinc-100 text-zinc-600 px-1.5 py-0.2 rounded border border-zinc-200">
                      {complaint.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-zinc-900 text-sm mt-1">{complaint.title}</h4>
                  <p className="text-[11px] text-zinc-500">
                    Customer: <button onClick={() => onSelectCustomer(client)} className="font-semibold text-zinc-800 hover:underline">{client.name}</button> &bull; Assigned to: {complaint.assignedTo}
                  </p>
                </div>

                <span className="font-mono text-[10px] text-zinc-400">{complaint.createdAt}</span>
              </div>

              <p className="text-zinc-700 text-[11px] bg-zinc-50 p-2.5 rounded-lg border border-zinc-100">
                {complaint.description}
              </p>

              {complaint.resolutionNotes && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-[11px]">
                  <strong>Resolution Notes:</strong> {complaint.resolutionNotes} (Resolved: {complaint.resolvedAt})
                </div>
              )}

              {complaint.status !== 'resolved' && complaint.status !== 'closed' && (
                <div className="pt-2 border-t border-zinc-100 flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-[11px] h-7"
                    onClick={() => {
                      const resNotes = prompt('Enter resolution notes:');
                      if (resNotes) {
                        onResolveComplaint(client.id, complaint.id, resNotes);
                      }
                    }}
                  >
                    Mark Ticket Resolved
                  </Button>
                </div>
              )}
            </div>
          ))}

          {allComplaints.length === 0 && (
            <div className="py-12 text-center text-zinc-400">
              No active or historical complaints logged.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
