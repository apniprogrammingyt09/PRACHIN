import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { Order } from "./models/Order"

export function generateInvoicePDF(order: Order): jsPDF {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height

  // Header background
  doc.setFillColor(45, 80, 22) // Dark green
  doc.rect(0, 0, pageWidth, 60, 'F')

  // Company Logo/Name
  doc.setFontSize(28)
  doc.setTextColor(255, 255, 255)
  doc.setFont(undefined, 'bold')
  doc.text("PRACHIN AYURVED", 20, 30)
  
  doc.setFontSize(11)
  doc.setFont(undefined, 'normal')
  doc.text("Traditional Ayurvedic Medicines & Wellness Products", 20, 40)
  
  // Company Details
  doc.setFontSize(9)
  doc.text("Address: 123 Wellness Street, Ayurveda Nagar, Mumbai - 400001", 20, 48)
  doc.text("Phone:+91-7206907250 | Email:prachinayurvedindia@gmail.com| Web:www.prachinayurved.in", 20, 54)

  // Invoice Title Box
  doc.setFillColor(74, 124, 89) // Medium green
  doc.rect(140, 15, 50, 30, 'F')
  doc.setFontSize(20)
  doc.setTextColor(255, 255, 255)
  doc.setFont(undefined, 'bold')
  doc.text("INVOICE", 165, 32, { align: 'center' })

  // Invoice Details Box
  doc.setFillColor(248, 250, 252)
  doc.setDrawColor(200, 200, 200)
  doc.rect(20, 70, pageWidth - 40, 35, 'FD')
  
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.setFont(undefined, 'bold')
  doc.text("Invoice Details:", 25, 80)
  
  doc.setFont(undefined, 'normal')
  doc.text(`Invoice Number: ${order.orderNumber}`, 25, 88)
  doc.text(`Invoice Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, 25, 95)
  doc.text(`Due Date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN")}`, 25, 102)
  
  doc.text(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 120, 88)
  doc.text(`Payment Status: ${order.paymentStatus.toUpperCase()}`, 120, 95)
  if (order.razorpayPayment?.paymentId) {
    doc.text(`Payment ID: ${order.razorpayPayment.paymentId}`, 120, 102)
  }

  // Customer Details Section
  doc.setFillColor(45, 80, 22)
  doc.rect(20, 115, 80, 6, 'F')
  doc.setFontSize(12)
  doc.setTextColor(255, 255, 255)
  doc.setFont(undefined, 'bold')
  doc.text("BILL TO:", 25, 119)

  doc.setFillColor(248, 250, 252)
  doc.setDrawColor(200, 200, 200)
  doc.rect(20, 121, 80, 40, 'FD')
  
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  doc.setFont(undefined, 'bold')
  doc.text(`${order.customer.firstName} ${order.customer.lastName}`, 25, 130)
  
  doc.setFont(undefined, 'normal')
  doc.setFontSize(9)
  doc.text(`Email: ${order.customer.email}`, 25, 138)
  doc.text(`Phone: ${order.customer.phone}`, 25, 145)
  doc.text(`Address: ${order.customer.address}`, 25, 152)
  doc.text(`${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}`, 25, 159)

  // Shipping Details (if different)
  doc.setFillColor(45, 80, 22)
  doc.rect(110, 115, 80, 6, 'F')
  doc.setFontSize(12)
  doc.setTextColor(255, 255, 255)
  doc.setFont(undefined, 'bold')
  doc.text("SHIP TO:", 115, 119)

  doc.setFillColor(248, 250, 252)
  doc.setDrawColor(200, 200, 200)
  doc.rect(110, 121, 80, 40, 'FD')
  
  doc.setFontSize(9)
  doc.setTextColor(0, 0, 0)
  doc.setFont(undefined, 'normal')
  doc.text("Same as billing address", 115, 140)

  // Items Table
  const tableData = order.items.map((item, index) => [
    (index + 1).toString(),
    item.name,
    item.quantity.toString(),
    `Rs. ${item.price.toFixed(2)}`,
    `Rs. ${(item.quantity * item.price).toFixed(2)}`,
  ])

  autoTable(doc, {
    startY: 170,
    head: [["S.No", "Product Description", "Qty", "Unit Price", "Amount"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [45, 80, 22], // Dark green
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: "bold",
      halign: "center",
      cellPadding: 6,
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 5,
      lineColor: [200, 200, 200],
      lineWidth: 0.5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 20, halign: "center" }, // S.No
      1: { cellWidth: 80, halign: "left" }, // Product name
      2: { cellWidth: 20, halign: "center" }, // Quantity
      3: { cellWidth: 30, halign: "right" }, // Unit price
      4: { cellWidth: 35, halign: "right" }, // Amount
    },
    margin: { left: 20, right: 20 },
    styles: {
      overflow: 'linebreak',
      cellWidth: 'wrap'
    }
  })

  // Calculate final Y position after table
  const finalY = (doc as any).lastAutoTable.finalY + 10

  // Summary Box
  const summaryBoxX = 120
  const summaryBoxY = finalY
  const summaryBoxWidth = 70
  const summaryBoxHeight = 50
  
  doc.setFillColor(248, 250, 252)
  doc.setDrawColor(200, 200, 200)
  doc.rect(summaryBoxX, summaryBoxY, summaryBoxWidth, summaryBoxHeight, 'FD')

  // Totals section
  doc.setFontSize(9)
  doc.setTextColor(0, 0, 0)
  doc.setFont(undefined, 'normal')
  const labelX = summaryBoxX + 5
  const valueX = summaryBoxX + summaryBoxWidth - 5

  let currentY = summaryBoxY + 8
  doc.text("Subtotal:", labelX, currentY)
  doc.text(`Rs. ${order.subtotal.toFixed(2)}`, valueX, currentY, { align: "right" })

  currentY += 6
  if (order.discount && order.discount > 0) {
    doc.text("Discount:", labelX, currentY)
    doc.text(`-Rs. ${order.discount.toFixed(2)}`, valueX, currentY, { align: "right" })
    currentY += 6
  }

  doc.text("Delivery Fee:", labelX, currentY)
  doc.text(`Rs. ${order.deliveryFee.toFixed(2)}`, valueX, currentY, { align: "right" })

  currentY += 6
  doc.text("Tax (GST):", labelX, currentY)
  doc.text(`Rs. ${order.tax.toFixed(2)}`, valueX, currentY, { align: "right" })

  // Total with emphasis
  currentY += 8
  doc.setDrawColor(45, 80, 22)
  doc.line(labelX, currentY - 2, valueX, currentY - 2)
  
  doc.setFontSize(11)
  doc.setTextColor(45, 80, 22)
  doc.setFont(undefined, "bold")
  doc.text("TOTAL:", labelX, currentY + 3)
  doc.text(`Rs. ${order.total.toFixed(2)}`, valueX, currentY + 3, { align: "right" })

  // Terms and Conditions
  const termsY = finalY + summaryBoxHeight + 15
  doc.setFontSize(10)
  doc.setTextColor(45, 80, 22)
  doc.setFont(undefined, 'bold')
  doc.text("Terms & Conditions:", 20, termsY)
  
  doc.setFontSize(8)
  doc.setTextColor(80, 80, 80)
  doc.setFont(undefined, 'normal')
  doc.text("• Payment is due within 30 days of invoice date", 20, termsY + 8)
  doc.text("• All products are guaranteed for quality and authenticity", 20, termsY + 14)
  doc.text("• Returns accepted within 7 days with original packaging", 20, termsY + 20)
  doc.text("• For any queries, contact us at info@prachinayurved.com", 20, termsY + 26)

  // Footer
  const footerY = pageHeight - 30
  doc.setFillColor(45, 80, 22)
  doc.rect(0, footerY - 5, pageWidth, 35, 'F')
  
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  doc.setFont(undefined, 'bold')
  doc.text("Thank you for choosing Prachin Ayurved!", pageWidth / 2, footerY + 5, { align: 'center' })
  
  doc.setFontSize(8)
  doc.setFont(undefined, 'normal')
  doc.text("Your wellness is our priority. Follow us for Ayurvedic tips and knowledge.", pageWidth / 2, footerY + 12, { align: 'center' })
  doc.text("Email:prachinayurvedindia@gmail.com| Phone:+91-7206907250 | Web:www.prachinayurved.in", pageWidth / 2, footerY + 18, { align: 'center' })

  // Page number
  doc.setFontSize(7)
  doc.text(`Page 1 of 1 | Generated on ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 20, pageHeight - 10, { align: 'right' })

  return doc
}
