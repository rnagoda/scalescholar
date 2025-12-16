import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href } from 'expo-router';

import { colors, typography, spacing, fonts } from '@/src/theme';
import {
  ScreenHeader,
  Card,
  BracketButton,
  Divider,
  LabelValue,
} from '@/src/components/common';
import { useVoiceProfileStore } from '@/src/stores/useVoiceProfileStore';
import { midiToNoteName } from '@/src/utils/music';

interface ExerciseCardProps {
  title: string;
  description: string;
  onPress: () => void;
  disabled?: boolean;
  comingSoon?: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  title,
  description,
  onPress,
  disabled = false,
  comingSoon = false,
}) => (
  <Card style={disabled ? styles.cardDisabled : undefined}>
    <View style={styles.cardHeader}>
      <Text style={[styles.cardTitle, disabled && styles.textDisabled]}>
        {title}
      </Text>
      {comingSoon && (
        <Text style={styles.comingSoonBadge}>SOON</Text>
      )}
    </View>
    <Text style={[styles.cardDescription, disabled && styles.textDisabled]}>
      {description}
    </Text>
    <View style={styles.cardAction}>
      <BracketButton
        label={comingSoon ? "COMING SOON" : "START"}
        onPress={onPress}
        color={disabled ? colors.textMuted : colors.accentGreen}
      />
    </View>
  </Card>
);

export default function VoiceMenuScreen() {
  const router = useRouter();

  const {
    hasProfile,
    profile,
    isInitialized,
    initialize,
    getProfileSummary,
    getRangeOctaves,
    getComfortableRangeOctaves,
  } = useVoiceProfileStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  const handleClose = () => {
    router.back();
  };

  const handleReassess = () => {
    router.push('/exercise/voice-range-assessment' as Href);
  };

  // If no profile, redirect to assessment
  if (isInitialized && !hasProfile) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader
          title="VOICE TRAINER"
          rightContent={
            <BracketButton label="CLOSE" onPress={handleClose} />
          }
        />
        <Divider style={styles.divider} />

        <View style={styles.noProfileContainer}>
          <Text style={styles.noProfileTitle}>No Voice Profile</Text>
          <Text style={styles.noProfileText}>
            Before training, we need to determine your vocal range.
            This quick assessment takes about 2 minutes.
          </Text>
          <View style={styles.noProfileAction}>
            <BracketButton
              label="ASSESS MY RANGE"
              onPress={handleReassess}
              color={colors.accentGreen}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="VOICE TRAINER"
        rightContent={
          <BracketButton label="CLOSE" onPress={handleClose} />
        }
      />
      <Divider style={styles.divider} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Voice Profile Summary */}
        {profile && (
          <Card style={styles.profileCard}>
            <Text style={styles.profileLabel}>YOUR VOCAL RANGE</Text>
            <Text style={styles.profileRange}>{getProfileSummary()}</Text>
            <View style={styles.profileDetails}>
              <LabelValue
                label="Octaves:"
                value={getRangeOctaves().toFixed(1)}
              />
              <LabelValue
                label="Comfortable:"
                value={`${midiToNoteName(profile.comfortableLow)} - ${midiToNoteName(profile.comfortableHigh)} (${getComfortableRangeOctaves().toFixed(1)} oct)`}
              />
            </View>
            <View style={styles.profileAction}>
              <BracketButton
                label="REASSESS"
                onPress={handleReassess}
                color={colors.textSecondary}
              />
            </View>
          </Card>
        )}

        {/* Exercise Selection */}
        <Text style={styles.sectionTitle}>EXERCISES</Text>

        <ExerciseCard
          title="Note Match"
          description="Hit and hold a target note. Great for developing pitch accuracy and ear-voice coordination."
          onPress={() => router.push('/exercise/voice-note-match' as Href)}
        />

        <ExerciseCard
          title="Scale Practice"
          description="Sing ascending and descending scales. Builds smooth transitions between notes."
          onPress={() => router.push('/exercise/voice-scale' as Href)}
        />

        <ExerciseCard
          title="Sustain"
          description="Hold a note steady for a duration. Develops breath control and pitch stability."
          onPress={() => router.push('/exercise/voice-sustain' as Href)}
        />

        <ExerciseCard
          title="Pitch Glide"
          description="Smoothly glide between two notes. Advanced exercise for pitch control."
          onPress={() => {}}
          disabled
          comingSoon
        />
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
  // Profile card
  profileCard: {
    marginBottom: spacing.lg,
  },
  profileLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  profileRange: {
    fontFamily: fonts.monoBold,
    fontSize: 28,
    color: colors.accentGreen,
    marginBottom: spacing.md,
  },
  profileDetails: {
    marginBottom: spacing.sm,
  },
  profileAction: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
  // Section
  sectionTitle: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  // Exercise cards
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
    marginBottom: spacing.md,
  },
  cardAction: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cardDisabled: {
    opacity: 0.6,
  },
  textDisabled: {
    color: colors.textMuted,
  },
  comingSoonBadge: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.accentPink,
    letterSpacing: 1,
  },
  // No profile state
  noProfileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  noProfileTitle: {
    ...typography.cardTitle,
    fontSize: 20,
    marginBottom: spacing.md,
  },
  noProfileText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  noProfileAction: {
    marginTop: spacing.md,
  },
});
