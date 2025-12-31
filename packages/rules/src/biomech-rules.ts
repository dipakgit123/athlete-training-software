// ============================================
// BIOMECHANICS RULE ENGINE
// Sprint, Jump, Hurdle, Throw Analysis
// Elite Standards & Injury Risk Detection
// ============================================

export interface BiomechData {
  // Sprint Mechanics
  contactTimeLeft?: number;    // ms
  contactTimeRight?: number;   // ms
  flightTime?: number;         // ms
  stepLength?: number;         // m
  stepFrequency?: number;      // Hz (steps/second)
  verticalOscillation?: number; // cm

  // Asymmetry
  contactAsymmetry?: number;   // % (calculated or provided)
  forceAsymmetry?: number;     // %

  // Technique Angles
  hipAngleTouchdown?: number;  // degrees
  kneeAngleTouchdown?: number; // degrees
  ankleAngleTouchdown?: number; // degrees
  trunkLean?: number;          // degrees (positive = forward)

  // Overstride
  overstrideDistance?: number; // cm (foot ahead of COM)
  overstrideAngle?: number;    // degrees

  // Block Start (Sprint)
  blockClearanceTime?: number; // ms
  firstStepLength?: number;    // m
  pushOffAngle?: number;       // degrees

  // Hurdle Specific
  takeoffDistance?: number;    // m (from hurdle)
  landingDistance?: number;    // m (from hurdle)
  hurdleFlightTime?: number;   // ms
  leadLegAngle?: number;       // degrees
  trailLegAngle?: number;      // degrees

  // Jump Specific
  approachVelocity?: number;   // m/s
  takeoffAngle?: number;       // degrees
  takeoffVelocity?: number;    // m/s
  penultimateStepLength?: number; // m

  // Throw Specific
  releaseAngle?: number;       // degrees
  releaseVelocity?: number;    // m/s
  releaseHeight?: number;      // m
}

export interface BiomechAnalysisOutput {
  metric: string;
  value: number;
  unit: string;
  status: 'ELITE' | 'GOOD' | 'ATTENTION' | 'CONCERN';
  vsElite: number;              // % of elite standard
  eliteStandard: string;
  issue?: string;
  recommendation?: string;
  drills?: string[];
  injuryRisk?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface BiomechSummary {
  overallTechnicalScore: number;  // 0-100
  overallInjuryRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  primaryConcerns: string[];
  priorityFixes: string[];
  analyses: BiomechAnalysisOutput[];
}

// ============================================
// ELITE STANDARDS
// ============================================

export const BIOMECH_STANDARDS: Record<string, {
  elite: { min?: number; max?: number };
  good: { min?: number; max?: number };
  attention: { min?: number; max?: number };
  concern: { min?: number; max?: number };
  unit: string;
  lowerIsBetter?: boolean;
  description: string;
}> = {
  // Sprint Mechanics
  contactTime: {
    elite: { max: 90 },
    good: { max: 100 },
    attention: { max: 110 },
    concern: { max: 150 },
    unit: 'ms',
    lowerIsBetter: true,
    description: 'Ground contact time during max velocity sprinting'
  },
  flightTime: {
    elite: { min: 130 },
    good: { min: 120 },
    attention: { min: 110 },
    concern: { min: 0 },
    unit: 'ms',
    lowerIsBetter: false,
    description: 'Time in air between ground contacts'
  },
  stepFrequency: {
    elite: { min: 4.5, max: 5.0 },
    good: { min: 4.2, max: 4.5 },
    attention: { min: 4.0, max: 4.2 },
    concern: { min: 0, max: 4.0 },
    unit: 'Hz',
    lowerIsBetter: false,
    description: 'Steps per second at max velocity'
  },
  stepLength: {
    elite: { min: 2.20 },
    good: { min: 2.00 },
    attention: { min: 1.80 },
    concern: { min: 0 },
    unit: 'm',
    lowerIsBetter: false,
    description: 'Distance covered per step'
  },
  verticalOscillation: {
    elite: { max: 6 },
    good: { max: 8 },
    attention: { max: 10 },
    concern: { max: 15 },
    unit: 'cm',
    lowerIsBetter: true,
    description: 'Vertical bounce during running (energy leak)'
  },

  // Asymmetry (Lower is always better)
  contactAsymmetry: {
    elite: { max: 3 },
    good: { max: 5 },
    attention: { max: 8 },
    concern: { max: 100 },
    unit: '%',
    lowerIsBetter: true,
    description: 'Difference in ground contact time between legs'
  },
  forceAsymmetry: {
    elite: { max: 5 },
    good: { max: 8 },
    attention: { max: 12 },
    concern: { max: 100 },
    unit: '%',
    lowerIsBetter: true,
    description: 'Difference in force production between legs'
  },

  // Overstride (Lower is better)
  overstrideAngle: {
    elite: { max: 5 },
    good: { max: 8 },
    attention: { max: 12 },
    concern: { max: 30 },
    unit: '°',
    lowerIsBetter: true,
    description: 'Angle of foot landing ahead of center of mass'
  },
  overstrideDistance: {
    elite: { max: 5 },
    good: { max: 10 },
    attention: { max: 15 },
    concern: { max: 30 },
    unit: 'cm',
    lowerIsBetter: true,
    description: 'Distance foot lands ahead of center of mass'
  },

  // Technique Angles
  hipAngleTouchdown: {
    elite: { min: 35, max: 45 },
    good: { min: 30, max: 50 },
    attention: { min: 25, max: 55 },
    concern: { min: 0, max: 60 },
    unit: '°',
    description: 'Hip flexion angle at foot strike'
  },
  trunkLean: {
    elite: { min: 0, max: 5 },
    good: { min: -2, max: 8 },
    attention: { min: -5, max: 12 },
    concern: { min: -10, max: 20 },
    unit: '°',
    description: 'Forward trunk inclination (positive = forward)'
  },

  // Block Start
  blockClearanceTime: {
    elite: { max: 350 },
    good: { max: 380 },
    attention: { max: 420 },
    concern: { max: 500 },
    unit: 'ms',
    lowerIsBetter: true,
    description: 'Time from gun to clearing blocks'
  },
  firstStepLength: {
    elite: { min: 1.10 },
    good: { min: 1.00 },
    attention: { min: 0.90 },
    concern: { min: 0 },
    unit: 'm',
    lowerIsBetter: false,
    description: 'Length of first step out of blocks'
  },

  // Hurdle Specific
  hurdleTakeoffDistance: {
    elite: { min: 2.00, max: 2.20 },
    good: { min: 1.90, max: 2.30 },
    attention: { min: 1.80, max: 2.40 },
    concern: { min: 0, max: 3.00 },
    unit: 'm',
    description: 'Distance from hurdle at takeoff'
  },
  hurdleLandingDistance: {
    elite: { min: 1.20, max: 1.40 },
    good: { min: 1.10, max: 1.50 },
    attention: { min: 1.00, max: 1.60 },
    concern: { min: 0, max: 2.00 },
    unit: 'm',
    description: 'Distance from hurdle at landing'
  },

  // Jump Specific
  jumpApproachVelocity: {
    elite: { min: 10.5 },
    good: { min: 10.0 },
    attention: { min: 9.5 },
    concern: { min: 0 },
    unit: 'm/s',
    lowerIsBetter: false,
    description: 'Run-up speed at takeoff for long/triple jump'
  },
  jumpTakeoffAngle: {
    elite: { min: 18, max: 22 },
    good: { min: 16, max: 24 },
    attention: { min: 14, max: 26 },
    concern: { min: 0, max: 35 },
    unit: '°',
    description: 'Angle of takeoff from horizontal'
  },

  // Throw Specific
  throwReleaseAngle: {
    elite: { min: 34, max: 38 },
    good: { min: 32, max: 40 },
    attention: { min: 30, max: 42 },
    concern: { min: 0, max: 50 },
    unit: '°',
    description: 'Angle of release for shot put'
  }
};

// ============================================
// RECOMMENDATIONS DATABASE
// ============================================

export const BIOMECH_RECOMMENDATIONS: Record<string, {
  attention?: {
    issue: string;
    recommendation: string;
    drills: string[];
    injuryRisk?: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  concern?: {
    issue: string;
    recommendation: string;
    drills: string[];
    injuryRisk?: 'LOW' | 'MEDIUM' | 'HIGH';
  };
}> = {
  contactTime: {
    attention: {
      issue: 'Ground contact time above optimal - indicates weak reactive strength',
      recommendation: 'Focus on stiffness and reactive strength development. Cue: "Quick off the ground"',
      drills: ['Ankle hops (3x20)', 'A-skips for height', 'Drop jumps 20-30cm', 'Wicket runs', 'Pogos'],
      injuryRisk: 'LOW'
    },
    concern: {
      issue: 'Significantly long contact time - major power leak affecting performance',
      recommendation: 'Prioritize reactive strength. Test CMJ and RSI. May indicate strength deficit.',
      drills: ['Depth jumps progression', 'Single-leg bounds', 'Weighted ankle hops', 'Hurdle hops'],
      injuryRisk: 'LOW'
    }
  },
  flightTime: {
    attention: {
      issue: 'Short flight time - insufficient vertical force production',
      recommendation: 'Improve hip extension power and vertical force application',
      drills: ['Single-leg bounds', 'Box jumps', 'Alternate leg bounds', 'Hip flexor drives'],
      injuryRisk: 'LOW'
    },
    concern: {
      issue: 'Very short flight time - significant power deficit',
      recommendation: 'Review strength program. Focus on hip extension exercises.',
      drills: ['Hip thrusts', 'RDL progressions', 'Sled pushes', 'Hill sprints'],
      injuryRisk: 'LOW'
    }
  },
  contactAsymmetry: {
    attention: {
      issue: 'Moderate asymmetry between legs - increased injury risk',
      recommendation: 'Identify weaker limb. Add unilateral exercises. Consider physio assessment.',
      drills: ['Single-leg squats', 'Single-leg hops', 'Bulgarian split squats', 'Unilateral bounds'],
      injuryRisk: 'MEDIUM'
    },
    concern: {
      issue: 'Significant asymmetry - HIGH injury risk. Possible underlying issue.',
      recommendation: 'REDUCE high-intensity sprinting. Medical/physio assessment required. Screen for injury.',
      drills: ['Physio exercises as prescribed', 'Low-intensity single-leg work'],
      injuryRisk: 'HIGH'
    }
  },
  forceAsymmetry: {
    attention: {
      issue: 'Force production imbalance between limbs',
      recommendation: 'Single-leg strength emphasis. Identify limiting factor (strength vs activation).',
      drills: ['Single-leg RDL', 'Split squats', 'Single-leg press', 'Lateral lunges'],
      injuryRisk: 'MEDIUM'
    },
    concern: {
      issue: 'Major force asymmetry - elevated injury risk and performance limitation',
      recommendation: 'Reduce bilateral loading. Prioritize unilateral correction. Physio assessment.',
      drills: ['Remedial single-leg work', 'Activation exercises for weak side'],
      injuryRisk: 'HIGH'
    }
  },
  overstrideAngle: {
    attention: {
      issue: 'Overstriding - causing braking forces and increased hamstring stress',
      recommendation: 'Focus on foot placement under/behind hips. Cue: "Land under hips, not ahead"',
      drills: ['Wicket runs (2.0m spacing)', 'Mini hurdle runs', 'Wall drives', 'Falling starts'],
      injuryRisk: 'MEDIUM'
    },
    concern: {
      issue: 'Severe overstride - significant performance loss and HIGH hamstring injury risk',
      recommendation: 'Technical intervention required. Video analysis essential. Reduce sprint intensity.',
      drills: ['Wicket progression', 'Resisted runs', 'Uphill sprints', 'Sled pulls'],
      injuryRisk: 'HIGH'
    }
  },
  overstrideDistance: {
    attention: {
      issue: 'Foot landing too far ahead of center of mass',
      recommendation: 'Similar to overstride angle - focus on landing position',
      drills: ['Wicket runs', 'High knee to sprint transition', 'Partner cues'],
      injuryRisk: 'MEDIUM'
    },
    concern: {
      issue: 'Extreme overstride - significant braking and injury risk',
      recommendation: 'Technical priority. Consider underlying flexibility or strength issues.',
      drills: ['Posture drills', 'Hip flexor strength', 'Hamstring flexibility'],
      injuryRisk: 'HIGH'
    }
  },
  verticalOscillation: {
    attention: {
      issue: 'Excessive vertical bounce - energy being wasted vertically instead of horizontally',
      recommendation: 'Focus on horizontal force application. Reduce "bouncy" running.',
      drills: ['Low ceiling runs', 'Horizontal bounds', 'Sled work for horizontal drive'],
      injuryRisk: 'LOW'
    },
    concern: {
      issue: 'Very high vertical oscillation - significant energy leak',
      recommendation: 'Major technical issue. Review arm action, trunk stability, and hip mechanics.',
      drills: ['Core stability work', 'Arm action drills', 'Posture runs'],
      injuryRisk: 'LOW'
    }
  },
  trunkLean: {
    attention: {
      issue: 'Excessive forward lean affecting balance and braking',
      recommendation: 'Improve trunk stability and running posture',
      drills: ['Posture drills', 'Core anti-flexion work', 'Tall running cues'],
      injuryRisk: 'LOW'
    },
    concern: {
      issue: 'Severe trunk lean - compromising mechanics and increasing injury risk',
      recommendation: 'Address core strength and hip flexibility. May indicate weakness.',
      drills: ['Dead bugs', 'Pallof press', 'Hip flexor mobility', 'Thoracic extension'],
      injuryRisk: 'MEDIUM'
    }
  },
  blockClearanceTime: {
    attention: {
      issue: 'Block clearance slower than optimal - losing time at start',
      recommendation: 'Practice block starts with focus on explosive push. Check block settings.',
      drills: ['Push-up starts', 'Falling starts', 'Block work with timing', 'First step drives'],
      injuryRisk: 'LOW'
    },
    concern: {
      issue: 'Significantly slow block clearance - major start deficit',
      recommendation: 'Review block settings, start strength, and technique thoroughly.',
      drills: ['Block setting optimization', 'Isometric starts', 'Resisted starts'],
      injuryRisk: 'LOW'
    }
  }
};

// ============================================
// ANALYSIS FUNCTIONS
// ============================================

/**
 * Analyze a single biomechanical metric
 */
export function analyzeBiomechMetric(
  metricName: string,
  value: number,
  standards: typeof BIOMECH_STANDARDS[string]
): BiomechAnalysisOutput {
  const { elite, good, attention, concern, unit, lowerIsBetter, description } = standards;

  let status: 'ELITE' | 'GOOD' | 'ATTENTION' | 'CONCERN';
  let vsElite: number;

  if (lowerIsBetter) {
    // Lower is better (contact time, asymmetry, overstride)
    if (value <= (elite.max ?? 0)) {
      status = 'ELITE';
      vsElite = 100;
    } else if (value <= (good.max ?? 0)) {
      status = 'GOOD';
      vsElite = Math.round(((elite.max ?? 0) / value) * 100);
    } else if (value <= (attention.max ?? 0)) {
      status = 'ATTENTION';
      vsElite = Math.round(((elite.max ?? 0) / value) * 100);
    } else {
      status = 'CONCERN';
      vsElite = Math.round(((elite.max ?? 0) / value) * 100);
    }
  } else if (elite.min !== undefined && elite.max !== undefined) {
    // Range-based (angles, frequency)
    if (value >= elite.min && value <= elite.max) {
      status = 'ELITE';
      vsElite = 100;
    } else if (value >= (good.min ?? 0) && value <= (good.max ?? 999)) {
      status = 'GOOD';
      const midElite = (elite.min + elite.max) / 2;
      vsElite = Math.round((1 - Math.abs(value - midElite) / midElite) * 100);
    } else if (value >= (attention.min ?? 0) && value <= (attention.max ?? 999)) {
      status = 'ATTENTION';
      vsElite = 70;
    } else {
      status = 'CONCERN';
      vsElite = 50;
    }
  } else {
    // Higher is better (flight time, step length, velocity)
    if (value >= (elite.min ?? 0)) {
      status = 'ELITE';
      vsElite = 100;
    } else if (value >= (good.min ?? 0)) {
      status = 'GOOD';
      vsElite = Math.round((value / (elite.min ?? 1)) * 100);
    } else if (value >= (attention.min ?? 0)) {
      status = 'ATTENTION';
      vsElite = Math.round((value / (elite.min ?? 1)) * 100);
    } else {
      status = 'CONCERN';
      vsElite = Math.round((value / (elite.min ?? 1)) * 100);
    }
  }

  // Get recommendations
  const rec = BIOMECH_RECOMMENDATIONS[metricName]?.[status.toLowerCase() as 'attention' | 'concern'];

  // Format elite standard string
  let eliteStandard: string;
  if (elite.min !== undefined && elite.max !== undefined) {
    eliteStandard = `${elite.min}-${elite.max} ${unit}`;
  } else if (elite.max !== undefined) {
    eliteStandard = `< ${elite.max} ${unit}`;
  } else {
    eliteStandard = `> ${elite.min} ${unit}`;
  }

  return {
    metric: metricName,
    value,
    unit,
    status,
    vsElite: Math.min(100, Math.max(0, vsElite)),
    eliteStandard,
    issue: rec?.issue,
    recommendation: rec?.recommendation,
    drills: rec?.drills,
    injuryRisk: rec?.injuryRisk
  };
}

/**
 * Analyze complete biomechanics data
 */
export function analyzeBiomechanics(data: BiomechData): BiomechSummary {
  const analyses: BiomechAnalysisOutput[] = [];

  // Contact Time (average both legs)
  if (data.contactTimeLeft !== undefined && data.contactTimeRight !== undefined) {
    const avgContact = (data.contactTimeLeft + data.contactTimeRight) / 2;
    analyses.push(analyzeBiomechMetric('contactTime', avgContact, BIOMECH_STANDARDS.contactTime));

    // Calculate asymmetry
    const asymmetry = Math.abs(data.contactTimeLeft - data.contactTimeRight) /
      ((data.contactTimeLeft + data.contactTimeRight) / 2) * 100;
    analyses.push(analyzeBiomechMetric('contactAsymmetry', asymmetry, BIOMECH_STANDARDS.contactAsymmetry));
  }

  // Flight Time
  if (data.flightTime !== undefined) {
    analyses.push(analyzeBiomechMetric('flightTime', data.flightTime, BIOMECH_STANDARDS.flightTime));
  }

  // Step Frequency
  if (data.stepFrequency !== undefined) {
    analyses.push(analyzeBiomechMetric('stepFrequency', data.stepFrequency, BIOMECH_STANDARDS.stepFrequency));
  }

  // Step Length
  if (data.stepLength !== undefined) {
    analyses.push(analyzeBiomechMetric('stepLength', data.stepLength, BIOMECH_STANDARDS.stepLength));
  }

  // Vertical Oscillation
  if (data.verticalOscillation !== undefined) {
    analyses.push(analyzeBiomechMetric('verticalOscillation', data.verticalOscillation, BIOMECH_STANDARDS.verticalOscillation));
  }

  // Force Asymmetry
  if (data.forceAsymmetry !== undefined) {
    analyses.push(analyzeBiomechMetric('forceAsymmetry', data.forceAsymmetry, BIOMECH_STANDARDS.forceAsymmetry));
  }

  // Overstride
  if (data.overstrideAngle !== undefined) {
    analyses.push(analyzeBiomechMetric('overstrideAngle', data.overstrideAngle, BIOMECH_STANDARDS.overstrideAngle));
  }
  if (data.overstrideDistance !== undefined) {
    analyses.push(analyzeBiomechMetric('overstrideDistance', data.overstrideDistance, BIOMECH_STANDARDS.overstrideDistance));
  }

  // Trunk Lean
  if (data.trunkLean !== undefined) {
    analyses.push(analyzeBiomechMetric('trunkLean', data.trunkLean, BIOMECH_STANDARDS.trunkLean));
  }

  // Block Clearance
  if (data.blockClearanceTime !== undefined) {
    analyses.push(analyzeBiomechMetric('blockClearanceTime', data.blockClearanceTime, BIOMECH_STANDARDS.blockClearanceTime));
  }

  // Calculate Overall Technical Score
  const scores = analyses.map(a => a.vsElite);
  const overallTechnicalScore = scores.length > 0
    ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
    : 0;

  // Determine Injury Risk
  const highRiskItems = analyses.filter(a => a.injuryRisk === 'HIGH');
  const mediumRiskItems = analyses.filter(a => a.injuryRisk === 'MEDIUM');

  let overallInjuryRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  if (highRiskItems.length > 0) {
    overallInjuryRisk = 'HIGH';
  } else if (mediumRiskItems.length >= 2) {
    overallInjuryRisk = 'HIGH';
  } else if (mediumRiskItems.length > 0) {
    overallInjuryRisk = 'MEDIUM';
  } else {
    overallInjuryRisk = 'LOW';
  }

  // Primary Concerns
  const primaryConcerns = analyses
    .filter(a => a.status === 'CONCERN' || a.status === 'ATTENTION')
    .map(a => a.issue || `${a.metric}: ${a.value}${a.unit}`);

  // Priority Fixes (top 3)
  const priorityFixes = analyses
    .filter(a => a.recommendation)
    .sort((a, b) => {
      const riskOrder = { HIGH: 0, MEDIUM: 1, LOW: 2, undefined: 3 };
      return (riskOrder[a.injuryRisk as keyof typeof riskOrder] ?? 3) -
             (riskOrder[b.injuryRisk as keyof typeof riskOrder] ?? 3);
    })
    .slice(0, 3)
    .map(a => a.recommendation!);

  return {
    overallTechnicalScore,
    overallInjuryRisk,
    primaryConcerns,
    priorityFixes,
    analyses
  };
}

/**
 * Generate biomechanics report
 */
export function generateBiomechReport(summary: BiomechSummary): string {
  let report = '# BIOMECHANICS ANALYSIS REPORT\n\n';

  // Overall Score
  report += `## Technical Score: ${summary.overallTechnicalScore}/100\n`;
  report += `## Injury Risk: ${summary.overallInjuryRisk}\n\n`;

  // Metrics Table
  report += '## Metrics Analysis\n\n';
  report += '| Metric | Value | Elite Standard | Status | vs Elite |\n';
  report += '|--------|-------|----------------|--------|----------|\n';

  for (const analysis of summary.analyses) {
    const statusEmoji = {
      ELITE: '🏆',
      GOOD: '✅',
      ATTENTION: '⚠️',
      CONCERN: '🔴'
    };
    report += `| ${analysis.metric} | ${analysis.value}${analysis.unit} | ${analysis.eliteStandard} | ${statusEmoji[analysis.status]} | ${analysis.vsElite}% |\n`;
  }
  report += '\n';

  // Primary Concerns
  if (summary.primaryConcerns.length > 0) {
    report += '## Primary Concerns\n\n';
    for (const concern of summary.primaryConcerns) {
      report += `- ${concern}\n`;
    }
    report += '\n';
  }

  // Priority Fixes
  if (summary.priorityFixes.length > 0) {
    report += '## Priority Technical Fixes\n\n';
    for (let i = 0; i < summary.priorityFixes.length; i++) {
      report += `${i + 1}. ${summary.priorityFixes[i]}\n`;
    }
    report += '\n';
  }

  // Drill Recommendations
  const allDrills = new Set<string>();
  summary.analyses
    .filter(a => a.drills)
    .forEach(a => a.drills!.forEach(d => allDrills.add(d)));

  if (allDrills.size > 0) {
    report += '## Recommended Drills\n\n';
    for (const drill of allDrills) {
      report += `- ${drill}\n`;
    }
  }

  return report;
}
