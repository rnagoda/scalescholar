/**
 * ScaleDegreeTrainerScreen
 *
 * Exercise screen for scale degree (functional ear training).
 * Full implementation in v0.4.0.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { colors, typography, spacing } from '@theme';
import { ScreenHeader, Divider, Card, BracketButton } from '@components';

export const ScaleDegreeTrainerScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="SCALE DEGREES"
        actions={[{ label: 'CLOSE', onPress: () => navigation.goBack() }]}
      />
      <Divider style={styles.headerDivider} />

      <View style={styles.content}>
        <Text style={styles.progress}>1 / 10</Text>

        <Card style={styles.playArea}>
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
          <BracketButton label="REPLAY" onPress={() => {}} />
        </Card>

        <View style={styles.answerGrid}>
          {['1', '3', '5'].map((degree) => (
            <Card key={degree} style={styles.answerCard}>
              <Text style={styles.answerText}>{degree}</Text>
            </Card>
          ))}
        </View>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Full implementation coming in v0.4.0
          </Text>
        </View>
      </View>
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
  content: {
    flex: 1,
    padding: spacing.lg,
    alignItems: 'center',
  },
  progress: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  playArea: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    width: '60%',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  playIcon: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  answerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  answerCard: {
    width: 70,
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: 0,
  },
  answerText: {
    ...typography.body,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...typography.label,
    textAlign: 'center',
  },
});
