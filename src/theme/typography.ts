import { TextStyle } from 'react-native';
import { colors } from './colors';

export const fonts = {
  mono: 'SpaceMono-Regular',
  monoBold: 'SpaceMono-Bold',
} as const;

export const typography = {
  screenTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 20,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.textPrimary,
  } as TextStyle,

  cardTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 18,
    color: colors.textPrimary,
  } as TextStyle,

  sectionHeader: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.textMuted,
  } as TextStyle,

  body: {
    fontFamily: fonts.mono,
    fontSize: 15,
    color: colors.textPrimary,
  } as TextStyle,

  label: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
  } as TextStyle,

  displayLarge: {
    fontFamily: fonts.monoBold,
    fontSize: 48,
    color: colors.accentGreen,
  } as TextStyle,

  footer: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  } as TextStyle,
} as const;

export type TypographyKey = keyof typeof typography;
