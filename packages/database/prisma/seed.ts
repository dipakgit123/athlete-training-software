/**
 * Database Seed File
 * Creates initial data for development and testing
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
      lastName: 'Coach',
      role: 'COACH',
    },
  });
  console.log('✅ Created coach user:', coach.email);

  // Create Athlete Users
  const athletePassword = await bcrypt.hash('athlete123', 12);

  const athlete1 = await prisma.user.upsert({
    where: { email: 'rahul@athlete-system.com' },
    update: {},
    create: {
      email: 'rahul@athlete-system.com',
      passwordHash: athletePassword,
      firstName: 'Rahul',
      lastName: 'Sharma',
      role: 'ATHLETE',
    },
  });

  const athlete2 = await prisma.user.upsert({
    where: { email: 'priya@athlete-system.com' },
    update: {},
    create: {
      email: 'priya@athlete-system.com',
      passwordHash: athletePassword,
      firstName: 'Priya',
      lastName: 'Patel',
      role: 'ATHLETE',
    },
  });

  const athlete3 = await prisma.user.upsert({
    where: { email: 'amit@athlete-system.com' },
    update: {},
    create: {
      email: 'amit@athlete-system.com',
      passwordHash: athletePassword,
      firstName: 'Amit',
      lastName: 'Kumar',
      role: 'ATHLETE',
    },
  });
  console.log('✅ Created athlete users');

  // Create Coach Profile
  const coachProfile = await prisma.coach.upsert({
    where: { userId: coach.id },
    update: {},
    create: {
      userId: coach.id,
      firstName: 'Mangesh',
      lastName: 'Coach',
      email: 'coach@athlete-system.com',
      specialization: 'Sprint Coach',
      certificationLevel: 'Level 4 - World Athletics',
      yearsExperience: 15,
    },
  });

  // Create Athlete Profiles
  const athleteProfile1 = await prisma.athlete.upsert({
    where: { userId: athlete1.id },
    update: {},
    create: {
      userId: athlete1.id,
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul@athlete-system.com',
      dateOfBirth: new Date('2000-05-15'),
      gender: 'MALE',
      primaryEvent: 'M_100',
      secondaryEvents: ['M_200'],
      competitionLevel: 'ELITE',
      nationality: 'India',
      height: 178,
      weight: 72,
      coachId: coachProfile.id,
      status: 'ACTIVE',
    },
  });

  const athleteProfile2 = await prisma.athlete.upsert({
    where: { userId: athlete2.id },
    update: {},
    create: {
      userId: athlete2.id,
      firstName: 'Priya',
      lastName: 'Patel',
      email: 'priya@athlete-system.com',
      dateOfBirth: new Date('2001-08-22'),
      gender: 'FEMALE',
      primaryEvent: 'M_400',
      secondaryEvents: ['M_200'],
      competitionLevel: 'SENIOR',
      nationality: 'India',
      height: 165,
      weight: 56,
      coachId: coachProfile.id,
      status: 'ACTIVE',
    },
  });

  const athleteProfile3 = await prisma.athlete.upsert({
    where: { userId: athlete3.id },
    update: {},
    create: {
      userId: athlete3.id,
      firstName: 'Amit',
      lastName: 'Kumar',
      email: 'amit@athlete-system.com',
      dateOfBirth: new Date('1999-03-10'),
      gender: 'MALE',
      primaryEvent: 'LONG_JUMP',
      secondaryEvents: ['TRIPLE_JUMP'],
      competitionLevel: 'SENIOR',
      nationality: 'India',
      height: 182,
      weight: 75,
      coachId: coachProfile.id,
      status: 'ACTIVE',
    },
  });
  console.log('✅ Created athlete profiles');

  // Create Personal Bests
  await prisma.personalBest.createMany({
    data: [
      {
        athleteId: athleteProfile1.id,
        event: 'M_100',
        performance: 10.45,
        achievedDate: new Date('2024-06-15'),
        competition: 'National Championships',
      },
      {
        athleteId: athleteProfile1.id,
        event: 'M_200',
        performance: 21.12,
        achievedDate: new Date('2024-07-20'),
        competition: 'State Meet',
      },
      {
        athleteId: athleteProfile2.id,
        event: 'M_400',
        performance: 52.80,
        achievedDate: new Date('2024-08-10'),
        competition: 'National Championships',
      },
      {
        athleteId: athleteProfile3.id,
        event: 'LONG_JUMP',
        performance: 7.85,
        achievedDate: new Date('2024-05-25'),
        competition: 'Federation Cup',
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Created personal bests');

  // Create Wellness Checks for last 7 days
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    await prisma.wellnessCheck.createMany({
      data: [
        {
          athleteId: athleteProfile1.id,
          date,
          sleepHours: 7.5 + Math.random(),
          sleepQuality: 7 + Math.floor(Math.random() * 3),
          restingHR: 52 + Math.floor(Math.random() * 5),
          hrvRmssd: 58 + Math.floor(Math.random() * 15),
          perceivedFatigue: 2 + Math.floor(Math.random() * 3),
          muscleSoreness: 2 + Math.floor(Math.random() * 3),
          stressLevel: 2 + Math.floor(Math.random() * 3),
          mood: 7 + Math.floor(Math.random() * 3),
          hydrationStatus: 7 + Math.floor(Math.random() * 2),
          nutritionCompliance: 80 + Math.floor(Math.random() * 15),
          readinessScore: 75 + Math.floor(Math.random() * 15),
          readinessCategory: 'GOOD',
        },
        {
          athleteId: athleteProfile2.id,
          date,
          sleepHours: 7 + Math.random(),
          sleepQuality: 6 + Math.floor(Math.random() * 3),
          restingHR: 55 + Math.floor(Math.random() * 5),
          hrvRmssd: 52 + Math.floor(Math.random() * 12),
          perceivedFatigue: 3 + Math.floor(Math.random() * 3),
          muscleSoreness: 3 + Math.floor(Math.random() * 3),
          stressLevel: 3 + Math.floor(Math.random() * 3),
          mood: 6 + Math.floor(Math.random() * 3),
          hydrationStatus: 6 + Math.floor(Math.random() * 3),
          nutritionCompliance: 75 + Math.floor(Math.random() * 15),
          readinessScore: 68 + Math.floor(Math.random() * 12),
          readinessCategory: 'MODERATE',
        },
      ],
      skipDuplicates: true,
    });
  }
  console.log('✅ Created wellness checks');

  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('📧 Login Credentials:');
  console.log('   Coach: coach@athlete-system.com / coach123');
  console.log('   Athlete: rahul@athlete-system.com / athlete123');
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
