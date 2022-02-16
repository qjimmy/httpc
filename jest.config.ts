import type { Config } from '@jest/types';

const unitTestThreshold = 80;

const config: Config.InitialOptions = {
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageThreshold: {
    global: {
      functions: unitTestThreshold,
      statements: unitTestThreshold,
      lines: unitTestThreshold,
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
  },
  preset: 'ts-jest',
  rootDir: '.',
  testPathIgnorePatterns: ['dist/'],
  testRegex: '/__tests__/.*|(\\.|/)spec.ts$',
  verbose: true,
};

export default config;
