import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { DefaultTheme } from '@react-navigation/native';
import { colors } from './colors';

export const paperTheme = {
  ...MD3LightTheme,
  roundness: 4,
  fonts: configureFonts({ config: { fontFamily: 'sans-serif' } }),
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.forest,
    onPrimary: colors.white,
    primaryContainer: '#D6E3DB',
    onPrimaryContainer: colors.forest,
    secondary: colors.sage,
    onSecondary: colors.white,
    secondaryContainer: '#E3ECE6',
    onSecondaryContainer: colors.charcoal,
    tertiary: colors.terracotta,
    tertiaryContainer: '#F6E1D9',
    background: colors.ivory,
    surface: colors.white,
    surfaceVariant: colors.beige,
    onSurface: colors.charcoal,
    onSurfaceVariant: colors.muted,
    onBackground: colors.charcoal,
    outline: colors.border,
    error: colors.error,
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level1: colors.white,
      level2: '#FBFAF6',
    },
  },
};

export const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.forest,
    background: colors.ivory,
    card: colors.white,
    text: colors.charcoal,
    border: colors.border,
    notification: colors.terracotta,
  },
};
