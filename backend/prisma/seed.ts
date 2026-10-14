import 'dotenv/config';
import { PrismaClient, UserRole, PlatformTier } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding PulsOps database...');

  // ─── Platform Plans ──────────────────────────────────────────────────────────
  const plans = [
    {
      name: 'Free Trial', tier: PlatformTier.FREE_TRIAL,
      priceMonthly: 0, priceAnnual: 0,
      maxMembers: 50, maxTrainers: 2, maxStaff: 2,
      hasStore: false, hasAIChat: false, hasAnalytics: false, hasCustomBrand: false,
      features: ['Up to 50 members', 'Basic QR attendance', 'Email support'],
    },
    {
      name: 'Standard', tier: PlatformTier.STANDARD,
      priceMonthly: 49, priceAnnual: 490,
      maxMembers: 200, maxTrainers: 10, maxStaff: 5,
      hasStore: true, hasAIChat: false, hasAnalytics: true, hasCustomBrand: false,
      features: ['Up to 200 members', 'Store module', 'Advanced analytics', 'Priority support'],
    },
    {
      name: 'Plus', tier: PlatformTier.PLUS,
      priceMonthly: 99, priceAnnual: 990,
      maxMembers: 1000, maxTrainers: 30, maxStaff: 15,
      hasStore: true, hasAIChat: true, hasAnalytics: true, hasCustomBrand: false,
      features: ['Up to 1000 members', 'AI Fitness Assistant', 'Custom branding', 'Dedicated support'],
    },
    {
      name: 'Super Plus', tier: PlatformTier.SUPER_PLUS,
      priceMonthly: 249, priceAnnual: 2490,
      maxMembers: 999999, maxTrainers: 999, maxStaff: 999,
      hasStore: true, hasAIChat: true, hasAnalytics: true, hasCustomBrand: true,
      features: ['Unlimited members', 'White-label branding', 'API access', '24/7 support SLA'],
    },
  ];

  for (const plan of plans) {
    await prisma.platformPlan.upsert({
      where: { tier: plan.tier },
      create: plan,
      update: plan,
    });
  }
  console.log('✅ Platform plans seeded');

  // ─── Super Admin ──────────────────────────────────────────────────────────────
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'superadmin@pulsops.com';
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@2024!';
  const passwordHash = await bcrypt.hash(superAdminPassword, 12);

  await prisma.user.upsert({
    where: { email: superAdminEmail },
    create: {
      email: superAdminEmail,
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      passwordHash,
      gymId: null,
    },
    update: {},
  });
  console.log(`✅ Super Admin created: ${superAdminEmail}`);

  // ─── Demo Gym ─────────────────────────────────────────────────────────────────
  const freePlan = await prisma.platformPlan.findUnique({ where: { tier: PlatformTier.STANDARD } });

  let demoGym = await prisma.gym.findUnique({ where: { slug: 'pulsops-demo' } });
  if (!demoGym) {
    demoGym = await prisma.gym.create({
      data: {
        name: 'PulsOps Demo Gym',
        slug: 'pulsops-demo',
        address: '123 Fitness Street',
        city: 'Dubai',
        country: 'UAE',
        phone: '+971501234567',
        email: 'demo@pulsops.com',
      },
    });

    // Create subscription
    if (freePlan) {
      await prisma.gymSubscription.create({
        data: {
          gymId: demoGym.id,
          planId: freePlan.id,
          billingCycle: 'MONTHLY',
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          amountPaid: freePlan.priceMonthly,
        },
      });
    }

    // Create Gym Admin
    const gymAdmin = await prisma.user.upsert({
      where: { email: 'gymadmin@pulsops.com' },
      create: {
        gymId: demoGym.id, role: UserRole.GYM_ADMIN,
        email: 'gymadmin@pulsops.com',
        firstName: 'Ahmed', lastName: 'Al-Rashid',
        passwordHash: await bcrypt.hash('GymAdmin@2024!', 12),
      },
      update: {},
    });

    // Create Trainer
    const trainer = await prisma.user.upsert({
      where: { email: 'trainer@pulsops.com' },
      create: {
        gymId: demoGym.id, role: UserRole.TRAINER,
        email: 'trainer@pulsops.com',
        firstName: 'Sara', lastName: 'Fitness',
        passwordHash: await bcrypt.hash('Trainer@2024!', 12),
      },
      update: {},
    });

    await prisma.trainerProfile.upsert({
      where: { userId: trainer.id },
      create: {
        userId: trainer.id,
        bio: 'Certified personal trainer with 8 years experience',
        specializations: ['Strength Training', 'HIIT', 'Nutrition'],
        certifications: ['NASM-CPT', 'CrossFit L2'],
        commissionRate: 30,
        contractType: 'full-time',
      },
      update: {},
    });

    // Create Member
    const member = await prisma.user.upsert({
      where: { email: 'member@pulsops.com' },
      create: {
        gymId: demoGym.id, role: UserRole.MEMBER,
        email: 'member@pulsops.com',
        firstName: 'John', lastName: 'Doe',
        passwordHash: await bcrypt.hash('Member@2024!', 12),
      },
      update: {},
    });

    await prisma.memberProfile.upsert({
      where: { userId: member.id },
      create: { userId: member.id, gender: 'male', dateOfBirth: new Date('1995-06-15') },
      update: {},
    });

    // Initial InBody
    await prisma.inBodyAssessment.create({
      data: {
        gymId: demoGym.id, userId: member.id, assessedById: trainer.id,
        weight: 82, height: 178, bodyFatPercent: 18.5,
        muscleMass: 38.2, bmi: 25.9, bmr: 1890, visceralFat: 9,
      },
    });

    // Gym Plans
    const gymPlan = await prisma.gymPlan.create({
      data: {
        gymId: demoGym.id, name: 'Monthly Premium',
        description: 'Full access to all facilities',
        durationDays: 30, price: 299,
        features: ['Full gym access', 'Locker room', 'Free classes'],
        color: '#39FF14',
      },
    });

    // Assign membership
    await prisma.gymMembership.create({
      data: {
        userId: member.id, planId: gymPlan.id,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        paidAmount: 299,
      },
    });

    // Assign trainer to member
    await prisma.trainerMember.create({ data: { trainerId: trainer.id, memberId: member.id } });

    // Sample product
    await prisma.product.create({
      data: {
        gymId: demoGym.id,
        title: 'Whey Protein Isolate',
        description: '100% Whey Protein, 25g protein per serving',
        price: 149,
        salePrice: 119,
        stock: 50,
        category: 'Supplements',
      },
    });

    console.log('✅ Demo gym seeded with all demo users');
    console.log(`
  ─────────────────────────────────────────
  Demo Credentials:
  Super Admin: ${superAdminEmail} / SuperAdmin@2024!
  Gym Admin:   gymadmin@pulsops.com / GymAdmin@2024!
  Trainer:     trainer@pulsops.com / Trainer@2024!
  Member:      member@pulsops.com / Member@2024!
  ─────────────────────────────────────────
    `);
  } else {
    console.log('✅ Demo gym already exists — skipping');
  }
}

main()
  .then(() => {
    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
