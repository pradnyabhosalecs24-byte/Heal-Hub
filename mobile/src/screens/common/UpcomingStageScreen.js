import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Icon } from 'react-native-paper';
import Screen from '../../components/Screen';
import SectionCard from '../../components/SectionCard';
import { colors, spacing } from '../../theme/colors';

// Honest placeholder for tabs whose features are built in later stages (no fake buttons or data).
const FEATURES = {
  doctors: { icon: 'stethoscope', title: 'Doctors & departments', stage: 2, items: ['12 hospital departments', 'Verified doctor directory with search & filters', 'Appointment booking with live slots'] },
  health: { icon: 'heart-pulse', title: 'Health tracking', stage: 4, items: ['Heart rate, BP, SpO2, sleep, steps, weight & BMI', 'Water tracker and diet planner', 'Weekly and monthly trend charts'] },
  assistant: { icon: 'robot-happy-outline', title: 'AI health assistant', stage: 7, items: ['Health education in simple language', 'Explains reports and lab terms', 'Safe: never diagnoses or prescribes'] },
};

export default function UpcomingStageScreen({ route }) {
  const f = FEATURES[route.params?.feature] || FEATURES.doctors;
  return (
    <Screen>
      <View style={styles.head}>
        <Icon source={f.icon} size={30} color={colors.forest} />
        <Text style={styles.title}>{f.title}</Text>
      </View>
      <SectionCard tone="beige" title={`Arrives in Stage ${f.stage}`}>
        {f.items.map(i => (
          <View key={i} style={styles.row}>
            <Icon source="check-circle-outline" size={18} color={colors.forest} />
            <Text style={styles.item}>{i}</Text>
          </View>
        ))}
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.md },
  title: { fontSize: 22, fontWeight: '800', color: colors.charcoal, marginLeft: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  item: { marginLeft: 8, color: colors.charcoal },
});
