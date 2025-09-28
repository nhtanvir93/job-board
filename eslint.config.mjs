import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sortKeysFix from "eslint-plugin-sort-keys-fix";
import react from "eslint-plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),

  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    plugins: {
      "simple-import-sort": simpleImportSort,
      "sort-keys-fix": sortKeysFix,
      react: react,
    },
    rules: {
      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",

      // React / Next.js
      "react/jsx-uses-vars": "warn",
      "react/jsx-key": "error",

      // JSX Formatting Rules - SIMPLIFIED AND CORRECT
      "react/jsx-indent": ["error", 2],
      "react/jsx-indent-props": ["error", 2],
      "react/jsx-tag-spacing": [
        "error",
        {
          closingSlash: "never",
          beforeSelfClosing: "always",
          afterOpening: "never",
          beforeClosing: "never",
        },
      ],

      // General Whitespace Rules
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
      "no-trailing-spaces": "error",
      "eol-last": "error",
      "padded-blocks": ["error", "never"],

      // Best practices
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      eqeqeq: ["error", "always"],
      curly: ["error", "multi-line"],
      semi: ["error", "always"],
      quotes: ["error", "double", { avoidEscape: true }],
      "comma-dangle": ["error", "always-multiline"],

      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      "sort-keys-fix/sort-keys-fix": "error",
    },
  },
];

export default eslintConfig;
