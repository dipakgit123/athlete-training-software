'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Calendar,
  Activity,
  Trophy,
  Save,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Users,
  Heart,
  Ruler,
  Weight,
  Target,
  TrendingUp,
  Dumbbell,
  AlertCircle,
  Droplet,
} from 'lucide-react';
import { BloodReportForm, BloodReportData, initialBloodReportData } from '@/components/forms/BloodReportForm';

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
  {
    value: 'SPRINTS',
    label: 'Sprints',
    events: ['100m', '200m', '400m']
  },
  {
    value: 'MIDDLE_DISTANCE',
    label: 'Middle Distance',
    events: ['800m', '1500m']
  },
  {
    value: 'LONG_DISTANCE',
    label: 'Long Distance',
    events: ['5000m', '10000m', 'Half Marathon', 'Marathon']
  },
  {
    value: 'HURDLES',
    label: 'Hurdles',
    events: ['100m Hurdles', '110m Hurdles', '400m Hurdles']
  },
  {
    value: 'JUMPS',
    label: 'Jumps',
    events: ['Long Jump', 'Triple Jump', 'High Jump', 'Pole Vault']
  },
  {
    value: 'THROWS',
    label: 'Throws',
    events: ['Shot Put', 'Discus', 'Javelin', 'Hammer Throw']
  },
  {
    value: 'COMBINED',
    label: 'Combined Events',
    events: ['Decathlon', 'Heptathlon', 'Pentathlon']
  },
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

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

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
}

// ==================== COMPONENT ====================

export default function AddAthletePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [errors, setErrors] = useState<Partial<Record<keyof AthleteFormData, string>>>({});
  const [bloodReportData, setBloodReportData] = useState<BloodReportData>(initialBloodReportData);

  const [formData, setFormData] = useState<AthleteFormData>({
    // Personal
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

    // Physical
    height: '',
    weight: '',
    bmi: '',
    bodyFatPercentage: '',
    armLength: '',
    legLength: '',
    wingspan: '',
    footSize: '',
    shoeType: '',

    // Athlete Type
    athleteCategory: '',
    eventCategory: '',
    primaryEvent: '',
    secondaryEvent: '',
    ageCategory: '',

    // Performance
    personalBest: '',
    seasonBest: '',
    indoorPB: '',
    outdoorPB: '',
    majorCompetitionResults: '',

    // Training
    currentCoach: '',
    trainingAge: '',
    weeklyTrainingVolume: '',
    strengthTrainingExperience: '',
    speedTrainingExperience: '',
    injuryHistory: '',
    medicalConditions: '',

    // Goals
    targetPB: '',
    targetEvent: '',
    competitionDate: '',
    shortTermGoals: '',
    longTermGoals: '',

    // Emergency
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
  });

  // Calculate BMI automatically
  const calculateBMI = (height: string, weight: string): string => {
    const h = parseFloat(height) / 100; // cm to m
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      return (w / (h * h)).toFixed(1);
    }
    return '';
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Auto-calculate BMI
      if (name === 'height' || name === 'weight') {
        const height = name === 'height' ? value : prev.height;
        const weight = name === 'weight' ? value : prev.weight;
        newData.bmi = calculateBMI(height, weight);
      }

      // Reset events when category changes
      if (name === 'eventCategory') {
        newData.primaryEvent = '';
        newData.secondaryEvent = '';
      }

      return newData;
    });

    if (errors[name as keyof AthleteFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AthleteFormData, string>> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.athleteCategory) newErrors.athleteCategory = 'Athlete category is required';
    if (!formData.primaryEvent) newErrors.primaryEvent = 'Primary event is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setActiveTab('personal');
      alert('Please fill all required fields: First Name, Last Name, Email, Phone, Date of Birth, Gender, Athlete Category, and Primary Event');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate unique ID
      const athleteId = `athlete_${Date.now()}`;

      // Create athlete object
      const newAthlete = {
        id: athleteId,
        ...formData,
        bloodReport: bloodReportData,
        createdAt: new Date().toISOString(),
        // Calculate readiness score (random for now, will be calculated from actual data later)
        readinessScore: Math.floor(Math.random() * 30) + 70,
        readinessCategory: 'GOOD',
        hasAlerts: false,
        alertCount: 0,
        acwr: 1.0 + (Math.random() * 0.3),
        weeklyLoad: Math.floor(Math.random() * 500) + 1500,
        phase: 'GPP',
      };

      // Get existing athletes from localStorage
      const existingAthletes = JSON.parse(localStorage.getItem('athletes') || '[]');

      // Add new athlete
      existingAthletes.push(newAthlete);

      // Save back to localStorage
      localStorage.setItem('athletes', JSON.stringify(existingAthletes));

      console.log('Athlete saved:', newAthlete);

      // Small delay for UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Redirect to athletes list
      router.push('/athletes');
    } catch (error) {
      console.error('Failed to create athlete:', error);
      alert('Failed to save athlete. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Enter first name"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.firstName ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Enter last name"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.lastName ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.gender ? 'border-red-500' : 'border-gray-200'
            }`}
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
        </div>

        {/* Email */}
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
              placeholder="athlete@example.com"
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              }`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
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
              placeholder="+91 98765 43210"
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-200'
              }`}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Date of Birth */}
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
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.dateOfBirth ? 'border-red-500' : 'border-gray-200'
              }`}
            />
          </div>
          {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
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
              placeholder="Enter street address"
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
              placeholder="City"
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
              placeholder="State"
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
              placeholder="Country"
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
              placeholder="Nationality"
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
              placeholder="XXXX XXXX XXXX"
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
              placeholder="Passport Number (Optional)"
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
          <strong>Note:</strong> Physical measurements are crucial for biomechanical analysis and training optimization.
          BMI is calculated automatically from height and weight.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Height */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
          <div className="relative">
            <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              placeholder="175"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
          <div className="relative">
            <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              placeholder="70"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* BMI (Auto-calculated) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">BMI (Auto)</label>
          <input
            type="text"
            name="bmi"
            value={formData.bmi}
            readOnly
            placeholder="Auto-calculated"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>

        {/* Body Fat % */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Body Fat %</label>
          <input
            type="number"
            name="bodyFatPercentage"
            value={formData.bodyFatPercentage}
            onChange={handleInputChange}
            placeholder="12"
            step="0.1"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Limb Measurements */}
      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Limb Measurements (Biomechanics)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Arm Length (cm)</label>
            <input
              type="number"
              name="armLength"
              value={formData.armLength}
              onChange={handleInputChange}
              placeholder="75"
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
              placeholder="90"
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
              placeholder="180"
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
              placeholder="42"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Shoe Type */}
      <div className="pt-4 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Shoe Type</label>
            <select
              name="shoeType"
              value={formData.shoeType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Shoe Type</option>
              {SHOE_TYPES.map((shoe) => (
                <option key={shoe} value={shoe}>{shoe}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAthleteTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Athlete Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Athlete Category <span className="text-red-500">*</span>
          </label>
          <select
            name="athleteCategory"
            value={formData.athleteCategory}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.athleteCategory ? 'border-red-500' : 'border-gray-200'
            }`}
          >
            <option value="">Select Category</option>
            {ATHLETE_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          {errors.athleteCategory && <p className="text-red-500 text-xs mt-1">{errors.athleteCategory}</p>}
        </div>

        {/* Age Category */}
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

        {/* Event Category */}
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

        {/* Primary Event */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Primary Event <span className="text-red-500">*</span>
          </label>
          <select
            name="primaryEvent"
            value={formData.primaryEvent}
            onChange={handleInputChange}
            disabled={!formData.eventCategory}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
              errors.primaryEvent ? 'border-red-500' : 'border-gray-200'
            }`}
          >
            <option value="">Select Primary Event</option>
            {getEventsForCategory().map((event) => (
              <option key={event} value={event}>{event}</option>
            ))}
          </select>
          {errors.primaryEvent && <p className="text-red-500 text-xs mt-1">{errors.primaryEvent}</p>}
        </div>

        {/* Secondary Event */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Event</label>
          <select
            name="secondaryEvent"
            value={formData.secondaryEvent}
            onChange={handleInputChange}
            disabled={!formData.eventCategory}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select Secondary Event</option>
            {getEventsForCategory()
              .filter((e) => e !== formData.primaryEvent)
              .map((event) => (
                <option key={event} value={event}>{event}</option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-700">
          <strong>Performance History:</strong> Record personal bests and competition results.
          This data helps in training periodization and goal setting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Best */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Personal Best (PB)</label>
          <input
            type="text"
            name="personalBest"
            value={formData.personalBest}
            onChange={handleInputChange}
            placeholder="e.g., 10.45s for 100m"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Season Best */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Season Best (SB)</label>
          <input
            type="text"
            name="seasonBest"
            value={formData.seasonBest}
            onChange={handleInputChange}
            placeholder="e.g., 10.52s for 100m"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Indoor PB */}
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

        {/* Outdoor PB */}
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
      </div>

      {/* Major Competition Results */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Major Competition Results</label>
        <textarea
          name="majorCompetitionResults"
          value={formData.majorCompetitionResults}
          onChange={handleInputChange}
          placeholder="List major competitions and placements (e.g., National Championship 2024 - Gold, State Meet 2023 - Silver)"
          rows={4}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderTrainingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Coach */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Coach</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              name="currentCoach"
              value={formData.currentCoach}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Coach</option>
              <option value="1">Coach Rajesh Kumar</option>
              <option value="2">Coach Anita Desai</option>
              <option value="3">Coach Suresh Mehta</option>
            </select>
          </div>
        </div>

        {/* Training Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Training Age (years)</label>
          <input
            type="number"
            name="trainingAge"
            value={formData.trainingAge}
            onChange={handleInputChange}
            placeholder="Years of training"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Weekly Training Volume */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Training Volume (hours)</label>
          <input
            type="number"
            name="weeklyTrainingVolume"
            value={formData.weeklyTrainingVolume}
            onChange={handleInputChange}
            placeholder="Hours per week"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Strength Training Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Strength Training Experience</label>
          <select
            name="strengthTrainingExperience"
            value={formData.strengthTrainingExperience}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Level</option>
            <option value="NONE">None</option>
            <option value="BEGINNER">Beginner (0-1 year)</option>
            <option value="INTERMEDIATE">Intermediate (1-3 years)</option>
            <option value="ADVANCED">Advanced (3+ years)</option>
          </select>
        </div>

        {/* Speed Training Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Speed Training Experience</label>
          <select
            name="speedTrainingExperience"
            value={formData.speedTrainingExperience}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Level</option>
            <option value="NONE">None</option>
            <option value="BEGINNER">Beginner (0-1 year)</option>
            <option value="INTERMEDIATE">Intermediate (1-3 years)</option>
            <option value="ADVANCED">Advanced (3+ years)</option>
          </select>
        </div>
      </div>

      {/* Injury History */}
      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-orange-500" />
          Medical History
        </h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">History of Injuries</label>
            <textarea
              name="injuryHistory"
              value={formData.injuryHistory}
              onChange={handleInputChange}
              placeholder="List any past injuries, surgeries, or chronic conditions"
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
            <textarea
              name="medicalConditions"
              value={formData.medicalConditions}
              onChange={handleInputChange}
              placeholder="Any ongoing medical conditions, allergies, or medications"
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderGoalsTab = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-green-700">
          <strong>Goals & Targets:</strong> Setting clear, measurable goals helps in designing
          effective periodization and tracking progress throughout the season.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Target PB */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target PB</label>
          <input
            type="text"
            name="targetPB"
            value={formData.targetPB}
            onChange={handleInputChange}
            placeholder="e.g., 10.20s for 100m"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Target Event */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Event/Competition</label>
          <input
            type="text"
            name="targetEvent"
            value={formData.targetEvent}
            onChange={handleInputChange}
            placeholder="e.g., National Championship 2025"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Competition Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Competition Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              name="competitionDate"
              value={formData.competitionDate}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Short-term Goals */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Short-term Goals (3-6 months)</label>
        <textarea
          name="shortTermGoals"
          value={formData.shortTermGoals}
          onChange={handleInputChange}
          placeholder="List immediate training goals and targets"
          rows={3}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Long-term Goals */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Long-term Goals (1-4 years)</label>
        <textarea
          name="longTermGoals"
          value={formData.longTermGoals}
          onChange={handleInputChange}
          placeholder="List career goals (Olympics, World Championships, National Records, etc.)"
          rows={3}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
        <p className="text-sm text-red-700">
          <strong>Important:</strong> Emergency contact information is crucial for athlete safety
          during training and competitions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
          <input
            type="text"
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleInputChange}
            placeholder="Full name"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleInputChange}
              placeholder="+91 98765 43210"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
            <option value="PARENT">Parent</option>
            <option value="SPOUSE">Spouse</option>
            <option value="SIBLING">Sibling</option>
            <option value="GUARDIAN">Guardian</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>
    </div>
  );

  // ==================== MAIN RENDER ====================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/athletes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Athlete</h1>
          <p className="text-gray-500">Complete athlete registration with comprehensive data</p>
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
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              <span className="text-red-500">*</span> Required fields
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/athletes"
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Athlete
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
