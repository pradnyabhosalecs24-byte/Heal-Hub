import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Screen from '../../components/Screen';
import Logo from '../../components/Logo';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing } from '../../theme/colors';

const COPY = {
  admin: {
    title: 'Administrator account',
    body: 'Administration (doctor verification, departments, hospital information) is done on the secure HEALHUB web admin portal, so that sensitive tools stay off phones.',
  },
  incomplete: {
    title: 'Profile not found',
    body: 'Your login exists but your HEALHUB profile could not be loaded. If you are offline, reconnect and reopen the app. Otherwise sign out and register again, or contact support.',
  },
};

export default function NoticeScreen({ route }) {
  const { logout } = useAuth();
  const c = COPY[route.params?.kind] || COPY.incomplete;
  return (
    <Screen style={styles.c}>
      <Logo size={64} />
      <Text style={styles.title}>{c.title}</Text>
      <Text style={styles.body}>{c.body}</Text>
      <Button mode="contained" onPress={logout} style={{ marginTop: spacing.lg }}>Sign out</Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  c: { justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '800', textAlign: 'center', marginTop: spacing.lg, color: colors.charcoal },
  body: { textAlign: 'center', color: colors.muted, marginTop: spacing.sm, lineHeight: 21 },
});
