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
  EventStatus
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
  INITIAL_TICKETS
} from './mock-data';

interface ERPContextType {
  currentUser: UserProfile;
  switchUser: (role: string) => void;
  users: UserProfile[];

  // Clients
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'totalBookings' | 'totalSpent'>) => void;

  // Leads
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLeadStage: (id: string, stage: LeadStage) => void;
  convertLead: (leadId: string) => { client: Client; event: EventModel };

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

  // Invoices & Payments
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNo' | 'payments' | 'paidAmount' | 'balanceDue' | 'status'>) => void;
  recordPayment: (invoiceId: string, payment: { amount: number; paymentMethod: string; referenceNo: string }) => void;

  // Expenses
  expenses: EventExpense[];
  addExpense: (expense: Omit<EventExpense, 'id'>) => void;
  updateExpenseStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => void;

  // Inventory
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;

  // Guests
  guests: EventGuest[];
  addGuest: (guest: Omit<EventGuest, 'id' | 'passCode' | 'isCheckedIn'>) => void;
  toggleGuestCheckIn: (id: string) => void;

  // Tickets
  ticketTypes: TicketType[];
  tickets: Ticket[];
  verifyTicket: (qrToken: string) => { success: boolean; message: string; ticket?: Ticket };
  issueTicket: (ticketTypeId: string, buyerName: string, buyerEmail: string, buyerPhone?: string) => Ticket;

  // Reset to default
  resetDemoData: () => void;
}

const ERPContext = createContext<ERPContextType | null>(null);

const STORAGE_KEY = 'eventflow_erp_v2_state';

export function ERPProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [venues, setVenues] = useState<Venue[]>(INITIAL_VENUES);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [events, setEvents] = useState<EventModel[]>(INITIAL_EVENTS);
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [expenses, setExpenses] = useState<EventExpense[]>(INITIAL_EXPENSES);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [guests, setGuests] = useState<EventGuest[]>(INITIAL_GUESTS);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>(INITIAL_TICKET_TYPES);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
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
        if (parsed.guests) setGuests(parsed.guests);
        if (parsed.ticketTypes) setTicketTypes(parsed.ticketTypes);
        if (parsed.tickets) setTickets(parsed.tickets);
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
        clients,
        leads,
        venues,
        vendors,
        events,
        quotations,
        invoices,
        expenses,
        inventory,
        guests,
        ticketTypes,
        tickets
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to persist ERP state', e);
    }
  }, [
    isLoaded,
    currentUser,
    clients,
    leads,
    venues,
    vendors,
    events,
    quotations,
    invoices,
    expenses,
    inventory,
    guests,
    ticketTypes,
    tickets
  ]);

  const switchUser = (roleOrId: string) => {
    const user = DEMO_USERS.find(u => u.role === roleOrId || u.id === roleOrId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const addClient = (clientData: Omit<Client, 'id' | 'totalBookings' | 'totalSpent'>) => {
    const newClient: Client = {
      ...clientData,
      id: `c-${Date.now()}`,
      totalBookings: 0,
      totalSpent: 0
    };
    setClients(prev => [newClient, ...prev]);
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLeadStage = (id: string, stage: LeadStage) => {
    setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, stage } : lead));
  };

  const convertLead = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    const newClient: Client = {
      id: `c-${Date.now()}`,
      name: lead.clientName,
      companyName: lead.companyName || undefined,
      email: lead.email,
      phone: lead.phone,
      city: 'Mumbai',
      totalBookings: 1,
      totalSpent: lead.estimatedBudget
    };

    const newEvent: EventModel = {
      id: `evt-${Date.now()}`,
      code: `EVT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: lead.title,
      eventType: lead.eventType,
      clientName: lead.clientName,
      clientId: newClient.id,
      venueName: 'The Grand Oberoi Ballroom, Mumbai',
      managerName: 'Priya Sharma',
      startDate: lead.eventDate || new Date().toISOString().split('T')[0],
      endDate: lead.eventDate || new Date().toISOString().split('T')[0],
      guestCount: lead.guestCount || 200,
      status: 'planning',
      budget: lead.estimatedBudget,
      actualSpend: 0,
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
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

    setClients(prev => [newClient, ...prev]);
    setEvents(prev => [newEvent, ...prev]);
    updateLeadStage(leadId, 'converted');

    return { client: newClient, event: newEvent };
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
  };

  const updateEventStatus = (id: string, status: EventStatus) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
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
  };

  const updateQuotationStatus = (id: string, status: 'draft' | 'sent' | 'approved' | 'rejected') => {
    setQuotations(prev => prev.map(q => q.id === id ? { ...q, status } : q));
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
  };

  const addExpense = (expenseData: Omit<EventExpense, 'id'>) => {
    const newExpense: EventExpense = {
      ...expenseData,
      id: `exp-${Date.now()}`
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const updateExpenseStatus = (id: string, status: 'pending' | 'approved' | 'rejected') => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-item-${Date.now()}`
    };
    setInventory(prev => [newItem, ...prev]);
  };

  const addGuest = (guestData: Omit<EventGuest, 'id' | 'passCode' | 'isCheckedIn'>) => {
    const newGuest: EventGuest = {
      ...guestData,
      id: `gst-${Date.now()}`,
      passCode: `PASS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      isCheckedIn: false
    };
    setGuests(prev => [newGuest, ...prev]);
  };

  const toggleGuestCheckIn = (id: string) => {
    setGuests(prev =>
      prev.map(g => {
        if (g.id !== id) return g;
        const willCheckIn = !g.isCheckedIn;
        return {
          ...g,
          isCheckedIn: willCheckIn,
          checkInTime: willCheckIn ? new Date().toLocaleString() : undefined
        };
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

    // Mark as scanned
    const updated = {
      ...ticket,
      isScanned: true,
      scannedAt: new Date().toLocaleString()
    };

    setTickets(prev => prev.map(t => t.id === ticket.id ? updated : t));

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
      eventTitle: event.title,
      buyerName,
      buyerEmail,
      buyerPhone,
      pricePaid: type ? type.price : 0,
      qrToken: `QR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      isScanned: false
    };

    setTickets(prev => [newTicket, ...prev]);
    return newTicket;
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUser(DEMO_USERS[0]);
    setClients(INITIAL_CLIENTS);
    setLeads(INITIAL_LEADS);
    setVenues(INITIAL_VENUES);
    setVendors(INITIAL_VENDORS);
    setEvents(INITIAL_EVENTS);
    setQuotations(INITIAL_QUOTATIONS);
    setInvoices(INITIAL_INVOICES);
    setExpenses(INITIAL_EXPENSES);
    setInventory(INITIAL_INVENTORY);
    setGuests(INITIAL_GUESTS);
    setTicketTypes(INITIAL_TICKET_TYPES);
    setTickets(INITIAL_TICKETS);
  };

  return (
    <ERPContext.Provider
      value={{
        currentUser,
        switchUser,
        users: DEMO_USERS,
        clients,
        addClient,
        leads,
        addLead,
        updateLeadStage,
        convertLead,
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
        invoices,
        addInvoice,
        recordPayment,
        expenses,
        addExpense,
        updateExpenseStatus,
        inventory,
        addInventoryItem,
        guests,
        addGuest,
        toggleGuestCheckIn,
        ticketTypes,
        tickets,
        verifyTicket,
        issueTicket,
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
