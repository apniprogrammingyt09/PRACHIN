import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDatabase()
    
    // Test connection
    await db.admin().ping()
    
    // Check collections
    const collections = await db.listCollections().toArray()
    const products = await db.collection("products").countDocuments()
    const users = await db.collection("users").countDocuments()
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      collections: collections.map(c => c.name),
      counts: {
        products,
        users
      }
    })
  } catch (error) {
    console.error("Database check error:", error)
    return NextResponse.json({ 
      error: "Database connection failed", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}