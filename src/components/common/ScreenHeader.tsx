import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';

interface ScreenHeaderProps {
  title: string;
  rightContent?: React.ReactNode;
  testID?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  rightContent,
  testID,
}) => {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.title} testID={testID ? `${testID}-title` : undefined}>
        {title}
      </Text>
      {rightContent && <View style={styles.rightContent}>{rightContent}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.screenTitle,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
