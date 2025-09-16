import { type NextRequest, NextResponse } from "next/server"
import { orderService } from "@/lib/services/orderService"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const order = await orderService.getOrderById(id)

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
    const { id } = await params
    console.log('PATCH request for order:', id)
    
    const body = await request.json()
    console.log('Request body:', body)
    const { status, paymentStatus } = body

    if (!status && !paymentStatus) {
      return NextResponse.json({ error: "Either status or paymentStatus is required" }, { status: 400 })
    }

    let order
    if (status) {
      console.log('Updating order status to:', status)
      order = await orderService.updateOrderStatus(id, status)
    } else if (paymentStatus) {
      console.log('Updating payment status to:', paymentStatus)
      order = await orderService.updatePaymentStatus(id, paymentStatus)
    }

    console.log('Update result:', order ? 'Success' : 'Not found')

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: `Failed to update order: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 })
  }
}
