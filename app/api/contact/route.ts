import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { sendContactFormEmail } from "@/lib/email-service"

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  message: z.string().min(1, "Message is required"),
})

export async function POST(request: NextRequest) {
  try {
    console.log("Contact form API called")
    const data = await request.json()
    console.log("Received data:", data)

    const validatedFields = ContactSchema.safeParse(data)

    if (!validatedFields.success) {
      console.log("Validation failed:", validatedFields.error.flatten().fieldErrors)
      return NextResponse.json(
        { success: false, errors: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, phone, message } = validatedFields.data
    console.log("Validated data:", { name, email, phone, message })

    // Send contact form email
    console.log("Attempting to send email...")
    const emailResult = await sendContactFormEmail({ name, email, phone, message })
    console.log("Email result:", emailResult)

    if (!emailResult.success) {
      console.error("Email sending failed:", emailResult.error)
      return NextResponse.json(
        { success: false, message: "Failed to send message. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      { success: false, message: "An error occurred. Please try again later." },
      { status: 500 }
    )
  }
}