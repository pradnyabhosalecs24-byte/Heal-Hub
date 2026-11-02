import React from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/colors';

// Responsive screen wrapper: scrolls on small phones, caps width on tablets/foldables.
export default function Screen({ children, scroll = true, style, edges = ['top'] }) {
  const Body = scroll ? ScrollView : View;
  const bodyProps = scroll
    ? { contentContainerStyle: [styles.content, style], keyboardShouldPersistTaps: 'handled' }
    : { style: [styles.content, styles.fill, style] };
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Body {...bodyProps}>
          <View style={styles.inner}>{children}</View>
        </Body>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ivory },
  fill: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xl * 3, flexGrow: 1 },
  inner: { width: '100%', maxWidth: 640, alignSelf: 'center', flexGrow: 1 },
});
