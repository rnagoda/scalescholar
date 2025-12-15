import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';
import { BracketButton } from '../common';
import { PitchDetectorMode } from '../../types/guitarTuning';

interface ModeSelectorProps {
  mode: PitchDetectorMode;
  onModeChange: (mode: PitchDetectorMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onModeChange }) => {
  return (
    <View style={styles.container}>
      <BracketButton
        label="FREE"
        onPress={() => onModeChange('free')}
        color={mode === 'free' ? colors.accentGreen : colors.textMuted}
      />
      <BracketButton
        label="INSTRUMENT"
        onPress={() => onModeChange('instrument')}
        color={mode === 'instrument' ? colors.accentGreen : colors.textMuted}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xl,
  },
});
