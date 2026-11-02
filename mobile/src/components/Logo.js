import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme/colors';

// HEALHUB mark: protective shield + medical cross + heart.
export function LogoMark({ size = 64 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Path
        d="M32 3 L56 12 V30 C56 45 46 56 32 61 C18 56 8 45 8 30 V12 Z"
        fill={colors.forest}
      />
      <Path d="M27 16 H37 V25 H46 V35 H37 V44 H27 V35 H18 V25 H27 Z" fill={colors.ivory} />
      <Path
        d="M32 39 C29 36.5 25.5 34 25.5 31 C25.5 29 27 27.5 28.8 27.5 C30.2 27.5 31.3 28.3 32 29.4 C32.7 28.3 33.8 27.5 35.2 27.5 C37 27.5 38.5 29 38.5 31 C38.5 34 35 36.5 32 39 Z"
        fill={colors.terracotta}
      />
    </Svg>
  );
}

export default function Logo({ size = 64, showTagline = false, horizontal = false }) {
  return (
    <View style={[styles.wrap, horizontal && styles.row]}>
      <LogoMark size={size} />
      <View style={horizontal ? styles.textRow : styles.textCol}>
        <Text style={[styles.word, { fontSize: size * 0.42 }]}>
          HEAL<Text style={[styles.word, styles.hub, { fontSize: size * 0.42 }]}>HUB</Text>
        </Text>
        {showTagline && (
          <Text style={styles.tag}>Your Health. Your Care. All in One Place.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  row: { flexDirection: 'row' },
  textCol: { alignItems: 'center', marginTop: 10 },
  textRow: { marginLeft: 10 },
  word: { color: colors.forest, fontWeight: '800', letterSpacing: 2 },
  hub: { color: colors.terracotta },
  tag: { color: colors.muted, marginTop: 4, fontSize: 13, letterSpacing: 0.3 },
});
