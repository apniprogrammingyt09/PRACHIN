import { type NextRequest, NextResponse } from "next/server"
import { getOrderById } from "@/lib/services/orderService"
import { generateInvoicePDF } from "@/lib/invoice-generator"

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = await params

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    // Get order details
    const order = await getOrderById(orderId)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Generate PDF
    const pdf = generateInvoicePDF(order)
    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"))

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${order.orderNumber}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("Error generating invoice:", error)
    return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 })
  }
}
