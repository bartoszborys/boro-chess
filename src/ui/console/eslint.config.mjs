import { defineConfig } from "eslint/config";
import root from "../../../eslint.config.mjs";

export default defineConfig([
  {
    basePath: "../../..",
    extends: [root],
  },
  {
    ignores: ["dist/**", "coverage/**", "node_modules/**"],
  },
]);
