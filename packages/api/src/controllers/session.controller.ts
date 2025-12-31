/**
 * Session Controller
 * Handle training session operations
 * Uses Workout and WorkoutLog models from schema
 */

import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { NotFoundError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

/**
 * Create new training session (workout)
 */
export async function createSession(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = req.body;

    const workoutDate = new Date(data.date || data.workoutDate);
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][workoutDate.getDay()];

    const workout = await prisma.workout.create({
      data: {
        athleteId: data.athleteId,
        workoutDate,
        dayOfWeek,
        workoutType: data.type || data.workoutType || 'TRACK',
        primaryFocus: data.primaryFocus || data.objectives?.[0] || 'General Training',
        secondaryFocus: data.secondaryFocus || data.objectives?.[1],
        plannedDuration: data.plannedDuration,
        plannedLoad: data.plannedLoad,
        plannedRPE: data.plannedRPE,
        location: data.location,
        status: 'PLANNED',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Training session created successfully',
      data: workout,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get sessions for an athlete
 */
export async function getAthleteSessions(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;
    const {
      startDate,
      endDate,
      type,
      status,
      page = 1,
      limit = 20,
      sortBy = 'workoutDate',
      sortOrder = 'desc',
    } = req.query as any;

    const where: any = { athleteId };

    if (startDate || endDate) {
      where.workoutDate = {};
      if (startDate) where.workoutDate.gte = new Date(startDate);
      if (endDate) where.workoutDate.lte = new Date(endDate);
    }

    if (type) where.workoutType = type;
    if (status) where.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [sessions, total] = await Promise.all([
      prisma.workout.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: Number(limit),
        include: {
          workoutLog: true,
        },
      }),
      prisma.workout.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        sessions,
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
 * Get today's session
 */
export async function getTodaySession(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const session = await prisma.workout.findFirst({
      where: {
        athleteId,
        workoutDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        workoutLog: true,
      },
    });

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get this week's sessions
 */
export async function getWeekSessions(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const sessions = await prisma.workout.findMany({
      where: {
        athleteId,
        workoutDate: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      orderBy: { workoutDate: 'asc' },
      include: {
        workoutLog: true,
      },
    });

    res.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get session by ID
 */
export async function getSessionById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const session = await prisma.workout.findUnique({
      where: { id },
      include: {
        athlete: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        workoutLog: true,
        trackSession: true,
        strengthSession: true,
      },
    });

    if (!session) {
      throw NotFoundError('Session');
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update session
 */
export async function updateSession(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existing = await prisma.workout.findUnique({
      where: { id },
    });

    if (!existing) {
      throw NotFoundError('Session');
    }

    const session = await prisma.workout.update({
      where: { id },
      data: {
        workoutType: updateData.workoutType,
        primaryFocus: updateData.primaryFocus,
        secondaryFocus: updateData.secondaryFocus,
        plannedDuration: updateData.plannedDuration,
        plannedLoad: updateData.plannedLoad,
        plannedRPE: updateData.plannedRPE,
        location: updateData.location,
        status: updateData.status,
      },
    });

    res.json({
      success: true,
      message: 'Session updated successfully',
      data: session,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Start session
 */
export async function startSession(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const session = await prisma.workout.update({
      where: { id },
      data: {
        status: 'IN_PROGRESS',
      },
    });

    res.json({
      success: true,
      message: 'Session started',
      data: session,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Complete session
 */
export async function completeSession(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { actualDuration, actualLoad, rpe, feedback, energyLevel, technicalFeel } = req.body;

    const existing = await prisma.workout.findUnique({
      where: { id },
    });

    if (!existing) {
      throw NotFoundError('Session');
    }

    // Update workout status
    const session = await prisma.workout.update({
      where: { id },
      data: {
        status: 'COMPLETED',
      },
    });

    // Create workout log
    const workoutLog = await prisma.workoutLog.create({
      data: {
        workoutId: id,
        athleteId: session.athleteId,
        completedAt: new Date(),
        completionStatus: 'COMPLETED',
        actualRPE: rpe,
        actualDuration: actualDuration || existing.plannedDuration,
        actualLoad: actualLoad || existing.plannedLoad,
        energyLevel,
        technicalFeel,
        coachNotes: feedback,
      },
    });

    // Record load data for ACWR calculations
    const sessionLoad = actualLoad || existing.plannedLoad;
    if (sessionLoad) {
      await prisma.loadRecord.create({
        data: {
          athleteId: session.athleteId,
          recordDate: session.workoutDate,
          dailyLoad: sessionLoad,
          sessionRPE: rpe || 5,
          sessionDuration: actualDuration || existing.plannedDuration || 60,
          sessionLoad,
        },
      });
    }

    res.json({
      success: true,
      message: 'Session completed',
      data: { ...session, workoutLog },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete session
 */
export async function deleteSession(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const existing = await prisma.workout.findUnique({
      where: { id },
    });

    if (!existing) {
      throw NotFoundError('Session');
    }

    await prisma.workout.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Session deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
