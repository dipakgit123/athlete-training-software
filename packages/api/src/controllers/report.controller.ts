/**
 * Report Controller
 * Handle report generation and data export
 */

import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { NotFoundError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

/**
 * Get athlete overview report
 */
export async function getAthleteOverview(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;
    const { startDate, endDate } = req.query as any;

    const dateFilter = startDate && endDate ? {
      gte: new Date(startDate),
      lte: new Date(endDate),
    } : undefined;

    const [athlete, workouts, wellness, loads, alerts] = await Promise.all([
      prisma.athlete.findUnique({
        where: { id: athleteId },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          personalBests: true,
        },
      }),
      prisma.workout.findMany({
        where: { athleteId, ...(dateFilter && { workoutDate: dateFilter }) },
        orderBy: { workoutDate: 'asc' },
      }),
      prisma.wellnessLog.findMany({
        where: { athleteId, ...(dateFilter && { logDate: dateFilter }) },
        orderBy: { logDate: 'asc' },
      }),
      prisma.loadRecord.findMany({
        where: { athleteId, ...(dateFilter && { recordDate: dateFilter }) },
        orderBy: { recordDate: 'asc' },
      }),
      prisma.fatigueAlert.findMany({
        where: {
          athleteId,
          ...(dateFilter && { createdAt: dateFilter }),
        },
      }),
    ]);

    if (!athlete) {
      throw NotFoundError('Athlete');
    }

    // Calculate summary stats
    const totalSessions = workouts.length;
    const completedSessions = workouts.filter((s) => s.status === 'COMPLETED').length;
    const totalLoad = loads.reduce((sum, l) => sum + (l.dailyLoad || 0), 0);

    // Calculate average readiness from wellness data
    const avgReadiness = wellness.length > 0
      ? wellness.reduce((sum, w) => sum + calculateReadiness(w), 0) / wellness.length
      : 0;

    res.json({
      success: true,
      data: {
        athlete,
        period: { startDate, endDate },
        summary: {
          totalSessions,
          completedSessions,
          completionRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
          totalLoad,
          avgReadiness: Math.round(avgReadiness),
          alertsCount: alerts.length,
        },
        workouts,
        wellness,
        loads,
        alerts,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get load report
 */
export async function getLoadReport(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;
    const { days = 28 } = req.query as any;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - Number(days));

    const loads = await prisma.loadRecord.findMany({
      where: {
        athleteId,
        recordDate: { gte: daysAgo },
      },
      orderBy: { recordDate: 'asc' },
    });

    // Calculate ACWR
    if (loads.length >= 7) {
      const dailyLoads = loads.map((l) => l.dailyLoad || 0);
      const acuteLoads = dailyLoads.slice(-7);
      const chronicLoads = dailyLoads;

      const acuteAvg = acuteLoads.reduce((a, b) => a + b, 0) / acuteLoads.length;
      const chronicAvg = chronicLoads.reduce((a, b) => a + b, 0) / chronicLoads.length;
      const acwr = chronicAvg > 0 ? acuteAvg / chronicAvg : 0;

      res.json({
        success: true,
        data: {
          loads,
          metrics: {
            acwr: Math.round(acwr * 100) / 100,
            acuteLoad: Math.round(acuteAvg),
            chronicLoad: Math.round(chronicAvg),
            totalLoad: dailyLoads.reduce((a, b) => a + b, 0),
          },
        },
      });
    } else {
      res.json({
        success: true,
        data: {
          loads,
          metrics: null,
          message: 'Insufficient data for ACWR calculation',
        },
      });
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Get wellness report
 */
export async function getWellnessReport(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;
    const { days = 30 } = req.query as any;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - Number(days));

    const wellness = await prisma.wellnessLog.findMany({
      where: {
        athleteId,
        logDate: { gte: daysAgo },
      },
      orderBy: { logDate: 'asc' },
    });

    // Calculate averages using correct field names
    const avgSleep = wellness.length > 0
      ? wellness.filter((w) => w.sleepDuration != null).reduce((sum, w) => sum + (w.sleepDuration || 0), 0) / wellness.filter((w) => w.sleepDuration != null).length
      : 0;
    const avgSleepQuality = wellness.length > 0
      ? wellness.filter((w) => w.sleepQuality != null).reduce((sum, w) => sum + (w.sleepQuality || 0), 0) / wellness.filter((w) => w.sleepQuality != null).length
      : 0;
    const avgReadiness = wellness.length > 0
      ? wellness.reduce((sum, w) => sum + calculateReadiness(w), 0) / wellness.length
      : 0;
    const avgEnergy = wellness.length > 0
      ? wellness.filter((w) => w.energy != null).reduce((sum, w) => sum + (w.energy || 0), 0) / wellness.filter((w) => w.energy != null).length
      : 0;

    res.json({
      success: true,
      data: {
        wellness,
        averages: {
          sleepDuration: Math.round(avgSleep * 10) / 10,
          sleepQuality: Math.round(avgSleepQuality * 10) / 10,
          readiness: Math.round(avgReadiness),
          energyLevel: Math.round(avgEnergy * 10) / 10,
        },
        totalRecords: wellness.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get competition results report
 */
export async function getCompetitionReport(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;
    const { year } = req.query as any;

    const startOfYear = year ? new Date(`${year}-01-01`) : new Date(new Date().getFullYear(), 0, 1);
    const endOfYear = year ? new Date(`${year}-12-31`) : new Date(new Date().getFullYear(), 11, 31);

    const [athleteCompetitions, personalBests] = await Promise.all([
      prisma.athleteCompetition.findMany({
        where: {
          athleteId,
          competition: {
            startDate: {
              gte: startOfYear,
              lte: endOfYear,
            },
          },
        },
        include: {
          competition: true,
          results: true,
        },
        orderBy: {
          competition: {
            startDate: 'asc',
          },
        },
      }),
      prisma.personalBest.findMany({
        where: {
          athleteId,
          date: {
            gte: startOfYear,
            lte: endOfYear,
          },
        },
        orderBy: { date: 'desc' },
      }),
    ]);

    res.json({
      success: true,
      data: {
        year: year || new Date().getFullYear(),
        competitions: athleteCompetitions,
        personalBests,
        summary: {
          totalCompetitions: athleteCompetitions.length,
          pbsAchieved: personalBests.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get weekly summary report
 */
export async function getWeeklySummary(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const [workouts, wellness, loads, alerts] = await Promise.all([
      prisma.workout.findMany({
        where: {
          athleteId,
          workoutDate: { gte: startOfWeek, lte: endOfWeek },
        },
        orderBy: { workoutDate: 'asc' },
      }),
      prisma.wellnessLog.findMany({
        where: {
          athleteId,
          logDate: { gte: startOfWeek, lte: endOfWeek },
        },
        orderBy: { logDate: 'asc' },
      }),
      prisma.loadRecord.findMany({
        where: {
          athleteId,
          recordDate: { gte: startOfWeek, lte: endOfWeek },
        },
      }),
      prisma.fatigueAlert.findMany({
        where: {
          athleteId,
          acknowledged: false,
        },
      }),
    ]);

    const totalLoad = loads.reduce((sum, l) => sum + (l.dailyLoad || 0), 0);
    const avgReadiness = wellness.length > 0
      ? wellness.reduce((sum, w) => sum + calculateReadiness(w), 0) / wellness.length
      : 0;

    res.json({
      success: true,
      data: {
        week: {
          start: startOfWeek,
          end: endOfWeek,
        },
        workouts: {
          total: workouts.length,
          completed: workouts.filter((w) => w.status === 'COMPLETED').length,
          planned: workouts.filter((w) => w.status === 'PLANNED').length,
        },
        wellness: {
          checkIns: wellness.length,
          avgReadiness: Math.round(avgReadiness),
        },
        load: {
          total: totalLoad,
          sessions: loads.length,
        },
        alerts: {
          active: alerts.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// Helper function to calculate readiness from wellness data
function calculateReadiness(data: any): number {
  const weights = {
    sleepQuality: 0.25,
    energy: 0.20,
    mood: 0.15,
    stress: 0.15,
    muscleSoreness: 0.10,
    motivation: 0.15,
  };

  let score = 0;
  let totalWeight = 0;

  if (data.sleepQuality != null) {
    score += (data.sleepQuality / 10) * weights.sleepQuality * 100;
    totalWeight += weights.sleepQuality;
  }

  if (data.energy != null) {
    score += (data.energy / 10) * weights.energy * 100;
    totalWeight += weights.energy;
  }

  if (data.mood != null) {
    score += (data.mood / 10) * weights.mood * 100;
    totalWeight += weights.mood;
  }

  if (data.stress != null) {
    score += ((10 - data.stress) / 10) * weights.stress * 100;
    totalWeight += weights.stress;
  }

  if (data.muscleSoreness != null) {
    score += ((10 - data.muscleSoreness) / 10) * weights.muscleSoreness * 100;
    totalWeight += weights.muscleSoreness;
  }

  if (data.motivation != null) {
    score += (data.motivation / 10) * weights.motivation * 100;
    totalWeight += weights.motivation;
  }

  return totalWeight > 0 ? Math.round(score / totalWeight) : 50;
}
