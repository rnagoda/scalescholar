import React, { useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors, typography, spacing, fonts } from '@/src/theme';
import { ScreenHeader, BracketButton, Divider, Card } from '@/src/components/common';
import { VolumeMeter } from '@/src/components/voiceTrainer';
import { useVoiceTrainerStore } from '@/src/stores/useVoiceTrainerStore';
import { useVoiceProfileStore } from '@/src/stores/useVoiceProfileStore';
import { midiToNoteName } from '@/src/utils/music';
import { DEFAULT_VOICE_THRESHOLDS } from '@/src/types/voiceAnalyzer';

// Time required on target to advance to next note (ms)
const NOTE_HOLD_TIME = 500;

export default function VoiceScaleExercise() {
  const router = useRouter();
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastNoteAdvanceRef = useRef<number>(0);

  const {
    profile,
    isInitialized: profileInitialized,
    initialize: initializeProfile,
  } = useVoiceProfileStore();

  const {
    state,
    currentQuestion,
    targetNote,
    scaleNotes,
    currentScaleIndex,
    currentPitch,
    currentAmplitude,
    currentAccuracy,
    isOnTarget,
    timeOnTarget,
    sessionResults,
    questionIndex,
    questionsPerSession,
    startSession,
    playScaleReference,
    startListening,
    stopListening,
    advanceScaleNote,
    submitResult,
    nextQuestion,
    completeSession,
    resetSession,
    getProgress,
    getScore,
    getScaleProgress,
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
        // Use comfortable range for scales
        for (let n = voiceProfile.comfortableLow; n <= voiceProfile.comfortableHigh; n++) {
          availableNotes.push(n);
        }
      }

      startSession('scale', {
        questionsPerSession: 5, // 5 scales per session
        availableNotes,
      });
    };

    setup();

    return () => {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
      }
      resetSession();
    };
  }, []);

  // Auto-advance when on target for NOTE_HOLD_TIME
  useEffect(() => {
    if (state !== 'listening' || !isOnTarget) {
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      return;
    }

    // Prevent rapid advances
    const now = Date.now();
    if (now - lastNoteAdvanceRef.current < 300) {
      return;
    }

    if (timeOnTarget >= NOTE_HOLD_TIME && !holdTimerRef.current) {
      holdTimerRef.current = setTimeout(() => {
        lastNoteAdvanceRef.current = Date.now();
        const scaleComplete = advanceScaleNote();
        holdTimerRef.current = null;

        if (scaleComplete) {
          // Scale finished successfully
          submitResult();
        }
      }, 50);
    }
  }, [state, isOnTarget, timeOnTarget, advanceScaleNote, submitResult]);

  const handleClose = useCallback(() => {
    resetSession();
    router.back();
  }, [resetSession, router]);

  const handlePlayScale = useCallback(async () => {
    await playScaleReference();
  }, [playScaleReference]);

  const handleStartListening = useCallback(async () => {
    await startListening();
  }, [startListening]);

  const handleStopListening = useCallback(() => {
    stopListening();
  }, [stopListening]);

  const handleNext = useCallback(() => {
    nextQuestion();
  }, [nextQuestion]);

  const handleComplete = useCallback(async () => {
    await completeSession();
    router.back();
  }, [completeSession, router]);

  const progress = getProgress();
  const score = getScore();
  const scaleProgress = getScaleProgress();

  // Render scale ladder
  const renderScaleLadder = () => {
    if (scaleNotes.length === 0) return null;

    return (
      <View style={styles.scaleLadder}>
        {scaleNotes.map((note, index) => {
          const isCurrentNote = index === currentScaleIndex;
          const isCompleted = index < currentScaleIndex;
          const isPending = index > currentScaleIndex;

          return (
            <View
              key={index}
              style={[
                styles.scaleNote,
                isCurrentNote && styles.scaleNoteCurrent,
                isCompleted && styles.scaleNoteCompleted,
                isPending && styles.scaleNotePending,
              ]}
            >
              <Text
                style={[
                  styles.scaleNoteText,
                  isCurrentNote && styles.scaleNoteTextCurrent,
                  isCompleted && styles.scaleNoteTextCompleted,
                  isPending && styles.scaleNoteTextPending,
                ]}
              >
                {midiToNoteName(note)}
              </Text>
              {isCurrentNote && isOnTarget && (
                <View style={styles.holdIndicator}>
                  <View
                    style={[
                      styles.holdProgress,
                      { width: `${Math.min(100, (timeOnTarget / NOTE_HOLD_TIME) * 100)}%` },
                    ]}
                  />
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  // Render based on state
  const renderContent = () => {
    if (state === 'complete') {
      return (
        <View style={styles.completeContainer}>
          <Text style={styles.completeTitle}>Session Complete!</Text>
          <Card style={styles.resultsCard}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>SCALES COMPLETED</Text>
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
            {success ? 'Great Job!' : 'Keep Practicing!'}
          </Text>
          <Text style={styles.feedbackSubtitle}>
            {success ? 'You completed the scale!' : 'Try to hit each note clearly'}
          </Text>

          <View style={styles.feedbackActions}>
            {questionIndex + 1 < questionsPerSession ? (
              <BracketButton
                label="NEXT SCALE"
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
          Scale {progress.current} of {progress.total}
        </Text>

        {/* Scale Ladder */}
        <View style={styles.ladderContainer}>
          <Text style={styles.sectionLabel}>SCALE</Text>
          {renderScaleLadder()}
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
          {currentPitch !== null && targetNote !== null && (
            <Text style={styles.accuracyText}>
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
            <Text style={styles.playingText}>Playing scale...</Text>
          ) : state === 'listening' ? (
            <>
              <BracketButton
                label="STOP"
                onPress={handleStopListening}
                color={colors.accentPink}
              />
            </>
          ) : (
            <>
              <BracketButton
                label="HEAR SCALE"
                onPress={handlePlayScale}
                color={colors.textSecondary}
              />
              <BracketButton
                label="START SINGING"
                onPress={handleStartListening}
                color={colors.accentGreen}
              />
            </>
          )}
        </View>

        {state === 'listening' && (
          <Text style={styles.instructionText}>
            Sing each note and hold until it advances
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="SCALE PRACTICE"
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
  // Scale Ladder
  ladderContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  scaleLadder: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  scaleNote: {
    width: 60,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
  },
  scaleNoteCurrent: {
    borderColor: colors.accentGreen,
    borderWidth: 2,
    backgroundColor: colors.cardBackground,
  },
  scaleNoteCompleted: {
    backgroundColor: colors.accentGreen,
    borderColor: colors.accentGreen,
  },
  scaleNotePending: {
    opacity: 0.5,
  },
  scaleNoteText: {
    fontFamily: fonts.monoBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  scaleNoteTextCurrent: {
    color: colors.accentGreen,
  },
  scaleNoteTextCompleted: {
    color: colors.background,
  },
  scaleNoteTextPending: {
    color: colors.textMuted,
  },
  holdIndicator: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    right: 2,
    height: 4,
    backgroundColor: colors.progressTrack,
    borderRadius: 2,
    overflow: 'hidden',
  },
  holdProgress: {
    height: '100%',
    backgroundColor: colors.accentGreen,
  },
  // Detection
  detectionContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  currentPitchValue: {
    fontFamily: fonts.monoBold,
    fontSize: 48,
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
    fontSize: 12,
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
