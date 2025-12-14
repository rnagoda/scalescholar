import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../theme';

type AnswerState = 'default' | 'selected' | 'correct' | 'incorrect';

interface AnswerButtonProps {
  label: string;
  onPress: () => void;
  state?: AnswerState;
  disabled?: boolean;
}

export const AnswerButton: React.FC<AnswerButtonProps> = ({
  label,
  onPress,
  state = 'default',
  disabled = false,
}) => {
  const getColors = () => {
    switch (state) {
      case 'correct':
        return {
          border: colors.accentGreen,
          background: colors.accentGreen + '20',
          text: colors.accentGreen,
        };
      case 'incorrect':
        return {
          border: colors.accentPink,
          background: colors.accentPink + '20',
          text: colors.accentPink,
        };
      case 'selected':
        return {
          border: colors.accentBlue,
          background: colors.accentBlue + '20',
          text: colors.accentBlue,
        };
      default:
        return {
          border: colors.cardBorder,
          background: colors.cardBackground,
          text: colors.textPrimary,
        };
    }
  };

  const stateColors = getColors();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderColor: stateColors.border,
          backgroundColor: stateColors.background,
        },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, { color: stateColors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.xs,
    minHeight: 80,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: fonts.monoBold,
    fontSize: 20,
    letterSpacing: 1,
  },
});
