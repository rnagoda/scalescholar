/**
 * ProgressBar - Simple rectangular progress indicator
 *
 * Visual: [████████░░░░░░░░░░░░░░░░░░░░░░]  45%
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, fonts, spacing, borderRadius } from '@theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  label?: string;
  showPercentage?: boolean;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = false,
  style,
}) => {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const percentage = Math.round(clampedProgress * 100);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.barContainer}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${percentage}%` }]} />
        </View>
        {(showPercentage || label) && (
          <Text style={styles.label}>{label ?? `${percentage}%`}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: colors.progressTrack,
    borderRadius: borderRadius.subtle,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.progressFill,
    borderRadius: borderRadius.subtle,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    minWidth: 40,
  },
});
