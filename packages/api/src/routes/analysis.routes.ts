/**
 * Analysis Routes
 * Blood analysis, load monitoring, biomechanics
 */

import { Router } from 'express';
import { validateRequest, commonSchemas } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import * as analysisController from '../controllers/analysis.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// ==================== Blood Analysis ====================

/**
 * @route   GET /api/analysis/blood/athlete/:athleteId
 * @desc    Get blood test history
 * @access  Private
 */
router.get(
  '/blood/athlete/:athleteId',
  validateRequest({ params: commonSchemas.athleteIdParam }),
  analysisController.getBloodHistory
);

/**
 * @route   GET /api/analysis/blood/:id
 * @desc    Get blood test by ID
 * @access  Private
 */
router.get(
  '/blood/:id',
  validateRequest({ params: commonSchemas.idParam }),
  analysisController.getBloodTest
);

// ==================== Load Monitoring ====================

/**
 * @route   GET /api/analysis/load/athlete/:athleteId
 * @desc    Get load history
 * @access  Private
 */
router.get(
  '/load/athlete/:athleteId',
  validateRequest({
    params: commonSchemas.athleteIdParam,
  }),
  analysisController.getLoadHistory
);

/**
 * @route   GET /api/analysis/load/athlete/:athleteId/acwr
 * @desc    Calculate ACWR and load metrics
 * @access  Private
 */
router.get(
  '/load/athlete/:athleteId/acwr',
  validateRequest({ params: commonSchemas.athleteIdParam }),
  analysisController.getACWR
);

/**
 * @route   GET /api/analysis/load/athlete/:athleteId/trends
 * @desc    Get load trends
 * @access  Private
 */
router.get(
  '/load/athlete/:athleteId/trends',
  validateRequest({ params: commonSchemas.athleteIdParam }),
  analysisController.getLoadTrends
);

// ==================== Biomechanics ====================

/**
 * @route   GET /api/analysis/biomech/athlete/:athleteId
 * @desc    Get biomechanics history
 * @access  Private
 */
router.get(
  '/biomech/athlete/:athleteId',
  validateRequest({ params: commonSchemas.athleteIdParam }),
  analysisController.getBiomechHistory
);

/**
 * @route   GET /api/analysis/biomech/:id
 * @desc    Get biomech analysis by ID
 * @access  Private
 */
router.get(
  '/biomech/:id',
  validateRequest({ params: commonSchemas.idParam }),
  analysisController.getBiomechAnalysis
);

export default router;
