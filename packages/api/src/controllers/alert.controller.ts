/**
 * Alert Controller
 * Handle fatigue alerts and notifications
 * Uses FatigueAlert model from schema
 */

import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { NotFoundError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

/**
 * Get all alerts for current user's athletes
 */
export async function getAlerts(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const {
      severity,
      alertType,
      acknowledged,
      page = 1,
      limit = 20,
      sortBy = 'alertDate',
      sortOrder = 'desc',
    } = req.query as any;

    const where: any = {};

    // Filter by user's access
    if (req.user?.role === 'COACH') {
      const coach = await prisma.coach.findUnique({
        where: { userId: req.user.id },
        include: { athletes: { select: { id: true } } },
      });
      if (coach) {
        where.athleteId = { in: coach.athletes.map((a: { id: string }) => a.id) };
      }
    } else if (req.user?.role === 'ATHLETE') {
      const athlete = await prisma.athlete.findUnique({
        where: { userId: req.user.id },
        select: { id: true },
      });
      if (athlete) {
        where.athleteId = athlete.id;
      }
    }

    if (severity) where.severity = severity;
    if (alertType) where.alertType = alertType;
    if (acknowledged !== undefined) where.acknowledged = acknowledged === 'true';

    const skip = (Number(page) - 1) * Number(limit);

    const [alerts, total] = await Promise.all([
      prisma.fatigueAlert.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: Number(limit),
      }),
      prisma.fatigueAlert.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        alerts,
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
 * Get alerts for specific athlete
 */
export async function getAthleteAlerts(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;
    const { severity, alertType, acknowledged, page = 1, limit = 20 } = req.query as any;

    const where: any = { athleteId };

    if (severity) where.severity = severity;
    if (alertType) where.alertType = alertType;
    if (acknowledged !== undefined) where.acknowledged = acknowledged === 'true';

    const skip = (Number(page) - 1) * Number(limit);

    const [alerts, total] = await Promise.all([
      prisma.fatigueAlert.findMany({
        where,
        orderBy: { alertDate: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.fatigueAlert.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        alerts,
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
 * Get alert summary/counts
 */
export async function getAlertSummary(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    let athleteIds: string[] = [];

    if (req.user?.role === 'COACH') {
      const coach = await prisma.coach.findUnique({
        where: { userId: req.user.id },
        include: { athletes: { select: { id: true } } },
      });
      if (coach) {
        athleteIds = coach.athletes.map((a: { id: string }) => a.id);
      }
    } else if (req.user?.role === 'ATHLETE') {
      const athlete = await prisma.athlete.findUnique({
        where: { userId: req.user.id },
        select: { id: true },
      });
      if (athlete) athleteIds = [athlete.id];
    }

    const whereClause = athleteIds.length > 0 ? { athleteId: { in: athleteIds } } : {};
    const activeWhere = { ...whereClause, acknowledged: false };

    // Count by severity
    const [critical, high, medium, low, total, byType] = await Promise.all([
      prisma.fatigueAlert.count({ where: { ...activeWhere, severity: 'CRITICAL' } }),
      prisma.fatigueAlert.count({ where: { ...activeWhere, severity: 'HIGH' } }),
      prisma.fatigueAlert.count({ where: { ...activeWhere, severity: 'MEDIUM' } }),
      prisma.fatigueAlert.count({ where: { ...activeWhere, severity: 'LOW' } }),
      prisma.fatigueAlert.count({ where: activeWhere }),
      prisma.fatigueAlert.groupBy({
        by: ['alertType'],
        where: activeWhere,
        _count: true,
      }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        bySeverity: { critical, high, medium, low },
        byType: byType.reduce((acc: Record<string, number>, item) => {
          acc[item.alertType] = item._count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new alert
 */
export async function createAlert(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId, alertType, message, severity, recommendedAction, currentValue, threshold, trend } = req.body;

    const alert = await prisma.fatigueAlert.create({
      data: {
        athleteId,
        alertDate: new Date(),
        alertType,
        message,
        severity,
        recommendedAction,
        currentValue,
        threshold,
        trend,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Alert created successfully',
      data: alert,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get alert by ID
 */
export async function getAlertById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const alert = await prisma.fatigueAlert.findUnique({
      where: { id },
    });

    if (!alert) {
      throw NotFoundError('Alert');
    }

    res.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Acknowledge an alert
 */
export async function acknowledgeAlert(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const alert = await prisma.fatigueAlert.update({
      where: { id },
      data: {
        acknowledged: true,
        acknowledgedAt: new Date(),
        acknowledgedBy: req.user?.id,
      },
    });

    res.json({
      success: true,
      message: 'Alert acknowledged',
      data: alert,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete an alert
 */
export async function deleteAlert(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    await prisma.fatigueAlert.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Alert deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Batch acknowledge alerts
 */
export async function batchAcknowledge(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { alertIds } = req.body;

    await prisma.fatigueAlert.updateMany({
      where: { id: { in: alertIds } },
      data: {
        acknowledged: true,
        acknowledgedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: `${alertIds.length} alerts acknowledged`,
    });
  } catch (error) {
    next(error);
  }
}
