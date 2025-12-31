'use client';

import { useRouter } from 'next/navigation';
import { CoachDashboard } from '@/components';

// Mock data for demo - will be replaced with API data
const mockStats = {
  totalAthletes: 12,
  athletesReady: 8,
  athletesCaution: 3,
  athletesRest: 1,
  todaySessions: 4,
  completedSessions: 1,
  activeAlerts: 3,
  weeklyLoadAvg: 1850,
  injuryCount: 0,
};

const mockAthletes = [
  {
    id: '1',
    name: 'Rahul Sharma',
    event: '100m Sprint',
    category: 'SENIOR',
    readinessScore: 85,
    readinessCategory: 'excellent' as const,
    hasAlerts: false,
    alertCount: 0,
    todaySessionStatus: 'pending' as const,
  },
  {
    id: '2',
    name: 'Priya Patel',
    event: '400m',
    category: 'SENIOR',
    readinessScore: 72,
    readinessCategory: 'good' as const,
    hasAlerts: true,
    alertCount: 1,
    todaySessionStatus: 'in_progress' as const,
  },
  {
    id: '3',
    name: 'Amit Kumar',
    event: 'Long Jump',
    category: 'JUNIOR',
    readinessScore: 58,
    readinessCategory: 'moderate' as const,
    hasAlerts: true,
    alertCount: 2,
    todaySessionStatus: 'pending' as const,
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    event: '200m Sprint',
    category: 'SENIOR',
    readinessScore: 91,
    readinessCategory: 'excellent' as const,
    hasAlerts: false,
    alertCount: 0,
    todaySessionStatus: 'completed' as const,
  },
  {
    id: '5',
    name: 'Vikram Singh',
    event: 'Shot Put',
    category: 'SENIOR',
    readinessScore: 78,
    readinessCategory: 'good' as const,
    hasAlerts: false,
    alertCount: 0,
    todaySessionStatus: 'pending' as const,
  },
  {
    id: '6',
    name: 'Ananya Gupta',
    event: '800m',
    category: 'JUNIOR',
    readinessScore: 45,
    readinessCategory: 'poor' as const,
    hasAlerts: true,
    alertCount: 1,
    todaySessionStatus: 'cancelled' as const,
  },
];

const mockAlerts = [
  {
    id: '1',
    athleteId: '2',
    athleteName: 'Priya Patel',
    level: 'yellow' as const,
    category: 'Load Management',
    message: 'ACWR is 1.32 - monitor training load closely',
    action: 'Review weekly load distribution',
    timestamp: new Date(),
    acknowledged: false,
  },
  {
    id: '2',
    athleteId: '3',
    athleteName: 'Amit Kumar',
    level: 'orange' as const,
    category: 'Recovery',
    message: 'Readiness dropped below 60 - recommend recovery day',
    action: 'Consider modifying today\'s session',
    timestamp: new Date(),
    acknowledged: false,
  },
  {
    id: '3',
    athleteId: '6',
    athleteName: 'Ananya Gupta',
    level: 'red' as const,
    category: 'Fatigue',
    message: 'Critical fatigue level detected - rest required',
    action: 'Cancel training, schedule recovery protocol',
    timestamp: new Date(),
    acknowledged: false,
  },
];

const mockTodaySessions = [
  {
    id: 's1',
    time: '06:00 AM',
    type: 'Speed Development',
    athletes: [
      { id: '1', name: 'Rahul Sharma', readinessScore: 85 },
      { id: '4', name: 'Sneha Reddy', readinessScore: 91 },
    ],
    location: 'Track A',
    status: 'completed' as const,
  },
  {
    id: 's2',
    time: '08:30 AM',
    type: 'Tempo Training',
    athletes: [
      { id: '2', name: 'Priya Patel', readinessScore: 72 },
    ],
    location: 'Track B',
    status: 'in_progress' as const,
  },
  {
    id: 's3',
    time: '04:00 PM',
    type: 'Strength & Conditioning',
    athletes: [
      { id: '5', name: 'Vikram Singh', readinessScore: 78 },
      { id: '3', name: 'Amit Kumar', readinessScore: 58 },
    ],
    location: 'Gym',
    status: 'upcoming' as const,
  },
  {
    id: 's4',
    time: '05:30 PM',
    type: 'Recovery Session',
    athletes: [
      { id: '6', name: 'Ananya Gupta', readinessScore: 45 },
    ],
    location: 'Recovery Room',
    status: 'upcoming' as const,
  },
];

const mockUpcomingWeek = [
  { day: 'Thu', date: '19', sessions: 'Speed, Strength', hasCompetition: false },
  { day: 'Fri', date: '20', sessions: 'Tempo, Recovery', hasCompetition: false },
  { day: 'Sat', date: '21', sessions: 'Speed Endurance', hasCompetition: true },
  { day: 'Sun', date: '22', sessions: 'Rest Day', hasCompetition: false },
  { day: 'Mon', date: '23', sessions: 'GPP, Strength', hasCompetition: false },
  { day: 'Tue', date: '24', sessions: 'Speed, Tempo', hasCompetition: false },
  { day: 'Wed', date: '25', sessions: 'Recovery', hasCompetition: false },
];

export default function Home() {
  const router = useRouter();

  const handleAthleteClick = (id: string) => {
    router.push(`/athletes/${id}`);
  };

  const handleAlertAcknowledge = (id: string) => {
    console.log('Alert acknowledged:', id);
    // TODO: Call API to acknowledge alert
  };

  const handleSessionClick = (id: string) => {
    router.push(`/sessions?id=${id}`);
  };

  return (
    <CoachDashboard
      stats={mockStats}
      athletes={mockAthletes}
      alerts={mockAlerts}
      todaySessions={mockTodaySessions}
      upcomingWeek={mockUpcomingWeek}
      onAthleteClick={handleAthleteClick}
      onAlertAcknowledge={handleAlertAcknowledge}
      onSessionClick={handleSessionClick}
    />
  );
}
