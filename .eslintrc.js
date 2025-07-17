module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',      // your tsconfig file
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^(?:_|next)$' }
    ],
  },
  ignorePatterns: ['dist/', 'node_modules/', 'coverage/'],
};
