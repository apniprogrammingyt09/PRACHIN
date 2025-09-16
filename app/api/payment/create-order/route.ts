import { type NextRequest, NextResponse } from "next/server"
import { createRazorpayOrder } from "@/lib/razorpay"

export async function POST(request: NextRequest) {
  try {
    const { amount, receipt } = await request.json()

    if (!amount || !receipt) {
      return NextResponse.json({ error: "Amount and receipt are required" }, { status: 400 })
    }

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(amount, receipt)

    return NextResponse.json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
    })
  } catch (error) {
    console.error("Error creating payment order:", error)
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 })
  }
}
