import { Metadata } from "next"
import Link from "next/link"
import { getAllBlogPosts } from "@/lib/blog-posts"
import Breadcrumbs from "@/components/Breadcrumbs"
import BlogListing from "@/components/BlogListing"

export const metadata: Metadata = {
  title: "Rage Room Blog | Tips, Guides & Expert Advice",
  description: "Discover expert tips, guides, and advice about rage rooms. From first-time preparation to team building, find everything you need to know.",
  openGraph: {
    title: "Rage Room Blog | Tips, Guides & Expert Advice",
    description: "Expert tips and guides about rage rooms, stress relief, and unique experiences across the UK.",
    type: "website",
  },
}

export default function BlogPage() {
  const posts = getAllBlogPosts()

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ]

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Breadcrumbs items={breadcrumbItems} />

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 mt-4">
          Rage Room Blog
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 mb-6 sm:mb-8">
          Expert tips, guides, and advice to help you make the most of your rage room experience. 
          From first-time preparation to team building events, find everything you need to know.
        </p>

        {/* Blog Listing with Filters */}
        <BlogListing posts={posts} />

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-orange-500 hover:text-orange-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}


