/**
 * Session Generator Service
 * Auto-generate training sessions based on athlete data
 */

import { prisma } from '../lib/prisma';
import { calculateLoadMetrics } from './load-monitoring.service';
import { calculateAthleteReadiness } from './readiness.service';

export interface GeneratedSession {
  type: string;
  phase: string;
  totalDuration: number;
  estimatedLoad: number;
  warmup: any;
  mainWorkout: any;
  strength?: any;
  cooldown: any;
  notes: string[];
  adjustments?: {
    intensityChange: number;
    volumeChange: number;
    reason: string;
  };
}

export interface SessionGenerationInput {
  athleteId: string;
  date: Date;
  sessionType: 'SPEED' | 'SPEED_ENDURANCE' | 'TEMPO' | 'STRENGTH' | 'RECOVERY' | 'COMPETITION';
  phase: 'GPP' | 'SPP1' | 'SPP2' | 'COMPETITION' | 'TRANSITION';
  weekInPhase?: number;
}

/**
 * Build a complete session template
 */
function buildCompleteSession(params: {
  type: string;
  phase: string;
  weekInPhase: number;
}): GeneratedSession {
  const baseDuration = {
    SPEED: 90,
    SPEED_ENDURANCE: 100,
    TEMPO: 80,
    STRENGTH: 75,
    RECOVERY: 45,
    COMPETITION: 60,
  }[params.type] || 90;

  return {
    type: params.type,
    phase: params.phase,
    totalDuration: baseDuration,
    estimatedLoad: params.type === 'SPEED' ? 150 : params.type === 'RECOVERY' ? 50 : 100,
    warmup: {
      duration: 20,
      phases: [
        { name: 'Light jog', duration: 5 },
        { name: 'Dynamic stretching', duration: 10 },
        { name: 'Drills', duration: 5 },
      ],
    },
    mainWorkout: {
      duration: baseDuration - 35,
      focus: params.type,
    },
    cooldown: {
      duration: 15,
      exercises: [
        { name: 'Light jog', duration: 5 },
        { name: 'Static stretching', duration: 10 },
      ],
    },
    notes: [`${params.phase} phase - Week ${params.weekInPhase}`],
  };
}

/**
 * Apply adjustments based on athlete state
 */
function applyAutoAdjustments(
  session: GeneratedSession,
  params: {
    readinessScore: number;
    phase: string;
    acwr: number;
    fatigueType: string;
  }
): GeneratedSession {
  const adjusted = { ...session };
  let intensityChange = 0;
  let volumeChange = 0;
  const reasons: string[] = [];

  // Adjust based on readiness
  if (params.readinessScore < 60) {
    intensityChange -= 15;
    volumeChange -= 20;
    reasons.push('Low readiness - reducing intensity and volume');
  } else if (params.readinessScore >= 85) {
    intensityChange += 5;
    reasons.push('Optimal readiness - slight intensity increase');
  }

  // Adjust based on ACWR
  if (params.acwr > 1.3) {
    volumeChange -= 15;
    reasons.push('High ACWR - reducing volume');
  } else if (params.acwr < 0.8) {
    volumeChange += 10;
    reasons.push('Low ACWR - can increase volume');
  }

  // Adjust based on fatigue type
  if (params.fatigueType === 'neural') {
    intensityChange -= 10;
    reasons.push('Neural fatigue detected - reducing intensity');
  } else if (params.fatigueType === 'mechanical') {
    volumeChange -= 10;
    reasons.push('Mechanical fatigue detected - reducing volume');
  }

  adjusted.estimatedLoad = Math.round(
    session.estimatedLoad * (1 + intensityChange / 100) * (1 + volumeChange / 100)
  );
  adjusted.totalDuration = Math.round(session.totalDuration * (1 + volumeChange / 100));

  if (reasons.length > 0) {
    adjusted.adjustments = {
      intensityChange,
      volumeChange,
      reason: reasons.join('; '),
    };
    adjusted.notes = [...adjusted.notes, ...reasons];
  }

  return adjusted;
}

/**
 * Generate an optimized training session
 */
export async function generateOptimizedSession(
  input: SessionGenerationInput
): Promise<GeneratedSession> {
  const athlete = await prisma.athlete.findUnique({
    where: { id: input.athleteId },
    include: {
      personalBests: true,
      wellnessLogs: {
        orderBy: { logDate: 'desc' },
        take: 14,
      },
    },
  });

  if (!athlete) {
    throw new Error('Athlete not found');
  }

  // Calculate current readiness
  const readinessResult = await calculateAthleteReadiness(input.athleteId);
  const readinessScore = readinessResult?.score || 75;

  // Get load metrics
  const loadMetrics = await calculateLoadMetrics(input.athleteId);
  const acwr = loadMetrics?.acwr || 1.0;

  // Determine fatigue type from wellness data
  const latestWellness = athlete.wellnessLogs[0];
  let fatigueType: 'neural' | 'metabolic' | 'mechanical' | 'balanced' = 'balanced';

  if (latestWellness) {
    if ((latestWellness.fatigue || 0) > 7 && (latestWellness.muscleSoreness || 0) < 5) {
      fatigueType = 'neural';
    } else if ((latestWellness.muscleSoreness || 0) > 7 && (latestWellness.fatigue || 0) < 5) {
      fatigueType = 'mechanical';
    } else if ((latestWellness.fatigue || 0) > 6 && (latestWellness.muscleSoreness || 0) > 6) {
      fatigueType = 'metabolic';
    }
  }

  // Build base session template
  const baseSession = buildCompleteSession({
    type: input.sessionType,
    phase: input.phase,
    weekInPhase: input.weekInPhase || 1,
  });

  // Apply auto-adjustments based on athlete state
  const adjustedSession = applyAutoAdjustments(baseSession, {
    readinessScore,
    phase: input.phase,
    acwr,
    fatigueType,
  });

  return adjustedSession;
}

/**
 * Get weekly session structure based on training phase
 */
function getWeeklyStructure(
  phase: string,
  category: string
): ('SPEED' | 'SPEED_ENDURANCE' | 'TEMPO' | 'STRENGTH' | 'RECOVERY' | 'REST')[] {
  const isElite = ['SENIOR', 'ELITE'].includes(category);

  switch (phase) {
    case 'GPP':
      return isElite
        ? ['STRENGTH', 'TEMPO', 'STRENGTH', 'REST', 'TEMPO', 'STRENGTH', 'REST']
        : ['STRENGTH', 'TEMPO', 'REST', 'STRENGTH', 'TEMPO', 'REST', 'REST'];

    case 'SPP1':
      return isElite
        ? ['SPEED', 'STRENGTH', 'TEMPO', 'REST', 'SPEED_ENDURANCE', 'STRENGTH', 'REST']
        : ['SPEED', 'STRENGTH', 'REST', 'SPEED_ENDURANCE', 'TEMPO', 'REST', 'REST'];

    case 'SPP2':
      return isElite
        ? ['SPEED', 'RECOVERY', 'SPEED_ENDURANCE', 'REST', 'SPEED', 'STRENGTH', 'REST']
        : ['SPEED', 'REST', 'SPEED_ENDURANCE', 'REST', 'SPEED', 'REST', 'REST'];

    case 'COMPETITION':
      return isElite
        ? ['SPEED', 'REST', 'TEMPO', 'REST', 'SPEED', 'REST', 'REST']
        : ['SPEED', 'REST', 'TEMPO', 'REST', 'REST', 'REST', 'REST'];

    case 'TRANSITION':
      return ['RECOVERY', 'REST', 'RECOVERY', 'REST', 'REST', 'REST', 'REST'];

    default:
      return ['TEMPO', 'REST', 'STRENGTH', 'REST', 'TEMPO', 'REST', 'REST'];
  }
}

/**
 * Generate a week of training sessions
 */
export async function generateWeekPlan(
  athleteId: string,
  weekStartDate: Date,
  phase: 'GPP' | 'SPP1' | 'SPP2' | 'COMPETITION' | 'TRANSITION',
  weekInPhase: number
): Promise<GeneratedSession[]> {
  const athlete = await prisma.athlete.findUnique({
    where: { id: athleteId },
  });

  if (!athlete) {
    throw new Error('Athlete not found');
  }

  const weeklyStructure = getWeeklyStructure(phase, athlete.category);

  const sessions: GeneratedSession[] = [];

  for (let dayOffset = 0; dayOffset < weeklyStructure.length; dayOffset++) {
    const sessionType = weeklyStructure[dayOffset];

    if (sessionType === 'REST') {
      continue;
    }

    const sessionDate = new Date(weekStartDate);
    sessionDate.setDate(sessionDate.getDate() + dayOffset);

    const session = await generateOptimizedSession({
      athleteId,
      date: sessionDate,
      sessionType: sessionType as any,
      phase,
      weekInPhase,
    });

    sessions.push(session);
  }

  return sessions;
}

/**
 * Get session recommendations based on athlete state
 */
export async function getSessionRecommendations(athleteId: string): Promise<{
  recommendedType: string;
  readiness: number;
  reasoning: string[];
}> {
  const readinessResult = await calculateAthleteReadiness(athleteId);
  const loadMetrics = await calculateLoadMetrics(athleteId);

  const readiness = readinessResult?.score || 75;
  const acwr = loadMetrics?.acwr || 1.0;

  const reasoning: string[] = [];
  let recommendedType: string;

  if (readiness < 50) {
    recommendedType = 'REST';
    reasoning.push('Readiness is very low - rest day recommended');
  } else if (readiness < 65) {
    recommendedType = 'RECOVERY';
    reasoning.push('Readiness is below optimal - light recovery session recommended');
  } else if (acwr > 1.3) {
    recommendedType = 'TEMPO';
    reasoning.push('ACWR is elevated - moderate intensity session to manage load');
  } else if (readiness >= 85) {
    recommendedType = 'SPEED';
    reasoning.push('Optimal readiness - cleared for high-intensity speed work');
  } else {
    recommendedType = 'STRENGTH';
    reasoning.push('Good readiness - strength or speed-endurance work appropriate');
  }

  if (acwr < 0.8) {
    reasoning.push('ACWR is low - can progressively increase training load');
  }

  return {
    recommendedType,
    readiness,
    reasoning,
  };
}
