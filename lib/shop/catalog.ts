export const SHIPPING_PER_ORDER = 499
export const gbp = (pence: number) => `£${(pence / 100).toFixed(2)}`
export const shopProducts = [
  { id: "smash-crew", name: "Smash Club", kind: "T-shirt", collection: "Break things. Feel better.", price: 1999, image: "/shop/mockup/smash-club-v4.png", artwork: "/shop/artwork/smash-club-v4.png", description: "A vintage club badge for anyone who knows the satisfaction of a clean hit. A wearable rage-room design with no venue branding.", details: "Gildan Softstyle 64000, front print. Everyday clothing, not protective equipment.", variants: ["Black / S", "Black / M", "Black / L", "Black / XL", "Black / 2XL"] },
  { id: "meeting", name: "I Came. I Saw. I Smashed.", kind: "T-shirt", collection: "The unofficial souvenir", price: 1999, image: "/shop/mockup/i-came-i-smashed-v4.png", artwork: "/shop/artwork/i-came-i-smashed-v4.png", description: "The tee that says exactly how the session went. Bold cobalt impact artwork makes it work as a souvenir from any rage room.", details: "Gildan Softstyle 64000, front print. Everyday clothing, not protective equipment.", variants: ["Black / S", "Black / M", "Black / L", "Black / XL", "Black / 2XL"] },
  { id: "reset", name: "Caffeine & Consequences", kind: "Heat-reveal mug", collection: "Handle with care", price: 1799, image: "/shop/mockup/caffeine-consequences-v4.png", artwork: "/shop/artwork/caffeine-consequences-v4.png", description: "Coffee after controlled destruction. A retro cracked-mug design that works at home, at work or after your next smash session.", details: "11oz heat-sensitive ceramic mug.", variants: ["Black / 11oz"] },
  { id: "unsaid", name: "Things I’m Not Saying Out Loud", kind: "Notebook", collection: "A private collection", price: 1499, image: "/shop/mockup/private-collection-v4.png", artwork: "/shop/artwork/private-collection-v4.png", description: "A private place for the thoughts that are better on paper. Premium editorial cover art with a cracked speech bubble and a knowing sense of humour.", details: "132 × 186mm hardback, 128 lined pages.", variants: ["Lined / 132 × 186mm"] },
  { id: "buffering", name: "Ctrl + Alt + Destroy", kind: "Mouse mat", collection: "System reset", price: 1199, image: "/shop/mockup/ctrl-alt-destroy-v4.png", artwork: "/shop/artwork/ctrl-alt-destroy-v4.png", description: "For the moment the usual reset is not enough. A sharp tech-inspired desk design for office workers, gamers and serial tab-openers.", details: "24 × 20.3cm neoprene mouse mat, non-slip base.", variants: ["24 × 20.3cm"] },
] as const
export type ShopProduct = typeof shopProducts[number]
export const DELIVERY_MESSAGE = "£4.99 UK delivery per order. Estimated delivery: 7–12 working days. Items may arrive in separate parcels."
export type BasketItem = { productId: string; variant: string; quantity: number }
export function parseBasket(value: unknown) {
  if (!Array.isArray(value) || !value.length || value.length > 20) throw new Error("Add between 1 and 20 product options to your basket.")
  const items: { product: ShopProduct; variant: string; quantity: number }[] = []
  for (const raw of value) {
    if (!raw || typeof raw !== "object") throw new Error("Choose a valid product and variant.")
    const product = shopProducts.find(p => p.id === raw.productId)
    if (!product || typeof raw.variant !== "string" || !(product.variants as readonly string[]).includes(raw.variant)) throw new Error("Choose a valid product and variant.")
    if (!Number.isInteger(raw.quantity) || raw.quantity < 1 || raw.quantity > 10) throw new Error("Choose between 1 and 10 of each product option.")
    const existing = items.find(i => i.product.id === product.id && i.variant === raw.variant)
    if (existing) {
      existing.quantity += raw.quantity
      if (existing.quantity > 10) throw new Error("Choose between 1 and 10 of each product option.")
    } else items.push({ product, variant: raw.variant, quantity: raw.quantity })
  }
  return items
}
export function parseShopOrder(value: unknown) {
  if (!value || typeof value !== "object") throw new Error("Add items to your basket.")
  const body = value as Record<string, unknown>
  const items = parseBasket(body.items)
  if (typeof body.requestId !== "string" || !/^[a-f0-9-]{36}$/i.test(body.requestId)) throw new Error("Refresh the page and try again.")
  return { items, requestId: body.requestId }
}
