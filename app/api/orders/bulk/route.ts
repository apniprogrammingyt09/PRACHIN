import { type NextRequest, NextResponse } from "next/server"
import { orderService } from "@/lib/services/orderService"

export async function PATCH(request: NextRequest) {
  try {
    const { orderIds, status, paymentStatus } = await request.json()

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json({ error: "Order IDs are required" }, { status: 400 })
    }

    if (!status && !paymentStatus) {
      return NextResponse.json({ error: "Status or payment status is required" }, { status: 400 })
    }

    const results = []
    const errors = []

    // Process each order
    for (const orderId of orderIds) {
      try {
        let order
        if (status) {
          order = await orderService.updateOrderStatus(orderId, status)
        } else if (paymentStatus) {
          order = await orderService.updatePaymentStatus(orderId, paymentStatus)
        }

        if (order) {
          results.push(order)
        } else {
          errors.push({ orderId, error: "Order not found" })
        }
      } catch (error) {
        console.error(`Error updating order ${orderId}:`, error)
        errors.push({ orderId, error: "Failed to update order" })
      }
    }

    return NextResponse.json({
      success: true,
      updated: results.length,
      errors: errors.length,
      results,
      errors,
    })
  } catch (error) {
    console.error("Error bulk updating orders:", error)
    return NextResponse.json({ error: "Failed to bulk update orders" }, { status: 500 })
  }
}
