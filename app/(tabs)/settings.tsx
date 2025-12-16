import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';

import { colors, typography, spacing } from '@/src/theme';
import {
  ScreenHeader,
  Card,
  SectionHeader,
  Divider,
  AppFooter,
  SettingToggle,
  SettingOption,
  SettingNumber,
  SettingSlider,
  BracketButton,
} from '@/src/components/common';
import {
  useSettingsStore,
  QUESTION_COUNT_OPTIONS,
  MIN_INPUT_SENSITIVITY,
  MAX_INPUT_SENSITIVITY,
  INPUT_SENSITIVITY_STEP,
  IntervalDirection,
  IntervalPlayback,
  ScaleDegreeLabelType,
} from '@/src/stores/useSettingsStore';
import { AudioEngine } from '@/src/audio';
import { SynthType } from '@/src/types/audio';

// Reference pitch options (common concert pitch variations)
const REFERENCE_PITCH_OPTIONS = [415, 432, 440, 442, 444, 466];

export default function SettingsScreen() {
  const router = useRouter();

  const {
    instrument,
    referencePitch,
    inputSensitivity,
    questionsPerSession,
    autoPlayNext,
    intervalDirection,
    intervalPlayback,
    scaleDegreeLabels,
    hapticFeedback,
    setInstrument,
    setReferencePitch,
    setInputSensitivity,
    setQuestionsPerSession,
    setAutoPlayNext,
    setIntervalDirection,
    setIntervalPlayback,
    setScaleDegreeLabels,
    setHapticFeedback,
    resetToDefaults,
  } = useSettingsStore();

  // Sync instrument setting with AudioEngine
  useEffect(() => {
    AudioEngine.setSynthType(instrument);
  }, [instrument]);

  // Sync reference pitch with AudioEngine
  useEffect(() => {
    AudioEngine.setA4Frequency(referencePitch);
  }, [referencePitch]);

  const instrumentOptions: { value: SynthType; label: string }[] = [
    { value: 'piano', label: 'Piano' },
    { value: 'sine', label: 'Sine Wave' },
  ];

  const directionOptions: { value: IntervalDirection; label: string }[] = [
    { value: 'ascending', label: 'Ascending' },
    { value: 'descending', label: 'Descending' },
    { value: 'mixed', label: 'Mixed' },
  ];

  const playbackOptions: { value: IntervalPlayback; label: string }[] = [
    { value: 'melodic', label: 'Melodic' },
    { value: 'harmonic', label: 'Harmonic' },
  ];

  const labelOptions: { value: ScaleDegreeLabelType; label: string }[] = [
    { value: 'numbers', label: 'Numbers (1, 2, 3...)' },
    { value: 'solfege', label: 'Solfege (Do, Re, Mi...)' },
  ];

  const handleReferencePitchChange = (pitch: number) => {
    const currentIndex = REFERENCE_PITCH_OPTIONS.indexOf(pitch);
    const nextIndex = (currentIndex + 1) % REFERENCE_PITCH_OPTIONS.length;
    setReferencePitch(REFERENCE_PITCH_OPTIONS[nextIndex]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title="SETTINGS"
        rightContent={
          <BracketButton label="X" onPress={() => router.back()} />
        }
      />
      <Divider style={styles.divider} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="AUDIO" />
        <Card>
          <SettingOption
            label="Instrument"
            value={instrument}
            options={instrumentOptions}
            onChange={setInstrument}
          />
          <View style={styles.settingSeparator} />
          <SettingNumber
            label="Reference Pitch (A4)"
            value={referencePitch}
            options={REFERENCE_PITCH_OPTIONS}
            onChange={handleReferencePitchChange}
            suffix=" Hz"
          />
        </Card>

        <SectionHeader title="VOICE TRAINING" />
        <Card>
          <SettingSlider
            label="Mic Sensitivity"
            value={inputSensitivity}
            min={MIN_INPUT_SENSITIVITY}
            max={MAX_INPUT_SENSITIVITY}
            step={INPUT_SENSITIVITY_STEP}
            onChange={setInputSensitivity}
            formatValue={(v) => `${v.toFixed(1)}x`}
          />
          <Text style={styles.settingHint}>
            Increase if your mic is too quiet, decrease if too loud
          </Text>
        </Card>

        <SectionHeader title="EXERCISE" />
        <Card>
          <SettingNumber
            label="Questions per Session"
            value={questionsPerSession}
            options={QUESTION_COUNT_OPTIONS}
            onChange={setQuestionsPerSession}
          />
          <View style={styles.settingSeparator} />
          <SettingToggle
            label="Auto-play Next"
            value={autoPlayNext}
            onToggle={setAutoPlayNext}
          />
        </Card>

        <SectionHeader title="INTERVAL TRAINER" />
        <Card>
          <SettingOption
            label="Direction"
            value={intervalDirection}
            options={directionOptions}
            onChange={setIntervalDirection}
          />
          <View style={styles.settingSeparator} />
          <SettingOption
            label="Playback"
            value={intervalPlayback}
            options={playbackOptions}
            onChange={setIntervalPlayback}
          />
        </Card>

        <SectionHeader title="SCALE DEGREE TRAINER" />
        <Card>
          <SettingOption
            label="Labels"
            value={scaleDegreeLabels}
            options={labelOptions}
            onChange={setScaleDegreeLabels}
          />
        </Card>

        <SectionHeader title="FEEDBACK" />
        <Card>
          <SettingToggle
            label="Haptic Feedback"
            value={hapticFeedback}
            onToggle={setHapticFeedback}
          />
        </Card>

        <SectionHeader title="ABOUT" />
        <Card>
          <Text style={styles.aboutTitle}>Scale Scholar</Text>
          <Text style={styles.aboutText}>
            An ear training app for musicians to develop interval recognition,
            scale degree identification, and chord quality discrimination.
          </Text>
          <View style={styles.aboutSpacer} />
          <Text style={styles.aboutText}>
            Built with React Native, Expo, and react-native-audio-api.
          </Text>
          <View style={styles.aboutSpacer} />
          <Text style={styles.creditsText}>
            Designed and engineered by nagodasoft
          </Text>
        </Card>

        <View style={styles.resetContainer}>
          <BracketButton
            label="RESET TO DEFAULTS"
            onPress={resetToDefaults}
            color={colors.accentPink}
          />
        </View>

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
  settingSeparator: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.xs,
  },
  settingHint: {
    ...typography.label,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  aboutTitle: {
    ...typography.cardTitle,
    marginBottom: spacing.sm,
  },
  aboutText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  aboutSpacer: {
    height: spacing.md,
  },
  creditsText: {
    ...typography.label,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  resetContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
});
