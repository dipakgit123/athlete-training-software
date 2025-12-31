/**
 * TESTING ROUTES
 * World-Class Athletics Performance System
 *
 * API routes for test entry and retrieval
 */

import { Router } from 'express';
import {
  createTestResult,
  getAthleteTestResults,
  getTestHistory,
  getTestsByCategory,
  updateTestResult,
  deleteTestResult,
  getPerformanceSummary,
  compareWithBenchmarks
} from '../controllers/testing.controller';

const router = Router();

// ============================================
// TEST RESULT ROUTES
// ============================================

/**
 * POST /api/tests
 * Create a new test result
 *
 * Body:
 * - athleteId: string
 * - testType: string (e.g., 'SPRINT_10M', 'CMJ')
 * - testDate: string (ISO date)
 * - value: number
 * - unit: string
 * - secondaryValue?: number (for bilateral tests)
 * - conditions?: string
 * - equipment?: string
 * - notes?: string
 * - videoUrl?: string
 * - testedBy?: string
 */
router.post('/', createTestResult);

/**
 * GET /api/tests/athlete/:athleteId
 * Get all test results for an athlete
 *
 * Query params:
 * - testType?: string (filter by test type)
 * - startDate?: string (ISO date)
 * - endDate?: string (ISO date)
 * - limit?: number (default 50)
 */
router.get('/athlete/:athleteId', getAthleteTestResults);

/**
 * GET /api/tests/athlete/:athleteId/history/:testType
 * Get test history for plotting
 *
 * Query params:
 * - months?: number (default 6)
 */
router.get('/athlete/:athleteId/history/:testType', getTestHistory);

/**
 * GET /api/tests/athlete/:athleteId/categories
 * Get all tests grouped by category for an athlete
 */
router.get('/athlete/:athleteId/categories', getTestsByCategory);

/**
 * GET /api/tests/athlete/:athleteId/summary
 * Get performance summary for athlete
 */
router.get('/athlete/:athleteId/summary', getPerformanceSummary);

/**
 * GET /api/tests/athlete/:athleteId/benchmarks
 * Compare athlete's tests with benchmarks
 */
router.get('/athlete/:athleteId/benchmarks', compareWithBenchmarks);

/**
 * PUT /api/tests/:id
 * Update a test result
 */
router.put('/:id', updateTestResult);

/**
 * DELETE /api/tests/:id
 * Delete a test result
 */
router.delete('/:id', deleteTestResult);

export default router;
