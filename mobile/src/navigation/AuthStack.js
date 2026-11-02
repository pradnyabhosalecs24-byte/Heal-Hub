import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import PatientRegisterScreen from '../screens/auth/PatientRegisterScreen';
import DoctorRegisterScreen from '../screens/auth/DoctorRegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.ivory },
        headerTintColor: colors.forest,
        headerTitleStyle: { fontWeight: '700' },
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: '' }} />
      <Stack.Screen name="PatientRegister" component={PatientRegisterScreen} options={{ title: 'Patient registration' }} />
      <Stack.Screen name="DoctorRegister" component={DoctorRegisterScreen} options={{ title: 'Doctor registration' }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Reset password' }} />
    </Stack.Navigator>
  );
}
