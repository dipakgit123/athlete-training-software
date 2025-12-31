/**
 * Alert Card Component
 * Display system alerts with severity levels
 */

'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';

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

interface AlertCardProps {
  alert: AlertItem;
  onAcknowledge?: (id: string) => void;
  onDismiss?: (id: string) => void;
  compact?: boolean;
}

const ALERT_CONFIG = {
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: CheckCircle,
    iconColor: 'text-green-500',
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: AlertCircle,
    iconColor: 'text-yellow-500',
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-800',
    icon: AlertTriangle,
    iconColor: 'text-orange-500',
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: XCircle,
    iconColor: 'text-red-500',
  },
};

export function AlertCard({
  alert,
  onAcknowledge,
  onDismiss,
  compact = false,
}: AlertCardProps) {
  const config = ALERT_CONFIG[alert.level];
  const Icon = config.icon;

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${config.bg} ${config.border}`}
      >
        <Icon className={`w-4 h-4 ${config.iconColor}`} />
        <span className={`text-sm ${config.text}`}>
          <strong>{alert.athleteName}:</strong> {alert.message}
        </span>
        {onDismiss && (
          <button
            onClick={() => onDismiss(alert.id)}
            className="ml-auto p-1 hover:bg-white/50 rounded"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border p-4 ${config.bg} ${config.border} ${
        alert.acknowledged ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 ${config.iconColor}`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-medium ${config.text}`}>
              {alert.athleteName}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.text} border ${config.border}`}>
              {alert.category}
            </span>
          </div>

          <p className={`text-sm ${config.text}`}>{alert.message}</p>

          <p className={`text-xs mt-1 ${config.text} opacity-75`}>
            Action: {alert.action}
          </p>

          <div className="flex items-center justify-between mt-3">
            <TimestampDisplay timestamp={alert.timestamp} />

            <div className="flex gap-2">
              {onAcknowledge && !alert.acknowledged && (
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className={`text-xs px-2 py-1 rounded ${config.text} hover:bg-white/50`}
                >
                  Acknowledge
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={() => onDismiss(alert.id)}
                  className="text-xs px-2 py-1 rounded text-gray-500 hover:bg-white/50"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Separate component to handle timestamp display to avoid hydration mismatch
function TimestampDisplay({ timestamp }: { timestamp: Date }) {
  const [displayTime, setDisplayTime] = useState<string>('');

  useEffect(() => {
    const formatTimestamp = (date: Date): string => {
      const now = new Date();
      const diff = now.getTime() - new Date(date).getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);

      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      return new Date(date).toLocaleDateString();
    };

    setDisplayTime(formatTimestamp(timestamp));
  }, [timestamp]);

  return (
    <span className="text-xs text-gray-500">
      {displayTime || '...'}
    </span>
  );
}

export default AlertCard;
