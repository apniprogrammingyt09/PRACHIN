import { type NextRequest, NextResponse } from "next/server"
import { couponService } from "@/lib/services/couponService"

export async function GET() {
  try {
    const coupons = await couponService.getAllCoupons()
    return NextResponse.json(coupons)
  } catch (error: any) {
    console.error("Error in GET /api/coupons:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch coupons" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["code", "description", "discountType", "discountValue", "validFrom", "validUntil"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Validate discount value
    if (body.discountValue <= 0) {
      return NextResponse.json({ error: "Discount value must be greater than 0" }, { status: 400 })
    }

    // Validate percentage discount
    if (body.discountType === "percentage" && body.discountValue > 100) {
      return NextResponse.json({ error: "Percentage discount cannot exceed 100%" }, { status: 400 })
    }

    // Validate dates
    const validFrom = new Date(body.validFrom)
    const validUntil = new Date(body.validUntil)

    if (validUntil <= validFrom) {
      return NextResponse.json({ error: "Valid until date must be after valid from date" }, { status: 400 })
    }

    const couponData = {
      code: body.code,
      description: body.description,
      discountType: body.discountType,
      discountValue: body.discountValue,
      minimumOrderAmount: body.minimumOrderAmount || 0,
      maximumDiscountAmount: body.maximumDiscountAmount,
      usageLimit: body.usageLimit,
      isActive: body.isActive !== undefined ? body.isActive : true,
      validFrom,
      validUntil,
    }

    const coupon = await couponService.createCoupon(couponData)
    return NextResponse.json(coupon, { status: 201 })
  } catch (error: any) {
    console.error("Error in POST /api/coupons:", error)

    if (error.message === "Coupon code already exists") {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: error.message || "Failed to create coupon" }, { status: 500 })
  }
}
