import React, { useState } from 'react';
import { Linking, StyleSheet } from 'react-native';
import { FAB, Portal, Dialog, Button, Text } from 'react-native-paper';
import { colors } from '../theme/colors';
import { EMERGENCY_NUMBER } from '../config/env';

// Always-available emergency shortcut. Opens the phone dialer, which works without internet.
// The full SOS workflow (location + alerts to contacts) is added in Stage 6.
export default function EmergencyCallButton() {
  const [open, setOpen] = useState(false);
  const call = async () => {
    setOpen(false);
    await Linking.openURL(`tel:${EMERGENCY_NUMBER}`);
  };
  return (
    <>
      <FAB
        icon="phone-alert"
        label="SOS"
        color={colors.white}
        style={styles.fab}
        onPress={() => setOpen(true)}
        accessibilityLabel="Emergency call"
      />
      <Portal>
        <Dialog visible={open} onDismiss={() => setOpen(false)}>
          <Dialog.Icon icon="alert" color={colors.sos} />
          <Dialog.Title style={styles.center}>Call emergency services?</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.center}>
              This opens your dialer with {EMERGENCY_NUMBER} (national emergency number). It works
              even without internet.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setOpen(false)}>Cancel</Button>
            <Button mode="contained" buttonColor={colors.sos} onPress={call}>
              Call {EMERGENCY_NUMBER}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: colors.sos },
  center: { textAlign: 'center' },
});
