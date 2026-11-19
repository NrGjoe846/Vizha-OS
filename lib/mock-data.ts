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
  EventEquipmentRequisition,
  VendorWorkOrder,
  AuditLog,
  CRMCampaign,
  CRMActivity,
  CRMFollowUp,
  CRMEventFunction,
  CRMLeadScore,
  CRMLossRecord,
  CRMNegotiation
} from './types';

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user-admin',
    name: 'Vikramaditya Singhania',
    email: 'admin@eventflow.test',
    role: 'super_admin',
    roleTitle: 'Super Administrator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    branchName: 'Mumbai HQ',
    departmentName: 'Executive Leadership'
  },
  {
    id: 'user-manager',
    name: 'Priya Sharma',
    email: 'manager@eventflow.test',
    role: 'event_manager',
    roleTitle: 'Senior Event Producer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    branchName: 'Delhi NCR',
    departmentName: 'Event Operations'
  },
  {
    id: 'user-sales',
    name: 'Rajesh Verma',
    email: 'sales@eventflow.test',
    role: 'sales_executive',
    roleTitle: 'Head of Client Acquisition',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    branchName: 'Mumbai HQ',
    departmentName: 'Sales & Growth'
  },
  {
    id: 'user-finance',
    name: 'Anita Desai',
    email: 'finance@eventflow.test',
    role: 'accountant',
    roleTitle: 'Chief Financial Controller',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    branchName: 'Mumbai HQ',
    departmentName: 'Finance & Compliance'
  },
  {
    id: 'user-ops',
    name: 'Vikram Rathore',
    email: 'ops@eventflow.test',
    role: 'operations',
    roleTitle: 'Site Operations Lead',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    branchName: 'Bangalore Tech Hub',
    departmentName: 'Production & AV'
  },
  {
    id: 'user-client',
    name: 'Rahul Oberoi',
    email: 'client@eventflow.test',
    role: 'client',
    roleTitle: 'Client Representative',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    branchName: 'Client Portal',
    departmentName: 'Oberoi Global Enterprises'
  },
  {
    id: 'user-vendor',
    name: 'Farhan Qureshi',
    email: 'vendor@eventflow.test',
    role: 'vendor',
    roleTitle: 'Audio/Visual Director',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    branchName: 'SoundCraft Pro AV',
    departmentName: 'Partner Vendor'
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'c-1',
    name: 'Rahul Oberoi',
    companyName: 'Oberoi Global Holdings',
    email: 'rahul@oberoiglobal.com',
    phone: '+91 98201 11223',
    gstin: '27AABCO1234F1Z8',
    city: 'Mumbai',
    totalBookings: 2,
    totalSpent: 4500000
  },
  {
    id: 'c-2',
    name: 'Ananya Singhal',
    companyName: 'Singhal Tech Ventures',
    email: 'ananya@singhaltech.io',
    phone: '+91 98100 44556',
    gstin: '07AAACS9876Q1Z2',
    city: 'Delhi NCR',
    totalBookings: 3,
    totalSpent: 2850000
  },
  {
    id: 'c-3',
    name: 'Devraj Kapoor',
    companyName: 'Kapoor Jewels & Heritage',
    email: 'devraj@kapoorjewels.in',
    phone: '+91 99888 77665',
    gstin: '24AAECK5544R1Z0',
    city: 'Jaipur',
    totalBookings: 1,
    totalSpent: 7500000
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    leadNumber: 'LEAD-2026-001',
    title: 'Luxury Destination Wedding (3 Days)',
    clientName: 'Devraj & Sunita Kapoor',
    email: 'kapoor.wedding@gmail.com',
    phone: '+91 99888 77665',
    alternatePhone: '+91 99888 77666',
    companyName: 'Kapoor Jewels & Heritage',
    city: 'Jaipur',
    state: 'Rajasthan',
    eventType: 'Destination Wedding',
    estimatedBudget: 8500000,
    guestCount: 450,
    eventDate: '2026-12-18',
    eventEndDate: '2026-12-20',
    eventLocation: 'Umaid Bhawan Palace Grounds, Jodhpur',
    source: 'Referral',
    campaign: 'Luxury HNI Referrals',
    stage: 'negotiating',
    priority: 'urgent',
    assignedTo: 'Rajesh Verma',
    branchName: 'Mumbai HQ',
    notes: 'Bride prefers royal Rajputana palace aesthetics. Seeking comprehensive catering + drone cinematography.',
    createdAt: '2026-11-10',
    stageUpdatedAt: '2026-11-18',
    daysInCurrentStage: 2,
    score: {
      budgetScore: 20,
      dateScore: 15,
      engagementScore: 15,
      intentScore: 20,
      requirementScore: 10,
      decisionMakerScore: 10,
      feasibilityScore: 5,
      totalScore: 95,
      category: 'Hot Lead'
    },
    functions: [
      {
        id: 'fn-101-1',
        functionName: 'Sangeet & Cocktail Soiree',
        date: '2026-12-18',
        startTime: '19:00',
        endTime: '01:00',
        venueName: 'Palace Fountain Courtyard',
        guestCount: 350,
        theme: 'Gilded Starlight & Velvet',
        servicesNeeded: ['Dolby Sound & AV', 'Moving Heads Lighting', 'Artisanal Bar', 'Live Bollywood Band']
      },
      {
        id: 'fn-101-2',
        functionName: 'Traditional Varmala & Mandap Ceremony',
        date: '2026-12-19',
        startTime: '17:30',
        endTime: '22:00',
        venueName: 'Royal Banquet Lawns',
        guestCount: 450,
        theme: 'Mogra & Marigold Royal Heritage',
        servicesNeeded: ['Grand Floral Mandap', 'Shehnai Troupe', 'Drone Video', 'VIP Hospitality']
      },
      {
        id: 'fn-101-3',
        functionName: 'Grand Imperial Reception',
        date: '2026-12-20',
        startTime: '20:00',
        endTime: '00:30',
        venueName: 'The Grand Ballroom',
        guestCount: 500,
        theme: 'Black Tie Crystal Chandelier',
        servicesNeeded: ['Symphony Orchestra', '7-Course Curated Dinner', 'Pyro & FX']
      }
    ],
    negotiation: {
      initialBudget: 8000000,
      proposedPrice: 8500000,
      negotiatedPrice: 8250000,
      expectedCost: 6100000,
      expectedGrossMargin: 26,
      discountRequested: 250000,
      discountApproved: true,
      approvalNotes: 'Approved by Vikramaditya Singhania for HNI referral client retention.'
    },
    activities: [
      {
        id: 'act-101-1',
        leadId: 'lead-101',
        type: 'meeting',
        title: 'Commercial Negotiation with Devraj Kapoor',
        description: 'Met at Taj Mahal Palace Mumbai. Discussed budget reduction from ₹85L to ₹82.5L in exchange for exclusive 3-year family event retainer.',
        performedBy: 'Rajesh Verma',
        timestamp: '2026-11-18 16:30',
        outcome: 'price_negotiation',
        nextAction: 'Send revised contract with approved 2.5L waiver',
        durationMinutes: 75
      },
      {
        id: 'act-101-2',
        leadId: 'lead-101',
        type: 'site_visit',
        title: 'Jodhpur Venue Inspection & Floorplan Mapping',
        description: 'Completed site visit at Umaid Bhawan with family decorator. Approved staging locations.',
        performedBy: 'Priya Sharma',
        timestamp: '2026-11-14 11:00',
        outcome: 'requirement_pending',
        durationMinutes: 180
      },
      {
        id: 'act-101-3',
        leadId: 'lead-101',
        type: 'call',
        title: 'Inbound Inquiry Consultation',
        description: 'Initial 30-min discovery call reviewing dates and guest expectations.',
        performedBy: 'Rajesh Verma',
        timestamp: '2026-11-10 14:15',
        outcome: 'interested',
        durationMinutes: 30
      }
    ],
    followUps: [
      {
        id: 'fu-101-1',
        leadId: 'lead-101',
        leadTitle: 'Luxury Destination Wedding (3 Days)',
        clientName: 'Devraj & Sunita Kapoor',
        scheduledDate: '2026-11-20',
        scheduledTime: '11:00 AM',
        assignedTo: 'Rajesh Verma',
        priority: 'urgent',
        activityType: 'meeting',
        notes: 'Finalize contract signing and collect 20% advance token (₹16.5L).',
        isCompleted: false
      }
    ],
    tags: ['HNI', 'Destination', 'Multi-day', 'Palace']
  },
  {
    id: 'lead-102',
    leadNumber: 'LEAD-2026-002',
    title: 'Global Tech Visionaries Summit 2027',
    clientName: 'Ananya Singhal',
    email: 'summit@singhaltech.io',
    phone: '+91 98100 44556',
    companyName: 'Singhal Tech Ventures',
    city: 'Delhi NCR',
    state: 'Delhi',
    eventType: 'Corporate Summit',
    estimatedBudget: 4200000,
    guestCount: 800,
    eventDate: '2027-02-14',
    source: 'Website',
    campaign: 'Corporate CXO Summits Q4',
    stage: 'proposal_sent',
    priority: 'high',
    assignedTo: 'Rajesh Verma',
    branchName: 'Delhi NCR',
    notes: 'Keynote auditorium with 4K LED curved video walls and simultaneous live stream translation.',
    createdAt: '2026-11-12',
    stageUpdatedAt: '2026-11-17',
    daysInCurrentStage: 3,
    quotationId: 'q-1',
    score: {
      budgetScore: 18,
      dateScore: 15,
      engagementScore: 15,
      intentScore: 18,
      requirementScore: 10,
      decisionMakerScore: 8,
      feasibilityScore: 4,
      totalScore: 88,
      category: 'Hot Lead'
    },
    functions: [
      {
        id: 'fn-102-1',
        functionName: 'Plenary Keynote & Product Reveals',
        date: '2027-02-14',
        startTime: '09:00',
        endTime: '18:00',
        venueName: 'Pragati Maidan Hall 5',
        guestCount: 800,
        servicesNeeded: ['Absen 4K LED Wall', 'Simultaneous Translation', 'Delegate Badge Scanners', 'Executive Catering']
      }
    ],
    followUps: [
      {
        id: 'fu-102-1',
        leadId: 'lead-102',
        leadTitle: 'Global Tech Visionaries Summit 2027',
        clientName: 'Ananya Singhal',
        scheduledDate: '2026-11-21',
        scheduledTime: '03:00 PM',
        assignedTo: 'Rajesh Verma',
        priority: 'high',
        activityType: 'call',
        notes: 'Follow up on proposal Q-2026-001 submitted to procurement team.',
        isCompleted: false
      }
    ],
    activities: [
      {
        id: 'act-102-1',
        leadId: 'lead-102',
        type: 'email',
        title: 'Dispatched Commercial Proposal Q-2026-001',
        description: 'Emailed official itemized estimate of ₹42,00,000 + 18% GST with AV gear specs.',
        performedBy: 'Rajesh Verma',
        timestamp: '2026-11-17 10:30',
        outcome: 'proposal_requested'
      }
    ],
    tags: ['Tech', 'B2B Corporate', 'High Margin']
  },
  {
    id: 'lead-103',
    leadNumber: 'LEAD-2026-003',
    title: 'Elysium Music & Arts Fest 2027',
    clientName: 'Arjun Nambiar',
    email: 'arjun@elysiummusic.in',
    phone: '+91 97400 33221',
    companyName: 'Elysium Entertainment',
    city: 'Bangalore',
    state: 'Karnataka',
    eventType: 'Music Festival',
    estimatedBudget: 6000000,
    guestCount: 2500,
    eventDate: '2027-01-20',
    source: 'Social Media',
    campaign: 'Instagram Influencer Showcase',
    stage: 'requirement_finalized',
    priority: 'high',
    assignedTo: 'Vikram Rathore',
    branchName: 'Bangalore Hub',
    notes: '2-day multi-stage setup with pyro, laser mapping, and barcode gate scanners.',
    createdAt: '2026-11-15',
    stageUpdatedAt: '2026-11-18',
    daysInCurrentStage: 1,
    score: {
      budgetScore: 16,
      dateScore: 12,
      engagementScore: 14,
      intentScore: 16,
      requirementScore: 10,
      decisionMakerScore: 6,
      feasibilityScore: 4,
      totalScore: 78,
      category: 'Warm Lead'
    },
    followUps: [
      {
        id: 'fu-103-1',
        leadId: 'lead-103',
        leadTitle: 'Elysium Music & Arts Fest 2027',
        clientName: 'Arjun Nambiar',
        scheduledDate: '2026-11-22',
        scheduledTime: '02:00 PM',
        assignedTo: 'Vikram Rathore',
        priority: 'medium',
        activityType: 'meeting',
        notes: 'Review detailed staging rigging calculations and sound license requirements.',
        isCompleted: false
      }
    ],
    tags: ['Festival', 'AV Heavy', 'Box Office']
  },
  {
    id: 'lead-104',
    leadNumber: 'LEAD-2026-004',
    title: 'Apex Motors Electric SUV Launch',
    clientName: 'Sanjay Malhotra',
    email: 'sanjay@apexmotors.com',
    phone: '+91 98210 99887',
    companyName: 'Apex Automotive Ltd',
    city: 'Mumbai',
    state: 'Maharashtra',
    eventType: 'Product Launch',
    estimatedBudget: 3500000,
    guestCount: 300,
    eventDate: '2026-12-28',
    source: 'Website',
    campaign: 'Corporate CXO Summits Q4',
    stage: 'new',
    priority: 'medium',
    assignedTo: 'Rajesh Verma',
    branchName: 'Mumbai HQ',
    notes: 'Dramatic vehicle reveal with hydraulic turntable and holographic projections.',
    createdAt: '2026-11-17',
    stageUpdatedAt: '2026-11-17',
    daysInCurrentStage: 2,
    score: {
      budgetScore: 14,
      dateScore: 10,
      engagementScore: 8,
      intentScore: 14,
      requirementScore: 8,
      decisionMakerScore: 5,
      feasibilityScore: 3,
      totalScore: 62,
      category: 'Warm Lead'
    },
    followUps: [
      {
        id: 'fu-104-1',
        leadId: 'lead-104',
        leadTitle: 'Apex Motors Electric SUV Launch',
        clientName: 'Sanjay Malhotra',
        scheduledDate: '2026-11-19',
        scheduledTime: '05:30 PM',
        assignedTo: 'Rajesh Verma',
        priority: 'urgent',
        activityType: 'call',
        notes: 'First call to qualify brand launch requirements before SLA breach (48h).',
        isCompleted: false
      }
    ],
    tags: ['Automotive', 'Launch', 'Mumbai']
  },
  {
    id: 'lead-105',
    leadNumber: 'LEAD-2026-005',
    title: 'Reliance Foundation Healthcare Gala',
    clientName: 'Meenakshi Iyer',
    email: 'meenakshi@rfgh.org',
    phone: '+91 98450 11992',
    companyName: 'Healthcare Philanthropy',
    city: 'Mumbai',
    state: 'Maharashtra',
    eventType: 'Milestone Gala',
    estimatedBudget: 5000000,
    guestCount: 600,
    eventDate: '2027-03-05',
    source: 'Referral',
    campaign: 'Luxury HNI Referrals',
    stage: 'contacted',
    priority: 'medium',
    assignedTo: 'Rajesh Verma',
    branchName: 'Mumbai HQ',
    notes: 'Charity auction dinner, 5-course curated fine dining with classical symphony ensemble.',
    createdAt: '2026-11-16',
    stageUpdatedAt: '2026-11-17',
    daysInCurrentStage: 2,
    score: {
      budgetScore: 16,
      dateScore: 12,
      engagementScore: 12,
      intentScore: 14,
      requirementScore: 8,
      decisionMakerScore: 5,
      feasibilityScore: 3,
      totalScore: 70,
      category: 'Warm Lead'
    },
    tags: ['Charity', 'Gala', 'Catering']
  },
  {
    id: 'lead-106',
    leadNumber: 'LEAD-2026-006',
    title: 'Dr. Alok Verma Golden Jubilee Anniversary',
    clientName: 'Dr. Alok & Radhika Verma',
    email: 'dr.verma@apexheart.com',
    phone: '+91 98111 22334',
    city: 'Delhi NCR',
    state: 'Delhi',
    eventType: 'Anniversary Celebration',
    estimatedBudget: 2800000,
    guestCount: 250,
    eventDate: '2027-01-10',
    source: 'WhatsApp',
    stage: 'meeting_scheduled',
    priority: 'high',
    assignedTo: 'Priya Sharma',
    branchName: 'Delhi NCR',
    notes: 'Intimate silver-service banquet with retro live ghazal musicians and memory projection tunnel.',
    createdAt: '2026-11-14',
    stageUpdatedAt: '2026-11-18',
    daysInCurrentStage: 1,
    score: {
      budgetScore: 16,
      dateScore: 15,
      engagementScore: 14,
      intentScore: 18,
      requirementScore: 9,
      decisionMakerScore: 8,
      feasibilityScore: 4,
      totalScore: 84,
      category: 'Hot Lead'
    },
    followUps: [
      {
        id: 'fu-106-1',
        leadId: 'lead-106',
        leadTitle: 'Dr. Alok Verma Golden Jubilee Anniversary',
        clientName: 'Dr. Alok & Radhika Verma',
        scheduledDate: '2026-11-20',
        scheduledTime: '04:00 PM',
        assignedTo: 'Priya Sharma',
        priority: 'high',
        activityType: 'meeting',
        notes: 'In-person presentation of menu sampling & venue options at Delhi office.',
        isCompleted: false
      }
    ],
    tags: ['Anniversary', 'HNI', 'Delhi']
  },
  {
    id: 'lead-107',
    leadNumber: 'LEAD-2026-007',
    title: 'Zara India Fashion Week Opening Night',
    clientName: 'Tanya Chopra',
    email: 'tanya.chopra@inditex.com',
    phone: '+91 98205 66778',
    companyName: 'Inditex India Apparel',
    city: 'Mumbai',
    state: 'Maharashtra',
    eventType: 'Fashion Runway',
    estimatedBudget: 6500000,
    guestCount: 400,
    eventDate: '2026-12-22',
    source: 'Meta Ads',
    campaign: 'Wedding Season Blitz 2026',
    stage: 'awaiting_confirmation',
    priority: 'urgent',
    assignedTo: 'Rajesh Verma',
    branchName: 'Mumbai HQ',
    notes: '80ft runway ramp with synchronized strobe lighting, model green rooms, and VIP press risers.',
    createdAt: '2026-11-08',
    stageUpdatedAt: '2026-11-18',
    daysInCurrentStage: 1,
    score: {
      budgetScore: 20,
      dateScore: 15,
      engagementScore: 15,
      intentScore: 18,
      requirementScore: 10,
      decisionMakerScore: 9,
      feasibilityScore: 5,
      totalScore: 92,
      category: 'Hot Lead'
    },
    followUps: [
      {
        id: 'fu-107-1',
        leadId: 'lead-107',
        leadTitle: 'Zara India Fashion Week Opening Night',
        clientName: 'Tanya Chopra',
        scheduledDate: '2026-11-20',
        scheduledTime: '12:00 PM',
        assignedTo: 'Rajesh Verma',
        priority: 'urgent',
        activityType: 'call',
        notes: 'Call Tanya to confirm PO issuance and advance wire transfer receipt.',
        isCompleted: false
      }
    ],
    tags: ['Fashion', 'Runway', 'Press Coverage']
  },
  {
    id: 'lead-108',
    leadNumber: 'LEAD-2026-008',
    title: 'Titan Tech Annual Global Summit 2026',
    clientName: 'Vikram Singhania',
    email: 'admin@eventflow.test',
    phone: '+91 98201 11223',
    companyName: 'Titan Enterprise Holdings',
    city: 'Mumbai',
    state: 'Maharashtra',
    eventType: 'Corporate Summit',
    estimatedBudget: 2891000,
    guestCount: 500,
    eventDate: '2026-12-05',
    source: 'Referral',
    stage: 'converted',
    priority: 'high',
    assignedTo: 'Rajesh Verma',
    branchName: 'Mumbai HQ',
    notes: 'Converted to active production EVT-2026-001. Handover complete to Priya Sharma.',
    createdAt: '2026-11-01',
    stageUpdatedAt: '2026-11-15',
    daysInCurrentStage: 4,
    handoverCompleted: true,
    score: {
      budgetScore: 20,
      dateScore: 15,
      engagementScore: 15,
      intentScore: 20,
      requirementScore: 10,
      decisionMakerScore: 10,
      feasibilityScore: 8,
      totalScore: 98,
      category: 'Hot Lead'
    },
    tags: ['Won', 'Handover Done', 'Corporate']
  },
  {
    id: 'lead-109',
    leadNumber: 'LEAD-2026-009',
    title: 'FinTech Horizon 2026 Conclave',
    clientName: 'Kunal Shah',
    email: 'kunal@horizonfin.org',
    phone: '+91 98333 44551',
    companyName: 'Horizon Financial Alliance',
    city: 'Bangalore',
    state: 'Karnataka',
    eventType: 'Industry Conclave',
    estimatedBudget: 3200000,
    guestCount: 400,
    eventDate: '2026-12-10',
    source: 'Google Ads',
    campaign: 'Corporate CXO Summits Q4',
    stage: 'lost',
    priority: 'low',
    assignedTo: 'Vikram Rathore',
    branchName: 'Bangalore Hub',
    notes: 'Client selected competitor offering international speaker travel bundling.',
    createdAt: '2026-11-05',
    stageUpdatedAt: '2026-11-14',
    daysInCurrentStage: 5,
    score: {
      budgetScore: 10,
      dateScore: 8,
      engagementScore: 6,
      intentScore: 8,
      requirementScore: 5,
      decisionMakerScore: 3,
      feasibilityScore: 2,
      totalScore: 42,
      category: 'Cold Lead'
    },
    lossRecord: {
      lossReason: 'Competitor selected',
      competitorName: 'Wizcraft International',
      lossNotes: 'Competitor had existing corporate tie-up with keynote speaker agency.',
      lostDate: '2026-11-14',
      eligibleForNurture: true
    },
    tags: ['Lost', 'Nurture in 60d']
  },
  {
    id: 'lead-110',
    leadNumber: 'LEAD-2026-010',
    title: 'Miraya Malhotra 18th Birthday Extravaganza',
    clientName: 'Pooja Malhotra',
    email: 'pooja.m@malhotragroup.in',
    phone: '+91 98200 77112',
    city: 'Mumbai',
    state: 'Maharashtra',
    eventType: 'Birthday Extravaganza',
    estimatedBudget: 2200000,
    guestCount: 180,
    eventDate: '2027-01-25',
    source: 'Instagram',
    campaign: 'Instagram Influencer Showcase',
    stage: 'qualified',
    priority: 'medium',
    assignedTo: 'Rajesh Verma',
    branchName: 'Mumbai HQ',
    notes: 'Neon glow-in-the-dark themed teen celebration with celebrity DJ and mocktail mixology stations.',
    createdAt: '2026-11-16',
    stageUpdatedAt: '2026-11-18',
    daysInCurrentStage: 1,
    score: {
      budgetScore: 15,
      dateScore: 12,
      engagementScore: 14,
      intentScore: 15,
      requirementScore: 9,
      decisionMakerScore: 6,
      feasibilityScore: 4,
      totalScore: 75,
      category: 'Warm Lead'
    },
    tags: ['Social', 'Celebrity DJ', 'Youth']
  }
];

export const INITIAL_CAMPAIGNS: CRMCampaign[] = [
  {
    id: 'cmp-001',
    name: 'Wedding Season Blitz 2026',
    code: 'WED-2026-Q4',
    source: 'Meta Ads',
    budget: 300000,
    leadsGenerated: 45,
    wonBookings: 6,
    revenueGenerated: 34000000,
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    status: 'active'
  },
  {
    id: 'cmp-002',
    name: 'Corporate CXO Summits Q4',
    code: 'CORP-CXO-2026',
    source: 'Google Ads',
    budget: 150000,
    leadsGenerated: 28,
    wonBookings: 4,
    revenueGenerated: 16500000,
    startDate: '2026-10-15',
    endDate: '2026-12-31',
    status: 'active'
  },
  {
    id: 'cmp-003',
    name: 'Luxury HNI Referrals',
    code: 'HNI-REF-2026',
    source: 'Referral',
    budget: 50000,
    leadsGenerated: 12,
    wonBookings: 5,
    revenueGenerated: 41000000,
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    status: 'active'
  },
  {
    id: 'cmp-004',
    name: 'Instagram Influencer Showcase',
    code: 'IG-INF-2026',
    source: 'Instagram',
    budget: 120000,
    leadsGenerated: 35,
    wonBookings: 3,
    revenueGenerated: 9500000,
    startDate: '2026-10-20',
    endDate: '2026-12-15',
    status: 'active'
  }
];

export const INITIAL_VENUES: Venue[] = [
  {
    id: 'v-1',
    name: 'The Grand Oberoi Ballroom',
    type: 'Luxury Hotel Ballroom',
    city: 'Mumbai',
    address: 'Nariman Point, Marine Drive, Mumbai 400021',
    capacity: 900,
    rentalRate: 450000,
    contactName: 'Suresh Menon',
    contactPhone: '+91 98200 88771',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80',
    amenities: ['Central Air-Con', 'Valet Parking for 300 Cars', 'Green Rooms', 'Rigging Truss Points', 'High-Speed Fiber'],
    isAvailable: true
  },
  {
    id: 'v-2',
    name: 'Umaid Bhawan Palace Grounds',
    type: 'Royal Palace Grounds',
    city: 'Jodhpur',
    address: 'Circuit House Rd, Cantt Area, Jodhpur 342006',
    capacity: 1500,
    rentalRate: 950000,
    contactName: 'Digvijay Rathore',
    contactPhone: '+91 99280 44332',
    rating: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80',
    amenities: ['Heritage Architecture', 'Helipad Access', 'Royal Banquet Lawns', 'Fountain Courtyard', 'Full Power Backup'],
    isAvailable: true
  },
  {
    id: 'v-3',
    name: 'Aerocity Convention & Expo Center',
    type: 'Convention Center',
    city: 'Delhi NCR',
    address: 'Asset 10, Hospitality District, IGI Airport, New Delhi 110037',
    capacity: 2500,
    rentalRate: 650000,
    contactName: 'Neha Kapoor',
    contactPhone: '+91 98110 55443',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=80',
    amenities: ['Acoustic Soundproofing', 'Breakout Boardrooms', 'Freight Loading Docks', 'Hybrid AV Streaming Deck', 'Metro Connected'],
    isAvailable: true
  },
  {
    id: 'v-4',
    name: 'Bayview Sunlit Oceanfront Resort',
    type: 'Beachfront Outdoor Lawns',
    city: 'Goa',
    address: 'Vagator Beach Road, Anjuna, Goa 403509',
    capacity: 3500,
    rentalRate: 500000,
    contactName: 'Antonio D’Souza',
    contactPhone: '+91 98221 66778',
    rating: 4.85,
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
    amenities: ['Sunset Sea View', 'Multi-Stage Setup Area', 'Beach Access Gate', 'Fire Safety Certified', 'Ample Staging Greenery'],
    isAvailable: true
  }
];

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'ven-1',
    name: 'Farhan Qureshi',
    companyName: 'SoundCraft Pro Audio & Visuals',
    category: 'Sound & Engineering',
    phone: '+91 98205 66778',
    email: 'farhan@soundcraftpro.com',
    city: 'Mumbai',
    rating: 4.9,
    gstin: '27AAMCS8899N1Z5',
    status: 'preferred'
  },
  {
    id: 'ven-2',
    name: 'Kavita Chawla',
    companyName: 'Royal Blossom Floral Art',
    category: 'Floral & Decor',
    phone: '+91 98112 44332',
    email: 'kavita@royalblossom.in',
    city: 'Delhi',
    rating: 4.8,
    gstin: '07AAECR4433K1Z9',
    status: 'active'
  },
  {
    id: 'ven-3',
    name: 'Chef Sanjeev Nair',
    companyName: 'Gourmet Republic Banquet Caterers',
    category: 'Catering & Hospitality',
    phone: '+91 98450 77119',
    email: 'chef@gourmetrepublic.com',
    city: 'Bangalore',
    rating: 5.0,
    gstin: '29AAACG2211L1Z4',
    status: 'preferred'
  },
  {
    id: 'ven-4',
    name: 'Aditya Sen',
    companyName: 'CineStyle Cinematic Productions',
    category: 'Photography & 4K Cinema',
    phone: '+91 98300 99881',
    email: 'aditya@cinestyle.com',
    city: 'Mumbai',
    rating: 4.9,
    gstin: '27AABCS1122H1Z1',
    status: 'active'
  }
];

export const INITIAL_EVENTS: EventModel[] = [
  {
    id: 'evt-2026-001',
    code: 'EVT-2026-001',
    title: 'The Royal Oberoi Grand Wedding & Sangeet',
    eventType: 'Luxury Wedding',
    clientName: 'Rahul Oberoi',
    clientId: 'c-1',
    venueName: 'The Grand Oberoi Ballroom, Mumbai',
    venueId: 'v-1',
    managerName: 'Priya Sharma',
    managerId: 'user-manager',
    startDate: '2026-11-28',
    endDate: '2026-11-30',
    guestCount: 550,
    status: 'in_progress',
    budget: 4500000,
    actualSpend: 3820000,
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80',
    schedules: [
      {
        id: 'sch-1',
        dayNumber: 1,
        timeSlot: '16:00 - 18:30',
        title: 'Mehendi & Welcome Hi-Tea',
        description: 'Traditional Marigold theme with live bangle makers, folk flute musicians, and welcome coconut mocktails.',
        leadPerson: 'Priya Sharma',
        cueNotes: 'Coordinate arrival of bridal entourage at North Porch by 16:30.',
        isCompleted: true
      },
      {
        id: 'sch-2',
        dayNumber: 1,
        timeSlot: '19:30 - 23:30',
        title: 'Grand Bollywood Sangeet & Choreographed Performances',
        description: 'Interactive LED stage floor, dynamic intelligent lighting, and family dance battles followed by celebrity DJ.',
        leadPerson: 'Vikram Rathore',
        cueNotes: 'Stage mic checks by 19:00. Pyro spark fountains during finale sequence.',
        isCompleted: false
      },
      {
        id: 'sch-3',
        dayNumber: 2,
        timeSlot: '11:00 - 14:00',
        title: 'Baraat Procession & Varmala Ceremony',
        description: 'Brass band with traditional dhol players leading the groom on vintage convertible car to main Mandap.',
        leadPerson: 'Priya Sharma',
        cueNotes: 'Hydraulic scissor lift for revolving Varmala stage test at 09:30.',
        isCompleted: false
      },
      {
        id: 'sch-4',
        dayNumber: 2,
        timeSlot: '19:30 - 23:00',
        title: 'Royal Gala Reception Dinner',
        description: 'Formal reception line with 80-item live buffet, sitar fusion orchestra, and champagne toast.',
        leadPerson: 'Chef Sanjeev Nair',
        cueNotes: 'VIP table 1 service priority at 20:30.',
        isCompleted: false
      }
    ],
    tasks: [
      {
        id: 'task-1',
        title: 'Rigging and Truss Load-in Test',
        category: 'Tech/AV',
        priority: 'urgent',
        assignedTo: 'Farhan Qureshi',
        dueDate: '2026-11-27',
        isCompleted: true
      },
      {
        id: 'task-2',
        title: 'Floral Mandap Exotic Orchids Import Clearance',
        category: 'Decor',
        priority: 'high',
        assignedTo: 'Kavita Chawla',
        dueDate: '2026-11-27',
        isCompleted: true
      },
      {
        id: 'task-3',
        title: 'Municipal Sound NOC & Police Permission Verification',
        category: 'Licensing',
        priority: 'urgent',
        assignedTo: 'Anita Desai',
        dueDate: '2026-11-28',
        isCompleted: true
      },
      {
        id: 'task-4',
        title: 'VIP Guest Arrival Airport Escort Coordination',
        category: 'Logistics',
        priority: 'high',
        assignedTo: 'Vikram Rathore',
        dueDate: '2026-11-28',
        isCompleted: false
      },
      {
        id: 'task-5',
        title: 'Final Headcount & Custom Menu Tasting Sign-off',
        category: 'Catering',
        priority: 'medium',
        assignedTo: 'Priya Sharma',
        dueDate: '2026-11-28',
        isCompleted: false
      }
    ]
  },
  {
    id: 'evt-2026-002',
    code: 'EVT-2026-002',
    title: 'Global AI & Tech Innovators Summit 2026',
    eventType: 'Corporate Summit',
    clientName: 'Ananya Singhal',
    clientId: 'c-2',
    venueName: 'Aerocity Convention & Expo Center, Delhi NCR',
    venueId: 'v-3',
    managerName: 'Priya Sharma',
    managerId: 'user-manager',
    startDate: '2026-12-05',
    endDate: '2026-12-06',
    guestCount: 1200,
    status: 'planning',
    budget: 3200000,
    actualSpend: 1450000,
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    schedules: [
      {
        id: 'sch-10',
        dayNumber: 1,
        timeSlot: '08:00 - 09:30',
        title: 'Delegate Registration & QR Smart Badge Scanning',
        description: 'Instant RFID badge printing with custom QR tokens at 6 express turnstiles.',
        leadPerson: 'Vikram Rathore',
        isCompleted: false
      },
      {
        id: 'sch-11',
        dayNumber: 1,
        timeSlot: '09:30 - 11:00',
        title: 'Keynote Address: The Autonomous Enterprise Era',
        description: 'Plenary hall session with multi-camera live broadcast to international satellite centers.',
        leadPerson: 'Priya Sharma',
        isCompleted: false
      }
    ],
    tasks: [
      {
        id: 'task-10',
        title: 'High-Density WiFi 6 AP Stress Testing',
        category: 'Tech/AV',
        priority: 'high',
        assignedTo: 'Farhan Qureshi',
        dueDate: '2026-12-04',
        isCompleted: false
      },
      {
        id: 'task-11',
        title: 'Print 1,500 Lanyards & Conference Kits',
        category: 'Logistics',
        priority: 'medium',
        assignedTo: 'Vikram Rathore',
        dueDate: '2026-12-03',
        isCompleted: false
      }
    ]
  },
  {
    id: 'evt-2026-003',
    code: 'EVT-2026-003',
    title: 'Sunwave Goa Live Beach EDM Festival',
    eventType: 'Live Concert',
    clientName: 'Arjun Nambiar',
    clientId: 'c-3',
    venueName: 'Bayview Sunlit Oceanfront Resort, Goa',
    venueId: 'v-4',
    managerName: 'Vikram Rathore',
    managerId: 'user-ops',
    startDate: '2026-12-30',
    endDate: '2026-12-31',
    guestCount: 3000,
    status: 'confirmed',
    budget: 6800000,
    actualSpend: 2900000,
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
    schedules: [
      {
        id: 'sch-20',
        dayNumber: 1,
        timeSlot: '16:00 - 19:00',
        title: 'Sunset Acoustic & Tropical House Warm-up',
        description: 'Beach lounge stage with chilled grooves and craft cocktail bars.',
        leadPerson: 'Vikram Rathore',
        isCompleted: false
      },
      {
        id: 'sch-21',
        dayNumber: 1,
        timeSlot: '21:00 - 02:00',
        title: 'Mainstage Headline Show: Dual Synchronized Pyros',
        description: 'International DJ headliners, heavy bass subwoofers, laser projection mapping on coastal rocks.',
        leadPerson: 'Farhan Qureshi',
        isCompleted: false
      }
    ],
    tasks: [
      {
        id: 'task-20',
        title: 'Coastal Zone Management Authority Clearance',
        category: 'Licensing',
        priority: 'urgent',
        assignedTo: 'Anita Desai',
        dueDate: '2026-12-20',
        isCompleted: true
      },
      {
        id: 'task-21',
        title: 'Deploy Barricades & Rapid Gate Check-in QR Scanners',
        category: 'Logistics',
        priority: 'high',
        assignedTo: 'Vikram Rathore',
        dueDate: '2026-12-29',
        isCompleted: false
      }
    ]
  }
];

export const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'qt-2026-042',
    quotationNo: 'QT-2026-042',
    clientName: 'Rahul Oberoi',
    clientEmail: 'rahul@oberoiglobal.com',
    eventTitle: 'The Royal Oberoi Grand Wedding & Sangeet',
    issueDate: '2026-11-01',
    validUntil: '2026-12-01',
    subtotal: 3800000,
    taxRate: 18,
    taxAmount: 684000,
    discount: 100000,
    totalAmount: 4384000,
    status: 'approved',
    items: [
      {
        id: 'qti-1',
        description: 'Complete Turnkey Event Production & On-site Show Direction',
        quantity: 1,
        unitPrice: 1200000,
        amount: 1200000
      },
      {
        id: 'qti-2',
        description: 'Royal Floral Decor, Mandap Conceptualization & Crystal Chandeliers',
        quantity: 1,
        unitPrice: 1500000,
        amount: 1500000
      },
      {
        id: 'qti-3',
        description: 'Line Array Concert Sound, Moving Head Spotlights & Dynamic LED Wall',
        quantity: 1,
        unitPrice: 850000,
        amount: 850000
      },
      {
        id: 'qti-4',
        description: 'Guest Hospitality, Valet Fleet Logistics & Airport Concierge Desks',
        quantity: 1,
        unitPrice: 250000,
        amount: 250000
      }
    ]
  },
  {
    id: 'qt-2026-045',
    quotationNo: 'QT-2026-045',
    clientName: 'Ananya Singhal',
    clientEmail: 'ananya@singhaltech.io',
    eventTitle: 'Global AI & Tech Innovators Summit 2026',
    issueDate: '2026-11-14',
    validUntil: '2026-12-14',
    subtotal: 2800000,
    taxRate: 18,
    taxAmount: 504000,
    discount: 50000,
    totalAmount: 3254000,
    status: 'sent',
    items: [
      {
        id: 'qti-10',
        description: 'Convention Hall Audiovisual & Live Satellite Broadcast Deck',
        quantity: 1,
        unitPrice: 1400000,
        amount: 1400000
      },
      {
        id: 'qti-11',
        description: 'Exhibition Booth Fabrication & Sponsor Lounges (35 Booths)',
        quantity: 35,
        unitPrice: 30000,
        amount: 1050000
      },
      {
        id: 'qti-12',
        description: 'High-Density Delegate Registration System with RFID Badging',
        quantity: 1,
        unitPrice: 350000,
        amount: 350000
      }
    ]
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-2026-089',
    invoiceNo: 'INV-2026-089',
    clientName: 'Rahul Oberoi',
    clientEmail: 'rahul@oberoiglobal.com',
    clientGstin: '27AABCO1234F1Z8',
    eventTitle: 'The Royal Oberoi Grand Wedding & Sangeet',
    issueDate: '2026-11-05',
    dueDate: '2026-11-20',
    subtotal: 3800000,
    taxRate: 18,
    taxAmount: 684000,
    totalAmount: 4484000,
    paidAmount: 3000000,
    balanceDue: 1484000,
    status: 'partial',
    items: [
      {
        id: 'ii-1',
        description: 'Advance Commitment Fee: Turnkey Wedding Management & Production',
        quantity: 1,
        unitPrice: 2000000,
        amount: 2000000
      },
      {
        id: 'ii-2',
        description: 'Vendor Advances Disbursement: Floral Decor & AV Setup',
        quantity: 1,
        unitPrice: 1800000,
        amount: 1800000
      }
    ],
    payments: [
      {
        id: 'pay-1',
        amount: 1500000,
        paymentDate: '2026-11-06',
        paymentMethod: 'RTGS / Bank Transfer',
        referenceNo: 'HDFC26110698124'
      },
      {
        id: 'pay-2',
        amount: 1500000,
        paymentDate: '2026-11-15',
        paymentMethod: 'RTGS / Bank Transfer',
        referenceNo: 'HDFC26111533219'
      }
    ]
  },
  {
    id: 'inv-2026-090',
    invoiceNo: 'INV-2026-090',
    clientName: 'Ananya Singhal',
    clientEmail: 'ananya@singhaltech.io',
    clientGstin: '07AAACS9876Q1Z2',
    eventTitle: 'Global AI & Tech Innovators Summit 2026',
    issueDate: '2026-11-16',
    dueDate: '2026-11-30',
    subtotal: 1000000,
    taxRate: 18,
    taxAmount: 180000,
    totalAmount: 1180000,
    paidAmount: 1180000,
    balanceDue: 0,
    status: 'paid',
    items: [
      {
        id: 'ii-5',
        description: 'Mobilization Advance: Convention Venue Booking & AV Retainer',
        quantity: 1,
        unitPrice: 1000000,
        amount: 1000000
      }
    ],
    payments: [
      {
        id: 'pay-3',
        amount: 1180000,
        paymentDate: '2026-11-17',
        paymentMethod: 'Corporate IMPS / NEFT',
        referenceNo: 'ICIC26111776551'
      }
    ]
  }
];

export const INITIAL_EXPENSES: EventExpense[] = [
  {
    id: 'exp-1',
    eventId: 'evt-2026-001',
    eventTitle: 'The Royal Oberoi Grand Wedding',
    category: 'Audio & Visual',
    description: 'Stage Trussing & Moving Intelligent Heads Rental',
    amount: 320000,
    vendorName: 'SoundCraft Pro Audio & Visuals',
    status: 'approved',
    expenseDate: '2026-11-12'
  },
  {
    id: 'exp-2',
    eventId: 'evt-2026-001',
    eventTitle: 'The Royal Oberoi Grand Wedding',
    category: 'Floral & Decor',
    description: 'Fresh Imported Dutch Carnations & Jasmine Chandeliers',
    amount: 540000,
    vendorName: 'Royal Blossom Floral Art',
    status: 'approved',
    expenseDate: '2026-11-15'
  },
  {
    id: 'exp-3',
    eventId: 'evt-2026-001',
    eventTitle: 'The Royal Oberoi Grand Wedding',
    category: 'Licensing & NOC',
    description: 'Mumbai Police & Sound Decibel Permission Stamp',
    amount: 45000,
    vendorName: 'Municipal Authorities',
    status: 'approved',
    expenseDate: '2026-11-16'
  },
  {
    id: 'exp-4',
    eventId: 'evt-2026-002',
    eventTitle: 'Global AI & Tech Innovators Summit',
    category: 'Branding & Signage',
    description: 'Fabrication of backlit acrylic registration reception desks',
    amount: 180000,
    vendorName: 'Apex Signage & Prints',
    status: 'pending',
    expenseDate: '2026-11-17'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-item-1',
    sku: 'AV-M32-CON',
    name: 'Midas M32 Live Digital Mixing Console (40-Channel)',
    category: 'Sound & Engineering',
    totalQty: 6,
    allocatedQty: 3,
    rentalPrice: 15000,
    condition: 'Good',
    location: 'Warehouse Mumbai A-2'
  },
  {
    id: 'inv-item-2',
    sku: 'LED-P2.6-WALL',
    name: 'High-Definition P2.6 Ultra-Curved LED Display Panels',
    category: 'Visual Displays',
    totalQty: 180,
    allocatedQty: 120,
    rentalPrice: 2500,
    condition: 'Good',
    location: 'Warehouse Mumbai Bay-1'
  },
  {
    id: 'inv-item-3',
    sku: 'DEC-CHR-TIFF',
    name: 'Gold Tiffany Chiavari Banquet Chairs with Ivory Cushions',
    category: 'Furniture & Seating',
    totalQty: 800,
    allocatedQty: 550,
    rentalPrice: 150,
    condition: 'Good',
    location: 'Warehouse Delhi North'
  },
  {
    id: 'inv-item-4',
    sku: 'LGT-SHARPY-10R',
    name: 'Beam Sharpy 10R Moving Head Stage Fixtures',
    category: 'Intelligent Lighting',
    totalQty: 48,
    allocatedQty: 24,
    rentalPrice: 1800,
    condition: 'Good',
    location: 'Warehouse Mumbai A-4'
  }
];

export const INITIAL_GUESTS: EventGuest[] = [
  {
    id: 'gst-1',
    eventId: 'evt-2026-001',
    eventTitle: 'The Royal Oberoi Grand Wedding',
    name: 'Sunil & Sunita Singhania',
    email: 'singhania.corp@gmail.com',
    phone: '+91 98200 12345',
    group: 'VIP',
    tableNo: 'V-01',
    passCode: 'PASS-OBR-7701',
    plusOnes: 1,
    dietaryPref: 'Jain Pure Vegetarian',
    isCheckedIn: true,
    checkInTime: '2026-11-18 16:15'
  },
  {
    id: 'gst-2',
    eventId: 'evt-2026-001',
    eventTitle: 'The Royal Oberoi Grand Wedding',
    name: 'Devraj & Maya Kapoor',
    email: 'devraj@kapoorjewels.in',
    phone: '+91 99888 77665',
    group: 'Family',
    tableNo: 'F-03',
    passCode: 'PASS-OBR-7702',
    plusOnes: 2,
    dietaryPref: 'Vegetarian',
    isCheckedIn: false
  },
  {
    id: 'gst-3',
    eventId: 'evt-2026-001',
    eventTitle: 'The Royal Oberoi Grand Wedding',
    name: 'Meera Nambiar',
    email: 'meera@nambiararts.com',
    phone: '+91 97400 33221',
    group: 'Corporate',
    tableNo: 'C-08',
    passCode: 'PASS-OBR-7703',
    plusOnes: 0,
    dietaryPref: 'Vegan',
    isCheckedIn: false
  },
  {
    id: 'gst-4',
    eventId: 'evt-2026-001',
    eventTitle: 'The Royal Oberoi Grand Wedding',
    name: 'Vikram Malhotra',
    email: 'vmalhotra@timesgroup.in',
    phone: '+91 98210 11223',
    group: 'Media',
    tableNo: 'M-02',
    passCode: 'PASS-OBR-7704',
    plusOnes: 1,
    dietaryPref: 'Non-Veg',
    isCheckedIn: true,
    checkInTime: '2026-11-18 17:05'
  }
];

export const INITIAL_TICKET_TYPES: TicketType[] = [
  {
    id: 'tt-1',
    eventId: 'evt-2026-003',
    name: 'Early Bird General Admission',
    price: 1999,
    totalSupply: 1500,
    soldCount: 1420
  },
  {
    id: 'tt-2',
    eventId: 'evt-2026-003',
    name: 'VIP Front Stage Deck Pass',
    price: 4999,
    totalSupply: 500,
    soldCount: 410
  },
  {
    id: 'tt-3',
    eventId: 'evt-2026-003',
    name: 'VVIP Artist Lounge Table (Group of 6)',
    price: 35000,
    totalSupply: 25,
    soldCount: 22
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'tkt-001',
    ticketNumber: 'SUN-GA-10492',
    ticketTypeName: 'Early Bird General Admission',
    eventTitle: 'Sunwave Goa Live Beach EDM Festival',
    buyerName: 'Aarav Mehta',
    buyerEmail: 'aarav.mehta@gmail.com',
    pricePaid: 1999,
    qrToken: 'QR-SUNWAVE-992144',
    isScanned: true,
    scannedAt: '2026-11-18 18:22'
  },
  {
    id: 'tkt-002',
    ticketNumber: 'SUN-VIP-20188',
    ticketTypeName: 'VIP Front Stage Deck Pass',
    eventTitle: 'Sunwave Goa Live Beach EDM Festival',
    buyerName: 'Rohit Shenoy',
    buyerEmail: 'rohit.shenoy@techcorp.in',
    pricePaid: 4999,
    qrToken: 'QR-SUNWAVE-883190',
    isScanned: false
  },
  {
    id: 'tkt-003',
    ticketNumber: 'SUN-VIP-20189',
    ticketTypeName: 'VIP Front Stage Deck Pass',
    eventTitle: 'Sunwave Goa Live Beach EDM Festival',
    buyerName: 'Tanvi Saxena',
    buyerEmail: 'tanvi.saxena@outlook.com',
    pricePaid: 4999,
    qrToken: 'QR-SUNWAVE-441203',
    isScanned: false
  }
];

export const INITIAL_REQUISITIONS: EventEquipmentRequisition[] = [
  {
    id: 'req-001',
    eventId: 'evt-2026-001',
    eventTitle: 'Global Tech Conclave 2026',
    itemId: 'inv-001',
    itemName: 'JBL VTX A12 Line Array Speaker',
    itemSku: 'AV-SPK-001',
    quantity: 4,
    rentalPrice: 15000,
    days: 2,
    totalCost: 120000,
    status: 'reserved',
    requisitionDate: '2026-11-15'
  },
  {
    id: 'req-002',
    eventId: 'evt-2026-001',
    eventTitle: 'Global Tech Conclave 2026',
    itemId: 'inv-003',
    itemName: 'Absen P2.9 Indoor LED Video Wall (500x500mm)',
    itemSku: 'AV-LED-003',
    quantity: 2,
    rentalPrice: 25000,
    days: 2,
    totalCost: 100000,
    status: 'reserved',
    requisitionDate: '2026-11-15'
  },
  {
    id: 'req-003',
    eventId: 'evt-2026-002',
    eventTitle: 'The Grand Oberoi-Singhania Wedding',
    itemId: 'inv-002',
    itemName: 'Robe BMFL Blade Moving Head Stage Light',
    itemSku: 'LGT-MHD-002',
    quantity: 12,
    rentalPrice: 3500,
    days: 3,
    totalCost: 126000,
    status: 'reserved',
    requisitionDate: '2026-11-14'
  }
];

export const INITIAL_WORK_ORDERS: VendorWorkOrder[] = [
  {
    id: 'wo-001',
    workOrderNo: 'WO-2026-001',
    eventId: 'evt-2026-001',
    eventTitle: 'Global Tech Conclave 2026',
    vendorId: 'v-1',
    vendorName: 'SoundCraft Pro AV & Lighting',
    vendorCategory: 'Audio & Visual',
    scopeOfWork: 'Main auditorium Dolby line array setup, stage monitoring, keynote wireless lavalier mics & technical sound engineer coverage for 2 full days.',
    contractAmount: 450000,
    advancePaid: 200000,
    status: 'accepted',
    cueAssignments: 'Cue 01: Keynote Walk-in; Cue 04: Product Reveal SFX & Spotlight',
    issuedDate: '2026-11-10',
    dueDate: '2026-12-05'
  },
  {
    id: 'wo-002',
    workOrderNo: 'WO-2026-002',
    eventId: 'evt-2026-001',
    eventTitle: 'Global Tech Conclave 2026',
    vendorId: 'v-2',
    vendorName: 'Royal Cuisines Catering Co.',
    vendorCategory: 'Catering & Hospitality',
    scopeOfWork: 'Executive lunch buffet, all-day artisanal coffee bar, and VIP speaker gala dinner for 1,200 attendees.',
    contractAmount: 1200000,
    advancePaid: 400000,
    status: 'issued',
    cueAssignments: 'Session Break 1: 11:00 AM; Lunch Service: 1:30 PM',
    issuedDate: '2026-11-12',
    dueDate: '2026-12-05'
  },
  {
    id: 'wo-003',
    workOrderNo: 'WO-2026-003',
    eventId: 'evt-2026-002',
    eventTitle: 'The Grand Oberoi-Singhania Wedding',
    vendorId: 'v-3',
    vendorName: 'Luxe Flora & Decor Studios',
    vendorCategory: 'Decor & Production',
    scopeOfWork: 'Mandap floral canopy, grand entrance arches, crystal chandeliers, table centerpieces for Sangeet & Reception.',
    contractAmount: 850000,
    advancePaid: 350000,
    status: 'invoiced',
    cueAssignments: 'Bride Grand Entry: 7:45 PM; Ring Exchange: 8:15 PM',
    issuedDate: '2026-11-08',
    dueDate: '2026-12-18'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2026-11-18 16:30',
    actorName: 'Vikramaditya Singhania',
    actorRole: 'Super Administrator',
    action: 'Approved Quotation Q-2026-001',
    entityType: 'quotation',
    entityId: 'q-1',
    details: 'Quotation Q-2026-001 for ₹28,91,000 approved and synchronized with Global Tech Conclave budget.'
  },
  {
    id: 'log-002',
    timestamp: '2026-11-18 14:15',
    actorName: 'Rajesh Verma',
    actorRole: 'Head of Client Acquisition',
    action: 'Converted Lead to Event',
    entityType: 'lead',
    entityId: 'lead-1',
    details: 'Lead "Titan Tech Annual Global Summit 2026" marked qualified and drafted quotation Q-2026-001.'
  },
  {
    id: 'log-003',
    timestamp: '2026-11-17 11:20',
    actorName: 'Anita Desai',
    actorRole: 'Chief Financial Controller',
    action: 'Verified Remittance Advice',
    entityType: 'invoice',
    entityId: 'inv-1',
    details: 'Verified wire transfer UTR #HDFC0099812 for ₹15,00,000 on Invoice INV-2026-001.'
  },
  {
    id: 'log-004',
    timestamp: '2026-11-16 17:45',
    actorName: 'Priya Sharma',
    actorRole: 'Senior Event Producer',
    action: 'Issued Vendor Work Order',
    entityType: 'vendor_wo',
    entityId: 'wo-001',
    details: 'Dispatched Work Order WO-2026-001 to SoundCraft Pro AV & Lighting with advance payment ₹2,00,000.'
  },
  {
    id: 'log-005',
    timestamp: '2026-11-15 09:30',
    actorName: 'Vikram Rathore',
    actorRole: 'Site Operations Lead',
    action: 'Requisitioned Fleet Inventory',
    entityType: 'inventory',
    entityId: 'inv-001',
    details: 'Reserved 4x JBL VTX A12 Line Array Speakers for Global Tech Conclave 2026.'
  }
];
