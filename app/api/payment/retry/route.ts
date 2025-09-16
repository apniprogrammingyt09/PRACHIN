import { type NextRequest, NextResponse } from "next/server"
import { orderService } from "@/lib/services/orderService"
import { createRazorpayOrder } from "@/lib/razorpay"

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    // Get order details
    const order = await orderService.getOrderById(orderId)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check if order is eligible for retry
    if (order.paymentStatus === "paid") {
      return NextResponse.json({ error: "Order is already paid" }, { status: 400 })
    }

    if (order.paymentMethod !== "razorpay") {
      return NextResponse.json({ error: "Payment retry is only available for Razorpay payments" }, { status: 400 })
    }

    // Create new Razorpay order for retry
    const razorpayOrder = await createRazorpayOrder(order.total, `retry_${order.orderNumber}_${Date.now()}`)

    // Update order with new Razorpay order ID
    await orderService.updatePaymentDetails(orderId, {
      orderId: razorpayOrder.id,
      status: "created",
    })

    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderNumber: order.orderNumber,
    })
  } catch (error) {
    console.error("Error retrying payment:", error)
    return NextResponse.json({ error: "Failed to retry payment" }, { status: 500 })
  }
}
