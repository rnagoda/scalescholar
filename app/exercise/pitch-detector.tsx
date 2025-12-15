import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors, typography, spacing } from '@/src/theme';
import { ScreenHeader, BracketButton, Divider, CentsMeter } from '@/src/components/common';
import { PitchDisplay, ListenButton } from '@/src/components/pitchDetector';
import { usePitchDetectorStore } from '@/src/stores/usePitchDetectorStore';

export default function PitchDetectorExercise() {
  const router = useRouter();

  const {
    state,
    currentPitch,
    errorMessage,
    startListening,
    stopListening,
    reset,
  } = usePitchDetectorStore();

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

  // Get status message based on state
  const getStatusMessage = () => {
    switch (state) {
      case 'idle':
        return 'Tap to start listening';
      case 'requesting':
        return 'Requesting microphone access...';
      case 'listening':
        return currentPitch ? 'Listening...' : 'Waiting for sound...';
      case 'error':
        return errorMessage || 'An error occurred';
      default:
        return '';
    }
  };

  const isError = state === 'error';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="PITCH DETECTOR"
        rightContent={
          <BracketButton label="CLOSE" onPress={handleClose} />
        }
      />
      <Divider style={styles.divider} />

      <View style={styles.content}>
        {/* Pitch Display */}
        <View style={styles.displaySection}>
          <PitchDisplay
            pitch={currentPitch}
            isActive={state === 'listening'}
          />
        </View>

        {/* Cents Meter */}
        <View style={styles.meterSection}>
          <CentsMeter
            cents={currentPitch?.cents ?? null}
            isActive={state === 'listening'}
          />
        </View>

        {/* Listen Button */}
        <View style={styles.controlSection}>
          <ListenButton
            onPress={handleListenToggle}
            isListening={state === 'listening'}
            disabled={state === 'requesting'}
          />

          <Text style={[
            styles.statusText,
            isError && styles.errorText
          ]}>
            {getStatusMessage()}
          </Text>
        </View>

        {/* Info section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Sing or play a note to detect its pitch.
          </Text>
          <Text style={styles.infoText}>
            The meter shows how sharp (+) or flat (-) you are from the target note.
          </Text>
        </View>
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
