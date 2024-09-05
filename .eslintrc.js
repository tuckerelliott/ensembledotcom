module.exports = {
  root: true,
  extends: ['airbnb-base', 'plugin:prettier/recommended', 'prettier'],
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    // allow reassigning param
    'perfer-template': 'off',
    'func-names': 'off',
    'perfer-const': 'off',
    'no-plusplus': 'off',
    'no-console': 'off',
    'no-param-reassign': [2, { props: false }],
    'linebreak-style': ['error', 'unix'],
    'import/extensions': [
      'error',
      {
        js: 'always',
      },
    ],
  },
};
