// no-underscore-dangle: 0 means there is a linter exception for variables like _id

// I'm using Airbnb's JavaScript style Guide in this project for linter configuration.

// Ignore console.error but warn for console.log  "no-console": ["warn", { allow: ["error"] }]

// The middleware for centralized error handling has a next parameter that never gets used.
// It triggers the no-unused-vars rule to produce an error by ESLint.
// The argsIgnorePattern option specifies exceptions. In our example, it ignores the next variable.

module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-underscore-dangle": 0,
    "no-console": ["warn", { allow: ["error"] }],
    "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
  },
};
