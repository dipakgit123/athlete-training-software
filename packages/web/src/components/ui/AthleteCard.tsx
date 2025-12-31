/**
 * Athlete Card Component
 * Display athlete summary with readiness status
 */

'use client';

import React from 'react';
import { User, AlertCircle, Calendar, Trophy } from 'lucide-react';
import { ReadinessGauge } from './ReadinessGauge';

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

interface AthleteCardProps {
  athlete: AthleteListItem;
  onClick?: (id: string) => void;
  compact?: boolean;
}

const STATUS_COLORS = {
  pending: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-600',
  completed: 'bg-green-100 text-green-600',
  cancelled: 'bg-red-100 text-red-600',
};

const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function AthleteCard({ athlete, onClick, compact = false }: AthleteCardProps) {
  if (compact) {
    return (
      <div
        onClick={() => onClick?.(athlete.id)}
        className={`flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200
          ${onClick ? 'cursor-pointer hover:border-blue-300 hover:shadow-sm' : ''}`}
      >
        {/* Avatar */}
        <div className="relative">
          {athlete.profileImage ? (
            <img
              src={athlete.profileImage}
              alt={athlete.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
          )}
          {athlete.hasAlerts && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-[10px] text-white font-bold">
                {athlete.alertCount}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{athlete.name}</p>
          <p className="text-xs text-gray-500">{athlete.event}</p>
        </div>

        {/* Readiness */}
        <ReadinessGauge score={athlete.readinessScore} size="sm" />
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick?.(athlete.id)}
      className={`bg-white rounded-xl border border-gray-200 p-5
        ${onClick ? 'cursor-pointer hover:border-blue-300 hover:shadow-md transition-all' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          {athlete.profileImage ? (
            <img
              src={athlete.profileImage}
              alt={athlete.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-500" />
            </div>
          )}
          {athlete.hasAlerts && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">{athlete.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600">{athlete.event}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {athlete.category}
            </span>
          </div>
        </div>

        {/* Readiness Gauge */}
        <ReadinessGauge
          score={athlete.readinessScore}
          size="md"
          showCategory
        />
      </div>

      {/* Session Status */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Today's Session</span>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              STATUS_COLORS[athlete.todaySessionStatus]
            }`}
          >
            {STATUS_LABELS[athlete.todaySessionStatus]}
          </span>
        </div>
      </div>

      {/* Alerts */}
      {athlete.hasAlerts && (
        <div className="mt-3 p-2 bg-red-50 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">
              {athlete.alertCount} alert{athlete.alertCount > 1 ? 's' : ''} requiring attention
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AthleteCard;
