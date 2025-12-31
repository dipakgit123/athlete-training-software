/**
 * Readiness Gauge Component
 * Circular gauge showing athlete readiness score
 */

'use client';

import React from 'react';

interface ReadinessGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showCategory?: boolean;
}

const SIZE_CONFIG = {
  sm: { width: 80, strokeWidth: 6, fontSize: 16 },
  md: { width: 120, strokeWidth: 8, fontSize: 24 },
  lg: { width: 160, strokeWidth: 10, fontSize: 32 },
};

function getScoreColor(score: number): string {
  if (score >= 85) return '#22c55e'; // green-500
  if (score >= 70) return '#84cc16'; // lime-500
  if (score >= 55) return '#eab308'; // yellow-500
  if (score >= 40) return '#f97316'; // orange-500
  return '#ef4444'; // red-500
}

function getCategory(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Moderate';
  if (score >= 40) return 'Poor';
  return 'Critical';
}

function getCategoryColor(score: number): string {
  if (score >= 85) return 'text-green-500';
  if (score >= 70) return 'text-lime-500';
  if (score >= 55) return 'text-yellow-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
}

export function ReadinessGauge({
  score,
  size = 'md',
  showLabel = true,
  showCategory = false,
}: ReadinessGaugeProps) {
  const config = SIZE_CONFIG[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const strokeDashoffset = circumference - progress;

  const color = getScoreColor(score);
  const category = getCategory(score);
  const categoryColor = getCategoryColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: config.width, height: config.width }}>
        {/* Background circle */}
        <svg
          className="transform -rotate-90"
          width={config.width}
          height={config.width}
        >
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={config.strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Score text */}
        {showLabel && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ fontSize: config.fontSize }}
          >
            <span className="font-bold" style={{ color }}>
              {score}
            </span>
          </div>
        )}
      </div>

      {/* Category label */}
      {showCategory && (
        <span className={`mt-2 text-sm font-medium ${categoryColor}`}>
          {category}
        </span>
      )}
    </div>
  );
}

export default ReadinessGauge;
