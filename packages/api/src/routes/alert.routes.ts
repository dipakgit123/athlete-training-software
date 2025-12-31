/**
 * Alert Routes
 * System alerts and notifications
 */

import { Router } from 'express';
import { z } from 'zod';
import { validate, validateRequest, commonSchemas } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import * as alertController from '../controllers/alert.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Validation schemas
const alertQuerySchema = z.object({
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  category: z.enum(['LOAD', 'RECOVERY', 'BLOOD', 'INJURY', 'WELLNESS', 'PERFORMANCE']).optional(),
  status: z.enum(['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED']).optional(),
  ...commonSchemas.pagination.shape,
});

const createAlertSchema = z.object({
  athleteId: z.string().uuid(),
  title: z.string().min(2),
  message: z.string(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  category: z.enum(['LOAD', 'RECOVERY', 'BLOOD', 'INJURY', 'WELLNESS', 'PERFORMANCE']),
  data: z.record(z.any()).optional(),
  actions: z.array(z.object({
    label: z.string(),
    action: z.string(),
  })).optional(),
});

// Routes
/**
 * @route   GET /api/alerts
 * @desc    Get all alerts for current user's athletes
 * @access  Private
 */
router.get(
  '/',
  validateRequest({ query: alertQuerySchema }),
  alertController.getAlerts
);

/**
 * @route   GET /api/alerts/athlete/:athleteId
 * @desc    Get alerts for specific athlete
 * @access  Private
 */
router.get(
  '/athlete/:athleteId',
  validateRequest({
    params: commonSchemas.athleteIdParam,
    query: alertQuerySchema,
  }),
  alertController.getAthleteAlerts
);

/**
 * @route   GET /api/alerts/summary
 * @desc    Get alert summary/counts
 * @access  Private
 */
router.get(
  '/summary',
  alertController.getAlertSummary
);

/**
 * @route   POST /api/alerts
 * @desc    Create a new alert
 * @access  Private (System/Coach)
 */
router.post(
  '/',
  authorize(['COACH', 'ADMIN']),
  validate(createAlertSchema),
  alertController.createAlert
);

/**
 * @route   GET /api/alerts/:id
 * @desc    Get alert by ID
 * @access  Private
 */
router.get(
  '/:id',
  validateRequest({ params: commonSchemas.idParam }),
  alertController.getAlertById
);

/**
 * @route   POST /api/alerts/:id/acknowledge
 * @desc    Acknowledge an alert
 * @access  Private
 */
router.post(
  '/:id/acknowledge',
  validateRequest({ params: commonSchemas.idParam }),
  alertController.acknowledgeAlert
);

/**
 * @route   DELETE /api/alerts/:id
 * @desc    Delete an alert
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  authorize(['ADMIN']),
  validateRequest({ params: commonSchemas.idParam }),
  alertController.deleteAlert
);

/**
 * @route   POST /api/alerts/batch/acknowledge
 * @desc    Acknowledge multiple alerts
 * @access  Private
 */
router.post(
  '/batch/acknowledge',
  alertController.batchAcknowledge
);

export default router;
