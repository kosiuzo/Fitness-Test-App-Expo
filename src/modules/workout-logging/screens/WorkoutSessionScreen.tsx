/**
 * @fileoverview Active Workout Session Screen
 * @agentic_contract Main workout session interface with gesture controls
 * Safe for AI to modify: add features, improve UX, enhance performance tracking
 * Requires review: major workflow changes, navigation modifications
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useWorkoutSession } from '@/shared/hooks/useWorkoutSession';
import { GestureSetLogger } from '@/shared/components/GestureSetLogger';
import { QuickExerciseAdd } from '@/shared/components/QuickExerciseAdd';
import { Colors, Typography, Spacing, BorderRadius } from '@/shared/design';

/**
 * @component WorkoutSessionScreen
 * @description Main workout session interface
 * @agentic_pattern Complete workout session management
 */
export const WorkoutSessionScreen: React.FC = () => {
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const {
    session,
    isActive,
    duration,
    isResting,
    currentRest,
    startWorkout,
    addExercise,
    completeSet,
    startRest,
    skipRest,
    completeWorkout,
    cancelWorkout,
    getStats,
  } = useWorkoutSession();

  /**
   * Handle adding exercise to workout
   * @agentic_pattern Standard exercise addition flow
   */
  const handleAddExercise = async (exerciseId: number, options: any) => {
    await addExercise(exerciseId, options);
    setShowAddExercise(false);
  };

  /**
   * Handle set completion with gesture data
   * @agentic_pattern Set completion with validation
   */
  const handleCompleteSet = async (setData: { reps?: number; weight?: number }) => {
    await completeSet(currentExerciseIndex, setData);
    
    // Auto-start rest if configured
    const currentExercise = session?.exercises[currentExerciseIndex];
    if (currentExercise?.restDuration && currentExercise.restDuration > 0) {
      startRest(currentExerciseIndex);
    }
  };

  /**
   * Handle workout completion with confirmation
   * @agentic_safe This function handles workout completion flow
   */
  const handleCompleteWorkout = () => {
    if (!session) return;

    const stats = getStats();
    Alert.alert(
      'Complete Workout?',
      `${stats.completedSets} sets completed in ${Math.floor(duration / 60)} minutes`,
      [
        { text: 'Continue', style: 'cancel' },
        {
          text: 'Complete',
          style: 'default',
          onPress: () => completeWorkout(),
        },
      ]
    );
  };

  /**
   * Format duration for display
   * @agentic_safe This function formats time display
   */
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Show start workout screen if no active session
  if (!isActive) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background.light} />
        
        <View style={styles.startContainer}>
          <Ionicons name="fitness" size={80} color={Colors.primary} />
          <Text style={styles.startTitle}>Ready to Workout?</Text>
          <Text style={styles.startSubtitle}>
            Start a new workout session with gesture-based logging
          </Text>
          
          <TouchableOpacity style={styles.startButton} onPress={() => startWorkout()}>
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentExercise = session?.exercises[currentExerciseIndex];
  const stats = getStats();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background.light} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.workoutTitle}>Active Workout</Text>
          <Text style={styles.workoutDuration}>{formatDuration(duration)}</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => setShowAddExercise(true)}
          >
            <Ionicons name="add-circle" size={24} color={Colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton} onPress={handleCompleteWorkout}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{session?.exercises.length || 0}</Text>
          <Text style={styles.statLabel}>Exercises</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.completedSets}</Text>
          <Text style={styles.statLabel}>Sets</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalReps}</Text>
          <Text style={styles.statLabel}>Reps</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Math.round(stats.totalWeight)}</Text>
          <Text style={styles.statLabel}>kg</Text>
        </View>
      </View>

      {/* Rest Timer */}
      {isResting && currentRest && (
        <View style={styles.restTimer}>
          <Text style={styles.restText}>Rest Time</Text>
          <Text style={styles.restCountdown}>
            {Math.max(0, Math.floor(currentRest.timeRemaining))}s
          </Text>
          <TouchableOpacity style={styles.skipRestButton} onPress={skipRest}>
            <Text style={styles.skipRestText}>Skip Rest</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content */}
      {currentExercise ? (
        <View style={styles.mainContent}>
          {/* Exercise Navigation */}
          {session && session.exercises.length > 1 && (
            <View style={styles.exerciseNav}>
              <TouchableOpacity
                style={[styles.navButton, currentExerciseIndex === 0 && styles.navButtonDisabled]}
                disabled={currentExerciseIndex === 0}
                onPress={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
              >
                <Ionicons 
                  name="chevron-back" 
                  size={20} 
                  color={currentExerciseIndex === 0 ? Colors.gray.primary : Colors.primary} 
                />
              </TouchableOpacity>
              
              <Text style={styles.exerciseCounter}>
                {currentExerciseIndex + 1} of {session.exercises.length}
              </Text>
              
              <TouchableOpacity
                style={[styles.navButton, currentExerciseIndex === session.exercises.length - 1 && styles.navButtonDisabled]}
                disabled={currentExerciseIndex === session.exercises.length - 1}
                onPress={() => setCurrentExerciseIndex(Math.min(session.exercises.length - 1, currentExerciseIndex + 1))}
              >
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={currentExerciseIndex === session.exercises.length - 1 ? Colors.gray.primary : Colors.primary} 
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Gesture Set Logger */}
          <GestureSetLogger
            exercise={{
              id: currentExercise.exercise.id,
              name: currentExercise.exercise.name,
              targetSets: currentExercise.targetSets,
              targetReps: currentExercise.targetReps,
              sets: currentExercise.sets,
            }}
            currentSetIndex={currentExercise.sets.length}
            onCompleteSet={handleCompleteSet}
            onStartRest={() => startRest(currentExerciseIndex)}
            onUndo={() => {
              // TODO: Implement undo functionality
              Alert.alert('Undo', 'Undo functionality not yet implemented');
            }}
            onNextSet={() => {
              // Move to next exercise if current one is complete
              if (currentExercise.sets.length >= (currentExercise.targetSets || 3)) {
                if (currentExerciseIndex < (session?.exercises.length || 1) - 1) {
                  setCurrentExerciseIndex(currentExerciseIndex + 1);
                } else {
                  handleCompleteWorkout();
                }
              }
            }}
            showHints={stats.completedSets === 0} // Show hints for first set only
          />

          {/* Set History */}
          {currentExercise.sets.length > 0 && (
            <View style={styles.setHistory}>
              <Text style={styles.setHistoryTitle}>Completed Sets</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {currentExercise.sets.map((set, index) => (
                  <View key={index} style={styles.completedSet}>
                    <Text style={styles.completedSetNumber}>{set.setNumber}</Text>
                    <Text style={styles.completedSetDetails}>
                      {set.reps} reps
                      {set.weight && ` @ ${set.weight}kg`}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.noExerciseContainer}>
          <Ionicons name="add-circle-outline" size={60} color={Colors.gray.primary} />
          <Text style={styles.noExerciseText}>Add your first exercise to get started</Text>
          <TouchableOpacity 
            style={styles.addExerciseButton} 
            onPress={() => setShowAddExercise(true)}
          >
            <Text style={styles.addExerciseButtonText}>Add Exercise</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add Exercise Modal */}
      {showAddExercise && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <QuickExerciseAdd
              onAddExercise={handleAddExercise}
              currentWorkout={session}
              onClose={() => setShowAddExercise(false)}
            />
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowAddExercise(false)}
            >
              <Ionicons name="close" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  // Start screen styles
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  startTitle: {
    fontSize: Typography.fontSize.largeTitle,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    textAlign: 'center',
    fontFamily: Typography.fontFamily.system,
  },
  startSubtitle: {
    fontSize: Typography.fontSize.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: Typography.lineHeight.body,
    fontFamily: Typography.fontFamily.system,
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  startButtonText: {
    fontSize: Typography.fontSize.headline,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
    fontFamily: Typography.fontFamily.system,
  },
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator.default,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  workoutTitle: {
    fontSize: Typography.fontSize.headline,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily.system,
  },
  workoutDuration: {
    fontSize: Typography.fontSize.subheadline,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily.system,
  },
  headerButton: {
    padding: Spacing.xs,
  },
  // Stats bar styles
  statsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    paddingVertical: Spacing.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.fontSize.title3,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily.system,
  },
  statLabel: {
    fontSize: Typography.fontSize.caption1,
    color: Colors.text.secondary,
    fontFamily: Typography.fontFamily.system,
  },
  // Rest timer styles
  restTimer: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    alignItems: 'center',
  },
  restText: {
    fontSize: Typography.fontSize.subheadline,
    color: Colors.white,
    fontWeight: Typography.fontWeight.medium,
    fontFamily: Typography.fontFamily.system,
  },
  restCountdown: {
    fontSize: Typography.fontSize.largeTitle,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.white,
    marginVertical: Spacing.xs,
    fontFamily: Typography.fontFamily.system,
  },
  skipRestButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  skipRestText: {
    fontSize: Typography.fontSize.footnote,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
    fontFamily: Typography.fontFamily.system,
  },
  // Main content styles
  mainContent: {
    flex: 1,
  },
  exerciseNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.secondary,
  },
  navButton: {
    padding: Spacing.xs,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  exerciseCounter: {
    fontSize: Typography.fontSize.subheadline,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily.system,
  },
  setHistory: {
    backgroundColor: Colors.background.secondary,
    paddingVertical: Spacing.sm,
  },
  setHistoryTitle: {
    fontSize: Typography.fontSize.footnote,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.md,
    fontFamily: Typography.fontFamily.system,
  },
  completedSet: {
    backgroundColor: Colors.background.light,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginLeft: Spacing.md,
    minWidth: 80,
    alignItems: 'center',
  },
  completedSetNumber: {
    fontSize: Typography.fontSize.subheadline,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    fontFamily: Typography.fontFamily.system,
  },
  completedSetDetails: {
    fontSize: Typography.fontSize.caption1,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontFamily: Typography.fontFamily.system,
  },
  // No exercise styles
  noExerciseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  noExerciseText: {
    fontSize: Typography.fontSize.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    fontFamily: Typography.fontFamily.system,
  },
  addExerciseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  addExerciseButtonText: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
    fontFamily: Typography.fontFamily.system,
  },
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlay.light,
  },
  modalContent: {
    flex: 1,
    backgroundColor: Colors.background.light,
    marginTop: 50,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.round,
    padding: Spacing.sm,
  },
});