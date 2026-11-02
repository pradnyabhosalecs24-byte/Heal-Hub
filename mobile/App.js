import React from 'react';
import { StatusBar } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { paperTheme, navTheme } from './src/theme/theme';
import { colors } from './src/theme/colors';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import OfflineBanner from './src/components/OfflineBanner';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider
        theme={paperTheme}
        settings={{ icon: props => <MaterialCommunityIcons {...props} /> }}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.ivory} />
        <AuthProvider>
          <NavigationContainer theme={navTheme}>
            <RootNavigator />
          </NavigationContainer>
          <OfflineBanner />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
