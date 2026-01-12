'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  AlertCircle,
  Clock,
  Dumbbell,
  Zap,
  Save,
  CheckCircle2,
  Activity,
  Target,
  TrendingUp,
  MessageSquare,
  Loader2,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface PlannedExercise {
  id: string;
  name: string;
  category: 'TRACK' | 'STRENGTH' | 'PLYO' | 'CORE' | 'WARMUP' | 'COOLDOWN';
  sets?: number;
  reps?: number;
  weight?: number;
  distance?: number;
  duration?: number;
  intensity?: string;
  recovery?: number;
  notes?: string;
}

interface ExerciseCompletion {
  exerciseId: string;
  exerciseName: string;
  exerciseCategory: string;
  plannedSets?: number;
  plannedReps?: number;
  plannedWeight?: number;
  plannedDistance?: number;
  plannedDuration?: number;
  plannedIntensity?: string;
  completedSets?: number;
  completedReps?: number;
  completedWeight?: number;
  completedDistance?: number;
  completedDuration?: number;
  isFullyCompleted: boolean;
  isPartiallyCompleted: boolean;
  isSkipped: boolean;
  skipReason?: string;
  technicalQuality?: number;
  effortLevel?: number;
  painLevel?: number;
  athleteNotes?: string;
}

interface DailyWorkout {
  id: string;
  date: string;
  phase: string;
  weekNumber: number;
  dayOfWeek: string;
  workoutType: string;
  primaryFocus: string;
  plannedDuration: number;
  plannedRPE: number;
  exercises: PlannedExercise[];
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
}

// ============================================
// DEMO DATA
// ============================================

const DEMO_WORKOUT: DailyWorkout = {
  id: 'workout-1',
  date: new Date().toISOString().split('T')[0],
  phase: 'General Preparation Phase (GPP)',
  weekNumber: 1,
  dayOfWeek: 'Monday',
  workoutType: 'STRENGTH',
  primaryFocus: 'Lower Body Strength Development',
  plannedDuration: 90,
  plannedRPE: 7,
  exercises: [
    {
      id: 'ex-1',
      name: 'General Warm-up Jog',
      category: 'WARMUP',
      duration: 600,
      intensity: 'Easy',
      notes: 'Light jog to raise body temperature',
    },
    {
      id: 'ex-2',
      name: 'Dynamic Stretching',
      category: 'WARMUP',
      duration: 300,
      notes: 'Leg swings, hip circles, arm circles',
    },
    {
      id: 'ex-3',
      name: 'Back Squat',
      category: 'STRENGTH',
      sets: 4,
      reps: 8,
      weight: 80,
      intensity: '70% 1RM',
      recovery: 180,
      notes: 'Focus on depth and knee tracking',
    },
    {
      id: 'ex-4',
      name: 'Romanian Deadlift',
      category: 'STRENGTH',
      sets: 3,
      reps: 10,
      weight: 60,
      intensity: '65% 1RM',
      recovery: 120,
      notes: 'Feel the hamstring stretch',
    },
    {
      id: 'ex-5',
      name: 'Bulgarian Split Squat',
      category: 'STRENGTH',
      sets: 3,
      reps: 8,
      weight: 20,
      intensity: 'Moderate',
      recovery: 90,
      notes: 'Each leg, hold dumbbells',
    },
    {
      id: 'ex-6',
      name: 'Box Jumps',
      category: 'PLYO',
      sets: 3,
      reps: 6,
      intensity: '24 inch box',
      recovery: 120,
      notes: 'Step down, explosive jump up',
    },
    {
      id: 'ex-7',
      name: 'Plank Hold',
      category: 'CORE',
      sets: 3,
      duration: 60,
      notes: 'Maintain neutral spine',
    },
    {
      id: 'ex-8',
      name: 'Cool Down Walk',
      category: 'COOLDOWN',
      duration: 300,
      intensity: 'Easy',
    },
  ],
  status: 'PLANNED',
};

// ============================================
// HELPER COMPONENTS
// ============================================

const CategoryBadge = ({ category }: { category: string }) => {
  const colors: Record<string, string> = {
    TRACK: 'bg-blue-100 text-blue-800',
    STRENGTH: 'bg-purple-100 text-purple-800',
    PLYO: 'bg-orange-100 text-orange-800',
    CORE: 'bg-green-100 text-green-800',
    WARMUP: 'bg-yellow-100 text-yellow-800',
    COOLDOWN: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[category] || 'bg-gray-100 text-gray-800'}`}>
      {category}
    </span>
  );
};

const RatingInput = ({
  label,
  value,
  onChange,
  max = 10,
  colorScale = false,
}: {
  label: string;
  value: number | undefined;
  onChange: (val: number) => void;
  max?: number;
  colorScale?: boolean;
}) => {
  const getColor = (i: number) => {
    if (!colorScale) return value === i ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600';
    if (i <= 3) return value === i ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600';
    if (i <= 6) return value === i ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-600';
    return value === i ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600';
  };

  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <div className="flex gap-1">
        {Array.from({ length: max }, (_, i) => i + 1).map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            className={`w-7 h-7 text-xs font-medium rounded ${getColor(i)} transition-colors`}
          >
            {i}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================
// EXERCISE CARD COMPONENT
// ============================================

const ExerciseCard = ({
  exercise,
  completion,
  onUpdate,
  isExpanded,
  onToggle,
}: {
  exercise: PlannedExercise;
  completion: ExerciseCompletion;
  onUpdate: (data: Partial<ExerciseCompletion>) => void;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const getStatusIcon = () => {
    if (completion.isFullyCompleted) return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (completion.isPartiallyCompleted) return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    if (completion.isSkipped) return <X className="w-5 h-5 text-red-500" />;
    return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
  };

  const getStatusBg = () => {
    if (completion.isFullyCompleted) return 'border-green-200 bg-green-50';
    if (completion.isPartiallyCompleted) return 'border-yellow-200 bg-yellow-50';
    if (completion.isSkipped) return 'border-red-200 bg-red-50';
    return 'border-gray-200 bg-white';
  };

  const handleQuickComplete = () => {
    onUpdate({
      isFullyCompleted: true,
      isPartiallyCompleted: false,
      isSkipped: false,
      completedSets: exercise.sets,
      completedReps: exercise.reps,
      completedWeight: exercise.weight,
      completedDistance: exercise.distance,
      completedDuration: exercise.duration,
    });
  };

  const handleSkip = () => {
    onUpdate({
      isFullyCompleted: false,
      isPartiallyCompleted: false,
      isSkipped: true,
    });
  };

  return (
    <div className={`border rounded-lg ${getStatusBg()} overflow-hidden transition-all`}>
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900">{exercise.name}</h3>
              <CategoryBadge category={exercise.category} />
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
              {exercise.sets && exercise.reps && (
                <span>{exercise.sets} x {exercise.reps} reps</span>
              )}
              {exercise.weight && (
                <span>{exercise.weight}kg</span>
              )}
              {exercise.distance && (
                <span>{exercise.distance}m</span>
              )}
              {exercise.duration && (
                <span>{Math.floor(exercise.duration / 60)}:{String(exercise.duration % 60).padStart(2, '0')}</span>
              )}
              {exercise.intensity && (
                <span className="text-blue-600">{exercise.intensity}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!completion.isFullyCompleted && !completion.isSkipped && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handleQuickComplete(); }}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleSkip(); }}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t p-4 space-y-4 bg-white">
          {/* Coach Notes */}
          {exercise.notes && (
            <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
              <strong>Coach Notes:</strong> {exercise.notes}
            </div>
          )}

          {/* Completion Inputs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {exercise.sets && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Completed Sets (/{exercise.sets})
                </label>
                <input
                  type="number"
                  min="0"
                  max={exercise.sets}
                  value={completion.completedSets || ''}
                  onChange={(e) => onUpdate({
                    completedSets: parseInt(e.target.value) || 0,
                    isFullyCompleted: parseInt(e.target.value) === exercise.sets &&
                      (completion.completedReps === exercise.reps || !exercise.reps),
                    isPartiallyCompleted: parseInt(e.target.value) > 0 && parseInt(e.target.value) < exercise.sets,
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            {exercise.reps && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Completed Reps (/{exercise.reps})
                </label>
                <input
                  type="number"
                  min="0"
                  max={exercise.reps * (exercise.sets || 1)}
                  value={completion.completedReps || ''}
                  onChange={(e) => onUpdate({
                    completedReps: parseInt(e.target.value) || 0,
                    isPartiallyCompleted: parseInt(e.target.value) > 0 && parseInt(e.target.value) < exercise.reps,
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            {exercise.weight && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Actual Weight (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  step="2.5"
                  value={completion.completedWeight || ''}
                  onChange={(e) => onUpdate({ completedWeight: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={String(exercise.weight)}
                />
              </div>
            )}
            {exercise.distance && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Actual Distance (m)
                </label>
                <input
                  type="number"
                  min="0"
                  value={completion.completedDistance || ''}
                  onChange={(e) => onUpdate({ completedDistance: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={String(exercise.distance)}
                />
              </div>
            )}
            {exercise.duration && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Actual Duration (sec)
                </label>
                <input
                  type="number"
                  min="0"
                  value={completion.completedDuration || ''}
                  onChange={(e) => onUpdate({ completedDuration: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={String(exercise.duration)}
                />
              </div>
            )}
          </div>

          {/* Quality Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RatingInput
              label="Technical Quality"
              value={completion.technicalQuality}
              onChange={(val) => onUpdate({ technicalQuality: val })}
            />
            <RatingInput
              label="Effort Level (RPE)"
              value={completion.effortLevel}
              onChange={(val) => onUpdate({ effortLevel: val })}
            />
            <RatingInput
              label="Pain Level"
              value={completion.painLevel}
              onChange={(val) => onUpdate({ painLevel: val })}
              colorScale
            />
          </div>

          {/* Skip Reason */}
          {completion.isSkipped && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Reason for Skipping
              </label>
              <select
                value={completion.skipReason || ''}
                onChange={(e) => onUpdate({ skipReason: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select reason...</option>
                <option value="fatigue">Fatigue / Low Energy</option>
                <option value="pain">Pain / Discomfort</option>
                <option value="equipment">Equipment Not Available</option>
                <option value="time">Time Constraint</option>
                <option value="injury">Injury Prevention</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Notes / Feedback
            </label>
            <textarea
              value={completion.athleteNotes || ''}
              onChange={(e) => onUpdate({ athleteNotes: e.target.value })}
              placeholder="How did this exercise feel? Any issues or observations..."
              rows={2}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate({
                isFullyCompleted: true,
                isPartiallyCompleted: false,
                isSkipped: false
              })}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                completion.isFullyCompleted
                  ? 'bg-green-500 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              Fully Completed
            </button>
            <button
              onClick={() => onUpdate({
                isFullyCompleted: false,
                isPartiallyCompleted: true,
                isSkipped: false
              })}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                completion.isPartiallyCompleted
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }`}
            >
              Partially Done
            </button>
            <button
              onClick={() => onUpdate({
                isFullyCompleted: false,
                isPartiallyCompleted: false,
                isSkipped: true
              })}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                completion.isSkipped
                  ? 'bg-red-500 text-white'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              Skipped
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function DailyTrainingPage() {
  const [workout, setWorkout] = useState<DailyWorkout>(DEMO_WORKOUT);
  const [completions, setCompletions] = useState<Record<string, ExerciseCompletion>>({});
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [overallNotes, setOverallNotes] = useState('');
  const [overallRPE, setOverallRPE] = useState<number | undefined>();
  const [energyLevel, setEnergyLevel] = useState<number | undefined>();
  const [technicalFeel, setTechnicalFeel] = useState<number | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Initialize completions
  useEffect(() => {
    const initialCompletions: Record<string, ExerciseCompletion> = {};
    workout.exercises.forEach((exercise) => {
      initialCompletions[exercise.id] = {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        exerciseCategory: exercise.category,
        plannedSets: exercise.sets,
        plannedReps: exercise.reps,
        plannedWeight: exercise.weight,
        plannedDistance: exercise.distance,
        plannedDuration: exercise.duration,
        plannedIntensity: exercise.intensity,
        isFullyCompleted: false,
        isPartiallyCompleted: false,
        isSkipped: false,
      };
    });
    setCompletions(initialCompletions);
  }, [workout]);

  const updateCompletion = (exerciseId: string, data: Partial<ExerciseCompletion>) => {
    setCompletions((prev) => ({
      ...prev,
      [exerciseId]: { ...prev[exerciseId], ...data },
    }));
    setIsSaved(false);
  };

  const calculateProgress = () => {
    const total = Object.keys(completions).length;
    if (total === 0) return { completed: 0, partial: 0, skipped: 0, pending: 0, percent: 0 };

    const completed = Object.values(completions).filter((c) => c.isFullyCompleted).length;
    const partial = Object.values(completions).filter((c) => c.isPartiallyCompleted).length;
    const skipped = Object.values(completions).filter((c) => c.isSkipped).length;
    const pending = total - completed - partial - skipped;
    const percent = Math.round(((completed + partial * 0.5) / total) * 100);

    return { completed, partial, skipped, pending, percent };
  };

  const handleSave = async () => {
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log('Saving workout completion:', {
      workoutId: workout.id,
      exerciseCompletions: Object.values(completions),
      overallRPE,
      energyLevel,
      technicalFeel,
      overallNotes,
    });

    setIsSaving(false);
    setIsSaved(true);
  };

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Calendar className="w-4 h-4" />
                {new Date(workout.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <h1 className="text-xl font-bold text-gray-900">Daily Training Log</h1>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isSaved
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isSaved ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaved ? 'Saved' : 'Save Progress'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Workout Info Card */}
        <div className="bg-white rounded-xl border p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              <Target className="w-4 h-4" />
              {workout.phase}
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              Week {workout.weekNumber}
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              <Dumbbell className="w-4 h-4" />
              {workout.workoutType}
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              <Clock className="w-4 h-4" />
              {workout.plannedDuration} min
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              <Zap className="w-4 h-4" />
              RPE {workout.plannedRPE}
            </div>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mt-3">
            {workout.primaryFocus}
          </h2>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">Workout Progress</h3>
            <span className="text-lg font-bold text-blue-600">{progress.percent}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <div className="flex items-center gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-gray-600">Completed: {progress.completed}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="text-gray-600">Partial: {progress.partial}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-gray-600">Skipped: {progress.skipped}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-300 rounded-full" />
              <span className="text-gray-600">Pending: {progress.pending}</span>
            </div>
          </div>
        </div>

        {/* Exercise List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Exercises ({workout.exercises.length})
          </h3>
          {workout.exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              completion={completions[exercise.id] || {
                exerciseId: exercise.id,
                exerciseName: exercise.name,
                exerciseCategory: exercise.category,
                isFullyCompleted: false,
                isPartiallyCompleted: false,
                isSkipped: false,
              }}
              onUpdate={(data) => updateCompletion(exercise.id, data)}
              isExpanded={expandedExercise === exercise.id}
              onToggle={() => setExpandedExercise(
                expandedExercise === exercise.id ? null : exercise.id
              )}
            />
          ))}
        </div>

        {/* Overall Session Feedback */}
        <div className="bg-white rounded-xl border p-4 space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Overall Session Feedback
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RatingInput
              label="Overall RPE"
              value={overallRPE}
              onChange={setOverallRPE}
            />
            <RatingInput
              label="Energy Level"
              value={energyLevel}
              onChange={setEnergyLevel}
            />
            <RatingInput
              label="Technical Feel"
              value={technicalFeel}
              onChange={setTechnicalFeel}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              Session Notes
            </label>
            <textarea
              value={overallNotes}
              onChange={(e) => setOverallNotes(e.target.value)}
              placeholder="How did the overall session feel? Any observations for your coach..."
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors ${
            isSaved
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isSaving ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </span>
          ) : isSaved ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Training Log Saved
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />
              Save Training Log
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
