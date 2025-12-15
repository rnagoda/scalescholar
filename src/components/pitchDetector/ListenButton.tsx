import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fonts } from '@/src/theme';

interface ListenButtonProps {
  /** Called when button is pressed */
  onPress: () => void;
  /** Whether currently listening */
  isListening?: boolean;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Button label override */
  label?: string;
}

/**
 * Microphone control button for starting/stopping pitch detection
 * Similar to PlayButton but for audio input
 */
export const ListenButton: React.FC<ListenButtonProps> = ({
  onPress,
  isListening = false,
  disabled = false,
  label,
}) => {
  const buttonColor = disabled
    ? colors.textMuted
    : isListening
    ? colors.accentPink
    : colors.accentGreen;

  const buttonLabel = label || (isListening ? 'STOP' : 'LISTEN');
  const iconSymbol = isListening ? '◼' : '◉';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={styles.touchable}
    >
      <View style={[styles.container, { borderColor: buttonColor }]}>
        <Text style={[styles.icon, { color: buttonColor }]}>
          {iconSymbol}
        </Text>
        <Text style={[styles.label, { color: buttonColor }]}>
          {buttonLabel}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderWidth: 2,
    borderRadius: 8,
    minWidth: 140,
  },
  icon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  label: {
    fontFamily: fonts.monoBold,
    fontSize: 16,
    letterSpacing: 1,
  },
});
