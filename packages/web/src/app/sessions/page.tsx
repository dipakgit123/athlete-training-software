'use client';

import React, { useState } from 'react';
import {
  Dumbbell,
  Calendar,
  Clock,
  User,
  ChevronRight,
  Plus,
  Play,
  CheckCircle,
  XCircle,
  Filter,
  Zap,
  Target,
} from 'lucide-react';

// Mock sessions data
const mockSessions = [
  {
    id: 's1',
    date: '2024-12-19',
    time: '06:00 AM',
    type: 'SPEED',
    title: 'Speed Development',
    athlete: { id: '1', name: 'Rahul Sharma', readiness: 85 },
    status: 'UPCOMING',
    plannedDuration: 90,
    plannedLoad: 180,
    location: 'Track A',
    phase: 'SPP1',
    workout: {
      warmup: '20 min dynamic warmup',
      main: '4x60m @ 95%, 3x80m @ 90%',
      cooldown: '15 min jog + stretch',
    },
  },
  {
    id: 's2',
    date: '2024-12-19',
    time: '08:30 AM',
    type: 'TEMPO',
    title: 'Tempo Training',
    athlete: { id: '2', name: 'Priya Patel', readiness: 72 },
    status: 'IN_PROGRESS',
    plannedDuration: 80,
    plannedLoad: 150,
    location: 'Track B',
    phase: 'SPP1',
    workout: {
      warmup: '15 min dynamic warmup',
      main: '6x200m @ 75% with 90s rest',
      cooldown: '10 min jog + stretch',
    },
  },
  {
    id: 's3',
    date: '2024-12-19',
    time: '04:00 PM',
    type: 'STRENGTH',
    title: 'Strength & Power',
    athlete: { id: '5', name: 'Vikram Singh', readiness: 78 },
    status: 'UPCOMING',
    plannedDuration: 75,
    plannedLoad: 160,
    location: 'Weight Room',
    phase: 'GPP',
    workout: {
      warmup: '10 min activation',
      main: 'Squats 4x5 @ 80%, Power Cleans 3x3',
      cooldown: '10 min mobility',
    },
  },
  {
    id: 's4',
    date: '2024-12-18',
    time: '06:00 AM',
    type: 'SPEED',
    title: 'Acceleration Work',
    athlete: { id: '1', name: 'Rahul Sharma', readiness: 82 },
    status: 'COMPLETED',
    plannedDuration: 90,
    plannedLoad: 175,
    actualDuration: 85,
    actualLoad: 165,
    location: 'Track A',
    phase: 'SPP1',
    notes: 'Good session, felt strong on 60m efforts',
  },
  {
    id: 's5',
    date: '2024-12-18',
    time: '08:00 AM',
    type: 'SPEED_ENDURANCE',
    title: 'Speed Endurance',
    athlete: { id: '2', name: 'Priya Patel', readiness: 75 },
    status: 'COMPLETED',
    plannedDuration: 100,
    plannedLoad: 200,
    actualDuration: 95,
    actualLoad: 190,
    location: 'Track A',
    phase: 'SPP1',
    notes: 'Completed all reps, slight fatigue in last set',
  },
  {
    id: 's6',
    date: '2024-12-17',
    time: '04:00 PM',
    type: 'RECOVERY',
    title: 'Active Recovery',
    athlete: { id: '3', name: 'Amit Kumar', readiness: 58 },
    status: 'CANCELLED',
    plannedDuration: 45,
    plannedLoad: 50,
    location: 'Pool',
    phase: 'GPP',
    notes: 'Cancelled due to low readiness',
  },
];

const sessionTypeColors: Record<string, string> = {
  SPEED: 'bg-red-100 text-red-700',
  SPEED_ENDURANCE: 'bg-orange-100 text-orange-700',
  TEMPO: 'bg-yellow-100 text-yellow-700',
  STRENGTH: 'bg-purple-100 text-purple-700',
  RECOVERY: 'bg-green-100 text-green-700',
  COMPETITION: 'bg-blue-100 text-blue-700',
};

const statusIcons: Record<string, React.ReactNode> = {
  UPCOMING: <Clock className="w-4 h-4 text-gray-500" />,
  IN_PROGRESS: <Play className="w-4 h-4 text-blue-500" />,
  COMPLETED: <CheckCircle className="w-4 h-4 text-green-500" />,
  CANCELLED: <XCircle className="w-4 h-4 text-red-500" />,
};

export default function SessionsPage() {
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const filteredSessions = mockSessions.filter((session) => {
    const matchesDate = selectedDate === 'all' || session.date === selectedDate;
    const matchesType = selectedType === 'all' || session.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || session.status === selectedStatus;
    return matchesDate && matchesType && matchesStatus;
  });

  const selectedSessionData = mockSessions.find((s) => s.id === selectedSession);

  const uniqueDates = [...new Set(mockSessions.map((s) => s.date))].sort().reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training Sessions</h1>
          <p className="text-gray-500">Plan, track, and analyze training sessions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          New Session
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockSessions.filter((s) => s.date === '2024-12-19').length}
              </p>
              <p className="text-sm text-gray-500">Today's Sessions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockSessions.filter((s) => s.status === 'COMPLETED').length}
              </p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockSessions.filter((s) => s.status === 'IN_PROGRESS').length}
              </p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockSessions.reduce((sum, s) => sum + (s.actualLoad || s.plannedLoad), 0)}
              </p>
              <p className="text-sm text-gray-500">Total Load (AU)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Dates</option>
            {uniqueDates.map((date) => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="SPEED">Speed</option>
            <option value="SPEED_ENDURANCE">Speed Endurance</option>
            <option value="TEMPO">Tempo</option>
            <option value="STRENGTH">Strength</option>
            <option value="RECOVERY">Recovery</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setSelectedSession(session.id)}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                selectedSession === session.id
                  ? 'border-blue-500 ring-2 ring-blue-100'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{session.title}</h3>
                    <p className="text-sm text-gray-500">{session.athlete.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${sessionTypeColors[session.type] || 'bg-gray-100 text-gray-700'}`}>
                    {session.type.replace('_', ' ')}
                  </span>
                  {statusIcons[session.status]}
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {session.time}
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {session.plannedLoad} AU
                </span>
              </div>

              {session.status === 'COMPLETED' && session.notes && (
                <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                  {session.notes}
                </p>
              )}
            </div>
          ))}

          {filteredSessions.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No sessions found matching your filters.</p>
            </div>
          )}
        </div>

        {/* Session Details */}
        <div className="space-y-6">
          {selectedSessionData ? (
            <>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Session Details</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Type</p>
                    <p className="font-medium">{selectedSessionData.type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Phase</p>
                    <p className="font-medium">{selectedSessionData.phase}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Location</p>
                    <p className="font-medium">{selectedSessionData.location}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Duration</p>
                      <p className="font-medium">{selectedSessionData.plannedDuration} min</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Planned Load</p>
                      <p className="font-medium">{selectedSessionData.plannedLoad} AU</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedSessionData.workout && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Workout Plan</h3>

                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600 uppercase font-medium mb-1">Warmup</p>
                      <p className="text-sm text-gray-700">{selectedSessionData.workout.warmup}</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-xs text-orange-600 uppercase font-medium mb-1">Main Workout</p>
                      <p className="text-sm text-gray-700">{selectedSessionData.workout.main}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-600 uppercase font-medium mb-1">Cooldown</p>
                      <p className="text-sm text-gray-700">{selectedSessionData.workout.cooldown}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedSessionData.status === 'UPCOMING' && (
                <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Start Session
                </button>
              )}
              {selectedSessionData.status === 'IN_PROGRESS' && (
                <button className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Complete Session
                </button>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a session to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
