# Agentic Coding Implementation Specifications

## Overview
Detailed specifications for structuring the codebase to maximize success with AI-assisted development using Claude Code, GitHub Copilot, or similar agentic coding tools.

## Code Architecture for AI Development

### 1. AI-Readable Project Structure
**Purpose**: Enable AI to quickly understand and navigate codebase

```
src/
├── modules/                    # Feature-based modules
│   ├── exercise-tracking/     # Self-contained exercise features
│   │   ├── components/        # UI components
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # Business logic
│   │   ├── types/            # TypeScript definitions
│   │   ├── tests/            # Test files
│   │   ├── README.md         # Module documentation
│   │   └── module.config.ts  # Module configuration
│   ├── workout-logging/      # Workout session management
│   ├── ai-generation/        # AI workout generation
│   └── progress-tracking/    # Analytics and progress
├── shared/                   # Shared utilities
│   ├── components/          # Reusable UI components
│   ├── hooks/              # Common hooks
│   ├── services/           # Core services
│   ├── types/              # Global type definitions
│   └── utils/              # Utility functions
├── config/                 # App configuration
├── database/              # Database setup and migrations
└── navigation/            # App navigation setup
```

### 2. Module-Based Architecture
**Purpose**: Clear boundaries for AI development work

**Module Template**:
```typescript
// module.config.ts - AI can read this to understand module purpose
export const ExerciseTrackingModule = {
  name: 'ExerciseTracking',
  version: '1.0.0',
  description: 'Handles exercise selection, set logging, and exercise management',
  
  // AI Development Guidelines
  ai_guidelines: {
    safe_to_modify: [
      'components/**/*.tsx',
      'hooks/**/*.ts',
      'services/**/*.ts (except database schema changes)'
    ],
    requires_review: [
      'types/**/*.ts (type changes affect other modules)',
      'database migrations'
    ],
    dependencies: ['shared/database', 'shared/navigation'],
    testing_required: true
  },
  
  // Public API - other modules can depend on these
  exports: {
    components: ['ExerciseSelector', 'SetLogger', 'ExerciseList'],
    hooks: ['useExerciseHistory', 'useSetProgression'],
    services: ['ExerciseService'],
    types: ['Exercise', 'Set', 'ExerciseFilters']
  }
};
```

### 3. Self-Documenting Components
**Purpose**: Provide AI with context about component purpose and safe modifications

```typescript
/**
 * @component SetLogger
 * @module ExerciseTracking
 * @description Logs individual sets during workout with weight, reps, and completion tracking
 * 
 * @agentic_context
 * - Primary user interaction during active workouts
 * - Performance critical - must respond in <100ms
 * - Safe to modify: UI layout, validation logic, completion flow
 * - Avoid changing: database operations (use ExerciseService instead)
 * 
 * @dependencies ExerciseService, NotificationService, HapticService
 */
export const SetLogger: React.FC<SetLoggerProps> = ({
  exercise,
  currentSet,
  onSetComplete,
  onProgressionSuggestion
}) => {
  // Implementation with inline AI guidance
  
  /**
   * @agentic_safe This function handles set completion
   * Safe to modify validation logic and progression calculation
   */
  const handleSetComplete = useCallback((setData: SetData) => {
    // Implementation
  }, []);

  return (
    <View style={styles.container}>
      {/* AI can modify layout and styling freely */}
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      
      {/* Critical user interaction - preserve accessibility */}
      <TouchableOpacity 
        onPress={handleSetComplete}
        accessibilityLabel="Complete set"
        accessibilityRole="button"
      >
        <Text>Complete Set</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### 4. Standardized Hook Patterns
**Purpose**: Consistent patterns AI can follow and extend

```typescript
/**
 * @hook useWorkoutSession
 * @agentic_pattern Standard workout management hook
 * 
 * AI can create similar hooks following this pattern:
 * 1. State management with clear types
 * 2. Loading and error states
 * 3. Action methods with proper error handling
 * 4. Cleanup in useEffect
 */
export const useWorkoutSession = (initialWorkout?: Workout) => {
  // State with clear TypeScript types
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<WorkoutError | null>(null);

  // Actions with consistent error handling pattern
  const startWorkout = useCallback(async (workoutData: StartWorkoutParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const newSession = await WorkoutService.startSession(workoutData);
      setSession(newSession);
      return newSession;
    } catch (err) {
      const workoutError = new WorkoutError('Failed to start workout', err);
      setError(workoutError);
      throw workoutError;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeWorkout = useCallback(async () => {
    // Similar pattern for all actions
  }, [session]);

  // Cleanup pattern
  useEffect(() => {
    return () => {
      if (session && !session.completed) {
        WorkoutService.savePartialSession(session);
      }
    };
  }, [session]);

  return {
    session,
    loading,
    error,
    actions: {
      startWorkout,
      completeWorkout,
      addExercise,
      logSet
    }
  };
};
```

### 5. Service Layer with AI Contracts
**Purpose**: Clear contracts for AI to understand and extend business logic

```typescript
/**
 * @service ExerciseService
 * @agentic_contract This service handles all exercise-related business logic
 * 
 * AI Development Rules:
 * - Always return Promise<T> for async operations
 * - Include proper error handling with typed errors
 * - Maintain data validation on all inputs
 * - Update TypeScript types when changing method signatures
 */
export class ExerciseService {
  /**
   * @agentic_method Retrieves exercises with filtering
   * @param filters Exercise filters (muscle group, equipment, etc.)
   * @returns Promise<Exercise[]> Filtered exercise list
   * 
   * Safe for AI to modify:
   * - Add new filter parameters
   * - Improve search algorithm
   * - Add caching logic
   */
  static async getExercises(filters?: ExerciseFilters): Promise<Exercise[]> {
    try {
      // Validate inputs
      if (filters) {
        ExerciseFilters.validate(filters);
      }

      // Database query with proper error handling
      const exercises = await DatabaseService.query(`
        SELECT * FROM exercises 
        WHERE ${this.buildFilterQuery(filters)}
        ORDER BY name ASC
      `);

      return exercises.map(row => Exercise.fromDatabaseRow(row));
    } catch (error) {
      throw new ExerciseServiceError('Failed to retrieve exercises', error);
    }
  }

  /**
   * @agentic_method Creates new custom exercise
   * @param exerciseData Exercise creation data
   * @returns Promise<Exercise> Created exercise with generated ID
   * 
   * AI Safety Notes:
   * - Validate all required fields
   * - Check for duplicate names
   * - Ensure muscle_groups array is valid
   */
  static async createCustomExercise(exerciseData: CreateExerciseData): Promise<Exercise> {
    // Implementation with validation and error handling
  }
}
```

### 6. Type-Driven Development for AI
**Purpose**: Strong TypeScript types guide AI development

```typescript
/**
 * @types Exercise Domain Types
 * @agentic_guide These types define the exercise domain model
 * 
 * When modifying:
 * - Update database schema migrations
 * - Update validation functions
 * - Update API contracts if applicable
 * - Run type checking: npm run type-check
 */

// Base entity pattern for AI to follow
export interface Exercise {
  readonly id: number;
  readonly name: string;
  readonly muscle_groups: MuscleGroup[];
  readonly equipment: Equipment[];
  readonly category: ExerciseCategory;
  readonly instructions?: string;
  readonly difficulty_level: DifficultyLevel;
  readonly is_custom: boolean;
  readonly created_at: Date;
  readonly updated_at: Date;
}

// Creation types (omit readonly fields)
export interface CreateExerciseData {
  name: string;
  muscle_groups: MuscleGroup[];
  equipment: Equipment[];
  category: ExerciseCategory;
  instructions?: string;
  difficulty_level: DifficultyLevel;
}

// Update types (partial with ID required)
export interface UpdateExerciseData extends Partial<CreateExerciseData> {
  id: number;
}

// Filter types for search operations
export interface ExerciseFilters {
  muscle_groups?: MuscleGroup[];
  equipment?: Equipment[];
  category?: ExerciseCategory;
  difficulty_level?: DifficultyLevel;
  search_text?: string;
  is_custom?: boolean;
}

// Enum types for validation
export enum MuscleGroup {
  CHEST = 'chest',
  BACK = 'back',
  SHOULDERS = 'shoulders',
  BICEPS = 'biceps',
  TRICEPS = 'triceps',
  LEGS = 'legs',
  CORE = 'core'
}

// Validation functions AI can extend
export class ExerciseValidator {
  static validateCreateData(data: CreateExerciseData): ValidationResult {
    // Implementation AI can modify
  }
}
```

### 7. Testing Framework for AI Development
**Purpose**: Ensure AI-generated code maintains quality

```typescript
/**
 * @test ExerciseService Tests
 * @agentic_testing AI should follow this testing pattern
 * 
 * Test Structure:
 * 1. Describe the module/function being tested
 * 2. Test happy path scenarios
 * 3. Test error conditions
 * 4. Test edge cases
 * 5. Test AI safety requirements
 */
describe('ExerciseService', () => {
  beforeEach(() => {
    // Setup test data
    jest.clearAllMocks();
  });

  describe('getExercises', () => {
    it('should return all exercises when no filters provided', async () => {
      // Arrange
      const mockExercises = createMockExercises(5);
      DatabaseService.query = jest.fn().mockResolvedValue(mockExercises);

      // Act
      const result = await ExerciseService.getExercises();

      // Assert
      expect(result).toHaveLength(5);
      expect(DatabaseService.query).toHaveBeenCalledWith(expect.any(String));
    });

    it('should filter exercises by muscle group', async () => {
      // Test implementation
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      DatabaseService.query = jest.fn().mockRejectedValue(new Error('DB Error'));

      // Act & Assert
      await expect(ExerciseService.getExercises()).rejects.toThrow(ExerciseServiceError);
    });
  });

  // AI Safety Tests
  describe('AI Safety Requirements', () => {
    it('should validate input parameters', async () => {
      const invalidFilters = { muscle_groups: ['invalid'] as any };
      await expect(ExerciseService.getExercises(invalidFilters)).rejects.toThrow();
    });

    it('should not allow SQL injection in filters', async () => {
      const maliciousFilters = { search_text: "'; DROP TABLE exercises; --" };
      await expect(ExerciseService.getExercises(maliciousFilters)).rejects.toThrow();
    });
  });
});
```

### 8. AI Development Workflow Configuration
**Purpose**: Guide AI through proper development workflow

```json
// .ai-development-config.json
{
  "workflow": {
    "development_steps": [
      "Read existing module documentation",
      "Understand component/service contracts",
      "Write TypeScript types first",
      "Implement business logic with error handling",
      "Create React components with proper hooks",
      "Write comprehensive tests",
      "Update module documentation",
      "Run type checking and tests"
    ],
    "safety_checks": [
      "Verify TypeScript strict mode compliance",
      "Ensure all async operations have error handling",
      "Check accessibility attributes on interactive elements",
      "Validate database operations use prepared statements",
      "Confirm no hardcoded sensitive data"
    ],
    "quality_gates": [
      "npm run type-check",
      "npm run lint",
      "npm run test -- --coverage",
      "npm run test:integration"
    ]
  },
  "ai_guidelines": {
    "always_include": [
      "TypeScript types",
      "Error handling",
      "Loading states",
      "Accessibility attributes",
      "JSDoc comments"
    ],
    "never_modify": [
      "Database schema without migrations",
      "Core navigation structure",
      "Authentication logic",
      "Build configuration"
    ],
    "requires_human_review": [
      "Database migrations",
      "API key management",
      "Security-related changes",
      "Performance-critical modifications"
    ]
  }
}
```

### 9. AI Context Files
**Purpose**: Provide AI with project context at any time

```typescript
// .ai-context/project-overview.md
# Fitness App - AI Development Context

## Project Purpose
Personal fitness tracking app optimized for single-user, efficient workout logging.

## Current Architecture
- React Native + Expo
- TypeScript strict mode
- SQLite local database
- Module-based feature organization

## AI Development Guidelines
1. Always maintain TypeScript strict compliance
2. Follow existing hook patterns
3. Include comprehensive error handling
4. Write tests for new functionality
5. Update documentation when changing interfaces

## Key Performance Requirements
- Workout logging must be <100ms response time
- App startup <3 seconds
- Smooth 60fps animations

## Safety Requirements
- No data loss during workout sessions
- Offline-first functionality
- Input validation on all user data
- Graceful error handling with user-friendly messages
```

This comprehensive agentic coding specification ensures that AI tools can successfully develop, modify, and extend the fitness app while maintaining code quality, type safety, and user experience standards.