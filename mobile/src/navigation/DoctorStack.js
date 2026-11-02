import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DoctorHomeScreen from '../screens/doctor/DoctorHomeScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function DoctorStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShadowVisible: false, headerStyle: { backgroundColor: colors.ivory }, headerTintColor: colors.forest }}>
      <Stack.Screen name="DoctorHome" component={DoctorHomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DoctorProfile" component={ProfileScreen} options={{ title: 'Profile & settings' }} />
    </Stack.Navigator>
  );
}
