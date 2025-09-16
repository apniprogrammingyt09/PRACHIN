import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Only return the public key and configuration, never the secret
    const config = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_uC5GRwRYijH00y",
      currency: "INR",
      name: "Wellness Store",
      description: "Payment for your wellness products",
      theme: {
        color: "#16a34a", // Green theme matching the app
      },
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error("Error getting Razorpay config:", error)
    return NextResponse.json({ error: "Failed to get payment configuration" }, { status: 500 })
  }
}
