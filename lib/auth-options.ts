import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"

// Lazy load Prisma to avoid build-time initialization
// This prevents database connection during Next.js build phase
let prismaInstance: any = null
function getPrisma() {
  if (!prismaInstance) {
    prismaInstance = require("@/lib/prisma").prisma
  }
  return prismaInstance
}

// Export as a function to prevent build-time initialization
export function getAuthOptions(): NextAuthOptions {
  return {
    adapter: PrismaAdapter(getPrisma()) as any,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const prisma = getPrisma()
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.hashedPassword) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
    // Add other providers here later (e.g., Google, GitHub)
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }
      return session
    },
  },
    pages: {
      signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
}

// For backward compatibility, export a getter
export const authOptions = getAuthOptions()

