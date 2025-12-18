/**
 * Ear School Practice Menu
 *
 * Choose between intervals, scale degrees, or chord quality practice.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href } from 'expo-router';

import { colors, typography, spacing } from '@/src/theme';
import { ScreenHeader, Card, BracketButton, Divider } from '@/src/components/common';
import { useProgressStore } from '@/src/stores/useProgressStore';

export default function PracticeMenuScreen() {
  const router = useRouter();
  const { intervalProgress, scaleDegreeProgress, chordProgress } = useProgressStore();

  const handleClose = () => {
    router.back();
  };

  const handleOpenIntervals = () => {
    router.push('/ear-school/practice/intervals' as Href);
  };

  const handleOpenScaleDegrees = () => {
    router.push('/ear-school/practice/scale-degrees' as Href);
  };

  const handleOpenChords = () => {
    router.push('/ear-school/practice/chords' as Href);
  };

  // Calculate progress stats
  const intervalStats = {
    unlocked: intervalProgress?.unlockedIntervals?.length ?? 0,
    total: 12,
  };

  const scaleDegreeStats = {
    unlocked: scaleDegreeProgress?.unlockedDegrees?.length ?? 0,
    total: 7,
  };

  const chordStats = {
    unlocked: chordProgress?.unlockedQualities?.length ?? 0,
    total: 4,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="PRACTICE"
        testID="practice-header-title"
        rightContent={
          <BracketButton
            label="X"
            onPress={handleClose}
            testID="practice-close-button"
          />
        }
      />
      <Divider style={styles.divider} />

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Free practice mode. Train any skill at your own pace.
        </Text>

        <Card onPress={handleOpenIntervals} testID="practice-intervals-card">
          <Text style={styles.cardTitle}>Intervals</Text>
          <Text style={styles.cardDescription}>
            Identify intervals from unison to octave
          </Text>
          <Text style={styles.cardProgress}>
            {intervalStats.unlocked}/{intervalStats.total} unlocked
          </Text>
        </Card>

        <Card onPress={handleOpenScaleDegrees} testID="practice-scale-degrees-card">
          <Text style={styles.cardTitle}>Scale Degrees</Text>
          <Text style={styles.cardDescription}>
            Identify notes within a key context
          </Text>
          <Text style={styles.cardProgress}>
            {scaleDegreeStats.unlocked}/{scaleDegreeStats.total} unlocked
          </Text>
        </Card>

        <Card onPress={handleOpenChords} testID="practice-chords-card">
          <Text style={styles.cardTitle}>Chord Quality</Text>
          <Text style={styles.cardDescription}>
            Identify major, minor, diminished, augmented
          </Text>
          <Text style={styles.cardProgress}>
            {chordStats.unlocked}/{chordStats.total} unlocked
          </Text>
        </Card>
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
  subtitle: {
    ...typography.label,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  cardTitle: {
    ...typography.cardTitle,
    marginBottom: spacing.xs,
  },
  cardDescription: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  cardProgress: {
    ...typography.label,
    color: colors.textMuted,
    fontSize: 12,
  },
});
