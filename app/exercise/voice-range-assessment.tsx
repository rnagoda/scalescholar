import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors, typography, spacing } from '@/src/theme';
import { ScreenHeader, BracketButton, Divider, Card } from '@/src/components/common';
import {
  VolumeMeter,
  AssessmentProgress,
  RangeDisplay,
  NoteDisplay,
} from '@/src/components/voiceTrainer';
import { useVoiceProfileStore } from '@/src/stores/useVoiceProfileStore';
import { midiToNoteName } from '@/src/utils/music';

export default function VoiceRangeAssessment() {
  const router = useRouter();

  const {
    assessmentStep,
    isListening,
    isLoading,
    errorMessage,
    currentPitch,
    currentAmplitude,
    detectedLowest,
    detectedHighest,
    detectedComfortLow,
    detectedComfortHigh,
    startAssessment,
    setAssessmentStep,
    startListening,
    stopListening,
    confirmLowest,
    confirmHighest,
    confirmComfortableLow,
    confirmComfortableHigh,
    saveProfile,
    resetAssessment,
  } = useVoiceProfileStore();

  // Start assessment on mount
  useEffect(() => {
    startAssessment();
    return () => {
      stopListening();
    };
  }, []);

  const handleClose = useCallback(() => {
    resetAssessment();
    router.back();
  }, [resetAssessment, router]);

  const handleStartListening = useCallback(async () => {
    await startListening();
  }, [startListening]);

  const handleStopListening = useCallback(() => {
    stopListening();
  }, [stopListening]);

  const handleSaveAndFinish = useCallback(async () => {
    await saveProfile();
    router.back();
  }, [saveProfile, router]);

  // Render content based on current step
  const renderStepContent = () => {
    switch (assessmentStep) {
      case 'intro':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Find Your Vocal Range</Text>
            <Text style={styles.stepDescription}>
              This quick assessment will determine your singing range.
              We'll find your lowest note, highest note, and comfortable range.
            </Text>
            <Text style={styles.stepDescription}>
              You'll need a quiet environment and about 2 minutes.
            </Text>

            <View style={styles.actionSection}>
              <BracketButton
                label="BEGIN"
                onPress={() => setAssessmentStep('lowest')}
                color={colors.accentGreen}
              />
            </View>
          </View>
        );

      case 'lowest':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Find Your Lowest Note</Text>
            <Text style={styles.stepDescription}>
              Sing "Ahh" and slowly go lower until you reach your lowest comfortable note.
            </Text>

            <NoteDisplay
              label="LOWEST DETECTED"
              note={detectedLowest}
              isActive={detectedLowest !== null}
            />

            {currentPitch !== null && (
              <View style={styles.currentPitch}>
                <Text style={styles.currentPitchLabel}>NOW</Text>
                <Text style={styles.currentPitchValue}>
                  {midiToNoteName(currentPitch)}
                </Text>
              </View>
            )}

            <VolumeMeter
              amplitude={currentAmplitude !== null ? { rms: 0, db: currentAmplitude, peak: 0 } : null}
              isActive={isListening}
            />

            <View style={styles.actionSection}>
              {!isListening ? (
                <BracketButton
                  label="START LISTENING"
                  onPress={handleStartListening}
                  color={colors.accentGreen}
                />
              ) : (
                <BracketButton
                  label="STOP"
                  onPress={handleStopListening}
                  color={colors.accentPink}
                />
              )}

              {detectedLowest !== null && (
                <BracketButton
                  label="CONFIRM LOWEST"
                  onPress={confirmLowest}
                  color={colors.textPrimary}
                />
              )}
            </View>
          </View>
        );

      case 'highest':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Find Your Highest Note</Text>
            <Text style={styles.stepDescription}>
              Now sing "Ahh" and slowly go higher until you reach your highest comfortable note.
            </Text>

            <NoteDisplay
              label="HIGHEST DETECTED"
              note={detectedHighest}
              isActive={detectedHighest !== null}
            />

            {currentPitch !== null && (
              <View style={styles.currentPitch}>
                <Text style={styles.currentPitchLabel}>NOW</Text>
                <Text style={styles.currentPitchValue}>
                  {midiToNoteName(currentPitch)}
                </Text>
              </View>
            )}

            <VolumeMeter
              amplitude={currentAmplitude !== null ? { rms: 0, db: currentAmplitude, peak: 0 } : null}
              isActive={isListening}
            />

            <View style={styles.actionSection}>
              {!isListening ? (
                <BracketButton
                  label="START LISTENING"
                  onPress={handleStartListening}
                  color={colors.accentGreen}
                />
              ) : (
                <BracketButton
                  label="STOP"
                  onPress={handleStopListening}
                  color={colors.accentPink}
                />
              )}

              {detectedHighest !== null && (
                <BracketButton
                  label="CONFIRM HIGHEST"
                  onPress={confirmHighest}
                  color={colors.textPrimary}
                />
              )}
            </View>
          </View>
        );

      case 'comfortable_low':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Comfortable Low Range</Text>
            <Text style={styles.stepDescription}>
              Sing a low note that feels comfortable and sustainable.
              Don't strain - this should feel easy.
            </Text>

            <NoteDisplay
              label="COMFORTABLE LOW"
              note={detectedComfortLow ?? currentPitch}
              isActive={currentPitch !== null}
            />

            <VolumeMeter
              amplitude={currentAmplitude !== null ? { rms: 0, db: currentAmplitude, peak: 0 } : null}
              isActive={isListening}
            />

            <View style={styles.actionSection}>
              {!isListening ? (
                <BracketButton
                  label="START LISTENING"
                  onPress={handleStartListening}
                  color={colors.accentGreen}
                />
              ) : (
                <BracketButton
                  label="STOP"
                  onPress={handleStopListening}
                  color={colors.accentPink}
                />
              )}

              <BracketButton
                label="CONFIRM"
                onPress={confirmComfortableLow}
                color={colors.textPrimary}
              />
            </View>
          </View>
        );

      case 'comfortable_high':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Comfortable High Range</Text>
            <Text style={styles.stepDescription}>
              Sing a high note that feels comfortable and sustainable.
              Don't strain - this should feel easy.
            </Text>

            <NoteDisplay
              label="COMFORTABLE HIGH"
              note={detectedComfortHigh ?? currentPitch}
              isActive={currentPitch !== null}
            />

            <VolumeMeter
              amplitude={currentAmplitude !== null ? { rms: 0, db: currentAmplitude, peak: 0 } : null}
              isActive={isListening}
            />

            <View style={styles.actionSection}>
              {!isListening ? (
                <BracketButton
                  label="START LISTENING"
                  onPress={handleStartListening}
                  color={colors.accentGreen}
                />
              ) : (
                <BracketButton
                  label="STOP"
                  onPress={handleStopListening}
                  color={colors.accentPink}
                />
              )}

              <BracketButton
                label="CONFIRM"
                onPress={confirmComfortableHigh}
                color={colors.textPrimary}
              />
            </View>
          </View>
        );

      case 'results':
        const octaves =
          detectedLowest !== null && detectedHighest !== null
            ? Math.round(((detectedHighest - detectedLowest) / 12) * 10) / 10
            : 0;

        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Your Vocal Range</Text>

            <Card style={styles.resultsCard}>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>FULL RANGE</Text>
                <Text style={styles.resultValue}>
                  {detectedLowest !== null ? midiToNoteName(detectedLowest) : '--'} -{' '}
                  {detectedHighest !== null ? midiToNoteName(detectedHighest) : '--'}
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>OCTAVES</Text>
                <Text style={styles.resultValue}>{octaves}</Text>
              </View>

              <Divider style={styles.resultDivider} />

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>COMFORTABLE</Text>
                <Text style={styles.resultValueSecondary}>
                  {detectedComfortLow !== null ? midiToNoteName(detectedComfortLow) : '--'} -{' '}
                  {detectedComfortHigh !== null ? midiToNoteName(detectedComfortHigh) : '--'}
                </Text>
              </View>
            </Card>

            <Text style={styles.resultsNote}>
              Exercises will use your comfortable range by default.
            </Text>

            <View style={styles.actionSection}>
              <BracketButton
                label={isLoading ? 'SAVING...' : 'SAVE & START TRAINING'}
                onPress={handleSaveAndFinish}
                color={colors.accentGreen}
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="VOICE RANGE"
        rightContent={
          <BracketButton label="CLOSE" onPress={handleClose} />
        }
      />
      <Divider style={styles.divider} />

      {/* Progress indicator */}
      <AssessmentProgress currentStep={assessmentStep} />
      <Divider style={styles.divider} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {renderStepContent()}

        {/* Error message */}
        {errorMessage && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    ...typography.cardTitle,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  stepDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  currentPitch: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  currentPitchLabel: {
    ...typography.label,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  currentPitchValue: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 32,
    color: colors.accentGreen,
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.xl,
    flexWrap: 'wrap',
  },
  resultsCard: {
    marginVertical: spacing.lg,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  resultLabel: {
    ...typography.label,
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  resultValue: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 18,
    color: colors.accentGreen,
  },
  resultValueSecondary: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  resultDivider: {
    marginVertical: spacing.sm,
    marginHorizontal: 0,
  },
  resultsNote: {
    ...typography.label,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.label,
    color: colors.accentPink,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
