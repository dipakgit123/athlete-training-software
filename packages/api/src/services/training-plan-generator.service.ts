/**
 * Training Plan Generator Service
 * Uses Google Gemini AI to generate personalized training plans
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

// Initialize Gemini AI
function initializeGemini() {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-gemini-api-key-here') {
    console.warn('⚠️  GEMINI_API_KEY not configured. AI generation will be simulated.');
    return null;
  }
  
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log('✅ Gemini AI initialized successfully');
    return genAI;
  } catch (error) {
    console.error('❌ Failed to initialize Gemini AI:', error);
    return null;
  }
}

// Generate training plan using Gemini AI with 13-Step Elite Coaching Framework
export async function generateTrainingPlanWithAI(athleteData: any): Promise<any> {
  const ai = initializeGemini();
  
  if (!ai) {
    console.log('🔄 Using fallback training plan generation (Gemini not configured)');
    return generateFallbackPlan(athleteData);
  }

  try {
    // Use gemini-2.0-flash-exp for better results with complex prompts
    const model = ai.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8000,
      }
    });

    const age = calculateAge(athleteData.dateOfBirth);
    const name = `${athleteData.firstName} ${athleteData.lastName}`;
    const event = athleteData.primaryEvent || 'Sprint';
    const competitionDate = athleteData.competitionDate || 'Not specified';

    // Comprehensive 13-Step Elite Coaching Framework Prompt
    const prompt = `You are an elite athletics high-performance coach, biomechanist, sports scientist, and performance manager working with national and international level athletes.

ATHLETE PROFILE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${name}
Gender: ${athleteData.gender || 'Not specified'}
Age: ${age} years
Training Age: ${athleteData.trainingAge || 'Not specified'} years
Primary Event: ${event}
Competition Date: ${competitionDate}
Current Performance Level: ${athleteData.currentPerformance || 'Not specified'}
Personal Best: ${athleteData.personalBest || 'N/A'}
Target Performance: ${athleteData.targetPB || 'Improvement'}

PHYSICAL MEASUREMENTS:
Height: ${athleteData.height || 'Not specified'} cm
Weight: ${athleteData.weight || 'Not specified'} kg

EVENT-SPECIFIC TEST RESULTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SPEED TESTS:
- 10m Sprint: ${athleteData.sprint10m || 'Not tested'} seconds
- 30m Sprint: ${athleteData.sprint30m || 'Not tested'} seconds
- 60m Sprint: ${athleteData.sprint60m || 'Not tested'} seconds

POWER TESTS:
- Vertical Jump: ${athleteData.verticalJump || 'Not tested'} cm
- Standing Long Jump: ${athleteData.standingLongJump || 'Not tested'} cm

STRENGTH TESTS:
- Squat 1RM: ${athleteData.squat1RM || 'Not tested'} kg
- Bench Press 1RM: ${athleteData.benchPress1RM || 'Not tested'} kg
- Deadlift 1RM: ${athleteData.deadlift1RM || 'Not tested'} kg

PHYSIOLOGICAL MARKERS:
- VO2 Max: ${athleteData.vo2Max || 'Not tested'} ml/kg/min
- Resting Heart Rate: ${athleteData.restingHR || 'Not tested'} bpm
- Max Heart Rate: ${athleteData.maxHR || 'Not tested'} bpm

INJURY HISTORY & MEDICAL:
- Injuries: ${athleteData.injuries || 'None reported'}
- Medical Conditions: ${athleteData.medicalConditions || 'None reported'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YOUR TASK - GENERATE COMPREHENSIVE COMPETITION-FOCUSED TRAINING PLAN:

=================================================================
STEP 1 — COMPLETE TEST RESULT ANALYSIS
=================================================================
• Analyze ALL provided test results event-wise
• Identify clearly:
  - Performance strengths (top 3)
  - Performance weaknesses (top 3)
  - Primary limiting factors
  - Secondary limiting factors
  - Injury risk areas
• Compare athlete data with elite benchmarks for ${event}
• Explain how each test directly affects competition performance
• Rank performance qualities in priority order

=================================================================
STEP 2 — PERFORMANCE POTENTIAL & PB PREDICTION
=================================================================
• Predict realistic PB improvement based on test data
• Use speed, power, strength, and endurance markers
• Provide:
  - Best-case scenario PB
  - Conservative scenario PB
  - Timeline to achieve each
  - Risk factors affecting prediction

=================================================================
STEP 3 — YEARLY PERIODIZATION (COMPETITION-DRIVEN)
=================================================================
Based on competition date: ${competitionDate}

Create FULL periodized plan with these 6 phases:
1. जनरल प्रिपरेशन फेज (General Preparation Phase - GPP)
2. स्पेसिफिक प्रिपरेशन फेज (Specific Preparation Phase - SPP)
3. प्री-कॉम्पिटिशन फेज (Pre-Competition Phase)
4. कॉम्पिटिशन फेज (Competition Phase)
5. पीक परफॉर्मन्स फेज (Peak Performance/Taper Phase)
6. ट्रान्झिशन (ॲक्टिव्ह रेस्ट) फेज (Transition/Active Rest Phase)

For EACH phase provide:
• Start and end dates (work backward from competition date)
• Duration (weeks)
• Primary goals (3-5 bullet points)
• Secondary goals
• Key performance qualities to develop
• Technical focus (ONLY 1 primary + 1 secondary)
• Strength & speed emphasis (percentage breakdown)
• Load progression logic
• Expected adaptations

=================================================================
STEP 4 — MONTHLY & WEEKLY STRUCTURE
=================================================================
For EACH phase, provide:
• Monthly objectives (month-by-month)
• Weekly microcycle structure
• High / Medium / Low intensity day distribution
• Speed / Strength / Endurance balance per week
• CNS load management strategy
• Recovery day placement logic
• Deload week timing

=================================================================
STEP 5 — DAILY SESSION DESIGN (DETAILED EXAMPLES)
=================================================================
Provide 3 sample daily workouts (Speed day, Strength day, Technical day):

For EACH workout include:

A) WARM-UP STRUCTURE (15-20 minutes)
• General warm-up exercises (5-10 min)
• Dynamic mobility drills (specific exercises)
• Activation drills (glutes, hamstrings, core - name exercises)
• Sprint/running drills (A-skips, B-skips, etc.)
• Event-specific preparation

B) MAIN WORKOUT
• Exact exercise names
• Sets × Reps × Intensity (%1RM or velocity)
• Rest intervals (seconds)
• Distances (for runs)
• Target times CALCULATED using:
  - Max velocity = Distance ÷ PB time
  - Target time = (Distance ÷ Max velocity) ÷ % intensity
• Technical cues

C) STRENGTH & POWER SESSION
• Exercise selection (Olympic lifts, squats, etc.)
• Sets × Reps
• %1RM or velocity intent
• Rest periods
• Tempo (e.g., 3-0-1-0)

D) CORE & INJURY PREVENTION (15 minutes)
• Specific exercises (plank variations, Copenhagen, Pallof press)
• Volume (time or reps)
• Progression scheme

E) COOL DOWN (10-15 minutes)
• Light jog/mobility
• Stretching protocol
• Recovery methods

=================================================================
STEP 6 — INTENSITY, LOAD & FATIGUE MANAGEMENT
=================================================================
• Weekly volume targets (km for runs, tonnage for lifts)
• Weekly intensity distribution (80/20 rule, etc.)
• Deload weeks (when and why)
• CNS fatigue indicators
• Session RPE × duration monitoring
• Auto-regulation rules (when to reduce load)

=================================================================
STEP 7 — MONITORING & FEEDBACK LOOP
=================================================================
• Daily wellness check (sleep quality, soreness 1-10, stress level)
• Weekly performance indicators to track
• Technique checkpoints (video analysis timing)
• Decision rules:
  - When to push harder
  - When to maintain
  - When to reduce load

=================================================================
STEP 8 — MENTAL & COMPETITION PREPARATION
=================================================================
• Pre-race routine development
• Visualization protocols
• Competition simulation workouts
• Race-day mindset strategies
• Cue words for performance

=================================================================
STEP 9 — NUTRITION & BODY COMPOSITION
=================================================================
• Phase-specific nutrition focus
• Carbohydrate periodization (high/moderate/low carb days)
• Protein timing (post-workout, daily target)
• Race-week nutrition protocol
• Hydration strategy
• Bodyweight management (if needed)

=================================================================
STEP 10 — INJURY RISK MANAGEMENT
=================================================================
• Pain scale decision rules (1-10 scale actions)
• Red flags to stop training
• Alternative training options (pool, bike, elliptical)
• Return-to-training progression
• Prehab exercises (hamstring, ankle, hip, calf)

=================================================================
STEP 11 — EVENT-SPECIFIC TECHNICAL WORK
=================================================================
For ${event}, include:
• Key biomechanical focuses
• Technical drills (specific to event)
• Video analysis checkpoints
• Common technical errors to avoid
• Progression from general to specific

=================================================================
STEP 12 — PEAK & TAPER STRATEGY (CRITICAL FOR COMPETITION)
=================================================================
Final 10-14 days before competition:
• Volume reduction plan (% decrease per week)
• Intensity maintenance strategy
• Neural freshness indicators
• Last hard workout timing
• Competition week day-by-day plan
• Travel & time zone considerations

=================================================================
STEP 13 — FINAL OUTPUT FORMAT
=================================================================
• Present plan in clear, structured JSON format
• Use tables for weekly/monthly breakdowns
• Practical, coach-friendly language
• Include Marathi/Hindi terms where helpful for understanding
• Goal: BEST POSSIBLE PERFORMANCE on ${competitionDate}

CRITICAL RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Base ALL decisions on the athlete's test data provided
• Be specific, NOT generic
• Calculate actual target times and loads
• Focus on competition performance, not just fitness
• Consider injury history in exercise selection
• Provide actionable, ready-to-implement plans

Please provide the comprehensive training plan in a structured JSON format that can be parsed and displayed in the application.`;

    console.log('🚀 Generating comprehensive 13-step training plan with Gemini AI...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini AI generated comprehensive training plan');
    
    // Try to parse JSON from response
    try {
      // Remove markdown code blocks if present
      let cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Try to find JSON object in the response
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const planData = JSON.parse(jsonMatch[0]);
        return {
          ...planData,
          generatedBy: 'Gemini AI - 13-Step Elite Framework',
          generatedAt: new Date().toISOString(),
          framework: '13-Step Comprehensive',
          athleteData: {
            name: name,
            event: event,
            personalBest: athleteData.personalBest,
            targetPB: athleteData.targetPB,
            competitionDate: competitionDate,
          },
        };
      }
      
      // If no JSON found, return the text response with structure
      return {
        comprehensivePlan: text,
        generatedBy: 'Gemini AI - 13-Step Elite Framework',
        generatedAt: new Date().toISOString(),
        framework: '13-Step Comprehensive',
        athleteData: {
          name: name,
          event: event,
          personalBest: athleteData.personalBest,
          targetPB: athleteData.targetPB,
          competitionDate: competitionDate,
        },
        note: 'Plan generated as comprehensive text. Parse manually for detailed implementation.',
      };
    } catch (parseError) {
      console.warn('⚠️  Could not parse JSON from response, returning structured text format');
      return {
        comprehensivePlan: text,
        generatedBy: 'Gemini AI - 13-Step Elite Framework',
        generatedAt: new Date().toISOString(),
        framework: '13-Step Comprehensive',
        athleteData: {
          name: name,
          event: event,
          personalBest: athleteData.personalBest,
          targetPB: athleteData.targetPB,
          competitionDate: competitionDate,
        },
        note: 'Plan generated as comprehensive text. Parse manually for detailed implementation.',
      };
    }
    
  } catch (error) {
    console.error('❌ Gemini AI generation failed:', error);
    return generateFallbackPlan(athleteData);
  }
}

// Fallback plan generation (used when Gemini is not available)
function generateFallbackPlan(athleteData: any): any {
  console.log('📝 Generating fallback training plan');
  
  const totalWeeks = 23;
  const competitionDate = athleteData.competitionDate || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  return {
    totalWeeks,
    generatedBy: 'Fallback Generator (Configure GEMINI_API_KEY for AI generation)',
    generatedAt: new Date().toISOString(),
    athleteData: {
      name: `${athleteData.firstName} ${athleteData.lastName}`,
      event: athleteData.primaryEvent || 'Sprint',
      personalBest: athleteData.personalBest || 'N/A',
      targetPB: athleteData.targetPB || 'Improvement',
      competitionDate,
    },
    phases: [
      {
        name: 'General Preparation Phase (GPP)',
        durationWeeks: 8,
        focus: [
          'Build aerobic base and work capacity',
          'Develop general strength and muscle balance',
          'Improve movement quality and technique',
          'Establish training rhythm',
        ],
        volume: 'HIGH (80-100%)',
        intensity: 'MODERATE (60-75%)',
        objectives: [
          'Increase work capacity by 15-20%',
          'Build strength foundation',
          'Develop technical proficiency',
          'Injury prevention focus',
        ],
        keyWorkouts: [
          'Tempo runs: 10-12x100m @ 70%',
          'Strength: 4x6-8 compound lifts',
          'Extensive plyos: 80-120 contacts',
          'Technical drills: A-Skip, B-Skip, bounds',
        ],
        weeklyStructure: {
          monday: {
            type: 'Speed Development',
            intensity: 'MODERATE-HIGH',
            duration: '90 min',
            details: [
              'Acceleration work: 6x20m',
              'Max velocity: 4x30m flying',
              'Technical drills',
            ],
          },
          tuesday: {
            type: 'Strength Training',
            intensity: 'HIGH',
            duration: '75 min',
            details: [
              'Lower body: Squat, RDL, Lunges',
              'Core work',
              'Injury prevention exercises',
            ],
          },
          wednesday: {
            type: 'Tempo/Endurance',
            intensity: 'LOW-MODERATE',
            duration: '60 min',
            details: [
              'Tempo runs: 10x100m @ 70%',
              'Active recovery',
              'Flexibility work',
            ],
          },
          thursday: {
            type: 'Plyometrics + Upper Body',
            intensity: 'MODERATE',
            duration: '75 min',
            details: [
              'Extensive plyos: Bounds, hops',
              'Upper body strength',
              'Core stability',
            ],
          },
          friday: {
            type: 'Speed Endurance',
            intensity: 'MODERATE-HIGH',
            duration: '75 min',
            details: [
              'Speed endurance: 4x80m @ 85%',
              'Technical work',
              'Active recovery',
            ],
          },
          saturday: {
            type: 'Recovery/Skills',
            intensity: 'LOW',
            duration: '45 min',
            details: [
              'Easy jog or swim',
              'Technical drills',
              'Mobility work',
            ],
          },
          sunday: {
            type: 'REST',
            intensity: '-',
            duration: '-',
            details: ['Complete rest', 'Mental recovery'],
          },
        },
      },
      {
        name: 'Specific Preparation Phase (SPP)',
        durationWeeks: 10,
        focus: [
          'Convert general strength to power',
          'Develop race-specific speed',
          'Increase max velocity',
          'Competition simulation',
        ],
        volume: 'MODERATE (50-70%)',
        intensity: 'HIGH (80-95%)',
        objectives: [
          'Improve max velocity by 3-5%',
          'Develop race-specific fitness',
          'Perfect start technique',
          'Mental preparation',
        ],
        keyWorkouts: [
          'Block starts: 8x30m @ 95%',
          'Speed: 5x60m @ 95%+',
          'Power lifts: 3x3-5 @ 85%+',
          'Intensive plyos: 40-60 contacts',
        ],
        weeklyStructure: {
          monday: {
            type: 'Maximum Velocity',
            intensity: 'HIGH',
            duration: '90 min',
            details: [
              'Flying 30m: 5 reps @ 98%',
              'Wickets/acceleration ladder',
              'Technical perfection',
            ],
          },
          tuesday: {
            type: 'Power Development',
            intensity: 'HIGH',
            duration: '75 min',
            details: [
              'Olympic lifts: Clean, Snatch',
              'Intensive plyos',
              'Explosive strength',
            ],
          },
          wednesday: {
            type: 'Tempo/Recovery',
            intensity: 'LOW',
            duration: '50 min',
            details: [
              'Easy tempo: 6x100m @ 65%',
              'Pool recovery',
              'Massage/therapy',
            ],
          },
          thursday: {
            type: 'Speed Endurance',
            intensity: 'HIGH',
            duration: '80 min',
            details: [
              'Race pace: 3x60m @ 95%',
              'Long recovery',
              'Mental focus',
            ],
          },
          friday: {
            type: 'Maintenance Strength',
            intensity: 'MODERATE',
            duration: '60 min',
            details: [
              'Maintenance lifts: 3x5',
              'Core work',
              'Flexibility',
            ],
          },
          saturday: {
            type: 'Active Recovery',
            intensity: 'LOW',
            duration: '40 min',
            details: [
              'Light activity',
              'Skills practice',
              'Visualization',
            ],
          },
          sunday: {
            type: 'REST',
            intensity: '-',
            duration: '-',
            details: ['Complete rest', 'Nutrition focus'],
          },
        },
      },
      {
        name: 'Pre-Competition Phase',
        durationWeeks: 3,
        focus: [
          'Race simulation and modeling',
          'Neural readiness optimization',
          'Mental preparation and confidence',
          'Fine-tune technique',
        ],
        volume: 'LOW (30-40%)',
        intensity: 'RACE PACE (95-100%)',
        objectives: [
          'Perfect race execution',
          'Build competition confidence',
          'Optimize neural freshness',
          'Simulate race conditions',
        ],
        keyWorkouts: [
          'Competition simulation: Full race',
          'Race pace: 2-3x race distance',
          'Starts under pressure',
          'Mental rehearsal',
        ],
        weeklyStructure: {
          monday: {
            type: 'Race Simulation',
            intensity: 'RACE',
            duration: '75 min',
            details: [
              'Full race warmup',
              'Compete at 95-98%',
              'Race day routine',
            ],
          },
          tuesday: {
            type: 'Recovery',
            intensity: 'LOW',
            duration: '40 min',
            details: [
              'Easy movement',
              'Therapy/treatment',
              'Mental recovery',
            ],
          },
          wednesday: {
            type: 'Speed Maintenance',
            intensity: 'MODERATE-HIGH',
            duration: '60 min',
            details: [
              '3x30m @ 90%',
              'Stay sharp',
              'Technical work',
            ],
          },
          thursday: {
            type: 'REST',
            intensity: '-',
            duration: '-',
            details: ['Complete rest', 'Prepare mentally'],
          },
          friday: {
            type: 'Sharpening',
            intensity: 'HIGH',
            duration: '50 min',
            details: [
              '2x20m @ 95%',
              'Starts practice',
              'Feel good reps',
            ],
          },
          saturday: {
            type: 'Pre-Race Activation',
            intensity: 'LOW',
            duration: '30 min',
            details: [
              'Light warmup',
              'Strides',
              'Venue familiarization',
            ],
          },
          sunday: {
            type: 'Competition Day',
            intensity: 'RACE',
            duration: '-',
            details: ['Execute race plan', 'Trust training'],
          },
        },
      },
      {
        name: 'Competition/Taper Phase',
        durationWeeks: 2,
        focus: [
          'Peak performance realization',
          'Neural freshness maintenance',
          'Competition execution',
          'Celebrate achievements',
        ],
        volume: 'MINIMAL (20-30%)',
        intensity: 'RACE PACE (100%)',
        objectives: [
          'Achieve target performance',
          'Optimal readiness',
          'Perfect execution',
          'Mental confidence',
        ],
        keyWorkouts: [
          'Minimal volume, max quality',
          'Competition only',
          'Trust the taper',
          'Race day focus',
        ],
        weeklyStructure: {
          monday: {
            type: 'Light Speed',
            intensity: 'MODERATE',
            duration: '40 min',
            details: [
              '3x20m @ 85%',
              'Stay loose',
              'Feel good',
            ],
          },
          tuesday: {
            type: 'REST',
            intensity: '-',
            duration: '-',
            details: ['Rest', 'Mental prep'],
          },
          wednesday: {
            type: 'Sharpening',
            intensity: 'HIGH',
            duration: '35 min',
            details: [
              '2x20m @ 95%',
              'Starts',
              'Confidence building',
            ],
          },
          thursday: {
            type: 'REST',
            intensity: '-',
            duration: '-',
            details: ['Rest', 'Travel if needed'],
          },
          friday: {
            type: 'Pre-Competition',
            intensity: 'LOW',
            duration: '25 min',
            details: [
              'Light activation',
              'Track familiarization',
              'Strides',
            ],
          },
          saturday: {
            type: 'COMPETITION',
            intensity: 'RACE',
            duration: '-',
            details: [
              'TARGET COMPETITION',
              'Execute plan',
              'Achieve goal!',
            ],
          },
          sunday: {
            type: 'Recovery',
            intensity: '-',
            duration: '-',
            details: ['Post-race recovery', 'Celebrate'],
          },
        },
      },
    ],
  };
}

// Helper function to calculate age
function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0;
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export default {
  generateTrainingPlanWithAI,
};
