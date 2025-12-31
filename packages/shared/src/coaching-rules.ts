/**
 * COACHING DECISION RULES ENGINE
 * World-Class Athletics Performance System
 *
 * Plots पाहून coach ने निर्णय कसे घ्यायचे ते practical rules
 * Indian athletics साठी योग्य
 */

import { TestDefinition, TEST_DEFINITIONS, ValueDirection } from './event-test-mapping';

// ============================================
// DECISION RULE TYPES
// ============================================

export type TrendDirection = 'improving' | 'stable' | 'declining' | 'fluctuating';
export type DecisionPriority = 'critical' | 'high' | 'medium' | 'low';
export type ActionType =
  | 'increase_load'
  | 'maintain_load'
  | 'decrease_load'
  | 'deload_week'
  | 'focus_technique'
  | 'injury_prevention'
  | 'competition_ready'
  | 'recovery_focus'
  | 'strength_focus'
  | 'power_focus'
  | 'speed_focus'
  | 'endurance_focus';

export interface PerformanceTrend {
  testId: string;
  currentValue: number;
  previousValue: number;
  percentChange: number;
  trend: TrendDirection;
  dataPoints: number;
  consistencyScore: number; // 0-100
}

export interface CoachingDecision {
  action: ActionType;
  priority: DecisionPriority;
  reason: string;
  reasonMarathi: string;
  recommendation: string;
  recommendationMarathi: string;
  metrics: string[];
  targetAdjustment?: number; // Percentage change recommended
}

export interface ReadinessAssessment {
  overallScore: number; // 0-100
  category: 'excellent' | 'good' | 'moderate' | 'poor' | 'critical';
  competitionReady: boolean;
  limitingFactors: string[];
  strengths: string[];
}

// ============================================
// BENCHMARK DATA - INDIAN ATHLETICS SPECIFIC
// ============================================

export const INDIAN_BENCHMARKS = {
  // Sprint Events - Male Senior
  sprint_100m: {
    worldClass: 9.85,
    nationalElite: 10.20,
    stateLevel: 10.60,
    district: 11.20
  },
  sprint_200m: {
    worldClass: 19.80,
    nationalElite: 20.60,
    stateLevel: 21.50,
    district: 22.50
  },
  sprint_400m: {
    worldClass: 44.00,
    nationalElite: 46.00,
    stateLevel: 48.00,
    district: 50.00
  },

  // Power Metrics
  cmj_height_male: {
    elite: 55,
    good: 45,
    average: 38,
    belowAverage: 30
  },
  cmj_height_female: {
    elite: 45,
    good: 38,
    average: 32,
    belowAverage: 25
  },

  // Strength Ratios
  squat_to_bodyweight: {
    elite: 2.0,
    good: 1.7,
    average: 1.4,
    belowAverage: 1.1
  },

  // Injury Prevention Thresholds
  ham_quad_ratio: {
    optimal_min: 0.60,
    optimal_max: 0.80,
    risk_threshold: 0.55
  },

  // Asymmetry Thresholds
  bilateral_asymmetry: {
    acceptable: 10, // %
    attention: 15,
    concern: 20
  }
};

// ============================================
// TREND ANALYSIS FUNCTIONS
// ============================================

/**
 * Calculate performance trend from test results
 * वेळोवेळी केलेल्या tests वरून trend काढणे
 */
export function calculateTrend(
  values: { date: Date; value: number }[],
  valueDirection: ValueDirection
): PerformanceTrend | null {
  if (values.length < 2) return null;

  // Sort by date
  const sorted = [...values].sort((a, b) => a.date.getTime() - b.date.getTime());

  const currentValue = sorted[sorted.length - 1].value;
  const previousValue = sorted[sorted.length - 2].value;

  // Calculate percent change
  let percentChange = ((currentValue - previousValue) / previousValue) * 100;

  // Determine trend direction
  let trend: TrendDirection;

  if (valueDirection === 'lower_better') {
    // For time-based tests where lower is better
    if (percentChange < -2) trend = 'improving';
    else if (percentChange > 2) trend = 'declining';
    else trend = 'stable';
    percentChange = -percentChange; // Invert for display
  } else if (valueDirection === 'higher_better') {
    if (percentChange > 2) trend = 'improving';
    else if (percentChange < -2) trend = 'declining';
    else trend = 'stable';
  } else {
    // For optimal range tests
    trend = 'stable'; // Would need target value to determine
  }

  // Calculate consistency (coefficient of variation)
  const mean = sorted.reduce((sum, v) => sum + v.value, 0) / sorted.length;
  const variance = sorted.reduce((sum, v) => sum + Math.pow(v.value - mean, 2), 0) / sorted.length;
  const stdDev = Math.sqrt(variance);
  const cv = (stdDev / mean) * 100;
  const consistencyScore = Math.max(0, 100 - cv * 5); // Lower CV = higher consistency

  return {
    testId: '',
    currentValue,
    previousValue,
    percentChange,
    trend,
    dataPoints: sorted.length,
    consistencyScore
  };
}

// ============================================
// COACHING DECISION RULES
// ============================================

/**
 * Main coaching decision function
 * Coach साठी practical decision rules
 */
export function getCoachingDecision(
  testId: string,
  trend: PerformanceTrend,
  athleteContext: {
    phase: string;
    weeksToCompetition?: number;
    currentLoad: number; // 1-10 scale
    fatigueLevel: number; // 1-10 scale
    injuryHistory?: string[];
  }
): CoachingDecision {
  const test = TEST_DEFINITIONS[testId];
  if (!test) {
    return {
      action: 'maintain_load',
      priority: 'low',
      reason: 'Unknown test',
      reasonMarathi: 'अज्ञात test',
      recommendation: 'Continue current program',
      recommendationMarathi: 'सध्याचा प्रोग्राम चालू ठेवा',
      metrics: []
    };
  }

  const { phase, weeksToCompetition, currentLoad, fatigueLevel } = athleteContext;

  // Competition proximity rules
  if (weeksToCompetition !== undefined && weeksToCompetition <= 2) {
    return getCompetitionPhaseDecision(test, trend, weeksToCompetition);
  }

  // High fatigue rules
  if (fatigueLevel >= 8) {
    return {
      action: 'deload_week',
      priority: 'critical',
      reason: 'High fatigue detected - recovery needed',
      reasonMarathi: 'थकवा जास्त आहे - आराम गरजेचा',
      recommendation: 'Reduce volume by 40-50%, maintain intensity at 70-75%',
      recommendationMarathi: 'Volume 40-50% कमी करा, intensity 70-75% ठेवा',
      metrics: ['fatigue_score', 'sleep_quality', 'hrv'],
      targetAdjustment: -40
    };
  }

  // Performance-based decisions
  return getPerformanceBasedDecision(test, trend, phase, currentLoad);
}

/**
 * Competition phase specific decisions
 * स्पर्धा जवळ आल्यावर काय करायचे
 */
function getCompetitionPhaseDecision(
  test: TestDefinition,
  trend: PerformanceTrend,
  weeksOut: number
): CoachingDecision {
  if (weeksOut <= 1) {
    return {
      action: 'competition_ready',
      priority: 'critical',
      reason: 'Competition week - taper and peak',
      reasonMarathi: 'स्पर्धेचा आठवडा - taper आणि peak',
      recommendation: 'Very light technical work only. Focus on rest and mental preparation.',
      recommendationMarathi: 'फक्त हलके technical काम. आराम आणि mental तयारी वर लक्ष.',
      metrics: ['readiness_score', 'sleep_quality'],
      targetAdjustment: -70
    };
  }

  if (trend.trend === 'improving') {
    return {
      action: 'maintain_load',
      priority: 'high',
      reason: 'Positive trend approaching competition',
      reasonMarathi: 'स्पर्धेआधी चांगला trend',
      recommendation: 'Maintain current approach. Light taper starting.',
      recommendationMarathi: 'सध्याचा approach ठेवा. हलका taper सुरू करा.',
      metrics: [test.id],
      targetAdjustment: -20
    };
  }

  return {
    action: 'focus_technique',
    priority: 'high',
    reason: 'Competition approaching - focus on execution',
    reasonMarathi: 'स्पर्धा जवळ - execution वर लक्ष',
    recommendation: 'Prioritize technique and race-specific work over volume.',
    recommendationMarathi: 'Volume पेक्षा technique आणि race-specific काम वर भर.',
    metrics: [test.id],
    targetAdjustment: -30
  };
}

/**
 * Performance trend based decisions
 * Performance वरून निर्णय
 */
function getPerformanceBasedDecision(
  test: TestDefinition,
  trend: PerformanceTrend,
  phase: string,
  currentLoad: number
): CoachingDecision {
  // Improving trend
  if (trend.trend === 'improving' && trend.consistencyScore >= 70) {
    if (currentLoad < 7) {
      return {
        action: 'increase_load',
        priority: 'medium',
        reason: `${test.displayName} showing ${trend.percentChange.toFixed(1)}% improvement with good consistency`,
        reasonMarathi: `${test.displayName} मध्ये ${trend.percentChange.toFixed(1)}% सुधारणा, चांगली consistency`,
        recommendation: 'Progressive overload - increase volume or intensity by 5-10%',
        recommendationMarathi: 'Progressive overload - volume किंवा intensity 5-10% वाढवा',
        metrics: [test.id],
        targetAdjustment: 10
      };
    }
    return {
      action: 'maintain_load',
      priority: 'low',
      reason: 'Good progress at current load',
      reasonMarathi: 'सध्याच्या load वर चांगली प्रगती',
      recommendation: 'Continue current program',
      recommendationMarathi: 'सध्याचा प्रोग्राम चालू ठेवा',
      metrics: [test.id]
    };
  }

  // Declining trend
  if (trend.trend === 'declining') {
    if (trend.percentChange < -5) {
      return {
        action: 'decrease_load',
        priority: 'high',
        reason: `${test.displayName} dropped ${Math.abs(trend.percentChange).toFixed(1)}% - possible overreaching`,
        reasonMarathi: `${test.displayName} ${Math.abs(trend.percentChange).toFixed(1)}% कमी झाले - overreaching शक्य`,
        recommendation: 'Reduce training load by 20-30%. Check recovery markers.',
        recommendationMarathi: 'Training load 20-30% कमी करा. Recovery markers तपासा.',
        metrics: [test.id, 'sleep_quality', 'hrv', 'rpe'],
        targetAdjustment: -25
      };
    }
    return {
      action: 'recovery_focus',
      priority: 'medium',
      reason: `Minor decline in ${test.displayName}`,
      reasonMarathi: `${test.displayName} मध्ये थोडी घट`,
      recommendation: 'Add extra recovery day. Review sleep and nutrition.',
      recommendationMarathi: 'एक extra recovery day घ्या. झोप आणि nutrition तपासा.',
      metrics: [test.id],
      targetAdjustment: -10
    };
  }

  // Stable but fluctuating
  if (trend.consistencyScore < 50) {
    return {
      action: 'focus_technique',
      priority: 'medium',
      reason: 'High variability in test results',
      reasonMarathi: 'Test results मध्ये जास्त variation',
      recommendation: 'Focus on consistent execution. May need technique refinement.',
      recommendationMarathi: 'Consistent execution वर लक्ष द्या. Technique सुधारणा गरजेची असू शकते.',
      metrics: [test.id]
    };
  }

  // Stable performance
  return {
    action: 'maintain_load',
    priority: 'low',
    reason: 'Performance stable',
    reasonMarathi: 'Performance स्थिर आहे',
    recommendation: 'Continue current approach. Consider introducing new stimulus if plateau persists.',
    recommendationMarathi: 'सध्याचा approach चालू ठेवा. Plateau राहिल्यास नवीन stimulus द्या.',
    metrics: [test.id]
  };
}

// ============================================
// LOAD MANAGEMENT RULES
// ============================================

/**
 * When to increase load
 * Load कधी वाढवायचा
 */
export const LOAD_INCREASE_RULES = {
  conditions: [
    'Test performance improving >5% over 2+ sessions',
    'Consistency score >70%',
    'Fatigue level <6/10',
    'Sleep quality >7/10 for past week',
    'No injury concerns',
    'HRV stable or improving'
  ],
  conditionsMarathi: [
    'Test performance 2+ sessions मध्ये >5% सुधारत आहे',
    'Consistency score >70%',
    'Fatigue level <6/10',
    'मागच्या आठवड्यात झोप >7/10',
    'कोणतीही injury concern नाही',
    'HRV स्थिर किंवा सुधारत आहे'
  ],
  adjustments: {
    volume: '+5-10%',
    intensity: '+2-5%',
    frequency: 'Add 1 session per week (max)'
  }
};

/**
 * When to decrease load / Deload
 * Load कधी कमी करायचा / Deload
 */
export const DELOAD_RULES = {
  triggers: [
    'Performance declining >5% over 2+ sessions',
    'Fatigue consistently >7/10',
    'Sleep quality <6/10 for 3+ days',
    'HRV dropping >10% from baseline',
    'Persistent muscle soreness >7/10',
    'After 3-4 weeks of progressive overload'
  ],
  triggersMarathi: [
    '2+ sessions मध्ये Performance >5% कमी होत आहे',
    'Fatigue सातत्याने >7/10',
    '3+ दिवस झोप <6/10',
    'HRV baseline पेक्षा >10% कमी',
    'सातत्याने स्नायू दुखणे >7/10',
    '3-4 आठवडे progressive overload नंतर'
  ],
  protocol: {
    duration: '5-7 days',
    volumeReduction: '40-50%',
    intensityReduction: '10-15%',
    focusAreas: ['Technique', 'Mobility', 'Recovery']
  }
};

// ============================================
// COMPETITION READINESS ASSESSMENT
// ============================================

/**
 * Assess if athlete is competition ready
 * Athlete competition-ready आहे का हे ओळखणे
 */
export function assessCompetitionReadiness(
  testResults: Map<string, number>,
  targetEvent: string,
  benchmarks: typeof INDIAN_BENCHMARKS
): ReadinessAssessment {
  const strengths: string[] = [];
  const limitingFactors: string[] = [];
  let totalScore = 0;
  let testCount = 0;

  // Evaluate each test against benchmarks
  testResults.forEach((value, testId) => {
    const test = TEST_DEFINITIONS[testId];
    if (!test) return;

    // Compare to benchmarks (simplified)
    const benchmarkKey = testId as keyof typeof benchmarks;
    const benchmark = benchmarks[benchmarkKey];

    if (benchmark && typeof benchmark === 'object' && 'elite' in benchmark) {
      const score = calculateBenchmarkScore(value, benchmark, test.valueDirection);
      totalScore += score;
      testCount++;

      if (score >= 80) {
        strengths.push(test.displayName);
      } else if (score < 50) {
        limitingFactors.push(test.displayName);
      }
    }
  });

  const overallScore = testCount > 0 ? totalScore / testCount : 0;

  return {
    overallScore,
    category: getReadinessCategory(overallScore),
    competitionReady: overallScore >= 70 && limitingFactors.length <= 1,
    limitingFactors,
    strengths
  };
}

function calculateBenchmarkScore(
  value: number,
  benchmark: { elite: number; good: number; average: number; belowAverage: number },
  direction: ValueDirection
): number {
  if (direction === 'lower_better') {
    if (value <= benchmark.elite) return 100;
    if (value <= benchmark.good) return 80;
    if (value <= benchmark.average) return 60;
    if (value <= benchmark.belowAverage) return 40;
    return 20;
  } else {
    if (value >= benchmark.elite) return 100;
    if (value >= benchmark.good) return 80;
    if (value >= benchmark.average) return 60;
    if (value >= benchmark.belowAverage) return 40;
    return 20;
  }
}

function getReadinessCategory(score: number): ReadinessAssessment['category'] {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 55) return 'moderate';
  if (score >= 40) return 'poor';
  return 'critical';
}

// ============================================
// INJURY RISK ASSESSMENT
// ============================================

export interface InjuryRiskAssessment {
  overallRisk: 'low' | 'moderate' | 'high' | 'critical';
  riskScore: number; // 0-100
  riskFactors: {
    factor: string;
    factorMarathi: string;
    severity: 'low' | 'medium' | 'high';
    recommendation: string;
    recommendationMarathi: string;
  }[];
}

/**
 * Assess injury risk based on test results
 * Injury risk संकेत
 */
export function assessInjuryRisk(
  testResults: Map<string, { left?: number; right?: number; value?: number }>
): InjuryRiskAssessment {
  const riskFactors: InjuryRiskAssessment['riskFactors'] = [];
  let totalRiskScore = 0;
  let factorCount = 0;

  // Check H:Q ratio
  const hqLeft = testResults.get('ham_quad_ratio')?.left;
  const hqRight = testResults.get('ham_quad_ratio')?.right;

  if (hqLeft && hqLeft < INDIAN_BENCHMARKS.ham_quad_ratio.risk_threshold) {
    riskFactors.push({
      factor: 'Low H:Q ratio (Left)',
      factorMarathi: 'H:Q ratio कमी (डावा)',
      severity: hqLeft < 0.50 ? 'high' : 'medium',
      recommendation: 'Increase hamstring strengthening exercises',
      recommendationMarathi: 'Hamstring strengthening exercises वाढवा'
    });
    totalRiskScore += hqLeft < 0.50 ? 30 : 15;
    factorCount++;
  }

  if (hqRight && hqRight < INDIAN_BENCHMARKS.ham_quad_ratio.risk_threshold) {
    riskFactors.push({
      factor: 'Low H:Q ratio (Right)',
      factorMarathi: 'H:Q ratio कमी (उजवा)',
      severity: hqRight < 0.50 ? 'high' : 'medium',
      recommendation: 'Increase hamstring strengthening exercises',
      recommendationMarathi: 'Hamstring strengthening exercises वाढवा'
    });
    totalRiskScore += hqRight < 0.50 ? 30 : 15;
    factorCount++;
  }

  // Check bilateral asymmetry
  const cmjLeft = testResults.get('single_leg_cmj_left')?.value;
  const cmjRight = testResults.get('single_leg_cmj_right')?.value;

  if (cmjLeft && cmjRight) {
    const asymmetry = Math.abs(cmjLeft - cmjRight) / Math.max(cmjLeft, cmjRight) * 100;

    if (asymmetry > INDIAN_BENCHMARKS.bilateral_asymmetry.concern) {
      riskFactors.push({
        factor: `High leg asymmetry (${asymmetry.toFixed(1)}%)`,
        factorMarathi: `पाय असममितता जास्त (${asymmetry.toFixed(1)}%)`,
        severity: 'high',
        recommendation: 'Focus on unilateral exercises for weaker leg',
        recommendationMarathi: 'कमकुवत पायासाठी unilateral exercises वर लक्ष द्या'
      });
      totalRiskScore += 25;
      factorCount++;
    } else if (asymmetry > INDIAN_BENCHMARKS.bilateral_asymmetry.attention) {
      riskFactors.push({
        factor: `Moderate leg asymmetry (${asymmetry.toFixed(1)}%)`,
        factorMarathi: `पाय असममितता मध्यम (${asymmetry.toFixed(1)}%)`,
        severity: 'medium',
        recommendation: 'Monitor and include corrective exercises',
        recommendationMarathi: 'लक्ष ठेवा आणि corrective exercises समाविष्ट करा'
      });
      totalRiskScore += 10;
      factorCount++;
    }
  }

  // Check ankle dorsiflexion
  const ankleLeft = testResults.get('ankle_dorsiflexion')?.left;
  const ankleRight = testResults.get('ankle_dorsiflexion')?.right;

  if (ankleLeft && ankleLeft < 10) {
    riskFactors.push({
      factor: 'Limited ankle dorsiflexion (Left)',
      factorMarathi: 'घोट्याची mobility कमी (डावा)',
      severity: ankleLeft < 7 ? 'high' : 'medium',
      recommendation: 'Daily ankle mobility work and calf stretching',
      recommendationMarathi: 'दररोज ankle mobility आणि calf stretching करा'
    });
    totalRiskScore += ankleLeft < 7 ? 20 : 10;
    factorCount++;
  }

  if (ankleRight && ankleRight < 10) {
    riskFactors.push({
      factor: 'Limited ankle dorsiflexion (Right)',
      factorMarathi: 'घोट्याची mobility कमी (उजवा)',
      severity: ankleRight < 7 ? 'high' : 'medium',
      recommendation: 'Daily ankle mobility work and calf stretching',
      recommendationMarathi: 'दररोज ankle mobility आणि calf stretching करा'
    });
    totalRiskScore += ankleRight < 7 ? 20 : 10;
    factorCount++;
  }

  // Calculate overall risk
  const riskScore = factorCount > 0 ? Math.min(100, totalRiskScore) : 0;

  let overallRisk: InjuryRiskAssessment['overallRisk'];
  if (riskScore >= 60) overallRisk = 'critical';
  else if (riskScore >= 40) overallRisk = 'high';
  else if (riskScore >= 20) overallRisk = 'moderate';
  else overallRisk = 'low';

  return {
    overallRisk,
    riskScore,
    riskFactors
  };
}

// ============================================
// LONG-TERM TREND ANALYSIS
// ============================================

export interface LongTermTrend {
  testId: string;
  period: string; // e.g., "3 months", "6 months", "1 year"
  startValue: number;
  endValue: number;
  totalChange: number;
  totalChangePercent: number;
  averageMonthlyImprovement: number;
  projectedValue?: number; // 3 months ahead projection
  seasonalPattern?: string;
}

/**
 * Analyze long-term performance trend
 * Long-term performance trend analysis
 */
export function analyzeLongTermTrend(
  values: { date: Date; value: number }[],
  testId: string,
  valueDirection: ValueDirection
): LongTermTrend | null {
  if (values.length < 4) return null;

  const sorted = [...values].sort((a, b) => a.date.getTime() - b.date.getTime());
  const startDate = sorted[0].date;
  const endDate = sorted[sorted.length - 1].date;

  const monthsDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

  const startValue = sorted[0].value;
  const endValue = sorted[sorted.length - 1].value;

  let totalChange = endValue - startValue;
  let totalChangePercent = (totalChange / startValue) * 100;

  // Adjust for direction
  if (valueDirection === 'lower_better') {
    totalChange = -totalChange;
    totalChangePercent = -totalChangePercent;
  }

  const averageMonthlyImprovement = totalChangePercent / monthsDiff;

  // Simple linear projection
  const projectedValue = endValue + (totalChange / monthsDiff) * 3;

  // Determine period string
  let period: string;
  if (monthsDiff >= 12) period = `${Math.round(monthsDiff / 12)} year(s)`;
  else period = `${Math.round(monthsDiff)} months`;

  return {
    testId,
    period,
    startValue,
    endValue,
    totalChange,
    totalChangePercent,
    averageMonthlyImprovement,
    projectedValue: valueDirection === 'lower_better' ? endValue - (totalChange / monthsDiff) * 3 : projectedValue
  };
}
