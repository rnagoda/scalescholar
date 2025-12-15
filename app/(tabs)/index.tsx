import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors, typography, spacing } from '@/src/theme';
import {
  ScreenHeader,
  Card,
  BracketButton,
  LabelValue,
  ProgressBar,
  Divider,
  AppFooter,
} from '@/src/components/common';
import { useProgressStore } from '@/src/stores/useProgressStore';
import { ALL_INTERVALS, ALL_SCALE_DEGREES } from '@/src/utils/music';

export default function HomeScreen() {
  const router = useRouter();

  const {
    intervalProgress,
    scaleDegreeProgress,
    isInitialized,
    initialize,
    refreshIntervalProgress,
    refreshScaleDegreeProgress,
  } = useProgressStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    } else {
      refreshIntervalProgress();
      refreshScaleDegreeProgress();
    }
  }, []);

  const formatAccuracy = (accuracy: number, totalAttempts: number): string => {
    if (accuracy === 0 && totalAttempts === 0) return '--';
    return `${Math.round(accuracy * 100)}%`;
  };

  // Interval progress
  const intervalStats = intervalProgress.stats;
  const unlockedIntervalsCount = intervalProgress.unlockedIntervals.length;
  const totalIntervals = ALL_INTERVALS.length;

  // Scale degree progress
  const scaleDegreeStats = scaleDegreeProgress.stats;
  const unlockedDegreesCount = scaleDegreeProgress.unlockedDegrees.length;
  const totalDegrees = ALL_SCALE_DEGREES.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="SCALE SCHOLAR"
        rightContent={
          <BracketButton
            label="?"
            onPress={() => router.push('/settings')}
          />
        }
      />
      <Divider style={styles.divider} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card>
          <Text style={styles.cardTitle}>Interval Trainer</Text>
          <View style={styles.cardContent}>
            <LabelValue
              label="Accuracy:"
              value={formatAccuracy(intervalStats.accuracy, intervalStats.totalAttempts)}
            />
            <LabelValue label="Current Streak:" value={intervalStats.streak.toString()} />
          </View>
          <View style={styles.progressContainer}>
            <ProgressBar progress={unlockedIntervalsCount / totalIntervals} />
            <Text style={styles.progressLabel}>
              {unlockedIntervalsCount}/{totalIntervals} unlocked
            </Text>
          </View>
          <View style={styles.cardAction}>
            <BracketButton
              label="TRAIN"
              onPress={() => router.push('/exercise/intervals')}
              color={colors.accentGreen}
            />
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Scale Degree Trainer</Text>
          <View style={styles.cardContent}>
            <LabelValue
              label="Accuracy:"
              value={formatAccuracy(scaleDegreeStats.accuracy, scaleDegreeStats.totalAttempts)}
            />
            <LabelValue label="Current Streak:" value={scaleDegreeStats.streak.toString()} />
          </View>
          <View style={styles.progressContainer}>
            <ProgressBar progress={unlockedDegreesCount / totalDegrees} />
            <Text style={styles.progressLabel}>
              {unlockedDegreesCount}/{totalDegrees} unlocked
            </Text>
          </View>
          <View style={styles.cardAction}>
            <BracketButton
              label="TRAIN"
              onPress={() => router.push('/exercise/scale-degrees')}
              color={colors.accentGreen}
            />
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Chord Quality Trainer</Text>
          <View style={styles.cardContent}>
            <LabelValue label="Accuracy:" value="--" />
            <LabelValue label="Current Streak:" value="0" />
          </View>
          <View style={styles.progressContainer}>
            <ProgressBar progress={0.5} />
            <Text style={styles.progressLabel}>2/4 unlocked</Text>
          </View>
          <View style={styles.cardAction}>
            <BracketButton
              label="COMING SOON"
              onPress={() => {}}
              color={colors.textMuted}
            />
          </View>
        </Card>

        <AppFooter />
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  cardTitle: {
    ...typography.cardTitle,
    marginBottom: spacing.md,
  },
  cardContent: {
    marginBottom: spacing.md,
  },
  progressContainer: {
    marginBottom: spacing.sm,
  },
  progressLabel: {
    ...typography.label,
    fontSize: 12,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  cardAction: {
    alignItems: 'flex-end',
    marginTop: spacing.sm,
  },
});
