'use client';

import React, { useState } from 'react';
import {
  Heart,
  Moon,
  Activity,
  Brain,
  Droplets,
  TrendingUp,
  TrendingDown,
  Check,
  AlertTriangle,
  User,
} from 'lucide-react';
import { BodyMap } from '@/components/wellness/BodyMap';

// Mock athletes for dropdown
const mockAthletes = [
  { id: '1', name: 'Rahul Sharma' },
  { id: '2', name: 'Priya Patel' },
  { id: '3', name: 'Amit Kumar' },
  { id: '4', name: 'Sneha Reddy' },
  { id: '5', name: 'Vikram Singh' },
  { id: '6', name: 'Ananya Gupta' },
];

// Mock wellness history
const mockWellnessHistory = [
  { date: '2024-12-18', readiness: 85, sleep: 8.5, fatigue: 3, mood: 8, soreness: 2 },
  { date: '2024-12-17', readiness: 78, sleep: 7.0, fatigue: 5, mood: 7, soreness: 4 },
  { date: '2024-12-16', readiness: 82, sleep: 8.0, fatigue: 4, mood: 8, soreness: 3 },
  { date: '2024-12-15', readiness: 72, sleep: 6.5, fatigue: 6, mood: 6, soreness: 5 },
  { date: '2024-12-14', readiness: 88, sleep: 9.0, fatigue: 2, mood: 9, soreness: 2 },
];

export default function WellnessPage() {
  const [selectedAthlete, setSelectedAthlete] = useState('1');
  const [formData, setFormData] = useState({
    sleepDuration: 8,
    sleepQuality: 7,
    energy: 7,
    fatigue: 4,
    stress: 4,
    mood: 7,
    motivation: 8,
    muscleSoreness: 3,
    restingHR: 55,
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [sorenessData, setSorenessData] = useState<Record<string, any>>({});

  const selectedAthleteName = mockAthletes.find(a => a.id === selectedAthlete)?.name || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting wellness data:', { athleteId: selectedAthlete, ...formData });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleSliderChange = (field: string, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getSliderColor = (value: number, inverted = false) => {
    const effectiveValue = inverted ? 10 - value : value;
    if (effectiveValue >= 7) return 'bg-green-500';
    if (effectiveValue >= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wellness Check-In</h1>
          <p className="text-gray-500">Daily wellness monitoring and readiness assessment</p>
        </div>

        {/* Athlete Selector */}
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Wellness Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Today's Check-In</h2>

            <div className="space-y-6">
              {/* Sleep Section */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Moon className="w-5 h-5 text-blue-600" />
                  <h3 className="font-medium text-gray-900">Sleep</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Sleep Duration: {formData.sleepDuration} hours
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="12"
                      step="0.5"
                      value={formData.sleepDuration}
                      onChange={(e) => handleSliderChange('sleepDuration', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Sleep Quality: {formData.sleepQuality}/10
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.sleepQuality}
                      onChange={(e) => handleSliderChange('sleepQuality', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Physical State */}
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-gray-900">Physical State</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Energy Level: {formData.energy}/10
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.energy}
                      onChange={(e) => handleSliderChange('energy', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Fatigue Level: {formData.fatigue}/10 (lower is better)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.fatigue}
                      onChange={(e) => handleSliderChange('fatigue', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Resting Heart Rate: {formData.restingHR} bpm
                    </label>
                    <input
                      type="number"
                      min="40"
                      max="100"
                      value={formData.restingHR}
                      onChange={(e) => handleSliderChange('restingHR', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Body Map for Muscle Soreness */}
              <BodyMap
                athleteId={selectedAthlete}
                athleteName={selectedAthleteName}
                onChange={setSorenessData}
                initialData={sorenessData}
              />

              {/* Mental State */}
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-gray-900">Mental State</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Mood: {formData.mood}/10
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.mood}
                      onChange={(e) => handleSliderChange('mood', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Stress Level: {formData.stress}/10 (lower is better)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.stress}
                      onChange={(e) => handleSliderChange('stress', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Motivation: {formData.motivation}/10
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.motivation}
                      onChange={(e) => handleSliderChange('motivation', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Notes (optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional notes about today's wellness..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitted}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  submitted
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {submitted ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    Submitted Successfully!
                  </span>
                ) : (
                  'Submit Wellness Check'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: History & Stats */}
        <div className="space-y-6">
          {/* Current Readiness */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Current Readiness</h3>

            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100">
                <span className="text-3xl font-bold text-green-600">85</span>
              </div>
              <p className="mt-2 text-sm text-green-600 font-medium">OPTIMAL</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Sleep Score</span>
                <span className="font-medium">90%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Physical Score</span>
                <span className="font-medium">82%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Mental Score</span>
                <span className="font-medium">88%</span>
              </div>
            </div>
          </div>

          {/* Recent History */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent History</h3>

            <div className="space-y-3">
              {mockWellnessHistory.map((entry, index) => (
                <div
                  key={entry.date}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      Sleep: {entry.sleep}h • Fatigue: {entry.fatigue}/10
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-lg font-bold ${
                        entry.readiness >= 80
                          ? 'text-green-600'
                          : entry.readiness >= 60
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {entry.readiness}
                    </span>
                    {index > 0 && (
                      entry.readiness > mockWellnessHistory[index - 1]?.readiness ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : entry.readiness < mockWellnessHistory[index - 1]?.readiness ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      ) : null
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Wellness Alerts
            </h3>

            <div className="space-y-2">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Average sleep duration is below 7 hours this week
                </p>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  Fatigue trending upward over past 3 days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
