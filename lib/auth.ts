import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { Role } from "@prisma/client"

export async function getCurrentSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getCurrentSession()
  return session?.user
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === Role.ADMIN
}

export async function requireAuth() {
  const session = await getCurrentSession()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session
}

export async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  if (user.role !== Role.ADMIN) {
    throw new Error("Forbidden: Admin access required")
  }
  return user
}



