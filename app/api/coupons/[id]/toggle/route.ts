import { type NextRequest, NextResponse } from "next/server"
import { couponService } from "@/lib/services/couponService"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const coupon = await couponService.toggleCouponStatus(params.id)

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 })
    }

    return NextResponse.json(coupon)
  } catch (error: any) {
    console.error("Error in PATCH /api/coupons/[id]/toggle:", error)
    return NextResponse.json({ error: error.message || "Failed to toggle coupon status" }, { status: 500 })
  }
}
