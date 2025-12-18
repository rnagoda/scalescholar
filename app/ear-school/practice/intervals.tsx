import React, { useEffect, useCallback, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors, typography, spacing } from '@/src/theme';
import { ScreenHeader, BracketButton, Divider } from '@/src/components/common';
import { PlayButton, AnswerGrid } from '@/src/components/exercises';
import { useExerciseStore } from '@/src/stores/useExerciseStore';
import { useProgressStore } from '@/src/stores/useProgressStore';
import { useSettingsStore } from '@/src/stores/useSettingsStore';
import { AudioEngine } from '@/src/audio';
import { Interval, INTERVAL_SHORT_NAMES, INTERVAL_FULL_NAMES } from '@/src/utils/music';

export default function IntervalsExercise() {
  const router = useRouter();
  const [newUnlocks, setNewUnlocks] = useState<string[]>([]);
  const questionStartTime = useRef<number>(0);

  const {
    state,
    currentQuestion,
    answers,
    config,
    sessionResults,
    startSession,
    setPlaying,
    setAnswering,
    submitAnswer,
    nextQuestion,
    resetSession,
    getProgress,
    getScore,
  } = useExerciseStore();

  const {
    intervalProgress,
    isInitialized,
    initialize,
    recordIntervalAttempt,
    recordIntervalSession,
    getUnlockedIntervals,
  } = useProgressStore();

  const {
    questionsPerSession,
    intervalDirection,
    intervalPlayback,
  } = useSettingsStore();

  // Convert settings to exercise config
  const getDirectionConfig = () => {
    switch (intervalDirection) {
      case 'ascending':
        return { ascending: true, descending: false };
      case 'descending':
        return { ascending: false, descending: true };
      case 'mixed':
        return { ascending: true, descending: true };
    }
  };

  const getPlaybackConfig = () => {
    switch (intervalPlayback) {
      case 'melodic':
        return { melodic: true, harmonic: false };
      case 'harmonic':
        return { melodic: false, harmonic: true };
    }
  };

  // Initialize progress store and start session
  useEffect(() => {
    const setup = async () => {
      if (!isInitialized) {
        await initialize();
      }
      const unlockedIntervals = getUnlockedIntervals();
      startSession({
        availableIntervals: unlockedIntervals,
        questionCount: questionsPerSession,
        ...getDirectionConfig(),
        ...getPlaybackConfig(),
      });
    };
    setup();

    return () => {
      AudioEngine.stop();
    };
  }, []);

  const handlePlay = useCallback(async () => {
    if (!currentQuestion || state === 'playing') return;

    setPlaying();
    questionStartTime.current = Date.now();

    try {
      await AudioEngine.playInterval(
        currentQuestion.rootMidi,
        currentQuestion.interval,
        currentQuestion.ascending,
        currentQuestion.melodic
      );
    } catch (error) {
      console.error('Failed to play interval:', error);
    }

    setAnswering();
  }, [currentQuestion, state, setPlaying, setAnswering]);

  const handleAnswer = useCallback(
    async (interval: Interval) => {
      if (state !== 'answering' || !currentQuestion) return;

      const responseTimeMs = Date.now() - questionStartTime.current;
      const correct = submitAnswer(interval);

      // Record attempt to progress store
      await recordIntervalAttempt(currentQuestion.interval, correct, responseTimeMs);
    },
    [state, submitAnswer, currentQuestion, recordIntervalAttempt]
  );

  const handleNext = useCallback(() => {
    nextQuestion();
  }, [nextQuestion]);

  const handleClose = useCallback(() => {
    resetSession();
    router.back();
  }, [resetSession, router]);

  const handleRestart = useCallback(() => {
    setNewUnlocks([]);
    const unlockedIntervals = getUnlockedIntervals();
    startSession({
      availableIntervals: unlockedIntervals,
      questionCount: questionsPerSession,
      ...getDirectionConfig(),
      ...getPlaybackConfig(),
    });
  }, [startSession, getUnlockedIntervals, questionsPerSession, intervalDirection, intervalPlayback]);

  // Record session when complete
  useEffect(() => {
    if (state === 'complete' && sessionResults) {
      const recordSession = async () => {
        const unlocks = await recordIntervalSession(
          sessionResults.totalQuestions,
          sessionResults.correctAnswers
        );
        if (unlocks.length > 0) {
          setNewUnlocks(unlocks);
        }
      };
      recordSession();
    }
  }, [state, sessionResults, recordIntervalSession]);

  // Get the last answer for feedback display
  const lastAnswer = answers.length > 0 ? answers[answers.length - 1] : null;

  // Determine answer button states
  const getAnswerState = (interval: Interval) => {
    if (state !== 'feedback' || !lastAnswer || !currentQuestion) {
      return 'default';
    }

    if (interval === currentQuestion.interval) {
      return 'correct';
    }

    if (interval === lastAnswer.selectedInterval && !lastAnswer.correct) {
      return 'incorrect';
    }

    return 'default';
  };

  const progress = getProgress();
  const score = getScore();

  // Session complete screen
  if (state === 'complete' && sessionResults) {
    const percentage = Math.round(
      (sessionResults.correctAnswers / sessionResults.totalQuestions) * 100
    );

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader
          title="COMPLETE"
          rightContent={
            <BracketButton label="CLOSE" onPress={handleClose} />
          }
        />
        <Divider style={styles.divider} />

        <View style={styles.completeContent}>
          <Text style={styles.completeTitle}>Session Complete!</Text>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>{percentage}%</Text>
            <Text style={styles.scoreLabel}>Accuracy</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{sessionResults.correctAnswers}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {sessionResults.totalQuestions - sessionResults.correctAnswers}
              </Text>
              <Text style={styles.statLabel}>Incorrect</Text>
            </View>
          </View>

          {newUnlocks.length > 0 && (
            <View style={styles.unlockBanner}>
              <Text style={styles.unlockTitle}>New Interval Unlocked!</Text>
              {newUnlocks.map((unlock) => (
                <Text key={unlock} style={styles.unlockName}>
                  {INTERVAL_FULL_NAMES[parseInt(unlock, 10) as Interval]}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.completeActions}>
            <BracketButton
              label="TRAIN AGAIN"
              onPress={handleRestart}
              color={colors.accentGreen}
            />
            <BracketButton label="BACK HOME" onPress={handleClose} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Build answer options from available intervals
  const answerOptions = config.availableIntervals.map((interval) => ({
    value: interval,
    label: INTERVAL_SHORT_NAMES[interval],
    testID: `answer-${INTERVAL_SHORT_NAMES[interval].toLowerCase().replace(/\s+/g, '-')}`,
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="INTERVALS"
        testID="intervals-header"
        rightContent={
          <BracketButton label="CLOSE" onPress={handleClose} testID="intervals-close-button" />
        }
      />
      <Divider style={styles.divider} />

      <View style={styles.content}>
        <View style={styles.progressRow}>
          <Text style={styles.questionNumber} testID="progress-indicator">
            {progress.current} / {progress.total}
          </Text>
          {score.total > 0 && (
            <Text style={styles.scoreText}>
              {score.correct}/{score.total} correct
            </Text>
          )}
        </View>

        <View style={styles.playSection}>
          <PlayButton
            onPress={handlePlay}
            isPlaying={state === 'playing'}
            disabled={state === 'feedback'}
            label={state === 'ready' ? 'PLAY' : 'REPLAY'}
            testID="play-button"
          />
          <Text style={styles.playHint} testID="play-hint">
            {state === 'ready' && 'Tap to hear the interval'}
            {state === 'playing' && 'Listen carefully...'}
            {state === 'answering' && 'Select your answer below'}
            {state === 'feedback' && (lastAnswer?.correct ? 'Correct!' : 'Incorrect')}
          </Text>
        </View>

        {state === 'feedback' && currentQuestion && (
          <View style={styles.feedbackBox}>
            <Text style={[
              styles.feedbackText,
              { color: lastAnswer?.correct ? colors.accentGreen : colors.accentPink }
            ]}>
              {lastAnswer?.correct ? '✓' : '✗'} {INTERVAL_SHORT_NAMES[currentQuestion.interval]}
            </Text>
          </View>
        )}

        <View style={styles.answersGrid}>
          <AnswerGrid
            options={answerOptions}
            onSelect={handleAnswer}
            getState={getAnswerState}
            disabled={state !== 'answering'}
          />
        </View>

        {state === 'feedback' && (
          <View style={styles.nextButtonContainer}>
            <BracketButton
              label="NEXT"
              onPress={handleNext}
              color={colors.accentGreen}
              testID="next-button"
            />
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
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  questionNumber: {
    ...typography.body,
  },
  scoreText: {
    ...typography.label,
    fontSize: 12,
  },
  playSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  playHint: {
    ...typography.label,
    fontSize: 12,
    marginTop: spacing.md,
  },
  feedbackBox: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  feedbackText: {
    ...typography.cardTitle,
    fontSize: 28,
  },
  answersGrid: {
    marginBottom: spacing.lg,
  },
  nextButtonContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  // Complete screen styles
  completeContent: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeTitle: {
    ...typography.screenTitle,
    marginBottom: spacing.xxl,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  scoreValue: {
    ...typography.displayLarge,
  },
  scoreLabel: {
    ...typography.label,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.xxl,
  },
  statBox: {
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  statValue: {
    ...typography.cardTitle,
    fontSize: 32,
  },
  statLabel: {
    ...typography.label,
    marginTop: spacing.xs,
  },
  unlockBanner: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.accentGreen,
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  unlockTitle: {
    ...typography.cardTitle,
    color: colors.accentGreen,
    marginBottom: spacing.sm,
  },
  unlockName: {
    ...typography.body,
    color: colors.textPrimary,
  },
  completeActions: {
    alignItems: 'center',
    gap: spacing.md,
  },
});
