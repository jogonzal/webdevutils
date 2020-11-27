module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  settings: {
    polyfills: [
      "Promise",
      "Headers",
      "Request",
      "fetch",
      "URL",
      "URLSearchParams",
    ],
  },
  extends: ["prettier", "prettier/@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "compat",
    "import",
    "jsdoc",
    // "jsx-a11y", // No a11y LINT
    "react",
    "react-hooks",
    "simple-import-sort"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:compat/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    // "plugin:jsx-a11y/recommended", // No a11y LINT
    "plugin:react/recommended"
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", { "varsIgnorePattern": "_*", "argsIgnorePattern": "_*" } ], // Parameters that start with "_" are ok to be unused
    "@typescript-eslint/no-empty-function": "off", // I legitimately use empty functions
    "@typescript-eslint/no-empty-interface": "off", // I legitimately use empty interfaces
    "@typescript-eslint/no-inferrable-types": "off", // Ok to have redundant types
    "@typescript-eslint/explicit-module-boundary-types": "off", // Ok to have "any's" and similar things in public functions (no different from local functions)
    // Import ordering plugin
    "sort-imports": "off",
    "import/order": "off",
    "simple-import-sort/imports": "error",
    // Don't allow catch with any
    "@typescript-eslint/no-implicit-any-catch": "error",
    // Styling
    "no-trailing-spaces": "error",
    "comma-dangle": [ "error", "only-multiline" ],
    "eol-last": "error",
    "spaced-comment": [
      "error",
      "always",
      {
        "markers": [
          "/"
        ]
      }
    ],
    "prefer-const": "error",
    "radix": "error",
    "no-with": "error",
    "no-undef-init": "error",
    "no-underscore-dangle": "error",
    "no-unsafe-finally": "error",
    "no-unused-expressions": "error",
    "no-unused-labels": "error",
    "no-sparse-arrays": "error",
    "no-template-curly-in-string": "error",
    "no-throw-literal": "error",
    "no-redeclare": "off", // We allow types and instances with same name
    "no-extra-bind": "error",
    "no-duplicate-case": "error",
    "no-console": "error",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/no-this-alias": "error",
    "@typescript-eslint/no-parameter-properties": "error",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "custom": {
          "regex": "^I[A-Z]",
          "match": true
        }
      }
    ],
    "eqeqeq": [ "error", "always"],
    "@typescript-eslint/strict-boolean-expressions": [ "error", { "allowNullableObject": true, "allowNullableBoolean": true, "allowAny": true } ],
    "space-infix-ops": ["error"], // spacing between operators
    "keyword-spacing": ["error"], // spacing after keywords
  }
};
