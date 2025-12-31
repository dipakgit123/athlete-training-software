/**
 * Analysis Controller
 * Handle blood analysis, load monitoring, biomechanics
 * Simplified version without external rules dependencies
 */

import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { NotFoundError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// ==================== Blood Analysis ====================

/**
 * Get blood test history
 */
export async function getBloodHistory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;

    const bloodTests = await prisma.bloodTest.findMany({
      where: { athleteId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: bloodTests,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get blood test by ID
 */
export async function getBloodTest(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const bloodTest = await prisma.bloodTest.findUnique({
      where: { id },
    });

    if (!bloodTest) {
      throw NotFoundError('Blood test');
    }

    res.json({
      success: true,
      data: bloodTest,
    });
  } catch (error) {
    next(error);
  }
}

// ==================== Load Monitoring ====================

/**
 * Get load history
 */
export async function getLoadHistory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;
    const { startDate, endDate } = req.query as any;

    const where: any = { athleteId };

    if (startDate || endDate) {
      where.recordDate = {};
      if (startDate) where.recordDate.gte = new Date(startDate);
      if (endDate) where.recordDate.lte = new Date(endDate);
    }

    const loads = await prisma.loadRecord.findMany({
      where,
      orderBy: { recordDate: 'desc' },
    });

    res.json({
      success: true,
      data: loads,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Calculate ACWR and load metrics
 */
export async function getACWR(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;

    // Get last 28 days of load data
    const twentyEightDaysAgo = new Date();
    twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 28);

    const loads = await prisma.loadRecord.findMany({
      where: {
        athleteId,
        recordDate: { gte: twentyEightDaysAgo },
      },
      orderBy: { recordDate: 'asc' },
    });

    if (loads.length < 7) {
      res.json({
        success: true,
        data: {
          acwr: null,
          message: 'Insufficient data for ACWR calculation (need at least 7 days)',
        },
      });
      return;
    }

    // Simple ACWR calculation
    const acuteLoads = loads.slice(-7);
    const chronicLoads = loads;

    const acuteAvg = acuteLoads.reduce((sum, l) => sum + (l.dailyLoad || 0), 0) / Math.max(acuteLoads.length, 1);
    const chronicAvg = chronicLoads.reduce((sum, l) => sum + (l.dailyLoad || 0), 0) / Math.max(chronicLoads.length, 1);

    const acwr = chronicAvg > 0 ? acuteAvg / chronicAvg : 0;

    // Determine risk level
    let riskLevel: string;
    let recommendation: string;

    if (acwr < 0.8) {
      riskLevel = 'UNDERTRAINING';
      recommendation = 'Load is below optimal. Consider increasing training volume gradually.';
    } else if (acwr <= 1.3) {
      riskLevel = 'OPTIMAL';
      recommendation = 'Load is in the optimal zone. Maintain current progression.';
    } else if (acwr <= 1.5) {
      riskLevel = 'CAUTION';
      recommendation = 'Load is elevated. Monitor recovery closely.';
    } else {
      riskLevel = 'HIGH_RISK';
      recommendation = 'Load is too high. Reduce training volume to prevent injury.';
    }

    res.json({
      success: true,
      data: {
        acwr: Math.round(acwr * 100) / 100,
        acuteLoad: Math.round(acuteAvg),
        chronicLoad: Math.round(chronicAvg),
        riskLevel,
        recommendation,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get load trends
 */
export async function getLoadTrends(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const loads = await prisma.loadRecord.findMany({
      where: {
        athleteId,
        recordDate: { gte: thirtyDaysAgo },
      },
      orderBy: { recordDate: 'asc' },
    });

    res.json({
      success: true,
      data: loads,
    });
  } catch (error) {
    next(error);
  }
}

// ==================== Biomechanics ====================

/**
 * Get biomechanics history
 */
export async function getBiomechHistory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;

    const biomechData = await prisma.biomechAnalysis.findMany({
      where: { athleteId },
      orderBy: { analysisDate: 'desc' },
    });

    res.json({
      success: true,
      data: biomechData,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get biomech analysis by ID
 */
export async function getBiomechAnalysis(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const biomech = await prisma.biomechAnalysis.findUnique({
      where: { id },
    });

    if (!biomech) {
      throw NotFoundError('Biomechanics analysis');
    }

    res.json({
      success: true,
      data: biomech,
    });
  } catch (error) {
    next(error);
  }
}
