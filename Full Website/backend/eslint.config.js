const globals = require("globals");

module.exports = [
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      },
      ecmaVersion: 2021,
      sourceType: "module"
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": "error",
      "curly": "error"
    },
    ignores: ["node_modules/", "*.log"]
  }
];