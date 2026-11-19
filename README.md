# EventFlow ERP 2.0 – Modern Enterprise Event Management Software

An enterprise-grade, multi-tenant **Event Management ERP System** re-architected in a modern stack: **Next.js 15 (React 19), TypeScript, Tailwind CSS, Prisma ORM, and Supabase (PostgreSQL)**.

Built to power turnkey event management companies, luxury wedding planners, corporate summit producers, live concert/festival organizers, and venue operators.

---

## 🌟 Key Capabilities & Modules

### 1. Multi-Tenant Architecture & Instant RBAC Quick-Switcher
- 7 Built-in Role Scopes: Super Admin, Senior Event Producer, Sales Executive, Lead Accountant, Operations Lead, Client Portal User, and Vendor Partner.
- One-click instant role switcher in top navigation bar to test views & permissions on the fly.

### 2. CRM & Sales Lead Pipeline
- Full interactive Kanban board across 7 lifecycle stages (`New` &rarr; `Contacted` &rarr; `Qualified` &rarr; `Proposal Sent` &rarr; `Negotiating` &rarr; `Won & Converted` &rarr; `Lost`).
- **1-Click Conversion**: Converts any qualified lead into a registered Client profile and creates a confirmed Production Event with initial schedules and task checklists.

### 3. End-to-End Production Operations
- **Minute-by-Minute Run of Show**: Daily schedules with designated in-charge leads, real-time staging cue notes, and completion toggles.
- **Production Checklists & Milestones**: Filterable tasks across Tech/AV, Floral Decor, Catering, Logistics, and Municipal Licensing with priority indicators (`urgent`, `high`, `medium`, `low`).

### 4. Ticketing & Live Gate Optical QR Scanner
- Multi-tier ticket types (Early Bird, VIP Deck, VVIP Artist Lounge).
- **Live Optical Gate Scanner**: Instant token verification preventing fraudulent duplicate check-ins with visual/audio validation feedback.
- Interactive token tester for optical gates.

### 5. Guests, RSVPs & Gate Check-in
- Guest categories (VIP, Family, Corporate Delegates, Media).
- Unique invitation pass codes, table numbers, dietary preferences (Jain, Veg, Non-Veg, Vegan), and plus-ones.
- 1-click turnstile gate admission toggle with real-time throughput metrics.

### 6. Billing, 18% GST Invoicing & Accounting
- Itemized quotation builder with customizable deliverables and 18% GST calculation.
- Milestone GST Tax Invoices with CGST (9%) + SGST (9%) or IGST (18%) itemized calculation.
- Multi-mode partial payment recording (RTGS, Corporate IMPS, UPI, Cheque).
- Printable, GST-compliant invoice templates.

### 7. Partner Venues & Vendor Management
- Curated venue directory with capacity metrics, day rental rates, availability status, and amenities tracking.
- Vendor directory across sound engineering, floral decor, catering, cinematography, and stage fabrication.

### 8. Budgets, Expenses & AV Fleet Inventory
- Real-time budget variance and contingency reserves.
- Direct expense logging and approval workflow.
- Equipment inventory tracking across warehouses (consoles, curved LED walls, Tiffany chairs, intelligent moving heads).

### 9. Dedicated External Portals
- **Client Portal** (`/portal/client`): View production itineraries, run-of-show timelines, approved quotations, and payment receipts.
- **Vendor Portal** (`/portal/vendor`): Review work orders, technical scope of work, and advance disbursement history.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (Node v22.14.0 verified)
- npm or pnpm

### Quick Launch
```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Run the Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase PostgreSQL Setup (Optional / Production)

1. Create a project on [Supabase](https://supabase.com).
2. Copy your Project URL, Anon Key, and Database Connection Strings into `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
```
3. Push the Prisma schema and run seed:
```bash
npm run db:push
npm run db:seed
```

---

## 📁 Project Structure

```
├── app/
│   ├── dashboard/       # Executive KPI dashboard & live run-of-show
│   ├── leads/           # CRM pipeline Kanban & 1-click conversion
│   ├── events/          # Production operations & minute-by-minute cues
│   ├── clients/         # Client profiles & GSTIN master records
│   ├── venues/          # Curated venue directory & capacity
│   ├── vendors/         # Vendor partner directory
│   ├── quotations/      # 18% GST quotation builder & printout
│   ├── invoices/        # 18% GST Tax Invoices & payment logs
│   ├── expenses/        # Budgets & expense approvals
│   ├── inventory/       # AV gear & staging equipment fleet
│   ├── guests/          # Guest RSVPs, seating & gate check-in
│   ├── tickets/         # Live Gate QR optical scanner & ticket passes
│   ├── reports/         # Executive profit analytics & charts
│   └── portal/          # Dedicated Client & Vendor portals
├── components/          # Navbar, Sidebar, modals
├── lib/
│   ├── mock-data.ts     # Preloaded demo datasets
│   ├── store.tsx        # React state store with persistence
│   ├── supabase.ts      # Supabase client SDK
│   ├── prisma.ts        # Prisma client singleton
│   └── types.ts         # TypeScript interfaces
├── prisma/
│   ├── schema.prisma    # PostgreSQL Prisma schema for Supabase
│   └── seed.js          # Database seeder
└── legacy_laravel/      # Safely archived legacy PHP code
```
