'use client';

import React, { useState } from 'react';
import { useERP } from '@/lib/store';
import { Client, CustomerStatus } from '@/lib/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { CustomerDashboardStats } from '@/components/customers/CustomerDashboardStats';
import { CustomerAnalyticsView } from '@/components/customers/CustomerAnalyticsView';
import { CustomerTable } from '@/components/customers/CustomerTable';
import { CustomerContactsView } from '@/components/customers/CustomerContactsView';
import { CustomerExperienceView } from '@/components/customers/CustomerExperienceView';
import { Customer360Modal } from '@/components/customers/Customer360Modal';
import { NewCustomerModal } from '@/components/customers/NewCustomerModal';
import { CustomerMergeModal } from '@/components/customers/CustomerMergeModal';
import { CustomerQAExportModal } from '@/components/customers/CustomerQAExportModal';
import {
  Users,
  Plus,
  BarChart2,
  Contact,
  Star,
  GitMerge,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';

export default function ClientsPage() {
  const {
    clients,
    events,
    quotations,
    invoices,
    selectedBranch,
    setSelectedBranch,
    addClient,
    updateCustomer,
    addCustomerContact,
    deleteCustomerContact,
    addCustomerAddress,
    deleteCustomerAddress,
    addCustomerDocument,
    addCustomerCommunication,
    addCustomerNote,
    addCustomerFeedback,
    addCustomerComplaint,
    updateCustomerComplaint,
    mergeCustomers,
    archiveCustomer,
    restoreCustomer,
    blockCustomer,
    bulkUpdateCustomerStatus,
    bulkAssignAccountManager,
    bulkAddCustomerTags
  } = useERP();

  const [activeTab, setActiveTab] = useState<'directory' | 'analytics' | 'contacts' | 'experience' | 'duplicates'>('directory');
  const [selectedCustomer, setSelectedCustomer] = useState<Client | null>(null);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [mergeTargetClient, setMergeTargetClient] = useState<Client | null>(null);
  const [isQAModalOpen, setIsQAModalOpen] = useState(false);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  // Branch-scoped clients
  const branchFilteredClients = selectedBranch === 'All Branches'
    ? clients
    : clients.filter(c => c.branchName === selectedBranch || (!c.branchName && selectedBranch === 'Mumbai HQ'));

  const directoryTabs = [
    { id: 'directory', label: 'Master Directory Table', count: branchFilteredClients.length, icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'analytics', label: 'Analytics & CLV Insights', icon: <BarChart2 className="w-3.5 h-3.5" /> },
    { id: 'contacts', label: 'Contacts & Addresses', icon: <Contact className="w-3.5 h-3.5" /> },
    { id: 'experience', label: 'Feedback & Complaints', icon: <Star className="w-3.5 h-3.5" /> },
    { id: 'duplicates', label: 'Duplicate Detection & Merge', icon: <GitMerge className="w-3.5 h-3.5" /> }
  ];

  const handleOpenMerge = (client?: Client) => {
    setMergeTargetClient(client || null);
    setIsMergeModalOpen(true);
  };

  const handleConfirmMerge = (masterId: string, secondaryId: string, reason: string) => {
    mergeCustomers(masterId, secondaryId, reason);
    setNotificationBanner(`Successfully merged duplicate customer record into master profile. All events, invoices, and contracts consolidated.`);
    setTimeout(() => setNotificationBanner(null), 5000);
  };

  return (
    <div className="space-y-6 w-full max-w-[1700px] mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Customer Directory"
        description="Centralized customer master database: authoritative profiles, multi-contact governance, addresses, 360° histories, authoritative ledgers, documents, and experience."
        badge={
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
            {branchFilteredClients.length} Master Accounts
          </span>
        }
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Branch Selector */}
            <div className="flex items-center gap-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1">
              <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-transparent text-xs font-medium text-zinc-800 focus:outline-none cursor-pointer"
              >
                <option value="All Branches">All Branches Scope</option>
                <option value="Mumbai HQ">Mumbai HQ</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Bangalore Hub">Bangalore Hub</option>
              </select>
            </div>

            {/* QA Checklist Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsQAModalOpen(true)}
              icon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
            >
              QA Acceptance (20/20)
            </Button>

            {/* Merge Tool Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenMerge()}
              icon={<GitMerge className="w-3.5 h-3.5 text-purple-600" />}
            >
              Merge Tool
            </Button>

            {/* Add Customer Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsNewCustomerModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Customer
            </Button>
          </div>
        }
      />

      {/* Dynamic Feedback Notification Banner */}
      {notificationBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notificationBanner}</span>
          </div>
          <button onClick={() => setNotificationBanner(null)} className="text-emerald-700 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Customer Directory Dashboard KPI Metrics */}
      <CustomerDashboardStats clients={branchFilteredClients} selectedBranch={selectedBranch} />

      {/* Primary Navigation Tabs */}
      <Tabs
        items={directoryTabs}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* TAB 1: MASTER DIRECTORY TABLE */}
      {activeTab === 'directory' && (
        <CustomerTable
          clients={branchFilteredClients}
          onSelectCustomer={(c) => setSelectedCustomer(c)}
          onEditCustomer={(c) => setSelectedCustomer(c)}
          onOpenMergeModal={handleOpenMerge}
          onArchiveCustomer={(id) => {
            archiveCustomer(id);
            setNotificationBanner(`Customer account archived successfully.`);
            setTimeout(() => setNotificationBanner(null), 4000);
          }}
          onRestoreCustomer={(id) => {
            restoreCustomer(id);
            setNotificationBanner(`Customer account restored to active directory.`);
            setTimeout(() => setNotificationBanner(null), 4000);
          }}
          onBulkUpdateStatus={bulkUpdateCustomerStatus}
          onBulkAssignManager={bulkAssignAccountManager}
          onBulkAddTags={bulkAddCustomerTags}
        />
      )}

      {/* TAB 2: ANALYTICS & CLV INSIGHTS */}
      {activeTab === 'analytics' && (
        <CustomerAnalyticsView clients={branchFilteredClients} />
      )}

      {/* TAB 3: CONTACTS & ADDRESSES */}
      {activeTab === 'contacts' && (
        <CustomerContactsView
          clients={branchFilteredClients}
          onSelectCustomer={(c) => setSelectedCustomer(c)}
        />
      )}

      {/* TAB 4: EXPERIENCE (FEEDBACK & COMPLAINTS) */}
      {activeTab === 'experience' && (
        <CustomerExperienceView
          clients={branchFilteredClients}
          onSelectCustomer={(c) => setSelectedCustomer(c)}
          onResolveComplaint={(customerId, compId, notes) => {
            updateCustomerComplaint(customerId, compId, {
              status: 'resolved',
              resolvedAt: new Date().toISOString().split('T')[0],
              resolutionNotes: notes
            });
            setNotificationBanner(`Complaint ticket marked as resolved.`);
            setTimeout(() => setNotificationBanner(null), 4000);
          }}
        />
      )}

      {/* TAB 5: DUPLICATE DETECTION & MERGE */}
      {activeTab === 'duplicates' && (
        <div className="space-y-4">
          <div className="p-4 bg-white border border-zinc-200/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-zinc-900 text-sm">Duplicate Detection & Entity Resolution</h3>
                <p className="text-zinc-500 text-xs">
                  Scan and reconcile identical customer profiles sharing mobile numbers, email addresses, or GSTIN certificates.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleOpenMerge()}
                icon={<GitMerge className="w-3.5 h-3.5" />}
              >
                Launch Merge Assistant
              </Button>
            </div>
          </div>

          <CustomerTable
            clients={branchFilteredClients}
            onSelectCustomer={(c) => setSelectedCustomer(c)}
            onEditCustomer={(c) => setSelectedCustomer(c)}
            onOpenMergeModal={handleOpenMerge}
            onArchiveCustomer={archiveCustomer}
            onRestoreCustomer={restoreCustomer}
            onBulkUpdateStatus={bulkUpdateCustomerStatus}
            onBulkAssignManager={bulkAssignAccountManager}
            onBulkAddTags={bulkAddCustomerTags}
          />
        </div>
      )}

      {/* Customer 360° Modal Workspace */}
      {selectedCustomer && (
        <Customer360Modal
          client={clients.find(c => c.id === selectedCustomer.id) || selectedCustomer}
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          events={events}
          quotations={quotations}
          invoices={invoices}
          onAddContact={addCustomerContact}
          onDeleteContact={deleteCustomerContact}
          onAddAddress={addCustomerAddress}
          onDeleteAddress={deleteCustomerAddress}
          onAddDocument={addCustomerDocument}
          onAddCommunication={addCustomerCommunication}
          onAddNote={addCustomerNote}
          onAddFeedback={addCustomerFeedback}
          onAddComplaint={addCustomerComplaint}
          onResolveComplaint={(custId, compId, resNotes) => {
            updateCustomerComplaint(custId, compId, {
              status: 'resolved',
              resolvedAt: new Date().toISOString().split('T')[0],
              resolutionNotes: resNotes
            });
          }}
        />
      )}

      {/* New Customer Modal */}
      <NewCustomerModal
        isOpen={isNewCustomerModalOpen}
        onClose={() => setIsNewCustomerModalOpen(false)}
        onAddCustomer={(data) => {
          const newC = addClient(data);
          setNotificationBanner(`Successfully registered customer ${newC.name} (${newC.customerCode || newC.id}).`);
          setTimeout(() => setNotificationBanner(null), 5000);
        }}
        existingCustomers={clients}
      />

      {/* Merge Modal */}
      <CustomerMergeModal
        isOpen={isMergeModalOpen}
        onClose={() => {
          setIsMergeModalOpen(false);
          setMergeTargetClient(null);
        }}
        clients={clients}
        events={events}
        quotations={quotations}
        invoices={invoices}
        initialClient={mergeTargetClient}
        onConfirmMerge={handleConfirmMerge}
      />

      {/* QA Compliance Modal */}
      <CustomerQAExportModal
        isOpen={isQAModalOpen}
        onClose={() => setIsQAModalOpen(false)}
      />
    </div>
  );
}
