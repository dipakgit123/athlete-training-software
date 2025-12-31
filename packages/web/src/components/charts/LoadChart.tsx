/**
 * Load Monitoring Chart Component
 * Displays ACWR trends with acute/chronic load comparison
 */

'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Legend,
} from 'recharts';

interface LoadChartData {
  date: string;
  acuteLoad: number;
  chronicLoad: number;
  acwr: number;
  dailyLoad: number;
}

interface LoadChartProps {
  data: LoadChartData[];
  height?: number;
  showACWR?: boolean;
  showZones?: boolean;
  showLegend?: boolean;
}

// ACWR Zone colors
const ZONES = {
  undertraining: { min: 0, max: 0.8, color: '#fef3c7', label: 'Undertraining' },
  optimal: { min: 0.8, max: 1.3, color: '#d1fae5', label: 'Optimal' },
  attention: { min: 1.3, max: 1.5, color: '#fef3c7', label: 'Attention' },
  danger: { min: 1.5, max: 2.0, color: '#fee2e2', label: 'Danger' },
};

export function LoadChart({
  data,
  height = 300,
  showACWR = true,
  showZones = true,
  showLegend = true,
}: LoadChartProps) {
  // Calculate max values for scaling
  const maxLoad = Math.max(
    ...data.map((d) => Math.max(d.acuteLoad, d.chronicLoad))
  );
  const maxACWR = Math.max(...data.map((d) => d.acwr), 2);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          {/* X-Axis - Dates */}
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }}
          />

          {/* Left Y-Axis - Load */}
          <YAxis
            yAxisId="load"
            domain={[0, maxLoad * 1.1]}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value}`}
            label={{
              value: 'Load (AU)',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 12 },
            }}
          />

          {/* Right Y-Axis - ACWR (if enabled) */}
          {showACWR && (
            <YAxis
              yAxisId="acwr"
              orientation="right"
              domain={[0, maxACWR]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toFixed(1)}
              label={{
                value: 'ACWR',
                angle: 90,
                position: 'insideRight',
                style: { fontSize: 12 },
              }}
            />
          )}

          {/* ACWR Zone Reference Areas */}
          {showACWR && showZones && (
            <>
              <ReferenceArea
                yAxisId="acwr"
                y1={ZONES.optimal.min}
                y2={ZONES.optimal.max}
                fill={ZONES.optimal.color}
                fillOpacity={0.5}
              />
              <ReferenceLine
                yAxisId="acwr"
                y={1.0}
                stroke="#22c55e"
                strokeDasharray="5 5"
                label={{
                  value: 'Optimal',
                  position: 'right',
                  style: { fontSize: 10, fill: '#22c55e' },
                }}
              />
              <ReferenceLine
                yAxisId="acwr"
                y={1.5}
                stroke="#ef4444"
                strokeDasharray="5 5"
                label={{
                  value: 'Danger',
                  position: 'right',
                  style: { fontSize: 10, fill: '#ef4444' },
                }}
              />
            </>
          )}

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'acwr') return [value.toFixed(2), 'ACWR'];
              return [Math.round(value), name];
            }}
            labelFormatter={(label) => {
              const date = new Date(label);
              return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });
            }}
          />

          {/* Legend */}
          {showLegend && <Legend />}

          {/* Acute Load Line */}
          <Line
            yAxisId="load"
            type="monotone"
            dataKey="acuteLoad"
            name="Acute Load"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />

          {/* Chronic Load Line */}
          <Line
            yAxisId="load"
            type="monotone"
            dataKey="chronicLoad"
            name="Chronic Load"
            stroke="#6b7280"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 4 }}
          />

          {/* ACWR Line */}
          {showACWR && (
            <Line
              yAxisId="acwr"
              type="monotone"
              dataKey="acwr"
              name="ACWR"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* Zone Legend */}
      {showACWR && showZones && (
        <div className="flex justify-center gap-4 mt-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: ZONES.undertraining.color }} />
            <span className="text-xs text-gray-600">&lt;0.8 Undertraining</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: ZONES.optimal.color }} />
            <span className="text-xs text-gray-600">0.8-1.3 Optimal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: ZONES.attention.color }} />
            <span className="text-xs text-gray-600">1.3-1.5 Caution</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: ZONES.danger.color }} />
            <span className="text-xs text-gray-600">&gt;1.5 Danger</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoadChart;
