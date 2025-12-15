import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../theme';
import { BracketButton } from '../common';
import { GuitarTuning } from '../../types/guitarTuning';

interface TuningSelectorProps {
  tuning: GuitarTuning;
  onPrevious: () => void;
  onNext: () => void;
}

export const TuningSelector: React.FC<TuningSelectorProps> = ({
  tuning,
  onPrevious,
  onNext,
}) => {
  return (
    <View style={styles.container}>
      <BracketButton label="<" onPress={onPrevious} />
      <View style={styles.tuningNameContainer}>
        <Text style={styles.tuningName}>{tuning.name.toUpperCase()}</Text>
      </View>
      <BracketButton label=">" onPress={onNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  tuningNameContainer: {
    minWidth: 160,
    alignItems: 'center',
  },
  tuningName: {
    fontFamily: fonts.monoBold,
    fontSize: 16,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
});
