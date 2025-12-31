// ============================================
// BLOOD ANALYSIS RULE ENGINE
// Elite Athletic Reference Ranges & Analysis
// ============================================

export interface BloodTestResult {
  marker: string;
  value: number;
  unit: string;
}

export interface BloodAnalysisOutput {
  marker: string;
  value: number;
  unit: string;
  status: 'OPTIMAL' | 'ATTENTION' | 'CRITICAL';
  percentOfOptimal: number;
  optimalRange: string;
  recommendation: string;
  trainingImpact: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface BloodOverallStatus {
  overallStatus: 'OPTIMAL' | 'ATTENTION' | 'CRITICAL';
  score: number;
  criticalMarkers: string[];
  attentionMarkers: string[];
  recommendations: string[];
  trainingModifications: string[];
}

// ============================================
// REFERENCE RANGES (Athletic Population)
// ============================================

export const BLOOD_REFERENCE_RANGES: Record<string, {
  male?: { optimal: [number, number]; attention: [number, number]; critical: [number, number] };
  female?: { optimal: [number, number]; attention: [number, number]; critical: [number, number] };
  default?: { optimal: [number, number]; attention: [number, number]; critical: [number, number] };
  unit: string;
  higherIsBetter?: boolean;
}> = {
  // Complete Blood Count
  hemoglobin: {
    male: { optimal: [15.0, 17.5], attention: [13.5, 15.0], critical: [0, 13.5] },
    female: { optimal: [13.5, 16.0], attention: [12.0, 13.5], critical: [0, 12.0] },
    unit: 'g/dL'
  },
  hematocrit: {
    male: { optimal: [42, 50], attention: [38, 42], critical: [0, 38] },
    female: { optimal: [38, 46], attention: [35, 38], critical: [0, 35] },
    unit: '%'
  },
  rbc: {
    male: { optimal: [4.7, 6.1], attention: [4.2, 4.7], critical: [0, 4.2] },
    female: { optimal: [4.2, 5.4], attention: [3.8, 4.2], critical: [0, 3.8] },
    unit: 'million/mcL'
  },
  wbc: {
    default: { optimal: [4.5, 11.0], attention: [3.5, 4.5], critical: [0, 3.5] },
    unit: 'thousand/mcL'
  },
  platelets: {
    default: { optimal: [150, 400], attention: [100, 150], critical: [0, 100] },
    unit: 'thousand/mcL'
  },

  // Iron Panel
  ferritin: {
    male: { optimal: [100, 300], attention: [50, 100], critical: [0, 30] },
    female: { optimal: [50, 150], attention: [30, 50], critical: [0, 20] },
    unit: 'ng/mL'
  },
  serumIron: {
    default: { optimal: [60, 170], attention: [40, 60], critical: [0, 40] },
    unit: 'mcg/dL'
  },
  tibc: {
    default: { optimal: [250, 370], attention: [370, 450], critical: [450, 600] },
    unit: 'mcg/dL',
    higherIsBetter: false
  },
  transferrinSat: {
    default: { optimal: [25, 50], attention: [15, 25], critical: [0, 15] },
    unit: '%'
  },

  // Muscle & Recovery Markers
  creatineKinase: {
    default: { optimal: [100, 400], attention: [400, 1000], critical: [1000, 50000] },
    unit: 'U/L',
    higherIsBetter: false
  },
  ldh: {
    default: { optimal: [120, 250], attention: [250, 400], critical: [400, 1000] },
    unit: 'U/L',
    higherIsBetter: false
  },
  myoglobin: {
    default: { optimal: [25, 72], attention: [72, 150], critical: [150, 1000] },
    unit: 'ng/mL',
    higherIsBetter: false
  },

  // Hormones
  cortisol: {
    default: { optimal: [10, 20], attention: [5, 10], critical: [0, 5] },
    unit: 'mcg/dL'
  },
  testosterone: {
    male: { optimal: [500, 1000], attention: [350, 500], critical: [0, 350] },
    female: { optimal: [15, 70], attention: [10, 15], critical: [0, 10] },
    unit: 'ng/dL'
  },
  tCRatio: {
    default: { optimal: [0.035, 0.1], attention: [0.02, 0.035], critical: [0, 0.02] },
    unit: 'ratio'
  },

  // Thyroid
  tsh: {
    default: { optimal: [0.5, 2.5], attention: [2.5, 4.0], critical: [4.0, 10.0] },
    unit: 'mIU/L',
    higherIsBetter: false
  },
  freeT4: {
    default: { optimal: [0.9, 1.7], attention: [0.7, 0.9], critical: [0, 0.7] },
    unit: 'ng/dL'
  },
  freeT3: {
    default: { optimal: [2.3, 4.2], attention: [2.0, 2.3], critical: [0, 2.0] },
    unit: 'pg/mL'
  },

  // Vitamins & Minerals
  vitaminD: {
    default: { optimal: [50, 80], attention: [30, 50], critical: [0, 30] },
    unit: 'ng/mL'
  },
  vitaminB12: {
    default: { optimal: [500, 1000], attention: [300, 500], critical: [0, 300] },
    unit: 'pg/mL'
  },
  folate: {
    default: { optimal: [10, 25], attention: [5, 10], critical: [0, 5] },
    unit: 'ng/mL'
  },
  magnesium: {
    default: { optimal: [2.0, 2.5], attention: [1.7, 2.0], critical: [0, 1.7] },
    unit: 'mg/dL'
  },
  zinc: {
    default: { optimal: [80, 120], attention: [60, 80], critical: [0, 60] },
    unit: 'mcg/dL'
  },
  calcium: {
    default: { optimal: [9.0, 10.5], attention: [8.5, 9.0], critical: [0, 8.5] },
    unit: 'mg/dL'
  },

  // Metabolic
  glucose: {
    default: { optimal: [70, 100], attention: [100, 125], critical: [125, 300] },
    unit: 'mg/dL',
    higherIsBetter: false
  },
  hba1c: {
    default: { optimal: [4.0, 5.7], attention: [5.7, 6.4], critical: [6.4, 10.0] },
    unit: '%',
    higherIsBetter: false
  },
  cholesterol: {
    default: { optimal: [125, 200], attention: [200, 240], critical: [240, 400] },
    unit: 'mg/dL',
    higherIsBetter: false
  },
  hdl: {
    male: { optimal: [40, 80], attention: [35, 40], critical: [0, 35] },
    female: { optimal: [50, 90], attention: [40, 50], critical: [0, 40] },
    unit: 'mg/dL'
  },
  ldl: {
    default: { optimal: [50, 100], attention: [100, 160], critical: [160, 300] },
    unit: 'mg/dL',
    higherIsBetter: false
  },
  triglycerides: {
    default: { optimal: [50, 150], attention: [150, 200], critical: [200, 500] },
    unit: 'mg/dL',
    higherIsBetter: false
  },

  // Kidney & Liver
  creatinine: {
    male: { optimal: [0.7, 1.3], attention: [1.3, 1.5], critical: [1.5, 5.0] },
    female: { optimal: [0.6, 1.1], attention: [1.1, 1.3], critical: [1.3, 5.0] },
    unit: 'mg/dL',
    higherIsBetter: false
  },
  bun: {
    default: { optimal: [7, 20], attention: [20, 25], critical: [25, 50] },
    unit: 'mg/dL',
    higherIsBetter: false
  },
  ast: {
    default: { optimal: [10, 40], attention: [40, 80], critical: [80, 500] },
    unit: 'U/L',
    higherIsBetter: false
  },
  alt: {
    default: { optimal: [7, 56], attention: [56, 100], critical: [100, 500] },
    unit: 'U/L',
    higherIsBetter: false
  },

  // Inflammation
  crp: {
    default: { optimal: [0, 1.0], attention: [1.0, 3.0], critical: [3.0, 100] },
    unit: 'mg/L',
    higherIsBetter: false
  },
  esr: {
    male: { optimal: [0, 15], attention: [15, 30], critical: [30, 100] },
    female: { optimal: [0, 20], attention: [20, 35], critical: [35, 100] },
    unit: 'mm/hr',
    higherIsBetter: false
  }
};

// ============================================
// RECOMMENDATIONS DATABASE
// ============================================

export const BLOOD_RECOMMENDATIONS: Record<string, {
  critical?: { recommendation: string; trainingImpact: string; priority: 'HIGH' | 'MEDIUM' | 'LOW' };
  attention?: { recommendation: string; trainingImpact: string; priority: 'HIGH' | 'MEDIUM' | 'LOW' };
}> = {
  ferritin: {
    critical: {
      recommendation: 'Iron supplementation required. Ferrous sulfate 325mg/day with Vitamin C (enhances absorption). Take on empty stomach. Avoid with calcium/coffee. Retest in 6-8 weeks. Consider IV iron if oral fails.',
      trainingImpact: 'REDUCE intensity by 20-30%. Focus on aerobic base work. Avoid high-intensity sessions until ferritin > 50. Monitor for unusual fatigue.',
      priority: 'HIGH'
    },
    attention: {
      recommendation: 'Increase iron-rich foods: red meat (3x/week), spinach, legumes, fortified cereals. Consider low-dose supplement (18mg/day). Pair with Vitamin C. Retest in 8-12 weeks.',
      trainingImpact: 'Monitor fatigue closely. May need 10-15% reduction in high-intensity work if symptomatic.',
      priority: 'MEDIUM'
    }
  },
  hemoglobin: {
    critical: {
      recommendation: 'Medical evaluation required. Rule out anemia causes (iron, B12, folate). Complete blood workup needed. May require iron infusion or further investigation.',
      trainingImpact: 'Significant reduction in training until resolved. Endurance work limited. No altitude training.',
      priority: 'HIGH'
    },
    attention: {
      recommendation: 'Monitor iron panel closely. Ensure adequate protein and micronutrient intake. Consider altitude camp for natural EPO stimulation.',
      trainingImpact: 'May experience reduced endurance capacity. Adjust pacing expectations.',
      priority: 'MEDIUM'
    }
  },
  creatineKinase: {
    critical: {
      recommendation: 'IMMEDIATE rest required. Rule out rhabdomyolysis - check urine color. Medical review needed. Hydrate aggressively (3-4L/day). Avoid NSAIDs. Retest in 48-72 hours.',
      trainingImpact: 'NO training until CK < 1000 U/L. Complete rest 48-72 hours minimum. Pool walking only if needed.',
      priority: 'HIGH'
    },
    attention: {
      recommendation: 'Increase recovery protocols: sleep, hydration, protein intake (2g/kg). Add extra rest day. Consider massage, contrast therapy. Reduce eccentric loading.',
      trainingImpact: 'Reduce volume by 30-40%. Focus on low-impact activities. No heavy eccentrics or plyometrics.',
      priority: 'MEDIUM'
    }
  },
  cortisol: {
    critical: {
      recommendation: 'Signs of severe stress/overtraining. Immediate lifestyle intervention: sleep hygiene, stress management, nutrition timing. Medical consultation if persistent. Consider adaptogens (ashwagandha).',
      trainingImpact: 'Deload week REQUIRED. Reduce volume 50%, intensity capped at 70%. Focus on restoration.',
      priority: 'HIGH'
    },
    attention: {
      recommendation: 'Early warning of overtraining. Review training load, sleep quality, life stressors. Prioritize recovery. Ensure post-workout nutrition.',
      trainingImpact: 'Consider reducing training stress by 20%. Add recovery sessions.',
      priority: 'MEDIUM'
    }
  },
  tCRatio: {
    critical: {
      recommendation: 'Catabolic state detected. Body is breaking down faster than building. IMMEDIATE intervention: deload, sleep optimization, calorie increase, stress reduction.',
      trainingImpact: 'STOP all high-intensity training. 7-14 day recovery period. Light activity only.',
      priority: 'HIGH'
    },
    attention: {
      recommendation: 'Approaching catabolic state. Review recovery practices. Increase protein, improve sleep, reduce training monotony.',
      trainingImpact: 'Reduce intensity by 15-20%. Add extra recovery day. Monitor closely.',
      priority: 'MEDIUM'
    }
  },
  vitaminD: {
    critical: {
      recommendation: 'Supplement with Vitamin D3 5000-10000 IU/day for 8 weeks, then 2000-4000 IU/day maintenance. Take with fat-containing meal. Retest in 8 weeks.',
      trainingImpact: 'Increased injury risk, particularly stress fractures. Reduce high-impact volume by 25%. Monitor bone stress areas.',
      priority: 'HIGH'
    },
    attention: {
      recommendation: 'Supplement with Vitamin D3 2000-4000 IU/day. Increase sun exposure (15-20 min/day). Include fatty fish, eggs, fortified foods.',
      trainingImpact: 'Minor impact. Monitor for fatigue and muscle weakness.',
      priority: 'MEDIUM'
    }
  },
  vitaminB12: {
    critical: {
      recommendation: 'B12 injections may be required (1000mcg weekly x 4, then monthly). Rule out pernicious anemia. If vegetarian/vegan, lifelong supplementation needed.',
      trainingImpact: 'Reduced energy and neural function. May affect coordination and reaction time.',
      priority: 'HIGH'
    },
    attention: {
      recommendation: 'Supplement with B12 1000mcg/day sublingual or 2500mcg/week. Increase animal products or fortified foods.',
      trainingImpact: 'Monitor energy levels and cognitive function.',
      priority: 'MEDIUM'
    }
  },
  magnesium: {
    critical: {
      recommendation: 'Supplement with Magnesium glycinate or citrate 400-600mg/day (split doses). Increase nuts, seeds, dark leafy greens, dark chocolate.',
      trainingImpact: 'Increased cramp risk, reduced muscle function. May affect sleep quality.',
      priority: 'HIGH'
    },
    attention: {
      recommendation: 'Add magnesium-rich foods. Consider 200-400mg supplement, especially if heavy sweater.',
      trainingImpact: 'Minor impact. Watch for muscle cramps.',
      priority: 'LOW'
    }
  },
  crp: {
    critical: {
      recommendation: 'Active inflammation detected. Identify source: injury, infection, overtraining. Anti-inflammatory diet (omega-3, turmeric). Medical review if no obvious cause.',
      trainingImpact: 'Reduce training load significantly. Body is under stress. Rest until normalized.',
      priority: 'HIGH'
    },
    attention: {
      recommendation: 'Mild inflammation. May be training-induced. Improve recovery, anti-inflammatory foods, adequate sleep.',
      trainingImpact: 'Monitor recovery quality. May need extra rest days.',
      priority: 'MEDIUM'
    }
  },
  tsh: {
    critical: {
      recommendation: 'Thyroid dysfunction detected. Medical consultation required. May need thyroid medication. Affects metabolism significantly.',
      trainingImpact: 'Training capacity significantly reduced. Weight management difficult. Fatigue common.',
      priority: 'HIGH'
    },
    attention: {
      recommendation: 'Borderline thyroid function. Retest in 4-6 weeks. Ensure adequate iodine and selenium intake.',
      trainingImpact: 'May experience subtle fatigue or weight changes.',
      priority: 'MEDIUM'
    }
  }
};

// ============================================
// ANALYSIS FUNCTIONS
// ============================================

/**
 * Analyze a single blood marker
 */
export function analyzeBloodMarker(
  marker: string,
  value: number,
  gender: 'male' | 'female'
): BloodAnalysisOutput | null {
  const markerKey = marker.toLowerCase().replace(/[\s_-]/g, '');
  const ranges = BLOOD_REFERENCE_RANGES[markerKey];

  if (!ranges) {
    return null;
  }

  const genderRanges = ranges[gender] || ranges.default;
  if (!genderRanges) {
    return null;
  }

  const { optimal, attention, critical } = genderRanges;
  const higherIsBetter = ranges.higherIsBetter !== false;

  let status: 'OPTIMAL' | 'ATTENTION' | 'CRITICAL';
  let percentOfOptimal: number;

  const [optMin, optMax] = optimal;
  const midOptimal = (optMin + optMax) / 2;

  if (higherIsBetter) {
    // Higher values are better (hemoglobin, ferritin, etc.)
    if (value >= optMin && value <= optMax) {
      status = 'OPTIMAL';
      percentOfOptimal = 100;
    } else if (value >= attention[0] && value < optMin) {
      status = 'ATTENTION';
      percentOfOptimal = Math.round((value / optMin) * 100);
    } else if (value < attention[0]) {
      status = 'CRITICAL';
      percentOfOptimal = Math.round((value / optMin) * 100);
    } else if (value > optMax) {
      // High values - may also be concerning
      status = value > optMax * 1.2 ? 'ATTENTION' : 'OPTIMAL';
      percentOfOptimal = 100;
    } else {
      status = 'OPTIMAL';
      percentOfOptimal = 100;
    }
  } else {
    // Lower values are better (CK, CRP, glucose, etc.)
    if (value >= optimal[0] && value <= optimal[1]) {
      status = 'OPTIMAL';
      percentOfOptimal = 100;
    } else if (value > attention[0] && value <= attention[1]) {
      status = 'ATTENTION';
      percentOfOptimal = Math.round((optimal[1] / value) * 100);
    } else if (value > critical[0]) {
      status = 'CRITICAL';
      percentOfOptimal = Math.round((optimal[1] / value) * 100);
    } else {
      status = 'OPTIMAL';
      percentOfOptimal = 100;
    }
  }

  // Get recommendations
  const recommendations = BLOOD_RECOMMENDATIONS[markerKey];
  const rec = recommendations?.[status.toLowerCase() as 'critical' | 'attention'];

  return {
    marker,
    value,
    unit: ranges.unit,
    status,
    percentOfOptimal: Math.min(100, Math.max(0, percentOfOptimal)),
    optimalRange: `${optMin} - ${optMax} ${ranges.unit}`,
    recommendation: rec?.recommendation || 'Within acceptable range. Continue current practices.',
    trainingImpact: rec?.trainingImpact || 'No significant training modifications needed.',
    priority: rec?.priority || 'LOW'
  };
}

/**
 * Analyze complete blood panel
 */
export function analyzeBloodPanel(
  tests: BloodTestResult[],
  gender: 'male' | 'female'
): BloodAnalysisOutput[] {
  const results: BloodAnalysisOutput[] = [];

  for (const test of tests) {
    const analysis = analyzeBloodMarker(test.marker, test.value, gender);
    if (analysis) {
      results.push(analysis);
    }
  }

  // Sort by priority
  const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  results.sort((a, b) => {
    if (a.status !== b.status) {
      const statusOrder = { CRITICAL: 0, ATTENTION: 1, OPTIMAL: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return results;
}

/**
 * Calculate overall blood status
 */
export function calculateOverallBloodStatus(
  analyses: BloodAnalysisOutput[]
): BloodOverallStatus {
  const criticalMarkers = analyses
    .filter(a => a.status === 'CRITICAL')
    .map(a => a.marker);

  const attentionMarkers = analyses
    .filter(a => a.status === 'ATTENTION')
    .map(a => a.marker);

  // Calculate score
  let score = 100;
  score -= criticalMarkers.length * 20;
  score -= attentionMarkers.length * 5;
  score = Math.max(0, Math.min(100, score));

  // Determine overall status
  let overallStatus: 'OPTIMAL' | 'ATTENTION' | 'CRITICAL';
  if (criticalMarkers.length > 0) {
    overallStatus = 'CRITICAL';
  } else if (attentionMarkers.length > 2) {
    overallStatus = 'ATTENTION';
  } else if (attentionMarkers.length > 0) {
    overallStatus = 'ATTENTION';
  } else {
    overallStatus = 'OPTIMAL';
  }

  // Compile recommendations
  const recommendations = analyses
    .filter(a => a.status !== 'OPTIMAL')
    .sort((a, b) => {
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .map(a => `${a.marker}: ${a.recommendation}`);

  // Compile training modifications
  const trainingModifications = analyses
    .filter(a => a.status !== 'OPTIMAL' && a.priority !== 'LOW')
    .map(a => a.trainingImpact);

  return {
    overallStatus,
    score,
    criticalMarkers,
    attentionMarkers,
    recommendations,
    trainingModifications
  };
}

/**
 * Generate blood test report for coach
 */
export function generateBloodReport(
  analyses: BloodAnalysisOutput[],
  overallStatus: BloodOverallStatus
): string {
  let report = '# BLOOD TEST ANALYSIS REPORT\n\n';

  // Overall Status
  report += `## Overall Status: ${overallStatus.overallStatus}\n`;
  report += `Score: ${overallStatus.score}/100\n\n`;

  // Critical Issues
  if (overallStatus.criticalMarkers.length > 0) {
    report += '## ⚠️ CRITICAL ISSUES\n';
    for (const marker of overallStatus.criticalMarkers) {
      const analysis = analyses.find(a => a.marker === marker);
      if (analysis) {
        report += `- **${marker}**: ${analysis.value} ${analysis.unit} (Optimal: ${analysis.optimalRange})\n`;
        report += `  - ${analysis.recommendation}\n`;
      }
    }
    report += '\n';
  }

  // Attention Items
  if (overallStatus.attentionMarkers.length > 0) {
    report += '## ⚡ ATTENTION NEEDED\n';
    for (const marker of overallStatus.attentionMarkers) {
      const analysis = analyses.find(a => a.marker === marker);
      if (analysis) {
        report += `- **${marker}**: ${analysis.value} ${analysis.unit} (Optimal: ${analysis.optimalRange})\n`;
      }
    }
    report += '\n';
  }

  // Training Impact
  if (overallStatus.trainingModifications.length > 0) {
    report += '## 🏃 TRAINING MODIFICATIONS\n';
    for (const mod of overallStatus.trainingModifications) {
      report += `- ${mod}\n`;
    }
    report += '\n';
  }

  // All Results Table
  report += '## 📊 COMPLETE RESULTS\n\n';
  report += '| Marker | Value | Optimal Range | Status |\n';
  report += '|--------|-------|---------------|--------|\n';
  for (const analysis of analyses) {
    const statusEmoji = analysis.status === 'OPTIMAL' ? '✅' :
                        analysis.status === 'ATTENTION' ? '⚠️' : '🔴';
    report += `| ${analysis.marker} | ${analysis.value} ${analysis.unit} | ${analysis.optimalRange} | ${statusEmoji} ${analysis.status} |\n`;
  }

  return report;
}
