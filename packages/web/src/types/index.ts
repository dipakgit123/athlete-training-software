/**
 * Frontend Type Definitions
 * Elite Athletics Performance System
 */

// ==================== ATHLETE TYPES ====================

export interface AthleteListItem {
  id: string;
  name: string;
  profileImage?: string;
  event: string;
  category: string;
  readinessScore: number;
  readinessCategory: 'excellent' | 'good' | 'moderate' | 'poor' | 'critical';
  hasAlerts: boolean;
  alertCount: number;
  todaySessionStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

export interface AthleteProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE';
  category: string;
  primaryEvent: string;
  secondaryEvents: string[];
  personalBests: PersonalBest[];
  coachId: string;
  coachName: string;
  currentPhase: string;
  nextCompetition?: {
    name: string;
    date: Date;
    daysOut: number;
  };
}

export interface PersonalBest {
  event: string;
  performance: string;
  date: Date;
  venue?: string;
}

// ==================== DASHBOARD TYPES ====================

export interface DashboardStats {
  totalAthletes: number;
  athletesReady: number;
  athletesCaution: number;
  athletesRest: number;
  todaySessions: number;
  completedSessions: number;
  activeAlerts: number;
  weeklyLoadAvg: number;
  injuryCount: number;
}

export interface AlertItem {
  id: string;
  athleteId: string;
  athleteName: string;
  level: 'green' | 'yellow' | 'orange' | 'red';
  category: string;
  message: string;
  action: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface TodaySession {
  id: string;
  time: string;
  type: string;
  athletes: {
    id: string;
    name: string;
    readinessScore: number;
  }[];
  location?: string;
  status: 'upcoming' | 'in_progress' | 'completed';
}

// ==================== READINESS TYPES ====================

export interface ReadinessDisplayData {
  overallScore: number;
  category: 'excellent' | 'good' | 'moderate' | 'poor' | 'critical';
  components: {
    name: string;
    score: number;
    status: 'good' | 'attention' | 'concern';
  }[];
  limitingFactors: string[];
  recommendations: string[];
  trend: 'improving' | 'stable' | 'declining';
}

export interface WellnessFormData {
  sleepHours: number;
  sleepQuality: number;
  restingHR: number;
  hrvRmssd: number;
  perceivedFatigue: number;
  muscleSoreness: number;
  stressLevel: number;
  mood: number;
  hydrationStatus: number;
  nutritionCompliance: number;
  specificSoreness?: {
    bodyPart: string;
    severity: number;
    side?: 'left' | 'right' | 'both';
  }[];
  notes?: string;
}

// ==================== LOAD MONITORING TYPES ====================

export interface LoadChartData {
  date: string;
  acuteLoad: number;
  chronicLoad: number;
  acwr: number;
  dailyLoad: number;
}

export interface LoadSummary {
  currentACWR: number;
  acwrStatus: 'undertraining' | 'optimal' | 'attention' | 'danger';
  weeklyLoad: number;
  weeklyLoadChange: number;
  monotony: number;
  strain: number;
  injuryRisk: number;
  recommendation: string;
}

// ==================== TRAINING TYPES ====================

export interface SessionDisplayData {
  id: string;
  date: Date;
  type: string;
  phase: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'modified';
  totalDuration: number;
  warmup: WarmupDisplayData;
  mainWorkout: WorkoutDisplayData;
  strength?: StrengthDisplayData;
  cooldown: CooldownDisplayData;
  adjustments?: {
    intensityChange: number;
    volumeChange: number;
    reason: string;
  };
  notes: string[];
}

export interface WarmupDisplayData {
  duration: number;
  phases: {
    name: string;
    duration: number;
    exercises: {
      name: string;
      details: string;
    }[];
  }[];
}

export interface WorkoutDisplayData {
  duration: number;
  totalVolume: number;
  averageIntensity: number;
  sets: {
    exercise: string;
    reps: number;
    distance?: number;
    intensity: number;
    recovery: number;
    notes?: string;
    completed?: boolean;
    actualValue?: number | string;
  }[];
}

export interface StrengthDisplayData {
  duration: number;
  phase: string;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    intensity: number;
    rest: number;
    completed?: boolean;
  }[];
}

export interface CooldownDisplayData {
  duration: number;
  exercises: {
    name: string;
    duration?: number;
    notes?: string;
  }[];
}

// ==================== BLOOD ANALYSIS TYPES ====================

export interface BloodReportDisplay {
  testDate: Date;
  overallStatus: 'optimal' | 'attention' | 'concern';
  markerCount: {
    optimal: number;
    attention: number;
    concern: number;
  };
  flaggedMarkers: BloodMarkerDisplay[];
  keyMarkers: BloodMarkerDisplay[];
  recommendations: string[];
}

export interface BloodMarkerDisplay {
  name: string;
  value: number;
  unit: string;
  status: 'low' | 'normal' | 'high' | 'critical';
  referenceRange: string;
  athleticOptimal: string;
  trend?: 'improving' | 'stable' | 'declining';
  previousValue?: number;
}

// ==================== PERIODIZATION TYPES ====================

export interface MacrocycleDisplay {
  id: string;
  year: number;
  startDate: Date;
  endDate: Date;
  totalWeeks: number;
  currentWeek: number;
  currentPhase: PhaseDisplay;
  phases: PhaseDisplay[];
  competitions: CompetitionDisplay[];
  goals: string[];
}

export interface PhaseDisplay {
  phase: string;
  name: string;
  startDate: Date;
  endDate: Date;
  weekStart: number;
  weekEnd: number;
  isCurrent: boolean;
  progress: number;
  color: string;
}

export interface CompetitionDisplay {
  id: string;
  name: string;
  date: Date;
  daysOut: number;
  priority: 'A' | 'B' | 'C';
  event: string;
  targetPerformance?: string;
  location?: string;
}

export interface WeekDisplay {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  phase: string;
  loadPercent: number;
  days: DayDisplay[];
  isCurrentWeek: boolean;
  totalLoad: number;
}

export interface DayDisplay {
  date: Date;
  dayOfWeek: string;
  sessions: {
    time: 'AM' | 'PM';
    type: string;
    duration: number;
    intensity: number;
    focus: string[];
  }[];
  loadCategory: 'high' | 'medium' | 'low' | 'recovery' | 'off';
  isToday: boolean;
  hasCompetition: boolean;
}

// ==================== CALENDAR TYPES ====================

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'session' | 'competition' | 'test' | 'rest' | 'travel';
  athleteIds: string[];
  details?: string;
  color: string;
}

// ==================== REPORT TYPES ====================

export interface DailyReportData {
  date: Date;
  athleteId: string;
  athleteName: string;
  morningReadiness: number;
  sessionsCompleted: number;
  sessionsPlanned: number;
  totalLoad: number;
  averageRpe: number;
  recoveryStatus: 'good' | 'attention' | 'concern';
  highlights: string[];
  concerns: string[];
  tomorrowOutlook: string;
}

export interface WeeklyReportData {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  athleteId: string;
  athleteName: string;
  totalLoad: number;
  loadTrend: number;
  acwrAverage: number;
  sessionsCompleted: number;
  sessionsPlanned: number;
  completionRate: number;
  readinessAverage: number;
  keyAchievements: string[];
  areasOfConcern: string[];
  nextWeekFocus: string[];
}

// ==================== FORM TYPES ====================

export interface PostSessionFormData {
  sessionRpe: number;
  sessionDuration: number;
  completionPercentage: number;
  performanceRating: number;
  technicalRating: number;
  mentalState: number;
  fatiguePostSession: number;
  painReports: {
    bodyPart: string;
    side?: 'left' | 'right' | 'both';
    severity: number;
    type: 'muscle' | 'joint' | 'tendon' | 'other';
    newOrExisting: 'new' | 'existing' | 'worsened' | 'improved';
    description?: string;
  }[];
  bestMoments?: string;
  challengesFaced?: string;
  notes?: string;
}

// ==================== CHART TYPES ====================

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface MultiSeriesChartData {
  date: string;
  [key: string]: number | string;
}

// ==================== UI COMPONENT PROPS ====================

export interface ReadinessGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export interface AlertCardProps {
  alert: AlertItem;
  onAcknowledge?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export interface AthleteCardProps {
  athlete: AthleteListItem;
  onClick?: (id: string) => void;
  compact?: boolean;
}

export interface LoadChartProps {
  data: LoadChartData[];
  height?: number;
  showACWR?: boolean;
  showZones?: boolean;
}

export interface SessionCardProps {
  session: SessionDisplayData;
  onStart?: () => void;
  onComplete?: () => void;
  onModify?: () => void;
}
