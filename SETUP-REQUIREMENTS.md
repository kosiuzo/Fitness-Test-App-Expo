# Fitness App - Complete Setup Requirements

## Overview
Complete setup guide for developing the fitness tracking app with React Native/Expo, including all tools, dependencies, and configuration needed for successful implementation.

## System Requirements

### Operating System
- **macOS**: 12.0+ (Monterey or later) - Required for iOS development
- **Xcode**: 14.0+ - Required for iOS builds and simulator
- **iOS Simulator**: iOS 13.0+ target devices

### Development Environment
- **Node.js**: 18.0+ (LTS recommended)
- **npm**: 9.0+ or **yarn**: 1.22+
- **Git**: 2.30+
- **VS Code**: Latest (recommended IDE)

## CLI Tools Installation

### 1. Expo CLI & EAS CLI
```bash
# Install Expo CLI globally
npm install -g @expo/cli

# Install EAS CLI for builds and deployments
npm install -g eas-cli

# Verify installations
expo --version
eas --version
```

### 2. React Native CLI (Backup)
```bash
# Install React Native CLI (for potential ejection)
npm install -g @react-native-community/cli

# Verify installation
npx react-native --version
```

### 3. iOS Development Tools
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install CocoaPods (for iOS dependencies)
sudo gem install cocoapods

# Verify installation
pod --version
```

### 4. Development Utilities
```bash
# Install Watchman (file watching)
brew install watchman

# Install jq (JSON processing for scripts)
brew install jq

# Install tree (directory visualization)
brew install tree
```

## Project Initialization

### 1. Create Expo Project with TypeScript Template
```bash
# Navigate to your development directory
cd ~/Documents/AI-Built-Applications

# Create new Expo project with TypeScript template
npx create-expo-app expo-fitness-test-app --template expo-template-blank-typescript

# Navigate to project directory
cd expo-fitness-test-app

# Verify project structure
tree -L 2
```

### 2. Initialize Git Repository
```bash
# Initialize git repository
git init

# Add remote repository (replace with your GitHub repo)
git remote add origin https://github.com/kosiuzo/Fitness-Test-App-Expo.git

# Create initial commit
git add .
git commit -m "Initial commit: Expo TypeScript template"
git branch -M main
git push -u origin main
```

## Core Dependencies Installation

### 1. Navigation Dependencies
```bash
# Install React Navigation
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack

# Install required peer dependencies for Expo
npx expo install react-native-screens react-native-safe-area-context
```

### 2. State Management & Data Fetching
```bash
# Install state management and data fetching
npm install @tanstack/react-query zustand

# Install React Query DevTools (development)
npm install --save-dev @tanstack/react-query-devtools
```

### 3. Database & Storage
```bash
# Install SQLite and AsyncStorage
npx expo install expo-sqlite @react-native-async-storage/async-storage

# Install database utility libraries
npm install @databases/sqlite @databases/sqlite-config
```

### 4. Form Management & Validation
```bash
# Install form handling and validation
npm install react-hook-form @hookform/resolvers zod

# Install date/time utilities
npm install date-fns
```

### 5. UI Components & Styling
```bash
# Install UI component libraries
npm install react-native-paper react-native-vector-icons

# Install additional UI utilities
npx expo install expo-linear-gradient expo-blur
```

### 6. Device Features
```bash
# Install device feature access
npx expo install expo-haptics expo-notifications expo-av

# Install speech and voice features
npx expo install expo-speech expo-speech-recognition
```

### 7. AI Integration Dependencies
```bash
# Install OpenAI SDK
npm install openai

# Install HTTP client for API calls
npm install axios

# Install environment variable management
npm install --save-dev @types/node
```

## Development Dependencies

### 1. TypeScript & Linting
```bash
# Install TypeScript development dependencies
npm install --save-dev typescript @types/react @types/react-native

# Install ESLint and Prettier
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier

# Install Expo-specific ESLint config
npm install --save-dev @expo/eslint-config
```

### 2. Testing Framework
```bash
# Install Jest and React Native Testing Library
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native

# Install additional testing utilities
npm install --save-dev jest-expo @types/jest

# Install E2E testing with Detox
npm install --save-dev detox @config-plugins/detox
```

### 3. Git Hooks & Code Quality
```bash
# Install Husky for git hooks
npm install --save-dev husky lint-staged

# Install commit message linting
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

### 4. Build & Deployment Tools
```bash
# Install build optimization tools
npm install --save-dev @expo/webpack-config

# Install bundle analyzer
npm install --save-dev @expo/metro-config
```

## Configuration Files Setup

### 1. Create TypeScript Configuration
```bash
# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/services/*": ["src/services/*"],
      "@/types/*": ["src/types/*"],
      "@/utils/*": ["src/utils/*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
EOF
```

### 2. Create ESLint Configuration
```bash
# Create .eslintrc.js
cat > .eslintrc.js << 'EOF'
module.exports = {
  extends: [
    'expo',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'error'
  },
  ignorePatterns: [
    'node_modules/',
    '.expo/',
    'dist/',
    'web-build/'
  ]
};
EOF
```

### 3. Create Prettier Configuration
```bash
# Create .prettierrc
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
EOF
```

### 4. Create Jest Configuration
```bash
# Create jest.config.js
cat > jest.config.js << 'EOF'
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/src/test-setup.ts'
  ],
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test-setup.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
EOF
```

### 5. Update Package.json Scripts
```bash
# Add these scripts to package.json
cat > scripts-to-add.json << 'EOF'
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build:ios": "eas build --platform ios",
    "build:android": "eas build --platform android",
    "submit:ios": "eas submit --platform ios",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "prepare": "husky install"
  }
}
EOF
```

### 6. Setup Husky Git Hooks
```bash
# Initialize Husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "lint-staged"

# Add commit-msg hook
npx husky add .husky/commit-msg "npx commitlint --edit"

# Create lint-staged config
cat > .lintstagedrc.js << 'EOF'
module.exports = {
  '*.{ts,tsx,js,jsx}': [
    'eslint --fix',
    'prettier --write',
    'git add'
  ],
  '*.{json,md}': [
    'prettier --write',
    'git add'
  ]
};
EOF
```

## Project Structure Setup

### 1. Create Agentic-Friendly Folder Structure
```bash
# Create the modular folder structure
mkdir -p src/{modules,shared,config,database,navigation}
mkdir -p src/modules/{exercise-tracking,workout-logging,ai-generation,progress-tracking}
mkdir -p src/shared/{components,hooks,services,types,utils}

# Create module subdirectories
for module in exercise-tracking workout-logging ai-generation progress-tracking; do
  mkdir -p "src/modules/$module"/{components,hooks,services,types,tests}
done

# Create test directories
mkdir -p __tests__/{setup,components,services,integration}

# Create assets directories
mkdir -p assets/{images,fonts,sounds}
```

### 2. Create Initial Module Configuration Files
```bash
# Create module config template
cat > src/modules/module-template.ts << 'EOF'
/**
 * @module ModuleTemplate
 * @description Template for all app modules
 * @agentic_safe This file provides the structure for AI development
 */

export interface ModuleConfig {
  name: string;
  version: string;
  description: string;
  ai_guidelines: {
    safe_to_modify: string[];
    requires_review: string[];
    dependencies: string[];
    testing_required: boolean;
  };
  exports: {
    components: string[];
    hooks: string[];
    services: string[];
    types: string[];
  };
}
EOF
```

## Environment Configuration

### 1. Create Environment Variables
```bash
# Create .env file
cat > .env << 'EOF'
# AI Service Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4
AI_MAX_TOKENS=1500

# App Configuration
APP_NAME=FitnessTracker
APP_VERSION=1.0.0
ENVIRONMENT=development

# Database Configuration
DB_NAME=fitness_tracker.db
DB_VERSION=1

# Feature Flags
ENABLE_AI_GENERATION=true
ENABLE_VOICE_COMMANDS=false
ENABLE_APPLE_WATCH=false
EOF

# Create .env.example for reference
cp .env .env.example
sed -i '' 's/your_openai_api_key_here/sk-xxx...your-key-here/g' .env.example

# Add .env to .gitignore
echo ".env" >> .gitignore
```

### 2. Create EAS Configuration
```bash
# Create eas.json for builds
cat > eas.json << 'EOF'
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m1-medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m1-medium"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m1-medium"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
EOF
```

## VS Code Configuration

### 1. Create VS Code Workspace Settings
```bash
# Create .vscode directory
mkdir -p .vscode

# Create settings.json
cat > .vscode/settings.json << 'EOF'
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "emmet.includeLanguages": {
    "typescript": "typescriptreact"
  },
  "files.associations": {
    "*.tsx": "typescriptreact"
  },
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.patterns": {
    "*.ts": "${capture}.test.ts, ${capture}.spec.ts",
    "*.tsx": "${capture}.test.tsx, ${capture}.spec.tsx"
  }
}
EOF

# Create recommended extensions
cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "expo.vscode-expo-tools",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.test-adapter-converter",
    "orta.vscode-jest"
  ]
}
EOF
```

## Installation Verification Script

### 1. Create Setup Verification Script
```bash
# Create setup verification script
cat > verify-setup.js << 'EOF'
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Verifying Fitness App Setup...\n');

const checks = [
  {
    name: 'Node.js version',
    command: 'node --version',
    validator: (output) => {
      const version = parseInt(output.match(/v(\d+)/)[1]);
      return version >= 18;
    }
  },
  {
    name: 'Expo CLI',
    command: 'expo --version',
    validator: (output) => output.includes('.')
  },
  {
    name: 'EAS CLI',
    command: 'eas --version',
    validator: (output) => output.includes('.')
  },
  {
    name: 'TypeScript',
    command: 'npx tsc --version',
    validator: (output) => output.includes('Version')
  },
  {
    name: 'Xcode Command Line Tools',
    command: 'xcode-select -p',
    validator: (output) => output.includes('CommandLineTools') || output.includes('Xcode.app')
  },
  {
    name: 'Project Structure',
    command: 'ls -la src/modules',
    validator: (output) => output.includes('exercise-tracking')
  }
];

let allPassed = true;

checks.forEach(check => {
  try {
    const output = execSync(check.command, { encoding: 'utf8', stdio: 'pipe' });
    if (check.validator(output)) {
      console.log(`✅ ${check.name}: OK`);
    } else {
      console.log(`❌ ${check.name}: Failed validation`);
      allPassed = false;
    }
  } catch (error) {
    console.log(`❌ ${check.name}: Not found or error`);
    allPassed = false;
  }
});

console.log('\n' + (allPassed ? '🎉 All checks passed! Ready for development.' : '⚠️  Some checks failed. Please review setup requirements.'));
EOF

# Make script executable
chmod +x verify-setup.js
```

## Quick Setup Script

### 1. Create One-Command Setup Script
```bash
# Create complete setup script
cat > setup.sh << 'EOF'
#!/bin/bash

echo "🚀 Setting up Fitness App Development Environment..."

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
  echo "❌ This setup requires macOS for iOS development"
  exit 1
fi

# Install Homebrew if not installed
if ! command -v brew &> /dev/null; then
  echo "📦 Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install required tools
echo "🛠️  Installing development tools..."
brew install node watchman jq tree

# Install global CLI tools
echo "📱 Installing Expo and React Native tools..."
npm install -g @expo/cli eas-cli @react-native-community/cli

# Install CocoaPods
echo "🍫 Installing CocoaPods..."
sudo gem install cocoapods

# Create project if it doesn't exist
if [ ! -f "package.json" ]; then
  echo "📱 Creating Expo project..."
  npx create-expo-app . --template expo-template-blank-typescript
fi

# Install all dependencies
echo "📦 Installing project dependencies..."
npm install

# Run setup verification
echo "🔍 Verifying setup..."
node verify-setup.js

echo "✨ Setup complete! Run 'npm start' to begin development."
EOF

# Make script executable
chmod +x setup.sh
```

## Final Checklist

### Prerequisites Checklist
- [ ] macOS 12.0+ installed
- [ ] Xcode 14.0+ installed from App Store
- [ ] Apple Developer Account (for device testing and App Store)
- [ ] GitHub account and repository created

### Installation Checklist
- [ ] Run `./setup.sh` for automated setup
- [ ] Run `node verify-setup.js` to verify installation
- [ ] Create `.env` file with your OpenAI API key
- [ ] Test with `npm start` and scan QR code with Expo Go app

### Development Readiness Checklist
- [ ] VS Code with recommended extensions installed
- [ ] Expo Go app installed on iPhone/Android device
- [ ] iOS Simulator working in Xcode
- [ ] Git repository connected and first commit made
- [ ] All tests pass with `npm test`

## Troubleshooting

### Common Issues

1. **"expo command not found"**
   ```bash
   npm install -g @expo/cli
   # Restart terminal
   ```

2. **"CocoaPods not working"**
   ```bash
   sudo gem uninstall cocoapods
   sudo gem install cocoapods
   cd ios && pod install
   ```

3. **"Metro bundler issues"**
   ```bash
   npx expo start --clear
   # Or reset with:
   rm -rf node_modules
   npm install
   ```

4. **"TypeScript errors"**
   ```bash
   npm run type-check
   # Fix all TypeScript errors before proceeding
   ```

This complete setup guide ensures you have everything needed to build the fitness app with optimal development experience and agentic coding compatibility.