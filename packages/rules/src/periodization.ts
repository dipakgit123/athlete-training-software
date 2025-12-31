/**
 * Periodization Engine
 * Elite Athletics Performance System
 *
 * Complete periodization planning including:
 * - Macrocycle (Annual Plan)
 * - Mesocycle (3-6 week blocks)
 * - Microcycle (Weekly plans)
 * - Taper protocols
 * - Load management
 */

// ==================== TRAINING PHASES ====================

export type TrainingPhase =
  | 'GPP'           // General Preparation Phase
  | 'SPP'           // Specific Preparation Phase
  | 'PRE_COMP'      // Pre-Competition
  | 'COMPETITION'   // Competition Phase
  | 'PEAK'          // Peaking/Taper
  | 'TRANSITION';   // Recovery/Off-season

export interface PhaseParameters {
  phase: TrainingPhase;
  name: string;
  typicalDuration: { min: number; max: number }; // weeks
  volumePercent: { min: number; max: number };
  intensityPercent: { min: number; max: number };
  primaryFocus: string[];
  secondaryFocus: string[];
  avoidances: string[];
  strengthPhase: string;
  competitionAllowed: boolean;
  testingRecommended: boolean;
}

export const PHASE_PARAMETERS: Record<TrainingPhase, PhaseParameters> = {
  GPP: {
    phase: 'GPP',
    name: 'General Preparation Phase',
    typicalDuration: { min: 6, max: 10 },
    volumePercent: { min: 85, max: 100 },
    intensityPercent: { min: 60, max: 75 },
    primaryFocus: [
      'Aerobic base development',
      'General strength building',
      'Work capacity improvement',
      'Movement quality',
      'Injury prevention'
    ],
    secondaryFocus: [
      'Technical foundations',
      'Flexibility/mobility',
      'Core stability'
    ],
    avoidances: [
      'Maximum intensity work',
      'Competition-specific sessions',
      'Excessive high-CNS work'
    ],
    strengthPhase: 'ANATOMICAL_ADAPTATION',
    competitionAllowed: false,
    testingRecommended: true
  },
  SPP: {
    phase: 'SPP',
    name: 'Specific Preparation Phase',
    typicalDuration: { min: 6, max: 8 },
    volumePercent: { min: 70, max: 85 },
    intensityPercent: { min: 75, max: 90 },
    primaryFocus: [
      'Event-specific fitness',
      'Power development',
      'Technical refinement',
      'Speed development',
      'Special endurance'
    ],
    secondaryFocus: [
      'Strength maintenance',
      'Competition simulation',
      'Tactical development'
    ],
    avoidances: [
      'Excessive volume',
      'Too many competitions',
      'New technical changes'
    ],
    strengthPhase: 'MAX_STRENGTH',
    competitionAllowed: true,
    testingRecommended: true
  },
  PRE_COMP: {
    phase: 'PRE_COMP',
    name: 'Pre-Competition Phase',
    typicalDuration: { min: 4, max: 6 },
    volumePercent: { min: 55, max: 70 },
    intensityPercent: { min: 85, max: 95 },
    primaryFocus: [
      'Competition simulation',
      'Race-pace work',
      'Technical polishing',
      'Mental preparation',
      'Competition tactics'
    ],
    secondaryFocus: [
      'Power maintenance',
      'Speed sharpening',
      'Recovery protocols'
    ],
    avoidances: [
      'Heavy volume sessions',
      'New training methods',
      'Maximum strength building'
    ],
    strengthPhase: 'POWER',
    competitionAllowed: true,
    testingRecommended: false
  },
  COMPETITION: {
    phase: 'COMPETITION',
    name: 'Competition Phase',
    typicalDuration: { min: 8, max: 14 },
    volumePercent: { min: 40, max: 55 },
    intensityPercent: { min: 90, max: 100 },
    primaryFocus: [
      'Competition performance',
      'Maintaining fitness',
      'Recovery between competitions',
      'Mental sharpness',
      'Tactical execution'
    ],
    secondaryFocus: [
      'Light technical work',
      'Activation sessions',
      'Mobility maintenance'
    ],
    avoidances: [
      'Heavy training loads',
      'Fitness building sessions',
      'New technical work',
      'Maximum strength sessions'
    ],
    strengthPhase: 'MAINTENANCE',
    competitionAllowed: true,
    testingRecommended: false
  },
  PEAK: {
    phase: 'PEAK',
    name: 'Peaking/Taper Phase',
    typicalDuration: { min: 1, max: 3 },
    volumePercent: { min: 30, max: 45 },
    intensityPercent: { min: 92, max: 100 },
    primaryFocus: [
      'Freshness',
      'Sharpening',
      'Mental preparation',
      'Competition-day routine',
      'Nervous system priming'
    ],
    secondaryFocus: [
      'Light activation',
      'Visualization',
      'Sleep optimization'
    ],
    avoidances: [
      'Any fatiguing work',
      'Heavy lifting',
      'New exercises',
      'High-volume sessions',
      'Stressful situations'
    ],
    strengthPhase: 'MAINTENANCE',
    competitionAllowed: true,
    testingRecommended: false
  },
  TRANSITION: {
    phase: 'TRANSITION',
    name: 'Transition/Recovery Phase',
    typicalDuration: { min: 2, max: 4 },
    volumePercent: { min: 20, max: 35 },
    intensityPercent: { min: 40, max: 60 },
    primaryFocus: [
      'Physical recovery',
      'Mental recovery',
      'Active rest',
      'Cross-training',
      'Injury rehabilitation'
    ],
    secondaryFocus: [
      'Light movement',
      'Flexibility work',
      'Fun activities'
    ],
    avoidances: [
      'Structured training',
      'High-intensity work',
      'Competition',
      'Heavy weights',
      'Event-specific work'
    ],
    strengthPhase: 'STRENGTH_ENDURANCE',
    competitionAllowed: false,
    testingRecommended: false
  }
};

// ==================== MACROCYCLE (ANNUAL PLAN) ====================

export interface Macrocycle {
  id: string;
  athleteId: string;
  year: number;
  startDate: Date;
  endDate: Date;
  targetCompetitions: TargetCompetition[];
  phases: MacrocyclePhase[];
  annualGoals: string[];
  personalBestTargets: Record<string, number>;
  totalWeeks: number;
}

export interface MacrocyclePhase {
  phase: TrainingPhase;
  startWeek: number;
  endWeek: number;
  startDate: Date;
  endDate: Date;
  goals: string[];
  keyWorkouts: string[];
  testingDates?: Date[];
}

export interface TargetCompetition {
  name: string;
  date: Date;
  priority: 'A' | 'B' | 'C';  // A = Major, B = Important, C = Minor
  event: string;
  targetPerformance?: string;
  location?: string;
}

// ==================== MESOCYCLE (3-6 WEEK BLOCK) ====================

export interface Mesocycle {
  id: string;
  macrocycleId: string;
  athleteId: string;
  phase: TrainingPhase;
  weekNumber: number;        // Week number in macrocycle
  startDate: Date;
  endDate: Date;
  durationWeeks: number;
  loadPattern: LoadPattern;
  weeklyPlans: MicrocycleTemplate[];
  goals: string[];
  focusAreas: string[];
}

export type LoadPattern = '3:1' | '2:1' | '4:1' | 'WAVE' | 'STEP' | 'LINEAR';

export interface LoadPatternConfig {
  pattern: LoadPattern;
  weeks: number[];           // Load percentage for each week
  description: string;
  bestFor: TrainingPhase[];
}

export const LOAD_PATTERNS: Record<LoadPattern, LoadPatternConfig> = {
  '3:1': {
    pattern: '3:1',
    weeks: [80, 90, 100, 60],
    description: 'Three loading weeks followed by one recovery week',
    bestFor: ['GPP', 'SPP']
  },
  '2:1': {
    pattern: '2:1',
    weeks: [85, 100, 60],
    description: 'Two loading weeks followed by one recovery week',
    bestFor: ['PRE_COMP', 'COMPETITION']
  },
  '4:1': {
    pattern: '4:1',
    weeks: [75, 85, 95, 100, 55],
    description: 'Four progressive weeks followed by recovery',
    bestFor: ['GPP']
  },
  'WAVE': {
    pattern: 'WAVE',
    weeks: [80, 100, 70, 95, 60],
    description: 'Undulating load pattern',
    bestFor: ['SPP', 'PRE_COMP']
  },
  'STEP': {
    pattern: 'STEP',
    weeks: [70, 80, 90, 100],
    description: 'Progressive step loading',
    bestFor: ['GPP', 'SPP']
  },
  'LINEAR': {
    pattern: 'LINEAR',
    weeks: [75, 80, 85, 90],
    description: 'Linear progression',
    bestFor: ['GPP']
  }
};

// ==================== MICROCYCLE (WEEKLY PLAN) ====================

export interface MicrocycleTemplate {
  weekNumber: number;
  loadPercent: number;
  days: DayTemplate[];
  totalLoad: number;
  keySessionDays: number[];  // 0-6 (Mon-Sun)
  recoveryDays: number[];
}

export interface DayTemplate {
  dayOfWeek: number;         // 0 = Monday, 6 = Sunday
  sessions: SessionTemplate[];
  totalLoad: number;
  loadCategory: 'high' | 'medium' | 'low' | 'recovery' | 'off';
  notes?: string;
}

export interface SessionTemplate {
  time: 'AM' | 'PM';
  type: string;
  duration: number;          // minutes
  intensity: number;         // percentage
  volume: number;            // arbitrary units
  focus: string[];
}

// ==================== EVENT-SPECIFIC MICROCYCLE TEMPLATES ====================

export const MICROCYCLE_TEMPLATES: Record<string, Record<TrainingPhase, MicrocycleTemplate>> = {
  'SPRINT': {
    GPP: {
      weekNumber: 1,
      loadPercent: 100,
      totalLoad: 800,
      keySessionDays: [0, 2, 4],
      recoveryDays: [3, 6],
      days: [
        {
          dayOfWeek: 0, // Monday
          loadCategory: 'high',
          totalLoad: 150,
          sessions: [
            { time: 'AM', type: 'Acceleration Development', duration: 60, intensity: 85, volume: 100, focus: ['Drive phase', '30m runs'] },
            { time: 'PM', type: 'General Strength', duration: 60, intensity: 70, volume: 80, focus: ['Squat', 'RDL', 'Core'] }
          ]
        },
        {
          dayOfWeek: 1, // Tuesday
          loadCategory: 'low',
          totalLoad: 80,
          sessions: [
            { time: 'AM', type: 'Tempo', duration: 45, intensity: 65, volume: 150, focus: ['Aerobic base', '100m reps'] },
            { time: 'PM', type: 'Core/Mobility', duration: 30, intensity: 50, volume: 30, focus: ['Core circuits', 'Stretching'] }
          ]
        },
        {
          dayOfWeek: 2, // Wednesday
          loadCategory: 'high',
          totalLoad: 140,
          sessions: [
            { time: 'AM', type: 'Speed Development', duration: 60, intensity: 88, volume: 80, focus: ['60m runs', 'Flying sprints'] },
            { time: 'PM', type: 'Power Training', duration: 50, intensity: 75, volume: 60, focus: ['Cleans', 'Jumps'] }
          ]
        },
        {
          dayOfWeek: 3, // Thursday
          loadCategory: 'recovery',
          totalLoad: 40,
          sessions: [
            { time: 'PM', type: 'Recovery', duration: 40, intensity: 40, volume: 40, focus: ['Pool', 'Massage', 'Mobility'] }
          ]
        },
        {
          dayOfWeek: 4, // Friday
          loadCategory: 'medium',
          totalLoad: 120,
          sessions: [
            { time: 'AM', type: 'Plyometrics + Drills', duration: 50, intensity: 80, volume: 60, focus: ['Bounds', 'Sprint drills'] },
            { time: 'PM', type: 'Strength Endurance', duration: 45, intensity: 60, volume: 60, focus: ['Circuits', 'Core'] }
          ]
        },
        {
          dayOfWeek: 5, // Saturday
          loadCategory: 'medium',
          totalLoad: 100,
          sessions: [
            { time: 'AM', type: 'Technical Work', duration: 60, intensity: 75, volume: 100, focus: ['Block starts', 'Technique'] }
          ]
        },
        {
          dayOfWeek: 6, // Sunday
          loadCategory: 'off',
          totalLoad: 0,
          sessions: []
        }
      ]
    },
    SPP: {
      weekNumber: 1,
      loadPercent: 100,
      totalLoad: 750,
      keySessionDays: [0, 2, 4],
      recoveryDays: [3, 6],
      days: [
        {
          dayOfWeek: 0,
          loadCategory: 'high',
          totalLoad: 160,
          sessions: [
            { time: 'AM', type: 'Speed (95%)', duration: 60, intensity: 95, volume: 80, focus: ['Block starts', 'Max velocity'] },
            { time: 'PM', type: 'Max Strength', duration: 50, intensity: 88, volume: 60, focus: ['Squat', 'Clean'] }
          ]
        },
        {
          dayOfWeek: 1,
          loadCategory: 'low',
          totalLoad: 70,
          sessions: [
            { time: 'AM', type: 'Tempo', duration: 40, intensity: 65, volume: 120, focus: ['Recovery runs'] },
            { time: 'PM', type: 'Core', duration: 25, intensity: 50, volume: 25, focus: ['Core stability'] }
          ]
        },
        {
          dayOfWeek: 2,
          loadCategory: 'high',
          totalLoad: 150,
          sessions: [
            { time: 'AM', type: 'Speed Endurance', duration: 55, intensity: 92, volume: 100, focus: ['150m reps', 'Lactate'] },
            { time: 'PM', type: 'Power', duration: 45, intensity: 80, volume: 50, focus: ['Power clean', 'Box jumps'] }
          ]
        },
        {
          dayOfWeek: 3,
          loadCategory: 'off',
          totalLoad: 0,
          sessions: []
        },
        {
          dayOfWeek: 4,
          loadCategory: 'high',
          totalLoad: 140,
          sessions: [
            { time: 'AM', type: 'Acceleration', duration: 50, intensity: 95, volume: 70, focus: ['30m sprints', 'Starts'] },
            { time: 'PM', type: 'Strength Maintain', duration: 40, intensity: 82, volume: 50, focus: ['Main lifts'] }
          ]
        },
        {
          dayOfWeek: 5,
          loadCategory: 'medium',
          totalLoad: 90,
          sessions: [
            { time: 'AM', type: 'Competition Simulation', duration: 60, intensity: 90, volume: 90, focus: ['Race practice'] }
          ]
        },
        {
          dayOfWeek: 6,
          loadCategory: 'off',
          totalLoad: 0,
          sessions: []
        }
      ]
    },
    PRE_COMP: {
      weekNumber: 1,
      loadPercent: 100,
      totalLoad: 600,
      keySessionDays: [0, 2, 4],
      recoveryDays: [1, 3, 6],
      days: [
        {
          dayOfWeek: 0,
          loadCategory: 'high',
          totalLoad: 130,
          sessions: [
            { time: 'AM', type: 'Speed (97%)', duration: 50, intensity: 97, volume: 60, focus: ['Race pace', 'Starts'] },
            { time: 'PM', type: 'Power', duration: 40, intensity: 80, volume: 40, focus: ['Explosive lifts'] }
          ]
        },
        {
          dayOfWeek: 1,
          loadCategory: 'recovery',
          totalLoad: 50,
          sessions: [
            { time: 'AM', type: 'Recovery', duration: 30, intensity: 50, volume: 50, focus: ['Light movement'] }
          ]
        },
        {
          dayOfWeek: 2,
          loadCategory: 'medium',
          totalLoad: 100,
          sessions: [
            { time: 'AM', type: 'Race Practice', duration: 45, intensity: 95, volume: 50, focus: ['Full race simulation'] }
          ]
        },
        {
          dayOfWeek: 3,
          loadCategory: 'off',
          totalLoad: 0,
          sessions: []
        },
        {
          dayOfWeek: 4,
          loadCategory: 'medium',
          totalLoad: 90,
          sessions: [
            { time: 'AM', type: 'Sharpening', duration: 40, intensity: 92, volume: 40, focus: ['Block starts', 'Activation'] }
          ]
        },
        {
          dayOfWeek: 5,
          loadCategory: 'low',
          totalLoad: 40,
          sessions: [
            { time: 'AM', type: 'Pre-comp', duration: 30, intensity: 70, volume: 30, focus: ['Activation only'] }
          ]
        },
        {
          dayOfWeek: 6,
          loadCategory: 'off',
          totalLoad: 0,
          sessions: [],
          notes: 'Competition or rest'
        }
      ]
    },
    COMPETITION: {
      weekNumber: 1,
      loadPercent: 100,
      totalLoad: 450,
      keySessionDays: [0, 3],
      recoveryDays: [1, 2, 4, 6],
      days: [
        {
          dayOfWeek: 0,
          loadCategory: 'medium',
          totalLoad: 100,
          sessions: [
            { time: 'AM', type: 'Speed Maintenance', duration: 45, intensity: 95, volume: 50, focus: ['Short sprints', 'Starts'] },
            { time: 'PM', type: 'Strength Maintain', duration: 35, intensity: 80, volume: 35, focus: ['Key lifts only'] }
          ]
        },
        {
          dayOfWeek: 1,
          loadCategory: 'recovery',
          totalLoad: 40,
          sessions: [
            { time: 'AM', type: 'Recovery', duration: 30, intensity: 50, volume: 40, focus: ['Mobility', 'Light movement'] }
          ]
        },
        {
          dayOfWeek: 2,
          loadCategory: 'low',
          totalLoad: 50,
          sessions: [
            { time: 'AM', type: 'Technical', duration: 35, intensity: 70, volume: 50, focus: ['Drills', 'Form work'] }
          ]
        },
        {
          dayOfWeek: 3,
          loadCategory: 'medium',
          totalLoad: 80,
          sessions: [
            { time: 'AM', type: 'Sharpening', duration: 40, intensity: 90, volume: 40, focus: ['Race pace touches'] }
          ]
        },
        {
          dayOfWeek: 4,
          loadCategory: 'recovery',
          totalLoad: 30,
          sessions: [
            { time: 'AM', type: 'Pre-competition', duration: 25, intensity: 60, volume: 30, focus: ['Activation'] }
          ]
        },
        {
          dayOfWeek: 5,
          loadCategory: 'low',
          totalLoad: 20,
          sessions: [
            { time: 'AM', type: 'Meet Day Warmup', duration: 45, intensity: 0, volume: 0, focus: ['Competition'] }
          ],
          notes: 'Competition Day'
        },
        {
          dayOfWeek: 6,
          loadCategory: 'off',
          totalLoad: 0,
          sessions: []
        }
      ]
    },
    PEAK: {
      weekNumber: 1,
      loadPercent: 100,
      totalLoad: 300,
      keySessionDays: [0, 3],
      recoveryDays: [1, 2, 4, 5, 6],
      days: [
        {
          dayOfWeek: 0,
          loadCategory: 'medium',
          totalLoad: 80,
          sessions: [
            { time: 'AM', type: 'Speed Touch', duration: 35, intensity: 95, volume: 30, focus: ['Short sprints', 'Feel'] }
          ]
        },
        {
          dayOfWeek: 1,
          loadCategory: 'recovery',
          totalLoad: 30,
          sessions: [
            { time: 'AM', type: 'Recovery', duration: 25, intensity: 45, volume: 30, focus: ['Very light'] }
          ]
        },
        {
          dayOfWeek: 2,
          loadCategory: 'recovery',
          totalLoad: 25,
          sessions: [
            { time: 'AM', type: 'Mobility', duration: 30, intensity: 40, volume: 25, focus: ['Stretching', 'Activation'] }
          ]
        },
        {
          dayOfWeek: 3,
          loadCategory: 'low',
          totalLoad: 50,
          sessions: [
            { time: 'AM', type: 'Activation', duration: 30, intensity: 80, volume: 25, focus: ['Starts', 'Short sprints'] }
          ]
        },
        {
          dayOfWeek: 4,
          loadCategory: 'recovery',
          totalLoad: 20,
          sessions: [
            { time: 'AM', type: 'Pre-meet', duration: 20, intensity: 50, volume: 20, focus: ['Light activation'] }
          ]
        },
        {
          dayOfWeek: 5,
          loadCategory: 'off',
          totalLoad: 0,
          sessions: [],
          notes: 'Rest before competition'
        },
        {
          dayOfWeek: 6,
          loadCategory: 'low',
          totalLoad: 0,
          sessions: [],
          notes: 'COMPETITION DAY'
        }
      ]
    },
    TRANSITION: {
      weekNumber: 1,
      loadPercent: 100,
      totalLoad: 200,
      keySessionDays: [],
      recoveryDays: [0, 1, 2, 3, 4, 5, 6],
      days: [
        {
          dayOfWeek: 0,
          loadCategory: 'recovery',
          totalLoad: 40,
          sessions: [
            { time: 'AM', type: 'Cross-training', duration: 40, intensity: 50, volume: 40, focus: ['Fun activity', 'Swimming'] }
          ]
        },
        {
          dayOfWeek: 1,
          loadCategory: 'off',
          totalLoad: 0,
          sessions: []
        },
        {
          dayOfWeek: 2,
          loadCategory: 'recovery',
          totalLoad: 35,
          sessions: [
            { time: 'AM', type: 'Light Activity', duration: 35, intensity: 45, volume: 35, focus: ['Walking', 'Stretching'] }
          ]
        },
        {
          dayOfWeek: 3,
          loadCategory: 'off',
          totalLoad: 0,
          sessions: []
        },
        {
          dayOfWeek: 4,
          loadCategory: 'recovery',
          totalLoad: 40,
          sessions: [
            { time: 'AM', type: 'Recreation', duration: 45, intensity: 50, volume: 40, focus: ['Sports', 'Games'] }
          ]
        },
        {
          dayOfWeek: 5,
          loadCategory: 'off',
          totalLoad: 0,
          sessions: []
        },
        {
          dayOfWeek: 6,
          loadCategory: 'off',
          totalLoad: 0,
          sessions: []
        }
      ]
    }
  }
};

// ==================== TAPER PROTOCOLS ====================

export interface TaperProtocol {
  eventCategory: string;
  taperLength: { min: number; max: number };  // days
  volumeReduction: number;                     // percentage
  intensityMaintenance: number;                // percentage to maintain
  frequencyReduction: number;                  // percentage
  keyPrinciples: string[];
  dailyPattern: TaperDay[];
}

export interface TaperDay {
  daysOut: number;
  volumePercent: number;
  intensityPercent: number;
  sessionType: string;
  notes: string;
}

export const TAPER_PROTOCOLS: Record<string, TaperProtocol> = {
  SPRINT: {
    eventCategory: 'Sprint (100m-400m)',
    taperLength: { min: 10, max: 14 },
    volumeReduction: 65,
    intensityMaintenance: 95,
    frequencyReduction: 30,
    keyPrinciples: [
      'Maintain CNS activation with short, high-quality sprints',
      'Reduce total volume dramatically',
      'Keep intensity at race pace or above',
      'Focus on reaction time and starts',
      'Prioritize sleep and recovery'
    ],
    dailyPattern: [
      { daysOut: 14, volumePercent: 70, intensityPercent: 90, sessionType: 'Speed work', notes: 'Normal session, reduced volume' },
      { daysOut: 13, volumePercent: 50, intensityPercent: 60, sessionType: 'Recovery', notes: 'Light tempo' },
      { daysOut: 12, volumePercent: 60, intensityPercent: 95, sessionType: 'Speed touch', notes: 'Short sprints' },
      { daysOut: 11, volumePercent: 40, intensityPercent: 50, sessionType: 'Recovery', notes: 'Very light' },
      { daysOut: 10, volumePercent: 55, intensityPercent: 95, sessionType: 'Starts + speed', notes: 'Block work' },
      { daysOut: 9, volumePercent: 35, intensityPercent: 50, sessionType: 'Recovery', notes: 'Mobility focus' },
      { daysOut: 8, volumePercent: 0, intensityPercent: 0, sessionType: 'Off', notes: 'Complete rest' },
      { daysOut: 7, volumePercent: 45, intensityPercent: 95, sessionType: 'Race pace', notes: 'Short race simulation' },
      { daysOut: 6, volumePercent: 30, intensityPercent: 50, sessionType: 'Recovery', notes: 'Light movement' },
      { daysOut: 5, volumePercent: 40, intensityPercent: 90, sessionType: 'Activation', notes: 'Starts only' },
      { daysOut: 4, volumePercent: 25, intensityPercent: 50, sessionType: 'Recovery', notes: 'Stretching' },
      { daysOut: 3, volumePercent: 35, intensityPercent: 85, sessionType: 'Light speed', notes: '2-3 short sprints' },
      { daysOut: 2, volumePercent: 20, intensityPercent: 60, sessionType: 'Pre-meet', notes: 'Activation only' },
      { daysOut: 1, volumePercent: 0, intensityPercent: 0, sessionType: 'Off', notes: 'Rest and mental prep' },
      { daysOut: 0, volumePercent: 0, intensityPercent: 100, sessionType: 'Competition', notes: 'RACE DAY' }
    ]
  },
  MIDDLE_DISTANCE: {
    eventCategory: 'Middle Distance (800m-1500m)',
    taperLength: { min: 10, max: 14 },
    volumeReduction: 55,
    intensityMaintenance: 90,
    frequencyReduction: 25,
    keyPrinciples: [
      'Maintain running frequency but reduce distance',
      'Include short race-pace segments',
      'Keep threshold sessions but shorter',
      'Reduce long run significantly',
      'Maintain leg speed with strides'
    ],
    dailyPattern: [
      { daysOut: 14, volumePercent: 75, intensityPercent: 85, sessionType: 'Threshold', notes: 'Reduced threshold work' },
      { daysOut: 13, volumePercent: 60, intensityPercent: 65, sessionType: 'Easy', notes: 'Recovery run' },
      { daysOut: 12, volumePercent: 65, intensityPercent: 90, sessionType: 'Race pace', notes: 'Short intervals at race pace' },
      { daysOut: 11, volumePercent: 50, intensityPercent: 60, sessionType: 'Easy', notes: 'Light running' },
      { daysOut: 10, volumePercent: 55, intensityPercent: 85, sessionType: 'Tempo', notes: 'Short tempo' },
      { daysOut: 9, volumePercent: 40, intensityPercent: 55, sessionType: 'Recovery', notes: 'Very easy' },
      { daysOut: 8, volumePercent: 0, intensityPercent: 0, sessionType: 'Off', notes: 'Rest day' },
      { daysOut: 7, volumePercent: 50, intensityPercent: 92, sessionType: 'Race simulation', notes: 'Race pace segments' },
      { daysOut: 6, volumePercent: 40, intensityPercent: 60, sessionType: 'Easy', notes: 'Light jog + strides' },
      { daysOut: 5, volumePercent: 45, intensityPercent: 88, sessionType: 'Sharpening', notes: 'Short fast reps' },
      { daysOut: 4, volumePercent: 35, intensityPercent: 55, sessionType: 'Recovery', notes: 'Easy movement' },
      { daysOut: 3, volumePercent: 40, intensityPercent: 85, sessionType: 'Strides', notes: 'Easy + 4-5 strides' },
      { daysOut: 2, volumePercent: 30, intensityPercent: 60, sessionType: 'Pre-meet', notes: 'Light jog + strides' },
      { daysOut: 1, volumePercent: 15, intensityPercent: 50, sessionType: 'Activation', notes: 'Short shake-out' },
      { daysOut: 0, volumePercent: 0, intensityPercent: 100, sessionType: 'Competition', notes: 'RACE DAY' }
    ]
  },
  DISTANCE: {
    eventCategory: 'Long Distance (5000m+)',
    taperLength: { min: 14, max: 21 },
    volumeReduction: 50,
    intensityMaintenance: 85,
    frequencyReduction: 20,
    keyPrinciples: [
      'Gradual volume reduction over 2-3 weeks',
      'Maintain running frequency',
      'Include short race-pace segments',
      'Reduce long run by 40-50%',
      'Focus on feeling fresh, not fit'
    ],
    dailyPattern: [
      { daysOut: 21, volumePercent: 80, intensityPercent: 80, sessionType: 'Normal training', notes: 'Begin reduction' },
      { daysOut: 14, volumePercent: 65, intensityPercent: 85, sessionType: 'Tempo', notes: 'Moderate session' },
      { daysOut: 10, volumePercent: 55, intensityPercent: 88, sessionType: 'Race pace', notes: 'Short race pace work' },
      { daysOut: 7, volumePercent: 45, intensityPercent: 85, sessionType: 'Sharpening', notes: 'Short intervals' },
      { daysOut: 5, volumePercent: 40, intensityPercent: 80, sessionType: 'Strides', notes: 'Easy + strides' },
      { daysOut: 3, volumePercent: 35, intensityPercent: 75, sessionType: 'Light jog', notes: 'Short easy run' },
      { daysOut: 2, volumePercent: 25, intensityPercent: 65, sessionType: 'Pre-meet', notes: 'Easy shake-out' },
      { daysOut: 1, volumePercent: 15, intensityPercent: 50, sessionType: 'Rest', notes: 'Optional light walk' },
      { daysOut: 0, volumePercent: 0, intensityPercent: 100, sessionType: 'Competition', notes: 'RACE DAY' }
    ]
  },
  JUMPS: {
    eventCategory: 'Jumps (LJ, TJ, HJ, PV)',
    taperLength: { min: 7, max: 10 },
    volumeReduction: 60,
    intensityMaintenance: 95,
    frequencyReduction: 30,
    keyPrinciples: [
      'Maintain elastic power with short plyometric touches',
      'Reduce jump volume but maintain quality',
      'Keep approach run work sharp',
      'Focus on technical refinement',
      'Prioritize CNS freshness'
    ],
    dailyPattern: [
      { daysOut: 10, volumePercent: 65, intensityPercent: 92, sessionType: 'Technical jumps', notes: 'Reduced volume' },
      { daysOut: 9, volumePercent: 40, intensityPercent: 50, sessionType: 'Recovery', notes: 'Light movement' },
      { daysOut: 8, volumePercent: 55, intensityPercent: 95, sessionType: 'Approach + jumps', notes: 'Short approach' },
      { daysOut: 7, volumePercent: 35, intensityPercent: 50, sessionType: 'Recovery', notes: 'Mobility' },
      { daysOut: 6, volumePercent: 0, intensityPercent: 0, sessionType: 'Off', notes: 'Complete rest' },
      { daysOut: 5, volumePercent: 45, intensityPercent: 95, sessionType: 'Pop-ups', notes: 'Short approach jumps' },
      { daysOut: 4, volumePercent: 30, intensityPercent: 50, sessionType: 'Recovery', notes: 'Light stretching' },
      { daysOut: 3, volumePercent: 40, intensityPercent: 90, sessionType: 'Activation', notes: '2-3 approach runs' },
      { daysOut: 2, volumePercent: 20, intensityPercent: 60, sessionType: 'Pre-meet', notes: 'Very light' },
      { daysOut: 1, volumePercent: 0, intensityPercent: 0, sessionType: 'Off', notes: 'Rest' },
      { daysOut: 0, volumePercent: 0, intensityPercent: 100, sessionType: 'Competition', notes: 'COMPETITION' }
    ]
  },
  THROWS: {
    eventCategory: 'Throws (SP, DT, JT, HT)',
    taperLength: { min: 7, max: 10 },
    volumeReduction: 55,
    intensityMaintenance: 95,
    frequencyReduction: 25,
    keyPrinciples: [
      'Maintain throwing frequency with reduced volume',
      'Keep intensity high on technical throws',
      'Reduce heavy strength work',
      'Focus on explosive power maintenance',
      'Technical refinement priority'
    ],
    dailyPattern: [
      { daysOut: 10, volumePercent: 70, intensityPercent: 90, sessionType: 'Technical throws', notes: 'Full technique' },
      { daysOut: 9, volumePercent: 50, intensityPercent: 70, sessionType: 'Light throws', notes: 'Stands only' },
      { daysOut: 8, volumePercent: 60, intensityPercent: 95, sessionType: 'Competition throws', notes: 'Full effort' },
      { daysOut: 7, volumePercent: 40, intensityPercent: 50, sessionType: 'Recovery', notes: 'Mobility' },
      { daysOut: 6, volumePercent: 0, intensityPercent: 0, sessionType: 'Off', notes: 'Rest' },
      { daysOut: 5, volumePercent: 50, intensityPercent: 95, sessionType: 'Sharpening', notes: 'Quality throws' },
      { daysOut: 4, volumePercent: 35, intensityPercent: 60, sessionType: 'Light throws', notes: 'Technique focus' },
      { daysOut: 3, volumePercent: 40, intensityPercent: 90, sessionType: 'Activation', notes: '3-4 good throws' },
      { daysOut: 2, volumePercent: 25, intensityPercent: 50, sessionType: 'Pre-meet', notes: 'Light movement' },
      { daysOut: 1, volumePercent: 0, intensityPercent: 0, sessionType: 'Off', notes: 'Rest' },
      { daysOut: 0, volumePercent: 0, intensityPercent: 100, sessionType: 'Competition', notes: 'COMPETITION' }
    ]
  }
};

// ==================== DELOAD PROTOCOLS ====================

export interface DeloadProtocol {
  type: string;
  trigger: string;
  volumeReduction: number;
  intensityReduction: number;
  duration: { min: number; max: number }; // days
  guidelines: string[];
  returnCriteria: string[];
}

export const DELOAD_PROTOCOLS: DeloadProtocol[] = [
  {
    type: 'Planned Deload',
    trigger: 'Scheduled every 3-4 weeks',
    volumeReduction: 40,
    intensityReduction: 15,
    duration: { min: 5, max: 7 },
    guidelines: [
      'Reduce training volume by 40%',
      'Maintain intensity at 85% of normal',
      'Focus on technique and recovery',
      'Increase sleep and nutrition focus',
      'Include extra mobility work'
    ],
    returnCriteria: [
      'Feel rested and motivated',
      'HRV returns to baseline',
      'No lingering soreness',
      'Ready for next loading block'
    ]
  },
  {
    type: 'Reactive Deload',
    trigger: 'Poor readiness scores (< 60) for 3+ days',
    volumeReduction: 50,
    intensityReduction: 20,
    duration: { min: 3, max: 5 },
    guidelines: [
      'Reduce volume by 50%',
      'Lower intensity by 20%',
      'Monitor daily readiness',
      'Address limiting factors',
      'Consider active recovery sessions'
    ],
    returnCriteria: [
      'Readiness score > 70 for 2 consecutive days',
      'HRV trending upward',
      'Improved sleep quality',
      'Reduced perceived fatigue'
    ]
  },
  {
    type: 'Post-Competition Deload',
    trigger: 'After major competition',
    volumeReduction: 60,
    intensityReduction: 30,
    duration: { min: 3, max: 7 },
    guidelines: [
      'Complete rest for 1-2 days',
      'Light activity only for 3-5 days',
      'Focus on mental recovery',
      'Address any minor injuries',
      'Nutrition and hydration focus'
    ],
    returnCriteria: [
      'Physical recovery complete',
      'Mental freshness restored',
      'No pain or discomfort',
      'Motivation to train returned'
    ]
  },
  {
    type: 'Illness Recovery',
    trigger: 'Return from illness',
    volumeReduction: 70,
    intensityReduction: 40,
    duration: { min: 5, max: 14 },
    guidelines: [
      'Start with 30% of normal volume',
      'Very low intensity initially',
      'Gradual return over 1-2 weeks',
      'Monitor heart rate response',
      'Stop if symptoms return'
    ],
    returnCriteria: [
      'Symptom-free for 48+ hours',
      'Normal resting heart rate',
      'No fever or fatigue',
      'Cleared by medical if severe'
    ]
  },
  {
    type: 'Injury Return',
    trigger: 'Post-rehabilitation clearance',
    volumeReduction: 80,
    intensityReduction: 50,
    duration: { min: 7, max: 21 },
    guidelines: [
      'Follow medical/physio protocol',
      'Start at 20% normal volume',
      'Progress 10-15% per week max',
      'Monitor injury site daily',
      'Include prehab exercises'
    ],
    returnCriteria: [
      'Medical clearance obtained',
      'Pain-free movement',
      'Symmetrical strength/ROM',
      'Confidence in movement'
    ]
  }
];

// ==================== LOAD PROGRESSION RULES ====================

export interface LoadProgressionRules {
  phase: TrainingPhase;
  maxWeeklyIncrease: number;      // percentage
  maxDailyLoad: number;           // percentage of weekly
  minRecoveryDays: number;
  consecutiveHighDays: number;
  triggers: LoadAdjustmentTrigger[];
}

export interface LoadAdjustmentTrigger {
  condition: string;
  adjustment: number;             // percentage change
  duration: string;
  priority: 'immediate' | 'next_session' | 'next_week';
}

export const LOAD_PROGRESSION_RULES: Record<TrainingPhase, LoadProgressionRules> = {
  GPP: {
    phase: 'GPP',
    maxWeeklyIncrease: 10,
    maxDailyLoad: 25,
    minRecoveryDays: 1,
    consecutiveHighDays: 3,
    triggers: [
      { condition: 'Readiness < 55', adjustment: -25, duration: '1-2 days', priority: 'immediate' },
      { condition: 'ACWR > 1.5', adjustment: -20, duration: '3-5 days', priority: 'immediate' },
      { condition: 'Sleep < 6h for 3+ days', adjustment: -20, duration: 'Until resolved', priority: 'next_session' },
      { condition: 'HRV drop > 15%', adjustment: -15, duration: '2-3 days', priority: 'next_session' },
      { condition: 'Soreness > 7/10', adjustment: -20, duration: '2-3 days', priority: 'immediate' }
    ]
  },
  SPP: {
    phase: 'SPP',
    maxWeeklyIncrease: 8,
    maxDailyLoad: 28,
    minRecoveryDays: 2,
    consecutiveHighDays: 2,
    triggers: [
      { condition: 'Readiness < 60', adjustment: -20, duration: '1-2 days', priority: 'immediate' },
      { condition: 'ACWR > 1.4', adjustment: -15, duration: '3-5 days', priority: 'immediate' },
      { condition: 'Sleep < 6h for 2+ days', adjustment: -15, duration: 'Until resolved', priority: 'next_session' },
      { condition: 'HRV drop > 12%', adjustment: -12, duration: '2-3 days', priority: 'next_session' },
      { condition: 'Soreness > 6/10', adjustment: -15, duration: '2-3 days', priority: 'immediate' }
    ]
  },
  PRE_COMP: {
    phase: 'PRE_COMP',
    maxWeeklyIncrease: 5,
    maxDailyLoad: 30,
    minRecoveryDays: 2,
    consecutiveHighDays: 2,
    triggers: [
      { condition: 'Readiness < 65', adjustment: -15, duration: '1-2 days', priority: 'immediate' },
      { condition: 'ACWR > 1.3', adjustment: -12, duration: '3-4 days', priority: 'immediate' },
      { condition: 'Sleep < 7h for 2+ days', adjustment: -12, duration: 'Until resolved', priority: 'next_session' },
      { condition: 'HRV drop > 10%', adjustment: -10, duration: '2 days', priority: 'next_session' },
      { condition: 'Any niggle/discomfort', adjustment: -25, duration: 'Until resolved', priority: 'immediate' }
    ]
  },
  COMPETITION: {
    phase: 'COMPETITION',
    maxWeeklyIncrease: 5,
    maxDailyLoad: 35,
    minRecoveryDays: 2,
    consecutiveHighDays: 1,
    triggers: [
      { condition: 'Readiness < 70', adjustment: -20, duration: '1 day', priority: 'immediate' },
      { condition: 'ACWR > 1.2', adjustment: -15, duration: '2-3 days', priority: 'immediate' },
      { condition: 'Sleep < 7h night before comp', adjustment: -10, duration: 'Race day', priority: 'immediate' },
      { condition: 'HRV drop > 8%', adjustment: -10, duration: '1-2 days', priority: 'next_session' },
      { condition: 'Any injury concern', adjustment: -50, duration: 'Until cleared', priority: 'immediate' }
    ]
  },
  PEAK: {
    phase: 'PEAK',
    maxWeeklyIncrease: 0,
    maxDailyLoad: 25,
    minRecoveryDays: 3,
    consecutiveHighDays: 1,
    triggers: [
      { condition: 'Readiness < 75', adjustment: -30, duration: 'Until recovered', priority: 'immediate' },
      { condition: 'Any fatigue signs', adjustment: -25, duration: '1-2 days', priority: 'immediate' },
      { condition: 'Sleep issues', adjustment: -20, duration: 'Until resolved', priority: 'immediate' },
      { condition: 'HRV not optimal', adjustment: -15, duration: '1 day', priority: 'immediate' },
      { condition: 'Any physical concern', adjustment: -50, duration: 'Until resolved', priority: 'immediate' }
    ]
  },
  TRANSITION: {
    phase: 'TRANSITION',
    maxWeeklyIncrease: 5,
    maxDailyLoad: 20,
    minRecoveryDays: 3,
    consecutiveHighDays: 0,
    triggers: [
      { condition: 'Motivation low', adjustment: -30, duration: 'Take time off', priority: 'immediate' },
      { condition: 'Any pain', adjustment: -100, duration: 'Rest completely', priority: 'immediate' }
    ]
  }
};

// ==================== PERIODIZATION GENERATOR ====================

/**
 * Generate a complete annual plan based on target competitions
 */
export function generateMacrocycle(
  athleteId: string,
  year: number,
  targetCompetitions: TargetCompetition[],
  event: string
): Macrocycle {
  // Sort competitions by date
  const sortedComps = [...targetCompetitions].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  // Find the main competition (highest priority A-level)
  const mainComp = sortedComps.find(c => c.priority === 'A') || sortedComps[sortedComps.length - 1];
  const mainCompDate = mainComp.date;

  // Calculate backwards from main competition
  const phases: MacrocyclePhase[] = [];
  let currentDate = new Date(mainCompDate);

  // Peak phase (1-2 weeks before main comp)
  const peakWeeks = 2;
  const peakStart = new Date(currentDate);
  peakStart.setDate(peakStart.getDate() - peakWeeks * 7);
  phases.unshift({
    phase: 'PEAK',
    startWeek: 0, // Will be calculated
    endWeek: 0,
    startDate: peakStart,
    endDate: new Date(currentDate),
    goals: ['Peak performance', 'Maximum freshness'],
    keyWorkouts: ['Activation sessions', 'Race simulation']
  });
  currentDate = new Date(peakStart);

  // Competition phase (8-12 weeks)
  const compWeeks = 10;
  const compStart = new Date(currentDate);
  compStart.setDate(compStart.getDate() - compWeeks * 7);
  phases.unshift({
    phase: 'COMPETITION',
    startWeek: 0,
    endWeek: 0,
    startDate: compStart,
    endDate: new Date(currentDate),
    goals: ['Competition performance', 'Maintain fitness'],
    keyWorkouts: ['Race pace work', 'Maintenance sessions']
  });
  currentDate = new Date(compStart);

  // Pre-Competition phase (5 weeks)
  const preCompWeeks = 5;
  const preCompStart = new Date(currentDate);
  preCompStart.setDate(preCompStart.getDate() - preCompWeeks * 7);
  phases.unshift({
    phase: 'PRE_COMP',
    startWeek: 0,
    endWeek: 0,
    startDate: preCompStart,
    endDate: new Date(currentDate),
    goals: ['Competition simulation', 'Technical polish'],
    keyWorkouts: ['Race practice', 'Sharpening sessions']
  });
  currentDate = new Date(preCompStart);

  // SPP phase (7 weeks)
  const sppWeeks = 7;
  const sppStart = new Date(currentDate);
  sppStart.setDate(sppStart.getDate() - sppWeeks * 7);
  phases.unshift({
    phase: 'SPP',
    startWeek: 0,
    endWeek: 0,
    startDate: sppStart,
    endDate: new Date(currentDate),
    goals: ['Event-specific fitness', 'Power development'],
    keyWorkouts: ['Speed work', 'Max strength', 'Technical sessions']
  });
  currentDate = new Date(sppStart);

  // GPP phase (remaining time, minimum 8 weeks)
  const yearStart = new Date(year, 0, 1);
  const gppWeeks = Math.max(8, Math.floor((currentDate.getTime() - yearStart.getTime()) / (7 * 24 * 60 * 60 * 1000)));
  const gppStart = new Date(currentDate);
  gppStart.setDate(gppStart.getDate() - gppWeeks * 7);
  phases.unshift({
    phase: 'GPP',
    startWeek: 0,
    endWeek: 0,
    startDate: gppStart,
    endDate: new Date(currentDate),
    goals: ['Build aerobic base', 'General strength', 'Work capacity'],
    keyWorkouts: ['Tempo', 'General strength', 'Technical foundations']
  });

  // Add transition phase after main competition
  const transitionStart = new Date(mainCompDate);
  transitionStart.setDate(transitionStart.getDate() + 1);
  const transitionEnd = new Date(transitionStart);
  transitionEnd.setDate(transitionEnd.getDate() + 21);
  phases.push({
    phase: 'TRANSITION',
    startWeek: 0,
    endWeek: 0,
    startDate: transitionStart,
    endDate: transitionEnd,
    goals: ['Recovery', 'Mental break'],
    keyWorkouts: ['Active rest', 'Cross-training']
  });

  // Calculate week numbers
  let weekCounter = 1;
  for (const phase of phases) {
    const weeksInPhase = Math.ceil(
      (phase.endDate.getTime() - phase.startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    phase.startWeek = weekCounter;
    phase.endWeek = weekCounter + weeksInPhase - 1;
    weekCounter = phase.endWeek + 1;
  }

  return {
    id: `macro_${athleteId}_${year}`,
    athleteId,
    year,
    startDate: phases[0].startDate,
    endDate: phases[phases.length - 1].endDate,
    targetCompetitions: sortedComps,
    phases,
    annualGoals: [
      'Peak at main competition',
      'Injury-free season',
      'Progressive improvement'
    ],
    personalBestTargets: {},
    totalWeeks: weekCounter - 1
  };
}

/**
 * Generate a mesocycle based on current phase
 */
export function generateMesocycle(
  macrocycle: Macrocycle,
  currentPhase: MacrocyclePhase,
  startWeek: number,
  loadPattern: LoadPattern = '3:1'
): Mesocycle {
  const patternConfig = LOAD_PATTERNS[loadPattern];
  const durationWeeks = patternConfig.weeks.length;

  const weeklyPlans: MicrocycleTemplate[] = [];

  // Get template for the event/phase
  const eventCategory = getEventCategory(macrocycle.targetCompetitions[0]?.event || '100M');
  const template = MICROCYCLE_TEMPLATES[eventCategory]?.[currentPhase.phase];

  for (let i = 0; i < durationWeeks; i++) {
    const loadPercent = patternConfig.weeks[i];

    if (template) {
      // Scale the template based on load percentage
      const scaledTemplate = scaleWeeklyTemplate(template, loadPercent);
      scaledTemplate.weekNumber = startWeek + i;
      weeklyPlans.push(scaledTemplate);
    } else {
      // Create a basic template
      weeklyPlans.push({
        weekNumber: startWeek + i,
        loadPercent,
        totalLoad: Math.round(500 * loadPercent / 100),
        keySessionDays: [0, 2, 4],
        recoveryDays: [3, 6],
        days: []
      });
    }
  }

  const startDate = new Date(currentPhase.startDate);
  startDate.setDate(startDate.getDate() + (startWeek - currentPhase.startWeek) * 7);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + durationWeeks * 7 - 1);

  return {
    id: `meso_${macrocycle.athleteId}_${startWeek}`,
    macrocycleId: macrocycle.id,
    athleteId: macrocycle.athleteId,
    phase: currentPhase.phase,
    weekNumber: startWeek,
    startDate,
    endDate,
    durationWeeks,
    loadPattern,
    weeklyPlans,
    goals: currentPhase.goals,
    focusAreas: PHASE_PARAMETERS[currentPhase.phase].primaryFocus
  };
}

// ==================== HELPER FUNCTIONS ====================

function getEventCategory(event: string): string {
  const sprintEvents = ['100M', '200M', '400M', '110M_HURDLES', '400M_HURDLES'];
  const middleEvents = ['800M', '1500M'];
  const distanceEvents = ['5000M', '10000M', 'MARATHON', '3000M_STEEPLECHASE'];
  const jumpEvents = ['LONG_JUMP', 'TRIPLE_JUMP', 'HIGH_JUMP', 'POLE_VAULT'];
  const throwEvents = ['SHOT_PUT', 'DISCUS', 'JAVELIN', 'HAMMER'];

  if (sprintEvents.includes(event)) return 'SPRINT';
  if (middleEvents.includes(event)) return 'MIDDLE_DISTANCE';
  if (distanceEvents.includes(event)) return 'DISTANCE';
  if (jumpEvents.includes(event)) return 'JUMPS';
  if (throwEvents.includes(event)) return 'THROWS';

  return 'SPRINT'; // Default
}

function scaleWeeklyTemplate(
  template: MicrocycleTemplate,
  loadPercent: number
): MicrocycleTemplate {
  const scale = loadPercent / 100;

  return {
    ...template,
    loadPercent,
    totalLoad: Math.round(template.totalLoad * scale),
    days: template.days.map(day => ({
      ...day,
      totalLoad: Math.round(day.totalLoad * scale),
      sessions: day.sessions.map(session => ({
        ...session,
        volume: Math.round(session.volume * scale),
        // Intensity is generally maintained or slightly reduced
        intensity: Math.round(session.intensity * (0.9 + scale * 0.1))
      }))
    }))
  };
}

/**
 * Get taper protocol for an event
 */
export function getTaperProtocol(event: string): TaperProtocol {
  const category = getEventCategory(event);

  const protocolMap: Record<string, string> = {
    'SPRINT': 'SPRINT',
    'MIDDLE_DISTANCE': 'MIDDLE_DISTANCE',
    'DISTANCE': 'DISTANCE',
    'JUMPS': 'JUMPS',
    'THROWS': 'THROWS'
  };

  return TAPER_PROTOCOLS[protocolMap[category] || 'SPRINT'];
}

/**
 * Get appropriate deload protocol
 */
export function getDeloadProtocol(trigger: string): DeloadProtocol | undefined {
  return DELOAD_PROTOCOLS.find(p =>
    p.trigger.toLowerCase().includes(trigger.toLowerCase())
  );
}

// ==================== EXPORTS ====================

export default {
  PHASE_PARAMETERS,
  LOAD_PATTERNS,
  MICROCYCLE_TEMPLATES,
  TAPER_PROTOCOLS,
  DELOAD_PROTOCOLS,
  LOAD_PROGRESSION_RULES,
  generateMacrocycle,
  generateMesocycle,
  getTaperProtocol,
  getDeloadProtocol
};
