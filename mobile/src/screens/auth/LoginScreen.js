import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, HelperText } from 'react-native-paper';
import Screen from '../../components/Screen';
import { LogoMark } from '../../components/Logo';
import FormInput from '../../components/FormInput';
import { useAuth } from '../../context/AuthContext';
import { friendlyError } from '../../services/authErrors';
import { isEmail } from '../../utils/validators';
import { colors, radius, spacing } from '../../theme/colors';

export default function LoginScreen({ navigation, route }) {
  const role = route.params?.role === 'doctor' ? 'doctor' : 'patient';
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!isEmail(email) || !password) return setError('Enter your email and password.');
    setError('');
    setBusy(true);
    try {
      await login(email, password, role);
    } catch (e) {
      setError(friendlyError(e));
      setBusy(false);
    }
  };

  return (
    <Screen edges={[]}>
      <View style={styles.head}>
        <LogoMark size={56} />
        <Text style={styles.title}>{role === 'doctor' ? 'Doctor sign in' : 'Patient sign in'}</Text>
        <Text style={styles.sub}>
          {role === 'doctor' ? 'Manage consultations, patients and prescriptions.' : 'Your appointments, records and reminders in one place.'}
        </Text>
      </View>
      <FormInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
      <FormInput label="Password" value={password} onChangeText={setPassword} secure autoComplete="password" onSubmitEditing={submit} />
      {error ? <HelperText type="error" visible>{error}</HelperText> : null}
      <Button mode="text" compact style={styles.forgot} onPress={() => navigation.navigate('ForgotPassword', { email })}>
        Forgot password?
      </Button>
      <Button mode="contained" loading={busy} disabled={busy} onPress={submit} style={styles.btn} contentStyle={styles.btnC}>
        Sign in
      </Button>
      <View style={styles.row}>
        <Text style={styles.muted}>New to HEALHUB?</Text>
        <Button compact onPress={() => navigation.navigate(role === 'doctor' ? 'DoctorRegister' : 'PatientRegister')}>
          Create {role} account
        </Button>
      </View>
      <Button compact icon="swap-horizontal" onPress={() => navigation.setParams({ role: role === 'doctor' ? 'patient' : 'doctor' })}>
        I'm a {role === 'doctor' ? 'patient' : 'doctor'}
      </Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { alignItems: 'center', marginBottom: spacing.lg },
  title: { fontSize: 24, fontWeight: '800', color: colors.charcoal, marginTop: spacing.md },
  sub: { color: colors.muted, textAlign: 'center', marginTop: 6 },
  forgot: { alignSelf: 'flex-end' },
  btn: { borderRadius: radius.pill, marginTop: spacing.sm },
  btnC: { height: 52 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg },
  muted: { color: colors.muted },
});
