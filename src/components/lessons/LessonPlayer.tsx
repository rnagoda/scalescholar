/**
 * Lesson Player Component
 *
 * Main container for playing through a lesson.
 * Manages block progression and integrates with lesson store.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../theme';
import { Lesson, isGradedBlock } from '../../types/lesson';
import { useLessonStore } from '../../stores/useLessonStore';
import { useXPStore } from '../../stores/useXPStore';
import { ProgressBar, BracketButton, Card, LevelUpModal } from '../common';
import { BlockRenderer } from './BlockRenderer';
import { AudioEngine } from '../../audio/AudioEngine';

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete: () => void;
  onExit: () => void;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  lesson,
  onComplete,
  onExit,
}) => {
  const {
    currentBlockIndex,
    lessonState,
    selectedAnswer,
    isCorrect,
    correctCount,
    totalGradedBlocks,
    isLoading,
    startLesson,
    selectAnswer,
    submitAnswer,
    nextBlock,
    completeLesson,
    getCurrentBlock,
    getProgress,
  } = useLessonStore();

  // XP store for level-up celebration
  const { levelUpInfo, clearLevelUpInfo } = useXPStore();

  // Start lesson on mount
  useEffect(() => {
    startLesson(lesson);
  }, [lesson.id]);

  const currentBlock = getCurrentBlock();
  const progress = getProgress();

  // Handle answer selection
  const handleAnswer = (answer: unknown) => {
    // Stop any playing audio immediately when answer is submitted
    AudioEngine.stop();
    selectAnswer(answer);
    // Auto-submit for most block types
    submitAnswer();
  };

  // Handle continue after feedback
  const handleContinue = async () => {
    // Stop any playing audio when moving to next block
    AudioEngine.stop();
    if (lessonState === 'complete') {
      // Complete the lesson (awards XP, may trigger level-up)
      await completeLesson();
      // If there's a level-up, the modal will be shown on the completion screen
      // and onComplete will be called when the modal is dismissed
      // If no level-up, navigate immediately
      if (!useXPStore.getState().levelUpInfo) {
        onComplete();
      }
      // If there IS levelUpInfo, the modal will show and handleLevelUpDismiss will call onComplete
    } else {
      nextBlock();
    }
  };

  // Handle level-up modal dismissal - navigate after celebration
  const handleLevelUpDismiss = () => {
    clearLevelUpInfo();
    onComplete();
  };

  // Handle exit - stop audio and call onExit
  const handleExit = () => {
    AudioEngine.stop();
    onExit();
  };

  // Completion screen
  if (lessonState === 'complete') {
    const accuracy = totalGradedBlocks > 0
      ? Math.round((correctCount / totalGradedBlocks) * 100)
      : 100;

    return (
      <View style={styles.container}>
        <View style={styles.completeContainer}>
          <Text style={styles.completeIcon}>✓</Text>
          <Text style={styles.completeTitle}>Lesson Complete!</Text>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>

          <Card style={styles.resultsCard}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Correct Answers</Text>
              <Text style={styles.resultValue}>
                {correctCount}/{totalGradedBlocks}
              </Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Accuracy</Text>
              <Text style={[
                styles.resultValue,
                { color: accuracy >= 80 ? colors.accentGreen : colors.textPrimary }
              ]}>
                {accuracy}%
              </Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>XP Earned</Text>
              <Text style={[styles.resultValue, { color: colors.accentGreen }]}>
                +{lesson.xpReward}
              </Text>
            </View>
          </Card>

          <View style={styles.completeActions}>
            <BracketButton
              label="CONTINUE"
              onPress={handleContinue}
              color={colors.accentGreen}
            />
          </View>
        </View>

        {/* Level Up Modal - shown after user acknowledges lesson completion */}
        {levelUpInfo && (
          <LevelUpModal
            visible={!!levelUpInfo}
            previousLevel={levelUpInfo.previousLevel}
            previousTitle={levelUpInfo.previousTitle}
            newLevel={levelUpInfo.newLevel}
            newTitle={levelUpInfo.newTitle}
            onClose={handleLevelUpDismiss}
          />
        )}
      </View>
    );
  }

  // Loading state
  if (isLoading || !currentBlock) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  const showFeedback = lessonState === 'feedback';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.blockCounter}>
            {currentBlockIndex + 1} / {lesson.blocks.length}
          </Text>
          <BracketButton label="X" onPress={handleExit} />
        </View>
        <ProgressBar progress={progress} style={styles.progressBar} />
      </View>

      {/* Block content */}
      <View style={styles.content}>
        <BlockRenderer
          key={currentBlock.id}
          block={currentBlock}
          onAnswer={handleAnswer}
          onContinue={handleContinue}
          showFeedback={showFeedback}
          isCorrect={isCorrect}
          selectedAnswer={selectedAnswer}
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  blockCounter: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
  },
  progressBar: {
    height: 4,
  },
  content: {
    flex: 1,
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
  // Completion screen
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  completeIcon: {
    fontSize: 64,
    color: colors.accentGreen,
    marginBottom: spacing.lg,
  },
  completeTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 24,
    color: colors.accentGreen,
    marginBottom: spacing.sm,
  },
  lessonTitle: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  resultsCard: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  resultLabel: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
  },
  resultValue: {
    fontFamily: fonts.monoBold,
    fontSize: 18,
    color: colors.textPrimary,
  },
  completeActions: {
    marginTop: spacing.lg,
  },
});
