/**
 * Report Routes
 * Generate reports and export data
 */

import { Router } from 'express';
import { z } from 'zod';
import { validateRequest, commonSchemas } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import * as reportController from '../controllers/report.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Validation schemas
const reportQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  days: z.coerce.number().optional(),
});

// Routes

// ==================== Athlete Reports ====================

/**
 * @route   GET /api/reports/athlete/:athleteId/overview
 * @desc    Get athlete overview report
 * @access  Private
 */
router.get(
  '/athlete/:athleteId/overview',
  validateRequest({
    params: commonSchemas.athleteIdParam,
    query: reportQuerySchema,
  }),
  reportController.getAthleteOverview
);

/**
 * @route   GET /api/reports/athlete/:athleteId/weekly
 * @desc    Get weekly training report
 * @access  Private
 */
router.get(
  '/athlete/:athleteId/weekly',
  validateRequest({
    params: commonSchemas.athleteIdParam,
  }),
  reportController.getWeeklySummary
);

/**
 * @route   GET /api/reports/athlete/:athleteId/load
 * @desc    Get load monitoring report
 * @access  Private
 */
router.get(
  '/athlete/:athleteId/load',
  validateRequest({
    params: commonSchemas.athleteIdParam,
    query: reportQuerySchema,
  }),
  reportController.getLoadReport
);

/**
 * @route   GET /api/reports/athlete/:athleteId/wellness
 * @desc    Get wellness trends report
 * @access  Private
 */
router.get(
  '/athlete/:athleteId/wellness',
  validateRequest({
    params: commonSchemas.athleteIdParam,
    query: reportQuerySchema,
  }),
  reportController.getWellnessReport
);

/**
 * @route   GET /api/reports/athlete/:athleteId/competitions
 * @desc    Get competition report
 * @access  Private
 */
router.get(
  '/athlete/:athleteId/competitions',
  validateRequest({
    params: commonSchemas.athleteIdParam,
    query: z.object({
      year: z.coerce.number().optional(),
    }),
  }),
  reportController.getCompetitionReport
);

export default router;
