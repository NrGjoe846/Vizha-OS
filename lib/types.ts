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

// ==========================================
// CUSTOMER DIRECTORY MASTER ENTITIES
// ==========================================

export type CustomerType =
  | 'Individual'
  | 'Family'
  | 'Corporate'
  | 'Institution'
  | 'Government'
  | 'Agency'
  | 'Association'
  | 'Other';

export type CustomerCategory =
  | 'VIP'
  | 'Premium'
  | 'Regular'
  | 'New'
  | 'Returning'
  | 'Corporate'
  | 'Institutional'
  | 'Referral Partner'
  | 'Inactive'
  | 'Blacklisted';

export type CustomerStatus =
  | 'active'
  | 'inactive'
  | 'blocked'
  | 'archived'
  | 'pending_verification';

export type CustomerContactRole =
  | 'Owner / Director'
  | 'Event Coordinator'
  | 'HR Manager'
  | 'Procurement Manager'
  | 'Finance Manager'
  | 'Accounts Payable'
  | 'Personal Assistant'
  | 'Family Representative'
  | 'Authorized Signatory'
  | 'Other';

export interface CustomerContact {
  id: string;
  name: string;
  designation?: string;
  role: CustomerContactRole;
  phone: string;
  alternatePhone?: string;
  whatsapp?: string;
  email: string;
  preferredChannel?: 'phone' | 'whatsapp' | 'email' | 'meeting';
  isPrimary: boolean;
  isDecisionMaker: boolean;
  isBillingContact: boolean;
  portalAccess: boolean;
  permissions?: {
    canViewQuotations?: boolean;
    canApproveProposals?: boolean;
    canViewInvoices?: boolean;
    canMakePayments?: boolean;
    canViewEventDetails?: boolean;
    canUploadDocuments?: boolean;
    canManageContacts?: boolean;
  };
  notes?: string;
}

export type CustomerAddressType =
  | 'Registered office'
  | 'Billing address'
  | 'Communication address'
  | 'Residential address'
  | 'Event location'
  | 'Branch address'
  | 'Other';

export interface CustomerAddress {
  id: string;
  addressName: string;
  type: CustomerAddressType;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  district?: string;
  state: string;
  country: string;
  pinCode: string;
  googleMapsUrl?: string;
  isPrimaryBilling: boolean;
  isPrimaryCommunication: boolean;
  isPrimaryEvent?: boolean;
}

export interface CustomerDocument {
  id: string;
  name: string;
  category:
    | 'Contract / Agreement'
    | 'PAN Document'
    | 'GST Certificate'
    | 'Company Registration'
    | 'Purchase Order'
    | 'Event Brief'
    | 'Payment Receipt'
    | 'Approval Letter'
    | 'Other';
  fileUrl: string;
  fileSize: string;
  uploadedAt: string;
  uploadedBy: string;
  expiryDate?: string;
  accessLevel: 'public' | 'internal' | 'restricted';
}

export interface CustomerCommunication {
  id: string;
  channel: 'call' | 'whatsapp' | 'email' | 'meeting' | 'sms' | 'portal_message';
  title: string;
  summary: string;
  sender: string;
  recipient: string;
  timestamp: string;
  outcome?: string;
  deliveryStatus: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface CustomerNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  visibility: 'all' | 'sales' | 'operations' | 'finance' | 'admin';
  isPinned: boolean;
  priority: 'normal' | 'high' | 'urgent';
}

export interface CustomerFeedbackRecord {
  id: string;
  eventId?: string;
  eventName?: string;
  rating: number; // 1 to 5
  csatScore: number; // e.g. 95%
  serviceRating: number;
  venueRating: number;
  cateringRating: number;
  decorRating: number;
  comments: string;
  recommendationScore: number; // 1-10 NPS
  feedbackDate: string;
  source: string;
}

export interface CustomerComplaint {
  id: string;
  ticketNo: string;
  title: string;
  description: string;
  category: 'Service Quality' | 'Billing / Invoice' | 'Vendor Delays' | 'Event Operations' | 'Staff Behaviour' | 'Other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'assigned' | 'in_progress' | 'awaiting_customer' | 'resolved' | 'closed' | 'reopened';
  assignedTo: string;
  eventId?: string;
  eventName?: string;
  createdAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface CustomerRelationship {
  id: string;
  relatedCustomerId: string;
  relatedCustomerName: string;
  relationshipType: 'Parent Company' | 'Subsidiary' | 'Family Member' | 'Referral' | 'Sister Concern' | 'Agency Representation';
  notes?: string;
}

export interface CustomerAuditEntry {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
}

export interface Client {
  id: string;
  customerCode?: string; // e.g. CUS-2026-00001
  name: string;
  displayName?: string;
  customerType?: CustomerType;
  category?: CustomerCategory;
  status?: CustomerStatus;
  companyName?: string;
  primaryContact?: string;
  email: string;
  alternateEmail?: string;
  phone: string;
  alternatePhone?: string;
  website?: string;
  gstin?: string;
  pan?: string;
  industry?: string;
  dateOfBirth?: string;
  anniversary?: string;
  source?: string;
  accountManager?: string;
  branchName?: string;
  tags?: string[];
  internalNotes?: string;
  city: string;
  state?: string;
  totalBookings: number;
  totalSpent: number;
  totalInvoiced?: number;
  totalOutstanding?: number;
  advanceBalance?: number;
  lastEventDate?: string;
  loyaltyPoints?: number;
  referralCount?: number;
  referredBy?: string;
  registeredAt?: string;
  mergedWithId?: string;
  contacts?: CustomerContact[];
  addresses?: CustomerAddress[];
  documents?: CustomerDocument[];
  communications?: CustomerCommunication[];
  notes?: CustomerNote[];
  feedback?: CustomerFeedbackRecord[];
  complaints?: CustomerComplaint[];
  relationships?: CustomerRelationship[];
  auditLogs?: CustomerAuditEntry[];
}

export type Customer = Client;

export type LeadStage =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'meeting_scheduled'
  | 'requirement_finalized'
  | 'proposal_sent'
  | 'negotiating'
  | 'awaiting_confirmation'
  | 'converted'
  | 'lost';

export interface CRMActivity {
  id: string;
  leadId: string;
  type: 'call' | 'whatsapp' | 'email' | 'meeting' | 'site_visit' | 'note' | 'task';
  title: string;
  description: string;
  performedBy: string;
  timestamp: string;
  outcome?: 'interested' | 'not_reachable' | 'call_back_later' | 'meeting_scheduled' | 'requirement_pending' | 'proposal_requested' | 'price_negotiation' | 'not_interested' | 'booking_confirmed';
  nextAction?: string;
  durationMinutes?: number;
}

export interface CRMFollowUp {
  id: string;
  leadId: string;
  leadTitle: string;
  clientName: string;
  scheduledDate: string;
  scheduledTime: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  activityType: 'call' | 'whatsapp' | 'meeting' | 'site_visit' | 'email';
  notes: string;
  isCompleted: boolean;
  completedAt?: string;
  outcome?: string;
}

export interface CRMEventFunction {
  id: string;
  functionName: string;
  date: string;
  startTime?: string;
  endTime?: string;
  venueName?: string;
  guestCount: number;
  theme?: string;
  servicesNeeded: string[];
  notes?: string;
}

export interface CRMLeadScore {
  budgetScore: number; // max 20
  dateScore: number; // max 15
  engagementScore: number; // max 15
  intentScore: number; // max 20
  requirementScore: number; // max 10
  decisionMakerScore: number; // max 10
  feasibilityScore: number; // max 10
  totalScore: number; // sum, max 100
  category: 'Hot Lead' | 'Warm Lead' | 'Cold Lead';
}

export interface CRMLossRecord {
  lossReason:
    | 'Budget mismatch'
    | 'Competitor selected'
    | 'Date unavailable'
    | 'Venue unavailable'
    | 'Customer cancelled'
    | 'No response'
    | 'Service not available'
    | 'Price too high'
    | 'Duplicate enquiry'
    | 'Invalid enquiry'
    | 'Other';
  competitorName?: string;
  lossNotes?: string;
  lostDate: string;
  eligibleForNurture: boolean;
}

export interface CRMNegotiation {
  initialBudget: number;
  proposedPrice: number;
  negotiatedPrice: number;
  expectedCost: number;
  expectedGrossMargin: number;
  discountRequested: number;
  discountApproved: boolean;
  approvalNotes?: string;
}

export interface CRMCampaign {
  id: string;
  name: string;
  code: string;
  source: string;
  budget: number;
  leadsGenerated: number;
  wonBookings: number;
  revenueGenerated: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'paused';
}

export interface Lead {
  id: string;
  leadNumber?: string;
  title: string;
  clientName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  eventType: string;
  estimatedBudget: number;
  guestCount: number;
  eventDate: string;
  eventEndDate?: string;
  eventLocation?: string;
  venueId?: string;
  venueName?: string;
  source: string;
  campaign?: string;
  stage: LeadStage;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  branchName?: string;
  notes?: string;
  quotationId?: string;
  createdAt: string;
  stageUpdatedAt?: string;
  daysInCurrentStage?: number;

  // CRM Pipeline Enterprise Extensions
  score?: CRMLeadScore;
  functions?: CRMEventFunction[];
  activities?: CRMActivity[];
  followUps?: CRMFollowUp[];
  lossRecord?: CRMLossRecord;
  negotiation?: CRMNegotiation;
  transferHistory?: { fromUser: string; toUser: string; date: string; reason: string }[];
  tags?: string[];
  isDuplicateOf?: string;
  handoverCompleted?: boolean;
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
