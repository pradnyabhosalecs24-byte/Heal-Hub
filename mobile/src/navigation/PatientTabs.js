import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PatientHomeScreen from '../screens/patient/PatientHomeScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import UpcomingStageScreen from '../screens/common/UpcomingStageScreen';
import EmergencyCallButton from '../components/EmergencyCallButton';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const ICONS = { Home: 'home-heart', Doctors: 'stethoscope', Health: 'heart-pulse', Assistant: 'robot-happy-outline', Profile: 'account-circle' };
const TAB_HEIGHT = 62;

export default function PatientTabs() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.fill}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.forest,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: { height: TAB_HEIGHT + insets.bottom, paddingBottom: insets.bottom + 6, paddingTop: 6, backgroundColor: colors.white, borderTopColor: colors.border },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name={ICONS[route.name]} color={color} size={size} />,
        })}>
        <Tab.Screen name="Home" component={PatientHomeScreen} />
        <Tab.Screen name="Doctors" component={UpcomingStageScreen} initialParams={{ feature: 'doctors' }} />
        <Tab.Screen name="Health" component={UpcomingStageScreen} initialParams={{ feature: 'health' }} />
        <Tab.Screen name="Assistant" component={UpcomingStageScreen} initialParams={{ feature: 'assistant' }} options={{ title: 'AI Assistant' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
      {/* SOS stays reachable on every patient tab */}
      <View pointerEvents="box-none" style={[StyleSheet.absoluteFill, { bottom: TAB_HEIGHT + insets.bottom }]}>
        <EmergencyCallButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
