/**
 * Event Mapper Utility
 * Maps user-friendly event names to database EventType enum values
 */

import { EventType, EventCategory } from '@prisma/client';

// Map user-friendly event names to EventType enum
export const eventNameToEnum: Record<string, EventType> = {
  // Sprints
  '60m': 'M_60',
  '100m': 'M_100',
  '200m': 'M_200',
  '400m': 'M_400',
  
  // Hurdles
  '60m Hurdles': 'M_60H',
  '100m Hurdles': 'M_100H',
  '110m Hurdles': 'M_110H',
  '400m Hurdles': 'M_400H',
  
  // Middle Distance
  '800m': 'M_800',
  '1500m': 'M_1500',
  'Mile': 'M_MILE',
  
  // Long Distance
  '3000m': 'M_3000',
  '5000m': 'M_5000',
  '10000m': 'M_10000',
  'Half Marathon': 'HALF_MARATHON',
  'Marathon': 'MARATHON',
  '3000m Steeplechase': 'M_3000SC',
  
  // Jumps
  'Long Jump': 'LONG_JUMP',
  'Triple Jump': 'TRIPLE_JUMP',
  'High Jump': 'HIGH_JUMP',
  'Pole Vault': 'POLE_VAULT',
  
  // Throws
  'Shot Put': 'SHOT_PUT',
  'Discus': 'DISCUS',
  'Javelin': 'JAVELIN',
  'Hammer Throw': 'HAMMER',
  'Hammer': 'HAMMER',
  
  // Combined
  'Decathlon': 'DECATHLON',
  'Heptathlon': 'HEPTATHLON',
  'Pentathlon': 'PENTATHLON',
  
  // Race Walk
  '20km Walk': 'WALK_20K',
  '50km Walk': 'WALK_50K',
  
  // Relays
  '4x100m': 'RELAY_4X100',
  '4x400m': 'RELAY_4X400',
};

// Map EventCategory friendly names to enum
export const eventCategoryToEnum: Record<string, EventCategory> = {
  'SPRINTS': 'SPRINT',
  'MIDDLE_DISTANCE': 'MIDDLE_DISTANCE',
  'LONG_DISTANCE': 'LONG_DISTANCE',
  'HURDLES': 'HURDLES',
  'JUMPS': 'JUMPS',
  'THROWS': 'THROWS',
  'COMBINED': 'COMBINED',
  'RACE_WALK': 'RACE_WALK',
  'RELAY': 'RELAY',
};

/**
 * Convert user-friendly event name to EventType enum
 */
export function mapEventNameToEnum(eventName: string): EventType {
  const mapped = eventNameToEnum[eventName];
  if (!mapped) {
    throw new Error(`Unknown event type: ${eventName}. Please use a valid event name.`);
  }
  return mapped;
}

/**
 * Convert user-friendly event category to EventCategory enum
 */
export function mapEventCategoryToEnum(category: string): EventCategory {
  const mapped = eventCategoryToEnum[category];
  if (!mapped) {
    // If already in enum format, return as is (type cast)
    return category as EventCategory;
  }
  return mapped;
}
