import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "components/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      // server-only throws outside Next server bundles; stub for unit tests.
      "server-only": path.resolve(__dirname, "lib/test-stubs/server-only.ts"),
    },
  },
})
