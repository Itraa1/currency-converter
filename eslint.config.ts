import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js, eslintPluginPrettier },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    rules: { ...eslintConfigPrettier.rules },
  },
  tseslint.configs.recommended,
  {
    ignores: ["node_modules/", "dist/"],
  },
]);
