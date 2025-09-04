import { ExerciseRepository } from '@/shared/services/ExerciseRepository';
import { CreateExerciseData, UpdateExerciseData } from '@/shared/types/database';

// Mock DatabaseService for testing
jest.mock('@/database/DatabaseService', () => ({
  DatabaseService: {
    executeSql: jest.fn(),
  },
}));

const createMockExerciseData = (): CreateExerciseData => ({
  name: 'Test Exercise',
  muscle_groups: '["Chest", "Shoulders"]',
  equipment: '["Barbell"]',
  instructions: 'Test instructions',
});

describe('ExerciseRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create new exercise', async () => {
      const mockResult = {
        rows: { _array: [] },
        insertId: 1,
        rowsAffected: 1,
      };
      
      const { DatabaseService } = require('@/database/DatabaseService');
      DatabaseService.executeSql.mockResolvedValue(mockResult);

      const exerciseData = createMockExerciseData();
      const result = await ExerciseRepository.create(exerciseData);
      
      expect(result.id).toBe(1);
      expect(result.name).toBe(exerciseData.name);
      expect(DatabaseService.executeSql).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO exercises'),
        expect.arrayContaining([exerciseData.name, exerciseData.muscle_groups])
      );
    });
  });

  describe('findById', () => {
    it('should return exercise by id', async () => {
      const mockExercise = {
        id: 1,
        name: 'Test Exercise',
        muscle_groups: '["Chest"]',
        equipment: '["Barbell"]',
        instructions: 'Test instructions',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      const mockResult = {
        rows: { _array: [mockExercise] },
        insertId: undefined,
        rowsAffected: 1,
      };

      const { DatabaseService } = require('@/database/DatabaseService');
      DatabaseService.executeSql.mockResolvedValue(mockResult);

      const result = await ExerciseRepository.findById(1);
      
      expect(result).toEqual(mockExercise);
      expect(DatabaseService.executeSql).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM exercises WHERE id = ?'),
        [1]
      );
    });

    it('should return null if exercise not found', async () => {
      const mockResult = {
        rows: { _array: [] },
        insertId: undefined,
        rowsAffected: 0,
      };

      const { DatabaseService } = require('@/database/DatabaseService');
      DatabaseService.executeSql.mockResolvedValue(mockResult);

      const result = await ExerciseRepository.findById(999);
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all exercises', async () => {
      const mockExercises = [
        { id: 1, name: 'Exercise 1', muscle_groups: '["Chest"]' },
        { id: 2, name: 'Exercise 2', muscle_groups: '["Back"]' },
      ];

      const mockResult = {
        rows: { _array: mockExercises },
        insertId: undefined,
        rowsAffected: 2,
      };

      const { DatabaseService } = require('@/database/DatabaseService');
      DatabaseService.executeSql.mockResolvedValue(mockResult);

      const result = await ExerciseRepository.findAll();
      
      expect(result).toEqual(mockExercises);
      expect(DatabaseService.executeSql).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM exercises ORDER BY name ASC')
      );
    });
  });

  describe('update', () => {
    it('should update exercise', async () => {
      const mockResult = {
        rows: { _array: [] },
        insertId: undefined,
        rowsAffected: 1,
      };

      const { DatabaseService } = require('@/database/DatabaseService');
      DatabaseService.executeSql.mockResolvedValue(mockResult);

      const updateData: UpdateExerciseData = {
        name: 'Updated Exercise',
        instructions: 'Updated instructions',
      };

      const result = await ExerciseRepository.update(1, updateData);
      
      expect(result).toBe(true);
      expect(DatabaseService.executeSql).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE exercises SET'),
        expect.arrayContaining([updateData.name, updateData.instructions, 1])
      );
    });
  });

  describe('delete', () => {
    it('should delete exercise', async () => {
      const mockResult = {
        rows: { _array: [] },
        insertId: undefined,
        rowsAffected: 1,
      };

      const { DatabaseService } = require('@/database/DatabaseService');
      DatabaseService.executeSql.mockResolvedValue(mockResult);

      const result = await ExerciseRepository.delete(1);
      
      expect(result).toBe(true);
      expect(DatabaseService.executeSql).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM exercises WHERE id = ?'),
        [1]
      );
    });
  });

  describe('search', () => {
    it('should search exercises by name', async () => {
      const mockExercises = [
        { id: 1, name: 'Push-up', muscle_groups: '["Chest"]' },
      ];

      const mockResult = {
        rows: { _array: mockExercises },
        insertId: undefined,
        rowsAffected: 1,
      };

      const { DatabaseService } = require('@/database/DatabaseService');
      DatabaseService.executeSql.mockResolvedValue(mockResult);

      const result = await ExerciseRepository.search('push');
      
      expect(result).toEqual(mockExercises);
      expect(DatabaseService.executeSql).toHaveBeenCalledWith(
        expect.stringContaining('WHERE name LIKE ?'),
        ['%push%']
      );
    });
  });
});