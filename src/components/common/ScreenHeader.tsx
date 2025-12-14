/**
 * ScreenHeader - Title with optional bracketed actions
 *
 * Layout: SCREEN TITLE                    [ + ]  [ CLOSE ]
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typography, spacing } from '@theme';
import { BracketButton } from './BracketButton';

interface HeaderAction {
  label: string;
  onPress: () => void;
  color?: string;
}

interface ScreenHeaderProps {
  title: string;
  actions?: HeaderAction[];
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  actions = [],
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {actions.length > 0 && (
        <View style={styles.actions}>
          {actions.map((action, index) => (
            <BracketButton
              key={`${action.label}-${index}`}
              label={action.label}
              onPress={action.onPress}
              color={action.color}
            />
          ))}
        </View>
      )}
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
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
