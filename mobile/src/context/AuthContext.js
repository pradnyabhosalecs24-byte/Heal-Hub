import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { onAuthStateChanged } from '@react-native-firebase/auth';
import { doc, onSnapshot } from '@react-native-firebase/firestore';
import { auth, db } from '../services/firebase';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [account, setAccount] = useState(undefined); // users/{uid}: undefined=loading, null=missing
  const [roleProfile, setRoleProfile] = useState(null); // patients/{uid} or doctors/{uid}
  const [registering, setRegistering] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, async u => {
        setUser(u);
        setEmailVerified(Boolean(u?.emailVerified));
        setIsAdmin(u ? Boolean((await u.getIdTokenResult().catch(() => null))?.claims?.admin) : false);
        if (!u) {
          setAccount(undefined);
          setRoleProfile(null);
        }
        setInitializing(false);
      }),
    [],
  );

  // Live account document (served from the offline cache when there is no network).
  useEffect(() => {
    if (!user) return undefined;
    return onSnapshot(
      doc(db, 'users', user.uid),
      snap => setAccount(snap.exists() ? snap.data() : null),
      () => setAccount(null),
    );
  }, [user]);

  const role = account?.role;
  useEffect(() => {
    if (!user || !role) return undefined;
    const col = role === 'doctor' ? 'doctors' : 'patients';
    return onSnapshot(
      doc(db, col, user.uid),
      snap => setRoleProfile(snap.exists() ? snap.data() : null),
      () => setRoleProfile(null),
    );
  }, [user, role]);

  const wrapRegister = fn => async form => {
    setRegistering(true);
    try {
      await fn(form);
    } finally {
      setRegistering(false);
    }
  };

  const refreshUser = useCallback(async () => {
    await auth.currentUser?.reload();
    const ok = Boolean(auth.currentUser?.emailVerified);
    setEmailVerified(ok);
    return ok;
  }, []);

  const value = useMemo(
    () => ({
      initializing, registering, user, isAdmin, account, role, roleProfile,
      emailVerified,
      login: authService.login,
      registerPatient: wrapRegister(authService.registerPatient),
      registerDoctor: wrapRegister(authService.registerDoctor),
      resetPassword: authService.resetPassword,
      resendVerification: authService.resendVerification,
      logout: authService.logout,
      refreshUser,
    }),
    [initializing, registering, user, isAdmin, account, role, roleProfile, emailVerified, refreshUser],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
