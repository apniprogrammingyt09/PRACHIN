import { type NextRequest, NextResponse } from "next/server"
import { updateUserProfile } from "@/lib/services/userService"
import { getAuthenticatedUser } from "@/lib/auth"

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const authUser = await getAuthenticatedUser()

    if (!authUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get request body
    const body = await request.json()
    const { username, email } = body

    // Validate input
    if (!username && !email) {
      return NextResponse.json({ error: "No data provided for update" }, { status: 400 })
    }

    // Update profile
    const updatedUser = await updateUserProfile(authUser.id, {
      username: username || undefined,
      email: email || undefined,
    })

    if (!updatedUser) {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
