import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors, typography, spacing, fonts } from '@/src/theme';
import {
  ScreenHeader,
  Card,
  BracketButton,
  Divider,
  LabelValue,
  ProgressBar,
} from '@/src/components/common';
import { useProgressStore } from '@/src/stores/useProgressStore';
import { ALL_INTERVALS, ALL_SCALE_DEGREES, ALL_CHORD_QUALITIES } from '@/src/utils/music';

export default function EarSchoolMenuScreen() {
  const router = useRouter();

  const {
    intervalProgress,
    scaleDegreeProgress,
    chordProgress,
    isInitialized,
    initialize,
    refreshIntervalProgress,
    refreshScaleDegreeProgress,
    refreshChordProgress,
  } = useProgressStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    } else {
      refreshIntervalProgress();
      refreshScaleDegreeProgress();
      refreshChordProgress();
    }
  }, []);

  const handleClose = () => {
    router.back();
  };

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

  // Chord quality progress
  const chordStats = chordProgress.stats;
  const unlockedChordsCount = chordProgress.unlockedQualities.length;
  const totalChords = ALL_CHORD_QUALITIES.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="EAR SCHOOL"
        testID="ear-school-header"
        rightContent={
          <BracketButton label="X" onPress={handleClose} testID="ear-school-close-button" />
        }
      />
      <Divider style={styles.divider} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Intervals */}
        <Card onPress={() => router.push('/exercise/intervals')} testID="intervals-card">
          <Text style={styles.cardTitle}>Intervals</Text>
          <Text style={styles.cardDescription}>
            Learn to identify the distance between two notes played melodically or harmonically.
          </Text>
          <View style={styles.statsContainer}>
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
        </Card>

        {/* Scale Degrees */}
        <Card onPress={() => router.push('/exercise/scale-degrees')} testID="scale-degrees-card">
          <Text style={styles.cardTitle}>Scale Degrees</Text>
          <Text style={styles.cardDescription}>
            Identify notes within a major scale context. Essential for understanding melody and harmony.
          </Text>
          <View style={styles.statsContainer}>
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
        </Card>

        {/* Chord Qualities */}
        <Card onPress={() => router.push('/exercise/chords')} testID="chord-qualities-card">
          <Text style={styles.cardTitle}>Chord Qualities</Text>
          <Text style={styles.cardDescription}>
            Distinguish between major, minor, diminished, and other chord types by ear.
          </Text>
          <View style={styles.statsContainer}>
            <LabelValue
              label="Accuracy:"
              value={formatAccuracy(chordStats.accuracy, chordStats.totalAttempts)}
            />
            <LabelValue label="Current Streak:" value={chordStats.streak.toString()} />
          </View>
          <View style={styles.progressContainer}>
            <ProgressBar progress={unlockedChordsCount / totalChords} />
            <Text style={styles.progressLabel}>
              {unlockedChordsCount}/{totalChords} unlocked
            </Text>
          </View>
        </Card>
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
    paddingBottom: spacing.xxxl,
  },
  cardTitle: {
    ...typography.cardTitle,
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  cardDescription: {
    ...typography.label,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  statsContainer: {
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
});
