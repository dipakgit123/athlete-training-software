// ============================================
// LOAD MONITORING RULE ENGINE
// ACWR, Monotony, Strain, Spike Detection
// Based on Gabbett et al. Research
// ============================================

export interface DailyLoad {
  date: Date;
  sessionRPE: number;        // 1-10 scale
  durationMinutes: number;
  sessionLoad: number;       // RPE × Duration (sRPE-TL)
  trainingType?: string;     // SPEED, STRENGTH, ENDURANCE, etc.
}

export interface LoadAnalysisOutput {
  // Daily
  dailyLoad: number;

  // Rolling Averages
  acuteLoad: number;         // 7-day rolling average
  chronicLoad: number;       // 28-day rolling average

  // ACWR (Traditional)
  acwr: number;
  acwrStatus: 'OPTIMAL' | 'ATTENTION' | 'DANGER' | 'UNDERTRAINING';

  // EWMA (Exponentially Weighted Moving Average - More Sensitive)
  ewmaAcute: number;
  ewmaChronic: number;
  ewmaACWR: number;

  // Monotony & Strain (Foster)
  weeklyLoad: number;
  weeklyMean: number;
  weeklySD: number;
  monotony: number;          // Mean / SD (variety indicator)
  strain: number;            // Weekly Load × Monotony

  // Week-over-Week Change
  previousWeekLoad: number;
  weeklyLoadChange: number;  // % change
  loadSpike: boolean;        // > 15% increase

  // Risk Assessment
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  riskScore: number;         // 0-100
  riskReasons: string[];
  recommendations: string[];

  // Training Readiness Impact
  loadContributionToFatigue: number;  // 0-100
}

// ============================================
// REFERENCE THRESHOLDS
// ============================================

/**
 * ACWR Zones (Gabbett 2016)
 * Sweet spot: 0.8-1.3 (lowest injury risk)
 * Danger zone: >1.5 (injury risk increases 2-4x)
 */
export const ACWR_ZONES = {
  undertraining: { min: 0, max: 0.8, label: 'Under-training', injuryRiskMultiplier: 1.2 },
  optimal: { min: 0.8, max: 1.3, label: 'Sweet Spot', injuryRiskMultiplier: 1.0 },
  attention: { min: 1.3, max: 1.5, label: 'Caution Zone', injuryRiskMultiplier: 1.5 },
  danger: { min: 1.5, max: 999, label: 'Danger Zone', injuryRiskMultiplier: 3.0 }
};

/**
 * Monotony Thresholds (Foster 1998)
 * Monotony > 2.0 indicates lack of training variation
 */
export const MONOTONY_THRESHOLDS = {
  optimal: { max: 1.5, label: 'Good Variation' },
  attention: { max: 2.0, label: 'Moderate Variation' },
  danger: { max: 999, label: 'High Monotony - Increase Variation' }
};

/**
 * Strain Thresholds
 * Strain = Weekly Load × Monotony
 * Higher strain = higher illness/overtraining risk
 */
export const STRAIN_THRESHOLDS = {
  low: { max: 4000, label: 'Low Strain' },
  moderate: { max: 6000, label: 'Moderate Strain' },
  high: { max: 8000, label: 'High Strain' },
  veryHigh: { max: 999999, label: 'Very High Strain - Overreaching Risk' }
};

/**
 * Weekly Load Change Thresholds
 * >10% per week = increased injury risk
 * >15% = significant spike
 */
export const WEEKLY_CHANGE_THRESHOLDS = {
  safe: { max: 10, label: 'Safe Progression' },
  moderate: { max: 15, label: 'Moderate Increase' },
  spike: { max: 999, label: 'Load Spike Detected' }
};

// ============================================
// CALCULATION FUNCTIONS
// ============================================

/**
 * Calculate session load (sRPE-TL)
 */
export function calculateSessionLoad(rpe: number, durationMinutes: number): number {
  return rpe * durationMinutes;
}

/**
 * Calculate rolling average (acute or chronic)
 */
export function calculateRollingAverage(loads: DailyLoad[], days: number): number {
  if (loads.length === 0) return 0;

  const sorted = [...loads].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const relevantLoads = sorted.slice(0, days);
  const sum = relevantLoads.reduce((acc, d) => acc + d.sessionLoad, 0);

  return sum / days;
}

/**
 * Calculate ACWR (Acute:Chronic Workload Ratio)
 * Traditional rolling average method
 */
export function calculateACWR(loads: DailyLoad[]): {
  acwr: number;
  acuteLoad: number;
  chronicLoad: number;
} {
  const acuteLoad = calculateRollingAverage(loads, 7);
  const chronicLoad = calculateRollingAverage(loads, 28);

  const acwr = chronicLoad > 0 ? acuteLoad / chronicLoad : 0;

  return {
    acwr: Math.round(acwr * 100) / 100,
    acuteLoad: Math.round(acuteLoad),
    chronicLoad: Math.round(chronicLoad)
  };
}

/**
 * Calculate EWMA (Exponentially Weighted Moving Average)
 * More sensitive to recent changes than rolling average
 */
export function calculateEWMA(loads: DailyLoad[]): {
  ewmaAcute: number;
  ewmaChronic: number;
  ewmaACWR: number;
} {
  if (loads.length === 0) {
    return { ewmaAcute: 0, ewmaChronic: 0, ewmaACWR: 0 };
  }

  // EWMA decay constants
  // Lambda = 2 / (N + 1) where N is the time constant
  const lambdaAcute = 2 / (7 + 1);     // ~0.25 for 7-day
  const lambdaChronic = 2 / (28 + 1);  // ~0.069 for 28-day

  // Sort by date ascending
  const sorted = [...loads].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Initialize with first value
  let ewmaAcute = sorted[0].sessionLoad;
  let ewmaChronic = sorted[0].sessionLoad;

  // Calculate EWMA iteratively
  for (let i = 1; i < sorted.length; i++) {
    const load = sorted[i].sessionLoad;
    ewmaAcute = load * lambdaAcute + ewmaAcute * (1 - lambdaAcute);
    ewmaChronic = load * lambdaChronic + ewmaChronic * (1 - lambdaChronic);
  }

  const ewmaACWR = ewmaChronic > 0 ? ewmaAcute / ewmaChronic : 0;

  return {
    ewmaAcute: Math.round(ewmaAcute),
    ewmaChronic: Math.round(ewmaChronic),
    ewmaACWR: Math.round(ewmaACWR * 100) / 100
  };
}

/**
 * Calculate Monotony and Strain (Foster Method)
 */
export function calculateMonotonyAndStrain(loads: DailyLoad[]): {
  weeklyLoad: number;
  weeklyMean: number;
  weeklySD: number;
  monotony: number;
  strain: number;
} {
  // Get last 7 days
  const sorted = [...loads].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const last7Days = sorted.slice(0, 7);

  // Daily loads
  const dailyLoads = last7Days.map(d => d.sessionLoad);

  // Weekly total
  const weeklyLoad = dailyLoads.reduce((sum, l) => sum + l, 0);

  // Mean
  const weeklyMean = weeklyLoad / 7;

  // Standard Deviation
  const squaredDiffs = dailyLoads.map(l => Math.pow(l - weeklyMean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((sum, d) => sum + d, 0) / 7;
  const weeklySD = Math.sqrt(avgSquaredDiff);

  // Monotony = Mean / SD
  // Higher monotony = less variation = higher risk
  const monotony = weeklySD > 0 ? weeklyMean / weeklySD : 0;

  // Strain = Weekly Load × Monotony
  const strain = weeklyLoad * monotony;

  return {
    weeklyLoad: Math.round(weeklyLoad),
    weeklyMean: Math.round(weeklyMean),
    weeklySD: Math.round(weeklySD),
    monotony: Math.round(monotony * 100) / 100,
    strain: Math.round(strain)
  };
}

/**
 * Calculate week-over-week load change
 */
export function calculateWeeklyLoadChange(
  currentWeekLoad: number,
  previousWeekLoad: number
): { change: number; isSpike: boolean } {
  if (previousWeekLoad === 0) {
    return { change: 0, isSpike: false };
  }

  const change = ((currentWeekLoad - previousWeekLoad) / previousWeekLoad) * 100;
  const isSpike = change > 15;

  return {
    change: Math.round(change * 10) / 10,
    isSpike
  };
}

/**
 * Get ACWR status and zone
 */
export function getACWRStatus(acwr: number): {
  status: 'OPTIMAL' | 'ATTENTION' | 'DANGER' | 'UNDERTRAINING';
  zone: typeof ACWR_ZONES[keyof typeof ACWR_ZONES];
} {
  if (acwr < ACWR_ZONES.undertraining.max) {
    return { status: 'UNDERTRAINING', zone: ACWR_ZONES.undertraining };
  } else if (acwr <= ACWR_ZONES.optimal.max) {
    return { status: 'OPTIMAL', zone: ACWR_ZONES.optimal };
  } else if (acwr <= ACWR_ZONES.attention.max) {
    return { status: 'ATTENTION', zone: ACWR_ZONES.attention };
  } else {
    return { status: 'DANGER', zone: ACWR_ZONES.danger };
  }
}

// ============================================
// MAIN ANALYSIS FUNCTION
// ============================================

/**
 * Complete load analysis
 */
export function analyzeLoad(
  loads: DailyLoad[],
  previousWeekLoad?: number
): LoadAnalysisOutput {
  // Calculate all metrics
  const { acwr, acuteLoad, chronicLoad } = calculateACWR(loads);
  const { ewmaAcute, ewmaChronic, ewmaACWR } = calculateEWMA(loads);
  const { weeklyLoad, weeklyMean, weeklySD, monotony, strain } = calculateMonotonyAndStrain(loads);

  const prevWeek = previousWeekLoad ?? 0;
  const { change: weeklyLoadChange, isSpike: loadSpike } = calculateWeeklyLoadChange(weeklyLoad, prevWeek);

  // Get ACWR status
  const { status: acwrStatus } = getACWRStatus(acwr);

  // Risk Assessment
  const riskReasons: string[] = [];
  const recommendations: string[] = [];
  let riskScore = 0;

  // ACWR Risk
  if (acwr > 1.5) {
    riskReasons.push(`ACWR ${acwr.toFixed(2)} is in DANGER zone (>1.5) - injury risk increased 2-4x`);
    recommendations.push('IMMEDIATELY reduce acute load. Insert recovery day. Do not increase load this week.');
    riskScore += 40;
  } else if (acwr > 1.3) {
    riskReasons.push(`ACWR ${acwr.toFixed(2)} approaching danger zone (1.3-1.5)`);
    recommendations.push('Hold current load. Do not increase volume or intensity. Monitor closely.');
    riskScore += 20;
  } else if (acwr < 0.8) {
    riskReasons.push(`ACWR ${acwr.toFixed(2)} indicates under-training (<0.8) - detraining risk`);
    recommendations.push('Gradually increase load (max 10%/week) to return to optimal zone.');
    riskScore += 10;
  }

  // Monotony Risk
  if (monotony > 2.0) {
    riskReasons.push(`High monotony (${monotony.toFixed(2)}) - training lacks variation`);
    recommendations.push('Increase day-to-day load variation. Add distinct high/medium/low days.');
    riskScore += 25;
  } else if (monotony > 1.5) {
    riskReasons.push(`Elevated monotony (${monotony.toFixed(2)}) - consider more variation`);
    recommendations.push('Review weekly structure. Ensure adequate high/low day contrast.');
    riskScore += 10;
  }

  // Strain Risk
  if (strain > 8000) {
    riskReasons.push(`Very high strain (${strain}) - significant overreaching risk`);
    recommendations.push('DELOAD REQUIRED. Reduce weekly load by 40-50% next week.');
    riskScore += 35;
  } else if (strain > 6000) {
    riskReasons.push(`High strain (${strain}) - monitor for overreaching symptoms`);
    recommendations.push('Consider reducing load by 20-30% or adding extra recovery day.');
    riskScore += 20;
  } else if (strain > 4000) {
    riskReasons.push(`Moderate strain (${strain}) - within tolerable range`);
    riskScore += 5;
  }

  // Weekly Spike Risk
  if (loadSpike) {
    riskReasons.push(`Weekly load spike detected: ${weeklyLoadChange.toFixed(1)}% increase (>15%)`);
    recommendations.push('Large week-to-week increases elevate injury risk. Follow 10% rule.');
    riskScore += 20;
  } else if (weeklyLoadChange > 10) {
    riskReasons.push(`Moderate weekly increase: ${weeklyLoadChange.toFixed(1)}%`);
    recommendations.push('Approaching threshold. Be cautious with further increases.');
    riskScore += 10;
  }

  // EWMA vs Traditional discrepancy
  if (Math.abs(ewmaACWR - acwr) > 0.2) {
    if (ewmaACWR > acwr) {
      riskReasons.push('EWMA shows recent load increase not yet reflected in rolling average');
      riskScore += 10;
    }
  }

  // Determine overall risk level
  let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  if (riskScore >= 60) {
    riskLevel = 'VERY_HIGH';
    recommendations.unshift('⚠️ IMMEDIATE ACTION REQUIRED: High injury/overtraining risk detected.');
  } else if (riskScore >= 40) {
    riskLevel = 'HIGH';
    recommendations.unshift('⚡ CAUTION: Elevated risk factors. Review training plan.');
  } else if (riskScore >= 20) {
    riskLevel = 'MODERATE';
  } else {
    riskLevel = 'LOW';
    if (recommendations.length === 0) {
      recommendations.push('Load management within acceptable parameters. Continue as planned.');
    }
  }

  // Load contribution to fatigue (0-100)
  const loadContributionToFatigue = Math.min(100, Math.round(
    (acwr > 1.3 ? (acwr - 1) * 50 : 0) +
    (monotony > 1.5 ? (monotony - 1) * 20 : 0) +
    (strain > 4000 ? (strain - 4000) / 100 : 0)
  ));

  return {
    dailyLoad: loads.length > 0 ? loads[loads.length - 1].sessionLoad : 0,
    acuteLoad,
    chronicLoad,
    acwr,
    acwrStatus,
    ewmaAcute,
    ewmaChronic,
    ewmaACWR,
    weeklyLoad,
    weeklyMean,
    weeklySD,
    monotony,
    strain,
    previousWeekLoad: prevWeek,
    weeklyLoadChange,
    loadSpike,
    riskLevel,
    riskScore: Math.min(100, riskScore),
    riskReasons,
    recommendations,
    loadContributionToFatigue
  };
}

/**
 * Generate load monitoring report
 */
export function generateLoadReport(analysis: LoadAnalysisOutput): string {
  let report = '# LOAD MONITORING REPORT\n\n';

  // Risk Level Banner
  const riskEmoji = {
    LOW: '✅',
    MODERATE: '⚡',
    HIGH: '⚠️',
    VERY_HIGH: '🔴'
  };

  report += `## Risk Level: ${riskEmoji[analysis.riskLevel]} ${analysis.riskLevel}\n`;
  report += `Risk Score: ${analysis.riskScore}/100\n\n`;

  // Key Metrics Table
  report += '## Key Metrics\n\n';
  report += '| Metric | Value | Status |\n';
  report += '|--------|-------|--------|\n';
  report += `| ACWR | ${analysis.acwr.toFixed(2)} | ${analysis.acwrStatus} |\n`;
  report += `| EWMA ACWR | ${analysis.ewmaACWR.toFixed(2)} | - |\n`;
  report += `| Monotony | ${analysis.monotony.toFixed(2)} | ${analysis.monotony > 2 ? 'HIGH' : analysis.monotony > 1.5 ? 'MODERATE' : 'GOOD'} |\n`;
  report += `| Strain | ${analysis.strain} | ${analysis.strain > 6000 ? 'HIGH' : analysis.strain > 4000 ? 'MODERATE' : 'LOW'} |\n`;
  report += `| Weekly Change | ${analysis.weeklyLoadChange.toFixed(1)}% | ${analysis.loadSpike ? 'SPIKE!' : 'OK'} |\n`;
  report += '\n';

  // Load Summary
  report += '## Load Summary\n\n';
  report += `- **Acute Load (7-day):** ${analysis.acuteLoad} AU\n`;
  report += `- **Chronic Load (28-day):** ${analysis.chronicLoad} AU\n`;
  report += `- **Weekly Total:** ${analysis.weeklyLoad} AU\n`;
  report += `- **Previous Week:** ${analysis.previousWeekLoad} AU\n`;
  report += '\n';

  // Risk Factors
  if (analysis.riskReasons.length > 0) {
    report += '## Risk Factors\n\n';
    for (const reason of analysis.riskReasons) {
      report += `- ${reason}\n`;
    }
    report += '\n';
  }

  // Recommendations
  report += '## Recommendations\n\n';
  for (const rec of analysis.recommendations) {
    report += `- ${rec}\n`;
  }

  return report;
}

/**
 * Calculate optimal load range for next week
 */
export function calculateOptimalLoadRange(chronicLoad: number): {
  minLoad: number;
  maxLoad: number;
  targetLoad: number;
  message: string;
} {
  // Optimal ACWR range: 0.8 - 1.3
  // Weekly load = Acute load (since we're planning weekly)

  const minLoad = Math.round(chronicLoad * 0.8 * 7);   // Lower bound (ACWR = 0.8)
  const maxLoad = Math.round(chronicLoad * 1.3 * 7);   // Upper bound (ACWR = 1.3)
  const targetLoad = Math.round(chronicLoad * 1.0 * 7); // Optimal (ACWR = 1.0)

  return {
    minLoad,
    maxLoad,
    targetLoad,
    message: `Target weekly load: ${targetLoad} AU (range: ${minLoad} - ${maxLoad} AU) to maintain optimal ACWR`
  };
}
