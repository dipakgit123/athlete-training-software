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

// Validation schemas
const athleteQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  isActive: z.string().optional(),
  ...commonSchemas.pagination.shape,
});

const createAthleteSchema = z.object({
  // User data
  email: z.string().email(),
  password: z.string().min(6).optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  
  // Athlete basic info
  dateOfBirth: z.string().or(z.date()),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  nationality: z.string().optional(),
  height: z.number().or(z.string()).optional(),
  weight: z.number().or(z.string()).optional(),
  bodyFatPercentage: z.number().or(z.string()).optional(),
  armSpan: z.number().or(z.string()).optional(),
  legLength: z.number().or(z.string()).optional(),
  category: z.enum(['SUB_JUNIOR', 'JUNIOR', 'YOUTH', 'SENIOR', 'MASTERS']).default('YOUTH'),
  dominantLeg: z.enum(['LEFT', 'RIGHT', 'AMBIDEXTROUS']).optional(),
  dominantHand: z.enum(['LEFT', 'RIGHT', 'AMBIDEXTROUS']).optional(),
  trainingAge: z.number().or(z.string()).optional(),
  coachId: z.string().optional(),
  trainingGroupId: z.string().optional(),
  
  // Medical
  medicalClearance: z.boolean().optional(),
  antiDopingStatus: z.string().optional(),
  
  // Optional related data
  events: z.array(z.object({
    eventType: z.string(),
    eventCategory: z.string(),
    isPrimary: z.boolean().optional(),
  })).optional(),
  personalBests: z.array(z.any()).optional(),
  goals: z.array(z.any()).optional(),
  documents: z.array(z.any()).optional(),
});

// Routes - All public for now (authentication disabled)
/**
 * @route   GET /api/athletes
 * @desc    Get all athletes (with pagination and filters)
 * @access  Public
 */
router.get(
  '/',
  validateRequest({ query: athleteQuerySchema }),
  athleteController.getAllAthletes
);

/**
 * @route   POST /api/athletes
 * @desc    Create new athlete
 * @access  Public (temporarily)
 */
router.post(
  '/',
  validateRequest({ body: createAthleteSchema }),
  athleteController.createAthlete
);

/**
 * @route   GET /api/athletes/:id
 * @desc    Get athlete by ID
 * @access  Public
 */
router.get(
  '/:id',
  validateRequest({ params: commonSchemas.idParam }),
  athleteController.getAthleteById
);

/**
 * @route   PUT /api/athletes/:id
 * @desc    Update athlete profile
 * @access  Public (temporarily)
 */
router.put(
  '/:id',
  validateRequest({ params: commonSchemas.idParam }),
  athleteController.updateAthlete
);

/**
 * @route   GET /api/athletes/:id/summary
 * @desc    Get athlete summary with recent metrics
 * @access  Public
 */
router.get(
  '/:id/summary',
  validateRequest({ params: commonSchemas.idParam }),
  athleteController.getAthleteSummary
);

/**
 * @route   GET /api/athletes/:id/personal-bests
 * @desc    Get athlete personal bests
 * @access  Public
 */
router.get(
  '/:id/personal-bests',
  validateRequest({ params: commonSchemas.idParam }),
  athleteController.getPersonalBests
);

/**
 * @route   POST /api/athletes/:id/personal-bests
 * @desc    Add a personal best record
 * @access  Public (temporarily)
 */
router.post(
  '/:id/personal-bests',
  validateRequest({ params: commonSchemas.idParam }),
  athleteController.addPersonalBest
);

/**
 * @route   GET /api/athletes/:id/goals
 * @desc    Get athlete goals
 * @access  Public
 */
router.get(
  '/:id/goals',
  validateRequest({ params: commonSchemas.idParam }),
  athleteController.getGoals
);

/**
 * @route   POST /api/athletes/:id/goals
 * @desc    Set athlete goal
 * @access  Public (temporarily)
 */
router.post(
  '/:id/goals',
  validateRequest({ params: commonSchemas.idParam }),
  athleteController.setGoal
);

export default router;
