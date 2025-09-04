import * as fs from 'fs';
import * as path from 'path';

describe('Project Structure', () => {
  const projectRoot = path.resolve(__dirname, '../..');

  it('should have proper TypeScript configuration', () => {
    const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
    expect(fs.existsSync(tsconfigPath)).toBe(true);
    
    const config = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    expect(config.compilerOptions.strict).toBe(true);
    expect(config.compilerOptions.noImplicitAny).toBe(true);
    expect(config.compilerOptions.noImplicitReturns).toBe(true);
  });

  it('should have proper folder structure', () => {
    const requiredDirectories = [
      'src/modules',
      'src/shared',
      'src/config',
      'src/database',
      'src/navigation',
      'src/modules/exercise-tracking',
      'src/modules/workout-logging',
      'src/modules/ai-generation',
      'src/modules/progress-tracking',
      'src/shared/components',
      'src/shared/hooks',
      'src/shared/services',
      'src/shared/types',
      'src/shared/utils',
    ];

    requiredDirectories.forEach(dir => {
      const dirPath = path.join(projectRoot, dir);
      expect(fs.existsSync(dirPath)).toBe(true);
    });
  });

  it('should have test directory structure', () => {
    const requiredTestDirectories = [
      '__tests__/setup',
      '__tests__/navigation',
      '__tests__/design-system',
      '__tests__/database',
      '__tests__/services',
      '__tests__/components',
      '__tests__/hooks',
      '__tests__/modules',
    ];

    requiredTestDirectories.forEach(dir => {
      const dirPath = path.join(projectRoot, dir);
      expect(fs.existsSync(dirPath)).toBe(true);
    });
  });

  it('should have proper package.json configuration', () => {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    expect(fs.existsSync(packageJsonPath)).toBe(true);
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    expect(packageJson.name).toBe('fitness-tracker-app');
    expect(packageJson.scripts.test).toBeDefined();
    expect(packageJson.scripts['test:coverage']).toBeDefined();
    expect(packageJson.scripts['type-check']).toBeDefined();
    expect(packageJson.scripts.lint).toBeDefined();
  });

  it('should have Jest configuration with coverage requirements', () => {
    const jestConfigPath = path.join(projectRoot, 'jest.config.js');
    expect(fs.existsSync(jestConfigPath)).toBe(true);
    
    // Test that jest config can be loaded
    const jestConfig = require(jestConfigPath);
    expect(jestConfig.coverageThreshold.global.branches).toBe(90);
    expect(jestConfig.coverageThreshold.global.functions).toBe(90);
    expect(jestConfig.coverageThreshold.global.lines).toBe(90);
    expect(jestConfig.coverageThreshold.global.statements).toBe(90);
  });
});