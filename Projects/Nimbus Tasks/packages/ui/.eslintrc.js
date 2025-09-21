/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@nimbus/config/eslint"],
  parserOptions: {
    project: true,
  },
};