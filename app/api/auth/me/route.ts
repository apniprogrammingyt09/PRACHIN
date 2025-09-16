import { type NextRequest, NextResponse } from "next/server"
import { getUserById } from "@/lib/services/userService"
import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"

// JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_development_only"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Auth check started")

    // Get token from cookie
    const cookieStore = await cookies()
    const token = cookieStore.get("adminToken")?.value
    console.log("[v0] Token found:", !!token)

    if (!token) {
      console.log("[v0] No token found in cookies")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Verify token
    let decoded
    try {
      decoded = verify(token, JWT_SECRET) as any
      console.log("[v0] Token verified successfully")
    } catch (tokenError) {
      console.error("[v0] Token verification failed:", tokenError)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    if (!decoded || !decoded.id) {
      console.log("[v0] Invalid token payload")
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get user from database
    let user
    try {
      user = await getUserById(decoded.id)
      console.log("[v0] User lookup result:", user ? "User found" : "User not found")
    } catch (dbError) {
      console.error("[v0] Database error during user lookup:", dbError)
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    if (!user) {
      console.log("[v0] User not found in database")
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("[v0] Auth check successful")
    // Return user data
    return NextResponse.json({ user })
  } catch (error) {
    console.error("[v0] Auth check error:", error)
    return NextResponse.json(
      {
        error: "Authentication failed",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 401 },
    )
  }
}
