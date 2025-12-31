/**
 * Auto-Adjustment Rules Engine
 * AI-Driven Training Auto-Adjustment System
 * Elite Athletics Performance System
 */

import { ReadinessResult } from './readiness-rules';

// ==================== ADJUSTMENT FACTORS ====================

export interface AdjustmentFactors {
  intensityMultiplier: number;      // 0.0-1.2 (can exceed 1.0 for peak days)
  volumeMultiplier: number;         // 0.0-1.2
  complexityMultiplier: number;     // 0.0-1.0 (reduce complexity when fatigued)
  restPeriodMultiplier: number;     // 0.8-2.0 (increase rest when needed)
  warmupDurationMultiplier: number; // 1.0-1.5 (extend warmup when needed)
}

// ==================== TRAINING PHASE MODIFIERS ====================

export type TrainingPhase =
  | 'GPP'           // General Preparation
  | 'SPP'           // Specific Preparation
  | 'PRE_COMP'      // Pre-Competition
  | 'COMPETITION'   // Competition
  | 'PEAK'          // Peaking/Taper
  | 'TRANSITION';   // Recovery/Transition

export const PHASE_TOLERANCE: Record<TrainingPhase, {
  minReadinessForFullTraining: number;
  allowableIntensityReduction: number;
  volumeFlexibility: number;
  prioritizeQuality: boolean;
}> = {
  GPP: {
    minReadinessForFullTraining: 55,
    allowableIntensityReduction: 0.25,   // Can reduce up to 25%
    volumeFlexibility: 0.30,              // Volume is flexible in GPP
    prioritizeQuality: false              // Volume building phase
  },
  SPP: {
    minReadinessForFullTraining: 60,
    allowableIntensityReduction: 0.20,
    volumeFlexibility: 0.25,
    prioritizeQuality: true               // Quality starts mattering
  },
  PRE_COMP: {
    minReadinessForFullTraining: 65,
    allowableIntensityReduction: 0.15,
    volumeFlexibility: 0.20,
    prioritizeQuality: true
  },
  COMPETITION: {
    minReadinessForFullTraining: 70,
    allowableIntensityReduction: 0.10,
    volumeFlexibility: 0.15,
    prioritizeQuality: true               // Quality paramount
  },
  PEAK: {
    minReadinessForFullTraining: 75,
    allowableIntensityReduction: 0.10,
    volumeFlexibility: 0.10,
    prioritizeQuality: true               // Must be fresh
  },
  TRANSITION: {
    minReadinessForFullTraining: 40,
    allowableIntensityReduction: 0.40,
    volumeFlexibility: 0.50,
    prioritizeQuality: false              // Recovery focus
  }
};

// ==================== WORKOUT TYPE DEFINITIONS ====================

export type WorkoutType =
  | 'SPEED'           // Max velocity work
  | 'SPEED_ENDURANCE' // Speed endurance / special endurance
  | 'TEMPO'           // Tempo / extensive tempo
  | 'THRESHOLD'       // Lactate threshold
  | 'LONG_RUN'        // Aerobic base building
  | 'INTERVAL'        // VO2max intervals
  | 'STRENGTH_MAX'    // Maximum strength
  | 'STRENGTH_POWER'  // Power / explosive strength
  | 'STRENGTH_ENDURANCE' // Strength endurance
  | 'PLYOMETRICS'     // Plyometric training
  | 'TECHNICAL'       // Technical/skill work
  | 'RECOVERY'        // Active recovery
  | 'COMPETITION';    // Competition day

export interface WorkoutTypeRequirements {
  minReadiness: number;
  cnsLoad: 'high' | 'medium' | 'low';
  metabolicLoad: 'high' | 'medium' | 'low';
  mechanicalLoad: 'high' | 'medium' | 'low';
  flexibleElements: string[];
  rigidElements: string[];
  alternativeIfLowReadiness: WorkoutType;
}

export const WORKOUT_REQUIREMENTS: Record<WorkoutType, WorkoutTypeRequirements> = {
  SPEED: {
    minReadiness: 80,
    cnsLoad: 'high',
    metabolicLoad: 'low',
    mechanicalLoad: 'high',
    flexibleElements: ['volume', 'number of reps'],
    rigidElements: ['intensity must be 95-100%', 'full recovery between reps'],
    alternativeIfLowReadiness: 'TEMPO'
  },
  SPEED_ENDURANCE: {
    minReadiness: 75,
    cnsLoad: 'high',
    metabolicLoad: 'high',
    mechanicalLoad: 'medium',
    flexibleElements: ['number of sets', 'recovery time'],
    rigidElements: ['intensity 90-95%'],
    alternativeIfLowReadiness: 'TEMPO'
  },
  TEMPO: {
    minReadiness: 50,
    cnsLoad: 'low',
    metabolicLoad: 'medium',
    mechanicalLoad: 'low',
    flexibleElements: ['volume', 'intensity (60-75%)'],
    rigidElements: ['maintain rhythm'],
    alternativeIfLowReadiness: 'RECOVERY'
  },
  THRESHOLD: {
    minReadiness: 65,
    cnsLoad: 'medium',
    metabolicLoad: 'high',
    mechanicalLoad: 'low',
    flexibleElements: ['volume', 'interval length'],
    rigidElements: ['intensity at threshold'],
    alternativeIfLowReadiness: 'TEMPO'
  },
  LONG_RUN: {
    minReadiness: 55,
    cnsLoad: 'low',
    metabolicLoad: 'medium',
    mechanicalLoad: 'medium',
    flexibleElements: ['duration', 'pace'],
    rigidElements: ['maintain aerobic zone'],
    alternativeIfLowReadiness: 'RECOVERY'
  },
  INTERVAL: {
    minReadiness: 70,
    cnsLoad: 'medium',
    metabolicLoad: 'high',
    mechanicalLoad: 'medium',
    flexibleElements: ['number of intervals', 'recovery duration'],
    rigidElements: ['interval intensity'],
    alternativeIfLowReadiness: 'TEMPO'
  },
  STRENGTH_MAX: {
    minReadiness: 80,
    cnsLoad: 'high',
    metabolicLoad: 'low',
    mechanicalLoad: 'high',
    flexibleElements: ['number of sets', 'assistance exercises'],
    rigidElements: ['intensity 85-100% 1RM'],
    alternativeIfLowReadiness: 'STRENGTH_ENDURANCE'
  },
  STRENGTH_POWER: {
    minReadiness: 75,
    cnsLoad: 'high',
    metabolicLoad: 'low',
    mechanicalLoad: 'high',
    flexibleElements: ['number of sets'],
    rigidElements: ['velocity intent maximal', 'weight 40-70% 1RM'],
    alternativeIfLowReadiness: 'STRENGTH_ENDURANCE'
  },
  STRENGTH_ENDURANCE: {
    minReadiness: 55,
    cnsLoad: 'low',
    metabolicLoad: 'medium',
    mechanicalLoad: 'medium',
    flexibleElements: ['volume', 'exercise selection'],
    rigidElements: ['weight 40-60% 1RM'],
    alternativeIfLowReadiness: 'RECOVERY'
  },
  PLYOMETRICS: {
    minReadiness: 80,
    cnsLoad: 'high',
    metabolicLoad: 'low',
    mechanicalLoad: 'high',
    flexibleElements: ['volume (contacts)', 'exercise complexity'],
    rigidElements: ['quality of each contact', 'full recovery'],
    alternativeIfLowReadiness: 'TECHNICAL'
  },
  TECHNICAL: {
    minReadiness: 50,
    cnsLoad: 'low',
    metabolicLoad: 'low',
    mechanicalLoad: 'low',
    flexibleElements: ['volume', 'complexity level'],
    rigidElements: ['focus on form'],
    alternativeIfLowReadiness: 'RECOVERY'
  },
  RECOVERY: {
    minReadiness: 20,
    cnsLoad: 'low',
    metabolicLoad: 'low',
    mechanicalLoad: 'low',
    flexibleElements: ['all elements flexible'],
    rigidElements: ['keep heart rate low'],
    alternativeIfLowReadiness: 'RECOVERY' // Stay as recovery
  },
  COMPETITION: {
    minReadiness: 75,
    cnsLoad: 'high',
    metabolicLoad: 'high',
    mechanicalLoad: 'high',
    flexibleElements: ['none - competition day'],
    rigidElements: ['execute race plan'],
    alternativeIfLowReadiness: 'TECHNICAL' // Scratch if very low
  }
};

// ==================== MAIN ADJUSTMENT ENGINE ====================

export interface PlannedWorkout {
  type: WorkoutType;
  plannedIntensity: number;        // 0-100%
  plannedVolume: number;           // Arbitrary units or specific metrics
  plannedDuration: number;         // Minutes
  exercises: PlannedExercise[];
  phase: TrainingPhase;
  daysToCompetition?: number;
}

export interface PlannedExercise {
  name: string;
  sets?: number;
  reps?: number | string;
  intensity?: number;              // % of max or target
  distance?: number;               // Meters
  duration?: number;               // Seconds/minutes
  recovery?: number;               // Seconds between sets
  notes?: string;
}

export interface AdjustedWorkout {
  originalType: WorkoutType;
  adjustedType: WorkoutType;
  wasTypeChanged: boolean;
  adjustmentFactors: AdjustmentFactors;
  adjustedIntensity: number;
  adjustedVolume: number;
  adjustedDuration: number;
  exercises: AdjustedExercise[];
  warnings: string[];
  rationale: string[];
  additionalRecommendations: string[];
}

export interface AdjustedExercise extends PlannedExercise {
  originalSets?: number;
  originalReps?: number | string;
  originalIntensity?: number;
  originalRecovery?: number;
  adjustmentNotes: string[];
}

/**
 * Main auto-adjustment function
 */
export function autoAdjustWorkout(
  planned: PlannedWorkout,
  readiness: ReadinessResult,
  athletePreferences?: AthletePreferences
): AdjustedWorkout {
  const phaseConfig = PHASE_TOLERANCE[planned.phase];
  const workoutReqs = WORKOUT_REQUIREMENTS[planned.type];

  const warnings: string[] = [];
  const rationale: string[] = [];
  const additionalRecommendations: string[] = [];

  // Step 1: Check if workout type needs to change
  let adjustedType = planned.type;
  let wasTypeChanged = false;

  if (readiness.overallScore < workoutReqs.minReadiness) {
    // Check if we should switch workout type
    if (readiness.overallScore < workoutReqs.minReadiness - 20) {
      // Significant readiness deficit - switch to alternative
      adjustedType = workoutReqs.alternativeIfLowReadiness;
      wasTypeChanged = true;
      rationale.push(
        `Workout type changed from ${planned.type} to ${adjustedType} due to low readiness (${readiness.overallScore} < ${workoutReqs.minReadiness})`
      );
      warnings.push(`Original workout type ${planned.type} not recommended today`);
    } else {
      // Moderate deficit - can proceed with significant modifications
      rationale.push(
        `Readiness (${readiness.overallScore}) below optimal (${workoutReqs.minReadiness}) - modifications applied`
      );
    }
  }

  // Step 2: Calculate adjustment factors
  const adjustmentFactors = calculateAdjustmentFactors(
    readiness,
    planned.phase,
    wasTypeChanged ? adjustedType : planned.type
  );

  // Step 3: Apply adjustments to intensity and volume
  let adjustedIntensity = planned.plannedIntensity * adjustmentFactors.intensityMultiplier;
  let adjustedVolume = planned.plannedVolume * adjustmentFactors.volumeMultiplier;
  let adjustedDuration = planned.plannedDuration;

  // Phase-specific constraints
  if (phaseConfig.prioritizeQuality && readiness.overallScore >= phaseConfig.minReadinessForFullTraining) {
    // Maintain intensity, reduce volume if needed
    adjustedIntensity = Math.max(adjustedIntensity, planned.plannedIntensity * 0.95);
    rationale.push('Quality phase - intensity preserved, volume adjusted');
  }

  // Don't allow intensity above planned unless excellent readiness
  if (readiness.category !== 'excellent') {
    adjustedIntensity = Math.min(adjustedIntensity, planned.plannedIntensity);
  }

  // Step 4: Adjust duration based on factors
  adjustedDuration = Math.round(
    planned.plannedDuration *
    (adjustmentFactors.volumeMultiplier * 0.6 + adjustmentFactors.warmupDurationMultiplier * 0.4)
  );

  // Step 5: Adjust individual exercises
  const adjustedExercises = adjustExercises(
    planned.exercises,
    adjustmentFactors,
    readiness,
    wasTypeChanged ? WORKOUT_REQUIREMENTS[adjustedType] : workoutReqs
  );

  // Step 6: Generate additional recommendations
  generateAdditionalRecommendations(
    additionalRecommendations,
    readiness,
    adjustmentFactors,
    planned.phase,
    planned.daysToCompetition
  );

  // Step 7: Add limiting factor warnings
  for (const factor of readiness.limitingFactors) {
    warnings.push(`Limiting factor: ${factor}`);
  }

  return {
    originalType: planned.type,
    adjustedType,
    wasTypeChanged,
    adjustmentFactors,
    adjustedIntensity: Math.round(adjustedIntensity),
    adjustedVolume: Math.round(adjustedVolume * 10) / 10,
    adjustedDuration,
    exercises: adjustedExercises,
    warnings,
    rationale,
    additionalRecommendations
  };
}

// ==================== HELPER FUNCTIONS ====================

function calculateAdjustmentFactors(
  readiness: ReadinessResult,
  phase: TrainingPhase,
  workoutType: WorkoutType
): AdjustmentFactors {
  const phaseConfig = PHASE_TOLERANCE[phase];
  const score = readiness.overallScore;

  // Base multipliers from readiness score
  let intensityMultiplier: number;
  let volumeMultiplier: number;

  if (score >= 85) {
    // Excellent - can push slightly
    intensityMultiplier = 1.0;
    volumeMultiplier = 1.0;
  } else if (score >= 70) {
    // Good - standard training
    intensityMultiplier = 0.95 + (score - 70) * 0.003;  // 0.95-1.0
    volumeMultiplier = 0.90 + (score - 70) * 0.007;    // 0.90-1.0
  } else if (score >= 55) {
    // Moderate - reduce both
    intensityMultiplier = 0.80 + (score - 55) * 0.01;  // 0.80-0.95
    volumeMultiplier = 0.75 + (score - 55) * 0.01;     // 0.75-0.90
  } else if (score >= 40) {
    // Poor - significant reduction
    intensityMultiplier = 0.60 + (score - 40) * 0.013; // 0.60-0.80
    volumeMultiplier = 0.55 + (score - 40) * 0.013;    // 0.55-0.75
  } else {
    // Critical - minimal training
    intensityMultiplier = 0.40 + score * 0.005;        // 0.40-0.60
    volumeMultiplier = 0.30 + score * 0.006;           // 0.30-0.55
  }

  // Workout type-specific adjustments
  const workoutReqs = WORKOUT_REQUIREMENTS[workoutType];

  // High CNS load workouts need higher readiness
  if (workoutReqs.cnsLoad === 'high' && readiness.componentScores.hrv < 70) {
    intensityMultiplier *= 0.90;
  }

  // High mechanical load with soreness
  if (workoutReqs.mechanicalLoad === 'high' && readiness.componentScores.soreness < 70) {
    volumeMultiplier *= 0.85;
  }

  // High metabolic load with high fatigue
  if (workoutReqs.metabolicLoad === 'high' && readiness.componentScores.fatigue < 60) {
    volumeMultiplier *= 0.80;
    intensityMultiplier *= 0.90;
  }

  // Calculate complexity multiplier
  let complexityMultiplier = 1.0;
  if (score < 70) {
    complexityMultiplier = 0.7 + (score / 70) * 0.3;
  }
  if (readiness.componentScores.stress < 60) {
    complexityMultiplier *= 0.85;
  }

  // Calculate rest period multiplier (increase rest when fatigued)
  let restPeriodMultiplier = 1.0;
  if (score < 70) {
    restPeriodMultiplier = 1.0 + ((70 - score) / 70) * 0.5; // Up to 1.5x
  }
  if (readiness.componentScores.fatigue < 60) {
    restPeriodMultiplier *= 1.2;
  }
  restPeriodMultiplier = Math.min(2.0, restPeriodMultiplier);

  // Warmup duration multiplier
  let warmupDurationMultiplier = 1.0;
  if (readiness.componentScores.soreness < 70) {
    warmupDurationMultiplier += 0.15;
  }
  if (readiness.componentScores.sleep < 70) {
    warmupDurationMultiplier += 0.10;
  }
  if (score < 60) {
    warmupDurationMultiplier += 0.15;
  }
  warmupDurationMultiplier = Math.min(1.5, warmupDurationMultiplier);

  return {
    intensityMultiplier: Math.round(intensityMultiplier * 100) / 100,
    volumeMultiplier: Math.round(volumeMultiplier * 100) / 100,
    complexityMultiplier: Math.round(complexityMultiplier * 100) / 100,
    restPeriodMultiplier: Math.round(restPeriodMultiplier * 100) / 100,
    warmupDurationMultiplier: Math.round(warmupDurationMultiplier * 100) / 100
  };
}

function adjustExercises(
  exercises: PlannedExercise[],
  factors: AdjustmentFactors,
  readiness: ReadinessResult,
  workoutReqs: WorkoutTypeRequirements
): AdjustedExercise[] {
  return exercises.map(exercise => {
    const adjustmentNotes: string[] = [];
    const adjusted: AdjustedExercise = {
      ...exercise,
      adjustmentNotes
    };

    // Adjust sets if applicable
    if (exercise.sets !== undefined) {
      adjusted.originalSets = exercise.sets;
      adjusted.sets = Math.max(1, Math.round(exercise.sets * factors.volumeMultiplier));
      if (adjusted.sets !== exercise.sets) {
        adjustmentNotes.push(`Sets: ${exercise.sets} → ${adjusted.sets}`);
      }
    }

    // Adjust reps if numeric
    if (typeof exercise.reps === 'number') {
      adjusted.originalReps = exercise.reps;
      adjusted.reps = Math.max(1, Math.round(exercise.reps * factors.volumeMultiplier));
      if (adjusted.reps !== exercise.reps) {
        adjustmentNotes.push(`Reps: ${exercise.reps} → ${adjusted.reps}`);
      }
    }

    // Adjust intensity if applicable
    if (exercise.intensity !== undefined) {
      adjusted.originalIntensity = exercise.intensity;
      adjusted.intensity = Math.round(exercise.intensity * factors.intensityMultiplier);
      if (adjusted.intensity !== exercise.intensity) {
        adjustmentNotes.push(`Intensity: ${exercise.intensity}% → ${adjusted.intensity}%`);
      }
    }

    // Adjust recovery periods
    if (exercise.recovery !== undefined) {
      adjusted.originalRecovery = exercise.recovery;
      adjusted.recovery = Math.round(exercise.recovery * factors.restPeriodMultiplier);
      if (adjusted.recovery !== exercise.recovery) {
        adjustmentNotes.push(`Recovery: ${exercise.recovery}s → ${adjusted.recovery}s`);
      }
    }

    // Adjust distance if applicable
    if (exercise.distance !== undefined) {
      const originalDistance = exercise.distance;
      adjusted.distance = Math.round(exercise.distance * factors.volumeMultiplier);
      if (adjusted.distance !== originalDistance) {
        adjustmentNotes.push(`Distance: ${originalDistance}m → ${adjusted.distance}m`);
      }
    }

    // Add notes for rigid elements that should be maintained
    if (workoutReqs.rigidElements.length > 0 && adjustmentNotes.length > 0) {
      adjusted.notes = (exercise.notes || '') +
        ` [Maintain: ${workoutReqs.rigidElements.join(', ')}]`;
    }

    return adjusted;
  });
}

function generateAdditionalRecommendations(
  recommendations: string[],
  readiness: ReadinessResult,
  factors: AdjustmentFactors,
  phase: TrainingPhase,
  daysToCompetition?: number
): void {
  // Warmup recommendations
  if (factors.warmupDurationMultiplier > 1.1) {
    recommendations.push(
      `Extend warmup by ${Math.round((factors.warmupDurationMultiplier - 1) * 100)}% - ` +
      `focus on mobility and activation`
    );
  }

  // Recovery-based recommendations
  if (readiness.componentScores.soreness < 60) {
    recommendations.push('Include foam rolling and dynamic stretching in warmup');
    recommendations.push('Consider compression garments during session');
  }

  if (readiness.componentScores.hrv < 60) {
    recommendations.push('Add 5-10 min breathing exercises before training');
    recommendations.push('Monitor heart rate throughout - stop if elevated');
  }

  if (readiness.componentScores.sleep < 60) {
    recommendations.push('Caffeine (1-2mg/kg) may help if tolerated');
    recommendations.push('Schedule nap after session if possible');
  }

  if (readiness.componentScores.hydration < 60) {
    recommendations.push('Drink 500ml water before training');
    recommendations.push('Use electrolyte drink during session');
  }

  if (readiness.componentScores.nutrition < 60) {
    recommendations.push('Consume easily digestible carbs 1-2h before');
    recommendations.push('Have recovery shake ready immediately post-session');
  }

  // Phase-specific recommendations
  if (phase === 'PEAK' && readiness.overallScore < 75) {
    recommendations.push('⚠️ PEAK PHASE: Consider rescheduling high-intensity work');
    recommendations.push('Focus on maintaining feel and rhythm, not building');
  }

  if (phase === 'COMPETITION' && readiness.overallScore < 70) {
    recommendations.push('⚠️ COMPETITION PHASE: Consult coach about participation');
    recommendations.push('If competing: adjust race plan expectations');
  }

  // Competition proximity recommendations
  if (daysToCompetition !== undefined) {
    if (daysToCompetition <= 3 && readiness.overallScore < 70) {
      recommendations.push(
        `⚠️ ${daysToCompetition} days to competition - prioritize recovery over training`
      );
    }
    if (daysToCompetition <= 7 && readiness.componentScores.fatigue < 50) {
      recommendations.push('Consider extra rest day before competition');
    }
  }

  // If significant adjustments were made
  if (factors.intensityMultiplier < 0.80 || factors.volumeMultiplier < 0.75) {
    recommendations.push('Session significantly modified - reassess tomorrow');
    recommendations.push('Focus on quality over quantity today');
  }
}

// ==================== ATHLETE PREFERENCES ====================

export interface AthletePreferences {
  prefersQualityOverVolume: boolean;
  toleratesHighIntensityWhenFatigued: boolean;
  needsExtendedWarmup: boolean;
  recoveryPriority: 'performance' | 'longevity' | 'balanced';
  autoAdjustEnabled: boolean;
  minimumReadinessForHighIntensity: number;
}

export const DEFAULT_PREFERENCES: AthletePreferences = {
  prefersQualityOverVolume: true,
  toleratesHighIntensityWhenFatigued: false,
  needsExtendedWarmup: false,
  recoveryPriority: 'balanced',
  autoAdjustEnabled: true,
  minimumReadinessForHighIntensity: 75
};

// ==================== WEEKLY LOAD BALANCING ====================

export interface WeeklyPlan {
  days: DayPlan[];
  totalPlannedLoad: number;
  phase: TrainingPhase;
}

export interface DayPlan {
  date: Date;
  workouts: PlannedWorkout[];
  plannedLoad: number;
  isKeySession: boolean;
}

export interface AdjustedWeeklyPlan {
  days: AdjustedDayPlan[];
  originalTotalLoad: number;
  adjustedTotalLoad: number;
  loadReduction: number;
  redistributionNotes: string[];
}

export interface AdjustedDayPlan extends DayPlan {
  adjustedWorkouts: AdjustedWorkout[];
  adjustedLoad: number;
  wasModified: boolean;
}

/**
 * Redistribute weekly load if a key session is missed/modified
 */
export function rebalanceWeeklyLoad(
  weeklyPlan: WeeklyPlan,
  readinessHistory: { date: Date; readiness: ReadinessResult }[],
  missedSessionDate: Date
): AdjustedWeeklyPlan {
  const redistributionNotes: string[] = [];
  let originalTotalLoad = 0;
  let adjustedTotalLoad = 0;

  const adjustedDays: AdjustedDayPlan[] = weeklyPlan.days.map(day => {
    const dayReadiness = readinessHistory.find(
      r => r.date.toDateString() === day.date.toDateString()
    )?.readiness;

    const adjustedWorkouts = day.workouts.map(workout => {
      if (dayReadiness) {
        return autoAdjustWorkout(workout, dayReadiness);
      }
      // Default adjustment if no readiness data
      return autoAdjustWorkout(workout, {
        overallScore: 70,
        category: 'good',
        componentScores: {
          sleep: 70, hrv: 70, restingHR: 70, fatigue: 70,
          soreness: 70, stress: 70, mood: 70, nutrition: 70, hydration: 70
        },
        limitingFactors: [],
        recommendations: [],
        trainingRecommendation: {
          maxIntensity: 95,
          maxVolume: 95,
          focusAreas: [],
          avoidAreas: []
        }
      });
    });

    // Calculate loads
    const dayOriginalLoad = day.plannedLoad;
    const dayAdjustedLoad = calculateDayLoad(adjustedWorkouts);

    originalTotalLoad += dayOriginalLoad;
    adjustedTotalLoad += dayAdjustedLoad;

    const wasModified = day.date.toDateString() === missedSessionDate.toDateString() ||
      adjustedWorkouts.some(w => w.wasTypeChanged ||
        w.adjustmentFactors.intensityMultiplier < 0.9 ||
        w.adjustmentFactors.volumeMultiplier < 0.9);

    return {
      ...day,
      adjustedWorkouts,
      adjustedLoad: dayAdjustedLoad,
      wasModified
    };
  });

  const loadReduction = ((originalTotalLoad - adjustedTotalLoad) / originalTotalLoad) * 100;

  // Generate redistribution notes
  if (loadReduction > 20) {
    redistributionNotes.push(
      `Significant load reduction (${loadReduction.toFixed(1)}%) this week`
    );
    redistributionNotes.push('Consider adding an extra session if readiness improves');
  } else if (loadReduction > 10) {
    redistributionNotes.push(
      `Moderate load reduction (${loadReduction.toFixed(1)}%) - within acceptable range`
    );
  }

  // Check if key sessions were affected
  const affectedKeySessions = adjustedDays.filter(d => d.isKeySession && d.wasModified);
  if (affectedKeySessions.length > 0) {
    redistributionNotes.push(
      `${affectedKeySessions.length} key session(s) modified - reassess weekly goals`
    );
  }

  return {
    days: adjustedDays,
    originalTotalLoad,
    adjustedTotalLoad,
    loadReduction,
    redistributionNotes
  };
}

function calculateDayLoad(adjustedWorkouts: AdjustedWorkout[]): number {
  return adjustedWorkouts.reduce((total, workout) => {
    // Simple load calculation: adjusted intensity * adjusted volume / 100
    return total + (workout.adjustedIntensity * workout.adjustedVolume) / 100;
  }, 0);
}

// ==================== EXPORTS ====================

export default {
  autoAdjustWorkout,
  rebalanceWeeklyLoad,
  PHASE_TOLERANCE,
  WORKOUT_REQUIREMENTS,
  DEFAULT_PREFERENCES
};
