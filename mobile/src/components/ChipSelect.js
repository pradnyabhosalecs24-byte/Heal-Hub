import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, Text, HelperText } from 'react-native-paper';
import { colors } from '../theme/colors';

// Single or multi select rendered as chips. options: string[] or {value,label}[]
export default function ChipSelect({ label, options, value, onChange, multi = false, error }) {
  const opts = options.map(o => (typeof o === 'string' ? { value: o, label: o } : o));
  const isOn = v => (multi ? (value || []).includes(v) : value === v);
  const toggle = v => {
    if (!multi) return onChange(value === v ? null : v);
    const cur = value || [];
    onChange(cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]);
  };
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        {opts.map(o => (
          <Chip
            key={o.value}
            selected={isOn(o.value)}
            showSelectedCheck={false}
            onPress={() => toggle(o.value)}
            style={[styles.chip, isOn(o.value) && styles.on]}
            textStyle={isOn(o.value) ? styles.onText : styles.offText}>
            {o.label}
          </Chip>
        ))}
      </View>
      {error ? <HelperText type="error" padding="none">{error}</HelperText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { color: colors.charcoal, fontWeight: '600', marginBottom: 6 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  on: { backgroundColor: colors.forest, borderColor: colors.forest },
  onText: { color: colors.white },
  offText: { color: colors.charcoal },
});
