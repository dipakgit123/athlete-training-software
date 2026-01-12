/**
 * Database Seed File
 * Creates initial data for development and testing
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Coach User
  const coachPassword = await bcrypt.hash('coach123', 12);
  const coach = await prisma.user.upsert({
    where: { email: 'coach@athlete-system.com' },
    update: {},
    create: {
      email: 'coach@athlete-system.com',
      passwordHash: coachPassword,
      firstName: 'Mangesh',
      lastName: 'Singh',
      role: 'COACH',
      phone: '+91-9876543210',
      isActive: true,
      emailVerified: true,
    },
  });
  console.log('✅ Created coach user:', coach.email);

  // Create Coach Profile
  const coachProfile = await prisma.coach.upsert({
    where: { userId: coach.id },
    update: {},
    create: {
      userId: coach.id,
      specialization: 'Sprint & Hurdles Specialist',
      certification: 'Level 4 - World Athletics, IAAF Elite Coach',
      experience: 15,
    },
  });
  console.log('✅ Created coach profile');

  // Create Athlete Users
  const athletePassword = await bcrypt.hash('athlete123', 12);

  const athlete1User = await prisma.user.upsert({
    where: { email: 'rahul@athlete-system.com' },
    update: {},
    create: {
      email: 'rahul@athlete-system.com',
      passwordHash: athletePassword,
      firstName: 'Rahul',
      lastName: 'Sharma',
      role: 'ATHLETE',
      phone: '+91-9876543211',
      isActive: true,
      emailVerified: true,
    },
  });

  const athlete2User = await prisma.user.upsert({
    where: { email: 'priya@athlete-system.com' },
    update: {},
    create: {
      email: 'priya@athlete-system.com',
      passwordHash: athletePassword,
      firstName: 'Priya',
      lastName: 'Patel',
      role: 'ATHLETE',
      phone: '+91-9876543212',
      isActive: true,
      emailVerified: true,
    },
  });

  const athlete3User = await prisma.user.upsert({
    where: { email: 'amit@athlete-system.com' },
    update: {},
    create: {
      email: 'amit@athlete-system.com',
      passwordHash: athletePassword,
      firstName: 'Amit',
      lastName: 'Kumar',
      role: 'ATHLETE',
      phone: '+91-9876543213',
      isActive: true,
      emailVerified: true,
    },
  });
  console.log('✅ Created athlete users');

  // Create Athlete Profiles with proper schema fields
  const athlete1 = await prisma.athlete.upsert({
    where: { userId: athlete1User.id },
    update: {},
    create: {
      userId: athlete1User.id,
      dateOfBirth: new Date('2000-05-15'),
      gender: 'MALE',
      nationality: 'India',
      height: 178,
      weight: 72,
      bodyFatPercentage: 8.5,
      armSpan: 182,
      legLength: 92,
      category: 'SENIOR',
      dominantLeg: 'RIGHT',
      dominantHand: 'RIGHT',
      trainingAge: 8,
      coachId: coachProfile.id,
      isActive: true,
      medicalClearance: true,
      antiDopingStatus: 'CLEAR',
    },
  });

  const athlete2 = await prisma.athlete.upsert({
    where: { userId: athlete2User.id },
    update: {},
    create: {
      userId: athlete2User.id,
      dateOfBirth: new Date('2001-08-22'),
      gender: 'FEMALE',
      nationality: 'India',
      height: 165,
      weight: 56,
      bodyFatPercentage: 15.2,
      armSpan: 167,
      legLength: 85,
      category: 'SENIOR',
      dominantLeg: 'LEFT',
      dominantHand: 'RIGHT',
      trainingAge: 6,
      coachId: coachProfile.id,
      isActive: true,
      medicalClearance: true,
      antiDopingStatus: 'CLEAR',
    },
  });

  const athlete3 = await prisma.athlete.upsert({
    where: { userId: athlete3User.id },
    update: {},
    create: {
      userId: athlete3User.id,
      dateOfBirth: new Date('1999-03-10'),
      gender: 'MALE',
      nationality: 'India',
      height: 182,
      weight: 75,
      bodyFatPercentage: 9.2,
      armSpan: 186,
      legLength: 95,
      category: 'SENIOR',
      dominantLeg: 'RIGHT',
      dominantHand: 'RIGHT',
      trainingAge: 10,
      coachId: coachProfile.id,
      isActive: true,
      medicalClearance: true,
      antiDopingStatus: 'CLEAR',
    },
  });
  console.log('✅ Created athlete profiles');

  // Create Athlete Events
  await prisma.athleteEvent.createMany({
    data: [
      {
        athleteId: athlete1.id,
        eventType: 'M_100',
        eventCategory: 'SPRINT',
        isPrimary: true,
      },
      {
        athleteId: athlete1.id,
        eventType: 'M_200',
        eventCategory: 'SPRINT',
        isPrimary: false,
      },
      {
        athleteId: athlete2.id,
        eventType: 'M_400',
        eventCategory: 'SPRINT',
        isPrimary: true,
      },
      {
        athleteId: athlete2.id,
        eventType: 'M_200',
        eventCategory: 'SPRINT',
        isPrimary: false,
      },
      {
        athleteId: athlete3.id,
        eventType: 'LONG_JUMP',
        eventCategory: 'JUMPS',
        isPrimary: true,
      },
      {
        athleteId: athlete3.id,
        eventType: 'TRIPLE_JUMP',
        eventCategory: 'JUMPS',
        isPrimary: false,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Created athlete events');

  // Create Personal Bests
  await prisma.personalBest.createMany({
    data: [
      {
        athleteId: athlete1.id,
        eventType: 'M_100',
        performance: 10.45,
        wind: 0.8,
        altitude: 0,
        isIndoor: false,
        competition: 'National Championships 2024',
        location: 'Bangalore, India',
        date: new Date('2024-06-15'),
        isVerified: true,
      },
      {
        athleteId: athlete1.id,
        eventType: 'M_200',
        performance: 21.12,
        wind: 1.2,
        altitude: 0,
        isIndoor: false,
        competition: 'State Championships',
        location: 'Mumbai, India',
        date: new Date('2024-07-20'),
        isVerified: true,
      },
      {
        athleteId: athlete2.id,
        eventType: 'M_400',
        performance: 52.80,
        wind: null,
        altitude: 0,
        isIndoor: false,
        competition: 'National Championships 2024',
        location: 'Bangalore, India',
        date: new Date('2024-08-10'),
        isVerified: true,
      },
      {
        athleteId: athlete2.id,
        eventType: 'M_200',
        performance: 24.05,
        wind: 0.5,
        altitude: 0,
        isIndoor: false,
        competition: 'Inter-State Meet',
        location: 'Delhi, India',
        date: new Date('2024-05-18'),
        isVerified: true,
      },
      {
        athleteId: athlete3.id,
        eventType: 'LONG_JUMP',
        performance: 7.85,
        wind: 1.5,
        altitude: 0,
        isIndoor: false,
        competition: 'Federation Cup',
        location: 'Patiala, India',
        date: new Date('2024-05-25'),
        isVerified: true,
      },
      {
        athleteId: athlete3.id,
        eventType: 'TRIPLE_JUMP',
        performance: 16.20,
        wind: 0.9,
        altitude: 0,
        isIndoor: false,
        competition: 'Open Nationals',
        location: 'Hyderabad, India',
        date: new Date('2024-04-12'),
        isVerified: true,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Created personal bests');

  // Create Performance Tests
  await prisma.performanceTest.createMany({
    data: [
      // Rahul's tests
      {
        athleteId: athlete1.id,
        testType: 'SPRINT_10M',
        testDate: new Date('2024-09-01'),
        value: 1.82,
        unit: 'seconds',
        percentile: 92,
        rating: 'Excellent',
        testedBy: 'Coach Mangesh',
      },
      {
        athleteId: athlete1.id,
        testType: 'SPRINT_30M',
        testDate: new Date('2024-09-01'),
        value: 3.95,
        unit: 'seconds',
        percentile: 89,
        rating: 'Excellent',
        testedBy: 'Coach Mangesh',
      },
      {
        athleteId: athlete1.id,
        testType: 'CMJ',
        testDate: new Date('2024-09-05'),
        value: 58.5,
        unit: 'cm',
        percentile: 85,
        rating: 'Very Good',
        testedBy: 'Coach Mangesh',
      },
      {
        athleteId: athlete1.id,
        testType: 'BACK_SQUAT_1RM',
        testDate: new Date('2024-09-10'),
        value: 180,
        unit: 'kg',
        percentile: 88,
        rating: 'Excellent',
        testedBy: 'Strength Coach',
      },
      // Priya's tests
      {
        athleteId: athlete2.id,
        testType: 'SPRINT_30M',
        testDate: new Date('2024-09-02'),
        value: 4.28,
        unit: 'seconds',
        percentile: 82,
        rating: 'Very Good',
        testedBy: 'Coach Mangesh',
      },
      {
        athleteId: athlete2.id,
        testType: 'CMJ',
        testDate: new Date('2024-09-05'),
        value: 42.0,
        unit: 'cm',
        percentile: 78,
        rating: 'Good',
        testedBy: 'Coach Mangesh',
      },
      {
        athleteId: athlete2.id,
        testType: 'VO2MAX',
        testDate: new Date('2024-09-08'),
        value: 58.5,
        unit: 'ml/kg/min',
        percentile: 88,
        rating: 'Excellent',
        testedBy: 'Sports Scientist',
      },
      // Amit's tests
      {
        athleteId: athlete3.id,
        testType: 'SPRINT_20M',
        testDate: new Date('2024-09-03'),
        value: 2.95,
        unit: 'seconds',
        percentile: 86,
        rating: 'Very Good',
        testedBy: 'Coach Mangesh',
      },
      {
        athleteId: athlete3.id,
        testType: 'CMJ',
        testDate: new Date('2024-09-05'),
        value: 62.0,
        unit: 'cm',
        percentile: 90,
        rating: 'Excellent',
        testedBy: 'Coach Mangesh',
      },
      {
        athleteId: athlete3.id,
        testType: 'BROAD_JUMP',
        testDate: new Date('2024-09-05'),
        value: 3.15,
        unit: 'meters',
        percentile: 92,
        rating: 'Excellent',
        testedBy: 'Coach Mangesh',
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Created performance tests');

  // Create Wellness Logs for the last 7 days
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const logDate = new Date(today);
    logDate.setDate(logDate.getDate() - i);
    logDate.setHours(8, 0, 0, 0);

    await prisma.wellnessLog.createMany({
      data: [
        {
          athleteId: athlete1.id,
          logDate,
          sleepDuration: 7.5 + (Math.random() - 0.5),
          sleepQuality: 7 + Math.floor(Math.random() * 3),
          muscleSoreness: 2 + Math.floor(Math.random() * 3),
          fatigue: 2 + Math.floor(Math.random() * 3),
          energy: 7 + Math.floor(Math.random() * 3),
          mood: 7 + Math.floor(Math.random() * 3),
          stress: 2 + Math.floor(Math.random() * 3),
          motivation: 8 + Math.floor(Math.random() * 2),
          confidence: 7 + Math.floor(Math.random() * 3),
          perceivedRecovery: 7 + Math.floor(Math.random() * 3),
          restingHR: 52 + Math.floor(Math.random() * 5),
          hrv: 58 + Math.floor(Math.random() * 15),
          bodyWeight: 72 + (Math.random() - 0.5) * 0.5,
          hydrationStatus: 7 + Math.floor(Math.random() * 2),
          appetite: 7 + Math.floor(Math.random() * 3),
          painPresent: false,
        },
        {
          athleteId: athlete2.id,
          logDate,
          sleepDuration: 7 + (Math.random() - 0.5),
          sleepQuality: 6 + Math.floor(Math.random() * 3),
          muscleSoreness: 3 + Math.floor(Math.random() * 3),
          fatigue: 3 + Math.floor(Math.random() * 3),
          energy: 6 + Math.floor(Math.random() * 3),
          mood: 6 + Math.floor(Math.random() * 3),
          stress: 3 + Math.floor(Math.random() * 3),
          motivation: 7 + Math.floor(Math.random() * 2),
          confidence: 6 + Math.floor(Math.random() * 3),
          perceivedRecovery: 6 + Math.floor(Math.random() * 3),
          restingHR: 55 + Math.floor(Math.random() * 5),
          hrv: 52 + Math.floor(Math.random() * 12),
          bodyWeight: 56 + (Math.random() - 0.5) * 0.3,
          hydrationStatus: 6 + Math.floor(Math.random() * 3),
          appetite: 6 + Math.floor(Math.random() * 3),
          painPresent: false,
        },
        {
          athleteId: athlete3.id,
          logDate,
          sleepDuration: 7.8 + (Math.random() - 0.5),
          sleepQuality: 7 + Math.floor(Math.random() * 3),
          muscleSoreness: 2 + Math.floor(Math.random() * 2),
          fatigue: 2 + Math.floor(Math.random() * 2),
          energy: 8 + Math.floor(Math.random() * 2),
          mood: 7 + Math.floor(Math.random() * 3),
          stress: 2 + Math.floor(Math.random() * 2),
          motivation: 8 + Math.floor(Math.random() * 2),
          confidence: 8 + Math.floor(Math.random() * 2),
          perceivedRecovery: 7 + Math.floor(Math.random() * 3),
          restingHR: 50 + Math.floor(Math.random() * 5),
          hrv: 62 + Math.floor(Math.random() * 15),
          bodyWeight: 75 + (Math.random() - 0.5) * 0.5,
          hydrationStatus: 7 + Math.floor(Math.random() * 3),
          appetite: 8 + Math.floor(Math.random() * 2),
          painPresent: false,
        },
      ],
      skipDuplicates: true,
    });
  }
  console.log('✅ Created wellness logs');

  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('📊 Created Data:');
  console.log('   - 1 Coach: Mangesh Singh');
  console.log('   - 3 Athletes: Rahul Sharma, Priya Patel, Amit Kumar');
  console.log('   - 6 Personal Bests');
  console.log('   - 10 Performance Tests');
  console.log('   - 21 Wellness Logs (7 days x 3 athletes)');
  console.log('');
  console.log('📧 Login Credentials:');
  console.log('   Coach: coach@athlete-system.com / coach123');
  console.log('   Athlete 1: rahul@athlete-system.com / athlete123');
  console.log('   Athlete 2: priya@athlete-system.com / athlete123');
  console.log('   Athlete 3: amit@athlete-system.com / athlete123');
  console.log('');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
