'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Target,
  Dumbbell,
  Zap,
  Activity,
  Clock,
  ChevronRight,
  Download,
  Loader2,
  User,
  Trophy,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Play,
  FileText,
  ChevronDown,
  ChevronUp,
  FileDown,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ============================================
// TYPES
// ============================================

interface Athlete {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  primaryEvent: string;
  secondaryEvents: string[];
  competitionLevel: string;
  nationality: string;
  height: number;
  weight: number;
  personalBest: string;
  targetPB: string;
  competitionDate: string;
  trainingAge: number;
  strengths: string[];
  weaknesses: string[];
  injuryHistory: string[];
  coachNotes: string;
}

interface TrainingPhase {
  name: string;
  nameMarathi: string;
  startDate: string;
  endDate: string;
  durationWeeks: number;
  focus: string[];
  volume: string;
  intensity: string;
  objectives: string[];
  keyWorkouts: string[];
  weeklyStructure: WeeklySchedule;
}

interface DaySession {
  type: string;
  intensity: string;
  duration: string;
  details: string[];
}

interface WeeklySchedule {
  monday: DaySession;
  tuesday: DaySession;
  wednesday: DaySession;
  thursday: DaySession;
  friday: DaySession;
  saturday: DaySession;
  sunday: DaySession;
}

interface GeneratedPlan {
  athleteName: string;
  event: string;
  eventCategory: string;
  targetCompetition: string;
  competitionDate: string;
  currentPB: string;
  targetPB: string;
  trainingAge: number;
  totalWeeks: number;
  phases: TrainingPhase[];
  athleteProfile: Athlete;
  generatedAt: string;
}

// ============================================
// DEMO ATHLETES DATA (From Seed)
// ============================================

const DEMO_ATHLETES: Athlete[] = [
  {
    id: '1',
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul@athlete-system.com',
    dateOfBirth: '2000-05-15',
    gender: 'MALE',
    primaryEvent: '100m Sprint',
    secondaryEvents: ['200m'],
    competitionLevel: 'ELITE',
    nationality: 'India',
    height: 178,
    weight: 72,
    personalBest: '10.45s',
    targetPB: '10.20s',
    competitionDate: '2025-06-15',
    trainingAge: 6,
    strengths: ['Explosive start', 'Strong block clearance', 'Good reaction time'],
    weaknesses: ['Speed maintenance 60-100m', 'Hamstring flexibility'],
    injuryHistory: ['Left hamstring strain (2024)', 'Right ankle sprain (2023)'],
    coachNotes: 'National Championships finalist. Focus on maintaining speed in drive phase.',
  },
  {
    id: '2',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya@athlete-system.com',
    dateOfBirth: '2001-08-22',
    gender: 'FEMALE',
    primaryEvent: '400m Sprint',
    secondaryEvents: ['200m'],
    competitionLevel: 'SENIOR',
    nationality: 'India',
    height: 165,
    weight: 56,
    personalBest: '52.80s',
    targetPB: '51.50s',
    competitionDate: '2025-07-20',
    trainingAge: 5,
    strengths: ['Strong lactate tolerance', 'Good race distribution', 'Mental toughness'],
    weaknesses: ['First 100m speed', 'Needs more max strength'],
    injuryHistory: ['Shin splints (2023)'],
    coachNotes: 'State champion. Ready for national breakthrough with improved speed reserve.',
  },
  {
    id: '3',
    firstName: 'Amit',
    lastName: 'Kumar',
    email: 'amit@athlete-system.com',
    dateOfBirth: '1999-03-10',
    gender: 'MALE',
    primaryEvent: 'Long Jump',
    secondaryEvents: ['Triple Jump'],
    competitionLevel: 'SENIOR',
    nationality: 'India',
    height: 182,
    weight: 75,
    personalBest: '7.85m',
    targetPB: '8.10m',
    competitionDate: '2025-08-10',
    trainingAge: 7,
    strengths: ['Approach speed', 'Takeoff power', 'Air mechanics'],
    weaknesses: ['Board accuracy', 'Landing consistency'],
    injuryHistory: ['Lower back strain (2024)', 'Knee tendinitis (2022)'],
    coachNotes: 'Federation Cup medalist. Needs to improve consistency in competition.',
  },
];

// ============================================
// PHASE GENERATION FUNCTIONS
// ============================================

const generateGPPPhase = (athlete: Athlete, startDate: Date, endDate: Date, weeks: number): TrainingPhase => {
  const isSprintEvent = athlete.primaryEvent.includes('100m') || athlete.primaryEvent.includes('200m');
  const is400m = athlete.primaryEvent.includes('400m');
  const isJumpEvent = athlete.primaryEvent.includes('Jump');

  return {
    name: 'General Preparation Phase (GPP)',
    nameMarathi: 'जनरल प्रिपरेशन फेज (GPP)',
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    durationWeeks: weeks,
    focus: [
      'Build aerobic base and work capacity',
      'Develop maximal strength foundation',
      'Movement quality and mobility',
      'Address weaknesses identified in assessment',
    ],
    volume: 'HIGH (80-90%)',
    intensity: 'LOW-MODERATE (60-75%)',
    objectives: [
      `Increase general work capacity by 20%`,
      `Establish strength base: Squat 1.5x BW (${Math.round(athlete.weight * 1.5)}kg target)`,
      `Improve ${athlete.weaknesses[0] || 'identified weakness areas'}`,
      'Complete injury prevention protocol',
    ],
    keyWorkouts: isSprintEvent ? [
      'Extensive tempo runs: 10-16 x 100m @ 60-65%',
      'Hill sprints: 8-12 x 40m for strength endurance',
      'Plyometric foundation: Low-level jumps and bounds',
      'Strength: Back squat, RDL, hip thrust (4x6-8)',
    ] : is400m ? [
      'Extensive tempo: 8-10 x 200m @ 65-70%',
      'Special endurance base: 3-5 x 300m @ 70%',
      'Hill runs: 6-8 x 80m for power endurance',
      'Lactate threshold work: 2-3 x 600m',
    ] : [
      'Approach run development drills',
      'Bounding series: 5 x 6 bounds',
      'Take-off mechanics drills',
      'Strength: Power clean, squats, hip work',
    ],
    weeklyStructure: {
      monday: {
        type: isSprintEvent ? 'Speed Development' : is400m ? 'Speed Work' : 'Approach Runs',
        intensity: 'MODERATE',
        duration: '90 min',
        details: [
          'Warm-up: 15 min dynamic prep',
          isSprintEvent ? 'Acceleration drills: 6x20m, 4x30m @ 80%' : 'Event-specific drills',
          'Plyometrics: Low-level bounds 3x5',
          'Core: 15 min',
        ],
      },
      tuesday: {
        type: 'Tempo/Recovery',
        intensity: 'LOW',
        duration: '60 min',
        details: [
          'Extensive tempo: 10x100m @ 60%',
          'Walking recovery 100m between reps',
          'Mobility work: 20 min',
          'Pool recovery if available',
        ],
      },
      wednesday: {
        type: 'Strength Training',
        intensity: 'HIGH',
        duration: '75 min',
        details: [
          'Back Squat: 4x6 @ 75%',
          'Romanian Deadlift: 3x8',
          'Hip Thrust: 3x10',
          'Nordic Curls: 3x5',
          'Core circuit: 3 rounds',
        ],
      },
      thursday: {
        type: 'Active Recovery',
        intensity: 'RECOVERY',
        duration: '45 min',
        details: [
          'Light jog: 15 min',
          'Dynamic stretching',
          'Foam rolling: 15 min',
          'Mobility drills',
        ],
      },
      friday: {
        type: 'Speed/Technical',
        intensity: 'MODERATE-HIGH',
        duration: '90 min',
        details: [
          'Sprint drills: A-skip, B-skip series',
          isSprintEvent ? 'Block starts: 6x10m' : 'Event technique work',
          'Flying runs: 4x20m @ 85%',
          'Medicine ball throws',
        ],
      },
      saturday: {
        type: 'Extensive Conditioning',
        intensity: 'MODERATE',
        duration: '75 min',
        details: [
          is400m ? 'Special endurance: 3x300m @ 70%' : 'Hill sprints: 8x40m',
          'Tempo work: 6x100m',
          'Plyometrics: 3x6 broad jumps',
          'Stretching: 15 min',
        ],
      },
      sunday: {
        type: 'REST',
        intensity: '-',
        duration: '-',
        details: ['Complete rest', 'Optional: light swimming/walking'],
      },
    },
  };
};

const generateSPPPhase = (athlete: Athlete, startDate: Date, endDate: Date, weeks: number): TrainingPhase => {
  const isSprintEvent = athlete.primaryEvent.includes('100m') || athlete.primaryEvent.includes('200m');
  const is400m = athlete.primaryEvent.includes('400m');

  return {
    name: 'Specific Preparation Phase (SPP)',
    nameMarathi: 'स्पेसिफिक प्रिपरेशन फेज (SPP)',
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    durationWeeks: weeks,
    focus: [
      'Develop maximum velocity',
      'Convert strength to power',
      'Event-specific conditioning',
      'Race simulation and modeling',
    ],
    volume: 'MODERATE-HIGH (70-80%)',
    intensity: 'MODERATE-HIGH (80-92%)',
    objectives: [
      `Improve max velocity by 3-5%`,
      `Develop power: CMJ target +5cm`,
      `Event-specific fitness: ${is400m ? 'Lactate tolerance' : 'Speed endurance'}`,
      'Technical refinement under fatigue',
    ],
    keyWorkouts: isSprintEvent ? [
      'Flying sprints: 4-6 x 30m @ 95%+',
      'Speed endurance: 3 x 80m @ 90%',
      'Block work: 8-10 x 30m from blocks',
      'Contrast training: Squat + jumps',
    ] : is400m ? [
      'Intensive tempo: 5 x 200m @ 80-85%',
      'Special endurance II: 2-3 x 350m @ 85%',
      'Speed development: 4 x 150m @ 90%',
      'Race modeling: 1 x 450m time trial',
    ] : [
      'Full approach runs with technical focus',
      'Pop-ups and short approach jumps',
      'Bounding for distance: 5 x 8 bounds',
      'Runway consistency drills',
    ],
    weeklyStructure: {
      monday: {
        type: 'Max Velocity Development',
        intensity: 'HIGH',
        duration: '90 min',
        details: [
          'Extended warm-up: 25 min',
          'Flying 30m: 4 reps @ 95-98%',
          'Recovery: 6-8 min between reps',
          'Total quality meters: 120m',
        ],
      },
      tuesday: {
        type: 'Tempo/Technical',
        intensity: 'MODERATE',
        duration: '60 min',
        details: [
          'Intensive tempo: 6x100m @ 75%',
          'Technical drills: wicket runs',
          'Core and mobility: 20 min',
          'Video analysis review',
        ],
      },
      wednesday: {
        type: 'Power Training',
        intensity: 'HIGH',
        duration: '75 min',
        details: [
          'Power Clean: 5x3 @ 80%',
          'Jump Squat: 4x5 @ 40% BW',
          'Depth Jumps: 3x5',
          'Contrast sets: Heavy/Light',
        ],
      },
      thursday: {
        type: 'Recovery/Mobility',
        intensity: 'LOW',
        duration: '45 min',
        details: [
          'Regeneration circuits',
          'Soft tissue work',
          'PNF stretching',
          'Mental visualization',
        ],
      },
      friday: {
        type: 'Speed Endurance',
        intensity: 'HIGH',
        duration: '90 min',
        details: [
          isSprintEvent ? 'Speed endurance: 3x80m @ 92%' : 'Special endurance work',
          'Full recovery: 8-10 min',
          'Finish with 2x30m @ 95%',
          'Competition simulation',
        ],
      },
      saturday: {
        type: 'Technical/Competition Prep',
        intensity: 'MODERATE',
        duration: '60 min',
        details: [
          'Race rehearsal drills',
          'Block adjustments',
          'Competition warm-up practice',
          'Flexibility work',
        ],
      },
      sunday: {
        type: 'REST',
        intensity: '-',
        duration: '-',
        details: ['Complete rest', 'Recovery strategies', 'Mental preparation'],
      },
    },
  };
};

const generatePreCompPhase = (athlete: Athlete, startDate: Date, endDate: Date, weeks: number): TrainingPhase => {
  return {
    name: 'Pre-Competition Phase',
    nameMarathi: 'प्री-कॉम्पिटिशन फेज',
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    durationWeeks: weeks,
    focus: [
      'Race sharpening and fine-tuning',
      'Competition routines establishment',
      'Mental preparation and confidence',
      'Technical polish under race conditions',
    ],
    volume: 'MODERATE (60-70%)',
    intensity: 'HIGH (92-98%)',
    objectives: [
      'Execute race plan consistently',
      'Establish competition routine',
      `Hit intermediate markers for ${athlete.targetPB} target`,
      'Peak nervous system readiness',
    ],
    keyWorkouts: [
      'Race simulation: 2-3 full event trials',
      'Starts and reactions practice',
      'Short, sharp speed work: 3x30m @ 100%',
      'Competition modeling sessions',
    ],
    weeklyStructure: {
      monday: {
        type: 'Race Simulation',
        intensity: 'RACE',
        duration: '75 min',
        details: [
          'Full competition warm-up routine',
          `${athlete.primaryEvent} time trial`,
          'Complete race protocol',
          'Post-race analysis',
        ],
      },
      tuesday: {
        type: 'Recovery/Technical',
        intensity: 'LOW',
        duration: '45 min',
        details: [
          'Light technical work',
          'Accelerations: 3x20m @ 80%',
          'Soft tissue maintenance',
          'Video review',
        ],
      },
      wednesday: {
        type: 'Maintenance Strength',
        intensity: 'MODERATE',
        duration: '50 min',
        details: [
          'Light explosive work',
          'Squat: 3x3 @ 70%',
          'Plyos: 2x4 low volume',
          'Core maintenance',
        ],
      },
      thursday: {
        type: 'REST',
        intensity: '-',
        duration: '-',
        details: ['Complete rest', 'Mental preparation', 'Competition planning'],
      },
      friday: {
        type: 'Sharpening',
        intensity: 'HIGH',
        duration: '60 min',
        details: [
          'Short sprints: 3x30m @ 98%',
          'Starts: 4x10m blocks',
          'Competition routine practice',
          'Confidence-building work',
        ],
      },
      saturday: {
        type: 'Pre-Competition',
        intensity: 'LOW',
        duration: '40 min',
        details: [
          'Light jog and stretching',
          'Strides: 4x50m @ 70%',
          'Event drills',
          'Mental visualization',
        ],
      },
      sunday: {
        type: 'REST',
        intensity: '-',
        duration: '-',
        details: ['Complete rest', 'Focus on sleep and nutrition'],
      },
    },
  };
};

const generateTaperPhase = (athlete: Athlete, startDate: Date, endDate: Date, weeks: number): TrainingPhase => {
  return {
    name: 'Competition/Taper Phase',
    nameMarathi: 'कॉम्पिटिशन / टेपर फेज',
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    durationWeeks: weeks,
    focus: [
      'Peak performance realization',
      'Neural freshness and readiness',
      'Maintain competition sharpness',
      'Execute race plan perfectly',
    ],
    volume: 'LOW (40-50%)',
    intensity: 'RACE PACE (95-100%)',
    objectives: [
      `Achieve target performance: ${athlete.targetPB}`,
      'Optimal CNS readiness on competition day',
      'Perfect race execution',
      'Confidence and mental focus',
    ],
    keyWorkouts: [
      'Very short, high-quality reps: 2-3x20m @ 100%',
      'Minimal volume, maintain sharpness',
      'Focus on starts and reaction',
      'Competition only: No excess training',
    ],
    weeklyStructure: {
      monday: {
        type: 'Light Speed',
        intensity: 'MODERATE',
        duration: '45 min',
        details: [
          'Easy warm-up',
          '3x20m @ 90%',
          'Drills only',
          'Stay fresh',
        ],
      },
      tuesday: {
        type: 'REST',
        intensity: '-',
        duration: '-',
        details: ['Complete rest', 'Mental preparation'],
      },
      wednesday: {
        type: 'Sharpening',
        intensity: 'HIGH',
        duration: '40 min',
        details: [
          'Activation warm-up',
          '2x30m @ 95%',
          'Starts: 2x10m',
          'Stay sharp, stay fresh',
        ],
      },
      thursday: {
        type: 'REST',
        intensity: '-',
        duration: '-',
        details: ['Rest and recovery', 'Travel if needed', 'Check-in routines'],
      },
      friday: {
        type: 'Pre-Competition',
        intensity: 'LOW',
        duration: '30 min',
        details: [
          'Light activation',
          'Strides: 3x40m easy',
          'Feel the track',
          'Competition venue familiarization',
        ],
      },
      saturday: {
        type: 'COMPETITION',
        intensity: 'RACE',
        duration: '-',
        details: [
          '⭐ TARGET COMPETITION DAY',
          `Goal: ${athlete.targetPB}`,
          'Execute race plan',
          'Trust your training!',
        ],
      },
      sunday: {
        type: 'Recovery',
        intensity: '-',
        duration: '-',
        details: ['Post-competition recovery', 'Celebrate achievements', 'Review and reflect'],
      },
    },
  };
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function TrainingPlanPage() {
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'weekly' | 'daily'>('overview');
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0);
  const [selectedPhaseForSchedule, setSelectedPhaseForSchedule] = useState<number>(0);

  // Calculate phase dates based on competition date
  const generateFullPlan = (athlete: Athlete): TrainingPhase[] => {
    const compDate = new Date(athlete.competitionDate);

    // Work backwards from competition date
    // Taper: 2 weeks
    // Pre-Comp: 3 weeks
    // SPP: 10 weeks
    // GPP: 8 weeks (remaining time, minimum 6 weeks)

    const taperWeeks = 2;
    const preCompWeeks = 3;
    const sppWeeks = 10;

    // Calculate dates working backwards
    const taperEnd = new Date(compDate);
    const taperStart = new Date(taperEnd);
    taperStart.setDate(taperStart.getDate() - taperWeeks * 7);

    const preCompEnd = new Date(taperStart);
    preCompEnd.setDate(preCompEnd.getDate() - 1);
    const preCompStart = new Date(preCompEnd);
    preCompStart.setDate(preCompStart.getDate() - preCompWeeks * 7);

    const sppEnd = new Date(preCompStart);
    sppEnd.setDate(sppEnd.getDate() - 1);
    const sppStart = new Date(sppEnd);
    sppStart.setDate(sppStart.getDate() - sppWeeks * 7);

    const gppEnd = new Date(sppStart);
    gppEnd.setDate(gppEnd.getDate() - 1);
    const gppStart = new Date();
    gppStart.setDate(gppStart.getDate() + 7); // Start next week

    const gppWeeks = Math.max(6, Math.ceil((gppEnd.getTime() - gppStart.getTime()) / (7 * 24 * 60 * 60 * 1000)));

    return [
      generateGPPPhase(athlete, gppStart, gppEnd, gppWeeks),
      generateSPPPhase(athlete, sppStart, sppEnd, sppWeeks),
      generatePreCompPhase(athlete, preCompStart, preCompEnd, preCompWeeks),
      generateTaperPhase(athlete, taperStart, taperEnd, taperWeeks),
    ];
  };

  // Generate training plan
  const handleGeneratePlan = async () => {
    if (!selectedAthlete) return;

    setIsGenerating(true);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const phases = generateFullPlan(selectedAthlete);
    const totalWeeks = phases.reduce((sum, p) => sum + p.durationWeeks, 0);

    const plan: GeneratedPlan = {
      athleteName: `${selectedAthlete.firstName} ${selectedAthlete.lastName}`,
      event: selectedAthlete.primaryEvent,
      eventCategory: selectedAthlete.primaryEvent.includes('Jump') ? 'Jumps' : 'Sprints',
      targetCompetition: 'Target Competition 2025',
      competitionDate: selectedAthlete.competitionDate,
      currentPB: selectedAthlete.personalBest,
      targetPB: selectedAthlete.targetPB,
      trainingAge: selectedAthlete.trainingAge,
      totalWeeks: totalWeeks,
      phases: phases,
      athleteProfile: selectedAthlete,
      generatedAt: new Date().toISOString(),
    };

    setGeneratedPlan(plan);
    setIsGenerating(false);
    setActiveTab('phases');
  };

  // Download plan as PDF
  const handleDownloadPDF = () => {
    if (!generatedPlan || !selectedAthlete) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    // Helper function to add new page if needed
    const checkNewPage = (requiredSpace: number = 30) => {
      if (yPos + requiredSpace > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
        return true;
      }
      return false;
    };

    // Title
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235); // Blue
    doc.text('ELITE TRAINING PLAN', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('AI-Powered Periodized Training Program', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Athlete Info Box
    doc.setFillColor(239, 246, 255); // Light blue
    doc.roundedRect(14, yPos, pageWidth - 28, 45, 3, 3, 'F');

    doc.setFontSize(14);
    doc.setTextColor(30, 64, 175);
    doc.text('ATHLETE PROFILE', 20, yPos + 10);

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Name: ${generatedPlan.athleteName}`, 20, yPos + 20);
    doc.text(`Event: ${generatedPlan.event}`, 20, yPos + 27);
    doc.text(`Current PB: ${generatedPlan.currentPB}`, 20, yPos + 34);

    doc.text(`Competition Level: ${selectedAthlete.competitionLevel}`, 105, yPos + 20);
    doc.text(`Target PB: ${generatedPlan.targetPB}`, 105, yPos + 27);
    doc.text(`Competition Date: ${generatedPlan.competitionDate}`, 105, yPos + 34);

    yPos += 55;

    // Plan Summary
    doc.setFillColor(240, 253, 244); // Light green
    doc.roundedRect(14, yPos, pageWidth - 28, 25, 3, 3, 'F');

    doc.setFontSize(12);
    doc.setTextColor(22, 101, 52);
    doc.text('PLAN SUMMARY', 20, yPos + 10);
    doc.setFontSize(10);
    doc.text(`Total Duration: ${generatedPlan.totalWeeks} weeks  |  Training Phases: ${generatedPlan.phases.length}  |  Generated: ${new Date(generatedPlan.generatedAt).toLocaleDateString()}`, 20, yPos + 18);

    yPos += 35;

    // Training Phases Header
    doc.setFontSize(16);
    doc.setTextColor(30, 30, 30);
    doc.text('TRAINING PHASES', 14, yPos);
    yPos += 10;

    // Phases Table
    const phaseColors: [number, number, number][] = [
      [219, 234, 254], // Blue
      [243, 232, 255], // Purple
      [255, 237, 213], // Orange
      [220, 252, 231], // Green
    ];

    generatedPlan.phases.forEach((phase, index) => {
      checkNewPage(60);

      // Phase Header
      const color = phaseColors[index % phaseColors.length];
      doc.setFillColor(color[0], color[1], color[2]);
      doc.roundedRect(14, yPos, pageWidth - 28, 50, 3, 3, 'F');

      doc.setFontSize(12);
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.text(`Phase ${index + 1}: ${phase.name}`, 20, yPos + 10);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(`Duration: ${phase.durationWeeks} weeks  |  ${phase.startDate} to ${phase.endDate}`, 20, yPos + 18);
      doc.text(`Volume: ${phase.volume}  |  Intensity: ${phase.intensity}`, 20, yPos + 25);

      // Objectives
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text('Objectives:', 20, yPos + 34);
      const objectivesText = phase.objectives.slice(0, 2).join(' | ');
      doc.text(objectivesText.substring(0, 90) + (objectivesText.length > 90 ? '...' : ''), 50, yPos + 34);

      // Key Workouts
      doc.text('Key Workouts:', 20, yPos + 42);
      const workoutsText = phase.keyWorkouts.slice(0, 2).join(' | ');
      doc.text(workoutsText.substring(0, 85) + (workoutsText.length > 85 ? '...' : ''), 55, yPos + 42);

      yPos += 58;
    });

    // Weekly Schedule for each phase
    generatedPlan.phases.forEach((phase, phaseIndex) => {
      doc.addPage();
      yPos = 20;

      // Phase Title
      doc.setFontSize(14);
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.text(`WEEKLY SCHEDULE - ${phase.name}`, 14, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 15;

      // Weekly Schedule Table
      const weeklyData = Object.entries(phase.weeklyStructure).map(([day, session]) => [
        day.charAt(0).toUpperCase() + day.slice(1),
        session.type,
        session.intensity,
        session.duration,
        session.details.slice(0, 2).join('; '),
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Day', 'Session Type', 'Intensity', 'Duration', 'Details']],
        body: weeklyData,
        theme: 'striped',
        headStyles: {
          fillColor: phaseColors[phaseIndex % phaseColors.length] as [number, number, number],
          textColor: [30, 30, 30],
          fontStyle: 'bold',
        },
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: 22 },
          1: { cellWidth: 35 },
          2: { cellWidth: 22 },
          3: { cellWidth: 20 },
          4: { cellWidth: 'auto' },
        },
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;

      // Phase Focus Areas
      checkNewPage(40);
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.text('Focus Areas:', 14, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 7;

      doc.setFontSize(9);
      phase.focus.forEach((focus) => {
        doc.text(`• ${focus}`, 20, yPos);
        yPos += 5;
      });
    });

    // Sample Workouts Page
    doc.addPage();
    yPos = 20;

    doc.setFontSize(16);
    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'bold');
    doc.text('SAMPLE WORKOUTS', 14, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 15;

    // Speed Session
    doc.setFillColor(254, 243, 199); // Yellow
    doc.roundedRect(14, yPos, pageWidth - 28, 70, 3, 3, 'F');

    doc.setFontSize(11);
    doc.setTextColor(146, 64, 14);
    doc.setFont('helvetica', 'bold');
    doc.text('SPEED SESSION (GPP Phase - Monday)', 20, yPos + 10);
    doc.setFont('helvetica', 'normal');

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text('Warm-Up (20-25 min):', 20, yPos + 20);
    doc.text('• Jog 400m, Dynamic stretches, Activation drills, Sprint drills (A-Skip, B-Skip), Build-ups 4x50m', 25, yPos + 27);

    doc.text('Main Workout - Acceleration:', 20, yPos + 37);
    doc.text('• Push-up starts to 10m: 4 reps @ 85% (Rest: 90s)', 25, yPos + 44);
    doc.text('• 3-point start to 20m: 4 reps @ 90% (Rest: 3 min)', 25, yPos + 51);
    doc.text('• Flying 20m: 3 reps @ 95% (Rest: 5 min)', 25, yPos + 58);

    yPos += 80;

    // Strength Session
    doc.setFillColor(219, 234, 254); // Blue
    doc.roundedRect(14, yPos, pageWidth - 28, 60, 3, 3, 'F');

    doc.setFontSize(11);
    doc.setTextColor(30, 64, 175);
    doc.setFont('helvetica', 'bold');
    doc.text('STRENGTH SESSION (GPP Phase - Wednesday)', 20, yPos + 10);
    doc.setFont('helvetica', 'normal');

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const strengthExercises = [
      ['Back Squat', '4 x 6', '75% 1RM', '3 min'],
      ['Romanian Deadlift', '3 x 8', '70% 1RM', '2.5 min'],
      ['Hip Thrust', '3 x 10', '75% 1RM', '2 min'],
      ['Nordic Curls', '3 x 5', 'BW', '2 min'],
    ];

    autoTable(doc, {
      startY: yPos + 15,
      head: [['Exercise', 'Sets x Reps', 'Load', 'Rest']],
      body: strengthExercises,
      theme: 'plain',
      headStyles: {
        fillColor: [191, 219, 254],
        textColor: [30, 64, 175],
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      margin: { left: 20, right: 20 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Athlete-Specific Notes
    checkNewPage(50);
    doc.setFillColor(254, 226, 226); // Red/Orange light
    doc.roundedRect(14, yPos, pageWidth - 28, 40, 3, 3, 'F');

    doc.setFontSize(11);
    doc.setTextColor(185, 28, 28);
    doc.setFont('helvetica', 'bold');
    doc.text(`ATHLETE-SPECIFIC NOTES - ${generatedPlan.athleteName}`, 20, yPos + 10);
    doc.setFont('helvetica', 'normal');

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text(`• Injury History: ${selectedAthlete.injuryHistory.join(', ')}`, 20, yPos + 20);
    doc.text(`• Focus Area: ${selectedAthlete.weaknesses[0]}`, 20, yPos + 27);
    doc.text(`• Coach Notes: ${selectedAthlete.coachNotes}`, 20, yPos + 34);

    // Footer on last page
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Generated by Elite Athletics Performance System', pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Save the PDF
    doc.save(`Training-Plan-${selectedAthlete.firstName}-${selectedAthlete.lastName}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Download plan as JSON (backup)
  const handleDownloadJSON = () => {
    if (!generatedPlan) return;

    const dataStr = JSON.stringify(generatedPlan, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `training-plan-${selectedAthlete?.firstName}-${Date.now()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getPhaseColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-green-500',
    ];
    return colors[index % colors.length];
  };

  const getPhaseColorLight = (index: number) => {
    const colors = [
      'bg-blue-50 border-blue-200',
      'bg-purple-50 border-purple-200',
      'bg-orange-50 border-orange-200',
      'bg-green-50 border-green-200',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training Plan Generator</h1>
          <p className="text-gray-500">AI-powered periodized training plan based on athlete data</p>
        </div>
        {generatedPlan && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <FileDown className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <Download className="w-4 h-4" />
              JSON
            </button>
          </div>
        )}
      </div>

      {/* Athlete Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Select Athlete
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_ATHLETES.map((athlete) => (
            <div
              key={athlete.id}
              onClick={() => setSelectedAthlete(athlete)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all relative ${
                selectedAthlete?.id === athlete.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {athlete.firstName[0]}
                    {athlete.lastName[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {athlete.firstName} {athlete.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{athlete.primaryEvent}</p>
                  <p className="text-xs text-gray-400">{athlete.competitionLevel}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs">
                <span className="text-gray-500">PB: <strong className="text-gray-700">{athlete.personalBest}</strong></span>
                <span className="text-gray-500">Target: <strong className="text-green-600">{athlete.targetPB}</strong></span>
              </div>
              {selectedAthlete?.id === athlete.id && (
                <CheckCircle2 className="w-5 h-5 text-blue-600 absolute top-2 right-2" />
              )}
            </div>
          ))}
        </div>

        {/* Selected Athlete Details */}
        {selectedAthlete && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Athlete Profile Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
              <div>
                <span className="text-gray-500">Event:</span>
                <p className="font-medium">{selectedAthlete.primaryEvent}</p>
              </div>
              <div>
                <span className="text-gray-500">Current PB:</span>
                <p className="font-medium text-blue-600">{selectedAthlete.personalBest}</p>
              </div>
              <div>
                <span className="text-gray-500">Target PB:</span>
                <p className="font-medium text-green-600">{selectedAthlete.targetPB}</p>
              </div>
              <div>
                <span className="text-gray-500">Competition Date:</span>
                <p className="font-medium">{selectedAthlete.competitionDate}</p>
              </div>
              <div>
                <span className="text-gray-500">Training Age:</span>
                <p className="font-medium">{selectedAthlete.trainingAge} years</p>
              </div>
              <div>
                <span className="text-gray-500">Height/Weight:</span>
                <p className="font-medium">{selectedAthlete.height}cm / {selectedAthlete.weight}kg</p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Injury History:</span>
                <p className="font-medium text-orange-600">{selectedAthlete.injuryHistory.join(', ')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="text-gray-500">Strengths:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedAthlete.strengths.map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Areas to Improve:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedAthlete.weaknesses.map((w, i) => (
                    <span key={i} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">{w}</span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Periodized Plan...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Generate Phase-Wise Training Plan
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Generated Plan */}
      {generatedPlan && (
        <>
          {/* Plan Summary */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8" />
                <div>
                  <h2 className="text-xl font-bold">Elite Training Plan Generated</h2>
                  <p className="text-sm opacity-80">
                    {generatedPlan.totalWeeks} Week Periodized Program
                  </p>
                </div>
              </div>
              <span className="text-sm opacity-80">
                Generated: {new Date(generatedPlan.generatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm opacity-80">Athlete</p>
                <p className="text-lg font-semibold">{generatedPlan.athleteName}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Event</p>
                <p className="text-lg font-semibold">{generatedPlan.event}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Current PB</p>
                <p className="text-lg font-semibold">{generatedPlan.currentPB}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Target PB</p>
                <p className="text-lg font-semibold text-green-300">{generatedPlan.targetPB}</p>
              </div>
              <div>
                <p className="text-sm opacity-80">Competition</p>
                <p className="text-lg font-semibold">{generatedPlan.competitionDate}</p>
              </div>
            </div>

            {/* Phase Timeline */}
            <div className="mt-6">
              <p className="text-sm opacity-80 mb-2">Training Phases Timeline</p>
              <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
                {generatedPlan.phases.map((phase, idx) => (
                  <div
                    key={idx}
                    className={`${getPhaseColor(idx)} flex items-center justify-center text-xs font-medium`}
                    style={{ width: `${(phase.durationWeeks / generatedPlan.totalWeeks) * 100}%` }}
                    title={`${phase.name}: ${phase.durationWeeks} weeks`}
                  >
                    {phase.durationWeeks}w
                  </div>
                ))}
              </div>
              <div className="flex gap-1 mt-1">
                {generatedPlan.phases.map((phase, idx) => (
                  <div
                    key={idx}
                    className="text-xs opacity-80"
                    style={{ width: `${(phase.durationWeeks / generatedPlan.totalWeeks) * 100}%` }}
                  >
                    {phase.name.split(' ')[0]}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: FileText },
                { id: 'phases', label: 'Training Phases', icon: Calendar },
                { id: 'weekly', label: 'Weekly Schedule', icon: Clock },
                { id: 'daily', label: 'Sample Workouts', icon: Dumbbell },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
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
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Plan Objectives
                      </h3>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li>• Achieve target performance: {generatedPlan.targetPB}</li>
                        <li>• Progressive periodization over {generatedPlan.totalWeeks} weeks</li>
                        <li>• Peak for competition on {generatedPlan.competitionDate}</li>
                        <li>• Address: {generatedPlan.athleteProfile.weaknesses[0]}</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Expected Progression
                      </h3>
                      <ul className="space-y-2 text-sm text-green-800">
                        <li>• GPP: Build foundation, +15% work capacity</li>
                        <li>• SPP: Convert to speed, +3-5% max velocity</li>
                        <li>• Pre-Comp: Sharpen, race modeling</li>
                        <li>• Taper: Peak performance realization</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h3 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Key Considerations & Injury Prevention
                    </h3>
                    <ul className="space-y-2 text-sm text-yellow-800">
                      {generatedPlan.athleteProfile.injuryHistory.map((injury, i) => (
                        <li key={i}>• Monitor: {injury}</li>
                      ))}
                      <li>• Deload weeks programmed every 3-4 weeks</li>
                      <li>• Weekly wellness monitoring required</li>
                      <li>• Adjust volume based on readiness scores</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Periodization Model
                    </h3>
                    <p className="text-sm text-purple-800 mb-3">
                      This plan uses a <strong>Linear Periodization</strong> model with four distinct phases,
                      progressing from high volume/low intensity to low volume/high intensity.
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {generatedPlan.phases.map((phase, idx) => (
                        <div key={idx} className={`p-2 rounded ${getPhaseColorLight(idx)}`}>
                          <p className="font-medium text-xs">{phase.name.split('(')[0].trim()}</p>
                          <p className="text-xs mt-1">{phase.volume.split(' ')[0]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Phases Tab */}
              {activeTab === 'phases' && (
                <div className="space-y-4">
                  {generatedPlan.phases.map((phase, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg overflow-hidden ${getPhaseColorLight(index)}`}
                    >
                      <div
                        className="p-4 cursor-pointer flex items-start justify-between"
                        onClick={() => setExpandedPhase(expandedPhase === index ? null : index)}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 ${getPhaseColor(index)} rounded-lg flex items-center justify-center text-white font-bold`}>
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{phase.name}</h3>
                            <p className="text-sm text-gray-500">{phase.nameMarathi}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="text-gray-600">{phase.startDate} → {phase.endDate}</span>
                              <span className="px-2 py-1 bg-white rounded text-xs font-medium">
                                {phase.durationWeeks} weeks
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right text-sm">
                            <p className="text-gray-500">Volume: <strong>{phase.volume.split(' ')[0]}</strong></p>
                            <p className="text-gray-500">Intensity: <strong>{phase.intensity.split(' ')[0]}</strong></p>
                          </div>
                          {expandedPhase === index ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {expandedPhase === index && (
                        <div className="p-4 pt-0 border-t bg-white">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Focus Areas</h4>
                              <ul className="space-y-1 text-sm text-gray-600">
                                {phase.focus.map((f, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    {f}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Phase Objectives</h4>
                              <ul className="space-y-1 text-sm text-gray-600">
                                {phase.objectives.map((o, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    {o}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="mt-4">
                            <h4 className="font-medium text-gray-900 mb-2">Key Workouts</h4>
                            <div className="flex flex-wrap gap-2">
                              {phase.keyWorkouts.map((workout, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg"
                                >
                                  {workout}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Weekly Schedule Tab */}
              {activeTab === 'weekly' && (
                <div>
                  <div className="mb-4 flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Select Phase:</span>
                    <div className="flex gap-2">
                      {generatedPlan.phases.map((phase, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedPhaseForSchedule(idx)}
                          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                            selectedPhaseForSchedule === idx
                              ? `${getPhaseColor(idx)} text-white`
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {phase.name.split('(')[0].trim()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-4">
                    Weekly Microcycle - {generatedPlan.phases[selectedPhaseForSchedule].name}
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-left font-semibold">Day</th>
                          <th className="px-4 py-3 text-left font-semibold">Session Type</th>
                          <th className="px-4 py-3 text-left font-semibold">Intensity</th>
                          <th className="px-4 py-3 text-left font-semibold">Duration</th>
                          <th className="px-4 py-3 text-left font-semibold">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(generatedPlan.phases[selectedPhaseForSchedule].weeklyStructure).map(
                          ([day, session]: [string, DaySession]) => (
                            <tr key={day} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium capitalize">{day}</td>
                              <td className="px-4 py-3 font-medium">{session.type}</td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    session.intensity === 'HIGH' || session.intensity === 'RACE'
                                      ? 'bg-red-100 text-red-800'
                                      : session.intensity === 'MODERATE' || session.intensity === 'MODERATE-HIGH'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : session.intensity === 'LOW'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {session.intensity}
                                </span>
                              </td>
                              <td className="px-4 py-3">{session.duration}</td>
                              <td className="px-4 py-3">
                                <ul className="space-y-0.5 text-gray-600">
                                  {session.details.map((d, i) => (
                                    <li key={i} className="text-xs">• {d}</li>
                                  ))}
                                </ul>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Daily Workouts Tab */}
              {activeTab === 'daily' && (
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      Sample Speed Session (GPP Phase - Monday)
                    </h3>

                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Warm-Up Protocol (20-25 min)</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• General jog: 400m easy</li>
                          <li>• Dynamic stretches: Knee hugs, quad stretch walk, RDL walk, lunge with twist (10m each)</li>
                          <li>• Activation: Glute bridges 2x10, clamshells 2x10, single-leg glute bridge 2x8</li>
                          <li>• Sprint drills: A-March, A-Skip, B-Skip (2x30m each)</li>
                          <li>• Build-ups: 4x50m progressive (50% → 60% → 70% → 80%)</li>
                        </ul>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Main Workout - Acceleration Development</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm mt-2">
                            <thead>
                              <tr className="text-left text-green-800">
                                <th className="py-1">Exercise</th>
                                <th className="py-1">Reps</th>
                                <th className="py-1">Intensity</th>
                                <th className="py-1">Rest</th>
                              </tr>
                            </thead>
                            <tbody className="text-green-700">
                              <tr><td>Push-up starts to 10m</td><td>4</td><td>85%</td><td>90s</td></tr>
                              <tr><td>3-point start to 20m</td><td>4</td><td>90%</td><td>3 min</td></tr>
                              <tr><td>Standing start to 30m</td><td>4</td><td>90%</td><td>4 min</td></tr>
                              <tr><td>Flying 20m (20m run-in)</td><td>3</td><td>95%</td><td>5 min</td></tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="mt-3 text-xs text-green-700 font-medium">
                          Total Sprint Volume: ~280m quality meters | CNS Load: Moderate-High
                        </p>
                      </div>

                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-medium text-orange-900 mb-2">Supplementary Work (15 min)</h4>
                        <ul className="text-sm text-orange-800 space-y-1">
                          <li>• Medicine ball throws: Overhead back toss 3x5, chest pass 3x5</li>
                          <li>• Plyometrics: Pogo jumps 2x10, single-leg hops 2x5 each</li>
                        </ul>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-2">Cool-Down (10-15 min)</h4>
                        <ul className="text-sm text-purple-800 space-y-1">
                          <li>• Light jog: 400m</li>
                          <li>• Static stretching: Hamstrings, hip flexors, quads, calves (30s each)</li>
                          <li>• Foam rolling: IT band, quads, glutes (2 min each)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Dumbbell className="w-5 h-5 text-blue-500" />
                      Sample Strength Session (GPP Phase - Wednesday)
                    </h3>

                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Warm-Up (10 min)</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Bike or row: 5 min easy</li>
                          <li>• Dynamic mobility: Hip circles, leg swings, cat-cow</li>
                          <li>• Activation: Band walks, glute bridges, bird dogs</li>
                        </ul>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Main Lifts</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm mt-2">
                            <thead>
                              <tr className="text-left text-green-800">
                                <th className="py-1">Exercise</th>
                                <th className="py-1">Sets x Reps</th>
                                <th className="py-1">Load</th>
                                <th className="py-1">Rest</th>
                                <th className="py-1">Tempo</th>
                              </tr>
                            </thead>
                            <tbody className="text-green-700">
                              <tr><td>Back Squat</td><td>4 x 6</td><td>75% 1RM</td><td>3 min</td><td>3-0-1-0</td></tr>
                              <tr><td>Romanian Deadlift</td><td>3 x 8</td><td>70% 1RM</td><td>2.5 min</td><td>3-1-1-0</td></tr>
                              <tr><td>Hip Thrust</td><td>3 x 10</td><td>75% 1RM</td><td>2 min</td><td>2-1-1-0</td></tr>
                              <tr><td>Nordic Curl (eccentric)</td><td>3 x 5</td><td>BW</td><td>2 min</td><td>5-0-0-0</td></tr>
                              <tr><td>Single-Leg RDL</td><td>3 x 8 each</td><td>Light DB</td><td>90s</td><td>3-0-1-0</td></tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-2">Core Circuit (3 rounds)</h4>
                        <ul className="text-sm text-purple-800 space-y-1">
                          <li>• Dead bug: 10 each side</li>
                          <li>• Side plank: 30s each side</li>
                          <li>• Pallof press: 10 each side</li>
                          <li>• Hollow body hold: 20s</li>
                          <li className="font-medium">Rest 60s between rounds</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      Athlete-Specific Notes for {generatedPlan.athleteName}
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>Hamstring protocol:</strong> Extra Nordic curl volume, daily slider curls</li>
                      <li>• <strong>Weakness focus:</strong> {generatedPlan.athleteProfile.weaknesses[0]} - add specific drills</li>
                      <li>• <strong>Monitor:</strong> Any discomfort related to {generatedPlan.athleteProfile.injuryHistory[0]}</li>
                      <li>• <strong>Coach notes:</strong> {generatedPlan.athleteProfile.coachNotes}</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
