import { renderHook, act } from '@testing-library/react-native';
import { useWorkoutSession } from '@/shared/hooks/useWorkoutSession';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock repositories
jest.mock('@/shared/services/WorkoutRepository', () => ({
  WorkoutRepository: {
    create: jest.fn().mockResolvedValue({
      id: 1,
      name: null,
      notes: null,
      started_at: '2023-01-01T00:00:00Z',
      completed_at: null,
      status: 'in_progress',
      template_id: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    }),
    update: jest.fn().mockResolvedValue(true),
    findById: jest.fn(),
  },
}));

jest.mock('@/shared/services/ExerciseRepository', () => ({
  ExerciseRepository: {
    findById: jest.fn(),
  },
}));

describe('useWorkoutSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should start empty workout', async () => {
    const { result } = renderHook(() => useWorkoutSession());
    
    expect(result.current.session).toBeNull();
    expect(result.current.isActive).toBe(false);
    
    await act(async () => {
      await result.current.startWorkout();
    });
    
    expect(result.current.session?.status).toBe('in_progress');
    expect(result.current.isActive).toBe(true);
  });

  it('should add exercise to workout', async () => {
    const mockExercise = {
      id: 1,
      name: 'Push-up',
      muscle_groups: '["Chest"]',
      equipment: '[]',
      instructions: null,
      created_at: '2023-01-01',
      updated_at: '2023-01-01',
    };

    const { ExerciseRepository } = require('@/shared/services/ExerciseRepository');
    ExerciseRepository.findById.mockResolvedValue(mockExercise);

    const { result } = renderHook(() => useWorkoutSession());
    
    await act(async () => {
      await result.current.startWorkout();
      await result.current.addExercise(1, { targetSets: 3, targetReps: 10 });
    });
    
    expect(result.current.session?.exercises).toHaveLength(1);
    expect(result.current.session?.exercises[0].exercise).toEqual(mockExercise);
    expect(result.current.session?.exercises[0].targetSets).toBe(3);
  });

  it('should complete set with validation', async () => {
    const { result } = renderHook(() => useWorkoutSession());
    
    await act(async () => {
      await result.current.startWorkout();
      await result.current.addExercise(1, { targetSets: 3, targetReps: 10 });
      await result.current.completeSet(0, { reps: 10, weight: 50 });
    });
    
    const exercise = result.current.session?.exercises[0];
    expect(exercise?.sets).toHaveLength(1);
    expect(exercise?.sets[0].reps).toBe(10);
    expect(exercise?.sets[0].weight).toBe(50);
    expect(exercise?.sets[0].completed).toBe(true);
  });

  it('should auto-save workout state', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    
    const { result } = renderHook(() => useWorkoutSession());
    
    await act(async () => {
      await result.current.startWorkout();
    });
    
    // Auto-save should be triggered
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'active_workout',
      expect.any(String)
    );
  });

  it('should recover from crash', async () => {
    const mockSavedWorkout = {
      id: 1,
      name: null,
      status: 'in_progress',
      started_at: new Date().toISOString(),
      exercises: [],
    };

    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockSavedWorkout));

    const { result } = renderHook(() => useWorkoutSession());
    
    await act(async () => {
      await result.current.recoverWorkout();
    });
    
    expect(result.current.session).toBeTruthy();
    expect(result.current.session?.status).toBe('in_progress');
    expect(result.current.isActive).toBe(true);
  });

  it('should complete workout and clear auto-save', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    const { WorkoutRepository } = require('@/shared/services/WorkoutRepository');
    
    WorkoutRepository.update.mockResolvedValue(true);
    
    const { result } = renderHook(() => useWorkoutSession());
    
    await act(async () => {
      await result.current.startWorkout();
      await result.current.completeWorkout();
    });
    
    expect(result.current.session?.status).toBe('completed');
    expect(result.current.isActive).toBe(false);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('active_workout');
  });

  it('should calculate workout duration', async () => {
    const { result } = renderHook(() => useWorkoutSession());
    
    await act(async () => {
      await result.current.startWorkout();
    });
    
    // Mock time passage
    jest.advanceTimersByTime(60000); // 1 minute
    
    expect(result.current.duration).toBeGreaterThan(0);
  });

  it('should track rest time between sets', async () => {
    const { result } = renderHook(() => useWorkoutSession());
    
    await act(async () => {
      await result.current.startWorkout();
      await result.current.addExercise(1, { targetSets: 3, restDuration: 60 });
      await result.current.completeSet(0, { reps: 10 });
      result.current.startRest(0);
    });
    
    expect(result.current.session?.exercises[0].restStartTime).toBeTruthy();
    expect(result.current.isResting).toBe(true);
  });
});