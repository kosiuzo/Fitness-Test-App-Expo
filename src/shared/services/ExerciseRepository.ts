/**
 * @fileoverview Exercise Repository
 * @agentic_contract Repository for exercise CRUD operations
 * Safe for AI to modify: add methods, improve queries, extend functionality
 * Requires review: schema changes, breaking API changes
 */

import { DatabaseService } from '@/database/DatabaseService';
import { AgenticService, ServiceContract, MethodContract } from '@/shared/types/agentic-contracts';
import { Exercise, CreateExerciseData, UpdateExerciseData } from '@/shared/types/database';

const serviceContract: ServiceContract = {
  name: 'ExerciseRepository',
  description: 'Handles all exercise CRUD operations with optimized queries',
  methods: [
    {
      name: 'create',
      description: 'Create a new exercise',
      parameters: [
        { name: 'data', type: 'CreateExerciseData', required: true, description: 'Exercise data to create' }
      ],
      returnType: 'Promise<Exercise>',
      throws: ['DatabaseError'],
    },
    {
      name: 'findById',
      description: 'Find exercise by ID',
      parameters: [
        { name: 'id', type: 'number', required: true, description: 'Exercise ID' }
      ],
      returnType: 'Promise<Exercise | null>',
    },
    {
      name: 'findAll',
      description: 'Get all exercises sorted by name',
      parameters: [],
      returnType: 'Promise<Exercise[]>',
    },
    {
      name: 'update',
      description: 'Update an existing exercise',
      parameters: [
        { name: 'id', type: 'number', required: true, description: 'Exercise ID' },
        { name: 'data', type: 'UpdateExerciseData', required: true, description: 'Data to update' }
      ],
      returnType: 'Promise<boolean>',
    },
    {
      name: 'delete',
      description: 'Delete an exercise',
      parameters: [
        { name: 'id', type: 'number', required: true, description: 'Exercise ID' }
      ],
      returnType: 'Promise<boolean>',
    },
  ],
  ai_safe: true,
};

/**
 * @service ExerciseRepository
 * @agentic_contract Handles all exercise CRUD operations
 * Safe for AI to modify: add methods, improve queries
 */
@AgenticService(serviceContract)
export class ExerciseRepository {
  
  /**
   * Create a new exercise
   * @agentic_pattern Standard repository create method
   */
  public static async create(data: CreateExerciseData): Promise<Exercise> {
    try {
      const now = new Date().toISOString();
      
      const result = await DatabaseService.executeSql(
        `INSERT INTO exercises (name, muscle_groups, equipment, instructions, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [data.name, data.muscle_groups, data.equipment, data.instructions, now, now]
      );

      if (!result.insertId) {
        throw new Error('Failed to create exercise');
      }

      return {
        id: result.insertId,
        ...data,
        created_at: now,
        updated_at: now,
      };
    } catch (error) {
      throw new Error(`Failed to create exercise: ${error}`);
    }
  }

  /**
   * Find exercise by ID
   * @agentic_pattern Standard repository find by ID method
   */
  public static async findById(id: number): Promise<Exercise | null> {
    try {
      const result = await DatabaseService.executeSql(
        'SELECT * FROM exercises WHERE id = ?',
        [id]
      );

      return result.rows._array.length > 0 ? result.rows._array[0] : null;
    } catch (error) {
      throw new Error(`Failed to find exercise: ${error}`);
    }
  }

  /**
   * Get all exercises
   * @agentic_pattern Standard repository find all method
   */
  public static async findAll(): Promise<Exercise[]> {
    try {
      const result = await DatabaseService.executeSql(
        'SELECT * FROM exercises ORDER BY name ASC'
      );

      return result.rows._array;
    } catch (error) {
      throw new Error(`Failed to get exercises: ${error}`);
    }
  }

  /**
   * Update an existing exercise
   * @agentic_pattern Standard repository update method
   */
  public static async update(id: number, data: UpdateExerciseData): Promise<boolean> {
    try {
      const updateFields: string[] = [];
      const updateValues: any[] = [];

      // Build dynamic update query
      if (data.name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(data.name);
      }
      if (data.muscle_groups !== undefined) {
        updateFields.push('muscle_groups = ?');
        updateValues.push(data.muscle_groups);
      }
      if (data.equipment !== undefined) {
        updateFields.push('equipment = ?');
        updateValues.push(data.equipment);
      }
      if (data.instructions !== undefined) {
        updateFields.push('instructions = ?');
        updateValues.push(data.instructions);
      }

      if (updateFields.length === 0) {
        return false; // Nothing to update
      }

      updateFields.push('updated_at = ?');
      updateValues.push(new Date().toISOString());
      updateValues.push(id);

      const result = await DatabaseService.executeSql(
        `UPDATE exercises SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      return result.rowsAffected > 0;
    } catch (error) {
      throw new Error(`Failed to update exercise: ${error}`);
    }
  }

  /**
   * Delete an exercise
   * @agentic_pattern Standard repository delete method
   */
  public static async delete(id: number): Promise<boolean> {
    try {
      const result = await DatabaseService.executeSql(
        'DELETE FROM exercises WHERE id = ?',
        [id]
      );

      return result.rowsAffected > 0;
    } catch (error) {
      throw new Error(`Failed to delete exercise: ${error}`);
    }
  }

  /**
   * Search exercises by name
   * @agentic_safe This method is safe for AI to extend
   */
  public static async search(query: string): Promise<Exercise[]> {
    try {
      const result = await DatabaseService.executeSql(
        'SELECT * FROM exercises WHERE name LIKE ? ORDER BY name ASC',
        [`%${query}%`]
      );

      return result.rows._array;
    } catch (error) {
      throw new Error(`Failed to search exercises: ${error}`);
    }
  }

  /**
   * Find exercises by muscle group
   * @agentic_safe This method is safe for AI to extend
   */
  public static async findByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
    try {
      const result = await DatabaseService.executeSql(
        'SELECT * FROM exercises WHERE muscle_groups LIKE ? ORDER BY name ASC',
        [`%"${muscleGroup}"%`]
      );

      return result.rows._array;
    } catch (error) {
      throw new Error(`Failed to find exercises by muscle group: ${error}`);
    }
  }

  /**
   * Get exercise statistics
   * @agentic_safe This method is safe for AI to extend
   */
  public static async getStats(): Promise<{
    totalExercises: number;
    exercisesByMuscleGroup: Record<string, number>;
  }> {
    try {
      // Get total count
      const totalResult = await DatabaseService.executeSql(
        'SELECT COUNT(*) as count FROM exercises'
      );

      const total = totalResult.rows._array[0]?.count || 0;

      // This is a simplified version - in production, you might want to
      // parse the JSON muscle_groups field and aggregate properly
      return {
        totalExercises: total,
        exercisesByMuscleGroup: {},
      };
    } catch (error) {
      throw new Error(`Failed to get exercise stats: ${error}`);
    }
  }

  /**
   * Check if exercise name is available
   * @agentic_safe This method is safe for AI to call
   */
  public static async isNameAvailable(name: string, excludeId?: number): Promise<boolean> {
    try {
      let query = 'SELECT COUNT(*) as count FROM exercises WHERE name = ?';
      const params: any[] = [name];

      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }

      const result = await DatabaseService.executeSql(query, params);
      const count = result.rows._array[0]?.count || 0;

      return count === 0;
    } catch (error) {
      throw new Error(`Failed to check name availability: ${error}`);
    }
  }
}