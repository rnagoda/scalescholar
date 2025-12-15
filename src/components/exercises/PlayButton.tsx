import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors, fonts, spacing } from '../../theme';

interface PlayButtonProps {
  onPress: () => void;
  isPlaying?: boolean;
  disabled?: boolean;
  label?: string;
}

export const PlayButton: React.FC<PlayButtonProps> = ({
  onPress,
  isPlaying = false,
  disabled = false,
  label = 'PLAY',
}) => {
  const buttonColor = disabled
    ? colors.textMuted
    : isPlaying
    ? colors.accentBlue
    : colors.accentGreen;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderColor: buttonColor },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || isPlaying}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={[styles.icon, { color: buttonColor }]}>
          {isPlaying ? '◼' : '▶'}
        </Text>
        <Text style={[styles.label, { color: buttonColor }]}>
          {isPlaying ? 'PLAYING...' : label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 160,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    fontFamily: fonts.mono,
    fontSize: 20,
  },
  label: {
    fontFamily: fonts.monoBold,
    fontSize: 16,
    letterSpacing: 1,
  },
});
