module.exports = {
  root: true,
  env: {
    es6: true
  },

  parserOptions: {
    sourceType: "module"
  },

  extends: [
    "@mitod/eslint-config/globals",
    "@mitod/eslint-config/base",
    "@mitod/eslint-config/ts"
  ]
};
