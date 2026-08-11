import { describe, expect, it } from "vitest"
import { createEmptyWorkspace } from "./defaults"
import { resolveFaqAnswer } from "./templates"

describe("FAQ response library", () => {
  it("returns Add your venue policy when nothing is configured", () => {
    const workspace = createEmptyWorkspace("cs_test")
    const result = resolveFaqAnswer(workspace, "price_objection")
    expect(result.configured).toBe(false)
    expect(result.answer).toBe("Add your venue policy")
  })

  it("uses operator FAQ override when present", () => {
    const workspace = createEmptyWorkspace("cs_test")
    workspace.faqResponses.price_objection =
      "We can adjust inclusions to fit a tighter budget."
    const result = resolveFaqAnswer(workspace, "price_objection")
    expect(result.configured).toBe(true)
    expect(result.answer).toMatch(/adjust inclusions/i)
  })

  it("uses venue invoice policy when FAQ override is empty", () => {
    const workspace = createEmptyWorkspace("cs_test")
    workspace.venue.invoicePolicy = "We can invoice on company details."
    const result = resolveFaqAnswer(workspace, "invoice")
    expect(result.configured).toBe(true)
    expect(result.answer).toMatch(/invoice/i)
  })
})
