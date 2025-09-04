/**
 * @fileoverview History Stack Navigator
 * @agentic_contract Stack navigation for progress tracking screens
 * Safe for AI to modify: add new screens, update navigation options
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

// Placeholder screen component
const HistoryScreen: React.FC = () => (
  <View style={styles.container} testID="history-screen">
    <Text style={styles.title}>History</Text>
    <Text style={styles.subtitle}>Coming soon...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
});

/**
 * @component HistoryStack
 * @description Stack navigator for progress tracking screens
 * @agentic_pattern Standard React Navigation stack
 */
export const HistoryStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 0.5,
          borderBottomColor: '#E5E5EA',
        },
        headerTintColor: '#007AFF',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 17,
        },
      }}
    >
      <Stack.Screen 
        name="HistoryList" 
        component={HistoryScreen}
        options={{ 
          title: 'History',
          headerLargeTitle: true,
        }}
      />
    </Stack.Navigator>
  );
};