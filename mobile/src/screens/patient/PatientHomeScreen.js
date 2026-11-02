import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Avatar, Icon, Searchbar, Text } from 'react-native-paper';
import Screen from '../../components/Screen';
import SectionCard from '../../components/SectionCard';
import { EmptyState } from '../../components/StateViews';
import { LogoMark } from '../../components/Logo';
import { useAuth } from '../../context/AuthContext';
import { greeting, initials, todayLabel } from '../../utils/format';
import { colors, radius, spacing } from '../../theme/colors';

const QUICK = [
  { icon: 'stethoscope', label: 'Find doctor', tab: 'Doctors' },
  { icon: 'heart-pulse', label: 'My health', tab: 'Health' },
  { icon: 'robot-happy-outline', label: 'AI assistant', tab: 'Assistant' },
  { icon: 'account-circle', label: 'Profile', tab: 'Profile' },
];

export default function PatientHomeScreen({ navigation }) {
  const { account, roleProfile } = useAuth();
  const first = (account?.fullName || '').split(' ')[0];

  return (
    <Screen>
      <View style={styles.top}>
        <View style={styles.flex}>
          <Text style={styles.date}>{todayLabel()}</Text>
          <Text style={styles.hello}>{greeting()}, {first}</Text>
        </View>
        <Avatar.Text size={48} label={initials(account?.fullName)} style={{ backgroundColor: colors.sage }} color={colors.white} />
      </View>

      <View style={styles.idCard}>
        <LogoMark size={40} />
        <View style={styles.idText}>
          <Text style={styles.idLabel}>HEALHUB PATIENT ID</Text>
          <Text style={styles.id}>{roleProfile?.patientId || '—'}</Text>
        </View>
        {roleProfile?.bloodGroup ? (
          <View style={styles.blood}><Text style={styles.bloodText}>{roleProfile.bloodGroup}</Text></View>
        ) : null}
      </View>

      <Pressable onPress={() => navigation.navigate('Doctors')}>
        <View pointerEvents="none">
          <Searchbar placeholder="Search doctors & departments" value="" style={styles.search} inputStyle={{ minHeight: 0 }} editable={false} />
        </View>
      </Pressable>

      <View style={styles.quick}>
        {QUICK.map(q => (
          <Pressable key={q.tab} style={styles.q} onPress={() => navigation.navigate(q.tab)} android_ripple={{ color: colors.beige }}>
            <View style={styles.qIcon}><Icon source={q.icon} size={24} color={colors.forest} /></View>
            <Text style={styles.qLabel}>{q.label}</Text>
          </Pressable>
        ))}
      </View>

      <SectionCard title="Upcoming appointments">
        <EmptyState icon="calendar-blank" title="No upcoming appointments" message="Book a verified doctor from the Doctors tab." />
      </SectionCard>
      <SectionCard title="Today's health summary">
        <EmptyState icon="chart-line" title="No readings logged today" message="Heart rate, BP, water, sleep and steps will appear here once you log them." />
      </SectionCard>
      <SectionCard title="Medicine reminders" tone="beige">
        <EmptyState icon="pill" title="No medicines added" message="Add medicines to get on-time reminders, even offline." />
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  top: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, marginBottom: spacing.md },
  date: { color: colors.muted, fontSize: 13 },
  hello: { fontSize: 24, fontWeight: '800', color: colors.charcoal, marginTop: 2 },
  idCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.forest, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  idText: { flex: 1, marginLeft: spacing.md },
  idLabel: { color: colors.sage, fontSize: 11, letterSpacing: 1.5, fontWeight: '700' },
  id: { color: colors.white, fontSize: 20, fontWeight: '800', letterSpacing: 1, marginTop: 2 },
  blood: { backgroundColor: colors.terracotta, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 },
  bloodText: { color: colors.white, fontWeight: '800' },
  search: { backgroundColor: colors.white, borderRadius: radius.md, marginBottom: spacing.md, elevation: 0, borderWidth: 1, borderColor: colors.border },
  quick: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  q: { alignItems: 'center', width: '24%', paddingVertical: 6, borderRadius: radius.md },
  qIcon: { width: 54, height: 54, borderRadius: 18, backgroundColor: colors.beige, alignItems: 'center', justifyContent: 'center' },
  qLabel: { fontSize: 12, color: colors.charcoal, marginTop: 6, fontWeight: '600', textAlign: 'center' },
});
