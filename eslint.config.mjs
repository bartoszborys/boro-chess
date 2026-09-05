import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import { createConfig, recommended as boundariesRecommended } from "eslint-plugin-boundaries/config";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

const moduleBoundaries = createConfig({
  files: ["src/**/*.{ts,tsx}"],
  settings: {
    ...boundariesRecommended.settings,
    "boundaries/elements": [
      { type: "core", pattern: "src/core", partialMatch: false },
      { type: "chess", pattern: "src/chess", partialMatch: false },
      { type: "ui", pattern: "src/ui", partialMatch: false },
    ],
  },
  rules: {
    ...boundariesRecommended.rules,
    "boundaries/dependencies": [
      "error",
      {
        default: "allow",
        message: "{{from.element.types}} cannot import {{to.element.types}}",
        policies: [
          {
            from: { element: { type: "core" } },
            disallow: { to: { element: { types: { anyOf: ["chess", "ui"] } } } },
          },
          {
            from: { element: { type: "chess" } },
            disallow: { to: { element: { type: "ui" } } },
          },
        ],
      },
    ],
  },
});

export default defineConfig(
  {
    ignores: ["dist/**", "coverage/**", "node_modules/**", "jest.config.js", "**/esbuild.config.js"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettier,
  {
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
  moduleBoundaries,
  {
    files: ["**/*.{ts,tsx,js,mjs,cjs}"],
    rules: {
      "prettier/prettier": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
);
