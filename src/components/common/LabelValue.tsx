import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, fonts, spacing } from '../../theme';

interface LabelValueProps {
  label: string;
  value: string | number;
  style?: ViewStyle;
  valueColor?: string;
}

export const LabelValue: React.FC<LabelValueProps> = ({
  label,
  value,
  style,
  valueColor = colors.textPrimary,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
  },
  value: {
    fontFamily: fonts.mono,
    fontSize: 14,
  },
});
