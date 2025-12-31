'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Dumbbell,
  Trophy,
  Clock,
} from 'lucide-react';

// Mock events
const mockEvents = [
  { id: '1', date: '2024-12-19', type: 'session', title: 'Speed Development', athlete: 'Rahul Sharma', time: '06:00' },
  { id: '2', date: '2024-12-19', type: 'session', title: 'Tempo Training', athlete: 'Priya Patel', time: '08:30' },
  { id: '3', date: '2024-12-21', type: 'competition', title: 'State Championship', priority: 'A' },
  { id: '4', date: '2024-12-23', type: 'session', title: 'Strength Session', athlete: 'Vikram Singh', time: '16:00' },
  { id: '5', date: '2024-12-25', type: 'rest', title: 'Rest Day' },
  { id: '6', date: '2025-01-15', type: 'competition', title: 'National Championship', priority: 'A' },
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventsForDate = (date: string) => {
    return mockEvents.filter((event) => event.date === date);
  };

  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training Calendar</h1>
          <p className="text-gray-500">Plan and track training sessions and competitions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {months[month]} {year}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before first day of month */}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dateStr = formatDate(day);
              const events = getEventsForDate(dateStr);
              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square p-1 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-transparent hover:bg-gray-50'
                  } ${isToday(day) ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                >
                  <div className="h-full flex flex-col">
                    <span
                      className={`text-sm font-medium ${
                        isToday(day) ? 'text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      {day}
                    </span>
                    {events.length > 0 && (
                      <div className="flex-1 flex flex-col gap-0.5 mt-1">
                        {events.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs px-1 py-0.5 rounded truncate ${
                              event.type === 'competition'
                                ? 'bg-yellow-100 text-yellow-700'
                                : event.type === 'rest'
                                ? 'bg-gray-100 text-gray-600'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{events.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 rounded" />
              <span className="text-sm text-gray-600">Training</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-100 rounded" />
              <span className="text-sm text-gray-600">Competition</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-100 rounded" />
              <span className="text-sm text-gray-600">Rest</span>
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Select a date'}
            </h3>

            {selectedDate ? (
              selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`p-4 rounded-lg border ${
                        event.type === 'competition'
                          ? 'bg-yellow-50 border-yellow-200'
                          : event.type === 'rest'
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            event.type === 'competition'
                              ? 'bg-yellow-100'
                              : event.type === 'rest'
                              ? 'bg-gray-100'
                              : 'bg-blue-100'
                          }`}
                        >
                          {event.type === 'competition' ? (
                            <Trophy className="w-5 h-5 text-yellow-600" />
                          ) : event.type === 'rest' ? (
                            <CalendarIcon className="w-5 h-5 text-gray-600" />
                          ) : (
                            <Dumbbell className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{event.title}</p>
                          {event.type === 'session' && (
                            <>
                              <p className="text-sm text-gray-500">{event.athlete}</p>
                              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <Clock className="w-4 h-4" />
                                {event.time}
                              </p>
                            </>
                          )}
                          {event.type === 'competition' && event.priority && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                              Priority {event.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No events scheduled for this date
                </p>
              )
            ) : (
              <p className="text-gray-500 text-center py-8">
                Click on a date to view events
              </p>
            )}
          </div>

          {/* Upcoming Competitions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Upcoming Competitions
            </h3>

            <div className="space-y-3">
              {mockEvents
                .filter((e) => e.type === 'competition')
                .map((comp) => (
                  <div key={comp.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{comp.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(comp.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    {comp.priority && (
                      <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                        {comp.priority}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
