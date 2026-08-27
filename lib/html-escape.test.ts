import { escapeHtml } from "./html-escape"
import { describe, expect, it } from "vitest"

describe("escapeHtml", () => {
  it("escapes markup and quotes used in badge snippets", () => {
    expect(escapeHtml(`<img src="x" alt='y'>`)).toBe(
      "&lt;img src=&quot;x&quot; alt=&#39;y&#39;&gt;"
    )
    expect(escapeHtml("Rage & Smash")).toBe("Rage &amp; Smash")
  })
})
