import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    environment: "node",
    // Exercise the opt-in pilot catalogue in unit tests; production defaults to measurement first.
    env: { NEXT_PUBLIC_GYG_CURATED_ENABLED: "true" },
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
