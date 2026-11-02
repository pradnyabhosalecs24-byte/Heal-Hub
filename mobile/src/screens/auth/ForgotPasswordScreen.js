import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text, HelperText } from 'react-native-paper';
import Screen from '../../components/Screen';
import FormInput from '../../components/FormInput';
import { useAuth } from '../../context/AuthContext';
import { friendlyError } from '../../services/authErrors';
import { isEmail } from '../../utils/validators';
import { colors, radius, spacing } from '../../theme/colors';

export default function ForgotPasswordScreen({ route, navigation }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState(route.params?.email || '');
  const [state, setState] = useState({ busy: false, error: '', sent: false });

  const submit = async () => {
    if (!isEmail(email)) return setState(s => ({ ...s, error: 'Enter a valid email address.' }));
    setState({ busy: true, error: '', sent: false });
    try {
      await resetPassword(email);
      setState({ busy: false, error: '', sent: true });
    } catch (e) {
      // Do not reveal whether an account exists for this email.
      if (e?.code === 'auth/user-not-found') setState({ busy: false, error: '', sent: true });
      else setState({ busy: false, error: friendlyError(e), sent: false });
    }
  };

  return (
    <Screen edges={[]}>
      <Text style={styles.p}>Enter your account email. If an account exists, Firebase will send a secure link to set a new password.</Text>
      <FormInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      {state.error ? <HelperText type="error">{state.error}</HelperText> : null}
      {state.sent ? <HelperText type="info" style={styles.ok}>If that email is registered, a reset link is on its way. Check your inbox and spam folder.</HelperText> : null}
      <Button mode="contained" loading={state.busy} disabled={state.busy} onPress={submit} style={styles.btn} contentStyle={{ height: 50 }}>
        Send reset link
      </Button>
      <Button onPress={() => navigation.goBack()}>Back to sign in</Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  p: { color: colors.muted, marginBottom: spacing.md, lineHeight: 20 },
  ok: { color: colors.success },
  btn: { borderRadius: radius.pill, marginVertical: spacing.sm },
});
