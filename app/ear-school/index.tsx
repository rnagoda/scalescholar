/**
 * Ear School Home Screen
 *
 * Displays the 4-section curriculum with progress indicators.
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
    sectionProgress,
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

  const handleOpenSection = (sectionId: string) => {
    router.push(`/ear-school/section/${sectionId}` as Href);
  };

  const getSectionProgressDots = (sectionId: string, lessonCount: number) => {
    const sectionNum = parseInt(sectionId.split('-').pop() || '0', 10);
    let passedCount = 0;

    // Count passed lessons for this section
    for (const [lessonId, progress] of lessonProgress) {
      if (lessonId.startsWith(`ear-school-${sectionNum}.`) && progress.passed) {
        passedCount++;
      }
    }

    // Check assessment
    const assessmentProgress = lessonProgress.get(`ear-school-${sectionNum}-assessment`);
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
                  {overallProgress.sectionsCompleted}/{overallProgress.totalSections}
                </Text>
                <Text style={styles.progressLabel}>Sections</Text>
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

        {/* Section List */}
        {EAR_SCHOOL_CURRICULUM.sections.map((section) => {
          const sectionProg = sectionProgress.get(section.id);
          const isCompleted = sectionProg?.completedAt !== null;

          return (
            <TouchableOpacity
              key={section.id}
              style={styles.sectionCard}
              onPress={() => handleOpenSection(section.id)}
              activeOpacity={0.7}
              testID={`section-${section.number}-card`}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionNumber}>
                  <Text style={styles.sectionNumberText}>{section.number}</Text>
                </View>
                <View style={styles.sectionInfo}>
                  <Text style={styles.sectionLabel}>SECTION {section.number}</Text>
                  <Text style={styles.sectionSubtitle}>{section.title}</Text>
                </View>
                {isCompleted && (
                  <Text style={styles.completedIcon}>✓</Text>
                )}
              </View>

              <Text style={styles.sectionDescription}>{section.description}</Text>

              {getSectionProgressDots(section.id, section.lessons.length)}

              <View style={styles.sectionLessonPreview}>
                <Text style={styles.lessonPreviewText}>
                  {section.lessons.length} lessons + assessment
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Footer Note */}
        <Text style={styles.footerNote}>
          All sections are accessible. Tap any section to view lessons.
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
  sectionCard: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionNumber: {
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
  sectionNumberText: {
    fontFamily: fonts.monoBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionLabel: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 1.5,
  },
  sectionSubtitle: {
    fontFamily: fonts.monoBold,
    fontSize: 15,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  completedIcon: {
    fontSize: 24,
    color: colors.accentGreen,
  },
  sectionDescription: {
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
  sectionLessonPreview: {
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
