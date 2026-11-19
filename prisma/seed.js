const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding EventFlow ERP database on Supabase...');

  // Create Company
  const company = await prisma.company.upsert({
    where: { id: 'comp-1' },
    update: {},
    create: {
      id: 'comp-1',
      name: 'EventFlow Global Productions',
      legalName: 'EventFlow ERP Solutions Pvt. Ltd.',
      email: 'contact@eventflow.test',
      phone: '+91 22 6677 8899',
      gstin: '27AABCE9988D1Z2',
      pan: 'AABCE9988D',
      address: 'Level 12, Tower B, Bandra Kurla Complex (BKC)',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400051',
      currency: 'INR'
    }
  });

  // Create Branches
  const mumbaiBranch = await prisma.branch.upsert({
    where: { id: 'br-mumbai' },
    update: {},
    create: {
      id: 'br-mumbai',
      companyId: company.id,
      name: 'Mumbai HQ',
      code: 'BOM-01',
      city: 'Mumbai',
      isHeadquarters: true
    }
  });

  const delhiBranch = await prisma.branch.upsert({
    where: { id: 'br-delhi' },
    update: {},
    create: {
      id: 'br-delhi',
      companyId: company.id,
      name: 'Delhi NCR Hub',
      code: 'DEL-02',
      city: 'Delhi NCR'
    }
  });

  // Create Users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@eventflow.test' },
    update: {},
    create: {
      id: 'user-admin',
      companyId: company.id,
      branchId: mumbaiBranch.id,
      name: 'Vikramaditya Singhania',
      email: 'admin@eventflow.test',
      password: 'password_hash_demo',
      role: 'super_admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
