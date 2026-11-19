-- Vizha OS / EventFlow ERP Demo Seed Data for Supabase PostgreSQL

-- 1. Insert Company
INSERT INTO "Company" ("id", "name", "legalName", "email", "phone", "gstin", "pan", "address", "city", "state", "pincode", "currency", "updatedAt")
VALUES (
  'comp-1',
  'EventFlow Global Productions',
  'EventFlow ERP Solutions Pvt. Ltd.',
  'contact@eventflow.test',
  '+91 22 6677 8899',
  '27AABCE9988D1Z2',
  'AABCE9988D',
  'Level 12, Tower B, Bandra Kurla Complex (BKC)',
  'Mumbai',
  'Maharashtra',
  '400051',
  'INR',
  NOW()
) ON CONFLICT ("id") DO NOTHING;

-- 2. Insert Branches
INSERT INTO "Branch" ("id", "companyId", "name", "code", "city", "address", "isHeadquarters")
VALUES
  ('br-mumbai', 'comp-1', 'Mumbai HQ', 'BOM-01', 'Mumbai', 'BKC Tower B', true),
  ('br-delhi', 'comp-1', 'Delhi NCR Hub', 'DEL-02', 'Delhi NCR', 'Aerocity Hospitality District', false)
ON CONFLICT ("id") DO NOTHING;

-- 3. Insert Users
INSERT INTO "User" ("id", "companyId", "branchId", "name", "email", "phone", "password", "role", "avatar", "isActive", "updatedAt")
VALUES
  ('user-admin', 'comp-1', 'br-mumbai', 'Vikramaditya Singhania', 'admin@eventflow.test', '+91 98200 11001', '$2a$12$eDemoHashVikramadityaAdmin', 'super_admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', true, NOW()),
  ('user-manager', 'comp-1', 'br-delhi', 'Priya Sharma', 'manager@eventflow.test', '+91 98100 22002', '$2a$12$eDemoHashPriyaManager', 'event_manager', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', true, NOW()),
  ('user-sales', 'comp-1', 'br-mumbai', 'Rajesh Verma', 'sales@eventflow.test', '+91 98200 33003', '$2a$12$eDemoHashRajeshSales', 'sales_executive', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', true, NOW()),
  ('user-finance', 'comp-1', 'br-mumbai', 'Anita Desai', 'finance@eventflow.test', '+91 98200 44004', '$2a$12$eDemoHashAnitaFinance', 'accountant', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', true, NOW())
ON CONFLICT ("id") DO NOTHING;

-- 4. Insert Venues
INSERT INTO "Venue" ("id", "name", "type", "city", "address", "capacity", "rentalRate", "contactName", "contactPhone", "rating", "imageUrl", "isAvailable")
VALUES
  ('v-1', 'The Grand Oberoi Ballroom', 'Luxury Hotel Ballroom', 'Mumbai', 'Nariman Point, Marine Drive, Mumbai 400021', 900, 450000, 'Suresh Menon', '+91 98200 88771', 4.9, 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', true),
  ('v-2', 'Umaid Bhawan Palace Grounds', 'Royal Palace Grounds', 'Jodhpur', 'Circuit House Rd, Cantt Area, Jodhpur 342006', 1500, 950000, 'Digvijay Rathore', '+91 99280 44332', 5.0, 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800', true),
  ('v-3', 'Aerocity Convention & Expo Center', 'Convention Center', 'Delhi NCR', 'Asset 10, Hospitality District, IGI Airport, New Delhi 110037', 2500, 650000, 'Neha Kapoor', '+91 98110 55443', 4.8, 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800', true)
ON CONFLICT ("id") DO NOTHING;

-- 5. Insert Vendor Categories & Vendors
INSERT INTO "VendorCategory" ("id", "name", "code")
VALUES
  ('vc-av', 'Sound & Engineering', 'AV'),
  ('vc-decor', 'Floral & Decor', 'DECOR')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Vendor" ("id", "categoryId", "name", "companyName", "email", "phone", "city", "rating", "gstin")
VALUES
  ('ven-1', 'vc-av', 'Farhan Qureshi', 'SoundCraft Pro Audio & Visuals', 'farhan@soundcraftpro.com', '+91 98205 66778', 'Mumbai', 4.9, '27AAMCS8899N1Z5'),
  ('ven-2', 'vc-decor', 'Kavita Chawla', 'Royal Blossom Floral Art', 'kavita@royalblossom.in', '+91 98112 44332', 'Delhi', 4.8, '07AAECR4433K1Z9')
ON CONFLICT ("id") DO NOTHING;

-- 6. Insert Clients
INSERT INTO "Client" ("id", "name", "companyName", "email", "phone", "gstin", "city", "updatedAt")
VALUES
  ('c-1', 'Rahul Oberoi', 'Oberoi Global Holdings', 'rahul@oberoiglobal.com', '+91 98201 11223', '27AABCO1234F1Z8', 'Mumbai', NOW()),
  ('c-2', 'Ananya Singhal', 'Singhal Tech Ventures', 'ananya@singhaltech.io', '+91 98100 44556', '07AAACS9876Q1Z2', 'Delhi NCR', NOW())
ON CONFLICT ("id") DO NOTHING;
