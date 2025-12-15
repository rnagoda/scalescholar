import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fonts } from '@/src/theme';
import { midiToNoteName } from '@/src/utils/music';

interface RangeDisplayProps {
  /** Lowest detected note (MIDI) */
  lowestNote: number | null;
  /** Highest detected note (MIDI) */
  highestNote: number | null;
  /** Currently detected note (MIDI) */
  currentNote?: number | null;
  /** Show octave count */
  showOctaves?: boolean;
  /** Compact mode */
  compact?: boolean;
}

/**
 * Display detected vocal range
 */
export const RangeDisplay: React.FC<RangeDisplayProps> = ({
  lowestNote,
  highestNote,
  currentNote,
  showOctaves = true,
  compact = false,
}) => {
  const lowName = lowestNote !== null ? midiToNoteName(lowestNote) : '--';
  const highName = highestNote !== null ? midiToNoteName(highestNote) : '--';
  const currentName = currentNote != null ? midiToNoteName(currentNote) : null;

  const octaves =
    lowestNote !== null && highestNote !== null
      ? Math.round(((highestNote - lowestNote) / 12) * 10) / 10
      : null;

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactRange}>
          {lowName} - {highName}
        </Text>
        {showOctaves && octaves !== null && (
          <Text style={styles.compactOctaves}>
            ({octaves} oct)
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Current note (if listening) */}
      {currentName && (
        <View style={styles.currentSection}>
          <Text style={styles.currentLabel}>CURRENT</Text>
          <Text style={styles.currentNote}>{currentName}</Text>
        </View>
      )}

      {/* Range display */}
      <View style={styles.rangeSection}>
        <View style={styles.noteBox}>
          <Text style={styles.noteLabel}>LOWEST</Text>
          <Text style={[styles.noteValue, lowestNote !== null && styles.noteActive]}>
            {lowName}
          </Text>
        </View>

        <View style={styles.rangeConnector}>
          <View style={styles.connectorLine} />
          {showOctaves && octaves !== null && (
            <Text style={styles.octaveText}>{octaves} octaves</Text>
          )}
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteLabel}>HIGHEST</Text>
          <Text style={[styles.noteValue, highestNote !== null && styles.noteActive]}>
            {highName}
          </Text>
        </View>
      </View>
    </View>
  );
};

/**
 * Single note display for assessment steps
 */
export const NoteDisplay: React.FC<{
  label: string;
  note: number | null;
  isActive?: boolean;
}> = ({ label, note, isActive = false }) => {
  const noteName = note !== null ? midiToNoteName(note) : '--';

  return (
    <View style={styles.singleNoteContainer}>
      <Text style={styles.singleNoteLabel}>{label}</Text>
      <Text style={[styles.singleNoteValue, isActive && styles.singleNoteActive]}>
        {noteName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  currentSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  currentLabel: {
    fontFamily: fonts.monoBold,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  currentNote: {
    fontFamily: fonts.monoBold,
    fontSize: 48,
    color: colors.accentGreen,
    letterSpacing: 2,
  },
  rangeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteBox: {
    alignItems: 'center',
    minWidth: 80,
  },
  noteLabel: {
    fontFamily: fonts.monoBold,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  noteValue: {
    fontFamily: fonts.monoBold,
    fontSize: 28,
    color: colors.textMuted,
  },
  noteActive: {
    color: colors.textPrimary,
  },
  rangeConnector: {
    alignItems: 'center',
    marginHorizontal: spacing.lg,
  },
  connectorLine: {
    height: 2,
    width: 60,
    backgroundColor: colors.textMuted,
  },
  octaveText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  compactRange: {
    fontFamily: fonts.monoBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  compactOctaves: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
  },
  // Single note styles
  singleNoteContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  singleNoteLabel: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  singleNoteValue: {
    fontFamily: fonts.monoBold,
    fontSize: 64,
    color: colors.textMuted,
  },
  singleNoteActive: {
    color: colors.accentGreen,
  },
});
