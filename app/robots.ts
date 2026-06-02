import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"

  // Block API routes from crawlers.
  // modern AI crawlers so LLM answer engines (ChatGPT Search, Perplexity,
  // Claude, Gemini, Google's AI Overviews, etc.) index our content.
  const aiCrawlers = [
    "GPTBot",           // OpenAI — ChatGPT training/crawl
    "OAI-SearchBot",    // OpenAI — ChatGPT Search index
    "ChatGPT-User",     // OpenAI — live browsing requests
    "ClaudeBot",        // Anthropic — Claude crawler
    "Claude-Web",       // Anthropic — live browsing
    "anthropic-ai",     // Anthropic — legacy UA
    "PerplexityBot",    // Perplexity — search crawler
    "Perplexity-User",  // Perplexity — live browsing
    "Google-Extended",  // Google — Gemini / Vertex training
    "Applebot-Extended",// Apple — Apple Intelligence
    "CCBot",            // Common Crawl (powers many LLMs)
    "Bytespider",       // ByteDance (Doubao / TikTok)
    "Meta-ExternalAgent", // Meta — Llama crawling
    "Amazonbot",        // Amazon
    "DuckAssistBot",    // DuckDuckGo
    "YouBot",           // You.com
    "cohere-ai",        // Cohere
    "ImagesiftBot",     // The Hive
    "Diffbot",          // Diffbot
  ]

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      ...aiCrawlers.map((ua) => ({
        userAgent: ua,
        allow: "/",
        disallow: ["/api/"],
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl.replace(/^https?:\/\//, ""),
  }
}
