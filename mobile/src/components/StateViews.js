import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text, Icon } from 'react-native-paper';
import { colors, spacing } from '../theme/colors';
import { LogoMark } from './Logo';

export function Splash({ message = 'Loading…' }) {
  return (
    <View style={styles.center}>
      <LogoMark size={72} />
      <ActivityIndicator style={{ marginTop: spacing.lg }} color={colors.forest} />
      <Text style={styles.muted}>{message}</Text>
    </View>
  );
}

export function EmptyState({ icon = 'information-outline', title, message }) {
  return (
    <View style={styles.empty}>
      <Icon source={icon} size={32} color={colors.sage} />
      <Text style={styles.emptyTitle}>{title}</Text>
      {message ? <Text style={styles.emptyMsg}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ivory },
  muted: { color: colors.muted, marginTop: spacing.sm },
  empty: { alignItems: 'center', paddingVertical: spacing.md },
  emptyTitle: { fontWeight: '700', color: colors.charcoal, marginTop: spacing.sm },
  emptyMsg: { color: colors.muted, textAlign: 'center', marginTop: 4, lineHeight: 19 },
});
