/**
 * Ear School Home Screen
 *
 * Displays the 4-section curriculum with progress indicators.
 */

import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href, useFocusEffect } from 'expo-router';

import { colors, typography, spacing, fonts } from '@/src/theme';
import { ScreenHeader, Card, BracketButton, Divider } from '@/src/components/common';
import { useEarSchoolStore } from '@/src/stores/useEarSchoolStore';
import { EAR_SCHOOL_CURRICULUM } from '@/src/content/ear-school/curriculum';

export default function EarSchoolHomeScreen() {
  const router = useRouter();
  const { lessonProgress, overallProgress, loadProgress } = useEarSchoolStore();
  const [showProgressModal, setShowProgressModal] = useState(false);

  // Load progress when screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [])
  );

  const handleClose = () => {
    router.back();
  };

  const handleOpenPractice = () => {
    router.push('/ear-school/practice' as Href);
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
          <>
            <BracketButton
              label="TRAIN"
              onPress={handleOpenPractice}
              testID="ear-school-practice-button"
            />
            <BracketButton
              label="X"
              onPress={handleClose}
              testID="ear-school-close-button"
            />
          </>
        }
      />
      <Divider style={styles.divider} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Progress Bar */}
        {overallProgress && (
          <TouchableOpacity
            style={styles.progressBarContainer}
            onPress={() => setShowProgressModal(true)}
            activeOpacity={0.7}
            testID="ear-school-progress-bar"
          >
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${overallProgress.completionPercentage}%` },
                ]}
              />
            </View>
            <Text style={styles.progressBarLabel}>
              {overallProgress.completionPercentage}% complete
            </Text>
          </TouchableOpacity>
        )}

        {/* Section List */}
        {EAR_SCHOOL_CURRICULUM.sections.map((section) => (
            <TouchableOpacity
              key={section.id}
              style={styles.sectionCard}
              onPress={() => handleOpenSection(section.id)}
              activeOpacity={0.7}
              testID={`section-${section.number}-card`}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionInfo}>
                  <Text style={styles.sectionLabel}>SECTION {section.number}</Text>
                  <Text style={styles.sectionSubtitle}>{section.title}</Text>
                </View>
              </View>

              <Text style={styles.sectionDescription}>{section.description}</Text>

              {getSectionProgressDots(section.id, section.lessons.length)}

              <View style={styles.sectionLessonPreview}>
                <Text style={styles.lessonPreviewText}>
                  {section.lessons.length} lessons + assessment
                </Text>
              </View>
            </TouchableOpacity>
        ))}

        {/* Footer Note */}
        <Text style={styles.footerNote}>
          All sections are accessible. Tap any section to view lessons.
        </Text>
      </ScrollView>

      {/* Progress Details Modal */}
      <Modal
        visible={showProgressModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProgressModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowProgressModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>EAR SCHOOL PROGRESS</Text>

            {overallProgress && (
              <View style={styles.modalStats}>
                <View style={styles.modalStatRow}>
                  <Text style={styles.modalStatLabel}>Lessons Passed</Text>
                  <Text style={styles.modalStatValue}>
                    {overallProgress.lessonsPassed} / {overallProgress.totalLessons}
                  </Text>
                </View>
                <View style={styles.modalStatRow}>
                  <Text style={styles.modalStatLabel}>Sections Completed</Text>
                  <Text style={styles.modalStatValue}>
                    {overallProgress.sectionsCompleted} / {overallProgress.totalSections}
                  </Text>
                </View>
                <View style={styles.modalStatRow}>
                  <Text style={styles.modalStatLabel}>Overall Progress</Text>
                  <Text style={styles.modalStatValueHighlight}>
                    {overallProgress.completionPercentage}%
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowProgressModal(false)}
            >
              <Text style={styles.modalCloseText}>[ X ]</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  progressBarContainer: {
    marginBottom: spacing.xl,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: colors.progressTrack,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accentGreen,
    borderRadius: 4,
  },
  progressBarLabel: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 320,
  },
  modalTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 14,
    color: colors.textPrimary,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  modalStats: {
    marginBottom: spacing.xl,
  },
  modalStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  modalStatLabel: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
  },
  modalStatValue: {
    fontFamily: fonts.monoBold,
    fontSize: 14,
    color: colors.textPrimary,
  },
  modalStatValueHighlight: {
    fontFamily: fonts.monoBold,
    fontSize: 18,
    color: colors.accentGreen,
  },
  modalCloseButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  modalCloseText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
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
