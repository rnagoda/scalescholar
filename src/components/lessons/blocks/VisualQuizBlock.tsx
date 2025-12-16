/**
 * VisualQuizBlock Component
 *
 * Quiz block that shows visual notation (staff, keyboard, diagram)
 * and asks user to select the correct answer.
 */

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { VisualQuizContent } from '../../../types/lesson';
import { colors, fonts, spacing, typography } from '../../../theme';
import { AnswerButton } from '../../exercises';
import { BracketButton } from '../../common';
import { StaffNotation } from '../shared/StaffNotation';
import { PianoKeyboard } from '../shared/PianoKeyboard';

interface VisualQuizBlockProps {
  content: VisualQuizContent;
  onAnswer: (selectedIndex: number) => void;
  showFeedback: boolean;
  isCorrect: boolean | null;
  selectedAnswer: number | null;
  onContinue: () => void;
}

export const VisualQuizBlock: React.FC<VisualQuizBlockProps> = ({
  content,
  onAnswer,
  showFeedback,
  isCorrect,
  selectedAnswer,
  onContinue,
}) => {
  const getAnswerState = (
    index: number
  ): 'default' | 'selected' | 'correct' | 'incorrect' => {
    if (!showFeedback) {
      return selectedAnswer === index ? 'selected' : 'default';
    }

    if (index === content.correctIndex) {
      return 'correct';
    }

    if (selectedAnswer === index && !isCorrect) {
      return 'incorrect';
    }

    return 'default';
  };

  // Render the visual based on type
  const renderVisual = () => {
    switch (content.visualType) {
      case 'staff':
        return (
          <View style={styles.visualContainer}>
            <StaffNotation
              notes={content.visualData.notes || []}
              clef={content.visualData.clef || 'treble'}
              width={280}
              height={120}
              showNoteNames={false}
            />
          </View>
        );

      case 'keyboard':
        return (
          <View style={styles.visualContainer}>
            <PianoKeyboard
              startNote={
                content.visualData.notes?.[0]
                  ? content.visualData.notes[0] - 5
                  : 60
              }
              endNote={
                content.visualData.notes?.[0]
                  ? content.visualData.notes[content.visualData.notes.length - 1] + 5
                  : 72
              }
              selectedNotes={content.visualData.notes || []}
              showLabels={false}
              playOnPress={false}
              disabled={true}
            />
          </View>
        );

      case 'diagram':
        if (content.visualData.imageUrl) {
          return (
            <View style={styles.visualContainer}>
              <Image
                source={{ uri: content.visualData.imageUrl }}
                style={styles.diagramImage}
                resizeMode="contain"
              />
            </View>
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Question */}
      <Text style={styles.question}>{content.question}</Text>

      {/* Visual Display */}
      {renderVisual()}

      {/* Answer Options */}
      <View style={styles.optionsContainer}>
        {content.options.map((option, index) => (
          <View key={index} style={styles.optionWrapper}>
            <AnswerButton
              label={option}
              state={getAnswerState(index)}
              onPress={() => onAnswer(index)}
              disabled={showFeedback}
            />
          </View>
        ))}
      </View>

      {/* Feedback */}
      {showFeedback && (
        <View style={styles.feedbackContainer}>
          <Text
            style={[
              styles.feedbackText,
              isCorrect ? styles.correctText : styles.incorrectText,
            ]}
          >
            {isCorrect ? 'Correct!' : 'Not quite...'}
          </Text>
          {content.explanation && (
            <Text style={styles.explanation}>{content.explanation}</Text>
          )}
          <View style={styles.continueContainer}>
            <BracketButton
              label="CONTINUE"
              onPress={onContinue}
              color={colors.accentGreen}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  question: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  visualContainer: {
    marginVertical: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  diagramImage: {
    width: 280,
    height: 150,
  },
  optionsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  optionWrapper: {
    width: '45%',
    minWidth: 140,
  },
  feedbackContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  feedbackText: {
    fontFamily: fonts.monoBold,
    fontSize: 20,
    marginBottom: spacing.md,
  },
  correctText: {
    color: colors.accentGreen,
  },
  incorrectText: {
    color: colors.accentPink,
  },
  explanation: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },
  continueContainer: {
    marginTop: spacing.xl,
  },
});
