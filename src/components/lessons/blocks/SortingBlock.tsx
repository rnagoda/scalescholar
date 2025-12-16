/**
 * Sorting Block Component
 *
 * Displays items that user must arrange in correct order.
 * Uses simple tap-to-select interface for ordering.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, fonts, spacing } from '../../../theme';
import { SortingContent } from '../../../types/lesson';
import { BracketButton } from '../../common';

interface SortingBlockProps {
  content: SortingContent;
  onAnswer: (orderedIds: string[]) => void;
  showFeedback: boolean;
  isCorrect: boolean | null;
  selectedAnswer: string[] | null;
  onContinue: () => void;
}

export const SortingBlock: React.FC<SortingBlockProps> = ({
  content,
  onAnswer,
  showFeedback,
  isCorrect,
  selectedAnswer,
  onContinue,
}) => {
  // Shuffled items for selection
  const [availableItems, setAvailableItems] = useState(() =>
    [...content.items].sort(() => Math.random() - 0.5)
  );
  // Items in the order selected by user
  const [orderedItems, setOrderedItems] = useState<typeof content.items>([]);

  const handleSelectItem = (item: typeof content.items[0]) => {
    if (showFeedback) return;

    const newAvailable = availableItems.filter((i) => i.id !== item.id);
    const newOrdered = [...orderedItems, item];

    setAvailableItems(newAvailable);
    setOrderedItems(newOrdered);

    // Check if all items are ordered
    if (newOrdered.length === content.items.length) {
      onAnswer(newOrdered.map((i) => i.id));
    }
  };

  const handleRemoveItem = (index: number) => {
    if (showFeedback) return;

    const item = orderedItems[index];
    const newOrdered = orderedItems.filter((_, i) => i !== index);
    const newAvailable = [...availableItems, item];

    setOrderedItems(newOrdered);
    setAvailableItems(newAvailable);
  };

  const handleReset = () => {
    setAvailableItems([...content.items].sort(() => Math.random() - 0.5));
    setOrderedItems([]);
  };

  const getItemStyle = (item: typeof content.items[0], index: number) => {
    if (!showFeedback) return styles.orderedItem;

    const correctPosition = item.correctPosition;
    const isInCorrectPosition = index === correctPosition;

    return isInCorrectPosition ? styles.orderedItemCorrect : styles.orderedItemIncorrect;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Instruction */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instruction}>{content.instruction}</Text>
      </View>

      {/* Ordered items (answer area) */}
      <View style={styles.orderedContainer}>
        <Text style={styles.sectionLabel}>YOUR ORDER:</Text>
        <View style={styles.orderedRow}>
          {orderedItems.length === 0 ? (
            <Text style={styles.placeholder}>Tap items below to add them</Text>
          ) : (
            orderedItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.orderedItem, getItemStyle(item, index)]}
                onPress={() => handleRemoveItem(index)}
                disabled={showFeedback}
              >
                <Text style={styles.orderedIndex}>{index + 1}</Text>
                <Text style={styles.orderedLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>

      {/* Available items */}
      {!showFeedback && availableItems.length > 0 && (
        <View style={styles.availableContainer}>
          <Text style={styles.sectionLabel}>AVAILABLE:</Text>
          <View style={styles.availableRow}>
            {availableItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.availableItem}
                onPress={() => handleSelectItem(item)}
              >
                <Text style={styles.availableLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Reset button */}
      {!showFeedback && orderedItems.length > 0 && (
        <View style={styles.resetContainer}>
          <BracketButton
            label="RESET"
            onPress={handleReset}
            color={colors.textMuted}
          />
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
          {!isCorrect && (
            <Text style={styles.correctOrder}>
              Correct order: {[...content.items]
                .sort((a, b) => a.correctPosition - b.correctPosition)
                .map((i) => i.label)
                .join(', ')}
            </Text>
          )}
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
  },
  instructionContainer: {
    marginBottom: spacing.xl,
  },
  instruction: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    textAlign: 'center',
  },
  sectionLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  orderedContainer: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    minHeight: 100,
  },
  orderedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  placeholder: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  orderedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: spacing.sm,
  },
  orderedItemCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.accentGreen + '20',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accentGreen,
    gap: spacing.sm,
  },
  orderedItemIncorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.accentPink + '20',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accentPink,
    gap: spacing.sm,
  },
  orderedIndex: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    color: colors.textMuted,
  },
  orderedLabel: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.textPrimary,
  },
  availableContainer: {
    marginBottom: spacing.lg,
  },
  availableRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  availableItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accentBlue,
  },
  availableLabel: {
    fontFamily: fonts.monoBold,
    fontSize: 18,
    color: colors.accentBlue,
  },
  resetContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
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
  correctOrder: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
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
