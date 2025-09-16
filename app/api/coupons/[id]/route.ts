import { type NextRequest, NextResponse } from "next/server"
import { couponService } from "@/lib/services/couponService"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const coupon = await couponService.getCouponById(params.id)

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 })
    }

    return NextResponse.json(coupon)
  } catch (error: any) {
    console.error("Error in GET /api/coupons/[id]:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch coupon" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // Convert date strings to Date objects if present
    if (body.validFrom) body.validFrom = new Date(body.validFrom)
    if (body.validUntil) body.validUntil = new Date(body.validUntil)

    const coupon = await couponService.updateCoupon(params.id, body)

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 })
    }

    return NextResponse.json(coupon)
  } catch (error: any) {
    console.error("Error in PUT /api/coupons/[id]:", error)
    return NextResponse.json({ error: error.message || "Failed to update coupon" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await couponService.deleteCoupon(params.id)

    if (!success) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Coupon deleted successfully" })
  } catch (error: any) {
    console.error("Error in DELETE /api/coupons/[id]:", error)
    return NextResponse.json({ error: error.message || "Failed to delete coupon" }, { status: 500 })
  }
}
