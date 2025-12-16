/**
 * Level Up Modal Component
 *
 * Displays a celebration when the user levels up.
 */

import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../../theme';
import { BracketButton } from './BracketButton';

interface LevelUpModalProps {
  visible: boolean;
  previousLevel: number;
  previousTitle: string;
  newLevel: number;
  newTitle: string;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  visible,
  previousLevel,
  previousTitle,
  newLevel,
  newTitle,
  onClose,
}) => {
  // Check if this is a major milestone (title change)
  const isMajorMilestone = previousTitle !== newTitle;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Stars decoration */}
          <Text style={styles.stars}>* * *</Text>

          {/* Level up text */}
          <Text style={styles.levelUpText}>LEVEL UP!</Text>

          {/* Level display */}
          <View style={styles.levelDisplay}>
            <Text style={styles.levelNumber}>{newLevel}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{newTitle}</Text>

          {/* Major milestone message */}
          {isMajorMilestone && (
            <View style={styles.milestoneContainer}>
              <Text style={styles.milestoneLabel}>RANK ACHIEVED</Text>
              <Text style={styles.milestoneText}>
                {previousTitle} → {newTitle}
              </Text>
            </View>
          )}

          {/* Encouragement */}
          <Text style={styles.encouragement}>
            {isMajorMilestone
              ? 'Congratulations on your progress!'
              : 'Keep up the great work!'}
          </Text>

          {/* Close button */}
          <View style={styles.buttonContainer}>
            <BracketButton
              label="CONTINUE"
              onPress={onClose}
              color={colors.accentGreen}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.accentGreen,
    padding: spacing.xxl,
    alignItems: 'center',
    minWidth: 280,
    maxWidth: '85%',
  },
  stars: {
    fontFamily: fonts.mono,
    fontSize: 24,
    color: colors.accentGreen,
    letterSpacing: 8,
    marginBottom: spacing.md,
  },
  levelUpText: {
    fontFamily: fonts.monoBold,
    fontSize: 24,
    color: colors.accentGreen,
    letterSpacing: 4,
    marginBottom: spacing.lg,
  },
  levelDisplay: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.accentGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  levelNumber: {
    fontFamily: fonts.monoBold,
    fontSize: 36,
    color: colors.accentGreen,
  },
  title: {
    fontFamily: fonts.monoBold,
    fontSize: 18,
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.lg,
  },
  milestoneContainer: {
    backgroundColor: colors.accentGreen + '20',
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  milestoneLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.accentGreen,
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  milestoneText: {
    fontFamily: fonts.monoBold,
    fontSize: 14,
    color: colors.accentGreen,
  },
  encouragement: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
});
