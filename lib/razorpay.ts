import Razorpay from "razorpay"

// Initialize Razorpay instance with credentials (server-side only)
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_live_RY0EXcXh55Yjmo",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "jyTAK2Qsmnb7oJDbvOKA6Tvy",
})

// Utility function to create Razorpay order
export const createRazorpayOrder = async (amount: number, receipt: string) => {
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt,
      payment_capture: 1, // Auto capture payment
    })
    return order
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    throw error
  }
}

// Utility function to verify payment signature
export const verifyPaymentSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
): boolean => {
  try {
    const crypto = require("crypto")
    const body = razorpayOrderId + "|" + razorpayPaymentId
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "jyTAK2Qsmnb7oJDbvOKA6Tvy")
      .update(body.toString())
      .digest("hex")

    return expectedSignature === razorpaySignature
  } catch (error) {
    console.error("Error verifying payment signature:", error)
    return false
  }
}

// Payment status mapping
export const mapRazorpayStatus = (status: string) => {
  switch (status) {
    case "captured":
    case "authorized":
      return "paid"
    case "failed":
      return "failed"
    case "refunded":
      return "refunded"
    default:
      return "pending"
  }
}
