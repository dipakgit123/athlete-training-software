/**
 * Coach Dashboard Component
 * Main dashboard view for coaches showing all athletes and alerts
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { AthleteCard } from '../ui/AthleteCard';
import { AlertCard } from '../ui/AlertCard';
import { ReadinessGauge } from '../ui/ReadinessGauge';

// Types
interface AthleteListItem {
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

interface AlertItem {
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

interface TodaySession {
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

interface DashboardStats {
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

interface CoachDashboardProps {
  stats: DashboardStats;
  athletes: AthleteListItem[];
  alerts: AlertItem[];
  todaySessions: TodaySession[];
  upcomingWeek: {
    day: string;
    date: string;
    sessions: string;
    hasCompetition: boolean;
  }[];
  onAthleteClick?: (id: string) => void;
  onAlertAcknowledge?: (id: string) => void;
  onSessionClick?: (id: string) => void;
}

export function CoachDashboard({
  stats,
  athletes,
  alerts,
  todaySessions,
  upcomingWeek,
  onAthleteClick,
  onAlertAcknowledge,
  onSessionClick,
}: CoachDashboardProps) {
  // Use state for date to avoid hydration mismatch
  const [dateString, setDateString] = useState<string>('');

  useEffect(() => {
    const today = new Date();
    setDateString(today.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }));
  }, []);

  // Filter priority alerts (red and orange only)
  const priorityAlerts = alerts
    .filter((a) => a.level === 'red' || a.level === 'orange')
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coach Dashboard</h1>
          <p className="text-gray-500">{dateString}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {stats.totalAthletes} Athletes
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Athletes Ready"
          value={stats.athletesReady}
          total={stats.totalAthletes}
          color="green"
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5" />}
          label="Need Attention"
          value={stats.athletesCaution}
          color="yellow"
        />
        <StatCard
          icon={<Activity className="w-5 h-5" />}
          label="Active Alerts"
          value={stats.activeAlerts}
          color="red"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Avg Weekly Load"
          value={stats.weeklyLoadAvg}
          suffix="AU"
          color="blue"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Athletes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Athlete Status Grid */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Athlete Status</h2>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Ready
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  Caution
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Rest
                </span>
              </div>
            </div>

            {/* Quick Status Grid */}
            <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 mb-4">
              {athletes.slice(0, 10).map((athlete) => (
                <button
                  key={athlete.id}
                  onClick={() => onAthleteClick?.(athlete.id)}
                  className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ReadinessGauge score={athlete.readinessScore} size="sm" />
                  <span className="text-xs text-gray-600 mt-1 truncate w-full text-center">
                    {athlete.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Detailed Cards for Athletes Needing Attention */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-700">
                Requiring Attention
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {athletes
                  .filter((a) => a.readinessScore < 70 || a.hasAlerts)
                  .slice(0, 4)
                  .map((athlete) => (
                    <AthleteCard
                      key={athlete.id}
                      athlete={athlete}
                      onClick={onAthleteClick}
                      compact
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* Alerts Section */}
          {priorityAlerts.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Active Alerts
                </h2>
                <span className="text-sm text-gray-500">
                  {alerts.length} total
                </span>
              </div>

              <div className="space-y-3">
                {priorityAlerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onAcknowledge={onAlertAcknowledge}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sessions & Calendar */}
        <div className="space-y-6">
          {/* Today's Sessions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Today's Sessions</h2>
              <span className="text-sm text-gray-500">
                {stats.completedSessions}/{stats.todaySessions}
              </span>
            </div>

            <div className="space-y-3">
              {todaySessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => onSessionClick?.(session.id)}
                  className="w-full p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {session.time}
                    </span>
                    <SessionStatusBadge status={session.status} />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{session.type}</p>
                  <div className="flex items-center gap-1">
                    {session.athletes.slice(0, 4).map((athlete) => (
                      <div
                        key={athlete.id}
                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs"
                        title={athlete.name}
                      >
                        {athlete.name.charAt(0)}
                      </div>
                    ))}
                    {session.athletes.length > 4 && (
                      <span className="text-xs text-gray-500">
                        +{session.athletes.length - 4}
                      </span>
                    )}
                  </div>
                </button>
              ))}

              {todaySessions.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No sessions scheduled for today
                </p>
              )}
            </div>
          </div>

          {/* Upcoming Week */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">This Week</h2>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-2">
              {upcomingWeek.map((day, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    index === 0 ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-center w-10">
                      <p className="text-xs text-gray-500">{day.day}</p>
                      <p className="font-medium text-gray-900">{day.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">{day.sessions}</p>
                    </div>
                  </div>
                  {day.hasCompetition && (
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                      Competition
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <QuickActionButton label="Add Wellness Entry" />
              <QuickActionButton label="Create Session" />
              <QuickActionButton label="View Reports" />
              <QuickActionButton label="Manage Athletes" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  total,
  suffix,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  total?: number;
  suffix?: string;
  color: 'green' | 'yellow' | 'red' | 'blue';
}) {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {value}
        {total && <span className="text-sm font-normal text-gray-500">/{total}</span>}
        {suffix && <span className="text-sm font-normal text-gray-500 ml-1">{suffix}</span>}
      </p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

// Session Status Badge
function SessionStatusBadge({ status }: { status: 'upcoming' | 'in_progress' | 'completed' }) {
  const config = {
    upcoming: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Upcoming' },
    in_progress: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'In Progress' },
    completed: { bg: 'bg-green-100', text: 'text-green-600', label: 'Completed' },
  };

  const { bg, text, label } = config[status];

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${bg} ${text}`}>
      {label}
    </span>
  );
}

// Quick Action Button
function QuickActionButton({ label }: { label: string }) {
  return (
    <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors text-left">
      <span className="text-sm text-gray-700">{label}</span>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </button>
  );
}

export default CoachDashboard;
