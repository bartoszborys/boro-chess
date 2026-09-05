import { defineConfig } from "eslint/config";
import root from "../../../eslint.config.mjs";

export default defineConfig([
  {
    basePath: "../../..",
    extends: [root],
  },
  {
    ignores: ["build/**", "dist/**", "coverage/**", ".react-router/**", ".vite/**", "node_modules/**"],
  },
]);
