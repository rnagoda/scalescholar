import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fonts } from '@/src/theme';
import { AmplitudeResult, DEFAULT_VOICE_THRESHOLDS } from '@/src/types/voiceAnalyzer';

interface VolumeMeterProps {
  /** Amplitude result from VoiceAnalyzer */
  amplitude: AmplitudeResult | null;
  /** Whether the meter is active/listening */
  isActive?: boolean;
  /** Minimum dB to display (default -60) */
  minDb?: number;
  /** Maximum dB to display (default 0) */
  maxDb?: number;
  /** Show numeric dB value */
  showValue?: boolean;
  /** Orientation: horizontal or vertical */
  orientation?: 'horizontal' | 'vertical';
  /** Size variant */
  size?: 'compact' | 'normal';
}

/**
 * Visual volume/amplitude meter for voice training
 * Shows current voice level with color-coded zones
 */
export const VolumeMeter: React.FC<VolumeMeterProps> = ({
  amplitude,
  isActive = true,
  minDb = -60,
  maxDb = 0,
  showValue = true,
  orientation = 'horizontal',
  size = 'normal',
}) => {
  // Calculate fill percentage (0-100)
  const fillPercent = useMemo(() => {
    if (!amplitude || !isActive) return 0;
    const db = Math.max(minDb, Math.min(maxDb, amplitude.db));
    return ((db - minDb) / (maxDb - minDb)) * 100;
  }, [amplitude, isActive, minDb, maxDb]);

  // Determine color based on volume level
  const barColor = useMemo(() => {
    if (!amplitude || !isActive) return colors.textMuted;
    const db = amplitude.db;

    // Too quiet (below voice threshold)
    if (db < DEFAULT_VOICE_THRESHOLDS.minVoiceDb) {
      return colors.textMuted;
    }
    // Good level for voice detection
    if (db >= -30 && db <= -10) {
      return colors.accentGreen;
    }
    // Acceptable range
    if (db >= -40 && db <= -5) {
      return '#FFD60A'; // Yellow
    }
    // Too loud (clipping risk)
    if (db > -5) {
      return colors.accentPink;
    }
    // Default - low but audible
    return colors.textSecondary;
  }, [amplitude, isActive]);

  // Status text
  const statusText = useMemo(() => {
    if (!amplitude || !isActive) return 'SILENT';
    const db = amplitude.db;

    if (db < DEFAULT_VOICE_THRESHOLDS.minVoiceDb) return 'TOO SOFT';
    if (db > -5) return 'TOO LOUD';
    if (db >= -30 && db <= -10) return 'GOOD';
    return 'OK';
  }, [amplitude, isActive]);

  const isHorizontal = orientation === 'horizontal';
  const isCompact = size === 'compact';

  return (
    <View style={[
      styles.container,
      isHorizontal ? styles.containerHorizontal : styles.containerVertical,
    ]}>
      {/* Label */}
      {!isCompact && (
        <Text style={styles.label}>VOLUME</Text>
      )}

      {/* Meter track */}
      <View style={[
        styles.track,
        isHorizontal ? styles.trackHorizontal : styles.trackVertical,
        isCompact && styles.trackCompact,
      ]}>
        {/* Threshold indicator line */}
        <View
          style={[
            styles.thresholdLine,
            isHorizontal
              ? {
                  left: `${((DEFAULT_VOICE_THRESHOLDS.minVoiceDb - minDb) / (maxDb - minDb)) * 100}%`,
                }
              : {
                  bottom: `${((DEFAULT_VOICE_THRESHOLDS.minVoiceDb - minDb) / (maxDb - minDb)) * 100}%`,
                },
          ]}
        />

        {/* Fill bar */}
        {isActive && amplitude && (
          <View
            style={[
              styles.fill,
              { backgroundColor: barColor },
              isHorizontal
                ? { width: `${fillPercent}%` }
                : { height: `${fillPercent}%` },
            ]}
          />
        )}

        {/* Peak indicator (brief flash at peak) */}
        {isActive && amplitude && amplitude.peak > 0.01 && (
          <View
            style={[
              styles.peakIndicator,
              isHorizontal
                ? {
                    left: `${Math.min(95, (20 * Math.log10(Math.max(amplitude.peak, 0.0001)) - minDb) / (maxDb - minDb) * 100)}%`,
                  }
                : {
                    bottom: `${Math.min(95, (20 * Math.log10(Math.max(amplitude.peak, 0.0001)) - minDb) / (maxDb - minDb) * 100)}%`,
                  },
            ]}
          />
        )}
      </View>

      {/* Value and status */}
      {showValue && (
        <View style={styles.valueContainer}>
          {amplitude && isActive ? (
            <>
              <Text style={[styles.dbValue, { color: barColor }]}>
                {amplitude.db.toFixed(0)} dB
              </Text>
              <Text style={[styles.status, { color: barColor }]}>
                {statusText}
              </Text>
            </>
          ) : (
            <Text style={styles.placeholder}>-- dB</Text>
          )}
        </View>
      )}
    </View>
  );
};

/**
 * Compact inline volume indicator (just a bar)
 */
export const VolumeIndicator: React.FC<{
  amplitude: AmplitudeResult | null;
  isActive?: boolean;
}> = ({ amplitude, isActive = true }) => {
  const fillPercent = useMemo(() => {
    if (!amplitude || !isActive) return 0;
    const db = Math.max(-60, Math.min(0, amplitude.db));
    return ((db + 60) / 60) * 100;
  }, [amplitude, isActive]);

  const barColor = useMemo(() => {
    if (!amplitude || !isActive) return colors.textMuted;
    if (amplitude.db < DEFAULT_VOICE_THRESHOLDS.minVoiceDb) return colors.textMuted;
    if (amplitude.db >= -30 && amplitude.db <= -10) return colors.accentGreen;
    if (amplitude.db > -5) return colors.accentPink;
    return colors.textSecondary;
  }, [amplitude, isActive]);

  return (
    <View style={styles.indicatorTrack}>
      <View
        style={[
          styles.indicatorFill,
          { width: `${fillPercent}%`, backgroundColor: barColor },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
  },
  containerHorizontal: {
    width: '100%',
  },
  containerVertical: {
    height: 200,
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.monoBold,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  track: {
    backgroundColor: colors.progressTrack,
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  trackHorizontal: {
    height: 16,
    width: '100%',
  },
  trackVertical: {
    width: 24,
    flex: 1,
  },
  trackCompact: {
    height: 8,
  },
  thresholdLine: {
    position: 'absolute',
    backgroundColor: colors.textMuted,
    opacity: 0.5,
  },
  fill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderRadius: 4,
  },
  peakIndicator: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: colors.textPrimary,
    opacity: 0.7,
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  dbValue: {
    fontFamily: fonts.monoBold,
    fontSize: 14,
  },
  status: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    letterSpacing: 1,
  },
  placeholder: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textMuted,
  },
  // Compact indicator styles
  indicatorTrack: {
    height: 6,
    width: 60,
    backgroundColor: colors.progressTrack,
    borderRadius: 3,
    overflow: 'hidden',
  },
  indicatorFill: {
    height: '100%',
    borderRadius: 3,
  },
});
