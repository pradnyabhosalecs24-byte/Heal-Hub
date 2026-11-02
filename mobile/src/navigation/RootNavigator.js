import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { Splash } from '../components/StateViews';
import AuthStack from './AuthStack';
import PatientTabs from './PatientTabs';
import DoctorStack from './DoctorStack';
import VerifyEmailScreen from '../screens/auth/VerifyEmailScreen';
import NoticeScreen from '../screens/common/NoticeScreen';

const Stack = createNativeStackNavigator();

// Role-based routing. Every protected area is unreachable until the user is signed in,
// has verified their email and has a profile with a known role.
export default function RootNavigator() {
  const { initializing, registering, user, isAdmin, account, role, emailVerified } = useAuth();

  if (initializing || registering) return <Splash message={registering ? 'Creating your account…' : 'Loading…'} />;

  let screen;
  if (!user) screen = <Stack.Screen name="Auth" component={AuthStack} />;
  else if (isAdmin) screen = <Stack.Screen name="Admin" component={NoticeScreen} initialParams={{ kind: 'admin' }} />;
  else if (!emailVerified) screen = <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />;
  else if (account === undefined) return <Splash message="Loading your profile…" />;
  else if (!account) screen = <Stack.Screen name="Incomplete" component={NoticeScreen} initialParams={{ kind: 'incomplete' }} />;
  else if (role === 'doctor') screen = <Stack.Screen name="Doctor" component={DoctorStack} />;
  else screen = <Stack.Screen name="Patient" component={PatientTabs} />;

  return <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>{screen}</Stack.Navigator>;
}
