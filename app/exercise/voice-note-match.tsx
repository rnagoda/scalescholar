import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors, typography, spacing, fonts } from '@/src/theme';
import { ScreenHeader, BracketButton, Divider, Card } from '@/src/components/common';
import { VolumeMeter } from '@/src/components/voiceTrainer';
import { useVoiceTrainerStore } from '@/src/stores/useVoiceTrainerStore';
import { useVoiceProfileStore } from '@/src/stores/useVoiceProfileStore';
import { midiToNoteName } from '@/src/utils/music';
import { DEFAULT_VOICE_THRESHOLDS } from '@/src/types/voiceAnalyzer';

export default function VoiceNoteMatchExercise() {
  const router = useRouter();

  const {
    profile,
    hasProfile,
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

      // Get available notes from voice profile
      const voiceProfile = useVoiceProfileStore.getState().profile;
      const availableNotes: number[] = [];

      if (voiceProfile) {
        // Use comfortable range
        for (let n = voiceProfile.comfortableLow; n <= voiceProfile.comfortableHigh; n++) {
          availableNotes.push(n);
        }
      }

      startSession('note_match', {
        questionsPerSession: 10,
        availableNotes,
      });
    };

    setup();

    return () => {
      resetSession();
    };
  }, []);

  const handleClose = useCallback(() => {
    resetSession();
    router.back();
  }, [resetSession, router]);

  const handlePlayReference = useCallback(async () => {
    await playReference();
  }, [playReference]);

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

  // Get accuracy color
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return colors.accentGreen;
    if (accuracy >= 70) return '#FFD60A'; // Yellow
    return colors.accentPink;
  };

  // Calculate cents deviation for display
  const getCentsDeviation = () => {
    if (currentPitch === null || targetNote === null) return null;
    const deviation = (currentPitch - targetNote) * 100; // Rough cents estimate
    return deviation;
  };

  const renderContent = () => {
    switch (state) {
      case 'ready':
      case 'playing':
        return (
          <View style={styles.exerciseContent}>
            {/* Target note display */}
            <View style={styles.targetSection}>
              <Text style={styles.targetLabel}>HIT THIS NOTE</Text>
              <Text style={styles.targetNote}>
                {targetNote !== null ? midiToNoteName(targetNote) : '--'}
              </Text>
            </View>

            {/* Play reference button */}
            <View style={styles.actionSection}>
              <BracketButton
                label={state === 'playing' ? 'PLAYING...' : 'PLAY REFERENCE'}
                onPress={handlePlayReference}
                color={state === 'playing' ? colors.textMuted : colors.accentGreen}
              />
            </View>

            {/* Start listening button */}
            <View style={styles.actionSection}>
              <BracketButton
                label="START SINGING"
                onPress={handleStartListening}
                color={colors.textPrimary}
              />
            </View>

            <Text style={styles.hint}>
              Press "PLAY REFERENCE" to hear the target note, then "START SINGING" to begin.
            </Text>
          </View>
        );

      case 'listening':
        return (
          <View style={styles.exerciseContent}>
            {/* Target */}
            <View style={styles.targetSection}>
              <Text style={styles.targetLabel}>TARGET</Text>
              <Text style={styles.targetNote}>
                {targetNote !== null ? midiToNoteName(targetNote) : '--'}
              </Text>
            </View>

            {/* Current pitch display */}
            <View style={styles.pitchDisplay}>
              <Text style={styles.pitchLabel}>YOU</Text>
              <Text style={[
                styles.currentPitch,
                isOnTarget && styles.currentPitchOnTarget,
              ]}>
                {currentPitch !== null ? midiToNoteName(currentPitch) : '--'}
              </Text>
            </View>

            {/* Accuracy meter */}
            <View style={styles.accuracySection}>
              <View style={styles.accuracyBar}>
                <View
                  style={[
                    styles.accuracyFill,
                    {
                      width: `${currentAccuracy}%`,
                      backgroundColor: getAccuracyColor(currentAccuracy),
                    },
                  ]}
                />
              </View>
              <Text style={[styles.accuracyText, { color: getAccuracyColor(currentAccuracy) }]}>
                {Math.round(currentAccuracy)}%
              </Text>
            </View>

            {/* Time on target indicator */}
            {isOnTarget && (
              <View style={styles.holdIndicator}>
                <View style={styles.holdProgress}>
                  <View
                    style={[
                      styles.holdFill,
                      { width: `${Math.min(100, (timeOnTarget / 1000) * 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.holdText}>
                  HOLD... {((1000 - Math.min(timeOnTarget, 1000)) / 1000).toFixed(1)}s
                </Text>
              </View>
            )}

            {/* Volume meter */}
            <VolumeMeter
              amplitude={currentAmplitude !== null ? { rms: 0, db: currentAmplitude, peak: 0 } : null}
              isActive={true}
            />

            {/* Stop button */}
            <View style={styles.actionSection}>
              <BracketButton
                label="STOP"
                onPress={handleStopListening}
                color={colors.accentPink}
              />
            </View>
          </View>
        );

      case 'feedback':
        const lastResult = sessionResults[sessionResults.length - 1];
        const success = lastResult?.success ?? false;

        return (
          <View style={styles.exerciseContent}>
            <View style={styles.feedbackSection}>
              <Text style={[
                styles.feedbackTitle,
                { color: success ? colors.accentGreen : colors.accentPink },
              ]}>
                {success ? 'GREAT!' : 'TRY AGAIN'}
              </Text>

              <Text style={styles.feedbackNote}>
                Target: {targetNote !== null ? midiToNoteName(targetNote) : '--'}
              </Text>

              <View style={styles.feedbackStats}>
                <Text style={styles.feedbackStat}>
                  Accuracy: {Math.round(lastResult?.accuracy ?? 0)}%
                </Text>
                <Text style={styles.feedbackStat}>
                  Time on target: {((lastResult?.timeOnTarget ?? 0) / 1000).toFixed(1)}s
                </Text>
              </View>
            </View>

            <View style={styles.actionSection}>
              {progress.current < progress.total ? (
                <BracketButton
                  label="NEXT"
                  onPress={handleNext}
                  color={colors.accentGreen}
                />
              ) : (
                <BracketButton
                  label="FINISH"
                  onPress={handleComplete}
                  color={colors.accentGreen}
                />
              )}
            </View>
          </View>
        );

      case 'complete':
        return (
          <View style={styles.exerciseContent}>
            <Text style={styles.completeTitle}>SESSION COMPLETE</Text>

            <Card style={styles.resultsCard}>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>CORRECT</Text>
                <Text style={styles.resultValue}>
                  {score.correct} / {score.total}
                </Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>ACCURACY</Text>
                <Text style={styles.resultValue}>
                  {sessionResults.length > 0
                    ? Math.round(
                        sessionResults.reduce((sum, r) => sum + r.accuracy, 0) /
                          sessionResults.length
                      )
                    : 0}%
                </Text>
              </View>
            </Card>

            <View style={styles.actionSection}>
              <BracketButton
                label="DONE"
                onPress={handleClose}
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
        title="NOTE MATCH"
        rightContent={
          <BracketButton label="CLOSE" onPress={handleClose} />
        }
      />
      <Divider style={styles.divider} />

      {/* Progress indicator */}
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>
          {progress.current} / {progress.total}
        </Text>
        <Text style={styles.scoreText}>
          {score.correct} correct
        </Text>
      </View>
      <Divider style={styles.divider} />

      {renderContent()}
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
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  progressText: {
    fontFamily: fonts.monoBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  scoreText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
  },
  exerciseContent: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
  },
  targetSection: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  targetLabel: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  targetNote: {
    fontFamily: fonts.monoBold,
    fontSize: 72,
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  pitchDisplay: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  pitchLabel: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  currentPitch: {
    fontFamily: fonts.monoBold,
    fontSize: 48,
    color: colors.textSecondary,
  },
  currentPitchOnTarget: {
    color: colors.accentGreen,
  },
  accuracySection: {
    width: '100%',
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  accuracyBar: {
    width: '100%',
    height: 12,
    backgroundColor: colors.progressTrack,
    borderRadius: 6,
    overflow: 'hidden',
  },
  accuracyFill: {
    height: '100%',
    borderRadius: 6,
  },
  accuracyText: {
    fontFamily: fonts.monoBold,
    fontSize: 24,
    marginTop: spacing.sm,
  },
  holdIndicator: {
    width: '100%',
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  holdProgress: {
    width: '60%',
    height: 8,
    backgroundColor: colors.progressTrack,
    borderRadius: 4,
    overflow: 'hidden',
  },
  holdFill: {
    height: '100%',
    backgroundColor: colors.accentGreen,
    borderRadius: 4,
  },
  holdText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.accentGreen,
    marginTop: spacing.xs,
  },
  actionSection: {
    marginTop: spacing.xl,
  },
  hint: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    lineHeight: 18,
  },
  feedbackSection: {
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  feedbackTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 36,
    letterSpacing: 2,
  },
  feedbackNote: {
    fontFamily: fonts.mono,
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  feedbackStats: {
    marginTop: spacing.lg,
  },
  feedbackStat: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  completeTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 28,
    color: colors.accentGreen,
    letterSpacing: 2,
    marginTop: spacing.xxl,
  },
  resultsCard: {
    width: '100%',
    marginTop: spacing.xl,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  resultLabel: {
    fontFamily: fonts.monoBold,
    fontSize: 14,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  resultValue: {
    fontFamily: fonts.monoBold,
    fontSize: 20,
    color: colors.accentGreen,
  },
});
