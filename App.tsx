/**
 * Scale Scholar
 *
 * Mobile ear training app for musicians.
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/app';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
