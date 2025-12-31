'use client';

import React, { useState } from 'react';
import { X, Info, History, AlertTriangle } from 'lucide-react';

type PainType = 'soreness' | 'tightness' | 'sharp_pain' | 'numbness' | 'none';

interface SorenessData {
  bodyPartId: string;
  severity: number;
  painType: PainType;
  notes: string;
  timestamp: Date;
}

interface BodyMapProps {
  athleteId: string;
  athleteName: string;
  onChange?: (data: Record<string, SorenessData>) => void;
  initialData?: Record<string, SorenessData>;
  readOnly?: boolean;
}

interface BodyPartArea {
  id: string;
  name: string;
  nameMarathi: string;
  path: string;
}

// Front body parts - anatomically accurate with clear segments
const frontBodyParts: BodyPartArea[] = [
  // Head
  {
    id: 'head',
    name: 'Head',
    nameMarathi: 'डोके',
    path: 'M150,10 C165,10 178,18 183,35 C188,52 185,70 175,82 L175,90 L125,90 L125,82 C115,70 112,52 117,35 C122,18 135,10 150,10 Z'
  },
  // Neck
  {
    id: 'neck',
    name: 'Neck',
    nameMarathi: 'मान',
    path: 'M137,90 L163,90 L163,110 L137,110 Z'
  },
  // Left Shoulder (viewer's right)
  {
    id: 'shoulder_right',
    name: 'Right Shoulder',
    nameMarathi: 'उजवा खांदा',
    path: 'M163,110 L195,115 C205,120 210,130 210,140 L185,135 L163,130 Z'
  },
  // Right Shoulder (viewer's left)
  {
    id: 'shoulder_left',
    name: 'Left Shoulder',
    nameMarathi: 'डावा खांदा',
    path: 'M137,110 L105,115 C95,120 90,130 90,140 L115,135 L137,130 Z'
  },
  // Left Chest
  {
    id: 'chest_left',
    name: 'Left Chest',
    nameMarathi: 'डावी छाती',
    path: 'M115,135 L150,130 L150,175 L105,175 C102,160 105,145 115,135 Z'
  },
  // Right Chest
  {
    id: 'chest_right',
    name: 'Right Chest',
    nameMarathi: 'उजवी छाती',
    path: 'M150,130 L185,135 C195,145 198,160 195,175 L150,175 Z'
  },
  // Left Bicep
  {
    id: 'bicep_left',
    name: 'Left Bicep',
    nameMarathi: 'डावा बायसेप',
    path: 'M90,140 L75,150 L65,195 L80,200 L95,175 L105,175 C102,160 95,148 90,140 Z'
  },
  // Right Bicep
  {
    id: 'bicep_right',
    name: 'Right Bicep',
    nameMarathi: 'उजवा बायसेप',
    path: 'M210,140 L225,150 L235,195 L220,200 L205,175 L195,175 C198,160 205,148 210,140 Z'
  },
  // Left Forearm
  {
    id: 'forearm_left',
    name: 'Left Forearm',
    nameMarathi: 'डावा हात',
    path: 'M65,195 L55,255 L40,260 L45,295 L60,290 L80,200 Z'
  },
  // Right Forearm
  {
    id: 'forearm_right',
    name: 'Right Forearm',
    nameMarathi: 'उजवा हात',
    path: 'M235,195 L245,255 L260,260 L255,295 L240,290 L220,200 Z'
  },
  // Left Hand
  {
    id: 'hand_left',
    name: 'Left Hand',
    nameMarathi: 'डावा हात',
    path: 'M40,260 L25,265 L15,310 L20,320 L35,325 L50,310 L45,295 Z'
  },
  // Right Hand
  {
    id: 'hand_right',
    name: 'Right Hand',
    nameMarathi: 'उजवा हात',
    path: 'M260,260 L275,265 L285,310 L280,320 L265,325 L250,310 L255,295 Z'
  },
  // Upper Abs
  {
    id: 'abs_upper',
    name: 'Upper Abs',
    nameMarathi: 'वरचे पोट',
    path: 'M120,175 L180,175 L180,210 L120,210 Z'
  },
  // Lower Abs
  {
    id: 'abs_lower',
    name: 'Lower Abs',
    nameMarathi: 'खालचे पोट',
    path: 'M120,210 L180,210 L180,250 L120,250 Z'
  },
  // Left Oblique
  {
    id: 'oblique_left',
    name: 'Left Oblique',
    nameMarathi: 'डावा तिरकस',
    path: 'M105,175 L120,175 L120,250 L110,250 C105,225 103,200 105,175 Z'
  },
  // Right Oblique
  {
    id: 'oblique_right',
    name: 'Right Oblique',
    nameMarathi: 'उजवा तिरकस',
    path: 'M180,175 L195,175 C197,200 195,225 190,250 L180,250 Z'
  },
  // Left Hip
  {
    id: 'hip_left',
    name: 'Left Hip',
    nameMarathi: 'डावा कूल्हा',
    path: 'M110,250 L150,250 L145,280 L100,280 C100,265 103,255 110,250 Z'
  },
  // Right Hip
  {
    id: 'hip_right',
    name: 'Right Hip',
    nameMarathi: 'उजवा कूल्हा',
    path: 'M150,250 L190,250 C197,255 200,265 200,280 L155,280 Z'
  },
  // Groin
  {
    id: 'groin',
    name: 'Groin',
    nameMarathi: 'जांघेचा सांधा',
    path: 'M130,280 L170,280 L165,310 L150,320 L135,310 Z'
  },
  // Left Quadriceps
  {
    id: 'quad_left',
    name: 'Left Quadriceps',
    nameMarathi: 'डावा मांडी',
    path: 'M100,280 L135,310 L130,395 L95,395 C90,355 90,315 100,280 Z'
  },
  // Right Quadriceps
  {
    id: 'quad_right',
    name: 'Right Quadriceps',
    nameMarathi: 'उजवा मांडी',
    path: 'M165,310 L200,280 C210,315 210,355 205,395 L170,395 Z'
  },
  // Left Knee
  {
    id: 'knee_left',
    name: 'Left Knee',
    nameMarathi: 'डावा गुडघा',
    path: 'M95,395 L130,395 L128,430 L93,430 Z'
  },
  // Right Knee
  {
    id: 'knee_right',
    name: 'Right Knee',
    nameMarathi: 'उजवा गुडघा',
    path: 'M170,395 L205,395 L207,430 L172,430 Z'
  },
  // Left Shin
  {
    id: 'shin_left',
    name: 'Left Shin',
    nameMarathi: 'डावा नळी',
    path: 'M93,430 L128,430 L125,520 L95,520 Z'
  },
  // Right Shin
  {
    id: 'shin_right',
    name: 'Right Shin',
    nameMarathi: 'उजवा नळी',
    path: 'M172,430 L207,430 L205,520 L175,520 Z'
  },
  // Left Ankle
  {
    id: 'ankle_left',
    name: 'Left Ankle',
    nameMarathi: 'डावा घोटा',
    path: 'M95,520 L125,520 L123,545 L97,545 Z'
  },
  // Right Ankle
  {
    id: 'ankle_right',
    name: 'Right Ankle',
    nameMarathi: 'उजवा घोटा',
    path: 'M175,520 L205,520 L203,545 L177,545 Z'
  },
  // Left Foot
  {
    id: 'foot_left',
    name: 'Left Foot',
    nameMarathi: 'डावा पाऊल',
    path: 'M90,545 L130,545 L135,560 C135,575 85,575 85,560 Z'
  },
  // Right Foot
  {
    id: 'foot_right',
    name: 'Right Foot',
    nameMarathi: 'उजवा पाऊल',
    path: 'M170,545 L210,545 L215,560 C215,575 165,575 165,560 Z'
  },
];

// Back body parts
const backBodyParts: BodyPartArea[] = [
  // Head Back
  {
    id: 'head_back',
    name: 'Head (Back)',
    nameMarathi: 'डोके (मागचा)',
    path: 'M150,10 C165,10 178,18 183,35 C188,52 185,70 175,82 L175,90 L125,90 L125,82 C115,70 112,52 117,35 C122,18 135,10 150,10 Z'
  },
  // Neck Back
  {
    id: 'neck_back',
    name: 'Neck (Back)',
    nameMarathi: 'मान (मागचा)',
    path: 'M137,90 L163,90 L163,110 L137,110 Z'
  },
  // Left Trapezius
  {
    id: 'trap_left',
    name: 'Left Trapezius',
    nameMarathi: 'डावा ट्रॅप',
    path: 'M137,110 L150,110 L150,150 L115,165 C108,145 115,125 137,110 Z'
  },
  // Right Trapezius
  {
    id: 'trap_right',
    name: 'Right Trapezius',
    nameMarathi: 'उजवा ट्रॅप',
    path: 'M150,110 L163,110 C185,125 192,145 185,165 L150,150 Z'
  },
  // Left Rear Delt
  {
    id: 'rear_delt_left',
    name: 'Left Rear Delt',
    nameMarathi: 'डावा मागचा खांदा',
    path: 'M115,115 L137,110 L115,135 L90,145 C90,130 100,118 115,115 Z'
  },
  // Right Rear Delt
  {
    id: 'rear_delt_right',
    name: 'Right Rear Delt',
    nameMarathi: 'उजवा मागचा खांदा',
    path: 'M163,110 L185,115 C200,118 210,130 210,145 L185,135 Z'
  },
  // Left Tricep
  {
    id: 'tricep_left',
    name: 'Left Tricep',
    nameMarathi: 'डावा ट्रायसेप',
    path: 'M90,145 L75,155 L65,200 L80,205 L100,175 C95,165 92,155 90,145 Z'
  },
  // Right Tricep
  {
    id: 'tricep_right',
    name: 'Right Tricep',
    nameMarathi: 'उजवा ट्रायसेप',
    path: 'M210,145 L225,155 L235,200 L220,205 L200,175 C205,165 208,155 210,145 Z'
  },
  // Left Lat
  {
    id: 'lat_left',
    name: 'Left Lat',
    nameMarathi: 'डावा लॅट',
    path: 'M100,175 L120,165 L120,220 L105,220 C100,200 98,185 100,175 Z'
  },
  // Right Lat
  {
    id: 'lat_right',
    name: 'Right Lat',
    nameMarathi: 'उजवा लॅट',
    path: 'M180,165 L200,175 C202,185 200,200 195,220 L180,220 Z'
  },
  // Mid Back / Rhomboids
  {
    id: 'mid_back',
    name: 'Mid Back',
    nameMarathi: 'मधला पाठ',
    path: 'M120,150 L180,150 L180,195 L120,195 Z'
  },
  // Lower Back
  {
    id: 'lower_back',
    name: 'Lower Back',
    nameMarathi: 'खालचा पाठ',
    path: 'M110,195 L190,195 L190,250 L110,250 Z'
  },
  // Left Forearm Back
  {
    id: 'forearm_back_left',
    name: 'Left Forearm',
    nameMarathi: 'डावा हात',
    path: 'M65,200 L55,260 L40,265 L45,300 L60,295 L80,205 Z'
  },
  // Right Forearm Back
  {
    id: 'forearm_back_right',
    name: 'Right Forearm',
    nameMarathi: 'उजवा हात',
    path: 'M235,200 L245,260 L260,265 L255,300 L240,295 L220,205 Z'
  },
  // Left Hand Back
  {
    id: 'hand_back_left',
    name: 'Left Hand',
    nameMarathi: 'डावा हात',
    path: 'M40,265 L25,270 L15,315 L20,325 L35,330 L50,315 L45,300 Z'
  },
  // Right Hand Back
  {
    id: 'hand_back_right',
    name: 'Right Hand',
    nameMarathi: 'उजवा हात',
    path: 'M260,265 L275,270 L285,315 L280,325 L265,330 L250,315 L255,300 Z'
  },
  // Left Glute
  {
    id: 'glute_left',
    name: 'Left Glute',
    nameMarathi: 'डावा नितंब',
    path: 'M110,250 L150,250 L150,310 L100,310 C95,285 100,265 110,250 Z'
  },
  // Right Glute
  {
    id: 'glute_right',
    name: 'Right Glute',
    nameMarathi: 'उजवा नितंब',
    path: 'M150,250 L190,250 C200,265 205,285 200,310 L150,310 Z'
  },
  // Left Hamstring
  {
    id: 'hamstring_left',
    name: 'Left Hamstring',
    nameMarathi: 'डावा हॅमस्ट्रिंग',
    path: 'M100,310 L135,310 L130,400 L95,400 C90,365 90,335 100,310 Z'
  },
  // Right Hamstring
  {
    id: 'hamstring_right',
    name: 'Right Hamstring',
    nameMarathi: 'उजवा हॅमस्ट्रिंग',
    path: 'M165,310 L200,310 C210,335 210,365 205,400 L170,400 Z'
  },
  // Left Calf
  {
    id: 'calf_left',
    name: 'Left Calf',
    nameMarathi: 'डावा पोटरा',
    path: 'M93,430 L128,430 L125,520 L95,520 C90,485 88,455 93,430 Z'
  },
  // Right Calf
  {
    id: 'calf_right',
    name: 'Right Calf',
    nameMarathi: 'उजवा पोटरा',
    path: 'M172,430 L207,430 C212,455 210,485 205,520 L175,520 Z'
  },
  // Left Knee Back
  {
    id: 'knee_back_left',
    name: 'Left Knee (Back)',
    nameMarathi: 'डावा गुडघा (मागचा)',
    path: 'M95,400 L130,400 L128,430 L93,430 Z'
  },
  // Right Knee Back
  {
    id: 'knee_back_right',
    name: 'Right Knee (Back)',
    nameMarathi: 'उजवा गुडघा (मागचा)',
    path: 'M170,400 L205,400 L207,430 L172,430 Z'
  },
  // Left Achilles
  {
    id: 'achilles_left',
    name: 'Left Achilles',
    nameMarathi: 'डावा अकिलीस',
    path: 'M95,520 L125,520 L123,550 L97,550 Z'
  },
  // Right Achilles
  {
    id: 'achilles_right',
    name: 'Right Achilles',
    nameMarathi: 'उजवा अकिलीस',
    path: 'M175,520 L205,520 L203,550 L177,550 Z'
  },
  // Left Heel
  {
    id: 'heel_left',
    name: 'Left Heel',
    nameMarathi: 'डावा टाच',
    path: 'M90,550 L130,550 L135,565 C135,580 85,580 85,565 Z'
  },
  // Right Heel
  {
    id: 'heel_right',
    name: 'Right Heel',
    nameMarathi: 'उजवा टाच',
    path: 'M170,550 L210,550 L215,565 C215,580 165,580 165,565 Z'
  },
];

const painTypeLabels: Record<PainType, { label: string; marathi: string }> = {
  none: { label: 'None', marathi: 'नाही' },
  soreness: { label: 'Soreness', marathi: 'थकवा' },
  tightness: { label: 'Tightness', marathi: 'आखडलेले' },
  sharp_pain: { label: 'Sharp Pain', marathi: 'तीक्ष्ण दुखणे' },
  numbness: { label: 'Numbness', marathi: 'बधिरपणा' },
};

const severityLevels = [
  { level: 0, label: 'None', marathi: 'नाही', color: 'transparent' },
  { level: 1, label: 'Mild', marathi: 'सौम्य', color: '#22c55e' },
  { level: 2, label: 'Low', marathi: 'कमी', color: '#84cc16' },
  { level: 3, label: 'Moderate', marathi: 'मध्यम', color: '#eab308' },
  { level: 4, label: 'High', marathi: 'तीव्र', color: '#f97316' },
  { level: 5, label: 'Severe', marathi: 'अति तीव्र', color: '#ef4444' },
];

// Anatomically accurate human body outline - Front view
const FrontBodySilhouette = () => (
  <g>
    {/* Head */}
    <ellipse cx="150" cy="50" rx="35" ry="42" fill="#4a5568" stroke="#5a6578" strokeWidth="1" />
    {/* Neck */}
    <rect x="137" y="88" width="26" height="24" fill="#4a5568" stroke="#5a6578" strokeWidth="1" />
    {/* Torso */}
    <path
      d="M90,112 L90,140 L65,200 L80,205 L100,175 L105,175 L105,250 L100,280 L95,400 L93,430 L95,520 L90,545 L85,560 C85,580 135,580 135,560 L130,545 L125,520 L128,430 L130,400 L145,280 L145,310 L150,320 L155,310 L155,280 L170,400 L172,430 L175,520 L170,545 L165,560 C165,580 215,580 215,560 L210,545 L205,520 L207,430 L205,400 L200,280 L195,250 L195,175 L200,175 L220,205 L235,200 L210,140 L210,112 Z"
      fill="#4a5568"
      stroke="#5a6578"
      strokeWidth="1"
    />
    {/* Left Arm */}
    <path
      d="M90,140 L75,150 L65,195 L55,255 L40,260 L25,265 L15,310 L20,320 L35,325 L50,310 L45,295 L60,290 L80,200 L95,175"
      fill="#4a5568"
      stroke="#5a6578"
      strokeWidth="1"
    />
    {/* Right Arm */}
    <path
      d="M210,140 L225,150 L235,195 L245,255 L260,260 L275,265 L285,310 L280,320 L265,325 L250,310 L255,295 L240,290 L220,200 L205,175"
      fill="#4a5568"
      stroke="#5a6578"
      strokeWidth="1"
    />
  </g>
);

// Anatomically accurate human body outline - Back view
const BackBodySilhouette = () => (
  <g>
    {/* Head */}
    <ellipse cx="150" cy="50" rx="35" ry="42" fill="#4a5568" stroke="#5a6578" strokeWidth="1" />
    {/* Neck */}
    <rect x="137" y="88" width="26" height="24" fill="#4a5568" stroke="#5a6578" strokeWidth="1" />
    {/* Torso and legs - Back */}
    <path
      d="M90,112 L90,145 L65,200 L80,205 L100,175 L105,220 L110,250 L100,310 L95,400 L93,430 L95,520 L90,550 L85,565 C85,580 135,580 135,565 L130,550 L125,520 L128,430 L130,400 L150,310 L170,400 L172,430 L175,520 L170,550 L165,565 C165,580 215,580 215,565 L210,550 L205,520 L207,430 L205,400 L200,310 L190,250 L195,220 L200,175 L220,205 L235,200 L210,145 L210,112 Z"
      fill="#4a5568"
      stroke="#5a6578"
      strokeWidth="1"
    />
    {/* Left Arm */}
    <path
      d="M90,145 L75,155 L65,200 L55,260 L40,265 L25,270 L15,315 L20,325 L35,330 L50,315 L45,300 L60,295 L80,205 L100,175"
      fill="#4a5568"
      stroke="#5a6578"
      strokeWidth="1"
    />
    {/* Right Arm */}
    <path
      d="M210,145 L225,155 L235,200 L245,260 L260,265 L275,270 L285,315 L280,325 L265,330 L250,315 L255,300 L240,295 L220,205 L200,175"
      fill="#4a5568"
      stroke="#5a6578"
      strokeWidth="1"
    />
  </g>
);

// Body outline with segment lines for clear part visualization
const BodyPartOutlines = ({ parts, hoveredPart, selectedPart }: { parts: BodyPartArea[], hoveredPart: string | null, selectedPart: BodyPartArea | null }) => (
  <g>
    {parts.map((part) => (
      <path
        key={`outline-${part.id}`}
        d={part.path}
        fill="transparent"
        stroke={selectedPart?.id === part.id ? '#22d3ee' : hoveredPart === part.id ? '#67e8f9' : '#5a6578'}
        strokeWidth={selectedPart?.id === part.id ? 2 : 1}
        strokeDasharray={selectedPart?.id === part.id || hoveredPart === part.id ? '0' : '0'}
        opacity={0.6}
      />
    ))}
  </g>
);

export function BodyMap({ athleteId, athleteName, onChange, initialData = {}, readOnly = false }: BodyMapProps) {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [selectedPart, setSelectedPart] = useState<BodyPartArea | null>(null);
  const [sorenessData, setSorenessData] = useState<Record<string, SorenessData>>(initialData);
  const [showHistory, setShowHistory] = useState(false);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const mockHistory: Record<string, SorenessData[]> = {
    'hamstring_left': [
      { bodyPartId: 'hamstring_left', severity: 4, painType: 'soreness', notes: 'After sprint training', timestamp: new Date('2024-12-22') },
      { bodyPartId: 'hamstring_left', severity: 3, painType: 'tightness', notes: '', timestamp: new Date('2024-12-20') },
    ],
    'lower_back': [
      { bodyPartId: 'lower_back', severity: 3, painType: 'tightness', notes: 'Heavy deadlift session', timestamp: new Date('2024-12-21') },
    ],
  };

  const currentParts = view === 'front' ? frontBodyParts : backBodyParts;

  const getSeverityColor = (partId: string): string => {
    const data = sorenessData[partId];
    if (!data || data.severity === 0) return 'transparent';
    return severityLevels[data.severity].color;
  };

  const handlePartClick = (part: BodyPartArea) => {
    if (readOnly) return;
    setSelectedPart(part);
    setShowHistory(false);
  };

  const handleSeverityChange = (severity: number) => {
    if (!selectedPart) return;
    const newData = {
      ...sorenessData,
      [selectedPart.id]: {
        ...sorenessData[selectedPart.id],
        bodyPartId: selectedPart.id,
        severity,
        painType: sorenessData[selectedPart.id]?.painType || 'soreness',
        notes: sorenessData[selectedPart.id]?.notes || '',
        timestamp: new Date(),
      },
    };
    setSorenessData(newData);
    onChange?.(newData);
  };

  const handlePainTypeChange = (painType: PainType) => {
    if (!selectedPart) return;
    const newData = {
      ...sorenessData,
      [selectedPart.id]: {
        ...sorenessData[selectedPart.id],
        bodyPartId: selectedPart.id,
        severity: sorenessData[selectedPart.id]?.severity || 1,
        painType,
        notes: sorenessData[selectedPart.id]?.notes || '',
        timestamp: new Date(),
      },
    };
    setSorenessData(newData);
    onChange?.(newData);
  };

  const handleNotesChange = (notes: string) => {
    if (!selectedPart) return;
    const newData = {
      ...sorenessData,
      [selectedPart.id]: {
        ...sorenessData[selectedPart.id],
        bodyPartId: selectedPart.id,
        severity: sorenessData[selectedPart.id]?.severity || 0,
        painType: sorenessData[selectedPart.id]?.painType || 'none',
        notes,
        timestamp: new Date(),
      },
    };
    setSorenessData(newData);
    onChange?.(newData);
  };

  const clearPart = () => {
    if (!selectedPart) return;
    const newData = { ...sorenessData };
    delete newData[selectedPart.id];
    setSorenessData(newData);
    onChange?.(newData);
    setSelectedPart(null);
  };

  const clearAll = () => {
    setSorenessData({});
    onChange?.({});
    setSelectedPart(null);
  };

  const affectedCount = Object.values(sorenessData).filter(d => d.severity > 0).length;
  const severeCount = Object.values(sorenessData).filter(d => d.severity >= 4).length;

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white text-lg">Interactive Body Map</h3>
          <p className="text-sm text-gray-400">Tap on body part to record soreness</p>
        </div>
        <div className="flex items-center gap-3">
          {severeCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded-full">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span className="text-xs font-medium text-red-400">{severeCount} severe</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Body SVG Container */}
        <div className="flex-1">
          {/* View Toggle and Labels */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-gray-500 w-12">{view === 'front' ? 'Right' : 'Left'}</span>
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setView('front')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  view === 'front'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Front
              </button>
              <button
                onClick={() => setView('back')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  view === 'back'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Back
              </button>
            </div>
            <span className="text-xs text-gray-500 w-12 text-right">{view === 'front' ? 'Left' : 'Right'}</span>
          </div>

          {/* Body SVG */}
          <div className="flex justify-center bg-gray-800/50 rounded-xl p-4">
            <svg viewBox="0 0 300 590" className="h-[500px] w-auto">
              {/* Background body silhouette */}
              {view === 'front' ? <FrontBodySilhouette /> : <BackBodySilhouette />}

              {/* Body part segment lines */}
              <BodyPartOutlines
                parts={currentParts}
                hoveredPart={hoveredPart}
                selectedPart={selectedPart}
              />

              {/* Clickable body parts with color fill */}
              {currentParts.map((part) => {
                const severity = sorenessData[part.id]?.severity || 0;
                const isSelected = selectedPart?.id === part.id;
                const isHovered = hoveredPart === part.id;
                const fillColor = getSeverityColor(part.id);

                return (
                  <g key={part.id}>
                    <path
                      d={part.path}
                      fill={severity > 0 ? fillColor : 'transparent'}
                      fillOpacity={severity > 0 ? 0.75 : 0}
                      stroke={isSelected ? '#22d3ee' : isHovered ? '#67e8f9' : 'transparent'}
                      strokeWidth={isSelected ? 3 : isHovered ? 2 : 0}
                      className={`cursor-pointer transition-all duration-200 ${!readOnly ? 'hover:fill-cyan-500/20' : ''}`}
                      onClick={() => handlePartClick(part)}
                      onMouseEnter={() => setHoveredPart(part.id)}
                      onMouseLeave={() => setHoveredPart(null)}
                      style={{ pointerEvents: 'all' }}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Hovered Part Label */}
          {hoveredPart && (
            <div className="mt-3 text-center">
              <span className="inline-block px-4 py-2 bg-blue-600 rounded-lg text-white font-medium shadow-lg">
                {currentParts.find(p => p.id === hoveredPart)?.name}
              </span>
            </div>
          )}

          {/* Clear All Button */}
          {affectedCount > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="w-64 space-y-4">
          {selectedPart ? (
            <>
              {/* Selected Part Info */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-white">{selectedPart.name}</h4>
                    <p className="text-sm text-cyan-400">{selectedPart.nameMarathi}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPart(null)}
                    className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {mockHistory[selectedPart.id] && (
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 mt-2"
                  >
                    <History className="w-4 h-4" />
                    View History ({mockHistory[selectedPart.id].length})
                  </button>
                )}
              </div>

              {/* History Panel */}
              {showHistory && mockHistory[selectedPart.id] && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-300 mb-3">Recent History</h5>
                  <div className="space-y-2">
                    {mockHistory[selectedPart.id].map((entry, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">{entry.timestamp.toLocaleDateString()}</span>
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: severityLevels[entry.severity].color }}
                        >
                          {severityLevels[entry.severity].label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Severity Selection */}
              <div className="bg-gray-800 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-300 mb-3">Severity Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {severityLevels.map((level) => (
                    <button
                      key={level.level}
                      onClick={() => handleSeverityChange(level.level)}
                      className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                        sorenessData[selectedPart.id]?.severity === level.level
                          ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-800'
                          : 'hover:opacity-80'
                      }`}
                      style={{
                        backgroundColor: level.level === 0 ? '#374151' : level.color,
                        color: level.level <= 2 ? '#1f2937' : 'white'
                      }}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pain Type Selection */}
              <div className="bg-gray-800 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-300 mb-3">Pain Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(painTypeLabels)
                    .filter(([key]) => key !== 'none')
                    .map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => handlePainTypeChange(key as PainType)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          sorenessData[selectedPart.id]?.painType === key
                            ? 'bg-cyan-600 text-white ring-2 ring-cyan-400'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {value.label}
                      </button>
                    ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-gray-800 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                <textarea
                  value={sorenessData[selectedPart.id]?.notes || ''}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Add notes..."
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white resize-none h-20 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Clear Button */}
              <button
                onClick={clearPart}
                className="w-full py-2.5 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
              >
                Clear This Part
              </button>
            </>
          ) : (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <Info className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-300 font-medium">Select a Body Part</p>
              <p className="text-sm text-gray-500 mt-1">शरीराच्या भागावर क्लिक करा</p>
            </div>
          )}

          {/* Legend */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h5 className="text-sm font-medium text-gray-300 mb-3">Severity Legend</h5>
            <div className="space-y-2">
              {severityLevels.slice(1).map((level) => (
                <div key={level.level} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: level.color }}
                  />
                  <span className="text-sm text-gray-400">{level.label}</span>
                  <span className="text-xs text-gray-500">({level.marathi})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Affected Areas Summary */}
      {affectedCount > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <h5 className="text-sm font-medium text-gray-300 mb-3">
            Affected Areas ({affectedCount})
          </h5>
          <div className="flex flex-wrap gap-2">
            {Object.entries(sorenessData)
              .filter(([_, data]) => data.severity > 0)
              .map(([partId, data]) => {
                const part = [...frontBodyParts, ...backBodyParts].find(p => p.id === partId);
                return (
                  <div
                    key={partId}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-white cursor-pointer hover:opacity-80"
                    style={{ backgroundColor: severityLevels[data.severity].color }}
                    onClick={() => {
                      const foundPart = [...frontBodyParts, ...backBodyParts].find(p => p.id === partId);
                      if (foundPart) {
                        // Switch view if needed
                        const isInFront = frontBodyParts.some(p => p.id === partId);
                        if (isInFront && view !== 'front') setView('front');
                        if (!isInFront && view !== 'back') setView('back');
                        setSelectedPart(foundPart);
                      }
                    }}
                  >
                    <span>{part?.name}</span>
                    <span className="text-xs opacity-80">
                      {painTypeLabels[data.painType]?.label}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default BodyMap;
