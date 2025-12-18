import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../theme';

type AnswerState = 'default' | 'selected' | 'correct' | 'incorrect';

interface AnswerButtonProps {
  label: string;
  onPress: () => void;
  state?: AnswerState;
  disabled?: boolean;
  /** Number of columns in the grid (used for width calculation) */
  columns?: number;
  /** Actual container width (measured by AnswerGrid). If not provided, uses flex. */
  containerWidth?: number;
  testID?: string;
}

export const AnswerButton: React.FC<AnswerButtonProps> = ({
  label,
  onPress,
  state = 'default',
  disabled = false,
  columns = 2,
  containerWidth,
  testID,
}) => {
  // Calculate button width based on actual container width
  // Gap between buttons (spacing.sm = 8) * (columns - 1)
  // Border width (1px left + 1px right = 2px per button)
  // If containerWidth is not provided, use undefined (flex layout)
  const buttonWidth = containerWidth !== undefined
    ? (() => {
        const totalGaps = spacing.sm * (columns - 1);
        const borderWidth = 1; // matches styles.container.borderWidth
        const totalBorders = (borderWidth * 2) * columns;
        const availableWidth = containerWidth - totalGaps - totalBorders;
        return Math.floor(availableWidth / columns);
      })()
    : undefined;

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
          width: buttonWidth,
          borderColor: stateColors.border,
          backgroundColor: stateColors.background,
        },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      testID={testID}
    >
      <Text style={[styles.label, { color: stateColors.text }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
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
