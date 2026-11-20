'use client';

import React from 'react';
import { Client } from '@/lib/types';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency } from '@/lib/format';
import {
  Users,
  Award,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Repeat,
  Building2,
  Share2
} from 'lucide-react';

interface CustomerDashboardStatsProps {
  clients: Client[];
  selectedBranch: string;
}

export function CustomerDashboardStats({ clients, selectedBranch }: CustomerDashboardStatsProps) {
  const totalCustomers = clients.length;
  const activeCustomers = clients.filter(c => c.status === 'active' || !c.status);
  const inactiveCustomers = clients.filter(c => c.status === 'inactive');
  const vipCustomers = clients.filter(c => c.category === 'VIP' || c.category === 'Premium');
  const corporateCustomers = clients.filter(c => c.customerType === 'Corporate' || c.customerType === 'Institution' || c.companyName);
  const returningCustomers = clients.filter(c => (c.totalBookings || 0) > 1);

  const totalLifetimeSpent = clients.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const totalOutstanding = clients.reduce((sum, c) => sum + (c.totalOutstanding || 0), 0);

  const totalComplaints = clients.reduce((sum, c) => sum + (c.complaints?.filter(comp => comp.status !== 'resolved' && comp.status !== 'closed').length || 0), 0);
  const totalReferrals = clients.reduce((sum, c) => sum + (c.referralCount || 0), 0);

  const retentionRate = totalCustomers > 0 ? Math.round((returningCustomers.length / totalCustomers) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Master Directory"
        value={totalCustomers}
        change={`${activeCustomers.length} Active • ${inactiveCustomers.length} Inactive`}
        changeType="positive"
        icon={<Users className="w-4 h-4" />}
        description={`Branch: ${selectedBranch}`}
      />
      <StatCard
        label="Customer Lifetime Value (CLV)"
        value={`₹${(totalLifetimeSpent / 100000).toFixed(1)} Lakhs`}
        change={`${vipCustomers.length} VIP / Strategic Accounts`}
        changeType="positive"
        icon={<TrendingUp className="w-4 h-4" />}
        description="Cumulative business value across productions"
      />
      <StatCard
        label="Repeat Retention Rate"
        value={`${retentionRate}%`}
        change={`${returningCustomers.length} Returning Customers`}
        changeType="positive"
        icon={<Repeat className="w-4 h-4" />}
        description={`${totalReferrals} Customer Referrals Generated`}
      />
      <StatCard
        label="Receivables & SLA Health"
        value={totalOutstanding > 0 ? `₹${(totalOutstanding / 100000).toFixed(1)}L Due` : '₹0 Outstanding'}
        change={totalComplaints > 0 ? `${totalComplaints} Active Tickets` : 'Zero Complaints Pending'}
        changeType={totalOutstanding > 0 || totalComplaints > 0 ? 'negative' : 'positive'}
        icon={<AlertTriangle className="w-4 h-4" />}
        description="Authoritative financial & service health"
      />
    </div>
  );
}
