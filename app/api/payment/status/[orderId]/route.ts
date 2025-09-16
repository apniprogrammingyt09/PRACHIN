import { type NextRequest, NextResponse } from "next/server"
import { orderService } from "@/lib/services/orderService"

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    // Get order details
    const order = await orderService.getOrderById(orderId)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Return payment status information
    return NextResponse.json({
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      total: order.total,
      razorpayPayment: order.razorpayPayment
        ? {
            orderId: order.razorpayPayment.orderId,
            paymentId: order.razorpayPayment.paymentId,
            status: order.razorpayPayment.status,
          }
        : null,
      orderStatus: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    })
  } catch (error) {
    console.error("Error fetching payment status:", error)
    return NextResponse.json({ error: "Failed to fetch payment status" }, { status: 500 })
  }
}
