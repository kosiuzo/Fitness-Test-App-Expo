/**
 * @fileoverview Module Template for Agentic Development
 * This template provides a standardized structure for AI-safe module development
 * 
 * @agentic_contract Standard module template for fitness app
 * Safe for AI to modify: add new modules following this pattern
 * Requires review: changes to the template structure itself
 */

import { ModuleConfig } from '@/shared/types/agentic-contracts';

export const createModuleConfig = (
  name: string,
  description: string,
  customGuidelines?: Partial<ModuleConfig['ai_guidelines']>
): ModuleConfig => {
  const defaultGuidelines: ModuleConfig['ai_guidelines'] = {
    safe_to_modify: [
      'Add new methods following established patterns',
      'Extend existing functionality with proper error handling',
      'Add comprehensive JSDoc comments',
      'Follow TypeScript strict mode requirements',
      'Implement proper testing for all new code',
    ],
    requires_review: [
      'Changes to core interfaces',
      'Database schema modifications',
      'Breaking changes to public APIs',
      'Security-related modifications',
      'Performance-critical optimizations',
    ],
    ai_patterns: [
      'Repository pattern for data access',
      'Hook pattern for React state management',
      'Service pattern for business logic',
      'Factory pattern for object creation',
      'Observer pattern for event handling',
    ],
  };

  return {
    name,
    description,
    ai_guidelines: {
      ...defaultGuidelines,
      ...customGuidelines,
    },
    dependencies: [],
    exports: [],
  };
};

/**
 * @template BaseModule
 * Base class for all modules in the fitness app
 * Provides common functionality and ensures consistent structure
 */
export abstract class BaseModule {
  protected readonly config: ModuleConfig;
  protected initialized: boolean = false;

  constructor(config: ModuleConfig) {
    this.config = config;
  }

  /**
   * Initialize the module
   * @agentic_pattern Override this method in derived classes
   */
  abstract initialize(): Promise<void>;

  /**
   * Clean up module resources
   * @agentic_pattern Override this method in derived classes
   */
  abstract cleanup(): Promise<void>;

  /**
   * Get module configuration
   * @agentic_safe This method is safe for AI to call
   */
  public getConfig(): ModuleConfig {
    return { ...this.config };
  }

  /**
   * Check if module is initialized
   * @agentic_safe This method is safe for AI to call
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Set initialization status
   * @agentic_protected This method should only be called during initialization
   */
  protected setInitialized(status: boolean): void {
    this.initialized = status;
  }
}

/**
 * @example Module Implementation Example
 * 
 * ```typescript
 * const exerciseTrackingConfig = createModuleConfig(
 *   'ExerciseTracking',
 *   'Handles exercise data management and tracking functionality',
 *   {
 *     safe_to_modify: [
 *       ...defaultGuidelines.safe_to_modify,
 *       'Add new exercise types with proper validation',
 *       'Extend exercise metadata fields',
 *     ]
 *   }
 * );
 * 
 * class ExerciseTrackingModule extends BaseModule {
 *   async initialize(): Promise<void> {
 *     // Initialize exercise tracking
 *     this.setInitialized(true);
 *   }
 * 
 *   async cleanup(): Promise<void> {
 *     // Clean up resources
 *     this.setInitialized(false);
 *   }
 * }
 * ```
 */