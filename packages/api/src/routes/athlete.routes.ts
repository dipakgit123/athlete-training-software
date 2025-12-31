/**
 * Athlete Routes
 * CRUD operations for athlete profiles
 */

import { Router } from 'express';
import { z } from 'zod';
import { validateRequest, commonSchemas } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import * as athleteController from '../controllers/athlete.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Validation schemas
const athleteQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  isActive: z.string().optional(),
  ...commonSchemas.pagination.shape,
});

// Routes
/**
 * @route   GET /api/athletes
 * @desc    Get all athletes (with pagination and filters)
 * @access  Private (Coach, Admin)
 */
router.get(
  '/',
  authorize(['COACH', 'ADMIN']),
  validateRequest({ query: athleteQuerySchema }),
  athleteController.getAllAthletes
);

/**
 * @route   GET /api/athletes/:id
 * @desc    Get athlete by ID
 * @access  Private
 */
router.get(
  '/:id',
  validateRequest({ params: commonSchemas.idParam }),
  athleteController.getAthleteById
);

/**
 * @route   PUT /api/athletes/:id
 * @desc    Update athlete profile
 * @access  Private (Coach, Admin, Self)
 */
router.put(
  '/:id',
  validateRequest({ params: commonSchemas.idParam }),
  athleteController.updateAthlete
);

/**
 * @route   GET /api/athletes/:id/summary
 * @desc    Get athlete summary with recent metrics
 * @access  Private
 */
router.get(
  '/:id/summary',
  validateRequest({ params: commonSchemas.idParam }),
  athleteController.getAthleteSummary
);

/**
 * @route   GET /api/athletes/:id/personal-bests
 * @desc    Get athlete personal bests
 * @access  Private
 */
router.get(
  '/:id/personal-bests',
  validateRequest({ params: commonSchemas.idParam }),
  athleteController.getPersonalBests
);

/**
 * @route   POST /api/athletes/:id/personal-bests
 * @desc    Add a personal best record
 * @access  Private (Coach, Admin)
 */
router.post(
  '/:id/personal-bests',
  authorize(['COACH', 'ADMIN']),
  validateRequest({ params: commonSchemas.idParam }),
  athleteController.addPersonalBest
);

/**
 * @route   GET /api/athletes/:id/goals
 * @desc    Get athlete goals
 * @access  Private
 */
router.get(
  '/:id/goals',
  validateRequest({ params: commonSchemas.idParam }),
  athleteController.getGoals
);

/**
 * @route   POST /api/athletes/:id/goals
 * @desc    Set athlete goal
 * @access  Private
 */
router.post(
  '/:id/goals',
  validateRequest({ params: commonSchemas.idParam }),
  athleteController.setGoal
);

export default router;
