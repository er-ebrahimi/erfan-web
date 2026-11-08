import nextPlugin from '@next/eslint-plugin-next';
import tsParser from '@typescript-eslint/parser';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import path from 'path';

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'e2e/**',
      'builds/**',
      'test-results/**',
      // Temporary design-review lab: static HTML mocks plus a vendored copy of
      // the Tailwind Play CDN. Delete this entry together with the folder.
      'public/fa/hero-lab/**',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        tsconfigRootDir: path.resolve(process.cwd()),
        project: ['./tsconfig.json'],
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules,
      'no-console': ['error', { allow: ['error', 'warn'] }],
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      '@next/next': nextPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules,
      'no-console': ['error', { allow: ['error', 'warn'] }],
    },
  },
];
