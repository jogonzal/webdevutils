import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const settings = [
  ...compat.extends(
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      prettier,
    },

    languageOptions: {
      parser: tsParser,
    },

    rules: {
      // Prettier rules
      "prettier/prettier": "error",

      // TypeScript rules
      "@typescript-eslint/no-empty-interface": "off", // Allow empty interfaces
      "@typescript-eslint/ban-types": "off", // Allow banned types for flexibility
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_*" },
      ], // Ignore unused vars prefixed with _
      "@typescript-eslint/no-explicit-any": "off", // Allow `any` for legacy code
      "@typescript-eslint/no-empty-function": "off", // Allow empty functions
      "@typescript-eslint/no-empty-object-type": "off", // Allow empty object types
      "@typescript-eslint/consistent-type-imports": "error", // Enforce consistent type imports
    },
  },
];

export default settings;
