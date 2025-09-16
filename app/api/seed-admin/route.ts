import { NextResponse } from "next/server"
import { ensureAdminExists } from "@/lib/services/userService"

export async function GET() {
  try {
    console.log("[v0] Creating admin user...")
    await ensureAdminExists()

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      credentials: {
        username: "admin",
        password: "ayurved123",
      },
    })
  } catch (error) {
    console.error("[v0] Admin creation error:", error)
    return NextResponse.json({ error: "Failed to create admin user" }, { status: 500 })
  }
}

export async function POST() {
  return GET()
}
