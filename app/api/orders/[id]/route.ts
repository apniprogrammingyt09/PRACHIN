import { type NextRequest, NextResponse } from "next/server"
import { orderService } from "@/lib/services/orderService"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await orderService.getOrderById(params.id)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status, paymentStatus } = await request.json()

    let order
    if (status) {
      order = await orderService.updateOrderStatus(params.id, status)
    } else if (paymentStatus) {
      order = await orderService.updatePaymentStatus(params.id, paymentStatus)
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
