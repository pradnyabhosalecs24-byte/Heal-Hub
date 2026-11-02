import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, Icon } from 'react-native-paper';
import Screen from '../../components/Screen';
import Logo from '../../components/Logo';
import { colors, radius, spacing } from '../../theme/colors';

const POINTS = [
  ['calendar-check', 'Book verified doctors'],
  ['pill', 'Never miss a medicine'],
  ['shield-alert', 'One-tap emergency help'],
];

export default function WelcomeScreen({ navigation }) {
  return (
    <Screen style={styles.c}>
      <View style={styles.hero}>
        <Logo size={88} showTagline />
      </View>
      <View style={styles.card}>
        {POINTS.map(([icon, text]) => (
          <View key={icon} style={styles.point}>
            <View style={styles.dot}><Icon source={icon} size={20} color={colors.forest} /></View>
            <Text style={styles.pointText}>{text}</Text>
          </View>
        ))}
      </View>
      <Button mode="contained" icon="account-heart" contentStyle={styles.btnC} style={styles.btn}
        onPress={() => navigation.navigate('Login', { role: 'patient' })}>
        Continue as Patient
      </Button>
      <Button mode="outlined" icon="stethoscope" contentStyle={styles.btnC} style={styles.btn}
        onPress={() => navigation.navigate('Login', { role: 'doctor' })}>
        Continue as Doctor
      </Button>
      <Text style={styles.foot}>Free for essential care · SOS is always free</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  c: { justifyContent: 'center' },
  hero: { alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.lg },
  card: { backgroundColor: colors.beige, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.lg },
  point: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  dot: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  pointText: { color: colors.charcoal, fontSize: 15, fontWeight: '500' },
  btn: { marginBottom: spacing.sm, borderRadius: radius.pill },
  btnC: { height: 52 },
  foot: { textAlign: 'center', color: colors.muted, marginTop: spacing.md, fontSize: 12 },
});
