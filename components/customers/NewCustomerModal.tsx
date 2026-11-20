'use client';

import React, { useState } from 'react';
import { Client, CustomerType, CustomerCategory } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Copy, Sparkles, Building, User, AlertTriangle } from 'lucide-react';

interface NewCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (customerData: Omit<Client, 'id' | 'totalBookings' | 'totalSpent'>) => void;
  existingCustomers: Client[];
}

export function NewCustomerModal({
  isOpen,
  onClose,
  onAddCustomer,
  existingCustomers
}: NewCustomerModalProps) {
  const nextNum = existingCustomers.length + 1;
  const suggestedCode = `CUS-2026-${String(nextNum).padStart(5, '0')}`;

  const [formData, setFormData] = useState({
    customerCode: suggestedCode,
    name: '',
    displayName: '',
    customerType: 'Individual' as CustomerType,
    category: 'Regular' as CustomerCategory,
    status: 'active' as const,
    companyName: '',
    primaryContact: '',
    email: '',
    alternateEmail: '',
    phone: '',
    alternatePhone: '',
    website: '',
    gstin: '',
    pan: '',
    industry: '',
    dateOfBirth: '',
    anniversary: '',
    source: 'Direct Inbound',
    accountManager: 'Rajesh Verma',
    branchName: 'Mumbai HQ',
    city: 'Mumbai',
    state: 'Maharashtra',
    billingAddress: '',
    pinCode: '400001',
    tagsStr: 'New Account, Direct Registration',
    internalNotes: ''
  });

  // Duplicate detection against existing customers
  const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
  const cleanEmail = formData.email.trim().toLowerCase();
  const cleanGstin = formData.gstin.trim().toUpperCase();

  const phoneMatch = cleanPhone.length >= 7
    ? existingCustomers.find(c => c.phone.replace(/[^0-9]/g, '').includes(cleanPhone))
    : null;

  const emailMatch = cleanEmail.length >= 5
    ? existingCustomers.find(c => c.email.trim().toLowerCase() === cleanEmail)
    : null;

  const gstinMatch = cleanGstin.length >= 10
    ? existingCustomers.find(c => c.gstin && c.gstin.toUpperCase() === cleanGstin)
    : null;

  const duplicateMatch = phoneMatch || emailMatch || gstinMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) return;

    onAddCustomer({
      customerCode: formData.customerCode,
      name: formData.name,
      displayName: formData.displayName || (formData.companyName ? `${formData.name} (${formData.companyName})` : formData.name),
      customerType: formData.customerType,
      category: formData.category,
      status: formData.status,
      companyName: formData.companyName || undefined,
      primaryContact: formData.primaryContact || formData.name,
      email: formData.email,
      alternateEmail: formData.alternateEmail || undefined,
      phone: formData.phone,
      alternatePhone: formData.alternatePhone || undefined,
      website: formData.website || undefined,
      gstin: formData.gstin || undefined,
      pan: formData.pan || undefined,
      industry: formData.industry || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      anniversary: formData.anniversary || undefined,
      source: formData.source,
      accountManager: formData.accountManager,
      branchName: formData.branchName,
      city: formData.city,
      state: formData.state,
      tags: formData.tagsStr.split(',').map(s => s.trim()).filter(Boolean),
      internalNotes: formData.internalNotes || undefined,
      addresses: [
        {
          id: `addr-${Date.now()}`,
          addressName: 'Registered / Billing Address',
          type: formData.customerType === 'Corporate' ? 'Registered office' : 'Billing address',
          line1: formData.billingAddress || 'Main Commercial Road',
          city: formData.city,
          state: formData.state,
          country: 'India',
          pinCode: formData.pinCode,
          isPrimaryBilling: true,
          isPrimaryCommunication: true,
          isPrimaryEvent: false
        }
      ]
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register Permanent Customer Profile"
      description="Create an authoritative master customer record in the centralized ERP directory."
      maxWidth="3xl"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Create Customer Master Record
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Duplicate Warning Alert */}
        {duplicateMatch && (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 flex items-start gap-2.5">
            <Copy className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <span className="font-bold">Duplicate Match Detected:</span>
              <p className="text-[11px]">
                A customer already exists with this contact: <strong>{duplicateMatch.name}</strong> ({duplicateMatch.customerCode || duplicateMatch.id} &bull; {duplicateMatch.companyName || duplicateMatch.customerType}). Multiple distinct entities may share details, but please verify before creating a new master record.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Customer Unique Code"
            required
            value={formData.customerCode}
            onChange={(e) => setFormData({ ...formData, customerCode: e.target.value })}
          />

          <Select
            label="Customer Type"
            value={formData.customerType}
            onChange={(e) => setFormData({ ...formData, customerType: e.target.value as any })}
          >
            <option value="Individual">Individual</option>
            <option value="Family">Family Account</option>
            <option value="Corporate">Corporate</option>
            <option value="Institution">Educational Institution</option>
            <option value="Government">Government / Public</option>
            <option value="Agency">Event Agency Partner</option>
            <option value="Association">Club / Association</option>
          </Select>

          <Select
            label="Initial Tier / Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
          >
            <option value="Regular">Regular</option>
            <option value="VIP">VIP Account</option>
            <option value="Premium">Premium</option>
            <option value="Corporate">Corporate Strategic</option>
            <option value="Referral Partner">Referral Partner</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Full Customer / Entity Name"
            required
            placeholder="e.g. Rahul Oberoi or Singhal Tech Ventures"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Company / Legal Entity (if applicable)"
            placeholder="e.g. Oberoi Global Holdings Ltd"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Primary Contact Person"
            placeholder="Main authorized contact"
            value={formData.primaryContact}
            onChange={(e) => setFormData({ ...formData, primaryContact: e.target.value })}
          />

          <Input
            label="Primary Mobile Number"
            required
            placeholder="+91 98200 11223"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <Input
            label="Primary Email Address"
            type="email"
            required
            placeholder="client@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="GSTIN Number"
            placeholder="27AABCO1234F1Z8"
            value={formData.gstin}
            onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
          />

          <Input
            label="PAN Number"
            placeholder="AABCO1234F"
            value={formData.pan}
            onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
          />

          <Input
            label="Industry Domain"
            placeholder="e.g. Real Estate, Tech, Jewelry"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input
            label="City"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />

          <Input
            label="State"
            required
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          />

          <Input
            label="PIN Code"
            placeholder="400001"
            value={formData.pinCode}
            onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Account Manager"
            value={formData.accountManager}
            onChange={(e) => setFormData({ ...formData, accountManager: e.target.value })}
          >
            <option value="Rajesh Verma">Rajesh Verma (Head of Acquisitions)</option>
            <option value="Priya Sharma">Priya Sharma (Senior Event Producer)</option>
            <option value="Vikram Rathore">Vikram Rathore (Production Lead)</option>
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
          label="Billing Street Address"
          placeholder="Building, street, suite, landmark..."
          value={formData.billingAddress}
          onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
        />

        <Input
          label="Tags (comma separated)"
          placeholder="VIP, Luxury Wedding, Corporate Annual Client, Referral Partner"
          value={formData.tagsStr}
          onChange={(e) => setFormData({ ...formData, tagsStr: e.target.value })}
        />

        <Input
          label="Internal Operational Notes & Guidance"
          placeholder="Specific customer preferences, billing guidelines, or relationship background..."
          value={formData.internalNotes}
          onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
        />
      </form>
    </Modal>
  );
}
