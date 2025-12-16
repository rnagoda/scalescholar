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

  // Use block.id as key to force re-mount when block changes
  // This ensures useState initializers run fresh for each block
  switch (content.type) {
    case 'text-audio':
      return (
        <TextAudioBlock
          key={block.id}
          content={content.data}
          onContinue={onContinue}
        />
      );

    case 'audio-quiz':
      return (
        <AudioQuizBlock
          key={block.id}
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
          key={block.id}
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
          key={block.id}
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
          key={block.id}
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
          key={block.id}
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
          key={block.id}
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
