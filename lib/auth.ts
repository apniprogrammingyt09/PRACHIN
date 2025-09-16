import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import { getUserById } from "@/lib/services/userService"

// JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_development_only"

export interface AuthUser {
  id: string
  username: string
  role: string
}

export async function getAuthenticatedUser(): Promise<AuthUser | null> {
  try {
    // Get token from cookie
    const token = cookies().get("adminToken")?.value

    if (!token) {
      return null
    }

    // Verify token
    const decoded = verify(token, JWT_SECRET) as any

    if (!decoded || !decoded.id) {
      return null
    }

    // Get user from database to verify they still exist
    const user = await getUserById(decoded.id)

    if (!user) {
      return null
    }

    return {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    }
  } catch (error) {
    console.error("Auth check error:", error)
    return null
  }
}
