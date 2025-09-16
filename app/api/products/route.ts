import { type NextRequest, NextResponse } from "next/server"
import { productService } from "@/lib/services/productService"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")

    let products

    if (search) {
      products = await productService.searchProducts(search)
    } else if (featured === "true") {
      products = await productService.getFeaturedProducts()
    } else if (category) {
      products = await productService.getProductsByCategory(category)
    } else {
      products = await productService.getAllProducts()
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const product = await productService.createProduct(data)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
