import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";
import reactNative from "ultracite/oxlint/react-native";

export default defineConfig({
  env: core.env,
  extends: [core, react, reactNative],
  ignorePatterns: core.ignorePatterns,
  rules: {
    // Its fix rewrites `.sort()` to `.toSorted()`, which Hermes (React Native's JS engine) doesn't have.
    "unicorn/no-array-sort": "off",
  },
});
