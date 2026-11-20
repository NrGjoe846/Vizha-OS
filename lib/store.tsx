'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Client,
  Lead,
  Venue,
  Vendor,
  EventModel,
  Quotation,
  Invoice,
  EventExpense,
  InventoryItem,
  EventGuest,
  Ticket,
  TicketType,
  LeadStage,
  EventStatus,
  EventEquipmentRequisition,
  VendorWorkOrder,
  AuditLog,
  CRMCampaign,
  CRMActivity,
  CRMFollowUp,
  CRMEventFunction,
  CRMLeadScore,
  CRMLossRecord,
  CRMNegotiation,
  CustomerContact,
  CustomerAddress,
  CustomerDocument,
  CustomerCommunication,
  CustomerNote,
  CustomerFeedbackRecord,
  CustomerComplaint,
  CustomerStatus
} from './types';
import {
  DEMO_USERS,
  INITIAL_CLIENTS,
  INITIAL_LEADS,
  INITIAL_VENUES,
  INITIAL_VENDORS,
  INITIAL_EVENTS,
  INITIAL_QUOTATIONS,
  INITIAL_INVOICES,
  INITIAL_EXPENSES,
  INITIAL_INVENTORY,
  INITIAL_GUESTS,
  INITIAL_TICKET_TYPES,
  INITIAL_TICKETS,
  INITIAL_REQUISITIONS,
  INITIAL_WORK_ORDERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CAMPAIGNS
} from './mock-data';

interface ERPContextType {
  currentUser: UserProfile;
  switchUser: (role: string) => void;
  users: UserProfile[];

  // Branch Governance
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;

  // Clients & Customer Directory
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'totalBookings' | 'totalSpent'>) => Client;
  updateCustomer: (id: string, updates: Partial<Client>) => void;
  addCustomerContact: (customerId: string, contact: Omit<CustomerContact, 'id'>) => void;
  updateCustomerContact: (customerId: string, contactId: string, updates: Partial<CustomerContact>) => void;
  deleteCustomerContact: (customerId: string, contactId: string) => void;
  addCustomerAddress: (customerId: string, address: Omit<CustomerAddress, 'id'>) => void;
  updateCustomerAddress: (customerId: string, addressId: string, updates: Partial<CustomerAddress>) => void;
  deleteCustomerAddress: (customerId: string, addressId: string) => void;
  addCustomerDocument: (customerId: string, doc: Omit<CustomerDocument, 'id' | 'uploadedAt'>) => void;
  addCustomerCommunication: (customerId: string, comm: Omit<CustomerCommunication, 'id' | 'timestamp'>) => void;
  addCustomerNote: (customerId: string, note: Omit<CustomerNote, 'id' | 'createdAt'>) => void;
  addCustomerFeedback: (customerId: string, fb: Omit<CustomerFeedbackRecord, 'id'>) => void;
  addCustomerComplaint: (customerId: string, comp: Omit<CustomerComplaint, 'id' | 'ticketNo' | 'createdAt'>) => void;
  updateCustomerComplaint: (customerId: string, complaintId: string, updates: Partial<CustomerComplaint>) => void;
  mergeCustomers: (masterId: string, secondaryId: string, reason: string) => void;
  archiveCustomer: (customerId: string, reason?: string) => void;
  restoreCustomer: (customerId: string) => void;
  blockCustomer: (customerId: string, reason: string) => void;
  bulkUpdateCustomerStatus: (customerIds: string[], status: CustomerStatus) => void;
  bulkAssignAccountManager: (customerIds: string[], manager: string) => void;
  bulkAddCustomerTags: (customerIds: string[], tags: string[]) => void;

  // Leads & CRM Pipeline
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  updateLeadStage: (id: string, stage: LeadStage, validationRemarks?: string) => void;
  convertLead: (leadId: string) => { client: Client; event: EventModel };
  convertLeadToQuotation: (leadId: string) => Quotation;
  addLeadActivity: (leadId: string, activity: Omit<CRMActivity, 'id' | 'leadId' | 'timestamp'>) => void;
  scheduleLeadFollowUp: (leadId: string, followUp: Omit<CRMFollowUp, 'id' | 'leadId' | 'isCompleted'>) => void;
  completeLeadFollowUp: (followUpId: string, outcome: string) => void;
  assignLead: (leadId: string, newSalesperson: string, reason: string) => void;
  markLeadLost: (leadId: string, lossRecord: CRMLossRecord) => void;
  reopenLead: (leadId: string) => void;
  updateLeadScore: (leadId: string, score: CRMLeadScore) => void;
  saveLeadFunctions: (leadId: string, functions: CRMEventFunction[]) => void;
  saveLeadNegotiation: (leadId: string, negotiation: CRMNegotiation) => void;
  executeOperationsHandover: (leadId: string, handoverNotes: string, assignedManager?: string) => { client: Client; event: EventModel };

  // Marketing Campaigns
  campaigns: CRMCampaign[];
  addCampaign: (campaign: Omit<CRMCampaign, 'id' | 'leadsGenerated' | 'wonBookings' | 'revenueGenerated'>) => void;

  // Venues & Vendors
  venues: Venue[];
  vendors: Vendor[];
  addVenue: (venue: Omit<Venue, 'id'>) => void;
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;

  // Events
  events: EventModel[];
  addEvent: (event: Omit<EventModel, 'id' | 'code' | 'schedules' | 'tasks'>) => void;
  updateEventStatus: (id: string, status: EventStatus) => void;
  addEventSchedule: (eventId: string, schedule: { dayNumber: number; timeSlot: string; title: string; description: string; leadPerson: string; cueNotes?: string }) => void;
  toggleEventSchedule: (eventId: string, scheduleId: string) => void;
  addEventTask: (eventId: string, task: { title: string; category: any; priority: any; assignedTo: string; dueDate: string }) => void;
  toggleEventTask: (eventId: string, taskId: string) => void;

  // Quotations
  quotations: Quotation[];
  addQuotation: (quotation: Omit<Quotation, 'id' | 'quotationNo'>) => void;
  updateQuotationStatus: (id: string, status: 'draft' | 'sent' | 'approved' | 'rejected') => void;
  generateMilestoneInvoices: (quotationId: string) => Invoice[];

  // Invoices & Payments
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNo' | 'payments' | 'paidAmount' | 'balanceDue' | 'status'>) => void;
  recordPayment: (invoiceId: string, payment: { amount: number; paymentMethod: string; referenceNo: string }) => void;
  submitClientRemittance: (invoiceId: string, remittance: { amount: number; paymentMethod: string; referenceNo: string }) => void;
  verifyClientRemittance: (invoiceId: string, approve: boolean) => void;

  // Expenses
  expenses: EventExpense[];
  addExpense: (expense: Omit<EventExpense, 'id'>) => void;
  updateExpenseStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => void;

  // Inventory & Equipment Fleet
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  equipmentRequisitions: EventEquipmentRequisition[];
  addEquipmentRequisition: (req: Omit<EventEquipmentRequisition, 'id' | 'status' | 'requisitionDate'>) => void;
  updateRequisitionStatus: (id: string, status: 'reserved' | 'dispatched' | 'returned') => void;

  // Vendor Work Orders (POs)
  vendorWorkOrders: VendorWorkOrder[];
  addVendorWorkOrder: (wo: Omit<VendorWorkOrder, 'id' | 'workOrderNo' | 'status' | 'issuedDate'>) => void;
  updateWorkOrderStatus: (id: string, status: VendorWorkOrder['status']) => void;
  submitVendorBill: (workOrderId: string, bill: { amount: number; description: string }) => void;

  // Guests
  guests: EventGuest[];
  addGuest: (guest: Omit<EventGuest, 'id' | 'passCode' | 'isCheckedIn'>) => void;
  toggleGuestCheckIn: (id: string) => void;

  // Tickets
  ticketTypes: TicketType[];
  tickets: Ticket[];
  verifyTicket: (qrToken: string) => { success: boolean; message: string; ticket?: Ticket };
  issueTicket: (ticketTypeId: string, buyerName: string, buyerEmail: string, buyerPhone?: string) => Ticket;

  // Audit Logs
  auditLogs: AuditLog[];
  logAuditAction: (action: string, entityType: AuditLog['entityType'], entityId: string, details: string) => void;

  // Mobile Navigation
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  // Reset to default
  resetDemoData: () => void;
}

const ERPContext = createContext<ERPContextType | null>(null);

const STORAGE_KEY = 'eventflow_erp_v3_state';

export function ERPProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]);
  const [selectedBranch, setSelectedBranch] = useState<string>('All Branches');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [venues, setVenues] = useState<Venue[]>(INITIAL_VENUES);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [events, setEvents] = useState<EventModel[]>(INITIAL_EVENTS);
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [expenses, setExpenses] = useState<EventExpense[]>(INITIAL_EXPENSES);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [equipmentRequisitions, setEquipmentRequisitions] = useState<EventEquipmentRequisition[]>(INITIAL_REQUISITIONS);
  const [vendorWorkOrders, setVendorWorkOrders] = useState<VendorWorkOrder[]>(INITIAL_WORK_ORDERS);
  const [guests, setGuests] = useState<EventGuest[]>(INITIAL_GUESTS);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>(INITIAL_TICKET_TYPES);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [campaigns, setCampaigns] = useState<CRMCampaign[]>(INITIAL_CAMPAIGNS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.clients) setClients(parsed.clients);
        if (parsed.leads) setLeads(parsed.leads);
        if (parsed.venues) setVenues(parsed.venues);
        if (parsed.vendors) setVendors(parsed.vendors);
        if (parsed.events) setEvents(parsed.events);
        if (parsed.quotations) setQuotations(parsed.quotations);
        if (parsed.invoices) setInvoices(parsed.invoices);
        if (parsed.expenses) setExpenses(parsed.expenses);
        if (parsed.inventory) setInventory(parsed.inventory);
        if (parsed.equipmentRequisitions) setEquipmentRequisitions(parsed.equipmentRequisitions);
        if (parsed.vendorWorkOrders) setVendorWorkOrders(parsed.vendorWorkOrders);
        if (parsed.guests) setGuests(parsed.guests);
        if (parsed.ticketTypes) setTicketTypes(parsed.ticketTypes);
        if (parsed.tickets) setTickets(parsed.tickets);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        if (parsed.campaigns) setCampaigns(parsed.campaigns);
        if (parsed.selectedBranch) setSelectedBranch(parsed.selectedBranch);
        if (parsed.currentUserId) {
          const user = DEMO_USERS.find(u => u.id === parsed.currentUserId);
          if (user) setCurrentUser(user);
        }
      }
    } catch (e) {
      console.error('Failed to load stored ERP state', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to local storage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const state = {
        currentUserId: currentUser.id,
        selectedBranch,
        clients,
        leads,
        venues,
        vendors,
        events,
        quotations,
        invoices,
        expenses,
        inventory,
        equipmentRequisitions,
        vendorWorkOrders,
        guests,
        ticketTypes,
        tickets,
        auditLogs,
        campaigns
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to persist ERP state', e);
    }
  }, [
    isLoaded,
    currentUser,
    selectedBranch,
    clients,
    leads,
    venues,
    vendors,
    events,
    quotations,
    invoices,
    expenses,
    inventory,
    equipmentRequisitions,
    vendorWorkOrders,
    guests,
    ticketTypes,
    tickets,
    auditLogs,
    campaigns
  ]);

  const logAuditAction = (
    action: string,
    entityType: AuditLog['entityType'],
    entityId: string,
    details: string
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      actorName: currentUser.name,
      actorRole: currentUser.roleTitle,
      action,
      entityType,
      entityId,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const switchUser = (roleOrId: string) => {
    const user = DEMO_USERS.find(u => u.role === roleOrId || u.id === roleOrId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const addClient = (clientData: Omit<Client, 'id' | 'totalBookings' | 'totalSpent'>): Client => {
    const nextNum = clients.length + 1;
    const generatedCode = clientData.customerCode || `CUS-2026-${String(nextNum).padStart(5, '0')}`;
    const newId = `c-${Date.now()}`;

    const defaultContact: CustomerContact = {
      id: `con-${Date.now()}`,
      name: clientData.primaryContact || clientData.name,
      role: clientData.companyName ? 'Authorized Signatory' : 'Owner / Director',
      phone: clientData.phone,
      email: clientData.email,
      isPrimary: true,
      isDecisionMaker: true,
      isBillingContact: true,
      portalAccess: true,
      permissions: {
        canViewQuotations: true,
        canApproveProposals: true,
        canViewInvoices: true,
        canMakePayments: true,
        canViewEventDetails: true,
        canUploadDocuments: true,
        canManageContacts: true
      }
    };

    const defaultAddress: CustomerAddress = {
      id: `addr-${Date.now()}`,
      addressName: 'Primary Location',
      type: clientData.companyName ? 'Registered office' : 'Residential address',
      line1: 'Main Road',
      city: clientData.city || 'Mumbai',
      state: clientData.state || 'Maharashtra',
      country: 'India',
      pinCode: '400001',
      isPrimaryBilling: true,
      isPrimaryCommunication: true,
      isPrimaryEvent: false
    };

    const newClient: Client = {
      ...clientData,
      id: newId,
      customerCode: generatedCode,
      displayName: clientData.displayName || (clientData.companyName ? `${clientData.name} (${clientData.companyName})` : clientData.name),
      customerType: clientData.customerType || (clientData.companyName ? 'Corporate' : 'Individual'),
      category: clientData.category || 'Regular',
      status: clientData.status || 'active',
      primaryContact: clientData.primaryContact || clientData.name,
      totalBookings: 0,
      totalSpent: 0,
      totalInvoiced: 0,
      totalOutstanding: 0,
      advanceBalance: 0,
      loyaltyPoints: 0,
      referralCount: 0,
      registeredAt: new Date().toISOString().split('T')[0],
      branchName: clientData.branchName || selectedBranch !== 'All Branches' ? selectedBranch : 'Mumbai HQ',
      accountManager: clientData.accountManager || 'Rajesh Verma',
      contacts: clientData.contacts && clientData.contacts.length > 0 ? clientData.contacts : [defaultContact],
      addresses: clientData.addresses && clientData.addresses.length > 0 ? clientData.addresses : [defaultAddress],
      documents: clientData.documents || [],
      communications: clientData.communications || [],
      notes: clientData.notes || [],
      feedback: clientData.feedback || [],
      complaints: clientData.complaints || [],
      relationships: clientData.relationships || [],
      auditLogs: [
        {
          id: `aud-${Date.now()}`,
          action: 'Created Customer Master Record',
          performedBy: currentUser.name,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          details: `Registered ${clientData.name} (${generatedCode}) under ${clientData.customerType || 'General'} classification`
        }
      ]
    };

    setClients(prev => [newClient, ...prev]);
    logAuditAction(`Created Customer Master`, 'event', newClient.id, `Created authoritative customer profile ${newClient.customerCode} for ${newClient.name}`);
    return newClient;
  };

  const updateCustomer = (id: string, updates: Partial<Client>) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        const auditEntry = {
          id: `aud-${Date.now()}`,
          action: 'Updated Customer Profile',
          performedBy: currentUser.name,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          details: `Updated fields: ${Object.keys(updates).join(', ')}`
        };
        return {
          ...c,
          ...updates,
          auditLogs: [auditEntry, ...(c.auditLogs || [])]
        };
      })
    );
    logAuditAction(`Updated Customer Profile`, 'event', id, `Updated customer master record`);
  };

  const addCustomerContact = (customerId: string, contactData: Omit<CustomerContact, 'id'>) => {
    const newContact: CustomerContact = {
      ...contactData,
      id: `con-${Date.now()}`
    };

    setClients(prev =>
      prev.map(c => {
        if (c.id !== customerId) return c;
        const currentContacts = c.contacts || [];
        // If new contact is primary, remove primary flag from others
        const updatedContacts = newContact.isPrimary
          ? currentContacts.map(con => ({ ...con, isPrimary: false }))
          : currentContacts;

        return {
          ...c,
          contacts: [...updatedContacts, newContact]
        };
      })
    );
    logAuditAction(`Added Contact Person`, 'event', customerId, `Added contact ${newContact.name} (${newContact.role})`);
  };

  const updateCustomerContact = (customerId: string, contactId: string, updates: Partial<CustomerContact>) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id !== customerId) return c;
        const currentContacts = c.contacts || [];
        return {
          ...c,
          contacts: currentContacts.map(con => (con.id === contactId ? { ...con, ...updates } : con))
        };
      })
    );
  };

  const deleteCustomerContact = (customerId: string, contactId: string) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id !== customerId) return c;
        return {
          ...c,
          contacts: (c.contacts || []).filter(con => con.id !== contactId)
        };
      })
    );
  };

  const addCustomerAddress = (customerId: string, addressData: Omit<CustomerAddress, 'id'>) => {
    const newAddress: CustomerAddress = {
      ...addressData,
      id: `addr-${Date.now()}`
    };

    setClients(prev =>
      prev.map(c => {
        if (c.id !== customerId) return c;
        const currentAddrs = c.addresses || [];
        const updatedAddrs = newAddress.isPrimaryBilling
          ? currentAddrs.map(a => ({ ...a, isPrimaryBilling: false }))
          : currentAddrs;

        return {
          ...c,
          addresses: [...updatedAddrs, newAddress]
        };
      })
    );
    logAuditAction(`Added Address`, 'event', customerId, `Added ${newAddress.type} (${newAddress.city})`);
  };

  const updateCustomerAddress = (customerId: string, addressId: string, updates: Partial<CustomerAddress>) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id !== customerId) return c;
        return {
          ...c,
          addresses: (c.addresses || []).map(a => (a.id === addressId ? { ...a, ...updates } : a))
        };
      })
    );
  };

  const deleteCustomerAddress = (customerId: string, addressId: string) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id !== customerId) return c;
        return {
          ...c,
          addresses: (c.addresses || []).filter(a => a.id !== addressId)
        };
      })
    );
  };

  const addCustomerDocument = (customerId: string, docData: Omit<CustomerDocument, 'id' | 'uploadedAt'>) => {
    const newDoc: CustomerDocument = {
      ...docData,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0]
    };

    setClients(prev =>
      prev.map(c => {
        if (c.id !== customerId) return c;
        return {
          ...c,
          documents: [newDoc, ...(c.documents || [])]
        };
      })
    );
    logAuditAction(`Uploaded Customer Document`, 'event', customerId, `Uploaded ${newDoc.name} (${newDoc.category})`);
  };

  const addCustomerCommunication = (customerId: string, commData: Omit<CustomerCommunication, 'id' | 'timestamp'>) => {
    const newComm: CustomerCommunication = {
      ...commData,
      id: `comm-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setClients(prev =>
      prev.map(c => {
        if (c.id !== customerId) return c;
        return {
          ...c,
          communications: [newComm, ...(c.communications || [])]
        };
      })
    );
  };

  const addCustomerNote = (customerId: string, noteData: Omit<CustomerNote, 'id' | 'createdAt'>) => {
    const newNote: CustomerNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setClients(prev =>
      prev.map(c => {
        if (c.id !== customerId) return c;
        return {
          ...c,
          notes: [newNote, ...(c.notes || [])]
        };
      })
    );
  };

  const addCustomerFeedback = (customerId: string, fbData: Omit<CustomerFeedbackRecord, 'id'>) => {
    const newFb: CustomerFeedbackRecord = {
      ...fbData,
      id: `fb-${Date.now()}`
    };

    setClients(prev =>
      prev.map(c => {
        if (c.id !== customerId) return c;
        return {
          ...c,
          feedback: [newFb, ...(c.feedback || [])]
        };
      })
    );
    logAuditAction(`Recorded Customer Feedback`, 'event', customerId, `Recorded rating ${newFb.rating}★ (${newFb.csatScore}% CSAT)`);
  };

  const addCustomerComplaint = (customerId: string, compData: Omit<CustomerComplaint, 'id' | 'ticketNo' | 'createdAt'>) => {
    const ticketNo = `CMP-2026-${String(Math.floor(100 + Math.random() * 900))}`;
    const newComplaint: CustomerComplaint = {
      ...compData,
      id: `comp-${Date.now()}`,
      ticketNo,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setClients(prev =>
      prev.map(c => {
        if (c.id !== customerId) return c;
        return {
          ...c,
          complaints: [newComplaint, ...(c.complaints || [])]
        };
      })
    );
    logAuditAction(`Logged Customer Complaint`, 'event', customerId, `Created ticket ${ticketNo}: ${newComplaint.title}`);
  };

  const updateCustomerComplaint = (customerId: string, complaintId: string, updates: Partial<CustomerComplaint>) => {
    setClients(prev =>
      prev.map(c => {
        if (c.id !== customerId) return c;
        return {
          ...c,
          complaints: (c.complaints || []).map(comp => comp.id === complaintId ? { ...comp, ...updates } : comp)
        };
      })
    );
  };

  const mergeCustomers = (masterId: string, secondaryId: string, reason: string) => {
    const master = clients.find(c => c.id === masterId);
    const secondary = clients.find(c => c.id === secondaryId);
    if (!master || !secondary) return;

    // 1. Re-associate all events from secondary to master
    setEvents(prev => prev.map(e => e.clientId === secondaryId ? { ...e, clientId: masterId, clientName: master.name } : e));

    // 2. Re-associate quotations from secondary to master
    setQuotations(prev => prev.map(q => q.clientId === secondaryId ? { ...q, clientId: masterId, clientName: master.name } : q));

    // 3. Re-associate invoices from secondary to master
    setInvoices(prev => prev.map(inv => inv.clientId === secondaryId ? { ...inv, clientId: masterId, clientName: master.name } : inv));

    // 4. Merge contacts, addresses, documents, notes, communications, feedback, complaints into master
    const combinedContacts = [...(master.contacts || []), ...(secondary.contacts || [])];
    const combinedAddresses = [...(master.addresses || []), ...(secondary.addresses || [])];
    const combinedDocuments = [...(master.documents || []), ...(secondary.documents || [])];
    const combinedNotes = [...(master.notes || []), ...(secondary.notes || [])];
    const combinedComms = [...(master.communications || []), ...(secondary.communications || [])];
    const combinedFeedback = [...(master.feedback || []), ...(secondary.feedback || [])];
    const combinedComplaints = [...(master.complaints || []), ...(secondary.complaints || [])];

    const auditEntryMaster = {
      id: `aud-${Date.now()}`,
      action: 'Merged Duplicate Customer Profile',
      performedBy: currentUser.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      details: `Merged secondary record ${secondary.customerCode || secondary.id} (${secondary.name}) into this master record. Reason: ${reason}`
    };

    const auditEntrySecondary = {
      id: `aud-${Date.now() + 1}`,
      action: 'Profile Merged & Archived',
      performedBy: currentUser.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      details: `Merged into surviving master record ${master.customerCode || master.id} (${master.name}). Reason: ${reason}`
    };

    setClients(prev =>
      prev.map(c => {
        if (c.id === masterId) {
          return {
            ...c,
            totalBookings: c.totalBookings + secondary.totalBookings,
            totalSpent: c.totalSpent + secondary.totalSpent,
            contacts: combinedContacts,
            addresses: combinedAddresses,
            documents: combinedDocuments,
            notes: combinedNotes,
            communications: combinedComms,
            feedback: combinedFeedback,
            complaints: combinedComplaints,
            auditLogs: [auditEntryMaster, ...(c.auditLogs || [])]
          };
        }
        if (c.id === secondaryId) {
          return {
            ...c,
            status: 'archived',
            mergedWithId: masterId,
            auditLogs: [auditEntrySecondary, ...(c.auditLogs || [])]
          };
        }
        return c;
      })
    );

    logAuditAction(`Merged Duplicate Customers`, 'event', masterId, `Merged ${secondary.name} into ${master.name}. Re-assigned all events and financial ledgers.`);
  };

  const archiveCustomer = (customerId: string, reason = 'Archived via Customer Directory') => {
    updateCustomer(customerId, { status: 'archived', internalNotes: reason });
  };

  const restoreCustomer = (customerId: string) => {
    updateCustomer(customerId, { status: 'active' });
  };

  const blockCustomer = (customerId: string, reason: string) => {
    updateCustomer(customerId, { status: 'blocked', internalNotes: reason });
  };

  const bulkUpdateCustomerStatus = (customerIds: string[], status: CustomerStatus) => {
    setClients(prev => prev.map(c => customerIds.includes(c.id) ? { ...c, status } : c));
    logAuditAction(`Bulk Status Update`, 'event', 'multiple', `Updated status to ${status} for ${customerIds.length} customers`);
  };

  const bulkAssignAccountManager = (customerIds: string[], manager: string) => {
    setClients(prev => prev.map(c => customerIds.includes(c.id) ? { ...c, accountManager: manager } : c));
    logAuditAction(`Bulk Manager Assignment`, 'event', 'multiple', `Assigned ${manager} to ${customerIds.length} customers`);
  };

  const bulkAddCustomerTags = (customerIds: string[], newTags: string[]) => {
    setClients(prev =>
      prev.map(c => {
        if (!customerIds.includes(c.id)) return c;
        const current = c.tags || [];
        const merged = Array.from(new Set([...current, ...newTags]));
        return { ...c, tags: merged };
      })
    );
    logAuditAction(`Bulk Tag Assignment`, 'event', 'multiple', `Added tags [${newTags.join(', ')}] to ${customerIds.length} customers`);
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLeads(prev => [newLead, ...prev]);
    logAuditAction(`Logged New Sales Lead`, 'lead', newLead.id, `Inbound lead registered: ${newLead.title} for ${newLead.clientName}`);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, ...updates } : lead));
    logAuditAction(`Updated Lead Profile`, 'lead', id, `Updated CRM fields on lead`);
  };

  const updateLeadStage = (id: string, stage: LeadStage, validationRemarks?: string) => {
    setLeads(prev =>
      prev.map(lead => {
        if (lead.id !== id) return lead;
        return {
          ...lead,
          stage,
          stageUpdatedAt: new Date().toISOString().split('T')[0],
          daysInCurrentStage: 0
        };
      })
    );
    logAuditAction(
      `Updated Lead Pipeline Stage`,
      'lead',
      id,
      `Advanced to ${stage.toUpperCase()}${validationRemarks ? ` (${validationRemarks})` : ''}`
    );
  };

  const addLeadActivity = (leadId: string, activityData: Omit<CRMActivity, 'id' | 'leadId' | 'timestamp'>) => {
    const newActivity: CRMActivity = {
      ...activityData,
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      leadId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setLeads(prev =>
      prev.map(lead => {
        if (lead.id !== leadId) return lead;
        return {
          ...lead,
          activities: [newActivity, ...(lead.activities || [])]
        };
      })
    );
    logAuditAction(
      `Logged CRM Activity: ${activityData.type.toUpperCase()}`,
      'lead',
      leadId,
      `${activityData.title} - Outcome: ${activityData.outcome || 'Logged'}`
    );
  };

  const scheduleLeadFollowUp = (leadId: string, followUpData: Omit<CRMFollowUp, 'id' | 'leadId' | 'isCompleted'>) => {
    const newFollowUp: CRMFollowUp = {
      ...followUpData,
      id: `fu-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      leadId,
      isCompleted: false
    };

    setLeads(prev =>
      prev.map(lead => {
        if (lead.id !== leadId) return lead;
        return {
          ...lead,
          followUps: [newFollowUp, ...(lead.followUps || [])]
        };
      })
    );
    logAuditAction(
      `Scheduled Follow-up`,
      'lead',
      leadId,
      `${followUpData.activityType.toUpperCase()} for ${followUpData.scheduledDate} ${followUpData.scheduledTime} assigned to ${followUpData.assignedTo}`
    );
  };

  const completeLeadFollowUp = (followUpId: string, outcome: string) => {
    setLeads(prev =>
      prev.map(lead => {
        if (!lead.followUps) return lead;
        const updatedFollowUps = lead.followUps.map(fu =>
          fu.id === followUpId
            ? { ...fu, isCompleted: true, completedAt: new Date().toISOString().replace('T', ' ').substring(0, 16), outcome }
            : fu
        );
        return { ...lead, followUps: updatedFollowUps };
      })
    );
    logAuditAction(`Completed Scheduled Follow-up`, 'lead', followUpId, `Outcome: ${outcome}`);
  };

  const assignLead = (leadId: string, newSalesperson: string, reason: string) => {
    setLeads(prev =>
      prev.map(lead => {
        if (lead.id !== leadId) return lead;
        const transfer = {
          fromUser: lead.assignedTo,
          toUser: newSalesperson,
          date: new Date().toISOString().split('T')[0],
          reason
        };
        return {
          ...lead,
          assignedTo: newSalesperson,
          transferHistory: [transfer, ...(lead.transferHistory || [])]
        };
      })
    );
    logAuditAction(`Reassigned Lead Owner`, 'lead', leadId, `Transferred lead to ${newSalesperson}. Reason: ${reason}`);
  };

  const markLeadLost = (leadId: string, lossRecord: CRMLossRecord) => {
    setLeads(prev =>
      prev.map(lead => {
        if (lead.id !== leadId) return lead;
        return {
          ...lead,
          stage: 'lost',
          lossRecord,
          stageUpdatedAt: new Date().toISOString().split('T')[0],
          daysInCurrentStage: 0
        };
      })
    );
    logAuditAction(
      `Marked Lead as Lost`,
      'lead',
      leadId,
      `Reason: ${lossRecord.lossReason}${lossRecord.competitorName ? ` (Competitor: ${lossRecord.competitorName})` : ''}`
    );
  };

  const reopenLead = (leadId: string) => {
    setLeads(prev =>
      prev.map(lead => {
        if (lead.id !== leadId) return lead;
        return {
          ...lead,
          stage: 'qualified',
          lossRecord: undefined,
          stageUpdatedAt: new Date().toISOString().split('T')[0],
          daysInCurrentStage: 0
        };
      })
    );
    logAuditAction(`Reopened Lost Lead for Nurture`, 'lead', leadId, `Re-engaged opportunity moved back to Qualified stage.`);
  };

  const updateLeadScore = (leadId: string, score: CRMLeadScore) => {
    setLeads(prev =>
      prev.map(lead => {
        if (lead.id !== leadId) return lead;
        return { ...lead, score };
      })
    );
    logAuditAction(`Calculated Lead Qualification Score`, 'lead', leadId, `Score updated to ${score.totalScore}/100 (${score.category})`);
  };

  const saveLeadFunctions = (leadId: string, functions: CRMEventFunction[]) => {
    setLeads(prev =>
      prev.map(lead => {
        if (lead.id !== leadId) return lead;
        return { ...lead, functions };
      })
    );
    logAuditAction(`Saved Multi-Function Event Requirements`, 'lead', leadId, `Defined ${functions.length} event functions.`);
  };

  const saveLeadNegotiation = (leadId: string, negotiation: CRMNegotiation) => {
    setLeads(prev =>
      prev.map(lead => {
        if (lead.id !== leadId) return lead;
        return { ...lead, negotiation };
      })
    );
    logAuditAction(`Updated Commercial Negotiation Terms`, 'lead', leadId, `Negotiated Price: ₹${negotiation.negotiatedPrice.toLocaleString('en-IN')}, Margin: ${negotiation.expectedGrossMargin}%`);
  };

  const executeOperationsHandover = (leadId: string, handoverNotes: string, assignedManager = 'Priya Sharma') => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    // 1. Create or link Client
    const existingClient = clients.find(c => c.name.toLowerCase() === lead.clientName.toLowerCase() || c.email.toLowerCase() === lead.email.toLowerCase());
    let clientToUse: Client;

    if (existingClient) {
      clientToUse = {
        ...existingClient,
        totalBookings: existingClient.totalBookings + 1,
        totalSpent: existingClient.totalSpent + (lead.negotiation?.negotiatedPrice || lead.estimatedBudget)
      };
      setClients(prev => prev.map(c => c.id === existingClient.id ? clientToUse : c));
    } else {
      const generatedCode = `CUS-2026-${String(clients.length + 1).padStart(5, '0')}`;
      clientToUse = addClient({
        name: lead.clientName,
        customerCode: generatedCode,
        companyName: lead.companyName || undefined,
        displayName: lead.companyName ? `${lead.clientName} (${lead.companyName})` : lead.clientName,
        customerType: lead.companyName ? 'Corporate' : 'Individual',
        category: (lead.negotiation?.negotiatedPrice || lead.estimatedBudget) >= 5000000 ? 'VIP' : 'Regular',
        status: 'active',
        email: lead.email,
        phone: lead.phone,
        alternatePhone: lead.alternatePhone,
        city: lead.city || 'Mumbai',
        source: lead.source,
        branchName: lead.branchName || 'Mumbai HQ',
        accountManager: assignedManager,
        tags: [lead.eventType, 'Converted from Lead', lead.priority === 'urgent' ? 'High Value' : 'Standard']
      });
    }

    // 2. Create Event Record
    const newEvent: EventModel = {
      id: `evt-${Date.now()}`,
      code: `EVT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: lead.title,
      eventType: lead.eventType,
      clientName: clientToUse.name,
      clientId: clientToUse.id,
      venueName: lead.venueName || lead.eventLocation || 'The Grand Oberoi Ballroom, Mumbai',
      managerName: assignedManager,
      startDate: lead.eventDate || new Date().toISOString().split('T')[0],
      endDate: lead.eventEndDate || lead.eventDate || new Date().toISOString().split('T')[0],
      guestCount: lead.guestCount || 200,
      status: 'confirmed',
      budget: lead.negotiation?.negotiatedPrice || lead.estimatedBudget,
      actualSpend: 0,
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
      branchName: lead.branchName || 'Mumbai HQ',
      schedules: (lead.functions && lead.functions.length > 0)
        ? lead.functions.map((fn, idx) => ({
            id: `sch-${Date.now()}-${idx + 1}`,
            dayNumber: idx + 1,
            timeSlot: fn.startTime ? `${fn.startTime} - ${fn.endTime || 'Late'}` : '18:00 - 23:00',
            title: fn.functionName,
            description: `${fn.theme ? `Theme: ${fn.theme}. ` : ''}Services: ${fn.servicesNeeded.join(', ')}`,
            leadPerson: assignedManager,
            cueNotes: fn.notes,
            isCompleted: false
          }))
        : [
            {
              id: `sch-${Date.now()}-1`,
              dayNumber: 1,
              timeSlot: '10:00 - 12:00',
              title: 'Welcome & Registration',
              description: 'Guest check-in & welcome reception.',
              leadPerson: assignedManager,
              isCompleted: false
            }
          ],
      tasks: [
        {
          id: `tsk-${Date.now()}-1`,
          title: `Operational Handover Checklist: ${lead.title}`,
          category: 'Production',
          priority: 'urgent',
          assignedTo: assignedManager,
          dueDate: lead.eventDate,
          isCompleted: false
        },
        {
          id: `tsk-${Date.now()}-2`,
          title: 'Confirm Final Floorplan & Security NOC',
          category: 'Licensing',
          priority: 'high',
          assignedTo: assignedManager,
          dueDate: lead.eventDate,
          isCompleted: false
        }
      ]
    };

    setEvents(prev => [newEvent, ...prev]);

    // 3. Mark Lead as Converted & Handover Completed
    setLeads(prev =>
      prev.map(l =>
        l.id === leadId
          ? {
              ...l,
              stage: 'converted',
              handoverCompleted: true,
              stageUpdatedAt: new Date().toISOString().split('T')[0],
              daysInCurrentStage: 0,
              notes: `${l.notes || ''}\n[Handover to ${assignedManager}]: ${handoverNotes}`
            }
          : l
      )
    );

    logAuditAction(
      `Completed Booking Conversion & Operations Handover`,
      'event',
      newEvent.id,
      `Opportunity "${lead.title}" converted to Event ${newEvent.code}. Handover to Event Producer ${assignedManager}. Notes: ${handoverNotes}`
    );

    return { client: clientToUse, event: newEvent };
  };

  const addCampaign = (campaignData: Omit<CRMCampaign, 'id' | 'leadsGenerated' | 'wonBookings' | 'revenueGenerated'>) => {
    const newCamp: CRMCampaign = {
      ...campaignData,
      id: `cmp-${Date.now()}`,
      leadsGenerated: 0,
      wonBookings: 0,
      revenueGenerated: 0
    };
    setCampaigns(prev => [newCamp, ...prev]);
    logAuditAction(`Created Marketing Campaign`, 'lead', newCamp.id, `Campaign ${newCamp.name} (${newCamp.source}) registered with budget ₹${newCamp.budget.toLocaleString('en-IN')}`);
  };

  const convertLeadToQuotation = (leadId: string): Quotation => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    const subtotal = lead.estimatedBudget;
    const taxAmount = Math.round(subtotal * 0.18);
    const totalAmount = subtotal + taxAmount;

    const newQuotation: Quotation = {
      id: `qt-${Date.now()}`,
      quotationNo: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: lead.clientName,
      clientEmail: lead.email,
      eventTitle: lead.title,
      leadId: lead.id,
      issueDate: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      subtotal,
      taxRate: 18,
      taxAmount,
      discount: 0,
      totalAmount,
      status: 'draft',
      milestonesGenerated: false,
      items: [
        {
          id: `qi-${Date.now()}-1`,
          description: `Full Event Production & Management - ${lead.eventType}`,
          quantity: 1,
          unitPrice: subtotal,
          amount: subtotal
        }
      ]
    };

    setQuotations(prev => [newQuotation, ...prev]);
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: 'proposal_sent', quotationId: newQuotation.id } : l));
    logAuditAction(`Drafted Quotation for Lead`, 'quotation', newQuotation.id, `Generated draft quotation ${newQuotation.quotationNo} for ₹${totalAmount.toLocaleString('en-IN')}`);
    return newQuotation;
  };

  const convertLead = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    const existingClient = clients.find(c => c.name.toLowerCase() === lead.clientName.toLowerCase() || c.email.toLowerCase() === lead.email.toLowerCase());
    let targetClient: Client;

    if (existingClient) {
      targetClient = {
        ...existingClient,
        totalBookings: existingClient.totalBookings + 1,
        totalSpent: existingClient.totalSpent + (lead.negotiation?.negotiatedPrice || lead.estimatedBudget)
      };
      setClients(prev => prev.map(c => c.id === existingClient.id ? targetClient : c));
    } else {
      const generatedCode = `CUS-2026-${String(clients.length + 1).padStart(5, '0')}`;
      targetClient = addClient({
        name: lead.clientName,
        customerCode: generatedCode,
        companyName: lead.companyName || undefined,
        displayName: lead.companyName ? `${lead.clientName} (${lead.companyName})` : lead.clientName,
        customerType: lead.companyName ? 'Corporate' : 'Individual',
        category: lead.estimatedBudget >= 5000000 ? 'VIP' : 'Regular',
        status: 'active',
        email: lead.email,
        phone: lead.phone,
        alternatePhone: lead.alternatePhone,
        city: lead.city || 'Mumbai',
        source: lead.source,
        branchName: lead.branchName || 'Mumbai HQ',
        accountManager: lead.assignedTo || 'Rajesh Verma',
        tags: [lead.eventType, 'Converted from Lead']
      });
    }

    const newEvent: EventModel = {
      id: `evt-${Date.now()}`,
      code: `EVT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: lead.title,
      eventType: lead.eventType,
      clientName: targetClient.name,
      clientId: targetClient.id,
      venueName: 'The Grand Oberoi Ballroom, Mumbai',
      managerName: 'Priya Sharma',
      startDate: lead.eventDate || new Date().toISOString().split('T')[0],
      endDate: lead.eventDate || new Date().toISOString().split('T')[0],
      guestCount: lead.guestCount || 200,
      status: 'planning',
      budget: lead.estimatedBudget,
      actualSpend: 0,
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
      branchName: 'Mumbai HQ',
      schedules: [
        {
          id: `sch-${Date.now()}-1`,
          dayNumber: 1,
          timeSlot: '10:00 - 12:00',
          title: 'Welcome & Registration',
          description: 'Guest check-in & welcome reception.',
          leadPerson: 'Priya Sharma',
          isCompleted: false
        }
      ],
      tasks: [
        {
          id: `tsk-${Date.now()}-1`,
          title: 'Confirm Final Venue Floorplan',
          category: 'Production',
          priority: 'high',
          assignedTo: 'Priya Sharma',
          dueDate: lead.eventDate || new Date().toISOString().split('T')[0],
          isCompleted: false
        }
      ]
    };

    setEvents(prev => [newEvent, ...prev]);
    updateLeadStage(leadId, 'converted');
    logAuditAction(`Converted Lead to Live Event`, 'event', newEvent.id, `Lead converted to active event "${newEvent.title}" under ${newEvent.managerName}`);

    return { client: targetClient, event: newEvent };
  };

  const addVenue = (venueData: Omit<Venue, 'id'>) => {
    const newVenue: Venue = {
      ...venueData,
      id: `v-${Date.now()}`
    };
    setVenues(prev => [newVenue, ...prev]);
  };

  const addVendor = (vendorData: Omit<Vendor, 'id'>) => {
    const newVendor: Vendor = {
      ...vendorData,
      id: `ven-${Date.now()}`
    };
    setVendors(prev => [newVendor, ...prev]);
  };

  const addEvent = (eventData: Omit<EventModel, 'id' | 'code' | 'schedules' | 'tasks'>) => {
    const newEvent: EventModel = {
      ...eventData,
      id: `evt-${Date.now()}`,
      code: `EVT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      schedules: [],
      tasks: []
    };
    setEvents(prev => [newEvent, ...prev]);
    logAuditAction(`Created Production Event`, 'event', newEvent.id, `Created event ${newEvent.title} with budget ₹${newEvent.budget.toLocaleString('en-IN')}`);
  };

  const updateEventStatus = (id: string, status: EventStatus) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    logAuditAction(`Updated Event Status`, 'event', id, `Status updated to ${status.toUpperCase()}`);
  };

  const addEventSchedule = (
    eventId: string,
    schedule: { dayNumber: number; timeSlot: string; title: string; description: string; leadPerson: string; cueNotes?: string }
  ) => {
    setEvents(prev =>
      prev.map(e => {
        if (e.id !== eventId) return e;
        return {
          ...e,
          schedules: [
            ...e.schedules,
            {
              ...schedule,
              id: `sch-${Date.now()}`,
              isCompleted: false
            }
          ]
        };
      })
    );
  };

  const toggleEventSchedule = (eventId: string, scheduleId: string) => {
    setEvents(prev =>
      prev.map(e => {
        if (e.id !== eventId) return e;
        return {
          ...e,
          schedules: e.schedules.map(s => s.id === scheduleId ? { ...s, isCompleted: !s.isCompleted } : s)
        };
      })
    );
  };

  const addEventTask = (
    eventId: string,
    task: { title: string; category: any; priority: any; assignedTo: string; dueDate: string }
  ) => {
    setEvents(prev =>
      prev.map(e => {
        if (e.id !== eventId) return e;
        return {
          ...e,
          tasks: [
            ...e.tasks,
            {
              ...task,
              id: `tsk-${Date.now()}`,
              isCompleted: false
            }
          ]
        };
      })
    );
  };

  const toggleEventTask = (eventId: string, taskId: string) => {
    setEvents(prev =>
      prev.map(e => {
        if (e.id !== eventId) return e;
        return {
          ...e,
          tasks: e.tasks.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t)
        };
      })
    );
  };

  const addQuotation = (quotationData: Omit<Quotation, 'id' | 'quotationNo'>) => {
    const newQuotation: Quotation = {
      ...quotationData,
      id: `qt-${Date.now()}`,
      quotationNo: `QT-2026-${Math.floor(100 + Math.random() * 900)}`
    };
    setQuotations(prev => [newQuotation, ...prev]);
    logAuditAction(`Created Quotation`, 'quotation', newQuotation.id, `Created quotation ${newQuotation.quotationNo} for ${newQuotation.clientName}`);
  };

  const updateQuotationStatus = (id: string, status: 'draft' | 'sent' | 'approved' | 'rejected') => {
    let targetQuote: Quotation | undefined;
    setQuotations(prev =>
      prev.map(q => {
        if (q.id === id) {
          targetQuote = { ...q, status };
          return targetQuote;
        }
        return q;
      })
    );

    if (targetQuote && status === 'approved') {
      const quote = targetQuote;
      // Synchronize with Event budget
      if (quote.eventId) {
        setEvents(prev =>
          prev.map(e => e.id === quote.eventId ? { ...e, budget: quote.totalAmount } : e)
        );
      }
      // Synchronize with Client total spent
      if (quote.clientId) {
        setClients(prev =>
          prev.map(c => c.id === quote.clientId ? { ...c, totalSpent: c.totalSpent + quote.totalAmount } : c)
        );
      }
      logAuditAction(`Approved Quotation`, 'quotation', quote.id, `Quotation ${quote.quotationNo} approved. Commercial contract budget locked at ₹${quote.totalAmount.toLocaleString('en-IN')}`);
    } else {
      logAuditAction(`Updated Quotation Status`, 'quotation', id, `Quotation status updated to ${status.toUpperCase()}`);
    }
  };

  const generateMilestoneInvoices = (quotationId: string): Invoice[] => {
    const quote = quotations.find(q => q.id === quotationId);
    if (!quote) throw new Error('Quotation not found');

    const total = quote.totalAmount;
    const subtotal50 = Math.round(quote.subtotal * 0.5);
    const subtotal40 = Math.round(quote.subtotal * 0.4);
    const subtotal10 = quote.subtotal - subtotal50 - subtotal40;

    const milestones = [
      {
        title: 'Milestone 1: 50% Advance Booking',
        subtotal: subtotal50,
        dueDays: 2
      },
      {
        title: 'Milestone 2: 40% Production & Setup Advance',
        subtotal: subtotal40,
        dueDays: 14
      },
      {
        title: 'Milestone 3: 10% Final Event Settlement',
        subtotal: subtotal10,
        dueDays: 30
      }
    ];

    const today = new Date();
    const createdInvoices: Invoice[] = milestones.map((m, idx) => {
      const tax = Math.round(m.subtotal * (quote.taxRate / 100));
      const amount = m.subtotal + tax;
      const dueDate = new Date(today.getTime() + m.dueDays * 86400000).toISOString().split('T')[0];

      return {
        id: `inv-${Date.now()}-${idx + 1}`,
        invoiceNo: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
        quotationId: quote.id,
        milestoneTitle: m.title,
        clientId: quote.clientId,
        clientName: quote.clientName,
        clientEmail: quote.clientEmail,
        eventId: quote.eventId,
        eventTitle: quote.eventTitle,
        issueDate: today.toISOString().split('T')[0],
        dueDate,
        subtotal: m.subtotal,
        taxRate: quote.taxRate,
        taxAmount: tax,
        totalAmount: amount,
        paidAmount: 0,
        balanceDue: amount,
        status: 'unpaid',
        items: [
          {
            id: `ii-${Date.now()}-${idx + 1}`,
            description: `${m.title} - ${quote.eventTitle}`,
            quantity: 1,
            unitPrice: m.subtotal,
            amount: m.subtotal
          }
        ],
        payments: []
      };
    });

    setInvoices(prev => [...createdInvoices, ...prev]);
    setQuotations(prev => prev.map(q => q.id === quotationId ? { ...q, milestonesGenerated: true } : q));
    logAuditAction(
      `Generated Milestone Invoices`,
      'invoice',
      quotationId,
      `Generated 3 structured milestone invoices totaling ₹${total.toLocaleString('en-IN')} for ${quote.clientName}`
    );

    return createdInvoices;
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNo' | 'payments' | 'paidAmount' | 'balanceDue' | 'status'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      invoiceNo: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      payments: [],
      paidAmount: 0,
      balanceDue: invoiceData.totalAmount,
      status: 'unpaid'
    };
    setInvoices(prev => [newInvoice, ...prev]);
    logAuditAction(`Created Direct Invoice`, 'invoice', newInvoice.id, `Issued Invoice ${newInvoice.invoiceNo} for ₹${newInvoice.totalAmount.toLocaleString('en-IN')}`);
  };

  const recordPayment = (invoiceId: string, payment: { amount: number; paymentMethod: string; referenceNo: string }) => {
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id !== invoiceId) return inv;
        const newPaid = inv.paidAmount + payment.amount;
        const newBalance = Math.max(0, inv.totalAmount - newPaid);
        const status = newBalance === 0 ? 'paid' : 'partial';

        return {
          ...inv,
          paidAmount: newPaid,
          balanceDue: newBalance,
          status,
          pendingRemittance: undefined, // Clear pending remittance once verified/paid
          payments: [
            ...inv.payments,
            {
              id: `pay-${Date.now()}`,
              amount: payment.amount,
              paymentDate: new Date().toISOString().split('T')[0],
              paymentMethod: payment.paymentMethod,
              referenceNo: payment.referenceNo
            }
          ]
        };
      })
    );
    logAuditAction(`Recorded Invoice Payment`, 'invoice', invoiceId, `Logged payment of ₹${payment.amount.toLocaleString('en-IN')} via ${payment.paymentMethod} (Ref: ${payment.referenceNo})`);
  };

  const submitClientRemittance = (invoiceId: string, remittance: { amount: number; paymentMethod: string; referenceNo: string }) => {
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id !== invoiceId) return inv;
        return {
          ...inv,
          pendingRemittance: {
            ...remittance,
            submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          }
        };
      })
    );
    logAuditAction(`Client Remittance Submitted`, 'invoice', invoiceId, `Client submitted remittance UTR ${remittance.referenceNo} for ₹${remittance.amount.toLocaleString('en-IN')}`);
  };

  const verifyClientRemittance = (invoiceId: string, approve: boolean) => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv || !inv.pendingRemittance) return;

    if (approve) {
      recordPayment(invoiceId, {
        amount: inv.pendingRemittance.amount,
        paymentMethod: inv.pendingRemittance.paymentMethod,
        referenceNo: inv.pendingRemittance.referenceNo
      });
      logAuditAction(`Verified Client Remittance`, 'invoice', invoiceId, `Finance verified and approved wire transfer ${inv.pendingRemittance.referenceNo}`);
    } else {
      setInvoices(prev =>
        prev.map(i => i.id === invoiceId ? { ...i, pendingRemittance: undefined } : i)
      );
      logAuditAction(`Rejected Client Remittance`, 'invoice', invoiceId, `Finance rejected submitted payment advice for Invoice ${inv.invoiceNo}`);
    }
  };

  // Recalculates event actual spend whenever expenses change
  const syncEventActualSpend = (eventId: string, allExpenses: EventExpense[]) => {
    const totalApproved = allExpenses
      .filter(exp => exp.eventId === eventId && exp.status === 'approved')
      .reduce((sum, exp) => sum + exp.amount, 0);

    setEvents(prev =>
      prev.map(e => e.id === eventId ? { ...e, actualSpend: totalApproved } : e)
    );
  };

  const addExpense = (expenseData: Omit<EventExpense, 'id'>) => {
    const newExpense: EventExpense = {
      ...expenseData,
      id: `exp-${Date.now()}`
    };
    const nextExpenses = [newExpense, ...expenses];
    setExpenses(nextExpenses);
    if (newExpense.status === 'approved') {
      syncEventActualSpend(newExpense.eventId, nextExpenses);
    }
    logAuditAction(`Logged Event Expense`, 'expense', newExpense.id, `Added ₹${newExpense.amount.toLocaleString('en-IN')} under ${newExpense.category} for ${newExpense.eventTitle}`);
  };

  const updateExpenseStatus = (id: string, status: 'pending' | 'approved' | 'rejected') => {
    let affectedEventId = '';
    const nextExpenses = expenses.map(e => {
      if (e.id === id) {
        affectedEventId = e.eventId;
        return { ...e, status };
      }
      return e;
    });
    setExpenses(nextExpenses);
    if (affectedEventId) {
      syncEventActualSpend(affectedEventId, nextExpenses);
    }
    logAuditAction(`Updated Expense Status`, 'expense', id, `Expense status changed to ${status.toUpperCase()}`);
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-item-${Date.now()}`
    };
    setInventory(prev => [newItem, ...prev]);
    logAuditAction(`Added Equipment Fleet Item`, 'inventory', newItem.id, `Registered gear ${newItem.name} (Qty: ${newItem.totalQty})`);
  };

  const addEquipmentRequisition = (reqData: Omit<EventEquipmentRequisition, 'id' | 'status' | 'requisitionDate'>) => {
    const newReq: EventEquipmentRequisition = {
      ...reqData,
      id: `req-${Date.now()}`,
      status: 'reserved',
      requisitionDate: new Date().toISOString().split('T')[0]
    };
    setEquipmentRequisitions(prev => [newReq, ...prev]);

    // Reserve stock by increasing allocatedQty in inventory
    setInventory(prev =>
      prev.map(item => {
        if (item.id === reqData.itemId) {
          return {
            ...item,
            allocatedQty: Math.min(item.totalQty, item.allocatedQty + reqData.quantity)
          };
        }
        return item;
      })
    );
    logAuditAction(`Requisitioned Event Equipment`, 'inventory', newReq.id, `Reserved ${reqData.quantity}x ${reqData.itemName} for ${reqData.eventTitle}`);
  };

  const updateRequisitionStatus = (id: string, status: 'reserved' | 'dispatched' | 'returned') => {
    const req = equipmentRequisitions.find(r => r.id === id);
    if (!req) return;

    setEquipmentRequisitions(prev => prev.map(r => r.id === id ? { ...r, status } : r));

    // If returned, release allocated inventory
    if (status === 'returned') {
      setInventory(prev =>
        prev.map(item => {
          if (item.id === req.itemId) {
            return {
              ...item,
              allocatedQty: Math.max(0, item.allocatedQty - req.quantity)
            };
          }
          return item;
        })
      );
    }
    logAuditAction(`Updated Requisition Status`, 'inventory', id, `Equipment requisition status updated to ${status.toUpperCase()}`);
  };

  const addVendorWorkOrder = (woData: Omit<VendorWorkOrder, 'id' | 'workOrderNo' | 'status' | 'issuedDate'>) => {
    const newWo: VendorWorkOrder = {
      ...woData,
      id: `wo-${Date.now()}`,
      workOrderNo: `WO-2026-${Math.floor(100 + Math.random() * 900)}`,
      status: 'issued',
      issuedDate: new Date().toISOString().split('T')[0]
    };
    setVendorWorkOrders(prev => [newWo, ...prev]);
    logAuditAction(`Dispatched Vendor Work Order`, 'vendor_wo', newWo.id, `Issued ${newWo.workOrderNo} to ${newWo.vendorName} for ₹${newWo.contractAmount.toLocaleString('en-IN')}`);
  };

  const updateWorkOrderStatus = (id: string, status: VendorWorkOrder['status']) => {
    setVendorWorkOrders(prev => prev.map(wo => wo.id === id ? { ...wo, status } : wo));
    logAuditAction(`Updated Vendor Work Order`, 'vendor_wo', id, `Work order status updated to ${status.toUpperCase()}`);
  };

  const submitVendorBill = (workOrderId: string, bill: { amount: number; description: string }) => {
    const wo = vendorWorkOrders.find(w => w.id === workOrderId);
    if (!wo) return;

    // Update work order status to invoiced
    updateWorkOrderStatus(workOrderId, 'invoiced');

    // Create an expense record for accountant approval
    addExpense({
      eventId: wo.eventId,
      eventTitle: wo.eventTitle,
      category: wo.vendorCategory,
      description: `Vendor Bill: ${wo.workOrderNo} - ${bill.description}`,
      amount: bill.amount,
      vendorName: wo.vendorName,
      vendorWorkOrderId: wo.id,
      status: 'pending',
      expenseDate: new Date().toISOString().split('T')[0]
    });

    logAuditAction(`Vendor Submitted Invoice Bill`, 'vendor_wo', wo.id, `Vendor ${wo.vendorName} billed ₹${bill.amount.toLocaleString('en-IN')} against Work Order ${wo.workOrderNo}`);
  };

  const addGuest = (guestData: Omit<EventGuest, 'id' | 'passCode' | 'isCheckedIn'>) => {
    const newGuest: EventGuest = {
      ...guestData,
      id: `gst-${Date.now()}`,
      passCode: `PASS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      isCheckedIn: false
    };
    setGuests(prev => [newGuest, ...prev]);
    logAuditAction(`Registered Event Guest`, 'guest', newGuest.id, `Added guest ${newGuest.name} to ${newGuest.eventTitle} (Table ${newGuest.tableNo})`);
  };

  const toggleGuestCheckIn = (id: string) => {
    setGuests(prev =>
      prev.map(g => {
        if (g.id !== id) return g;
        const willCheckIn = !g.isCheckedIn;
        const updated = {
          ...g,
          isCheckedIn: willCheckIn,
          checkInTime: willCheckIn ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined
        };
        logAuditAction(
          willCheckIn ? `Checked In Guest` : `Reverted Check-in`,
          'guest',
          g.id,
          `${g.name} check-in status toggled to ${willCheckIn ? 'Present' : 'Not Present'}`
        );
        return updated;
      })
    );
  };

  const verifyTicket = (qrToken: string) => {
    const cleanToken = qrToken.trim();
    const ticket = tickets.find(t => t.qrToken.toLowerCase() === cleanToken.toLowerCase());

    if (!ticket) {
      return { success: false, message: 'Invalid ticket token. Not found in system.' };
    }

    if (ticket.isScanned) {
      return {
        success: false,
        message: `ALREADY SCANNED at ${ticket.scannedAt}. Duplicate check-in denied!`,
        ticket
      };
    }

    const updated = {
      ...ticket,
      isScanned: true,
      scannedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setTickets(prev => prev.map(t => t.id === ticket.id ? updated : t));
    logAuditAction(`Scanned Box-Office Ticket`, 'ticket', ticket.id, `Admitted ${ticket.buyerName} (${ticket.ticketNumber}) for ${ticket.eventTitle}`);

    return {
      success: true,
      message: `Verified! Welcome ${ticket.buyerName} (${ticket.ticketTypeName})`,
      ticket: updated
    };
  };

  const issueTicket = (ticketTypeId: string, buyerName: string, buyerEmail: string, buyerPhone?: string) => {
    const type = ticketTypes.find(t => t.id === ticketTypeId);
    const event = events.find(e => e.id === type?.eventId) || events[0];

    const newTicket: Ticket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
      ticketTypeName: type ? type.name : 'General Admission',
      eventId: event.id,
      eventTitle: event.title,
      buyerName,
      buyerEmail,
      buyerPhone,
      pricePaid: type ? type.price : 0,
      qrToken: `QR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      isScanned: false
    };

    // Increment sold count on ticket type
    if (type) {
      setTicketTypes(prev =>
        prev.map(tt => tt.id === ticketTypeId ? { ...tt, soldCount: tt.soldCount + 1 } : tt)
      );
    }

    setTickets(prev => [newTicket, ...prev]);
    logAuditAction(`Issued Box-Office Ticket`, 'ticket', newTicket.id, `Issued ticket ${newTicket.ticketNumber} to ${buyerName} for ₹${newTicket.pricePaid.toLocaleString('en-IN')}`);
    return newTicket;
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUser(DEMO_USERS[0]);
    setSelectedBranch('All Branches');
    setClients(INITIAL_CLIENTS);
    setLeads(INITIAL_LEADS);
    setVenues(INITIAL_VENUES);
    setVendors(INITIAL_VENDORS);
    setEvents(INITIAL_EVENTS);
    setQuotations(INITIAL_QUOTATIONS);
    setInvoices(INITIAL_INVOICES);
    setExpenses(INITIAL_EXPENSES);
    setInventory(INITIAL_INVENTORY);
    setEquipmentRequisitions(INITIAL_REQUISITIONS);
    setVendorWorkOrders(INITIAL_WORK_ORDERS);
    setGuests(INITIAL_GUESTS);
    setTicketTypes(INITIAL_TICKET_TYPES);
    setTickets(INITIAL_TICKETS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCampaigns(INITIAL_CAMPAIGNS);
  };

  return (
    <ERPContext.Provider
      value={{
        currentUser,
        switchUser,
        users: DEMO_USERS,
        selectedBranch,
        setSelectedBranch,
        clients,
        addClient,
        updateCustomer,
        addCustomerContact,
        updateCustomerContact,
        deleteCustomerContact,
        addCustomerAddress,
        updateCustomerAddress,
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
        bulkAddCustomerTags,
        leads,
        addLead,
        updateLead,
        updateLeadStage,
        convertLead,
        convertLeadToQuotation,
        addLeadActivity,
        scheduleLeadFollowUp,
        completeLeadFollowUp,
        assignLead,
        markLeadLost,
        reopenLead,
        updateLeadScore,
        saveLeadFunctions,
        saveLeadNegotiation,
        executeOperationsHandover,
        campaigns,
        addCampaign,
        venues,
        vendors,
        addVenue,
        addVendor,
        events,
        addEvent,
        updateEventStatus,
        addEventSchedule,
        toggleEventSchedule,
        addEventTask,
        toggleEventTask,
        quotations,
        addQuotation,
        updateQuotationStatus,
        generateMilestoneInvoices,
        invoices,
        addInvoice,
        recordPayment,
        submitClientRemittance,
        verifyClientRemittance,
        expenses,
        addExpense,
        updateExpenseStatus,
        inventory,
        addInventoryItem,
        equipmentRequisitions,
        addEquipmentRequisition,
        updateRequisitionStatus,
        vendorWorkOrders,
        addVendorWorkOrder,
        updateWorkOrderStatus,
        submitVendorBill,
        guests,
        addGuest,
        toggleGuestCheckIn,
        ticketTypes,
        tickets,
        verifyTicket,
        issueTicket,
        auditLogs,
        logAuditAction,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        resetDemoData
      }}
    >
      {children}
    </ERPContext.Provider>
  );
}

export function useERP() {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
}
