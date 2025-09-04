/**
 * @fileoverview iOS-style Tab Navigator
 * @agentic_contract Main navigation component for the fitness app
 * Safe for AI to modify: add new tabs, update styling, improve accessibility
 * Requires review: structural changes to navigation hierarchy
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

// Import stack screens (will be created later)
import { WorkoutsStack } from '@/modules/workout-logging/screens/WorkoutsStack';
import { ExercisesStack } from '@/modules/exercise-tracking/screens/ExercisesStack';
import { HistoryStack } from '@/modules/progress-tracking/screens/HistoryStack';

const Tab = createBottomTabNavigator();

/**
 * @component TabNavigator
 * @description Main tab navigator with iOS-style design
 * @agentic_pattern Standard React Navigation tab navigator
 * AI can extend this following React Navigation patterns
 */
export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      testID="tab-navigator"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Workouts') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Exercises') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF', // iOS system blue
        tabBarInactiveTintColor: '#8E8E93', // iOS system gray
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 83 : 60, // iOS standard height
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          paddingTop: 5,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0.5,
          borderTopColor: '#E5E5EA',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Workouts" 
        component={WorkoutsStack}
        options={{
          tabBarTestID: 'tab-workouts',
          tabBarAccessibilityLabel: 'Workouts tab',
          tabBarLabel: 'Workouts',
        }}
      />
      <Tab.Screen 
        name="Exercises" 
        component={ExercisesStack}
        options={{
          tabBarTestID: 'tab-exercises', 
          tabBarAccessibilityLabel: 'Exercises tab',
          tabBarLabel: 'Exercises',
        }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryStack}
        options={{
          tabBarTestID: 'tab-history',
          tabBarAccessibilityLabel: 'History tab', 
          tabBarLabel: 'History',
        }}
      />
    </Tab.Navigator>
  );
};