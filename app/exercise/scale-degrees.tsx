import React, { useEffect, useCallback, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors, typography, spacing } from '@/src/theme';
import { ScreenHeader, BracketButton, Divider } from '@/src/components/common';
import { PlayButton, AnswerButton } from '@/src/components/exercises';
import { useScaleDegreeStore } from '@/src/stores/useScaleDegreeStore';
import { useProgressStore } from '@/src/stores/useProgressStore';
import { useSettingsStore } from '@/src/stores/useSettingsStore';
import { AudioEngine } from '@/src/audio';
import {
  ScaleDegree,
  getScaleDegreeName,
  SCALE_DEGREE_FULL_NAMES,
} from '@/src/utils/music';

export default function ScaleDegreesExercise() {
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
    setPlayingContext,
    setAnswering,
    submitAnswer,
    nextQuestion,
    resetSession,
    getProgress,
    getScore,
  } = useScaleDegreeStore();

  const {
    isInitialized,
    initialize,
    recordScaleDegreeAttempt,
    recordScaleDegreeSession,
    getUnlockedScaleDegrees,
  } = useProgressStore();

  const {
    questionsPerSession,
    scaleDegreeLabels,
  } = useSettingsStore();

  const useSolfege = scaleDegreeLabels === 'solfege';

  // Initialize progress store and start session
  useEffect(() => {
    const setup = async () => {
      if (!isInitialized) {
        await initialize();
      }
      const unlockedDegrees = getUnlockedScaleDegrees();
      startSession({
        availableDegrees: unlockedDegrees,
        questionCount: questionsPerSession,
        contextType: 'triad',
        useSolfege,
      });
    };
    setup();

    return () => {
      AudioEngine.stop();
    };
  }, []);

  const handlePlay = useCallback(async () => {
    if (!currentQuestion || state === 'playing_context' || state === 'playing_degree') return;

    setPlayingContext();
    questionStartTime.current = Date.now();

    try {
      // Play key context then the scale degree
      await AudioEngine.playScaleDegreeWithContext(
        currentQuestion.keyRootMidi,
        currentQuestion.scaleDegree,
        currentQuestion.contextType,
        currentQuestion.octaveOffset
      );
    } catch (error) {
      console.error('Failed to play scale degree:', error);
    }

    setAnswering();
  }, [currentQuestion, state, setPlayingContext, setAnswering]);

  const handleAnswer = useCallback(
    async (degree: ScaleDegree) => {
      if (state !== 'answering' || !currentQuestion) return;

      const responseTimeMs = Date.now() - questionStartTime.current;
      const correct = submitAnswer(degree);

      // Record attempt to progress store
      await recordScaleDegreeAttempt(currentQuestion.scaleDegree, correct, responseTimeMs);
    },
    [state, submitAnswer, currentQuestion, recordScaleDegreeAttempt]
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
    const unlockedDegrees = getUnlockedScaleDegrees();
    startSession({
      availableDegrees: unlockedDegrees,
      questionCount: questionsPerSession,
      contextType: 'triad',
      useSolfege,
    });
  }, [startSession, getUnlockedScaleDegrees, questionsPerSession, useSolfege]);

  // Record session when complete
  useEffect(() => {
    if (state === 'complete' && sessionResults) {
      const recordSession = async () => {
        const unlocks = await recordScaleDegreeSession(
          sessionResults.totalQuestions,
          sessionResults.correctAnswers
        );
        if (unlocks.length > 0) {
          setNewUnlocks(unlocks);
        }
      };
      recordSession();
    }
  }, [state, sessionResults, recordScaleDegreeSession]);

  // Get the last answer for feedback display
  const lastAnswer = answers.length > 0 ? answers[answers.length - 1] : null;

  // Determine answer button states
  const getAnswerState = (degree: ScaleDegree) => {
    if (state !== 'feedback' || !lastAnswer || !currentQuestion) {
      return 'default';
    }

    if (degree === currentQuestion.scaleDegree) {
      return 'correct';
    }

    if (degree === lastAnswer.selectedDegree && !lastAnswer.correct) {
      return 'incorrect';
    }

    return 'default';
  };

  const progress = getProgress();
  const score = getScore();

  // Get status text based on state
  const getStatusText = () => {
    switch (state) {
      case 'ready':
        return 'Tap to hear the key context and note';
      case 'playing_context':
        return 'Establishing key...';
      case 'playing_degree':
        return 'Listen to the note...';
      case 'answering':
        return 'What scale degree is it?';
      case 'feedback':
        return lastAnswer?.correct ? 'Correct!' : 'Incorrect';
      default:
        return '';
    }
  };

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
              <Text style={styles.unlockTitle}>New Scale Degree Unlocked!</Text>
              {newUnlocks.map((unlock) => (
                <Text key={unlock} style={styles.unlockName}>
                  {SCALE_DEGREE_FULL_NAMES[parseInt(unlock, 10) as ScaleDegree]}
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

  // Generate answer buttons
  const renderAnswerButtons = () => {
    const degrees = config.availableDegrees;
    const rows: ScaleDegree[][] = [];

    // Create rows of up to 4 buttons
    for (let i = 0; i < degrees.length; i += 4) {
      rows.push(degrees.slice(i, Math.min(i + 4, degrees.length)));
    }

    return rows.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.answerRow}>
        {row.map((degree) => (
          <AnswerButton
            key={degree}
            label={getScaleDegreeName(degree, config.useSolfege)}
            onPress={() => handleAnswer(degree)}
            state={getAnswerState(degree)}
            disabled={state !== 'answering'}
          />
        ))}
      </View>
    ));
  };

  const isPlaying = state === 'playing_context' || state === 'playing_degree';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="SCALE DEGREES"
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
            isPlaying={isPlaying}
            disabled={state === 'feedback'}
            label={state === 'ready' ? 'PLAY' : 'REPLAY'}
          />
          <Text style={styles.playHint}>{getStatusText()}</Text>
        </View>

        {state === 'feedback' && currentQuestion && (
          <View style={styles.feedbackBox}>
            <Text style={[
              styles.feedbackText,
              { color: lastAnswer?.correct ? colors.accentGreen : colors.accentPink }
            ]}>
              {lastAnswer?.correct ? '✓' : '✗'} {getScaleDegreeName(currentQuestion.scaleDegree, config.useSolfege)}
            </Text>
            <Text style={styles.feedbackSubtext}>
              {SCALE_DEGREE_FULL_NAMES[currentQuestion.scaleDegree]}
            </Text>
          </View>
        )}

        <View style={styles.answersGrid}>
          {renderAnswerButtons()}
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
    textAlign: 'center',
  },
  feedbackBox: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  feedbackText: {
    ...typography.cardTitle,
    fontSize: 28,
  },
  feedbackSubtext: {
    ...typography.label,
    fontSize: 14,
    marginTop: spacing.xs,
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
