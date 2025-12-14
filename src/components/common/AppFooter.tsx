/**
 * AppFooter - Version and branding footer
 *
 * Example output: v1.0.0  -  engineered by nagodasoft
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typography, spacing } from '@theme';

// Version from package.json would normally be imported
// For now, we'll hardcode it
const APP_VERSION = '0.1.0';

interface AppFooterProps {
  version?: string;
}

export const AppFooter: React.FC<AppFooterProps> = ({
  version = APP_VERSION,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>v{version} - engineered by nagodasoft</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  text: {
    ...typography.footer,
  },
});
