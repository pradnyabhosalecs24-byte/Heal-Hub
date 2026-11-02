import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, IconButton, Text, Icon } from 'react-native-paper';
import Screen from '../../components/Screen';
import SectionCard from '../../components/SectionCard';
import { EmptyState } from '../../components/StateViews';
import { useAuth } from '../../context/AuthContext';
import { greeting, initials, todayLabel } from '../../utils/format';
import { colors, radius, spacing } from '../../theme/colors';

const STATUS = {
  pending: { icon: 'clock-outline', bg: '#F6E1D9', fg: '#8A4A36', title: 'Verification pending', body: 'An administrator is reviewing your registration. Patients cannot book you until you are verified.' },
  verified: { icon: 'check-decagram', bg: '#DCE8E0', fg: colors.forest, title: 'Verified doctor', body: 'Your profile is visible to patients in the HEALHUB directory.' },
  rejected: { icon: 'alert-circle-outline', bg: '#F3D6D0', fg: colors.error, title: 'Verification not approved', body: 'Please contact the HEALHUB administrator to correct your registration details.' },
};

export default function DoctorHomeScreen({ navigation }) {
  const { account, roleProfile } = useAuth();
  const st = STATUS[roleProfile?.verificationStatus] || STATUS.pending;

  return (
    <Screen>
      <View style={styles.top}>
        <View style={styles.flex}>
          <Text style={styles.date}>{todayLabel()}</Text>
          <Text style={styles.hello}>{greeting()}, Dr. {(account?.fullName || '').split(' ')[0]}</Text>
          <Text style={styles.spec}>{roleProfile?.specialization} · {roleProfile?.hospital}</Text>
        </View>
        <Avatar.Text size={48} label={initials(account?.fullName)} style={{ backgroundColor: colors.forest }} color={colors.white} />
        <IconButton icon="cog-outline" onPress={() => navigation.navigate('DoctorProfile')} accessibilityLabel="Profile and settings" />
      </View>

      <View style={[styles.status, { backgroundColor: st.bg }]}>
        <Icon source={st.icon} size={26} color={st.fg} />
        <View style={styles.statusText}>
          <Text style={[styles.statusTitle, { color: st.fg }]}>{st.title}</Text>
          <Text style={styles.statusBody}>{st.body}</Text>
        </View>
      </View>

      <SectionCard title="Today's appointments">
        <EmptyState icon="calendar-today" title="No appointments today" message="Requests appear here once patients book your available slots." />
      </SectionCard>
      <SectionCard title="Pending requests" tone="beige">
        <EmptyState icon="inbox-outline" title="No pending requests" />
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  top: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, marginBottom: spacing.md },
  date: { color: colors.muted, fontSize: 13 },
  hello: { fontSize: 22, fontWeight: '800', color: colors.charcoal, marginTop: 2 },
  spec: { color: colors.muted, marginTop: 2 },
  status: { flexDirection: 'row', borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  statusText: { flex: 1, marginLeft: spacing.sm },
  statusTitle: { fontWeight: '800', fontSize: 15 },
  statusBody: { color: colors.charcoal, marginTop: 2, lineHeight: 19 },
});
