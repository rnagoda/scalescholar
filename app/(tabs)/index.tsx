import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href } from 'expo-router';

import { colors, typography, spacing, fonts } from '@/src/theme';
import {
  ScreenHeader,
  Card,
  BracketButton,
  LabelValue,
  Divider,
} from '@/src/components/common';
import { useVoiceProfileStore } from '@/src/stores/useVoiceProfileStore';
import { useProgressStore } from '@/src/stores/useProgressStore';
import { useXPStore } from '@/src/stores/useXPStore';
import { ALL_INTERVALS, ALL_SCALE_DEGREES, ALL_CHORD_QUALITIES } from '@/src/utils/music';

/**
 * Render ASCII-style progress bar
 * Uses block characters: ░ (empty) and █ (filled)
 */
const AsciiProgressBar: React.FC<{ progress: number; width?: number }> = ({
  progress,
  width = 20
}) => {
  const filledCount = Math.round(progress * width);
  const emptyCount = width - filledCount;
  const filled = '█'.repeat(filledCount);
  const empty = '░'.repeat(emptyCount);
  const percentage = Math.round(progress * 100);

  return (
    <Text style={asciiBarStyles.container}>
      <Text style={asciiBarStyles.filled}>{filled}</Text>
      <Text style={asciiBarStyles.empty}>{empty}</Text>
      <Text style={asciiBarStyles.percentage}> {percentage}%</Text>
    </Text>
  );
};

const asciiBarStyles = StyleSheet.create({
  container: {
    fontFamily: fonts.mono,
    fontSize: 12,
  },
  filled: {
    color: colors.accentGreen,
  },
  empty: {
    color: colors.textMuted,
  },
  percentage: {
    color: colors.textSecondary,
    fontSize: 11,
  },
});

export default function HomeScreen() {
  const router = useRouter();

  const {
    hasProfile,
    profile,
    isInitialized: voiceInitialized,
    initialize: initializeVoice,
    getProfileSummary,
    getRangeOctaves,
  } = useVoiceProfileStore();

  const {
    intervalProgress,
    scaleDegreeProgress,
    chordProgress,
    isInitialized: progressInitialized,
    initialize: initializeProgress,
    refreshIntervalProgress,
    refreshScaleDegreeProgress,
    refreshChordProgress,
  } = useProgressStore();

  const {
    totalXP,
    currentLevel,
    levelTitle,
    levelProgress,
    xpToNextLevel,
    isInitialized: xpInitialized,
    initialize: initializeXP,
    refreshXP,
  } = useXPStore();

  useEffect(() => {
    if (!voiceInitialized) {
      initializeVoice();
    }
    if (!progressInitialized) {
      initializeProgress();
    } else {
      refreshIntervalProgress();
      refreshScaleDegreeProgress();
      refreshChordProgress();
    }
    if (!xpInitialized) {
      initializeXP();
    } else {
      refreshXP();
    }
  }, []);

  // Calculate Ear School progress (average of all three)
  const earSchoolProgress = (() => {
    const intervalProg = intervalProgress.unlockedIntervals.length / ALL_INTERVALS.length;
    const degreeProg = scaleDegreeProgress.unlockedDegrees.length / ALL_SCALE_DEGREES.length;
    const chordProg = chordProgress.unlockedQualities.length / ALL_CHORD_QUALITIES.length;
    return (intervalProg + degreeProg + chordProg) / 3;
  })();

  // Voice School progress (based on profile existence and exercises completed)
  const voiceSchoolProgress = hasProfile ? 0.1 : 0; // Start at 10% if profile exists

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="SCALE SCHOLAR"
        rightContent={
          <BracketButton
            label="TUNE"
            onPress={() => router.push('/exercise/pitch-detector' as Href)}
          />
        }
      />
      <Divider style={styles.divider} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* XP Level Display */}
        <View style={styles.levelRow}>
          <View style={styles.levelInfo}>
            <Text style={styles.levelLabel}>LEVEL {currentLevel}</Text>
            <Text style={styles.levelTitle}>{levelTitle}</Text>
          </View>
          <View style={styles.xpInfo}>
            <Text style={styles.xpTotal}>{totalXP} XP</Text>
            {xpToNextLevel > 0 && (
              <Text style={styles.xpToNext}>{xpToNextLevel} to next</Text>
            )}
          </View>
        </View>
        <View style={styles.levelProgressRow}>
          <AsciiProgressBar progress={levelProgress} width={30} />
        </View>

        {/* Ear School */}
        <Card>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Ear School</Text>
            <BracketButton
              label="OPEN"
              onPress={() => router.push('/exercise/ear-school-menu' as Href)}
              color={colors.accentGreen}
            />
          </View>
          <Text style={styles.cardDescription}>
            Train your ear to recognize intervals, scale degrees, and chord qualities.
          </Text>
          <View style={styles.progressRow}>
            <AsciiProgressBar progress={earSchoolProgress} />
          </View>
        </Card>

        {/* Voice School */}
        <Card>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Voice School</Text>
            {hasProfile && profile ? (
              <BracketButton
                label="OPEN"
                onPress={() => router.push('/exercise/voice-menu' as Href)}
                color={colors.accentGreen}
              />
            ) : (
              <BracketButton
                label="GET STARTED"
                onPress={() => router.push('/exercise/voice-range-assessment' as Href)}
                color={colors.accentGreen}
              />
            )}
          </View>
          {hasProfile && profile ? (
            <View style={styles.cardContent}>
              <LabelValue label="Range:" value={getProfileSummary() ?? '--'} />
              <LabelValue label="Octaves:" value={getRangeOctaves().toString()} />
            </View>
          ) : (
            <Text style={styles.cardDescription}>
              Train your voice to hit notes accurately. First, let's find your vocal range.
            </Text>
          )}
          <View style={styles.progressRow}>
            <AsciiProgressBar progress={voiceSchoolProgress} />
          </View>
        </Card>

        {/* Music School */}
        <Card style={styles.cardDisabled}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, styles.textMuted]}>Music School</Text>
            <Text style={styles.comingSoonLabel}>[ COMING SOON ]</Text>
          </View>
          <Text style={[styles.cardDescription, styles.textMuted]}>
            Learn music theory fundamentals, reading notation, and more.
          </Text>
          <View style={styles.progressRow}>
            <AsciiProgressBar progress={0} />
          </View>
        </Card>

        {/* Writing Lab */}
        <Card style={styles.cardDisabled}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, styles.textMuted]}>Writing Lab</Text>
            <Text style={styles.comingSoonLabel}>[ COMING SOON ]</Text>
          </View>
          <Text style={[styles.cardDescription, styles.textMuted]}>
            Tools to assist with writing songs, melodies, and compositions.
          </Text>
        </Card>

        {/* Navigation */}
        <View style={styles.navRow}>
          <BracketButton
            label="PROGRESS"
            onPress={() => router.push('/progress')}
          />
          <BracketButton
            label="SETTINGS"
            onPress={() => router.push('/settings')}
          />
        </View>
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.cardTitle,
  },
  cardDescription: {
    ...typography.label,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  cardContent: {},
  cardDisabled: {
    opacity: 0.6,
  },
  textMuted: {
    color: colors.textMuted,
  },
  comingSoonLabel: {
    fontFamily: fonts.mono,
    fontSize: 15,
    color: colors.textMuted,
  },
  progressRow: {
    marginTop: spacing.sm,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  levelLabel: {
    fontFamily: fonts.monoBold,
    fontSize: 16,
    color: colors.accentGreen,
    letterSpacing: 1,
  },
  levelTitle: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
  },
  xpInfo: {
    alignItems: 'flex-end',
  },
  xpTotal: {
    fontFamily: fonts.monoBold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  xpToNext: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textMuted,
  },
  levelProgressRow: {
    marginBottom: spacing.lg,
  },
});
