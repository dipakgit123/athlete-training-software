/**
 * Exercise Completion Controller
 * Handle individual exercise tracking within workouts
 */

import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { NotFoundError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

/**
 * Log completion for multiple exercises in a workout
 */
export async function logExerciseCompletions(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { workoutLogId } = req.params;
    const { exercises } = req.body;

    // Verify workout log exists
    const workoutLog = await prisma.workoutLog.findUnique({
      where: { id: workoutLogId },
      include: { workout: true },
    });

    if (!workoutLog) {
      throw NotFoundError('Workout log');
    }

    // Create exercise completion logs
    const exerciseCompletions = await prisma.exerciseCompletionLog.createMany({
      data: exercises.map((exercise: any, index: number) => ({
        workoutLogId,
        athleteId: workoutLog.athleteId,
        exerciseName: exercise.exerciseName,
        exerciseCategory: exercise.exerciseCategory || 'STRENGTH',
        exerciseOrder: exercise.exerciseOrder || index + 1,
        plannedSets: exercise.plannedSets,
        plannedReps: exercise.plannedReps,
        plannedWeight: exercise.plannedWeight,
        plannedDistance: exercise.plannedDistance,
        plannedDuration: exercise.plannedDuration,
        plannedIntensity: exercise.plannedIntensity,
        plannedRecovery: exercise.plannedRecovery,
        completedSets: exercise.completedSets,
        completedReps: exercise.completedReps,
        completedWeight: exercise.completedWeight,
        completedDistance: exercise.completedDistance,
        completedDuration: exercise.completedDuration,
        completedIntensity: exercise.completedIntensity,
        actualRecovery: exercise.actualRecovery,
        completionPercent: calculateCompletionPercent(exercise),
        isFullyCompleted: exercise.isFullyCompleted || false,
        isPartiallyCompleted: exercise.isPartiallyCompleted || false,
        isSkipped: exercise.isSkipped || false,
        skipReason: exercise.skipReason,
        technicalQuality: exercise.technicalQuality,
        effortLevel: exercise.effortLevel,
        painLevel: exercise.painLevel,
        actualTimes: exercise.actualTimes,
        bestTime: exercise.bestTime,
        athleteNotes: exercise.athleteNotes,
      })),
    });

    // Calculate overall workout completion
    const totalExercises = exercises.length;
    const completedExercises = exercises.filter((e: any) => e.isFullyCompleted).length;
    const partialExercises = exercises.filter((e: any) => e.isPartiallyCompleted).length;
    const skippedExercises = exercises.filter((e: any) => e.isSkipped).length;

    const overallCompletionPercent = exercises.reduce((acc: number, e: any) => {
      return acc + (calculateCompletionPercent(e) || 0);
    }, 0) / totalExercises;

    // Update workout log with deviation info
    await prisma.workoutLog.update({
      where: { id: workoutLogId },
      data: {
        deviationPercent: 100 - overallCompletionPercent,
        deviationReason: overallCompletionPercent < 100
          ? `Completed ${completedExercises}/${totalExercises} exercises fully. ${partialExercises} partial, ${skippedExercises} skipped.`
          : null,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Exercise completions logged successfully',
      data: {
        count: exerciseCompletions.count,
        summary: {
          totalExercises,
          fullyCompleted: completedExercises,
          partiallyCompleted: partialExercises,
          skipped: skippedExercises,
          overallCompletionPercent: Math.round(overallCompletionPercent),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Log a single exercise completion
 */
export async function logSingleExercise(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { workoutLogId } = req.params;
    const exerciseData = req.body;

    // Verify workout log exists
    const workoutLog = await prisma.workoutLog.findUnique({
      where: { id: workoutLogId },
    });

    if (!workoutLog) {
      throw NotFoundError('Workout log');
    }

    // Get the next exercise order
    const lastExercise = await prisma.exerciseCompletionLog.findFirst({
      where: { workoutLogId },
      orderBy: { exerciseOrder: 'desc' },
    });

    const exerciseCompletion = await prisma.exerciseCompletionLog.create({
      data: {
        workoutLogId,
        athleteId: workoutLog.athleteId,
        exerciseName: exerciseData.exerciseName,
        exerciseCategory: exerciseData.exerciseCategory || 'STRENGTH',
        exerciseOrder: exerciseData.exerciseOrder || (lastExercise?.exerciseOrder || 0) + 1,
        plannedSets: exerciseData.plannedSets,
        plannedReps: exerciseData.plannedReps,
        plannedWeight: exerciseData.plannedWeight,
        plannedDistance: exerciseData.plannedDistance,
        plannedDuration: exerciseData.plannedDuration,
        plannedIntensity: exerciseData.plannedIntensity,
        plannedRecovery: exerciseData.plannedRecovery,
        completedSets: exerciseData.completedSets,
        completedReps: exerciseData.completedReps,
        completedWeight: exerciseData.completedWeight,
        completedDistance: exerciseData.completedDistance,
        completedDuration: exerciseData.completedDuration,
        completedIntensity: exerciseData.completedIntensity,
        actualRecovery: exerciseData.actualRecovery,
        completionPercent: calculateCompletionPercent(exerciseData),
        isFullyCompleted: exerciseData.isFullyCompleted || false,
        isPartiallyCompleted: exerciseData.isPartiallyCompleted || false,
        isSkipped: exerciseData.isSkipped || false,
        skipReason: exerciseData.skipReason,
        technicalQuality: exerciseData.technicalQuality,
        effortLevel: exerciseData.effortLevel,
        painLevel: exerciseData.painLevel,
        actualTimes: exerciseData.actualTimes,
        bestTime: exerciseData.bestTime,
        athleteNotes: exerciseData.athleteNotes,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Exercise completion logged',
      data: exerciseCompletion,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update an existing exercise completion log
 */
export async function updateExerciseCompletion(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existing = await prisma.exerciseCompletionLog.findUnique({
      where: { id },
    });

    if (!existing) {
      throw NotFoundError('Exercise completion log');
    }

    const updated = await prisma.exerciseCompletionLog.update({
      where: { id },
      data: {
        completedSets: updateData.completedSets,
        completedReps: updateData.completedReps,
        completedWeight: updateData.completedWeight,
        completedDistance: updateData.completedDistance,
        completedDuration: updateData.completedDuration,
        completedIntensity: updateData.completedIntensity,
        actualRecovery: updateData.actualRecovery,
        completionPercent: calculateCompletionPercent({
          ...existing,
          ...updateData,
        }),
        isFullyCompleted: updateData.isFullyCompleted ?? existing.isFullyCompleted,
        isPartiallyCompleted: updateData.isPartiallyCompleted ?? existing.isPartiallyCompleted,
        isSkipped: updateData.isSkipped ?? existing.isSkipped,
        skipReason: updateData.skipReason,
        technicalQuality: updateData.technicalQuality,
        effortLevel: updateData.effortLevel,
        painLevel: updateData.painLevel,
        actualTimes: updateData.actualTimes,
        bestTime: updateData.bestTime,
        athleteNotes: updateData.athleteNotes,
        coachFeedback: updateData.coachFeedback,
      },
    });

    res.json({
      success: true,
      message: 'Exercise completion updated',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all exercise completions for a workout log
 */
export async function getWorkoutExerciseCompletions(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { workoutLogId } = req.params;

    const exerciseCompletions = await prisma.exerciseCompletionLog.findMany({
      where: { workoutLogId },
      orderBy: { exerciseOrder: 'asc' },
    });

    // Calculate summary stats
    const totalExercises = exerciseCompletions.length;
    const fullyCompleted = exerciseCompletions.filter(e => e.isFullyCompleted).length;
    const partiallyCompleted = exerciseCompletions.filter(e => e.isPartiallyCompleted).length;
    const skipped = exerciseCompletions.filter(e => e.isSkipped).length;
    const avgCompletionPercent = totalExercises > 0
      ? exerciseCompletions.reduce((acc, e) => acc + (e.completionPercent || 0), 0) / totalExercises
      : 0;

    res.json({
      success: true,
      data: {
        exercises: exerciseCompletions,
        summary: {
          totalExercises,
          fullyCompleted,
          partiallyCompleted,
          skipped,
          avgCompletionPercent: Math.round(avgCompletionPercent),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get exercise completion history for an athlete
 */
export async function getAthleteExerciseHistory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId } = req.params;
    const { exerciseName, category, startDate, endDate, limit = 50 } = req.query;

    const where: any = { athleteId };

    if (exerciseName) {
      where.exerciseName = { contains: exerciseName as string, mode: 'insensitive' };
    }

    if (category) {
      where.exerciseCategory = category;
    }

    if (startDate || endDate) {
      where.loggedAt = {};
      if (startDate) where.loggedAt.gte = new Date(startDate as string);
      if (endDate) where.loggedAt.lte = new Date(endDate as string);
    }

    const exerciseHistory = await prisma.exerciseCompletionLog.findMany({
      where,
      orderBy: { loggedAt: 'desc' },
      take: Number(limit),
      include: {
        workoutLog: {
          include: {
            workout: {
              select: {
                workoutDate: true,
                workoutType: true,
                primaryFocus: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      data: exerciseHistory,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get exercise progression for a specific exercise
 */
export async function getExerciseProgression(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { athleteId, exerciseName } = req.params;
    const { weeks = 12 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(weeks) * 7);

    const progression = await prisma.exerciseCompletionLog.findMany({
      where: {
        athleteId,
        exerciseName: { equals: exerciseName, mode: 'insensitive' },
        loggedAt: { gte: startDate },
      },
      orderBy: { loggedAt: 'asc' },
      select: {
        loggedAt: true,
        plannedSets: true,
        plannedReps: true,
        plannedWeight: true,
        completedSets: true,
        completedReps: true,
        completedWeight: true,
        completionPercent: true,
        technicalQuality: true,
        effortLevel: true,
        bestTime: true,
      },
    });

    // Calculate progression stats
    const stats = {
      totalSessions: progression.length,
      avgCompletionPercent: progression.length > 0
        ? progression.reduce((acc, p) => acc + (p.completionPercent || 0), 0) / progression.length
        : 0,
      maxWeight: Math.max(...progression.map(p => p.completedWeight || 0)),
      latestWeight: progression[progression.length - 1]?.completedWeight || null,
      weightProgression: progression.filter(p => p.completedWeight).map(p => ({
        date: p.loggedAt,
        weight: p.completedWeight,
      })),
    };

    res.json({
      success: true,
      data: {
        exerciseName,
        progression,
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Helper function to calculate completion percentage
 */
function calculateCompletionPercent(exercise: any): number {
  if (exercise.isSkipped) return 0;
  if (exercise.isFullyCompleted) return 100;

  let completionFactors: number[] = [];

  // Check sets completion
  if (exercise.plannedSets && exercise.completedSets) {
    completionFactors.push((exercise.completedSets / exercise.plannedSets) * 100);
  }

  // Check reps completion
  if (exercise.plannedReps && exercise.completedReps) {
    completionFactors.push((exercise.completedReps / exercise.plannedReps) * 100);
  }

  // Check distance completion
  if (exercise.plannedDistance && exercise.completedDistance) {
    completionFactors.push((exercise.completedDistance / exercise.plannedDistance) * 100);
  }

  // Check duration completion
  if (exercise.plannedDuration && exercise.completedDuration) {
    completionFactors.push((exercise.completedDuration / exercise.plannedDuration) * 100);
  }

  // Check weight (might want to cap at 100% if athlete lifted more than planned)
  if (exercise.plannedWeight && exercise.completedWeight) {
    completionFactors.push(Math.min((exercise.completedWeight / exercise.plannedWeight) * 100, 100));
  }

  if (completionFactors.length === 0) {
    return exercise.isPartiallyCompleted ? 50 : 0;
  }

  // Average all completion factors
  const avgCompletion = completionFactors.reduce((a, b) => a + b, 0) / completionFactors.length;
  return Math.min(Math.round(avgCompletion), 100);
}
