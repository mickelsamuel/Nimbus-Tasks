/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@nimbus/config/eslint"],
  ignorePatterns: ["apps/**", "packages/**"],
  parserOptions: {
    project: true,
  },
};