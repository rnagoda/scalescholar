import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../../theme';
import { InstrumentTuning, InstrumentType, StringDetectionResult } from '../../types/guitarTuning';
import { InstrumentSelector } from './InstrumentSelector';
import { TuningSelector } from './TuningSelector';
import { StringIndicator } from './StringIndicator';
import { TuningDirection } from './TuningDirection';

interface GuitarTunerDisplayProps {
  tuning: InstrumentTuning;
  selectedInstrument: InstrumentType;
  detectionResult: StringDetectionResult | null;
  isListening: boolean;
  onInstrumentChange: (instrumentId: InstrumentType) => void;
  onPreviousTuning: () => void;
  onNextTuning: () => void;
}

export const GuitarTunerDisplay: React.FC<GuitarTunerDisplayProps> = ({
  tuning,
  selectedInstrument,
  detectionResult,
  isListening,
  onInstrumentChange,
  onPreviousTuning,
  onNextTuning,
}) => {
  const hasValidDetection = detectionResult?.isInRange ?? false;

  return (
    <View style={styles.container}>
      {/* Instrument Selector */}
      <InstrumentSelector
        selectedInstrument={selectedInstrument}
        onInstrumentChange={onInstrumentChange}
      />

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
