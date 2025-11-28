"use client"

import { useState } from "react"
import Link from "next/link"
import { BlogPost } from "@/lib/blog-posts"

interface BlogListingProps {
  posts: BlogPost[]
}

export default function BlogListing({ posts }: BlogListingProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Get all unique categories
  const categories = Array.from(new Set(posts.map((post) => post.category)))
  
  // Sort categories alphabetically, but put "All" first
  const sortedCategories = ["All", ...categories.sort()]

  // Filter posts based on selected category
  const filteredPosts = selectedCategory === null || selectedCategory === "All"
    ? posts
    : posts.filter((post) => post.category === selectedCategory)

  return (
    <>
      {/* Filter Buttons */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {sortedCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === "All" ? null : category)}
              className={`px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base min-h-[44px] ${
                (selectedCategory === null && category === "All") ||
                (selectedCategory === category)
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-[#181818] text-zinc-300 border border-zinc-800 hover:border-orange-500 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-base sm:text-lg">
            No blog posts found in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-[#181818] rounded-lg overflow-hidden border border-zinc-800 hover:border-orange-500 transition-colors h-full flex flex-col"
            >
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-orange-500 font-medium">
                      {post.category}
                    </span>
                    <span className="text-xs text-zinc-500">•</span>
                    <span className="text-xs text-zinc-500">
                      {post.readingTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {post.title}
                  </h3>
                  <p className="text-zinc-400 text-sm mb-4 flex-grow">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-zinc-500">
                      {new Date(post.date).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-orange-500 text-sm font-medium">
                      Read More →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

