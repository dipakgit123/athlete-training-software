# 🏃‍♂️ Elite Athletics Performance System

World-Class AI-Driven Athlete Performance Management Platform

## 📋 Overview

A comprehensive system for tracking, analyzing, and optimizing athletic performance with:

- **72 Database Tables** - Complete data model for athletes, training, wellness, and analytics
- **AI Rule Engines** - Blood analysis (47 markers), Load monitoring (ACWR), Biomechanics
- **Auto-Adjustment** - Readiness-based workout modifications
- **Coach Dashboard** - Real-time athlete monitoring and alerts

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- PostgreSQL (Neon recommended)

### Installation

```bash
# 1. Clone and install
cd athlete-performance-system
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# 3. Setup database
npm run db:generate
npm run db:push

# 4. Seed database (optional)
cd packages/database
npx tsx prisma/seed.ts

# 5. Start development
npm run dev
```

### Running Services

```bash
# Start all services (API + Web)
npm run dev

# Or run individually:
cd packages/api && npm run dev    # API on http://localhost:3001
cd packages/web && npm run dev    # Web on http://localhost:3000
```

## 📦 Project Structure

```
athlete-performance-system/
├── packages/
│   ├── database/          # Prisma schema & client
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # 72 tables, 14 enums
│   │   │   └── seed.ts          # Demo data
│   │   └── src/
│   │       └── client.ts        # Prisma client singleton
│   │
│   ├── rules/             # AI Rule Engines
│   │   └── src/
│   │       ├── blood-rules.ts       # 47 blood markers
│   │       ├── load-rules.ts        # ACWR, EWMA
│   │       ├── biomech-rules.ts     # Sprint/Jump analysis
│   │       ├── fatigue-rules.ts     # Neural/Metabolic/Mechanical
│   │       ├── readiness-rules.ts   # Multi-factor scoring
│   │       ├── auto-adjust-rules.ts # Workout modifications
│   │       ├── training-zones.ts    # Sprint/Strength zones
│   │       ├── session-builder.ts   # Complete sessions
│   │       ├── periodization.ts     # Macro/Meso/Micro cycles
│   │       └── daily-execution.ts   # Morning check, Post-session
│   │
│   ├── api/               # Express.js Backend
│   │   └── src/
│   │       ├── routes/          # 86 API endpoints
│   │       ├── controllers/     # 8 controllers
│   │       ├── services/        # Business logic
│   │       └── middleware/      # Auth, Validation
│   │
│   └── web/               # Next.js Frontend
│       └── src/
│           ├── app/             # App router
│           └── components/      # React components
│               ├── ui/          # ReadinessGauge, AlertCard
│               ├── charts/      # LoadChart
│               ├── dashboard/   # CoachDashboard
│               └── forms/       # WellnessForm
```

## 🔌 API Endpoints

| Module | Endpoints | Description |
|--------|-----------|-------------|
| Auth | 9 | Login, Register, Password management |
| Athletes | 9 | CRUD, Goals, Personal Bests |
| Wellness | 7 | Daily check-ins, Readiness |
| Sessions | 11 | Training sessions, Auto-generation |
| Analysis | 12 | Blood, Load, Biomechanics |
| Planning | 14 | Periodization, Competitions |
| Alerts | 10 | Alert management |
| Reports | 14 | Reports & Data export |

**Total: 86 endpoints**

## 🧪 Key Features

### Blood Analysis (47 Markers)
- Athletic reference ranges (different from clinical)
- Categories: CBC, Iron, Metabolic, Hormones, Vitamins
- Auto-generated alerts for critical values

### Load Monitoring
- ACWR (Acute:Chronic Workload Ratio)
- EWMA calculations
- Monotony & Strain tracking
- Injury risk prediction

### Readiness System
- Multi-factor weighted scoring
- HRV, Sleep, Fatigue, Stress
- Auto-adjustment recommendations

### Periodization
- Macrocycle planning
- Taper protocols for competitions
- Deload week automation

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| Database | PostgreSQL (Neon) + Prisma |
| Backend | Node.js + Express.js |
| Frontend | Next.js 14 + React 18 |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Validation | Zod |
| Auth | JWT |

## 📊 Database Models

- **Users & Auth**: User, Session, PasswordReset
- **Athletes**: Athlete, PersonalBest, Goal, Injury
- **Training**: TrainingSession, TrainingLoad, Mesocycle, Macrocycle
- **Wellness**: WellnessCheck, Alert
- **Analysis**: BloodTest, BiomechAnalysis
- **Planning**: Competition, TaperPlan

## 🔐 Default Credentials

```
Coach: coach@athlete-system.com / coach123
Athlete: rahul@athlete-system.com / athlete123
```

## 📝 License

MIT License

---

**Built for Elite Athletics Performance** 🏆
