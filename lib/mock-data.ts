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
  TicketType
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
    title: 'Luxury Destination Wedding (3 Days)',
    clientName: 'Devraj & Sunita Kapoor',
    email: 'kapoor.wedding@gmail.com',
    phone: '+91 99888 77665',
    companyName: 'Kapoor Jewels & Heritage',
    eventType: 'Destination Wedding',
    estimatedBudget: 8500000,
    guestCount: 450,
    eventDate: '2026-12-18',
    source: 'Referral',
    stage: 'negotiating',
    priority: 'urgent',
    assignedTo: 'Rajesh Verma',
    notes: 'Bride prefers royal Rajputana palace aesthetics. Seeking comprehensive catering + drone cinematography.',
    createdAt: '2026-11-10'
  },
  {
    id: 'lead-102',
    title: 'Global Tech Visionaries Summit 2027',
    clientName: 'Ananya Singhal',
    email: 'summit@singhaltech.io',
    phone: '+91 98100 44556',
    companyName: 'Singhal Tech Ventures',
    eventType: 'Corporate Summit',
    estimatedBudget: 4200000,
    guestCount: 800,
    eventDate: '2027-02-14',
    source: 'Website',
    stage: 'proposal_sent',
    priority: 'high',
    assignedTo: 'Rajesh Verma',
    notes: 'Keynote auditorium with 4K LED curved video walls and simultaneous live stream translation.',
    createdAt: '2026-11-12'
  },
  {
    id: 'lead-103',
    title: 'Elysium Music & Arts Fest 2027',
    clientName: 'Arjun Nambiar',
    email: 'arjun@elysiummusic.in',
    phone: '+91 97400 33221',
    companyName: 'Elysium Entertainment',
    eventType: 'Music Festival',
    estimatedBudget: 6000000,
    guestCount: 2500,
    eventDate: '2027-01-20',
    source: 'Social Media',
    stage: 'qualified',
    priority: 'high',
    assignedTo: 'Rajesh Verma',
    notes: '2-day multi-stage setup with pyro, laser mapping, and barcode gate scanners.',
    createdAt: '2026-11-15'
  },
  {
    id: 'lead-104',
    title: 'Apex Motors Electric SUV Launch',
    clientName: 'Sanjay Malhotra',
    email: 'sanjay@apexmotors.com',
    phone: '+91 98210 99887',
    companyName: 'Apex Automotive Ltd',
    eventType: 'Product Launch',
    estimatedBudget: 3500000,
    guestCount: 300,
    eventDate: '2026-12-28',
    source: 'Cold Call',
    stage: 'new',
    priority: 'medium',
    assignedTo: 'Rajesh Verma',
    notes: 'Dramatic vehicle reveal with hydraulic turntable and holographic projections.',
    createdAt: '2026-11-17'
  },
  {
    id: 'lead-105',
    title: 'Reliance Foundation Healthcare Gala',
    clientName: 'Meenakshi Iyer',
    email: 'meenakshi@rfgh.org',
    phone: '+91 98450 11992',
    companyName: 'Healthcare Philanthropy',
    eventType: 'Milestone Gala',
    estimatedBudget: 5000000,
    guestCount: 600,
    eventDate: '2027-03-05',
    source: 'Referral',
    stage: 'contacted',
    priority: 'medium',
    assignedTo: 'Rajesh Verma',
    notes: 'Charity auction dinner, 5-course curated fine dining with classical symphony ensemble.',
    createdAt: '2026-11-16'
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
