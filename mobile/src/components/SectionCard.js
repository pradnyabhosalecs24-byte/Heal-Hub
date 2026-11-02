import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, radius, spacing } from '../theme/colors';

export default function SectionCard({ title, right, children, tone = 'white', style }) {
  return (
    <View style={[styles.card, tone === 'beige' && styles.beige, style]}>
      {(title || right) && (
        <View style={styles.head}>
          {title ? <Text style={styles.title}>{title}</Text> : <View />}
          {right}
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.md,
    marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  beige: { backgroundColor: colors.beige, borderColor: colors.beige },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  title: { fontSize: 16, fontWeight: '700', color: colors.charcoal },
});
