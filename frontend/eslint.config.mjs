import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow any type usage
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      // Allow let and const declarations
      "prefer-const": "warn",
      "no-var": "error",
      // Disable strict mode for implicit any
      "@typescript-eslint/no-implicit-any": "off",
      // Allow empty functions
      "@typescript-eslint/no-empty-function": "off",
      // Allow require statements
      "@typescript-eslint/no-var-requires": "off",
      // Allow non-null assertions
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
];

export default eslintConfig;
