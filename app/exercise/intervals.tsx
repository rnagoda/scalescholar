import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors, typography, spacing } from '@/src/theme';
import { ScreenHeader, BracketButton, Divider, Card } from '@/src/components/common';

export default function IntervalsExercise() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="INTERVALS"
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
          <Text style={styles.playHint}>Tap to hear the interval</Text>
        </Card>

        <View style={styles.answersGrid}>
          <View style={styles.answerRow}>
            <Card style={styles.answerCard}>
              <Text style={styles.answerText}>m3</Text>
            </Card>
            <Card style={styles.answerCard}>
              <Text style={styles.answerText}>M3</Text>
            </Card>
          </View>
          <View style={styles.answerRow}>
            <Card style={styles.answerCard}>
              <Text style={styles.answerText}>P4</Text>
            </Card>
            <Card style={styles.answerCard}>
              <Text style={styles.answerText}>P5</Text>
            </Card>
          </View>
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
  answersGrid: {
    flex: 1,
  },
  answerRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  answerCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  answerText: {
    ...typography.cardTitle,
    fontSize: 24,
  },
});
