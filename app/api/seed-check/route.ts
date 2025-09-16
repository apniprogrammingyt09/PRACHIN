import { NextResponse } from "next/server"
import { productService } from "@/lib/services/productService"

export async function GET() {
  try {
    const products = await productService.getAllProducts()

    return NextResponse.json({
      seeded: products.length > 0,
      count: products.length,
      message: products.length > 0 ? "Database already has products" : "Database needs seeding",
    })
  } catch (error) {
    console.error("Error checking seed status:", error)
    return NextResponse.json({ error: "Failed to check seed status" }, { status: 500 })
  }
}
