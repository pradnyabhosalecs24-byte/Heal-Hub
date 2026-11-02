# HEALHUB – Architecture

## 1. System overview

```
 ┌────────────────────────────┐        HTTPS + Firebase ID token        ┌───────────────────────────┐
 │  HEALHUB Android app       │ ─────────────────────────────────────▶ │  HEALHUB API (Render)     │
 │  React Native CLI (JS)     │                                         │  Node 20 + Express        │
 │  • Firebase Auth SDK       │ ◀───────── JSON ───────────────────────  │  • verifies ID tokens     │
 │  • Firestore (offline      │                                         │  • role checks (admin…)   │
 │    cache + live sync)      │                                         │  • AI proxy (keys hidden) │
 │  • Local notifications     │                                         │  • SMS/e-mail for SOS     │
 └─────────────┬──────────────┘                                         │  • FCM pushes             │
               │ direct, guarded by security rules                       └─────────────┬─────────────┘
               ▼                                                                       │ Admin SDK
 ┌──────────────────────────────────────────────────────────────────────────────────────▼───────────┐
 │  Firebase: Authentication · Cloud Firestore · Storage · Cloud Messaging                          │
 └──────────────────────────────────────────────────────────────────────────────────────▲───────────┘
                                                                                        │
 ┌────────────────────────────┐            HTTPS                                        │
 │  Website + admin portal    │ ───────────────────────────────▶ API (Render) ───────────┘
 │  (Vercel)                  │
 └────────────────────────────┘
```

**Design rules**
- The app reads and writes its *own* data directly in Firestore (fast, works offline). **Security rules** enforce who may touch what.
- Anything that needs a **secret** or **cross-user authority** goes through the API: AI calls, SOS SMS/e-mail, doctor verification, booking transactions that must not double-book, FCM pushes.
- No secrets in the app: only the public `google-services.json` config. Service-account JSON and AI/SMS keys live in Render environment variables.
- Admins are **not** given access to patient medical data in the rules.

## 2. Folder structure

```
Heal-Hub/
├── README.md
├── render.yaml                 # Render blueprint for the API
├── docs/
│   ├── ARCHITECTURE.md         # this file
│   ├── SETUP.md                # installs, Firebase config, run, test, APK
│   └── assets/                 # logo (svg/png)
├── firebase/
│   ├── firebase.json
│   ├── firestore.rules         # role-based security rules (grows each stage)
│   ├── firestore.indexes.json
│   └── storage.rules
├── backend/                    # Express API → Render
│   ├── package.json  .env.example
│   ├── scripts/setAdmin.js     # grant admin custom claim
│   └── src/
│       ├── server.js  app.js
│       ├── config/firebase.js  # Admin SDK from env (base64 service account)
│       ├── middleware/         # auth.js (token + roles), errors.js
│       └── routes/             # health, me, admin (+ appointments, ai, sos… later)
└── mobile/                     # React Native CLI app (JavaScript)
    ├── App.js  index.js  app.json  package.json
    ├── android/                # native Android project (com.healhub.app)
    ├── ios/                    # kept for future Mac builds
    └── src/
        ├── theme/              # colors.js (brand palette), theme.js
        ├── config/             # env.js (API URL, emergency no.), constants.js
        ├── services/           # firebase.js, authService.js, api.js, authErrors.js
        ├── context/            # AuthContext (session, role, live profile)
        ├── navigation/         # RootNavigator, AuthStack, PatientTabs, DoctorStack
        ├── components/         # Logo, Screen, FormInput, ChipSelect, SectionCard, OfflineBanner, EmergencyCallButton…
        ├── utils/              # validators, format
        └── screens/
            ├── auth/           # Welcome, Login, PatientRegister, DoctorRegister, ForgotPassword, VerifyEmail
            ├── patient/        # PatientHome (+ later stages)
            ├── doctor/         # DoctorHome (+ later stages)
            └── common/         # Profile, Notice, UpcomingStage
```

## 3. Roles and navigation

| Condition | Screen |
|---|---|
| Not signed in | Welcome → Patient or Doctor login / registration |
| Signed in, email not verified | Verify email (resend / re-check / sign out) |
| `admin` custom claim | Admin notice (administration is done on the web portal) |
| role = `patient` | Tabs: Home · Doctors · Health · AI Assistant · Profile, plus a floating **SOS** button |
| role = `doctor` | Doctor dashboard with verification status, Profile and settings |

- Users can only register as `patient` or `doctor` (enforced in the rules). Admin is granted with `npm run set-admin -- email` on the backend.
- Patient login refuses doctor accounts and vice versa.
- Doctors start as `verificationStatus: "pending"` and are hidden from patients until an admin verifies them.

## 4. Firestore data model

| Collection | Doc id | Key fields | Access (summary) |
|---|---|---|---|
| users | uid | role, fullName, email, phone, photoURL | self, admin |
| patients | uid | patientId (HHP-XXXXXXXX), dob, gender, bloodGroup, address | self (+ assigned doctor, Stage 3) |
| doctors | uid | specialization, qualifications, experienceYears, hospital, registrationNumber, consultationFee, consultationTypes, verificationStatus, ratingAvg | public when verified; self; admin can only verify |
| emergency_contacts | auto | ownerId, name, phone, relation, isPrimary | owner |
| departments, hospital | slug | name, description, services | read: all; write: admin |
| doctor_availability | doctorId_date | slots[] {start, end, status} | doctor writes; patients read |
| appointments | auto | patientId, doctorId, date, slot, type, status, fee, paymentStatus | patient + doctor of the appointment |
| consultations, prescriptions | auto | appointmentId, notes, medicines[] | doctor author + patient |
| medical_history | uid | conditions, allergies, surgeries, vaccinations… | patient (+ authorised doctor) |
| medical_reports | auto | ownerId, category, storagePath, reportDate, sharedWith[] | owner + shared doctors |
| medications, medicine_reminders, medicine_adherence | auto | ownerId, dose, times[], status | owner |
| daily_health_records, activity_records, sleep_records, water_intake, meal_records, diet_plans | ownerId_date | values + `source: manual \| device \| estimated` | owner |
| menstrual_cycles, wellness_logs | auto | ownerId, dates, symptoms | owner only (private) |
| emergency_events | auto | ownerId, location, recipients[], deliveryResults[] | owner; written by API |
| notifications | auto | ownerId, category, title, body, read | owner |
| messages | conversationId/messages | senderId, text, readAt | the two participants |
| chatbot_history | auto | ownerId, consented | owner, only with consent |
| health_insights, feedback | auto | ownerId… | owner; admin reads feedback |

Data is not duplicated without need: `users` holds identity, while `patients` and `doctors` hold role-specific fields.

## 5. Staged development plan

| Stage | Scope | Status |
|---|---|---|
| **1. Foundation** | Architecture, monorepo, branding and logo, theme, patient and doctor registration, email verification, forgot password, role-based navigation, offline cache and banner, SOS call shortcut, API skeleton (health, token auth, roles, admin doctor verification), Stage 1 security rules, Render blueprint, launcher icon | ✅ Done |
| 2. Hospital & doctors | Hospital profile, 12 department pages (seed script), verified doctor directory with search and filters, profile editing and photo upload (Storage), admin web portal v1 (doctor verification) on Vercel | Next |
| 3. Appointments | Doctor availability and slots, booking with transaction (no double booking), reschedule and cancel, accept and reject, live dashboards for both, FCM push for appointment events, optional paid or free fee display | |
| 4. Health tracking | Vitals, steps, sleep, water tracker, weight and BMI, manual, device or estimated labels, daily, weekly and monthly charts, Health Connect (optional) | |
| 5. Reminders & notifications | Medicine reminders (offline local notifications, Taken, Skip, Snooze, adherence), notification centre, Friendly, Funny, Motivational and Minimal modes, message templates, category settings | |
| 6. SOS | Emergency contacts, countdown, location, SMS and e-mail via configured gateway (honest delivery status), test mode, event history, emergency medical profile, persistent-notification shortcut | |
| 7. AI assistant | Server-side AI (Gemini, key on Render), safety system prompt, fallback, consented history, report and lab-term explanations, multilingual, voice input | |
| 8. Records, prescriptions, chat | Medical history, report upload, download and sharing, consultation notes, prescription PDF, link to reminders after patient confirmation, real-time doctor and patient chat | |
| 9. Wellness, diet, fitness | Women's wellness (cycle estimates, symptoms, private), diet planner and meal logging, fitness goals | |
| 10. Launch | Vercel website, Render production deploy, release APK, testing doc, screenshots, demo script | |
