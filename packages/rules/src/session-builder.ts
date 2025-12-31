/**
 * Session Builder - Daily Training Session Generator
 * Elite Athletics Performance System
 *
 * Creates complete training sessions including:
 * - Warm-up protocols
 * - Main workout sets
 * - Strength/power work
 * - Cool-down and recovery
 */

import {
  SprintZone,
  StrengthZone,
  EnduranceZone,
  SPRINT_ZONES,
  STRENGTH_ZONES,
  ENDURANCE_ZONES,
  EVENT_TRAINING_FOCUS,
  getSprintZone,
  getEnduranceZone,
  getStrengthParameters
} from './training-zones';

// ==================== SESSION STRUCTURE ====================

export interface TrainingSession {
  id: string;
  date: Date;
  athleteId: string;
  sessionType: SessionType;
  phase: TrainingPhase;
  event: string;
  totalDuration: number;          // minutes
  totalLoad: number;              // arbitrary units
  warmup: WarmupBlock;
  mainWorkout: MainWorkoutBlock;
  strength?: StrengthBlock;
  cooldown: CooldownBlock;
  notes: string[];
  coachNotes?: string;
}

export type SessionType =
  | 'SPEED'
  | 'SPEED_ENDURANCE'
  | 'TEMPO'
  | 'THRESHOLD'
  | 'LONG_RUN'
  | 'INTERVALS'
  | 'STRENGTH'
  | 'POWER'
  | 'PLYOMETRICS'
  | 'TECHNICAL'
  | 'RECOVERY'
  | 'COMPETITION'
  | 'TESTING';

export type TrainingPhase =
  | 'GPP'
  | 'SPP'
  | 'PRE_COMP'
  | 'COMPETITION'
  | 'PEAK'
  | 'TRANSITION';

// ==================== WARM-UP BLOCK ====================

export interface WarmupBlock {
  duration: number;               // minutes
  phases: WarmupPhase[];
}

export interface WarmupPhase {
  name: string;
  duration: number;               // minutes
  exercises: WarmupExercise[];
}

export interface WarmupExercise {
  name: string;
  sets?: number;
  reps?: number | string;
  distance?: number;              // meters
  duration?: number;              // seconds
  intensity?: string;
  notes?: string;
}

// ==================== MAIN WORKOUT BLOCK ====================

export interface MainWorkoutBlock {
  duration: number;               // minutes
  sets: WorkoutSet[];
  totalVolume: number;            // meters or other units
  averageIntensity: number;       // percentage
}

export interface WorkoutSet {
  exercise: string;
  reps: number;
  distance?: number;              // meters
  duration?: number;              // seconds
  intensity: number;              // percentage of max
  targetTime?: number;            // seconds
  recovery: number;               // seconds
  setRecovery?: number;           // seconds between sets
  notes?: string;
}

// ==================== STRENGTH BLOCK ====================

export interface StrengthBlock {
  duration: number;               // minutes
  phase: string;
  exercises: StrengthExercise[];
}

export interface StrengthExercise {
  name: string;
  sets: number;
  reps: number | string;
  intensity: number;              // % 1RM
  tempo?: string;
  rest: number;                   // seconds
  notes?: string;
}

// ==================== COOL-DOWN BLOCK ====================

export interface CooldownBlock {
  duration: number;               // minutes
  exercises: CooldownExercise[];
}

export interface CooldownExercise {
  name: string;
  duration?: number;              // seconds
  sets?: number;
  reps?: number;
  notes?: string;
}

// ==================== WARM-UP TEMPLATES ====================

export const WARMUP_TEMPLATES: Record<SessionType, WarmupBlock> = {
  SPEED: {
    duration: 25,
    phases: [
      {
        name: 'General Warm-up',
        duration: 8,
        exercises: [
          { name: 'Light jog', distance: 800, intensity: '50-55% HRmax' },
          { name: 'Dynamic stretching routine', duration: 180 },
          { name: 'Leg swings (front/side)', sets: 2, reps: 10 },
          { name: 'Walking lunges with twist', distance: 30 },
          { name: 'High knees', distance: 30 },
          { name: 'Butt kicks', distance: 30 }
        ]
      },
      {
        name: 'Sprint Drills',
        duration: 10,
        exercises: [
          { name: 'A-skips', distance: 30, sets: 2 },
          { name: 'B-skips', distance: 30, sets: 2 },
          { name: 'Straight leg bounds', distance: 30, sets: 2 },
          { name: 'Fast leg cycles', distance: 20, sets: 2 },
          { name: 'Ankling', distance: 30, sets: 2 },
          { name: 'Wicket runs', distance: 30, sets: 3, intensity: 'Progressive' }
        ]
      },
      {
        name: 'Acceleration Build-ups',
        duration: 7,
        exercises: [
          { name: 'Build-up 60m', sets: 2, intensity: '70%', notes: 'Focus on technique' },
          { name: 'Build-up 60m', sets: 2, intensity: '80%', notes: 'Increase drive phase' },
          { name: 'Build-up 60m', sets: 1, intensity: '90%', notes: 'Near race pace' }
        ]
      }
    ]
  },
  SPEED_ENDURANCE: {
    duration: 25,
    phases: [
      {
        name: 'General Warm-up',
        duration: 8,
        exercises: [
          { name: 'Light jog', distance: 800, intensity: '55-60% HRmax' },
          { name: 'Dynamic stretching routine', duration: 180 },
          { name: 'Leg swings (front/side)', sets: 2, reps: 10 },
          { name: 'Walking lunges', distance: 40 },
          { name: 'High knees', distance: 40 },
          { name: 'Butt kicks', distance: 40 }
        ]
      },
      {
        name: 'Sprint Drills',
        duration: 8,
        exercises: [
          { name: 'A-skips', distance: 40, sets: 2 },
          { name: 'B-skips', distance: 40, sets: 2 },
          { name: 'Straight leg bounds', distance: 40, sets: 2 },
          { name: 'Running As', distance: 30, sets: 2 }
        ]
      },
      {
        name: 'Progressive Runs',
        duration: 9,
        exercises: [
          { name: 'Build-up 80m', sets: 2, intensity: '70%' },
          { name: 'Build-up 80m', sets: 2, intensity: '80%' },
          { name: 'Build-up 100m', sets: 1, intensity: '85%' }
        ]
      }
    ]
  },
  TEMPO: {
    duration: 15,
    phases: [
      {
        name: 'General Warm-up',
        duration: 8,
        exercises: [
          { name: 'Light jog', distance: 800, intensity: '50-55% HRmax' },
          { name: 'Dynamic stretching routine', duration: 180 },
          { name: 'Leg swings', sets: 2, reps: 8 },
          { name: 'Walking lunges', distance: 30 }
        ]
      },
      {
        name: 'Activation',
        duration: 7,
        exercises: [
          { name: 'Strides', distance: 80, sets: 3, intensity: '70%' },
          { name: 'Form running drills', duration: 120 }
        ]
      }
    ]
  },
  THRESHOLD: {
    duration: 18,
    phases: [
      {
        name: 'General Warm-up',
        duration: 10,
        exercises: [
          { name: 'Easy jog', distance: 1600, intensity: '60-65% HRmax' },
          { name: 'Dynamic stretching', duration: 180 },
          { name: 'Leg swings', sets: 2, reps: 10 }
        ]
      },
      {
        name: 'Progressive Build',
        duration: 8,
        exercises: [
          { name: 'Strides', distance: 100, sets: 4, intensity: 'Progressive 70-85%' },
          { name: 'Form drills', duration: 120 }
        ]
      }
    ]
  },
  LONG_RUN: {
    duration: 12,
    phases: [
      {
        name: 'Pre-run Activation',
        duration: 5,
        exercises: [
          { name: 'Foam rolling', duration: 120, notes: 'Major muscle groups' },
          { name: 'Dynamic stretching', duration: 120 }
        ]
      },
      {
        name: 'Easy Start',
        duration: 7,
        exercises: [
          { name: 'Very easy jogging', duration: 300, intensity: '55-60% HRmax', notes: 'First km very easy' },
          { name: 'Brief mobility', duration: 60 }
        ]
      }
    ]
  },
  INTERVALS: {
    duration: 20,
    phases: [
      {
        name: 'General Warm-up',
        duration: 12,
        exercises: [
          { name: 'Easy jog', distance: 2000, intensity: '60-65% HRmax' },
          { name: 'Dynamic stretching', duration: 180 },
          { name: 'Leg drills', duration: 120 }
        ]
      },
      {
        name: 'Progressive Strides',
        duration: 8,
        exercises: [
          { name: 'Strides', distance: 100, sets: 4, intensity: '70-80-85-90%' },
          { name: 'Rest/recover', duration: 120 }
        ]
      }
    ]
  },
  STRENGTH: {
    duration: 15,
    phases: [
      {
        name: 'General Warm-up',
        duration: 8,
        exercises: [
          { name: 'Light cardio (bike/row)', duration: 300 },
          { name: 'Foam rolling', duration: 120 },
          { name: 'Dynamic stretching', duration: 180 }
        ]
      },
      {
        name: 'Movement Prep',
        duration: 7,
        exercises: [
          { name: 'Bodyweight squats', sets: 2, reps: 10 },
          { name: 'Glute bridges', sets: 2, reps: 10 },
          { name: 'Light kettlebell swings', sets: 2, reps: 10 },
          { name: 'Resistance band work', duration: 120 }
        ]
      }
    ]
  },
  POWER: {
    duration: 20,
    phases: [
      {
        name: 'General Warm-up',
        duration: 8,
        exercises: [
          { name: 'Light cardio', duration: 300 },
          { name: 'Foam rolling', duration: 120 },
          { name: 'Dynamic stretching', duration: 180 }
        ]
      },
      {
        name: 'CNS Activation',
        duration: 12,
        exercises: [
          { name: 'Bodyweight squats', sets: 2, reps: 8 },
          { name: 'Jump squats', sets: 2, reps: 5, intensity: 'Bodyweight' },
          { name: 'Medicine ball throws', sets: 2, reps: 5 },
          { name: 'Box jumps (low)', sets: 2, reps: 5 },
          { name: 'Empty bar lifts', sets: 2, reps: 5 }
        ]
      }
    ]
  },
  PLYOMETRICS: {
    duration: 20,
    phases: [
      {
        name: 'General Warm-up',
        duration: 8,
        exercises: [
          { name: 'Light jog', distance: 800 },
          { name: 'Dynamic stretching', duration: 180 },
          { name: 'Leg swings', sets: 2, reps: 10 }
        ]
      },
      {
        name: 'Progressive Jumps',
        duration: 12,
        exercises: [
          { name: 'Ankle bounces', sets: 2, reps: 20 },
          { name: 'Skipping', distance: 30, sets: 2 },
          { name: 'Low hurdle walks', sets: 2, reps: 5 },
          { name: 'Low box step-ups', sets: 2, reps: 10 },
          { name: 'Pogos', sets: 2, reps: 10 }
        ]
      }
    ]
  },
  TECHNICAL: {
    duration: 20,
    phases: [
      {
        name: 'General Warm-up',
        duration: 10,
        exercises: [
          { name: 'Light jog', distance: 800 },
          { name: 'Dynamic stretching', duration: 240 },
          { name: 'Event-specific mobility', duration: 180 }
        ]
      },
      {
        name: 'Movement Preparation',
        duration: 10,
        exercises: [
          { name: 'Technical drills', duration: 300, notes: 'Event-specific' },
          { name: 'Build-up runs', sets: 3, intensity: '70%' }
        ]
      }
    ]
  },
  RECOVERY: {
    duration: 10,
    phases: [
      {
        name: 'Light Movement',
        duration: 10,
        exercises: [
          { name: 'Very easy walk/jog', duration: 300, intensity: '<60% HRmax' },
          { name: 'Light stretching', duration: 180 },
          { name: 'Foam rolling', duration: 120 }
        ]
      }
    ]
  },
  COMPETITION: {
    duration: 45,
    phases: [
      {
        name: 'General Activation',
        duration: 15,
        exercises: [
          { name: 'Light jog', distance: 800, intensity: 'Very easy' },
          { name: 'Dynamic stretching', duration: 300 },
          { name: 'Leg swings', sets: 2, reps: 15 },
          { name: 'Mobility routine', duration: 180 }
        ]
      },
      {
        name: 'Event-Specific Drills',
        duration: 15,
        exercises: [
          { name: 'A-skips', distance: 30, sets: 2 },
          { name: 'B-skips', distance: 30, sets: 2 },
          { name: 'Fast leg drills', distance: 20, sets: 3 },
          { name: 'Event-specific technique', duration: 300 }
        ]
      },
      {
        name: 'Race Preparation',
        duration: 15,
        exercises: [
          { name: 'Build-up', sets: 2, intensity: '70%' },
          { name: 'Build-up', sets: 2, intensity: '80%' },
          { name: 'Build-up', sets: 1, intensity: '90%', notes: 'Race simulation' },
          { name: 'Practice starts', sets: 3, notes: 'Full focus' },
          { name: 'Rest and mental prep', duration: 300 }
        ]
      }
    ]
  },
  TESTING: {
    duration: 30,
    phases: [
      {
        name: 'Full Warm-up',
        duration: 15,
        exercises: [
          { name: 'Light jog', distance: 1200 },
          { name: 'Dynamic stretching', duration: 300 },
          { name: 'Event-specific mobility', duration: 180 }
        ]
      },
      {
        name: 'Test Preparation',
        duration: 15,
        exercises: [
          { name: 'Progressive build-ups', sets: 5, intensity: '60-70-80-85-90%' },
          { name: 'Full recovery', duration: 300 },
          { name: 'Mental preparation', duration: 120 }
        ]
      }
    ]
  }
};

// ==================== COOL-DOWN TEMPLATES ====================

export const COOLDOWN_TEMPLATES: Record<SessionType, CooldownBlock> = {
  SPEED: {
    duration: 15,
    exercises: [
      { name: 'Light jog', duration: 300 },
      { name: 'Walking', duration: 180 },
      { name: 'Static stretching - hamstrings', duration: 60, sets: 2 },
      { name: 'Static stretching - hip flexors', duration: 60, sets: 2 },
      { name: 'Static stretching - quads', duration: 60, sets: 2 },
      { name: 'Static stretching - calves', duration: 60, sets: 2 },
      { name: 'Foam rolling', duration: 180, notes: 'Focus on tight areas' }
    ]
  },
  SPEED_ENDURANCE: {
    duration: 18,
    exercises: [
      { name: 'Easy jog', duration: 480 },
      { name: 'Walking', duration: 180 },
      { name: 'Full body static stretching', duration: 420 },
      { name: 'Foam rolling', duration: 180 }
    ]
  },
  TEMPO: {
    duration: 10,
    exercises: [
      { name: 'Light walking', duration: 180 },
      { name: 'Static stretching routine', duration: 300 },
      { name: 'Optional foam rolling', duration: 120 }
    ]
  },
  THRESHOLD: {
    duration: 15,
    exercises: [
      { name: 'Easy jog', duration: 360 },
      { name: 'Walking', duration: 120 },
      { name: 'Static stretching', duration: 360 },
      { name: 'Foam rolling', duration: 120 }
    ]
  },
  LONG_RUN: {
    duration: 15,
    exercises: [
      { name: 'Easy walking', duration: 300 },
      { name: 'Hydration and nutrition', duration: 120 },
      { name: 'Full body stretching', duration: 420 },
      { name: 'Foam rolling', duration: 180, notes: 'Essential after long runs' }
    ]
  },
  INTERVALS: {
    duration: 15,
    exercises: [
      { name: 'Easy jog', duration: 420 },
      { name: 'Walking', duration: 120 },
      { name: 'Static stretching', duration: 300 },
      { name: 'Foam rolling', duration: 120 }
    ]
  },
  STRENGTH: {
    duration: 12,
    exercises: [
      { name: 'Light movement', duration: 180 },
      { name: 'Static stretching - worked muscles', duration: 300 },
      { name: 'Foam rolling', duration: 240, notes: 'Focus on worked areas' }
    ]
  },
  POWER: {
    duration: 12,
    exercises: [
      { name: 'Light walking', duration: 180 },
      { name: 'Static stretching', duration: 300 },
      { name: 'Foam rolling', duration: 240 }
    ]
  },
  PLYOMETRICS: {
    duration: 15,
    exercises: [
      { name: 'Light walking', duration: 180 },
      { name: 'Lower body stretching', duration: 360, notes: 'Focus on calves, quads, hip flexors' },
      { name: 'Foam rolling', duration: 300, notes: 'Important for elastic recovery' }
    ]
  },
  TECHNICAL: {
    duration: 10,
    exercises: [
      { name: 'Light movement', duration: 180 },
      { name: 'Event-specific stretching', duration: 300 },
      { name: 'Optional foam rolling', duration: 120 }
    ]
  },
  RECOVERY: {
    duration: 10,
    exercises: [
      { name: 'Extended stretching', duration: 420 },
      { name: 'Foam rolling', duration: 180 }
    ]
  },
  COMPETITION: {
    duration: 20,
    exercises: [
      { name: 'Easy jog', duration: 360, notes: 'If conditions allow' },
      { name: 'Walking', duration: 180 },
      { name: 'Full body stretching', duration: 480 },
      { name: 'Foam rolling', duration: 180 },
      { name: 'Nutrition and hydration', duration: 120 }
    ]
  },
  TESTING: {
    duration: 15,
    exercises: [
      { name: 'Easy movement', duration: 300 },
      { name: 'Full body stretching', duration: 360 },
      { name: 'Foam rolling', duration: 240 }
    ]
  }
};

// ==================== SESSION BUILDERS ====================

export interface SessionConfig {
  sessionType: SessionType;
  phase: TrainingPhase;
  event: string;
  athleteId: string;
  date: Date;
  targetIntensity?: number;
  targetVolume?: number;
  strengthPhase?: string;
  includeStrength?: boolean;
  customNotes?: string[];
}

/**
 * Build a complete speed session
 */
export function buildSpeedSession(config: SessionConfig): TrainingSession {
  const warmup = { ...WARMUP_TEMPLATES.SPEED };
  const cooldown = { ...COOLDOWN_TEMPLATES.SPEED };

  const targetIntensity = config.targetIntensity || 95;
  const zone = getSprintZone(targetIntensity);

  // Build main workout based on phase
  let mainWorkout: MainWorkoutBlock;

  switch (config.phase) {
    case 'GPP':
      mainWorkout = {
        duration: 25,
        totalVolume: 350,
        averageIntensity: 88,
        sets: [
          { exercise: 'Acceleration runs', reps: 4, distance: 30, intensity: 90, recovery: 180, notes: 'Focus on drive phase' },
          { exercise: 'Build-up runs', reps: 3, distance: 60, intensity: 85, recovery: 240, notes: 'Smooth acceleration' },
          { exercise: 'Flying 20m', reps: 3, distance: 20, intensity: 95, recovery: 360, notes: 'Max velocity zone' }
        ]
      };
      break;

    case 'SPP':
      mainWorkout = {
        duration: 30,
        totalVolume: 400,
        averageIntensity: 92,
        sets: [
          { exercise: 'Block starts', reps: 6, distance: 30, intensity: 95, recovery: 240, notes: 'Race start simulation' },
          { exercise: 'Flying 30m', reps: 4, distance: 30, intensity: 97, recovery: 420, notes: 'Maximum velocity' },
          { exercise: 'Ins-outs (20m fast/10m float)', reps: 3, distance: 60, intensity: 92, recovery: 360 }
        ]
      };
      break;

    case 'PRE_COMP':
    case 'COMPETITION':
      mainWorkout = {
        duration: 25,
        totalVolume: 300,
        averageIntensity: 95,
        sets: [
          { exercise: 'Block starts', reps: 4, distance: 30, intensity: 97, recovery: 300, notes: 'Race simulation' },
          { exercise: 'Flying 20m', reps: 3, distance: 20, intensity: 98, recovery: 420, notes: 'Touch max velocity' },
          { exercise: 'Race pace run', reps: 2, distance: 60, intensity: 95, recovery: 480 }
        ]
      };
      break;

    case 'PEAK':
      mainWorkout = {
        duration: 20,
        totalVolume: 200,
        averageIntensity: 90,
        sets: [
          { exercise: 'Block starts', reps: 3, distance: 30, intensity: 95, recovery: 360, notes: 'Sharp but not exhausting' },
          { exercise: 'Flying 20m', reps: 2, distance: 20, intensity: 95, recovery: 360, notes: 'Maintain feel' }
        ]
      };
      break;

    default:
      mainWorkout = {
        duration: 20,
        totalVolume: 250,
        averageIntensity: 85,
        sets: [
          { exercise: 'Build-up runs', reps: 4, distance: 60, intensity: 85, recovery: 180 }
        ]
      };
  }

  // Optional strength block
  let strength: StrengthBlock | undefined;
  if (config.includeStrength) {
    const strengthParams = getStrengthParameters(config.strengthPhase || 'POWER');
    if (strengthParams) {
      strength = {
        duration: 30,
        phase: strengthParams.phase,
        exercises: [
          { name: 'Power clean', sets: 4, reps: 3, intensity: 70, rest: 180, tempo: 'X-0-X-0' },
          { name: 'Jump squat', sets: 3, reps: 5, intensity: 40, rest: 180, notes: 'Bodyweight or light bar' },
          { name: 'Single leg RDL', sets: 3, reps: '6 each', intensity: 60, rest: 120 }
        ]
      };
    }
  }

  const totalDuration = warmup.duration + mainWorkout.duration + cooldown.duration +
    (strength?.duration || 0);

  return {
    id: generateSessionId(),
    date: config.date,
    athleteId: config.athleteId,
    sessionType: 'SPEED',
    phase: config.phase,
    event: config.event,
    totalDuration,
    totalLoad: calculateSessionLoad(mainWorkout, strength),
    warmup,
    mainWorkout,
    strength,
    cooldown,
    notes: config.customNotes || ['Focus on quality over quantity', 'Full recovery between reps'],
    coachNotes: `Speed session - ${config.phase} phase`
  };
}

/**
 * Build a complete tempo/recovery session
 */
export function buildTempoSession(config: SessionConfig): TrainingSession {
  const warmup = { ...WARMUP_TEMPLATES.TEMPO };
  const cooldown = { ...COOLDOWN_TEMPLATES.TEMPO };

  const mainWorkout: MainWorkoutBlock = {
    duration: 30,
    totalVolume: 2000,
    averageIntensity: 65,
    sets: [
      { exercise: 'Tempo runs', reps: 10, distance: 100, intensity: 65, recovery: 45, notes: 'Relaxed form' },
      { exercise: 'Tempo runs', reps: 6, distance: 200, intensity: 65, recovery: 60, notes: 'Maintain rhythm' }
    ]
  };

  // Core/auxiliary work instead of heavy strength
  const strength: StrengthBlock = {
    duration: 20,
    phase: 'Core & Auxiliary',
    exercises: [
      { name: 'Plank variations', sets: 3, reps: '30 sec', intensity: 0, rest: 30 },
      { name: 'Side plank', sets: 2, reps: '20 sec each', intensity: 0, rest: 30 },
      { name: 'Bird dogs', sets: 2, reps: 10, intensity: 0, rest: 30 },
      { name: 'Glute bridges', sets: 3, reps: 12, intensity: 0, rest: 45 },
      { name: 'Copenhagen plank', sets: 2, reps: '15 sec each', intensity: 0, rest: 30 }
    ]
  };

  return {
    id: generateSessionId(),
    date: config.date,
    athleteId: config.athleteId,
    sessionType: 'TEMPO',
    phase: config.phase,
    event: config.event,
    totalDuration: warmup.duration + mainWorkout.duration + strength.duration + cooldown.duration,
    totalLoad: calculateSessionLoad(mainWorkout, strength),
    warmup,
    mainWorkout,
    strength,
    cooldown,
    notes: ['Keep intensity controlled', 'Focus on recovery'],
    coachNotes: 'Tempo/Recovery session - maintain aerobic base'
  };
}

/**
 * Build a strength-focused session
 */
export function buildStrengthSession(config: SessionConfig): TrainingSession {
  const warmup = { ...WARMUP_TEMPLATES.STRENGTH };
  const cooldown = { ...COOLDOWN_TEMPLATES.STRENGTH };

  const strengthPhase = config.strengthPhase || 'MAX_STRENGTH';
  const strengthParams = getStrengthParameters(strengthPhase);

  if (!strengthParams) {
    throw new Error(`Unknown strength phase: ${strengthPhase}`);
  }

  let exercises: StrengthExercise[];

  switch (strengthPhase) {
    case 'MAX_STRENGTH':
      exercises = [
        { name: 'Back squat', sets: 5, reps: 3, intensity: 87, rest: 240, tempo: '2-1-X-0' },
        { name: 'Romanian deadlift', sets: 4, reps: 4, intensity: 82, rest: 180, tempo: '3-1-2-0' },
        { name: 'Split squat', sets: 3, reps: '5 each', intensity: 75, rest: 150 },
        { name: 'Glute-ham raise', sets: 3, reps: 6, intensity: 0, rest: 120, notes: 'Bodyweight' },
        { name: 'Calf raises', sets: 3, reps: 8, intensity: 80, rest: 90 }
      ];
      break;

    case 'POWER':
      exercises = [
        { name: 'Power clean', sets: 5, reps: 3, intensity: 75, rest: 180, tempo: 'X-0-X-0' },
        { name: 'Box jump', sets: 4, reps: 5, intensity: 0, rest: 120, notes: 'Focus on landing' },
        { name: 'Jump squat', sets: 4, reps: 5, intensity: 40, rest: 150 },
        { name: 'Medicine ball throws', sets: 3, reps: 6, intensity: 0, rest: 90 },
        { name: 'Band-resisted hip extension', sets: 3, reps: 10, intensity: 0, rest: 60 }
      ];
      break;

    case 'STRENGTH_ENDURANCE':
      exercises = [
        { name: 'Goblet squat', sets: 3, reps: 15, intensity: 50, rest: 60, tempo: '2-0-2-0' },
        { name: 'Lunge variations', sets: 3, reps: '12 each', intensity: 45, rest: 60 },
        { name: 'Step-ups', sets: 3, reps: '15 each', intensity: 40, rest: 60 },
        { name: 'Single leg deadlift', sets: 3, reps: '12 each', intensity: 45, rest: 60 },
        { name: 'Calf raises', sets: 3, reps: 20, intensity: 50, rest: 45 }
      ];
      break;

    default:
      exercises = [
        { name: 'Back squat', sets: 4, reps: 6, intensity: 75, rest: 180 },
        { name: 'Romanian deadlift', sets: 4, reps: 6, intensity: 70, rest: 150 },
        { name: 'Split squat', sets: 3, reps: '8 each', intensity: 65, rest: 120 }
      ];
  }

  const strength: StrengthBlock = {
    duration: 45,
    phase: strengthParams.phase,
    exercises
  };

  // Light track work before strength
  const mainWorkout: MainWorkoutBlock = {
    duration: 15,
    totalVolume: 400,
    averageIntensity: 70,
    sets: [
      { exercise: 'Build-up runs', reps: 4, distance: 60, intensity: 70, recovery: 90, notes: 'Activation only' },
      { exercise: 'Sprint drills', reps: 1, duration: 300, intensity: 65, recovery: 0, notes: 'Technical work' }
      ]
  };

  return {
    id: generateSessionId(),
    date: config.date,
    athleteId: config.athleteId,
    sessionType: 'STRENGTH',
    phase: config.phase,
    event: config.event,
    totalDuration: warmup.duration + mainWorkout.duration + strength.duration + cooldown.duration,
    totalLoad: calculateSessionLoad(mainWorkout, strength),
    warmup,
    mainWorkout,
    strength,
    cooldown,
    notes: [`Strength focus: ${strengthParams.phase}`, 'Maintain good form throughout'],
    coachNotes: `Strength session - ${strengthParams.phase}`
  };
}

/**
 * Build a recovery session
 */
export function buildRecoverySession(config: SessionConfig): TrainingSession {
  const warmup = { ...WARMUP_TEMPLATES.RECOVERY };
  const cooldown = { ...COOLDOWN_TEMPLATES.RECOVERY };

  const mainWorkout: MainWorkoutBlock = {
    duration: 30,
    totalVolume: 0,
    averageIntensity: 40,
    sets: [
      { exercise: 'Pool recovery', reps: 1, duration: 900, intensity: 40, recovery: 0, notes: 'If available' },
      { exercise: 'Light cycling', reps: 1, duration: 600, intensity: 50, recovery: 0, notes: 'Alternative' },
      { exercise: 'Mobility work', reps: 1, duration: 600, intensity: 30, recovery: 0 }
    ]
  };

  return {
    id: generateSessionId(),
    date: config.date,
    athleteId: config.athleteId,
    sessionType: 'RECOVERY',
    phase: config.phase,
    event: config.event,
    totalDuration: warmup.duration + mainWorkout.duration + cooldown.duration,
    totalLoad: 50, // Very low load
    warmup,
    mainWorkout,
    cooldown,
    notes: ['Focus on recovery', 'No intensity work', 'Hydrate well'],
    coachNotes: 'Active recovery session'
  };
}

// ==================== HELPER FUNCTIONS ====================

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function calculateSessionLoad(
  mainWorkout: MainWorkoutBlock,
  strength?: StrengthBlock
): number {
  let load = 0;

  // Main workout load
  for (const set of mainWorkout.sets) {
    const volume = set.distance || (set.duration ? set.duration / 60 * 100 : 0);
    load += (set.reps * volume * set.intensity) / 100;
  }

  // Strength load
  if (strength) {
    for (const exercise of strength.exercises) {
      const reps = typeof exercise.reps === 'number' ? exercise.reps : 8;
      load += (exercise.sets * reps * (exercise.intensity || 50)) / 100 * 0.5; // Strength contributes 50%
    }
  }

  return Math.round(load);
}

// ==================== EXPORTS ====================

export default {
  buildSpeedSession,
  buildTempoSession,
  buildStrengthSession,
  buildRecoverySession,
  WARMUP_TEMPLATES,
  COOLDOWN_TEMPLATES
};
