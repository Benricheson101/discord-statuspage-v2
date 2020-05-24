module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: [
    'standard-with-typescript',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    project: './tsconfig.json'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/indent': [ 'error', 2 ],
    '@typescript-eslint/strict-boolean-expressions': 0,
    '@typescript-eslint/no-floating-promises': 0,
    '@typescript-eslint/no-misused-promises': 0,
    'no-misused-promises': 0,
    'no-async-promise-executor': 0,
    'no-unused-vars': ['error', { 'args': 'none' }]
  }
}
