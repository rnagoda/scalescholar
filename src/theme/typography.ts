/**
 * Scale Scholar Typography
 *
 * Space Mono throughout for retro terminal aesthetic.
 */

import { TextStyle, Platform } from 'react-native';
import { colors } from './colors';

export const fonts = {
  mono: Platform.select({
    ios: 'SpaceMono-Regular',
    android: 'SpaceMono-Regular',
    default: 'SpaceMono-Regular',
  }),
  monoBold: Platform.select({
    ios: 'SpaceMono-Bold',
    android: 'SpaceMono-Bold',
    default: 'SpaceMono-Bold',
  }),
} as const;

export const typography = {
  // Screen titles - "INTERVALS", "PROGRESS"
  screenTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 20,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.textPrimary,
  } as TextStyle,

  // Card titles - "Interval Trainer"
  cardTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 18,
    color: colors.textPrimary,
  } as TextStyle,

  // Section headers - "PAYCHECKS", "OTHER INCOME"
  sectionHeader: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.textMuted,
  } as TextStyle,

  // Body text
  body: {
    fontFamily: fonts.mono,
    fontSize: 15,
    color: colors.textPrimary,
  } as TextStyle,

  // Secondary/label text
  label: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
  } as TextStyle,

  // Small label text
  labelSmall: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textSecondary,
  } as TextStyle,

  // Large display numbers (scores, stats)
  displayLarge: {
    fontFamily: fonts.monoBold,
    fontSize: 48,
    color: colors.accentGreen,
  } as TextStyle,

  // Medium display numbers
  displayMedium: {
    fontFamily: fonts.monoBold,
    fontSize: 32,
    color: colors.textPrimary,
  } as TextStyle,

  // Button text
  button: {
    fontFamily: fonts.mono,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1,
    color: colors.textPrimary,
  } as TextStyle,

  // Footer/version text
  footer: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  } as TextStyle,
} as const;

export type TypographyKey = keyof typeof typography;
export type TypographyStyle = (typeof typography)[TypographyKey];
