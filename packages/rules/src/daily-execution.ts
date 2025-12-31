/**
 * Daily Execution System
 * Elite Athletics Performance System
 *
 * Complete daily training execution including:
 * - Morning readiness check
 * - Session execution flow
 * - Real-time adjustments
 * - Post-session data collection
 * - Recovery protocols
 * - Alert system
 */

import { ReadinessResult, calculateReadiness, WellnessInput } from './readiness-rules';
import { AdjustedWorkout, autoAdjustWorkout, PlannedWorkout } from './auto-adjust-rules';
import { TrainingSession } from './session-builder';

// ==================== MORNING READINESS CHECK ====================

export interface MorningCheckInput {
  athleteId: string;
  date: Date;
  sleepHours: number;
  sleepQuality: number;          // 1-10
  restingHR: number;             // bpm
  hrvRmssd: number;              // ms
  bodyWeight: number;            // kg
  perceivedFatigue: number;      // 1-10 (10 = very fatigued)
  muscleSoreness: number;        // 1-10 (10 = very sore)
  stressLevel: number;           // 1-10 (10 = very stressed)
  mood: number;                  // 1-10 (10 = excellent)
  hydrationStatus: number;       // 1-10
  nutritionCompliance: number;   // 0-100%
  specificSoreness?: BodyAreaSoreness[];
  notes?: string;
}

export interface BodyAreaSoreness {
  bodyPart: string;
  severity: number;              // 1-10
  side?: 'left' | 'right' | 'both';
}

export interface MorningCheckResult {
  athleteId: string;
  date: Date;
  timestamp: Date;
  readiness: ReadinessResult;
  alerts: Alert[];
  sessionRecommendation: SessionRecommendation;
  recoveryActions: string[];
  coachNotification: boolean;
  flaggedConcerns: string[];
}

export interface Alert {
  level: 'green' | 'yellow' | 'orange' | 'red';
  category: string;
  message: string;
  action: string;
  priority: number;
}

export interface SessionRecommendation {
  proceed: boolean;
  modificationType: 'none' | 'minor' | 'major' | 'alternative' | 'rest';
  intensityMultiplier: number;
  volumeMultiplier: number;
  suggestedSessionType?: string;
  avoidActivities: string[];
  focusAreas: string[];
  extendedWarmup: boolean;
  warmupDuration: number;        // minutes
}

/**
 * Process morning readiness check
 */
export function processMorningCheck(input: MorningCheckInput): MorningCheckResult {
  const alerts: Alert[] = [];
  const flaggedConcerns: string[] = [];
  const recoveryActions: string[] = [];

  // Convert to wellness input for readiness calculation
  const wellnessInput: WellnessInput = {
    sleepHours: input.sleepHours,
    sleepQuality: input.sleepQuality,
    restingHR: input.restingHR,
    hrvMssd: input.hrvRmssd,
    perceivedFatigue: input.perceivedFatigue,
    muscleSoreness: input.muscleSoreness,
    stressLevel: input.stressLevel,
    mood: input.mood,
    nutritionCompliance: input.nutritionCompliance,
    hydrationStatus: input.hydrationStatus
  };

  // Calculate readiness
  const readiness = calculateReadiness({ wellness: wellnessInput });

  // Generate alerts based on individual metrics
  // Sleep alerts
  if (input.sleepHours < 6) {
    alerts.push({
      level: 'orange',
      category: 'Sleep',
      message: `Only ${input.sleepHours} hours of sleep`,
      action: 'Consider nap before training, reduce intensity',
      priority: 1
    });
    flaggedConcerns.push('Insufficient sleep');
    recoveryActions.push('Schedule 20-30 min nap if possible');
  } else if (input.sleepHours < 7) {
    alerts.push({
      level: 'yellow',
      category: 'Sleep',
      message: `${input.sleepHours} hours of sleep - below optimal`,
      action: 'Monitor energy during session',
      priority: 2
    });
  }

  if (input.sleepQuality < 5) {
    alerts.push({
      level: 'yellow',
      category: 'Sleep Quality',
      message: `Poor sleep quality (${input.sleepQuality}/10)`,
      action: 'Extended warmup recommended',
      priority: 2
    });
    flaggedConcerns.push('Poor sleep quality');
  }

  // HRV alerts
  if (input.hrvRmssd < 40) {
    alerts.push({
      level: 'orange',
      category: 'HRV',
      message: `Low HRV (${input.hrvRmssd}ms) - recovery incomplete`,
      action: 'Reduce CNS-demanding work',
      priority: 1
    });
    flaggedConcerns.push('Low HRV - incomplete recovery');
    recoveryActions.push('Add breathing exercises before training');
  }

  // Resting HR alerts (assuming elevated if significantly higher)
  // Note: Would need baseline comparison in real system
  if (input.restingHR > 70) {
    alerts.push({
      level: 'yellow',
      category: 'Resting HR',
      message: `Elevated resting HR (${input.restingHR} bpm)`,
      action: 'Monitor during warmup',
      priority: 2
    });
  }

  // Fatigue alerts
  if (input.perceivedFatigue >= 8) {
    alerts.push({
      level: 'orange',
      category: 'Fatigue',
      message: `High fatigue level (${input.perceivedFatigue}/10)`,
      action: 'Consider rest or active recovery only',
      priority: 1
    });
    flaggedConcerns.push('High perceived fatigue');
  } else if (input.perceivedFatigue >= 6) {
    alerts.push({
      level: 'yellow',
      category: 'Fatigue',
      message: `Moderate fatigue (${input.perceivedFatigue}/10)`,
      action: 'Reduce training volume',
      priority: 2
    });
  }

  // Soreness alerts
  if (input.muscleSoreness >= 8) {
    alerts.push({
      level: 'orange',
      category: 'Soreness',
      message: `High muscle soreness (${input.muscleSoreness}/10)`,
      action: 'Avoid eccentric/plyometric work',
      priority: 1
    });
    flaggedConcerns.push('High muscle soreness');
    recoveryActions.push('Include extended foam rolling');
    recoveryActions.push('Consider contrast therapy');
  } else if (input.muscleSoreness >= 6) {
    alerts.push({
      level: 'yellow',
      category: 'Soreness',
      message: `Moderate soreness (${input.muscleSoreness}/10)`,
      action: 'Extended warmup, reduce plyometrics',
      priority: 2
    });
  }

  // Stress alerts
  if (input.stressLevel >= 8) {
    alerts.push({
      level: 'yellow',
      category: 'Stress',
      message: `High stress level (${input.stressLevel}/10)`,
      action: 'Simplify session, reduce complexity',
      priority: 2
    });
    flaggedConcerns.push('High stress levels');
    recoveryActions.push('Include relaxation techniques');
  }

  // Mood alerts
  if (input.mood <= 3) {
    alerts.push({
      level: 'yellow',
      category: 'Mood',
      message: `Low mood state (${input.mood}/10)`,
      action: 'Coach check-in recommended',
      priority: 2
    });
    flaggedConcerns.push('Low mood - psychological support needed');
  }

  // Hydration alerts
  if (input.hydrationStatus < 5) {
    alerts.push({
      level: 'yellow',
      category: 'Hydration',
      message: `Dehydration concern (${input.hydrationStatus}/10)`,
      action: 'Pre-hydrate before training',
      priority: 2
    });
    recoveryActions.push('Drink 500ml water before training');
    recoveryActions.push('Use electrolyte drink during session');
  }

  // Nutrition alerts
  if (input.nutritionCompliance < 60) {
    alerts.push({
      level: 'yellow',
      category: 'Nutrition',
      message: `Poor nutritional compliance (${input.nutritionCompliance}%)`,
      action: 'Address nutrition immediately',
      priority: 2
    });
    recoveryActions.push('Consume balanced meal 2-3 hours before training');
  }

  // Specific body part soreness
  if (input.specificSoreness) {
    for (const area of input.specificSoreness) {
      if (area.severity >= 7) {
        alerts.push({
          level: 'orange',
          category: 'Injury Risk',
          message: `High soreness in ${area.bodyPart} (${area.severity}/10)`,
          action: `Avoid loading ${area.bodyPart}, consult physio if persistent`,
          priority: 1
        });
        flaggedConcerns.push(`${area.bodyPart} soreness - potential injury risk`);
      }
    }
  }

  // Overall readiness-based alert
  let overallAlert: Alert;
  if (readiness.overallScore >= 85) {
    overallAlert = {
      level: 'green',
      category: 'Overall',
      message: `Excellent readiness (${readiness.overallScore}/100)`,
      action: 'Proceed with planned training',
      priority: 3
    };
  } else if (readiness.overallScore >= 70) {
    overallAlert = {
      level: 'green',
      category: 'Overall',
      message: `Good readiness (${readiness.overallScore}/100)`,
      action: 'Proceed with minor adjustments',
      priority: 3
    };
  } else if (readiness.overallScore >= 55) {
    overallAlert = {
      level: 'yellow',
      category: 'Overall',
      message: `Moderate readiness (${readiness.overallScore}/100)`,
      action: 'Modify session intensity/volume',
      priority: 2
    };
  } else if (readiness.overallScore >= 40) {
    overallAlert = {
      level: 'orange',
      category: 'Overall',
      message: `Poor readiness (${readiness.overallScore}/100)`,
      action: 'Consider rest or light recovery session',
      priority: 1
    };
  } else {
    overallAlert = {
      level: 'red',
      category: 'Overall',
      message: `Critical readiness (${readiness.overallScore}/100)`,
      action: 'REST RECOMMENDED - Consult coach/medical',
      priority: 0
    };
  }
  alerts.unshift(overallAlert);

  // Generate session recommendation
  const sessionRecommendation = generateSessionRecommendation(readiness, alerts, input);

  // Determine if coach notification needed
  const coachNotification = alerts.some(a => a.level === 'orange' || a.level === 'red') ||
    flaggedConcerns.length >= 2;

  // Sort alerts by priority
  alerts.sort((a, b) => a.priority - b.priority);

  return {
    athleteId: input.athleteId,
    date: input.date,
    timestamp: new Date(),
    readiness,
    alerts,
    sessionRecommendation,
    recoveryActions,
    coachNotification,
    flaggedConcerns
  };
}

function generateSessionRecommendation(
  readiness: ReadinessResult,
  alerts: Alert[],
  input: MorningCheckInput
): SessionRecommendation {
  const score = readiness.overallScore;
  const hasRedAlert = alerts.some(a => a.level === 'red');
  const hasOrangeAlert = alerts.some(a => a.level === 'orange');
  const orangeCount = alerts.filter(a => a.level === 'orange').length;

  // Determine avoidances based on specific issues
  const avoidActivities: string[] = [];
  const focusAreas: string[] = [];

  if (input.muscleSoreness >= 7) {
    avoidActivities.push('Plyometrics');
    avoidActivities.push('Heavy eccentric work');
    avoidActivities.push('High-impact activities');
  }

  if (input.hrvRmssd < 45 || input.perceivedFatigue >= 7) {
    avoidActivities.push('Maximum intensity sprints');
    avoidActivities.push('CNS-demanding work');
    avoidActivities.push('Complex technical work');
  }

  if (input.sleepHours < 6) {
    avoidActivities.push('Reaction-time work');
    avoidActivities.push('High-risk activities');
  }

  // Determine focus areas
  if (score >= 70) {
    focusAreas.push('Quality over quantity');
  }
  if (input.muscleSoreness >= 5) {
    focusAreas.push('Extended mobility work');
  }
  if (input.stressLevel >= 6) {
    focusAreas.push('Simple, familiar exercises');
  }

  // Generate recommendation based on score
  if (hasRedAlert || score < 40) {
    return {
      proceed: false,
      modificationType: 'rest',
      intensityMultiplier: 0,
      volumeMultiplier: 0,
      suggestedSessionType: 'Complete rest or very light mobility',
      avoidActivities: ['All training'],
      focusAreas: ['Recovery', 'Sleep', 'Nutrition'],
      extendedWarmup: false,
      warmupDuration: 0
    };
  }

  if (orangeCount >= 2 || score < 55) {
    return {
      proceed: true,
      modificationType: 'alternative',
      intensityMultiplier: 0.5,
      volumeMultiplier: 0.6,
      suggestedSessionType: 'Active recovery or light technical work',
      avoidActivities: [...avoidActivities, 'Any high-intensity work'],
      focusAreas: [...focusAreas, 'Light movement', 'Flexibility'],
      extendedWarmup: true,
      warmupDuration: 30
    };
  }

  if (hasOrangeAlert || score < 70) {
    return {
      proceed: true,
      modificationType: 'major',
      intensityMultiplier: 0.75,
      volumeMultiplier: 0.8,
      suggestedSessionType: undefined, // Proceed with modified plan
      avoidActivities,
      focusAreas: [...focusAreas, 'Technical refinement'],
      extendedWarmup: true,
      warmupDuration: 25
    };
  }

  if (score < 85) {
    return {
      proceed: true,
      modificationType: 'minor',
      intensityMultiplier: 0.92,
      volumeMultiplier: 0.95,
      avoidActivities,
      focusAreas,
      extendedWarmup: input.muscleSoreness >= 5 || input.sleepQuality < 6,
      warmupDuration: 20
    };
  }

  // Excellent readiness
  return {
    proceed: true,
    modificationType: 'none',
    intensityMultiplier: 1.0,
    volumeMultiplier: 1.0,
    avoidActivities: [],
    focusAreas: ['Full execution', 'Push when feeling good'],
    extendedWarmup: false,
    warmupDuration: 20
  };
}

// ==================== SESSION EXECUTION ====================

export interface SessionExecution {
  sessionId: string;
  athleteId: string;
  date: Date;
  plannedSession: TrainingSession;
  adjustedSession?: AdjustedWorkout;
  morningCheck: MorningCheckResult;
  startTime?: Date;
  endTime?: Date;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'modified';
  realTimeAdjustments: RealTimeAdjustment[];
  performanceData: PerformanceData[];
  completionPercentage: number;
}

export interface RealTimeAdjustment {
  timestamp: Date;
  trigger: string;
  originalPlan: string;
  adjustment: string;
  reason: string;
  approvedBy?: string;
}

export interface PerformanceData {
  exerciseIndex: number;
  exerciseName: string;
  setNumber: number;
  plannedValue: number | string;
  actualValue: number | string;
  unit: string;
  notes?: string;
  qualityRating?: number;         // 1-5
}

// ==================== POST-SESSION DATA ====================

export interface PostSessionInput {
  sessionId: string;
  athleteId: string;
  date: Date;
  sessionRpe: number;             // 1-10
  sessionDuration: number;        // minutes
  completionPercentage: number;   // 0-100
  performanceRating: number;      // 1-10
  technicalRating: number;        // 1-10
  mentalState: number;            // 1-10
  fatiguePostSession: number;     // 1-10
  painOrDiscomfort: PainReport[];
  bestMoments?: string;
  challengesFaced?: string;
  coachNotes?: string;
  athleteNotes?: string;
}

export interface PainReport {
  bodyPart: string;
  side?: 'left' | 'right' | 'both';
  severity: number;               // 1-10
  type: 'muscle' | 'joint' | 'tendon' | 'other';
  newOrExisting: 'new' | 'existing' | 'worsened' | 'improved';
  description?: string;
}

export interface PostSessionResult {
  sessionId: string;
  athleteId: string;
  calculatedLoad: number;
  loadCategory: 'low' | 'moderate' | 'high' | 'very_high';
  recoveryRecommendation: RecoveryRecommendation;
  alerts: Alert[];
  tomorrowImpact: TomorrowImpact;
  trendsObserved: string[];
}

export interface RecoveryRecommendation {
  priorityLevel: 'standard' | 'enhanced' | 'critical';
  nutritionPriority: string[];
  hydrationTarget: number;        // liters
  sleepTarget: number;            // hours
  recoveryModalities: RecoveryModality[];
  nextSessionAdjustment?: string;
}

export interface RecoveryModality {
  name: string;
  duration: number;               // minutes
  timing: string;
  priority: 'optional' | 'recommended' | 'required';
}

export interface TomorrowImpact {
  expectedReadinessChange: number;
  suggestedSessionType: string;
  intensityLimit: number;
  concerns: string[];
}

/**
 * Process post-session data
 */
export function processPostSession(input: PostSessionInput): PostSessionResult {
  const alerts: Alert[] = [];
  const trendsObserved: string[] = [];

  // Calculate session load (RPE × Duration)
  const calculatedLoad = input.sessionRpe * input.sessionDuration;

  // Categorize load
  let loadCategory: PostSessionResult['loadCategory'];
  if (calculatedLoad < 200) {
    loadCategory = 'low';
  } else if (calculatedLoad < 400) {
    loadCategory = 'moderate';
  } else if (calculatedLoad < 600) {
    loadCategory = 'high';
  } else {
    loadCategory = 'very_high';
  }

  // Check for pain reports
  const severePain = input.painOrDiscomfort.filter(p => p.severity >= 7);
  const newPain = input.painOrDiscomfort.filter(p => p.newOrExisting === 'new');
  const worsenedPain = input.painOrDiscomfort.filter(p => p.newOrExisting === 'worsened');

  if (severePain.length > 0) {
    alerts.push({
      level: 'red',
      category: 'Injury',
      message: `Severe pain reported: ${severePain.map(p => p.bodyPart).join(', ')}`,
      action: 'IMMEDIATE: Consult physio/medical',
      priority: 0
    });
  }

  if (newPain.length > 0) {
    alerts.push({
      level: 'orange',
      category: 'Injury Risk',
      message: `New pain/discomfort: ${newPain.map(p => p.bodyPart).join(', ')}`,
      action: 'Monitor closely, ice if needed, report if persists',
      priority: 1
    });
  }

  if (worsenedPain.length > 0) {
    alerts.push({
      level: 'orange',
      category: 'Injury Risk',
      message: `Worsened condition: ${worsenedPain.map(p => p.bodyPart).join(', ')}`,
      action: 'Reduce load on affected area, consult physio',
      priority: 1
    });
  }

  // Check completion and performance
  if (input.completionPercentage < 80) {
    alerts.push({
      level: 'yellow',
      category: 'Session',
      message: `Low session completion (${input.completionPercentage}%)`,
      action: 'Review reason for incomplete session',
      priority: 2
    });
    trendsObserved.push('Incomplete session - investigate cause');
  }

  if (input.performanceRating < 5) {
    trendsObserved.push('Below-average performance rating');
  }

  if (input.fatiguePostSession >= 9) {
    alerts.push({
      level: 'yellow',
      category: 'Fatigue',
      message: `Very high post-session fatigue (${input.fatiguePostSession}/10)`,
      action: 'Prioritize recovery, monitor tomorrow',
      priority: 2
    });
    trendsObserved.push('High post-session fatigue');
  }

  // Generate recovery recommendation
  const recoveryRecommendation = generateRecoveryRecommendation(
    input,
    loadCategory,
    alerts
  );

  // Calculate tomorrow impact
  const tomorrowImpact = calculateTomorrowImpact(input, loadCategory, alerts);

  return {
    sessionId: input.sessionId,
    athleteId: input.athleteId,
    calculatedLoad,
    loadCategory,
    recoveryRecommendation,
    alerts,
    tomorrowImpact,
    trendsObserved
  };
}

function generateRecoveryRecommendation(
  input: PostSessionInput,
  loadCategory: PostSessionResult['loadCategory'],
  alerts: Alert[]
): RecoveryRecommendation {
  const hasInjuryConcern = alerts.some(a => a.category === 'Injury' || a.category === 'Injury Risk');
  const isHighLoad = loadCategory === 'high' || loadCategory === 'very_high';
  const isHighFatigue = input.fatiguePostSession >= 8;

  // Determine priority level
  let priorityLevel: RecoveryRecommendation['priorityLevel'];
  if (hasInjuryConcern || (isHighLoad && isHighFatigue)) {
    priorityLevel = 'critical';
  } else if (isHighLoad || isHighFatigue) {
    priorityLevel = 'enhanced';
  } else {
    priorityLevel = 'standard';
  }

  // Nutrition priorities
  const nutritionPriority: string[] = [];
  if (isHighLoad) {
    nutritionPriority.push('Protein intake: 0.4g/kg within 30 min');
    nutritionPriority.push('Carbohydrate replenishment: 1-1.2g/kg');
  } else {
    nutritionPriority.push('Balanced recovery meal within 1 hour');
  }
  nutritionPriority.push('Anti-inflammatory foods (berries, fish, leafy greens)');

  if (hasInjuryConcern) {
    nutritionPriority.push('Extra protein for tissue repair');
    nutritionPriority.push('Omega-3 rich foods');
  }

  // Hydration target
  let hydrationTarget = 2.5; // Base
  if (isHighLoad) hydrationTarget += 1.0;
  if (input.sessionDuration > 90) hydrationTarget += 0.5;

  // Sleep target
  let sleepTarget = 8;
  if (priorityLevel === 'critical') sleepTarget = 9;
  if (priorityLevel === 'enhanced') sleepTarget = 8.5;

  // Recovery modalities
  const modalities: RecoveryModality[] = [];

  // Base modalities
  modalities.push({
    name: 'Static stretching',
    duration: 15,
    timing: 'Post-session',
    priority: 'recommended'
  });

  modalities.push({
    name: 'Foam rolling',
    duration: 10,
    timing: 'Post-session and evening',
    priority: priorityLevel === 'standard' ? 'recommended' : 'required'
  });

  if (priorityLevel === 'enhanced' || priorityLevel === 'critical') {
    modalities.push({
      name: 'Contrast shower/bath',
      duration: 10,
      timing: 'Within 2 hours post-session',
      priority: 'recommended'
    });

    modalities.push({
      name: 'Compression wear',
      duration: 120,
      timing: 'Afternoon/evening',
      priority: 'recommended'
    });
  }

  if (priorityLevel === 'critical') {
    modalities.push({
      name: 'Ice bath / cold immersion',
      duration: 10,
      timing: 'Within 1 hour if no injury',
      priority: hasInjuryConcern ? 'optional' : 'recommended'
    });

    modalities.push({
      name: 'Massage or self-myofascial release',
      duration: 30,
      timing: 'Evening',
      priority: 'required'
    });
  }

  if (hasInjuryConcern) {
    modalities.push({
      name: 'Ice/heat therapy on affected area',
      duration: 15,
      timing: 'Every 2-3 hours',
      priority: 'required'
    });
  }

  // Next session adjustment
  let nextSessionAdjustment: string | undefined;
  if (priorityLevel === 'critical') {
    nextSessionAdjustment = 'Consider rest or very light recovery session';
  } else if (priorityLevel === 'enhanced') {
    nextSessionAdjustment = 'Reduce intensity by 10-15% if high-intensity planned';
  }

  return {
    priorityLevel,
    nutritionPriority,
    hydrationTarget,
    sleepTarget,
    recoveryModalities: modalities,
    nextSessionAdjustment
  };
}

function calculateTomorrowImpact(
  input: PostSessionInput,
  loadCategory: PostSessionResult['loadCategory'],
  alerts: Alert[]
): TomorrowImpact {
  const concerns: string[] = [];
  let expectedReadinessChange = 0;

  // Estimate readiness impact
  if (loadCategory === 'very_high') {
    expectedReadinessChange = -15;
    concerns.push('Very high training load may impact recovery');
  } else if (loadCategory === 'high') {
    expectedReadinessChange = -10;
  } else if (loadCategory === 'moderate') {
    expectedReadinessChange = -5;
  } else {
    expectedReadinessChange = 0;
  }

  // Fatigue impact
  if (input.fatiguePostSession >= 9) {
    expectedReadinessChange -= 10;
    concerns.push('High fatigue - extended recovery needed');
  } else if (input.fatiguePostSession >= 7) {
    expectedReadinessChange -= 5;
  }

  // Pain impact
  const hasPain = input.painOrDiscomfort.length > 0;
  const hasSignificantPain = input.painOrDiscomfort.some(p => p.severity >= 6);
  if (hasSignificantPain) {
    concerns.push('Pain may limit training options');
    expectedReadinessChange -= 5;
  }

  // Suggested session type
  let suggestedSessionType: string;
  let intensityLimit: number;

  if (expectedReadinessChange <= -20 || alerts.some(a => a.level === 'red')) {
    suggestedSessionType = 'Rest or very light recovery';
    intensityLimit = 40;
  } else if (expectedReadinessChange <= -12) {
    suggestedSessionType = 'Recovery or technical session';
    intensityLimit = 60;
  } else if (expectedReadinessChange <= -7) {
    suggestedSessionType = 'Low-moderate intensity recommended';
    intensityLimit = 75;
  } else {
    suggestedSessionType = 'Normal training permissible';
    intensityLimit = 100;
  }

  // Adjust for accumulated concerns
  if (concerns.length >= 3) {
    intensityLimit = Math.min(intensityLimit, 70);
  }

  return {
    expectedReadinessChange,
    suggestedSessionType,
    intensityLimit,
    concerns
  };
}

// ==================== DAILY SUMMARY ====================

export interface DailySummary {
  athleteId: string;
  date: Date;
  morningReadiness: number;
  sessionsCompleted: number;
  sessionsPlanned: number;
  totalLoad: number;
  averageSessionRpe: number;
  recoveryStatus: 'good' | 'attention' | 'concern';
  keyHighlights: string[];
  concernAreas: string[];
  tomorrowOutlook: string;
  coachReview: boolean;
}

/**
 * Generate daily summary for coach dashboard
 */
export function generateDailySummary(
  morningCheck: MorningCheckResult,
  postSessions: PostSessionResult[],
  plannedSessionCount: number
): DailySummary {
  const totalLoad = postSessions.reduce((sum, s) => sum + s.calculatedLoad, 0);
  const averageRpe = postSessions.length > 0
    ? postSessions.reduce((sum, s) => sum + (s.calculatedLoad / 60), 0) / postSessions.length
    : 0;

  const keyHighlights: string[] = [];
  const concernAreas: string[] = [];

  // Collect highlights
  if (morningCheck.readiness.overallScore >= 85) {
    keyHighlights.push('Excellent morning readiness');
  }

  const completedSessions = postSessions.length;
  if (completedSessions === plannedSessionCount && plannedSessionCount > 0) {
    keyHighlights.push('All planned sessions completed');
  }

  // Collect concerns
  concernAreas.push(...morningCheck.flaggedConcerns);

  for (const session of postSessions) {
    for (const alert of session.alerts) {
      if (alert.level === 'red' || alert.level === 'orange') {
        concernAreas.push(alert.message);
      }
    }
    concernAreas.push(...session.trendsObserved);
  }

  // Determine recovery status
  let recoveryStatus: DailySummary['recoveryStatus'];
  const hasCriticalAlert = postSessions.some(s =>
    s.alerts.some(a => a.level === 'red')
  );
  const hasModerateAlert = postSessions.some(s =>
    s.alerts.some(a => a.level === 'orange')
  ) || morningCheck.alerts.some(a => a.level === 'orange');

  if (hasCriticalAlert) {
    recoveryStatus = 'concern';
  } else if (hasModerateAlert || concernAreas.length >= 3) {
    recoveryStatus = 'attention';
  } else {
    recoveryStatus = 'good';
  }

  // Tomorrow outlook
  let tomorrowOutlook: string;
  const avgTomorrowImpact = postSessions.length > 0
    ? postSessions.reduce((sum, s) => sum + s.tomorrowImpact.expectedReadinessChange, 0) / postSessions.length
    : 0;

  if (avgTomorrowImpact <= -15 || recoveryStatus === 'concern') {
    tomorrowOutlook = 'Recovery day recommended';
  } else if (avgTomorrowImpact <= -8 || recoveryStatus === 'attention') {
    tomorrowOutlook = 'Light training recommended';
  } else {
    tomorrowOutlook = 'Normal training permissible';
  }

  return {
    athleteId: morningCheck.athleteId,
    date: morningCheck.date,
    morningReadiness: morningCheck.readiness.overallScore,
    sessionsCompleted: completedSessions,
    sessionsPlanned: plannedSessionCount,
    totalLoad,
    averageSessionRpe: Math.round(averageRpe * 10) / 10,
    recoveryStatus,
    keyHighlights,
    concernAreas: [...new Set(concernAreas)], // Remove duplicates
    tomorrowOutlook,
    coachReview: recoveryStatus !== 'good' || concernAreas.length > 0
  };
}

// ==================== EXPORTS ====================

export default {
  processMorningCheck,
  processPostSession,
  generateDailySummary
};
