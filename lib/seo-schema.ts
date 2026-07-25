// Shared JSON-LD schema builders. Keeping these in one place lets us fix E-E-A-T
// signals (author, dateModified, @id) across the site consistently, and makes
// Google / LLM answer engines more likely to parse our content into rich
// results and citations.

import { absoluteUrl, getSiteUrl, listingUrl } from "@/lib/site-url"

const BASE_URL = getSiteUrl()

/**
 * Build a dynamic Open Graph image URL via `/api/og`.
 *
 * Returning a relative URL would be fine for OG meta tags on our own domain,
 * but most scrapers (Slack, LinkedIn, Bing, various LLM fetchers) require
 * absolute URLs for reliable resolution.
 */
export function buildOgImageUrl(opts: {
  title: string
  subtitle?: string
  badge?: string
  price?: string
}): string {
  const qs = new URLSearchParams()
  qs.set("title", opts.title)
  if (opts.subtitle) qs.set("subtitle", opts.subtitle)
  if (opts.badge) qs.set("badge", opts.badge)
  if (opts.price) qs.set("price", opts.price)
  return absoluteUrl(`/api/og?${qs.toString()}`)
}

/** Named editorial byline used across Article schemas for stronger E-E-A-T. */
export const EDITORIAL_AUTHOR = {
  "@type": "Person" as const,
  name: "The RageRoom Directory Editorial Team",
  url: `${BASE_URL}/editorial-policy`,
}

/** Canonical publisher block used in Article / BlogPosting schemas. */
export const EDITORIAL_PUBLISHER = {
  "@type": "Organization" as const,
  name: "RageRoom Directory",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
}

interface ArticleInput {
  /** Absolute or root-relative URL for the article (used for @id + mainEntityOfPage). */
  url: string
  headline: string
  description: string
  /** ISO date the article was first published. */
  datePublished: string
  /** ISO date the article was last meaningfully edited. Defaults to now. */
  dateModified?: string
  /** Hero / featured image absolute URL; falls back to site OG image. */
  image?: string
  /** Optional keywords array for topical relevance. */
  keywords?: string[]
}

export function buildArticleSchema(input: ArticleInput) {
  const url = absoluteUrl(input.url)
  const image = input.image
    ? input.image.startsWith("http")
      ? input.image
      : absoluteUrl(input.image)
    : absoluteUrl("/og-image.png")

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: input.headline,
    description: input.description,
    image,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? new Date().toISOString().slice(0, 10),
    author: EDITORIAL_AUTHOR,
    publisher: EDITORIAL_PUBLISHER,
    inLanguage: "en-GB",
    isAccessibleForFree: true,
    ...(input.keywords && input.keywords.length > 0
      ? { keywords: input.keywords.join(", ") }
      : {}),
  }
}

interface ItemListListing {
  id: string
  slug?: string | null
  name: string
  city?: string | null
  description?: string | null
  price?: number | null
}

/** ItemList schema for editorial "Best rage rooms in X" ranking pages. */
export function buildItemListSchema(opts: {
  name: string
  description: string
  url: string
  listings: ItemListListing[]
  limit?: number
}) {
  const url = absoluteUrl(opts.url)
  const limited = opts.listings.slice(0, opts.limit ?? 10)

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${url}#itemlist`,
    name: opts.name,
    description: opts.description,
    numberOfItems: limited.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: limited.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: listingUrl(l.slug || l.id),
      item: {
        "@type": "LocalBusiness",
        "@id": `${listingUrl(l.slug || l.id)}#localbusiness`,
        name: l.name,
        ...(l.city ? { address: { "@type": "PostalAddress", addressLocality: l.city, addressCountry: "GB" } } : {}),
        ...(l.description ? { description: l.description.slice(0, 280) } : {}),
        ...(l.price
          ? {
              offers: {
                "@type": "Offer",
                price: l.price.toFixed(2),
                priceCurrency: "GBP",
                availability: "https://schema.org/InStock",
              },
            }
          : {}),
        url: listingUrl(l.slug || l.id),
      },
    })),
  }
}

interface HowToStep {
  name: string
  text: string
  url?: string
}

/** HowTo schema — eligible for rich results (step-by-step carousels). */
export function buildHowToSchema(opts: {
  name: string
  description: string
  url: string
  totalTime?: string // ISO 8601 duration, e.g. "PT45M"
  supply?: string[]
  tool?: string[]
  steps: HowToStep[]
  image?: string
}) {
  const url = absoluteUrl(opts.url)
  const image = opts.image
    ? opts.image.startsWith("http")
      ? opts.image
      : absoluteUrl(opts.image)
    : absoluteUrl("/og-image.png")

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${url}#howto`,
    name: opts.name,
    description: opts.description,
    image,
    ...(opts.totalTime ? { totalTime: opts.totalTime } : {}),
    ...(opts.supply && opts.supply.length > 0
      ? { supply: opts.supply.map((s) => ({ "@type": "HowToSupply", name: s })) }
      : {}),
    ...(opts.tool && opts.tool.length > 0
      ? { tool: opts.tool.map((t) => ({ "@type": "HowToTool", name: t })) }
      : {}),
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.url ? { url: absoluteUrl(s.url) } : {}),
    })),
    author: EDITORIAL_AUTHOR,
    publisher: EDITORIAL_PUBLISHER,
  }
}

/** BreadcrumbList schema for any page. */
export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  }
}

/** Product + Offer schema for digital download PDPs. */
export function buildDigitalProductSchema(opts: {
  name: string
  description: string
  url: string
  price: number
  currency?: string
  image?: string
  sku?: string
}) {
  const url = absoluteUrl(opts.url)
  const image = opts.image
    ? opts.image.startsWith("http")
      ? opts.image
      : absoluteUrl(opts.image.split("?")[0])
    : absoluteUrl("/og-image.png")

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: opts.name,
    description: opts.description,
    image,
    sku: opts.sku,
    brand: {
      "@type": "Brand",
      name: "RageRoom Directory",
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: (opts.currency || "GBP").toUpperCase(),
      price: opts.price.toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "RageRoom Directory",
        url: BASE_URL,
      },
    },
  }
}
