/**
 * Fill-Blank Block Component
 *
 * Displays text with blanks that user fills in by selecting options.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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

        let borderColor: string = colors.textMuted;
        let backgroundColor: string = 'transparent';
        let textColor: string = colors.textMuted;

        if (showFeedback) {
          const isBlankCorrect = selection === blank.correctIndex;
          borderColor = isBlankCorrect ? colors.accentGreen : colors.accentPink;
          backgroundColor = isBlankCorrect ? colors.accentGreen + '20' : colors.accentPink + '20';
          textColor = isBlankCorrect ? colors.accentGreen : colors.accentPink;
        } else if (selection !== null) {
          borderColor = colors.accentBlue;
          backgroundColor = colors.accentBlue + '20';
          textColor = colors.accentBlue;
        } else if (isActive) {
          borderColor = colors.accentBlue;
          backgroundColor = colors.accentBlue + '10';
          textColor = colors.accentBlue;
        }

        // Use Text with onPress for inline flow (TouchableOpacity breaks inline layout)
        return (
          <Text
            key={index}
            style={[
              styles.blankText,
              {
                color: textColor,
                borderColor,
                backgroundColor,
                borderWidth: 1,
                borderRadius: 4,
                paddingHorizontal: 8,
                paddingVertical: 2,
                marginHorizontal: 4,
              },
            ]}
            onPress={() => !showFeedback && setActiveBlankIndex(blankIndex)}
            suppressHighlighting={false}
          >
            {selection !== null ? blank.options[selection] : '______'}
          </Text>
        );
      }

      return part;
    });
  };

  const activeBlank = activeBlankIndex !== null ? content.blanks[activeBlankIndex] : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    flexGrow: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  textWrapper: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 32,
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
