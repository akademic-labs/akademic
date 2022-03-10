const nxPreset = require('@nrwl/jest/preset');

module.exports = {
  ...nxPreset,
  collectCoverage: true,
  coverageReporters: ['json', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  collectCoverageFrom: [
    '**/*.(route|state|validator|component|service|store|guard|interceptor|interface|pipe|directive|helper|resolver).(js|ts)',
    '!**/*.(wip|mock|config).(js|ts|tsx)',
    '**/*.tsx',
    '!**/_app.tsx',
  ],
  transform: {
    '^.+\\.(ts|js|html)$': 'jest-preset-angular',
  },
};
