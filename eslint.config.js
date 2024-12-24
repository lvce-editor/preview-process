import eslint from '@eslint/js'
import pluginJest from 'eslint-plugin-jest'
import nodePlugin from 'eslint-plugin-n'
import perfectionist from 'eslint-plugin-perfectionist'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          order: 'asc',
          newlinesBetween: 'never',
        },
      ],
    },
  },
  nodePlugin.configs['flat/recommended'],
  pluginJest.configs['flat/recommended'],
  {
    ignores: [
      '.tmp',
      'dist',
      '**/coverage/**',
      'scripts',
      'rollup.config.js',
      'eslint.config.js',
      'packages/preview-process/src/previewProcessMain.ts',
      'packages/preview-process/src/parts/WaitForServerToBeReady/WaitForServerToBeReady.ts',
      'packages/preview-process/files/previewInjectedCode.js',
      'packages/build',
    ],
  },
  {
    rules: {
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      'n/no-unpublished-import': [
        'error',
        {
          allowModules: ['@jest/globals'],
        },
      ],
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-deprecated': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      'jest/no-disabled-tests': 'off',
      'n/no-unsupported-features/es-syntax': 'off',
    },
  },
)
