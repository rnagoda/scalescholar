/**
 * Ear School Lesson Player
 *
 * Handles the full exercise flow: play -> answer -> feedback -> next
 */

import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { colors, spacing, fonts } from '@/src/theme';
import { ScreenHeader, BracketButton, Divider, Card } from '@/src/components/common';
import { PlayButton, AnswerGrid } from '@/src/components/exercises';
import { useEarSchoolStore, useEarSchoolSessionTransition } from '@/src/stores/useEarSchoolStore';
import { getLessonById } from '@/src/content/ear-school/curriculum';
import { EAR_SCHOOL_THRESHOLDS, EarSchoolQuestion, EarSchoolAudioParams } from '@/src/types/ear-school';
import { AudioEngine } from '@/src/audio/AudioEngine';
import { keyNameToMidi, ScaleDegree, MAJOR_SCALE } from '@/src/utils/music';

export default function LessonPlayerScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { transitionToAnswering } = useEarSchoolSessionTransition();

  const {
    session,
    lastResult,
    isLoading,
    startLesson,
    playQuestion,
    submitAnswer,
    nextQuestion,
    endSession,
    cancelSession,
  } = useEarSchoolStore();

  const lesson = getLessonById(lessonId || '');

  // Start lesson when mounted
  useEffect(() => {
    if (lesson && !session) {
      startLesson(lesson);
    }
  }, [lesson]);

  const handleClose = () => {
    if (session && session.state !== 'complete') {
      Alert.alert(
        'Leave Lesson?',
        'Your progress in this session will be lost.',
        [
          { text: 'Stay', style: 'cancel' },
          {
            text: 'Leave',
            style: 'destructive',
            onPress: () => {
              cancelSession();
              router.back();
            },
          },
        ]
      );
    } else {
      router.back();
    }
  };

  /**
   * Play audio for the current question based on exercise type
   */
  const playQuestionAudio = async (question: EarSchoolQuestion): Promise<void> => {
    const { type, audioParams, key } = question;
    const keyRootMidi = keyNameToMidi(key);

    try {
      switch (type) {
        case 'scale-degree-id': {
          // Play key context, then the target scale degree
          const degrees = audioParams.scaleDegrees || [1];
          const targetDegree = degrees[0] as ScaleDegree;
          const contextType = audioParams.playContext ? 'triad' : 'triad';
          await AudioEngine.playScaleDegreeWithContext(keyRootMidi, targetDegree, contextType);
          break;
        }

        case 'interval-id': {
          // Play the interval
          const interval = audioParams.interval || 7; // Default to P5
          const direction = audioParams.direction || 'ascending';
          const ascending = direction === 'ascending';
          const melodic = direction !== 'harmonic';
          await AudioEngine.playInterval(keyRootMidi, interval, ascending, melodic);
          break;
        }

        case 'same-different': {
          // Play two notes - same or different
          const rootMidi = audioParams.rootMidi || 60;
          const interval = audioParams.interval || 0;
          await AudioEngine.playMidiNote(rootMidi);
          await new Promise(resolve => setTimeout(resolve, 600));
          await AudioEngine.playMidiNote(rootMidi + interval);
          break;
        }

        case 'identify-tonic': {
          // Play a short phrase, user identifies which note is "Do"
          // For now: play context + target note
          const degrees = audioParams.scaleDegrees || [1];
          const targetDegree = degrees[0] as ScaleDegree;
          await AudioEngine.playScaleDegreeWithContext(keyRootMidi, targetDegree, 'triad');
          break;
        }

        case 'pattern-match': {
          // Play a pattern of scale degrees
          const pattern = audioParams.pattern || [1, 2, 3];
          await AudioEngine.playKeyContext(keyRootMidi, 'triad');
          await new Promise(resolve => setTimeout(resolve, 400));
          for (const degree of pattern) {
            await AudioEngine.playScaleDegree(keyRootMidi, degree as ScaleDegree);
            await new Promise(resolve => setTimeout(resolve, 300));
          }
          break;
        }

        case 'step-type': {
          // Play two adjacent notes - whole step or half step
          const rootMidi = audioParams.rootMidi || 60;
          const interval = audioParams.interval || 2; // 2 = whole step, 1 = half step
          await AudioEngine.playMidiNote(rootMidi);
          await new Promise(resolve => setTimeout(resolve, 500));
          await AudioEngine.playMidiNote(rootMidi + interval);
          break;
        }

        case 'scale-quality': {
          // Play a full scale - major or minor
          const scaleType = audioParams.scaleType || 'major';
          const intervals = scaleType === 'major'
            ? MAJOR_SCALE
            : [0, 2, 3, 5, 7, 8, 10]; // Natural minor
          await AudioEngine.playScale(keyRootMidi, intervals, 0.4);
          break;
        }

        default: {
          // Fallback: play a simple note
          await AudioEngine.playMidiNote(keyRootMidi);
          break;
        }
      }
    } catch (error) {
      console.warn('Audio playback error:', error);
    }
  };

  const handlePlay = async () => {
    if (!session) return;

    playQuestion();

    // Get current question and play its audio
    const currentQuestion = session.questions[session.currentIndex];
    await playQuestionAudio(currentQuestion);

    // Transition to answering state after audio completes
    transitionToAnswering();
  };

  const handleAnswer = async (answerId: string) => {
    await submitAnswer(answerId);
  };

  const handleNext = () => {
    nextQuestion();
  };

  const handleFinish = async () => {
    await endSession();
  };

  const handleRetry = () => {
    if (lesson) {
      startLesson(lesson);
    }
  };

  const handleContinue = () => {
    router.back();
  };

  // Loading state
  if (isLoading || !session) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader
          title="LOADING..."
          rightContent={<BracketButton label="X" onPress={handleClose} />}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Preparing lesson...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Results screen
  if (lastResult) {
    const passed = lastResult.passed;
    const resultColor = passed ? colors.accentGreen : colors.accentPink;

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader
          title="LESSON COMPLETE"
          testID="lesson-complete-header"
        />
        <Divider style={styles.divider} />

        <View style={styles.resultsContainer}>
          <Text style={styles.resultsScore}>
            {lastResult.correctAnswers} / {lastResult.totalQuestions}
          </Text>
          <Text style={[styles.resultsPercentage, { color: resultColor }]}>
            {lastResult.score}%
          </Text>

          <View style={[styles.resultsBadge, { borderColor: resultColor }]}>
            <Text style={[styles.resultsBadgeText, { color: resultColor }]}>
              {lastResult.aced
                ? '★ ACED'
                : lastResult.mastered
                ? '✓ MASTERED'
                : passed
                ? '✓ PASSED'
                : '✗ NOT PASSED'}
            </Text>
          </View>

          {lastResult.xpAwarded > 0 && (
            <Text style={styles.xpAwarded}>+{lastResult.xpAwarded} XP</Text>
          )}

          <Text style={styles.resultsMessage}>
            {passed
              ? lastResult.aced
                ? 'Excellent work! You aced this lesson!'
                : lastResult.mastered
                ? 'Great job! You\'ve mastered this material.'
                : 'Good work! You passed the lesson.'
              : `You need ${session.lesson.passThreshold}% to pass. Keep practicing!`}
          </Text>

          <View style={styles.resultsButtons}>
            <TouchableOpacity
              style={styles.resultsButton}
              onPress={handleRetry}
              activeOpacity={0.7}
              testID="retry-button"
            >
              <Text style={styles.resultsButtonText}>[ RETRY ]</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resultsButton, styles.continueButton]}
              onPress={handleContinue}
              activeOpacity={0.7}
              testID="continue-button"
            >
              <Text style={[styles.resultsButtonText, styles.continueButtonText]}>
                [ CONTINUE ]
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Current question
  const currentQuestion = session.questions[session.currentIndex];
  const currentAnswer = session.answers[session.currentIndex];
  const isCorrect = currentAnswer?.correct;

  // Answer options for AnswerGrid - uses 'value' as per AnswerGrid interface
  const answerOptions = currentQuestion.options.map((opt) => ({
    value: opt.id,
    label: opt.label,
    testID: `answer-${opt.id}`,
  }));

  // Determine answer states based on option value
  const getAnswerState = (optionValue: string): 'default' | 'selected' | 'correct' | 'incorrect' => {
    if (session.state !== 'feedback') return 'default';
    if (optionValue === currentQuestion.correctAnswerId) return 'correct';
    if (optionValue === currentAnswer?.answerId && !isCorrect) return 'incorrect';
    return 'default';
  };

  // Handle answer selection - no-op in feedback state
  const handleAnswerSelect = (value: string) => {
    if (session.state === 'answering') {
      handleAnswer(value);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title={`LESSON ${session.lesson.weekNumber}.${session.lesson.lessonNumber}`}
        testID={`lesson-${session.lessonId}-header-title`}
        rightContent={
          <BracketButton
            label="X"
            onPress={handleClose}
            testID={`lesson-${session.lessonId}-close-button`}
          />
        }
      />
      <Divider style={styles.divider} />

      <View style={styles.content}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText} testID="progress-indicator">
            {session.currentIndex + 1} of {session.questions.length}
          </Text>
          {session.challengeMode && (
            <View style={styles.challengeBadge}>
              <Text style={styles.challengeBadgeText}>⚡ Challenge</Text>
            </View>
          )}
        </View>

        {/* Question Prompt */}
        <Text style={styles.questionPrompt}>{currentQuestion.prompt}</Text>

        {/* Play Button Area */}
        <View style={styles.playArea}>
          {session.state === 'ready' && (
            <PlayButton
              onPress={handlePlay}
              label="PLAY"
              testID="play-button"
            />
          )}

          {session.state === 'playing' && (
            <View style={styles.playingIndicator}>
              <Text style={styles.playingText}>Playing...</Text>
            </View>
          )}

          {session.state === 'answering' && (
            <>
              <TouchableOpacity
                style={styles.replayButton}
                onPress={handlePlay}
                activeOpacity={0.7}
                testID="replay-button"
              >
                <Text style={styles.replayButtonText}>[ ↻ REPLAY ]</Text>
              </TouchableOpacity>
              <Text style={styles.answerHint} testID="play-hint">
                Select your answer below
              </Text>
            </>
          )}

          {session.state === 'feedback' && (
            <View style={styles.feedbackContainer}>
              <Text
                style={[
                  styles.feedbackText,
                  { color: isCorrect ? colors.accentGreen : colors.accentPink },
                ]}
              >
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </Text>
              {!isCorrect && (
                <Text style={styles.correctAnswerText}>
                  The answer was:{' '}
                  {currentQuestion.options.find(
                    (o) => o.id === currentQuestion.correctAnswerId
                  )?.label}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Answer Grid */}
        {(session.state === 'answering' || session.state === 'feedback') && (
          <View style={styles.answerArea}>
            <AnswerGrid
              options={answerOptions}
              onSelect={handleAnswerSelect}
              getState={getAnswerState}
              disabled={session.state === 'feedback'}
              columns={answerOptions.length <= 3 ? answerOptions.length : 2}
            />
          </View>
        )}

        {/* Next / Finish Button */}
        {session.state === 'feedback' && (
          <View style={styles.nextButtonContainer}>
            {session.currentIndex < session.questions.length - 1 ? (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
                activeOpacity={0.7}
                testID="next-button"
              >
                <Text style={styles.nextButtonText}>[ NEXT ]</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.nextButton, styles.finishButton]}
                onPress={handleFinish}
                activeOpacity={0.7}
                testID="finish-button"
              >
                <Text style={[styles.nextButtonText, styles.finishButtonText]}>
                  [ FINISH ]
                </Text>
              </TouchableOpacity>
            )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.textMuted,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  progressText: {
    fontFamily: fonts.monoBold,
    fontSize: 14,
    color: colors.textSecondary,
  },
  challengeBadge: {
    marginLeft: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.accentBlue + '30',
    borderRadius: 4,
  },
  challengeBadgeText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.accentBlue,
  },
  questionPrompt: {
    fontFamily: fonts.monoBold,
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  playArea: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    minHeight: 120,
  },
  playingIndicator: {
    padding: spacing.lg,
  },
  playingText: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.textSecondary,
  },
  replayButton: {
    marginBottom: spacing.md,
  },
  replayButtonText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
  },
  answerHint: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textMuted,
  },
  feedbackContainer: {
    alignItems: 'center',
  },
  feedbackText: {
    fontFamily: fonts.monoBold,
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  correctAnswerText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
  },
  answerArea: {
    flex: 1,
    justifyContent: 'center',
  },
  nextButtonContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  nextButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.textPrimary,
    borderRadius: 8,
  },
  nextButtonText: {
    fontFamily: fonts.monoBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  finishButton: {
    borderColor: colors.accentGreen,
  },
  finishButtonText: {
    color: colors.accentGreen,
  },
  // Results screen styles
  resultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  resultsScore: {
    fontFamily: fonts.monoBold,
    fontSize: 48,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  resultsPercentage: {
    fontFamily: fonts.monoBold,
    fontSize: 32,
    marginBottom: spacing.xl,
  },
  resultsBadge: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  resultsBadgeText: {
    fontFamily: fonts.monoBold,
    fontSize: 18,
    letterSpacing: 1,
  },
  xpAwarded: {
    fontFamily: fonts.monoBold,
    fontSize: 20,
    color: colors.accentGreen,
    marginBottom: spacing.lg,
  },
  resultsMessage: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  resultsButtons: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  resultsButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 8,
  },
  resultsButtonText: {
    fontFamily: fonts.monoBold,
    fontSize: 14,
    color: colors.textSecondary,
  },
  continueButton: {
    borderColor: colors.accentGreen,
    backgroundColor: colors.accentGreen + '20',
  },
  continueButtonText: {
    color: colors.accentGreen,
  },
});
