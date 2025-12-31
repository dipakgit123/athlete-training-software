/**
 * Wellness Form Component
 * Morning readiness check input form
 */

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Moon,
  Heart,
  Activity,
  Brain,
  Smile,
  Droplets,
  Apple,
} from 'lucide-react';

// Validation Schema
const wellnessSchema = z.object({
  sleepHours: z.number().min(0).max(14),
  sleepQuality: z.number().min(1).max(10),
  restingHR: z.number().min(30).max(120),
  hrvRmssd: z.number().min(10).max(200).optional(),
  perceivedFatigue: z.number().min(1).max(10),
  muscleSoreness: z.number().min(1).max(10),
  stressLevel: z.number().min(1).max(10),
  mood: z.number().min(1).max(10),
  hydrationStatus: z.number().min(1).max(10),
  nutritionCompliance: z.number().min(0).max(100),
  notes: z.string().optional(),
});

type WellnessFormData = z.infer<typeof wellnessSchema>;

interface WellnessFormProps {
  onSubmit: (data: WellnessFormData) => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<WellnessFormData>;
}

export function WellnessForm({
  onSubmit,
  isSubmitting = false,
  defaultValues,
}: WellnessFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WellnessFormData>({
    resolver: zodResolver(wellnessSchema),
    defaultValues: {
      sleepHours: 8,
      sleepQuality: 7,
      restingHR: 55,
      perceivedFatigue: 3,
      muscleSoreness: 3,
      stressLevel: 3,
      mood: 7,
      hydrationStatus: 7,
      nutritionCompliance: 80,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Sleep Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Moon className="w-5 h-5 text-indigo-500" />
          <h3 className="font-semibold text-gray-900">Sleep</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Hours of Sleep
            </label>
            <input
              type="number"
              step="0.5"
              {...register('sleepHours', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.sleepHours && (
              <p className="text-red-500 text-xs mt-1">{errors.sleepHours.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Sleep Quality (1-10)
            </label>
            <RatingInput
              value={watch('sleepQuality')}
              onChange={(v) => setValue('sleepQuality', v)}
              max={10}
            />
          </div>
        </div>
      </div>

      {/* Heart Rate & HRV */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold text-gray-900">Heart Rate</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Resting HR (bpm)
            </label>
            <input
              type="number"
              {...register('restingHR', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              HRV - RMSSD (ms)
            </label>
            <input
              type="number"
              {...register('hrvRmssd', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Optional"
            />
          </div>
        </div>
      </div>

      {/* Fatigue & Soreness */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-gray-900">Physical State</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Perceived Fatigue (1 = Fresh, 10 = Exhausted)
            </label>
            <RatingInput
              value={watch('perceivedFatigue')}
              onChange={(v) => setValue('perceivedFatigue', v)}
              max={10}
              labels={['Fresh', 'Exhausted']}
              invertColor
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Muscle Soreness (1 = None, 10 = Very Sore)
            </label>
            <RatingInput
              value={watch('muscleSoreness')}
              onChange={(v) => setValue('muscleSoreness', v)}
              max={10}
              labels={['None', 'Very Sore']}
              invertColor
            />
          </div>
        </div>
      </div>

      {/* Mental State */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-gray-900">Mental State</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Stress Level (1 = Relaxed, 10 = Very Stressed)
            </label>
            <RatingInput
              value={watch('stressLevel')}
              onChange={(v) => setValue('stressLevel', v)}
              max={10}
              labels={['Relaxed', 'Stressed']}
              invertColor
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Mood (1 = Poor, 10 = Excellent)
            </label>
            <RatingInput
              value={watch('mood')}
              onChange={(v) => setValue('mood', v)}
              max={10}
              labels={['Poor', 'Excellent']}
            />
          </div>
        </div>
      </div>

      {/* Nutrition & Hydration */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Droplets className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900">Nutrition & Hydration</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Hydration Status (1-10)
            </label>
            <RatingInput
              value={watch('hydrationStatus')}
              onChange={(v) => setValue('hydrationStatus', v)}
              max={10}
              labels={['Dehydrated', 'Well Hydrated']}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Nutrition Compliance (%)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                {...register('nutritionCompliance', { valueAsNumber: true })}
                className="flex-1"
              />
              <span className="text-lg font-medium text-gray-900 w-12 text-right">
                {watch('nutritionCompliance')}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <label className="block text-sm text-gray-600 mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Any other information to share..."
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Wellness Check'}
      </button>
    </form>
  );
}

// Rating Input Component
function RatingInput({
  value,
  onChange,
  max = 10,
  labels,
  invertColor = false,
}: {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  labels?: [string, string];
  invertColor?: boolean;
}) {
  const getColor = (index: number) => {
    const ratio = index / max;
    if (invertColor) {
      // Red to green (for negative metrics like fatigue)
      if (ratio < 0.3) return 'bg-green-500';
      if (ratio < 0.6) return 'bg-yellow-500';
      return 'bg-red-500';
    } else {
      // Green gradient (for positive metrics)
      if (ratio < 0.3) return 'bg-red-500';
      if (ratio < 0.6) return 'bg-yellow-500';
      return 'bg-green-500';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {Array.from({ length: max }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              value >= num
                ? `${getColor(num)} text-white`
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
      {labels && (
        <div className="flex justify-between text-xs text-gray-500">
          <span>{labels[0]}</span>
          <span>{labels[1]}</span>
        </div>
      )}
    </div>
  );
}

export default WellnessForm;
