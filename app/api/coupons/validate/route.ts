import { type NextRequest, NextResponse } from "next/server"
import { couponService } from "@/lib/services/couponService"

export async function POST(request: NextRequest) {
  try {
    const { code, orderAmount } = await request.json()

    if (!code || !orderAmount) {
      return NextResponse.json({ error: "Code and order amount are required" }, { status: 400 })
    }

    const result = await couponService.validateCoupon(code, orderAmount)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error in POST /api/coupons/validate:", error)
    return NextResponse.json({ error: error.message || "Failed to validate coupon" }, { status: 500 })
  }
}
