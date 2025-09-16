import { type NextRequest, NextResponse } from "next/server"
import { orderService } from "@/lib/services/orderService"
import { customerService } from "@/lib/services/customerService"
import { productService } from "@/lib/services/productService"
import { sendOrderConfirmationEmail } from "@/lib/email-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const customer = searchParams.get("customer")

    let orders

    if (status) {
      orders = await orderService.getOrdersByStatus(status as any)
    } else if (customer) {
      orders = await orderService.getOrdersByCustomer(customer)
    } else {
      orders = await orderService.getAllOrders()
    }

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate and reduce stock for each item before creating order
    for (const item of data.items) {
      const product = await productService.getProductById(item.productId)
      if (!product) {
        return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 400 })
      }

      if (product.stockQuantity < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.quantity}`,
          },
          { status: 400 },
        )
      }

      // Reduce stock
      const newQuantity = product.stockQuantity - item.quantity
      await productService.updateStock(item.productId, newQuantity)
    }

    // Create or update customer
    await customerService.createOrUpdateCustomer(data.customer)

    // Create order
    const order = await orderService.createOrder(data)

    // Update customer stats
    await customerService.updateCustomerStats(data.customer.email, data.total)

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail(order)
      console.log("Order confirmation email sent successfully")
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError)
      // Don't fail the order creation if email fails
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
