/**
 * Training Session Routes
 * Session planning, execution, and tracking
 */

import { Router } from 'express';
import { z } from 'zod';
import { validate, validateRequest, commonSchemas } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import * as sessionController from '../controllers/session.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Validation schemas
const createSessionSchema = z.object({
  athleteId: z.string().uuid(),
  date: z.coerce.date().optional(),
  workoutDate: z.coerce.date().optional(),
  type: z.enum(['TRACK', 'STRENGTH', 'RECOVERY', 'CONDITIONING', 'PLYOMETRIC', 'MOBILITY']).optional(),
  workoutType: z.enum(['TRACK', 'STRENGTH', 'RECOVERY', 'CONDITIONING', 'PLYOMETRIC', 'MOBILITY']).optional(),
  primaryFocus: z.string().optional(),
  secondaryFocus: z.string().optional(),
  plannedDuration: z.number().positive().optional(),
  plannedLoad: z.number().positive().optional(),
  plannedRPE: z.number().min(1).max(10).optional(),
  location: z.string().optional(),
});

const updateSessionSchema = z.object({
  workoutType: z.enum(['TRACK', 'STRENGTH', 'RECOVERY', 'CONDITIONING', 'PLYOMETRIC', 'MOBILITY']).optional(),
  primaryFocus: z.string().optional(),
  secondaryFocus: z.string().optional(),
  plannedDuration: z.number().positive().optional(),
  plannedLoad: z.number().positive().optional(),
  plannedRPE: z.number().min(1).max(10).optional(),
  location: z.string().optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
});

const sessionQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  type: z.enum(['TRACK', 'STRENGTH', 'RECOVERY', 'CONDITIONING', 'PLYOMETRIC', 'MOBILITY']).optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  ...commonSchemas.pagination.shape,
});

const completeSessionSchema = z.object({
  actualDuration: z.number().positive().optional(),
  actualLoad: z.number().positive().optional(),
  rpe: z.number().min(1).max(10).optional(),
  feedback: z.string().optional(),
  energyLevel: z.number().min(1).max(10).optional(),
  technicalFeel: z.number().min(1).max(10).optional(),
});

// Routes
/**
 * @route   POST /api/sessions
 * @desc    Create a new training session
 * @access  Private (Coach)
 */
router.post(
  '/',
  authorize(['COACH', 'ADMIN']),
  validate(createSessionSchema),
  sessionController.createSession
);

/**
 * @route   GET /api/sessions/athlete/:athleteId
 * @desc    Get sessions for an athlete
 * @access  Private
 */
router.get(
  '/athlete/:athleteId',
  validateRequest({
    params: commonSchemas.athleteIdParam,
    query: sessionQuerySchema,
  }),
  sessionController.getAthleteSessions
);

/**
 * @route   GET /api/sessions/athlete/:athleteId/today
 * @desc    Get today's session for an athlete
 * @access  Private
 */
router.get(
  '/athlete/:athleteId/today',
  validateRequest({ params: commonSchemas.athleteIdParam }),
  sessionController.getTodaySession
);

/**
 * @route   GET /api/sessions/athlete/:athleteId/week
 * @desc    Get this week's sessions for an athlete
 * @access  Private
 */
router.get(
  '/athlete/:athleteId/week',
  validateRequest({ params: commonSchemas.athleteIdParam }),
  sessionController.getWeekSessions
);

/**
 * @route   GET /api/sessions/:id
 * @desc    Get session by ID
 * @access  Private
 */
router.get(
  '/:id',
  validateRequest({ params: commonSchemas.idParam }),
  sessionController.getSessionById
);

/**
 * @route   PUT /api/sessions/:id
 * @desc    Update session
 * @access  Private (Coach)
 */
router.put(
  '/:id',
  authorize(['COACH', 'ADMIN']),
  validateRequest({ params: commonSchemas.idParam }),
  validate(updateSessionSchema),
  sessionController.updateSession
);

/**
 * @route   POST /api/sessions/:id/start
 * @desc    Start a session
 * @access  Private
 */
router.post(
  '/:id/start',
  validateRequest({ params: commonSchemas.idParam }),
  sessionController.startSession
);

/**
 * @route   POST /api/sessions/:id/complete
 * @desc    Complete a session
 * @access  Private
 */
router.post(
  '/:id/complete',
  validateRequest({ params: commonSchemas.idParam }),
  validate(completeSessionSchema),
  sessionController.completeSession
);

/**
 * @route   DELETE /api/sessions/:id
 * @desc    Delete session
 * @access  Private (Coach)
 */
router.delete(
  '/:id',
  authorize(['COACH', 'ADMIN']),
  validateRequest({ params: commonSchemas.idParam }),
  sessionController.deleteSession
);

export default router;
