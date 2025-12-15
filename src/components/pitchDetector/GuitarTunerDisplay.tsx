import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../../theme';
import { GuitarTuning, StringDetectionResult } from '../../types/guitarTuning';
import { TuningSelector } from './TuningSelector';
import { StringIndicator } from './StringIndicator';
import { TuningDirection } from './TuningDirection';

interface GuitarTunerDisplayProps {
  tuning: GuitarTuning;
  detectionResult: StringDetectionResult | null;
  isListening: boolean;
  onPreviousTuning: () => void;
  onNextTuning: () => void;
}

export const GuitarTunerDisplay: React.FC<GuitarTunerDisplayProps> = ({
  tuning,
  detectionResult,
  isListening,
  onPreviousTuning,
  onNextTuning,
}) => {
  const hasValidDetection = detectionResult?.isInRange ?? false;

  return (
    <View style={styles.container}>
      {/* Tuning Selector */}
      <TuningSelector
        tuning={tuning}
        onPrevious={onPreviousTuning}
        onNext={onNextTuning}
      />

      {/* String Indicator */}
      <StringIndicator
        tuning={tuning}
        activeString={detectionResult?.stringNumber ?? null}
        isActive={isListening && hasValidDetection}
      />

      {/* Tuning Direction */}
      <TuningDirection
        cents={detectionResult?.centsFromTarget ?? 0}
        isActive={isListening && hasValidDetection}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
});
