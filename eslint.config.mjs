import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import importX from 'eslint-plugin-import-x'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      'import-x': importX,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
      'import-x/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'import-x/no-unused-modules': [
        'error',
        {
          unusedExports: true,
          missingExports: false,
          src: ['.'],
        },
      ],
    },
  },
  {
    files: ['src/features/**/*', 'src/components/**/*', 'src/shared/components/**/*'],
    rules: {
      'max-lines': [
        'error',
        {
          max: 300,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
  {
    files: ['**/SplashCursor.tsx', '**/*.config.*', '**/shaders/**/*'],
    rules: {
      'max-lines': 'off',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Additional ignores:
    '**/*.d.ts',
    '**/*.js',
    '**/*.mjs',
    'node_modules/**',
    'public/ketcher/**',
    'tests/**',
    'playwright/**',
    'playwright-report/**',
    // Storybook files use render patterns that trigger false hook violations
    '**/*.stories.tsx',
  ]),
])

export default eslintConfig
