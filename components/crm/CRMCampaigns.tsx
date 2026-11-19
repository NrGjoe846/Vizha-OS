'use client';

import React, { useState } from 'react';
import { CRMCampaign } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { StatCard } from '@/components/ui/StatCard';
import { formatCurrency } from '@/lib/format';
import {
  Share2,
  DollarSign,
  TrendingUp,
  Target,
  Plus,
  BarChart,
  Megaphone,
  CheckCircle2
} from 'lucide-react';

interface CRMCampaignsProps {
  campaigns: CRMCampaign[];
  onAddCampaign: (campaign: Omit<CRMCampaign, 'id' | 'leadsGenerated' | 'wonBookings' | 'revenueGenerated'>) => void;
}

export function CRMCampaigns({ campaigns, onAddCampaign }: CRMCampaignsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    source: 'Meta Ads',
    budget: 150000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    status: 'active' as const
  });

  const totalMarketingBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalRevenueGenerated = campaigns.reduce((sum, c) => sum + c.revenueGenerated, 0);
  const totalLeadsCaptured = campaigns.reduce((sum, c) => sum + c.leadsGenerated, 0);
  const overallROI = totalMarketingBudget > 0 ? Math.round(((totalRevenueGenerated - totalMarketingBudget) / totalMarketingBudget) * 100) : 0;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCampaign(formData);
    setIsModalOpen(false);
    setFormData({
      name: '',
      code: '',
      source: 'Meta Ads',
      budget: 150000,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      status: 'active'
    });
  };

  return (
    <div className="space-y-6">
      {/* Campaign Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Marketing Investment"
          value={`₹${(totalMarketingBudget / 100000).toFixed(1)} Lakhs`}
          change={`${campaigns.length} Active Campaigns`}
          changeType="neutral"
          icon={<DollarSign className="w-4 h-4" />}
          description="Cumulative ad spend & event sponsorships"
        />
        <StatCard
          label="Attributed Bookings Revenue"
          value={`₹${(totalRevenueGenerated / 100000).toFixed(1)} Lakhs`}
          change={`+${overallROI}% Return on Ad Spend`}
          changeType="positive"
          icon={<TrendingUp className="w-4 h-4" />}
          description="Direct revenue from closed opportunities"
        />
        <StatCard
          label="Lead Acquisition Cost (LAC)"
          value={`₹${totalLeadsCaptured > 0 ? Math.round(totalMarketingBudget / totalLeadsCaptured) : 0}`}
          change={`${totalLeadsCaptured} Inquiries Driven`}
          changeType="positive"
          icon={<Target className="w-4 h-4" />}
          description="Average marketing cost per qualified lead"
        />
        <StatCard
          label="Campaign Conversion"
          value={`${totalLeadsCaptured > 0 ? Math.round((campaigns.reduce((s, c) => s + c.wonBookings, 0) / totalLeadsCaptured) * 100) : 0}%`}
          change="Won Deals / Inquiries"
          changeType="positive"
          icon={<CheckCircle2 className="w-4 h-4" />}
          description="Channel acquisition efficiency"
        />
      </div>

      {/* Campaigns Table Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Marketing Campaigns & Source Attribution</CardTitle>
              <CardDescription>
                Track lead origins, acquisition efficiency, and verified booking revenue return
              </CardDescription>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              New Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200/80 font-mono text-[10px] uppercase text-zinc-500">
                <tr>
                  <th className="py-3 px-4">Campaign Name & Code</th>
                  <th className="py-3 px-4">Source Channel</th>
                  <th className="py-3 px-4 text-right">Budget</th>
                  <th className="py-3 px-4 text-center">Leads</th>
                  <th className="py-3 px-4 text-center">Won Bookings</th>
                  <th className="py-3 px-4 text-right">Revenue Generated</th>
                  <th className="py-3 px-4 text-right">Channel ROI</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {campaigns.map((c) => {
                  const roi = c.budget > 0 ? Math.round(((c.revenueGenerated - c.budget) / c.budget) * 100) : 0;
                  const lac = c.leadsGenerated > 0 ? Math.round(c.budget / c.leadsGenerated) : 0;

                  return (
                    <tr key={c.id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono text-[10px] text-zinc-400 block">{c.code}</span>
                        <p className="font-bold text-zinc-900">{c.name}</p>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {c.startDate} to {c.endDate}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant="purple">{c.source}</Badge>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-medium">
                        ₹{formatCurrency(c.budget)}
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold text-zinc-900">
                        {c.leadsGenerated}
                        <span className="block text-[10px] text-zinc-400 font-normal">LAC: ₹{lac}</span>
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold text-emerald-700">
                        {c.wonBookings}
                        <span className="block text-[10px] text-zinc-400 font-normal">
                          {c.leadsGenerated > 0 ? Math.round((c.wonBookings / c.leadsGenerated) * 100) : 0}% conv
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-zinc-950">
                        ₹{formatCurrency(c.revenueGenerated)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                        +{roi}%
                      </td>

                      <td className="py-3 px-4 text-center">
                        <Badge variant={c.status === 'active' ? 'success' : 'neutral'} dot>
                          {c.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* New Campaign Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create Marketing Campaign"
          description="Register marketing initiative to track inquiry provenance and ROI."
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreate}>
                Save Campaign
              </Button>
            </>
          }
        >
          <form onSubmit={handleCreate} className="space-y-3.5">
            <Input
              label="Campaign Name"
              required
              placeholder="e.g. Luxury Wedding Showcase 2027"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Campaign Code"
                placeholder="e.g. WED-2027-BLITZ"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />

              <Select
                label="Lead Source Channel"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              >
                <option value="Meta Ads">Meta Ads (Facebook/Instagram)</option>
                <option value="Google Ads">Google Search & Display</option>
                <option value="Instagram">Instagram Influencers</option>
                <option value="WhatsApp">WhatsApp Inbound API</option>
                <option value="Referral">HNI & Venue Referrals</option>
                <option value="Website">Website Organic</option>
                <option value="Offline">Trade Exhibitions</option>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Allocated Budget (₹)"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
              />
              <Input
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              <Input
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
