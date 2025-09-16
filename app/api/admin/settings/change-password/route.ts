import { type NextRequest, NextResponse } from "next/server"
import { getUserByUsername, verifyPassword, updatePassword } from "@/lib/services/userService"
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
    const { currentPassword, newPassword } = body

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 })
    }

    // Validate new password
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters long" }, { status: 400 })
    }

    // Get user with password
    const user = await getUserByUsername(authUser.username)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify current password
    const isPasswordValid = await verifyPassword(currentPassword, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 })
    }

    // Update password
    const updated = await updatePassword(authUser.id, newPassword)

    if (!updated) {
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    console.error("Change password error:", error)
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 })
  }
}
