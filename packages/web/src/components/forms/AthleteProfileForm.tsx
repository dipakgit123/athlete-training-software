'use client';

/**
 * ATHLETE PROFILE FORM
 * World-Class Athletics Performance System
 *
 * Step-by-step form design
 * Coach साठी simple आणि mobile-friendly
 */

import React, { useState, useEffect } from 'react';
import { getAllEvents, getTestsForEvent, EventTestMapping } from '@athlete-system/shared';

// Type for category in tests array
type EventTestCategory = EventTestMapping['tests'][number];

// ============================================
// TYPES
// ============================================

interface AthleteProfileFormData {
  // Step 1: Basic Info (Mandatory)
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | '';

  // Step 2: Contact (Mandatory)
  email: string;
  phone: string;

  // Step 3: Athletic Info (Mandatory)
  category: 'SUB_JUNIOR' | 'JUNIOR' | 'YOUTH' | 'SENIOR' | 'MASTERS' | '';
  primaryEvent: string;
  secondaryEvents: string[];
  trainingAge: number;

  // Step 4: Physical (Optional but recommended)
  height?: number;
  weight?: number;
  dominantLeg?: 'LEFT' | 'RIGHT' | 'AMBIDEXTROUS';
  dominantHand?: 'LEFT' | 'RIGHT' | 'AMBIDEXTROUS';

  // Step 5: Additional (Optional)
  nationality?: string;
  state?: string;
  club?: string;
  coachName?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  bloodGroup?: string;
  medicalConditions?: string;
}

interface FormErrors {
  [key: string]: string;
}

// ============================================
// CONSTANTS
// ============================================

const CATEGORIES = [
  { value: 'SUB_JUNIOR', label: 'Sub Junior (U-14)', labelMarathi: 'उप-कनिष्ठ (१४ वर्षाखालील)' },
  { value: 'JUNIOR', label: 'Junior (U-18)', labelMarathi: 'कनिष्ठ (१८ वर्षाखालील)' },
  { value: 'YOUTH', label: 'Youth (U-20)', labelMarathi: 'युवा (२० वर्षाखालील)' },
  { value: 'SENIOR', label: 'Senior', labelMarathi: 'वरिष्ठ' },
  { value: 'MASTERS', label: 'Masters (35+)', labelMarathi: 'मास्टर्स (३५+)' }
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Chandigarh', 'Puducherry'
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// ============================================
// MAIN COMPONENT
// ============================================

export default function AthleteProfileForm({
  onSubmit,
  initialData,
  isLoading = false
}: {
  onSubmit: (data: AthleteProfileFormData) => void;
  initialData?: Partial<AthleteProfileFormData>;
  isLoading?: boolean;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AthleteProfileFormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    category: '',
    primaryEvent: '',
    secondaryEvents: [],
    trainingAge: 0,
    ...initialData
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [availableEvents, setAvailableEvents] = useState<{ id: string; name: string; category: string }[]>([]);

  useEffect(() => {
    setAvailableEvents(getAllEvents());
  }, []);

  const totalSteps = 5;

  // ============================================
  // VALIDATION
  // ============================================

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        break;

      case 2:
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Invalid email format';
        }
        if (!formData.phone.trim()) {
          newErrors.phone = 'Phone is required';
        } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
          newErrors.phone = 'Invalid phone number (10 digits required)';
        }
        break;

      case 3:
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.primaryEvent) newErrors.primaryEvent = 'Primary event is required';
        if (formData.trainingAge < 0) newErrors.trainingAge = 'Training age cannot be negative';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================
  // HANDLERS
  // ============================================

  const handleChange = (field: keyof AthleteProfileFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSecondaryEventToggle = (eventId: string) => {
    setFormData(prev => {
      const current = prev.secondaryEvents;
      if (current.includes(eventId)) {
        return { ...prev, secondaryEvents: current.filter(e => e !== eventId) };
      }
      if (current.length < 3) {
        return { ...prev, secondaryEvents: [...current, eventId] };
      }
      return prev;
    });
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      onSubmit(formData);
    }
  };

  // ============================================
  // RENDER STEPS
  // ============================================

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Basic Information
        <span className="text-sm font-normal text-gray-500 ml-2">मूलभूत माहिती</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter first name"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter last name"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="MALE"
                checked={formData.gender === 'MALE'}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="mr-2"
              />
              Male / पुरुष
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="FEMALE"
                checked={formData.gender === 'FEMALE'}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="mr-2"
              />
              Female / महिला
            </label>
          </div>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Contact Information
        <span className="text-sm font-normal text-gray-500 ml-2">संपर्क माहिती</span>
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="athlete@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="9876543210"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Athletic Information
        <span className="text-sm font-normal text-gray-500 ml-2">क्रीडा माहिती</span>
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.category ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select Category / वर्ग निवडा</option>
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label} - {cat.labelMarathi}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-500">{errors.category}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Primary Event <span className="text-red-500">*</span>
          <span className="text-xs text-gray-500 ml-2">
            (Tests will be shown based on this event)
          </span>
        </label>
        <select
          value={formData.primaryEvent}
          onChange={(e) => handleChange('primaryEvent', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.primaryEvent ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select Primary Event / मुख्य प्रकार निवडा</option>
          {availableEvents.map(event => (
            <option key={event.id} value={event.id}>
              {event.name} ({event.category})
            </option>
          ))}
        </select>
        {errors.primaryEvent && (
          <p className="mt-1 text-sm text-red-500">{errors.primaryEvent}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Secondary Events (Max 3)
          <span className="text-xs text-gray-500 ml-2">Optional / वैकल्पिक</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
          {availableEvents
            .filter(e => e.id !== formData.primaryEvent)
            .map(event => (
              <label
                key={event.id}
                className={`flex items-center p-2 rounded cursor-pointer ${
                  formData.secondaryEvents.includes(event.id)
                    ? 'bg-blue-100 border-blue-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.secondaryEvents.includes(event.id)}
                  onChange={() => handleSecondaryEventToggle(event.id)}
                  className="mr-2"
                  disabled={
                    !formData.secondaryEvents.includes(event.id) &&
                    formData.secondaryEvents.length >= 3
                  }
                />
                <span className="text-sm">{event.name}</span>
              </label>
            ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Training Age (Years)
          <span className="text-xs text-gray-500 ml-2">
            How many years of structured training?
          </span>
        </label>
        <input
          type="number"
          min="0"
          max="30"
          value={formData.trainingAge}
          onChange={(e) => handleChange('trainingAge', parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Physical Information
        <span className="text-sm font-normal text-gray-500 ml-2">शारीरिक माहिती (Optional)</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height (cm)
          </label>
          <input
            type="number"
            min="100"
            max="250"
            value={formData.height || ''}
            onChange={(e) => handleChange('height', parseFloat(e.target.value) || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="175"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            min="30"
            max="150"
            step="0.1"
            value={formData.weight || ''}
            onChange={(e) => handleChange('weight', parseFloat(e.target.value) || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="70.5"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dominant Leg / प्रबळ पाय
          </label>
          <select
            value={formData.dominantLeg || ''}
            onChange={(e) => handleChange('dominantLeg', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select / निवडा</option>
            <option value="LEFT">Left / डावा</option>
            <option value="RIGHT">Right / उजवा</option>
            <option value="AMBIDEXTROUS">Both / दोन्ही</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dominant Hand / प्रबळ हात
          </label>
          <select
            value={formData.dominantHand || ''}
            onChange={(e) => handleChange('dominantHand', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select / निवडा</option>
            <option value="LEFT">Left / डावा</option>
            <option value="RIGHT">Right / उजवा</option>
            <option value="AMBIDEXTROUS">Both / दोन्ही</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Additional Information
        <span className="text-sm font-normal text-gray-500 ml-2">अतिरिक्त माहिती (Optional)</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nationality
          </label>
          <input
            type="text"
            value={formData.nationality || ''}
            onChange={(e) => handleChange('nationality', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Indian"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State / राज्य
          </label>
          <select
            value={formData.state || ''}
            onChange={(e) => handleChange('state', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Club / Academy Name
        </label>
        <input
          type="text"
          value={formData.club || ''}
          onChange={(e) => handleChange('club', e.target.value || undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Athletics Academy Name"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Emergency Contact Name
          </label>
          <input
            type="text"
            value={formData.emergencyContact || ''}
            onChange={(e) => handleChange('emergencyContact', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Parent/Guardian Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Emergency Contact Phone
          </label>
          <input
            type="tel"
            value={formData.emergencyPhone || ''}
            onChange={(e) => handleChange('emergencyPhone', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="9876543210"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Blood Group
          </label>
          <select
            value={formData.bloodGroup || ''}
            onChange={(e) => handleChange('bloodGroup', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Blood Group</option>
            {BLOOD_GROUPS.map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Medical Conditions / Known Allergies
        </label>
        <textarea
          value={formData.medicalConditions || ''}
          onChange={(e) => handleChange('medicalConditions', e.target.value || undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          placeholder="Any medical conditions, allergies, or important health information..."
        />
      </div>
    </div>
  );

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4, 5].map(step => (
            <div
              key={step}
              className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                step < currentStep
                  ? 'bg-green-500 text-white'
                  : step === currentStep
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step < currentStep ? '✓' : step}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Basic</span>
          <span>Contact</span>
          <span>Athletic</span>
          <span>Physical</span>
          <span>Additional</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-4 border-t">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg font-medium ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Athlete Profile'}
            </button>
          )}
        </div>
      </form>

      {/* Event Tests Preview */}
      {formData.primaryEvent && currentStep === 3 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">
            Tests for {availableEvents.find(e => e.id === formData.primaryEvent)?.name}:
          </h4>
          <div className="text-sm text-blue-700">
            {(() => {
              const eventTests = getTestsForEvent(formData.primaryEvent);
              if (!eventTests) return 'No tests configured';
              return eventTests.tests.map((cat: EventTestCategory) => (
                <div key={cat.category} className="mb-1">
                  <strong>{cat.categoryDisplayName}:</strong> {cat.tests.length} tests
                </div>
              ));
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
