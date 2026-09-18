export const SHIPPING_PER_ITEM = 499
export const gbp = (pence: number) => `£${(pence / 100).toFixed(2)}`
export const shopProducts = [
  { id: "smash-crew", name: "Smash Crew", kind: "T-shirt", collection: "The crew kit", price: 1999, image: "/shop/mockup/smash-crew-v3.png", artwork: "/shop/artwork/smash-crew-v3.png", description: "Broken plates. Big crew energy. A bold rage-room club badge with crossed bats, goggles and our signature orange impact graphics.", details: "Gildan Softstyle 64000, front print. Everyday clothing, not protective equipment.", variants: ["Black / S", "Black / M", "Black / L", "Black / XL", "Black / 2XL"] },
  { id: "meeting", name: "Less Talk. More Smash.", kind: "T-shirt", collection: "Team day, upgraded", price: 1999, image: "/shop/mockup/meeting-v3.png", artwork: "/shop/artwork/meeting-v3.png", description: "Take the team out of the meeting room and into the rage room. A smashed monitor graphic for the outing you’ll actually talk about afterwards.", details: "Gildan Softstyle 64000, front print. Everyday clothing, not protective equipment.", variants: ["Black / S", "Black / M", "Black / L", "Black / XL", "Black / 2XL"] },
  { id: "reset", name: "Smash Session Recovery Fuel", kind: "Heat-reveal mug", collection: "After the smash", price: 1799, image: "/shop/mockup/reset-v3.png", artwork: "/shop/artwork/reset-v3.png", description: "You brought the energy. Now put the kettle on. Broken-plate graphics and bold orange lettering for your post-session coffee.", details: "11oz heat-sensitive ceramic mug.", variants: ["Black / 11oz"] },
  { id: "unsaid", name: "The Smash List", kind: "Notebook", collection: "Plan the smash", price: 1499, image: "/shop/mockup/unsaid-v3.png", artwork: "/shop/artwork/unsaid-v3.png", description: "Your next outing starts here. A broken-plate checklist design for crew plans, venue shortlists and everything you want to write off.", details: "132 × 186mm hardback, 128 lined pages.", variants: ["Lined / 132 × 186mm"] },
  { id: "buffering", name: "Keep Calm? Book a Rage Room.", kind: "Mouse mat", collection: "Next session energy", price: 1199, image: "/shop/mockup/buffering-v3.png", artwork: "/shop/artwork/buffering-v3.png", description: "A reminder to get the crew together when the workday needs a change of scene. Bold plate-shard graphics, straight from the smash collection.", details: "24 × 20.3cm neoprene mouse mat, non-slip base.", variants: ["24 × 20.3cm"] },
] as const
export type ShopProduct = typeof shopProducts[number]
export function parseShopOrder(value: unknown) {
  if (!value || typeof value !== "object") throw new Error("Choose a product and variant.")
  const body = value as Record<string, unknown>
  const product = shopProducts.find(p => p.id === body.productId)
  if (!product || typeof body.variant !== "string" || !(product.variants as readonly string[]).includes(body.variant)) throw new Error("Choose a valid product and variant.")
  if (!Number.isInteger(body.quantity) || Number(body.quantity) < 1 || Number(body.quantity) > 10) throw new Error("Choose between 1 and 10 items.")
  if (typeof body.requestId !== "string" || !/^[a-f0-9-]{36}$/i.test(body.requestId)) throw new Error("Refresh the page and try again.")
  return { product, variant: body.variant, quantity: Number(body.quantity), requestId: body.requestId }
}
