export type UserRole =
  | 'super_admin'
  | 'event_manager'
  | 'sales_executive'
  | 'accountant'
  | 'operations'
  | 'client'
  | 'vendor';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatar: string;
  branchName?: string;
  departmentName?: string;
}

export interface Client {
  id: string;
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  gstin?: string;
  city: string;
  totalBookings: number;
  totalSpent: number;
}

export type LeadStage =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal_sent'
  | 'negotiating'
  | 'converted'
  | 'lost';

export interface Lead {
  id: string;
  title: string;
  clientName: string;
  email: string;
  phone: string;
  companyName?: string;
  eventType: string;
  estimatedBudget: number;
  guestCount: number;
  eventDate: string;
  source: string;
  stage: LeadStage;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  notes?: string;
  quotationId?: string;
  createdAt: string;
}

export interface Venue {
  id: string;
  name: string;
  type: string;
  city: string;
  address: string;
  capacity: number;
  rentalRate: number;
  contactName: string;
  contactPhone: string;
  rating: number;
  imageUrl: string;
  amenities: string[];
  isAvailable: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  companyName: string;
  category: string;
  phone: string;
  email: string;
  city: string;
  rating: number;
  gstin?: string;
  status: 'active' | 'busy' | 'preferred';
}

export interface EventScheduleItem {
  id: string;
  dayNumber: number;
  timeSlot: string;
  title: string;
  description: string;
  leadPerson: string;
  cueNotes?: string;
  isCompleted: boolean;
}

export interface EventTaskItem {
  id: string;
  title: string;
  category: 'Production' | 'Logistics' | 'Decor' | 'Catering' | 'Tech/AV' | 'Licensing';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  dueDate: string;
  isCompleted: boolean;
}

export interface EventEquipmentRequisition {
  id: string;
  eventId: string;
  eventTitle: string;
  itemId: string;
  itemName: string;
  itemSku: string;
  quantity: number;
  rentalPrice: number;
  days: number;
  totalCost: number;
  status: 'reserved' | 'dispatched' | 'returned';
  requisitionDate: string;
}

export interface VendorWorkOrder {
  id: string;
  workOrderNo: string;
  eventId: string;
  eventTitle: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  scopeOfWork: string;
  contractAmount: number;
  advancePaid: number;
  status: 'draft' | 'issued' | 'accepted' | 'declined' | 'completed' | 'invoiced';
  cueAssignments?: string;
  issuedDate: string;
  dueDate: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: 'lead' | 'event' | 'quotation' | 'invoice' | 'expense' | 'inventory' | 'ticket' | 'guest' | 'vendor_wo';
  entityId: string;
  details: string;
}

export type EventStatus =
  | 'draft'
  | 'planning'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface EventModel {
  id: string;
  code: string;
  title: string;
  eventType: string;
  clientName: string;
  clientId: string;
  venueName: string;
  venueId?: string;
  managerName: string;
  managerId?: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  status: EventStatus;
  budget: number;
  actualSpend: number;
  coverImage: string;
  branchName?: string;
  schedules: EventScheduleItem[];
  tasks: EventTaskItem[];
  equipmentRequisitions?: EventEquipmentRequisition[];
  vendorWorkOrders?: VendorWorkOrder[];
}

export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Quotation {
  id: string;
  quotationNo: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  eventId?: string;
  eventTitle: string;
  leadId?: string;
  issueDate: string;
  validUntil: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  milestonesGenerated?: boolean;
  items: QuotationItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  referenceNo: string;
  isClientSubmitted?: boolean;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  quotationId?: string;
  milestoneTitle?: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientGstin?: string;
  eventId?: string;
  eventTitle: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  status: 'unpaid' | 'partial' | 'paid' | 'overdue';
  pendingRemittance?: {
    amount: number;
    paymentMethod: string;
    referenceNo: string;
    submittedAt: string;
  };
  items: InvoiceItem[];
  payments: PaymentRecord[];
}

export interface EventExpense {
  id: string;
  eventId: string;
  eventTitle: string;
  category: string;
  description: string;
  amount: number;
  vendorName: string;
  vendorWorkOrderId?: string;
  status: 'pending' | 'approved' | 'rejected';
  expenseDate: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  totalQty: number;
  allocatedQty: number;
  rentalPrice: number;
  condition: 'Good' | 'Maintenance' | 'Damaged';
  location: string;
}

export interface EventGuest {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
  group: 'VIP' | 'Family' | 'Corporate' | 'Media' | 'General';
  tableNo: string;
  passCode: string;
  plusOnes: number;
  dietaryPref: string;
  isCheckedIn: boolean;
  checkInTime?: string;
}

export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  price: number;
  totalSupply: number;
  soldCount: number;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  ticketTypeName: string;
  eventId?: string;
  eventTitle: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  pricePaid: number;
  qrToken: string;
  isScanned: boolean;
  scannedAt?: string;
}
