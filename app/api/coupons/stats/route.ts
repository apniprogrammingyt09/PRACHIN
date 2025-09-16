import { NextResponse } from "next/server"
import { couponService } from "@/lib/services/couponService"

export async function GET() {
  try {
    const stats = await couponService.getCouponStats()
    return NextResponse.json(stats)
  } catch (error: any) {
    console.error("Error in GET /api/coupons/stats:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch coupon stats" }, { status: 500 })
  }
}
