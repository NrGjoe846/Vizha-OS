'use client';

import React, { useState } from 'react';
import { Lead, LeadStage, CRMCampaign } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/format';
import { AlertTriangle, Copy, Sparkles, Check } from 'lucide-react';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  existingLeads: Lead[];
  campaigns: CRMCampaign[];
}

export function NewLeadModal({
  isOpen,
  onClose,
  onAddLead,
  existingLeads,
  campaigns
}: NewLeadModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    companyName: '',
    phone: '',
    alternatePhone: '',
    email: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    eventType: 'Luxury Wedding',
    estimatedBudget: 4500000,
    guestCount: 350,
    eventDate: '2027-01-15',
    eventEndDate: '2027-01-16',
    eventLocation: 'The Grand Oberoi Ballroom, Mumbai',
    source: 'Website',
    campaign: campaigns[0]?.name || 'Wedding Season Blitz 2026',
    stage: 'new' as LeadStage,
    priority: 'high' as const,
    assignedTo: 'Rajesh Verma',
    branchName: 'Mumbai HQ',
    notes: ''
  });

  // Duplicate contact detection
  const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
  const cleanEmail = formData.email.trim().toLowerCase();

  const phoneMatch = cleanPhone.length >= 7
    ? existingLeads.find(l => l.phone.replace(/[^0-9]/g, '').includes(cleanPhone))
    : null;

  const emailMatch = cleanEmail.length >= 5
    ? existingLeads.find(l => l.email.trim().toLowerCase() === cleanEmail)
    : null;

  const duplicateMatch = phoneMatch || emailMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLead({
      leadNumber: `LEAD-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: formData.title || `${formData.clientName} - ${formData.eventType}`,
      clientName: formData.clientName,
      companyName: formData.companyName || undefined,
      phone: formData.phone,
      alternatePhone: formData.alternatePhone || undefined,
      email: formData.email,
      city: formData.city,
      state: formData.state,
      eventType: formData.eventType,
      estimatedBudget: Number(formData.estimatedBudget),
      guestCount: Number(formData.guestCount),
      eventDate: formData.eventDate,
      eventEndDate: formData.eventEndDate,
      eventLocation: formData.eventLocation,
      source: formData.source,
      campaign: formData.campaign,
      stage: formData.stage,
      priority: formData.priority,
      assignedTo: formData.assignedTo,
      branchName: formData.branchName,
      notes: formData.notes,
      stageUpdatedAt: new Date().toISOString().split('T')[0],
      daysInCurrentStage: 0,
      score: {
        budgetScore: 16,
        dateScore: 12,
        engagementScore: 10,
        intentScore: 15,
        requirementScore: 8,
        decisionMakerScore: 6,
        feasibilityScore: 3,
        totalScore: 70,
        category: 'Warm Lead'
      }
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register Sales Lead / Inbound Enquiry"
      description="Capture complete customer requirements, marketing attribution, and event expectations."
      maxWidth="2xl"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Create Lead Record
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Duplicate Warning Banner */}
        {duplicateMatch && (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 flex items-start gap-2.5">
            <Copy className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <span className="font-bold">Duplicate Match Detected:</span>
              <p className="text-[11px]">
                A lead with this contact already exists: <strong>{duplicateMatch.clientName}</strong> ({duplicateMatch.leadNumber || duplicateMatch.id} &bull; Stage: {duplicateMatch.stage}). Multiple distinct inquiries from the same client are permitted.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Opportunity / Event Title"
            required
            placeholder="e.g. Royal Rajputana Destination Wedding"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <Select
            label="Event Category"
            value={formData.eventType}
            onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
          >
            <option value="Luxury Wedding">Luxury Wedding</option>
            <option value="Destination Wedding">Destination Wedding</option>
            <option value="Corporate Summit">Corporate Summit</option>
            <option value="Product Launch">Product Launch</option>
            <option value="Music Festival">Music Festival</option>
            <option value="Milestone Gala">Milestone Gala</option>
            <option value="Anniversary Celebration">Anniversary Celebration</option>
            <option value="Fashion Runway">Fashion Runway</option>
            <option value="Birthday Extravaganza">Birthday Extravaganza</option>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Contact Person Name"
            required
            placeholder="e.g. Yashvardhan Singhania"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
          />

          <Input
            label="Company / Organization"
            placeholder="e.g. Singhania Group (if corporate)"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          />

          <Input
            label="Primary Phone Number"
            required
            placeholder="+91 98200 11223"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Email Address"
            type="email"
            required
            placeholder="client@domain.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Input
            label="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />

          <Input
            label="State"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Estimated Budget (₹)"
            type="number"
            required
            value={formData.estimatedBudget}
            onChange={(e) => setFormData({ ...formData, estimatedBudget: Number(e.target.value) })}
          />

          <Input
            label="Expected Guest Count"
            type="number"
            value={formData.guestCount}
            onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
          />

          <Input
            label="Proposed Event Date"
            type="date"
            required
            value={formData.eventDate}
            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Select
            label="Inbound Lead Source"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          >
            <option value="Website">Website Form</option>
            <option value="WhatsApp">WhatsApp Inbound</option>
            <option value="Phone Call">Direct Phone Call</option>
            <option value="Instagram">Instagram Direct</option>
            <option value="Meta Ads">Meta Ads (FB/Insta)</option>
            <option value="Google Ads">Google Search</option>
            <option value="Referral">HNI / Venue Referral</option>
            <option value="Offline">Exhibition & Tradeshow</option>
          </Select>

          <Select
            label="Marketing Campaign"
            value={formData.campaign}
            onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
          >
            {campaigns.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </Select>

          <Select
            label="Assign Salesperson"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
          >
            <option value="Rajesh Verma">Rajesh Verma (Acquisitions)</option>
            <option value="Priya Sharma">Priya Sharma (Senior Producer)</option>
            <option value="Vikram Rathore">Vikram Rathore (Production Lead)</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Priority Level"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
          >
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>

          <Select
            label="Branch Scope"
            value={formData.branchName}
            onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
          >
            <option value="Mumbai HQ">Mumbai HQ</option>
            <option value="Delhi NCR">Delhi NCR</option>
            <option value="Bangalore Hub">Bangalore Hub</option>
          </Select>
        </div>

        <Input
          label="Detailed Requirements & Client Brief"
          placeholder="Specific theme preferences, sound/AV rigging, artist booking requests, or catering guidelines..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </form>
    </Modal>
  );
}
