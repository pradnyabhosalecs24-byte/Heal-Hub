import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text, HelperText } from 'react-native-paper';
import Screen from '../../components/Screen';
import FormInput from '../../components/FormInput';
import ChipSelect from '../../components/ChipSelect';
import SectionCard from '../../components/SectionCard';
import { useAuth } from '../../context/AuthContext';
import { friendlyError } from '../../services/authErrors';
import { DEPARTMENTS, CONSULTATION_TYPES } from '../../config/constants';
import { validate, required, isEmail, isPhone, isStrongPassword } from '../../utils/validators';
import { colors, radius, spacing } from '../../theme/colors';

const INITIAL = {
  fullName: '', email: '', phone: '', specialization: null, qualifications: '', experienceYears: '',
  hospital: '', registrationNumber: '', consultationFee: '0', consultationTypes: ['in_person'],
  password: '', confirm: '',
};
const isInt = (min, max) => v => /^\d+$/.test(String(v)) && Number(v) >= min && Number(v) <= max;

const RULES = {
  fullName: [[required, 'Full name is required']],
  email: [[isEmail, 'Enter a valid email']],
  phone: [[isPhone, 'Enter a valid 10-digit phone number']],
  specialization: [[required, 'Select your specialization']],
  qualifications: [[required, 'e.g. MBBS, MD (Cardiology)']],
  experienceYears: [[isInt(0, 70), 'Enter years of experience (0–70)']],
  hospital: [[required, 'Hospital or clinic is required']],
  registrationNumber: [[v => /^[A-Za-z0-9/-]{4,30}$/.test(String(v).trim()), 'Enter your medical council registration number']],
  consultationFee: [[isInt(0, 100000), 'Enter 0 for free consultations']],
  consultationTypes: [[v => v?.length > 0, 'Select at least one consultation type']],
  password: [[isStrongPassword, 'At least 8 characters, with letters and numbers']],
  confirm: [[(v, all) => v === all.password, 'Passwords do not match']],
};

export default function DoctorRegisterScreen() {
  const { registerDoctor } = useAuth();
  const [f, setF] = useState(INITIAL);
  const [errors, setErrors] = useState({});
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
    setFormError('');
    setBusy(true);
    try {
      await registerDoctor(f);
    } catch (err) {
      setFormError(friendlyError(err));
      setBusy(false);
    }
  };

  return (
    <Screen edges={[]}>
      <SectionCard tone="beige">
        <Text style={styles.note}>
          Your profile becomes visible to patients only after a HEALHUB administrator verifies your medical registration.
        </Text>
      </SectionCard>
      <SectionCard title="Personal details">
        {field('fullName', 'Full name (as registered)')}
        {field('email', 'Email', { keyboardType: 'email-address', autoCapitalize: 'none' })}
        {field('phone', 'Phone number', { keyboardType: 'phone-pad' })}
      </SectionCard>
      <SectionCard title="Professional details">
        <ChipSelect label="Specialization" options={DEPARTMENTS} value={f.specialization} onChange={set('specialization')} error={errors.specialization} />
        {field('qualifications', 'Qualifications')}
        {field('experienceYears', 'Years of experience', { keyboardType: 'number-pad' })}
        {field('hospital', 'Hospital or clinic')}
        {field('registrationNumber', 'Medical registration number', { autoCapitalize: 'characters' })}
        {field('consultationFee', 'Consultation fee (₹)', { keyboardType: 'number-pad', hint: '0 = free consultation' })}
        <ChipSelect label="Consultation types" options={CONSULTATION_TYPES} value={f.consultationTypes} onChange={set('consultationTypes')} multi error={errors.consultationTypes} />
      </SectionCard>
      <SectionCard title="Security">
        {field('password', 'Password', { secure: true })}
        {field('confirm', 'Confirm password', { secure: true })}
      </SectionCard>
      {formError ? <HelperText type="error">{formError}</HelperText> : null}
      <Button mode="contained" loading={busy} disabled={busy} onPress={submit} style={styles.btn} contentStyle={{ height: 52 }}>
        Submit for verification
      </Button>
      <Text style={styles.note}>Profile photograph can be added from your profile after sign-up.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: { color: colors.charcoal, fontSize: 13, lineHeight: 19 },
  btn: { borderRadius: radius.pill, marginVertical: spacing.md },
});
