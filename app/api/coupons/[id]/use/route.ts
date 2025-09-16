import { type NextRequest, NextResponse } from "next/server"
import { couponService } from "@/lib/services/couponService"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 })
    }

    const updatedCoupon = await couponService.useCoupon(id)

    if (!updatedCoupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 })
    }

    return NextResponse.json(updatedCoupon)
  } catch (error: any) {
    console.error("Error in POST /api/coupons/[id]/use:", error)
    return NextResponse.json({ error: error.message || "Failed to use coupon" }, { status: 500 })
  }
}
