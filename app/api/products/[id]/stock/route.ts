import { type NextRequest, NextResponse } from "next/server"
import { productService } from "@/lib/services/productService"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { quantityToReduce } = await request.json()
    const { id } = params

    // Get current product
    const product = await productService.getProductById(id)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Calculate new stock quantity
    const newQuantity = Math.max(0, product.stockQuantity - quantityToReduce)

    // Update stock
    const success = await productService.updateStock(id, newQuantity)

    if (!success) {
      return NextResponse.json({ error: "Failed to update stock" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      newQuantity,
      message: `Stock updated. New quantity: ${newQuantity}`,
    })
  } catch (error) {
    console.error("Error updating stock:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
