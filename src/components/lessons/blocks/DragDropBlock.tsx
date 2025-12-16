/**
 * DragDropBlock Component
 *
 * Interactive block where users drag items to correct target zones.
 * Uses a tap-to-select then tap-target approach for better mobile UX.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DragDropContent } from '../../../types/lesson';
import { colors, fonts, spacing, typography } from '../../../theme';
import { BracketButton } from '../../common/BracketButton';

interface DragDropBlockProps {
  content: DragDropContent;
  onAnswer: (placements: Record<string, string>) => void;
  showFeedback: boolean;
  isCorrect: boolean | null;
  selectedAnswer: Record<string, string> | null;
  onContinue: () => void;
}

export const DragDropBlock: React.FC<DragDropBlockProps> = ({
  content,
  onAnswer,
  showFeedback,
  isCorrect,
  selectedAnswer,
  onContinue,
}) => {
  // Initialize placements from selectedAnswer or empty object
  const [placements, setPlacements] = useState<Record<string, string>>(
    () => {
      if (selectedAnswer) {
        return selectedAnswer;
      }
      // Create empty mapping
      const initial: Record<string, string> = {};
      return initial;
    }
  );
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const canAnswer = !showFeedback;

  // Get items not yet placed in any zone
  const unplacedItems = useMemo(() => {
    const placedItemIds = Object.keys(placements);
    return content.items.filter((item) => !placedItemIds.includes(item.id));
  }, [content.items, placements]);

  // Get item placed in a zone
  const getPlacedItemForZone = useCallback(
    (zoneId: string) => {
      const entry = Object.entries(placements).find(
        ([, zone]) => zone === zoneId
      );
      if (!entry) return null;
      return content.items.find((item) => item.id === entry[0]);
    },
    [placements, content.items]
  );

  // Check if placement is correct (only shown in feedback)
  const isPlacementCorrect = useCallback(
    (zoneId: string): boolean | null => {
      if (!showFeedback) return null;
      const item = getPlacedItemForZone(zoneId);
      if (!item) return null;
      return item.correctZone === zoneId;
    },
    [showFeedback, getPlacedItemForZone]
  );

  // Handle item selection
  const handleItemPress = useCallback(
    (itemId: string) => {
      if (!canAnswer) return;

      // If already selected, deselect
      if (selectedItemId === itemId) {
        setSelectedItemId(null);
        return;
      }

      // Select this item
      setSelectedItemId(itemId);
    },
    [canAnswer, selectedItemId]
  );

  // Handle zone press - place selected item
  const handleZonePress = useCallback(
    (zoneId: string) => {
      if (!canAnswer || !selectedItemId) return;

      // Remove item from any previous zone and remove any item from this zone
      setPlacements((prev) => {
        const newPlacements = { ...prev };

        // Remove the selected item from wherever it was
        delete newPlacements[selectedItemId];

        // Remove any item currently in the target zone
        Object.keys(newPlacements).forEach((itemId) => {
          if (newPlacements[itemId] === zoneId) {
            delete newPlacements[itemId];
          }
        });

        // Place the selected item in the zone
        newPlacements[selectedItemId] = zoneId;

        return newPlacements;
      });

      setSelectedItemId(null);
    },
    [canAnswer, selectedItemId]
  );

  // Handle removing item from zone
  const handleRemoveFromZone = useCallback(
    (zoneId: string) => {
      if (!canAnswer) return;
      setPlacements((prev) => {
        const newPlacements = { ...prev };
        Object.keys(newPlacements).forEach((itemId) => {
          if (newPlacements[itemId] === zoneId) {
            delete newPlacements[itemId];
          }
        });
        return newPlacements;
      });
    },
    [canAnswer]
  );

  // Check if all items are placed
  const allPlaced = Object.keys(placements).length === content.items.length;

  // Submit answer
  const handleSubmit = useCallback(() => {
    onAnswer(placements);
  }, [placements, onAnswer]);

  // Clear all placements
  const handleClear = useCallback(() => {
    setPlacements({});
    setSelectedItemId(null);
  }, []);

  return (
    <View style={styles.container}>
      {/* Instruction */}
      <Text style={styles.instruction}>{content.instruction}</Text>

      {/* Help text */}
      {canAnswer && (
        <Text style={styles.helpText}>
          {selectedItemId
            ? 'Tap a zone to place the item'
            : 'Tap an item to select it'}
        </Text>
      )}

      {/* Drop Zones */}
      <View style={styles.zonesContainer}>
        {content.zones.map((zone) => {
          const placedItem = getPlacedItemForZone(zone.id);
          const correctness = isPlacementCorrect(zone.id);

          return (
            <TouchableOpacity
              key={zone.id}
              style={[
                styles.zone,
                selectedItemId && !placedItem && styles.zoneActive,
                correctness === true && styles.zoneCorrect,
                correctness === false && styles.zoneIncorrect,
              ]}
              onPress={() =>
                placedItem
                  ? handleRemoveFromZone(zone.id)
                  : handleZonePress(zone.id)
              }
              disabled={!canAnswer}
              activeOpacity={0.7}
            >
              <Text style={styles.zoneLabel}>{zone.label}</Text>
              {placedItem && (
                <View
                  style={[
                    styles.placedItemBadge,
                    correctness === true && styles.placedItemCorrect,
                    correctness === false && styles.placedItemIncorrect,
                  ]}
                >
                  <Text style={styles.placedItemText}>{placedItem.label}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Unplaced Items */}
      {unplacedItems.length > 0 && canAnswer && (
        <View style={styles.itemsContainer}>
          <Text style={styles.itemsLabel}>ITEMS</Text>
          <View style={styles.itemsRow}>
            {unplacedItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.item,
                  selectedItemId === item.id && styles.itemSelected,
                ]}
                onPress={() => handleItemPress(item.id)}
                disabled={!canAnswer}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.itemText,
                    selectedItemId === item.id && styles.itemTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Actions */}
      {canAnswer && (
        <View style={styles.actionsContainer}>
          {Object.keys(placements).length > 0 && (
            <BracketButton
              label="CLEAR"
              onPress={handleClear}
              color={colors.textSecondary}
            />
          )}
          <BracketButton
            label="CHECK"
            onPress={handleSubmit}
            color={allPlaced ? colors.accentGreen : colors.textMuted}
          />
        </View>
      )}

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
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  instruction: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  helpText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  zonesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  zone: {
    minWidth: 120,
    minHeight: 80,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.cardBorder,
    borderRadius: 8,
    padding: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBackground,
  },
  zoneActive: {
    borderColor: colors.accentBlue,
    backgroundColor: colors.accentBlue + '10',
  },
  zoneCorrect: {
    borderColor: colors.accentGreen,
    backgroundColor: colors.accentGreen + '15',
  },
  zoneIncorrect: {
    borderColor: colors.accentPink,
    backgroundColor: colors.accentPink + '15',
  },
  zoneLabel: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  placedItemBadge: {
    marginTop: spacing.sm,
    backgroundColor: colors.accentBlue + '30',
    borderRadius: 4,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  placedItemCorrect: {
    backgroundColor: colors.accentGreen + '30',
  },
  placedItemIncorrect: {
    backgroundColor: colors.accentPink + '30',
  },
  placedItemText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textPrimary,
  },
  itemsContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  itemsLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  itemsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  item: {
    backgroundColor: colors.cardBackground,
    borderWidth: 2,
    borderColor: colors.accentBlue,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  itemSelected: {
    backgroundColor: colors.accentBlue,
    borderColor: colors.accentBlue,
  },
  itemText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textPrimary,
  },
  itemTextSelected: {
    color: colors.background,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  feedbackContainer: {
    marginTop: spacing.lg,
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
