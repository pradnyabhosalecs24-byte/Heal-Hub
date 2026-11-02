import React, { forwardRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { colors } from '../theme/colors';

const FormInput = forwardRef(({ label, error, secure, hint, style, ...rest }, ref) => {
  const [hidden, setHidden] = useState(true);
  return (
    <View style={[styles.wrap, style]}>
      <TextInput
        ref={ref}
        mode="outlined"
        label={label}
        error={Boolean(error)}
        secureTextEntry={secure && hidden}
        outlineColor={colors.border}
        style={styles.input}
        right={
          secure ? (
            <TextInput.Icon icon={hidden ? 'eye-off' : 'eye'} onPress={() => setHidden(h => !h)} />
          ) : undefined
        }
        {...rest}
      />
      {(error || hint) && (
        <HelperText type={error ? 'error' : 'info'} visible padding="none">
          {error || hint}
        </HelperText>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { marginBottom: 10 },
  input: { backgroundColor: colors.white },
});
export default FormInput;
