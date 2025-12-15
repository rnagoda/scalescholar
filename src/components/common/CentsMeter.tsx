import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fonts } from '@/src/theme';

interface CentsMeterProps {
  /** Cents deviation from target (-50 to +50) */
  cents: number | null;
  /** Whether the meter is active */
  isActive?: boolean;
}

/**
 * Visual meter showing pitch deviation in cents
 * Shows flat (negative) on left, sharp (positive) on right
 */
export const CentsMeter: React.FC<CentsMeterProps> = ({
  cents,
  isActive = true,
}) => {
  // Clamp cents to -50 to +50 range
  const clampedCents = cents !== null ? Math.max(-50, Math.min(50, cents)) : 0;

  // Calculate needle position (0% = -50 cents, 50% = 0 cents, 100% = +50 cents)
  const needlePosition = ((clampedCents + 50) / 100) * 100;

  // Determine color based on how in-tune the pitch is
  const getColor = () => {
    if (cents === null || !isActive) return colors.textMuted;
    const absCents = Math.abs(clampedCents);
    if (absCents <= 5) return colors.accentGreen; // In tune
    if (absCents <= 15) return '#FFD60A'; // Slightly off (yellow)
    return colors.accentPink; // Far off
  };

  const needleColor = getColor();

  return (
    <View style={styles.container}>
      {/* Labels */}
      <View style={styles.labelsRow}>
        <Text style={styles.flatLabel}>♭</Text>
        <View style={styles.tickMarks}>
          <Text style={styles.tickLabel}>-50</Text>
          <Text style={styles.tickLabel}>-25</Text>
          <Text style={[styles.tickLabel, styles.centerTick]}>0</Text>
          <Text style={styles.tickLabel}>+25</Text>
          <Text style={styles.tickLabel}>+50</Text>
        </View>
        <Text style={styles.sharpLabel}>♯</Text>
      </View>

      {/* Meter track */}
      <View style={styles.meterContainer}>
        <View style={styles.track}>
          {/* Center zone indicator (in-tune zone) */}
          <View style={styles.centerZone} />

          {/* Needle */}
          {isActive && cents !== null && (
            <View
              style={[
                styles.needle,
                {
                  left: `${needlePosition}%`,
                  backgroundColor: needleColor,
                },
              ]}
            />
          )}
        </View>
      </View>

      {/* Cents value */}
      <View style={styles.valueRow}>
        {cents !== null && isActive ? (
          <Text style={[styles.centsValue, { color: needleColor }]}>
            {cents >= 0 ? '+' : ''}{cents}¢
          </Text>
        ) : (
          <Text style={styles.centsPlaceholder}>--¢</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: spacing.md,
  },
  labelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  flatLabel: {
    fontFamily: fonts.mono,
    fontSize: 18,
    color: colors.textSecondary,
    width: 24,
    textAlign: 'center',
  },
  sharpLabel: {
    fontFamily: fonts.mono,
    fontSize: 18,
    color: colors.textSecondary,
    width: 24,
    textAlign: 'center',
  },
  tickMarks: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  tickLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textMuted,
  },
  centerTick: {
    color: colors.textSecondary,
  },
  meterContainer: {
    paddingHorizontal: 24, // Match label width
  },
  track: {
    height: 12,
    backgroundColor: colors.progressTrack,
    borderRadius: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  centerZone: {
    position: 'absolute',
    left: '45%',
    width: '10%',
    height: '100%',
    backgroundColor: colors.accentGreen + '30', // 30% opacity
  },
  needle: {
    position: 'absolute',
    width: 4,
    height: '100%',
    marginLeft: -2, // Center the needle
    borderRadius: 2,
  },
  valueRow: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  centsValue: {
    fontFamily: fonts.monoBold,
    fontSize: 16,
  },
  centsPlaceholder: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.textMuted,
  },
});
