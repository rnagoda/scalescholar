import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, typography, spacing } from '@/src/theme';
import {
  ScreenHeader,
  Card,
  LabelValue,
  SectionHeader,
  Divider,
  AppFooter,
} from '@/src/components/common';

export default function ProgressScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="PROGRESS" />
      <Divider style={styles.divider} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>

        <SectionHeader title="INTERVALS" />
        <Card>
          <LabelValue label="Sessions:" value="0" />
          <LabelValue label="Accuracy:" value="--" />
          <LabelValue label="Unlocked:" value="4/12" />
        </Card>

        <SectionHeader title="SCALE DEGREES" />
        <Card>
          <LabelValue label="Sessions:" value="0" />
          <LabelValue label="Accuracy:" value="--" />
          <LabelValue label="Unlocked:" value="3/7" />
        </Card>

        <SectionHeader title="CHORDS" />
        <Card>
          <LabelValue label="Sessions:" value="0" />
          <LabelValue label="Accuracy:" value="--" />
          <LabelValue label="Unlocked:" value="2/4" />
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    padding: spacing.lg,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  statValue: {
    ...typography.displayLarge,
    fontSize: 36,
  },
  statLabel: {
    ...typography.label,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
