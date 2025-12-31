/**
 * Wellness Routes
 * Daily wellness check-ins and readiness tracking
 */

import { Router } from 'express';
import { z } from 'zod';
import { validate, validateRequest, commonSchemas } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import * as wellnessController from '../controllers/wellness.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Validation schemas - using correct WellnessLog field names
const wellnessCheckSchema = z.object({
  athleteId: z.string().uuid(),
  logDate: z.coerce.date().optional(),
  sleepDuration: z.number().min(0).max(14).optional(),
  sleepQuality: z.number().min(1).max(10).optional(),
  sleepTime: z.coerce.date().optional(),
  wakeTime: z.coerce.date().optional(),
  sleepInterruptions: z.number().optional(),
  restingHR: z.number().min(30).max(120).optional(),
  hrv: z.number().min(10).max(200).optional(),
  bodyWeight: z.number().optional(),
  bodyTemperature: z.number().optional(),
  hydrationStatus: z.number().min(1).max(10).optional(),
  appetite: z.number().min(1).max(10).optional(),
  energy: z.number().min(1).max(10).optional(),
  fatigue: z.number().min(1).max(10).optional(),
  stress: z.number().min(1).max(10).optional(),
  mood: z.number().min(1).max(10).optional(),
  motivation: z.number().min(1).max(10).optional(),
  confidence: z.number().min(1).max(10).optional(),
  muscleSoreness: z.number().min(1).max(10).optional(),
  perceivedRecovery: z.number().min(1).max(10).optional(),
  painPresent: z.boolean().optional(),
  painLocation: z.string().optional(),
  painLevel: z.number().min(1).max(10).optional(),
  travelFatigue: z.boolean().optional(),
  academicStress: z.boolean().optional(),
  personalStress: z.boolean().optional(),
  notes: z.string().optional(),
});

const wellnessQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  days: z.coerce.number().optional(),
  ...commonSchemas.pagination.shape,
});

// Routes
/**
 * @route   POST /api/wellness
 * @desc    Submit wellness check-in
 * @access  Private
 */
router.post(
  '/',
  validate(wellnessCheckSchema),
  wellnessController.submitWellnessCheck
);

/**
 * @route   GET /api/wellness/athlete/:athleteId
 * @desc    Get wellness history for an athlete
 * @access  Private
 */
router.get(
  '/athlete/:athleteId',
  validateRequest({
    params: commonSchemas.athleteIdParam,
    query: wellnessQuerySchema,
  }),
  wellnessController.getWellnessHistory
);

/**
 * @route   GET /api/wellness/athlete/:athleteId/today
 * @desc    Get today's wellness check for an athlete
 * @access  Private
 */
router.get(
  '/athlete/:athleteId/today',
  validateRequest({ params: commonSchemas.athleteIdParam }),
  wellnessController.getTodayWellness
);

/**
 * @route   GET /api/wellness/athlete/:athleteId/readiness
 * @desc    Calculate current readiness score
 * @access  Private
 */
router.get(
  '/athlete/:athleteId/readiness',
  validateRequest({ params: commonSchemas.athleteIdParam }),
  wellnessController.getReadinessScore
);

/**
 * @route   GET /api/wellness/athlete/:athleteId/trends
 * @desc    Get wellness trends over time
 * @access  Private
 */
router.get(
  '/athlete/:athleteId/trends',
  validateRequest({
    params: commonSchemas.athleteIdParam,
    query: wellnessQuerySchema,
  }),
  wellnessController.getWellnessTrends
);

/**
 * @route   PUT /api/wellness/:id
 * @desc    Update a wellness check-in
 * @access  Private
 */
router.put(
  '/:id',
  validateRequest({ params: commonSchemas.idParam }),
  wellnessController.updateWellnessCheck
);

/**
 * @route   DELETE /api/wellness/:id
 * @desc    Delete a wellness check-in
 * @access  Private
 */
router.delete(
  '/:id',
  validateRequest({ params: commonSchemas.idParam }),
  wellnessController.deleteWellnessCheck
);

export default router;
