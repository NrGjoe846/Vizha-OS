'use client';

import React, { useState } from 'react';
import { Lead, LeadStage } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/format';
import { CRM_STAGES } from './CRMKanban';
import {
  Eye,
  FileText,
  AlertTriangle,
  Flame,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Building,
  User,
  Copy
} from 'lucide-react';

interface CRMTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onUpdateStage: (leadId: string, stage: LeadStage) => void;
  onDraftQuotation: (leadId: string) => void;
  onInitiateHandover: (lead: Lead) => void;
  onMarkLost: (lead: Lead) => void;
}

export function CRMTable({
  leads,
  onSelectLead,
  onUpdateStage,
  onDraftQuotation,
  onInitiateHandover,
  onMarkLost
}: CRMTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const [repFilter, setRepFilter] = useState<string>('all');

  // Find duplicate contacts (matching phone or email)
  const phoneCounts = leads.reduce((acc, l) => {
    const p = l.phone.replace(/[^0-9]/g, '');
    if (p) acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const emailCounts = leads.reduce((acc, l) => {
    const em = l.email.toLowerCase().trim();
    if (em) acc[em] = (acc[em] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredLeads = leads.filter(l => {
    const matchesSearch =
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      (l.leadNumber && l.leadNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStage = stageFilter === 'all' || l.stage === stageFilter;
    const matchesPriority = priorityFilter === 'all' || l.priority === priorityFilter;
    const matchesScore = scoreFilter === 'all' || l.score?.category === scoreFilter;
    const matchesRep = repFilter === 'all' || l.assignedTo === repFilter;

    return matchesSearch && matchesStage && matchesPriority && matchesScore && matchesRep;
  });

  const reps = Array.from(new Set(leads.map(l => l.assignedTo)));

  return (
    <div className="space-y-3">
      {/* Search & Advanced Filters Strip */}
      <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="w-56">
            <Input
              placeholder="Search title, name, phone, lead #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-3.5 h-3.5" />}
            />
          </div>

          <Select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="w-40 text-xs"
          >
            <option value="all">All Pipeline Stages</option>
            {CRM_STAGES.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </Select>

          <Select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
            className="w-32 text-xs"
          >
            <option value="all">All Scores</option>
            <option value="Hot Lead">Hot Leads (80+)</option>
            <option value="Warm Lead">Warm Leads (50-79)</option>
            <option value="Cold Lead">Cold Leads (&lt;50)</option>
          </Select>

          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-28 text-xs"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>

          <Select
            value={repFilter}
            onChange={(e) => setRepFilter(e.target.value)}
            className="w-36 text-xs"
          >
            <option value="all">All Sales Owners</option>
            {reps.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </Select>
        </div>

        <span className="font-mono text-zinc-500 text-[11px]">
          Showing {filteredLeads.length} of {leads.length} records
        </span>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200/80 font-mono text-[10px] uppercase text-zinc-500">
              <tr>
                <th className="py-3 px-3.5">Opportunity # / Title</th>
                <th className="py-3 px-3.5">Client Contact</th>
                <th className="py-3 px-3.5">Event Category & Date</th>
                <th className="py-3 px-3.5 text-right">Budget Value</th>
                <th className="py-3 px-3.5 text-center">Score</th>
                <th className="py-3 px-3.5">Current Stage</th>
                <th className="py-3 px-3.5">Sales Owner</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {filteredLeads.map((l) => {
                const cleanPhone = l.phone.replace(/[^0-9]/g, '');
                const cleanEmail = l.email.toLowerCase().trim();
                const isDuplicate = (phoneCounts[cleanPhone] > 1) || (emailCounts[cleanEmail] > 1);
                const currentStageMeta = CRM_STAGES.find(s => s.key === l.stage);

                return (
                  <tr key={l.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-zinc-400 font-medium">
                          {l.leadNumber || l.id}
                        </span>
                        {isDuplicate && (
                          <span
                            title="Multiple inquiries detected for this contact"
                            className="bg-amber-100 text-amber-800 text-[9px] px-1 rounded flex items-center gap-0.5 border border-amber-300 font-mono"
                          >
                            <Copy className="w-2.5 h-2.5" /> Duplicate Match
                          </span>
                        )}
                      </div>
                      <p
                        onClick={() => onSelectLead(l)}
                        className="font-bold text-zinc-900 hover:text-indigo-600 cursor-pointer"
                      >
                        {l.title}
                      </p>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        Source: {l.source} {l.campaign ? `(${l.campaign})` : ''}
                      </span>
                    </td>

                    <td className="py-3 px-3.5">
                      <p className="font-semibold text-zinc-900">{l.clientName}</p>
                      {l.companyName && (
                        <p className="text-[10px] text-zinc-400 truncate max-w-xs">{l.companyName}</p>
                      )}
                      <p className="text-[10px] font-mono text-zinc-500">{l.phone}</p>
                    </td>

                    <td className="py-3 px-3.5">
                      <p className="font-medium text-zinc-800">{l.eventType}</p>
                      <p className="text-[10px] font-mono text-zinc-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-zinc-400" /> {l.eventDate} &bull; {l.guestCount} guests
                      </p>
                    </td>

                    <td className="py-3 px-3.5 text-right font-mono font-bold text-zinc-950">
                      ₹{formatCurrency(l.estimatedBudget)}
                    </td>

                    <td className="py-3 px-3.5 text-center">
                      {l.score ? (
                        <span
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            l.score.category === 'Hot Lead'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : l.score.category === 'Warm Lead'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                          }`}
                        >
                          <Flame className="w-3 h-3" />
                          {l.score.totalScore}
                        </span>
                      ) : (
                        <span className="text-zinc-400 text-[10px] font-mono">—</span>
                      )}
                    </td>

                    <td className="py-3 px-3.5">
                      <Badge variant={currentStageMeta?.badgeVariant || 'neutral'} dot>
                        {currentStageMeta?.label || l.stage}
                      </Badge>
                      <span className="block text-[10px] font-mono text-zinc-400 mt-0.5">
                        {l.daysInCurrentStage || 1}d in stage
                      </span>
                    </td>

                    <td className="py-3 px-3.5">
                      <p className="font-medium text-zinc-900">{l.assignedTo}</p>
                      <span className="text-[10px] font-mono text-zinc-400">{l.branchName || 'Mumbai HQ'}</span>
                    </td>

                    <td className="py-3 px-3.5 text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[11px] h-7"
                        onClick={() => onSelectLead(l)}
                        icon={<Eye className="w-3.5 h-3.5" />}
                      >
                        360
                      </Button>

                      {l.stage === 'awaiting_confirmation' && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="text-[11px] h-7 bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => onInitiateHandover(l)}
                        >
                          Won
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
