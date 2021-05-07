module.exports = {
  ignorePatterns: ['!src/**/*', 'schema-types.ts'],
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  extends: [
    'react-app',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier.
  ],
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  rules: {
    'prefer-const': 0,
    'no-var': 0,
    'block-scoped-var': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-inferrable-types': 0,
    '@typescript-eslint/no-explicit-any': [
      'error',
      { ignoreRestArgs: true, fixToUnknown: true },
    ],
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    'react-hooks/exhaustive-deps': 'off',
    'no-unexpected-multiline': 'off',
    'no-restricted-globals': 'off',
    'no-redeclare': 'off',
  },
}
