import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '@/src/theme';
import {
  ScreenHeader,
  Card,
  SectionHeader,
  LabelValue,
  Divider,
  AppFooter,
} from '@/src/components/common';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="SETTINGS" />
      <Divider style={styles.divider} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="AUDIO" />
        <Card>
          <LabelValue label="Instrument:" value="Piano" />
          <LabelValue label="Reference Pitch (A4):" value="440 Hz" />
        </Card>

        <SectionHeader title="EXERCISE" />
        <Card>
          <LabelValue label="Questions per Session:" value="10" />
          <LabelValue label="Auto-play Next:" value="Off" />
          <LabelValue label="Scale Degree Labels:" value="Numbers" />
        </Card>

        <SectionHeader title="FEEDBACK" />
        <Card>
          <LabelValue label="Haptic Feedback:" value="On" />
        </Card>

        <SectionHeader title="ABOUT" />
        <Card>
          <Text style={styles.aboutText}>
            Scale Scholar is an ear training app for musicians.
          </Text>
          <View style={styles.aboutSpacer} />
          <Text style={styles.aboutText}>
            Built with React Native and Expo.
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
  aboutText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  aboutSpacer: {
    height: spacing.sm,
  },
});
