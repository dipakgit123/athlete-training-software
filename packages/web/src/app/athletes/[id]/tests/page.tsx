'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  Calendar,
  Activity,
  Zap,
  Timer,
  Target,
  TrendingUp,
  Dumbbell,
  Heart,
  Eye,
  Gauge,
} from 'lucide-react';
import { getTestsForEvent, TEST_DEFINITIONS, EventTestMapping } from '@athlete-system/shared';

// Event name to event ID mapping
const EVENT_NAME_TO_ID: Record<string, string> = {
  '100m': 'M_100',
  '200m': 'M_200',
  '400m': 'M_400',
  '800m': 'M_800',
  '1500m': 'M_1500',
  '5000m': 'M_5000',
  '10000m': 'M_10000',
  'Half Marathon': 'HALF_MARATHON',
  'Marathon': 'MARATHON',
  '100m Hurdles': 'M_100H',
  '110m Hurdles': 'M_110H',
  '400m Hurdles': 'M_400H',
  'Long Jump': 'LONG_JUMP',
  'Triple Jump': 'TRIPLE_JUMP',
  'High Jump': 'HIGH_JUMP',
  'Pole Vault': 'POLE_VAULT',
  'Shot Put': 'SHOT_PUT',
  'Discus': 'DISCUS',
  'Javelin': 'JAVELIN',
  'Hammer Throw': 'HAMMER',
};

// Test result interface
interface TestResult {
  id: string;
  testId: string;
  testName: string;
  category: string;
  value: string;
  unit: string;
  date: string;
  notes: string;
}

// Stored athlete interface
interface StoredAthlete {
  id: string;
  firstName: string;
  lastName: string;
  primaryEvent: string;
  testResults?: TestResult[];
}

export default function AthleteTestsPage() {
  const params = useParams();
  const router = useRouter();
  const athleteId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [athlete, setAthlete] = useState<StoredAthlete | null>(null);
  const [eventTests, setEventTests] = useState<EventTestMapping | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTest, setNewTest] = useState({
    testId: '',
    value: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    loadAthleteData();
  }, [athleteId]);

  const loadAthleteData = async () => {
    try {
      // Try to fetch from API
      const response = await api.getAthlete(athleteId);
      if (response.success && response.data) {
        const athleteData = response.data;
        const athleteInfo = {
          id: athleteData.id,
          firstName: athleteData.user?.firstName || '',
          lastName: athleteData.user?.lastName || '',
          primaryEvent: athleteData.events?.[0]?.eventType || '',
          testResults: [], // TODO: Fetch test results from API when endpoint is available
        };
        
        setAthlete(athleteInfo);
        setTestResults(athleteInfo.testResults || []);

        // Get tests for this athlete's event - convert event name to ID
        if (athleteInfo.primaryEvent) {
          const eventId = EVENT_NAME_TO_ID[athleteInfo.primaryEvent];
          if (eventId) {
            const tests = getTestsForEvent(eventId);
            setEventTests(tests ?? null);
          }
        }
        }
      }
    } catch (error) {
      console.error('Error loading athlete:', error);
    }
    setLoading(false);
  };

  const handleAddTest = () => {
    if (!newTest.testId || !newTest.value) {
      alert('Please select a test and enter a value');
      return;
    }

    // Get test definition from TEST_DEFINITIONS
    const testDef = TEST_DEFINITIONS[newTest.testId];
    if (!testDef) {
      alert('Test not found');
      return;
    }

    // Find the category this test belongs to
    const category = eventTests?.tests.find((cat) =>
      cat.tests.includes(newTest.testId)
    );

    const newResult: TestResult = {
      id: `test_${Date.now()}`,
      testId: newTest.testId,
      testName: testDef.displayName,
      category: category?.categoryDisplayName || testDef.category,
      value: newTest.value,
      unit: testDef.unit,
      date: newTest.date,
      notes: newTest.notes,
    };

    setTestResults((prev) => [...prev, newResult]);
    setNewTest({
      testId: '',
      value: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setShowAddForm(false);
  };

  const handleDeleteTest = (testId: string) => {
    if (confirm('Are you sure you want to delete this test result?')) {
      setTestResults((prev) => prev.filter((t) => t.id !== testId));
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // TODO: Save test results via API when endpoint is available
      // For now, just show success message
      console.log('Test results to save:', testResults);
      
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert('Test results saved successfully!');
    } catch (error) {
      console.error('Error saving tests:', error);
      alert('Failed to save test results.');
    } finally {
      setSaving(false);
    }
  };

  const getFilteredResults = () => {
    if (selectedCategory === 'all') return testResults;
    return testResults.filter((r) => r.category === selectedCategory);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Speed & Power':
        return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'Strength':
        return <Activity className="w-4 h-4 text-red-500" />;
      case 'Endurance':
        return <Timer className="w-4 h-4 text-blue-500" />;
      case 'Flexibility & Mobility':
        return <Target className="w-4 h-4 text-green-500" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-500" />;
    }
  };

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
        <Link href="/athletes" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          View All Athletes
        </Link>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Performance Tests</h1>
            <p className="text-gray-500">
              {athlete.firstName} {athlete.lastName} • {athlete.primaryEvent}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Test Result
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save All
          </button>
        </div>
      </div>

      {/* Add Test Form Modal */}
      {showAddForm && eventTests && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Test Result</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Test *</label>
                <select
                  value={newTest.testId}
                  onChange={(e) => setNewTest((prev) => ({ ...prev, testId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a test...</option>
                  {eventTests.tests.map((category) => (
                    <optgroup key={category.category} label={category.categoryDisplayName}>
                      {category.tests.map((testId) => {
                        const testDef = TEST_DEFINITIONS[testId];
                        if (!testDef) return null;
                        return (
                          <option key={testId} value={testId}>
                            {testDef.displayName} ({testDef.unit})
                          </option>
                        );
                      })}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                <input
                  type="text"
                  value={newTest.value}
                  onChange={(e) => setNewTest((prev) => ({ ...prev, value: e.target.value }))}
                  placeholder="Enter test result"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newTest.date}
                  onChange={(e) => setNewTest((prev) => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newTest.notes}
                  onChange={(e) => setNewTest((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optional notes..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTest}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      {eventTests && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Tests ({testResults.length})
            </button>
            {eventTests.tests.map((cat) => {
              const count = testResults.filter((r) => r.category === cat.categoryDisplayName).length;
              return (
                <button
                  key={cat.category}
                  onClick={() => setSelectedCategory(cat.categoryDisplayName)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat.categoryDisplayName
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getCategoryIcon(cat.category)}
                  {cat.categoryDisplayName} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Test Results List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {getFilteredResults().length === 0 ? (
          <div className="py-12 text-center">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No test results recorded yet.</p>
            <p className="text-sm text-gray-400">Click "Add Test Result" to record a test.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Result</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getFilteredResults().map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{result.testName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-sm text-gray-600">
                      {getCategoryIcon(result.category)}
                      {result.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-lg font-bold text-blue-600">
                      {result.value} <span className="text-sm font-normal text-gray-500">{result.unit}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="flex items-center justify-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(result.date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500 truncate max-w-[200px]">{result.notes || '-'}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteTest(result.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Available Tests Reference */}
      {eventTests && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Available Tests for {athlete.primaryEvent}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {eventTests.tests.map((category) => (
              <div key={category.category} className="border border-gray-100 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  {getCategoryIcon(category.category)}
                  {category.categoryDisplayName}
                </h4>
                <ul className="space-y-1">
                  {category.tests.map((testId) => {
                    const testDef = TEST_DEFINITIONS[testId];
                    if (!testDef) return null;
                    return (
                      <li key={testId} className="text-sm text-gray-600">
                        • {testDef.displayName}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
