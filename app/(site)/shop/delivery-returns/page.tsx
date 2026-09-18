import { shopSeller } from "@/lib/shop/seller"
export const dynamic = "force-dynamic"
import Link from "next/link"
export const metadata = { title: "Shop delivery & returns | RageRoom Directory", alternates: { canonical: "/shop/delivery-returns" } }
export default function DeliveryReturns() {
 const seller = shopSeller()
 return <div className="mx-auto max-w-3xl px-4 py-14 text-zinc-300"><Link href="/shop" className="text-orange-400 underline">Back to shop</Link><h1 className="mt-6 text-4xl font-bold text-white">Delivery & returns</h1><div className="mt-8 space-y-7 leading-7">
 <section><h2 className="text-xl font-bold text-white">Made to order, delivered in the UK</h2><p>Delivery is £4.99 per item and is included in the total shown before checkout. Delivery is estimated at 7–12 working days after payment, including production. This is an estimate, not a guaranteed arrival date. Items may arrive separately.</p></section>
 <section><h2 className="text-xl font-bold text-white">Changing your mind</h2><p>For our standard designs, tell us within 14 days of receiving your item if you want to cancel. You then have another 14 days to return it. We refund the item and standard outbound delivery within 14 days of receiving the return or evidence that you sent it back. You pay return postage for change-of-mind returns. You may inspect items as you would in a shop; excessive handling may reduce your refund.</p></section>
 <section><h2 className="text-xl font-bold text-white">Damaged, faulty or incorrect items</h2><p>Email us with your order details and a description of the issue. Photos can help us resolve it. We will arrange the appropriate return, replacement or refund, including necessary return postage. Your statutory rights are unaffected.</p></section>
 {seller.name && <section><h2 className="text-xl font-bold text-white">Your seller</h2><p>{seller.name}</p><p className="whitespace-pre-line">{seller.address}</p>{seller.returnsAddress && <><h3 className="mt-3 font-semibold text-white">Returns address</h3><p className="whitespace-pre-line">{seller.returnsAddress}</p></>}{seller.supplier && <p className="mt-3">Made and dispatched by our print partner, {seller.supplier}. Order support and refunds are handled by us.</p>}</section>}
 <section><h2 className="text-xl font-bold text-white">Get help or cancel</h2><p>Email <a href="mailto:ukrageroom@gmail.com" className="text-orange-400 underline">ukrageroom@gmail.com</a> with your order date and checkout email. Contact us for return instructions before posting anything; do not send returns to a venue. Merchandise purchases are separate from venue bookings.</p></section>
 </div></div>
}
