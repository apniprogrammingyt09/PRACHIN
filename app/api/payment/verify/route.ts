import { type NextRequest, NextResponse } from "next/server"
import { verifyPaymentSignature } from "@/lib/razorpay"
import { orderService } from "@/lib/services/orderService"

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return NextResponse.json({ error: "Missing required payment verification data" }, { status: 400 })
    }

    // Verify payment signature
    const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // Update order with payment details
    const updatedOrder = await orderService.updatePaymentDetails(order_id, {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      status: "captured",
    })

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
