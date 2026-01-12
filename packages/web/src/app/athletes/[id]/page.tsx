'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
  ArrowLeft,
  User,
  Calendar,
  Activity,
  Heart,
  TrendingUp,
  AlertTriangle,
  Clock,
  Trophy,
  Target,
  Dumbbell,
  Zap,
  Edit,
  ClipboardList,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ReadinessGauge } from '@/components/ui/ReadinessGauge';
import { PerformanceDashboard } from '@/components/dashboard/PerformanceDashboard';

// Mock athlete data - will be replaced with API call
const mockAthleteData: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Rahul Sharma',
    dateOfBirth: '1998-05-15',
    gender: 'MALE',
    category: 'SENIOR',
    primaryEvent: '100m Sprint',
    secondaryEvents: ['200m Sprint'],
    coach: 'Coach Mangesh',
    nationality: 'India',
    height: 178,
    weight: 72,
    profileImage: null,
    readiness: {
      score: 85,
      category: 'OPTIMAL',
      components: {
        sleep: 90,
        cardiac: 82,
        fatigue: 85,
        mental: 88,
        hydration: 80,
      },
    },
    personalBests: [
      { event: '100m', time: '10.45', date: '2024-08-15', venue: 'Delhi' },
      { event: '200m', time: '21.15', date: '2024-07-20', venue: 'Mumbai' },
    ],
    currentPhase: 'SPP1',
    weekInPhase: 3,
    loadMetrics: {
      acwr: 1.15,
      weeklyLoad: 1850,
      monotony: 1.4,
      strain: 2590,
    },
    upcomingCompetitions: [
      { name: 'National Championship', date: '2025-01-15', priority: 'A' },
      { name: 'State Meet', date: '2025-02-20', priority: 'B' },
    ],
    recentSessions: [
      { date: '2024-12-18', type: 'Speed', load: 180, completed: true },
      { date: '2024-12-17', type: 'Strength', load: 150, completed: true },
      { date: '2024-12-16', type: 'Tempo', load: 120, completed: true },
    ],
    alerts: [],
    // Performance data for dashboard
    targetPB: '10.20s',
    shortTermGoals: 'Break 10.40s barrier by March 2025\nImprove start reaction time to under 0.14s\nIncrease max velocity phase by 5%',
    longTermGoals: 'Qualify for 2028 Olympics\nBreak national record (10.18s)\nConsistent sub-10.30s performances',
    testResults: {
      // Strength Tests
      'squat_1rm': { value: '165', date: '2024-12-01' },
      'front_squat_1rm': { value: '140', date: '2024-12-01' },
      'deadlift_1rm': { value: '190', date: '2024-12-01' },
      'bench_press_1rm': { value: '95', date: '2024-12-01' },
      'hip_thrust_1rm': { value: '180', date: '2024-12-01' },
      'clean_1rm': { value: '105', date: '2024-12-05' },
      // Sprint Tests
      'sprint_10m_time': { value: '1.72', date: '2024-12-15' },
      'sprint_30m_time': { value: '3.85', date: '2024-12-15' },
      'sprint_60m_time': { value: '6.62', date: '2024-12-15' },
      'sprint_100m_time': { value: '10.45', date: '2024-12-15' },
      'flying_10m': { value: '0.92', date: '2024-12-15' },
      'flying_20m_time': { value: '1.78', date: '2024-12-15' },
      // Reaction Tests
      'reaction_time': { value: '0.142', date: '2024-12-15' },
      'block_clearance_time': { value: '0.38', date: '2024-12-15' },
      // Power Tests
      'vertical_jump_cm': { value: '68', date: '2024-12-10' },
      'cmj_height': { value: '65', date: '2024-12-10' },
      'squat_jump_height': { value: '58', date: '2024-12-10' },
      'broad_jump': { value: '3.15', date: '2024-12-10' },
      'standing_long_jump_cm': { value: '315', date: '2024-12-10' },
      // Biomechanics Tests
      'stride_length': { value: '2.35', date: '2024-12-12' },
      'stride_frequency': { value: '4.85', date: '2024-12-12' },
      'ground_contact_time': { value: '0.092', date: '2024-12-12' },
      // Injury Prevention Tests
      'nordic_hamstring': { value: '32', date: '2024-12-08' },
      'ham_quad_ratio': { value: '0.62', date: '2024-12-08' },
      'ankle_dorsiflexion': { value: '42', date: '2024-12-08' },
      // Core Tests
      'plank_hold': { value: '180', date: '2024-12-05' },
      'side_plank_left': { value: '95', date: '2024-12-05' },
      'side_plank_right': { value: '92', date: '2024-12-05' },
    },
  },
  '2': {
    id: '2',
    name: 'Priya Patel',
    dateOfBirth: '2000-03-22',
    gender: 'FEMALE',
    category: 'SENIOR',
    primaryEvent: '400m',
    secondaryEvents: ['200m'],
    coach: 'Coach Mangesh',
    nationality: 'India',
    height: 165,
    weight: 55,
    profileImage: null,
    readiness: {
      score: 72,
      category: 'GOOD',
      components: {
        sleep: 75,
        cardiac: 70,
        fatigue: 68,
        mental: 80,
        hydration: 72,
      },
    },
    personalBests: [
      { event: '400m', time: '52.85', date: '2024-09-10', venue: 'Chennai' },
      { event: '200m', time: '24.32', date: '2024-08-05', venue: 'Delhi' },
    ],
    currentPhase: 'SPP1',
    weekInPhase: 3,
    loadMetrics: {
      acwr: 1.32,
      weeklyLoad: 2100,
      monotony: 1.6,
      strain: 3360,
    },
    upcomingCompetitions: [
      { name: 'National Championship', date: '2025-01-15', priority: 'A' },
    ],
    recentSessions: [
      { date: '2024-12-18', type: 'Tempo', load: 200, completed: true },
      { date: '2024-12-17', type: 'Speed Endurance', load: 220, completed: true },
    ],
    alerts: [
      { type: 'ACWR_HIGH', message: 'ACWR elevated at 1.32', severity: 'MEDIUM' },
    ],
  },
  '3': {
    id: '3',
    name: 'Amit Kumar',
    dateOfBirth: '2002-11-08',
    gender: 'MALE',
    category: 'JUNIOR',
    primaryEvent: 'Long Jump',
    secondaryEvents: ['Triple Jump'],
    coach: 'Coach Mangesh',
    nationality: 'India',
    height: 182,
    weight: 70,
    profileImage: null,
    readiness: {
      score: 58,
      category: 'MODERATE',
      components: {
        sleep: 60,
        cardiac: 55,
        fatigue: 50,
        mental: 65,
        hydration: 62,
      },
    },
    personalBests: [
      { event: 'Long Jump', time: '7.45m', date: '2024-10-20', venue: 'Bangalore' },
    ],
    currentPhase: 'GPP',
    weekInPhase: 5,
    loadMetrics: {
      acwr: 1.08,
      weeklyLoad: 1650,
      monotony: 1.3,
      strain: 2145,
    },
    upcomingCompetitions: [
      { name: 'Junior Nationals', date: '2025-02-10', priority: 'A' },
    ],
    recentSessions: [
      { date: '2024-12-18', type: 'Recovery', load: 50, completed: false },
    ],
    alerts: [
      { type: 'LOW_READINESS', message: 'Readiness below 60', severity: 'MEDIUM' },
      { type: 'HIGH_SORENESS', message: 'Muscle soreness elevated', severity: 'LOW' },
    ],
  },
};

// Interface for localStorage stored athlete
interface StoredAthlete {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  height: string;
  weight: string;
  primaryEvent: string;
  secondaryEvent: string;
  ageCategory: string;
  currentCoach: string;
  readinessScore: number;
  readinessCategory: string;
  hasAlerts: boolean;
  alertCount: number;
  acwr: number;
  weeklyLoad: number;
  phase: string;
  // Additional fields for dashboard
  personalBest?: string;
  targetPB?: string;
  shortTermGoals?: string;
  longTermGoals?: string;
  testResults?: Record<string, { value: string; date: string }>;
}

// Convert stored athlete to display format
function convertStoredAthlete(stored: StoredAthlete): any {
  return {
    id: stored.id,
    name: `${stored.firstName} ${stored.lastName}`,
    dateOfBirth: stored.dateOfBirth || '2000-01-01',
    gender: stored.gender || 'MALE',
    category: stored.ageCategory || 'SENIOR',
    primaryEvent: stored.primaryEvent || 'Unknown',
    secondaryEvents: stored.secondaryEvent ? [stored.secondaryEvent] : [],
    coach: stored.currentCoach || 'Coach Mangesh',
    nationality: 'India',
    height: parseInt(stored.height) || 170,
    weight: parseInt(stored.weight) || 65,
    profileImage: null,
    readiness: {
      score: stored.readinessScore || 75,
      category: stored.readinessCategory || 'GOOD',
      components: {
        sleep: 75,
        cardiac: 70,
        fatigue: 72,
        mental: 78,
        hydration: 75,
      },
    },
    personalBests: stored.personalBest ? [{ event: stored.primaryEvent, time: stored.personalBest, date: '2024-01-01', venue: 'Training' }] : [],
    currentPhase: stored.phase || 'GPP',
    weekInPhase: 1,
    loadMetrics: {
      acwr: stored.acwr || 1.0,
      weeklyLoad: stored.weeklyLoad || 1500,
      monotony: 1.3,
      strain: 1950,
    },
    upcomingCompetitions: [],
    recentSessions: [],
    alerts: [],
    // Additional fields for dashboard
    targetPB: stored.targetPB,
    shortTermGoals: stored.shortTermGoals,
    longTermGoals: stored.longTermGoals,
    testResults: stored.testResults || {},
  };
}

export default function AthleteProfilePage() {
  const params = useParams();
  const router = useRouter();
  const athleteId = params?.id as string;
  const [athlete, setAthlete] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const loadAthlete = async () => {
      // Try to fetch from API first
      try {
        const response = await api.getAthlete(athleteId);
        if (response.success && response.data) {
          const athleteData = response.data;
          // Convert API data to display format
          setAthlete({
            id: athleteData.id,
            name: `${athleteData.user?.firstName || ''} ${athleteData.user?.lastName || ''}`.trim(),
            firstName: athleteData.user?.firstName || '',
            lastName: athleteData.user?.lastName || '',
            email: athleteData.user?.email || '',
            dateOfBirth: athleteData.dateOfBirth?.split('T')[0] || '',
            gender: athleteData.gender || '',
            category: athleteData.category || '',
            nationality: athleteData.nationality || '',
            height: athleteData.height || 0,
            weight: athleteData.weight || 0,
            primaryEvent: athleteData.events?.[0]?.eventType || 'N/A',
            events: athleteData.events || [],
            personalBests: athleteData.personalBests || [],
            goals: athleteData.goals || [],
            readinessScore: 75 + Math.floor(Math.random() * 20), // TODO: Calculate from wellness data
            readinessCategory: 'GOOD',
            hasAlerts: false,
            alertCount: 0,
            acwr: 1.0 + (Math.random() * 0.3),
            weeklyLoad: Math.floor(Math.random() * 500) + 1500,
            phase: 'GPP',
            // Add loadMetrics object
            loadMetrics: {
              acwr: 1.0 + (Math.random() * 0.3),
              weeklyLoad: Math.floor(Math.random() * 500) + 1500,
              monotony: 1.3,
              strain: 1950,
            },
            readiness: {
              score: 75 + Math.floor(Math.random() * 20),
              category: 'GOOD',
              components: {
                sleep: 75,
                cardiac: 70,
                fatigue: 72,
                mental: 78,
                hydration: 75,
              },
            },
            currentPhase: 'GPP',
            weekInPhase: 1,
            upcomingCompetitions: [],
            recentSessions: [],
            alerts: [],
          });
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error loading athlete from API:', error);
      }

      // Fall back to mock data if API fails
      if (mockAthleteData[athleteId]) {
        setAthlete(mockAthleteData[athleteId]);
        setLoading(false);
        return;
      }

      setLoading(false);
    };

    loadAthlete();
  }, [athleteId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Athlete Not Found</h1>
        <p className="text-gray-500 mb-6">The athlete you're looking for doesn't exist.</p>
        <Link
          href="/athletes"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          View All Athletes
        </Link>
      </div>
    );
  }

  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getACWRStatus = (acwr: number) => {
    if (acwr < 0.8) return { color: 'text-blue-600', label: 'Low (Undertraining)' };
    if (acwr <= 1.3) return { color: 'text-green-600', label: 'Optimal' };
    if (acwr <= 1.5) return { color: 'text-orange-600', label: 'High Risk' };
    return { color: 'text-red-600', label: 'Very High Risk' };
  };

  const acwrStatus = getACWRStatus(athlete.loadMetrics.acwr);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{athlete.name}</h1>
            <p className="text-gray-500">{athlete.primaryEvent} • {athlete.category}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Edit Button */}
          <Link
            href={`/athletes/${athleteId}/edit`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <Edit className="w-5 h-5" />
            Edit Profile
          </Link>
          
          {/* Dashboard Toggle Button */}
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              showDashboard
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            {showDashboard ? 'Hide Dashboard' : 'View Performance Dashboard'}
            {showDashboard ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Performance Dashboard (collapsible) */}
      {showDashboard && athlete.testResults && Object.keys(athlete.testResults).length > 0 && (
        <PerformanceDashboard
          athleteName={athlete.name}
          primaryEvent={athlete.primaryEvent}
          testResults={athlete.testResults}
          targetPB={athlete.targetPB}
          currentPB={athlete.personalBests?.[0]?.time}
          goals={{
            shortTerm: athlete.shortTermGoals,
            longTerm: athlete.longTermGoals,
          }}
        />
      )}

      {/* Show message if dashboard is open but no test data */}
      {showDashboard && (!athlete.testResults || Object.keys(athlete.testResults).length === 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <BarChart3 className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">No Test Data Available</h3>
          <p className="text-yellow-700 mb-4">
            Record test results to see performance charts and comparisons.
          </p>
          <Link
            href={`/athletes/${athlete.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            <Edit className="w-4 h-4" />
            Add Test Results
          </Link>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Readiness */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {athlete.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{athlete.name}</h2>
                <p className="text-gray-500">{athlete.primaryEvent}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {athlete.category}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Age</p>
                <p className="font-medium">{new Date().getFullYear() - new Date(athlete.dateOfBirth).getFullYear()} years</p>
              </div>
              <div>
                <p className="text-gray-500">Gender</p>
                <p className="font-medium">{athlete.gender}</p>
              </div>
              <div>
                <p className="text-gray-500">Height</p>
                <p className="font-medium">{athlete.height} cm</p>
              </div>
              <div>
                <p className="text-gray-500">Weight</p>
                <p className="font-medium">{athlete.weight} kg</p>
              </div>
              <div>
                <p className="text-gray-500">Coach</p>
                <p className="font-medium">{athlete.coach}</p>
              </div>
              <div>
                <p className="text-gray-500">Phase</p>
                <p className="font-medium">{athlete.currentPhase} (Week {athlete.weekInPhase})</p>
              </div>
            </div>
          </div>

          {/* Readiness Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Today's Readiness
            </h3>

            <div className="flex justify-center mb-6">
              <ReadinessGauge score={athlete.readiness.score} size="lg" />
            </div>

            <p className={`text-center text-lg font-semibold mb-4 ${getReadinessColor(athlete.readiness.score)}`}>
              {athlete.readiness.category}
            </p>

            <div className="space-y-3">
              {Object.entries(athlete.readiness.components).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{key}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          (value as number) >= 80 ? 'bg-green-500' :
                          (value as number) >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{value as number}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          {athlete.alerts.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Active Alerts
              </h3>
              <div className="space-y-3">
                {athlete.alerts.map((alert: any, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      alert.severity === 'HIGH' ? 'bg-red-50 border border-red-200' :
                      alert.severity === 'MEDIUM' ? 'bg-orange-50 border border-orange-200' :
                      'bg-yellow-50 border border-yellow-200'
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-900">{alert.type}</p>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Middle Column - Load & Performance */}
        <div className="space-y-6">
          {/* Load Metrics */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Load Metrics
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase">ACWR</p>
                <p className={`text-2xl font-bold ${acwrStatus.color}`}>
                  {athlete.loadMetrics.acwr.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">{acwrStatus.label}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase">Weekly Load</p>
                <p className="text-2xl font-bold text-gray-900">
                  {athlete.loadMetrics.weeklyLoad}
                </p>
                <p className="text-xs text-gray-500">AU</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase">Monotony</p>
                <p className="text-2xl font-bold text-gray-900">
                  {athlete.loadMetrics.monotony.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500">{athlete.loadMetrics.monotony < 2 ? 'Good Variety' : 'Low Variety'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase">Strain</p>
                <p className="text-2xl font-bold text-gray-900">
                  {athlete.loadMetrics.strain}
                </p>
                <p className="text-xs text-gray-500">AU</p>
              </div>
            </div>
          </div>

          {/* Personal Bests */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Personal Bests
            </h3>

            <div className="space-y-3">
              {athlete.personalBests.map((pb: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{pb.event}</p>
                    <p className="text-xs text-gray-500">{pb.venue} • {new Date(pb.date).toLocaleDateString()}</p>
                  </div>
                  <p className="text-xl font-bold text-blue-600">{pb.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-purple-500" />
              Recent Sessions
            </h3>

            <div className="space-y-3">
              {athlete.recentSessions.map((session: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${session.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div>
                      <p className="font-medium text-gray-900">{session.type}</p>
                      <p className="text-xs text-gray-500">{new Date(session.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{session.load} AU</p>
                    <p className="text-xs text-gray-500">{session.completed ? 'Completed' : 'Pending'}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={`/sessions?athleteId=${athlete.id}`}
              className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700"
            >
              View All Sessions →
            </Link>
          </div>
        </div>

        {/* Right Column - Competitions & Actions */}
        <div className="space-y-6">
          {/* Upcoming Competitions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              Upcoming Competitions
            </h3>

            <div className="space-y-3">
              {athlete.upcomingCompetitions.map((comp: any, index: number) => (
                <div key={index} className="p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">{comp.name}</p>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      comp.priority === 'A' ? 'bg-red-100 text-red-700' :
                      comp.priority === 'B' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      Priority {comp.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(comp.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Quick Actions
            </h3>

            <div className="space-y-2">
              <Link
                href={`/athletes/${athlete.id}/tests`}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <span className="text-sm font-medium text-blue-700">Record Test Results</span>
                <ClipboardList className="w-4 h-4 text-blue-500" />
              </Link>
              <Link
                href={`/athletes/${athlete.id}/edit`}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
              >
                <span className="text-sm text-gray-700">Edit Profile</span>
                <Edit className="w-4 h-4 text-gray-400" />
              </Link>
              <Link
                href={`/wellness?athleteId=${athlete.id}`}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
              >
                <span className="text-sm text-gray-700">Submit Wellness Check</span>
                <Heart className="w-4 h-4 text-gray-400" />
              </Link>
              <Link
                href={`/sessions?athleteId=${athlete.id}&action=new`}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
              >
                <span className="text-sm text-gray-700">Create Session</span>
                <Dumbbell className="w-4 h-4 text-gray-400" />
              </Link>
              <Link
                href={`/reports?athleteId=${athlete.id}`}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
              >
                <span className="text-sm text-gray-700">View Reports</span>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
