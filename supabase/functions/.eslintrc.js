import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node, // For Deno compatibility
        Deno: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    rules: {
      // Disable expensive rules for performance
      'no-unused-vars': 'off',
      'no-console': 'off',
      // Add other basic rules as needed, but keep minimal
    },
    ignores: ['node_modules/**'],
  },
];
