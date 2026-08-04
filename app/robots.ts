import { MetadataRoute } from "next"
import { absoluteUrl, getSiteHost } from "@/lib/site-url"

export default function robots(): MetadataRoute.Robots {
  // Block API routes from crawlers. Explicitly allow modern AI crawlers so
  // LLM answer engines (ChatGPT Search, Perplexity, Claude, Gemini, etc.)
  // can index our content. See also /llms.txt for AEO discovery.
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
    sitemap: [absoluteUrl("/sitemap.xml"), absoluteUrl("/image-sitemap.xml")],
    host: getSiteHost(),
  }
}
