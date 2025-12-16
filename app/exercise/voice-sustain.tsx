import React, { useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors, typography, spacing, fonts } from '@/src/theme';
import { ScreenHeader, BracketButton, Divider, Card, ProgressBar } from '@/src/components/common';
import { VolumeMeter } from '@/src/components/voiceTrainer';
import { useVoiceTrainerStore } from '@/src/stores/useVoiceTrainerStore';
import { useVoiceProfileStore } from '@/src/stores/useVoiceProfileStore';
import { midiToNoteName } from '@/src/utils/music';
import { DEFAULT_VOICE_THRESHOLDS } from '@/src/types/voiceAnalyzer';

// Duration to hold note for sustain exercise (ms)
const SUSTAIN_DURATION = 3000;

export default function VoiceSustainExercise() {
  const router = useRouter();
  const sustainTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sustainStartRef = useRef<number | null>(null);
  const [sustainProgress, setSustainProgress] = React.useState(0);

  const {
    profile,
    isInitialized: profileInitialized,
    initialize: initializeProfile,
  } = useVoiceProfileStore();

  const {
    state,
    currentQuestion,
    targetNote,
    currentPitch,
    currentAmplitude,
    currentAccuracy,
    isOnTarget,
    timeOnTarget,
    sessionResults,
    questionIndex,
    questionsPerSession,
    startSession,
    playReference,
    startListening,
    stopListening,
    submitResult,
    nextQuestion,
    completeSession,
    resetSession,
    getProgress,
    getScore,
  } = useVoiceTrainerStore();

  // Initialize on mount
  useEffect(() => {
    const setup = async () => {
      if (!profileInitialized) {
        await initializeProfile();
      }

      const voiceProfile = useVoiceProfileStore.getState().profile;
      const availableNotes: number[] = [];

      if (voiceProfile) {
        // Use comfortable range
        for (let n = voiceProfile.comfortableLow; n <= voiceProfile.comfortableHigh; n++) {
          availableNotes.push(n);
        }
      }

      startSession('sustain', {
        questionsPerSession: 8,
        availableNotes,
      });
    };

    setup();

    return () => {
      if (sustainTimerRef.current) {
        clearInterval(sustainTimerRef.current);
      }
      resetSession();
    };
  }, []);

  // Track sustain progress
  useEffect(() => {
    if (state !== 'listening') {
      if (sustainTimerRef.current) {
        clearInterval(sustainTimerRef.current);
        sustainTimerRef.current = null;
      }
      sustainStartRef.current = null;
      setSustainProgress(0);
      return;
    }

    if (isOnTarget && sustainStartRef.current === null) {
      sustainStartRef.current = Date.now();
    } else if (!isOnTarget) {
      sustainStartRef.current = null;
      setSustainProgress(0);
    }

    // Update progress timer
    if (!sustainTimerRef.current) {
      sustainTimerRef.current = setInterval(() => {
        if (sustainStartRef.current === null) {
          setSustainProgress(0);
          return;
        }

        const elapsed = Date.now() - sustainStartRef.current;
        const progress = Math.min(1, elapsed / SUSTAIN_DURATION);
        setSustainProgress(progress);

        // Auto-submit when sustain is complete
        if (elapsed >= SUSTAIN_DURATION) {
          submitResult();
        }
      }, 50);
    }
  }, [state, isOnTarget, submitResult]);

  const handleClose = useCallback(() => {
    resetSession();
    router.back();
  }, [resetSession, router]);

  const handlePlayReference = useCallback(async () => {
    await playReference();
  }, [playReference]);

  const handleStartListening = useCallback(async () => {
    setSustainProgress(0);
    sustainStartRef.current = null;
    await startListening();
  }, [startListening]);

  const handleStopListening = useCallback(() => {
    stopListening();
  }, [stopListening]);

  const handleNext = useCallback(() => {
    setSustainProgress(0);
    nextQuestion();
  }, [nextQuestion]);

  const handleComplete = useCallback(async () => {
    await completeSession();
    router.back();
  }, [completeSession, router]);

  const progress = getProgress();
  const score = getScore();

  // Render based on state
  const renderContent = () => {
    if (state === 'complete') {
      return (
        <View style={styles.completeContainer}>
          <Text style={styles.completeTitle}>Session Complete!</Text>
          <Card style={styles.resultsCard}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>NOTES SUSTAINED</Text>
              <Text style={styles.resultValue}>
                {score.correct} / {progress.total}
              </Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>SUCCESS RATE</Text>
              <Text style={styles.resultValue}>
                {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
              </Text>
            </View>
          </Card>
          <View style={styles.completeActions}>
            <BracketButton
              label="DONE"
              onPress={handleComplete}
              color={colors.accentGreen}
            />
          </View>
        </View>
      );
    }

    if (state === 'feedback') {
      const lastResult = sessionResults[sessionResults.length - 1];
      const success = lastResult?.success ?? false;

      return (
        <View style={styles.feedbackContainer}>
          <Text style={[styles.feedbackTitle, success ? styles.successText : styles.failText]}>
            {success ? 'Well Done!' : 'Keep Trying!'}
          </Text>
          <Text style={styles.feedbackSubtitle}>
            {success
              ? `You sustained ${targetNote !== null ? midiToNoteName(targetNote) : '--'} for ${(SUSTAIN_DURATION / 1000).toFixed(0)} seconds!`
              : 'Try to hold the note steady longer'}
          </Text>

          <View style={styles.feedbackActions}>
            {questionIndex + 1 < questionsPerSession ? (
              <BracketButton
                label="NEXT NOTE"
                onPress={handleNext}
                color={colors.accentGreen}
              />
            ) : (
              <BracketButton
                label="VIEW RESULTS"
                onPress={() => useVoiceTrainerStore.setState({ state: 'complete' })}
                color={colors.accentGreen}
              />
            )}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.exerciseContainer}>
        {/* Progress */}
        <Text style={styles.progressText}>
          Note {progress.current} of {progress.total}
        </Text>

        {/* Target Note */}
        <View style={styles.targetContainer}>
          <Text style={styles.sectionLabel}>TARGET NOTE</Text>
          <Text style={styles.targetNote}>
            {targetNote !== null ? midiToNoteName(targetNote) : '--'}
          </Text>
          <Text style={styles.targetInstruction}>
            Hold for {(SUSTAIN_DURATION / 1000).toFixed(0)} seconds
          </Text>
        </View>

        {/* Sustain Progress Ring/Bar */}
        <View style={styles.sustainContainer}>
          <Text style={styles.sectionLabel}>SUSTAIN PROGRESS</Text>
          <View style={styles.sustainMeter}>
            <ProgressBar
              progress={sustainProgress}
              style={styles.sustainProgressBar}
              fillColor={sustainProgress >= 1 ? colors.accentGreen : isOnTarget ? colors.accentGreen : colors.textMuted}
            />
          </View>
          <Text style={styles.sustainTime}>
            {isOnTarget && sustainStartRef.current
              ? `${(sustainProgress * SUSTAIN_DURATION / 1000).toFixed(1)}s`
              : '0.0s'} / {(SUSTAIN_DURATION / 1000).toFixed(0)}s
          </Text>
        </View>

        {/* Current Detection */}
        <View style={styles.detectionContainer}>
          <Text style={styles.sectionLabel}>YOUR PITCH</Text>
          <Text
            style={[
              styles.currentPitchValue,
              currentPitch === null && styles.currentPitchPlaceholder,
              isOnTarget && styles.currentPitchOnTarget,
            ]}
          >
            {currentPitch !== null ? midiToNoteName(currentPitch) : '--'}
          </Text>
          {currentPitch !== null && (
            <Text style={[styles.accuracyText, isOnTarget && styles.accuracyOnTarget]}>
              {currentAccuracy.toFixed(0)}% accuracy
            </Text>
          )}
        </View>

        {/* Volume Meter */}
        <VolumeMeter
          amplitude={currentAmplitude !== null ? { rms: 0, db: currentAmplitude, peak: 0 } : null}
          isActive={state === 'listening'}
        />

        {/* Actions */}
        <View style={styles.actionSection}>
          {state === 'playing' ? (
            <Text style={styles.playingText}>Playing reference...</Text>
          ) : state === 'listening' ? (
            <BracketButton
              label="STOP"
              onPress={handleStopListening}
              color={colors.accentPink}
            />
          ) : (
            <>
              <BracketButton
                label="HEAR NOTE"
                onPress={handlePlayReference}
                color={colors.textSecondary}
              />
              <BracketButton
                label="START"
                onPress={handleStartListening}
                color={colors.accentGreen}
              />
            </>
          )}
        </View>

        {state === 'listening' && (
          <Text style={styles.instructionText}>
            {isOnTarget ? 'Hold it steady!' : 'Match the target note'}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="SUSTAIN"
        rightContent={<BracketButton label="CLOSE" onPress={handleClose} />}
      />
      <Divider style={styles.divider} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {renderContent()}
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
  exerciseContainer: {
    flex: 1,
  },
  progressText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  // Target
  targetContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  targetNote: {
    fontFamily: fonts.monoBold,
    fontSize: 56,
    color: colors.accentGreen,
  },
  targetInstruction: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  // Sustain meter
  sustainContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  sustainMeter: {
    width: '100%',
    paddingHorizontal: spacing.lg,
  },
  sustainProgressBar: {
    height: 12,
    borderRadius: 6,
  },
  sustainTime: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  // Detection
  detectionContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  currentPitchValue: {
    fontFamily: fonts.monoBold,
    fontSize: 32,
    color: colors.textPrimary,
  },
  currentPitchPlaceholder: {
    color: colors.textMuted,
  },
  currentPitchOnTarget: {
    color: colors.accentGreen,
  },
  accuracyText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  accuracyOnTarget: {
    color: colors.accentGreen,
  },
  // Actions
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.xl,
    flexWrap: 'wrap',
  },
  playingText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
  },
  instructionText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  // Feedback
  feedbackContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  feedbackTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  successText: {
    color: colors.accentGreen,
  },
  failText: {
    color: colors.accentPink,
  },
  feedbackSubtitle: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  feedbackActions: {
    marginTop: spacing.lg,
  },
  // Complete
  completeContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  completeTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 24,
    color: colors.accentGreen,
    marginBottom: spacing.lg,
  },
  resultsCard: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  resultLabel: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  resultValue: {
    fontFamily: fonts.monoBold,
    fontSize: 18,
    color: colors.accentGreen,
  },
  completeActions: {
    marginTop: spacing.lg,
  },
});
