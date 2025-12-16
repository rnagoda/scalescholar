import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { colors, typography, spacing, fonts } from '@/src/theme';
import {
  ScreenHeader,
  Card,
  LabelValue,
  SectionHeader,
  Divider,
  ProgressBar,
  AppFooter,
  BracketButton,
} from '@/src/components/common';
import { useProgressStore } from '@/src/stores/useProgressStore';
import {
  Interval,
  INTERVAL_SHORT_NAMES,
  INTERVAL_FULL_NAMES,
  ALL_INTERVALS,
} from '@/src/utils/music';
import { getVoiceTrainingStats } from '@/src/services/voiceProfileService';
import { VoiceTrainingStats, VoiceExerciseType } from '@/src/types/voiceAnalyzer';

const VOICE_EXERCISE_NAMES: Record<VoiceExerciseType, string> = {
  note_match: 'Note Match',
  scale: 'Scale Practice',
  glide: 'Pitch Glide',
  sustain: 'Sustain',
};

export default function ProgressScreen() {
  const router = useRouter();

  const {
    intervalProgress,
    isLoading,
    isInitialized,
    initialize,
    refreshIntervalProgress,
  } = useProgressStore();

  const [voiceStats, setVoiceStats] = useState<VoiceTrainingStats | null>(null);

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    } else {
      refreshIntervalProgress();
    }
    // Load voice training stats
    loadVoiceStats();
  }, []);

  const loadVoiceStats = async () => {
    try {
      const stats = await getVoiceTrainingStats();
      setVoiceStats(stats);
    } catch (error) {
      console.error('Failed to load voice stats:', error);
    }
  };

  const { stats, itemStats, unlockedIntervals } = intervalProgress;

  const formatAccuracy = (accuracy: number): string => {
    if (accuracy === 0 && stats.totalAttempts === 0) return '--';
    return `${Math.round(accuracy * 100)}%`;
  };

  const getItemAccuracy = (interval: Interval): string => {
    const item = itemStats.find((s) => s.itemId === interval.toString());
    if (!item || item.totalAttempts === 0) return '--';
    return `${Math.round(item.accuracy * 100)}%`;
  };

  const getItemAttempts = (interval: Interval): number => {
    const item = itemStats.find((s) => s.itemId === interval.toString());
    return item?.totalAttempts ?? 0;
  };

  const unlockedCount = unlockedIntervals.length;
  const totalIntervals = ALL_INTERVALS.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="PROGRESS"
        rightContent={
          <BracketButton label="X" onPress={() => router.back()} />
        }
      />
      <Divider style={styles.divider} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{stats.totalAttempts}</Text>
                <Text style={styles.statLabel}>Total Attempts</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{stats.streak}</Text>
                <Text style={styles.statLabel}>Current Streak</Text>
              </View>
            </View>

            <SectionHeader title="INTERVALS" />
            <Card>
              <LabelValue
                label="Overall Accuracy:"
                value={formatAccuracy(stats.accuracy)}
              />
              <LabelValue
                label="Recent (last 20):"
                value={formatAccuracy(stats.recentAccuracy)}
              />
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Unlocked:</Text>
                <View style={styles.progressContainer}>
                  <ProgressBar
                    progress={unlockedCount / totalIntervals}
                    style={styles.progressBar}
                  />
                  <Text style={styles.progressText}>
                    {unlockedCount}/{totalIntervals}
                  </Text>
                </View>
              </View>
            </Card>

            <SectionHeader title="INTERVAL BREAKDOWN" />
            <Card>
              {ALL_INTERVALS.map((interval) => {
                const isUnlocked = unlockedIntervals.includes(interval);
                const attempts = getItemAttempts(interval);
                const accuracy = getItemAccuracy(interval);

                return (
                  <View
                    key={interval}
                    style={[
                      styles.intervalRow,
                      !isUnlocked && styles.lockedRow,
                    ]}
                  >
                    <View style={styles.intervalInfo}>
                      <Text
                        style={[
                          styles.intervalName,
                          !isUnlocked && styles.lockedText,
                        ]}
                      >
                        {INTERVAL_SHORT_NAMES[interval]}
                      </Text>
                      <Text
                        style={[
                          styles.intervalFullName,
                          !isUnlocked && styles.lockedText,
                        ]}
                      >
                        {isUnlocked ? INTERVAL_FULL_NAMES[interval] : 'Locked'}
                      </Text>
                    </View>
                    <View style={styles.intervalStats}>
                      {isUnlocked ? (
                        <>
                          <Text style={styles.intervalAccuracy}>{accuracy}</Text>
                          <Text style={styles.intervalAttempts}>
                            {attempts} {attempts === 1 ? 'try' : 'tries'}
                          </Text>
                        </>
                      ) : (
                        <Text style={styles.lockedIcon}>🔒</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </Card>

            <View style={styles.unlockHint}>
              <Text style={styles.hintText}>
                Unlock new intervals by achieving 80% accuracy with 20+
                attempts on unlocked intervals.
              </Text>
            </View>

            {/* Voice Training Section */}
            {voiceStats && voiceStats.totalAttempts > 0 && (
              <>
                <SectionHeader title="VOICE TRAINING" />
                <Card>
                  <LabelValue
                    label="Total Attempts:"
                    value={voiceStats.totalAttempts.toString()}
                  />
                  <LabelValue
                    label="Average Accuracy:"
                    value={`${Math.round(voiceStats.averageAccuracy)}%`}
                  />
                  <LabelValue
                    label="Current Streak:"
                    value={voiceStats.currentStreak.toString()}
                  />
                </Card>

                {Object.keys(voiceStats.byExerciseType).length > 0 && (
                  <>
                    <SectionHeader title="VOICE EXERCISE BREAKDOWN" />
                    <Card>
                      {(Object.entries(voiceStats.byExerciseType) as [VoiceExerciseType, { attempts: number; accuracy: number; recentAccuracy: number }][]).map(
                        ([type, typeStats]) => (
                          <View key={type} style={styles.voiceExerciseRow}>
                            <View style={styles.voiceExerciseInfo}>
                              <Text style={styles.voiceExerciseName}>
                                {VOICE_EXERCISE_NAMES[type]}
                              </Text>
                              <Text style={styles.voiceExerciseAttempts}>
                                {typeStats.attempts} attempts
                              </Text>
                            </View>
                            <View style={styles.voiceExerciseStats}>
                              <Text style={styles.voiceExerciseAccuracy}>
                                {Math.round(typeStats.accuracy)}%
                              </Text>
                              <Text style={styles.voiceExerciseRecent}>
                                Recent: {Math.round(typeStats.recentAccuracy)}%
                              </Text>
                            </View>
                          </View>
                        )
                      )}
                    </Card>
                  </>
                )}
              </>
            )}

            <AppFooter />
          </>
        )}
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
  loadingText: {
    ...typography.body,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    padding: spacing.lg,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  statValue: {
    ...typography.displayLarge,
    fontSize: 36,
  },
  statLabel: {
    ...typography.label,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  progressLabel: {
    ...typography.label,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: spacing.md,
  },
  progressBar: {
    flex: 1,
    marginRight: spacing.sm,
  },
  progressText: {
    ...typography.body,
    minWidth: 40,
    textAlign: 'right',
  },
  intervalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  lockedRow: {
    opacity: 0.5,
  },
  intervalInfo: {
    flex: 1,
  },
  intervalName: {
    ...typography.body,
    fontWeight: '600',
  },
  intervalFullName: {
    ...typography.label,
    fontSize: 12,
  },
  lockedText: {
    color: colors.textMuted,
  },
  intervalStats: {
    alignItems: 'flex-end',
  },
  intervalAccuracy: {
    ...typography.body,
    color: colors.accentGreen,
  },
  intervalAttempts: {
    ...typography.label,
    fontSize: 11,
  },
  lockedIcon: {
    fontSize: 16,
  },
  unlockHint: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  hintText: {
    ...typography.label,
    fontSize: 12,
    textAlign: 'center',
    color: colors.textMuted,
  },
  // Voice Training styles
  voiceExerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  voiceExerciseInfo: {
    flex: 1,
  },
  voiceExerciseName: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textPrimary,
  },
  voiceExerciseAttempts: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textMuted,
  },
  voiceExerciseStats: {
    alignItems: 'flex-end',
  },
  voiceExerciseAccuracy: {
    fontFamily: fonts.monoBold,
    fontSize: 14,
    color: colors.accentGreen,
  },
  voiceExerciseRecent: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textSecondary,
  },
});
