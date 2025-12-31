/**
 * Readiness Service
 * Calculate and manage athlete readiness scores
 */

import { prisma } from '../lib/prisma';

export interface ReadinessResult {
  score: number;
  category: 'OPTIMAL' | 'GOOD' | 'MODERATE' | 'LOW' | 'CRITICAL';
  components: {
    sleep: number;
    cardiac: number;
    fatigue: number;
    mental: number;
    hydration: number;
  };
  recommendation: string;
}

export interface DailyReadinessData {
  athleteId: string;
  date: Date;
  readinessScore: number;
  category: string;
  components: {
    sleep: number;
    cardiac: number;
    fatigue: number;
    mental: number;
    hydration: number;
  };
  flags: string[];
  recommendation: string;
}

/**
 * Calculate readiness score from wellness data
 */
function calculateReadinessScore(data: any): ReadinessResult {
  const weights = {
    sleepQuality: 0.25,
    energy: 0.20,
    mood: 0.15,
    stress: 0.15,
    muscleSoreness: 0.10,
    motivation: 0.15,
  };

  let score = 0;
  let totalWeight = 0;

  if (data.sleepQuality != null) {
    score += (data.sleepQuality / 10) * weights.sleepQuality * 100;
    totalWeight += weights.sleepQuality;
  }

  if (data.energy != null) {
    score += (data.energy / 10) * weights.energy * 100;
    totalWeight += weights.energy;
  }

  if (data.mood != null) {
    score += (data.mood / 10) * weights.mood * 100;
    totalWeight += weights.mood;
  }

  if (data.stress != null) {
    score += ((10 - data.stress) / 10) * weights.stress * 100;
    totalWeight += weights.stress;
  }

  if (data.muscleSoreness != null) {
    score += ((10 - data.muscleSoreness) / 10) * weights.muscleSoreness * 100;
    totalWeight += weights.muscleSoreness;
  }

  if (data.motivation != null) {
    score += (data.motivation / 10) * weights.motivation * 100;
    totalWeight += weights.motivation;
  }

  const finalScore = totalWeight > 0 ? Math.round(score / totalWeight) : 50;

  let category: 'OPTIMAL' | 'GOOD' | 'MODERATE' | 'LOW' | 'CRITICAL';
  if (finalScore >= 85) category = 'OPTIMAL';
  else if (finalScore >= 70) category = 'GOOD';
  else if (finalScore >= 55) category = 'MODERATE';
  else if (finalScore >= 40) category = 'LOW';
  else category = 'CRITICAL';

  return {
    score: finalScore,
    category,
    components: {
      sleep: (data.sleepQuality || 5) * 10,
      cardiac: data.restingHR ? Math.max(0, 100 - Math.abs(data.restingHR - 55) * 2) : 50,
      fatigue: data.fatigue ? (10 - data.fatigue) * 10 : 50,
      mental: data.mood && data.stress ? ((10 - data.stress + data.mood) / 2) * 10 : 50,
      hydration: (data.hydrationStatus || 5) * 10,
    },
    recommendation: getRecommendation(finalScore),
  };
}

/**
 * Get recommendation based on readiness score
 */
function getRecommendation(score: number): string {
  if (score >= 85) {
    return 'Optimal readiness - cleared for high-intensity training';
  } else if (score >= 70) {
    return 'Good readiness - proceed with planned training';
  } else if (score >= 55) {
    return 'Moderate readiness - consider reducing intensity by 10-15%';
  } else if (score >= 40) {
    return 'Low readiness - reduce volume and intensity significantly';
  } else {
    return 'Very low readiness - active recovery or rest day recommended';
  }
}

/**
 * Calculate readiness score for an athlete
 */
export async function calculateAthleteReadiness(
  athleteId: string
): Promise<ReadinessResult | null> {
  const recentWellness = await prisma.wellnessLog.findMany({
    where: { athleteId },
    orderBy: { logDate: 'desc' },
    take: 1,
  });

  if (recentWellness.length === 0) {
    return null;
  }

  return calculateReadinessScore(recentWellness[0]);
}

/**
 * Get readiness history for an athlete
 */
export async function getReadinessHistory(
  athleteId: string,
  days: number = 30
): Promise<DailyReadinessData[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const wellness = await prisma.wellnessLog.findMany({
    where: {
      athleteId,
      logDate: { gte: startDate },
    },
    orderBy: { logDate: 'asc' },
  });

  return wellness.map((w) => {
    const result = calculateReadinessScore(w);
    return {
      athleteId: w.athleteId,
      date: w.logDate,
      readinessScore: result.score,
      category: result.category,
      components: result.components,
      flags: [],
      recommendation: result.recommendation,
    };
  });
}

/**
 * Check if athlete needs attention based on readiness trends
 */
export async function checkReadinessAlerts(athleteId: string): Promise<string[]> {
  const alerts: string[] = [];

  const recentWellness = await prisma.wellnessLog.findMany({
    where: { athleteId },
    orderBy: { logDate: 'desc' },
    take: 7,
  });

  if (recentWellness.length === 0) {
    alerts.push('No recent wellness data - please submit daily check-ins');
    return alerts;
  }

  // Check for declining readiness
  if (recentWellness.length >= 3) {
    const recent3 = recentWellness.slice(0, 3);
    const avgRecent = recent3.reduce((sum, w) => sum + calculateReadinessScore(w).score, 0) / 3;

    if (avgRecent < 60) {
      alerts.push('Readiness has been low for 3+ days - consider reducing training load');
    }
  }

  // Check for poor sleep
  const avgSleep = recentWellness
    .filter((w) => w.sleepDuration != null)
    .reduce((sum, w) => sum + (w.sleepDuration || 0), 0) / recentWellness.length;
  if (avgSleep < 6) {
    alerts.push('Average sleep is below 6 hours - prioritize sleep recovery');
  }

  // Check for high fatigue
  const avgFatigue = recentWellness
    .filter((w) => w.fatigue != null)
    .reduce((sum, w) => sum + (w.fatigue || 0), 0) / recentWellness.length;
  if (avgFatigue > 7) {
    alerts.push('Fatigue levels are elevated - recovery session recommended');
  }

  // Check for high soreness
  const avgSoreness = recentWellness
    .filter((w) => w.muscleSoreness != null)
    .reduce((sum, w) => sum + (w.muscleSoreness || 0), 0) / recentWellness.length;
  if (avgSoreness > 7) {
    alerts.push('Muscle soreness is high - consider active recovery or massage');
  }

  return alerts;
}
