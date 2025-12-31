'use client';

/**
 * UNIVERSAL TEST ENTRY FORM
 * World-Class Athletics Performance System
 *
 * सगळ्या tests साठी एक universal form
 * Plotting साठी योग्य data structure
 */

import React, { useState, useEffect } from 'react';
import {
  TEST_DEFINITIONS,
  TestDefinition,
  getTestsForEvent,
  getAllTestIdsForEvent,
  EventTestMapping
} from '@athlete-system/shared';

// Type for category in tests array
type EventTestCategory = EventTestMapping['tests'][number];

// ============================================
// TYPES
// ============================================

export interface TestEntryData {
  athleteId: string;
  testId: string;
  testDate: string;
  value: number;
  unit: string;
  leftValue?: number;
  rightValue?: number;
  attemptNumber?: number;
  isBest?: boolean;
  conditions?: string;
  equipment?: string;
  notes?: string;
  videoUrl?: string;
  testedBy?: string;
}

interface TestEntryFormProps {
  athleteId: string;
  athleteEvent: string;  // Primary event of athlete
  onSubmit: (data: TestEntryData) => void;
  onCancel?: () => void;
  preSelectedTest?: string;
  isLoading?: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function TestEntryForm({
  athleteId,
  athleteEvent,
  onSubmit,
  onCancel,
  preSelectedTest,
  isLoading = false
}: TestEntryFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTestId, setSelectedTestId] = useState<string>(preSelectedTest || '');
  const [selectedTest, setSelectedTest] = useState<TestDefinition | null>(null);

  // Form values
  const [testDate, setTestDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [value, setValue] = useState<string>('');
  const [leftValue, setLeftValue] = useState<string>('');
  const [rightValue, setRightValue] = useState<string>('');
  const [attemptNumber, setAttemptNumber] = useState<number>(1);
  const [isBest, setIsBest] = useState<boolean>(false);
  const [conditions, setConditions] = useState<string>('');
  const [equipment, setEquipment] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [testedBy, setTestedBy] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [eventTests, setEventTests] = useState<EventTestMapping | null>(null);

  // Load event-specific tests
  useEffect(() => {
    if (athleteEvent) {
      const tests = getTestsForEvent(athleteEvent);
      setEventTests(tests ?? null);
    }
  }, [athleteEvent]);

  // Load selected test definition
  useEffect(() => {
    if (selectedTestId) {
      const test = TEST_DEFINITIONS[selectedTestId];
      setSelectedTest(test || null);
    } else {
      setSelectedTest(null);
    }
  }, [selectedTestId]);

  // ============================================
  // VALIDATION
  // ============================================

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedTestId) {
      newErrors.testId = 'Please select a test';
    }

    if (!testDate) {
      newErrors.testDate = 'Test date is required';
    }

    if (selectedTest?.hasLeftRight) {
      if (!leftValue && !rightValue) {
        newErrors.value = 'Enter at least one value (left or right)';
      }
    } else {
      if (!value) {
        newErrors.value = 'Test value is required';
      }
    }

    // Validate numeric values
    if (value && isNaN(parseFloat(value))) {
      newErrors.value = 'Value must be a number';
    }
    if (leftValue && isNaN(parseFloat(leftValue))) {
      newErrors.leftValue = 'Left value must be a number';
    }
    if (rightValue && isNaN(parseFloat(rightValue))) {
      newErrors.rightValue = 'Right value must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================
  // HANDLERS
  // ============================================

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !selectedTest) return;

    const data: TestEntryData = {
      athleteId,
      testId: selectedTestId,
      testDate,
      value: parseFloat(value) || 0,
      unit: selectedTest.unit,
      attemptNumber: selectedTest.attemptBased ? attemptNumber : undefined,
      isBest,
      conditions: conditions || undefined,
      equipment: equipment || undefined,
      notes: notes || undefined,
      videoUrl: videoUrl || undefined,
      testedBy: testedBy || undefined
    };

    if (selectedTest.hasLeftRight) {
      data.leftValue = leftValue ? parseFloat(leftValue) : undefined;
      data.rightValue = rightValue ? parseFloat(rightValue) : undefined;
      // For bilateral tests, use the better value as main value
      if (selectedTest.valueDirection === 'lower_better') {
        data.value = Math.min(
          data.leftValue || Infinity,
          data.rightValue || Infinity
        );
      } else {
        data.value = Math.max(
          data.leftValue || 0,
          data.rightValue || 0
        );
      }
    }

    onSubmit(data);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedTestId('');
    setSelectedTest(null);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900">
          Record Test Result
          <span className="text-sm font-normal text-gray-500 ml-2">
            Test निकाल नोंदवा
          </span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Test Selection */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">
            1. Select Test / Test निवडा
          </h3>

          {/* Category Selection */}
          {eventTests && (
            <div className="flex flex-wrap gap-2">
              {eventTests.tests.map((cat: EventTestCategory) => (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => handleCategorySelect(cat.category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat.category
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.categoryDisplayName}
                  <span className="ml-1 text-xs opacity-75">
                    ({cat.tests.length})
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Test Selection */}
          {selectedCategory && eventTests && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 border rounded-lg">
              {eventTests.tests
                .find((c: EventTestCategory) => c.category === selectedCategory)
                ?.tests.map((testId: string) => {
                  const test = TEST_DEFINITIONS[testId];
                  if (!test) return null;
                  return (
                    <button
                      key={testId}
                      type="button"
                      onClick={() => setSelectedTestId(testId)}
                      className={`p-3 text-left rounded-lg border transition-colors ${
                        selectedTestId === testId
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium text-sm text-gray-900">
                        {test.displayName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {test.unit}
                        {test.hasLeftRight && ' (L/R)'}
                      </div>
                    </button>
                  );
                })}
            </div>
          )}

          {errors.testId && (
            <p className="text-sm text-red-500">{errors.testId}</p>
          )}
        </div>

        {/* Test Details */}
        {selectedTest && (
          <>
            {/* Test Info Banner */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-blue-900">
                    {selectedTest.displayName}
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {selectedTest.description}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedTest.valueDirection === 'lower_better'
                      ? 'bg-green-100 text-green-800'
                      : selectedTest.valueDirection === 'higher_better'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedTest.valueDirection === 'lower_better'
                      ? '↓ Lower is Better'
                      : selectedTest.valueDirection === 'higher_better'
                      ? '↑ Higher is Better'
                      : '◎ Optimal Range'}
                  </span>
                </div>
              </div>
              {selectedTest.equipment && selectedTest.equipment.length > 0 && (
                <div className="mt-2 text-xs text-blue-600">
                  Equipment: {selectedTest.equipment.join(', ')}
                </div>
              )}
            </div>

            {/* Date and Attempt */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.testDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.testDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.testDate}</p>
                )}
              </div>

              {selectedTest.attemptBased && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attempt Number
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setAttemptNumber(num)}
                        className={`w-10 h-10 rounded-lg font-medium ${
                          attemptNumber === num
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Value Entry */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">
                2. Enter Value / मूल्य टाका
              </h3>

              {selectedTest.hasLeftRight ? (
                /* Bilateral Entry */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Left / डावा ({selectedTest.unit})
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={leftValue}
                      onChange={(e) => setLeftValue(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-lg ${
                        errors.leftValue ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={`Enter left ${selectedTest.unit}`}
                    />
                    {errors.leftValue && (
                      <p className="mt-1 text-sm text-red-500">{errors.leftValue}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Right / उजवा ({selectedTest.unit})
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={rightValue}
                      onChange={(e) => setRightValue(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-lg ${
                        errors.rightValue ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={`Enter right ${selectedTest.unit}`}
                    />
                    {errors.rightValue && (
                      <p className="mt-1 text-sm text-red-500">{errors.rightValue}</p>
                    )}
                  </div>

                  {/* Asymmetry Indicator */}
                  {leftValue && rightValue && (
                    <div className="md:col-span-2">
                      {(() => {
                        const left = parseFloat(leftValue);
                        const right = parseFloat(rightValue);
                        const max = Math.max(left, right);
                        const asymmetry = ((Math.abs(left - right) / max) * 100).toFixed(1);
                        const dominant = left > right ? 'Left' : right > left ? 'Right' : 'Equal';
                        const status = parseFloat(asymmetry) <= 10 ? 'good' :
                          parseFloat(asymmetry) <= 15 ? 'attention' : 'concern';

                        return (
                          <div className={`p-3 rounded-lg ${
                            status === 'good' ? 'bg-green-50 text-green-800' :
                            status === 'attention' ? 'bg-yellow-50 text-yellow-800' :
                            'bg-red-50 text-red-800'
                          }`}>
                            <div className="flex justify-between">
                              <span>Asymmetry: <strong>{asymmetry}%</strong></span>
                              <span>Dominant: <strong>{dominant}</strong></span>
                            </div>
                            {status !== 'good' && (
                              <p className="text-sm mt-1">
                                {status === 'attention'
                                  ? 'Monitor asymmetry - consider corrective exercises'
                                  : 'High asymmetry - injury risk increased'}
                              </p>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                /* Single Value Entry */
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value ({selectedTest.unit}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-xl font-mono ${
                      errors.value ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={`Enter ${selectedTest.unit}`}
                  />
                  {errors.value && (
                    <p className="mt-1 text-sm text-red-500">{errors.value}</p>
                  )}

                  {/* Optimal Range Indicator */}
                  {selectedTest.optimalRange && value && (
                    <div className="mt-2">
                      {(() => {
                        const val = parseFloat(value);
                        const { min, max } = selectedTest.optimalRange!;
                        const status = val >= min && val <= max ? 'optimal' :
                          val < min ? 'below' : 'above';

                        return (
                          <div className={`p-2 rounded text-sm ${
                            status === 'optimal' ? 'bg-green-50 text-green-800' :
                            'bg-yellow-50 text-yellow-800'
                          }`}>
                            {status === 'optimal'
                              ? `✓ Within optimal range (${min} - ${max})`
                              : status === 'below'
                              ? `↓ Below optimal (Target: ${min} - ${max})`
                              : `↑ Above optimal (Target: ${min} - ${max})`}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Best Attempt Toggle */}
              {selectedTest.attemptBased && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBest}
                    onChange={(e) => setIsBest(e.target.checked)}
                    className="w-5 h-5 text-blue-500 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Mark as Best Attempt / सर्वोत्तम प्रयत्न
                  </span>
                </label>
              )}
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">
                3. Additional Details / अतिरिक्त माहिती
                <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conditions (Weather, Track, etc.)
                  </label>
                  <input
                    type="text"
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Sunny, 25°C, Synthetic track"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipment Used
                  </label>
                  <input
                    type="text"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Freelap timing gates"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tested By
                  </label>
                  <input
                    type="text"
                    value={testedBy}
                    onChange={(e) => setTestedBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Coach/Tester name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes / टिप्पणी
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Any observations, technique notes, etc."
                />
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || !selectedTest}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Test Result'}
          </button>
        </div>
      </form>
    </div>
  );
}
