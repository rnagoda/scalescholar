/**
 * Ear School Home Screen
 *
 * Displays the 4-week curriculum with progress indicators.
 */

import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href, useFocusEffect } from 'expo-router';

import { colors, typography, spacing, fonts } from '@/src/theme';
import { ScreenHeader, Card, BracketButton, Divider } from '@/src/components/common';
import { useEarSchoolStore } from '@/src/stores/useEarSchoolStore';
import { EAR_SCHOOL_CURRICULUM } from '@/src/content/ear-school/curriculum';

export default function EarSchoolHomeScreen() {
  const router = useRouter();
  const {
    lessonProgress,
    weekProgress,
    overallProgress,
    loadProgress,
    isLoading,
  } = useEarSchoolStore();

  // Load progress when screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [])
  );

  const handleClose = () => {
    router.back();
  };

  const handleOpenWeek = (weekId: string) => {
    router.push(`/ear-school/week/${weekId}` as Href);
  };

  const getWeekProgressDots = (weekId: string, lessonCount: number) => {
    const weekNum = parseInt(weekId.split('-').pop() || '0', 10);
    let passedCount = 0;

    // Count passed lessons for this week
    for (const [lessonId, progress] of lessonProgress) {
      if (lessonId.startsWith(`ear-school-${weekNum}.`) && progress.passed) {
        passedCount++;
      }
    }

    // Check assessment
    const assessmentProgress = lessonProgress.get(`ear-school-${weekNum}-assessment`);
    const assessmentPassed = assessmentProgress?.passed ?? false;

    return (
      <View style={styles.progressDots}>
        {Array.from({ length: lessonCount }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i < passedCount && styles.progressDotFilled,
            ]}
          />
        ))}
        <View
          style={[
            styles.progressDot,
            styles.progressDotAssessment,
            assessmentPassed && styles.progressDotFilled,
          ]}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="EAR SCHOOL"
        testID="ear-school-header-title"
        rightContent={
          <BracketButton
            label="X"
            onPress={handleClose}
            testID="ear-school-close-button"
          />
        }
      />
      <Divider style={styles.divider} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Progress */}
        {overallProgress && (
          <Card style={styles.progressCard}>
            <Text style={styles.progressTitle}>YOUR PROGRESS</Text>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressNumber}>
                  {overallProgress.lessonsPassed}/{overallProgress.totalLessons}
                </Text>
                <Text style={styles.progressLabel}>Lessons</Text>
              </View>
              <View style={styles.progressDivider} />
              <View style={styles.progressStat}>
                <Text style={styles.progressNumber}>
                  {overallProgress.weeksCompleted}/{overallProgress.totalWeeks}
                </Text>
                <Text style={styles.progressLabel}>Weeks</Text>
              </View>
              <View style={styles.progressDivider} />
              <View style={styles.progressStat}>
                <Text style={styles.progressNumber}>
                  {overallProgress.completionPercentage}%
                </Text>
                <Text style={styles.progressLabel}>Complete</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Week List */}
        {EAR_SCHOOL_CURRICULUM.weeks.map((week) => {
          const weekProg = weekProgress.get(week.id);
          const isCompleted = weekProg?.completedAt !== null;

          return (
            <TouchableOpacity
              key={week.id}
              style={styles.weekCard}
              onPress={() => handleOpenWeek(week.id)}
              activeOpacity={0.7}
              testID={`week-${week.number}-card`}
            >
              <View style={styles.weekHeader}>
                <View style={styles.weekNumber}>
                  <Text style={styles.weekNumberText}>{week.number}</Text>
                </View>
                <View style={styles.weekInfo}>
                  <Text style={styles.weekTitle}>WEEK {week.number}</Text>
                  <Text style={styles.weekSubtitle}>{week.title}</Text>
                </View>
                {isCompleted && (
                  <Text style={styles.completedIcon}>✓</Text>
                )}
              </View>

              <Text style={styles.weekDescription}>{week.description}</Text>

              {getWeekProgressDots(week.id, week.lessons.length)}

              <View style={styles.weekLessonPreview}>
                <Text style={styles.lessonPreviewText}>
                  {week.lessons.length} lessons + assessment
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Footer Note */}
        <Text style={styles.footerNote}>
          All weeks are accessible. Tap any week to view lessons.
        </Text>
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
  progressCard: {
    marginBottom: spacing.xl,
  },
  progressTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStat: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  progressNumber: {
    fontFamily: fonts.monoBold,
    fontSize: 24,
    color: colors.accentGreen,
  },
  progressLabel: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  progressDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.cardBorder,
  },
  weekCard: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  weekNumber: {
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
  weekNumberText: {
    fontFamily: fonts.monoBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  weekInfo: {
    flex: 1,
  },
  weekTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 1.5,
  },
  weekSubtitle: {
    fontFamily: fonts.monoBold,
    fontSize: 15,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  completedIcon: {
    fontSize: 24,
    color: colors.accentGreen,
  },
  weekDescription: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.cardBorder,
    marginRight: spacing.xs,
  },
  progressDotFilled: {
    backgroundColor: colors.accentGreen,
  },
  progressDotAssessment: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: spacing.xs,
  },
  weekLessonPreview: {
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: spacing.md,
  },
  lessonPreviewText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textMuted,
  },
  footerNote: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
