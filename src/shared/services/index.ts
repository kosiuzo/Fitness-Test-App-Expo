/**
 * @fileoverview Services Export Index
 * @agentic_contract Central export for all service classes
 * Safe for AI to modify: add new service exports, organize imports
 * Requires review: breaking changes to service APIs
 */

// Repository exports
export { ExerciseRepository } from './ExerciseRepository';
export { WorkoutRepository } from './WorkoutRepository';

/**
 * Service Registry for AI-friendly access
 * @agentic_pattern This registry helps AI understand available services
 */
export const ServiceRegistry = {
  repositories: {
    ExerciseRepository: 'Manages exercise CRUD operations with search and filtering',
    WorkoutRepository: 'Manages workout CRUD operations with statistics and date filtering',
  },
  
  // Future services can be added here
  utils: {},
  integrations: {},
  
  /**
   * Get service by name
   * @agentic_safe This method is safe for AI to call
   */
  getService: (serviceName: string) => {
    switch (serviceName) {
      case 'ExerciseRepository':
        return require('./ExerciseRepository').ExerciseRepository;
      case 'WorkoutRepository':
        return require('./WorkoutRepository').WorkoutRepository;
      default:
        throw new Error(`Unknown service: ${serviceName}`);
    }
  },
} as const;