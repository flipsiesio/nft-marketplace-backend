module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-typescript/base'],
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'import/prefer-default-export': 0,
    'max-classes-per-file': 0,
    'class-methods-use-this': 0,
    'import/no-cycle': 0,
    'import/extensions': 2,
    'import/no-extraneous-dependencies': 2,
    'key-spacing': 2,
    'space-before-blocks': 2,
    'camelcase': 2,
    'no-param-reassign': 1,
    '@typescript-eslint/type-annotation-spacing': 2,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/no-useless-constructor': 1,
    '@typescript-eslint/no-empty-function': 1,
    '@typescript-eslint/lines-between-class-members': 0,
  },
  env: {
    node: true,
    jest: true,
  },
};