import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";


export default defineConfig([
  // 🟢 JavaScript rules
  {
    files: ["**/*.{js,mjs,cjs}"],
    ...js.configs.recommended,
    languageOptions: {
      globals: globals.browser,
    },
  },

  // 🟣 TypeScript rules
  ...tseslint.configs.recommended,

  // 🟢 Vue rules
  ...pluginVue.configs["flat/essential"],

  // 🧩 Common custom rules
  {
    files: ["**/*.{js,ts,vue}"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      // Show helpful warnings, but not errors for dev logs
      "no-console": "off",
      "no-debugger": "off",

      // Common lint hints
      "no-unused-vars": "warn",
      "vue/no-unused-vars": "warn",
    },
  },
]);

// export default defineConfig([
//   {
//     ignores: [
//       "node_modules",
//       "dist",
//       ".output",
//       "public",
//       "coverage",
//       "*.config.*",
//     ],
//   },
//   {
//     files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
//     plugins: { js },
//     extends: ["js/recommended"],
//     languageOptions: { globals: globals.browser },
//   },
//   tseslint.configs.recommended,
//   pluginVue.configs["flat/essential"],
//   {
//     files: ["**/*.vue"],
//     languageOptions: { parserOptions: { parser: tseslint.parser } },
//   },
//   // ✅ strict Vercel-style rules
//   {
//     rules: {
//       "no-console": "off",
//       "no-debugger": "off",
//       // "no-warning-comments": "error",

//       // Upgrade any warning-level rules to error
//       "no-unused-vars": "warn",
//       "vue/no-unused-vars": "warn",
//       "no-unused-imports": "off",
//     },
//   },
// ]);

// export default defineConfig([
//   { files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
//   tseslint.configs.recommended,
//   pluginVue.configs["flat/essential"],
//   { files: ["**/*.vue"], languageOptions: { parserOptions: { parser: tseslint.parser } } },
// ]);
