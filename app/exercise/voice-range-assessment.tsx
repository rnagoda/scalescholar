import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors, typography, spacing, fonts } from '@/src/theme';
import { ScreenHeader, BracketButton, Divider, Card } from '@/src/components/common';
import {
  VolumeMeter,
  AssessmentProgress,
  NoteDisplay,
} from '@/src/components/voiceTrainer';
import { useVoiceProfileStore } from '@/src/stores/useVoiceProfileStore';
import { midiToNoteName } from '@/src/utils/music';
import { VRPAssessmentStep } from '@/src/types/voiceAnalyzer';

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

  const handleSaveAndFinish = useCallback(async () => {
    await saveProfile();
    router.back();
  }, [saveProfile, router]);

  const handleRestartAssessment = useCallback(() => {
    resetAssessment();
    startAssessment();
  }, [resetAssessment, startAssessment]);

  // Navigation helpers
  const getPreviousStep = (step: VRPAssessmentStep): VRPAssessmentStep | null => {
    switch (step) {
      case 'lowest': return 'intro';
      case 'highest': return 'lowest';
      case 'comfortable_low': return 'highest';
      case 'comfortable_high': return 'comfortable_low';
      case 'results': return 'comfortable_high';
      default: return null;
    }
  };

  const handleGoBack = useCallback(() => {
    const prevStep = getPreviousStep(assessmentStep);
    if (prevStep) {
      stopListening();
      setAssessmentStep(prevStep);
    }
  }, [assessmentStep, stopListening, setAssessmentStep]);

  const canGoBack = getPreviousStep(assessmentStep) !== null;

  // Render content based on current step
  const renderStepContent = () => {
    switch (assessmentStep) {
      case 'intro':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle} testID="voice-range-intro-title">Find Your Vocal Range</Text>
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
                testID="begin-button"
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

            {/* Always show NOW section to prevent layout jumping */}
            <View style={styles.currentPitch}>
              <Text style={styles.currentPitchLabel}>NOW</Text>
              <Text style={[
                styles.currentPitchValue,
                currentPitch === null && styles.currentPitchPlaceholder
              ]}>
                {currentPitch !== null ? midiToNoteName(currentPitch) : '--'}
              </Text>
            </View>

            <VolumeMeter
              amplitude={currentAmplitude !== null ? { rms: 0, db: currentAmplitude, peak: 0 } : null}
              isActive={isListening}
            />

            <View style={styles.actionSection}>
              <BracketButton
                label="<--"
                onPress={handleGoBack}
                color={colors.textSecondary}
              />

              {!isListening ? (
                <BracketButton
                  label="START LISTENING"
                  onPress={handleStartListening}
                  color={colors.accentGreen}
                />
              ) : (
                <BracketButton
                  label="CONFIRM LOWEST"
                  onPress={confirmLowest}
                  color={detectedLowest !== null ? colors.textPrimary : colors.textMuted}
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

            {/* Always show NOW section to prevent layout jumping */}
            <View style={styles.currentPitch}>
              <Text style={styles.currentPitchLabel}>NOW</Text>
              <Text style={[
                styles.currentPitchValue,
                currentPitch === null && styles.currentPitchPlaceholder
              ]}>
                {currentPitch !== null ? midiToNoteName(currentPitch) : '--'}
              </Text>
            </View>

            <VolumeMeter
              amplitude={currentAmplitude !== null ? { rms: 0, db: currentAmplitude, peak: 0 } : null}
              isActive={isListening}
            />

            <View style={styles.actionSection}>
              <BracketButton
                label="<--"
                onPress={handleGoBack}
                color={colors.textSecondary}
              />

              {!isListening ? (
                <BracketButton
                  label="START LISTENING"
                  onPress={handleStartListening}
                  color={colors.accentGreen}
                />
              ) : (
                <BracketButton
                  label="CONFIRM HIGHEST"
                  onPress={confirmHighest}
                  color={detectedHighest !== null ? colors.textPrimary : colors.textMuted}
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
              isActive={currentPitch !== null || detectedComfortLow !== null}
            />

            {/* Always show NOW section to prevent layout jumping */}
            <View style={styles.currentPitch}>
              <Text style={styles.currentPitchLabel}>NOW</Text>
              <Text style={[
                styles.currentPitchValue,
                currentPitch === null && styles.currentPitchPlaceholder
              ]}>
                {currentPitch !== null ? midiToNoteName(currentPitch) : '--'}
              </Text>
            </View>

            <VolumeMeter
              amplitude={currentAmplitude !== null ? { rms: 0, db: currentAmplitude, peak: 0 } : null}
              isActive={isListening}
            />

            <View style={styles.actionSection}>
              <BracketButton
                label="<--"
                onPress={handleGoBack}
                color={colors.textSecondary}
              />

              {!isListening ? (
                <BracketButton
                  label="START LISTENING"
                  onPress={handleStartListening}
                  color={colors.accentGreen}
                />
              ) : (
                <BracketButton
                  label="CONFIRM"
                  onPress={confirmComfortableLow}
                  color={colors.textPrimary}
                />
              )}
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
              isActive={currentPitch !== null || detectedComfortHigh !== null}
            />

            {/* Always show NOW section to prevent layout jumping */}
            <View style={styles.currentPitch}>
              <Text style={styles.currentPitchLabel}>NOW</Text>
              <Text style={[
                styles.currentPitchValue,
                currentPitch === null && styles.currentPitchPlaceholder
              ]}>
                {currentPitch !== null ? midiToNoteName(currentPitch) : '--'}
              </Text>
            </View>

            <VolumeMeter
              amplitude={currentAmplitude !== null ? { rms: 0, db: currentAmplitude, peak: 0 } : null}
              isActive={isListening}
            />

            <View style={styles.actionSection}>
              <BracketButton
                label="<--"
                onPress={handleGoBack}
                color={colors.textSecondary}
              />

              {!isListening ? (
                <BracketButton
                  label="START LISTENING"
                  onPress={handleStartListening}
                  color={colors.accentGreen}
                />
              ) : (
                <BracketButton
                  label="CONFIRM"
                  onPress={confirmComfortableHigh}
                  color={colors.textPrimary}
                />
              )}
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
                label="RESTART"
                onPress={handleRestartAssessment}
                color={colors.textSecondary}
              />
              <BracketButton
                label={isLoading ? 'SAVING...' : 'SAVE & TRAIN'}
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
        testID="voice-range-header"
        rightContent={
          <BracketButton label="CLOSE" onPress={handleClose} testID="voice-range-close-button" />
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
    minHeight: 50, // Ensure consistent height
  },
  currentPitchLabel: {
    ...typography.label,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  currentPitchValue: {
    fontFamily: fonts.monoBold,
    fontSize: 32,
    color: colors.accentGreen,
  },
  currentPitchPlaceholder: {
    color: colors.textMuted,
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
    fontFamily: fonts.monoBold,
    fontSize: 18,
    color: colors.accentGreen,
  },
  resultValueSecondary: {
    fontFamily: fonts.monoBold,
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
