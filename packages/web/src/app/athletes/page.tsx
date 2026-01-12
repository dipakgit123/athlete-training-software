'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
  Search,
  Filter,
  Plus,
  Users,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { ReadinessGauge } from '@/components/ui/ReadinessGauge';

// Athlete interface for localStorage data
interface StoredAthlete {
  id: string;
  firstName: string;
  lastName: string;
  primaryEvent: string;
  ageCategory: string;
  gender: string;
  readinessScore: number;
  readinessCategory: string;
  hasAlerts: boolean;
  alertCount: number;
  acwr: number;
  weeklyLoad: number;
  phase: string;
  createdAt: string;
}

// Mock data
const mockAthletes = [
  {
    id: '1',
    name: 'Rahul Sharma',
    event: '100m Sprint',
    category: 'SENIOR',
    gender: 'MALE',
    readinessScore: 85,
    readinessCategory: 'OPTIMAL',
    hasAlerts: false,
    alertCount: 0,
    acwr: 1.15,
    weeklyLoad: 1850,
    phase: 'SPP1',
  },
  {
    id: '2',
    name: 'Priya Patel',
    event: '400m',
    category: 'SENIOR',
    gender: 'FEMALE',
    readinessScore: 72,
    readinessCategory: 'GOOD',
    hasAlerts: true,
    alertCount: 1,
    acwr: 1.32,
    weeklyLoad: 2100,
    phase: 'SPP1',
  },
  {
    id: '3',
    name: 'Amit Kumar',
    event: 'Long Jump',
    category: 'JUNIOR',
    gender: 'MALE',
    readinessScore: 58,
    readinessCategory: 'MODERATE',
    hasAlerts: true,
    alertCount: 2,
    acwr: 1.08,
    weeklyLoad: 1650,
    phase: 'GPP',
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    event: '200m Sprint',
    category: 'SENIOR',
    gender: 'FEMALE',
    readinessScore: 91,
    readinessCategory: 'OPTIMAL',
    hasAlerts: false,
    alertCount: 0,
    acwr: 1.05,
    weeklyLoad: 1700,
    phase: 'SPP2',
  },
  {
    id: '5',
    name: 'Vikram Singh',
    event: 'Shot Put',
    category: 'SENIOR',
    gender: 'MALE',
    readinessScore: 78,
    readinessCategory: 'GOOD',
    hasAlerts: false,
    alertCount: 0,
    acwr: 0.95,
    weeklyLoad: 1500,
    phase: 'GPP',
  },
  {
    id: '6',
    name: 'Ananya Gupta',
    event: '800m',
    category: 'JUNIOR',
    gender: 'FEMALE',
    readinessScore: 45,
    readinessCategory: 'LOW',
    hasAlerts: true,
    alertCount: 1,
    acwr: 1.45,
    weeklyLoad: 2400,
    phase: 'SPP1',
  },
  {
    id: '7',
    name: 'Ravi Deshmukh',
    event: 'Javelin',
    category: 'SENIOR',
    gender: 'MALE',
    readinessScore: 82,
    readinessCategory: 'OPTIMAL',
    hasAlerts: false,
    alertCount: 0,
    acwr: 1.12,
    weeklyLoad: 1600,
    phase: 'Competition',
  },
  {
    id: '8',
    name: 'Meera Nair',
    event: 'High Jump',
    category: 'JUNIOR',
    gender: 'FEMALE',
    readinessScore: 68,
    readinessCategory: 'GOOD',
    hasAlerts: false,
    alertCount: 0,
    acwr: 0.88,
    weeklyLoad: 1400,
    phase: 'GPP',
  },
];

export default function AthletesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [readinessFilter, setReadinessFilter] = useState<string>('all');
  const [allAthletes, setAllAthletes] = useState(mockAthletes);

  // Load athletes from API
  useEffect(() => {
    const loadAthletes = async () => {
      try {
        const response = await api.getAthletes();
        if (response.success && response.data?.athletes) {
          // Convert API athletes to display format
          const formattedAthletes = response.data.athletes.map((athlete: any) => ({
            id: athlete.id,
            name: `${athlete.user?.firstName || ''} ${athlete.user?.lastName || ''}`.trim(),
            event: athlete.events?.[0]?.eventType || 'N/A',
            category: athlete.category || 'N/A',
            gender: athlete.gender || 'N/A',
            readinessScore: 75 + Math.floor(Math.random() * 20), // TODO: Calculate from actual wellness data
            readinessCategory: 'GOOD',
            hasAlerts: false,
            alertCount: 0,
            acwr: 1.0 + (Math.random() * 0.3),
            weeklyLoad: Math.floor(Math.random() * 500) + 1500,
            phase: 'GPP',
          }));

          // Merge with mock athletes (keep mock athletes that don't exist in DB)
          const apiAthleteIds = new Set(response.data.athletes.map((a: any) => a.id));
          const uniqueMockAthletes = mockAthletes.filter(
            (mockAthlete) => !apiAthleteIds.has(mockAthlete.id)
          );

          // Combine: API athletes first, then mock athletes
          setAllAthletes([...formattedAthletes, ...uniqueMockAthletes]);
        } else {
          // If API fails, fall back to mock data
          setAllAthletes(mockAthletes);
        }
      } catch (error) {
        console.error('Error loading athletes from API:', error);
        // Fall back to mock data on error
        setAllAthletes(mockAthletes);
      }
    };

    loadAthletes();
  }, []);

  const filteredAthletes = allAthletes.filter((athlete) => {
    const matchesSearch = athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      athlete.event.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || athlete.category === categoryFilter;

    const matchesReadiness = readinessFilter === 'all' ||
      (readinessFilter === 'optimal' && athlete.readinessScore >= 80) ||
      (readinessFilter === 'good' && athlete.readinessScore >= 60 && athlete.readinessScore < 80) ||
      (readinessFilter === 'attention' && athlete.readinessScore < 60);

    return matchesSearch && matchesCategory && matchesReadiness;
  });

  const getReadinessColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    if (score >= 40) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  const getACWRColor = (acwr: number) => {
    if (acwr < 0.8) return 'text-blue-600';
    if (acwr <= 1.3) return 'text-green-600';
    if (acwr <= 1.5) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Athletes</h1>
          <p className="text-gray-500">Manage and monitor your athletes</p>
        </div>
        <Link
          href="/athletes/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Athlete
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{allAthletes.length}</p>
              <p className="text-sm text-gray-500">Total Athletes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold">{allAthletes.filter(a => a.readinessScore >= 80).length}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ready (80+)</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 font-bold">{allAthletes.filter(a => a.readinessScore >= 60 && a.readinessScore < 80).length}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Moderate (60-79)</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{allAthletes.filter(a => a.hasAlerts).length}</p>
              <p className="text-sm text-gray-500">With Alerts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search athletes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="SENIOR">Senior</option>
            <option value="JUNIOR">Junior</option>
            <option value="YOUTH">Youth</option>
          </select>

          {/* Readiness Filter */}
          <select
            value={readinessFilter}
            onChange={(e) => setReadinessFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Readiness</option>
            <option value="optimal">Optimal (80+)</option>
            <option value="good">Good (60-79)</option>
            <option value="attention">Needs Attention (&lt;60)</option>
          </select>
        </div>
      </div>

      {/* Athletes Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Athlete
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Readiness
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACWR
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phase
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alerts
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAthletes.map((athlete) => (
              <tr
                key={athlete.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => router.push(`/athletes/${athlete.id}`)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {athlete.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{athlete.name}</p>
                      <p className="text-xs text-gray-500">{athlete.category} • {athlete.gender}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900">{athlete.event}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <ReadinessGauge score={athlete.readinessScore} size="sm" />
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`font-semibold ${getACWRColor(athlete.acwr)}`}>
                    {athlete.acwr.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                    {athlete.phase}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {athlete.alertCount > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                      <AlertTriangle className="w-3 h-3" />
                      {athlete.alertCount}
                    </span>
                  ) : (
                    <span className="text-green-600 text-sm">✓</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAthletes.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">No athletes found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
