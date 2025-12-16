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
  AppFooter,
} from '@/src/components/common';
import { useVoiceProfileStore } from '@/src/stores/useVoiceProfileStore';

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

  useEffect(() => {
    if (!voiceInitialized) {
      initializeVoice();
    }
  }, []);

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
        </Card>

        {/* Writing School */}
        <Card style={styles.cardDisabled}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, styles.textMuted]}>Writing School</Text>
            <Text style={styles.comingSoonLabel}>[ COMING SOON ]</Text>
          </View>
          <Text style={[styles.cardDescription, styles.textMuted]}>
            Tools to assist with writing songs, melodies, and compositions.
          </Text>
        </Card>

        <AppFooter />
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
});
