module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'linebreak-style': 0,
    'no-continue': 0,
    'no-console': 0,
    'prefer-destructuring': ['error', { object: true, array: false }],
    'no-underscore-dangle': 0,
    'no-restricted-syntax': 0,
    'guard-for-in': 0,
    'consistent-return': 0,
    'max-len': 0,
    'no-shadow': 0,
  },
};
