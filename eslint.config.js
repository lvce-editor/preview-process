import * as config from '@lvce-editor/eslint-config'

export default [
  ...config.default,
  ...config.recommendedNode,
  {
    ignores: [
      'scripts',
      '**/mockCdpImport.js',
      'rollup.config.js',
      'eslint.config.js',
      'packages/preview-process/src/previewProcessMain.ts',
      'packages/preview-process/src/parts/WaitForServerToBeReady/WaitForServerToBeReady.ts',
      'packages/preview-process/files/previewInjectedCode.js',
      'packages/build',
    ],
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@cspell/spellchecker': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
      'n/no-unsupported-features/es-syntax': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/only-throw-error': 'off',
      'jest/no-restricted-jest-methods': 'off',
      'n/no-missing-import': 'off',
      'sonarjs/different-types-comparison': 'off',
      'sonarjs/hashing': 'off',
      'sonarjs/prefer-specific-assertions': 'off',
      'sonarjs/unused-import': 'off',
      'unicorn/consistent-class-member-order': 'off',
      'unicorn/no-this-outside-of-class': 'off',
      'unicorn/no-useless-coercion': 'off',
      'unicorn/no-useless-template-literals': 'off',
      'unicorn/prefer-number-coercion': 'off',
      'unicorn/prefer-private-class-fields': 'off',
      'unicorn/prefer-queue-microtask': 'off',
    },
  },
]
