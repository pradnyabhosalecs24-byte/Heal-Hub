import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import { colors } from '../theme/colors';

// Tells the user they are offline. Data still loads from the on-device cache
// and changes sync automatically when the connection returns.
export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  const insets = useSafeAreaInsets();
  useEffect(
    () =>
      NetInfo.addEventListener(s =>
        setOffline(s.isConnected === false || s.isInternetReachable === false),
      ),
    [],
  );
  if (!offline) return null;
  return (
    <View pointerEvents="none" style={[styles.bar, { top: insets.top }]}>
      <Text style={styles.text}>
        You're offline · saved data still works and will sync when you reconnect
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute', left: 0, right: 0, backgroundColor: colors.charcoal,
    paddingVertical: 6, paddingHorizontal: 12,
  },
  text: { color: colors.white, fontSize: 12, textAlign: 'center' },
});
