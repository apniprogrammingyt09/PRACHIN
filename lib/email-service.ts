import nodemailer from "nodemailer"
import type { Order } from "./models/Order"

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendContactFormEmail(formData: {
  name: string
  email: string
  phone: string
  message: string
}) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials not configured")
    }

    // Admin notification email
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2D5016, #4A7C59); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">PRACHIN AYURVED</h1>
          <p style="color: #e8f5e8; margin: 5px 0 0 0;">New Contact Form Submission</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
          <h2 style="color: #2D5016; margin-top: 0;">Contact Details</h2>
          
          <div style="background: #f8fdf8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4A7C59;">
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone}</p>
          </div>

          <h3 style="color: #2D5016;">Message</h3>
          <div style="background: #f8fdf8; padding: 20px; border-radius: 8px; white-space: pre-wrap;">
            ${formData.message}
          </div>
        </div>
      </body>
      </html>
    `

    // Customer confirmation email
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Thank You for Contacting Us</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2D5016, #4A7C59); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">PRACHIN AYURVED</h1>
          <p style="color: #e8f5e8; margin: 5px 0 0 0;">Traditional Ayurvedic Medicines & Wellness Products</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
          <h2 style="color: #2D5016; margin-top: 0;">Thank You for Reaching Out!</h2>
          <p>Dear ${formData.name},</p>
          <p>Thank you for contacting Prachin Ayurved. We have received your message and appreciate your interest in our traditional Ayurvedic products and wellness solutions.</p>
          
          <div style="background: #f8fdf8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4A7C59;">
            <h3 style="color: #2D5016; margin-top: 0;">What Happens Next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Our wellness experts will review your inquiry</li>
              <li>We'll respond within 24 hours during business days</li>
              <li>For urgent matters, call us at +91-87087-18784 or +91-72069-07250</li>
              <li>You can also visit our website for immediate assistance</li>
            </ul>
          </div>

          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2D5016; margin-top: 0;">Your Message Summary</h3>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${formData.email}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${formData.phone}</p>
            <div style="margin-top: 10px; padding: 15px; background: white; border-radius: 5px; white-space: pre-wrap; font-style: italic;">
              "${formData.message}"
            </div>
          </div>

          <p>We're committed to helping you achieve optimal health through authentic Ayurvedic practices and premium quality products.</p>
          <p style="color: #4A7C59;">Thank you for choosing Prachin Ayurved!</p>
        </div>
        
        <div style="background: #2D5016; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
          <p style="margin: 0; font-size: 14px;">📧 prachinayurvedindia@gmail.com | 📞 +91-87087-18784, +91-72069-07250</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;">🌐 www.prachinayurved.in</p>
        </div>
      </body>
      </html>
    `

    // Send admin notification
    const adminInfo = await transporter.sendMail({
      from: `"Prachin Ayurved" <${process.env.EMAIL_USER}>`,
      to: "prachinayurvedindia@gmail.com",
      replyTo: formData.email,
      subject: `New Contact Form: ${formData.name} - Prachin Ayurved`,
      html: adminEmailHtml,
    })

    // Send customer confirmation
    const customerInfo = await transporter.sendMail({
      from: `"Prachin Ayurved" <${process.env.EMAIL_USER}>`,
      to: formData.email,
      subject: "Thank You for Contacting Prachin Ayurved",
      html: customerEmailHtml,
    })

    console.log("Contact form emails sent - Admin:", adminInfo.messageId, "Customer:", customerInfo.messageId)
    return { success: true, adminMessageId: adminInfo.messageId, customerMessageId: customerInfo.messageId }
  } catch (error) {
    console.error("Error sending contact form email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function sendOrderConfirmationEmail(order: Order) {
  try {
    const orderItems = order.items
      .map(
        (item) =>
          `<tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.price.toFixed(2)}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${(item.quantity * item.price).toFixed(2)}</td>
          </tr>`
      )
      .join("")

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - Prachin Ayurved</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2D5016, #4A7C59); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">PRACHIN AYURVED</h1>
          <p style="color: #e8f5e8; margin: 5px 0 0 0;">Traditional Ayurvedic Medicines & Wellness Products</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
          <h2 style="color: #2D5016; margin-top: 0;">Order Confirmation</h2>
          <p>Dear ${order.customer.firstName} ${order.customer.lastName},</p>
          <p>Thank you for your order! We're excited to help you on your wellness journey with our authentic Ayurvedic products.</p>
          
          <div style="background: #f8fdf8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4A7C59;">
            <h3 style="color: #2D5016; margin-top: 0;">Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
            <p><strong>Payment Status:</strong> ${order.paymentStatus.toUpperCase()}</p>
          </div>

          <h3 style="color: #2D5016;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #2D5016; color: white;">
                <th style="padding: 12px; text-align: left;">Product</th>
                <th style="padding: 12px; text-align: center;">Qty</th>
                <th style="padding: 12px; text-align: right;">Price</th>
                <th style="padding: 12px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderItems}
            </tbody>
          </table>

          <div style="background: #f8fdf8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; margin-left: auto; max-width: 300px;">
              <tr>
                <td style="padding: 5px 0;"><strong>Subtotal:</strong></td>
                <td style="text-align: right; padding: 5px 0;">₹${order.subtotal.toFixed(2)}</td>
              </tr>
              ${order.discount > 0 ? `
              <tr>
                <td style="padding: 5px 0;"><strong>Discount:</strong></td>
                <td style="text-align: right; padding: 5px 0; color: #16a34a;">-₹${order.discount.toFixed(2)}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 5px 0;"><strong>Delivery Fee:</strong></td>
                <td style="text-align: right; padding: 5px 0;">₹${order.deliveryFee.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0;"><strong>Tax (GST):</strong></td>
                <td style="text-align: right; padding: 5px 0;">₹${order.tax.toFixed(2)}</td>
              </tr>
              <tr style="border-top: 2px solid #2D5016; font-size: 18px; color: #2D5016;">
                <td style="padding: 10px 0;"><strong>Total:</strong></td>
                <td style="text-align: right; padding: 10px 0;"><strong>₹${order.total.toFixed(2)}</strong></td>
              </tr>
            </table>
          </div>

          <div style="background: #f8fdf8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2D5016; margin-top: 0;">Delivery Address</h3>
            <p style="margin: 5px 0;">${order.customer.address}</p>
            <p style="margin: 5px 0;">${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}</p>
            <p style="margin: 5px 0;">Phone: ${order.customer.phone}</p>
          </div>

          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2D5016; margin-top: 0;">What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>We'll process your order within 24 hours</li>
              <li>You'll receive a shipping confirmation with tracking details</li>
              <li>Your order will be delivered within 3-7 business days</li>
              <li>Track your order anytime on our website</li>
            </ul>
          </div>

          <p>If you have any questions about your order, please don't hesitate to contact us.</p>
          <p style="color: #4A7C59;">Thank you for choosing Prachin Ayurved for your wellness needs!</p>
        </div>
        
        <div style="background: #2D5016; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
          <p style="margin: 0; font-size: 14px;">📧 prachinayurvedindia@gmail.com | 📞 +91-87087-18784, +91-72069-07250</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;">🌐 www.prachinayurved.in</p>
          <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.8;">Follow us for wellness tips and Ayurvedic knowledge</p>
        </div>
      </body>
      </html>
    `

    // Send to customer
    const customerInfo = await transporter.sendMail({
      from: `"Prachin Ayurved" <${process.env.EMAIL_USER}>`,
      to: order.customer.email,
      subject: `Order Confirmation - ${order.orderNumber} | Prachin Ayurved`,
      html: emailHtml,
    })

    // Send to admin
    const adminEmailHtml = emailHtml.replace(
      `<p>Dear ${order.customer.firstName} ${order.customer.lastName},</p>
          <p>Thank you for your order! We're excited to help you on your wellness journey with our authentic Ayurvedic products.</p>`,
      `<p><strong>New Order Received!</strong></p>
          <p>A new order has been placed by ${order.customer.firstName} ${order.customer.lastName}.</p>`
    )

    const adminInfo = await transporter.sendMail({
      from: `"Prachin Ayurved" <${process.env.EMAIL_USER}>`,
      to: "prachinayurvedindia@gmail.com",
      subject: `New Order Alert - ${order.orderNumber} | Prachin Ayurved`,
      html: adminEmailHtml,
    })

    console.log("Order emails sent - Customer:", customerInfo.messageId, "Admin:", adminInfo.messageId)
    return { success: true, customerMessageId: customerInfo.messageId, adminMessageId: adminInfo.messageId }
  } catch (error) {
    console.error("Error sending order confirmation email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}