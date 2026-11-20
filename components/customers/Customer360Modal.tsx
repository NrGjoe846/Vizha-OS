'use client';

import React, { useState } from 'react';
import {
  Client,
  EventModel,
  Quotation,
  Invoice,
  CustomerContact,
  CustomerAddress,
  CustomerDocument,
  CustomerCommunication,
  CustomerNote,
  CustomerFeedbackRecord,
  CustomerComplaint
} from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/format';
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  Building,
  User,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Send,
  Trash2,
  MapPin,
  ExternalLink,
  Tag,
  Star,
  Receipt,
  Download,
  AlertOctagon,
  Copy,
  Users
} from 'lucide-react';

interface Customer360ModalProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
  events: EventModel[];
  quotations: Quotation[];
  invoices: Invoice[];
  onAddContact: (customerId: string, contact: Omit<CustomerContact, 'id'>) => void;
  onDeleteContact: (customerId: string, contactId: string) => void;
  onAddAddress: (customerId: string, address: Omit<CustomerAddress, 'id'>) => void;
  onDeleteAddress: (customerId: string, addressId: string) => void;
  onAddDocument: (customerId: string, doc: Omit<CustomerDocument, 'id' | 'uploadedAt'>) => void;
  onAddCommunication: (customerId: string, comm: Omit<CustomerCommunication, 'id' | 'timestamp'>) => void;
  onAddNote: (customerId: string, note: Omit<CustomerNote, 'id' | 'createdAt'>) => void;
  onAddFeedback: (customerId: string, fb: Omit<CustomerFeedbackRecord, 'id'>) => void;
  onAddComplaint: (customerId: string, comp: Omit<CustomerComplaint, 'id' | 'ticketNo' | 'createdAt'>) => void;
  onResolveComplaint: (customerId: string, complaintId: string, resolutionNotes: string) => void;
}

export function Customer360Modal({
  client,
  isOpen,
  onClose,
  events,
  quotations,
  invoices,
  onAddContact,
  onDeleteContact,
  onAddAddress,
  onDeleteAddress,
  onAddDocument,
  onAddCommunication,
  onAddNote,
  onAddFeedback,
  onAddComplaint,
  onResolveComplaint
}: Customer360ModalProps) {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'contacts'
    | 'addresses'
    | 'events'
    | 'quotations'
    | 'invoices'
    | 'documents'
    | 'communications'
    | 'notes'
    | 'feedback'
    | 'complaints'
    | 'audit'
  >('overview');

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    designation: '',
    role: 'Event Coordinator' as any,
    phone: '',
    email: '',
    isPrimary: false,
    isDecisionMaker: false,
    isBillingContact: false,
    portalAccess: true
  });

  // Address form state
  const [addressForm, setAddressForm] = useState({
    addressName: '',
    type: 'Billing address' as any,
    line1: '',
    city: client.city || 'Mumbai',
    state: client.state || 'Maharashtra',
    country: 'India',
    pinCode: '',
    isPrimaryBilling: false,
    isPrimaryCommunication: false
  });

  // Document form state
  const [docForm, setDocForm] = useState({
    name: '',
    category: 'Contract / Agreement' as any,
    fileUrl: '/docs/customer-doc.pdf',
    fileSize: '1.2 MB',
    accessLevel: 'internal' as any,
    uploadedBy: 'Rajesh Verma'
  });

  // Communication form state
  const [commForm, setCommForm] = useState({
    channel: 'call' as any,
    title: '',
    summary: '',
    sender: 'Rajesh Verma',
    recipient: client.primaryContact || client.name,
    outcome: 'Follow-up requested',
    deliveryStatus: 'sent' as any
  });

  // Note form state
  const [noteForm, setNoteForm] = useState({
    content: '',
    author: 'Rajesh Verma',
    visibility: 'all' as any,
    isPinned: false,
    priority: 'normal' as any
  });

  // Feedback form state
  const [fbForm, setFbForm] = useState({
    rating: 5,
    csatScore: 95,
    serviceRating: 5,
    venueRating: 5,
    cateringRating: 5,
    decorRating: 5,
    comments: '',
    recommendationScore: 10,
    feedbackDate: new Date().toISOString().split('T')[0],
    source: 'Post-Event Survey'
  });

  // Complaint form state
  const [complaintForm, setComplaintForm] = useState({
    title: '',
    description: '',
    category: 'Service Quality' as any,
    priority: 'medium' as any,
    status: 'open' as any,
    assignedTo: 'Priya Sharma'
  });

  // Filter linked records for this customer
  const customerEvents = events.filter(e => e.clientId === client.id || e.clientName.toLowerCase() === client.name.toLowerCase());
  const customerQuotations = quotations.filter(q => q.clientId === client.id || q.clientName.toLowerCase() === client.name.toLowerCase());
  const customerInvoices = invoices.filter(i => i.clientId === client.id || i.clientName.toLowerCase() === client.name.toLowerCase());

  // Financial reconciliation
  const calculatedTotalInvoiced = customerInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const calculatedTotalCollected = customerInvoices
    .reduce((sum, inv) => sum + (inv.paidAmount || (inv.status === 'paid' ? inv.totalAmount : 0)), 0);
  const calculatedOutstanding = customerInvoices.reduce((sum, inv) => sum + (inv.balanceDue || 0), 0);

  const profileTabs = [
    { id: 'overview', label: 'Customer 360° Overview' },
    { id: 'contacts', label: 'Contacts', count: client.contacts?.length || 0 },
    { id: 'addresses', label: 'Addresses', count: client.addresses?.length || 0 },
    { id: 'events', label: 'Event History', count: customerEvents.length },
    { id: 'quotations', label: 'Quotations', count: customerQuotations.length },
    { id: 'invoices', label: 'Invoices & Ledger', count: customerInvoices.length },
    { id: 'documents', label: 'Documents & Contracts', count: client.documents?.length || 0 },
    { id: 'communications', label: 'Communications', count: client.communications?.length || 0 },
    { id: 'notes', label: 'Internal Notes', count: client.notes?.length || 0 },
    { id: 'feedback', label: 'Feedback & Reviews', count: client.feedback?.length || 0 },
    { id: 'complaints', label: 'Complaints', count: client.complaints?.filter(c => c.status !== 'resolved' && c.status !== 'closed').length || 0 },
    { id: 'audit', label: 'Audit Trail', count: client.auditLogs?.length || 0 }
  ];

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name) return;
    onAddContact(client.id, contactForm);
    setContactForm({
      name: '',
      designation: '',
      role: 'Event Coordinator',
      phone: '',
      email: '',
      isPrimary: false,
      isDecisionMaker: false,
      isBillingContact: false,
      portalAccess: true
    });
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.addressName || !addressForm.line1) return;
    onAddAddress(client.id, addressForm);
    setAddressForm({
      addressName: '',
      type: 'Billing address',
      line1: '',
      city: client.city || 'Mumbai',
      state: client.state || 'Maharashtra',
      country: 'India',
      pinCode: '',
      isPrimaryBilling: false,
      isPrimaryCommunication: false
    });
  };

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.name) return;
    onAddDocument(client.id, docForm);
    setDocForm({
      name: '',
      category: 'Contract / Agreement',
      fileUrl: '/docs/customer-doc.pdf',
      fileSize: '1.2 MB',
      accessLevel: 'internal',
      uploadedBy: 'Rajesh Verma'
    });
  };

  const handleCreateComm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commForm.title) return;
    onAddCommunication(client.id, commForm);
    setCommForm({
      channel: 'call',
      title: '',
      summary: '',
      sender: 'Rajesh Verma',
      recipient: client.primaryContact || client.name,
      outcome: 'Follow-up requested',
      deliveryStatus: 'sent'
    });
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteForm.content) return;
    onAddNote(client.id, noteForm);
    setNoteForm({
      content: '',
      author: 'Rajesh Verma',
      visibility: 'all',
      isPinned: false,
      priority: 'normal'
    });
  };

  const handleCreateFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    onAddFeedback(client.id, fbForm);
    setFbForm({
      rating: 5,
      csatScore: 95,
      serviceRating: 5,
      venueRating: 5,
      cateringRating: 5,
      decorRating: 5,
      comments: '',
      recommendationScore: 10,
      feedbackDate: new Date().toISOString().split('T')[0],
      source: 'Post-Event Survey'
    });
  };

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintForm.title) return;
    onAddComplaint(client.id, complaintForm);
    setComplaintForm({
      title: '',
      description: '',
      category: 'Service Quality',
      priority: 'medium',
      status: 'open',
      assignedTo: 'Priya Sharma'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${client.customerCode || 'CUSTOMER'} — ${client.name}`}
      description={`${client.customerType || 'Individual'} &bull; ${client.category || 'Regular'} &bull; Account Managed by ${client.accountManager || 'Rajesh Verma'}`}
      maxWidth="6xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono text-zinc-400">Status:</span>
            <Badge
              variant={
                client.status === 'active' || !client.status
                  ? 'success'
                  : client.status === 'blocked'
                  ? 'danger'
                  : client.status === 'archived'
                  ? 'neutral'
                  : 'warning'
              }
              dot
              className="text-xs uppercase font-mono"
            >
              {client.status || 'active'}
            </Badge>
          </div>

          <Button variant="outline" size="sm" onClick={onClose}>
            Close Workspace
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Executive Summary Metrics Strip */}
        <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white font-mono flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              {client.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-zinc-900 text-sm">{client.name}</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-zinc-600 border border-zinc-200">
                  {client.customerCode || client.id}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                {client.companyName ? `${client.companyName} • ` : ''}{client.city}, {client.state || 'India'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono text-right flex-wrap">
            <div>
              <span className="text-[10px] uppercase text-zinc-400 block">Total Events</span>
              <span className="font-bold text-zinc-900 text-sm">{client.totalBookings || customerEvents.length}</span>
            </div>
            <div className="border-l border-zinc-200 pl-3">
              <span className="text-[10px] uppercase text-zinc-400 block">Lifetime Business</span>
              <span className="font-bold text-zinc-950 text-sm">₹{formatCurrency(client.totalSpent || 0)}</span>
            </div>
            <div className="border-l border-zinc-200 pl-3">
              <span className="text-[10px] uppercase text-zinc-400 block">Outstanding</span>
              <span className={`font-bold text-sm ${calculatedOutstanding > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                ₹{formatCurrency(calculatedOutstanding || client.totalOutstanding || 0)}
              </span>
            </div>
            <div className="border-l border-zinc-200 pl-3">
              <span className="text-[10px] uppercase text-zinc-400 block">Last Production</span>
              <span className="font-medium text-zinc-700 text-xs">{client.lastEventDate || 'Active'}</span>
            </div>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <Tabs
          items={profileTabs}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as any)}
        />

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Profile Card */}
              <div className="p-4 bg-white border border-zinc-200/80 rounded-xl space-y-2.5">
                <h5 className="font-bold text-zinc-900 uppercase font-mono text-[10px] tracking-wider text-zinc-400">
                  Master Profile Information
                </h5>
                <div className="space-y-2 text-zinc-700">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Legal Entity:</span>
                    <span className="font-semibold text-zinc-900">{client.companyName || client.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Classification:</span>
                    <span className="font-medium">{client.customerType || 'Individual'} ({client.category || 'Regular'})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Primary Contact:</span>
                    <span className="font-medium">{client.primaryContact || client.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Primary Phone:</span>
                    <span className="font-mono">{client.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Email Address:</span>
                    <span className="truncate max-w-[150px]">{client.email}</span>
                  </div>
                  {client.gstin && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500">GSTIN:</span>
                      <span className="font-mono text-zinc-900 font-semibold">{client.gstin}</span>
                    </div>
                  )}
                  {client.pan && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500">PAN:</span>
                      <span className="font-mono text-zinc-900">{client.pan}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Relationship Governance Card */}
              <div className="p-4 bg-white border border-zinc-200/80 rounded-xl space-y-2.5">
                <h5 className="font-bold text-zinc-900 uppercase font-mono text-[10px] tracking-wider text-zinc-400">
                  Relationship & Branch Ownership
                </h5>
                <div className="space-y-2 text-zinc-700">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Account Owner:</span>
                    <span className="font-semibold text-zinc-900">{client.accountManager || 'Rajesh Verma'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Operating Branch:</span>
                    <span className="font-medium">{client.branchName || 'Mumbai HQ'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Customer Source:</span>
                    <span className="text-purple-700 font-medium">{client.source || 'Direct Referral'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Loyalty Points:</span>
                    <span className="font-mono font-bold text-amber-700">{client.loyaltyPoints || 0} Pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Referrals Driven:</span>
                    <span className="font-mono">{client.referralCount || 0} Accounts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Registration Date:</span>
                    <span className="font-mono">{client.registeredAt || '2025-01-01'}</span>
                  </div>
                </div>

                {client.tags && client.tags.length > 0 && (
                  <div className="pt-2 border-t border-zinc-100 flex flex-wrap gap-1">
                    {client.tags.map((t, idx) => (
                      <span key={idx} className="bg-zinc-100 text-zinc-700 text-[10px] px-1.5 py-0.5 rounded border border-zinc-200/60 font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Financial Pulse Card */}
              <div className="p-4 bg-white border border-zinc-200/80 rounded-xl space-y-2.5">
                <h5 className="font-bold text-zinc-900 uppercase font-mono text-[10px] tracking-wider text-zinc-400">
                  Authoritative Financial Summary
                </h5>
                <div className="space-y-2 text-zinc-700 font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Total Confirmed Booking:</span>
                    <span className="font-bold text-zinc-900">₹{formatCurrency(client.totalSpent || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Invoiced Amount:</span>
                    <span>₹{formatCurrency(calculatedTotalInvoiced || client.totalInvoiced || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Amount Collected:</span>
                    <span className="font-bold text-emerald-700">₹{formatCurrency(calculatedTotalCollected)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Receivables Outstanding:</span>
                    <span className={`font-bold ${calculatedOutstanding > 0 ? 'text-rose-700' : 'text-zinc-900'}`}>
                      ₹{formatCurrency(calculatedOutstanding || client.totalOutstanding || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Advance Escrow Balance:</span>
                    <span className="font-semibold text-purple-700">₹{formatCurrency(client.advanceBalance || 0)}</span>
                  </div>
                </div>

                {client.internalNotes && (
                  <div className="p-2 bg-amber-50/70 border border-amber-200/80 rounded text-amber-900 text-[11px] mt-2">
                    <span className="font-bold block text-[10px] uppercase font-mono">Internal Directive:</span>
                    {client.internalNotes}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONTACTS MANAGEMENT */}
        {activeTab === 'contacts' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Authorized Contact Directory</h5>
                <p className="text-zinc-500 text-[11px]">Multiple decision makers, event coordinators, and finance managers with portal access.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {(client.contacts || []).map((con) => (
                <div key={con.id} className="p-3.5 bg-white border border-zinc-200 rounded-xl space-y-2 relative group hover:border-zinc-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-zinc-900 text-sm">{con.name}</span>
                        {con.isPrimary && (
                          <Badge variant="success" className="text-[9px] px-1 py-0">Primary</Badge>
                        )}
                        {con.isDecisionMaker && (
                          <Badge variant="purple" className="text-[9px] px-1 py-0">Signatory</Badge>
                        )}
                        {con.isBillingContact && (
                          <Badge variant="info" className="text-[9px] px-1 py-0">Billing</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500">{con.designation || con.role}</p>
                    </div>

                    <button
                      onClick={() => onDeleteContact(client.id, con.id)}
                      className="text-zinc-400 hover:text-rose-600 p-1 rounded"
                      title="Remove Contact"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1 font-mono text-[11px] text-zinc-600 pt-1 border-t border-zinc-100">
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-zinc-400" /> {con.phone}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-zinc-400" /> {con.email}
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-500">
                    <span>Portal Access: <strong>{con.portalAccess ? 'Enabled' : 'Restricted'}</strong></span>
                    {con.permissions && (
                      <span className="font-mono text-zinc-400">
                        Perms: {[
                          con.permissions.canApproveProposals && 'Approve',
                          con.permissions.canMakePayments && 'Pay',
                          con.permissions.canViewInvoices && 'Invoices'
                        ].filter(Boolean).join(', ') || 'View Only'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Contact Form */}
            <form onSubmit={handleCreateContact} className="p-3.5 border border-dashed border-zinc-300 rounded-xl space-y-3 bg-zinc-50/50">
              <span className="font-bold text-zinc-900 block text-xs">Register Additional Contact Person</span>
              <div className="grid grid-cols-3 gap-2.5">
                <Input
                  label="Contact Name"
                  required
                  placeholder="e.g. Ketan Shah"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                />
                <Input
                  label="Job Designation"
                  placeholder="e.g. Head of Accounts & Finance"
                  value={contactForm.designation}
                  onChange={(e) => setContactForm({ ...contactForm, designation: e.target.value })}
                />
                <Select
                  label="Organizational Role"
                  value={contactForm.role}
                  onChange={(e) => setContactForm({ ...contactForm, role: e.target.value as any })}
                >
                  <option value="Owner / Director">Owner / Director</option>
                  <option value="Event Coordinator">Event Coordinator</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Procurement Manager">Procurement Manager</option>
                  <option value="Finance Manager">Finance Manager</option>
                  <option value="Accounts Payable">Accounts Payable</option>
                  <option value="Family Representative">Family Representative</option>
                  <option value="Authorized Signatory">Authorized Signatory</option>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Input
                  label="Mobile / Phone Number"
                  required
                  placeholder="+91 98200 12345"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="contact@company.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-4 text-xs text-zinc-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contactForm.isPrimary}
                    onChange={(e) => setContactForm({ ...contactForm, isPrimary: e.target.checked })}
                    className="rounded border-zinc-300"
                  />
                  <span>Designate as Primary Contact</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contactForm.isDecisionMaker}
                    onChange={(e) => setContactForm({ ...contactForm, isDecisionMaker: e.target.checked })}
                    className="rounded border-zinc-300"
                  />
                  <span>Authorized Contract Signatory</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contactForm.isBillingContact}
                    onChange={(e) => setContactForm({ ...contactForm, isBillingContact: e.target.checked })}
                    className="rounded border-zinc-300"
                  />
                  <span>Billing / Accounts Contact</span>
                </label>
              </div>

              <Button variant="primary" size="sm" type="submit" icon={<Plus className="w-3.5 h-3.5" />}>
                Save Contact Person
              </Button>
            </form>
          </div>
        )}

        {/* TAB 3: ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Addresses & Operating Locations</h5>
                <p className="text-zinc-500 text-[11px]">Distinct addresses for GST invoicing, communications, and event execution venues.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {(client.addresses || []).map((addr) => (
                <div key={addr.id} className="p-3.5 bg-white border border-zinc-200 rounded-xl space-y-2 relative group hover:border-zinc-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-zinc-900 text-sm">{addr.addressName}</span>
                        {addr.isPrimaryBilling && (
                          <Badge variant="info" className="text-[9px] px-1 py-0">Default Billing</Badge>
                        )}
                        {addr.isPrimaryCommunication && (
                          <Badge variant="neutral" className="text-[9px] px-1 py-0">Communication</Badge>
                        )}
                        {addr.isPrimaryEvent && (
                          <Badge variant="purple" className="text-[9px] px-1 py-0">Event Location</Badge>
                        )}
                      </div>
                      <span className="text-[10px] font-mono uppercase text-zinc-400">{addr.type}</span>
                    </div>

                    <button
                      onClick={() => onDeleteAddress(client.id, addr.id)}
                      className="text-zinc-400 hover:text-rose-600 p-1 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[11px] text-zinc-700 space-y-0.5">
                    <p>{addr.line1}</p>
                    {addr.line2 && <p>{addr.line2}</p>}
                    <p className="font-medium text-zinc-900">
                      {addr.city}, {addr.state} - {addr.pinCode}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Address Form */}
            <form onSubmit={handleCreateAddress} className="p-3.5 border border-dashed border-zinc-300 rounded-xl space-y-3 bg-zinc-50/50">
              <span className="font-bold text-zinc-900 block text-xs">Add New Address</span>
              <div className="grid grid-cols-2 gap-2.5">
                <Input
                  label="Address Label"
                  required
                  placeholder="e.g. Corporate Registered HQ, Beach House Lawn"
                  value={addressForm.addressName}
                  onChange={(e) => setAddressForm({ ...addressForm, addressName: e.target.value })}
                />
                <Select
                  label="Address Type"
                  value={addressForm.type}
                  onChange={(e) => setAddressForm({ ...addressForm, type: e.target.value as any })}
                >
                  <option value="Billing address">Billing address</option>
                  <option value="Registered office">Registered office</option>
                  <option value="Event location">Event location</option>
                  <option value="Residential address">Residential address</option>
                  <option value="Communication address">Communication address</option>
                </Select>
              </div>

              <Input
                label="Address Line 1"
                required
                placeholder="Street address, building, suite..."
                value={addressForm.line1}
                onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
              />

              <div className="grid grid-cols-3 gap-2.5">
                <Input
                  label="City"
                  required
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                />
                <Input
                  label="State"
                  required
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                />
                <Input
                  label="PIN Code"
                  required
                  placeholder="400001"
                  value={addressForm.pinCode}
                  onChange={(e) => setAddressForm({ ...addressForm, pinCode: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-4 text-xs text-zinc-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addressForm.isPrimaryBilling}
                    onChange={(e) => setAddressForm({ ...addressForm, isPrimaryBilling: e.target.checked })}
                    className="rounded border-zinc-300"
                  />
                  <span>Set as Default Billing Address</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addressForm.isPrimaryCommunication}
                    onChange={(e) => setAddressForm({ ...addressForm, isPrimaryCommunication: e.target.checked })}
                    className="rounded border-zinc-300"
                  />
                  <span>Set as Primary Communication Address</span>
                </label>
              </div>

              <Button variant="primary" size="sm" type="submit" icon={<Plus className="w-3.5 h-3.5" />}>
                Save Address Record
              </Button>
            </form>
          </div>
        )}

        {/* TAB 4: EVENT HISTORY */}
        {activeTab === 'events' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Customer Event Production History</h5>
                <p className="text-zinc-500 text-[11px]">Unified portfolio of all confirmed, completed, ongoing, and planned productions.</p>
              </div>
              <span className="font-mono text-zinc-500 font-semibold">{customerEvents.length} Productions</span>
            </div>

            <div className="space-y-2.5">
              {customerEvents.map((evt) => (
                <div key={evt.id} className="p-3.5 bg-white border border-zinc-200 rounded-xl flex items-center justify-between gap-3 hover:border-zinc-300 transition-colors">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-zinc-400">{evt.code || evt.id}</span>
                      <Badge
                        variant={evt.status === 'completed' ? 'success' : evt.status === 'in_progress' ? 'info' : 'warning'}
                        dot
                        className="text-[10px]"
                      >
                        {evt.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-zinc-900 text-sm mt-0.5">{evt.title}</h4>
                    <p className="text-[11px] text-zinc-500 flex items-center gap-2 mt-0.5">
                      <span>{evt.eventType}</span>
                      <span>&bull;</span>
                      <span>{evt.venueName}</span>
                      <span>&bull;</span>
                      <span>{evt.guestCount} Guests</span>
                    </p>
                  </div>

                  <div className="text-right font-mono shrink-0">
                    <span className="font-bold text-zinc-950 text-sm block">₹{formatCurrency(evt.budget)}</span>
                    <span className="text-[10px] text-zinc-400">{evt.startDate}</span>
                  </div>
                </div>
              ))}

              {customerEvents.length === 0 && (
                <div className="py-8 text-center text-zinc-400 border border-dashed border-zinc-200 rounded-xl">
                  No confirmed events recorded for this customer yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: QUOTATIONS */}
        {activeTab === 'quotations' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Quotations & Commercial Proposals</h5>
                <p className="text-zinc-500 text-[11px]">Itemized cost proposals submitted, approved, or under negotiation.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {customerQuotations.map((q) => (
                <div key={q.id} className="p-3 bg-white border border-zinc-200 rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-zinc-900">{q.quotationNo}</span>
                      <Badge
                        variant={q.status === 'approved' ? 'success' : q.status === 'sent' ? 'warning' : 'neutral'}
                        className="text-[10px]"
                      >
                        {q.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{q.eventTitle} &bull; Valid until {q.validUntil}</p>
                  </div>

                  <div className="text-right font-mono">
                    <span className="font-bold text-zinc-950 text-sm block">₹{formatCurrency(q.totalAmount)}</span>
                    <span className="text-[10px] text-zinc-400">Created: {q.issueDate}</span>
                  </div>
                </div>
              ))}

              {customerQuotations.length === 0 && (
                <div className="py-8 text-center text-zinc-400 border border-dashed border-zinc-200 rounded-xl">
                  No commercial proposals found for this customer.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: INVOICES & PAYMENTS */}
        {activeTab === 'invoices' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Financial Invoicing & Payment History</h5>
                <p className="text-zinc-500 text-[11px]">Authoritative ledger records: tax invoices, payments, credit adjustments.</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-zinc-400 block uppercase">Outstanding Balance</span>
                <span className={`font-bold text-sm ${calculatedOutstanding > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                  ₹{formatCurrency(calculatedOutstanding)}
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {customerInvoices.map((inv) => (
                <div key={inv.id} className="p-3 bg-white border border-zinc-200 rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-zinc-900">{inv.invoiceNo}</span>
                      <Badge
                        variant={inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'danger' : 'warning'}
                        dot
                        className="text-[10px]"
                      >
                        {inv.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{inv.eventTitle} &bull; Due: {inv.dueDate}</p>
                  </div>

                  <div className="text-right font-mono">
                    <span className="font-bold text-zinc-950 text-sm block">₹{formatCurrency(inv.totalAmount)}</span>
                    <span className="text-[10px] text-zinc-400">Issued: {inv.issueDate}</span>
                  </div>
                </div>
              ))}

              {customerInvoices.length === 0 && (
                <div className="py-8 text-center text-zinc-400 border border-dashed border-zinc-200 rounded-xl">
                  No invoices generated for this customer.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: DOCUMENTS & CONTRACTS */}
        {activeTab === 'documents' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Customer Documents & Contracts</h5>
                <p className="text-zinc-500 text-[11px]">Centralized repository for PAN, GSTIN, signed MSAs, and POs.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(client.documents || []).map((doc) => (
                <div key={doc.id} className="p-3 bg-white border border-zinc-200 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-zinc-900 truncate">{doc.name}</p>
                      <p className="text-[10px] text-zinc-400 font-mono">{doc.category} &bull; {doc.fileSize}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-[10px] px-2 shrink-0">
                    Download
                  </Button>
                </div>
              ))}
            </div>

            {/* Upload Document Form */}
            <form onSubmit={handleCreateDoc} className="p-3.5 border border-dashed border-zinc-300 rounded-xl space-y-3 bg-zinc-50/50">
              <span className="font-bold text-zinc-900 block text-xs">Upload Customer Document</span>
              <div className="grid grid-cols-2 gap-2.5">
                <Input
                  label="Document Title"
                  required
                  placeholder="e.g. Master Services Agreement 2026"
                  value={docForm.name}
                  onChange={(e) => setDocForm({ ...docForm, name: e.target.value })}
                />
                <Select
                  label="Document Category"
                  value={docForm.category}
                  onChange={(e) => setDocForm({ ...docForm, category: e.target.value as any })}
                >
                  <option value="Contract / Agreement">Contract / Agreement</option>
                  <option value="PAN Document">PAN Document</option>
                  <option value="GST Certificate">GST Certificate</option>
                  <option value="Company Registration">Company Registration</option>
                  <option value="Purchase Order">Purchase Order</option>
                  <option value="Event Brief">Event Brief</option>
                </Select>
              </div>

              <Button variant="primary" size="sm" type="submit" icon={<Plus className="w-3.5 h-3.5" />}>
                Record Document Metadata
              </Button>
            </form>
          </div>
        )}

        {/* TAB 8: COMMUNICATIONS & ACTIVITIES */}
        {activeTab === 'communications' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Customer Communication Timeline</h5>
                <p className="text-zinc-500 text-[11px]">Omnichannel history of calls, WhatsApp messages, emails, and meetings.</p>
              </div>
            </div>

            <div className="space-y-2">
              {(client.communications || []).map((comm) => (
                <div key={comm.id} className="p-3 bg-white border border-zinc-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900">{comm.title}</span>
                      <span className="text-[10px] font-mono uppercase bg-zinc-100 text-zinc-700 px-1.5 py-0.2 rounded border border-zinc-200">
                        {comm.channel}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">{comm.timestamp}</span>
                  </div>
                  <p className="text-zinc-600 text-[11px]">{comm.summary}</p>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    Staff: {comm.sender} &bull; Client Contact: {comm.recipient} &bull; Outcome: {comm.outcome || 'Logged'}
                  </p>
                </div>
              ))}
            </div>

            {/* Log Interaction Form */}
            <form onSubmit={handleCreateComm} className="p-3.5 border border-dashed border-zinc-300 rounded-xl space-y-3 bg-zinc-50/50">
              <span className="font-bold text-zinc-900 block text-xs">Log Client Interaction</span>
              <div className="grid grid-cols-2 gap-2.5">
                <Select
                  label="Channel"
                  value={commForm.channel}
                  onChange={(e) => setCommForm({ ...commForm, channel: e.target.value as any })}
                >
                  <option value="call">Phone Call</option>
                  <option value="whatsapp">WhatsApp Message</option>
                  <option value="email">Email</option>
                  <option value="meeting">Physical Meeting</option>
                  <option value="portal_message">Customer Portal Message</option>
                </Select>
                <Input
                  label="Summary Subject"
                  required
                  placeholder="e.g. Discussed revised decor specs"
                  value={commForm.title}
                  onChange={(e) => setCommForm({ ...commForm, title: e.target.value })}
                />
              </div>

              <Input
                label="Detailed Interaction Notes"
                placeholder="Key commitments, next steps, or customer inquiries..."
                value={commForm.summary}
                onChange={(e) => setCommForm({ ...commForm, summary: e.target.value })}
              />

              <Button variant="primary" size="sm" type="submit" icon={<Send className="w-3.5 h-3.5" />}>
                Append to Interaction Timeline
              </Button>
            </form>
          </div>
        )}

        {/* TAB 9: INTERNAL NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Internal Staff Notes & Operational Directives</h5>
                <p className="text-zinc-500 text-[11px]">Strictly confidential to team members. Never exposed to customer portal.</p>
              </div>
            </div>

            <div className="space-y-2">
              {(client.notes || []).map((n) => (
                <div key={n.id} className="p-3 bg-amber-50/40 border border-amber-200/70 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 text-[11px]">Author: {n.author}</span>
                    <span className="text-[10px] font-mono text-zinc-400">{n.createdAt}</span>
                  </div>
                  <p className="text-zinc-800 text-xs">{n.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleCreateNote} className="p-3.5 border border-dashed border-zinc-300 rounded-xl space-y-3 bg-zinc-50/50">
              <span className="font-bold text-zinc-900 block text-xs">Add Operational Note</span>
              <Input
                label="Confidential Directive"
                required
                placeholder="e.g. VIP client preferences, security clearances, dietary restrictions..."
                value={noteForm.content}
                onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
              />
              <Button variant="primary" size="sm" type="submit">
                Pin Internal Note
              </Button>
            </form>
          </div>
        )}

        {/* TAB 10: FEEDBACK & REVIEWS */}
        {activeTab === 'feedback' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Customer Feedback & CSAT Ratings</h5>
                <p className="text-zinc-500 text-[11px]">Post-event survey results, net promoter scores, and service reviews.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {(client.feedback || []).map((fb) => (
                <div key={fb.id} className="p-3.5 bg-white border border-zinc-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900 text-sm">{fb.eventName || 'Production Feedback'}</span>
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-bold text-[10px] flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {fb.rating} / 5.0
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-400">{fb.feedbackDate}</span>
                  </div>
                  <p className="text-zinc-700 italic text-[11px]">"{fb.comments}"</p>
                  <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 pt-1 border-t border-zinc-100">
                    <span>CSAT: <strong>{fb.csatScore}%</strong></span>
                    <span>Service: <strong>{fb.serviceRating}/5</strong></span>
                    <span>Decor: <strong>{fb.decorRating}/5</strong></span>
                    <span>NPS Score: <strong>{fb.recommendationScore}/10</strong></span>
                  </div>
                </div>
              ))}

              {(!client.feedback || client.feedback.length === 0) && (
                <div className="py-8 text-center text-zinc-400 border border-dashed border-zinc-200 rounded-xl">
                  No post-event feedback records logged yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 11: COMPLAINTS */}
        {activeTab === 'complaints' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Customer Complaints & Issue Resolution</h5>
                <p className="text-zinc-500 text-[11px]">Structured ticketing for quality, vendor delays, or billing discrepancies.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {(client.complaints || []).map((comp) => (
                <div key={comp.id} className="p-3.5 bg-white border border-zinc-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-zinc-900">{comp.ticketNo}</span>
                      <span className="font-bold text-zinc-900 text-sm">{comp.title}</span>
                      <Badge
                        variant={comp.status === 'resolved' || comp.status === 'closed' ? 'success' : 'danger'}
                        className="text-[10px]"
                      >
                        {comp.status}
                      </Badge>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-400">{comp.createdAt}</span>
                  </div>
                  <p className="text-zinc-700 text-[11px]">{comp.description}</p>
                  {comp.resolutionNotes && (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-900 text-[11px]">
                      <strong>Resolution:</strong> {comp.resolutionNotes} (Resolved: {comp.resolvedAt})
                    </div>
                  )}

                  {comp.status !== 'resolved' && comp.status !== 'closed' && (
                    <div className="pt-2 border-t border-zinc-100 flex justify-end">
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-[11px] h-7"
                        onClick={() => {
                          const resNotes = prompt('Enter resolution notes:');
                          if (resNotes) {
                            onResolveComplaint(client.id, comp.id, resNotes);
                          }
                        }}
                      >
                        Mark Ticket Resolved
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              {(!client.complaints || client.complaints.length === 0) && (
                <div className="py-8 text-center text-zinc-400 border border-dashed border-zinc-200 rounded-xl">
                  No active or historical complaints logged. Clean track record!
                </div>
              )}
            </div>

            {/* Create Complaint Form */}
            <form onSubmit={handleCreateComplaint} className="p-3.5 border border-dashed border-zinc-300 rounded-xl space-y-3 bg-zinc-50/50">
              <span className="font-bold text-zinc-900 block text-xs">Log Service Issue / Complaint</span>
              <div className="grid grid-cols-2 gap-2.5">
                <Input
                  label="Complaint Title"
                  required
                  placeholder="e.g. Delay in Stage Sound Testing"
                  value={complaintForm.title}
                  onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
                />
                <Select
                  label="Category"
                  value={complaintForm.category}
                  onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value as any })}
                >
                  <option value="Service Quality">Service Quality</option>
                  <option value="Billing / Invoice">Billing / Invoice</option>
                  <option value="Vendor Delays">Vendor Delays</option>
                  <option value="Event Operations">Event Operations</option>
                  <option value="Staff Behaviour">Staff Behaviour</option>
                </Select>
              </div>

              <Input
                label="Detailed Description"
                required
                placeholder="Specific issue experienced and immediate impact..."
                value={complaintForm.description}
                onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
              />

              <Button variant="primary" size="sm" type="submit" className="bg-rose-600 hover:bg-rose-700">
                Register Complaint Ticket
              </Button>
            </form>
          </div>
        )}

        {/* TAB 12: AUDIT LOG */}
        {activeTab === 'audit' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Customer Record Audit Trail</h5>
                <p className="text-zinc-500 text-[11px]">Immutable security log of profile creation, merges, edits, and status changes.</p>
              </div>
            </div>

            <div className="divide-y divide-zinc-100">
              {(client.auditLogs || []).map((aud) => (
                <div key={aud.id} className="py-2.5 flex items-start justify-between gap-3">
                  <div>
                    <span className="font-bold text-zinc-900">{aud.action}</span>
                    <p className="text-zinc-600 text-[11px] mt-0.5">{aud.details}</p>
                  </div>
                  <div className="text-right font-mono text-[10px] text-zinc-400 shrink-0">
                    <span>{aud.timestamp}</span>
                    <span className="block text-zinc-500">{aud.performedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
