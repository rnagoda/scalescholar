import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '@/src/theme';
import {
  ScreenHeader,
  Card,
  LabelValue,
  SectionHeader,
  Divider,
  ProgressBar,
  AppFooter,
} from '@/src/components/common';
import { useProgressStore } from '@/src/stores/useProgressStore';
import {
  Interval,
  INTERVAL_SHORT_NAMES,
  INTERVAL_FULL_NAMES,
  ALL_INTERVALS,
} from '@/src/utils/music';

export default function ProgressScreen() {
  const {
    intervalProgress,
    isLoading,
    isInitialized,
    initialize,
    refreshIntervalProgress,
  } = useProgressStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    } else {
      refreshIntervalProgress();
    }
  }, []);

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
      <ScreenHeader title="PROGRESS" />
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
});
