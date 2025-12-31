'use client';

/**
 * TEST PERFORMANCE CHART
 * World-Class Athletics Performance System
 *
 * प्रत्येक test साठी performance plot
 * Time-based tests साठी inverted Y-axis
 * Left vs Right comparison
 */

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  BarChart,
  Bar
} from 'recharts';
import {
  TEST_DEFINITIONS,
  getPlotConfig,
  PLOT_COLORS,
  formatTestValue,
  getTrendIndicator,
  calculateAsymmetry
} from '@athlete-system/shared';

// ============================================
// TYPES
// ============================================

export interface TestDataPoint {
  date: string;
  value: number;
  left?: number;
  right?: number;
  attempt?: number;
  isBest?: boolean;
  notes?: string;
}

interface TestPerformanceChartProps {
  testId: string;
  data: TestDataPoint[];
  height?: number;
  showTrend?: boolean;
  showBest?: boolean;
  showZones?: boolean;
  personalBest?: number;
  benchmarks?: {
    elite?: number;
    good?: number;
    average?: number;
  };
}

// ============================================
// HELPER COMPONENTS
// ============================================

const CustomTooltip = ({ active, payload, label, test }: any) => {
  if (!active || !payload || !payload.length) return null;

  const testDef = TEST_DEFINITIONS[test];
  const unit = testDef?.unit || '';

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
      <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-medium">
            {formatTestValue(entry.value, unit)}
          </span>
        </div>
      ))}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function TestPerformanceChart({
  testId,
  data,
  height = 300,
  showTrend = true,
  showBest = true,
  showZones = true,
  personalBest,
  benchmarks
}: TestPerformanceChartProps) {
  const test = TEST_DEFINITIONS[testId];
  const plotConfig = useMemo(() => getPlotConfig(testId), [testId]);

  if (!test || !data.length) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available for this test</p>
      </div>
    );
  }

  // Calculate statistics
  const stats = useMemo(() => {
    const values = data.map(d => d.value).filter(v => !isNaN(v));
    const leftValues = data.map(d => d.left).filter((v): v is number => v !== undefined);
    const rightValues = data.map(d => d.right).filter((v): v is number => v !== undefined);

    const current = values[values.length - 1];
    const previous = values.length > 1 ? values[values.length - 2] : current;
    const best = test.valueDirection === 'lower_better'
      ? Math.min(...values)
      : Math.max(...values);
    const average = values.reduce((a, b) => a + b, 0) / values.length;

    // Calculate trend
    const trend = getTrendIndicator(current, previous, test.valueDirection);

    // Calculate asymmetry for bilateral tests
    let asymmetry = null;
    if (test.hasLeftRight && leftValues.length && rightValues.length) {
      const lastLeft = leftValues[leftValues.length - 1];
      const lastRight = rightValues[rightValues.length - 1];
      asymmetry = calculateAsymmetry(lastLeft, lastRight);
    }

    return { current, previous, best, average, trend, asymmetry };
  }, [data, test]);

  // Calculate Y-axis domain
  const yDomain = useMemo(() => {
    const values = data.flatMap(d => [d.value, d.left, d.right].filter((v): v is number => v !== undefined));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;

    if (test.valueDirection === 'lower_better') {
      return [Math.max(0, min - padding), max + padding];
    }
    return [Math.max(0, min - padding), max + padding];
  }, [data, test.valueDirection]);

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{test.displayName}</h3>
          <p className="text-sm text-gray-500">{test.description}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatTestValue(stats.current, test.unit)}
            </span>
            <span className={`text-lg ${stats.trend.color}`}>
              {stats.trend.icon} {stats.trend.percentChange.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {stats.trend.isPositive ? 'Improving' : stats.trend.direction === 'stable' ? 'Stable' : 'Declining'}
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500">Current</div>
          <div className="font-semibold">{formatTestValue(stats.current, test.unit)}</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500">Best</div>
          <div className="font-semibold text-green-600">
            {formatTestValue(stats.best, test.unit)}
          </div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500">Average</div>
          <div className="font-semibold">{formatTestValue(stats.average, test.unit)}</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500">Tests</div>
          <div className="font-semibold">{data.length}</div>
        </div>
      </div>

      {/* Asymmetry Alert for Bilateral Tests */}
      {stats.asymmetry && (
        <div className={`mb-4 p-3 rounded-lg ${
          stats.asymmetry.status === 'acceptable' ? 'bg-green-50' :
          stats.asymmetry.status === 'attention' ? 'bg-yellow-50' :
          'bg-red-50'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${
              stats.asymmetry.status === 'acceptable' ? 'text-green-800' :
              stats.asymmetry.status === 'attention' ? 'text-yellow-800' :
              'text-red-800'
            }`}>
              Bilateral Asymmetry: {stats.asymmetry.percentage.toFixed(1)}%
            </span>
            <span className="text-sm">
              Dominant: {stats.asymmetry.dominantSide}
            </span>
          </div>
          {stats.asymmetry.status !== 'acceptable' && (
            <p className="text-xs mt-1">
              {stats.asymmetry.status === 'attention'
                ? 'Monitor asymmetry and include corrective exercises'
                : 'High asymmetry detected - injury risk elevated'}
            </p>
          )}
        </div>
      )}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        {test.hasLeftRight ? (
          /* Bilateral Chart */
          <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
              }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              domain={yDomain}
              reversed={test.valueDirection === 'lower_better'}
              tickFormatter={(value) => formatTestValue(value, test.unit)}
            />
            <Tooltip content={<CustomTooltip test={testId} />} />
            <Legend />

            {/* Optimal Range Zones */}
            {showZones && test.optimalRange && (
              <>
                <ReferenceArea
                  y1={test.optimalRange.min}
                  y2={test.optimalRange.max}
                  fill={PLOT_COLORS.zoneGreen}
                  fillOpacity={0.3}
                />
              </>
            )}

            {/* Left Line */}
            <Line
              type="monotone"
              dataKey="left"
              name="Left / डावा"
              stroke={PLOT_COLORS.left}
              strokeWidth={2}
              dot={{ fill: PLOT_COLORS.left, r: 4 }}
              activeDot={{ r: 6 }}
            />

            {/* Right Line */}
            <Line
              type="monotone"
              dataKey="right"
              name="Right / उजवा"
              stroke={PLOT_COLORS.right}
              strokeWidth={2}
              dot={{ fill: PLOT_COLORS.right, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        ) : (
          /* Single Value Chart */
          <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
              }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              domain={yDomain}
              reversed={test.valueDirection === 'lower_better'}
              tickFormatter={(value) => formatTestValue(value, test.unit)}
            />
            <Tooltip content={<CustomTooltip test={testId} />} />

            {/* Optimal Range Zones */}
            {showZones && test.optimalRange && (
              <ReferenceArea
                y1={test.optimalRange.min}
                y2={test.optimalRange.max}
                fill={PLOT_COLORS.zoneGreen}
                fillOpacity={0.3}
                label={{ value: 'Optimal', fill: '#059669', fontSize: 10 }}
              />
            )}

            {/* Personal Best Line */}
            {showBest && personalBest && (
              <ReferenceLine
                y={personalBest}
                stroke={PLOT_COLORS.success}
                strokeDasharray="5 5"
                label={{ value: 'PB', fill: PLOT_COLORS.success, fontSize: 12 }}
              />
            )}

            {/* Benchmark Lines */}
            {benchmarks?.elite && (
              <ReferenceLine
                y={benchmarks.elite}
                stroke={PLOT_COLORS.warning}
                strokeDasharray="3 3"
                label={{ value: 'Elite', fill: PLOT_COLORS.warning, fontSize: 10 }}
              />
            )}

            {/* Main Line */}
            <Line
              type="monotone"
              dataKey="value"
              name={test.displayName}
              stroke={PLOT_COLORS.primary}
              strokeWidth={2}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                const isBestPoint = payload.value === stats.best;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isBestPoint ? 6 : 4}
                    fill={isBestPoint ? PLOT_COLORS.success : PLOT_COLORS.primary}
                    stroke={isBestPoint ? PLOT_COLORS.success : 'white'}
                    strokeWidth={isBestPoint ? 2 : 1}
                  />
                );
              }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>

      {/* Legend for Value Direction */}
      <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className={`px-2 py-1 rounded ${
            test.valueDirection === 'lower_better' ? 'bg-green-100 text-green-800' :
            test.valueDirection === 'higher_better' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {test.valueDirection === 'lower_better'
              ? '↓ Lower is Better (graph inverted)'
              : test.valueDirection === 'higher_better'
              ? '↑ Higher is Better'
              : '◎ Optimal Range'}
          </span>
        </div>
        <div>
          Unit: <strong>{test.unit}</strong>
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPARISON CHART COMPONENT
// ============================================

export function TestComparisonChart({
  testId,
  data,
  compareWith,
  height = 300
}: {
  testId: string;
  data: TestDataPoint[];
  compareWith: { label: string; data: TestDataPoint[] };
  height?: number;
}) {
  const test = TEST_DEFINITIONS[testId];

  if (!test) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h3 className="font-semibold text-gray-900 mb-4">
        {test.displayName} - Comparison
      </h3>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            type="category"
            allowDuplicatedCategory={false}
          />
          <YAxis
            reversed={test.valueDirection === 'lower_better'}
            tickFormatter={(value) => formatTestValue(value, test.unit)}
          />
          <Tooltip content={<CustomTooltip test={testId} />} />
          <Legend />

          <Line
            data={data}
            type="monotone"
            dataKey="value"
            name="Current"
            stroke={PLOT_COLORS.primary}
            strokeWidth={2}
          />
          <Line
            data={compareWith.data}
            type="monotone"
            dataKey="value"
            name={compareWith.label}
            stroke={PLOT_COLORS.secondary}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
