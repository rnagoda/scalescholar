/**
 * BracketButton - The signature [ ACTION ] button style
 *
 * Key to the retro terminal aesthetic.
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  AccessibilityProps,
} from 'react-native';
import { colors, fonts, spacing } from '@theme';

interface BracketButtonProps extends AccessibilityProps {
  label: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export const BracketButton: React.FC<BracketButtonProps> = ({
  label,
  onPress,
  color = colors.textPrimary,
  disabled = false,
  style,
  ...accessibilityProps
}) => {
  const textColor = disabled ? colors.textMuted : color;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, style]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      {...accessibilityProps}
    >
      <Text style={[styles.bracket, { color: textColor }]}>{'[ '}</Text>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <Text style={[styles.bracket, { color: textColor }]}>{' ]'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  bracket: {
    fontFamily: fonts.mono,
    fontSize: 15,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
