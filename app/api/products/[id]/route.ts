import { type NextRequest, NextResponse } from "next/server"
import { productService } from "@/lib/services/productService"
import { ObjectId } from "mongodb"

function isValidObjectId(id: string): boolean {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    const product = await productService.getProductById(id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    const data = await request.json()
    const product = await productService.updateProduct(id, data)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    const success = await productService.deleteProduct(id)

    if (!success) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
