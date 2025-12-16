import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fonts } from '@/src/theme';
import { VRPAssessmentStep } from '@/src/types/voiceAnalyzer';

interface AssessmentProgressProps {
  currentStep: VRPAssessmentStep;
}

const STEPS: { key: VRPAssessmentStep; label: string }[] = [
  { key: 'intro', label: 'START' },
  { key: 'lowest', label: 'LOW' },
  { key: 'highest', label: 'HIGH' },
  { key: 'comfortable_low', label: 'COMFORT' },
  { key: 'comfortable_high', label: 'RANGE' },
  { key: 'results', label: 'DONE' },
];

/**
 * Step progress indicator for VRP assessment wizard
 */
export const AssessmentProgress: React.FC<AssessmentProgressProps> = ({
  currentStep,
}) => {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <View style={styles.container}>
      <View style={styles.stepsRow}>
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <View key={step.key} style={styles.stepContainer}>
              {/* Connector line (before step, except first) */}
              {index > 0 && (
                <View
                  style={[
                    styles.connector,
                    styles.connectorBefore,
                    isCompleted || isCurrent ? styles.connectorActive : null,
                  ]}
                />
              )}

              {/* Step indicator */}
              <View
                style={[
                  styles.stepCircle,
                  isCompleted && styles.stepCompleted,
                  isCurrent && styles.stepCurrent,
                ]}
              >
                {isCompleted ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      isCurrent && styles.stepNumberCurrent,
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>

              {/* Connector line (after step, except last) */}
              {index < STEPS.length - 1 && (
                <View
                  style={[
                    styles.connector,
                    styles.connectorAfter,
                    isCompleted ? styles.connectorActive : null,
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>

      {/* Current step label */}
      <Text style={styles.currentLabel}>
        {STEPS[currentIndex]?.label ?? ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  stepCompleted: {
    backgroundColor: colors.accentGreen,
    borderColor: colors.accentGreen,
  },
  stepCurrent: {
    borderColor: colors.accentGreen,
    borderWidth: 2,
  },
  stepNumber: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    color: colors.textMuted,
  },
  stepNumberCurrent: {
    color: colors.accentGreen,
  },
  checkmark: {
    fontFamily: fonts.monoBold,
    fontSize: 14,
    color: colors.background,
  },
  connector: {
    height: 2,
    width: 20,
    backgroundColor: colors.textMuted,
  },
  connectorBefore: {
    marginRight: -1,
  },
  connectorAfter: {
    marginLeft: -1,
  },
  connectorActive: {
    backgroundColor: colors.accentGreen,
  },
  currentLabel: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 1,
    marginTop: spacing.sm,
  },
});
