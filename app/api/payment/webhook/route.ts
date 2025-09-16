import { type NextRequest, NextResponse } from "next/server"
import { orderService } from "@/lib/services/orderService"
import { mapRazorpayStatus } from "@/lib/razorpay"
import crypto from "crypto"

// Webhook event types we handle
const SUPPORTED_EVENTS = [
  "payment.captured",
  "payment.failed",
  "payment.authorized",
  "order.paid",
  "refund.created",
  "refund.processed",
]

export async function POST(request: NextRequest) {
  let eventData: any = null

  try {
    const body = await request.text()
    const signature = request.headers.get("x-razorpay-signature")

    if (!signature) {
      console.error("Webhook: Missing signature")
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error("Webhook: Missing webhook secret in environment")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(body).digest("hex")

    if (expectedSignature !== signature) {
      console.error("Webhook: Invalid signature", { expected: expectedSignature, received: signature })
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    eventData = JSON.parse(body)
    console.log("Webhook: Received event", {
      event: eventData.event,
      paymentId: eventData.payload?.payment?.entity?.id,
      orderId: eventData.payload?.payment?.entity?.order_id,
    })

    // Check if we support this event type
    if (!SUPPORTED_EVENTS.includes(eventData.event)) {
      console.log("Webhook: Unsupported event type", eventData.event)
      return NextResponse.json({ received: true, message: "Event type not handled" })
    }

    // Handle payment events
    if (eventData.event.startsWith("payment.")) {
      await handlePaymentEvent(eventData)
    }

    // Handle refund events
    if (eventData.event.startsWith("refund.")) {
      await handleRefundEvent(eventData)
    }

    console.log("Webhook: Successfully processed event", eventData.event)
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook: Error processing event", {
      error: error instanceof Error ? error.message : "Unknown error",
      event: eventData?.event,
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handlePaymentEvent(eventData: any) {
  const payment = eventData.payload.payment.entity
  const razorpayOrderId = payment.order_id

  if (!razorpayOrderId) {
    console.error("Webhook: Missing order_id in payment event")
    return
  }

  // Find order by Razorpay order ID
  const order = await orderService.getOrderByRazorpayOrderId(razorpayOrderId)

  if (!order) {
    console.error("Webhook: Order not found for Razorpay order ID", razorpayOrderId)
    return
  }

  console.log("Webhook: Processing payment event for order", {
    orderNumber: order.orderNumber,
    event: eventData.event,
    paymentStatus: payment.status,
  })

  // Map Razorpay status to our payment status
  const paymentStatus = mapRazorpayStatus(payment.status)

  // Update payment status
  await orderService.updatePaymentStatus(order._id.toString(), paymentStatus)

  // Update Razorpay payment details
  await orderService.updatePaymentDetails(order._id.toString(), {
    orderId: payment.order_id,
    paymentId: payment.id,
    status: payment.status,
    signature: payment.signature || undefined,
  })

  // If payment is successful, update order status to confirmed
  if (paymentStatus === "paid" && order.status === "pending") {
    await orderService.updateOrderStatus(order._id.toString(), "confirmed")
    console.log("Webhook: Order status updated to confirmed", order.orderNumber)
  }
}

async function handleRefundEvent(eventData: any) {
  const refund = eventData.payload.refund.entity
  const paymentId = refund.payment_id

  if (!paymentId) {
    console.error("Webhook: Missing payment_id in refund event")
    return
  }

  // Find order by payment ID
  const orders = await orderService.getAllOrders()
  const order = orders.find((o) => o.razorpayPayment?.paymentId === paymentId)

  if (!order) {
    console.error("Webhook: Order not found for payment ID", paymentId)
    return
  }

  console.log("Webhook: Processing refund event for order", {
    orderNumber: order.orderNumber,
    event: eventData.event,
    refundAmount: refund.amount,
  })

  // Update payment status to refunded
  await orderService.updatePaymentStatus(order._id.toString(), "refunded")

  // Update order status if needed
  if (order.status !== "cancelled") {
    await orderService.updateOrderStatus(order._id.toString(), "cancelled")
  }
}
