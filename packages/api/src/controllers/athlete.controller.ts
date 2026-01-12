/**
 * Athlete Controller
 * Handle athlete profile operations
 * Matches schema: User + Athlete models
 */

import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { NotFoundError, BadRequestError, ForbiddenError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { mapEventNameToEnum, mapEventCategoryToEnum } from '../utils/event-mapper';

/**
 * Get all athletes with pagination and filters
 */
export async function getAllAthletes(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query as any;

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};

    // Search by user first name or last name
    if (search) {
      where.user = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    if (category) {
      where.category = category;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    // If authenticated and coach, only show their athletes
    if (req.user?.role === 'COACH') {
      const coach = await prisma.coach.findUnique({
        where: { userId: req.user.id },
        select: { id: true },
      });
      if (coach) {
        where.coachId = coach.id;
      }
    }
    // If not authenticated, show all athletes (for public access)

    const [athletes, total] = await Promise.all([
      prisma.athlete.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              profileImage: true,
            },
          },
          _count: {
            select: {
              workouts: true,
              wellnessLogs: true,
            },
          },
        },
      }),
      prisma.athlete.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        athletes,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get athlete by ID
 */
export async function getAthleteById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const athlete = await prisma.athlete.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            lastLogin: true,
          },
        },
        coach: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        personalBests: {
          orderBy: { date: 'desc' },
          take: 10,
        },
        events: true,
      },
    });

    if (!athlete) {
      throw NotFoundError('Athlete');
    }

    res.json({
      success: true,
      data: athlete,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create new athlete with user account
 */
export async function createAthlete(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const {
      // User data
      email,
      password,
      firstName,
      lastName,
      phone,
      
      // Athlete basic info
      dateOfBirth,
      gender,
      nationality,
      height,
      weight,
      bodyFatPercentage,
      armSpan,
      legLength,
      category,
      dominantLeg,
      dominantHand,
      trainingAge,
      coachId,
      trainingGroupId,
      
      // Medical
      medicalClearance,
      antiDopingStatus,
      
      // Events
      events,
      
      // Optional related data
      personalBests,
      goals,
      documents,
    } = req.body;

    // Hash password
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(password || 'athlete123', 12);

    // Create athlete with user in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          phone,
          role: 'ATHLETE',
          isActive: true,
        },
      });

      // Create athlete profile
      const athlete = await tx.athlete.create({
        data: {
          userId: user.id,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          nationality,
          height: height ? parseFloat(height) : undefined,
          weight: weight ? parseFloat(weight) : undefined,
          bodyFatPercentage: bodyFatPercentage ? parseFloat(bodyFatPercentage) : undefined,
          armSpan: armSpan ? parseFloat(armSpan) : undefined,
          legLength: legLength ? parseFloat(legLength) : undefined,
          category: category || 'YOUTH', // Default to YOUTH if not provided
          dominantLeg,
          dominantHand,
          trainingAge: trainingAge ? parseInt(trainingAge) : 0,
          coachId,
          trainingGroupId,
          medicalClearance: medicalClearance !== false,
          antiDopingStatus: antiDopingStatus || 'CLEAR',
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      // Add events if provided
      if (events && Array.isArray(events) && events.length > 0) {
        await tx.athleteEvent.createMany({
          data: events.map((event: any) => ({
            athleteId: athlete.id,
            eventType: mapEventNameToEnum(event.eventType),
            eventCategory: mapEventCategoryToEnum(event.eventCategory),
            isPrimary: event.isPrimary || false,
          })),
        });
      }

      // Add personal bests if provided
      if (personalBests && Array.isArray(personalBests) && personalBests.length > 0) {
        await tx.personalBest.createMany({
          data: personalBests.map((pb: any) => ({
            athleteId: athlete.id,
            eventType: pb.eventType,
            performance: parseFloat(pb.performance),
            wind: pb.wind ? parseFloat(pb.wind) : undefined,
            altitude: pb.altitude ? parseInt(pb.altitude) : undefined,
            isIndoor: pb.isIndoor || false,
            competition: pb.competition,
            location: pb.location,
            date: new Date(pb.date),
            isVerified: pb.isVerified || false,
          })),
        });
      }

      // Add goals if provided
      if (goals && Array.isArray(goals) && goals.length > 0) {
        await tx.goalSetting.createMany({
          data: goals.map((goal: any) => ({
            athleteId: athlete.id,
            goalType: goal.goalType,
            category: goal.category || 'PERFORMANCE',
            goal: goal.goal,
            specificTarget: goal.specificTarget,
            deadline: goal.deadline ? new Date(goal.deadline) : undefined,
            phase: goal.phase,
          })),
        });
      }

      return athlete;
    });

    res.status(201).json({
      success: true,
      message: 'Athlete created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update athlete profile
 */
export async function updateAthlete(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if athlete exists
    const existing = await prisma.athlete.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existing) {
      throw NotFoundError('Athlete');
    }

    // Check authorization (temporarily disabled for public access)
    // TODO: Re-enable when authentication is implemented
    // if (
    //   req.user?.role !== 'ADMIN' &&
    //   existing.userId !== req.user?.id
    // ) {
    //   // Check if it's the coach
    //   if (req.user?.role === 'COACH') {
    //     const coach = await prisma.coach.findUnique({
    //       where: { userId: req.user.id },
    //     });
    //     if (!coach || existing.coachId !== coach.id) {
    //       throw ForbiddenError('Not authorized to update this athlete');
    //     }
    //   } else {
    //     throw ForbiddenError('Not authorized to update this athlete');
    //   }
    // }

    // Separate user data from athlete data
    const {
      firstName,
      lastName,
      phone,
      email,
      events,
      ...athleteData
    } = updateData;

    // Update in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update user if any user fields changed
      if (firstName || lastName || phone || email) {
        await tx.user.update({
          where: { id: existing.userId },
          data: {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(phone && { phone }),
            ...(email && { email }),
          },
        });
      }

      // Update athlete
      // Filter out empty strings for optional enum fields
      const cleanedData = { ...athleteData };
      if (cleanedData.dominantLeg === '') cleanedData.dominantLeg = undefined;
      if (cleanedData.dominantHand === '') cleanedData.dominantHand = undefined;
      
      const athlete = await tx.athlete.update({
        where: { id },
        data: {
          ...cleanedData,
          ...(cleanedData.dateOfBirth && { dateOfBirth: new Date(cleanedData.dateOfBirth) }),
          ...(cleanedData.height && { height: parseFloat(cleanedData.height) }),
          ...(cleanedData.weight && { weight: parseFloat(cleanedData.weight) }),
          ...(cleanedData.bodyFatPercentage && { bodyFatPercentage: parseFloat(cleanedData.bodyFatPercentage) }),
          ...(cleanedData.armSpan && { armSpan: parseFloat(cleanedData.armSpan) }),
          ...(cleanedData.legLength && { legLength: parseFloat(cleanedData.legLength) }),
          ...(cleanedData.trainingAge && { trainingAge: parseInt(cleanedData.trainingAge) }),
        },
        include: {
          user: true,
          events: true,
        },
      });

      // Update events if provided
      if (events && Array.isArray(events)) {
        // Delete existing events
        await tx.athleteEvent.deleteMany({
          where: { athleteId: id },
        });

        // Create new events
        if (events.length > 0) {
          await tx.athleteEvent.createMany({
            data: events.map((event: any) => ({
              athleteId: id,
              eventType: mapEventNameToEnum(event.eventType),
              eventCategory: mapEventCategoryToEnum(event.eventCategory),
              isPrimary: event.isPrimary || false,
            })),
          });
        }
      }

      return athlete;
    });

    res.json({
      success: true,
      message: 'Athlete updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get athlete summary with recent metrics
 */
export async function getAthleteSummary(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const [athlete, recentWellness, recentWorkouts, activeAlerts] = await Promise.all([
      prisma.athlete.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          personalBests: {
            take: 5,
            orderBy: { date: 'desc' },
          },
        },
      }),
      prisma.wellnessLog.findMany({
        where: { athleteId: id },
        orderBy: { logDate: 'desc' },
        take: 7,
      }),
      prisma.workout.findMany({
        where: { athleteId: id },
        orderBy: { workoutDate: 'desc' },
        take: 7,
      }),
      prisma.fatigueAlert.findMany({
        where: {
          athleteId: id,
          acknowledged: false,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    if (!athlete) {
      throw NotFoundError('Athlete');
    }

    // Calculate basic stats
    const todayWellness = recentWellness[0];
    const avgSleepQuality = recentWellness.length
      ? recentWellness.reduce((sum, w) => sum + (w.sleepQuality || 0), 0) / recentWellness.length
      : 0;

    // Calculate readiness from wellness metrics
    const currentReadiness = todayWellness
      ? Math.round(((todayWellness.sleepQuality || 5) + (todayWellness.energy || 5) - (todayWellness.fatigue || 5) + 10) / 25 * 100)
      : null;

    res.json({
      success: true,
      data: {
        athlete,
        summary: {
          currentReadiness,
          avgSleepQuality: Math.round(avgSleepQuality * 10) / 10,
          activeAlerts: activeAlerts.length,
          workoutsCompleted: recentWorkouts.filter((w) => w.status === 'COMPLETED').length,
        },
        recentWellness,
        recentWorkouts,
        activeAlerts,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get personal bests
 */
export async function getPersonalBests(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const personalBests = await prisma.personalBest.findMany({
      where: { athleteId: id },
      orderBy: [{ eventType: 'asc' }, { date: 'desc' }],
    });

    res.json({
      success: true,
      data: personalBests,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Add personal best
 */
export async function addPersonalBest(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { eventType, performance, achievedDate, competition, venue, conditions, altitude, notes } = req.body;

    const personalBest = await prisma.personalBest.create({
      data: {
        athleteId: id,
        eventType,
        performance,
        date: new Date(achievedDate),
        competition,
        location: venue,
        altitude,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Personal best added successfully',
      data: personalBest,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get athlete goals
 */
export async function getGoals(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const goals = await prisma.goalSetting.findMany({
      where: { athleteId: id },
      orderBy: [{ status: 'asc' }, { deadline: 'asc' }],
    });

    res.json({
      success: true,
      data: goals,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Set athlete goal
 */
export async function setGoal(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { goalType, category, goal, specificTarget, targetDate, phase } = req.body;

    const newGoal = await prisma.goalSetting.create({
      data: {
        athleteId: id,
        goalType,
        category: category || 'PERFORMANCE',
        goal,
        specificTarget,
        deadline: targetDate ? new Date(targetDate) : undefined,
        phase,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Goal set successfully',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
}
