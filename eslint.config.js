import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import globals from "globals";

export default [
  { ignores: ["dist/", ".astro/", ".vercel/", "node_modules/", "Documentacion/", ".opencode/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    // Las reglas de negocio deben ser puras: sin UI, red ni base de datos.
    files: ["src/lib/reglas/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: ["@supabase/*", "astro*", "*.astro", "../supabase/*"] },
      ],
      "no-restricted-globals": ["error", "fetch", "document", "window", "localStorage"],
    },
  },
];
