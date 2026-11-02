import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';

// On Android, Firestore keeps an on-device cache by default: reads work offline and
// writes are queued and synced automatically when the network returns.
export const app = getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export const ROLES = { PATIENT: 'patient', DOCTOR: 'doctor' };
