# Data Models & Database Schema Requirements

## Overview
Comprehensive data architecture for local-first fitness tracking with optional cloud synchronization, designed for performance, scalability, and data integrity.

## Database Technology
- **Primary**: SQLite (via Expo SQLite)
- **Local Storage**: AsyncStorage for app preferences
- **Future**: PostgreSQL for cloud sync
- **Backup**: JSON export/import capability

## Core Data Models

### 1. User Profile
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    preferences TEXT, -- JSON blob
    settings TEXT,    -- JSON blob
    sync_status TEXT DEFAULT 'local' -- local, synced, pending
);
```

**JSON Preferences Structure**:
```json
{
  "units": "imperial", // imperial, metric
  "defaultRestTime": 90, // seconds
  "theme": "system", // light, dark, system
  "notifications": true,
  "soundEnabled": true,
  "equipment": ["dumbbells", "barbell", "bench"],
  "experience_level": "intermediate"
}
```

### 2. Exercises
```sql
CREATE TABLE exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL, -- strength, cardio, flexibility
    muscle_groups TEXT NOT NULL, -- JSON array
    equipment TEXT, -- JSON array
    instructions TEXT,
    difficulty_level TEXT, -- beginner, intermediate, advanced
    is_custom BOOLEAN DEFAULT FALSE,
    user_id INTEGER,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**Sample Exercise Data**:
```json
{
  "name": "Barbell Bench Press",
  "category": "strength",
  "muscle_groups": ["chest", "shoulders", "triceps"],
  "equipment": ["barbell", "bench"],
  "instructions": "Lie flat on bench, grip barbell with hands wider than shoulders...",
  "difficulty_level": "intermediate"
}
```

### 3. Workout Templates
```sql
CREATE TABLE workout_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    estimated_duration INTEGER, -- minutes
    user_id INTEGER NOT NULL,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    ai_prompt TEXT, -- Original AI prompt if generated
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 4. Template Exercises (Junction Table)
```sql
CREATE TABLE template_exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    target_sets INTEGER,
    target_reps TEXT, -- Can be range like "8-12"
    target_weight REAL,
    rest_time INTEGER, -- seconds
    notes TEXT,
    FOREIGN KEY (template_id) REFERENCES workout_templates(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);
```

### 5. Workouts (Completed Sessions)
```sql
CREATE TABLE workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    template_id INTEGER, -- NULL if freestyle workout
    user_id INTEGER NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    duration INTEGER, -- seconds
    notes TEXT,
    rating INTEGER, -- 1-5 stars
    total_volume REAL, -- calculated: sum(weight * reps)
    status TEXT DEFAULT 'completed', -- in_progress, completed, abandoned
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES workout_templates(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 6. Workout Sets (Individual Set Performance)
```sql
CREATE TABLE workout_sets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    set_number INTEGER NOT NULL,
    set_type TEXT DEFAULT 'working', -- working, warmup, dropset, failure
    weight REAL,
    reps INTEGER,
    duration INTEGER, -- for timed exercises (seconds)
    distance REAL, -- for cardio exercises
    rpe INTEGER, -- Rate of Perceived Exertion (1-10)
    notes TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);
```

### 7. Personal Records
```sql
CREATE TABLE personal_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    record_type TEXT NOT NULL, -- max_weight, max_reps, max_volume, best_time
    value REAL NOT NULL,
    reps INTEGER, -- for max_weight records
    workout_id INTEGER, -- reference to workout where PR was set
    date_achieved DATETIME NOT NULL,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id),
    FOREIGN KEY (workout_id) REFERENCES workouts(id)
);
```

### 8. AI Conversations
```sql
CREATE TABLE ai_conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    conversation_id TEXT NOT NULL, -- UUID for grouping messages
    message_type TEXT NOT NULL, -- user, assistant, system
    content TEXT NOT NULL,
    generated_workout_id INTEGER, -- if conversation resulted in workout
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT, -- JSON for additional data
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (generated_workout_id) REFERENCES workout_templates(id)
);
```

## Indexes for Performance

### Primary Performance Indexes
```sql
-- Workout queries by user and date
CREATE INDEX idx_workouts_user_date ON workouts(user_id, start_time DESC);

-- Sets by workout for workout details
CREATE INDEX idx_workout_sets_workout_id ON workout_sets(workout_id, set_number);

-- Exercise lookups by name and category
CREATE INDEX idx_exercises_name ON exercises(name);
CREATE INDEX idx_exercises_category ON exercises(category);

-- Personal records by user and exercise
CREATE INDEX idx_personal_records_user_exercise ON personal_records(user_id, exercise_id, record_type);

-- Template exercises for template loading
CREATE INDEX idx_template_exercises_template_id ON template_exercises(template_id, order_index);

-- AI conversation history
CREATE INDEX idx_ai_conversations_user_conversation ON ai_conversations(user_id, conversation_id, timestamp);
```

## Data Relationships

### Entity Relationship Diagram
```
Users (1) ←→ (N) Workouts
Users (1) ←→ (N) Workout_Templates
Users (1) ←→ (N) Personal_Records
Users (1) ←→ (N) AI_Conversations

Exercises (1) ←→ (N) Template_Exercises
Exercises (1) ←→ (N) Workout_Sets
Exercises (1) ←→ (N) Personal_Records

Workout_Templates (1) ←→ (N) Template_Exercises
Workout_Templates (1) ←→ (N) Workouts

Workouts (1) ←→ (N) Workout_Sets
```

## Data Validation Rules

### Exercise Validation
- Name must be unique per user (including global exercises)
- Muscle groups must be from predefined list
- Equipment must be from predefined list
- Difficulty level must be: beginner, intermediate, advanced

### Workout Validation
- End time must be after start time
- Duration should match calculated time difference
- Total volume should be calculated from sets
- Rating must be 1-5 if provided

### Set Validation
- Weight must be positive or zero
- Reps must be positive integer
- RPE must be 1-10 if provided
- Duration must be positive for timed exercises

## Computed Fields & Triggers

### Workout Volume Calculation
```sql
-- Trigger to update workout total_volume when sets change
CREATE TRIGGER update_workout_volume
AFTER INSERT ON workout_sets
BEGIN
    UPDATE workouts 
    SET total_volume = (
        SELECT SUM(COALESCE(weight, 0) * COALESCE(reps, 0))
        FROM workout_sets 
        WHERE workout_id = NEW.workout_id
    )
    WHERE id = NEW.workout_id;
END;
```

### Personal Records Auto-Update
```sql
-- Trigger to check for new personal records
CREATE TRIGGER check_personal_records
AFTER INSERT ON workout_sets
WHEN NEW.is_completed = TRUE
BEGIN
    -- Check for max weight PR
    INSERT OR REPLACE INTO personal_records (
        user_id, exercise_id, record_type, value, reps, 
        workout_id, date_achieved
    )
    SELECT 
        w.user_id, NEW.exercise_id, 'max_weight', 
        NEW.weight, NEW.reps, NEW.workout_id, w.start_time
    FROM workouts w
    WHERE w.id = NEW.workout_id
      AND NEW.weight > COALESCE((
          SELECT MAX(value) 
          FROM personal_records 
          WHERE user_id = w.user_id 
            AND exercise_id = NEW.exercise_id 
            AND record_type = 'max_weight'
      ), 0);
END;
```

## Data Migration Strategy

### Version Control
```sql
CREATE TABLE schema_versions (
    version INTEGER PRIMARY KEY,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- Insert initial version
INSERT INTO schema_versions (version, description) 
VALUES (1, 'Initial schema creation');
```

### Migration Scripts
- Incremental migration scripts for schema updates
- Data transformation scripts for major changes
- Rollback procedures for failed migrations
- Data integrity checks post-migration

## Data Export/Import

### Export Format (JSON)
```json
{
  "version": "1.0",
  "export_date": "2024-09-04T10:30:00Z",
  "user_data": {
    "profile": { /* user data */ },
    "exercises": [ /* exercise array */ ],
    "templates": [ /* template array */ ],
    "workouts": [ /* workout array */ ],
    "personal_records": [ /* PR array */ ]
  }
}
```

### Import Validation
- Schema version compatibility check
- Data integrity validation
- Duplicate detection and handling
- Selective import options (workouts only, templates only, etc.)

## Performance Considerations

### Query Optimization
- Use prepared statements for frequent queries
- Implement pagination for large result sets
- Cache frequently accessed data
- Optimize joins with proper indexing

### Storage Optimization
- Compress large text fields (notes, instructions)
- Archive old workout data
- Clean up incomplete workouts periodically
- Optimize image storage for progress photos

## Privacy & Security

### Data Protection
- No personal identifiable information in logs
- Local encryption for sensitive data
- Secure deletion of user data
- GDPR compliance for data export/deletion

### Sync Security (Future)
- End-to-end encryption for cloud sync
- Token-based authentication
- Data anonymization options
- Selective sync preferences