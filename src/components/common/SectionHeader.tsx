import React from 'react';
import { Text, StyleSheet, ViewStyle } from 'react-native';
import { typography, spacing } from '../../theme';

interface SectionHeaderProps {
  title: string;
  style?: ViewStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  style,
}) => {
  return <Text style={[styles.header, style]}>{title}</Text>;
};

const styles = StyleSheet.create({
  header: {
    ...typography.sectionHeader,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
});
