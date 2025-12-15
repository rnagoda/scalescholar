import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors, typography, spacing } from '@/src/theme';
import { ScreenHeader, BracketButton, Divider, CentsMeter } from '@/src/components/common';
import {
  PitchDisplay,
  ListenButton,
  ModeSelector,
  GuitarTunerDisplay,
} from '@/src/components/pitchDetector';
import { usePitchDetectorStore } from '@/src/stores/usePitchDetectorStore';
import { PitchDetectorMode, InstrumentType } from '@/src/types/guitarTuning';
import {
  getTuningById,
  getDefaultTuning,
  getNextTuning,
  getPreviousTuning,
  DEFAULT_INSTRUMENT,
} from '@/src/utils/instrumentTunings';
import { detectString } from '@/src/utils/stringDetection';

export default function PitchDetectorExercise() {
  const router = useRouter();

  // Mode, instrument, and tuning state
  const [mode, setMode] = useState<PitchDetectorMode>('free');
  const [selectedInstrument, setSelectedInstrument] = useState<InstrumentType>(DEFAULT_INSTRUMENT);
  const [selectedTuningId, setSelectedTuningId] = useState(() => getDefaultTuning(DEFAULT_INSTRUMENT).id);

  const {
    state,
    currentPitch,
    errorMessage,
    config,
    startListening,
    stopListening,
    reset,
  } = usePitchDetectorStore();

  // Get current tuning
  const currentTuning = useMemo(
    () => getTuningById(selectedTuningId) || getDefaultTuning(selectedInstrument),
    [selectedTuningId, selectedInstrument]
  );

  // Detect which string is being played (instrument mode only)
  const stringDetection = useMemo(() => {
    if (mode !== 'instrument' || !currentPitch) return null;
    return detectString(currentPitch.frequency, currentTuning, config.a4Frequency);
  }, [mode, currentPitch, currentTuning, config.a4Frequency]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  const handleListenToggle = useCallback(async () => {
    if (state === 'listening') {
      stopListening();
    } else {
      await startListening();
    }
  }, [state, startListening, stopListening]);

  const handleClose = useCallback(() => {
    reset();
    router.back();
  }, [reset, router]);

  const handleModeChange = useCallback((newMode: PitchDetectorMode) => {
    setMode(newMode);
  }, []);

  const handleInstrumentChange = useCallback((instrumentId: InstrumentType) => {
    setSelectedInstrument(instrumentId);
    // Reset to default tuning for the new instrument
    const defaultTuning = getDefaultTuning(instrumentId);
    setSelectedTuningId(defaultTuning.id);
  }, []);

  const handleNextTuning = useCallback(() => {
    const nextTuning = getNextTuning(selectedTuningId, selectedInstrument);
    setSelectedTuningId(nextTuning.id);
  }, [selectedTuningId, selectedInstrument]);

  const handlePreviousTuning = useCallback(() => {
    const prevTuning = getPreviousTuning(selectedTuningId, selectedInstrument);
    setSelectedTuningId(prevTuning.id);
  }, [selectedTuningId, selectedInstrument]);

  // Get status message based on state
  const getStatusMessage = () => {
    switch (state) {
      case 'idle':
        return 'Tap to start listening';
      case 'requesting':
        return 'Requesting microphone access...';
      case 'listening':
        if (mode === 'instrument') {
          return currentPitch
            ? stringDetection?.isInRange
              ? 'Listening...'
              : 'Out of range - play a string'
            : 'Waiting for sound...';
        }
        return currentPitch ? 'Listening...' : 'Waiting for sound...';
      case 'error':
        return errorMessage || 'An error occurred';
      default:
        return '';
    }
  };

  const isError = state === 'error';
  const isListening = state === 'listening';

  // For instrument mode, use cents from string detection
  const displayCents = mode === 'instrument' && stringDetection?.isInRange
    ? stringDetection.centsFromTarget
    : currentPitch?.cents ?? null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="PITCH DETECTOR"
        rightContent={
          <BracketButton label="CLOSE" onPress={handleClose} />
        }
      />
      <Divider style={styles.divider} />

      {/* Mode Selector */}
      <ModeSelector mode={mode} onModeChange={handleModeChange} />
      <Divider style={styles.divider} />

      <View style={styles.content}>
        {/* Instrument Mode Display */}
        {mode === 'instrument' && (
          <GuitarTunerDisplay
            tuning={currentTuning}
            selectedInstrument={selectedInstrument}
            detectionResult={stringDetection}
            isListening={isListening}
            onInstrumentChange={handleInstrumentChange}
            onPreviousTuning={handlePreviousTuning}
            onNextTuning={handleNextTuning}
          />
        )}

        {/* Pitch Display */}
        <View style={[styles.displaySection, mode === 'instrument' && styles.compactDisplay]}>
          <PitchDisplay
            pitch={currentPitch}
            isActive={isListening}
          />
        </View>

        {/* Cents Meter */}
        <View style={styles.meterSection}>
          <CentsMeter
            cents={displayCents}
            isActive={isListening}
          />
        </View>

        {/* Listen Button */}
        <View style={styles.controlSection}>
          <ListenButton
            onPress={handleListenToggle}
            isListening={isListening}
            disabled={state === 'requesting'}
          />

          <Text style={[
            styles.statusText,
            isError && styles.errorText
          ]}>
            {getStatusMessage()}
          </Text>
        </View>

        {/* Info section - only in free mode */}
        {mode === 'free' && (
          <View style={styles.infoSection}>
            <Text style={styles.infoText}>
              Sing or play a note to detect its pitch.
            </Text>
            <Text style={styles.infoText}>
              The meter shows how sharp (+) or flat (-) you are from the target note.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  divider: {
    marginVertical: 0,
    marginHorizontal: spacing.lg,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  displaySection: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  compactDisplay: {
    paddingVertical: spacing.md,
  },
  meterSection: {
    paddingVertical: spacing.lg,
  },
  controlSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  statusText: {
    ...typography.label,
    fontSize: 12,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  errorText: {
    color: colors.accentPink,
  },
  infoSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: spacing.xl,
  },
  infoText: {
    ...typography.label,
    fontSize: 12,
    textAlign: 'center',
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
});
