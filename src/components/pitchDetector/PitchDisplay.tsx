import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fonts } from '@/src/theme';
import { PitchResult } from '@/src/types/pitchDetector';

interface PitchDisplayProps {
  /** Current pitch result */
  pitch: PitchResult | null;
  /** Whether the detector is active */
  isActive?: boolean;
}

/**
 * Large display showing detected note name, frequency, and cents
 */
export const PitchDisplay: React.FC<PitchDisplayProps> = ({
  pitch,
  isActive = true,
}) => {
  if (!pitch || !isActive) {
    return (
      <View style={styles.container}>
        <Text style={styles.notePlaceholder}>--</Text>
        <Text style={styles.frequencyPlaceholder}>--- Hz</Text>
      </View>
    );
  }

  // Get color based on how in-tune
  const getColor = () => {
    const absCents = Math.abs(pitch.cents);
    if (absCents <= 5) return colors.accentGreen;
    if (absCents <= 15) return '#FFD60A'; // Yellow
    return colors.accentPink;
  };

  const noteColor = getColor();

  return (
    <View style={styles.container}>
      <Text style={[styles.noteName, { color: noteColor }]}>
        {pitch.noteName}
      </Text>
      <Text style={styles.frequency}>
        {pitch.frequency.toFixed(1)} Hz
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    minWidth: 200,
  },
  noteName: {
    fontFamily: fonts.monoBold,
    fontSize: 64,
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  notePlaceholder: {
    fontFamily: fonts.monoBold,
    fontSize: 64,
    color: colors.textMuted,
    letterSpacing: 2,
  },
  frequency: {
    fontFamily: fonts.mono,
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  frequencyPlaceholder: {
    fontFamily: fonts.mono,
    fontSize: 18,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
