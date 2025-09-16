import { NextResponse } from "next/server"
import { ensureAdminExists } from "@/lib/services/userService"
import { productService } from "@/lib/services/productService"
import { seedProducts } from "@/lib/products"

export async function GET() {
  try {
    // Ensure admin user exists
    await ensureAdminExists()

    const existingProducts = await productService.getAllProducts()

    if (existingProducts.length === 0) {
      for (const productData of seedProducts) {
        await productService.createProduct(productData)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully with Ayurvedic products",
      productsCount: existingProducts.length > 0 ? existingProducts.length : seedProducts.length,
    })
  } catch (error) {
    console.error("Seeding error:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}

export async function POST() {
  return GET()
}
