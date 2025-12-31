// ============================================
// FATIGUE CLASSIFICATION RULE ENGINE
// Neural, Metabolic, Mechanical Fatigue
// Recovery Recommendations
// ============================================

export interface FatigueInputData {
  // Performance Markers (% change from baseline - positive = worse)
  reactionTimeChange?: number;     // % slower
  sprintTimeChange?: number;       // % slower
  cmjChange?: number;              // % lower (negative = lower jump)
  rfdChange?: number;              // Rate of force development % change

  // Subjective Markers (1-10 scale)
  muscleSoreness: number;          // 1 = none, 10 = severe
  perceivedFatigue: number;        // 1 = fresh, 10 = exhausted
  sleepQuality: number;            // 1 = poor, 5 = excellent
  sleepDuration: number;           // hours
  mood: number;                    // 1 = very bad, 10 = excellent
  motivation: number;              // 1 = none, 10 = very high
  stress: number;                  // 1 = none, 10 = extreme

  // Physiological
  restingHR?: number;              // bpm
  restingHRBaseline?: number;      // bpm (normal)
  hrv?: number;                    // ms (RMSSD)
  hrvBaseline?: number;            // ms (normal)

  // Load Context
  recentLoadType: 'SPRINT' | 'STRENGTH' | 'ENDURANCE' | 'PLYOMETRIC' | 'MIXED';
  daysSinceHighIntensity: number;
  daysSinceCompetition?: number;

  // Blood Markers (if available)
  creatineKinase?: number;         // U/L
  cortisol?: number;               // mcg/dL
}

export interface FatigueClassification {
  // Individual Fatigue Scores (0-100)
  neuralFatigue: number;
  metabolicFatigue: number;
  mechanicalFatigue: number;

  // Primary Classification
  primaryFatigueType: 'NEURAL' | 'METABOLIC' | 'MECHANICAL' | 'MIXED' | 'NONE';
  overallFatigueLevel: 'FRESH' | 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  overallFatigueScore: number;     // 0-100

  // Recovery
  recoveryTimeEstimate: number;    // hours
  readyForHighIntensity: boolean;

  // Training Recommendations
  trainingRecommendation: string;
  avoidActivities: string[];
  recommendedActivities: string[];
  maxRecommendedRPE: number;

  // Contributing Factors
  contributingFactors: string[];
}

// ============================================
// FATIGUE INDICATORS BY TYPE
// ============================================

/**
 * NEURAL FATIGUE Indicators:
 * - Decreased reaction time
 * - Decreased sprint performance (especially 0-10m)
 * - Decreased rate of force development
 * - Poor coordination/technique
 * - Low motivation
 * - Poor sleep quality
 * - Low HRV
 *
 * Recovery: 48-72 hours
 * Avoid: Max sprints, heavy singles/doubles, complex skills
 */

/**
 * METABOLIC FATIGUE Indicators:
 * - High perceived fatigue
 * - Elevated resting HR
 * - Decreased HRV
 * - Poor endurance performance
 * - Heavy legs feeling
 * - High RPE at submaximal intensities
 *
 * Recovery: 24-48 hours
 * Avoid: Speed endurance, lactate work, high-rep sets
 */

/**
 * MECHANICAL FATIGUE Indicators:
 * - Muscle soreness
 * - Decreased CMJ height
 * - Elevated CK levels
 * - Stiffness
 * - Decreased ROM
 * - Recent eccentric/plyometric work
 *
 * Recovery: 48-96 hours
 * Avoid: Plyometrics, eccentric training, heavy squats
 */

// ============================================
// CALCULATION WEIGHTS
// ============================================

const NEURAL_WEIGHTS = {
  reactionTimeChange: 0.25,    // Very important
  sprintTimeChange: 0.20,      // Important (especially short sprints)
  rfdChange: 0.15,             // Important
  sleepQuality: 0.15,          // Affects neural recovery
  motivation: 0.10,            // Neural fatigue reduces motivation
  hrvChange: 0.15              // Parasympathetic indicator
};

const METABOLIC_WEIGHTS = {
  perceivedFatigue: 0.30,      // Primary indicator
  restingHRChange: 0.20,       // Autonomic stress
  hrvChange: 0.20,             // Autonomic balance
  sleepQuality: 0.15,          // Recovery quality
  stress: 0.15                 // Cortisol/metabolic stress
};

const MECHANICAL_WEIGHTS = {
  muscleSoreness: 0.35,        // Primary indicator
  cmjChange: 0.25,             // Neuromuscular function
  creatineKinase: 0.20,        // Muscle damage marker
  recentLoadType: 0.10,        // Context
  daysSinceHighIntensity: 0.10 // Recovery time
};

// ============================================
// FATIGUE CALCULATION FUNCTIONS
// ============================================

/**
 * Calculate Neural Fatigue Score (0-100)
 */
function calculateNeuralFatigue(data: FatigueInputData): {
  score: number;
  factors: string[];
} {
  let score = 0;
  const factors: string[] = [];

  // Reaction time (positive change = slower = more fatigue)
  if (data.reactionTimeChange !== undefined) {
    const contribution = Math.min(100, Math.max(0, data.reactionTimeChange * 8));
    score += contribution * NEURAL_WEIGHTS.reactionTimeChange;
    if (data.reactionTimeChange > 5) {
      factors.push(`Reaction time ${data.reactionTimeChange.toFixed(1)}% slower`);
    }
  }

  // Sprint time (positive change = slower = more fatigue)
  if (data.sprintTimeChange !== undefined) {
    const contribution = Math.min(100, Math.max(0, data.sprintTimeChange * 15));
    score += contribution * NEURAL_WEIGHTS.sprintTimeChange;
    if (data.sprintTimeChange > 3) {
      factors.push(`Sprint performance ${data.sprintTimeChange.toFixed(1)}% slower`);
    }
  }

  // RFD change
  if (data.rfdChange !== undefined) {
    const contribution = Math.min(100, Math.max(0, Math.abs(data.rfdChange) * 5));
    score += contribution * NEURAL_WEIGHTS.rfdChange;
    if (Math.abs(data.rfdChange) > 10) {
      factors.push(`Rate of force development reduced ${Math.abs(data.rfdChange).toFixed(0)}%`);
    }
  }

  // Sleep quality (5 = good = 0 fatigue, 1 = poor = 100 fatigue)
  const sleepContribution = ((5 - data.sleepQuality) / 4) * 100;
  score += sleepContribution * NEURAL_WEIGHTS.sleepQuality;
  if (data.sleepQuality <= 2) {
    factors.push('Poor sleep quality affecting neural recovery');
  }

  // Motivation (10 = high = 0 fatigue, 1 = low = 100 fatigue)
  const motivationContribution = ((10 - data.motivation) / 9) * 100;
  score += motivationContribution * NEURAL_WEIGHTS.motivation;
  if (data.motivation <= 4) {
    factors.push('Low motivation (neural fatigue indicator)');
  }

  // HRV change (negative change = suppressed = more fatigue)
  if (data.hrv !== undefined && data.hrvBaseline !== undefined) {
    const hrvChange = ((data.hrvBaseline - data.hrv) / data.hrvBaseline) * 100;
    const hrvContribution = Math.max(0, Math.min(100, hrvChange * 3));
    score += hrvContribution * NEURAL_WEIGHTS.hrvChange;
    if (hrvChange > 15) {
      factors.push(`HRV suppressed ${hrvChange.toFixed(0)}% below baseline`);
    }
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    factors
  };
}

/**
 * Calculate Metabolic Fatigue Score (0-100)
 */
function calculateMetabolicFatigue(data: FatigueInputData): {
  score: number;
  factors: string[];
} {
  let score = 0;
  const factors: string[] = [];

  // Perceived fatigue (1 = fresh = 0, 10 = exhausted = 100)
  const fatigueContribution = ((data.perceivedFatigue - 1) / 9) * 100;
  score += fatigueContribution * METABOLIC_WEIGHTS.perceivedFatigue;
  if (data.perceivedFatigue >= 7) {
    factors.push(`High perceived fatigue (${data.perceivedFatigue}/10)`);
  }

  // Resting HR change (positive = elevated = more fatigue)
  if (data.restingHR !== undefined && data.restingHRBaseline !== undefined) {
    const hrChange = ((data.restingHR - data.restingHRBaseline) / data.restingHRBaseline) * 100;
    const hrContribution = Math.max(0, Math.min(100, hrChange * 8));
    score += hrContribution * METABOLIC_WEIGHTS.restingHRChange;
    if (hrChange > 8) {
      factors.push(`Resting HR elevated ${hrChange.toFixed(0)}% above baseline`);
    }
  }

  // HRV change
  if (data.hrv !== undefined && data.hrvBaseline !== undefined) {
    const hrvChange = ((data.hrvBaseline - data.hrv) / data.hrvBaseline) * 100;
    const hrvContribution = Math.max(0, Math.min(100, hrvChange * 2.5));
    score += hrvContribution * METABOLIC_WEIGHTS.hrvChange;
  }

  // Sleep quality
  const sleepContribution = ((5 - data.sleepQuality) / 4) * 100;
  score += sleepContribution * METABOLIC_WEIGHTS.sleepQuality;

  // Stress (1 = none = 0, 10 = extreme = 100)
  const stressContribution = ((data.stress - 1) / 9) * 100;
  score += stressContribution * METABOLIC_WEIGHTS.stress;
  if (data.stress >= 7) {
    factors.push(`High stress levels (${data.stress}/10)`);
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    factors
  };
}

/**
 * Calculate Mechanical Fatigue Score (0-100)
 */
function calculateMechanicalFatigue(data: FatigueInputData): {
  score: number;
  factors: string[];
} {
  let score = 0;
  const factors: string[] = [];

  // Muscle soreness (1 = none = 0, 10 = severe = 100)
  const sorenessContribution = ((data.muscleSoreness - 1) / 9) * 100;
  score += sorenessContribution * MECHANICAL_WEIGHTS.muscleSoreness;
  if (data.muscleSoreness >= 6) {
    factors.push(`High muscle soreness (${data.muscleSoreness}/10)`);
  }

  // CMJ change (negative = lower jump = more fatigue)
  if (data.cmjChange !== undefined) {
    const cmjContribution = Math.max(0, Math.min(100, Math.abs(data.cmjChange) * 6));
    score += cmjContribution * MECHANICAL_WEIGHTS.cmjChange;
    if (Math.abs(data.cmjChange) > 8) {
      factors.push(`CMJ reduced ${Math.abs(data.cmjChange).toFixed(0)}% from baseline`);
    }
  }

  // Creatine Kinase (normal < 400, elevated 400-1000, high > 1000)
  if (data.creatineKinase !== undefined) {
    let ckContribution = 0;
    if (data.creatineKinase > 1000) {
      ckContribution = 100;
      factors.push(`CK critically elevated (${data.creatineKinase} U/L)`);
    } else if (data.creatineKinase > 400) {
      ckContribution = ((data.creatineKinase - 400) / 600) * 100;
      if (data.creatineKinase > 600) {
        factors.push(`CK elevated (${data.creatineKinase} U/L)`);
      }
    }
    score += ckContribution * MECHANICAL_WEIGHTS.creatineKinase;
  }

  // Recent load type contribution
  const loadTypeContribution: Record<string, number> = {
    PLYOMETRIC: 80,
    STRENGTH: 60,
    SPRINT: 40,
    MIXED: 50,
    ENDURANCE: 20
  };
  score += (loadTypeContribution[data.recentLoadType] || 0) * MECHANICAL_WEIGHTS.recentLoadType;

  // Days since high intensity (less days = more fatigue)
  let daysContribution = 0;
  if (data.daysSinceHighIntensity === 0) {
    daysContribution = 80;
  } else if (data.daysSinceHighIntensity === 1) {
    daysContribution = 50;
  } else if (data.daysSinceHighIntensity === 2) {
    daysContribution = 25;
  }
  score += daysContribution * MECHANICAL_WEIGHTS.daysSinceHighIntensity;

  if (data.daysSinceHighIntensity <= 1 && data.recentLoadType === 'PLYOMETRIC') {
    factors.push('Recent high-intensity plyometric work');
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    factors
  };
}

// ============================================
// MAIN CLASSIFICATION FUNCTION
// ============================================

/**
 * Classify fatigue type and provide recommendations
 */
export function classifyFatigue(data: FatigueInputData): FatigueClassification {
  // Calculate individual scores
  const neural = calculateNeuralFatigue(data);
  const metabolic = calculateMetabolicFatigue(data);
  const mechanical = calculateMechanicalFatigue(data);

  const neuralFatigue = Math.round(neural.score);
  const metabolicFatigue = Math.round(metabolic.score);
  const mechanicalFatigue = Math.round(mechanical.score);

  // Combine all contributing factors
  const contributingFactors = [...neural.factors, ...metabolic.factors, ...mechanical.factors];

  // Determine primary fatigue type
  const maxScore = Math.max(neuralFatigue, metabolicFatigue, mechanicalFatigue);
  let primaryFatigueType: FatigueClassification['primaryFatigueType'];

  if (maxScore < 25) {
    primaryFatigueType = 'NONE';
  } else {
    // Check if multiple types are elevated
    const elevated = [
      { type: 'NEURAL', score: neuralFatigue },
      { type: 'METABOLIC', score: metabolicFatigue },
      { type: 'MECHANICAL', score: mechanicalFatigue }
    ].filter(t => t.score >= maxScore * 0.8);

    if (elevated.length > 1) {
      primaryFatigueType = 'MIXED';
    } else if (neuralFatigue === maxScore) {
      primaryFatigueType = 'NEURAL';
    } else if (metabolicFatigue === maxScore) {
      primaryFatigueType = 'METABOLIC';
    } else {
      primaryFatigueType = 'MECHANICAL';
    }
  }

  // Calculate overall fatigue score (weighted average with emphasis on highest)
  const overallFatigueScore = Math.round(
    (maxScore * 0.5) + ((neuralFatigue + metabolicFatigue + mechanicalFatigue) / 3 * 0.5)
  );

  // Determine overall fatigue level
  let overallFatigueLevel: FatigueClassification['overallFatigueLevel'];
  if (overallFatigueScore < 20) {
    overallFatigueLevel = 'FRESH';
  } else if (overallFatigueScore < 40) {
    overallFatigueLevel = 'LOW';
  } else if (overallFatigueScore < 60) {
    overallFatigueLevel = 'MODERATE';
  } else if (overallFatigueScore < 80) {
    overallFatigueLevel = 'HIGH';
  } else {
    overallFatigueLevel = 'SEVERE';
  }

  // Estimate recovery time
  let recoveryTimeEstimate: number;
  switch (primaryFatigueType) {
    case 'NEURAL':
      recoveryTimeEstimate = 48 + (neuralFatigue / 100) * 24;
      break;
    case 'METABOLIC':
      recoveryTimeEstimate = 24 + (metabolicFatigue / 100) * 24;
      break;
    case 'MECHANICAL':
      recoveryTimeEstimate = 48 + (mechanicalFatigue / 100) * 48;
      break;
    case 'MIXED':
      recoveryTimeEstimate = 48 + (overallFatigueScore / 100) * 36;
      break;
    default:
      recoveryTimeEstimate = 24;
  }

  // Ready for high intensity?
  const readyForHighIntensity = overallFatigueScore < 40 && maxScore < 50;

  // Max recommended RPE
  let maxRecommendedRPE: number;
  if (overallFatigueLevel === 'FRESH') {
    maxRecommendedRPE = 10;
  } else if (overallFatigueLevel === 'LOW') {
    maxRecommendedRPE = 8;
  } else if (overallFatigueLevel === 'MODERATE') {
    maxRecommendedRPE = 6;
  } else if (overallFatigueLevel === 'HIGH') {
    maxRecommendedRPE = 4;
  } else {
    maxRecommendedRPE = 2;
  }

  // Get recommendations based on fatigue type
  const { recommendation, avoid, recommended } = getRecommendations(
    primaryFatigueType,
    overallFatigueLevel,
    neuralFatigue,
    metabolicFatigue,
    mechanicalFatigue
  );

  return {
    neuralFatigue,
    metabolicFatigue,
    mechanicalFatigue,
    primaryFatigueType,
    overallFatigueLevel,
    overallFatigueScore,
    recoveryTimeEstimate: Math.round(recoveryTimeEstimate),
    readyForHighIntensity,
    trainingRecommendation: recommendation,
    avoidActivities: avoid,
    recommendedActivities: recommended,
    maxRecommendedRPE,
    contributingFactors
  };
}

/**
 * Get training recommendations based on fatigue classification
 */
function getRecommendations(
  primaryType: FatigueClassification['primaryFatigueType'],
  level: FatigueClassification['overallFatigueLevel'],
  neural: number,
  metabolic: number,
  mechanical: number
): { recommendation: string; avoid: string[]; recommended: string[] } {

  // Severe fatigue - universal rest
  if (level === 'SEVERE') {
    return {
      recommendation: 'SEVERE FATIGUE: Complete rest or very light active recovery only. Focus on sleep (9+ hours), hydration, and nutrition. Consider medical review if persistent.',
      avoid: ['All high-intensity work', 'Heavy lifting', 'Sprints', 'Plyometrics', 'Long sessions'],
      recommended: ['Walking', 'Light swimming', 'Gentle mobility', 'Sleep', 'Massage', 'Nutrition focus']
    };
  }

  // High fatigue
  if (level === 'HIGH') {
    return {
      recommendation: `HIGH FATIGUE (${primaryType}): Significantly reduce training load. Focus on recovery modalities. Light movement only.`,
      avoid: ['Speed work', 'Heavy strength', 'Plyometrics', 'Speed endurance', 'Competition simulation'],
      recommended: ['Active recovery', 'Light technical drills', 'Mobility work', 'Pool session', 'Regeneration']
    };
  }

  // Type-specific recommendations for moderate/low fatigue
  switch (primaryType) {
    case 'NEURAL':
      return {
        recommendation: `NEURAL FATIGUE (Score: ${neural}): CNS recovery needed. Avoid max-effort and reactive activities. Focus on lower-intensity, less complex work.`,
        avoid: ['Max sprints (>95%)', 'Heavy singles/doubles', 'Complex skill acquisition', 'Reaction drills', 'Starting practice'],
        recommended: ['Tempo runs (65-75%)', 'Moderate strength (60-75% 1RM)', 'Technical drills at low speed', 'Aerobic recovery', 'Mobility']
      };

    case 'METABOLIC':
      return {
        recommendation: `METABOLIC FATIGUE (Score: ${metabolic}): Energy system recovery needed. Avoid glycolytic work. Pure speed or low-intensity OK.`,
        avoid: ['Speed endurance', 'Lactate tolerance', 'High-rep sets (>8)', 'Circuit training', 'Tempo intervals'],
        recommended: ['Pure speed (low volume, full recovery)', 'Max strength (low reps)', 'Technical work', 'Easy aerobic', 'Skill work']
      };

    case 'MECHANICAL':
      return {
        recommendation: `MECHANICAL FATIGUE (Score: ${mechanical}): Muscle/tissue recovery needed. Avoid eccentric stress and impact. Concentric and low-impact OK.`,
        avoid: ['Plyometrics', 'Eccentric training', 'Heavy squats/lunges', 'Downhill running', 'Jumping'],
        recommended: ['Concentric-focused lifts', 'Pool running', 'Cycling', 'Upper body work', 'Swimming', 'Isometrics']
      };

    case 'MIXED':
      return {
        recommendation: `MIXED FATIGUE: Multiple fatigue types elevated. Reduce overall training stress. Focus on recovery before next quality session.`,
        avoid: ['High-intensity work of any type', 'Long sessions', 'New exercises'],
        recommended: ['Light movement', 'Technical review (no intensity)', 'Recovery modalities', 'Easy cross-training']
      };

    default:
      return {
        recommendation: 'FRESH: Low fatigue levels. Normal training can proceed. Good opportunity for quality work.',
        avoid: [],
        recommended: ['Full training as planned', 'Quality session opportunity', 'Can push if program demands']
      };
  }
}

/**
 * Generate fatigue report
 */
export function generateFatigueReport(classification: FatigueClassification): string {
  let report = '# FATIGUE CLASSIFICATION REPORT\n\n';

  // Overall Status
  const levelEmoji = {
    FRESH: '💚',
    LOW: '🟢',
    MODERATE: '🟡',
    HIGH: '🟠',
    SEVERE: '🔴'
  };

  report += `## Overall: ${levelEmoji[classification.overallFatigueLevel]} ${classification.overallFatigueLevel}\n`;
  report += `Primary Type: **${classification.primaryFatigueType}**\n`;
  report += `Overall Score: ${classification.overallFatigueScore}/100\n`;
  report += `Ready for High Intensity: ${classification.readyForHighIntensity ? 'YES ✅' : 'NO ❌'}\n\n`;

  // Fatigue Scores
  report += '## Fatigue Scores\n\n';
  report += '| Type | Score | Level |\n';
  report += '|------|-------|-------|\n';
  report += `| Neural | ${classification.neuralFatigue}/100 | ${getScoreLevel(classification.neuralFatigue)} |\n`;
  report += `| Metabolic | ${classification.metabolicFatigue}/100 | ${getScoreLevel(classification.metabolicFatigue)} |\n`;
  report += `| Mechanical | ${classification.mechanicalFatigue}/100 | ${getScoreLevel(classification.mechanicalFatigue)} |\n`;
  report += '\n';

  // Recovery
  report += '## Recovery\n\n';
  report += `- Estimated recovery time: **${classification.recoveryTimeEstimate} hours**\n`;
  report += `- Max recommended RPE: **${classification.maxRecommendedRPE}/10**\n\n`;

  // Contributing Factors
  if (classification.contributingFactors.length > 0) {
    report += '## Contributing Factors\n\n';
    for (const factor of classification.contributingFactors) {
      report += `- ${factor}\n`;
    }
    report += '\n';
  }

  // Recommendation
  report += '## Training Recommendation\n\n';
  report += `${classification.trainingRecommendation}\n\n`;

  // Avoid
  if (classification.avoidActivities.length > 0) {
    report += '### ❌ Avoid\n\n';
    for (const activity of classification.avoidActivities) {
      report += `- ${activity}\n`;
    }
    report += '\n';
  }

  // Recommended
  if (classification.recommendedActivities.length > 0) {
    report += '### ✅ Recommended\n\n';
    for (const activity of classification.recommendedActivities) {
      report += `- ${activity}\n`;
    }
  }

  return report;
}

function getScoreLevel(score: number): string {
  if (score < 25) return 'Low';
  if (score < 50) return 'Moderate';
  if (score < 75) return 'High';
  return 'Very High';
}
