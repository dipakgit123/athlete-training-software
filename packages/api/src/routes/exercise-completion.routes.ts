/**
 * Exercise Completion Routes
 * Track individual exercise completion within workouts
 */

import { Router } from 'express';
import { z } from 'zod';
import { validate, validateRequest, commonSchemas } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import * as exerciseCompletionController from '../controllers/exercise-completion.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Validation schemas
const exerciseSchema = z.object({
  exerciseName: z.string().min(1),
  exerciseCategory: z.enum(['TRACK', 'STRENGTH', 'PLYO', 'CORE', 'WARMUP', 'COOLDOWN']).optional(),
  exerciseOrder: z.number().int().positive().optional(),

  // Planned values
  plannedSets: z.number().int().positive().optional(),
  plannedReps: z.number().int().positive().optional(),
  plannedWeight: z.number().positive().optional(),
  plannedDistance: z.number().positive().optional(),
  plannedDuration: z.number().int().positive().optional(),
  plannedIntensity: z.string().optional(),
  plannedRecovery: z.number().int().positive().optional(),

  // Completed values
  completedSets: z.number().int().min(0).optional(),
  completedReps: z.number().int().min(0).optional(),
  completedWeight: z.number().min(0).optional(),
  completedDistance: z.number().min(0).optional(),
  completedDuration: z.number().int().min(0).optional(),
  completedIntensity: z.string().optional(),
  actualRecovery: z.number().int().min(0).optional(),

  // Completion status
  isFullyCompleted: z.boolean().optional(),
  isPartiallyCompleted: z.boolean().optional(),
  isSkipped: z.boolean().optional(),
  skipReason: z.string().optional(),

  // Quality metrics
  technicalQuality: z.number().int().min(1).max(10).optional(),
  effortLevel: z.number().int().min(1).max(10).optional(),
  painLevel: z.number().int().min(0).max(10).optional(),

  // Timing data
  actualTimes: z.array(z.number()).optional(),
  bestTime: z.number().optional(),

  // Notes
  athleteNotes: z.string().optional(),
});

const bulkExercisesSchema = z.object({
  exercises: z.array(exerciseSchema).min(1),
});

const updateExerciseSchema = z.object({
  completedSets: z.number().int().min(0).optional(),
  completedReps: z.number().int().min(0).optional(),
  completedWeight: z.number().min(0).optional(),
  completedDistance: z.number().min(0).optional(),
  completedDuration: z.number().int().min(0).optional(),
  completedIntensity: z.string().optional(),
  actualRecovery: z.number().int().min(0).optional(),

  isFullyCompleted: z.boolean().optional(),
  isPartiallyCompleted: z.boolean().optional(),
  isSkipped: z.boolean().optional(),
  skipReason: z.string().optional(),

  technicalQuality: z.number().int().min(1).max(10).optional(),
  effortLevel: z.number().int().min(1).max(10).optional(),
  painLevel: z.number().int().min(0).max(10).optional(),

  actualTimes: z.array(z.number()).optional(),
  bestTime: z.number().optional(),

  athleteNotes: z.string().optional(),
  coachFeedback: z.string().optional(),
});

const historyQuerySchema = z.object({
  exerciseName: z.string().optional(),
  category: z.enum(['TRACK', 'STRENGTH', 'PLYO', 'CORE', 'WARMUP', 'COOLDOWN']).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

// Routes

/**
 * @route   POST /api/exercise-completion/workout-log/:workoutLogId/bulk
 * @desc    Log multiple exercise completions for a workout
 * @access  Private (Athlete)
 */
router.post(
  '/workout-log/:workoutLogId/bulk',
  validate(bulkExercisesSchema),
  exerciseCompletionController.logExerciseCompletions
);

/**
 * @route   POST /api/exercise-completion/workout-log/:workoutLogId
 * @desc    Log a single exercise completion
 * @access  Private (Athlete)
 */
router.post(
  '/workout-log/:workoutLogId',
  validate(exerciseSchema),
  exerciseCompletionController.logSingleExercise
);

/**
 * @route   GET /api/exercise-completion/workout-log/:workoutLogId
 * @desc    Get all exercise completions for a workout log
 * @access  Private
 */
router.get(
  '/workout-log/:workoutLogId',
  exerciseCompletionController.getWorkoutExerciseCompletions
);

/**
 * @route   PUT /api/exercise-completion/:id
 * @desc    Update an exercise completion
 * @access  Private
 */
router.put(
  '/:id',
  validate(updateExerciseSchema),
  exerciseCompletionController.updateExerciseCompletion
);

/**
 * @route   GET /api/exercise-completion/athlete/:athleteId/history
 * @desc    Get exercise completion history for an athlete
 * @access  Private
 */
router.get(
  '/athlete/:athleteId/history',
  validateRequest({
    params: commonSchemas.athleteIdParam,
    query: historyQuerySchema,
  }),
  exerciseCompletionController.getAthleteExerciseHistory
);

/**
 * @route   GET /api/exercise-completion/athlete/:athleteId/progression/:exerciseName
 * @desc    Get progression data for a specific exercise
 * @access  Private
 */
router.get(
  '/athlete/:athleteId/progression/:exerciseName',
  validateRequest({
    params: z.object({
      athleteId: z.string(),
      exerciseName: z.string(),
    }),
    query: z.object({
      weeks: z.coerce.number().int().positive().max(52).optional(),
    }),
  }),
  exerciseCompletionController.getExerciseProgression
);

export default router;
