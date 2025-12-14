import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, fonts, spacing } from '../../theme';

interface BracketButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  style?: ViewStyle;
  disabled?: boolean;
}

export const BracketButton: React.FC<BracketButtonProps> = ({
  label,
  onPress,
  color = colors.textPrimary,
  style,
  disabled = false,
}) => {
  const textColor = disabled ? colors.textMuted : color;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, style]}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.bracket, { color: textColor }]}>[ </Text>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <Text style={[styles.bracket, { color: textColor }]}> ]</Text>
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
