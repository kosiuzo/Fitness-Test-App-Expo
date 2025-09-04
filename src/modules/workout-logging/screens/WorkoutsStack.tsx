/**
 * @fileoverview Workouts Stack Navigator
 * @agentic_contract Stack navigation for workout-related screens
 * Safe for AI to modify: add new screens, update navigation options
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

// Placeholder screen component
const WorkoutsScreen: React.FC = () => (
  <View style={styles.container} testID="workouts-screen">
    <Text style={styles.title}>Workouts</Text>
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
 * @component WorkoutsStack
 * @description Stack navigator for workout-related screens
 * @agentic_pattern Standard React Navigation stack
 */
export const WorkoutsStack: React.FC = () => {
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
        name="WorkoutsList" 
        component={WorkoutsScreen}
        options={{ 
          title: 'Workouts',
          headerLargeTitle: true,
        }}
      />
    </Stack.Navigator>
  );
};