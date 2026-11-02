# HEALHUB – Setup, Run, Test and Build (Windows)

> ⚠️ **Build outside OneDrive.** `node_modules` and Gradle create many thousands of files, which makes OneDrive sync slow and can lock files mid-build. Keep the source here if you like, but build from a plain folder:
> ```powershell
> mkdir C:\dev ; robocopy "$env:USERPROFILE\OneDrive\Desktop\Heal-Hub" C:\dev\Heal-Hub /E /XD node_modules build .gradle
> cd C:\dev\Heal-Hub
> ```
> A better long-term option is to push to GitHub and `git clone` into `C:\dev`.

## 1. Install the tools (one time)

| Tool | Version | Install | Verify (new PowerShell window) |
|---|---|---|---|
| Node.js | 20 LTS or 22 LTS | https://nodejs.org (LTS .msi) | `node -v` and `npm -v` |
| Git | latest | https://git-scm.com/download/win | `git --version` |
| JDK | **17** | `winget install Microsoft.OpenJDK.17` | `java -version` shows 17 |
| Android Studio | latest stable | https://developer.android.com/studio | opens normally |

**Android Studio → More Actions → SDK Manager:**
- *SDK Platforms:* **Android 15 (API 35)**
- *SDK Tools:* **Android SDK Build-Tools 35**, **NDK (Side by side) 27.1.12297006** (tick "Show Package Details"), **Android SDK Command-line Tools**, **Android Emulator**, **Android SDK Platform-Tools**

**Environment variables** (Start → "Edit environment variables for your account"):
- `ANDROID_HOME` = `C:\Users\<you>\AppData\Local\Android\Sdk`
- `JAVA_HOME` = the JDK 17 folder, e.g. `C:\Program Files\Microsoft\jdk-17.x.x`
- Add to **Path**: `%ANDROID_HOME%\platform-tools` and `%ANDROID_HOME%\emulator`

Verify: `adb --version`, `echo $env:ANDROID_HOME`

**Emulator:** Android Studio → Device Manager → Create device → Pixel 7 → API 35 image → Finish → ▶ start it.
**Phone instead:** Settings → About phone → tap *Build number* 7× → Developer options → enable **USB debugging** → connect USB → `adb devices` lists it.

## 2. Create the Firebase project (one time)

1. https://console.firebase.google.com → **Add project** → name `healhub` (Analytics optional).
2. **Build → Authentication → Get started → Sign-in method → Email/Password → Enable.**
3. **Build → Firestore Database → Create database → Production mode → location `asia-south1 (Mumbai)`.**
4. **Build → Storage → Get started** (same region). This may ask you to upgrade to the Blaze plan. Storage is first used in Stage 2, so you can skip it for now.
5. **Project settings (⚙) → Your apps → Android icon** → package name **`com.healhub.app`** → Register → **download `google-services.json`** → put it at `mobile/android/app/google-services.json`. *(It is git-ignored. Without it the Android build fails at `processDebugGoogleServices`.)*

### Deploy the security rules
```powershell
npm install -g firebase-tools
firebase login
cd firebase
firebase use --add            # pick your healhub project
firebase deploy --only firestore:rules,firestore:indexes   # add ,storage once Storage is enabled
```

## 3. Run the backend locally

1. Firebase console → ⚙ Project settings → **Service accounts → Generate new private key** → save as `backend\serviceAccount.json` (git-ignored, never share it).
2. Encode it to one line and copy it:
   ```powershell
   cd backend
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("serviceAccount.json")) | Set-Clipboard
   copy .env.example .env
   ```
   Open `.env` and paste the clipboard after `FIREBASE_SERVICE_ACCOUNT_BASE64=`. Set `FIREBASE_STORAGE_BUCKET` (shown on the Storage page).
3. ```powershell
   npm install
   npm run dev
   ```
4. Check http://localhost:4000/health → `{"status":"ok", "firestore":"ok", …}`

## 4. Run the Android app

```powershell
cd mobile
npm install
adb reverse tcp:4000 tcp:4000     # lets the app reach the local API as localhost
npx react-native start            # terminal 1: Metro bundler (keep open)
npx react-native run-android      # terminal 2: builds and installs the app
```
The first build takes 5–15 minutes because Gradle downloads its dependencies. Later builds are much faster.

## 5. Make an administrator

Register normally in the app (as a patient), verify the email, then:
```powershell
cd backend
npm run set-admin -- admin@youremail.com
```
Sign out and back in. The app now shows the admin notice, and the API's `/api/admin/*` routes accept this account.
Approve a doctor (until the web portal arrives in Stage 2) with any REST client (Thunder Client in VS Code, or Postman), using the admin's ID token:
`POST http://localhost:4000/api/admin/doctors/<doctorUid>/verification` with body `{"status":"verified"}`
*(Or, in the Firebase console → Firestore → doctors → the doctor's document, set `verificationStatus` = `verified` and `verified` = `true`.)*

## 6. Stage 1 test checklist

| # | Test | Expected |
|---|---|---|
| 1 | Open app | Ivory splash with the HEALHUB shield, then the Welcome screen |
| 2 | Register a patient with bad inputs (wrong DOB, short password, mismatched confirm) | Field-level errors, nothing created |
| 3 | Register a patient correctly | "Creating your account…", then Verify email screen. Firestore has `users/{uid}`, `patients/{uid}` and one `emergency_contacts` doc |
| 4 | Tap "I've verified" before clicking the e-mail link | "Not verified yet" |
| 5 | Click the link in the e-mail, tap again | Patient Home: greeting, date, Patient ID `HHP-…`, blood group, empty states |
| 6 | Tap the **SOS** button, then Call 112 | Dialer opens with 112 (works in airplane mode too) |
| 7 | Doctor login with the patient's email | "This email is registered as a patient…" and stays signed out |
| 8 | Register a doctor and verify the e-mail | Doctor dashboard shows **Verification pending** |
| 9 | Admin approves the doctor (section 5) | Doctor dashboard switches **live** to *Verified doctor* |
| 10 | Forgot password | Reset e-mail arrives and the new password works |
| 11 | Turn on airplane mode and reopen the app | Offline banner. Home and Profile still show cached data |
| 12 | Profile → Sign out | Back to Welcome. Reopening the app stays signed out |

## 7. Build an installable APK

1. Create your release key (one time; **keep the file and passwords safe**: you need them for every update):
   ```powershell
   cd mobile\android\app
   keytool -genkeypair -v -storetype PKCS12 -keystore healhub-release.keystore -alias healhub -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Create `mobile\android\keystore.properties` (git-ignored):
   ```
   HEALHUB_STORE_FILE=healhub-release.keystore
   HEALHUB_STORE_PASSWORD=your-password
   HEALHUB_KEY_ALIAS=healhub
   HEALHUB_KEY_PASSWORD=your-password
   ```
3. Build:
   ```powershell
   cd mobile\android
   .\gradlew.bat assembleRelease
   ```
   APK: `mobile\android\app\build\outputs\apk\release\app-release.apk` → copy it to a phone → allow "Install unknown apps" → install.
   *(Without `keystore.properties`, the release is signed with the debug key. That's fine for testing but not for publishing.)*

> Release builds talk to `https://healhub-api.onrender.com` (`mobile/src/config/env.js`). Deploy the API first (section 8), or debug-build only.

## 8. Deploy the backend to Render

1. Push the repo to GitHub.
2. https://dashboard.render.com → **New → Blueprint** → select the repo → Render reads `render.yaml`.
3. Fill the secret env vars: `FIREBASE_SERVICE_ACCOUNT_BASE64` (same value as in `.env`), `FIREBASE_STORAGE_BUCKET`, and `CORS_ORIGINS` (your Vercel URL, from Stage 2).
4. Deploy → open `https://<service>.onrender.com/health` and check that it returns `ok`.
5. If the URL differs from `healhub-api.onrender.com`, update `API_URL` in `mobile/src/config/env.js` and rebuild the APK.

*Free Render instances sleep after ~15 min idle, so the first request then takes ~30–60 s. The app's API calls allow for this.*

## 9. Troubleshooting

| Problem | Fix |
|---|---|
| `File google-services.json is missing` | Step 2.5: put it in `mobile/android/app/` |
| `SDK location not found` | Set `ANDROID_HOME`, or create `mobile/android/local.properties` with `sdk.dir=C:\\Users\\<you>\\AppData\\Local\\Android\\Sdk` |
| `Unsupported class file major version` / Java errors | `java -version` must be 17, and `JAVA_HOME` must point to JDK 17 |
| `NDK … did not have a source.properties` | Install NDK 27.1.12297006 in SDK Manager |
| Filename too long / random file-lock errors | Build outside OneDrive (top of this file) |
| App shows red "Unable to load script" | Metro isn't running: `npx react-native start`, then press **r** |
| Build cache weirdness | `cd mobile\android ; .\gradlew.bat clean`, then run again |
| Login says "No internet connection" on emulator | Emulator → Settings → check Wi-Fi, or cold-boot the emulator |
