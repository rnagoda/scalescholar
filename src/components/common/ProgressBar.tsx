import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../../theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  style?: ViewStyle;
  trackColor?: string;
  fillColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  style,
  trackColor = colors.progressTrack,
  fillColor = colors.progressFill,
}) => {
  const clampedProgress = Math.min(1, Math.max(0, progress));

  return (
    <View style={[styles.track, { backgroundColor: trackColor }, style]}>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: fillColor,
            width: `${clampedProgress * 100}%`,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
