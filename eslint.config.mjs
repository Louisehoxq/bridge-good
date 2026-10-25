import js from "@eslint/js"
import { defineConfig, globalIgnores } from "eslint/config"
import jsxA11y from "eslint-plugin-jsx-a11y"
import reactHooks from "eslint-plugin-react-hooks"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig([
  globalIgnores(["build/**", ".react-router/**", "node_modules/**", ".claude/**"]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat["recommended-latest"],
  jsxA11y.flatConfigs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      // `role` is also a prop on our own components (RoleShell, TrainingTrack).
      "jsx-a11y/aria-role": ["error", { ignoreNonDOM: true }],
      // Wide tables scroll inside a focusable region so keyboard users can scroll them.
      "jsx-a11y/no-noninteractive-tabindex": ["error", { roles: ["region"] }],
    },
  },
  {
    // The Label primitive forwards htmlFor from its callers.
    files: ["src/components/ui/label.tsx"],
    rules: { "jsx-a11y/label-has-associated-control": "off" },
  },
])
