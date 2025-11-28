import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth-options"

// Mark this route as dynamic - NextAuth requires dynamic rendering
// This prevents Next.js from trying to statically analyze the route during build
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }





