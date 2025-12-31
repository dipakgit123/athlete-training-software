'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Heart,
  Dumbbell,
  Download,
  Calendar,
  ChevronDown,
  AlertTriangle,
  Trophy,
  Target,
  Zap,
} from 'lucide-react';

// Mock athletes
const mockAthletes = [
  { id: '1', name: 'Rahul Sharma' },
  { id: '2', name: 'Priya Patel' },
  { id: '3', name: 'Amit Kumar' },
];

// Mock report data
const mockPerformanceData = {
  personalBests: [
    { event: '100m', current: '10.42', previous: '10.58', improvement: 1.5 },
    { event: '200m', current: '21.15', previous: '21.45', improvement: 1.4 },
  ],
  loadTrend: [
    { week: 'W1', load: 1500, acwr: 0.95 },
    { week: 'W2', load: 1650, acwr: 1.05 },
    { week: 'W3', load: 1800, acwr: 1.12 },
    { week: 'W4', load: 1750, acwr: 1.08 },
  ],
  readinessTrend: [
    { date: 'Mon', score: 82 },
    { date: 'Tue', score: 78 },
    { date: 'Wed', score: 85 },
    { date: 'Thu', score: 80 },
    { date: 'Fri', score: 88 },
    { date: 'Sat', score: 75 },
    { date: 'Sun', score: 90 },
  ],
  sessionCompliance: {
    completed: 18,
    total: 20,
    percentage: 90,
  },
  keyMetrics: {
    avgReadiness: 82,
    avgLoad: 1675,
    avgACWR: 1.05,
    injuryRisk: 'LOW',
  },
};

export default function ReportsPage() {
  const [selectedAthlete, setSelectedAthlete] = useState('1');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Reports</h1>
          <p className="text-gray-500">Comprehensive analytics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedAthlete}
            onChange={(e) => setSelectedAthlete(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {mockAthletes.map((athlete) => (
              <option key={athlete.id} value={athlete.id}>
                {athlete.name}
              </option>
            ))}
          </select>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'load', label: 'Load Analysis', icon: Activity },
            { id: 'wellness', label: 'Wellness', icon: Heart },
            { id: 'performance', label: 'Performance', icon: Trophy },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">+5%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{mockPerformanceData.keyMetrics.avgReadiness}</p>
          <p className="text-sm text-gray-500">Avg Readiness</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Stable</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{mockPerformanceData.keyMetrics.avgLoad}</p>
          <p className="text-sm text-gray-500">Avg Weekly Load</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-green-500" />
            <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Optimal</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{mockPerformanceData.keyMetrics.avgACWR}</p>
          <p className="text-sm text-gray-500">Avg ACWR</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">LOW</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{mockPerformanceData.keyMetrics.injuryRisk}</p>
          <p className="text-sm text-gray-500">Injury Risk</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Load Trend Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Weekly Load Trend
          </h3>

          <div className="space-y-4">
            {mockPerformanceData.loadTrend.map((week, index) => (
              <div key={week.week} className="flex items-center gap-4">
                <span className="text-sm text-gray-500 w-12">{week.week}</span>
                <div className="flex-1">
                  <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-end pr-2"
                      style={{ width: `${(week.load / 2000) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">{week.load}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-sm font-medium w-16 ${
                  week.acwr <= 1.3 ? 'text-green-600' : 'text-orange-600'
                }`}>
                  ACWR: {week.acwr}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Readiness Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Daily Readiness
          </h3>

          <div className="flex items-end justify-between h-48 gap-2">
            {mockPerformanceData.readinessTrend.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '160px' }}>
                  <div
                    className={`absolute bottom-0 w-full rounded-t-lg ${
                      day.score >= 80 ? 'bg-green-500' :
                      day.score >= 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ height: `${day.score}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{day.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Bests */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Personal Best Progress
          </h3>

          <div className="space-y-4">
            {mockPerformanceData.personalBests.map((pb) => (
              <div key={pb.event} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{pb.event}</span>
                  <span className="text-green-600 text-sm flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {pb.improvement}% faster
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Previous</p>
                    <p className="text-lg text-gray-400 line-through">{pb.previous}s</p>
                  </div>
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <div className="flex-1 text-right">
                    <p className="text-xs text-gray-500">Current PB</p>
                    <p className="text-lg font-bold text-green-600">{pb.current}s</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session Compliance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-purple-500" />
            Session Compliance
          </h3>

          <div className="flex items-center justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-gray-200"
                  strokeWidth="12"
                  stroke="currentColor"
                  fill="transparent"
                  r="58"
                  cx="80"
                  cy="80"
                />
                <circle
                  className="text-green-500"
                  strokeWidth="12"
                  strokeDasharray={`${mockPerformanceData.sessionCompliance.percentage * 3.64} 364`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="58"
                  cx="80"
                  cy="80"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">
                  {mockPerformanceData.sessionCompliance.percentage}%
                </span>
                <span className="text-sm text-gray-500">Compliance</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {mockPerformanceData.sessionCompliance.completed}
              </p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">
                {mockPerformanceData.sessionCompliance.total}
              </p>
              <p className="text-sm text-gray-500">Planned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">AI Recommendations</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Performance</span>
            </div>
            <p className="text-sm text-green-700">
              Current progression is on track. Consider adding 1 more speed session next week to capitalize on good readiness levels.
            </p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">Load Management</span>
            </div>
            <p className="text-sm text-blue-700">
              ACWR is optimal. Maintain current load progression. Weekly load can increase by 5-10% next week.
            </p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-800">Recovery</span>
            </div>
            <p className="text-sm text-purple-700">
              Sleep quality has been variable. Focus on consistent sleep schedule (10pm-6am) for optimal recovery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
