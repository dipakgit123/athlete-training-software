/**
 * Planning Routes
 * Periodization, macrocycles, mesocycles, and competition planning
 */

import { Router } from 'express';
import { z } from 'zod';
import { validate, validateRequest, commonSchemas } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import * as planningController from '../controllers/planning.controller';

const router = Router();

// Public route for training plan generation (temporarily)
/**
 * @route   POST /api/planning/generate/:athleteId
 * @desc    Generate AI training plan for athlete
 * @access  Public (temporarily)
 */
router.post(
  '/generate/:athleteId',
  planningController.generateTrainingPlan
);

// All other routes require authentication
router.use(authenticate);

// ==================== Macrocycle ====================

const createMacrocycleSchema = z.object({
  athleteId: z.string().uuid(),
  name: z.string().min(2),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  seasonYear: z.string().optional(),
  periodizationType: z.enum(['TRADITIONAL', 'BLOCK', 'UNDULATING', 'POLARIZED']).optional(),
  primaryGoal: z.string(),
  secondaryGoals: z.any().optional(),
  peakCount: z.number().optional(),
});

/**
 * @route   POST /api/planning/macrocycle
 * @desc    Create macrocycle plan
 * @access  Private (Coach)
 */
router.post(
  '/macrocycle',
  authorize(['COACH', 'ADMIN']),
  validate(createMacrocycleSchema),
  planningController.createMacrocycle
);

/**
 * @route   GET /api/planning/macrocycle/athlete/:athleteId
 * @desc    Get athlete's macrocycles
 * @access  Private
 */
router.get(
  '/macrocycle/athlete/:athleteId',
  validateRequest({ params: commonSchemas.athleteIdParam }),
  planningController.getMacrocycles
);

/**
 * @route   GET /api/planning/macrocycle/:id
 * @desc    Get macrocycle by ID
 * @access  Private
 */
router.get(
  '/macrocycle/:id',
  validateRequest({ params: commonSchemas.idParam }),
  planningController.getMacrocycleById
);

/**
 * @route   PUT /api/planning/macrocycle/:id
 * @desc    Update macrocycle
 * @access  Private (Coach)
 */
router.put(
  '/macrocycle/:id',
  authorize(['COACH', 'ADMIN']),
  validateRequest({ params: commonSchemas.idParam }),
  planningController.updateMacrocycle
);

/**
 * @route   DELETE /api/planning/macrocycle/:id
 * @desc    Delete macrocycle
 * @access  Private (Coach)
 */
router.delete(
  '/macrocycle/:id',
  authorize(['COACH', 'ADMIN']),
  validateRequest({ params: commonSchemas.idParam }),
  planningController.deleteMacrocycle
);

// ==================== Mesocycle ====================

const createMesocycleSchema = z.object({
  macrocycleId: z.string().uuid(),
  phase: z.enum(['GENERAL_PREP', 'SPECIFIC_PREP', 'PRE_COMPETITION', 'COMPETITION', 'TRANSITION', 'RECOVERY']).optional(),
  phaseNumber: z.number().optional(),
  name: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  primaryGoal: z.string().optional(),
  secondaryGoal: z.string().optional(),
  strengthEmphasis: z.number().optional(),
  speedEmphasis: z.number().optional(),
  enduranceEmphasis: z.number().optional(),
});

/**
 * @route   POST /api/planning/mesocycle
 * @desc    Create mesocycle
 * @access  Private (Coach)
 */
router.post(
  '/mesocycle',
  authorize(['COACH', 'ADMIN']),
  validate(createMesocycleSchema),
  planningController.createMesocycle
);

/**
 * @route   GET /api/planning/mesocycle/macrocycle/:macrocycleId
 * @desc    Get mesocycles for a macrocycle
 * @access  Private
 */
router.get(
  '/mesocycle/macrocycle/:macrocycleId',
  planningController.getMesocycles
);

/**
 * @route   GET /api/planning/mesocycle/athlete/:athleteId/current
 * @desc    Get current mesocycle for athlete
 * @access  Private
 */
router.get(
  '/mesocycle/athlete/:athleteId/current',
  validateRequest({ params: commonSchemas.athleteIdParam }),
  planningController.getCurrentMesocycle
);

// ==================== Competition Planning ====================

const createCompetitionSchema = z.object({
  athleteId: z.string().uuid(),
  name: z.string().min(2),
  date: z.coerce.date().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  venue: z.string().optional(),
  location: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  level: z.string().optional(),
  events: z.any().optional(),
  event: z.string().optional(),
  priority: z.enum(['A', 'B', 'C']).optional(),
  targetPerformance: z.any().optional(),
  isIndoor: z.boolean().optional(),
});

/**
 * @route   POST /api/planning/competition
 * @desc    Add competition to calendar
 * @access  Private (Coach)
 */
router.post(
  '/competition',
  authorize(['COACH', 'ADMIN']),
  validate(createCompetitionSchema),
  planningController.createCompetition
);

/**
 * @route   GET /api/planning/competition/athlete/:athleteId
 * @desc    Get athlete's competition calendar
 * @access  Private
 */
router.get(
  '/competition/athlete/:athleteId',
  validateRequest({ params: commonSchemas.athleteIdParam }),
  planningController.getCompetitions
);

/**
 * @route   GET /api/planning/competition/athlete/:athleteId/upcoming
 * @desc    Get athlete's upcoming competitions
 * @access  Private
 */
router.get(
  '/competition/athlete/:athleteId/upcoming',
  validateRequest({ params: commonSchemas.athleteIdParam }),
  planningController.getUpcomingCompetitions
);

/**
 * @route   GET /api/planning/competition/:id
 * @desc    Get competition by ID
 * @access  Private
 */
router.get(
  '/competition/:id',
  validateRequest({ params: commonSchemas.idParam }),
  planningController.getCompetitionById
);

/**
 * @route   PUT /api/planning/competition/:id
 * @desc    Update competition
 * @access  Private (Coach)
 */
router.put(
  '/competition/:id',
  authorize(['COACH', 'ADMIN']),
  validateRequest({ params: commonSchemas.idParam }),
  planningController.updateCompetition
);

/**
 * @route   DELETE /api/planning/competition/:id
 * @desc    Delete competition
 * @access  Private (Coach)
 */
router.delete(
  '/competition/:id',
  authorize(['COACH', 'ADMIN']),
  validateRequest({ params: commonSchemas.idParam }),
  planningController.deleteCompetition
);

export default router;
