/**
 * Track Lesson Browser Screen
 *
 * Displays lessons within a specific track organized by level.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Href, useFocusEffect } from 'expo-router';

import { colors, typography, spacing, fonts } from '@/src/theme';
import {
  ScreenHeader,
  Card,
  BracketButton,
  Divider,
} from '@/src/components/common';
import { Lesson, LessonProgress, TrackId, getTrackById } from '@/src/types/lesson';
import { getLessonsByTrack } from '@/src/content/lessons';
import { getTrackProgress } from '@/src/services/lessonService';

export default function TrackLessonBrowserScreen() {
  const router = useRouter();
  const { trackId } = useLocalSearchParams<{ trackId: string }>();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({});

  const track = getTrackById(trackId as TrackId);

  // Reload lessons and progress every time screen gains focus
  useFocusEffect(
    useCallback(() => {
      if (trackId) {
        loadLessons();
      }
    }, [trackId])
  );

  const loadLessons = async () => {
    const trackLessons = getLessonsByTrack(trackId as TrackId);
    setLessons(trackLessons);

    const trackProgress = await getTrackProgress(trackId as TrackId);
    const progressMap: Record<string, LessonProgress> = {};
    for (const p of trackProgress) {
      progressMap[p.lessonId] = p;
    }
    setProgress(progressMap);
  };

  const handleClose = () => {
    router.back();
  };

  const handleOpenLesson = (lessonId: string) => {
    router.push(`/exercise/music-school/lesson/${lessonId}` as Href);
  };

  // Group lessons by level
  const lessonsByLevel: Record<number, Lesson[]> = {};
  for (const lesson of lessons) {
    if (!lessonsByLevel[lesson.levelIndex]) {
      lessonsByLevel[lesson.levelIndex] = [];
    }
    lessonsByLevel[lesson.levelIndex].push(lesson);
  }

  const levels = Object.keys(lessonsByLevel)
    .map(Number)
    .sort((a, b) => a - b);

  if (!track) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader
          title="TRACK NOT FOUND"
          rightContent={
            <BracketButton label="X" onPress={handleClose} />
          }
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Track not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title={track.title.toUpperCase()}
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
        <Text style={styles.intro}>{track.description}</Text>

        {levels.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>
              No lessons available yet for this track.
            </Text>
          </Card>
        ) : (
          levels.map((level) => (
            <View key={level} style={styles.levelSection}>
              <Text style={styles.levelTitle}>LEVEL {level}</Text>

              {lessonsByLevel[level].map((lesson, index) => {
                const lessonProgress = progress[lesson.id];
                const isCompleted = lessonProgress?.completed ?? false;

                return (
                  <TouchableOpacity
                    key={lesson.id}
                    style={styles.lessonCard}
                    onPress={() => handleOpenLesson(lesson.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.lessonHeader}>
                      <View style={styles.lessonNumber}>
                        <Text style={styles.lessonNumberText}>
                          {level}.{index + 1}
                        </Text>
                      </View>
                      <View style={styles.lessonInfo}>
                        <Text style={styles.lessonTitle}>{lesson.title}</Text>
                        <Text style={styles.lessonDescription}>
                          {lesson.description}
                        </Text>
                      </View>
                      <View style={styles.lessonStatus}>
                        {isCompleted ? (
                          <Text style={styles.completedIcon}>✓</Text>
                        ) : (
                          <Text style={styles.xpLabel}>+{lesson.xpReward} XP</Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.textMuted,
  },
  emptyText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    padding: spacing.lg,
  },
  levelSection: {
    marginBottom: spacing.xl,
  },
  levelTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  lessonCard: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  lessonNumberText: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    color: colors.textSecondary,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  lessonDescription: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  lessonStatus: {
    marginLeft: spacing.md,
    alignItems: 'center',
  },
  completedIcon: {
    fontSize: 24,
    color: colors.accentGreen,
  },
  xpLabel: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.accentGreen,
  },
});
