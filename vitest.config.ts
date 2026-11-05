import { configDefaults, defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
  test: {
    // Agent worktrees under .claude/ hold stale copies of the suite.
    exclude: [...configDefaults.exclude, ".claude/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["lib/**", "data/**"],
      exclude: ["**/*.test.ts"],
    },
  },
});
