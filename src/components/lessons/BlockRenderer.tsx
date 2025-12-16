/**
 * Block Renderer Component
 *
 * Routes to the correct block component based on block type.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LessonBlock } from '../../types/lesson';
import { colors, fonts, spacing } from '../../theme';
import {
  TextAudioBlock,
  AudioQuizBlock,
  FillBlankBlock,
  SortingBlock,
  VisualQuizBlock,
  TapBuildBlock,
  DragDropBlock,
} from './blocks';

interface BlockRendererProps {
  block: LessonBlock;
  onAnswer: (answer: unknown) => void;
  onContinue: () => void;
  showFeedback: boolean;
  isCorrect: boolean | null;
  selectedAnswer: unknown | null;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  onAnswer,
  onContinue,
  showFeedback,
  isCorrect,
  selectedAnswer,
}) => {
  const { content } = block;

  switch (content.type) {
    case 'text-audio':
      return (
        <TextAudioBlock
          content={content.data}
          onContinue={onContinue}
        />
      );

    case 'audio-quiz':
      return (
        <AudioQuizBlock
          content={content.data}
          onAnswer={onAnswer}
          showFeedback={showFeedback}
          isCorrect={isCorrect}
          selectedAnswer={selectedAnswer as number | null}
          onContinue={onContinue}
        />
      );

    case 'visual-quiz':
      return (
        <VisualQuizBlock
          content={content.data}
          onAnswer={onAnswer}
          showFeedback={showFeedback}
          isCorrect={isCorrect}
          selectedAnswer={selectedAnswer as number | null}
          onContinue={onContinue}
        />
      );

    case 'fill-blank':
      return (
        <FillBlankBlock
          content={content.data}
          onAnswer={onAnswer}
          showFeedback={showFeedback}
          isCorrect={isCorrect}
          selectedAnswer={selectedAnswer as number[] | null}
          onContinue={onContinue}
        />
      );

    case 'sorting':
      return (
        <SortingBlock
          content={content.data}
          onAnswer={onAnswer}
          showFeedback={showFeedback}
          isCorrect={isCorrect}
          selectedAnswer={selectedAnswer as string[] | null}
          onContinue={onContinue}
        />
      );

    case 'tap-build':
      return (
        <TapBuildBlock
          content={content.data}
          onAnswer={onAnswer}
          showFeedback={showFeedback}
          isCorrect={isCorrect}
          selectedAnswer={selectedAnswer as number[] | null}
          onContinue={onContinue}
        />
      );

    case 'drag-drop':
      return (
        <DragDropBlock
          content={content.data}
          onAnswer={onAnswer}
          showFeedback={showFeedback}
          isCorrect={isCorrect}
          selectedAnswer={selectedAnswer as Record<string, string> | null}
          onContinue={onContinue}
        />
      );

    default:
      return (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Unknown block type</Text>
        </View>
      );
  }
};

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  placeholderTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  placeholderText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textMuted,
  },
});
