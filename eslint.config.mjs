import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: ["dist/**", "coverage/**", "node_modules/**", "jest.config.js", "**/esbuild.config.js"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettier,
  {
    files: ["**/*.{ts,tsx,js,mjs,cjs}"],
    rules: {
      "prettier/prettier": "warn",
    },
  },
);
