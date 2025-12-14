/**
 * ProgressScreen
 *
 * Overall stats and per-exercise breakdown.
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

export const ProgressScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="PROGRESS" />
      <Divider style={styles.headerDivider} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="OVERALL STATS" />
        <Card>
          <LabelValue label="Total Sessions:" value="0" />
          <LabelValue label="Total Questions:" value="0" />
          <LabelValue label="Average Accuracy:" value="--" />
          <LabelValue label="Best Streak:" value="0" />
        </Card>

        <SectionHeader title="INTERVALS" />
        <Card>
          <LabelValue label="Attempts:" value="0" />
          <LabelValue label="Accuracy:" value="--" />
          <LabelValue label="Current Streak:" value="0" />
          <LabelValue label="Unlocked:" value="4/12" />
        </Card>

        <SectionHeader title="SCALE DEGREES" />
        <Card>
          <LabelValue label="Attempts:" value="0" />
          <LabelValue label="Accuracy:" value="--" />
          <LabelValue label="Current Streak:" value="0" />
          <LabelValue label="Unlocked:" value="3/7" />
        </Card>

        <SectionHeader title="CHORD QUALITIES" />
        <Card>
          <LabelValue label="Attempts:" value="0" />
          <LabelValue label="Accuracy:" value="--" />
          <LabelValue label="Current Streak:" value="0" />
          <LabelValue label="Unlocked:" value="2/4" />
        </Card>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Progress tracking will be implemented in v0.3.0
          </Text>
        </View>

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
