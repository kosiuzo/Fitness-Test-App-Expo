# Agentic Implementation Guide - Fitness Tracking App

## Overview
This guide provides a complete step-by-step implementation roadmap for building the fitness tracking app using agentic coding workflows. Each step references specific product requirements and includes validation checkpoints.

## Prerequisites Verification

### Required Documents Review
Before starting implementation, ensure you have reviewed:
- [Main Product Requirements](./product-requirements/1-main-product-requirements.md) - Core vision and features
- [Technical Architecture](./product-requirements/2-technical-architecture.md) - Tech stack and architecture decisions
- [UI/UX Design Requirements](./product-requirements/3-ui-ux-design-requirements.md) - Design system and user experience
- [Workout Tracking Features](./product-requirements/4-workout-tracking-features.md) - Core functionality specifications
- [AI Workout Generation](./product-requirements/5-ai-workout-generation.md) - AI integration requirements
- [Data Models & Schema](./product-requirements/6-data-models-schema.md) - Database design
- [Implementation Roadmap](./product-requirements/7-implementation-roadmap.md) - Development timeline
- [Personal Use Optimizations](./product-requirements/8-personal-use-optimizations.md) - Efficiency enhancements
- [Agentic Coding Specifications](./product-requirements/9-agentic-coding-specifications.md) - AI development guidelines
- [Implementation Task Breakdown](./product-requirements/10-implementation-task-breakdown.md) - Detailed task list

### System Setup
Complete the setup from [SETUP-REQUIREMENTS.md](./SETUP-REQUIREMENTS.md):
```bash
# Run automated setup
./setup.sh

# Verify installation
node verify-setup.js
```

## Phase 1: Foundation Setup (Week 1)

### Step 1.1: Project Foundation
**Reference**: [Technical Architecture](./product-requirements/2-technical-architecture.md) + [Task 1.1](./product-requirements/10-implementation-task-breakdown.md#task-11-project-initialization--dependencies)

**Objective**: Create solid foundation with TypeScript, testing, and modular architecture

**Implementation Steps**:
1. **Initialize Project Structure**
   ```bash
   # Create the agentic-friendly folder structure
   mkdir -p src/{modules,shared,config,database,navigation}
   mkdir -p src/modules/{exercise-tracking,workout-logging,ai-generation,progress-tracking}
   mkdir -p src/shared/{components,hooks,services,types,utils}
   ```

2. **Write Failing Tests First** (TDD Approach)
   ```typescript
   // __tests__/setup/project-structure.test.ts
   describe('Project Structure', () => {
     it('should have proper TypeScript configuration', () => {
       expect(fs.existsSync('tsconfig.json')).toBe(true);
       const config = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
       expect(config.compilerOptions.strict).toBe(true);
     });
   });
   ```

3. **Implement Module System**
   ```typescript
   // src/modules/module-template.ts - Follow agentic coding spec
   export interface ModuleConfig {
     name: string;
     ai_guidelines: {
       safe_to_modify: string[];
       requires_review: string[];
     };
   }
   ```

**Validation**: All structure tests pass, TypeScript compiles without errors

### Step 1.2: Navigation Foundation
**Reference**: [UI/UX Design Requirements](./product-requirements/3-ui-ux-design-requirements.md#navigation-structure) + [Task 1.2](./product-requirements/10-implementation-task-breakdown.md#task-12-navigation-foundation)

**Objective**: Implement iOS-style tab navigation with 3 core screens

**Implementation Steps**:
1. **Write Navigation Tests First**
   ```typescript
   // __tests__/navigation/navigation.test.ts
   describe('Navigation Structure', () => {
     it('should render bottom tab navigator with 3 tabs', () => {
       const { getByTestId } = render(<AppNavigator />);
       expect(getByTestId('tab-workouts')).toBeTruthy();
       expect(getByTestId('tab-exercises')).toBeTruthy();
       expect(getByTestId('tab-history')).toBeTruthy();
     });
   });
   ```

2. **Implement Tab Navigation**
   ```typescript
   // src/navigation/TabNavigator.tsx
   const TabNavigator = () => (
     <Tab.Navigator
       screenOptions={{
         tabBarStyle: { height: 83 }, // iOS standard
         tabBarActiveTintColor: '#007AFF', // iOS blue
       }}
     >
       <Tab.Screen name="Workouts" component={WorkoutsStack} />
       <Tab.Screen name="Exercises" component={ExercisesStack} />
       <Tab.Screen name="History" component={HistoryStack} />
     </Tab.Navigator>
   );
   ```

**Validation**: Navigation tests pass, can navigate between all tabs

### Step 1.3: Design System Implementation
**Reference**: [UI/UX Design Requirements](./product-requirements/3-ui-ux-design-requirements.md#color-scheme) + [Task 1.3](./product-requirements/10-implementation-task-breakdown.md#task-13-design-system--theme-setup)

**Objective**: Create iOS-style design system with colors, typography, and spacing

**Implementation Steps**:
1. **Write Design System Tests**
   ```typescript
   // __tests__/design-system/theme.test.ts
   describe('Design System', () => {
     it('should have iOS-style color palette', () => {
       expect(Colors.primary).toBe('#007AFF');
       expect(Colors.success).toBe('#34C759');
     });
   });
   ```

2. **Implement Design Tokens**
   ```typescript
   // src/shared/design/colors.ts
   export const Colors = {
     primary: '#007AFF',
     success: '#34C759',
     background: {
       light: '#FFFFFF',
       dark: '#000000',
     },
   };
   ```

**Validation**: Design system tests pass, components render consistently

## Phase 2: Database & Data Layer (Week 1-2)

### Step 2.1: Database Schema Implementation
**Reference**: [Data Models & Schema](./product-requirements/6-data-models-schema.md) + [Task 2.1](./product-requirements/10-implementation-task-breakdown.md#task-21-database-schema-implementation)

**Objective**: Create SQLite database with optimized schema for personal use

**Implementation Steps**:
1. **Write Database Tests First**
   ```typescript
   // __tests__/database/schema.test.ts
   describe('Database Schema', () => {
     it('should create all required tables', async () => {
       await DatabaseService.initialize();
       const tables = await DatabaseService.getTables();
       expect(tables).toContain('exercises');
       expect(tables).toContain('workouts');
     });
   });
   ```

2. **Implement Simplified Schema** (Single-user optimized)
   ```sql
   -- Remove user_id columns for personal use
   CREATE TABLE exercises (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL UNIQUE,
     muscle_groups TEXT NOT NULL, -- JSON array
     equipment TEXT, -- JSON array
     -- No user_id needed for personal app
   );
   ```

**Reference**: [Personal Use Optimizations](./product-requirements/8-personal-use-optimizations.md#single-user-architecture)

**Validation**: Schema tests pass, all tables created with indexes

### Step 2.2: Repository Pattern Implementation
**Reference**: [Agentic Coding Specifications](./product-requirements/9-agentic-coding-specifications.md#service-layer-with-ai-contracts) + [Task 2.2](./product-requirements/10-implementation-task-breakdown.md#task-22-repository-pattern-implementation)

**Objective**: Create type-safe, AI-friendly data access layer

**Implementation Steps**:
1. **Write Repository Tests First**
   ```typescript
   // __tests__/services/exercise-repository.test.ts
   describe('ExerciseRepository', () => {
     it('should create new exercise', async () => {
       const exerciseData = createMockExerciseData();
       const exercise = await ExerciseRepository.create(exerciseData);
       expect(exercise.id).toBeDefined();
     });
   });
   ```

2. **Implement AI-Friendly Repository**
   ```typescript
   /**
    * @service ExerciseRepository
    * @agentic_contract Handles all exercise CRUD operations
    * Safe for AI to modify: add methods, improve queries
    */
   export class ExerciseRepository {
     static async create(data: CreateExerciseData): Promise<Exercise> {
       // Implementation with proper error handling
     }
   }
   ```

**Validation**: Repository tests pass, CRUD operations work correctly

## Phase 3: Core Workout Tracking (Week 2-3)

### Step 3.1: Workout Session Management
**Reference**: [Workout Tracking Features](./product-requirements/4-workout-tracking-features.md#1-quick-start-workout) + [Task 3.1](./product-requirements/10-implementation-task-breakdown.md#task-31-workout-session-management)

**Objective**: Implement efficient workout session state management

**Implementation Steps**:
1. **Write Session Hook Tests First**
   ```typescript
   // __tests__/hooks/use-workout-session.test.ts
   describe('useWorkoutSession', () => {
     it('should start empty workout', async () => {
       const { result } = renderHook(() => useWorkoutSession());
       await act(async () => {
         await result.current.startWorkout();
       });
       expect(result.current.session.status).toBe('in_progress');
     });
   });
   ```

2. **Implement Session Hook**
   ```typescript
   /**
    * @hook useWorkoutSession
    * @agentic_pattern Standard workout management hook
    * AI can extend this following the established pattern
    */
   export const useWorkoutSession = () => {
     const [session, setSession] = useState<WorkoutSession | null>(null);
     // Auto-save every 30 seconds
     // Crash recovery
     // State management
   };
   ```

**Validation**: Session tests pass, auto-save prevents data loss

### Step 3.2: Ultra-Fast Exercise Entry
**Reference**: [Personal Use Optimizations](./product-requirements/8-personal-use-optimizations.md#ultra-fast-exercise-entry) + [Task 4.3](./product-requirements/10-implementation-task-breakdown.md#task-43-ultra-fast-exercise-entry)

**Objective**: Sub-3-second exercise addition with predictive suggestions

**Implementation Steps**:
1. **Write Performance Tests First**
   ```typescript
   // __tests__/components/quick-exercise-add.test.ts
   describe('QuickExerciseAdd', () => {
     it('should add exercise in under 3 seconds', async () => {
       const startTime = Date.now();
       fireEvent.press(getByTestId('recent-exercise-0'));
       await waitFor(() => {
         const endTime = Date.now();
         expect(endTime - startTime).toBeLessThan(3000);
       });
     });
   });
   ```

2. **Implement Quick Add Component**
   ```typescript
   // Recent exercises widget with predictive suggestions
   const QuickAddExercises = () => {
     const recentExercises = useRecentExercises(5);
     const predictedNext = usePredictNextExercise(currentWorkout);
   };
   ```

**Validation**: Performance tests pass, exercise addition under 3 seconds

### Step 3.3: Gesture-Based Set Logging
**Reference**: [Personal Use Optimizations](./product-requirements/8-personal-use-optimizations.md#gesture-based-controls) + [Task 5.2](./product-requirements/10-implementation-task-breakdown.md#task-52-gesture-based-controls)

**Objective**: One-handed operation with gesture controls

**Implementation Steps**:
1. **Write Gesture Tests First**
   ```typescript
   // __tests__/components/gesture-controls.test.ts
   describe('Gesture Controls', () => {
     it('should complete set with tap and hold', async () => {
       const setItem = getByTestId('current-set');
       fireEvent(setItem, 'onLongPress');
       expect(mockOnComplete).toHaveBeenCalled();
     });
   });
   ```

2. **Implement Gesture System**
   ```typescript
   // Tap and hold → Complete set
   // Double tap → Start rest timer
   // Swipe left → Undo
   // Swipe right → Next set
   ```

**Validation**: Gesture tests pass, one-handed operation works smoothly

## Phase 4: AI Integration (Week 5-6)

### Step 4.1: AI Service Setup
**Reference**: [AI Workout Generation](./product-requirements/5-ai-workout-generation.md#ai-model-integration) + [Task 6.1](./product-requirements/10-implementation-task-breakdown.md#task-61-ai-service-integration)

**Objective**: Secure OpenAI integration with workout generation

**Implementation Steps**:
1. **Write AI Service Tests First**
   ```typescript
   // __tests__/services/ai-service.test.ts
   describe('AIService', () => {
     it('should generate workout from user prompt', async () => {
       const workout = await AIService.generateWorkout("45 min upper body");
       expect(workout.estimatedDuration).toBeLessThanOrEqual(45);
     });
   });
   ```

2. **Implement AI Service**
   ```typescript
   /**
    * @service AIService
    * @agentic_contract Handles OpenAI integration for workout generation
    * Safe for AI to modify: prompts, response handling, validation
    */
   export class AIService {
     static async generateWorkout(prompt: string): Promise<Workout> {
       // OpenAI integration with proper error handling
       // Response validation and sanitization
     }
   }
   ```

**Validation**: AI service tests pass, workout generation works correctly

### Step 4.2: Conversational Interface
**Reference**: [AI Workout Generation](./product-requirements/5-ai-workout-generation.md#conversational-interface) + [Task 6.2](./product-requirements/10-implementation-task-breakdown.md#task-62-conversational-ai-interface)

**Objective**: Chat-based AI interaction for workout planning

**Implementation Steps**:
1. **Write Chat Tests First**
   ```typescript
   // __tests__/components/ai-chat.test.ts
   describe('AIChat Component', () => {
     it('should display conversation history', () => {
       const conversation = [
         { type: 'user', content: 'I want an upper body workout' }
       ];
       expect(getByTestId('message-0')).toHaveTextContent('upper body');
     });
   });
   ```

2. **Implement Chat Interface**
   ```typescript
   // Chat component with message history
   // Voice input support
   // Typing indicators
   // Conversation persistence
   ```

**Validation**: Chat tests pass, conversation flows naturally

## Phase 5: Performance & Polish (Week 7-8)

### Step 5.1: Performance Optimization
**Reference**: [Technical Architecture](./product-requirements/2-technical-architecture.md#performance-requirements) + [Task 8.1](./product-requirements/10-implementation-task-breakdown.md#task-81-performance-optimization)

**Objective**: Meet all performance requirements (<3s startup, <100ms queries)

**Implementation Steps**:
1. **Write Performance Tests First**
   ```typescript
   // __tests__/performance/app-performance.test.ts
   describe('App Performance', () => {
     it('should start in under 3 seconds', async () => {
       const startTime = Date.now();
       await render(<App />);
       const loadTime = Date.now() - startTime;
       expect(loadTime).toBeLessThan(3000);
     });
   });
   ```

2. **Implement Optimizations**
   - Lazy loading for screens
   - Virtualized lists for large datasets
   - Database query optimization
   - Image optimization and caching

**Validation**: Performance tests pass, meets all benchmarks

### Step 5.2: Accessibility & Polish
**Reference**: [UI/UX Design Requirements](./product-requirements/3-ui-ux-design-requirements.md#accessibility-first) + [Task 8.3](./product-requirements/10-implementation-task-breakdown.md#task-83-accessibility--internationalization)

**Objective**: WCAG 2.1 AA compliance with VoiceOver support

**Implementation Steps**:
1. **Write Accessibility Tests**
   ```typescript
   // __tests__/accessibility/a11y.test.ts
   describe('Accessibility', () => {
     it('should support VoiceOver screen reader', () => {
       expect(getByTestId('start-workout-button'))
         .toHaveAccessibilityLabel('Start new workout');
     });
   });
   ```

2. **Implement Accessibility Features**
   - Comprehensive accessibility labels
   - Dynamic type support
   - High contrast mode
   - Keyboard navigation

**Validation**: Accessibility tests pass, VoiceOver works correctly

## Phase 6: Testing & Quality Assurance (Week 8)

### Step 6.1: Comprehensive Test Coverage
**Reference**: [Implementation Task Breakdown](./product-requirements/10-implementation-task-breakdown.md#testing-strategy-summary) + [Task 9.1](./product-requirements/10-implementation-task-breakdown.md#task-91-comprehensive-test-suite)

**Objective**: Achieve >90% code coverage with all test types

**Implementation Steps**:
1. **Run Coverage Analysis**
   ```bash
   npm run test:coverage
   # Must achieve >90% coverage
   ```

2. **Complete Test Suite**
   - Unit tests for all services and hooks
   - Integration tests for user workflows
   - E2E tests for critical paths
   - Performance regression tests
   - Visual regression tests

**Validation**: >90% code coverage, all tests pass consistently

### Step 6.2: Device Testing
**Reference**: [Technical Architecture](./product-requirements/2-technical-architecture.md#platform-requirements) + [Task 9.2](./product-requirements/10-implementation-task-breakdown.md#task-92-device-testing--optimization)

**Objective**: Ensure app works across all target iOS devices

**Implementation Steps**:
1. **Test Device Compatibility**
   - iPhone SE (smallest screen) - iOS 13+
   - iPhone 14 Pro Max (largest screen)
   - Various iOS versions
   - Memory usage validation

2. **Optimize for Constraints**
   - Adjust UI for screen sizes
   - Optimize memory usage
   - Test performance on minimum specs

**Validation**: App works smoothly on all target devices

## Phase 7: Deployment Preparation (Week 8-9)

### Step 7.1: App Store Assets
**Reference**: [Implementation Roadmap](./product-requirements/7-implementation-roadmap.md#week-13-app-store-preparation) + [Task 10.1](./product-requirements/10-implementation-task-breakdown.md#task-101-app-store-preparation)

**Objective**: Complete App Store submission package

**Implementation Steps**:
1. **Create App Store Assets**
   ```bash
   # Generate screenshots for all device sizes
   # Create app icon in all required sizes
   # Write app description and keywords
   ```

2. **Configure App Store Metadata**
   - Privacy policy and terms of service
   - App categories and keywords
   - Pricing and availability settings

**Validation**: All App Store guidelines met, assets ready

### Step 7.2: Production Build & Submit
**Reference**: [Setup Requirements](./SETUP-REQUIREMENTS.md#eas-configuration)

**Implementation Steps**:
1. **Build for Production**
   ```bash
   # Create production build
   eas build --platform ios --profile production
   
   # Submit to App Store
   eas submit --platform ios
   ```

2. **Monitor Submission**
   - Track review status
   - Respond to any reviewer feedback
   - Plan launch strategy

**Validation**: App successfully submitted and approved

## Continuous Implementation Guidelines

### For Each Feature Implementation

1. **Pre-Implementation Checklist**
   - [ ] Read relevant product requirement sections
   - [ ] Understand the specific task breakdown
   - [ ] Review agentic coding guidelines
   - [ ] Check dependencies and prerequisites

2. **TDD Implementation Process**
   ```
   1. Write failing tests first (following examples in task breakdown)
   2. Implement minimal code to pass tests
   3. Refactor while keeping tests passing
   4. Add integration tests for user workflows
   5. Document AI-friendly code with proper annotations
   ```

3. **Quality Gates (Run Before Moving to Next Task)**
   ```bash
   npm run type-check    # TypeScript validation
   npm run lint          # Code quality
   npm run test          # All tests pass
   npm run test:coverage # Coverage requirements
   ```

4. **AI Development Best Practices**
   - Follow standardized patterns from [Agentic Coding Specifications](./product-requirements/9-agentic-coding-specifications.md)
   - Include comprehensive JSDoc comments
   - Use proper TypeScript types throughout
   - Implement error handling and loading states
   - Write self-documenting, modular code

### Validation Checkpoints

**Weekly Validation**:
- All tests for the week's features pass
- Performance benchmarks are met
- Code follows agentic patterns
- Features work as specified in requirements

**Phase Completion Validation**:
- All phase objectives completed
- Integration between features works correctly
- User experience meets design requirements
- Code is ready for next phase dependencies

### Emergency Procedures

**If Tests Fail**:
1. Do not proceed to next task
2. Debug and fix failing tests
3. Ensure no regression in existing features
4. Re-run full test suite before continuing

**If Performance Degrades**:
1. Run performance profiling
2. Identify bottlenecks using task breakdown guidelines
3. Optimize according to technical architecture requirements
4. Validate improvements with performance tests

**If Requirements Unclear**:
1. Reference the specific product requirement document
2. Check related sections for context
3. Follow the principle of minimal viable implementation
4. Document assumptions for future refinement

This guide ensures systematic, test-driven development of the fitness app with full traceability to product requirements and validation at every step.