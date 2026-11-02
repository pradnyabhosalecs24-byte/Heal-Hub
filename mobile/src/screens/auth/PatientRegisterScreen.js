import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text, HelperText, Checkbox } from 'react-native-paper';
import Screen from '../../components/Screen';
import FormInput from '../../components/FormInput';
import ChipSelect from '../../components/ChipSelect';
import SectionCard from '../../components/SectionCard';
import { useAuth } from '../../context/AuthContext';
import { friendlyError } from '../../services/authErrors';
import { BLOOD_GROUPS, GENDERS } from '../../config/constants';
import { validate, required, isEmail, isPhone, isStrongPassword, parseDob } from '../../utils/validators';
import { colors, radius, spacing } from '../../theme/colors';

const INITIAL = {
  fullName: '', email: '', phone: '', dob: '', gender: null, bloodGroup: null, address: '',
  password: '', confirm: '', ecName: '', ecPhone: '', ecRelation: '',
};

const RULES = {
  fullName: [[required, 'Full name is required']],
  email: [[isEmail, 'Enter a valid email']],
  phone: [[isPhone, 'Enter a valid 10-digit phone number']],
  dob: [[v => parseDob(v), 'Use DD-MM-YYYY (a real, past date)']],
  gender: [[required, 'Select a gender']],
  address: [[required, 'Address is required']],
  password: [[isStrongPassword, 'At least 8 characters, with letters and numbers']],
  confirm: [[(v, all) => v === all.password, 'Passwords do not match']],
  ecName: [[required, 'Emergency contact name is required']],
  ecPhone: [[isPhone, 'Enter a valid phone number'], [(v, all) => v !== all.phone, 'Use someone else’s number']],
  ecRelation: [[required, 'Relationship is required']],
};

export default function PatientRegisterScreen() {
  const { registerPatient } = useAuth();
  const [f, setF] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const set = k => v => setF(p => ({ ...p, [k]: v }));
  const field = (k, label, extra = {}) => (
    <FormInput label={label} value={f[k]} onChangeText={set(k)} error={errors[k]} {...extra} />
  );

  const submit = async () => {
    const e = validate(f, RULES);
    setErrors(e);
    if (Object.keys(e).length) return setFormError('Please fix the highlighted fields.');
    if (!consent) return setFormError('Please accept the health-data consent to continue.');
    setFormError('');
    setBusy(true);
    try {
      await registerPatient(f);
    } catch (err) {
      setFormError(friendlyError(err));
      setBusy(false);
    }
  };

  return (
    <Screen edges={[]}>
      <SectionCard title="Personal details">
        {field('fullName', 'Full name', { autoComplete: 'name' })}
        {field('email', 'Email', { keyboardType: 'email-address', autoCapitalize: 'none' })}
        {field('phone', 'Phone number', { keyboardType: 'phone-pad' })}
        {field('dob', 'Date of birth (DD-MM-YYYY)', { keyboardType: 'numbers-and-punctuation', maxLength: 10 })}
        <ChipSelect label="Gender" options={GENDERS} value={f.gender} onChange={set('gender')} error={errors.gender} />
        <ChipSelect label="Blood group (optional)" options={BLOOD_GROUPS} value={f.bloodGroup} onChange={set('bloodGroup')} />
        {field('address', 'Address', { multiline: true })}
      </SectionCard>
      <SectionCard title="Emergency contact" tone="beige">
        <Text style={styles.note}>Used by SOS alerts. You can add more contacts later.</Text>
        {field('ecName', 'Contact name')}
        {field('ecPhone', 'Contact phone', { keyboardType: 'phone-pad' })}
        {field('ecRelation', 'Relationship (e.g. Mother, Friend)')}
      </SectionCard>
      <SectionCard title="Security">
        {field('password', 'Password', { secure: true })}
        {field('confirm', 'Confirm password', { secure: true })}
      </SectionCard>
      <Checkbox.Item
        status={consent ? 'checked' : 'unchecked'}
        onPress={() => setConsent(c => !c)}
        label="I consent to HEALHUB storing my health information securely to provide care features. I can request deletion anytime."
        labelStyle={styles.consent}
        position="leading"
        mode="android"
      />
      {formError ? <HelperText type="error">{formError}</HelperText> : null}
      <Button mode="contained" loading={busy} disabled={busy} onPress={submit} style={styles.btn} contentStyle={{ height: 52 }}>
        Create patient account
      </Button>
      <Text style={styles.note}>Profile photo can be added from your profile after sign-up.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: { color: colors.muted, fontSize: 12, marginBottom: spacing.sm },
  consent: { fontSize: 13, color: colors.charcoal, textAlign: 'left' },
  btn: { borderRadius: radius.pill, marginVertical: spacing.md },
});
