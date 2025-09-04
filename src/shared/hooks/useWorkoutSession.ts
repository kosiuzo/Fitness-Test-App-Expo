/**
 * @fileoverview Workout Session Hook
 * @agentic_contract Standard workout management hook with auto-save and crash recovery
 * Safe for AI to modify: extend functionality, add new methods, improve performance
 * Requires review: changes to core session state management
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutRepository } from '@/shared/services/WorkoutRepository';
import { ExerciseRepository } from '@/shared/services/ExerciseRepository';
import {
  WorkoutSession,
  WorkoutExerciseSession,
  AddExerciseOptions,
  CompleteSetData,
  WorkoutSessionStats,
  UseWorkoutSessionReturn,
} from '@/shared/types/workout-session';

const AUTOSAVE_KEY = 'active_workout';
const AUTOSAVE_INTERVAL = 30000; // 30 seconds

/**
 * @hook useWorkoutSession
 * @agentic_pattern Standard workout management hook
 * AI can extend this following the established pattern
 */
export const useWorkoutSession = (): UseWorkoutSessionReturn => {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentRest, setCurrentRest] = useState<{
    exerciseIndex: number;
    timeRemaining: number;
  } | null>(null);

  const autoSaveInterval = useRef<NodeJS.Timeout>();
  const durationInterval = useRef<NodeJS.Timeout>();
  const restInterval = useRef<NodeJS.Timeout>();

  /**
   * Auto-save workout session
   * @agentic_safe This function is safe for AI to call
   */
  const saveToStorage = useCallback(async (sessionData: WorkoutSession) => {
    try {
      await AsyncStorage.setItem(AUTOSAVE_KEY, JSON.stringify(sessionData));
      setSession(prev => prev ? { ...prev, lastSavedAt: new Date().toISOString() } : null);
    } catch (err) {
      console.error('Failed to save workout session:', err);
    }
  }, []);

  /**
   * Clear auto-saved data
   * @agentic_safe This function is safe for AI to call
   */
  const clearStorage = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(AUTOSAVE_KEY);
    } catch (err) {
      console.error('Failed to clear workout session:', err);
    }
  }, []);

  /**
   * Start auto-save and duration tracking
   * @agentic_pattern Standard interval setup pattern
   */
  const startIntervals = useCallback((sessionData: WorkoutSession) => {
    // Auto-save interval
    if (autoSaveInterval.current) clearInterval(autoSaveInterval.current);
    autoSaveInterval.current = setInterval(() => {
      if (sessionData && sessionData.status === 'in_progress') {
        saveToStorage(sessionData);
      }
    }, AUTOSAVE_INTERVAL);

    // Duration tracking interval
    if (durationInterval.current) clearInterval(durationInterval.current);
    durationInterval.current = setInterval(() => {
      if (sessionData && sessionData.status === 'in_progress' && !sessionData.isPaused) {
        const now = new Date().getTime();
        const start = new Date(sessionData.sessionStartTime).getTime();
        const pausedTime = sessionData.pausedTime || 0;
        setDuration(Math.floor((now - start) / 1000) - pausedTime);
      }
    }, 1000);
  }, [saveToStorage]);

  /**
   * Stop all intervals
   * @agentic_safe This function is safe for AI to call
   */
  const stopIntervals = useCallback(() => {
    if (autoSaveInterval.current) {
      clearInterval(autoSaveInterval.current);
      autoSaveInterval.current = undefined;
    }
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
      durationInterval.current = undefined;
    }
    if (restInterval.current) {
      clearInterval(restInterval.current);
      restInterval.current = undefined;
    }
  }, []);

  /**
   * Start a new workout
   * @agentic_pattern Standard workout initialization
   */
  const startWorkout = useCallback(async (templateId?: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const now = new Date().toISOString();
      
      // Create workout in database
      const workout = await WorkoutRepository.create({
        name: null,
        notes: null,
        started_at: now,
        completed_at: null,
        status: 'in_progress',
        template_id: templateId || null,
      });

      // Create session state
      const newSession: WorkoutSession = {
        id: workout.id,
        name: workout.name,
        notes: workout.notes,
        started_at: workout.started_at,
        completed_at: null,
        status: 'in_progress',
        template_id: workout.template_id,
        created_at: workout.created_at,
        updated_at: workout.updated_at,
        exercises: [],
        sessionStartTime: now,
        isPaused: false,
        isAutoSaving: false,
      };

      setSession(newSession);
      startIntervals(newSession);
      await saveToStorage(newSession);
    } catch (err) {
      setError(`Failed to start workout: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, [startIntervals, saveToStorage]);

  /**
   * Add exercise to current workout
   * @agentic_pattern Standard exercise addition with validation
   */
  const addExercise = useCallback(async (exerciseId: number, options: AddExerciseOptions = {}) => {
    if (!session) {
      setError('No active workout session');
      return;
    }

    try {
      setIsLoading(true);
      
      const exercise = await ExerciseRepository.findById(exerciseId);
      if (!exercise) {
        throw new Error('Exercise not found');
      }

      const newExerciseSession: WorkoutExerciseSession = {
        exercise,
        orderIndex: session.exercises.length,
        targetSets: options.targetSets || 3,
        targetReps: options.targetReps,
        targetWeight: options.targetWeight,
        targetDuration: options.targetDuration,
        restDuration: options.restDuration || 60,
        notes: options.notes,
        sets: [],
        createdAt: new Date().toISOString(),
      };

      const updatedSession = {
        ...session,
        exercises: [...session.exercises, newExerciseSession],
        updated_at: new Date().toISOString(),
      };

      setSession(updatedSession);
      await saveToStorage(updatedSession);
    } catch (err) {
      setError(`Failed to add exercise: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, [session, saveToStorage]);

  /**
   * Complete a set
   * @agentic_pattern Standard set completion with validation
   */
  const completeSet = useCallback(async (exerciseIndex: number, setData: CompleteSetData) => {
    if (!session || !session.exercises[exerciseIndex]) {
      setError('Invalid exercise or session');
      return;
    }

    try {
      const exercise = session.exercises[exerciseIndex];
      const setNumber = exercise.sets.length + 1;
      const now = new Date().toISOString();

      const newSet = {
        setNumber,
        reps: setData.reps,
        weight: setData.weight,
        duration: setData.duration,
        distance: setData.distance,
        rir: setData.rir,
        rpe: setData.rpe,
        notes: setData.notes,
        completed: true,
        completedAt: now,
        createdAt: now,
      };

      const updatedExercises = [...session.exercises];
      updatedExercises[exerciseIndex] = {
        ...exercise,
        sets: [...exercise.sets, newSet],
        lastSetCompletedAt: now,
      };

      const updatedSession = {
        ...session,
        exercises: updatedExercises,
        updated_at: now,
      };

      setSession(updatedSession);
      await saveToStorage(updatedSession);
    } catch (err) {
      setError(`Failed to complete set: ${err}`);
    }
  }, [session, saveToStorage]);

  /**
   * Start rest timer
   * @agentic_safe This function is safe for AI to extend
   */
  const startRest = useCallback((exerciseIndex: number) => {
    const exercise = session?.exercises[exerciseIndex];
    if (!exercise?.restDuration) return;

    const now = new Date().toISOString();
    
    // Update session with rest start time
    if (session) {
      const updatedExercises = [...session.exercises];
      updatedExercises[exerciseIndex] = {
        ...exercise,
        restStartTime: now,
      };
      
      setSession({ ...session, exercises: updatedExercises });
    }

    // Start countdown
    let timeRemaining = exercise.restDuration;
    setCurrentRest({ exerciseIndex, timeRemaining });

    if (restInterval.current) clearInterval(restInterval.current);
    restInterval.current = setInterval(() => {
      timeRemaining -= 1;
      if (timeRemaining <= 0) {
        setCurrentRest(null);
        if (restInterval.current) {
          clearInterval(restInterval.current);
          restInterval.current = undefined;
        }
      } else {
        setCurrentRest({ exerciseIndex, timeRemaining });
      }
    }, 1000);
  }, [session]);

  /**
   * Skip current rest period
   * @agentic_safe This function is safe for AI to call
   */
  const skipRest = useCallback(() => {
    setCurrentRest(null);
    if (restInterval.current) {
      clearInterval(restInterval.current);
      restInterval.current = undefined;
    }
  }, []);

  /**
   * Complete the workout
   * @agentic_pattern Standard workout completion with database update
   */
  const completeWorkout = useCallback(async (notes?: string) => {
    if (!session?.id) {
      setError('No active workout to complete');
      return;
    }

    try {
      setIsLoading(true);
      const now = new Date().toISOString();

      await WorkoutRepository.update(session.id, {
        completed_at: now,
        status: 'completed',
        notes: notes || session.notes,
      });

      const completedSession = {
        ...session,
        completed_at: now,
        status: 'completed' as const,
        notes: notes || session.notes,
        updated_at: now,
      };

      setSession(completedSession);
      stopIntervals();
      await clearStorage();
    } catch (err) {
      setError(`Failed to complete workout: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, [session, stopIntervals, clearStorage]);

  /**
   * Cancel the workout
   * @agentic_pattern Standard workout cancellation
   */
  const cancelWorkout = useCallback(async () => {
    if (!session?.id) return;

    try {
      await WorkoutRepository.update(session.id, {
        status: 'cancelled',
      });

      stopIntervals();
      await clearStorage();
      setSession(null);
      setDuration(0);
      setCurrentRest(null);
    } catch (err) {
      setError(`Failed to cancel workout: ${err}`);
    }
  }, [session, stopIntervals, clearStorage]);

  /**
   * Recover workout from storage
   * @agentic_pattern Crash recovery implementation
   */
  const recoverWorkout = useCallback(async () => {
    try {
      const savedData = await AsyncStorage.getItem(AUTOSAVE_KEY);
      if (savedData) {
        const recoveredSession: WorkoutSession = JSON.parse(savedData);
        setSession(recoveredSession);
        
        if (recoveredSession.status === 'in_progress') {
          startIntervals(recoveredSession);
        }
      }
    } catch (err) {
      console.error('Failed to recover workout:', err);
    }
  }, [startIntervals]);

  /**
   * Get workout statistics
   * @agentic_safe This function is safe for AI to extend
   */
  const getStats = useCallback((): WorkoutSessionStats => {
    if (!session) {
      return {
        totalDuration: 0,
        totalSets: 0,
        completedSets: 0,
        totalReps: 0,
        totalWeight: 0,
        exerciseCount: 0,
        averageRestTime: 0,
      };
    }

    const stats = session.exercises.reduce((acc, exercise) => {
      const completedSets = exercise.sets.filter(set => set.completed);
      
      return {
        totalSets: acc.totalSets + (exercise.targetSets || exercise.sets.length),
        completedSets: acc.completedSets + completedSets.length,
        totalReps: acc.totalReps + completedSets.reduce((sum, set) => sum + (set.reps || 0), 0),
        totalWeight: acc.totalWeight + completedSets.reduce((sum, set) => sum + ((set.weight || 0) * (set.reps || 0)), 0),
        exerciseCount: acc.exerciseCount + 1,
        averageRestTime: acc.averageRestTime, // TODO: Calculate actual average
      };
    }, {
      totalSets: 0,
      completedSets: 0,
      totalReps: 0,
      totalWeight: 0,
      exerciseCount: 0,
      averageRestTime: 0,
    });

    return {
      ...stats,
      totalDuration: duration,
    };
  }, [session, duration]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => stopIntervals();
  }, [stopIntervals]);

  // Auto-recover on mount
  useEffect(() => {
    recoverWorkout();
  }, [recoverWorkout]);

  return {
    // State
    session,
    isActive: session?.status === 'in_progress',
    isLoading,
    error,
    duration,
    isResting: currentRest !== null,
    currentRest,

    // Actions
    startWorkout,
    addExercise,
    removeExercise: async () => {}, // TODO: Implement
    reorderExercises: () => {}, // TODO: Implement

    // Set management
    completeSet,
    undoSet: async () => {}, // TODO: Implement
    startRest,
    skipRest,

    // Workout control
    pauseWorkout: () => {}, // TODO: Implement
    resumeWorkout: () => {}, // TODO: Implement
    completeWorkout,
    cancelWorkout,

    // Recovery and persistence
    recoverWorkout,
    saveWorkout: () => saveToStorage(session!),

    // Utilities
    getStats,
    getExerciseProgress: () => ({ completedSets: 0, totalSets: 0, progressPercentage: 0 }), // TODO: Implement
    getWorkoutProgress: () => ({ completedSets: 0, totalSets: 0, progressPercentage: 0 }), // TODO: Implement
  };
};