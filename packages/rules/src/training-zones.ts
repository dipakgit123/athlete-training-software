/**
 * Training Zones & Intensity Parameters
 * Elite Athletics Performance System
 *
 * Comprehensive training zone definitions for:
 * - Sprint velocity zones
 * - Strength training intensities
 * - Endurance heart rate / power zones
 * - Plyometric progressions
 */

// ==================== SPRINT VELOCITY ZONES ====================

export interface SprintZone {
  zone: number;
  name: string;
  intensityMin: number;      // % of max velocity
  intensityMax: number;
  purpose: string;
  recoveryMin: number;       // seconds
  recoveryMax: number;
  typicalDistances: number[]; // meters
  cnsLoad: 'low' | 'medium' | 'high' | 'very_high';
}

export const SPRINT_ZONES: SprintZone[] = [
  {
    zone: 1,
    name: 'Warm-up / Recovery',
    intensityMin: 60,
    intensityMax: 70,
    purpose: 'Warm-up, cool-down, active recovery',
    recoveryMin: 30,
    recoveryMax: 60,
    typicalDistances: [100, 150, 200],
    cnsLoad: 'low'
  },
  {
    zone: 2,
    name: 'Acceleration Development',
    intensityMin: 75,
    intensityMax: 85,
    purpose: 'Acceleration mechanics, drive phase development',
    recoveryMin: 120,
    recoveryMax: 180,
    typicalDistances: [20, 30, 40, 50],
    cnsLoad: 'medium'
  },
  {
    zone: 3,
    name: 'Speed Development',
    intensityMin: 85,
    intensityMax: 92,
    purpose: 'Speed development, transition to max velocity',
    recoveryMin: 240,
    recoveryMax: 360,
    typicalDistances: [40, 50, 60, 80],
    cnsLoad: 'high'
  },
  {
    zone: 4,
    name: 'Maximum Velocity',
    intensityMin: 93,
    intensityMax: 97,
    purpose: 'Max velocity training, flying sprints',
    recoveryMin: 360,
    recoveryMax: 480,
    typicalDistances: [20, 30, 40, 60],
    cnsLoad: 'very_high'
  },
  {
    zone: 5,
    name: 'Competition / Peak',
    intensityMin: 98,
    intensityMax: 100,
    purpose: 'Competition simulation, time trials, peaking',
    recoveryMin: 480,
    recoveryMax: 720,
    typicalDistances: [30, 60, 100, 150, 200],
    cnsLoad: 'very_high'
  }
];

// ==================== STRENGTH TRAINING ZONES ====================

export interface StrengthZone {
  phase: string;
  intensityMin: number;      // % 1RM
  intensityMax: number;
  setsMin: number;
  setsMax: number;
  repsMin: number;
  repsMax: number;
  restMin: number;           // seconds
  restMax: number;
  tempo: string;             // eccentric-pause-concentric-pause
  purpose: string;
  frequency: number;         // times per week
}

export const STRENGTH_ZONES: Record<string, StrengthZone> = {
  ANATOMICAL_ADAPTATION: {
    phase: 'Anatomical Adaptation',
    intensityMin: 50,
    intensityMax: 65,
    setsMin: 2,
    setsMax: 3,
    repsMin: 12,
    repsMax: 15,
    restMin: 60,
    restMax: 90,
    tempo: '2-0-2-0',
    purpose: 'Tissue preparation, movement patterns, work capacity',
    frequency: 3
  },
  HYPERTROPHY: {
    phase: 'Hypertrophy',
    intensityMin: 65,
    intensityMax: 75,
    setsMin: 3,
    setsMax: 4,
    repsMin: 8,
    repsMax: 12,
    restMin: 90,
    restMax: 120,
    tempo: '3-1-2-0',
    purpose: 'Muscle cross-sectional area increase',
    frequency: 3
  },
  MAX_STRENGTH: {
    phase: 'Maximum Strength',
    intensityMin: 85,
    intensityMax: 95,
    setsMin: 4,
    setsMax: 6,
    repsMin: 2,
    repsMax: 5,
    restMin: 180,
    restMax: 300,
    tempo: '2-1-X-0',
    purpose: 'Neural adaptations, max force production',
    frequency: 2
  },
  POWER: {
    phase: 'Power',
    intensityMin: 40,
    intensityMax: 70,
    setsMin: 4,
    setsMax: 6,
    repsMin: 3,
    repsMax: 5,
    restMin: 180,
    restMax: 300,
    tempo: 'X-0-X-0',
    purpose: 'Rate of force development, explosive power',
    frequency: 2
  },
  STRENGTH_SPEED: {
    phase: 'Strength-Speed',
    intensityMin: 70,
    intensityMax: 85,
    setsMin: 3,
    setsMax: 5,
    repsMin: 3,
    repsMax: 6,
    restMin: 180,
    restMax: 240,
    tempo: '2-0-X-0',
    purpose: 'Force at higher velocities, sport transfer',
    frequency: 2
  },
  SPEED_STRENGTH: {
    phase: 'Speed-Strength',
    intensityMin: 30,
    intensityMax: 50,
    setsMin: 3,
    setsMax: 5,
    repsMin: 3,
    repsMax: 6,
    restMin: 180,
    restMax: 300,
    tempo: 'X-0-X-0',
    purpose: 'High velocity movements, ballistic training',
    frequency: 2
  },
  MAINTENANCE: {
    phase: 'Maintenance / Peak',
    intensityMin: 80,
    intensityMax: 90,
    setsMin: 2,
    setsMax: 3,
    repsMin: 2,
    repsMax: 3,
    restMin: 240,
    restMax: 300,
    tempo: '2-0-X-0',
    purpose: 'Maintain strength adaptations during competition',
    frequency: 1
  },
  STRENGTH_ENDURANCE: {
    phase: 'Strength Endurance',
    intensityMin: 40,
    intensityMax: 60,
    setsMin: 2,
    setsMax: 4,
    repsMin: 15,
    repsMax: 25,
    restMin: 45,
    restMax: 90,
    tempo: '2-0-2-0',
    purpose: 'Muscular endurance, circuit training',
    frequency: 2
  }
};

// ==================== ENDURANCE TRAINING ZONES ====================

export interface EnduranceZone {
  zone: number;
  name: string;
  hrMin: number;             // % HRmax
  hrMax: number;
  vo2Min: number;            // % VO2max
  vo2Max: number;
  lactateMin: number;        // mmol/L
  lactateMax: number;
  rpeMin: number;            // 1-10 scale
  rpeMax: number;
  purpose: string;
  typicalDuration: string;
  weeklyDistribution: number; // % of weekly volume (distance events)
}

export const ENDURANCE_ZONES: EnduranceZone[] = [
  {
    zone: 1,
    name: 'Recovery',
    hrMin: 55,
    hrMax: 65,
    vo2Min: 40,
    vo2Max: 50,
    lactateMin: 0.8,
    lactateMax: 2.0,
    rpeMin: 2,
    rpeMax: 3,
    purpose: 'Active recovery, regeneration, blood flow',
    typicalDuration: '20-40 min',
    weeklyDistribution: 15
  },
  {
    zone: 2,
    name: 'Aerobic Base',
    hrMin: 65,
    hrMax: 75,
    vo2Min: 50,
    vo2Max: 65,
    lactateMin: 2.0,
    lactateMax: 2.5,
    rpeMin: 3,
    rpeMax: 4,
    purpose: 'Aerobic capacity, fat oxidation, mitochondrial density',
    typicalDuration: '45-90 min',
    weeklyDistribution: 50
  },
  {
    zone: 3,
    name: 'Tempo / Aerobic Power',
    hrMin: 75,
    hrMax: 82,
    vo2Min: 65,
    vo2Max: 80,
    lactateMin: 2.5,
    lactateMax: 4.0,
    rpeMin: 5,
    rpeMax: 6,
    purpose: 'Aerobic power, running economy, lactate clearance',
    typicalDuration: '20-40 min',
    weeklyDistribution: 15
  },
  {
    zone: 4,
    name: 'Threshold',
    hrMin: 82,
    hrMax: 88,
    vo2Min: 80,
    vo2Max: 90,
    lactateMin: 4.0,
    lactateMax: 6.0,
    rpeMin: 7,
    rpeMax: 8,
    purpose: 'Lactate threshold, sustainable race pace',
    typicalDuration: '10-30 min',
    weeklyDistribution: 10
  },
  {
    zone: 5,
    name: 'VO2max',
    hrMin: 88,
    hrMax: 95,
    vo2Min: 90,
    vo2Max: 100,
    lactateMin: 6.0,
    lactateMax: 10.0,
    rpeMin: 8,
    rpeMax: 9,
    purpose: 'VO2max development, interval training',
    typicalDuration: '2-6 min intervals',
    weeklyDistribution: 7
  },
  {
    zone: 6,
    name: 'Anaerobic Capacity',
    hrMin: 95,
    hrMax: 100,
    vo2Min: 100,
    vo2Max: 120,
    lactateMin: 10.0,
    lactateMax: 20.0,
    rpeMin: 9,
    rpeMax: 10,
    purpose: 'Anaerobic capacity, lactate tolerance, speed',
    typicalDuration: '30s-2min intervals',
    weeklyDistribution: 3
  }
];

// ==================== PLYOMETRIC PROGRESSIONS ====================

export interface PlyometricLevel {
  level: string;
  contactsMin: number;
  contactsMax: number;
  intensity: 'low' | 'medium' | 'high' | 'very_high';
  exercises: string[];
  prerequisites: string[];
  dropHeight: number;        // cm (for depth jumps)
  loadingAllowed: boolean;
  recovery: number;          // hours between sessions
}

export const PLYOMETRIC_LEVELS: PlyometricLevel[] = [
  {
    level: 'Beginner',
    contactsMin: 40,
    contactsMax: 80,
    intensity: 'low',
    exercises: [
      'Ankle bounces in place',
      'Skipping for height',
      'Skipping for distance',
      'Low box step-ups with drive',
      'Single leg hops in place',
      'Line jumps (lateral)',
      'Pogos',
      'A-skips'
    ],
    prerequisites: ['Basic strength foundation', 'No current injuries'],
    dropHeight: 0,
    loadingAllowed: false,
    recovery: 48
  },
  {
    level: 'Intermediate',
    contactsMin: 80,
    contactsMax: 120,
    intensity: 'medium',
    exercises: [
      'Standing long jump',
      'Standing triple jump',
      'Alternate leg bounds',
      'Box jumps (40-50cm)',
      'Hurdle hops (low)',
      'Split jumps',
      'Lateral bounds',
      'Depth drops (30cm)',
      'Single leg box jumps'
    ],
    prerequisites: ['6+ months plyometric training', 'Squat 1.5x bodyweight'],
    dropHeight: 30,
    loadingAllowed: false,
    recovery: 48
  },
  {
    level: 'Advanced',
    contactsMin: 100,
    contactsMax: 140,
    intensity: 'high',
    exercises: [
      'Depth jumps (40-60cm)',
      'Bounding series (5-8 bounds)',
      'Hurdle hops (high)',
      'Single leg hurdle hops',
      'Altitude landings',
      'Reactive box jumps',
      'Medicine ball throws',
      'Weighted jumps (light)',
      'Drop jumps with rebound'
    ],
    prerequisites: ['12+ months training', 'Squat 2x bodyweight', 'Clean technique'],
    dropHeight: 60,
    loadingAllowed: true,
    recovery: 72
  },
  {
    level: 'Elite',
    contactsMin: 80,
    contactsMax: 120,
    intensity: 'very_high',
    exercises: [
      'Depth jumps (60-80cm)',
      'Complex training sets',
      'Reactive multi-jumps',
      'Weighted depth jumps',
      'Sport-specific plyos',
      'Maximum velocity bounds',
      'Single leg depth jumps',
      'Competition simulation'
    ],
    prerequisites: ['2+ years training', 'Squat 2.5x bodyweight', 'Elite movement quality'],
    dropHeight: 80,
    loadingAllowed: true,
    recovery: 72
  }
];

// ==================== EVENT-SPECIFIC TRAINING FOCUS ====================

export interface EventTrainingFocus {
  event: string;
  primaryEnergySystem: string;
  energyContribution: {
    atpPc: number;           // %
    glycolytic: number;      // %
    aerobic: number;         // %
  };
  keyQualities: string[];
  weeklyDistribution: {
    speed: number;           // %
    speedEndurance: number;  // %
    aerobic: number;         // %
    strength: number;        // %
    power: number;           // %
    technical: number;       // %
  };
  typicalWeeklyVolume: {
    sprint: string;          // meters
    tempo: string;           // meters
    strength: string;        // sessions
  };
}

export const EVENT_TRAINING_FOCUS: Record<string, EventTrainingFocus> = {
  '100M': {
    event: '100m Sprint',
    primaryEnergySystem: 'ATP-PC',
    energyContribution: { atpPc: 95, glycolytic: 4, aerobic: 1 },
    keyQualities: [
      'Maximum velocity',
      'Rate of force development',
      'Reaction time',
      'Acceleration',
      'Elastic power'
    ],
    weeklyDistribution: {
      speed: 40,
      speedEndurance: 5,
      aerobic: 5,
      strength: 20,
      power: 15,
      technical: 15
    },
    typicalWeeklyVolume: {
      sprint: '400-600m (max velocity)',
      tempo: '1500-2500m',
      strength: '2-3 sessions'
    }
  },
  '200M': {
    event: '200m Sprint',
    primaryEnergySystem: 'ATP-PC + Glycolytic',
    energyContribution: { atpPc: 65, glycolytic: 30, aerobic: 5 },
    keyQualities: [
      'Speed endurance',
      'Curve running technique',
      'Acceleration',
      'Lactate tolerance',
      'Relaxation at speed'
    ],
    weeklyDistribution: {
      speed: 35,
      speedEndurance: 15,
      aerobic: 10,
      strength: 15,
      power: 10,
      technical: 15
    },
    typicalWeeklyVolume: {
      sprint: '500-800m',
      tempo: '2000-3000m',
      strength: '2-3 sessions'
    }
  },
  '400M': {
    event: '400m Sprint',
    primaryEnergySystem: 'Glycolytic',
    energyContribution: { atpPc: 35, glycolytic: 50, aerobic: 15 },
    keyQualities: [
      'Special endurance',
      'Lactate tolerance',
      'Speed reserve',
      'Race distribution',
      'Glycolytic capacity'
    ],
    weeklyDistribution: {
      speed: 25,
      speedEndurance: 35,
      aerobic: 15,
      strength: 10,
      power: 5,
      technical: 10
    },
    typicalWeeklyVolume: {
      sprint: '600-1000m',
      tempo: '3000-4500m',
      strength: '2 sessions'
    }
  },
  '800M': {
    event: '800m Run',
    primaryEnergySystem: 'Mixed',
    energyContribution: { atpPc: 10, glycolytic: 50, aerobic: 40 },
    keyQualities: [
      'VO2max',
      'Lactate tolerance',
      'Finishing kick',
      'Tactical awareness',
      'Speed reserve'
    ],
    weeklyDistribution: {
      speed: 15,
      speedEndurance: 25,
      aerobic: 35,
      strength: 10,
      power: 5,
      technical: 10
    },
    typicalWeeklyVolume: {
      sprint: '300-500m',
      tempo: '6000-8000m',
      strength: '2 sessions'
    }
  },
  '1500M': {
    event: '1500m Run',
    primaryEnergySystem: 'Aerobic + Glycolytic',
    energyContribution: { atpPc: 5, glycolytic: 35, aerobic: 60 },
    keyQualities: [
      'VO2max',
      'Lactate threshold',
      'Tactical racing',
      'Finishing speed',
      'Running economy'
    ],
    weeklyDistribution: {
      speed: 10,
      speedEndurance: 20,
      aerobic: 45,
      strength: 10,
      power: 5,
      technical: 10
    },
    typicalWeeklyVolume: {
      sprint: '200-400m',
      tempo: '8000-12000m',
      strength: '2 sessions'
    }
  },
  '5000M': {
    event: '5000m Run',
    primaryEnergySystem: 'Aerobic',
    energyContribution: { atpPc: 2, glycolytic: 8, aerobic: 90 },
    keyQualities: [
      'VO2max',
      'Lactate threshold',
      'Running economy',
      'Pace judgment',
      'Mental toughness'
    ],
    weeklyDistribution: {
      speed: 5,
      speedEndurance: 15,
      aerobic: 60,
      strength: 8,
      power: 2,
      technical: 10
    },
    typicalWeeklyVolume: {
      sprint: '100-300m',
      tempo: '60-90 km/week',
      strength: '1-2 sessions'
    }
  },
  '10000M': {
    event: '10000m Run',
    primaryEnergySystem: 'Aerobic',
    energyContribution: { atpPc: 1, glycolytic: 5, aerobic: 94 },
    keyQualities: [
      'Aerobic capacity',
      'Running economy',
      'Lactate threshold',
      'Mental endurance',
      'Pace judgment'
    ],
    weeklyDistribution: {
      speed: 3,
      speedEndurance: 12,
      aerobic: 65,
      strength: 8,
      power: 2,
      technical: 10
    },
    typicalWeeklyVolume: {
      sprint: '100-200m',
      tempo: '80-120 km/week',
      strength: '1-2 sessions'
    }
  },
  'MARATHON': {
    event: 'Marathon',
    primaryEnergySystem: 'Aerobic',
    energyContribution: { atpPc: 0, glycolytic: 1, aerobic: 99 },
    keyQualities: [
      'Fat oxidation',
      'Running economy',
      'Mental endurance',
      'Fueling strategy',
      'Pace judgment'
    ],
    weeklyDistribution: {
      speed: 2,
      speedEndurance: 8,
      aerobic: 75,
      strength: 7,
      power: 1,
      technical: 7
    },
    typicalWeeklyVolume: {
      sprint: '0-100m',
      tempo: '120-180 km/week',
      strength: '1-2 sessions'
    }
  },
  'LONG_JUMP': {
    event: 'Long Jump',
    primaryEnergySystem: 'ATP-PC',
    energyContribution: { atpPc: 98, glycolytic: 2, aerobic: 0 },
    keyQualities: [
      'Approach speed',
      'Takeoff power',
      'Flight technique',
      'Elastic strength',
      'Consistency'
    ],
    weeklyDistribution: {
      speed: 30,
      speedEndurance: 5,
      aerobic: 10,
      strength: 20,
      power: 20,
      technical: 15
    },
    typicalWeeklyVolume: {
      sprint: '300-500m',
      tempo: '1500-2500m',
      strength: '2-3 sessions'
    }
  },
  'TRIPLE_JUMP': {
    event: 'Triple Jump',
    primaryEnergySystem: 'ATP-PC',
    energyContribution: { atpPc: 98, glycolytic: 2, aerobic: 0 },
    keyQualities: [
      'Bounding power',
      'Elastic strength',
      'Phase ratios',
      'Approach consistency',
      'Reactive strength'
    ],
    weeklyDistribution: {
      speed: 25,
      speedEndurance: 5,
      aerobic: 10,
      strength: 20,
      power: 25,
      technical: 15
    },
    typicalWeeklyVolume: {
      sprint: '300-500m',
      tempo: '1500-2500m',
      strength: '2-3 sessions'
    }
  },
  'HIGH_JUMP': {
    event: 'High Jump',
    primaryEnergySystem: 'ATP-PC',
    energyContribution: { atpPc: 99, glycolytic: 1, aerobic: 0 },
    keyQualities: [
      'Vertical power',
      'Approach curve',
      'Takeoff technique',
      'Bar clearance',
      'Elastic strength'
    ],
    weeklyDistribution: {
      speed: 20,
      speedEndurance: 0,
      aerobic: 10,
      strength: 20,
      power: 25,
      technical: 25
    },
    typicalWeeklyVolume: {
      sprint: '200-400m',
      tempo: '1500-2000m',
      strength: '2-3 sessions'
    }
  },
  'POLE_VAULT': {
    event: 'Pole Vault',
    primaryEnergySystem: 'ATP-PC',
    energyContribution: { atpPc: 98, glycolytic: 2, aerobic: 0 },
    keyQualities: [
      'Approach speed',
      'Pole plant',
      'Swing technique',
      'Upper body strength',
      'Gymnastics ability'
    ],
    weeklyDistribution: {
      speed: 25,
      speedEndurance: 0,
      aerobic: 10,
      strength: 20,
      power: 15,
      technical: 30
    },
    typicalWeeklyVolume: {
      sprint: '300-500m',
      tempo: '1500-2000m',
      strength: '2-3 sessions'
    }
  },
  'SHOT_PUT': {
    event: 'Shot Put',
    primaryEnergySystem: 'ATP-PC',
    energyContribution: { atpPc: 100, glycolytic: 0, aerobic: 0 },
    keyQualities: [
      'Maximum strength',
      'Explosive power',
      'Technique efficiency',
      'Hip-shoulder separation',
      'Release speed'
    ],
    weeklyDistribution: {
      speed: 10,
      speedEndurance: 0,
      aerobic: 5,
      strength: 35,
      power: 25,
      technical: 25
    },
    typicalWeeklyVolume: {
      sprint: '100-200m',
      tempo: '1000-1500m',
      strength: '3-4 sessions'
    }
  },
  'DISCUS': {
    event: 'Discus Throw',
    primaryEnergySystem: 'ATP-PC',
    energyContribution: { atpPc: 100, glycolytic: 0, aerobic: 0 },
    keyQualities: [
      'Rotational power',
      'Balance in rotation',
      'Release technique',
      'Core strength',
      'Hip-shoulder separation'
    ],
    weeklyDistribution: {
      speed: 10,
      speedEndurance: 0,
      aerobic: 5,
      strength: 30,
      power: 25,
      technical: 30
    },
    typicalWeeklyVolume: {
      sprint: '100-200m',
      tempo: '1000-1500m',
      strength: '3-4 sessions'
    }
  },
  'JAVELIN': {
    event: 'Javelin Throw',
    primaryEnergySystem: 'ATP-PC',
    energyContribution: { atpPc: 100, glycolytic: 0, aerobic: 0 },
    keyQualities: [
      'Approach speed',
      'Throwing arm speed',
      'Block technique',
      'Shoulder mobility',
      'Core power transfer'
    ],
    weeklyDistribution: {
      speed: 20,
      speedEndurance: 0,
      aerobic: 5,
      strength: 25,
      power: 20,
      technical: 30
    },
    typicalWeeklyVolume: {
      sprint: '200-400m',
      tempo: '1500-2000m',
      strength: '3 sessions'
    }
  },
  'HAMMER': {
    event: 'Hammer Throw',
    primaryEnergySystem: 'ATP-PC',
    energyContribution: { atpPc: 100, glycolytic: 0, aerobic: 0 },
    keyQualities: [
      'Rotational power',
      'Balance and rhythm',
      'Core strength',
      'Release timing',
      'Acceleration pattern'
    ],
    weeklyDistribution: {
      speed: 5,
      speedEndurance: 0,
      aerobic: 5,
      strength: 30,
      power: 30,
      technical: 30
    },
    typicalWeeklyVolume: {
      sprint: '100-200m',
      tempo: '1000-1500m',
      strength: '3-4 sessions'
    }
  },
  'DECATHLON': {
    event: 'Decathlon',
    primaryEnergySystem: 'Mixed',
    energyContribution: { atpPc: 50, glycolytic: 30, aerobic: 20 },
    keyQualities: [
      'All-round athleticism',
      'Technical versatility',
      'Mental resilience',
      'Recovery ability',
      'Competition management'
    ],
    weeklyDistribution: {
      speed: 20,
      speedEndurance: 15,
      aerobic: 15,
      strength: 20,
      power: 10,
      technical: 20
    },
    typicalWeeklyVolume: {
      sprint: '400-600m',
      tempo: '4000-6000m',
      strength: '2-3 sessions'
    }
  },
  'HEPTATHLON': {
    event: 'Heptathlon',
    primaryEnergySystem: 'Mixed',
    energyContribution: { atpPc: 55, glycolytic: 25, aerobic: 20 },
    keyQualities: [
      'Speed-power combination',
      'Technical proficiency',
      'Endurance base',
      'Mental toughness',
      'Quick recovery'
    ],
    weeklyDistribution: {
      speed: 25,
      speedEndurance: 15,
      aerobic: 15,
      strength: 15,
      power: 10,
      technical: 20
    },
    typicalWeeklyVolume: {
      sprint: '400-600m',
      tempo: '4000-6000m',
      strength: '2-3 sessions'
    }
  },
  '110M_HURDLES': {
    event: '110m Hurdles',
    primaryEnergySystem: 'ATP-PC',
    energyContribution: { atpPc: 95, glycolytic: 4, aerobic: 1 },
    keyQualities: [
      'Sprint speed',
      'Hurdle technique',
      'Rhythm between hurdles',
      'Hip mobility',
      'Quick ground contacts'
    ],
    weeklyDistribution: {
      speed: 30,
      speedEndurance: 10,
      aerobic: 5,
      strength: 15,
      power: 15,
      technical: 25
    },
    typicalWeeklyVolume: {
      sprint: '400-600m',
      tempo: '1500-2500m',
      strength: '2-3 sessions'
    }
  },
  '400M_HURDLES': {
    event: '400m Hurdles',
    primaryEnergySystem: 'Glycolytic',
    energyContribution: { atpPc: 30, glycolytic: 55, aerobic: 15 },
    keyQualities: [
      'Speed endurance',
      'Hurdle technique both legs',
      'Step pattern management',
      'Lactate tolerance',
      'Race strategy'
    ],
    weeklyDistribution: {
      speed: 20,
      speedEndurance: 30,
      aerobic: 15,
      strength: 10,
      power: 5,
      technical: 20
    },
    typicalWeeklyVolume: {
      sprint: '500-800m',
      tempo: '3000-4500m',
      strength: '2 sessions'
    }
  },
  '3000M_STEEPLECHASE': {
    event: '3000m Steeplechase',
    primaryEnergySystem: 'Aerobic',
    energyContribution: { atpPc: 3, glycolytic: 15, aerobic: 82 },
    keyQualities: [
      'Aerobic capacity',
      'Hurdle efficiency',
      'Water jump technique',
      'Running economy',
      'Finishing speed'
    ],
    weeklyDistribution: {
      speed: 8,
      speedEndurance: 17,
      aerobic: 50,
      strength: 8,
      power: 5,
      technical: 12
    },
    typicalWeeklyVolume: {
      sprint: '200-400m',
      tempo: '60-80 km/week',
      strength: '1-2 sessions'
    }
  }
};

// ==================== RECOVERY REQUIREMENTS ====================

export interface RecoveryRequirement {
  trainingType: string;
  minimumRecoveryHours: number;
  optimalRecoveryHours: number;
  cnsRecovery: number;
  muscleRecovery: number;
  metabolicRecovery: number;
  notes: string;
}

export const RECOVERY_REQUIREMENTS: RecoveryRequirement[] = [
  {
    trainingType: 'Maximum Sprint (95-100%)',
    minimumRecoveryHours: 48,
    optimalRecoveryHours: 72,
    cnsRecovery: 72,
    muscleRecovery: 48,
    metabolicRecovery: 24,
    notes: 'High CNS demand - prioritize neural recovery'
  },
  {
    trainingType: 'Speed Development (85-92%)',
    minimumRecoveryHours: 36,
    optimalRecoveryHours: 48,
    cnsRecovery: 48,
    muscleRecovery: 36,
    metabolicRecovery: 24,
    notes: 'Moderate-high CNS demand'
  },
  {
    trainingType: 'Speed Endurance',
    minimumRecoveryHours: 48,
    optimalRecoveryHours: 72,
    cnsRecovery: 48,
    muscleRecovery: 48,
    metabolicRecovery: 48,
    notes: 'High metabolic demand - lactate clearance needed'
  },
  {
    trainingType: 'Maximum Strength',
    minimumRecoveryHours: 48,
    optimalRecoveryHours: 72,
    cnsRecovery: 72,
    muscleRecovery: 72,
    metabolicRecovery: 24,
    notes: 'Muscle fiber repair and neural recovery'
  },
  {
    trainingType: 'Power / Plyometrics',
    minimumRecoveryHours: 48,
    optimalRecoveryHours: 72,
    cnsRecovery: 48,
    muscleRecovery: 48,
    metabolicRecovery: 24,
    notes: 'Elastic components need recovery'
  },
  {
    trainingType: 'Tempo / Aerobic',
    minimumRecoveryHours: 24,
    optimalRecoveryHours: 24,
    cnsRecovery: 24,
    muscleRecovery: 24,
    metabolicRecovery: 24,
    notes: 'Low stress - can be done daily'
  },
  {
    trainingType: 'Technical Work',
    minimumRecoveryHours: 24,
    optimalRecoveryHours: 24,
    cnsRecovery: 24,
    muscleRecovery: 24,
    metabolicRecovery: 24,
    notes: 'Low physical stress if intensity controlled'
  },
  {
    trainingType: 'Threshold Training',
    minimumRecoveryHours: 36,
    optimalRecoveryHours: 48,
    cnsRecovery: 24,
    muscleRecovery: 36,
    metabolicRecovery: 48,
    notes: 'Metabolic recovery prioritized'
  },
  {
    trainingType: 'VO2max Intervals',
    minimumRecoveryHours: 48,
    optimalRecoveryHours: 72,
    cnsRecovery: 36,
    muscleRecovery: 48,
    metabolicRecovery: 48,
    notes: 'High cardiorespiratory stress'
  },
  {
    trainingType: 'Competition',
    minimumRecoveryHours: 72,
    optimalRecoveryHours: 96,
    cnsRecovery: 72,
    muscleRecovery: 72,
    metabolicRecovery: 48,
    notes: 'Full recovery needed - physical and mental'
  }
];

// ==================== HELPER FUNCTIONS ====================

/**
 * Get appropriate sprint zone based on intensity
 */
export function getSprintZone(intensityPercent: number): SprintZone {
  return SPRINT_ZONES.find(
    z => intensityPercent >= z.intensityMin && intensityPercent <= z.intensityMax
  ) || SPRINT_ZONES[0];
}

/**
 * Get appropriate endurance zone based on HR percentage
 */
export function getEnduranceZone(hrPercent: number): EnduranceZone {
  return ENDURANCE_ZONES.find(
    z => hrPercent >= z.hrMin && hrPercent <= z.hrMax
  ) || ENDURANCE_ZONES[0];
}

/**
 * Calculate target HR range for a zone
 */
export function calculateTargetHR(
  zone: EnduranceZone,
  maxHR: number
): { min: number; max: number } {
  return {
    min: Math.round(maxHR * zone.hrMin / 100),
    max: Math.round(maxHR * zone.hrMax / 100)
  };
}

/**
 * Get strength parameters for a given phase
 */
export function getStrengthParameters(phase: string): StrengthZone | undefined {
  return STRENGTH_ZONES[phase.toUpperCase().replace(/ /g, '_')];
}

/**
 * Get plyometric level based on training age and strength
 */
export function getPlyometricLevel(
  trainingYears: number,
  squatToBodyweight: number
): PlyometricLevel {
  if (trainingYears >= 2 && squatToBodyweight >= 2.5) {
    return PLYOMETRIC_LEVELS[3]; // Elite
  } else if (trainingYears >= 1 && squatToBodyweight >= 2.0) {
    return PLYOMETRIC_LEVELS[2]; // Advanced
  } else if (trainingYears >= 0.5 && squatToBodyweight >= 1.5) {
    return PLYOMETRIC_LEVELS[1]; // Intermediate
  }
  return PLYOMETRIC_LEVELS[0]; // Beginner
}

/**
 * Get event-specific training focus
 */
export function getEventTrainingFocus(event: string): EventTrainingFocus | undefined {
  return EVENT_TRAINING_FOCUS[event.toUpperCase().replace(/ /g, '_')];
}

/**
 * Calculate minimum recovery time between sessions
 */
export function getRecoveryRequirement(trainingType: string): RecoveryRequirement | undefined {
  return RECOVERY_REQUIREMENTS.find(
    r => r.trainingType.toLowerCase().includes(trainingType.toLowerCase())
  );
}

// ==================== EXPORTS ====================

export default {
  SPRINT_ZONES,
  STRENGTH_ZONES,
  ENDURANCE_ZONES,
  PLYOMETRIC_LEVELS,
  EVENT_TRAINING_FOCUS,
  RECOVERY_REQUIREMENTS,
  getSprintZone,
  getEnduranceZone,
  calculateTargetHR,
  getStrengthParameters,
  getPlyometricLevel,
  getEventTrainingFocus,
  getRecoveryRequirement
};
