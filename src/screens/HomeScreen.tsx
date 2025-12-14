/**
 * HomeScreen
 *
 * Main screen with exercise cards for each trainer type.
 */

import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors, spacing } from '@theme';
import type { RootStackParamList } from '@types';
import {
  ScreenHeader,
  Card,
  LabelValue,
  ProgressBar,
  AppFooter,
  Divider,
} from '@components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TrainerCardProps {
  title: string;
  accuracy: string;
  streak: number;
  progress: number;
  progressLabel: string;
  onPress: () => void;
}

const TrainerCard: React.FC<TrainerCardProps> = ({
  title,
  accuracy,
  streak,
  progress,
  progressLabel,
  onPress,
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <Card>
      <LabelValue label={title} value="" valueColor={colors.textPrimary} />
      <View style={styles.cardContent}>
        <LabelValue label="Accuracy:" value={accuracy} />
        <LabelValue label="Current Streak:" value={streak.toString()} />
      </View>
      <ProgressBar progress={progress} label={progressLabel} />
    </Card>
  </TouchableOpacity>
);

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="SCALE SCHOLAR" />
      <Divider style={styles.headerDivider} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TrainerCard
          title="Interval Trainer"
          accuracy="--"
          streak={0}
          progress={4 / 12}
          progressLabel="4/12 unlocked"
          onPress={() => navigation.navigate('IntervalTrainer')}
        />

        <TrainerCard
          title="Scale Degree Trainer"
          accuracy="--"
          streak={0}
          progress={3 / 7}
          progressLabel="3/7 unlocked"
          onPress={() => navigation.navigate('ScaleDegreeTrainer')}
        />

        <TrainerCard
          title="Chord Quality Trainer"
          accuracy="--"
          streak={0}
          progress={2 / 4}
          progressLabel="2/4 unlocked"
          onPress={() => navigation.navigate('ChordQualityTrainer')}
        />

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
    paddingTop: spacing.md,
  },
  cardContent: {
    marginVertical: spacing.sm,
  },
});
