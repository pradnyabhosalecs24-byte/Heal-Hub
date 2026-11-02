import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, HelperText, Icon } from 'react-native-paper';
import Screen from '../../components/Screen';
import { useAuth } from '../../context/AuthContext';
import { friendlyError } from '../../services/authErrors';
import { colors, radius, spacing } from '../../theme/colors';

export default function VerifyEmailScreen() {
  const { user, refreshUser, resendVerification, logout } = useAuth();
  const [msg, setMsg] = useState({ text: '', type: 'info' });
  const [busy, setBusy] = useState(false);

  const check = async () => {
    setBusy(true);
    try {
      const ok = await refreshUser();
      if (!ok) setMsg({ text: 'Not verified yet. Open the link in your email, then tap again.', type: 'error' });
    } catch (e) {
      setMsg({ text: friendlyError(e), type: 'error' });
    }
    setBusy(false);
  };
  const resend = async () => {
    try {
      await resendVerification();
      setMsg({ text: 'Verification email sent. Check your inbox and spam folder.', type: 'info' });
    } catch (e) {
      setMsg({ text: friendlyError(e), type: 'error' });
    }
  };

  return (
    <Screen style={styles.c}>
      <View style={styles.icon}><Icon source="email-check-outline" size={44} color={colors.forest} /></View>
      <Text style={styles.title}>Verify your email</Text>
      <Text style={styles.p}>We sent a verification link to{'\n'}<Text style={styles.b}>{user?.email}</Text></Text>
      {msg.text ? <HelperText type={msg.type} style={styles.center}>{msg.text}</HelperText> : null}
      <Button mode="contained" loading={busy} onPress={check} style={styles.btn} contentStyle={{ height: 50 }}>I've verified my email</Button>
      <Button onPress={resend}>Resend email</Button>
      <Button textColor={colors.muted} onPress={logout}>Use a different account</Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  c: { justifyContent: 'center' },
  icon: { alignSelf: 'center', width: 88, height: 88, borderRadius: 44, backgroundColor: colors.beige, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginTop: spacing.md, color: colors.charcoal },
  p: { textAlign: 'center', color: colors.muted, marginVertical: spacing.md, lineHeight: 21 },
  b: { color: colors.charcoal, fontWeight: '700' },
  center: { textAlign: 'center' },
  btn: { borderRadius: radius.pill, marginVertical: spacing.sm },
});
