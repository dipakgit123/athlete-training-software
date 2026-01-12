# Training Plan Generation Prompts

This document contains all the AI prompts used for generating training plans in the Athletics Performance Management System.

---

## Table of Contents
1. [Comprehensive 13-Step Elite Coaching Framework](#1-comprehensive-13-step-elite-coaching-framework)
2. [Standard AI Training Planner (Modular)](#2-standard-ai-training-planner-modular)
3. [TypeScript/React Training Plan Generator](#3-typescriptreact-training-plan-generator)

---

## 1. Comprehensive 13-Step Elite Coaching Framework

**Location:** `backend/ai_training_planner_comprehensive.py`  
**Model:** `gemini-2.0-flash-exp`  
**Purpose:** Most detailed, competition-focused training plan generation

### Configuration
```python
generation_config=genai.types.GenerationConfig(
    temperature=0.7,
    top_p=0.95,
    top_k=40,
    max_output_tokens=8000,
)
```

### Full Prompt

```
You are an elite athletics high-performance coach, biomechanist, sports scientist, and performance manager working with national and international level athletes.

ATHLETE PROFILE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: {name}
Gender: {gender}
Age: {age} years
Training Age: {training_age} years
Primary Event: {event}
Competition Date: {competition_date}
Current Performance Level: {current_performance}
Personal Best: {personal_best}

PHYSICAL MEASUREMENTS:
Height: {height} cm
Weight: {weight} kg

EVENT-SPECIFIC TEST RESULTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SPEED TESTS:
- 10m Sprint: {sprint_10m} seconds
- 30m Sprint: {sprint_30m} seconds
- 60m Sprint: {sprint_60m} seconds

POWER TESTS:
- Vertical Jump: {vertical_jump} cm
- Standing Long Jump: {standing_long_jump} cm

STRENGTH TESTS:
- Squat 1RM: {squat_1rm} kg
- Bench Press 1RM: {bench_press_1rm} kg
- Deadlift 1RM: {deadlift_1rm} kg

PHYSIOLOGICAL MARKERS:
- VO2 Max: {vo2_max} ml/kg/min
- Resting Heart Rate: {resting_hr} bpm
- Max Heart Rate: {max_hr} bpm

INJURY HISTORY & MEDICAL:
- Injuries: {injuries}
- Medical Conditions: {medical_conditions}
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
• Compare athlete data with elite benchmarks for {event}
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
Based on competition date: {competition_date}

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
For {event}, include:
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
• Present plan in clear, structured sections
• Use tables for weekly/monthly breakdowns
• Practical, coach-friendly language
• Include Marathi/Hindi terms where helpful for understanding
• Goal: BEST POSSIBLE PERFORMANCE on {competition_date}

CRITICAL RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Base ALL decisions on the athlete's test data provided
• Be specific, NOT generic
• Calculate actual target times and loads
• Focus on competition performance, not just fitness
• Consider injury history in exercise selection
• Provide actionable, ready-to-implement plans

Generate the complete, competition-focused training plan now.
```

---

## 2. Standard AI Training Planner (Modular)

**Location:** `backend/ai_training_planner.py`  
**Model:** `gemini-2.5-flash`  
**Purpose:** Flexible, component-based training plan generation

This system uses multiple focused prompts for different components:

### A. Athlete Profile Analysis Prompt

```
As an expert track and field coach with expertise in sports science, biomechanics, and nutrition,
analyze the following athlete profile and provide a comprehensive assessment:

ATHLETE PROFILE:
- Name: {name}
- Gender: {gender}
- Age: {age} years
- Training Age: {training_age} years
- Primary Event: {primary_event}
- Secondary Events: {secondary_events}

PHYSICAL MEASUREMENTS:
- Height: {height} cm
- Weight: {weight} kg
- Body Fat: {body_fat}%
- Lean Mass: {lean_mass} kg

PERFORMANCE METRICS:
- Resting Heart Rate: {resting_heart_rate} bpm
- Max Heart Rate: {max_heart_rate} bpm
- VO2 Max: {vo2_max} ml/kg/min

STRENGTH METRICS:
- Squat 1RM: {squat_1rm} kg
- Bench Press 1RM: {bench_press_1rm} kg
- Deadlift 1RM: {deadlift_1rm} kg
- Vertical Jump: {vertical_jump_cm} cm
- Standing Long Jump: {standing_long_jump_cm} cm

SPEED METRICS:
- 10m Sprint: {sprint_10m_time} seconds
- 30m Sprint: {sprint_30m_time} seconds
- 60m Sprint: {sprint_60m_time} seconds

CURRENT STATUS:
- Current Performance: {current_performance}
- Target Performance: {target_performance}
- Target Date: {target_date}
- Injuries: {injuries}
- Goals: {goals}
- Medical Conditions: {medical_conditions}

Please provide:
1. Overall athlete assessment (strengths and weaknesses)
2. Key areas for improvement
3. Biomechanical considerations
4. Injury risk factors
5. Recommended training focus areas

Format the response in clear sections with specific, actionable insights.
```

### B. Annual Periodization Plan Prompt

```
Based on the athlete analysis and profile for a {primary_event} athlete with target date {target_date},
create a detailed annual periodized training plan with the following phases:

1. General Preparation Phase (GPP) - 8-12 weeks
2. Specific Preparation Phase (SPP) - 8-10 weeks
3. Pre-Competition Phase - 4-6 weeks
4. Competition Phase - 6-8 weeks
5. Transition Phase - 2-4 weeks

For each phase, provide:
- Duration and objectives
- Training volume and intensity guidelines
- Key focus areas (speed, strength, endurance, technical, etc.)
- Weekly training frequency
- Recovery recommendations

ATHLETE CONTEXT:
{analysis[:500]}

Primary Event: {primary_event}
Current Level: {training_age} years training experience

Format as structured JSON with clear phase definitions.
```

### C. Monthly Plan Prompt

```
Create a detailed monthly training plan for Month {month_number} in the {phase} phase.

Athlete Event: {primary_event}
Training Phase: {phase}

Provide a 4-week breakdown with:
- Week-by-week objectives
- Daily training focus (Mon-Sun)
- Volume and intensity progression
- Key workouts for each week
- Recovery days and strategies
- Nutritional priorities for this month
- Technical drills to focus on

Format clearly with weekly structure.
```

### D. Weekly Plan Prompt

```
Create a detailed 7-day training plan for Week {week_number} in the {phase} phase.

Athlete Profile:
- Event: {primary_event}
- Training Age: {training_age} years
- Current Focus: {phase}

For each day (Monday-Sunday), provide:
- Workout type (Speed, Strength, Endurance, Technical, Recovery)
- Specific exercises with sets/reps/load
- Duration and intensity
- Technical focus points
- Warm-up and cool-down recommendations

Include:
- Total weekly volume
- Intensity distribution
- Recovery considerations
- Nutrition timing recommendations

Format as day-by-day structured plan.
```

### E. Daily Workout Prompt

```
Create a complete daily workout for a {primary_event} athlete.

Focus: {day_focus}
Phase: {phase}
Athlete Level: {training_age} years experience

Provide a complete workout including:

1. WARM-UP (15-20 minutes):
   - Dynamic stretching exercises
   - Activation drills
   - Movement preparation

2. MAIN WORKOUT:
   - Exercise name
   - Sets x Reps x Load/Intensity
   - Rest periods
   - Technical cues
   - Execution notes

3. COOL-DOWN (10-15 minutes):
   - Static stretching
   - Recovery activities

4. TECHNICAL POINTS:
   - Key biomechanical focuses
   - Common errors to avoid

5. NUTRITION:
   - Pre-workout recommendations
   - Post-workout recovery nutrition

Format as a complete, ready-to-execute workout session.
```

### F. Nutrition Plan Prompt

```
Create a comprehensive nutrition plan for this track and field athlete:

Profile:
- Event: {primary_event}
- Weight: {weight} kg
- Training Frequency: {training_frequency_per_week} sessions/week
- Body Fat: {body_fat}%
- Goals: {goals}

Provide:

1. DAILY CALORIC NEEDS:
   - Maintenance calories
   - Training day calories
   - Rest day calories

2. MACRONUTRIENT BREAKDOWN:
   - Protein (g/kg bodyweight)
   - Carbohydrates (g/kg bodyweight)
   - Fats (g/kg bodyweight)

3. MEAL TIMING:
   - Pre-training nutrition (timing and composition)
   - During training (if applicable)
   - Post-training recovery nutrition
   - Daily meal frequency

4. SAMPLE DAILY MEAL PLAN:
   - Breakfast
   - Mid-morning snack
   - Lunch
   - Afternoon snack
   - Dinner
   - Evening snack (if needed)

5. HYDRATION GUIDELINES:
   - Daily water intake
   - During training hydration
   - Electrolyte recommendations

6. SUPPLEMENTATION:
   - Recommended supplements
   - Timing and dosage
   - Safety considerations

7. EVENT-SPECIFIC NUTRITION:
   - Competition day nutrition strategy
   - Pre-competition meals
   - Recovery nutrition

Provide specific, practical, and actionable advice.
```

### G. Biomechanical Advice Prompt

```
Provide detailed biomechanical analysis and advice for this athlete:

Event: {primary_event}
Physical Attributes:
- Height: {height} cm
- Weight: {weight} kg
- Dominant Side: {dominant_side}

Performance Data:
- Vertical Jump: {vertical_jump_cm} cm
- Sprint times: 10m={sprint_10m_time}s, 30m={sprint_30m_time}s

Provide:

1. EVENT-SPECIFIC BIOMECHANICS:
   - Key movement patterns
   - Critical phases of movement
   - Optimal technique points

2. FORCE PRODUCTION:
   - Ground contact strategies
   - Power generation points
   - Rate of force development

3. MOVEMENT EFFICIENCY:
   - Stride mechanics (if applicable)
   - Body positioning
   - Energy transfer points

4. TECHNICAL DRILLS:
   - 5-7 specific drills for technique improvement
   - Execution instructions
   - Common errors to correct

5. MOBILITY & FLEXIBILITY:
   - Key areas requiring mobility
   - Flexibility requirements
   - Specific exercises

6. INJURY PREVENTION:
   - Biomechanical risk factors
   - Strengthening priorities
   - Movement screening recommendations

Provide specific, technical, and actionable biomechanical guidance.
```

### H. Technical Advice Prompt

```
Provide comprehensive technical coaching advice for this athlete:

Primary Event: {primary_event}
Secondary Events: {secondary_events}
Training Age: {training_age} years
Current Level: {current_performance}
Target: {target_performance}

Provide:

1. EVENT TECHNIQUE BREAKDOWN:
   - Phase-by-phase technique analysis
   - Key technical checkpoints
   - Optimal execution points

2. TECHNICAL PROGRESSION:
   - Beginner technical focuses
   - Intermediate refinements
   - Advanced optimizations

3. COMMON TECHNICAL ERRORS:
   - Most frequent mistakes
   - How to identify them
   - Correction strategies

4. VIDEO ANALYSIS POINTS:
   - What to look for when reviewing technique
   - Key angles and views
   - Measurement points

5. TECHNICAL DRILLS PROGRESSION:
   - Foundation drills (weeks 1-4)
   - Development drills (weeks 5-12)
   - Refinement drills (competition phase)

6. COMPETITION STRATEGY:
   - Race/competition execution plan
   - Pacing strategies
   - Mental preparation techniques

7. EQUIPMENT CONSIDERATIONS:
   - Optimal equipment for this event
   - Equipment adjustments
   - Maintenance recommendations

Provide detailed, event-specific technical coaching guidance.
```

---

## 3. TypeScript/React Training Plan Generator

**Location:** `training program/packages/api/src/services/training-plan-generator.service.ts`  
**Model:** `gemini-pro`  
**Purpose:** Web application training plan generation with structured JSON output

### Full Prompt

```
You are an elite athletics coach specializing in sprint and track & field training. Generate a comprehensive, periodized training plan for the following athlete:

**Athlete Profile:**
- Name: {firstName} {lastName}
- Event: {primaryEvent}
- Gender: {gender}
- Age: {age} years
- Training Age: {trainingAge} years
- Height: {height} cm, Weight: {weight} kg
- Category: {category}
- Personal Best: {personalBest}
- Target Performance: {targetPB}
- Competition Date: {competitionDate}

**Requirements:**
1. Create a periodized plan with 4 phases: GPP (General Preparation), SPP (Specific Preparation), Pre-Competition, and Taper
2. Plan should be 20-24 weeks total
3. Include weekly structure for each phase (Monday to Sunday)
4. Specify volume, intensity, and key workouts for each phase
5. Consider injury prevention and recovery
6. Include strength training, plyometrics, speed work, and technical drills

Please provide the training plan in JSON format with the following structure:
{
  "totalWeeks": number,
  "phases": [
    {
      "name": "Phase Name",
      "durationWeeks": number,
      "focus": ["focus area 1", "focus area 2"],
      "volume": "HIGH/MODERATE/LOW",
      "intensity": "Description",
      "objectives": ["objective 1", "objective 2"],
      "keyWorkouts": ["workout 1", "workout 2"],
      "weeklyStructure": {
        "monday": {
          "type": "Session Type",
          "intensity": "HIGH/MODERATE/LOW",
          "duration": "duration",
          "details": ["detail1", "detail2"]
        },
        "tuesday": {...},
        "wednesday": {...},
        "thursday": {...},
        "friday": {...},
        "saturday": {...},
        "sunday": {...}
      }
    }
  ]
}
```

### Expected JSON Response Structure

```json
{
  "totalWeeks": 24,
  "phases": [
    {
      "name": "General Preparation Phase (GPP)",
      "durationWeeks": 8,
      "focus": ["Base fitness", "General strength", "Technical foundation"],
      "volume": "HIGH",
      "intensity": "MODERATE",
      "objectives": [
        "Build aerobic base",
        "Develop general strength",
        "Establish technical foundation"
      ],
      "keyWorkouts": [
        "Long runs (60-70% intensity)",
        "General strength training (3x/week)",
        "Technical drills"
      ],
      "weeklyStructure": {
        "monday": {
          "type": "Strength Training",
          "intensity": "MODERATE",
          "duration": "90 minutes",
          "details": [
            "Squats 4x8",
            "Romanian Deadlifts 3x10",
            "Core work"
          ]
        },
        "tuesday": {
          "type": "Speed Endurance",
          "intensity": "MODERATE",
          "duration": "60 minutes",
          "details": [
            "Warm-up 15min",
            "6x200m @ 70% intensity",
            "Recovery 3min between reps"
          ]
        }
        // ... rest of the week
      }
    }
    // ... other phases
  ]
}
```

---

## Comparison of Prompts

| Feature | 13-Step Framework | Modular Planner | TypeScript Generator |
|---------|------------------|-----------------|---------------------|
| **Complexity** | Very High | Modular/Medium | Low-Medium |
| **Output Format** | Structured Text | Text/JSON Mix | JSON Only |
| **Competition Focus** | ✅ Primary | ⚠️ Secondary | ⚠️ Optional |
| **Test Analysis** | ✅ Comprehensive | ✅ Yes | ❌ No |
| **PB Prediction** | ✅ Yes | ❌ No | ❌ No |
| **Daily Workouts** | ✅ Calculated Times | ✅ Detailed | ⚠️ Basic |
| **Nutrition** | ✅ Phase-specific | ✅ Complete Plan | ❌ No |
| **Injury Management** | ✅ Detailed Protocols | ⚠️ Basic | ⚠️ Mentioned |
| **Mental Prep** | ✅ Comprehensive | ❌ No | ❌ No |
| **Taper Strategy** | ✅ 10-14 day protocol | ⚠️ Basic | ⚠️ Phase Only |
| **Bilingual Support** | ✅ Marathi/Hindi | ❌ No | ❌ No |
| **Best For** | Competition prep | General training | Web app integration |

---

## Usage Recommendations

### Use **13-Step Comprehensive Framework** when:
- Preparing for specific competition
- Working with advanced/elite athletes
- Need detailed test analysis and PB prediction
- Require calculated target times and loads
- Need complete periodization with taper strategy

### Use **Modular Planner** when:
- Need specific components (nutrition only, technical only, etc.)
- Building flexible training programs
- Want to mix and match different plan elements
- Need detailed biomechanical or technical advice separately

### Use **TypeScript Generator** when:
- Integrating with web application
- Need JSON-formatted output
- Building user-facing training plan features
- Require consistent structured data format

---

## Model Selection Guide

- **gemini-2.0-flash-exp**: Best for complex, detailed prompts (13-step framework)
- **gemini-2.5-flash**: Good balance of quality and speed (modular planner)
- **gemini-pro**: Reliable for structured JSON output (web integration)

---

## Prompt Engineering Tips

1. **Be Specific**: Always provide actual athlete data, not placeholders
2. **Calculate Targets**: Include formulas for calculating target times/loads
3. **Context Matters**: More athlete data = better recommendations
4. **Structure Output**: Request specific formats (JSON, tables, sections)
5. **Bilingual Terms**: Use sport-specific terminology in native language where helpful
6. **Competition-Driven**: Always work backward from competition date for optimal periodization
7. **Test-Based**: Base all recommendations on actual test results, not generic advice

---

## Future Improvements

Consider adding:
- Weather and environmental factors
- Recovery metrics (HRV, sleep quality)
- Blood test results interpretation
- Video analysis integration
- Real-time plan adjustments based on daily feedback
- Multi-competition periodization (season-long planning)
- Transfer of training effects between different training qualities

---

*Document created: 2026-01-11*  
*Last updated: 2026-01-11*
