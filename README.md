# ⚡ PulsOps — Production-Grade Gym Management SaaS ERP

A high-performance, multi-tenant SaaS ERP system for Gym and Fitness Club management, featuring a unified backend API, responsive web application, and cross-platform mobile application.

---

## 🎨 Design System & Aesthetics
- **Backgrounds**: Pitch Black (`#0A0A0A` / `#121212`)
- **Containers & Cards**: Slate Dark Grey (`#181818` / `#1E1E1E` with `#282828` borders)
- **Primary Accents**: Neon & Phosphorus Green/Lime (`#00FF66` / `#39FF14`)
- **Typography**: Apple System / Inter / Modern Monospace
- **Navigation**:
  - **Web**: Collapsible Hamburger Menu (3 lines) triggering a categorized sliding off-canvas drawer.
  - **Mobile**: Sleek Bottom Navigation bar with high-contrast active icons.

---

## 🏗️ Architecture & Monorepo Structure

```
pulsops/
├── backend/                    # Node.js + Express + Prisma ORM + PostgreSQL
│   ├── prisma/
│   │   ├── schema.prisma       # Full multi-tenant relational schema
│   │   └── seed.ts             # Seeds plans, super admin, gym admin, trainer, member
│   ├── src/
│   │   ├── config/             # DB, Cloudinary, Firebase FCM, Web-Push
│   │   ├── middleware/         # Auth, Tenant isolation, RBAC
│   │   ├── modules/            # Auth, Tenants, Users, InBody, Workouts, Nutrition, Store, Attendance, AI
│   │   └── server.ts           # Express server entry point
│   ├── Dockerfile
│   └── package.json
│
├── web/                        # Next.js 16 (App Router) + Tailwind CSS + Recharts
│   ├── app/
│   │   ├── globals.css         # Pitch Black & Neon Green theme
│   │   ├── layout.tsx
│   │   └── page.tsx            # Main application integrating the 4 role dashboards
│   ├── components/
│   │   ├── Navigation.tsx      # Hamburger top-bar & sliding off-canvas drawer
│   │   └── dashboards/
│   │       ├── SuperAdminDashboard.tsx  # Provisioning, MRR/ARR, tenant licensing
│   │       ├── GymAdminDashboard.tsx    # Members, InBody, POS Store, Turnstile QR, Broadcast
│   │       ├── TrainerDashboard.tsx     # Workout prescription builder, trainee diet macros
│   │       └── MemberDashboard.tsx      # Digital Turnstile QR pass, InBody chart, Gemini AI
│   └── lib/api.ts
│
├── mobile/                     # Flutter Cross-Platform Application (iOS & Android)
│   ├── lib/
│   │   ├── core/               # Colors, theme, Dio API client
│   │   ├── screens/
│   │   │   ├── main_navigation_screen.dart # Sleek bottom navigation
│   │   │   ├── pass_screen.dart            # Glowing Turnstile QR pass
│   │   │   ├── inbody_screen.dart          # Biometric chart (FL Chart)
│   │   │   ├── workouts_screen.dart        # Exercise routine checklist
│   │   │   ├── store_screen.dart           # Supplements POS purchase
│   │   │   └── ai_coach_screen.dart        # Gemini AI fitness chatbot
│   │   └── main.dart
│   └── pubspec.yaml
│
└── docker-compose.yml          # PostgreSQL + Backend container orchestration
```

---

## 🚀 Getting Started

### 1. Database & Backend API
```bash
# Option A: Run via Docker Compose
docker-compose up -d

# Option B: Run locally
cd backend
npm install
npx prisma generate
npm run dev
```

### 2. Responsive Web Application
```bash
cd web
npm install
npm run dev
# Open http://localhost:3000 in your browser
```

### 3. Mobile App (Flutter)
```bash
cd mobile
flutter pub get
flutter run
```

---

## 👥 Demo Roles & System Credentials

| Role | Username / Email | Password | Access Capabilities |
|---|---|---|---|
| **Super Admin** | `superadmin@pulsops.com` | `SuperAdmin@2026!` | SaaS global governance, tenant provision, MRR analytics |
| **Gym Admin** | `admin@titanfitness.com` | `GymAdmin@2026!` | Members, InBody, QR turnstile, Store POS, Push broadcast |
| **Trainer** | `coach.alex@titanfitness.com` | `Trainer@2026!` | Workout prescription builder, trainee diet macros, commissions |
| **Member** | `tariq@titanfitness.com` | `Member@2026!` | Digital turnstile QR pass, InBody progress, Gemini AI Coach |
