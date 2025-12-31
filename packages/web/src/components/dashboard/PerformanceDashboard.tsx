'use client';

import React, { useMemo } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { Target, TrendingUp, Award, Zap, Activity, Timer, AlertTriangle, CheckCircle, ArrowRight, Gauge } from 'lucide-react';
import { TEST_DEFINITIONS } from '@athlete-system/shared';

interface TestResult {
  value: string;
  date: string;
}

interface PerformanceDashboardProps {
  athleteName: string;
  primaryEvent: string;
  testResults: Record<string, TestResult>;
  targetPB?: string;
  currentPB?: string;
  goals?: {
    shortTerm?: string;
    longTerm?: string;
  };
}

// Category colors
const CATEGORY_COLORS: Record<string, string> = {
  strength: '#ef4444',
  sprint: '#3b82f6',
  reaction: '#f59e0b',
  power: '#8b5cf6',
  biomechanics: '#10b981',
  injury_prevention: '#ec4899',
  core: '#06b6d4',
};

// Elite benchmarks
const ELITE_BENCHMARKS: Record<string, number> = {
  squat_1rm: 200,
  deadlift_1rm: 230,
  vertical_jump_cm: 80,
  sprint_100m_time: 9.8,
  reaction_time: 0.12,
  sprint_10m_time: 1.6,
  flying_10m: 0.85,
  broad_jump: 3.5,
  plank_hold: 240,
  nordic_hamstring: 40,
};

// Target benchmarks
const TARGET_BENCHMARKS: Record<string, { elite: number; good: number; average: number }> = {
  sprint_10m_time: { elite: 1.65, good: 1.75, average: 1.85 },
  sprint_30m_time: { elite: 3.8, good: 4.0, average: 4.3 },
  sprint_60m_time: { elite: 6.5, good: 6.9, average: 7.3 },
  sprint_100m_time: { elite: 10.0, good: 10.5, average: 11.0 },
  squat_1rm: { elite: 200, good: 170, average: 140 },
  deadlift_1rm: { elite: 230, good: 200, average: 170 },
  vertical_jump_cm: { elite: 75, good: 65, average: 55 },
  broad_jump: { elite: 3.3, good: 3.0, average: 2.7 },
  reaction_time: { elite: 0.13, good: 0.15, average: 0.18 },
};

// Compact Circular Gauge
function MiniGauge({ value, max, label, unit, color }: {
  value: number; max: number; label: string; unit: string; color: string;
}) {
  const percentage = Math.min(100, (value / max) * 100);
  const circumference = 2 * Math.PI * 32;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center p-2">
      <div className="relative w-16 h-16">
        <svg className="transform -rotate-90" width={64} height={64} viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="32" fill="none" stroke="#e5e7eb" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="32" fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-gray-900">{value}</span>
          <span className="text-[10px] text-gray-500">{unit}</span>
        </div>
      </div>
      <p className="text-xs text-gray-600 mt-1 text-center leading-tight">{label}</p>
    </div>
  );
}

// Status Badge
function StatusBadge({ status }: { status: 'elite' | 'good' | 'average' | 'needs_work' | null }) {
  if (!status) return null;
  const styles = {
    elite: 'bg-green-100 text-green-700 border-green-200',
    good: 'bg-blue-100 text-blue-700 border-blue-200',
    average: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    needs_work: 'bg-red-100 text-red-700 border-red-200',
  };
  const labels = { elite: 'Elite', good: 'Good', average: 'Avg', needs_work: 'Improve' };
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export function PerformanceDashboard({
  athleteName,
  primaryEvent,
  testResults,
  targetPB,
  currentPB,
  goals,
}: PerformanceDashboardProps) {
  // Calculate category scores
  const categoryScores = useMemo(() => {
    const categories: Record<string, { total: number; count: number }> = {
      strength: { total: 0, count: 0 },
      sprint: { total: 0, count: 0 },
      reaction: { total: 0, count: 0 },
      power: { total: 0, count: 0 },
      biomechanics: { total: 0, count: 0 },
      injury_prevention: { total: 0, count: 0 },
      core: { total: 0, count: 0 },
    };

    Object.entries(testResults).forEach(([testId, result]) => {
      const testDef = TEST_DEFINITIONS[testId];
      if (!testDef || !result.value) return;
      const value = parseFloat(result.value);
      if (isNaN(value)) return;
      const category = testDef.category;
      if (!categories[category]) return;

      let normalizedScore = 0;
      const benchmark = ELITE_BENCHMARKS[testId];
      if (benchmark) {
        if (testDef.valueDirection === 'lower_better') {
          normalizedScore = Math.min(100, (benchmark / value) * 100);
        } else {
          normalizedScore = Math.min(100, (value / benchmark) * 100);
        }
      } else {
        normalizedScore = 75;
      }
      categories[category].total += normalizedScore;
      categories[category].count += 1;
    });

    return Object.entries(categories).map(([category, data]) => ({
      category,
      displayName: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      score: data.count > 0 ? Math.round(data.total / data.count) : 0,
      testCount: data.count,
      color: CATEGORY_COLORS[category],
    }));
  }, [testResults]);

  // Radar data
  const radarData = categoryScores.filter(c => c.testCount > 0).map(cat => ({
    subject: cat.displayName.split(' ')[0],
    score: cat.score,
    fullMark: 100,
  }));

  // Current vs Target
  const currentVsTarget = useMemo(() => {
    const current = currentPB ? parseFloat(currentPB.replace('s', '')) : null;
    const target = targetPB ? parseFloat(targetPB.replace('s', '')) : null;
    if (!current || !target) return null;
    const gap = current - target;
    const progress = ((10.8 - current) / (10.8 - target)) * 100;
    return { current, target, gap: gap.toFixed(2), progress: Math.min(100, Math.max(0, progress)) };
  }, [currentPB, targetPB]);

  // Sprint splits data
  const sprintSplitsData = useMemo(() => {
    const splits = [
      { distance: '10m', testId: 'sprint_10m_time', color: '#3b82f6' },
      { distance: '30m', testId: 'sprint_30m_time', color: '#8b5cf6' },
      { distance: '60m', testId: 'sprint_60m_time', color: '#f59e0b' },
      { distance: '100m', testId: 'sprint_100m_time', color: '#10b981' },
    ];
    return splits.map(split => {
      const result = testResults[split.testId];
      const current = result?.value ? parseFloat(result.value) : null;
      const benchmarks = TARGET_BENCHMARKS[split.testId];
      return {
        ...split, current,
        elite: benchmarks?.elite || null,
        good: benchmarks?.good || null,
        status: current && benchmarks ? (
          current <= benchmarks.elite ? 'elite' as const :
          current <= benchmarks.good ? 'good' as const :
          current <= benchmarks.average ? 'average' as const : 'needs_work' as const
        ) : null,
      };
    });
  }, [testResults]);

  // Strength comparison
  const strengthData = useMemo(() => {
    const tests = [
      { label: 'Squat', testId: 'squat_1rm', unit: 'kg' },
      { label: 'Deadlift', testId: 'deadlift_1rm', unit: 'kg' },
      { label: 'V-Jump', testId: 'vertical_jump_cm', unit: 'cm' },
      { label: 'B-Jump', testId: 'broad_jump', unit: 'm' },
    ];
    return tests.map(test => {
      const result = testResults[test.testId];
      const current = result?.value ? parseFloat(result.value) : 0;
      const elite = TARGET_BENCHMARKS[test.testId]?.elite || 100;
      return { ...test, current, elite, percentage: Math.round((current / elite) * 100) };
    });
  }, [testResults]);

  // Gap analysis
  const gapAnalysis = useMemo(() => {
    const gaps: { metric: string; current: number; target: number; gap: number; priority: 'high' | 'medium' | 'low'; recommendation: string }[] = [];

    if (testResults['sprint_100m_time']?.value) {
      const current = parseFloat(testResults['sprint_100m_time'].value);
      const target = TARGET_BENCHMARKS['sprint_100m_time'].good;
      if (current > target) {
        gaps.push({
          metric: '100m Time', current, target, gap: current - target,
          priority: current - target > 0.5 ? 'high' : 'medium',
          recommendation: 'Block starts & acceleration drills',
        });
      }
    }
    if (testResults['squat_1rm']?.value) {
      const current = parseFloat(testResults['squat_1rm'].value);
      const target = TARGET_BENCHMARKS['squat_1rm'].good;
      if (current < target) {
        gaps.push({
          metric: 'Squat 1RM', current, target, gap: target - current,
          priority: target - current > 30 ? 'high' : 'medium',
          recommendation: 'Progressive overload training',
        });
      }
    }
    return gaps.sort((a, b) => (a.priority === 'high' ? -1 : 1));
  }, [testResults]);

  // Bar chart data
  const barChartData = strengthData.map(d => ({
    name: d.label,
    current: d.percentage,
    elite: 100,
    fill: d.percentage >= 100 ? '#10b981' : d.percentage >= 85 ? '#3b82f6' : d.percentage >= 70 ? '#f59e0b' : '#ef4444',
  }));

  return (
    <div className="space-y-4">
      {/* Header - Compact */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">{athleteName}</h2>
            <p className="text-blue-100 text-sm">{primaryEvent}</p>
          </div>
          {currentVsTarget && (
            <div className="text-right">
              <p className="text-2xl font-bold">{currentVsTarget.current}s</p>
              <p className="text-blue-200 text-xs">Target: {currentVsTarget.target}s</p>
            </div>
          )}
        </div>
        {currentVsTarget && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress to Target</span>
              <span>{Math.round(currentVsTarget.progress)}%</span>
            </div>
            <div className="h-2 bg-blue-800/50 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 rounded-full" style={{ width: `${currentVsTarget.progress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Main Grid - 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Radar Chart */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-yellow-500" />
            Performance Profile
          </h3>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                <Radar dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-gray-400 text-sm">No data</div>
          )}
        </div>

        {/* Strength vs Elite Bar Chart */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-red-500" />
            Strength vs Elite
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barChartData} layout="vertical" margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" domain={[0, 120]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={50} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Bar dataKey="current" radius={[0, 4, 4, 0]}>
                {barChartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-3 mt-1 text-[10px]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-500" />Elite</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500" />Good</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-yellow-500" />Avg</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500" />Low</span>
          </div>
        </div>

        {/* Category Scores */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-purple-500" />
            Category Scores
          </h3>
          <div className="space-y-2">
            {categoryScores.filter(c => c.testCount > 0).map(cat => (
              <div key={cat.category} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-20 truncate">{cat.displayName}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${cat.score}%`, backgroundColor: cat.color }}
                  />
                </div>
                <span className="text-xs font-medium w-8 text-right" style={{ color: cat.color }}>{cat.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sprint Splits - Full Width */}
      {sprintSplitsData.some(s => s.current !== null) && (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
            <Timer className="w-4 h-4 text-blue-500" />
            Sprint Splits Analysis
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {sprintSplitsData.map(split => (
              <div
                key={split.distance}
                className={`p-3 rounded-lg border-l-4 ${
                  split.status === 'elite' ? 'border-l-green-500 bg-green-50' :
                  split.status === 'good' ? 'border-l-blue-500 bg-blue-50' :
                  split.status === 'average' ? 'border-l-yellow-500 bg-yellow-50' :
                  split.status === 'needs_work' ? 'border-l-red-500 bg-red-50' :
                  'border-l-gray-300 bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-medium text-gray-500">{split.distance}</span>
                  <StatusBadge status={split.status} />
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {split.current ? `${split.current}s` : '-'}
                </p>
                <div className="text-[10px] text-gray-500 mt-1">
                  Elite: {split.elite}s | Good: {split.good}s
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Power Metrics & Speed Analysis - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Power Gauges */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-purple-500" />
            Power Metrics
          </h3>
          <div className="grid grid-cols-4 gap-1">
            {testResults['vertical_jump_cm']?.value && (
              <MiniGauge
                value={parseFloat(testResults['vertical_jump_cm'].value)}
                max={80} label="V-Jump" unit="cm"
                color={parseFloat(testResults['vertical_jump_cm'].value) >= 70 ? '#10b981' : '#3b82f6'}
              />
            )}
            {testResults['broad_jump']?.value && (
              <MiniGauge
                value={parseFloat(testResults['broad_jump'].value)}
                max={3.5} label="Broad" unit="m"
                color={parseFloat(testResults['broad_jump'].value) >= 3.2 ? '#10b981' : '#3b82f6'}
              />
            )}
            {testResults['cmj_height']?.value && (
              <MiniGauge
                value={parseFloat(testResults['cmj_height'].value)}
                max={75} label="CMJ" unit="cm"
                color={parseFloat(testResults['cmj_height'].value) >= 65 ? '#10b981' : '#3b82f6'}
              />
            )}
            {testResults['squat_jump_height']?.value && (
              <MiniGauge
                value={parseFloat(testResults['squat_jump_height'].value)}
                max={70} label="SJ" unit="cm"
                color={parseFloat(testResults['squat_jump_height'].value) >= 60 ? '#10b981' : '#3b82f6'}
              />
            )}
          </div>
        </div>

        {/* Speed Metrics */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
            <Timer className="w-4 h-4 text-blue-500" />
            Speed & Reaction
          </h3>
          <div className="grid grid-cols-4 gap-1">
            {testResults['reaction_time']?.value && (
              <MiniGauge
                value={Math.round(parseFloat(testResults['reaction_time'].value) * 1000)}
                max={200} label="React" unit="ms"
                color={parseFloat(testResults['reaction_time'].value) <= 0.14 ? '#10b981' : '#f59e0b'}
              />
            )}
            {testResults['block_clearance_time']?.value && (
              <MiniGauge
                value={Math.round(parseFloat(testResults['block_clearance_time'].value) * 1000)}
                max={500} label="Block" unit="ms"
                color={parseFloat(testResults['block_clearance_time'].value) <= 0.38 ? '#10b981' : '#f59e0b'}
              />
            )}
            {testResults['flying_10m']?.value && (
              <MiniGauge
                value={parseFloat(testResults['flying_10m'].value)}
                max={1.2} label="Fly10" unit="s"
                color={parseFloat(testResults['flying_10m'].value) <= 0.92 ? '#10b981' : '#f59e0b'}
              />
            )}
            {testResults['ground_contact_time']?.value && (
              <MiniGauge
                value={Math.round(parseFloat(testResults['ground_contact_time'].value) * 1000)}
                max={120} label="GCT" unit="ms"
                color={parseFloat(testResults['ground_contact_time'].value) <= 0.095 ? '#10b981' : '#f59e0b'}
              />
            )}
          </div>
        </div>
      </div>

      {/* Gap Analysis */}
      {gapAnalysis.length > 0 && (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            Priority Improvements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gapAnalysis.map((gap, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border-l-4 ${
                  gap.priority === 'high' ? 'border-l-red-500 bg-red-50' : 'border-l-yellow-500 bg-yellow-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-900 text-sm">{gap.metric}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    gap.priority === 'high' ? 'bg-red-200 text-red-700' : 'bg-yellow-200 text-yellow-700'
                  }`}>
                    {gap.priority.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm mb-2">
                  <span className="text-gray-600">{gap.current}</span>
                  <ArrowRight className="w-3 h-3 text-gray-400" />
                  <span className="text-green-600 font-medium">{gap.target}</span>
                  <span className="text-gray-400 text-xs">(Gap: {gap.gap.toFixed(2)})</span>
                </div>
                <div className="flex items-start gap-1.5 text-xs text-gray-600 bg-white p-2 rounded">
                  <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                  {gap.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goals */}
      {goals && (goals.shortTerm || goals.longTerm) && (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-green-500" />
            Training Goals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {goals.shortTerm && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="text-xs font-medium text-blue-800 mb-2">Short-Term</h4>
                <ul className="space-y-1">
                  {goals.shortTerm.split('\n').slice(0, 3).map((goal, i) => (
                    <li key={i} className="text-xs text-blue-700 flex items-start gap-1.5">
                      <span className="text-blue-400 mt-0.5">•</span>
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {goals.longTerm && (
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="text-xs font-medium text-green-800 mb-2">Long-Term</h4>
                <ul className="space-y-1">
                  {goals.longTerm.split('\n').slice(0, 3).map((goal, i) => (
                    <li key={i} className="text-xs text-green-700 flex items-start gap-1.5">
                      <span className="text-green-400 mt-0.5">•</span>
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PerformanceDashboard;
