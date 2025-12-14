import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors, typography, spacing } from '@/src/theme';
import { ScreenHeader, BracketButton, Divider, Card } from '@/src/components/common';
import { PlayButton, AnswerButton } from '@/src/components/exercises';
import { useExerciseStore } from '@/src/stores/useExerciseStore';
import { AudioEngine } from '@/src/audio';
import { Interval, INTERVAL_SHORT_NAMES, STARTER_INTERVALS } from '@/src/utils/music';

export default function IntervalsExercise() {
  const router = useRouter();

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

  // Start session on mount
  useEffect(() => {
    startSession({
      availableIntervals: STARTER_INTERVALS,
      questionCount: 10,
    });

    return () => {
      AudioEngine.stop();
    };
  }, []);

  const handlePlay = useCallback(async () => {
    if (!currentQuestion || state === 'playing') return;

    setPlaying();

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
    (interval: Interval) => {
      if (state !== 'answering') return;
      submitAnswer(interval);
    },
    [state, submitAnswer]
  );

  const handleNext = useCallback(() => {
    nextQuestion();
  }, [nextQuestion]);

  const handleClose = useCallback(() => {
    resetSession();
    router.back();
  }, [resetSession, router]);

  const handleRestart = useCallback(() => {
    startSession({
      availableIntervals: STARTER_INTERVALS,
      questionCount: 10,
    });
  }, [startSession]);

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="INTERVALS"
        rightContent={
          <BracketButton label="CLOSE" onPress={handleClose} />
        }
      />
      <Divider style={styles.divider} />

      <View style={styles.content}>
        <View style={styles.progressRow}>
          <Text style={styles.questionNumber}>
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
          />
          <Text style={styles.playHint}>
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
          <View style={styles.answerRow}>
            {config.availableIntervals.slice(0, 2).map((interval) => (
              <AnswerButton
                key={interval}
                label={INTERVAL_SHORT_NAMES[interval]}
                onPress={() => handleAnswer(interval)}
                state={getAnswerState(interval)}
                disabled={state !== 'answering'}
              />
            ))}
          </View>
          <View style={styles.answerRow}>
            {config.availableIntervals.slice(2, 4).map((interval) => (
              <AnswerButton
                key={interval}
                label={INTERVAL_SHORT_NAMES[interval]}
                onPress={() => handleAnswer(interval)}
                state={getAnswerState(interval)}
                disabled={state !== 'answering'}
              />
            ))}
          </View>
        </View>

        {state === 'feedback' && (
          <View style={styles.nextButtonContainer}>
            <BracketButton
              label="NEXT"
              onPress={handleNext}
              color={colors.accentGreen}
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
  answerRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
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
  completeActions: {
    alignItems: 'center',
    gap: spacing.md,
  },
});
