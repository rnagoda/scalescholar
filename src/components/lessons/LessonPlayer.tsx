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
import { XP_AMOUNTS } from '../../types/xp';
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
    blockAttempts,
    earnedUnlocks,
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

    // Calculate XP breakdown from block attempts
    const firstTryCorrect = blockAttempts.filter(a => a.correct && a.firstTry).length;
    const retryCorrect = blockAttempts.filter(a => a.correct && !a.firstTry).length;

    const firstTryXP = firstTryCorrect * XP_AMOUNTS.LESSON_BLOCK_CORRECT_FIRST;
    const retryXP = retryCorrect * XP_AMOUNTS.LESSON_BLOCK_CORRECT_RETRY;
    const completionXP = XP_AMOUNTS.LESSON_COMPLETE;
    const unlockXP = earnedUnlocks.length * XP_AMOUNTS.NEW_UNLOCK;
    const totalXP = firstTryXP + retryXP + completionXP + unlockXP;

    return (
      <View style={styles.container}>
        <View style={styles.completeContainer}>
          <Text style={styles.completeIcon}>✓</Text>
          <Text style={styles.completeTitle}>Lesson Complete!</Text>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>

          {/* Results Card */}
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
          </Card>

          {/* XP Breakdown Card */}
          <Card style={styles.xpCard}>
            <Text style={styles.xpTitle}>XP EARNED</Text>

            <View style={styles.xpRow}>
              <Text style={styles.xpLabel}>Lesson Complete</Text>
              <Text style={styles.xpValue}>+{completionXP}</Text>
            </View>

            {firstTryXP > 0 && (
              <View style={styles.xpRow}>
                <Text style={styles.xpLabel}>
                  First Try Correct ({firstTryCorrect}×{XP_AMOUNTS.LESSON_BLOCK_CORRECT_FIRST})
                </Text>
                <Text style={styles.xpValue}>+{firstTryXP}</Text>
              </View>
            )}

            {retryXP > 0 && (
              <View style={styles.xpRow}>
                <Text style={styles.xpLabel}>
                  Retry Correct ({retryCorrect}×{XP_AMOUNTS.LESSON_BLOCK_CORRECT_RETRY})
                </Text>
                <Text style={styles.xpValue}>+{retryXP}</Text>
              </View>
            )}

            {unlockXP > 0 && (
              <View style={styles.xpRow}>
                <Text style={styles.xpLabel}>
                  New Unlocks ({earnedUnlocks.length}×{XP_AMOUNTS.NEW_UNLOCK})
                </Text>
                <Text style={styles.xpValue}>+{unlockXP}</Text>
              </View>
            )}

            <View style={styles.xpDivider} />

            <View style={styles.xpRow}>
              <Text style={styles.xpTotalLabel}>Total</Text>
              <Text style={styles.xpTotalValue}>+{totalXP}</Text>
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
    marginBottom: spacing.md,
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
  // XP Breakdown Card
  xpCard: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  xpTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    letterSpacing: 1.5,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  xpLabel: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  xpValue: {
    fontFamily: fonts.monoBold,
    fontSize: 14,
    color: colors.accentGreen,
  },
  xpDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
  xpTotalLabel: {
    fontFamily: fonts.monoBold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  xpTotalValue: {
    fontFamily: fonts.monoBold,
    fontSize: 18,
    color: colors.accentGreen,
  },
  completeActions: {
    marginTop: spacing.lg,
  },
});
