import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Divider, List, Text, Snackbar } from 'react-native-paper';
import Screen from '../../components/Screen';
import SectionCard from '../../components/SectionCard';
import { useAuth } from '../../context/AuthContext';
import { friendlyError } from '../../services/authErrors';
import { initials } from '../../utils/format';
import { GENDERS } from '../../config/constants';
import { colors, spacing } from '../../theme/colors';

export default function ProfileScreen() {
  const { account, role, roleProfile, user, resetPassword, logout } = useAuth();
  const [snack, setSnack] = useState('');
  const isDoctor = role === 'doctor';

  const changePassword = async () => {
    try {
      await resetPassword(user.email);
      setSnack('Password change link sent to your email.');
    } catch (e) {
      setSnack(friendlyError(e));
    }
  };

  const rows = isDoctor
    ? [
        ['Specialization', roleProfile?.specialization],
        ['Qualifications', roleProfile?.qualifications],
        ['Experience', roleProfile ? `${roleProfile.experienceYears} years` : null],
        ['Hospital / clinic', roleProfile?.hospital],
        ['Registration no.', roleProfile?.registrationNumber],
        ['Consultation fee', roleProfile ? (roleProfile.consultationFee ? `₹${roleProfile.consultationFee}` : 'Free') : null],
      ]
    : [
        ['Patient ID', roleProfile?.patientId],
        ['Date of birth', roleProfile?.dob],
        ['Gender', GENDERS.find(g => g.value === roleProfile?.gender)?.label],
        ['Blood group', roleProfile?.bloodGroup || 'Not added'],
        ['Address', roleProfile?.address],
      ];

  return (
    <Screen>
      <View style={styles.head}>
        <Avatar.Text size={72} label={initials(account?.fullName)} style={{ backgroundColor: colors.sage }} color={colors.white} />
        <Text style={styles.name}>{isDoctor ? `Dr. ${account?.fullName || ''}` : account?.fullName}</Text>
        <Text style={styles.muted}>{account?.email} · {account?.phone}</Text>
      </View>
      <SectionCard title={isDoctor ? 'Professional profile' : 'Personal information'}>
        {rows.map(([k, v], i) => (
          <View key={k}>
            {i > 0 && <Divider />}
            <View style={styles.row}>
              <Text style={styles.k}>{k}</Text>
              <Text style={styles.v}>{v ?? '—'}</Text>
            </View>
          </View>
        ))}
      </SectionCard>
      <SectionCard title="Account & security">
        <List.Item title="Change password" description="We'll email you a secure link" left={p => <List.Icon {...p} icon="lock-reset" />} onPress={changePassword} />
        <Divider />
        <List.Item title="Sign out" titleStyle={{ color: colors.error }} left={p => <List.Icon {...p} icon="logout" color={colors.error} />} onPress={logout} />
      </SectionCard>
      <Text style={styles.foot}>Profile editing, photo, privacy and notification settings arrive in Stage 2–5.</Text>
      <Snackbar visible={!!snack} onDismiss={() => setSnack('')} duration={3500}>{snack}</Snackbar>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { alignItems: 'center', marginVertical: spacing.lg },
  name: { fontSize: 20, fontWeight: '800', color: colors.charcoal, marginTop: spacing.sm },
  muted: { color: colors.muted, marginTop: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, gap: 12 },
  k: { color: colors.muted },
  v: { color: colors.charcoal, fontWeight: '600', flexShrink: 1, textAlign: 'right', textTransform: 'none' },
  foot: { color: colors.muted, fontSize: 12, textAlign: 'center' },
});
