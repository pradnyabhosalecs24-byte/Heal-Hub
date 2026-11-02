# HEALHUB

**Your Health. Your Care. All in One Place.**

A smart healthcare, hospital management and personal wellness platform for patients, doctors and administrators.

| Part | Folder | Tech | Hosted on |
|---|---|---|---|
| Android app | `mobile/` | React Native CLI 0.79 (JavaScript, no Expo), React Navigation, React Native Paper | APK on device / emulator |
| REST API | `backend/` | Node.js 20, Express, Firebase Admin SDK | Render |
| Website + admin portal | `web/` *(Stage 2 and Stage 10)* | Static/React web | Vercel |
| Data & auth | `firebase/` | Firebase Auth, Cloud Firestore, Storage, FCM (security rules) | Firebase |

- **Architecture and staged plan:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Install, configure and run (Windows):** [docs/SETUP.md](docs/SETUP.md)

## Works everywhere, every time
- **Offline-first:** Firestore keeps an on-device cache, so screens load without internet and changes sync automatically when the connection returns. An offline banner tells the user what's happening.
- **Reminders without internet:** medicine and wellness reminders are scheduled locally on the phone (Stage 5), so they fire with no network.
- **Emergency always works:** the SOS emergency-call shortcut opens the dialer (112) with no internet needed.
- **Any screen:** layouts scroll on small phones and are width-capped on tablets and foldables. Minimum Android 7.0 (API 24).
- **iOS-ready code:** the same JavaScript runs on iOS. Building for iOS needs a Mac with Xcode, so this project targets Android.

## Current status
✅ Stage 1: foundation, branding, authentication and role-based navigation. See the stage table in ARCHITECTURE.md.
