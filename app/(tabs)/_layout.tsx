import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '@/src/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
