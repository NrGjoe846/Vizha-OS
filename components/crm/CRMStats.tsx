'use client';

import React from 'react';
import { Lead } from '@/lib/types';
import { formatCurrency } from '@/lib/format';
import { StatCard } from '@/components/ui/StatCard';
import {
  Users,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Award
} from 'lucide-react';

interface CRMStatsProps {
  leads: Lead[];
  selectedBranch: string;
}

const STAGE_WEIGHTS: Record<string, number> = {
  new: 0.1,
  contacted: 0.2,
  qualified: 0.4,
  meeting_scheduled: 0.5,
  requirement_finalized: 0.6,
  proposal_sent: 0.7,
  negotiating: 0.8,
  awaiting_confirmation: 0.9,
  converted: 1.0,
  lost: 0.0
};

export function CRMStats({ leads, selectedBranch }: CRMStatsProps) {
  const totalLeads = leads.length;
  const activeOpportunities = leads.filter(l => l.stage !== 'converted' && l.stage !== 'lost');

  const totalPipelineValue = activeOpportunities.reduce((sum, l) => sum + l.estimatedBudget, 0);

  const weightedPipelineValue = activeOpportunities.reduce((sum, l) => {
    const weight = STAGE_WEIGHTS[l.stage] || 0.3;
    return sum + (l.estimatedBudget * weight);
  }, 0);

  const wonLeads = leads.filter(l => l.stage === 'converted');
  const wonRevenue = wonLeads.reduce((sum, l) => sum + (l.negotiation?.negotiatedPrice || l.estimatedBudget), 0);
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads.length / totalLeads) * 100) : 0;

  const avgDealSize = wonLeads.length > 0 ? Math.round(wonRevenue / wonLeads.length) : 0;

  // Calculate overdue follow-ups
  const today = new Date().toISOString().split('T')[0];
  const overdueFollowUps = leads.reduce((count, l) => {
    const overdue = (l.followUps || []).filter(fu => !fu.isCompleted && fu.scheduledDate < today);
    return count + overdue.length;
  }, 0);

  const hotLeadsCount = leads.filter(l => l.score?.category === 'Hot Lead' && l.stage !== 'converted' && l.stage !== 'lost').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Active Pipeline"
        value={`₹${(totalPipelineValue / 100000).toFixed(1)} Lakhs`}
        change={`${activeOpportunities.length} Active Deals`}
        changeType="positive"
        icon={<DollarSign className="w-4 h-4" />}
        description={`Branch: ${selectedBranch}`}
      />
      <StatCard
        label="Weighted Expected Revenue"
        value={`₹${(weightedPipelineValue / 100000).toFixed(1)} Lakhs`}
        change={`${hotLeadsCount} Hot Opportunities`}
        changeType="positive"
        icon={<TrendingUp className="w-4 h-4" />}
        description="Probability-adjusted pipeline forecast"
      />
      <StatCard
        label="Won Booking Conversion"
        value={`${conversionRate}%`}
        change={`₹${(wonRevenue / 100000).toFixed(1)}L Won (${wonLeads.length})`}
        changeType="positive"
        icon={<Award className="w-4 h-4" />}
        description={`Avg Deal: ₹${formatCurrency(avgDealSize)}`}
      />
      <StatCard
        label="Actionable Follow-ups"
        value={overdueFollowUps > 0 ? `${overdueFollowUps} Overdue` : 'All On Track'}
        change={overdueFollowUps > 0 ? 'Requires immediate action' : 'Zero SLA breaches'}
        changeType={overdueFollowUps > 0 ? 'negative' : 'positive'}
        icon={<AlertTriangle className="w-4 h-4" />}
        description="Daily sales cadence compliance"
      />
    </div>
  );
}
