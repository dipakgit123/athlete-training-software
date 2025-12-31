/**
 * Readiness Calculator Rules
 * AI-Driven Athlete Readiness Assessment System
 * Elite Athletics Performance System
 */

// ==================== READINESS WEIGHTS ====================

export interface ReadinessWeights {
  sleep: number;
  hrv: number;
  fatigue: number;
  soreness: number;
  stress: number;
  mood: number;
  nutrition: number;
  hydration: number;
  acwr: number;
  bloodStatus: number;
}

// Default weights - can be customized per athlete
export const DEFAULT_READINESS_WEIGHTS: ReadinessWeights = {
  sleep: 0.20,        // 20% - Most critical
  hrv: 0.15,          // 15% - Autonomic nervous system
  fatigue: 0.15,      // 15% - Perceived fatigue
  soreness: 0.10,     // 10% - Muscle soreness
  stress: 0.10,       // 10% - Mental stress
  mood: 0.05,         // 5%  - Psychological state
  nutrition: 0.08,    // 8%  - Nutritional compliance
  hydration: 0.07,    // 7%  - Hydration status
  acwr: 0.05,         // 5%  - Training load ratio
  bloodStatus: 0.05   // 5%  - Blood markers status
};

// Event-specific weight adjustments
export const EVENT_SPECIFIC_WEIGHTS: Record<string, Partial<ReadinessWeights>> = {
  // Sprints - Neural readiness critical
  '100M': { hrv: 0.20, sleep: 0.22, fatigue: 0.18 },
  '200M': { hrv: 0.20, sleep: 0.22, fatigue: 0.18 },
  '400M': { hrv: 0.18, fatigue: 0.18, soreness: 0.12 },

  // Middle Distance - Mixed demands
  '800M': { hrv: 0.16, fatigue: 0.16, soreness: 0.12 },
  '1500M': { hrv: 0.15, fatigue: 0.16, nutrition: 0.10 },

  // Long Distance - Recovery and nutrition critical
  '5000M': { fatigue: 0.18, nutrition: 0.12, hydration: 0.10 },
  '10000M': { fatigue: 0.18, nutrition: 0.12, hydration: 0.10 },
  'MARATHON': { fatigue: 0.20, nutrition: 0.15, hydration: 0.12, bloodStatus: 0.08 },

  // Hurdles - Neural + mechanical
  '110M_HURDLES': { hrv: 0.20, sleep: 0.22, soreness: 0.12 },
  '400M_HURDLES': { hrv: 0.18, fatigue: 0.18, soreness: 0.12 },

  // Jumps - Neural readiness paramount
  'LONG_JUMP': { hrv: 0.22, sleep: 0.22, soreness: 0.12 },
  'TRIPLE_JUMP': { hrv: 0.22, sleep: 0.22, soreness: 0.14 },
  'HIGH_JUMP': { hrv: 0.22, sleep: 0.22, soreness: 0.12 },
  'POLE_VAULT': { hrv: 0.20, sleep: 0.22, soreness: 0.12 },

  // Throws - Power readiness
  'SHOT_PUT': { hrv: 0.18, sleep: 0.20, soreness: 0.14 },
  'DISCUS': { hrv: 0.18, sleep: 0.20, soreness: 0.14 },
  'JAVELIN': { hrv: 0.18, sleep: 0.20, soreness: 0.14 },
  'HAMMER': { hrv: 0.18, sleep: 0.20, soreness: 0.14 },

  // Combined Events
  'DECATHLON': { fatigue: 0.18, nutrition: 0.12, sleep: 0.22 },
  'HEPTATHLON': { fatigue: 0.18, nutrition: 0.12, sleep: 0.22 }
};

// ==================== INPUT METRICS ====================

export interface WellnessInput {
  sleepHours: number;           // 0-12 hours
  sleepQuality: number;         // 1-10 scale
  restingHR: number;            // bpm
  hrvMssd: number;              // ms (RMSSD)
  perceivedFatigue: number;     // 1-10 scale (10 = extremely fatigued)
  muscleSoreness: number;       // 1-10 scale (10 = very sore)
  stressLevel: number;          // 1-10 scale (10 = very stressed)
  mood: number;                 // 1-10 scale (10 = excellent)
  nutritionCompliance: number;  // 0-100%
  hydrationStatus: number;      // 1-10 scale
}

export interface TrainingLoadInput {
  acwr: number;                 // Acute:Chronic ratio
  weeklyLoadChange: number;     // % change from previous week
  monotony: number;             // Training monotony
  strain: number;               // Training strain
}

export interface BloodStatusInput {
  overallStatus: 'optimal' | 'attention' | 'concern';
  hemoglobinStatus: 'normal' | 'low' | 'high';
  ferritinStatus: 'normal' | 'low' | 'high';
  inflammationStatus: 'normal' | 'elevated';
}

export interface ReadinessInput {
  wellness: WellnessInput;
  trainingLoad?: TrainingLoadInput;
  bloodStatus?: BloodStatusInput;
  athleteEvent?: string;
  athleteBaselines?: AthleteBaselines;
}

// ==================== ATHLETE BASELINES ====================

export interface AthleteBaselines {
  restingHR: number;            // Individual baseline resting HR
  hrvBaseline: number;          // Individual HRV baseline (RMSSD)
  avgSleepHours: number;        // Typical sleep duration
  hrvCoefficientOfVariation: number; // Normal HRV variability
}

export const DEFAULT_BASELINES: AthleteBaselines = {
  restingHR: 55,
  hrvBaseline: 65,
  avgSleepHours: 8,
  hrvCoefficientOfVariation: 0.10
};

// ==================== SCORING FUNCTIONS ====================

/**
 * Calculate sleep score (0-100)
 */
export function calculateSleepScore(
  hours: number,
  quality: number,
  baseline: number = 8
): number {
  // Hours score: optimal is baseline hours, penalty for under/over
  let hoursScore: number;
  if (hours >= baseline) {
    hoursScore = Math.min(100, 100 - (hours - baseline) * 5); // Slight penalty for oversleep
  } else {
    hoursScore = Math.max(0, (hours / baseline) * 100);
  }

  // Quality score: 1-10 mapped to 0-100
  const qualityScore = (quality / 10) * 100;

  // Combined: 60% hours, 40% quality
  return Math.round(hoursScore * 0.6 + qualityScore * 0.4);
}

/**
 * Calculate HRV score (0-100)
 * Based on deviation from personal baseline
 */
export function calculateHRVScore(
  currentHRV: number,
  baseline: number,
  cv: number = 0.10 // coefficient of variation
): number {
  // Calculate z-score relative to baseline
  const deviation = (currentHRV - baseline) / (baseline * cv);

  // Scoring:
  // HRV at baseline = 75 points
  // HRV 1 SD above = 90 points
  // HRV 2 SD above = 100 points
  // HRV 1 SD below = 60 points
  // HRV 2 SD below = 40 points

  let score: number;
  if (deviation >= 0) {
    score = 75 + Math.min(25, deviation * 12.5);
  } else {
    score = 75 + Math.max(-35, deviation * 17.5);
  }

  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Calculate resting HR score (0-100)
 * Lower is better, elevated indicates stress/incomplete recovery
 */
export function calculateRestingHRScore(
  currentHR: number,
  baseline: number
): number {
  const deviation = currentHR - baseline;

  // Scoring:
  // At baseline = 85 points
  // 5 bpm below = 95 points
  // 5 bpm above = 70 points
  // 10 bpm above = 50 points

  let score: number;
  if (deviation <= 0) {
    score = 85 + Math.min(15, Math.abs(deviation) * 2);
  } else {
    score = 85 - deviation * 3.5;
  }

  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Calculate fatigue score (0-100)
 * Input: 1-10 where 10 = extremely fatigued
 * Output: 0-100 where 100 = fully recovered
 */
export function calculateFatigueScore(perceivedFatigue: number): number {
  // Invert scale: 1 = 100, 10 = 0
  return Math.round(((10 - perceivedFatigue) / 9) * 100);
}

/**
 * Calculate soreness score (0-100)
 * Input: 1-10 where 10 = very sore
 * Output: 0-100 where 100 = no soreness
 */
export function calculateSorenessScore(soreness: number): number {
  return Math.round(((10 - soreness) / 9) * 100);
}

/**
 * Calculate stress score (0-100)
 * Input: 1-10 where 10 = very stressed
 * Output: 0-100 where 100 = stress-free
 */
export function calculateStressScore(stressLevel: number): number {
  return Math.round(((10 - stressLevel) / 9) * 100);
}

/**
 * Calculate mood score (0-100)
 * Input: 1-10 where 10 = excellent mood
 */
export function calculateMoodScore(mood: number): number {
  return Math.round((mood / 10) * 100);
}

/**
 * Calculate nutrition score (0-100)
 * Input: compliance percentage
 */
export function calculateNutritionScore(compliance: number): number {
  return Math.round(Math.max(0, Math.min(100, compliance)));
}

/**
 * Calculate hydration score (0-100)
 * Input: 1-10 scale
 */
export function calculateHydrationScore(status: number): number {
  return Math.round((status / 10) * 100);
}

/**
 * Calculate ACWR score (0-100)
 */
export function calculateACWRScore(acwr: number): number {
  // Optimal: 0.8-1.3
  // Sweet spot: 1.0-1.2
  if (acwr >= 1.0 && acwr <= 1.2) {
    return 100;
  } else if (acwr >= 0.8 && acwr < 1.0) {
    return Math.round(80 + (acwr - 0.8) * 100);
  } else if (acwr > 1.2 && acwr <= 1.3) {
    return Math.round(100 - (acwr - 1.2) * 100);
  } else if (acwr >= 0.6 && acwr < 0.8) {
    return Math.round(60 + (acwr - 0.6) * 100);
  } else if (acwr > 1.3 && acwr <= 1.5) {
    return Math.round(90 - (acwr - 1.3) * 150);
  } else if (acwr < 0.6) {
    return Math.round(Math.max(20, acwr * 100));
  } else {
    // acwr > 1.5
    return Math.round(Math.max(10, 60 - (acwr - 1.5) * 100));
  }
}

/**
 * Calculate blood status score (0-100)
 */
export function calculateBloodStatusScore(status: BloodStatusInput): number {
  let score = 100;

  // Overall status penalty
  if (status.overallStatus === 'attention') {
    score -= 20;
  } else if (status.overallStatus === 'concern') {
    score -= 40;
  }

  // Hemoglobin penalty
  if (status.hemoglobinStatus !== 'normal') {
    score -= 15;
  }

  // Ferritin penalty
  if (status.ferritinStatus === 'low') {
    score -= 15;
  }

  // Inflammation penalty
  if (status.inflammationStatus === 'elevated') {
    score -= 10;
  }

  return Math.max(0, score);
}

// ==================== MAIN READINESS CALCULATOR ====================

export interface ReadinessResult {
  overallScore: number;             // 0-100
  category: 'excellent' | 'good' | 'moderate' | 'poor' | 'critical';
  componentScores: {
    sleep: number;
    hrv: number;
    restingHR: number;
    fatigue: number;
    soreness: number;
    stress: number;
    mood: number;
    nutrition: number;
    hydration: number;
    acwr?: number;
    bloodStatus?: number;
  };
  limitingFactors: string[];
  recommendations: string[];
  trainingRecommendation: {
    maxIntensity: number;           // % of planned
    maxVolume: number;              // % of planned
    focusAreas: string[];
    avoidAreas: string[];
  };
}

/**
 * Calculate comprehensive readiness score
 */
export function calculateReadiness(input: ReadinessInput): ReadinessResult {
  const { wellness, trainingLoad, bloodStatus, athleteEvent, athleteBaselines } = input;
  const baselines = athleteBaselines || DEFAULT_BASELINES;

  // Get appropriate weights
  let weights = { ...DEFAULT_READINESS_WEIGHTS };
  if (athleteEvent && EVENT_SPECIFIC_WEIGHTS[athleteEvent]) {
    weights = { ...weights, ...EVENT_SPECIFIC_WEIGHTS[athleteEvent] };
  }

  // Normalize weights if needed
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  if (Math.abs(totalWeight - 1.0) > 0.01) {
    for (const key of Object.keys(weights) as (keyof ReadinessWeights)[]) {
      weights[key] = weights[key] / totalWeight;
    }
  }

  // Calculate individual component scores
  const sleepScore = calculateSleepScore(
    wellness.sleepHours,
    wellness.sleepQuality,
    baselines.avgSleepHours
  );

  const hrvScore = calculateHRVScore(
    wellness.hrvMssd,
    baselines.hrvBaseline,
    baselines.hrvCoefficientOfVariation
  );

  const restingHRScore = calculateRestingHRScore(
    wellness.restingHR,
    baselines.restingHR
  );

  const fatigueScore = calculateFatigueScore(wellness.perceivedFatigue);
  const sorenessScore = calculateSorenessScore(wellness.muscleSoreness);
  const stressScore = calculateStressScore(wellness.stressLevel);
  const moodScore = calculateMoodScore(wellness.mood);
  const nutritionScore = calculateNutritionScore(wellness.nutritionCompliance);
  const hydrationScore = calculateHydrationScore(wellness.hydrationStatus);

  // Optional scores
  const acwrScore = trainingLoad ? calculateACWRScore(trainingLoad.acwr) : undefined;
  const bloodScore = bloodStatus ? calculateBloodStatusScore(bloodStatus) : undefined;

  // Calculate weighted overall score
  // Combine HRV and resting HR for autonomic score
  const autonomicScore = (hrvScore * 0.7) + (restingHRScore * 0.3);

  let overallScore = 0;
  overallScore += sleepScore * weights.sleep;
  overallScore += autonomicScore * weights.hrv;
  overallScore += fatigueScore * weights.fatigue;
  overallScore += sorenessScore * weights.soreness;
  overallScore += stressScore * weights.stress;
  overallScore += moodScore * weights.mood;
  overallScore += nutritionScore * weights.nutrition;
  overallScore += hydrationScore * weights.hydration;

  if (acwrScore !== undefined) {
    overallScore += acwrScore * weights.acwr;
  } else {
    // Redistribute ACWR weight
    overallScore = overallScore / (1 - weights.acwr);
  }

  if (bloodScore !== undefined) {
    overallScore += bloodScore * weights.bloodStatus;
  } else {
    // Redistribute blood weight
    overallScore = overallScore / (1 - weights.bloodStatus);
  }

  overallScore = Math.round(overallScore);

  // Determine category
  let category: ReadinessResult['category'];
  if (overallScore >= 85) {
    category = 'excellent';
  } else if (overallScore >= 70) {
    category = 'good';
  } else if (overallScore >= 55) {
    category = 'moderate';
  } else if (overallScore >= 40) {
    category = 'poor';
  } else {
    category = 'critical';
  }

  // Identify limiting factors (scores below 60)
  const limitingFactors: string[] = [];
  const componentScores = {
    sleep: sleepScore,
    hrv: hrvScore,
    restingHR: restingHRScore,
    fatigue: fatigueScore,
    soreness: sorenessScore,
    stress: stressScore,
    mood: moodScore,
    nutrition: nutritionScore,
    hydration: hydrationScore,
    acwr: acwrScore,
    bloodStatus: bloodScore
  };

  if (sleepScore < 60) limitingFactors.push('Poor sleep quality/duration');
  if (hrvScore < 60) limitingFactors.push('Low HRV - incomplete recovery');
  if (restingHRScore < 60) limitingFactors.push('Elevated resting heart rate');
  if (fatigueScore < 60) limitingFactors.push('High perceived fatigue');
  if (sorenessScore < 60) limitingFactors.push('Significant muscle soreness');
  if (stressScore < 60) limitingFactors.push('High stress levels');
  if (moodScore < 60) limitingFactors.push('Low mood state');
  if (nutritionScore < 60) limitingFactors.push('Poor nutritional compliance');
  if (hydrationScore < 60) limitingFactors.push('Dehydration concerns');
  if (acwrScore !== undefined && acwrScore < 60) limitingFactors.push('Training load imbalance');
  if (bloodScore !== undefined && bloodScore < 60) limitingFactors.push('Blood marker concerns');

  // Generate recommendations
  const recommendations = generateReadinessRecommendations(componentScores, limitingFactors);

  // Training recommendation
  const trainingRecommendation = generateTrainingRecommendation(
    overallScore,
    category,
    componentScores,
    athleteEvent
  );

  return {
    overallScore,
    category,
    componentScores,
    limitingFactors,
    recommendations,
    trainingRecommendation
  };
}

// ==================== RECOMMENDATION GENERATORS ====================

function generateReadinessRecommendations(
  scores: ReadinessResult['componentScores'],
  limitingFactors: string[]
): string[] {
  const recommendations: string[] = [];

  if (scores.sleep < 70) {
    recommendations.push('Prioritize 8+ hours of quality sleep tonight');
    if (scores.sleep < 50) {
      recommendations.push('Consider a 20-30 min afternoon nap');
    }
  }

  if (scores.hrv < 70) {
    recommendations.push('Focus on recovery protocols - reduce training intensity');
    recommendations.push('Practice 5-10 min of deep breathing or meditation');
  }

  if (scores.restingHR < 70) {
    recommendations.push('Elevated HR indicates incomplete recovery - reduce intensity');
  }

  if (scores.fatigue < 70) {
    recommendations.push('High fatigue - consider active recovery or rest day');
    if (scores.fatigue < 50) {
      recommendations.push('Complete rest recommended - no high-intensity work');
    }
  }

  if (scores.soreness < 70) {
    recommendations.push('Muscle soreness present - include extended mobility work');
    recommendations.push('Consider contrast therapy (hot/cold) for recovery');
  }

  if (scores.stress < 70) {
    recommendations.push('High stress detected - include relaxation techniques');
    recommendations.push('Consider reduced training complexity today');
  }

  if (scores.nutrition < 70) {
    recommendations.push('Improve nutritional compliance - focus on whole foods');
    recommendations.push('Ensure adequate protein intake for recovery');
  }

  if (scores.hydration < 70) {
    recommendations.push('Increase fluid intake - target 3-4L today');
    recommendations.push('Add electrolytes to water for better absorption');
  }

  if (scores.acwr !== undefined && scores.acwr < 70) {
    if (scores.acwr < 50) {
      recommendations.push('Training load too high - mandatory load reduction');
    } else {
      recommendations.push('Monitor training load closely - consider slight reduction');
    }
  }

  if (scores.bloodStatus !== undefined && scores.bloodStatus < 70) {
    recommendations.push('Blood markers indicate concern - consult sports physician');
    recommendations.push('Focus on iron-rich foods and vitamin C for absorption');
  }

  // If no specific issues, provide general recommendations
  if (recommendations.length === 0) {
    recommendations.push('All systems optimal - proceed with planned training');
    recommendations.push('Maintain current recovery protocols');
  }

  return recommendations;
}

function generateTrainingRecommendation(
  overallScore: number,
  category: ReadinessResult['category'],
  scores: ReadinessResult['componentScores'],
  event?: string
): ReadinessResult['trainingRecommendation'] {
  let maxIntensity: number;
  let maxVolume: number;
  const focusAreas: string[] = [];
  const avoidAreas: string[] = [];

  // Base recommendations on category
  switch (category) {
    case 'excellent':
      maxIntensity = 100;
      maxVolume = 100;
      focusAreas.push('High-intensity work optimal');
      focusAreas.push('Competition-specific training');
      focusAreas.push('Maximum effort sessions allowed');
      break;

    case 'good':
      maxIntensity = 95;
      maxVolume = 95;
      focusAreas.push('Standard training appropriate');
      focusAreas.push('Technical work');
      avoidAreas.push('Maximum testing');
      break;

    case 'moderate':
      maxIntensity = 80;
      maxVolume = 85;
      focusAreas.push('Technical/skill work');
      focusAreas.push('Moderate aerobic work');
      avoidAreas.push('High CNS demand sessions');
      avoidAreas.push('Maximum strength work');
      break;

    case 'poor':
      maxIntensity = 60;
      maxVolume = 70;
      focusAreas.push('Light active recovery');
      focusAreas.push('Mobility/flexibility');
      focusAreas.push('Low-intensity aerobic');
      avoidAreas.push('All high-intensity work');
      avoidAreas.push('Heavy lifting');
      avoidAreas.push('Speed work');
      break;

    case 'critical':
      maxIntensity = 40;
      maxVolume = 50;
      focusAreas.push('Complete rest or very light movement');
      focusAreas.push('Recovery protocols only');
      focusAreas.push('Sleep optimization');
      avoidAreas.push('All training');
      avoidAreas.push('Any strenuous activity');
      break;
  }

  // Adjust based on specific limiting factors
  if (scores.hrv < 50 || scores.restingHR < 50) {
    maxIntensity = Math.min(maxIntensity, 60);
    avoidAreas.push('Neural/CNS demanding work');
  }

  if (scores.soreness < 50) {
    avoidAreas.push('Eccentric-heavy exercises');
    avoidAreas.push('Plyometrics');
    focusAreas.push('Concentric-focused work if training');
  }

  if (scores.fatigue < 50) {
    maxIntensity = Math.min(maxIntensity, 50);
    maxVolume = Math.min(maxVolume, 60);
  }

  // Event-specific adjustments
  if (event) {
    const sprintEvents = ['100M', '200M', '110M_HURDLES'];
    const jumpEvents = ['LONG_JUMP', 'TRIPLE_JUMP', 'HIGH_JUMP', 'POLE_VAULT'];
    const throwEvents = ['SHOT_PUT', 'DISCUS', 'JAVELIN', 'HAMMER'];
    const enduranceEvents = ['5000M', '10000M', 'MARATHON', 'RACE_WALKS'];

    if (sprintEvents.includes(event) && scores.hrv < 70) {
      avoidAreas.push('Maximum velocity sprints');
      focusAreas.push('Sub-maximal speed work if training');
    }

    if (jumpEvents.includes(event) && scores.soreness < 70) {
      avoidAreas.push('Full approach jumps');
      focusAreas.push('Short approach technical work');
    }

    if (throwEvents.includes(event) && scores.hrv < 70) {
      avoidAreas.push('Maximum effort throws');
      focusAreas.push('Technical drills at reduced intensity');
    }

    if (enduranceEvents.includes(event) && scores.fatigue < 70) {
      avoidAreas.push('Threshold/tempo runs');
      focusAreas.push('Easy aerobic running');
    }
  }

  return {
    maxIntensity,
    maxVolume,
    focusAreas: [...new Set(focusAreas)],
    avoidAreas: [...new Set(avoidAreas)]
  };
}

// ==================== TREND ANALYSIS ====================

export interface ReadinessTrend {
  direction: 'improving' | 'stable' | 'declining';
  averageScore: number;
  volatility: 'low' | 'moderate' | 'high';
  concernAreas: string[];
  positiveTrends: string[];
}

/**
 * Analyze readiness trends over time
 * Requires at least 7 days of data for meaningful analysis
 */
export function analyzeReadinessTrend(
  dailyScores: { date: Date; score: number; componentScores: ReadinessResult['componentScores'] }[]
): ReadinessTrend {
  if (dailyScores.length < 3) {
    return {
      direction: 'stable',
      averageScore: dailyScores.length > 0
        ? Math.round(dailyScores.reduce((sum, d) => sum + d.score, 0) / dailyScores.length)
        : 0,
      volatility: 'low',
      concernAreas: ['Insufficient data for trend analysis'],
      positiveTrends: []
    };
  }

  // Sort by date
  const sorted = [...dailyScores].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Calculate average
  const averageScore = Math.round(
    sorted.reduce((sum, d) => sum + d.score, 0) / sorted.length
  );

  // Calculate trend direction (simple linear regression)
  const n = sorted.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = sorted.reduce((sum, d) => sum + d.score, 0);
  const sumXY = sorted.reduce((sum, d, i) => sum + i * d.score, 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  let direction: ReadinessTrend['direction'];
  if (slope > 1) {
    direction = 'improving';
  } else if (slope < -1) {
    direction = 'declining';
  } else {
    direction = 'stable';
  }

  // Calculate volatility (standard deviation)
  const variance = sorted.reduce((sum, d) => sum + Math.pow(d.score - averageScore, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  let volatility: ReadinessTrend['volatility'];
  if (stdDev < 8) {
    volatility = 'low';
  } else if (stdDev < 15) {
    volatility = 'moderate';
  } else {
    volatility = 'high';
  }

  // Analyze component trends
  const concernAreas: string[] = [];
  const positiveTrends: string[] = [];

  const components = ['sleep', 'hrv', 'fatigue', 'soreness', 'stress'] as const;

  for (const component of components) {
    const componentScores = sorted.map(d => d.componentScores[component] ?? 0);
    const avgComponent = componentScores.reduce((a, b) => a + b, 0) / componentScores.length;

    // Check recent trend (last 3 days vs previous)
    if (componentScores.length >= 6) {
      const recent = componentScores.slice(-3);
      const previous = componentScores.slice(-6, -3);

      const recentAvg = recent.reduce((a, b) => a + b, 0) / 3;
      const previousAvg = previous.reduce((a, b) => a + b, 0) / 3;

      if (recentAvg < previousAvg - 10) {
        concernAreas.push(`${component} declining (${Math.round(previousAvg)} → ${Math.round(recentAvg)})`);
      } else if (recentAvg > previousAvg + 10) {
        positiveTrends.push(`${component} improving (${Math.round(previousAvg)} → ${Math.round(recentAvg)})`);
      }
    }

    // Flag chronically low components
    if (avgComponent < 60) {
      concernAreas.push(`${component} chronically low (avg: ${Math.round(avgComponent)})`);
    }
  }

  return {
    direction,
    averageScore,
    volatility,
    concernAreas,
    positiveTrends
  };
}

// ==================== EXPORTS ====================

export default {
  calculateReadiness,
  analyzeReadinessTrend,
  DEFAULT_READINESS_WEIGHTS,
  EVENT_SPECIFIC_WEIGHTS,
  DEFAULT_BASELINES
};
