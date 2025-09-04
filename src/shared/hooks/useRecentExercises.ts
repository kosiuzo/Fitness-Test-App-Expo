/**
 * @fileoverview Recent Exercises Hook
 * @agentic_contract Hook to get recently used exercises for quick access
 * Safe for AI to modify: improve caching, add filtering, extend functionality
 * Requires review: changes to storage mechanism
 */

import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExerciseRepository } from '@/shared/services/ExerciseRepository';
import { Exercise } from '@/shared/types/database';

const RECENT_EXERCISES_KEY = 'recent_exercises';
const MAX_RECENT_EXERCISES = 10;

interface UseRecentExercisesReturn {
  recentExercises: Exercise[];
  loading: boolean;
  error: string | null;
  addToRecent: (exerciseId: number) => Promise<void>;
  clearRecent: () => Promise<void>;
}

/**
 * @hook useRecentExercises
 * @agentic_pattern Hook for managing recently used exercises
 * AI can extend this following the established pattern
 */
export const useRecentExercises = (limit: number = 5): UseRecentExercisesReturn => {
  const [recentExercises, setRecentExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load recent exercises from storage and fetch full data
   * @agentic_pattern Standard data loading with error handling
   */
  const loadRecentExercises = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Get recent exercise IDs from storage
      const recentData = await AsyncStorage.getItem(RECENT_EXERCISES_KEY);
      const recentIds: number[] = recentData ? JSON.parse(recentData) : [];

      if (recentIds.length === 0) {
        setRecentExercises([]);
        return;
      }

      // Fetch full exercise data for recent IDs
      const exercises: Exercise[] = [];
      for (const id of recentIds.slice(0, limit)) {
        const exercise = await ExerciseRepository.findById(id);
        if (exercise) {
          exercises.push(exercise);
        }
      }

      setRecentExercises(exercises);
    } catch (err) {
      setError(`Failed to load recent exercises: ${err}`);
      setRecentExercises([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add exercise to recent list
   * @agentic_safe This method is safe for AI to call and extend
   */
  const addToRecent = async (exerciseId: number): Promise<void> => {
    try {
      // Get current recent exercises
      const recentData = await AsyncStorage.getItem(RECENT_EXERCISES_KEY);
      const currentRecent: number[] = recentData ? JSON.parse(recentData) : [];

      // Remove if already exists (to move to top)
      const filtered = currentRecent.filter(id => id !== exerciseId);
      
      // Add to beginning
      const updated = [exerciseId, ...filtered].slice(0, MAX_RECENT_EXERCISES);
      
      // Save to storage
      await AsyncStorage.setItem(RECENT_EXERCISES_KEY, JSON.stringify(updated));
      
      // Refresh the list
      await loadRecentExercises();
    } catch (err) {
      console.error('Failed to add to recent exercises:', err);
    }
  };

  /**
   * Clear recent exercises
   * @agentic_safe This method is safe for AI to call
   */
  const clearRecent = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(RECENT_EXERCISES_KEY);
      setRecentExercises([]);
    } catch (err) {
      console.error('Failed to clear recent exercises:', err);
    }
  };

  // Load recent exercises on mount
  useEffect(() => {
    loadRecentExercises();
  }, [limit]);

  return {
    recentExercises,
    loading,
    error,
    addToRecent,
    clearRecent,
  };
};