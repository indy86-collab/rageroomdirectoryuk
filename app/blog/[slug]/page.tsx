import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { getBlogPost, getAllBlogPosts } from "@/lib/blog-posts"
import Breadcrumbs from "@/components/Breadcrumbs"
import Script from "next/script"

interface BlogPostPageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPost(params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | RageRoom Directory Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rageroomdirectory.co.uk"
  const postUrl = `${baseUrl}/blog/${post.slug}`

  // Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "RageRoom Directory",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "RageRoom Directory",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    keywords: post.tags.join(", "),
    articleSection: post.category,
    wordCount: post.content.split(/\s+/).length,
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title },
  ]

  // Convert markdown-like content to HTML (simple conversion)
  const formatContent = (content: string) => {
    return content
      .split("\n")
      .map((line, index) => {
        // Headers
        if (line.startsWith("# ")) {
          return `<h2 class="text-2xl font-bold text-white mt-8 mb-4">${line.substring(2)}</h2>`
        }
        if (line.startsWith("## ")) {
          return `<h3 class="text-xl font-bold text-white mt-6 mb-3">${line.substring(3)}</h3>`
        }
        if (line.startsWith("### ")) {
          return `<h4 class="text-lg font-semibold text-white mt-4 mb-2">${line.substring(4)}</h4>`
        }
        // Lists
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return `<li class="text-zinc-300 mb-2">${line.substring(2)}</li>`
        }
        // Bold
        if (line.includes("**")) {
          line = line.replace(/\*\*(.*?)\*\*/g, "<strong class='text-white'>$1</strong>")
        }
        // Empty lines
        if (line.trim() === "") {
          return "<br />"
        }
        // Regular paragraphs
        if (line.trim()) {
          return `<p class="text-zinc-300 mb-4">${line}</p>`
        }
        return ""
      })
      .join("")
  }

  const formattedContent = formatContent(post.content)

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />

        <Breadcrumbs items={breadcrumbItems} />

        <article className="mt-4">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Link
                href="/blog"
                className="text-orange-500 hover:text-orange-600 text-sm font-medium"
              >
                ← Back to Blog
              </Link>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-orange-500 font-medium">
                {post.category}
              </span>
              <span className="text-sm text-zinc-500">•</span>
              <span className="text-sm text-zinc-500">
                {new Date(post.date).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-sm text-zinc-500">•</span>
              <span className="text-sm text-zinc-500">{post.readingTime}</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
            <p className="text-xl text-zinc-300 mb-6">{post.description}</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {/* Content */}
          <div
            className="prose prose-invert max-w-none bg-[#181818] rounded-lg border border-zinc-800 p-8"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />

          {/* CTA */}
          <div className="mt-12 bg-[#181818] rounded-lg border border-zinc-800 p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Experience a Rage Room?
            </h2>
            <p className="text-zinc-300 mb-6">
              Find the perfect rage room near you and book your stress-relief session today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/listings"
                className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors"
              >
                Browse All Rage Rooms
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-zinc-800 text-white font-semibold rounded-md hover:bg-zinc-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}


