import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from '@react-native-firebase/auth';
import { doc, getDoc, collection, writeBatch, serverTimestamp } from '@react-native-firebase/firestore';
import { auth, db, ROLES } from './firebase';
import { appError } from './authErrors';
import { patientIdFromUid } from '../utils/format';
import { normalizePhone } from '../utils/validators';

async function createAccount(email, password, fullName) {
  const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await updateProfile(user, { displayName: fullName.trim() });
  return user;
}

// If writing the profile fails, remove the half-created login so the user can retry cleanly.
async function commitOrRollback(user, batch) {
  try {
    await batch.commit();
    await sendEmailVerification(user);
  } catch (e) {
    await user.delete().catch(() => {});
    throw e;
  }
}

export async function registerPatient(f) {
  const user = await createAccount(f.email, f.password, f.fullName);
  const uid = user.uid;
  const batch = writeBatch(db);
  const now = serverTimestamp();
  batch.set(doc(db, 'users', uid), {
    uid, role: ROLES.PATIENT, email: f.email.trim().toLowerCase(),
    fullName: f.fullName.trim(), phone: normalizePhone(f.phone), photoURL: null, createdAt: now,
  });
  batch.set(doc(db, 'patients', uid), {
    uid, patientId: patientIdFromUid(uid), fullName: f.fullName.trim(),
    dob: f.dob.trim(), gender: f.gender, bloodGroup: f.bloodGroup || null,
    address: f.address.trim(), createdAt: now, updatedAt: now,
  });
  batch.set(doc(collection(db, 'emergency_contacts')), {
    ownerId: uid, name: f.ecName.trim(), phone: normalizePhone(f.ecPhone),
    relation: f.ecRelation.trim(), isPrimary: true, createdAt: now,
  });
  await commitOrRollback(user, batch);
}

export async function registerDoctor(f) {
  const user = await createAccount(f.email, f.password, f.fullName);
  const uid = user.uid;
  const batch = writeBatch(db);
  const now = serverTimestamp();
  batch.set(doc(db, 'users', uid), {
    uid, role: ROLES.DOCTOR, email: f.email.trim().toLowerCase(),
    fullName: f.fullName.trim(), phone: normalizePhone(f.phone), photoURL: null, createdAt: now,
  });
  batch.set(doc(db, 'doctors', uid), {
    uid, fullName: f.fullName.trim(), specialization: f.specialization,
    qualifications: f.qualifications.trim(), experienceYears: Number(f.experienceYears),
    hospital: f.hospital.trim(), registrationNumber: f.registrationNumber.trim(),
    consultationFee: Number(f.consultationFee || 0), consultationTypes: f.consultationTypes,
    photoURL: null, verificationStatus: 'pending', verified: false,
    ratingAvg: 0, ratingCount: 0, createdAt: now, updatedAt: now,
  });
  await commitOrRollback(user, batch);
}

// Separate patient/doctor login: refuses to sign in with the wrong role.
export async function login(email, password, expectedRole) {
  const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
  const token = await user.getIdTokenResult();
  if (token.claims.admin) return;
  const snap = await getDoc(doc(db, 'users', user.uid));
  const role = snap.exists() ? snap.data().role : null;
  if (role && role !== expectedRole) {
    await signOut(auth);
    throw appError(`This email is registered as a ${role}. Please use the ${role} login.`);
  }
}

export const resetPassword = email => sendPasswordResetEmail(auth, email.trim());
export const resendVerification = () => sendEmailVerification(auth.currentUser);
export const logout = () => signOut(auth);
