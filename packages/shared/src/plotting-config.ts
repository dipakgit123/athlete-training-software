/**
 * PLOTTING CONFIGURATION
 * World-Class Athletics Performance System
 *
 * प्रत्येक test साठी plotting logic
 * Time-based tests साठी inverted Y-axis
 * Left vs Right comparison
 */

import { TEST_DEFINITIONS, TestDefinition, ValueDirection } from './event-test-mapping';

// ============================================
// PLOT TYPES
// ============================================

export type PlotType =
  | 'line'           // Time series progression
  | 'bar'            // Single session comparison
  | 'area'           // Volume/load tracking
  | 'scatter'        // Correlation analysis
  | 'bilateral'      // Left vs Right comparison
  | 'radar'          // Multi-metric profile
  | 'gauge'          // Single value with zones
  | 'heatmap';       // Calendar-based patterns

export interface PlotConfig {
  testId: string;
  plotType: PlotType;
  xAxis: AxisConfig;
  yAxis: AxisConfig;
  series: SeriesConfig[];
  zones?: ZoneConfig[];
  annotations?: AnnotationConfig[];
  comparison?: ComparisonConfig;
}

export interface AxisConfig {
  label: string;
  labelMarathi: string;
  unit: string;
  inverted: boolean;  // For time-based tests where lower is better
  min?: number;
  max?: number;
  tickInterval?: number;
}

export interface SeriesConfig {
  name: string;
  nameMarathi: string;
  color: string;
  dataKey: string;
  type: 'line' | 'bar' | 'area' | 'scatter';
  showTrend?: boolean;
  showBest?: boolean;
}

export interface ZoneConfig {
  name: string;
  nameMarathi: string;
  min: number;
  max: number;
  color: string;
  opacity: number;
}

export interface AnnotationConfig {
  type: 'line' | 'area' | 'point';
  value?: number;
  label: string;
  color: string;
}

export interface ComparisonConfig {
  type: 'bilateral' | 'benchmark' | 'personal_best' | 'previous';
  label: string;
  labelMarathi: string;
}

// ============================================
// COLOR PALETTE
// ============================================

export const PLOT_COLORS = {
  primary: '#2563eb',      // Blue
  secondary: '#7c3aed',    // Purple
  success: '#10b981',      // Green
  warning: '#f59e0b',      // Amber
  danger: '#ef4444',       // Red
  info: '#06b6d4',         // Cyan

  // Bilateral colors
  left: '#3b82f6',         // Blue
  right: '#f97316',        // Orange

  // Zone colors
  optimal: '#10b981',
  attention: '#f59e0b',
  concern: '#ef4444',

  // Trend colors
  improving: '#10b981',
  stable: '#6b7280',
  declining: '#ef4444',

  // Background zones
  zoneGreen: 'rgba(16, 185, 129, 0.1)',
  zoneYellow: 'rgba(245, 158, 11, 0.1)',
  zoneRed: 'rgba(239, 68, 68, 0.1)'
};

// ============================================
// DEFAULT PLOT CONFIGURATIONS
// ============================================

/**
 * Get plot configuration for a test
 * प्रत्येक test साठी योग्य plot config
 */
export function getPlotConfig(testId: string): PlotConfig {
  const test = TEST_DEFINITIONS[testId];
  if (!test) {
    return getDefaultPlotConfig(testId);
  }

  // Check if bilateral test
  if (test.hasLeftRight) {
    return getBilateralPlotConfig(test);
  }

  // Check if time-based (lower is better)
  if (test.valueDirection === 'lower_better') {
    return getTimeBasedPlotConfig(test);
  }

  // Check if optimal range test
  if (test.valueDirection === 'optimal_range') {
    return getOptimalRangePlotConfig(test);
  }

  // Default: higher is better
  return getHigherBetterPlotConfig(test);
}

/**
 * Time-based tests (sprint times, etc.)
 * जिथे कमी value चांगली आहे
 */
function getTimeBasedPlotConfig(test: TestDefinition): PlotConfig {
  return {
    testId: test.id,
    plotType: 'line',
    xAxis: {
      label: 'Date',
      labelMarathi: 'तारीख',
      unit: '',
      inverted: false
    },
    yAxis: {
      label: test.displayName,
      labelMarathi: test.displayName,
      unit: test.unit,
      inverted: true,  // Y-axis inverted - lower values appear higher
      tickInterval: getTickInterval(test)
    },
    series: [
      {
        name: 'Performance',
        nameMarathi: 'कामगिरी',
        color: PLOT_COLORS.primary,
        dataKey: 'value',
        type: 'line',
        showTrend: true,
        showBest: true
      }
    ],
    annotations: [
      {
        type: 'line',
        label: 'Personal Best',
        color: PLOT_COLORS.success
      }
    ]
  };
}

/**
 * Higher is better tests (strength, power, etc.)
 * जिथे जास्त value चांगली आहे
 */
function getHigherBetterPlotConfig(test: TestDefinition): PlotConfig {
  return {
    testId: test.id,
    plotType: 'line',
    xAxis: {
      label: 'Date',
      labelMarathi: 'तारीख',
      unit: '',
      inverted: false
    },
    yAxis: {
      label: test.displayName,
      labelMarathi: test.displayName,
      unit: test.unit,
      inverted: false,
      tickInterval: getTickInterval(test)
    },
    series: [
      {
        name: 'Performance',
        nameMarathi: 'कामगिरी',
        color: PLOT_COLORS.primary,
        dataKey: 'value',
        type: 'line',
        showTrend: true,
        showBest: true
      }
    ],
    annotations: [
      {
        type: 'line',
        label: 'Personal Best',
        color: PLOT_COLORS.success
      }
    ]
  };
}

/**
 * Optimal range tests (H:Q ratio, etc.)
 * जिथे specific range optimal आहे
 */
function getOptimalRangePlotConfig(test: TestDefinition): PlotConfig {
  const zones: ZoneConfig[] = [];

  if (test.optimalRange) {
    zones.push(
      {
        name: 'Below Optimal',
        nameMarathi: 'Optimal पेक्षा कमी',
        min: 0,
        max: test.optimalRange.min,
        color: PLOT_COLORS.concern,
        opacity: 0.1
      },
      {
        name: 'Optimal Zone',
        nameMarathi: 'Optimal Zone',
        min: test.optimalRange.min,
        max: test.optimalRange.max,
        color: PLOT_COLORS.optimal,
        opacity: 0.2
      },
      {
        name: 'Above Optimal',
        nameMarathi: 'Optimal पेक्षा जास्त',
        min: test.optimalRange.max,
        max: test.optimalRange.max * 1.5,
        color: PLOT_COLORS.attention,
        opacity: 0.1
      }
    );
  }

  return {
    testId: test.id,
    plotType: 'line',
    xAxis: {
      label: 'Date',
      labelMarathi: 'तारीख',
      unit: '',
      inverted: false
    },
    yAxis: {
      label: test.displayName,
      labelMarathi: test.displayName,
      unit: test.unit,
      inverted: false,
      tickInterval: getTickInterval(test)
    },
    series: [
      {
        name: 'Value',
        nameMarathi: 'मूल्य',
        color: PLOT_COLORS.primary,
        dataKey: 'value',
        type: 'line',
        showTrend: true
      }
    ],
    zones
  };
}

/**
 * Bilateral comparison tests (left vs right)
 * Left vs Right comparison
 */
function getBilateralPlotConfig(test: TestDefinition): PlotConfig {
  return {
    testId: test.id,
    plotType: 'bilateral',
    xAxis: {
      label: 'Date',
      labelMarathi: 'तारीख',
      unit: '',
      inverted: false
    },
    yAxis: {
      label: test.displayName,
      labelMarathi: test.displayName,
      unit: test.unit,
      inverted: test.valueDirection === 'lower_better',
      tickInterval: getTickInterval(test)
    },
    series: [
      {
        name: 'Left',
        nameMarathi: 'डावा',
        color: PLOT_COLORS.left,
        dataKey: 'left',
        type: 'line',
        showTrend: true
      },
      {
        name: 'Right',
        nameMarathi: 'उजवा',
        color: PLOT_COLORS.right,
        dataKey: 'right',
        type: 'line',
        showTrend: true
      }
    ],
    comparison: {
      type: 'bilateral',
      label: 'Asymmetry',
      labelMarathi: 'असममितता'
    },
    zones: [
      {
        name: 'Acceptable Asymmetry',
        nameMarathi: 'स्वीकार्य असममितता',
        min: 0,
        max: 10,
        color: PLOT_COLORS.optimal,
        opacity: 0.1
      },
      {
        name: 'Attention Zone',
        nameMarathi: 'लक्ष द्या',
        min: 10,
        max: 15,
        color: PLOT_COLORS.attention,
        opacity: 0.1
      },
      {
        name: 'Concern Zone',
        nameMarathi: 'चिंताजनक',
        min: 15,
        max: 100,
        color: PLOT_COLORS.concern,
        opacity: 0.1
      }
    ]
  };
}

function getDefaultPlotConfig(testId: string): PlotConfig {
  return {
    testId,
    plotType: 'line',
    xAxis: {
      label: 'Date',
      labelMarathi: 'तारीख',
      unit: '',
      inverted: false
    },
    yAxis: {
      label: 'Value',
      labelMarathi: 'मूल्य',
      unit: '',
      inverted: false
    },
    series: [
      {
        name: 'Value',
        nameMarathi: 'मूल्य',
        color: PLOT_COLORS.primary,
        dataKey: 'value',
        type: 'line'
      }
    ]
  };
}

function getTickInterval(test: TestDefinition): number {
  switch (test.unit) {
    case 'sec':
      return 0.1;
    case 'ms':
      return 10;
    case 'kg':
      return 5;
    case 'cm':
      return 5;
    case 'm':
      return 1;
    case '%':
      return 5;
    case 'N':
      return 50;
    case 'ratio':
      return 0.1;
    default:
      return 1;
  }
}

// ============================================
// MULTI-TEST RADAR CHART CONFIG
// ============================================

export interface RadarChartConfig {
  title: string;
  titleMarathi: string;
  metrics: {
    testId: string;
    label: string;
    labelMarathi: string;
    maxValue: number;
    benchmarks?: {
      elite: number;
      good: number;
      average: number;
    };
  }[];
}

/**
 * Get radar chart config for athlete profile
 * Athlete profile साठी radar chart
 */
export function getSprintProfileRadar(): RadarChartConfig {
  return {
    title: 'Sprint Performance Profile',
    titleMarathi: 'Sprint Performance Profile',
    metrics: [
      {
        testId: 'reaction_time',
        label: 'Reaction',
        labelMarathi: 'Reaction',
        maxValue: 100,
        benchmarks: { elite: 90, good: 75, average: 60 }
      },
      {
        testId: 'acceleration_30m_time',
        label: 'Acceleration',
        labelMarathi: 'Acceleration',
        maxValue: 100,
        benchmarks: { elite: 90, good: 75, average: 60 }
      },
      {
        testId: 'max_velocity_60m',
        label: 'Max Velocity',
        labelMarathi: 'Max Velocity',
        maxValue: 100,
        benchmarks: { elite: 90, good: 75, average: 60 }
      },
      {
        testId: 'speed_reserve',
        label: 'Speed Endurance',
        labelMarathi: 'Speed Endurance',
        maxValue: 100,
        benchmarks: { elite: 90, good: 75, average: 60 }
      },
      {
        testId: 'cmj_height',
        label: 'Power',
        labelMarathi: 'Power',
        maxValue: 100,
        benchmarks: { elite: 90, good: 75, average: 60 }
      },
      {
        testId: 'squat_1rm',
        label: 'Strength',
        labelMarathi: 'Strength',
        maxValue: 100,
        benchmarks: { elite: 90, good: 75, average: 60 }
      }
    ]
  };
}

export function getPowerProfileRadar(): RadarChartConfig {
  return {
    title: 'Power Profile',
    titleMarathi: 'Power Profile',
    metrics: [
      {
        testId: 'cmj_height',
        label: 'CMJ',
        labelMarathi: 'CMJ',
        maxValue: 100
      },
      {
        testId: 'squat_jump_height',
        label: 'SJ',
        labelMarathi: 'SJ',
        maxValue: 100
      },
      {
        testId: 'rsi_bilateral',
        label: 'RSI',
        labelMarathi: 'RSI',
        maxValue: 100
      },
      {
        testId: 'broad_jump',
        label: 'Broad Jump',
        labelMarathi: 'Broad Jump',
        maxValue: 100
      },
      {
        testId: 'imtp_peak_force',
        label: 'IMTP',
        labelMarathi: 'IMTP',
        maxValue: 100
      }
    ]
  };
}

// ============================================
// CHART DATA TRANSFORMATION
// ============================================

export interface TestDataPoint {
  date: Date;
  value: number;
  left?: number;
  right?: number;
  attempt?: number;
  notes?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension?: number;
    fill?: boolean;
  }[];
  annotations?: {
    type: string;
    yMin?: number;
    yMax?: number;
    backgroundColor?: string;
    label?: { content: string };
  }[];
}

/**
 * Transform test data for charting
 * Test data चे chart data मध्ये रूपांतर
 */
export function transformForChart(
  data: TestDataPoint[],
  config: PlotConfig
): ChartData {
  const sortedData = [...data].sort((a, b) => a.date.getTime() - b.date.getTime());

  const labels = sortedData.map(d =>
    d.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  );

  const datasets = config.series.map(series => ({
    label: series.name,
    data: sortedData.map(d => {
      if (series.dataKey === 'left') return d.left ?? 0;
      if (series.dataKey === 'right') return d.right ?? 0;
      return d.value;
    }),
    borderColor: series.color,
    backgroundColor: series.color + '20',
    tension: 0.3,
    fill: series.type === 'area'
  }));

  const annotations = config.zones?.map(zone => ({
    type: 'box',
    yMin: zone.min,
    yMax: zone.max,
    backgroundColor: zone.color + Math.round(zone.opacity * 255).toString(16).padStart(2, '0'),
    label: { content: zone.name }
  }));

  return { labels, datasets, annotations };
}

/**
 * Calculate bilateral asymmetry
 * Left vs Right असममितता गणना
 */
export function calculateAsymmetry(left: number, right: number): {
  percentage: number;
  dominantSide: 'left' | 'right' | 'equal';
  status: 'acceptable' | 'attention' | 'concern';
} {
  const max = Math.max(left, right);
  const diff = Math.abs(left - right);
  const percentage = (diff / max) * 100;

  let dominantSide: 'left' | 'right' | 'equal';
  if (left > right * 1.02) dominantSide = 'left';
  else if (right > left * 1.02) dominantSide = 'right';
  else dominantSide = 'equal';

  let status: 'acceptable' | 'attention' | 'concern';
  if (percentage <= 10) status = 'acceptable';
  else if (percentage <= 15) status = 'attention';
  else status = 'concern';

  return { percentage, dominantSide, status };
}

/**
 * Get trend indicator for display
 * Trend indicator
 */
export function getTrendIndicator(
  currentValue: number,
  previousValue: number,
  valueDirection: ValueDirection
): {
  direction: 'up' | 'down' | 'stable';
  isPositive: boolean;
  percentChange: number;
  color: string;
  icon: string;
} {
  const change = currentValue - previousValue;
  const percentChange = (change / previousValue) * 100;

  let direction: 'up' | 'down' | 'stable';
  if (Math.abs(percentChange) < 1) direction = 'stable';
  else if (change > 0) direction = 'up';
  else direction = 'down';

  let isPositive: boolean;
  if (valueDirection === 'lower_better') {
    isPositive = direction === 'down';
  } else if (valueDirection === 'higher_better') {
    isPositive = direction === 'up';
  } else {
    isPositive = direction === 'stable';
  }

  const color = isPositive ? PLOT_COLORS.improving :
    direction === 'stable' ? PLOT_COLORS.stable : PLOT_COLORS.declining;

  const icon = direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→';

  return {
    direction,
    isPositive,
    percentChange: Math.abs(percentChange),
    color,
    icon
  };
}

// ============================================
// EXPORT HELPERS
// ============================================

export function formatTestValue(value: number, unit: string): string {
  switch (unit) {
    case 'sec':
      return value.toFixed(2) + 's';
    case 'ms':
      return Math.round(value) + 'ms';
    case 'kg':
      return value.toFixed(1) + 'kg';
    case 'cm':
      return Math.round(value) + 'cm';
    case 'm':
      return value.toFixed(2) + 'm';
    case '%':
      return value.toFixed(1) + '%';
    case 'N':
      return Math.round(value) + 'N';
    case 'ratio':
      return value.toFixed(2);
    case 'score':
      return value.toFixed(1) + '/10';
    case 'm/s':
      return value.toFixed(2) + 'm/s';
    case 'degrees':
      return Math.round(value) + '°';
    case 'watts':
      return Math.round(value) + 'W';
    case 'reps':
      return Math.round(value) + ' reps';
    default:
      return value.toString();
  }
}
