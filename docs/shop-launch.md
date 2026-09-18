# Physical shop

Implemented `/shop`, hosted Stripe Checkout, `/shop/success`, delivery/returns, and signed webhook handling. Digital checkout is unchanged. One product/variant per checkout, quantities 1–10; UK addresses only. Stripe holds customer/order records. No automatic supplier submission, dispatch email or operator notification is implemented.

## Provisional prices

| Item | Retail | Delivery per item |
|---|---:|---:|
| Smash Crew / Less Talk. More Smash. shirts | £19.99 | £4.99 |
| Smash Session Recovery Fuel heat-reveal mug | £17.99 | £4.99 |
| The Smash List notebook | £14.99 | £4.99 |
| Keep Calm? Book a Rage Room. mouse mat | £11.99 | £4.99 |

Prices in `lib/shop/catalog.ts` are authoritative. Shipping scales per item, including multiple quantities. These are proposals, not verified profitable supplier quotes. Validate all-in production, shipping, taxes, payment fees and a returns allowance before selling; use the pricing review in shop-pricing-research.md for the revised contribution expectations. The 7–12 working day estimate also needs supplier verification. No tax calculation has been added; confirm inclusive pricing and applicable tax configuration with your accountant before activation.

## Test

Set SHOP_CHECKOUT_ENABLED=true with an sk_test_ key and the matching STRIPE_WEBHOOK_SECRET. Forward Stripe test events to `/api/webhooks/stripe`. Subscribe to checkout.session.completed and checkout.session.async_payment_succeeded; existing digital events remain configured. Complete hosted Checkout with a test card and UK shipping address, verify metadata and totals in Stripe, replay the event, and verify no digital download email was sent. Also cancel and decline payment. No supplier orders should be placed for test payments.

## Before live activation

1. Choose supplier/SKUs, order samples, confirm sizing, quality, care instructions and delivery coverage/time. Prepare supplier-ready files from the AI artwork in public/shop/artwork; see shop-artwork-handoff.md for file preparation. The product mockups and earlier SVGs are illustrative previews, not production print files. Check design rights.
2. Update product specifications and photos, remove pending-sample copy only after approval, confirm tax-inclusive retail economics and postage.
3. Publish the seller's legal identity/contact address, return address/instructions, final delivery terms, and name the chosen fulfilment provider in privacy disclosures. Configure Stripe public business details, privacy/terms URLs, receipts and payment notifications. The current generic policy is a starting point.
4. Test the entire flow with actual Stripe test credentials as above. Confirm webhook endpoint API version matches installed Stripe API `2026-06-24.dahlia` (shipping data uses collected_information.shipping_details).
5. In production configure the existing live Stripe key, matching live webhook secret and canonical NEXT_PUBLIC_SITE_URL; set SHOP_CHECKOUT_ENABLED=true and SHOP_FULFILMENT_CONFIRMED=true. Default preview takes no payments. No credentials or external account settings were changed by this implementation.

## Manual fulfilment

Monitor successful **live** payments in Stripe. Only fulfil physical orders with `orderType=physical` and `paymentVerified=true`. Inspect the associated Checkout session (metadata `checkoutSession`) for delivery address, customer email, product, variant and quantity. The PaymentIntent has the same product metadata; `fulfilmentStatus=awaiting_fulfilment` alone does not prove a payment succeeded.

Before submission confirm it is not already submitted, refunded or disputed. Place the supplier order once, using the Stripe payment ID as your reference. Record supplier reference and set fulfilmentStatus=submitted in Stripe metadata; after dispatch set dispatched and tracking reference, and send the customer an update manually. Webhook retries only add verification/session metadata and never reset operator status. One designated operator should own this queue to prevent duplicate manual submission. Handle returns/refunds through Stripe and the supplier separately. Keep customer addresses out of public logs and analytics.

## References

- Stripe Checkout session fields: https://docs.stripe.com/api/checkout/sessions/object
- Stripe fulfilment: https://docs.stripe.com/checkout/fulfillment
- UK online returns: https://www.gov.uk/accepting-returns-and-giving-refunds

## Smash collection launch update

The launch catalogue contains five branded rage-room products: two shirts, a recovery-fuel mug, The Smash List notebook and Keep Calm? Book a Rage Room. mouse mat. Earlier v2 concepts are archived in the repository and are not in the catalogue. Current v3 source artwork and concept mockups are in public/shop/artwork and public/shop/mockup. Keep these private source handoff documents out of supplier orders until preflight.

Configure SHOP_SELLER_NAME, SHOP_SELLER_ADDRESS, SHOP_RETURNS_ADDRESS and SHOP_SUPPLIER_NAME before enabling live checkout. Seller and return details appear on /shop/delivery-returns. Run `npm run shop:check` for a configuration-only readiness report; it prints no credentials. Live checkout requires the seller fields as well as the existing fulfilment confirmation. The report does not verify the webhook or supplier workflow.

Local audit found a live Stripe key but no webhook secret, seller/return/supplier details, fulfilment confirmation or HTTPS production URL. Checkout remains disabled until these are provided. Use separate test credentials/environment for the end-to-end test to avoid disrupting live digital checkout.

Configuration checker environment loading follows official Next.js documentation: https://nextjs.org/docs/pages/guides/environment-variables#loading-environment-variables-with-nextenv (installed Next.js/@next/env 14.2.33).
