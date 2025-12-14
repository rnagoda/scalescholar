/**
 * SessionCompleteScreen
 *
 * Displays session summary after completing an exercise set.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, typography, spacing } from '@theme';
import { Card, LabelValue, BracketButton, Divider } from '@components';
import type { RootStackParamList } from '@types';

type SessionCompleteRouteProp = RouteProp<RootStackParamList, 'SessionComplete'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SessionCompleteScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SessionCompleteRouteProp>();

  // Default values for placeholder
  const summary = route.params?.summary ?? {
    totalQuestions: 10,
    correctAnswers: 7,
    accuracy: 70,
    duration: 120,
    streak: 3,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>SESSION COMPLETE</Text>
        <Divider />

        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{summary.accuracy}%</Text>
          <Text style={styles.scoreLabel}>Accuracy</Text>
        </View>

        <Card>
          <LabelValue
            label="Questions:"
            value={`${summary.correctAnswers}/${summary.totalQuestions}`}
          />
          <LabelValue
            label="Time:"
            value={`${Math.floor(summary.duration / 60)}:${String(summary.duration % 60).padStart(2, '0')}`}
          />
          <LabelValue label="Streak:" value={summary.streak.toString()} />
        </Card>

        <View style={styles.actions}>
          <BracketButton
            label="PLAY AGAIN"
            onPress={() => navigation.goBack()}
            color={colors.accentGreen}
          />
          <BracketButton
            label="HOME"
            onPress={() => navigation.navigate('Main')}
          />
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
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    ...typography.screenTitle,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  score: {
    ...typography.displayLarge,
  },
  scoreLabel: {
    ...typography.label,
    marginTop: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
    gap: spacing.lg,
  },
});
