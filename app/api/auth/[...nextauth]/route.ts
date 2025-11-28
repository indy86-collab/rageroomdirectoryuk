import NextAuth from "next-auth"

// Mark this route as dynamic - NextAuth requires dynamic rendering
// This prevents Next.js from trying to statically analyze the route during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const fetchCache = 'force-no-store'
export const revalidate = 0

// Lazy load handler to prevent build-time initialization
let handler: ReturnType<typeof NextAuth> | null = null

function getHandler() {
  if (!handler) {
    const { getAuthOptions } = require("@/lib/auth-options")
    handler = NextAuth(getAuthOptions())
  }
  return handler
}

async function GET(request: Request) {
  return getHandler()(request as any)
}

async function POST(request: Request) {
  return getHandler()(request as any)
}

export { GET, POST }





