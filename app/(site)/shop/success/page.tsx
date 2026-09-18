import Link from "next/link"
import { getStripe } from "@/lib/stripe"
export const dynamic = "force-dynamic"
export const metadata = { title: "Shop order | RageRoom Directory", robots: { index: false, follow: false } }
export default async function ShopSuccess({ searchParams }: { searchParams: { session_id?: string } }) {
 let paid = false
 let test = false
 try {
  if (searchParams.session_id && /^cs_(test_|live_)?[a-zA-Z0-9]+$/.test(searchParams.session_id)) {
   const session = await getStripe().checkout.sessions.retrieve(searchParams.session_id)
   test = !session.livemode
   paid = session.metadata?.orderType === "physical" && session.payment_status === "paid"
  }
 } catch { /* Never disclose customer information or claim a payment without verification. */ }
 return <div className="mx-auto max-w-2xl px-4 py-20"><h1 className="text-4xl font-bold text-white">{paid ? "Thank you for your order." : "We couldn’t confirm payment yet."}</h1><p className="mt-5 leading-7 text-zinc-300">{paid ? (test ? "Test payment confirmed. No physical products will be dispatched." : "Your payment is confirmed. We will review your order for production. Delivery is estimated at 7–12 working days.") : "If you completed payment, please check your Stripe receipt or contact us before trying again."}</p><p className="mt-4 text-zinc-400">Order help: <a className="underline" href="mailto:ukrageroom@gmail.com">ukrageroom@gmail.com</a></p><Link href="/shop" className="mt-8 inline-block text-orange-400 underline">Back to the shop</Link></div>
}
