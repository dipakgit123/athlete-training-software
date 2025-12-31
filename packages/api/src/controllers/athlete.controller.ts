/**
 * Athlete Controller
 * Handle athlete profile operations
 * Matches schema: User + Athlete models
 */

import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { NotFoundError, BadRequestError, ForbiddenError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

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

    // If coach, only show their athletes
    if (req.user?.role === 'COACH') {
      const coach = await prisma.coach.findUnique({
        where: { userId: req.user.id },
        select: { id: true },
      });
      if (coach) {
        where.coachId = coach.id;
      }
    }

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
 * Update athlete profile
 */
export async function updateAthlete(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if athlete exists
    const existing = await prisma.athlete.findUnique({
      where: { id },
    });

    if (!existing) {
      throw NotFoundError('Athlete');
    }

    // Check authorization
    if (
      req.user?.role !== 'ADMIN' &&
      existing.userId !== req.user?.id
    ) {
      // Check if it's the coach
      if (req.user?.role === 'COACH') {
        const coach = await prisma.coach.findUnique({
          where: { userId: req.user.id },
        });
        if (!coach || existing.coachId !== coach.id) {
          throw ForbiddenError('Not authorized to update this athlete');
        }
      } else {
        throw ForbiddenError('Not authorized to update this athlete');
      }
    }

    const athlete = await prisma.athlete.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Athlete updated successfully',
      data: athlete,
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
