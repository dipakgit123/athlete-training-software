/**
 * Planning Controller
 * Handle periodization and competition planning
 * Uses MacroCycle, MesoCycle, Competition models from schema
 */

import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { NotFoundError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// ==================== Macrocycle ====================

/**
 * Create macrocycle plan
 */
export async function createMacrocycle(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = req.body;

    // Calculate total weeks from dates
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const totalWeeks = Math.ceil((endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));

    const macrocycle = await prisma.macroCycle.create({
      data: {
        athleteId: data.athleteId,
        name: data.name,
        seasonYear: data.seasonYear || new Date().getFullYear().toString(),
        periodizationType: data.periodizationType || 'TRADITIONAL',
        startDate,
        endDate,
        totalWeeks,
        primaryGoal: data.primaryGoal,
        secondaryGoals: data.secondaryGoals,
        peakCount: data.peakCount || 1,
        status: 'PLANNED',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Macrocycle created successfully',
      data: macrocycle,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get athlete's macrocycles
 */
export async function getMacrocycles(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;

    const macrocycles = await prisma.macroCycle.findMany({
      where: { athleteId },
      orderBy: { startDate: 'desc' },
      include: {
        mesoCycles: true,
      },
    });

    res.json({
      success: true,
      data: macrocycles,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get macrocycle by ID
 */
export async function getMacrocycleById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const macrocycle = await prisma.macroCycle.findUnique({
      where: { id },
      include: {
        mesoCycles: {
          orderBy: { phaseNumber: 'asc' },
        },
      },
    });

    if (!macrocycle) {
      throw NotFoundError('Macrocycle');
    }

    res.json({
      success: true,
      data: macrocycle,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update macrocycle
 */
export async function updateMacrocycle(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const macrocycle = await prisma.macroCycle.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Macrocycle updated successfully',
      data: macrocycle,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete macrocycle
 */
export async function deleteMacrocycle(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    await prisma.macroCycle.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Macrocycle deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

// ==================== Mesocycle ====================

/**
 * Create mesocycle
 */
export async function createMesocycle(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = req.body;

    // Calculate total weeks from dates
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const totalWeeks = Math.ceil((endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));

    const mesocycle = await prisma.mesoCycle.create({
      data: {
        macroCycleId: data.macrocycleId,
        phase: data.phase || 'GENERAL_PREP',
        phaseNumber: data.phaseNumber || 1,
        name: data.name,
        startDate,
        endDate,
        totalWeeks,
        primaryGoal: data.primaryGoal || data.focus,
        secondaryGoal: data.secondaryGoal,
        strengthEmphasis: data.strengthEmphasis,
        speedEmphasis: data.speedEmphasis,
        enduranceEmphasis: data.enduranceEmphasis,
        status: 'PLANNED',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Mesocycle created successfully',
      data: mesocycle,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get mesocycles for macrocycle
 */
export async function getMesocycles(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { macrocycleId } = req.params;

    const mesocycles = await prisma.mesoCycle.findMany({
      where: { macroCycleId: macrocycleId },
      orderBy: { phaseNumber: 'asc' },
    });

    res.json({
      success: true,
      data: mesocycles,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get current mesocycle for athlete
 */
export async function getCurrentMesocycle(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;
    const today = new Date();

    const macrocycle = await prisma.macroCycle.findFirst({
      where: {
        athleteId,
        startDate: { lte: today },
        endDate: { gte: today },
      },
      include: {
        mesoCycles: {
          orderBy: { phaseNumber: 'asc' },
        },
      },
    });

    if (!macrocycle) {
      res.json({
        success: true,
        data: null,
        message: 'No active macrocycle found',
      });
      return;
    }

    // Find current mesocycle based on date
    const currentMesocycle = macrocycle.mesoCycles.find(
      (m) => m.startDate <= today && m.endDate >= today
    );

    // Calculate current week
    const weeksSinceStart = Math.floor(
      (today.getTime() - macrocycle.startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );

    res.json({
      success: true,
      data: {
        macrocycle,
        currentWeek: weeksSinceStart + 1,
        currentMesocycle,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ==================== Competition Planning ====================

/**
 * Add competition to calendar
 */
export async function createCompetition(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = req.body;

    // Create competition and athlete link
    const competition = await prisma.competition.create({
      data: {
        name: data.name,
        level: data.level || 'REGIONAL',
        venue: data.venue || data.location,
        city: data.city,
        country: data.country,
        startDate: new Date(data.date || data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        isIndoor: data.isIndoor || false,
        athletes: {
          create: {
            athleteId: data.athleteId,
            events: data.events || [data.event],
            priority: data.priority || 'B',
            targetPerformance: data.targetPerformance,
            status: 'PLANNED',
          },
        },
      },
      include: {
        athletes: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Competition added successfully',
      data: competition,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get athlete's competitions
 */
export async function getCompetitions(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;

    const athleteCompetitions = await prisma.athleteCompetition.findMany({
      where: { athleteId },
      include: {
        competition: true,
      },
      orderBy: {
        competition: {
          startDate: 'asc',
        },
      },
    });

    res.json({
      success: true,
      data: athleteCompetitions,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get competition by ID
 */
export async function getCompetitionById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const competition = await prisma.competition.findUnique({
      where: { id },
      include: {
        athletes: {
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
          },
        },
      },
    });

    if (!competition) {
      throw NotFoundError('Competition');
    }

    res.json({
      success: true,
      data: competition,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update competition
 */
export async function updateCompetition(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const competition = await prisma.competition.update({
      where: { id },
      data: {
        name: updateData.name,
        level: updateData.level,
        venue: updateData.venue,
        city: updateData.city,
        country: updateData.country,
        isIndoor: updateData.isIndoor,
      },
    });

    res.json({
      success: true,
      message: 'Competition updated successfully',
      data: competition,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete competition
 */
export async function deleteCompetition(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    await prisma.competition.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Competition deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get upcoming competitions
 */
export async function getUpcomingCompetitions(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;
    const today = new Date();

    const athleteCompetitions = await prisma.athleteCompetition.findMany({
      where: {
        athleteId,
        competition: {
          startDate: { gte: today },
        },
      },
      include: {
        competition: true,
      },
      orderBy: {
        competition: {
          startDate: 'asc',
        },
      },
      take: 5,
    });

    res.json({
      success: true,
      data: athleteCompetitions,
    });
  } catch (error) {
    next(error);
  }
}
