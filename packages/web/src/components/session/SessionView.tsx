/**
 * Session View Component
 * Displays complete training session with all blocks
 */

'use client';

import React, { useState } from 'react';
import {
  Clock,
  Flame,
  Activity,
  Dumbbell,
  Wind,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import { ReadinessGauge } from '../ui/ReadinessGauge';

interface SessionViewProps {
  session: SessionDisplayData;
  athleteName: string;
  readinessScore: number;
  adjustments?: {
    intensityChange: number;
    volumeChange: number;
    reason: string;
  };
  onStartSession?: () => void;
  onCompleteSession?: () => void;
  onCompleteExercise?: (blockType: string, exerciseIndex: number) => void;
}

interface SessionDisplayData {
  id: string;
  date: Date;
  type: string;
  phase: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'modified';
  totalDuration: number;
  warmup: {
    duration: number;
    phases: {
      name: string;
      duration: number;
      exercises: { name: string; details: string }[];
    }[];
  };
  mainWorkout: {
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
    }[];
  };
  strength?: {
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
  };
  cooldown: {
    duration: number;
    exercises: { name: string; duration?: number; notes?: string }[];
  };
  notes: string[];
}

export function SessionView({
  session,
  athleteName,
  readinessScore,
  adjustments,
  onStartSession,
  onCompleteSession,
  onCompleteExercise,
}: SessionViewProps) {
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(
    new Set(['warmup', 'mainWorkout', 'strength', 'cooldown'])
  );

  const toggleBlock = (block: string) => {
    const newExpanded = new Set(expandedBlocks);
    if (newExpanded.has(block)) {
      newExpanded.delete(block);
    } else {
      newExpanded.add(block);
    }
    setExpandedBlocks(newExpanded);
  };

  const isExpanded = (block: string) => expandedBlocks.has(block);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{session.type}</h1>
            <p className="text-gray-500">
              {new Date(session.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">{athleteName}</p>
              <p className="text-xs text-gray-400">Phase: {session.phase}</p>
            </div>
            <ReadinessGauge score={readinessScore} size="sm" />
          </div>
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {session.totalDuration} min
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-gray-600">
              {session.mainWorkout.averageIntensity}% intensity
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-600">
              {session.mainWorkout.totalVolume}m volume
            </span>
          </div>
        </div>

        {/* Adjustments Alert */}
        {adjustments && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Session Adjusted
                </p>
                <p className="text-xs text-yellow-700">
                  Intensity: {adjustments.intensityChange > 0 ? '+' : ''}
                  {adjustments.intensityChange}% | Volume:{' '}
                  {adjustments.volumeChange > 0 ? '+' : ''}
                  {adjustments.volumeChange}%
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  {adjustments.reason}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
          {session.status === 'planned' && (
            <button
              onClick={onStartSession}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              Start Session
            </button>
          )}
          {session.status === 'in_progress' && (
            <button
              onClick={onCompleteSession}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Complete Session
            </button>
          )}
        </div>
      </div>

      {/* Warm-up Block */}
      <SessionBlock
        title="Warm-up"
        icon={<Wind className="w-5 h-5 text-blue-500" />}
        duration={session.warmup.duration}
        isExpanded={isExpanded('warmup')}
        onToggle={() => toggleBlock('warmup')}
      >
        {session.warmup.phases.map((phase, phaseIndex) => (
          <div key={phaseIndex} className="mb-4 last:mb-0">
            <h4 className="font-medium text-gray-700 mb-2">
              {phase.name} ({phase.duration} min)
            </h4>
            <ul className="space-y-1">
              {phase.exercises.map((exercise, exIndex) => (
                <li
                  key={exIndex}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>{exercise.name}</strong> - {exercise.details}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </SessionBlock>

      {/* Main Workout Block */}
      <SessionBlock
        title="Main Workout"
        icon={<Activity className="w-5 h-5 text-orange-500" />}
        duration={session.mainWorkout.duration}
        isExpanded={isExpanded('mainWorkout')}
        onToggle={() => toggleBlock('mainWorkout')}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-2 font-medium">Exercise</th>
                <th className="pb-2 font-medium">Sets × Reps</th>
                <th className="pb-2 font-medium">Intensity</th>
                <th className="pb-2 font-medium">Recovery</th>
                <th className="pb-2 font-medium w-10"></th>
              </tr>
            </thead>
            <tbody>
              {session.mainWorkout.sets.map((set, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-50 ${
                    set.completed ? 'bg-green-50' : ''
                  }`}
                >
                  <td className="py-3">
                    <div>
                      <p className="font-medium text-gray-900">{set.exercise}</p>
                      {set.notes && (
                        <p className="text-xs text-gray-500">{set.notes}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-gray-600">
                    {set.reps} × {set.distance ? `${set.distance}m` : '1'}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        set.intensity >= 95
                          ? 'bg-red-100 text-red-700'
                          : set.intensity >= 85
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {set.intensity}%
                    </span>
                  </td>
                  <td className="py-3 text-gray-600">
                    {Math.floor(set.recovery / 60)}:{String(set.recovery % 60).padStart(2, '0')}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => onCompleteExercise?.('mainWorkout', index)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        set.completed
                          ? 'bg-green-500 text-white'
                          : 'border border-gray-300 text-gray-400 hover:border-green-500 hover:text-green-500'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SessionBlock>

      {/* Strength Block */}
      {session.strength && (
        <SessionBlock
          title={`Strength - ${session.strength.phase}`}
          icon={<Dumbbell className="w-5 h-5 text-purple-500" />}
          duration={session.strength.duration}
          isExpanded={isExpanded('strength')}
          onToggle={() => toggleBlock('strength')}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-2 font-medium">Exercise</th>
                  <th className="pb-2 font-medium">Sets × Reps</th>
                  <th className="pb-2 font-medium">% 1RM</th>
                  <th className="pb-2 font-medium">Rest</th>
                  <th className="pb-2 font-medium w-10"></th>
                </tr>
              </thead>
              <tbody>
                {session.strength.exercises.map((exercise, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-50 ${
                      exercise.completed ? 'bg-green-50' : ''
                    }`}
                  >
                    <td className="py-3 font-medium text-gray-900">
                      {exercise.name}
                    </td>
                    <td className="py-3 text-gray-600">
                      {exercise.sets} × {exercise.reps}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">
                        {exercise.intensity}%
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">
                      {Math.floor(exercise.rest / 60)}:{String(exercise.rest % 60).padStart(2, '0')}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => onCompleteExercise?.('strength', index)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          exercise.completed
                            ? 'bg-green-500 text-white'
                            : 'border border-gray-300 text-gray-400 hover:border-green-500 hover:text-green-500'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SessionBlock>
      )}

      {/* Cool-down Block */}
      <SessionBlock
        title="Cool-down"
        icon={<RotateCcw className="w-5 h-5 text-teal-500" />}
        duration={session.cooldown.duration}
        isExpanded={isExpanded('cooldown')}
        onToggle={() => toggleBlock('cooldown')}
      >
        <ul className="space-y-2">
          {session.cooldown.exercises.map((exercise, index) => (
            <li
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-700">{exercise.name}</span>
              {exercise.duration && (
                <span className="text-gray-500">
                  {Math.floor(exercise.duration / 60)}:{String(exercise.duration % 60).padStart(2, '0')}
                </span>
              )}
            </li>
          ))}
        </ul>
      </SessionBlock>

      {/* Notes */}
      {session.notes.length > 0 && (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <h3 className="font-medium text-blue-800 mb-2">Coach Notes</h3>
          <ul className="space-y-1">
            {session.notes.map((note, index) => (
              <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                <span>•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Session Block Component
function SessionBlock({
  title,
  icon,
  duration,
  isExpanded,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  duration: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-semibold text-gray-900">{title}</span>
          <span className="text-sm text-gray-500">({duration} min)</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

export default SessionView;
