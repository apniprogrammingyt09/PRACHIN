import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { User, UserWithoutPassword } from "@/lib/models/User"
import bcrypt from "bcryptjs"

// Get user by username (for login)
export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    console.log("[v0] Looking up user:", username)
    const db = await getDatabase()
    const user = await db.collection<User>("users").findOne({ username })
    console.log("[v0] User lookup completed:", user ? "Found" : "Not found")
    return user
  } catch (error) {
    console.error("[v0] Error in getUserByUsername:", error)
    throw error
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<UserWithoutPassword | null> {
  try {
    console.log("[v0] Looking up user by ID:", id)
    const db = await getDatabase()
    const user = await db.collection<User>("users").findOne({ _id: new ObjectId(id) })
    console.log("[v0] User by ID lookup completed:", user ? "Found" : "Not found")

    if (!user) return null

    // Remove password before returning
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword as UserWithoutPassword
  } catch (error) {
    console.error("[v0] Error in getUserById:", error)
    throw error
  }
}

// Verify password
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

// Update user password
export async function updatePassword(userId: string, newPassword: string): Promise<boolean> {
  const db = await getDatabase()
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  const result = await db.collection<User>("users").updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    },
  )

  return result.modifiedCount > 0
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  data: { username?: string; email?: string },
): Promise<UserWithoutPassword | null> {
  const db = await getDatabase()

  const updateData: any = {
    ...data,
    updatedAt: new Date(),
  }

  const result = await db
    .collection<User>("users")
    .findOneAndUpdate({ _id: new ObjectId(userId) }, { $set: updateData }, { returnDocument: "after" })

  if (!result) return null

  // Remove password before returning
  const { password, ...userWithoutPassword } = result
  return userWithoutPassword as UserWithoutPassword
}

// Create initial admin user if none exists
export async function ensureAdminExists(): Promise<void> {
  try {
    console.log("[v0] Checking if admin user exists...")
    const db = await getDatabase()
    const adminCount = await db.collection<User>("users").countDocuments({ role: "admin" })
    console.log("[v0] Admin user count:", adminCount)

    if (adminCount === 0) {
      console.log("[v0] Creating admin user...")
      const hashedPassword = await bcrypt.hash("ayurved123", 10)

      await db.collection<User>("users").insertOne({
        username: "admin",
        email: "admin@prachinayurved.com",
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      console.log("[v0] Created default admin user for Prachin Ayurved")
    } else {
      console.log("[v0] Admin user already exists")
    }
  } catch (error) {
    console.error("[v0] Error in ensureAdminExists:", error)
    throw error
  }
}
