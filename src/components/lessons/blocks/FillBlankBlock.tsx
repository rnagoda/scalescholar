/**
 * Fill-Blank Block Component
 *
 * Displays text with blanks that user fills in by selecting options.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fonts, spacing } from '../../../theme';
import { FillBlankContent } from '../../../types/lesson';
import { BracketButton } from '../../common';

interface FillBlankBlockProps {
  content: FillBlankContent;
  onAnswer: (selectedIndices: number[]) => void;
  showFeedback: boolean;
  isCorrect: boolean | null;
  selectedAnswer: number[] | null;
  onContinue: () => void;
}

export const FillBlankBlock: React.FC<FillBlankBlockProps> = ({
  content,
  onAnswer,
  showFeedback,
  isCorrect,
  selectedAnswer,
  onContinue,
}) => {
  const [selections, setSelections] = useState<(number | null)[]>(
    content.blanks.map(() => null)
  );
  const [activeBlankIndex, setActiveBlankIndex] = useState<number | null>(null);

  const handleSelectOption = (blankIndex: number, optionIndex: number) => {
    const newSelections = [...selections];
    newSelections[blankIndex] = optionIndex;
    setSelections(newSelections);
    setActiveBlankIndex(null);

    // Check if all blanks are filled
    if (newSelections.every((s) => s !== null)) {
      onAnswer(newSelections as number[]);
    }
  };

  const renderTextWithBlanks = () => {
    const parts = content.textWithBlanks.split(/(\{\{\d+\}\})/);

    return parts.map((part, index) => {
      const blankMatch = part.match(/\{\{(\d+)\}\}/);

      if (blankMatch) {
        const blankIndex = parseInt(blankMatch[1], 10);
        const blank = content.blanks[blankIndex];
        const selection = selections[blankIndex];
        const isActive = activeBlankIndex === blankIndex;

        let blankStyleName: 'blankDefault' | 'blankActive' | 'blankFilled' | 'blankCorrect' | 'blankIncorrect' = 'blankDefault';
        let textColor: string = colors.textMuted;

        if (showFeedback) {
          const isBlankCorrect = selection === blank.correctIndex;
          blankStyleName = isBlankCorrect ? 'blankCorrect' : 'blankIncorrect';
          textColor = isBlankCorrect ? colors.accentGreen : colors.accentPink;
        } else if (selection !== null) {
          blankStyleName = 'blankFilled';
          textColor = colors.accentBlue;
        } else if (isActive) {
          blankStyleName = 'blankActive';
          textColor = colors.accentBlue;
        }

        return (
          <TouchableOpacity
            key={index}
            style={[styles.blank, styles[blankStyleName]]}
            onPress={() => !showFeedback && setActiveBlankIndex(blankIndex)}
            disabled={showFeedback}
          >
            <Text style={[styles.blankText, { color: textColor }]}>
              {selection !== null ? blank.options[selection] : '______'}
            </Text>
          </TouchableOpacity>
        );
      }

      return (
        <Text key={index} style={styles.text}>
          {part}
        </Text>
      );
    });
  };

  const activeBlank = activeBlankIndex !== null ? content.blanks[activeBlankIndex] : null;

  return (
    <View style={styles.container}>
      {/* Text with blanks */}
      <View style={styles.textContainer}>
        <Text style={styles.textWrapper}>{renderTextWithBlanks()}</Text>
      </View>

      {/* Options for active blank */}
      {activeBlank && !showFeedback && (
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsLabel}>Select an answer:</Text>
          <View style={styles.optionsRow}>
            {activeBlank.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.option}
                onPress={() => handleSelectOption(activeBlankIndex!, index)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Feedback */}
      {showFeedback && (
        <View style={styles.feedbackContainer}>
          <Text style={[
            styles.feedbackText,
            { color: isCorrect ? colors.accentGreen : colors.accentPink }
          ]}>
            {isCorrect ? 'Correct!' : 'Not quite.'}
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
    padding: spacing.lg,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  textWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  text: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 32,
  },
  blank: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    borderWidth: 1,
    marginHorizontal: spacing.xs,
  },
  blankDefault: {
    borderColor: colors.textMuted,
    borderStyle: 'dashed',
  },
  blankActive: {
    borderColor: colors.accentBlue,
    backgroundColor: colors.accentBlue + '10',
  },
  blankFilled: {
    borderColor: colors.accentBlue,
    backgroundColor: colors.accentBlue + '20',
  },
  blankCorrect: {
    borderColor: colors.accentGreen,
    backgroundColor: colors.accentGreen + '20',
  },
  blankIncorrect: {
    borderColor: colors.accentPink,
    backgroundColor: colors.accentPink + '20',
  },
  blankText: {
    fontFamily: fonts.monoBold,
    fontSize: 16,
  },
  optionsContainer: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  optionsLabel: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  option: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  optionText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textPrimary,
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
