import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors, typography, spacing } from '@/src/theme';
import { ScreenHeader, BracketButton, Divider, Card } from '@/src/components/common';

export default function ChordsExercise() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="CHORDS"
        rightContent={
          <BracketButton label="CLOSE" onPress={() => router.back()} />
        }
      />
      <Divider style={styles.divider} />

      <View style={styles.content}>
        <Text style={styles.questionNumber}>1 / 10</Text>

        <Card style={styles.playCard}>
          <View style={styles.playButtonContainer}>
            <BracketButton
              label="▶ PLAY"
              onPress={() => {}}
              color={colors.accentGreen}
            />
          </View>
          <Text style={styles.playHint}>Tap to hear the chord</Text>
        </Card>

        <View style={styles.answersRow}>
          <Card style={styles.answerCard}>
            <Text style={styles.answerText}>Major</Text>
          </Card>
          <Card style={styles.answerCard}>
            <Text style={styles.answerText}>Minor</Text>
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  divider: {
    marginVertical: 0,
    marginHorizontal: spacing.lg,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  questionNumber: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  playCard: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    marginBottom: spacing.xl,
  },
  playButtonContainer: {
    marginBottom: spacing.md,
  },
  playHint: {
    ...typography.label,
    fontSize: 12,
  },
  answersRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  answerCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  answerText: {
    ...typography.cardTitle,
    fontSize: 20,
  },
});
