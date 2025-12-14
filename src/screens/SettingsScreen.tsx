/**
 * SettingsScreen
 *
 * User preferences and app settings.
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '@theme';
import {
  ScreenHeader,
  Divider,
  Card,
  LabelValue,
  SectionHeader,
  AppFooter,
} from '@components';

export const SettingsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="SETTINGS" />
      <Divider style={styles.headerDivider} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="SOUND" />
        <Card>
          <LabelValue label="Instrument:" value="Piano" />
          <LabelValue label="Reference Pitch (A4):" value="440 Hz" />
        </Card>

        <SectionHeader title="EXERCISE" />
        <Card>
          <LabelValue label="Scale Degree Labels:" value="Numbers" />
          <LabelValue label="Reference Key:" value="C Major" />
          <LabelValue label="Questions per Session:" value="10" />
          <LabelValue label="Auto-play Next:" value="Off" />
        </Card>

        <SectionHeader title="FEEDBACK" />
        <Card>
          <LabelValue label="Haptic Feedback:" value="On" />
        </Card>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Settings will be fully implemented in v0.6.0
          </Text>
        </View>

        <SectionHeader title="ABOUT" />
        <Card>
          <LabelValue label="Version:" value="0.1.0" />
          <LabelValue label="Developer:" value="nagodasoft" />
        </Card>

        <AppFooter />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerDivider: {
    marginVertical: 0,
    marginHorizontal: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  placeholder: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  placeholderText: {
    ...typography.label,
    textAlign: 'center',
  },
});
