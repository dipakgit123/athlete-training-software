'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Loader2,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Ruler,
  Weight,
  Trophy,
  Target,
  Dumbbell,
  TrendingUp,
  Heart,
  Droplet,
  AlertCircle,
  ChevronRight,
  Check,
} from 'lucide-react';
import { BloodReportForm, BloodReportData, initialBloodReportData } from '@/components/forms/BloodReportForm';
import { getTestsForEvent, TEST_DEFINITIONS, EventTestMapping, TestDefinition } from '@athlete-system/shared';

// ==================== EVENT NAME TO ID MAPPING ====================

const EVENT_NAME_TO_ID: Record<string, string> = {
  // Sprints
  '100m': 'M_100',
  '200m': 'M_200',
  '400m': 'M_400',
  // Middle Distance
  '800m': 'M_800',
  '1500m': 'M_1500',
  // Long Distance
  '5000m': 'M_5000',
  '10000m': 'M_10000',
  'Half Marathon': 'HALF_MARATHON',
  'Marathon': 'MARATHON',
  // Hurdles
  '100m Hurdles': 'M_100H',
  '110m Hurdles': 'M_110H',
  '400m Hurdles': 'M_400H',
  // Jumps
  'Long Jump': 'LONG_JUMP',
  'Triple Jump': 'TRIPLE_JUMP',
  'High Jump': 'HIGH_JUMP',
  'Pole Vault': 'POLE_VAULT',
  // Throws
  'Shot Put': 'SHOT_PUT',
  'Discus': 'DISCUS',
  'Javelin': 'JAVELIN',
  'Hammer Throw': 'HAMMER',
};

// ==================== CONSTANTS ====================

const ATHLETE_CATEGORIES = [
  { value: 'SPRINTER', label: 'Sprinter' },
  { value: 'HURDLER', label: 'Hurdler' },
  { value: 'JUMPER', label: 'Jumper' },
  { value: 'THROWER', label: 'Thrower' },
  { value: 'MIDDLE_DISTANCE', label: 'Middle Distance Runner' },
  { value: 'LONG_DISTANCE', label: 'Long Distance Runner' },
  { value: 'HALF_MARATHON', label: 'Half Marathon' },
  { value: 'MARATHON', label: 'Marathon' },
];

const EVENT_CATEGORIES = [
  { value: 'SPRINTS', label: 'Sprints', events: ['100m', '200m', '400m'] },
  { value: 'MIDDLE_DISTANCE', label: 'Middle Distance', events: ['800m', '1500m'] },
  { value: 'LONG_DISTANCE', label: 'Long Distance', events: ['5000m', '10000m', 'Half Marathon', 'Marathon'] },
  { value: 'HURDLES', label: 'Hurdles', events: ['100m Hurdles', '110m Hurdles', '400m Hurdles'] },
  { value: 'JUMPS', label: 'Jumps', events: ['Long Jump', 'Triple Jump', 'High Jump', 'Pole Vault'] },
  { value: 'THROWS', label: 'Throws', events: ['Shot Put', 'Discus', 'Javelin', 'Hammer Throw'] },
  { value: 'COMBINED', label: 'Combined Events', events: ['Decathlon', 'Heptathlon', 'Pentathlon'] },
];

const AGE_CATEGORIES = [
  { value: 'U16', label: 'Youth (U-16)' },
  { value: 'U18', label: 'Junior (U-18)' },
  { value: 'U20', label: 'U-20' },
  { value: 'U23', label: 'U-23' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'MASTERS_35', label: 'Masters (35-39)' },
  { value: 'MASTERS_40', label: 'Masters (40-44)' },
  { value: 'MASTERS_45', label: 'Masters (45+)' },
];

const SHOE_TYPES = [
  'Spikes - Sprint',
  'Spikes - Middle Distance',
  'Spikes - Long Distance',
  'Spikes - Jumping',
  'Spikes - Throwing',
  'Racing Flats',
  'Training Shoes',
  'Cross Training',
];

// ==================== TYPES ====================

interface AthleteFormData {
  // A. Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  nationality: string;
  aadhaarNumber: string;
  passportNumber: string;

  // B. Physical Characteristics
  height: string;
  weight: string;
  bmi: string;
  bodyFatPercentage: string;
  armLength: string;
  legLength: string;
  wingspan: string;
  footSize: string;
  shoeType: string;

  // C. Athlete Type
  athleteCategory: string;
  eventCategory: string;
  primaryEvent: string;
  secondaryEvent: string;
  ageCategory: string;

  // D. Performance History
  personalBest: string;
  seasonBest: string;
  indoorPB: string;
  outdoorPB: string;
  majorCompetitionResults: string;

  // E. Training Information
  currentCoach: string;
  trainingAge: string;
  weeklyTrainingVolume: string;
  strengthTrainingExperience: string;
  speedTrainingExperience: string;
  injuryHistory: string;
  medicalConditions: string;

  // F. Goals & Targets
  targetPB: string;
  targetEvent: string;
  competitionDate: string;
  shortTermGoals: string;
  longTermGoals: string;

  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;

  // Test Results
  testResults?: Record<string, { value: string; date: string }>;
}

const initialFormData: AthleteFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  nationality: 'Indian',
  aadhaarNumber: '',
  passportNumber: '',
  height: '',
  weight: '',
  bmi: '',
  bodyFatPercentage: '',
  armLength: '',
  legLength: '',
  wingspan: '',
  footSize: '',
  shoeType: '',
  athleteCategory: '',
  eventCategory: '',
  primaryEvent: '',
  secondaryEvent: '',
  ageCategory: '',
  personalBest: '',
  seasonBest: '',
  indoorPB: '',
  outdoorPB: '',
  majorCompetitionResults: '',
  currentCoach: '',
  trainingAge: '',
  weeklyTrainingVolume: '',
  strengthTrainingExperience: '',
  speedTrainingExperience: '',
  injuryHistory: '',
  medicalConditions: '',
  targetPB: '',
  targetEvent: '',
  competitionDate: '',
  shortTermGoals: '',
  longTermGoals: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelation: '',
  testResults: {},
};

// Mock athlete data for demo athletes (ID: 1, 2, 3)
const MOCK_ATHLETES: Record<string, Partial<AthleteFormData>> = {
  '1': {
    // Personal Information
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul.sharma@email.com',
    phone: '9876543210',
    dateOfBirth: '1998-05-15',
    gender: 'MALE',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',

    // Physical Measurements
    height: '178',
    weight: '72',
    bmi: '22.7',
    bodyFatPercentage: '12',
    armLength: '76',
    legLength: '92',
    wingspan: '182',
    footSize: '10',
    shoeType: 'Spikes - Nike Air Zoom',

    // Athlete Classification
    athleteCategory: 'SPRINTER',
    eventCategory: 'SPRINTS',
    primaryEvent: '100m',
    secondaryEvent: '200m',
    ageCategory: 'SENIOR',

    // Performance Records
    personalBest: '10.45s',
    seasonBest: '10.52s',
    indoorPB: '6.58s (60m)',
    outdoorPB: '10.45s',
    majorCompetitionResults: 'National Championships 2024 - Gold (100m)\nState Championships 2024 - Gold (100m, 200m)\nInter-University Meet 2023 - Silver (100m)',

    // Training Background
    currentCoach: 'Coach Mangesh',
    trainingAge: '8',
    weeklyTrainingVolume: '18',
    strengthTrainingExperience: 'Advanced - 6 years of structured weight training',
    speedTrainingExperience: 'Elite - 8 years of sprint-specific training',

    // Medical Information
    injuryHistory: 'Hamstring strain (2022) - fully recovered\nAnkle sprain (2021) - fully recovered',
    medicalConditions: 'None',

    // Goals
    targetPB: '10.20s',
    targetEvent: '100m - Paris Olympics Qualifier',
    competitionDate: '2025-06-15',
    shortTermGoals: 'Break 10.40s barrier by March 2025\nImprove start reaction time to under 0.14s\nIncrease max velocity phase by 5%',
    longTermGoals: 'Qualify for 2028 Olympics\nBreak national record (10.18s)\nConsistent sub-10.30s performances',

    // Emergency Contact
    emergencyContactName: 'Suresh Sharma',
    emergencyContactPhone: '9876543200',
    emergencyContactRelation: 'Father',

    // Test Results - ALL 100m Sprint Event-Specific Tests
    testResults: {
      // Strength Tests
      'squat_1rm': { value: '165', date: '2024-12-01' },
      'front_squat_1rm': { value: '140', date: '2024-12-01' },
      'deadlift_1rm': { value: '190', date: '2024-12-01' },
      'bench_press_1rm': { value: '95', date: '2024-12-01' },
      'hip_thrust_1rm': { value: '180', date: '2024-12-01' },
      'clean_1rm': { value: '105', date: '2024-12-05' },
      'snatch_1rm': { value: '80', date: '2024-12-05' },
      'clean_jerk_1rm': { value: '100', date: '2024-12-05' },
      'push_press_1rm': { value: '75', date: '2024-12-05' },
      'pullup_1rm': { value: '25', date: '2024-12-05' },

      // Sprint Tests
      'sprint_10m_time': { value: '1.72', date: '2024-12-15' },
      'sprint_20m_time': { value: '2.91', date: '2024-12-15' },
      'sprint_30m_time': { value: '3.85', date: '2024-12-15' },
      'sprint_40m_time': { value: '4.72', date: '2024-12-15' },
      'sprint_60m_time': { value: '6.62', date: '2024-12-15' },
      'sprint_80m': { value: '8.45', date: '2024-12-15' },
      'sprint_100m_time': { value: '10.45', date: '2024-12-15' },
      'sprint_120m': { value: '12.85', date: '2024-12-15' },
      'flying_10m': { value: '0.92', date: '2024-12-15' },
      'flying_20m_time': { value: '1.78', date: '2024-12-15' },
      'flying_30m_time': { value: '2.65', date: '2024-12-15' },
      'acceleration_30m_time': { value: '3.92', date: '2024-12-15' },
      'max_velocity_60m': { value: '11.2', date: '2024-12-15' },
      'anaerobic_speed_reserve': { value: '2.8', date: '2024-12-10' },
      'speed_reserve': { value: '15', date: '2024-12-10' },
      'sprint_fv_profile': { value: '0.85', date: '2024-12-10' },
      'wicket_rhythm_score': { value: '92', date: '2024-12-10' },

      // Reaction Tests
      'reaction_time': { value: '0.142', date: '2024-12-15' },
      'block_clearance_time': { value: '0.38', date: '2024-12-15' },
      'shin_angle': { value: '45', date: '2024-12-15' },
      'first_3_step_power': { value: '2450', date: '2024-12-15' },

      // Power Tests
      'vertical_jump_cm': { value: '68', date: '2024-12-10' },
      'cmj_height': { value: '65', date: '2024-12-10' },
      'squat_jump_height': { value: '58', date: '2024-12-10' },
      'single_leg_cmj_left': { value: '32', date: '2024-12-10' },
      'single_leg_cmj_right': { value: '34', date: '2024-12-10' },
      'drop_jump_20cm': { value: '62', date: '2024-12-10' },
      'drop_jump_30cm': { value: '58', date: '2024-12-10' },
      'drop_jump_40cm': { value: '55', date: '2024-12-10' },
      'rsi_bilateral': { value: '2.85', date: '2024-12-10' },
      'rsi_unilateral': { value: '1.92', date: '2024-12-10' },
      'loaded_jump_20_percent': { value: '52', date: '2024-12-10' },
      'loaded_jump_40_percent': { value: '42', date: '2024-12-10' },
      'imtp_peak_force': { value: '3200', date: '2024-12-08' },
      'broad_jump': { value: '3.15', date: '2024-12-10' },
      'standing_long_jump_cm': { value: '315', date: '2024-12-10' },
      'standing_triple_jump': { value: '9.45', date: '2024-12-10' },

      // Biomechanics Tests
      'stride_length': { value: '2.35', date: '2024-12-12' },
      'stride_frequency': { value: '4.85', date: '2024-12-12' },
      'ground_contact_time': { value: '0.092', date: '2024-12-12' },
      'sprint_kinematics': { value: '85', date: '2024-12-12' },
      'horizontal_force': { value: '520', date: '2024-12-12' },
      'vertical_stiffness': { value: '42.5', date: '2024-12-12' },

      // Injury Prevention Tests
      'nordic_hamstring': { value: '32', date: '2024-12-08' },
      'ham_quad_ratio': { value: '0.62', date: '2024-12-08' },
      'hamstring_strength_test': { value: '185', date: '2024-12-08' },
      'iso_hamstring_bridge': { value: '45', date: '2024-12-08' },
      'hip_flexor_iso': { value: '28', date: '2024-12-08' },
      'adductor_squeeze': { value: '320', date: '2024-12-08' },
      'hip_mobility_score': { value: '88', date: '2024-12-08' },
      'ankle_stiffness': { value: '285', date: '2024-12-08' },
      'ankle_dorsiflexion': { value: '42', date: '2024-12-08' },
      'lumbar_stiffness': { value: '7.2', date: '2024-12-08' },
      'y_balance_score': { value: '95', date: '2024-12-08' },

      // Core Tests
      'plank_hold': { value: '180', date: '2024-12-05' },
      'side_plank_left': { value: '95', date: '2024-12-05' },
      'side_plank_right': { value: '92', date: '2024-12-05' },
      'copenhagen_plank_left': { value: '45', date: '2024-12-05' },
      'copenhagen_plank_right': { value: '42', date: '2024-12-05' },
      'hollow_hold': { value: '65', date: '2024-12-05' },
      'v_sit_hold': { value: '35', date: '2024-12-05' },
      'situps_per_min': { value: '52', date: '2024-12-05' },
      'sorensen_hold': { value: '145', date: '2024-12-05' },
      'pallof_press_left': { value: '25', date: '2024-12-05' },
      'pallof_press_right': { value: '25', date: '2024-12-05' },
      'single_leg_bridge_left': { value: '42', date: '2024-12-05' },
      'single_leg_bridge_right': { value: '45', date: '2024-12-05' },
      'rollout_reps': { value: '15', date: '2024-12-05' },
      'suitcase_carry': { value: '32', date: '2024-12-05' },
      'rotational_throw': { value: '12.5', date: '2024-12-05' },
    },
  },
  '2': {
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@email.com',
    phone: '9876543211',
    dateOfBirth: '2000-08-22',
    gender: 'FEMALE',
    height: '165',
    weight: '55',
    primaryEvent: '400m',
    secondaryEvent: '200m',
    ageCategory: 'U23',
    athleteCategory: 'SPRINTER',
    eventCategory: 'SPRINTS',
    currentCoach: 'Coach Mangesh',
    personalBest: '52.8s',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
  },
  '3': {
    firstName: 'Amit',
    lastName: 'Kumar',
    email: 'amit.kumar@email.com',
    phone: '9876543212',
    dateOfBirth: '1995-03-10',
    gender: 'MALE',
    height: '182',
    weight: '78',
    primaryEvent: 'Long Jump',
    secondaryEvent: 'Triple Jump',
    ageCategory: 'SENIOR',
    athleteCategory: 'JUMPER',
    eventCategory: 'JUMPS',
    currentCoach: 'Coach Mangesh',
    personalBest: '7.85m',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
  },
};

export default function EditAthletePage() {
  const params = useParams();
  const router = useRouter();
  const athleteId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [formData, setFormData] = useState<AthleteFormData>(initialFormData);
  const [bloodReportData, setBloodReportData] = useState<BloodReportData>(initialBloodReportData);
  const [isMockAthlete, setIsMockAthlete] = useState(false);

  useEffect(() => {
    loadAthleteData();
  }, [athleteId]);

  const loadAthleteData = () => {
    // First check localStorage for any saved data (including mock athletes that were edited)
    try {
      const stored = localStorage.getItem('athletes');
      if (stored) {
        const athletes = JSON.parse(stored);
        const athlete = athletes.find((a: any) => a.id === athleteId);
        if (athlete) {
          // Found in localStorage - use this data (includes any blood report data)
          setFormData({ ...initialFormData, ...athlete });
          if (athlete.bloodReport) {
            setBloodReportData(athlete.bloodReport);
          }
          setIsMockAthlete(MOCK_ATHLETES[athleteId] !== undefined);
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error('Error loading athlete from localStorage:', error);
    }

    // If not in localStorage, check if it's a mock athlete (first time loading)
    if (MOCK_ATHLETES[athleteId]) {
      setFormData({ ...initialFormData, ...MOCK_ATHLETES[athleteId] });
      setIsMockAthlete(true);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Auto-calculate BMI
      if (name === 'height' || name === 'weight') {
        const height = name === 'height' ? parseFloat(value) : parseFloat(prev.height);
        const weight = name === 'weight' ? parseFloat(value) : parseFloat(prev.weight);
        if (height && weight) {
          const heightInM = height / 100;
          const bmi = (weight / (heightInM * heightInM)).toFixed(1);
          newData.bmi = bmi;
        }
      }

      return newData;
    });
  };

  // Handle test result input change
  const handleTestResultChange = (testId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      testResults: {
        ...prev.testResults,
        [testId]: {
          value,
          date: prev.testResults?.[testId]?.date || new Date().toISOString().split('T')[0],
        },
      },
    }));
  };

  // Handle test date change
  const handleTestDateChange = (testId: string, date: string) => {
    setFormData((prev) => ({
      ...prev,
      testResults: {
        ...prev.testResults,
        [testId]: {
          value: prev.testResults?.[testId]?.value || '',
          date,
        },
      },
    }));
  };

  // Save data to localStorage
  const saveToLocalStorage = async () => {
    try {
      const stored = localStorage.getItem('athletes');
      let athletes = stored ? JSON.parse(stored) : [];

      const index = athletes.findIndex((a: any) => a.id === athleteId);

      const athleteData = {
        id: athleteId,
        ...formData,
        bloodReport: bloodReportData,
        // Add default values for display in athlete list
        readinessScore: 75,
        readinessCategory: 'GOOD',
        hasAlerts: false,
        alertCount: 0,
        acwr: 1.0,
        weeklyLoad: 1500,
        phase: 'GPP',
        createdAt: new Date().toISOString(),
      };

      if (index !== -1) {
        // Update existing athlete
        athletes[index] = {
          ...athletes[index],
          ...athleteData,
        };
      } else {
        // Add new athlete (for mock athletes being saved for first time)
        athletes.push(athleteData);
      }

      localStorage.setItem('athletes', JSON.stringify(athletes));
      return true;
    } catch (error) {
      console.error('Error saving athlete:', error);
      return false;
    }
  };

  // Get current tab index
  const getCurrentTabIndex = () => tabs.findIndex((tab) => tab.id === activeTab);

  // Check if on last tab
  const isLastTab = () => getCurrentTabIndex() === tabs.length - 1;

  // Handle Save & Next - go to next tab
  const handleSaveAndNext = async () => {
    setSaving(true);
    const saved = await saveToLocalStorage();

    if (saved) {
      const currentIndex = getCurrentTabIndex();
      if (currentIndex < tabs.length - 1) {
        // Move to next tab
        setActiveTab(tabs[currentIndex + 1].id);
      }
    } else {
      alert('Failed to save changes. Please try again.');
    }
    setSaving(false);
  };

  // Handle final submit - save and go to profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const saved = await saveToLocalStorage();

    if (saved) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.push(`/athletes/${athleteId}`);
    } else {
      alert('Failed to save changes. Please try again.');
    }
    setSaving(false);
  };

  const getEventsForCategory = () => {
    const category = EVENT_CATEGORIES.find((c) => c.value === formData.eventCategory);
    return category ? category.events : [];
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'physical', label: 'Physical', icon: Ruler },
    { id: 'athlete', label: 'Athlete Type', icon: Trophy },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'training', label: 'Training', icon: Dumbbell },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'blood', label: 'Blood Reports', icon: Droplet },
    { id: 'emergency', label: 'Emergency', icon: Heart },
  ];

  // ==================== RENDER FUNCTIONS ====================

  const renderPersonalTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Address & Identity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
            <input
              type="text"
              name="aadhaarNumber"
              value={formData.aadhaarNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
            <input
              type="text"
              name="passportNumber"
              value={formData.passportNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPhysicalTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Physical measurements are crucial for biomechanical analysis. BMI is calculated automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
          <div className="relative">
            <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
          <div className="relative">
            <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">BMI (Auto)</label>
          <input
            type="text"
            value={formData.bmi}
            readOnly
            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Body Fat %</label>
          <input
            type="number"
            name="bodyFatPercentage"
            value={formData.bodyFatPercentage}
            onChange={handleInputChange}
            step="0.1"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Arm Length (cm)</label>
          <input
            type="number"
            name="armLength"
            value={formData.armLength}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Leg Length (cm)</label>
          <input
            type="number"
            name="legLength"
            value={formData.legLength}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Wingspan (cm)</label>
          <input
            type="number"
            name="wingspan"
            value={formData.wingspan}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Foot Size (EU)</label>
          <input
            type="number"
            name="footSize"
            value={formData.footSize}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shoe Type</label>
          <select
            name="shoeType"
            value={formData.shoeType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Shoe Type</option>
            {SHOE_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  // Get event-specific tests for the selected primary event
  const getEventSpecificTests = (): EventTestMapping | undefined => {
    if (!formData.primaryEvent) return undefined;
    const eventId = EVENT_NAME_TO_ID[formData.primaryEvent];
    if (!eventId) return undefined;
    return getTestsForEvent(eventId);
  };

  const renderAthleteTab = () => {
    const eventTests = getEventSpecificTests();

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Athlete Category <span className="text-red-500">*</span>
            </label>
            <select
              name="athleteCategory"
              value={formData.athleteCategory}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {ATHLETE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age Category</label>
            <select
              name="ageCategory"
              value={formData.ageCategory}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Age Category</option>
              {AGE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Category</label>
            <select
              name="eventCategory"
              value={formData.eventCategory}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Event Category</option>
              {EVENT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Event <span className="text-red-500">*</span>
            </label>
            <select
              name="primaryEvent"
              value={formData.primaryEvent}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Primary Event</option>
              {getEventsForCategory().map((event) => (
                <option key={event} value={event}>{event}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Event</label>
            <select
              name="secondaryEvent"
              value={formData.secondaryEvent}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Secondary Event</option>
              {getEventsForCategory().map((event) => (
                <option key={event} value={event}>{event}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Event-Specific Tests Display */}
        {eventTests && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-1">
                Event-Specific Tests for {eventTests.eventName}
              </h3>
              <p className="text-sm text-blue-700">
                Below are the recommended tests for {formData.primaryEvent}. These tests will help track athlete performance specific to this event.
              </p>
            </div>

            <div className="space-y-6">
              {eventTests.tests.map((category) => (
                <div key={category.category} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="font-medium text-gray-900">{category.categoryDisplayName}</h4>
                    <p className="text-xs text-gray-500 mt-1">{category.tests.length} tests available</p>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.tests.map((testId) => {
                        const testDef = TEST_DEFINITIONS[testId];
                        if (!testDef) return null;
                        const testResult = formData.testResults?.[testId];
                        return (
                          <div
                            key={testId}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-900">
                                {testDef.displayName}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {testDef.valueDirection === 'higher_better' && '↑ Higher is better'}
                                {testDef.valueDirection === 'lower_better' && '↓ Lower is better'}
                                {testDef.valueDirection === 'optimal_range' && '⟷ Optimal range'}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <div className="relative">
                                  <input
                                    type="text"
                                    placeholder="Value"
                                    value={testResult?.value || ''}
                                    onChange={(e) => handleTestResultChange(testId, e.target.value)}
                                    className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                    {testDef.unit}
                                  </span>
                                </div>
                              </div>
                              <div className="w-32">
                                <input
                                  type="date"
                                  value={testResult?.date || new Date().toISOString().split('T')[0]}
                                  onChange={(e) => handleTestDateChange(testId, e.target.value)}
                                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Tip:</strong> Enter test values directly above. Click "Save & Next" to save your changes.
              </p>
            </div>
          </div>
        )}

        {/* Message when no event selected */}
        {!formData.primaryEvent && formData.eventCategory && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Select a Primary Event above to see event-specific tests
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Personal Best</label>
          <input
            type="text"
            name="personalBest"
            value={formData.personalBest}
            onChange={handleInputChange}
            placeholder="e.g., 10.42s"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Season Best</label>
          <input
            type="text"
            name="seasonBest"
            value={formData.seasonBest}
            onChange={handleInputChange}
            placeholder="e.g., 10.55s"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Indoor PB</label>
          <input
            type="text"
            name="indoorPB"
            value={formData.indoorPB}
            onChange={handleInputChange}
            placeholder="Indoor personal best"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Outdoor PB</label>
          <input
            type="text"
            name="outdoorPB"
            value={formData.outdoorPB}
            onChange={handleInputChange}
            placeholder="Outdoor personal best"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Major Competition Results</label>
          <textarea
            name="majorCompetitionResults"
            value={formData.majorCompetitionResults}
            onChange={handleInputChange}
            rows={3}
            placeholder="List major competition results..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderTrainingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Coach</label>
          <input
            type="text"
            name="currentCoach"
            value={formData.currentCoach}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Training Age (Years)</label>
          <input
            type="number"
            name="trainingAge"
            value={formData.trainingAge}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Training Volume (hours)</label>
          <input
            type="number"
            name="weeklyTrainingVolume"
            value={formData.weeklyTrainingVolume}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Strength Training Experience</label>
          <select
            name="strengthTrainingExperience"
            value={formData.strengthTrainingExperience}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Level</option>
            <option value="beginner">Beginner (0-1 year)</option>
            <option value="intermediate">Intermediate (1-3 years)</option>
            <option value="advanced">Advanced (3+ years)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Speed Training Experience</label>
          <select
            name="speedTrainingExperience"
            value={formData.speedTrainingExperience}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Level</option>
            <option value="beginner">Beginner (0-1 year)</option>
            <option value="intermediate">Intermediate (1-3 years)</option>
            <option value="advanced">Advanced (3+ years)</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Injury History</label>
          <textarea
            name="injuryHistory"
            value={formData.injuryHistory}
            onChange={handleInputChange}
            rows={3}
            placeholder="List past injuries..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
          <textarea
            name="medicalConditions"
            value={formData.medicalConditions}
            onChange={handleInputChange}
            rows={2}
            placeholder="Any medical conditions..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderGoalsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target PB</label>
          <input
            type="text"
            name="targetPB"
            value={formData.targetPB}
            onChange={handleInputChange}
            placeholder="e.g., 10.20s"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Event</label>
          <input
            type="text"
            name="targetEvent"
            value={formData.targetEvent}
            onChange={handleInputChange}
            placeholder="e.g., National Championship"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Competition Date</label>
          <input
            type="date"
            name="competitionDate"
            value={formData.competitionDate}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Term Goals (3-6 months)</label>
          <textarea
            name="shortTermGoals"
            value={formData.shortTermGoals}
            onChange={handleInputChange}
            rows={3}
            placeholder="List short term goals..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Long Term Goals (1-4 years)</label>
          <textarea
            name="longTermGoals"
            value={formData.longTermGoals}
            onChange={handleInputChange}
            rows={3}
            placeholder="List long term goals..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderBloodReportsTab = () => (
    <BloodReportForm
      data={bloodReportData}
      onChange={setBloodReportData}
    />
  );

  const renderEmergencyTab = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Emergency Contact Information</p>
            <p className="text-sm text-red-600">This information will be used in case of emergencies.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
          <input
            type="text"
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
          <input
            type="tel"
            name="emergencyContactPhone"
            value={formData.emergencyContactPhone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
          <select
            name="emergencyContactRelation"
            value={formData.emergencyContactRelation}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Relationship</option>
            <option value="parent">Parent</option>
            <option value="spouse">Spouse</option>
            <option value="sibling">Sibling</option>
            <option value="friend">Friend</option>
            <option value="coach">Coach</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!formData.firstName) {
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Athlete</h1>
            <p className="text-gray-500">{formData.firstName} {formData.lastName}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="flex overflow-x-auto border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {activeTab === 'personal' && renderPersonalTab()}
            {activeTab === 'physical' && renderPhysicalTab()}
            {activeTab === 'athlete' && renderAthleteTab()}
            {activeTab === 'performance' && renderPerformanceTab()}
            {activeTab === 'training' && renderTrainingTab()}
            {activeTab === 'goals' && renderGoalsTab()}
            {activeTab === 'blood' && renderBloodReportsTab()}
            {activeTab === 'emergency' && renderEmergencyTab()}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
          <Link
            href={`/athletes/${athleteId}`}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </Link>

          <div className="flex items-center gap-3">
            {/* Progress indicator */}
            <span className="text-sm text-gray-500">
              Step {getCurrentTabIndex() + 1} of {tabs.length}
            </span>

            {!isLastTab() ? (
              // Save & Next button for all tabs except the last one
              <button
                type="button"
                onClick={handleSaveAndNext}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save & Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              // Save & Finish button for the last tab
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save & Finish
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
