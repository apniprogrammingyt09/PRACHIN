import { NextResponse } from "next/server"
import { orderService } from "@/lib/services/orderService"
import { customerService } from "@/lib/services/customerService"
import { productService } from "@/lib/services/productService"

export async function GET() {
  try {
    const [orderStats, customerStats, products] = await Promise.all([
      orderService.getOrderStats(),
      customerService.getCustomerStats(),
      productService.getAllProducts(),
    ])

    const totalProducts = products.length
    const lowStockProducts = products.filter((p) => p.stockQuantity < 10).length

    return NextResponse.json({
      orders: orderStats,
      customers: customerStats,
      products: {
        total: totalProducts,
        lowStock: lowStockProducts,
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
