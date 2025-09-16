import { NextResponse } from "next/server"
import { customerService } from "@/lib/services/customerService"

export async function GET() {
  try {
    const customers = await customerService.getAllCustomers()
    return NextResponse.json(customers)
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}
