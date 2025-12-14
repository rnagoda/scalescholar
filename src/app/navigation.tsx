/**
 * Navigation Setup
 *
 * Bottom tabs + Stack navigator for exercise screens.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';

import { colors, fonts } from '@theme';
import type { RootStackParamList, BottomTabParamList } from '@types';

// Placeholder screens - will be replaced with actual implementations
import { HomeScreen } from '@screens/HomeScreen';
import { ProgressScreen } from '@screens/ProgressScreen';
import { SettingsScreen } from '@screens/SettingsScreen';
import { IntervalTrainerScreen } from '@screens/IntervalTrainerScreen';
import { ScaleDegreeTrainerScreen } from '@screens/ScaleDegreeTrainerScreen';
import { ChordQualityTrainerScreen } from '@screens/ChordQualityTrainerScreen';
import { SessionCompleteScreen } from '@screens/SessionCompleteScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

/**
 * Tab icon component - simple text-based icons
 */
const TabIcon: React.FC<{ label: string; focused: boolean }> = ({
  label,
  focused,
}) => (
  <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
    {label}
  </Text>
);

/**
 * Bottom Tab Navigator
 */
const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="~" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="#" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="*" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Root Stack Navigator
 */
export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="IntervalTrainer" component={IntervalTrainerScreen} />
        <Stack.Screen
          name="ScaleDegreeTrainer"
          component={ScaleDegreeTrainerScreen}
        />
        <Stack.Screen
          name="ChordQualityTrainer"
          component={ChordQualityTrainerScreen}
        />
        <Stack.Screen
          name="SessionComplete"
          component={SessionCompleteScreen}
          options={{ animation: 'fade' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.cardBackground,
    borderTopColor: colors.cardBorder,
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
    height: 60,
  },
  tabLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  tabIcon: {
    fontFamily: fonts.monoBold,
    fontSize: 18,
    color: colors.textMuted,
  },
  tabIconFocused: {
    color: colors.accentGreen,
  },
});
