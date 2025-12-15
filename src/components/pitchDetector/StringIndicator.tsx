import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../theme';
import { GuitarTuning } from '../../types/guitarTuning';

interface StringIndicatorProps {
  tuning: GuitarTuning;
  activeString: number | null;
  isActive: boolean;
}

export const StringIndicator: React.FC<StringIndicatorProps> = ({
  tuning,
  activeString,
  isActive,
}) => {
  // Strings are stored low to high (6,5,4,3,2,1), display left to right
  const stringsToDisplay = [...tuning.strings].reverse();

  return (
    <View style={styles.container}>
      {/* String numbers row */}
      <View style={styles.row}>
        {stringsToDisplay.map((string) => {
          const isSelected = isActive && activeString === string.stringNumber;
          return (
            <View key={string.stringNumber} style={styles.stringColumn}>
              <Text
                style={[
                  styles.stringNumber,
                  isSelected && styles.activeText,
                ]}
              >
                {string.stringNumber}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Note names row */}
      <View style={styles.row}>
        {stringsToDisplay.map((string) => {
          const isSelected = isActive && activeString === string.stringNumber;
          // Extract just the note letter (without octave) for display
          const noteLetter = string.noteName.replace(/[0-9]/g, '');
          return (
            <View key={string.stringNumber} style={styles.stringColumn}>
              <Text
                style={[
                  styles.noteName,
                  isSelected && styles.activeText,
                ]}
              >
                {noteLetter}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Indicator marks row */}
      <View style={styles.row}>
        {stringsToDisplay.map((string) => {
          const isSelected = isActive && activeString === string.stringNumber;
          return (
            <View key={string.stringNumber} style={styles.stringColumn}>
              <Text
                style={[
                  styles.indicator,
                  isSelected && styles.activeIndicator,
                ]}
              >
                {isSelected ? '===' : '---'}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Active string label */}
      {isActive && activeString && (
        <View style={styles.labelContainer}>
          <Text style={styles.activeLabel}>[ String {activeString} ]</Text>
        </View>
      )}

      {!isActive && (
        <View style={styles.labelContainer}>
          <Text style={styles.inactiveLabel}>Play a string...</Text>
        </View>
      )}

      {isActive && !activeString && (
        <View style={styles.labelContainer}>
          <Text style={styles.inactiveLabel}>Out of range</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  stringColumn: {
    width: 44,
    alignItems: 'center',
  },
  stringNumber: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  noteName: {
    fontFamily: fonts.monoBold,
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  indicator: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textMuted,
  },
  activeText: {
    color: colors.accentGreen,
  },
  activeIndicator: {
    color: colors.accentGreen,
  },
  labelContainer: {
    marginTop: spacing.md,
  },
  activeLabel: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.accentGreen,
  },
  inactiveLabel: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textMuted,
  },
});
