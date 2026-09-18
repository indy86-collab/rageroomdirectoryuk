import { loadEnvConfig } from "@next/env"
loadEnvConfig(process.cwd())
const present = (key: string) => Boolean(process.env[key]?.trim())
const key = process.env.STRIPE_SECRET_KEY || ""
const checks: [string, boolean][] = [
 ["Stripe key configured", key.startsWith("sk_test_") || key.startsWith("sk_live_")],
 ["Live Stripe key configured", key.startsWith("sk_live_")],
 ["Webhook secret configured (endpoint delivery must be tested separately)", present("STRIPE_WEBHOOK_SECRET")],
 ...["SHOP_SELLER_NAME", "SHOP_SELLER_ADDRESS", "SHOP_RETURNS_ADDRESS", "SHOP_SUPPLIER_NAME"].map(keyName => [keyName, present(keyName)] as [string, boolean]),
 ["Canonical site uses HTTPS", Boolean((process.env.NEXT_PUBLIC_SITE_URL || "https://www.rageroomdirectory.co.uk").startsWith("https://"))],
]
for (const [label, ready] of checks) console.log(`${ready ? "PASS" : "MISSING"} ${label}`)
console.log("Shop checkout follows the Stripe key. Seller fields are optional public copy; defaults are used when blank.")
process.exitCode = (key.startsWith("sk_test_") || key.startsWith("sk_live_")) ? 0 : 1
