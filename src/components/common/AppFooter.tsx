import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typography, spacing } from '../../theme';

const VERSION = '0.1.0';

export const AppFooter: React.FC = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>
        v{VERSION} - engineered by nagodasoft
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  text: {
    ...typography.footer,
  },
});
