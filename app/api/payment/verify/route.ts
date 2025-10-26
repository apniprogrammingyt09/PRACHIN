import { type NextRequest, NextResponse } from "next/server"
import { verifyPaymentSignature } from "@/lib/razorpay"
import { orderService } from "@/lib/services/orderService"

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing required payment verification data" }, { status: 400 })
    }

    // Verify payment signature
    const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      verified: true,
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
