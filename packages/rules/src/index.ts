/**
 * AI Rule Engine - Main Export File
 * Elite Athletics Performance System
 */

// ==================== BLOOD ANALYSIS ====================
export {
  BloodTestResult,
  BloodAnalysisOutput,
  BloodOverallStatus,
  BLOOD_REFERENCE_RANGES,
  BLOOD_RECOMMENDATIONS,
  analyzeBloodMarker,
  analyzeBloodPanel,
  calculateOverallBloodStatus,
  generateBloodReport,
} from './blood-rules';

// ==================== LOAD MONITORING ====================
export {
  DailyLoad,
  LoadAnalysisOutput,
  ACWR_ZONES,
  MONOTONY_THRESHOLDS,
  STRAIN_THRESHOLDS,
  WEEKLY_CHANGE_THRESHOLDS,
  calculateSessionLoad,
  calculateRollingAverage,
  calculateACWR,
  calculateEWMA,
  calculateMonotonyAndStrain,
  calculateWeeklyLoadChange,
  getACWRStatus,
  analyzeLoad,
  generateLoadReport,
  calculateOptimalLoadRange,
} from './load-rules';

// ==================== BIOMECHANICS ANALYSIS ====================
export {
  BiomechData,
  BiomechAnalysisOutput,
  BiomechSummary,
  BIOMECH_STANDARDS,
  BIOMECH_RECOMMENDATIONS,
  analyzeBiomechMetric,
  analyzeBiomechanics,
  generateBiomechReport,
} from './biomech-rules';

// ==================== FATIGUE CLASSIFICATION ====================
export {
  FatigueInputData,
  FatigueClassification,
  classifyFatigue,
  generateFatigueReport,
} from './fatigue-rules';

// ==================== READINESS CALCULATOR ====================
export {
  ReadinessInput,
  ReadinessResult,
  DEFAULT_READINESS_WEIGHTS,
  DEFAULT_BASELINES,
  calculateReadiness,
  analyzeReadinessTrend,
  calculateSleepScore,
  calculateHRVScore,
  calculateFatigueScore,
} from './readiness-rules';

// ==================== AUTO-ADJUSTMENT ====================
export {
  AdjustmentFactors,
  PlannedWorkout,
  AdjustedWorkout,
  PHASE_TOLERANCE,
  WORKOUT_REQUIREMENTS,
  autoAdjustWorkout,
  rebalanceWeeklyLoad,
} from './auto-adjust-rules';

// ==================== TRAINING ZONES ====================
export {
  SprintZone,
  StrengthZone,
  EnduranceZone,
  SPRINT_ZONES,
  STRENGTH_ZONES,
  ENDURANCE_ZONES,
  PLYOMETRIC_LEVELS,
  getSprintZone,
  getEnduranceZone,
  calculateTargetHR,
  getStrengthParameters,
  getPlyometricLevel,
} from './training-zones';

// ==================== SESSION BUILDER ====================
export {
  TrainingSession,
  SessionType,
  WarmupBlock,
  MainWorkoutBlock,
  StrengthBlock,
  CooldownBlock,
  WARMUP_TEMPLATES,
  COOLDOWN_TEMPLATES,
  buildSpeedSession,
  buildTempoSession,
  buildStrengthSession,
  buildRecoverySession,
} from './session-builder';

// ==================== PERIODIZATION ENGINE ====================
export {
  PhaseParameters,
  Macrocycle,
  MacrocyclePhase,
  Mesocycle,
  MicrocycleTemplate,
  TaperProtocol,
  DeloadProtocol,
  PHASE_PARAMETERS,
  LOAD_PATTERNS,
  MICROCYCLE_TEMPLATES,
  TAPER_PROTOCOLS,
  DELOAD_PROTOCOLS,
  generateMacrocycle,
  generateMesocycle,
  getTaperProtocol,
  getDeloadProtocol,
} from './periodization';

// ==================== DAILY EXECUTION SYSTEM ====================
export {
  MorningCheckInput,
  MorningCheckResult,
  SessionRecommendation,
  PostSessionInput,
  PostSessionResult,
  DailySummary,
  processMorningCheck,
  processPostSession,
  generateDailySummary,
} from './daily-execution';
