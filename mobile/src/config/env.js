// Debug builds: run `adb reverse tcp:4000 tcp:4000` so the emulator OR a USB phone can reach
// the API on your PC as localhost. Release builds ALWAYS use the Render URL (never localhost).
// Update the Render URL after deploying (docs/SETUP.md, section 9).
export const API_URL = __DEV__
  ? 'http://localhost:4000'
  : 'https://healhub-api.onrender.com';

export const EMERGENCY_NUMBER = '112';
export const HOSPITAL_NAME = 'HEALHUB Hospital';
