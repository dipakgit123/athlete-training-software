/**
 * Wellness Controller
 * Handle wellness check-ins and readiness calculations
 * Uses WellnessLog model from schema
 */

import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { NotFoundError, BadRequestError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

/**
 * Submit wellness check-in
 */
export async function submitWellnessCheck(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    const logDate = data.logDate ? new Date(data.logDate) : new Date();

    // Check if check-in already exists for today
    const startOfDay = new Date(logDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(logDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await prisma.wellnessLog.findFirst({
      where: {
        athleteId: data.athleteId,
        logDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existing) {
      throw BadRequestError('Wellness check already submitted for today');
    }

    // Create wellness log using correct schema fields
    const wellnessLog = await prisma.wellnessLog.create({
      data: {
        athleteId: data.athleteId,
        logDate,
        sleepDuration: data.sleepDuration,
        sleepQuality: data.sleepQuality,
        sleepTime: data.sleepTime ? new Date(data.sleepTime) : undefined,
        wakeTime: data.wakeTime ? new Date(data.wakeTime) : undefined,
        sleepInterruptions: data.sleepInterruptions,
        restingHR: data.restingHR,
        hrv: data.hrv || data.hrvScore,
        bodyWeight: data.bodyWeight,
        bodyTemperature: data.bodyTemperature,
        hydrationStatus: data.hydrationStatus || data.hydrationLevel,
        appetite: data.appetite || data.appetiteRating,
        energy: data.energy || data.energyLevel,
        fatigue: data.fatigue,
        stress: data.stress || data.stressLevel,
        mood: data.mood || data.moodRating,
        motivation: data.motivation || data.motivationLevel,
        confidence: data.confidence,
        muscleSoreness: data.muscleSoreness || data.sorenessLevel,
        perceivedRecovery: data.perceivedRecovery,
        painPresent: data.painPresent || false,
        painLocation: data.painLocation,
        painLevel: data.painLevel,
        travelFatigue: data.travelFatigue || false,
        academicStress: data.academicStress || false,
        personalStress: data.personalStress || false,
        notes: data.notes,
      },
    });

    // Calculate readiness score for response
    const readinessScore = calculateSimpleReadiness(wellnessLog);

    res.status(201).json({
      success: true,
      message: 'Wellness check submitted successfully',
      data: {
        wellnessLog,
        readinessScore,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get wellness history for athlete
 */
export async function getWellnessHistory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;
    const { startDate, endDate, page = 1, limit = 30 } = req.query as any;

    const where: any = { athleteId };

    if (startDate || endDate) {
      where.logDate = {};
      if (startDate) where.logDate.gte = new Date(startDate);
      if (endDate) where.logDate.lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      prisma.wellnessLog.findMany({
        where,
        orderBy: { logDate: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.wellnessLog.count({ where }),
    ]);

    // Add calculated readiness to each log
    const logsWithReadiness = logs.map((log) => ({
      ...log,
      calculatedReadiness: calculateSimpleReadiness(log),
    }));

    res.json({
      success: true,
      data: {
        logs: logsWithReadiness,
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
 * Get today's wellness check
 */
export async function getTodayWellness(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const wellness = await prisma.wellnessLog.findFirst({
      where: {
        athleteId,
        logDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    res.json({
      success: true,
      data: wellness ? {
        ...wellness,
        calculatedReadiness: calculateSimpleReadiness(wellness),
      } : null,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get current readiness score
 */
export async function getReadinessScore(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;

    // Get recent wellness data
    const recentWellness = await prisma.wellnessLog.findMany({
      where: { athleteId },
      orderBy: { logDate: 'desc' },
      take: 7,
    });

    if (recentWellness.length === 0) {
      res.json({
        success: true,
        data: {
          score: null,
          category: 'UNKNOWN',
          message: 'No wellness data available',
        },
      });
      return;
    }

    const latest = recentWellness[0];
    const score = calculateSimpleReadiness(latest);

    let category: string;
    if (score >= 80) category = 'OPTIMAL';
    else if (score >= 60) category = 'GOOD';
    else if (score >= 40) category = 'MODERATE';
    else category = 'LOW';

    res.json({
      success: true,
      data: {
        score,
        category,
        latestCheck: {
          ...latest,
          calculatedReadiness: score,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get wellness trends
 */
export async function getWellnessTrends(req: AuthRequest, res: Response, next: NextFunction) {
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

    // Calculate trends using correct schema field names
    const trends = {
      sleepDuration: wellness.filter((w) => w.sleepDuration != null).map((w) => ({ date: w.logDate, value: w.sleepDuration })),
      sleepQuality: wellness.filter((w) => w.sleepQuality != null).map((w) => ({ date: w.logDate, value: w.sleepQuality })),
      restingHR: wellness.filter((w) => w.restingHR != null).map((w) => ({ date: w.logDate, value: w.restingHR })),
      hrv: wellness.filter((w) => w.hrv != null).map((w) => ({ date: w.logDate, value: w.hrv })),
      energy: wellness.filter((w) => w.energy != null).map((w) => ({ date: w.logDate, value: w.energy })),
      stress: wellness.filter((w) => w.stress != null).map((w) => ({ date: w.logDate, value: w.stress })),
      mood: wellness.filter((w) => w.mood != null).map((w) => ({ date: w.logDate, value: w.mood })),
      fatigue: wellness.filter((w) => w.fatigue != null).map((w) => ({ date: w.logDate, value: w.fatigue })),
      readiness: wellness.map((w) => ({ date: w.logDate, value: calculateSimpleReadiness(w) })),
    };

    // Calculate averages
    const averages = {
      sleepDuration: calcAverage(wellness.filter((w) => w.sleepDuration != null).map((w) => w.sleepDuration!)),
      sleepQuality: calcAverage(wellness.filter((w) => w.sleepQuality != null).map((w) => w.sleepQuality!)),
      energy: calcAverage(wellness.filter((w) => w.energy != null).map((w) => w.energy!)),
      readiness: calcAverage(wellness.map((w) => calculateSimpleReadiness(w))),
    };

    res.json({
      success: true,
      data: {
        trends,
        averages,
        totalChecks: wellness.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update wellness check
 */
export async function updateWellnessCheck(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existing = await prisma.wellnessLog.findUnique({
      where: { id },
    });

    if (!existing) {
      throw NotFoundError('Wellness check');
    }

    const wellness = await prisma.wellnessLog.update({
      where: { id },
      data: {
        sleepDuration: updateData.sleepDuration,
        sleepQuality: updateData.sleepQuality,
        energy: updateData.energy || updateData.energyLevel,
        fatigue: updateData.fatigue,
        stress: updateData.stress || updateData.stressLevel,
        mood: updateData.mood || updateData.moodRating,
        motivation: updateData.motivation || updateData.motivationLevel,
        muscleSoreness: updateData.muscleSoreness,
        notes: updateData.notes,
      },
    });

    res.json({
      success: true,
      message: 'Wellness check updated successfully',
      data: {
        ...wellness,
        calculatedReadiness: calculateSimpleReadiness(wellness),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete wellness check
 */
export async function deleteWellnessCheck(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const existing = await prisma.wellnessLog.findUnique({
      where: { id },
    });

    if (!existing) {
      throw NotFoundError('Wellness check');
    }

    await prisma.wellnessLog.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Wellness check deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

// Helper function to calculate simple readiness score using actual schema fields
function calculateSimpleReadiness(data: any): number {
  const weights = {
    sleepQuality: 0.25,
    energy: 0.20,
    mood: 0.15,
    stress: 0.15, // Inverted - lower is better
    muscleSoreness: 0.10, // Inverted - lower is better
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
    // Invert stress level (10 - stress = readiness contribution)
    score += ((10 - data.stress) / 10) * weights.stress * 100;
    totalWeight += weights.stress;
  }

  if (data.muscleSoreness != null) {
    // Invert soreness level
    score += ((10 - data.muscleSoreness) / 10) * weights.muscleSoreness * 100;
    totalWeight += weights.muscleSoreness;
  }

  if (data.motivation != null) {
    score += (data.motivation / 10) * weights.motivation * 100;
    totalWeight += weights.motivation;
  }

  return totalWeight > 0 ? Math.round(score / totalWeight) : 50;
}

// Helper function to calculate average
function calcAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}
