/**
 * Load Monitoring Service
 * ACWR calculations, injury risk, and load management
 */

import { prisma } from '../lib/prisma';

export interface LoadMetrics {
  acwr: number;
  acuteLoad: number;
  chronicLoad: number;
  monotony: number;
  strain: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  recommendation: string;
}

export interface WeeklyLoadSummary {
  weekNumber: number;
  totalLoad: number;
  sessionCount: number;
  avgSessionLoad: number;
  avgRPE: number;
  loadChange: number;
}

/**
 * Calculate EWMA (Exponentially Weighted Moving Average)
 */
function calculateEWMA(loads: number[], days: number): number {
  if (loads.length === 0) return 0;
  const lambda = 2 / (days + 1);
  let ewma = loads[0];
  for (let i = 1; i < loads.length; i++) {
    ewma = lambda * loads[i] + (1 - lambda) * ewma;
  }
  return ewma;
}

/**
 * Calculate monotony
 */
function calculateMonotony(loads: number[]): number {
  if (loads.length === 0) return 0;
  const mean = loads.reduce((a, b) => a + b, 0) / loads.length;
  const variance = loads.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / loads.length;
  const sd = Math.sqrt(variance);
  if (sd === 0) return 10;
  return mean / sd;
}

/**
 * Calculate strain
 */
function calculateStrain(loads: number[], monotony: number): number {
  const weeklyLoad = loads.reduce((a, b) => a + b, 0);
  return weeklyLoad * monotony;
}

/**
 * Get ACWR risk level
 */
function getACWRRiskLevel(acwr: number): { level: string; recommendation: string } {
  if (acwr > 1.5) {
    return { level: 'VERY_HIGH', recommendation: 'Immediate load reduction required' };
  } else if (acwr > 1.3) {
    return { level: 'HIGH', recommendation: 'Consider reducing training load' };
  } else if (acwr > 0.8) {
    return { level: 'MODERATE', recommendation: 'Optimal training zone' };
  } else {
    return { level: 'LOW', recommendation: 'Consider gradually increasing load' };
  }
}

/**
 * Calculate current load metrics for an athlete
 */
export async function calculateLoadMetrics(athleteId: string): Promise<LoadMetrics | null> {
  const twentyEightDaysAgo = new Date();
  twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 28);

  const loads = await prisma.loadRecord.findMany({
    where: {
      athleteId,
      recordDate: { gte: twentyEightDaysAgo },
    },
    orderBy: { recordDate: 'asc' },
  });

  if (loads.length < 7) {
    return null;
  }

  const dailyLoads = createDailyLoadArray(loads, 28);

  const acuteLoad = calculateEWMA(dailyLoads.slice(-7), 7);
  const chronicLoad = calculateEWMA(dailyLoads, 28);
  const acwr = chronicLoad > 0 ? acuteLoad / chronicLoad : 0;
  const monotony = calculateMonotony(dailyLoads.slice(-7));
  const strain = calculateStrain(dailyLoads.slice(-7), monotony);

  const { level: riskLevel, recommendation } = getACWRRiskLevel(acwr);

  return {
    acwr: Math.round(acwr * 100) / 100,
    acuteLoad: Math.round(acuteLoad),
    chronicLoad: Math.round(chronicLoad),
    monotony: Math.round(monotony * 100) / 100,
    strain: Math.round(strain),
    riskLevel: riskLevel as 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH',
    recommendation,
  };
}

/**
 * Get ACWR trend over time
 */
export async function getACWRTrend(
  athleteId: string,
  days: number = 30
): Promise<{ date: Date; acwr: number; acuteLoad: number; chronicLoad: number }[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days - 28);

  const loads = await prisma.loadRecord.findMany({
    where: {
      athleteId,
      recordDate: { gte: startDate },
    },
    orderBy: { recordDate: 'asc' },
  });

  if (loads.length < 28) {
    return [];
  }

  const dailyLoads = createDailyLoadArray(loads, days + 28);
  const trend: { date: Date; acwr: number; acuteLoad: number; chronicLoad: number }[] = [];

  for (let i = 27; i < dailyLoads.length; i++) {
    const weekData = dailyLoads.slice(i - 6, i + 1);
    const monthData = dailyLoads.slice(Math.max(0, i - 27), i + 1);

    const acute = calculateEWMA(weekData, 7);
    const chronic = calculateEWMA(monthData, 28);
    const acwr = chronic > 0 ? acute / chronic : 0;

    const date = new Date();
    date.setDate(date.getDate() - (dailyLoads.length - 1 - i));

    trend.push({
      date,
      acwr: Math.round(acwr * 100) / 100,
      acuteLoad: Math.round(acute),
      chronicLoad: Math.round(chronic),
    });
  }

  return trend;
}

/**
 * Get weekly load summary
 */
export async function getWeeklyLoadSummary(
  athleteId: string,
  weeks: number = 8
): Promise<WeeklyLoadSummary[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - weeks * 7);

  const loads = await prisma.loadRecord.findMany({
    where: {
      athleteId,
      recordDate: { gte: startDate },
    },
    orderBy: { recordDate: 'asc' },
  });

  const weeklySummaries: WeeklyLoadSummary[] = [];
  let previousWeekLoad = 0;

  for (let week = 0; week < weeks; week++) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (weeks - week) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const weekLoads = loads.filter((l) => {
      const loadDate = new Date(l.recordDate);
      return loadDate >= weekStart && loadDate <= weekEnd;
    });

    const totalLoad = weekLoads.reduce((sum, l) => sum + (l.dailyLoad || 0), 0);
    const avgRPE = weekLoads.length > 0
      ? weekLoads.reduce((sum, l) => sum + (l.sessionRPE || 0), 0) / weekLoads.length
      : 0;

    const loadChange = previousWeekLoad > 0
      ? ((totalLoad - previousWeekLoad) / previousWeekLoad) * 100
      : 0;

    weeklySummaries.push({
      weekNumber: week + 1,
      totalLoad,
      sessionCount: weekLoads.length,
      avgSessionLoad: weekLoads.length > 0 ? totalLoad / weekLoads.length : 0,
      avgRPE: Math.round(avgRPE * 10) / 10,
      loadChange: Math.round(loadChange),
    });

    previousWeekLoad = totalLoad;
  }

  return weeklySummaries;
}

/**
 * Create daily load array from load records
 */
function createDailyLoadArray(loads: any[], days: number): number[] {
  const dailyLoads: number[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const dayLoad = loads
      .filter((l) => {
        const loadDate = new Date(l.recordDate);
        loadDate.setHours(0, 0, 0, 0);
        return loadDate.getTime() === date.getTime();
      })
      .reduce((sum, l) => sum + (l.dailyLoad || 0), 0);

    dailyLoads.push(dayLoad);
  }

  return dailyLoads;
}

/**
 * Check and create load alerts
 */
export async function checkLoadAlerts(athleteId: string): Promise<void> {
  const metrics = await calculateLoadMetrics(athleteId);

  if (!metrics) return;

  if (metrics.acwr > 1.5) {
    await prisma.fatigueAlert.create({
      data: {
        athleteId,
        alertType: 'ACWR_CRITICAL',
        severity: 'HIGH',
        message: `ACWR is ${metrics.acwr.toFixed(2)} - very high injury risk. Immediate load reduction recommended.`,
        alertDate: new Date(),
        acknowledged: false,
      },
    });
  } else if (metrics.acwr > 1.3) {
    await prisma.fatigueAlert.create({
      data: {
        athleteId,
        alertType: 'ACWR_HIGH',
        severity: 'MEDIUM',
        message: `ACWR is ${metrics.acwr.toFixed(2)} - elevated injury risk. Monitor closely.`,
        alertDate: new Date(),
        acknowledged: false,
      },
    });
  }

  if (metrics.monotony > 2.0) {
    await prisma.fatigueAlert.create({
      data: {
        athleteId,
        alertType: 'MONOTONY',
        severity: 'LOW',
        message: 'Training monotony is high. Consider varying session types.',
        alertDate: new Date(),
        acknowledged: false,
      },
    });
  }
}
