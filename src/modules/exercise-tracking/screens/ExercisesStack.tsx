/**
 * @fileoverview Exercises Stack Navigator
 * @agentic_contract Stack navigation for exercise-related screens
 * Safe for AI to modify: add new screens, update navigation options
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

// Placeholder screen component
const ExercisesScreen: React.FC = () => (
  <View style={styles.container} testID="exercises-screen">
    <Text style={styles.title}>Exercises</Text>
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
 * @component ExercisesStack
 * @description Stack navigator for exercise-related screens
 * @agentic_pattern Standard React Navigation stack
 */
export const ExercisesStack: React.FC = () => {
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
        name="ExercisesList" 
        component={ExercisesScreen}
        options={{ 
          title: 'Exercises',
          headerLargeTitle: true,
        }}
      />
    </Stack.Navigator>
  );
};