/**
 * EVENT-WISE TEST MAPPING CONFIGURATION
 * World-Class Athletics Performance System
 *
 * प्रत्येक Event साठी specific tests mapping
 * Coach साठी practical आणि field-ready
 */

// ============================================
// TEST CATEGORIES & DEFINITIONS
// ============================================

export type TestCategory =
  | 'strength'
  | 'sprint'
  | 'reaction'
  | 'power'
  | 'biomechanics'
  | 'injury_prevention'
  | 'core'
  | 'physiological'
  | 'performance'
  | 'fatigue'
  | 'endurance'
  | 'fueling'
  | 'economy'
  | 'approach'
  | 'technique'
  | 'mobility'
  | 'hurdles_specific';

export type ValueDirection = 'higher_better' | 'lower_better' | 'optimal_range';

export interface TestDefinition {
  id: string;
  name: string;
  displayName: string;
  category: TestCategory;
  unit: string;
  valueDirection: ValueDirection;
  optimalRange?: { min: number; max: number };
  description: string;
  equipment?: string[];
  hasLeftRight?: boolean;  // For bilateral tests
  attemptBased?: boolean;  // Multiple attempts allowed
  timeBasedPlot?: boolean; // X-axis should be time/date
}

export interface EventTestMapping {
  eventId: string;
  eventName: string;
  eventCategory: 'sprint' | 'hurdles' | 'middle_distance' | 'long_distance' | 'jumps' | 'throws';
  tests: {
    category: TestCategory;
    categoryDisplayName: string;
    tests: string[];  // Test IDs
  }[];
}

// ============================================
// COMPLETE TEST DEFINITIONS
// ============================================

export const TEST_DEFINITIONS: Record<string, TestDefinition> = {
  // ========== STRENGTH TESTS ==========
  squat_1rm: {
    id: 'squat_1rm',
    name: 'squat_1rm',
    displayName: 'Back Squat 1RM',
    category: 'strength',
    unit: 'kg',
    valueDirection: 'higher_better',
    description: 'Maximum weight lifted in back squat for one repetition',
    equipment: ['Barbell', 'Squat Rack', 'Weight Plates'],
    attemptBased: true,
    timeBasedPlot: true
  },
  front_squat_1rm: {
    id: 'front_squat_1rm',
    name: 'front_squat_1rm',
    displayName: 'Front Squat 1RM',
    category: 'strength',
    unit: 'kg',
    valueDirection: 'higher_better',
    description: 'Maximum weight lifted in front squat for one repetition',
    equipment: ['Barbell', 'Squat Rack', 'Weight Plates'],
    attemptBased: true,
    timeBasedPlot: true
  },
  deadlift_1rm: {
    id: 'deadlift_1rm',
    name: 'deadlift_1rm',
    displayName: 'Deadlift 1RM',
    category: 'strength',
    unit: 'kg',
    valueDirection: 'higher_better',
    description: 'Maximum weight lifted in conventional or sumo deadlift',
    equipment: ['Barbell', 'Weight Plates'],
    attemptBased: true,
    timeBasedPlot: true
  },
  bench_press_1rm: {
    id: 'bench_press_1rm',
    name: 'bench_press_1rm',
    displayName: 'Bench Press 1RM',
    category: 'strength',
    unit: 'kg',
    valueDirection: 'higher_better',
    description: 'Maximum weight lifted in bench press',
    equipment: ['Barbell', 'Bench', 'Weight Plates'],
    attemptBased: true,
    timeBasedPlot: true
  },
  hip_thrust_1rm: {
    id: 'hip_thrust_1rm',
    name: 'hip_thrust_1rm',
    displayName: 'Hip Thrust 1RM',
    category: 'strength',
    unit: 'kg',
    valueDirection: 'higher_better',
    description: 'Maximum weight in barbell hip thrust',
    equipment: ['Barbell', 'Bench', 'Weight Plates'],
    attemptBased: true,
    timeBasedPlot: true
  },
  clean_1rm: {
    id: 'clean_1rm',
    name: 'clean_1rm',
    displayName: 'Power Clean 1RM',
    category: 'strength',
    unit: 'kg',
    valueDirection: 'higher_better',
    description: 'Maximum weight in power clean',
    equipment: ['Barbell', 'Weight Plates', 'Platform'],
    attemptBased: true,
    timeBasedPlot: true
  },
  snatch_1rm: {
    id: 'snatch_1rm',
    name: 'snatch_1rm',
    displayName: 'Snatch 1RM',
    category: 'strength',
    unit: 'kg',
    valueDirection: 'higher_better',
    description: 'Maximum weight in power snatch',
    equipment: ['Barbell', 'Weight Plates', 'Platform'],
    attemptBased: true,
    timeBasedPlot: true
  },
  clean_jerk_1rm: {
    id: 'clean_jerk_1rm',
    name: 'clean_jerk_1rm',
    displayName: 'Clean & Jerk 1RM',
    category: 'strength',
    unit: 'kg',
    valueDirection: 'higher_better',
    description: 'Maximum weight in clean and jerk',
    equipment: ['Barbell', 'Weight Plates', 'Platform'],
    attemptBased: true,
    timeBasedPlot: true
  },
  push_press_1rm: {
    id: 'push_press_1rm',
    name: 'push_press_1rm',
    displayName: 'Push Press 1RM',
    category: 'strength',
    unit: 'kg',
    valueDirection: 'higher_better',
    description: 'Maximum weight in push press',
    equipment: ['Barbell', 'Weight Plates'],
    attemptBased: true,
    timeBasedPlot: true
  },
  pullup_1rm: {
    id: 'pullup_1rm',
    name: 'pullup_1rm',
    displayName: 'Weighted Pull-up 1RM',
    category: 'strength',
    unit: 'kg',
    valueDirection: 'higher_better',
    description: 'Maximum added weight in pull-up (bodyweight + added)',
    equipment: ['Pull-up Bar', 'Weight Belt', 'Weight Plates'],
    attemptBased: true,
    timeBasedPlot: true
  },

  // ========== SPRINT TESTS ==========
  sprint_10m_time: {
    id: 'sprint_10m_time',
    name: 'sprint_10m_time',
    displayName: '10m Sprint',
    category: 'sprint',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time to cover 10 meters from standing start',
    equipment: ['Timing Gates', 'Starting Blocks (optional)'],
    attemptBased: true,
    timeBasedPlot: true
  },
  sprint_20m_time: {
    id: 'sprint_20m_time',
    name: 'sprint_20m_time',
    displayName: '20m Sprint',
    category: 'sprint',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time to cover 20 meters from standing start',
    equipment: ['Timing Gates', 'Starting Blocks (optional)'],
    attemptBased: true,
    timeBasedPlot: true
  },
  sprint_30m_time: {
    id: 'sprint_30m_time',
    name: 'sprint_30m_time',
    displayName: '30m Sprint',
    category: 'sprint',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time to cover 30 meters from standing start',
    equipment: ['Timing Gates', 'Starting Blocks (optional)'],
    attemptBased: true,
    timeBasedPlot: true
  },
  sprint_40m_time: {
    id: 'sprint_40m_time',
    name: 'sprint_40m_time',
    displayName: '40m Sprint',
    category: 'sprint',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time to cover 40 meters from standing start',
    equipment: ['Timing Gates', 'Starting Blocks (optional)'],
    attemptBased: true,
    timeBasedPlot: true
  },
  sprint_60m_time: {
    id: 'sprint_60m_time',
    name: 'sprint_60m_time',
    displayName: '60m Sprint',
    category: 'sprint',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time to cover 60 meters',
    equipment: ['Timing Gates', 'Starting Blocks'],
    attemptBased: true,
    timeBasedPlot: true
  },
  sprint_80m: {
    id: 'sprint_80m',
    name: 'sprint_80m',
    displayName: '80m Sprint',
    category: 'sprint',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time to cover 80 meters',
    equipment: ['Timing Gates', 'Starting Blocks'],
    attemptBased: true,
    timeBasedPlot: true
  },
  sprint_100m_time: {
    id: 'sprint_100m_time',
    name: 'sprint_100m_time',
    displayName: '100m Sprint',
    category: 'sprint',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time to cover 100 meters',
    equipment: ['Timing Gates', 'Starting Blocks'],
    attemptBased: true,
    timeBasedPlot: true
  },
  sprint_120m: {
    id: 'sprint_120m',
    name: 'sprint_120m',
    displayName: '120m Sprint',
    category: 'sprint',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time to cover 120 meters (speed endurance test)',
    equipment: ['Timing Gates', 'Starting Blocks'],
    attemptBased: true,
    timeBasedPlot: true
  },
  sprint_150m: {
    id: 'sprint_150m',
    name: 'sprint_150m',
    displayName: '150m Sprint',
    category: 'sprint',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time to cover 150 meters',
    equipment: ['Timing Gates'],
    attemptBased: true,
    timeBasedPlot: true
  },
  sprint_200m_time: {
    id: 'sprint_200m_time',
    name: 'sprint_200m_time',
    displayName: '200m Sprint',
    category: 'sprint',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time to cover 200 meters',
    equipment: ['Timing Gates', 'Starting Blocks'],
    attemptBased: true,
    timeBasedPlot: true
  },
  sprint_300m: {
    id: 'sprint_300m',
    name: 'sprint_300m',
    displayName: '300m Sprint',
    category: 'sprint',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time to cover 300 meters',
    equipment: ['Timing System'],
    attemptBased: true,
    timeBasedPlot: true
  },
  sprint_400m_time: {
    id: 'sprint_400m_time',
    name: 'sprint_400m_time',
    displayName: '400m Sprint',
    category: 'sprint',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time to cover 400 meters',
    equipment: ['Timing System', 'Starting Blocks'],
    attemptBased: true,
    timeBasedPlot: true
  },
  sprint_600m: {
    id: 'sprint_600m',
    name: 'sprint_600m',
    displayName: '600m Run',
    category: 'sprint',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time to cover 600 meters',
    equipment: ['Timing System'],
    attemptBased: true,
    timeBasedPlot: true
  },
  sprint_800m: {
    id: 'sprint_800m',
    name: 'sprint_800m',
    displayName: '800m Run',
    category: 'sprint',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time to cover 800 meters',
    equipment: ['Timing System'],
    attemptBased: true,
    timeBasedPlot: true
  },
  sprint_1000m: {
    id: 'sprint_1000m',
    name: 'sprint_1000m',
    displayName: '1000m Run',
    category: 'performance',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time to cover 1000 meters',
    equipment: ['Timing System'],
    attemptBased: true,
    timeBasedPlot: true
  },
  sprint_1500m: {
    id: 'sprint_1500m',
    name: 'sprint_1500m',
    displayName: '1500m Run',
    category: 'performance',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time to cover 1500 meters',
    equipment: ['Timing System'],
    attemptBased: true,
    timeBasedPlot: true
  },
  sprint_5km: {
    id: 'sprint_5km',
    name: 'sprint_5km',
    displayName: '5K Run',
    category: 'performance',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time to cover 5 kilometers',
    equipment: ['GPS Watch', 'Timing System'],
    attemptBased: true,
    timeBasedPlot: true
  },
  sprint_10km: {
    id: 'sprint_10km',
    name: 'sprint_10km',
    displayName: '10K Run',
    category: 'performance',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time to cover 10 kilometers',
    equipment: ['GPS Watch', 'Timing System'],
    attemptBased: true,
    timeBasedPlot: true
  },
  flying_10m: {
    id: 'flying_10m',
    name: 'flying_10m',
    displayName: 'Flying 10m',
    category: 'sprint',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time for 10m with running start (max velocity)',
    equipment: ['Timing Gates'],
    attemptBased: true,
    timeBasedPlot: true
  },
  flying_20m_time: {
    id: 'flying_20m_time',
    name: 'flying_20m_time',
    displayName: 'Flying 20m',
    category: 'sprint',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time for 20m with running start',
    equipment: ['Timing Gates'],
    attemptBased: true,
    timeBasedPlot: true
  },
  flying_30m_time: {
    id: 'flying_30m_time',
    name: 'flying_30m_time',
    displayName: 'Flying 30m',
    category: 'sprint',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time for 30m with running start',
    equipment: ['Timing Gates'],
    attemptBased: true,
    timeBasedPlot: true
  },
  acceleration_30m_time: {
    id: 'acceleration_30m_time',
    name: 'acceleration_30m_time',
    displayName: 'Acceleration 30m',
    category: 'sprint',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Block start to 30m - acceleration phase test',
    equipment: ['Timing Gates', 'Starting Blocks'],
    attemptBased: true,
    timeBasedPlot: true
  },
  max_velocity_60m: {
    id: 'max_velocity_60m',
    name: 'max_velocity_60m',
    displayName: 'Max Velocity (60m point)',
    category: 'sprint',
    unit: 'm/s',
    valueDirection: 'higher_better',
    description: 'Maximum velocity achieved around 60m mark',
    equipment: ['Radar Gun', 'Timing Gates'],
    attemptBased: true,
    timeBasedPlot: true
  },
  anaerobic_speed_reserve: {
    id: 'anaerobic_speed_reserve',
    name: 'anaerobic_speed_reserve',
    displayName: 'Anaerobic Speed Reserve',
    category: 'sprint',
    unit: 'm/s',
    valueDirection: 'higher_better',
    description: 'Difference between max sprint speed and MAS',
    equipment: ['Timing System'],
    timeBasedPlot: true
  },
  speed_reserve: {
    id: 'speed_reserve',
    name: 'speed_reserve',
    displayName: 'Speed Reserve %',
    category: 'sprint',
    unit: '%',
    valueDirection: 'higher_better',
    optimalRange: { min: 15, max: 25 },
    description: 'Percentage of max speed available at race pace',
    timeBasedPlot: true
  },
  sprint_fv_profile: {
    id: 'sprint_fv_profile',
    name: 'sprint_fv_profile',
    displayName: 'Sprint F-V Profile',
    category: 'sprint',
    unit: 'ratio',
    valueDirection: 'optimal_range',
    optimalRange: { min: -0.9, max: -0.7 },
    description: 'Force-Velocity profile slope from sprint testing',
    equipment: ['Timing Gates', 'Force Platform'],
    timeBasedPlot: true
  },
  wicket_rhythm_score: {
    id: 'wicket_rhythm_score',
    name: 'wicket_rhythm_score',
    displayName: 'Wicket Rhythm Score',
    category: 'sprint',
    unit: 'score',
    valueDirection: 'higher_better',
    optimalRange: { min: 8, max: 10 },
    description: 'Quality score for wicket run rhythm and consistency',
    timeBasedPlot: true
  },

  // ========== REACTION TESTS ==========
  reaction_time: {
    id: 'reaction_time',
    name: 'reaction_time',
    displayName: 'Reaction Time',
    category: 'reaction',
    unit: 'ms',
    valueDirection: 'lower_better',
    description: 'Time from gun to first movement',
    equipment: ['Starting Blocks with Sensors', 'Timing System'],
    attemptBased: true,
    timeBasedPlot: true
  },
  block_clearance_time: {
    id: 'block_clearance_time',
    name: 'block_clearance_time',
    displayName: 'Block Clearance Time',
    category: 'reaction',
    unit: 'ms',
    valueDirection: 'lower_better',
    description: 'Time from gun to leaving blocks completely',
    equipment: ['Starting Blocks with Sensors'],
    attemptBased: true,
    timeBasedPlot: true
  },
  shin_angle: {
    id: 'shin_angle',
    name: 'shin_angle',
    displayName: 'Shin Angle at Set',
    category: 'reaction',
    unit: 'degrees',
    valueDirection: 'optimal_range',
    optimalRange: { min: 40, max: 50 },
    description: 'Shin angle in set position',
    equipment: ['Video Analysis', 'Goniometer'],
    timeBasedPlot: true
  },
  first_3_step_power: {
    id: 'first_3_step_power',
    name: 'first_3_step_power',
    displayName: 'First 3 Step Power',
    category: 'reaction',
    unit: 'watts',
    valueDirection: 'higher_better',
    description: 'Power output in first 3 steps from blocks',
    equipment: ['Force Plates', 'Video Analysis'],
    attemptBased: true,
    timeBasedPlot: true
  },

  // ========== POWER TESTS ==========
  vertical_jump_cm: {
    id: 'vertical_jump_cm',
    name: 'vertical_jump_cm',
    displayName: 'Vertical Jump',
    category: 'power',
    unit: 'cm',
    valueDirection: 'higher_better',
    description: 'Maximum vertical jump height',
    equipment: ['Vertec', 'Jump Mat', 'Force Platform'],
    attemptBased: true,
    timeBasedPlot: true
  },
  cmj_height: {
    id: 'cmj_height',
    name: 'cmj_height',
    displayName: 'CMJ Height',
    category: 'power',
    unit: 'cm',
    valueDirection: 'higher_better',
    description: 'Counter-movement jump height',
    equipment: ['Force Platform', 'Jump Mat'],
    attemptBased: true,
    timeBasedPlot: true
  },
  squat_jump_height: {
    id: 'squat_jump_height',
    name: 'squat_jump_height',
    displayName: 'Squat Jump Height',
    category: 'power',
    unit: 'cm',
    valueDirection: 'higher_better',
    description: 'Jump height from static squat position (no countermovement)',
    equipment: ['Force Platform', 'Jump Mat'],
    attemptBased: true,
    timeBasedPlot: true
  },
  single_leg_cmj_left: {
    id: 'single_leg_cmj_left',
    name: 'single_leg_cmj_left',
    displayName: 'Single Leg CMJ (Left)',
    category: 'power',
    unit: 'cm',
    valueDirection: 'higher_better',
    description: 'Single leg counter-movement jump - Left leg',
    equipment: ['Force Platform', 'Jump Mat'],
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },
  single_leg_cmj_right: {
    id: 'single_leg_cmj_right',
    name: 'single_leg_cmj_right',
    displayName: 'Single Leg CMJ (Right)',
    category: 'power',
    unit: 'cm',
    valueDirection: 'higher_better',
    description: 'Single leg counter-movement jump - Right leg',
    equipment: ['Force Platform', 'Jump Mat'],
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },
  drop_jump_20cm: {
    id: 'drop_jump_20cm',
    name: 'drop_jump_20cm',
    displayName: 'Drop Jump 20cm',
    category: 'power',
    unit: 'cm',
    valueDirection: 'higher_better',
    description: 'Reactive jump from 20cm box',
    equipment: ['Plyo Box', 'Force Platform'],
    attemptBased: true,
    timeBasedPlot: true
  },
  drop_jump_30cm: {
    id: 'drop_jump_30cm',
    name: 'drop_jump_30cm',
    displayName: 'Drop Jump 30cm',
    category: 'power',
    unit: 'cm',
    valueDirection: 'higher_better',
    description: 'Reactive jump from 30cm box',
    equipment: ['Plyo Box', 'Force Platform'],
    attemptBased: true,
    timeBasedPlot: true
  },
  drop_jump_40cm: {
    id: 'drop_jump_40cm',
    name: 'drop_jump_40cm',
    displayName: 'Drop Jump 40cm',
    category: 'power',
    unit: 'cm',
    valueDirection: 'higher_better',
    description: 'Reactive jump from 40cm box',
    equipment: ['Plyo Box', 'Force Platform'],
    attemptBased: true,
    timeBasedPlot: true
  },
  rsi_bilateral: {
    id: 'rsi_bilateral',
    name: 'rsi_bilateral',
    displayName: 'RSI (Bilateral)',
    category: 'power',
    unit: 'ratio',
    valueDirection: 'higher_better',
    description: 'Reactive Strength Index - Jump height / Ground contact time',
    equipment: ['Force Platform'],
    attemptBased: true,
    timeBasedPlot: true
  },
  rsi_unilateral: {
    id: 'rsi_unilateral',
    name: 'rsi_unilateral',
    displayName: 'RSI (Unilateral)',
    category: 'power',
    unit: 'ratio',
    valueDirection: 'higher_better',
    description: 'Single leg Reactive Strength Index',
    equipment: ['Force Platform'],
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },
  reactive_strength_index: {
    id: 'reactive_strength_index',
    name: 'reactive_strength_index',
    displayName: 'Reactive Strength Index',
    category: 'power',
    unit: 'ratio',
    valueDirection: 'higher_better',
    description: 'Jump height divided by ground contact time',
    equipment: ['Force Platform'],
    attemptBased: true,
    timeBasedPlot: true
  },
  loaded_jump_20_percent: {
    id: 'loaded_jump_20_percent',
    name: 'loaded_jump_20_percent',
    displayName: 'Loaded Jump (20% BW)',
    category: 'power',
    unit: 'cm',
    valueDirection: 'higher_better',
    description: 'CMJ with 20% bodyweight load',
    equipment: ['Trap Bar', 'Force Platform'],
    attemptBased: true,
    timeBasedPlot: true
  },
  loaded_jump_40_percent: {
    id: 'loaded_jump_40_percent',
    name: 'loaded_jump_40_percent',
    displayName: 'Loaded Jump (40% BW)',
    category: 'power',
    unit: 'cm',
    valueDirection: 'higher_better',
    description: 'CMJ with 40% bodyweight load',
    equipment: ['Trap Bar', 'Force Platform'],
    attemptBased: true,
    timeBasedPlot: true
  },
  imtp_peak_force: {
    id: 'imtp_peak_force',
    name: 'imtp_peak_force',
    displayName: 'IMTP Peak Force',
    category: 'power',
    unit: 'N',
    valueDirection: 'higher_better',
    description: 'Isometric Mid-Thigh Pull peak force',
    equipment: ['Force Platform', 'IMTP Rig'],
    attemptBased: true,
    timeBasedPlot: true
  },
  broad_jump: {
    id: 'broad_jump',
    name: 'broad_jump',
    displayName: 'Broad Jump',
    category: 'power',
    unit: 'cm',
    valueDirection: 'higher_better',
    description: 'Standing horizontal jump distance',
    equipment: ['Measuring Tape', 'Mat'],
    attemptBased: true,
    timeBasedPlot: true
  },
  standing_long_jump_cm: {
    id: 'standing_long_jump_cm',
    name: 'standing_long_jump_cm',
    displayName: 'Standing Long Jump',
    category: 'power',
    unit: 'cm',
    valueDirection: 'higher_better',
    description: 'Maximum distance in standing long jump',
    equipment: ['Measuring Tape', 'Sand Pit/Mat'],
    attemptBased: true,
    timeBasedPlot: true
  },
  standing_triple_jump: {
    id: 'standing_triple_jump',
    name: 'standing_triple_jump',
    displayName: 'Standing Triple Jump',
    category: 'power',
    unit: 'cm',
    valueDirection: 'higher_better',
    description: 'Three consecutive jumps from standing',
    equipment: ['Measuring Tape'],
    attemptBased: true,
    timeBasedPlot: true
  },
  single_leg_jump: {
    id: 'single_leg_jump',
    name: 'single_leg_jump',
    displayName: 'Single Leg Jump',
    category: 'power',
    unit: 'cm',
    valueDirection: 'higher_better',
    description: 'Single leg vertical jump height',
    equipment: ['Force Platform', 'Jump Mat'],
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },

  // ========== BIOMECHANICS TESTS ==========
  stride_length: {
    id: 'stride_length',
    name: 'stride_length',
    displayName: 'Stride Length',
    category: 'biomechanics',
    unit: 'cm',
    valueDirection: 'optimal_range',
    description: 'Average stride length at max velocity',
    equipment: ['Video Analysis', 'Optojump'],
    timeBasedPlot: true
  },
  stride_frequency: {
    id: 'stride_frequency',
    name: 'stride_frequency',
    displayName: 'Stride Frequency',
    category: 'biomechanics',
    unit: 'Hz',
    valueDirection: 'optimal_range',
    description: 'Steps per second at max velocity',
    equipment: ['Video Analysis', 'Optojump'],
    timeBasedPlot: true
  },
  ground_contact_time: {
    id: 'ground_contact_time',
    name: 'ground_contact_time',
    displayName: 'Ground Contact Time',
    category: 'biomechanics',
    unit: 'ms',
    valueDirection: 'lower_better',
    description: 'Time foot is in contact with ground during sprint',
    equipment: ['Force Platform', 'Optojump'],
    timeBasedPlot: true
  },
  sprint_kinematics: {
    id: 'sprint_kinematics',
    name: 'sprint_kinematics',
    displayName: 'Sprint Kinematics Score',
    category: 'biomechanics',
    unit: 'score',
    valueDirection: 'higher_better',
    optimalRange: { min: 8, max: 10 },
    description: 'Overall sprint technique score from video analysis',
    equipment: ['Video Analysis Software'],
    timeBasedPlot: true
  },
  horizontal_force: {
    id: 'horizontal_force',
    name: 'horizontal_force',
    displayName: 'Horizontal Force',
    category: 'biomechanics',
    unit: 'N/kg',
    valueDirection: 'higher_better',
    description: 'Horizontal ground reaction force normalized to bodyweight',
    equipment: ['Force Platform', 'Radar'],
    timeBasedPlot: true
  },
  vertical_stiffness: {
    id: 'vertical_stiffness',
    name: 'vertical_stiffness',
    displayName: 'Vertical Stiffness',
    category: 'biomechanics',
    unit: 'kN/m',
    valueDirection: 'optimal_range',
    description: 'Leg stiffness during ground contact',
    equipment: ['Force Platform'],
    timeBasedPlot: true
  },

  // ========== INJURY PREVENTION TESTS ==========
  nordic_hamstring: {
    id: 'nordic_hamstring',
    name: 'nordic_hamstring',
    displayName: 'Nordic Hamstring',
    category: 'injury_prevention',
    unit: 'N',
    valueDirection: 'higher_better',
    description: 'Peak eccentric hamstring force',
    equipment: ['Nordic Board', 'Force Sensor'],
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },
  ham_quad_ratio: {
    id: 'ham_quad_ratio',
    name: 'ham_quad_ratio',
    displayName: 'H:Q Ratio',
    category: 'injury_prevention',
    unit: 'ratio',
    valueDirection: 'optimal_range',
    optimalRange: { min: 0.6, max: 0.8 },
    description: 'Hamstring to quadriceps strength ratio',
    equipment: ['Isokinetic Dynamometer'],
    hasLeftRight: true,
    timeBasedPlot: true
  },
  hamstring_strength_test: {
    id: 'hamstring_strength_test',
    name: 'hamstring_strength_test',
    displayName: 'Hamstring Strength',
    category: 'injury_prevention',
    unit: 'N',
    valueDirection: 'higher_better',
    description: 'Isometric hamstring strength test',
    equipment: ['Force Gauge', 'Testing Rig'],
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },
  iso_hamstring_bridge: {
    id: 'iso_hamstring_bridge',
    name: 'iso_hamstring_bridge',
    displayName: 'Iso Hamstring Bridge',
    category: 'injury_prevention',
    unit: 'N',
    valueDirection: 'higher_better',
    description: 'Single leg hamstring bridge isometric force',
    equipment: ['Force Platform'],
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },
  hip_flexor_iso: {
    id: 'hip_flexor_iso',
    name: 'hip_flexor_iso',
    displayName: 'Hip Flexor Isometric',
    category: 'injury_prevention',
    unit: 'N',
    valueDirection: 'higher_better',
    description: 'Isometric hip flexor strength',
    equipment: ['Force Gauge'],
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },
  adductor_squeeze: {
    id: 'adductor_squeeze',
    name: 'adductor_squeeze',
    displayName: 'Adductor Squeeze',
    category: 'injury_prevention',
    unit: 'N',
    valueDirection: 'higher_better',
    description: 'Adductor squeeze test at 45 degrees',
    equipment: ['Sphygmomanometer', 'Force Gauge'],
    attemptBased: true,
    timeBasedPlot: true
  },
  hip_mobility_score: {
    id: 'hip_mobility_score',
    name: 'hip_mobility_score',
    displayName: 'Hip Mobility Score',
    category: 'injury_prevention',
    unit: 'score',
    valueDirection: 'higher_better',
    optimalRange: { min: 8, max: 10 },
    description: 'Composite hip mobility assessment',
    equipment: ['Goniometer'],
    hasLeftRight: true,
    timeBasedPlot: true
  },
  ankle_stiffness: {
    id: 'ankle_stiffness',
    name: 'ankle_stiffness',
    displayName: 'Ankle Stiffness',
    category: 'injury_prevention',
    unit: 'kN/m',
    valueDirection: 'optimal_range',
    description: 'Ankle joint stiffness measurement',
    equipment: ['Force Platform'],
    hasLeftRight: true,
    timeBasedPlot: true
  },
  ankle_dorsiflexion: {
    id: 'ankle_dorsiflexion',
    name: 'ankle_dorsiflexion',
    displayName: 'Ankle Dorsiflexion',
    category: 'injury_prevention',
    unit: 'cm',
    valueDirection: 'higher_better',
    description: 'Weight-bearing ankle dorsiflexion (knee to wall)',
    equipment: ['Measuring Tape', 'Wall'],
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },
  lumbar_stiffness: {
    id: 'lumbar_stiffness',
    name: 'lumbar_stiffness',
    displayName: 'Lumbar Stiffness',
    category: 'injury_prevention',
    unit: 'score',
    valueDirection: 'optimal_range',
    optimalRange: { min: 5, max: 7 },
    description: 'Lumbar spine stiffness assessment',
    timeBasedPlot: true
  },
  y_balance_score: {
    id: 'y_balance_score',
    name: 'y_balance_score',
    displayName: 'Y-Balance Score',
    category: 'injury_prevention',
    unit: '%',
    valueDirection: 'higher_better',
    description: 'Y-Balance test composite score',
    equipment: ['Y-Balance Kit'],
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },

  // ========== CORE TESTS ==========
  plank_hold: {
    id: 'plank_hold',
    name: 'plank_hold',
    displayName: 'Plank Hold',
    category: 'core',
    unit: 'sec',
    valueDirection: 'higher_better',
    description: 'Maximum front plank hold time with good form',
    attemptBased: true,
    timeBasedPlot: true
  },
  side_plank_left: {
    id: 'side_plank_left',
    name: 'side_plank_left',
    displayName: 'Side Plank (Left)',
    category: 'core',
    unit: 'sec',
    valueDirection: 'higher_better',
    description: 'Maximum side plank hold - left side',
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },
  side_plank_right: {
    id: 'side_plank_right',
    name: 'side_plank_right',
    displayName: 'Side Plank (Right)',
    category: 'core',
    unit: 'sec',
    valueDirection: 'higher_better',
    description: 'Maximum side plank hold - right side',
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },
  copenhagen_plank_left: {
    id: 'copenhagen_plank_left',
    name: 'copenhagen_plank_left',
    displayName: 'Copenhagen Plank (Left)',
    category: 'core',
    unit: 'sec',
    valueDirection: 'higher_better',
    description: 'Copenhagen plank hold - left leg on top',
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },
  copenhagen_plank_right: {
    id: 'copenhagen_plank_right',
    name: 'copenhagen_plank_right',
    displayName: 'Copenhagen Plank (Right)',
    category: 'core',
    unit: 'sec',
    valueDirection: 'higher_better',
    description: 'Copenhagen plank hold - right leg on top',
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },
  hollow_hold: {
    id: 'hollow_hold',
    name: 'hollow_hold',
    displayName: 'Hollow Hold',
    category: 'core',
    unit: 'sec',
    valueDirection: 'higher_better',
    description: 'Maximum hollow body hold time',
    attemptBased: true,
    timeBasedPlot: true
  },
  v_sit_hold: {
    id: 'v_sit_hold',
    name: 'v_sit_hold',
    displayName: 'V-Sit Hold',
    category: 'core',
    unit: 'sec',
    valueDirection: 'higher_better',
    description: 'Maximum V-sit position hold time',
    attemptBased: true,
    timeBasedPlot: true
  },
  situps_per_min: {
    id: 'situps_per_min',
    name: 'situps_per_min',
    displayName: 'Sit-ups per Minute',
    category: 'core',
    unit: 'reps',
    valueDirection: 'higher_better',
    description: 'Maximum sit-ups in 60 seconds',
    attemptBased: true,
    timeBasedPlot: true
  },
  sorensen_hold: {
    id: 'sorensen_hold',
    name: 'sorensen_hold',
    displayName: 'Sorensen Hold',
    category: 'core',
    unit: 'sec',
    valueDirection: 'higher_better',
    description: 'Back extension hold time (Biering-Sorensen test)',
    attemptBased: true,
    timeBasedPlot: true
  },
  pallof_press_left: {
    id: 'pallof_press_left',
    name: 'pallof_press_left',
    displayName: 'Pallof Press (Left)',
    category: 'core',
    unit: 'kg',
    valueDirection: 'higher_better',
    description: 'Maximum resistance for Pallof press - facing left',
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },
  pallof_press_right: {
    id: 'pallof_press_right',
    name: 'pallof_press_right',
    displayName: 'Pallof Press (Right)',
    category: 'core',
    unit: 'kg',
    valueDirection: 'higher_better',
    description: 'Maximum resistance for Pallof press - facing right',
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },
  single_leg_bridge_left: {
    id: 'single_leg_bridge_left',
    name: 'single_leg_bridge_left',
    displayName: 'Single Leg Bridge (Left)',
    category: 'core',
    unit: 'reps',
    valueDirection: 'higher_better',
    description: 'Single leg glute bridge reps - left leg',
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },
  single_leg_bridge_right: {
    id: 'single_leg_bridge_right',
    name: 'single_leg_bridge_right',
    displayName: 'Single Leg Bridge (Right)',
    category: 'core',
    unit: 'reps',
    valueDirection: 'higher_better',
    description: 'Single leg glute bridge reps - right leg',
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },
  rollout_reps: {
    id: 'rollout_reps',
    name: 'rollout_reps',
    displayName: 'Ab Rollout Reps',
    category: 'core',
    unit: 'reps',
    valueDirection: 'higher_better',
    description: 'Maximum ab wheel rollout repetitions',
    attemptBased: true,
    timeBasedPlot: true
  },
  suitcase_carry: {
    id: 'suitcase_carry',
    name: 'suitcase_carry',
    displayName: 'Suitcase Carry',
    category: 'core',
    unit: 'kg',
    valueDirection: 'higher_better',
    description: 'Maximum weight for 20m suitcase carry each side',
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },
  rotational_throw: {
    id: 'rotational_throw',
    name: 'rotational_throw',
    displayName: 'Rotational Med Ball Throw',
    category: 'core',
    unit: 'm',
    valueDirection: 'higher_better',
    description: 'Distance of rotational medicine ball throw',
    equipment: ['Medicine Ball', 'Measuring Tape'],
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },

  // ========== PHYSIOLOGICAL TESTS ==========
  vo2_max: {
    id: 'vo2_max',
    name: 'vo2_max',
    displayName: 'VO2 Max',
    category: 'physiological',
    unit: 'ml/kg/min',
    valueDirection: 'higher_better',
    description: 'Maximum oxygen consumption',
    equipment: ['Metabolic Cart', 'Treadmill'],
    timeBasedPlot: true
  },
  lactate_lt1: {
    id: 'lactate_lt1',
    name: 'lactate_lt1',
    displayName: 'Lactate Threshold 1',
    category: 'physiological',
    unit: 'km/h',
    valueDirection: 'higher_better',
    description: 'Speed at first lactate threshold (~2mmol/L)',
    equipment: ['Lactate Analyzer', 'Treadmill'],
    timeBasedPlot: true
  },
  lactate_lt2: {
    id: 'lactate_lt2',
    name: 'lactate_lt2',
    displayName: 'Lactate Threshold 2',
    category: 'physiological',
    unit: 'km/h',
    valueDirection: 'higher_better',
    description: 'Speed at second lactate threshold (~4mmol/L)',
    equipment: ['Lactate Analyzer', 'Treadmill'],
    timeBasedPlot: true
  },
  ventilatory_vt1: {
    id: 'ventilatory_vt1',
    name: 'ventilatory_vt1',
    displayName: 'Ventilatory Threshold 1',
    category: 'physiological',
    unit: 'km/h',
    valueDirection: 'higher_better',
    description: 'Speed at first ventilatory threshold',
    equipment: ['Metabolic Cart', 'Treadmill'],
    timeBasedPlot: true
  },
  ventilatory_vt2: {
    id: 'ventilatory_vt2',
    name: 'ventilatory_vt2',
    displayName: 'Ventilatory Threshold 2',
    category: 'physiological',
    unit: 'km/h',
    valueDirection: 'higher_better',
    description: 'Speed at second ventilatory threshold',
    equipment: ['Metabolic Cart', 'Treadmill'],
    timeBasedPlot: true
  },
  tte_vvo2max: {
    id: 'tte_vvo2max',
    name: 'tte_vvo2max',
    displayName: 'TTE at vVO2max',
    category: 'physiological',
    unit: 'sec',
    valueDirection: 'higher_better',
    description: 'Time to exhaustion at velocity of VO2max',
    equipment: ['Treadmill', 'Timer'],
    timeBasedPlot: true
  },
  mas_speed: {
    id: 'mas_speed',
    name: 'mas_speed',
    displayName: 'MAS (Maximal Aerobic Speed)',
    category: 'physiological',
    unit: 'km/h',
    valueDirection: 'higher_better',
    description: 'Maximal aerobic speed from field test',
    equipment: ['Track', 'Timer'],
    timeBasedPlot: true
  },
  critical_speed: {
    id: 'critical_speed',
    name: 'critical_speed',
    displayName: 'Critical Speed',
    category: 'physiological',
    unit: 'm/s',
    valueDirection: 'higher_better',
    description: 'Speed sustainable for extended duration',
    equipment: ['Track', 'Timer'],
    timeBasedPlot: true
  },
  running_economy: {
    id: 'running_economy',
    name: 'running_economy',
    displayName: 'Running Economy',
    category: 'physiological',
    unit: 'ml/kg/km',
    valueDirection: 'lower_better',
    description: 'Oxygen cost per kilometer at submaximal pace',
    equipment: ['Metabolic Cart', 'Treadmill'],
    timeBasedPlot: true
  },
  fatmax: {
    id: 'fatmax',
    name: 'fatmax',
    displayName: 'FatMax Intensity',
    category: 'physiological',
    unit: 'km/h',
    valueDirection: 'higher_better',
    description: 'Intensity at maximal fat oxidation',
    equipment: ['Metabolic Cart', 'Treadmill'],
    timeBasedPlot: true
  },
  hr_zones: {
    id: 'hr_zones',
    name: 'hr_zones',
    displayName: 'HR Zone Distribution',
    category: 'physiological',
    unit: 'bpm',
    valueDirection: 'optimal_range',
    description: 'Heart rate training zones from testing',
    equipment: ['HR Monitor', 'Metabolic Cart'],
    timeBasedPlot: true
  },

  // ========== PERFORMANCE TESTS ==========
  lactate_threshold_pace: {
    id: 'lactate_threshold_pace',
    name: 'lactate_threshold_pace',
    displayName: 'Lactate Threshold Pace',
    category: 'performance',
    unit: 'min/km',
    valueDirection: 'lower_better',
    description: 'Pace at lactate threshold',
    timeBasedPlot: true
  },
  rsa_score: {
    id: 'rsa_score',
    name: 'rsa_score',
    displayName: 'Repeated Sprint Ability',
    category: 'performance',
    unit: '%',
    valueDirection: 'higher_better',
    description: 'Fatigue index from repeated sprint test',
    timeBasedPlot: true
  },
  sprint_finish_test: {
    id: 'sprint_finish_test',
    name: 'sprint_finish_test',
    displayName: 'Sprint Finish Test',
    category: 'performance',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Kick/finish ability from tired state',
    timeBasedPlot: true
  },
  tempo_test_pace: {
    id: 'tempo_test_pace',
    name: 'tempo_test_pace',
    displayName: 'Tempo Test Pace',
    category: 'performance',
    unit: 'min/km',
    valueDirection: 'lower_better',
    description: 'Sustainable tempo pace from testing',
    timeBasedPlot: true
  },
  lactate_curve_data: {
    id: 'lactate_curve_data',
    name: 'lactate_curve_data',
    displayName: 'Lactate Curve',
    category: 'performance',
    unit: 'mmol/L',
    valueDirection: 'optimal_range',
    description: 'Full lactate curve from incremental test',
    timeBasedPlot: true
  },
  long_run_hr_zones: {
    id: 'long_run_hr_zones',
    name: 'long_run_hr_zones',
    displayName: 'Long Run HR Zones',
    category: 'performance',
    unit: 'bpm',
    valueDirection: 'optimal_range',
    description: 'Heart rate zones for long runs',
    timeBasedPlot: true
  },
  aerobic_threshold_pace: {
    id: 'aerobic_threshold_pace',
    name: 'aerobic_threshold_pace',
    displayName: 'Aerobic Threshold Pace',
    category: 'performance',
    unit: 'min/km',
    valueDirection: 'lower_better',
    description: 'Pace at aerobic threshold',
    timeBasedPlot: true
  },

  // ========== FATIGUE TESTS ==========
  cardiac_drift: {
    id: 'cardiac_drift',
    name: 'cardiac_drift',
    displayName: 'Cardiac Drift',
    category: 'fatigue',
    unit: '%',
    valueDirection: 'lower_better',
    description: 'Heart rate increase at constant pace',
    timeBasedPlot: true
  },
  impact_loading: {
    id: 'impact_loading',
    name: 'impact_loading',
    displayName: 'Impact Loading Rate',
    category: 'fatigue',
    unit: 'BW/s',
    valueDirection: 'lower_better',
    description: 'Rate of force loading on landing',
    equipment: ['Force Platform'],
    timeBasedPlot: true
  },
  foot_strike_pressure: {
    id: 'foot_strike_pressure',
    name: 'foot_strike_pressure',
    displayName: 'Foot Strike Pressure',
    category: 'fatigue',
    unit: 'kPa',
    valueDirection: 'optimal_range',
    description: 'Peak plantar pressure during running',
    equipment: ['Pressure Insoles'],
    timeBasedPlot: true
  },

  // ========== ENDURANCE TESTS ==========
  sprint_half_marathon: {
    id: 'sprint_half_marathon',
    name: 'sprint_half_marathon',
    displayName: 'Half Marathon Time',
    category: 'endurance',
    unit: 'min',
    valueDirection: 'lower_better',
    description: 'Half marathon completion time',
    timeBasedPlot: true
  },
  sprint_marathon: {
    id: 'sprint_marathon',
    name: 'sprint_marathon',
    displayName: 'Marathon Time',
    category: 'endurance',
    unit: 'min',
    valueDirection: 'lower_better',
    description: 'Marathon completion time',
    timeBasedPlot: true
  },
  hm_pace_test: {
    id: 'hm_pace_test',
    name: 'hm_pace_test',
    displayName: 'HM Pace Test',
    category: 'endurance',
    unit: 'min/km',
    valueDirection: 'lower_better',
    description: 'Half marathon goal pace test',
    timeBasedPlot: true
  },
  marathon_pace_test: {
    id: 'marathon_pace_test',
    name: 'marathon_pace_test',
    displayName: 'Marathon Pace Test',
    category: 'endurance',
    unit: 'min/km',
    valueDirection: 'lower_better',
    description: 'Marathon goal pace test',
    timeBasedPlot: true
  },
  hm_running_economy: {
    id: 'hm_running_economy',
    name: 'hm_running_economy',
    displayName: 'HM Running Economy',
    category: 'endurance',
    unit: 'ml/kg/km',
    valueDirection: 'lower_better',
    description: 'Running economy at half marathon pace',
    timeBasedPlot: true
  },
  hr_drift_test: {
    id: 'hr_drift_test',
    name: 'hr_drift_test',
    displayName: 'HR Drift Test',
    category: 'endurance',
    unit: '%',
    valueDirection: 'lower_better',
    description: 'Heart rate drift during steady state',
    timeBasedPlot: true
  },
  glycogen_depletion_rate: {
    id: 'glycogen_depletion_rate',
    name: 'glycogen_depletion_rate',
    displayName: 'Glycogen Depletion Rate',
    category: 'endurance',
    unit: 'g/hr',
    valueDirection: 'lower_better',
    description: 'Rate of glycogen use during exercise',
    timeBasedPlot: true
  },
  aerobic_capacity: {
    id: 'aerobic_capacity',
    name: 'aerobic_capacity',
    displayName: 'Aerobic Capacity',
    category: 'endurance',
    unit: 'ml/kg/min',
    valueDirection: 'higher_better',
    description: 'Overall aerobic capacity measure',
    timeBasedPlot: true
  },
  long_run_efficiency: {
    id: 'long_run_efficiency',
    name: 'long_run_efficiency',
    displayName: 'Long Run Efficiency',
    category: 'endurance',
    unit: '%',
    valueDirection: 'higher_better',
    description: 'Pace maintenance during long runs',
    timeBasedPlot: true
  },
  running_economy_fatigued: {
    id: 'running_economy_fatigued',
    name: 'running_economy_fatigued',
    displayName: 'Running Economy (Fatigued)',
    category: 'economy',
    unit: 'ml/kg/km',
    valueDirection: 'lower_better',
    description: 'Running economy in fatigued state',
    timeBasedPlot: true
  },

  // ========== FUELING TESTS ==========
  fueling_efficiency_score: {
    id: 'fueling_efficiency_score',
    name: 'fueling_efficiency_score',
    displayName: 'Fueling Efficiency',
    category: 'fueling',
    unit: 'score',
    valueDirection: 'higher_better',
    description: 'Ability to absorb carbs during exercise',
    timeBasedPlot: true
  },
  cho_utilization: {
    id: 'cho_utilization',
    name: 'cho_utilization',
    displayName: 'CHO Utilization',
    category: 'fueling',
    unit: 'g/hr',
    valueDirection: 'optimal_range',
    description: 'Carbohydrate oxidation rate',
    timeBasedPlot: true
  },
  fat_oxidation_rate: {
    id: 'fat_oxidation_rate',
    name: 'fat_oxidation_rate',
    displayName: 'Fat Oxidation Rate',
    category: 'fueling',
    unit: 'g/hr',
    valueDirection: 'higher_better',
    description: 'Maximum fat oxidation rate',
    timeBasedPlot: true
  },
  gi_tolerance_score: {
    id: 'gi_tolerance_score',
    name: 'gi_tolerance_score',
    displayName: 'GI Tolerance Score',
    category: 'fueling',
    unit: 'score',
    valueDirection: 'higher_better',
    description: 'Gastrointestinal tolerance during exercise',
    timeBasedPlot: true
  },
  cmj_fatigue_loss: {
    id: 'cmj_fatigue_loss',
    name: 'cmj_fatigue_loss',
    displayName: 'CMJ Fatigue Loss',
    category: 'fueling',
    unit: '%',
    valueDirection: 'lower_better',
    description: 'CMJ height loss post long run',
    timeBasedPlot: true
  },
  pacing_decay: {
    id: 'pacing_decay',
    name: 'pacing_decay',
    displayName: 'Pacing Decay',
    category: 'fueling',
    unit: '%',
    valueDirection: 'lower_better',
    description: 'Pace drop-off in late race stages',
    timeBasedPlot: true
  },
  sweat_rate: {
    id: 'sweat_rate',
    name: 'sweat_rate',
    displayName: 'Sweat Rate',
    category: 'fueling',
    unit: 'L/hr',
    valueDirection: 'optimal_range',
    description: 'Sweat loss rate during exercise',
    timeBasedPlot: true
  },
  sodium_loss: {
    id: 'sodium_loss',
    name: 'sodium_loss',
    displayName: 'Sodium Loss',
    category: 'fueling',
    unit: 'mg/L',
    valueDirection: 'optimal_range',
    description: 'Sodium concentration in sweat',
    timeBasedPlot: true
  },
  carb_absorption: {
    id: 'carb_absorption',
    name: 'carb_absorption',
    displayName: 'Carb Absorption Rate',
    category: 'fueling',
    unit: 'g/hr',
    valueDirection: 'higher_better',
    description: 'Maximum carbohydrate absorption rate',
    timeBasedPlot: true
  },

  // ========== HURDLES SPECIFIC TESTS ==========
  hurdle_mobility_score: {
    id: 'hurdle_mobility_score',
    name: 'hurdle_mobility_score',
    displayName: 'Hurdle Mobility Score',
    category: 'hurdles_specific',
    unit: 'score',
    valueDirection: 'higher_better',
    optimalRange: { min: 8, max: 10 },
    description: 'Hip and leg mobility for hurdle clearance',
    timeBasedPlot: true
  },
  hurdle_clearance_time: {
    id: 'hurdle_clearance_time',
    name: 'hurdle_clearance_time',
    displayName: 'Hurdle Clearance Time',
    category: 'hurdles_specific',
    unit: 'sec',
    valueDirection: 'lower_better',
    description: 'Time over the hurdle',
    equipment: ['Video Analysis', 'Timing Gates'],
    attemptBased: true,
    timeBasedPlot: true
  },
  hurdle_step_pattern: {
    id: 'hurdle_step_pattern',
    name: 'hurdle_step_pattern',
    displayName: 'Hurdle Step Pattern',
    category: 'hurdles_specific',
    unit: 'steps',
    valueDirection: 'optimal_range',
    description: 'Steps between hurdles consistency',
    timeBasedPlot: true
  },
  hurdle_rhythm_score: {
    id: 'hurdle_rhythm_score',
    name: 'hurdle_rhythm_score',
    displayName: 'Hurdle Rhythm Score',
    category: 'hurdles_specific',
    unit: 'score',
    valueDirection: 'higher_better',
    optimalRange: { min: 8, max: 10 },
    description: 'Rhythm consistency between hurdles',
    timeBasedPlot: true
  },
  hurdle_approach_speed: {
    id: 'hurdle_approach_speed',
    name: 'hurdle_approach_speed',
    displayName: 'Hurdle Approach Speed',
    category: 'hurdles_specific',
    unit: 'm/s',
    valueDirection: 'higher_better',
    description: 'Speed on approach to first hurdle',
    equipment: ['Timing Gates'],
    attemptBased: true,
    timeBasedPlot: true
  },
  hurdle_technique_score: {
    id: 'hurdle_technique_score',
    name: 'hurdle_technique_score',
    displayName: 'Hurdle Technique Score',
    category: 'hurdles_specific',
    unit: 'score',
    valueDirection: 'higher_better',
    optimalRange: { min: 8, max: 10 },
    description: 'Overall hurdle technique assessment',
    equipment: ['Video Analysis'],
    timeBasedPlot: true
  },
  inter_hurdle_cv: {
    id: 'inter_hurdle_cv',
    name: 'inter_hurdle_cv',
    displayName: 'Inter-Hurdle CV',
    category: 'hurdles_specific',
    unit: '%',
    valueDirection: 'lower_better',
    description: 'Coefficient of variation between hurdles',
    timeBasedPlot: true
  },
  landing_distance: {
    id: 'landing_distance',
    name: 'landing_distance',
    displayName: 'Landing Distance',
    category: 'hurdles_specific',
    unit: 'cm',
    valueDirection: 'optimal_range',
    description: 'Distance from hurdle on landing',
    equipment: ['Video Analysis', 'Measuring Tape'],
    timeBasedPlot: true
  },

  // ========== JUMPS - APPROACH TESTS ==========
  approach_10m_speed: {
    id: 'approach_10m_speed',
    name: 'approach_10m_speed',
    displayName: 'Approach Speed (10m out)',
    category: 'approach',
    unit: 'm/s',
    valueDirection: 'higher_better',
    description: 'Velocity at 10m from takeoff board',
    equipment: ['Timing Gates'],
    attemptBased: true,
    timeBasedPlot: true
  },
  approach_20m_speed: {
    id: 'approach_20m_speed',
    name: 'approach_20m_speed',
    displayName: 'Approach Speed (20m out)',
    category: 'approach',
    unit: 'm/s',
    valueDirection: 'higher_better',
    description: 'Velocity at 20m from takeoff board',
    equipment: ['Timing Gates'],
    attemptBased: true,
    timeBasedPlot: true
  },
  last_3_step_velocity: {
    id: 'last_3_step_velocity',
    name: 'last_3_step_velocity',
    displayName: 'Last 3 Steps Velocity',
    category: 'approach',
    unit: 'm/s',
    valueDirection: 'optimal_range',
    description: 'Velocity in final 3 steps before takeoff',
    equipment: ['Video Analysis', 'Timing Gates'],
    timeBasedPlot: true
  },
  step_consistency: {
    id: 'step_consistency',
    name: 'step_consistency',
    displayName: 'Step Consistency',
    category: 'approach',
    unit: '%',
    valueDirection: 'higher_better',
    description: 'Consistency of approach steps',
    equipment: ['Video Analysis'],
    timeBasedPlot: true
  },
  jump_approach_speed: {
    id: 'jump_approach_speed',
    name: 'jump_approach_speed',
    displayName: 'Jump Approach Speed',
    category: 'approach',
    unit: 'm/s',
    valueDirection: 'higher_better',
    description: 'Peak approach speed for jumps',
    equipment: ['Timing Gates', 'Radar'],
    attemptBased: true,
    timeBasedPlot: true
  },
  hj_curve_timing: {
    id: 'hj_curve_timing',
    name: 'hj_curve_timing',
    displayName: 'HJ Curve Timing',
    category: 'approach',
    unit: 'sec',
    valueDirection: 'optimal_range',
    description: 'Timing through high jump curve approach',
    equipment: ['Video Analysis'],
    timeBasedPlot: true
  },

  // ========== JUMPS - TECHNIQUE TESTS ==========
  penultimate_step: {
    id: 'penultimate_step',
    name: 'penultimate_step',
    displayName: 'Penultimate Step Length',
    category: 'technique',
    unit: 'cm',
    valueDirection: 'optimal_range',
    description: 'Length of second to last step',
    equipment: ['Video Analysis'],
    timeBasedPlot: true
  },
  takeoff_angle: {
    id: 'takeoff_angle',
    name: 'takeoff_angle',
    displayName: 'Takeoff Angle',
    category: 'technique',
    unit: 'degrees',
    valueDirection: 'optimal_range',
    description: 'Angle of projection at takeoff',
    equipment: ['Video Analysis'],
    timeBasedPlot: true
  },
  takeoff_force: {
    id: 'takeoff_force',
    name: 'takeoff_force',
    displayName: 'Takeoff Force',
    category: 'technique',
    unit: 'N/kg',
    valueDirection: 'higher_better',
    description: 'Ground reaction force at takeoff',
    equipment: ['Force Platform'],
    attemptBased: true,
    timeBasedPlot: true
  },
  landing_mechanics: {
    id: 'landing_mechanics',
    name: 'landing_mechanics',
    displayName: 'Landing Mechanics Score',
    category: 'technique',
    unit: 'score',
    valueDirection: 'higher_better',
    optimalRange: { min: 8, max: 10 },
    description: 'Quality of landing technique',
    equipment: ['Video Analysis'],
    timeBasedPlot: true
  },
  jump_joint_angles: {
    id: 'jump_joint_angles',
    name: 'jump_joint_angles',
    displayName: 'Jump Joint Angles',
    category: 'technique',
    unit: 'degrees',
    valueDirection: 'optimal_range',
    description: 'Key joint angles during jump phases',
    equipment: ['Video Analysis', 'Motion Capture'],
    timeBasedPlot: true
  },
  board_accuracy: {
    id: 'board_accuracy',
    name: 'board_accuracy',
    displayName: 'Board Accuracy',
    category: 'technique',
    unit: 'cm',
    valueDirection: 'lower_better',
    description: 'Distance from foul line on takeoff',
    equipment: ['Measuring Tape'],
    attemptBased: true,
    timeBasedPlot: true
  },
  pv_plant_accuracy: {
    id: 'pv_plant_accuracy',
    name: 'pv_plant_accuracy',
    displayName: 'PV Plant Accuracy',
    category: 'technique',
    unit: 'cm',
    valueDirection: 'lower_better',
    description: 'Pole plant accuracy in vault',
    equipment: ['Video Analysis'],
    timeBasedPlot: true
  },
  pole_bend_timing: {
    id: 'pole_bend_timing',
    name: 'pole_bend_timing',
    displayName: 'Pole Bend Timing',
    category: 'technique',
    unit: 'score',
    valueDirection: 'higher_better',
    description: 'Timing of pole bend in vault',
    equipment: ['Video Analysis'],
    timeBasedPlot: true
  },

  // ========== JUMPS - PERFORMANCE TESTS ==========
  long_jump_distance: {
    id: 'long_jump_distance',
    name: 'long_jump_distance',
    displayName: 'Long Jump Distance',
    category: 'performance',
    unit: 'cm',
    valueDirection: 'higher_better',
    description: 'Best legal long jump distance',
    equipment: ['Measuring Tape', 'Sand Pit'],
    attemptBased: true,
    timeBasedPlot: true
  },
  triple_jump_distance: {
    id: 'triple_jump_distance',
    name: 'triple_jump_distance',
    displayName: 'Triple Jump Distance',
    category: 'performance',
    unit: 'cm',
    valueDirection: 'higher_better',
    description: 'Best legal triple jump distance',
    equipment: ['Measuring Tape', 'Sand Pit'],
    attemptBased: true,
    timeBasedPlot: true
  },
  high_jump_height: {
    id: 'high_jump_height',
    name: 'high_jump_height',
    displayName: 'High Jump Height',
    category: 'performance',
    unit: 'cm',
    valueDirection: 'higher_better',
    description: 'Best high jump clearance',
    equipment: ['High Jump Standards', 'Bar'],
    attemptBased: true,
    timeBasedPlot: true
  },
  pole_vault_height: {
    id: 'pole_vault_height',
    name: 'pole_vault_height',
    displayName: 'Pole Vault Height',
    category: 'performance',
    unit: 'cm',
    valueDirection: 'higher_better',
    description: 'Best pole vault clearance',
    equipment: ['Pole Vault Standards', 'Poles'],
    attemptBased: true,
    timeBasedPlot: true
  },

  // ========== THROWS - PERFORMANCE TESTS ==========
  shot_put_distance: {
    id: 'shot_put_distance',
    name: 'shot_put_distance',
    displayName: 'Shot Put Distance',
    category: 'performance',
    unit: 'm',
    valueDirection: 'higher_better',
    description: 'Best legal shot put distance',
    equipment: ['Shot', 'Measuring Tape'],
    attemptBased: true,
    timeBasedPlot: true
  },
  discus_distance: {
    id: 'discus_distance',
    name: 'discus_distance',
    displayName: 'Discus Distance',
    category: 'performance',
    unit: 'm',
    valueDirection: 'higher_better',
    description: 'Best legal discus throw distance',
    equipment: ['Discus', 'Measuring Tape'],
    attemptBased: true,
    timeBasedPlot: true
  },
  javelin_distance: {
    id: 'javelin_distance',
    name: 'javelin_distance',
    displayName: 'Javelin Distance',
    category: 'performance',
    unit: 'm',
    valueDirection: 'higher_better',
    description: 'Best legal javelin throw distance',
    equipment: ['Javelin', 'Measuring Tape'],
    attemptBased: true,
    timeBasedPlot: true
  },
  hammer_distance: {
    id: 'hammer_distance',
    name: 'hammer_distance',
    displayName: 'Hammer Distance',
    category: 'performance',
    unit: 'm',
    valueDirection: 'higher_better',
    description: 'Best legal hammer throw distance',
    equipment: ['Hammer', 'Measuring Tape'],
    attemptBased: true,
    timeBasedPlot: true
  },

  // ========== THROWS - POWER TESTS ==========
  medicine_ball_throw: {
    id: 'medicine_ball_throw',
    name: 'medicine_ball_throw',
    displayName: 'Medicine Ball Throw',
    category: 'power',
    unit: 'm',
    valueDirection: 'higher_better',
    description: 'Overhead medicine ball throw distance',
    equipment: ['Medicine Ball', 'Measuring Tape'],
    attemptBased: true,
    timeBasedPlot: true
  },
  upper_body_power_score: {
    id: 'upper_body_power_score',
    name: 'upper_body_power_score',
    displayName: 'Upper Body Power',
    category: 'power',
    unit: 'watts',
    valueDirection: 'higher_better',
    description: 'Upper body power output',
    equipment: ['Ballistic Device'],
    attemptBased: true,
    timeBasedPlot: true
  },
  rotational_power_score: {
    id: 'rotational_power_score',
    name: 'rotational_power_score',
    displayName: 'Rotational Power',
    category: 'power',
    unit: 'watts',
    valueDirection: 'higher_better',
    description: 'Rotational power output',
    equipment: ['Medicine Ball', 'Force Platform'],
    attemptBased: true,
    timeBasedPlot: true
  },
  rfd_throw: {
    id: 'rfd_throw',
    name: 'rfd_throw',
    displayName: 'Rate of Force Development',
    category: 'power',
    unit: 'N/s',
    valueDirection: 'higher_better',
    description: 'Rate of force development in throw motion',
    equipment: ['Force Platform'],
    attemptBased: true,
    timeBasedPlot: true
  },
  iso_rotational: {
    id: 'iso_rotational',
    name: 'iso_rotational',
    displayName: 'Isometric Rotational',
    category: 'power',
    unit: 'N',
    valueDirection: 'higher_better',
    description: 'Isometric rotational force',
    equipment: ['Force Gauge'],
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },

  // ========== THROWS - TECHNIQUE TESTS ==========
  release_angle: {
    id: 'release_angle',
    name: 'release_angle',
    displayName: 'Release Angle',
    category: 'technique',
    unit: 'degrees',
    valueDirection: 'optimal_range',
    description: 'Angle of implement at release',
    equipment: ['Video Analysis'],
    timeBasedPlot: true
  },
  release_speed: {
    id: 'release_speed',
    name: 'release_speed',
    displayName: 'Release Speed',
    category: 'technique',
    unit: 'm/s',
    valueDirection: 'higher_better',
    description: 'Speed of implement at release',
    equipment: ['Radar Gun', 'Video Analysis'],
    attemptBased: true,
    timeBasedPlot: true
  },
  release_rhythm: {
    id: 'release_rhythm',
    name: 'release_rhythm',
    displayName: 'Release Rhythm Score',
    category: 'technique',
    unit: 'score',
    valueDirection: 'higher_better',
    description: 'Rhythm and timing of release',
    equipment: ['Video Analysis'],
    timeBasedPlot: true
  },
  hip_shoulder_sep: {
    id: 'hip_shoulder_sep',
    name: 'hip_shoulder_sep',
    displayName: 'Hip-Shoulder Separation',
    category: 'technique',
    unit: 'degrees',
    valueDirection: 'optimal_range',
    description: 'Separation angle between hips and shoulders',
    equipment: ['Video Analysis'],
    timeBasedPlot: true
  },
  throwing_technique_score: {
    id: 'throwing_technique_score',
    name: 'throwing_technique_score',
    displayName: 'Throwing Technique Score',
    category: 'technique',
    unit: 'score',
    valueDirection: 'higher_better',
    optimalRange: { min: 8, max: 10 },
    description: 'Overall throwing technique assessment',
    equipment: ['Video Analysis'],
    timeBasedPlot: true
  },

  // ========== THROWS - MOBILITY TESTS ==========
  shoulder_ir: {
    id: 'shoulder_ir',
    name: 'shoulder_ir',
    displayName: 'Shoulder Internal Rotation',
    category: 'mobility',
    unit: 'degrees',
    valueDirection: 'higher_better',
    description: 'Shoulder internal rotation range',
    equipment: ['Goniometer'],
    hasLeftRight: true,
    timeBasedPlot: true
  },
  shoulder_er: {
    id: 'shoulder_er',
    name: 'shoulder_er',
    displayName: 'Shoulder External Rotation',
    category: 'mobility',
    unit: 'degrees',
    valueDirection: 'higher_better',
    description: 'Shoulder external rotation range',
    equipment: ['Goniometer'],
    hasLeftRight: true,
    timeBasedPlot: true
  },
  thoracic_rotation: {
    id: 'thoracic_rotation',
    name: 'thoracic_rotation',
    displayName: 'Thoracic Rotation',
    category: 'mobility',
    unit: 'degrees',
    valueDirection: 'higher_better',
    description: 'Thoracic spine rotation range',
    equipment: ['Goniometer'],
    hasLeftRight: true,
    timeBasedPlot: true
  },
  grip_strength_max: {
    id: 'grip_strength_max',
    name: 'grip_strength_max',
    displayName: 'Grip Strength Max',
    category: 'mobility',
    unit: 'kg',
    valueDirection: 'higher_better',
    description: 'Maximum grip strength',
    equipment: ['Dynamometer'],
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },
  grip_endurance: {
    id: 'grip_endurance',
    name: 'grip_endurance',
    displayName: 'Grip Endurance',
    category: 'mobility',
    unit: 'sec',
    valueDirection: 'higher_better',
    description: 'Grip endurance hold time',
    equipment: ['Dynamometer'],
    hasLeftRight: true,
    attemptBased: true,
    timeBasedPlot: true
  },
  elbow_valgus: {
    id: 'elbow_valgus',
    name: 'elbow_valgus',
    displayName: 'Elbow Valgus Stress',
    category: 'mobility',
    unit: 'degrees',
    valueDirection: 'optimal_range',
    description: 'Elbow valgus stress test',
    equipment: ['Goniometer'],
    hasLeftRight: true,
    timeBasedPlot: true
  }
};
