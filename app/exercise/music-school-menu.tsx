/**
 * Music School Menu Screen
 *
 * Track selection for Music School lessons.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href } from 'expo-router';

import { colors, typography, spacing, fonts } from '@/src/theme';
import {
  ScreenHeader,
  Card,
  BracketButton,
  Divider,
  ProgressBar,
} from '@/src/components/common';
import { TRACKS, TrackId } from '@/src/types/lesson';
import { getTrackLessonCount } from '@/src/content/lessons';
import { getCompletedLessonCount } from '@/src/services/lessonService';

interface TrackProgress {
  total: number;
  completed: number;
}

export default function MusicSchoolMenuScreen() {
  const router = useRouter();
  const [trackProgress, setTrackProgress] = useState<Record<TrackId, TrackProgress>>({
    foundations: { total: 0, completed: 0 },
    intervals: { total: 0, completed: 0 },
    'scales-keys': { total: 0, completed: 0 },
    chords: { total: 0, completed: 0 },
  });

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const progress: Record<TrackId, TrackProgress> = {
      foundations: { total: 0, completed: 0 },
      intervals: { total: 0, completed: 0 },
      'scales-keys': { total: 0, completed: 0 },
      chords: { total: 0, completed: 0 },
    };

    for (const track of TRACKS) {
      const total = getTrackLessonCount(track.id);
      const completed = await getCompletedLessonCount(track.id);
      progress[track.id] = { total, completed };
    }

    setTrackProgress(progress);
  };

  const handleClose = () => {
    router.back();
  };

  const handleOpenTrack = (trackId: TrackId) => {
    router.push(`/exercise/music-school/${trackId}` as Href);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="MUSIC SCHOOL"
        rightContent={
          <BracketButton label="X" onPress={handleClose} />
        }
      />
      <Divider style={styles.divider} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Learn music theory fundamentals through interactive lessons.
        </Text>

        {TRACKS.map((track) => {
          const progress = trackProgress[track.id];
          const progressValue = progress.total > 0
            ? progress.completed / progress.total
            : 0;
          const hasLessons = progress.total > 0;

          return (
            <Card
              key={track.id}
              style={!hasLessons ? styles.cardDisabled : undefined}
            >
              <View style={styles.cardHeader}>
                <Text style={[
                  styles.cardTitle,
                  !hasLessons && styles.textMuted
                ]}>
                  {track.title}
                </Text>
                {hasLessons ? (
                  <BracketButton
                    label="OPEN"
                    onPress={() => handleOpenTrack(track.id)}
                    color={colors.accentGreen}
                  />
                ) : (
                  <Text style={styles.comingSoonLabel}>[ COMING SOON ]</Text>
                )}
              </View>
              <Text style={[
                styles.cardDescription,
                !hasLessons && styles.textMuted
              ]}>
                {track.description}
              </Text>
              {hasLessons && (
                <View style={styles.progressContainer}>
                  <ProgressBar progress={progressValue} />
                  <Text style={styles.progressLabel}>
                    {progress.completed}/{progress.total} completed
                  </Text>
                </View>
              )}
            </Card>
          );
        })}
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
  intro: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.cardTitle,
    fontSize: 16,
  },
  cardDescription: {
    ...typography.label,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  textMuted: {
    color: colors.textMuted,
  },
  comingSoonLabel: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textMuted,
  },
  progressContainer: {
    marginTop: spacing.md,
  },
  progressLabel: {
    ...typography.label,
    fontSize: 12,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
});
