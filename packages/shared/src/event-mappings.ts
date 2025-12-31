/**
 * EVENT-SPECIFIC TEST MAPPINGS
 * World-Class Athletics Performance System
 *
 * Event select केल्यावर फक्त त्या event चे tests दिसतील
 */

import { EventTestMapping } from './event-test-mapping';

// ============================================
// SPRINT EVENTS (100m, 200m, 400m)
// ============================================

export const EVENT_100M: EventTestMapping = {
  eventId: 'M_100',
  eventName: '100m Sprint',
  eventCategory: 'sprint',
  tests: [
    {
      category: 'strength',
      categoryDisplayName: 'Strength Tests',
      tests: [
        'squat_1rm', 'front_squat_1rm', 'deadlift_1rm', 'bench_press_1rm',
        'hip_thrust_1rm', 'clean_1rm', 'snatch_1rm', 'clean_jerk_1rm',
        'push_press_1rm', 'pullup_1rm'
      ]
    },
    {
      category: 'sprint',
      categoryDisplayName: 'Sprint Tests',
      tests: [
        'sprint_10m_time', 'sprint_20m_time', 'sprint_30m_time', 'sprint_40m_time',
        'sprint_60m_time', 'sprint_80m', 'sprint_100m_time', 'sprint_120m',
        'flying_10m', 'flying_20m_time', 'flying_30m_time', 'acceleration_30m_time',
        'max_velocity_60m', 'anaerobic_speed_reserve', 'speed_reserve',
        'sprint_fv_profile', 'wicket_rhythm_score'
      ]
    },
    {
      category: 'reaction',
      categoryDisplayName: 'Reaction Tests',
      tests: [
        'reaction_time', 'block_clearance_time', 'shin_angle', 'first_3_step_power'
      ]
    },
    {
      category: 'power',
      categoryDisplayName: 'Power Tests',
      tests: [
        'vertical_jump_cm', 'cmj_height', 'squat_jump_height',
        'single_leg_cmj_left', 'single_leg_cmj_right',
        'drop_jump_20cm', 'drop_jump_30cm', 'drop_jump_40cm',
        'rsi_bilateral', 'rsi_unilateral',
        'loaded_jump_20_percent', 'loaded_jump_40_percent',
        'imtp_peak_force', 'broad_jump', 'standing_long_jump_cm', 'standing_triple_jump'
      ]
    },
    {
      category: 'biomechanics',
      categoryDisplayName: 'Biomechanics Tests',
      tests: [
        'stride_length', 'stride_frequency', 'ground_contact_time',
        'sprint_kinematics', 'horizontal_force', 'vertical_stiffness'
      ]
    },
    {
      category: 'injury_prevention',
      categoryDisplayName: 'Injury Prevention Tests',
      tests: [
        'nordic_hamstring', 'ham_quad_ratio', 'hamstring_strength_test',
        'iso_hamstring_bridge', 'hip_flexor_iso', 'adductor_squeeze',
        'hip_mobility_score', 'ankle_stiffness', 'ankle_dorsiflexion',
        'lumbar_stiffness', 'y_balance_score'
      ]
    },
    {
      category: 'core',
      categoryDisplayName: 'Core Tests',
      tests: [
        'plank_hold', 'side_plank_left', 'side_plank_right',
        'copenhagen_plank_left', 'copenhagen_plank_right',
        'hollow_hold', 'v_sit_hold', 'situps_per_min', 'sorensen_hold',
        'pallof_press_left', 'pallof_press_right',
        'single_leg_bridge_left', 'single_leg_bridge_right',
        'rollout_reps', 'suitcase_carry', 'rotational_throw'
      ]
    }
  ]
};

export const EVENT_200M: EventTestMapping = {
  eventId: 'M_200',
  eventName: '200m Sprint',
  eventCategory: 'sprint',
  tests: [
    {
      category: 'strength',
      categoryDisplayName: 'Strength Tests',
      tests: [
        'squat_1rm', 'front_squat_1rm', 'deadlift_1rm', 'bench_press_1rm',
        'hip_thrust_1rm', 'clean_1rm', 'snatch_1rm', 'clean_jerk_1rm',
        'push_press_1rm', 'pullup_1rm'
      ]
    },
    {
      category: 'sprint',
      categoryDisplayName: 'Sprint Tests',
      tests: [
        'sprint_10m_time', 'sprint_20m_time', 'sprint_30m_time', 'sprint_40m_time',
        'sprint_60m_time', 'sprint_100m_time', 'sprint_150m', 'sprint_200m_time',
        'flying_20m_time', 'flying_30m_time', 'acceleration_30m_time',
        'max_velocity_60m', 'anaerobic_speed_reserve', 'speed_reserve', 'sprint_fv_profile'
      ]
    },
    {
      category: 'reaction',
      categoryDisplayName: 'Reaction Tests',
      tests: [
        'reaction_time', 'block_clearance_time', 'shin_angle', 'first_3_step_power'
      ]
    },
    {
      category: 'power',
      categoryDisplayName: 'Power Tests',
      tests: [
        'cmj_height', 'single_leg_cmj_left', 'single_leg_cmj_right',
        'drop_jump_20cm', 'rsi_bilateral', 'imtp_peak_force', 'broad_jump'
      ]
    },
    {
      category: 'biomechanics',
      categoryDisplayName: 'Biomechanics Tests',
      tests: [
        'stride_length', 'stride_frequency', 'ground_contact_time',
        'horizontal_force', 'vertical_stiffness'
      ]
    },
    {
      category: 'injury_prevention',
      categoryDisplayName: 'Injury Prevention Tests',
      tests: [
        'hamstring_strength_test', 'adductor_squeeze', 'hip_mobility_score',
        'ankle_stiffness', 'y_balance_score'
      ]
    },
    {
      category: 'core',
      categoryDisplayName: 'Core Tests',
      tests: [
        'plank_hold', 'side_plank_left', 'side_plank_right',
        'copenhagen_plank_left', 'sorensen_hold', 'pallof_press_left',
        'single_leg_bridge_left'
      ]
    }
  ]
};

export const EVENT_400M: EventTestMapping = {
  eventId: 'M_400',
  eventName: '400m Sprint',
  eventCategory: 'sprint',
  tests: [
    {
      category: 'strength',
      categoryDisplayName: 'Strength Tests',
      tests: [
        'squat_1rm', 'deadlift_1rm', 'hip_thrust_1rm', 'clean_1rm',
        'clean_jerk_1rm', 'push_press_1rm'
      ]
    },
    {
      category: 'sprint',
      categoryDisplayName: 'Sprint Tests',
      tests: [
        'sprint_30m_time', 'sprint_60m_time', 'sprint_150m', 'sprint_200m_time',
        'sprint_300m', 'sprint_400m_time', 'anaerobic_speed_reserve', 'speed_reserve'
      ]
    },
    {
      category: 'reaction',
      categoryDisplayName: 'Reaction Tests',
      tests: ['reaction_time', 'block_clearance_time']
    },
    {
      category: 'power',
      categoryDisplayName: 'Power Tests',
      tests: ['cmj_height', 'imtp_peak_force', 'broad_jump']
    },
    {
      category: 'biomechanics',
      categoryDisplayName: 'Biomechanics Tests',
      tests: ['stride_frequency', 'ground_contact_time']
    },
    {
      category: 'injury_prevention',
      categoryDisplayName: 'Injury Prevention Tests',
      tests: ['hamstring_strength_test', 'hip_mobility_score', 'ankle_stiffness']
    },
    {
      category: 'core',
      categoryDisplayName: 'Core Tests',
      tests: ['plank_hold', 'side_plank_left', 'sorensen_hold']
    }
  ]
};

// ============================================
// HURDLES EVENTS (100H, 110H, 400H)
// ============================================

export const EVENT_100H: EventTestMapping = {
  eventId: 'M_100H',
  eventName: '100m Hurdles',
  eventCategory: 'hurdles',
  tests: [
    {
      category: 'hurdles_specific',
      categoryDisplayName: 'Hurdles Specific Tests',
      tests: [
        'hurdle_mobility_score', 'hurdle_clearance_time', 'hurdle_step_pattern',
        'hurdle_rhythm_score', 'hurdle_approach_speed', 'hurdle_technique_score',
        'inter_hurdle_cv', 'landing_distance'
      ]
    },
    {
      category: 'strength',
      categoryDisplayName: 'Strength Tests',
      tests: [
        'squat_1rm', 'deadlift_1rm', 'hip_thrust_1rm', 'clean_1rm',
        'snatch_1rm', 'clean_jerk_1rm', 'push_press_1rm'
      ]
    },
    {
      category: 'sprint',
      categoryDisplayName: 'Sprint Tests',
      tests: [
        'sprint_10m_time', 'sprint_20m_time', 'sprint_30m_time', 'sprint_60m_time',
        'sprint_100m_time', 'flying_20m_time', 'acceleration_30m_time'
      ]
    },
    {
      category: 'power',
      categoryDisplayName: 'Power Tests',
      tests: [
        'cmj_height', 'single_leg_cmj_left', 'single_leg_cmj_right',
        'drop_jump_20cm', 'rsi_bilateral', 'imtp_peak_force'
      ]
    },
    {
      category: 'injury_prevention',
      categoryDisplayName: 'Injury Prevention Tests',
      tests: [
        'hamstring_strength_test', 'adductor_squeeze', 'hip_mobility_score', 'ankle_stiffness'
      ]
    },
    {
      category: 'core',
      categoryDisplayName: 'Core Tests',
      tests: [
        'plank_hold', 'side_plank_left', 'copenhagen_plank_left',
        'sorensen_hold', 'pallof_press_left', 'single_leg_bridge_left'
      ]
    }
  ]
};

export const EVENT_110H: EventTestMapping = {
  eventId: 'M_110H',
  eventName: '110m Hurdles',
  eventCategory: 'hurdles',
  tests: [
    {
      category: 'hurdles_specific',
      categoryDisplayName: 'Hurdles Specific Tests',
      tests: [
        'hurdle_mobility_score', 'hurdle_clearance_time', 'hurdle_step_pattern',
        'hurdle_rhythm_score', 'hurdle_approach_speed', 'hurdle_technique_score'
      ]
    },
    {
      category: 'strength',
      categoryDisplayName: 'Strength Tests',
      tests: ['squat_1rm', 'deadlift_1rm', 'clean_1rm', 'snatch_1rm']
    },
    {
      category: 'sprint',
      categoryDisplayName: 'Sprint Tests',
      tests: [
        'sprint_10m_time', 'sprint_20m_time', 'sprint_60m_time', 'sprint_100m_time'
      ]
    },
    {
      category: 'power',
      categoryDisplayName: 'Power Tests',
      tests: [
        'cmj_height', 'single_leg_cmj_left', 'rsi_bilateral', 'imtp_peak_force'
      ]
    },
    {
      category: 'injury_prevention',
      categoryDisplayName: 'Injury Prevention Tests',
      tests: ['hamstring_strength_test', 'hip_mobility_score']
    },
    {
      category: 'core',
      categoryDisplayName: 'Core Tests',
      tests: ['plank_hold', 'side_plank_left', 'sorensen_hold']
    }
  ]
};

export const EVENT_400H: EventTestMapping = {
  eventId: 'M_400H',
  eventName: '400m Hurdles',
  eventCategory: 'hurdles',
  tests: [
    {
      category: 'hurdles_specific',
      categoryDisplayName: 'Hurdles Specific Tests',
      tests: [
        'hurdle_mobility_score', 'hurdle_clearance_time',
        'hurdle_rhythm_score', 'hurdle_technique_score'
      ]
    },
    {
      category: 'strength',
      categoryDisplayName: 'Strength Tests',
      tests: ['squat_1rm', 'deadlift_1rm', 'hip_thrust_1rm', 'clean_1rm']
    },
    {
      category: 'sprint',
      categoryDisplayName: 'Sprint Tests',
      tests: [
        'sprint_60m_time', 'sprint_200m_time', 'sprint_300m', 'sprint_400m_time'
      ]
    },
    {
      category: 'power',
      categoryDisplayName: 'Power Tests',
      tests: ['cmj_height', 'imtp_peak_force']
    },
    {
      category: 'injury_prevention',
      categoryDisplayName: 'Injury Prevention Tests',
      tests: ['hamstring_strength_test', 'hip_mobility_score']
    },
    {
      category: 'core',
      categoryDisplayName: 'Core Tests',
      tests: ['plank_hold', 'sorensen_hold']
    }
  ]
};

// ============================================
// MIDDLE DISTANCE EVENTS (800m, 1500m)
// ============================================

export const EVENT_800M: EventTestMapping = {
  eventId: 'M_800',
  eventName: '800m',
  eventCategory: 'middle_distance',
  tests: [
    {
      category: 'physiological',
      categoryDisplayName: 'Physiological Tests',
      tests: [
        'vo2_max', 'lactate_lt1', 'lactate_lt2', 'ventilatory_vt1', 'ventilatory_vt2',
        'tte_vvo2max', 'mas_speed', 'critical_speed', 'running_economy'
      ]
    },
    {
      category: 'performance',
      categoryDisplayName: 'Performance Tests',
      tests: [
        'sprint_300m', 'sprint_400m_time', 'sprint_600m', 'sprint_800m',
        'lactate_threshold_pace', 'rsa_score', 'sprint_finish_test'
      ]
    },
    {
      category: 'strength',
      categoryDisplayName: 'Strength Tests',
      tests: ['squat_1rm', 'deadlift_1rm', 'hip_thrust_1rm', 'clean_1rm']
    },
    {
      category: 'power',
      categoryDisplayName: 'Power Tests',
      tests: ['cmj_height', 'single_leg_cmj_left', 'imtp_peak_force']
    },
    {
      category: 'injury_prevention',
      categoryDisplayName: 'Injury Prevention Tests',
      tests: ['hip_mobility_score', 'ankle_stiffness', 'y_balance_score']
    },
    {
      category: 'core',
      categoryDisplayName: 'Core Tests',
      tests: ['plank_hold', 'side_plank_left', 'sorensen_hold']
    }
  ]
};

export const EVENT_1500M: EventTestMapping = {
  eventId: 'M_1500',
  eventName: '1500m',
  eventCategory: 'middle_distance',
  tests: [
    {
      category: 'physiological',
      categoryDisplayName: 'Physiological Tests',
      tests: [
        'vo2_max', 'lactate_lt1', 'lactate_lt2', 'mas_speed',
        'critical_speed', 'running_economy'
      ]
    },
    {
      category: 'performance',
      categoryDisplayName: 'Performance Tests',
      tests: [
        'sprint_600m', 'sprint_1000m', 'sprint_1500m',
        'lactate_threshold_pace', 'sprint_finish_test'
      ]
    },
    {
      category: 'strength',
      categoryDisplayName: 'Strength Tests',
      tests: ['squat_1rm', 'deadlift_1rm', 'clean_1rm']
    },
    {
      category: 'power',
      categoryDisplayName: 'Power Tests',
      tests: ['cmj_height', 'imtp_peak_force']
    },
    {
      category: 'injury_prevention',
      categoryDisplayName: 'Injury Prevention Tests',
      tests: ['hip_mobility_score', 'ankle_stiffness']
    },
    {
      category: 'core',
      categoryDisplayName: 'Core Tests',
      tests: ['plank_hold', 'sorensen_hold']
    }
  ]
};

// ============================================
// LONG DISTANCE EVENTS (5K, 10K, Half Marathon, Marathon)
// ============================================

export const EVENT_5K: EventTestMapping = {
  eventId: 'M_5000',
  eventName: '5K',
  eventCategory: 'long_distance',
  tests: [
    {
      category: 'physiological',
      categoryDisplayName: 'Physiological Tests',
      tests: [
        'vo2_max', 'fatmax', 'hr_zones', 'running_economy',
        'running_economy_fatigued', 'aerobic_threshold_pace'
      ]
    },
    {
      category: 'performance',
      categoryDisplayName: 'Performance Tests',
      tests: ['sprint_5km', 'tempo_test_pace', 'lactate_curve_data', 'long_run_hr_zones']
    },
    {
      category: 'fatigue',
      categoryDisplayName: 'Fatigue Tests',
      tests: ['cardiac_drift', 'impact_loading', 'foot_strike_pressure']
    },
    {
      category: 'strength',
      categoryDisplayName: 'Strength Tests',
      tests: ['squat_1rm', 'deadlift_1rm', 'clean_1rm']
    },
    {
      category: 'power',
      categoryDisplayName: 'Power Tests',
      tests: ['imtp_peak_force', 'single_leg_jump']
    },
    {
      category: 'core',
      categoryDisplayName: 'Core Tests',
      tests: ['plank_hold', 'side_plank_left', 'sorensen_hold']
    }
  ]
};

export const EVENT_10K: EventTestMapping = {
  eventId: 'M_10000',
  eventName: '10K',
  eventCategory: 'long_distance',
  tests: [
    {
      category: 'physiological',
      categoryDisplayName: 'Physiological Tests',
      tests: [
        'vo2_max', 'fatmax', 'aerobic_threshold_pace',
        'running_economy', 'lactate_curve_data'
      ]
    },
    {
      category: 'performance',
      categoryDisplayName: 'Performance Tests',
      tests: ['sprint_5km', 'sprint_10km', 'tempo_test_pace']
    },
    {
      category: 'fatigue',
      categoryDisplayName: 'Fatigue Tests',
      tests: ['cardiac_drift', 'impact_loading']
    },
    {
      category: 'strength',
      categoryDisplayName: 'Strength Tests',
      tests: ['squat_1rm', 'deadlift_1rm']
    },
    {
      category: 'power',
      categoryDisplayName: 'Power Tests',
      tests: ['imtp_peak_force']
    },
    {
      category: 'core',
      categoryDisplayName: 'Core Tests',
      tests: ['plank_hold', 'sorensen_hold']
    }
  ]
};

export const EVENT_HALF_MARATHON: EventTestMapping = {
  eventId: 'HALF_MARATHON',
  eventName: 'Half Marathon',
  eventCategory: 'long_distance',
  tests: [
    {
      category: 'endurance',
      categoryDisplayName: 'Endurance Tests',
      tests: [
        'sprint_half_marathon', 'hm_pace_test', 'aerobic_threshold_pace',
        'running_economy', 'hm_running_economy', 'hr_drift_test'
      ]
    },
    {
      category: 'fueling',
      categoryDisplayName: 'Fueling Tests',
      tests: [
        'fueling_efficiency_score', 'cho_utilization', 'fat_oxidation_rate',
        'gi_tolerance_score', 'cmj_fatigue_loss'
      ]
    },
    {
      category: 'physiological',
      categoryDisplayName: 'Physiological Tests',
      tests: ['vo2_max', 'fatmax', 'cardiac_drift']
    },
    {
      category: 'strength',
      categoryDisplayName: 'Strength Tests',
      tests: ['squat_1rm', 'deadlift_1rm', 'clean_1rm']
    },
    {
      category: 'core',
      categoryDisplayName: 'Core Tests',
      tests: ['plank_hold', 'side_plank_left', 'sorensen_hold']
    }
  ]
};

export const EVENT_MARATHON: EventTestMapping = {
  eventId: 'MARATHON',
  eventName: 'Marathon',
  eventCategory: 'long_distance',
  tests: [
    {
      category: 'endurance',
      categoryDisplayName: 'Endurance Tests',
      tests: [
        'sprint_marathon', 'marathon_pace_test', 'glycogen_depletion_rate',
        'aerobic_capacity', 'long_run_efficiency', 'vo2_max'
      ]
    },
    {
      category: 'fueling',
      categoryDisplayName: 'Fueling Tests',
      tests: [
        'pacing_decay', 'sweat_rate', 'sodium_loss', 'carb_absorption',
        'cho_utilization', 'fat_oxidation_rate', 'cmj_fatigue_loss'
      ]
    },
    {
      category: 'economy',
      categoryDisplayName: 'Economy Tests',
      tests: ['running_economy', 'running_economy_fatigued', 'cardiac_drift']
    },
    {
      category: 'strength',
      categoryDisplayName: 'Strength Tests',
      tests: ['squat_1rm', 'deadlift_1rm']
    },
    {
      category: 'core',
      categoryDisplayName: 'Core Tests',
      tests: ['plank_hold', 'sorensen_hold']
    }
  ]
};

// ============================================
// JUMP EVENTS (Long Jump, Triple Jump, High Jump, Pole Vault)
// ============================================

export const EVENT_LONG_JUMP: EventTestMapping = {
  eventId: 'LONG_JUMP',
  eventName: 'Long Jump',
  eventCategory: 'jumps',
  tests: [
    {
      category: 'performance',
      categoryDisplayName: 'Performance Tests',
      tests: ['long_jump_distance']
    },
    {
      category: 'approach',
      categoryDisplayName: 'Approach Tests',
      tests: [
        'approach_10m_speed', 'approach_20m_speed', 'last_3_step_velocity',
        'step_consistency', 'jump_approach_speed'
      ]
    },
    {
      category: 'technique',
      categoryDisplayName: 'Technique Tests',
      tests: [
        'penultimate_step', 'takeoff_angle', 'takeoff_force',
        'landing_mechanics', 'jump_joint_angles', 'board_accuracy'
      ]
    },
    {
      category: 'strength',
      categoryDisplayName: 'Strength Tests',
      tests: [
        'squat_1rm', 'deadlift_1rm', 'hip_thrust_1rm', 'clean_1rm',
        'snatch_1rm', 'clean_jerk_1rm'
      ]
    },
    {
      category: 'power',
      categoryDisplayName: 'Power Tests',
      tests: [
        'cmj_height', 'squat_jump_height', 'single_leg_cmj_left', 'single_leg_cmj_right',
        'standing_long_jump_cm', 'broad_jump', 'drop_jump_20cm', 'rsi_bilateral',
        'imtp_peak_force'
      ]
    },
    {
      category: 'sprint',
      categoryDisplayName: 'Sprint Tests',
      tests: ['sprint_10m_time', 'sprint_20m_time', 'sprint_30m_time', 'sprint_60m_time']
    },
    {
      category: 'core',
      categoryDisplayName: 'Core Tests',
      tests: [
        'plank_hold', 'side_plank_left', 'copenhagen_plank_left',
        'hollow_hold', 'sorensen_hold'
      ]
    }
  ]
};

export const EVENT_TRIPLE_JUMP: EventTestMapping = {
  eventId: 'TRIPLE_JUMP',
  eventName: 'Triple Jump',
  eventCategory: 'jumps',
  tests: [
    {
      category: 'performance',
      categoryDisplayName: 'Performance Tests',
      tests: ['triple_jump_distance']
    },
    {
      category: 'approach',
      categoryDisplayName: 'Approach Tests',
      tests: ['approach_10m_speed', 'approach_20m_speed', 'last_3_step_velocity']
    },
    {
      category: 'technique',
      categoryDisplayName: 'Technique Tests',
      tests: ['penultimate_step', 'takeoff_angle', 'landing_mechanics', 'board_accuracy']
    },
    {
      category: 'strength',
      categoryDisplayName: 'Strength Tests',
      tests: ['squat_1rm', 'deadlift_1rm', 'clean_1rm', 'snatch_1rm']
    },
    {
      category: 'power',
      categoryDisplayName: 'Power Tests',
      tests: [
        'cmj_height', 'single_leg_cmj_left', 'single_leg_cmj_right',
        'standing_triple_jump', 'rsi_bilateral', 'reactive_strength_index'
      ]
    },
    {
      category: 'sprint',
      categoryDisplayName: 'Sprint Tests',
      tests: ['sprint_10m_time', 'sprint_20m_time', 'sprint_30m_time']
    },
    {
      category: 'core',
      categoryDisplayName: 'Core Tests',
      tests: ['plank_hold', 'side_plank_left', 'copenhagen_plank_left']
    }
  ]
};

export const EVENT_HIGH_JUMP: EventTestMapping = {
  eventId: 'HIGH_JUMP',
  eventName: 'High Jump',
  eventCategory: 'jumps',
  tests: [
    {
      category: 'performance',
      categoryDisplayName: 'Performance Tests',
      tests: ['high_jump_height']
    },
    {
      category: 'approach',
      categoryDisplayName: 'Approach Tests',
      tests: ['approach_10m_speed', 'approach_20m_speed', 'hj_curve_timing']
    },
    {
      category: 'technique',
      categoryDisplayName: 'Technique Tests',
      tests: ['takeoff_angle', 'takeoff_force', 'jump_joint_angles']
    },
    {
      category: 'strength',
      categoryDisplayName: 'Strength Tests',
      tests: ['squat_1rm', 'deadlift_1rm', 'clean_1rm']
    },
    {
      category: 'power',
      categoryDisplayName: 'Power Tests',
      tests: [
        'cmj_height', 'squat_jump_height', 'single_leg_cmj_left',
        'rsi_bilateral', 'imtp_peak_force'
      ]
    },
    {
      category: 'core',
      categoryDisplayName: 'Core Tests',
      tests: ['plank_hold', 'hollow_hold', 'sorensen_hold']
    }
  ]
};

export const EVENT_POLE_VAULT: EventTestMapping = {
  eventId: 'POLE_VAULT',
  eventName: 'Pole Vault',
  eventCategory: 'jumps',
  tests: [
    {
      category: 'performance',
      categoryDisplayName: 'Performance Tests',
      tests: ['pole_vault_height']
    },
    {
      category: 'approach',
      categoryDisplayName: 'Approach Tests',
      tests: ['approach_10m_speed', 'approach_20m_speed']
    },
    {
      category: 'technique',
      categoryDisplayName: 'Technique Tests',
      tests: ['pv_plant_accuracy', 'pole_bend_timing', 'takeoff_force']
    },
    {
      category: 'strength',
      categoryDisplayName: 'Strength Tests',
      tests: ['squat_1rm', 'deadlift_1rm', 'bench_press_1rm', 'pullup_1rm']
    },
    {
      category: 'power',
      categoryDisplayName: 'Power Tests',
      tests: ['cmj_height', 'squat_jump_height', 'imtp_peak_force']
    },
    {
      category: 'core',
      categoryDisplayName: 'Core Tests',
      tests: ['plank_hold', 'hollow_hold', 'v_sit_hold', 'pallof_press_left']
    }
  ]
};

// ============================================
// THROW EVENTS (Shot Put, Discus, Javelin, Hammer)
// ============================================

export const EVENT_SHOT_PUT: EventTestMapping = {
  eventId: 'SHOT_PUT',
  eventName: 'Shot Put',
  eventCategory: 'throws',
  tests: [
    {
      category: 'performance',
      categoryDisplayName: 'Performance Tests',
      tests: ['shot_put_distance']
    },
    {
      category: 'power',
      categoryDisplayName: 'Power Tests',
      tests: [
        'medicine_ball_throw', 'upper_body_power_score', 'rotational_power_score',
        'imtp_peak_force', 'rfd_throw', 'iso_rotational'
      ]
    },
    {
      category: 'technique',
      categoryDisplayName: 'Technique Tests',
      tests: [
        'release_angle', 'release_speed', 'release_rhythm',
        'hip_shoulder_sep', 'throwing_technique_score'
      ]
    },
    {
      category: 'mobility',
      categoryDisplayName: 'Mobility Tests',
      tests: [
        'shoulder_ir', 'shoulder_er', 'thoracic_rotation',
        'grip_strength_max', 'grip_endurance'
      ]
    },
    {
      category: 'strength',
      categoryDisplayName: 'Strength Tests',
      tests: [
        'squat_1rm', 'bench_press_1rm', 'deadlift_1rm', 'clean_1rm',
        'snatch_1rm', 'push_press_1rm', 'pullup_1rm'
      ]
    },
    {
      category: 'core',
      categoryDisplayName: 'Core Tests',
      tests: [
        'plank_hold', 'copenhagen_plank_left', 'pallof_press_left',
        'rotational_throw', 'sorensen_hold'
      ]
    }
  ]
};

export const EVENT_DISCUS: EventTestMapping = {
  eventId: 'DISCUS',
  eventName: 'Discus',
  eventCategory: 'throws',
  tests: [
    {
      category: 'performance',
      categoryDisplayName: 'Performance Tests',
      tests: ['discus_distance']
    },
    {
      category: 'power',
      categoryDisplayName: 'Power Tests',
      tests: ['medicine_ball_throw', 'rotational_power_score', 'rfd_throw']
    },
    {
      category: 'technique',
      categoryDisplayName: 'Technique Tests',
      tests: [
        'release_angle', 'release_speed', 'hip_shoulder_sep', 'throwing_technique_score'
      ]
    },
    {
      category: 'mobility',
      categoryDisplayName: 'Mobility Tests',
      tests: ['shoulder_ir', 'shoulder_er', 'thoracic_rotation']
    },
    {
      category: 'strength',
      categoryDisplayName: 'Strength Tests',
      tests: ['squat_1rm', 'deadlift_1rm', 'clean_1rm']
    },
    {
      category: 'core',
      categoryDisplayName: 'Core Tests',
      tests: ['plank_hold', 'rotational_throw', 'pallof_press_left']
    }
  ]
};

export const EVENT_JAVELIN: EventTestMapping = {
  eventId: 'JAVELIN',
  eventName: 'Javelin',
  eventCategory: 'throws',
  tests: [
    {
      category: 'performance',
      categoryDisplayName: 'Performance Tests',
      tests: ['javelin_distance']
    },
    {
      category: 'power',
      categoryDisplayName: 'Power Tests',
      tests: ['medicine_ball_throw', 'upper_body_power_score', 'rfd_throw']
    },
    {
      category: 'technique',
      categoryDisplayName: 'Technique Tests',
      tests: ['release_angle', 'release_speed', 'throwing_technique_score']
    },
    {
      category: 'mobility',
      categoryDisplayName: 'Mobility Tests',
      tests: ['shoulder_ir', 'shoulder_er', 'elbow_valgus', 'thoracic_rotation']
    },
    {
      category: 'strength',
      categoryDisplayName: 'Strength Tests',
      tests: ['squat_1rm', 'bench_press_1rm', 'deadlift_1rm', 'pullup_1rm']
    },
    {
      category: 'core',
      categoryDisplayName: 'Core Tests',
      tests: ['plank_hold', 'pallof_press_left', 'rotational_throw']
    }
  ]
};

export const EVENT_HAMMER: EventTestMapping = {
  eventId: 'HAMMER',
  eventName: 'Hammer',
  eventCategory: 'throws',
  tests: [
    {
      category: 'performance',
      categoryDisplayName: 'Performance Tests',
      tests: ['hammer_distance']
    },
    {
      category: 'power',
      categoryDisplayName: 'Power Tests',
      tests: ['rotational_power_score', 'rfd_throw', 'iso_rotational']
    },
    {
      category: 'technique',
      categoryDisplayName: 'Technique Tests',
      tests: ['release_speed', 'throwing_technique_score']
    },
    {
      category: 'mobility',
      categoryDisplayName: 'Mobility Tests',
      tests: ['grip_strength_max', 'grip_endurance', 'thoracic_rotation']
    },
    {
      category: 'strength',
      categoryDisplayName: 'Strength Tests',
      tests: ['squat_1rm', 'deadlift_1rm', 'clean_1rm', 'snatch_1rm']
    },
    {
      category: 'core',
      categoryDisplayName: 'Core Tests',
      tests: ['plank_hold', 'rotational_throw', 'pallof_press_left', 'sorensen_hold']
    }
  ]
};

// ============================================
// ALL EVENTS MAPPING OBJECT
// ============================================

export const ALL_EVENT_MAPPINGS: Record<string, EventTestMapping> = {
  // Sprints
  M_100: EVENT_100M,
  M_200: EVENT_200M,
  M_400: EVENT_400M,
  // Hurdles
  M_100H: EVENT_100H,
  M_110H: EVENT_110H,
  M_400H: EVENT_400H,
  // Middle Distance
  M_800: EVENT_800M,
  M_1500: EVENT_1500M,
  // Long Distance
  M_5000: EVENT_5K,
  M_10000: EVENT_10K,
  HALF_MARATHON: EVENT_HALF_MARATHON,
  MARATHON: EVENT_MARATHON,
  // Jumps
  LONG_JUMP: EVENT_LONG_JUMP,
  TRIPLE_JUMP: EVENT_TRIPLE_JUMP,
  HIGH_JUMP: EVENT_HIGH_JUMP,
  POLE_VAULT: EVENT_POLE_VAULT,
  // Throws
  SHOT_PUT: EVENT_SHOT_PUT,
  DISCUS: EVENT_DISCUS,
  JAVELIN: EVENT_JAVELIN,
  HAMMER: EVENT_HAMMER
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get tests for a specific event
 * Event select केल्यावर फक्त त्या event चे tests मिळतील
 */
export function getTestsForEvent(eventId: string): EventTestMapping | undefined {
  return ALL_EVENT_MAPPINGS[eventId];
}

/**
 * Get all test IDs for an event
 */
export function getAllTestIdsForEvent(eventId: string): string[] {
  const mapping = ALL_EVENT_MAPPINGS[eventId];
  if (!mapping) return [];

  return mapping.tests.flatMap(category => category.tests);
}

/**
 * Check if a test is applicable for an event
 */
export function isTestApplicableForEvent(testId: string, eventId: string): boolean {
  const testIds = getAllTestIdsForEvent(eventId);
  return testIds.includes(testId);
}

/**
 * Get all available events
 */
export function getAllEvents(): { id: string; name: string; category: string }[] {
  return Object.entries(ALL_EVENT_MAPPINGS).map(([id, mapping]) => ({
    id,
    name: mapping.eventName,
    category: mapping.eventCategory
  }));
}

/**
 * Get events by category
 */
export function getEventsByCategory(category: string): EventTestMapping[] {
  return Object.values(ALL_EVENT_MAPPINGS).filter(
    mapping => mapping.eventCategory === category
  );
}
