import { type NextRequest, NextResponse } from "next/server"
import { getUserByUsername, verifyPassword, ensureAdminExists } from "@/lib/services/userService"
import { cookies } from "next/headers"
import { sign } from "jsonwebtoken"

// JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_development_only"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Login attempt started")

    const body = await request.json()
    const { username, password } = body

    console.log("[v0] Login credentials received:", { username, passwordLength: password?.length })

    // Validate input
    if (!username || !password) {
      console.log("[v0] Missing credentials")
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    try {
      await ensureAdminExists()
      console.log("[v0] Admin user existence ensured")
    } catch (dbError) {
      console.error("[v0] Database error during admin creation:", dbError)
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Get user from database
    let user
    try {
      user = await getUserByUsername(username)
      console.log("[v0] User lookup result:", user ? "User found" : "User not found")
    } catch (dbError) {
      console.error("[v0] Database error during user lookup:", dbError)
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Check if user exists
    if (!user) {
      console.log("[v0] User not found in database")
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password)
    console.log("[v0] Password verification:", isPasswordValid ? "Valid" : "Invalid")

    if (!isPasswordValid) {
      console.log("[v0] Password verification failed")
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    // Create user object without password
    const { password: _, ...userWithoutPassword } = user

    // Create JWT token
    const token = sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    console.log("[v0] JWT token created successfully")

    // Set cookie
    cookies().set({
      name: "adminToken",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })

    console.log("[v0] Login successful for user:", username)

    // Return user data
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json(
      {
        error: "Authentication failed",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
