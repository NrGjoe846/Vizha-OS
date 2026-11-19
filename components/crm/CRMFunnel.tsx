'use client';

import React from 'react';
import { Lead } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/format';
import {
  TrendingUp,
  Award,
  AlertOctagon,
  Share2,
  Users,
  Target,
  ArrowRight
} from 'lucide-react';

interface CRMFunnelProps {
  leads: Lead[];
}

export function CRMFunnel({ leads }: CRMFunnelProps) {
  const total = leads.length || 1;

  // Funnel stage aggregations
  const stageCounts = {
    inquiries: leads.length,
    contacted: leads.filter(l => l.stage !== 'new').length,
    qualified: leads.filter(l => !['new', 'contacted', 'lost'].includes(l.stage) || (l.stage === 'lost' && l.score && l.score.totalScore > 50)).length,
    proposals: leads.filter(l => ['proposal_sent', 'negotiating', 'awaiting_confirmation', 'converted'].includes(l.stage)).length,
    negotiations: leads.filter(l => ['negotiating', 'awaiting_confirmation', 'converted'].includes(l.stage)).length,
    won: leads.filter(l => l.stage === 'converted').length
  };

  const funnelSteps = [
    { label: '01. Inbound Inquiries', count: stageCounts.inquiries, pct: 100, color: 'bg-zinc-800' },
    { label: '02. First Contact Completed', count: stageCounts.contacted, pct: Math.round((stageCounts.contacted / total) * 100), color: 'bg-blue-600' },
    { label: '03. Commercially Qualified', count: stageCounts.qualified, pct: Math.round((stageCounts.qualified / total) * 100), color: 'bg-indigo-600' },
    { label: '04. Proposal / Quote Submitted', count: stageCounts.proposals, pct: Math.round((stageCounts.proposals / total) * 100), color: 'bg-amber-600' },
    { label: '05. Commercial Negotiation', count: stageCounts.negotiations, pct: Math.round((stageCounts.negotiations / total) * 100), color: 'bg-orange-600' },
    { label: '06. Won Event Booking', count: stageCounts.won, pct: Math.round((stageCounts.won / total) * 100), color: 'bg-emerald-600' },
  ];

  // Lead Sources breakdown
  const sourceMap = leads.reduce((acc, l) => {
    acc[l.source] = (acc[l.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Lost reasons breakdown
  const lostLeads = leads.filter(l => l.stage === 'lost' && l.lossRecord);
  const lostReasons = lostLeads.reduce((acc, l) => {
    const reason = l.lossRecord?.lossReason || 'Other';
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Salesperson Leaderboard
  const repPerformance = leads.reduce((acc, l) => {
    const rep = l.assignedTo || 'Unassigned';
    if (!acc[rep]) {
      acc[rep] = { totalLeads: 0, wonLeads: 0, pipelineVal: 0, wonVal: 0 };
    }
    acc[rep].totalLeads += 1;
    if (l.stage === 'converted') {
      acc[rep].wonLeads += 1;
      acc[rep].wonVal += (l.negotiation?.negotiatedPrice || l.estimatedBudget);
    } else if (l.stage !== 'lost') {
      acc[rep].pipelineVal += l.estimatedBudget;
    }
    return acc;
  }, {} as Record<string, { totalLeads: number; wonLeads: number; pipelineVal: number; wonVal: number }>);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Visual Conversion Funnel */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sales Conversion Funnel</CardTitle>
              <CardDescription>Stage-by-stage progression from initial lead to confirmed booking</CardDescription>
            </div>
            <Badge variant="success" dot className="font-mono text-xs">
              {stageCounts.won} Confirmed ({Math.round((stageCounts.won / total) * 100)}% Win Rate)
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-3">
            {funnelSteps.map((step, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-zinc-900">{step.label}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-zinc-500">{step.count} Deals</span>
                    <span className="font-semibold text-zinc-950">({step.pct}%)</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden p-0.5 border border-zinc-200/50">
                  <div
                    className={`h-full ${step.color} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(6, step.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-100 text-xs font-mono text-center">
            <div className="p-2.5 bg-zinc-50 rounded-lg border border-zinc-200/60">
              <span className="text-[10px] uppercase text-zinc-400 block">Lead-to-Quote</span>
              <span className="font-bold text-zinc-900 text-sm">
                {Math.round((stageCounts.proposals / (stageCounts.qualified || 1)) * 100)}%
              </span>
            </div>
            <div className="p-2.5 bg-zinc-50 rounded-lg border border-zinc-200/60">
              <span className="text-[10px] uppercase text-zinc-400 block">Quote-to-Negotiation</span>
              <span className="font-bold text-zinc-900 text-sm">
                {Math.round((stageCounts.negotiations / (stageCounts.proposals || 1)) * 100)}%
              </span>
            </div>
            <div className="p-2.5 bg-zinc-50 rounded-lg border border-zinc-200/60">
              <span className="text-[10px] uppercase text-zinc-400 block">Negotiation-to-Won</span>
              <span className="font-bold text-emerald-700 text-sm">
                {Math.round((stageCounts.won / (stageCounts.negotiations || 1)) * 100)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Column: Sources & Loss Analysis */}
      <div className="space-y-6">
        {/* Lead Source Effectiveness */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-xs">
              <Share2 className="w-3.5 h-3.5 text-zinc-500" />
              <span>Marketing Channels & Sources</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-2">
            {Object.entries(sourceMap).map(([src, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={src} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-700">{src}</span>
                    <span className="font-mono text-zinc-500">{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-800 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Lost Reason Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5 text-xs text-rose-700">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
              <span>Loss Reason Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-2 text-xs">
            {Object.keys(lostReasons).length > 0 ? (
              Object.entries(lostReasons).map(([reason, count]) => (
                <div key={reason} className="p-2 bg-rose-50/60 border border-rose-200/60 rounded flex justify-between items-center">
                  <span className="text-zinc-800 font-medium">{reason}</span>
                  <span className="font-mono text-rose-700 font-semibold">{count} Deals</span>
                </div>
              ))
            ) : (
              <p className="text-zinc-400 text-xs">No lost leads recorded.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Salesperson Leaderboard Strip */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-4 h-4 text-zinc-600" />
                <span>Sales Team Productivity & Quota Attainment</span>
              </CardTitle>
              <CardDescription>Individual pipeline volume, win conversions, and closed revenue</CardDescription>
            </div>
            <Badge variant="neutral" className="font-mono text-xs">
              Monthly Target: ₹1.5 Cr
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(repPerformance).map(([rep, stats]) => (
              <div key={rep} className="p-3.5 bg-zinc-50 border border-zinc-200/70 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-zinc-900">{rep}</h4>
                  <Badge variant={stats.wonLeads > 0 ? 'success' : 'neutral'} dot>
                    {stats.wonLeads} Won
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 border-t border-zinc-200/60">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Active Pipeline</span>
                    <span className="font-semibold text-zinc-900">₹{formatCurrency(stats.pipelineVal)}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Revenue Closed</span>
                    <span className="font-bold text-emerald-700">₹{formatCurrency(stats.wonVal)}</span>
                  </div>
                </div>
                <div className="text-[10px] text-zinc-500 flex justify-between pt-1">
                  <span>Total Opportunities: {stats.totalLeads}</span>
                  <span>Win Rate: {Math.round((stats.wonLeads / (stats.totalLeads || 1)) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
