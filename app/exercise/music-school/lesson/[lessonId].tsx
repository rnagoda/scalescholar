/**
 * Lesson Player Screen
 *
 * Plays through a lesson's blocks.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { colors, fonts, spacing } from '@/src/theme';
import { BracketButton } from '@/src/components/common';
import { LessonPlayer } from '@/src/components/lessons';
import { Lesson } from '@/src/types/lesson';
import { getLessonById } from '@/src/content/lessons';
import { useLessonStore } from '@/src/stores/useLessonStore';

export default function LessonPlayerScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const resetLesson = useLessonStore((state) => state.resetLesson);

  useEffect(() => {
    if (lessonId) {
      const foundLesson = getLessonById(lessonId);
      setLesson(foundLesson ?? null);
    }

    // Clean up on unmount
    return () => {
      resetLesson();
    };
  }, [lessonId]);

  const handleComplete = () => {
    // Navigate back to track browser
    router.back();
  };

  const handleExit = () => {
    // Navigate back without completing
    router.back();
  };

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Lesson not found.</Text>
          <View style={styles.errorAction}>
            <BracketButton
              label="GO BACK"
              onPress={() => router.back()}
              color={colors.accentGreen}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LessonPlayer
        lesson={lesson}
        onComplete={handleComplete}
        onExit={handleExit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  errorAction: {
    marginTop: spacing.lg,
  },
});
