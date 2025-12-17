import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, fonts, spacing } from '../../theme';

interface TerminalProgressBarProps {
  progress: number; // 0 to 1
  showPercentage?: boolean;
  style?: ViewStyle;
}

/**
 * Terminal-styled progress bar that fills the full container width.
 * Uses graphical rendering (not ASCII characters) for proper responsive sizing.
 * Styled to match the retro terminal aesthetic.
 */
export const TerminalProgressBar: React.FC<TerminalProgressBarProps> = ({
  progress,
  showPercentage = true,
  style,
}) => {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const percentage = Math.round(clampedProgress * 100);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${clampedProgress * 100}%` },
          ]}
        />
      </View>
      {showPercentage && (
        <Text style={styles.percentage}>{percentage}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  track: {
    flex: 1,
    height: 10,
    backgroundColor: colors.progressTrack,
    borderRadius: 0, // Square corners for terminal aesthetic
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accentGreen,
    borderRadius: 0, // Square corners for terminal aesthetic
  },
  percentage: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    minWidth: 32, // Consistent width for percentage
    textAlign: 'right',
  },
});
