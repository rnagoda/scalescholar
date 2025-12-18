/**
 * Section Detail Screen
 *
 * Displays lessons within a specific section with progress indicators.
 */

import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Href, useFocusEffect } from 'expo-router';

import { colors, spacing, fonts } from '@/src/theme';
import { ScreenHeader, Card, BracketButton, Divider } from '@/src/components/common';
import { useEarSchoolStore } from '@/src/stores/useEarSchoolStore';
import { getSectionById, getSectionLessons } from '@/src/content/ear-school/curriculum';
import { EarSchoolLessonDef } from '@/src/types/ear-school';

export default function SectionDetailScreen() {
  const router = useRouter();
  const { sectionId } = useLocalSearchParams<{ sectionId: string }>();
  const { lessonProgress, loadProgress, shouldShowChallengeMode } = useEarSchoolStore();

  const section = getSectionById(sectionId || '');
  const lessons = getSectionLessons(sectionId || '');

  // Reload progress when screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [])
  );

  const handleClose = () => {
    router.back();
  };

  const handleOpenLesson = (lessonId: string) => {
    router.push(`/ear-school/lesson/${lessonId}` as Href);
  };

  const getLessonStatus = (lesson: EarSchoolLessonDef) => {
    const progress = lessonProgress.get(lesson.id);
    if (!progress) return { status: 'not-started', icon: '○', color: colors.textMuted };
    if (progress.aced) return { status: 'aced', icon: '★', color: colors.accentGreen };
    if (progress.mastered) return { status: 'mastered', icon: '✓', color: colors.accentGreen };
    if (progress.passed) return { status: 'passed', icon: '✓', color: colors.textSecondary };
    return { status: 'attempted', icon: '•', color: colors.accentPink };
  };

  if (!section) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader
          title="SECTION NOT FOUND"
          rightContent={<BracketButton label="X" onPress={handleClose} />}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Section not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Separate lessons and assessment
  const regularLessons = lessons.filter((l) => !l.isAssessment);
  const assessment = lessons.find((l) => l.isAssessment);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title={`SECTION ${section.number}`}
        testID={`section-${section.number}-header-title`}
        rightContent={
          <BracketButton
            label="X"
            onPress={handleClose}
            testID={`section-${section.number}-close-button`}
          />
        }
      />
      <Divider style={styles.divider} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionDescription}>{section.description}</Text>
        </View>

        {/* Lessons */}
        <Text style={styles.subsectionTitle}>LESSONS</Text>

        {regularLessons.map((lesson, index) => {
          const { status, icon, color } = getLessonStatus(lesson);
          const hasChallengeMode = shouldShowChallengeMode(lesson.id);
          const progress = lessonProgress.get(lesson.id);

          return (
            <TouchableOpacity
              key={lesson.id}
              style={styles.lessonCard}
              onPress={() => handleOpenLesson(lesson.id)}
              activeOpacity={0.7}
              testID={`lesson-${lesson.sectionNumber}-${lesson.lessonNumber}-card`}
            >
              <View style={styles.lessonHeader}>
                <View style={styles.lessonNumber}>
                  <Text style={styles.lessonNumberText}>
                    {lesson.sectionNumber}.{lesson.lessonNumber}
                  </Text>
                </View>
                <View style={styles.lessonInfo}>
                  <View style={styles.lessonTitleRow}>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    {hasChallengeMode && (
                      <View style={styles.challengeBadge}>
                        <Text style={styles.challengeBadgeText}>⚡</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.lessonSubtitle}>{lesson.subtitle}</Text>
                </View>
                <View style={styles.lessonStatus}>
                  <Text style={[styles.statusIcon, { color }]}>{icon}</Text>
                  {progress && progress.bestScore > 0 && (
                    <Text style={styles.scoreText}>{progress.bestScore}%</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Assessment */}
        {assessment && (
          <>
            <Text style={styles.subsectionTitle}>ASSESSMENT</Text>

            <TouchableOpacity
              style={[styles.lessonCard, styles.assessmentCard]}
              onPress={() => handleOpenLesson(assessment.id)}
              activeOpacity={0.7}
              testID={`assessment-${section.number}-card`}
            >
              <View style={styles.lessonHeader}>
                <View style={[styles.lessonNumber, styles.assessmentNumber]}>
                  <Text style={styles.lessonNumberText}>★</Text>
                </View>
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonTitle}>{assessment.title}</Text>
                  <Text style={styles.lessonSubtitle}>
                    {assessment.questionCount} questions • {assessment.passThreshold}% to pass
                  </Text>
                </View>
                <View style={styles.lessonStatus}>
                  {(() => {
                    const { icon, color } = getLessonStatus(assessment);
                    const progress = lessonProgress.get(assessment.id);
                    return (
                      <>
                        <Text style={[styles.statusIcon, { color }]}>{icon}</Text>
                        {progress && progress.bestScore > 0 && (
                          <Text style={styles.scoreText}>{progress.bestScore}%</Text>
                        )}
                      </>
                    );
                  })()}
                </View>
              </View>
            </TouchableOpacity>
          </>
        )}

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <Text style={[styles.legendIcon, { color: colors.textMuted }]}>○</Text>
            <Text style={styles.legendText}>Not started</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={[styles.legendIcon, { color: colors.textSecondary }]}>✓</Text>
            <Text style={styles.legendText}>Passed (70%+)</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={[styles.legendIcon, { color: colors.accentGreen }]}>★</Text>
            <Text style={styles.legendText}>Aced (90%+)</Text>
          </View>
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
    paddingBottom: spacing.xxxl,
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
  sectionHeader: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  subsectionTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  lessonCard: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  assessmentCard: {
    borderColor: colors.accentBlue,
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
  assessmentNumber: {
    borderColor: colors.accentBlue,
  },
  lessonNumberText: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    color: colors.textSecondary,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  lessonSubtitle: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  challengeBadge: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    backgroundColor: colors.accentBlue + '30',
    borderRadius: 4,
  },
  challengeBadgeText: {
    fontSize: 12,
  },
  lessonStatus: {
    marginLeft: spacing.md,
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 20,
  },
  scoreText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: spacing.xl,
    gap: spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  legendText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textMuted,
  },
});
