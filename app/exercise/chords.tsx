import React, { useEffect, useCallback, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors, typography, spacing } from '@/src/theme';
import { ScreenHeader, BracketButton, Divider } from '@/src/components/common';
import { PlayButton, AnswerGrid } from '@/src/components/exercises';
import { useChordStore } from '@/src/stores/useChordStore';
import { useProgressStore } from '@/src/stores/useProgressStore';
import { useSettingsStore } from '@/src/stores/useSettingsStore';
import { AudioEngine } from '@/src/audio';
import {
  ChordQuality,
  getChordQualityName,
  CHORD_QUALITY_FULL_NAMES,
} from '@/src/utils/music';

export default function ChordsExercise() {
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
  } = useChordStore();

  const {
    isInitialized,
    initialize,
    recordChordAttempt,
    recordChordSession,
    getUnlockedChordQualities,
  } = useProgressStore();

  const { questionsPerSession } = useSettingsStore();

  // Initialize progress store and start session
  useEffect(() => {
    const setup = async () => {
      if (!isInitialized) {
        await initialize();
      }
      const unlockedQualities = getUnlockedChordQualities();
      startSession({
        availableQualities: unlockedQualities,
        questionCount: questionsPerSession,
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
      // Play the chord
      await AudioEngine.playChordQuality(
        currentQuestion.rootMidi,
        currentQuestion.chordQuality
      );
    } catch (error) {
      console.error('Failed to play chord:', error);
    }

    setAnswering();
  }, [currentQuestion, state, setPlaying, setAnswering]);

  const handleAnswer = useCallback(
    async (quality: ChordQuality) => {
      if (state !== 'answering' || !currentQuestion) return;

      const responseTimeMs = Date.now() - questionStartTime.current;
      const correct = submitAnswer(quality);

      // Record attempt to progress store
      await recordChordAttempt(currentQuestion.chordQuality, correct, responseTimeMs);
    },
    [state, submitAnswer, currentQuestion, recordChordAttempt]
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
    const unlockedQualities = getUnlockedChordQualities();
    startSession({
      availableQualities: unlockedQualities,
      questionCount: questionsPerSession,
    });
  }, [startSession, getUnlockedChordQualities, questionsPerSession]);

  // Record session when complete
  useEffect(() => {
    if (state === 'complete' && sessionResults) {
      const recordSession = async () => {
        const unlocks = await recordChordSession(
          sessionResults.totalQuestions,
          sessionResults.correctAnswers
        );
        if (unlocks.length > 0) {
          setNewUnlocks(unlocks);
        }
      };
      recordSession();
    }
  }, [state, sessionResults, recordChordSession]);

  // Get the last answer for feedback display
  const lastAnswer = answers.length > 0 ? answers[answers.length - 1] : null;

  // Determine answer button states
  const getAnswerState = (quality: ChordQuality) => {
    if (state !== 'feedback' || !lastAnswer || !currentQuestion) {
      return 'default';
    }

    if (quality === currentQuestion.chordQuality) {
      return 'correct';
    }

    if (quality === lastAnswer.selectedQuality && !lastAnswer.correct) {
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
        return 'Tap to hear the chord';
      case 'playing':
        return 'Listen to the chord...';
      case 'answering':
        return 'What chord quality is it?';
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
              <Text style={styles.unlockTitle}>New Chord Quality Unlocked!</Text>
              {newUnlocks.map((unlock) => (
                <Text key={unlock} style={styles.unlockName}>
                  {CHORD_QUALITY_FULL_NAMES[unlock as ChordQuality]}
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

  // Build answer options from available chord qualities
  const answerOptions = config.availableQualities.map((quality) => ({
    value: quality,
    label: getChordQualityName(quality, false),
  }));

  const isPlaying = state === 'playing';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="CHORD QUALITY"
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
              {lastAnswer?.correct ? '\u2713' : '\u2717'} {getChordQualityName(currentQuestion.chordQuality, false)}
            </Text>
            <Text style={styles.feedbackSubtext}>
              {CHORD_QUALITY_FULL_NAMES[currentQuestion.chordQuality]} Chord
            </Text>
          </View>
        )}

        <View style={styles.answersGrid}>
          <AnswerGrid
            options={answerOptions}
            onSelect={handleAnswer}
            getState={getAnswerState}
            disabled={state !== 'answering'}
            columns={2}
          />
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
