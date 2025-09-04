/**
 * @fileoverview Workout Repository
 * @agentic_contract Repository for workout CRUD operations
 * Safe for AI to modify: add methods, improve queries, extend functionality
 * Requires review: schema changes, breaking API changes
 */

import { DatabaseService } from '@/database/DatabaseService';
import { AgenticService, ServiceContract } from '@/shared/types/agentic-contracts';
import { Workout, CreateWorkoutData, UpdateWorkoutData } from '@/shared/types/database';

const serviceContract: ServiceContract = {
  name: 'WorkoutRepository',
  description: 'Handles all workout CRUD operations with optimized queries',
  methods: [
    {
      name: 'create',
      description: 'Create a new workout',
      parameters: [
        { name: 'data', type: 'CreateWorkoutData', required: true, description: 'Workout data to create' }
      ],
      returnType: 'Promise<Workout>',
      throws: ['DatabaseError'],
    },
    {
      name: 'findById',
      description: 'Find workout by ID',
      parameters: [
        { name: 'id', type: 'number', required: true, description: 'Workout ID' }
      ],
      returnType: 'Promise<Workout | null>',
    },
    {
      name: 'findRecent',
      description: 'Get recent workouts',
      parameters: [
        { name: 'limit', type: 'number', required: false, description: 'Number of workouts to return' }
      ],
      returnType: 'Promise<Workout[]>',
    },
  ],
  ai_safe: true,
};

/**
 * @service WorkoutRepository
 * @agentic_contract Handles all workout CRUD operations
 * Safe for AI to modify: add methods, improve queries
 */
@AgenticService(serviceContract)
export class WorkoutRepository {
  
  /**
   * Create a new workout
   * @agentic_pattern Standard repository create method
   */
  public static async create(data: CreateWorkoutData): Promise<Workout> {
    try {
      const now = new Date().toISOString();
      
      const result = await DatabaseService.executeSql(
        `INSERT INTO workouts (name, notes, started_at, completed_at, status, template_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.name, data.notes, data.started_at, data.completed_at, data.status, data.template_id, now, now]
      );

      if (!result.insertId) {
        throw new Error('Failed to create workout');
      }

      return {
        id: result.insertId,
        ...data,
        created_at: now,
        updated_at: now,
      };
    } catch (error) {
      throw new Error(`Failed to create workout: ${error}`);
    }
  }

  /**
   * Find workout by ID
   * @agentic_pattern Standard repository find by ID method
   */
  public static async findById(id: number): Promise<Workout | null> {
    try {
      const result = await DatabaseService.executeSql(
        'SELECT * FROM workouts WHERE id = ?',
        [id]
      );

      return result.rows._array.length > 0 ? result.rows._array[0] : null;
    } catch (error) {
      throw new Error(`Failed to find workout: ${error}`);
    }
  }

  /**
   * Get recent workouts
   * @agentic_pattern Standard repository query with limit
   */
  public static async findRecent(limit: number = 10): Promise<Workout[]> {
    try {
      const result = await DatabaseService.executeSql(
        'SELECT * FROM workouts ORDER BY started_at DESC LIMIT ?',
        [limit]
      );

      return result.rows._array;
    } catch (error) {
      throw new Error(`Failed to get recent workouts: ${error}`);
    }
  }

  /**
   * Update an existing workout
   * @agentic_pattern Standard repository update method
   */
  public static async update(id: number, data: UpdateWorkoutData): Promise<boolean> {
    try {
      const updateFields: string[] = [];
      const updateValues: any[] = [];

      // Build dynamic update query
      if (data.name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(data.name);
      }
      if (data.notes !== undefined) {
        updateFields.push('notes = ?');
        updateValues.push(data.notes);
      }
      if (data.completed_at !== undefined) {
        updateFields.push('completed_at = ?');
        updateValues.push(data.completed_at);
      }
      if (data.status !== undefined) {
        updateFields.push('status = ?');
        updateValues.push(data.status);
      }

      if (updateFields.length === 0) {
        return false; // Nothing to update
      }

      updateFields.push('updated_at = ?');
      updateValues.push(new Date().toISOString());
      updateValues.push(id);

      const result = await DatabaseService.executeSql(
        `UPDATE workouts SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      return result.rowsAffected > 0;
    } catch (error) {
      throw new Error(`Failed to update workout: ${error}`);
    }
  }

  /**
   * Delete a workout
   * @agentic_pattern Standard repository delete method
   */
  public static async delete(id: number): Promise<boolean> {
    try {
      const result = await DatabaseService.executeSql(
        'DELETE FROM workouts WHERE id = ?',
        [id]
      );

      return result.rowsAffected > 0;
    } catch (error) {
      throw new Error(`Failed to delete workout: ${error}`);
    }
  }

  /**
   * Get active workout (in progress)
   * @agentic_safe This method is safe for AI to extend
   */
  public static async getActiveWorkout(): Promise<Workout | null> {
    try {
      const result = await DatabaseService.executeSql(
        "SELECT * FROM workouts WHERE status = 'in_progress' ORDER BY started_at DESC LIMIT 1"
      );

      return result.rows._array.length > 0 ? result.rows._array[0] : null;
    } catch (error) {
      throw new Error(`Failed to get active workout: ${error}`);
    }
  }

  /**
   * Get workout statistics
   * @agentic_safe This method is safe for AI to extend
   */
  public static async getStats(days: number = 30): Promise<{
    totalWorkouts: number;
    completedWorkouts: number;
    averageDuration: number;
    workoutsThisPeriod: number;
  }> {
    try {
      const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

      // Get total workouts
      const totalResult = await DatabaseService.executeSql(
        'SELECT COUNT(*) as count FROM workouts'
      );

      // Get completed workouts
      const completedResult = await DatabaseService.executeSql(
        "SELECT COUNT(*) as count FROM workouts WHERE status = 'completed'"
      );

      // Get workouts in period
      const periodResult = await DatabaseService.executeSql(
        'SELECT COUNT(*) as count FROM workouts WHERE started_at >= ?',
        [sinceDate]
      );

      // Calculate average duration (simplified - assumes completed_at and started_at are present)
      const durationResult = await DatabaseService.executeSql(
        `SELECT AVG(
           julianday(completed_at) - julianday(started_at)
         ) * 24 * 60 as avg_minutes
         FROM workouts 
         WHERE status = 'completed' 
         AND completed_at IS NOT NULL
         AND started_at IS NOT NULL`
      );

      return {
        totalWorkouts: totalResult.rows._array[0]?.count || 0,
        completedWorkouts: completedResult.rows._array[0]?.count || 0,
        averageDuration: durationResult.rows._array[0]?.avg_minutes || 0,
        workoutsThisPeriod: periodResult.rows._array[0]?.count || 0,
      };
    } catch (error) {
      throw new Error(`Failed to get workout stats: ${error}`);
    }
  }

  /**
   * Find workouts by date range
   * @agentic_safe This method is safe for AI to extend
   */
  public static async findByDateRange(startDate: string, endDate: string): Promise<Workout[]> {
    try {
      const result = await DatabaseService.executeSql(
        'SELECT * FROM workouts WHERE started_at >= ? AND started_at <= ? ORDER BY started_at DESC',
        [startDate, endDate]
      );

      return result.rows._array;
    } catch (error) {
      throw new Error(`Failed to find workouts by date range: ${error}`);
    }
  }
}