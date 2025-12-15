import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../theme';
import { getAccuracyLevel, getTuningDirection } from '../../utils/stringDetection';

interface TuningDirectionProps {
  cents: number;
  isActive: boolean;
}

export const TuningDirection: React.FC<TuningDirectionProps> = ({
  cents,
  isActive,
}) => {
  if (!isActive) {
    return (
      <View style={styles.container}>
        <Text style={[styles.directionText, { color: colors.textMuted }]}>
          ---
        </Text>
      </View>
    );
  }

  const direction = getTuningDirection(cents);
  const accuracy = getAccuracyLevel(cents);

  // Determine color based on accuracy
  const getColor = () => {
    switch (accuracy) {
      case 'perfect':
        return colors.accentGreen;
      case 'close':
        return '#FFD60A'; // Yellow
      case 'off':
        return colors.accentPink;
    }
  };

  // Determine display text
  const getText = () => {
    switch (direction) {
      case 'in-tune':
        return 'IN TUNE';
      case 'flat':
        return 'FLAT';
      case 'sharp':
        return 'SHARP';
    }
  };

  // Determine arrow
  const getArrow = () => {
    switch (direction) {
      case 'in-tune':
        return '';
      case 'flat':
        return ' \u2193'; // Down arrow
      case 'sharp':
        return ' \u2191'; // Up arrow
    }
  };

  const color = getColor();
  const text = getText();
  const arrow = getArrow();

  return (
    <View style={styles.container}>
      <Text style={[styles.directionText, { color }]}>
        {text}{arrow}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  directionText: {
    fontFamily: fonts.monoBold,
    fontSize: 18,
    letterSpacing: 2,
  },
});
