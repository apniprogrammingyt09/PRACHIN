import { getDatabase } from "@/lib/mongodb"
import type { ICoupon } from "@/lib/models/Coupon"
import { ObjectId } from "mongodb"

class CouponService {
  private async getCouponsCollection() {
    const db = await getDatabase()
    return db.collection<ICoupon>("coupons")
  }

  async getAllCoupons(): Promise<ICoupon[]> {
    try {
      const collection = await this.getCouponsCollection()
      const coupons = await collection.find({}).sort({ createdAt: -1 }).toArray()
      return coupons.map((coupon) => ({
        ...coupon,
        _id: coupon._id?.toString(),
      }))
    } catch (error) {
      console.error("Error fetching coupons:", error)
      throw new Error("Failed to fetch coupons")
    }
  }

  async getCouponById(id: string): Promise<ICoupon | null> {
    try {
      const collection = await this.getCouponsCollection()
      const coupon = await collection.findOne({ _id: new ObjectId(id) })
      if (!coupon) return null

      return {
        ...coupon,
        _id: coupon._id?.toString(),
      }
    } catch (error) {
      console.error("Error fetching coupon by ID:", error)
      throw new Error("Failed to fetch coupon")
    }
  }

  async getCouponByCode(code: string): Promise<ICoupon | null> {
    try {
      const collection = await this.getCouponsCollection()
      const coupon = await collection.findOne({
        code: code.toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() },
      })
      if (!coupon) return null

      return {
        ...coupon,
        _id: coupon._id?.toString(),
      }
    } catch (error) {
      console.error("Error fetching coupon by code:", error)
      throw new Error("Failed to fetch coupon")
    }
  }

  async createCoupon(couponData: Omit<ICoupon, "_id" | "usedCount" | "createdAt" | "updatedAt">): Promise<ICoupon> {
    try {
      const collection = await this.getCouponsCollection()

      // Check if coupon code already exists
      const existingCoupon = await collection.findOne({ code: couponData.code.toUpperCase() })
      if (existingCoupon) {
        throw new Error("Coupon code already exists")
      }

      const now = new Date()
      const newCoupon: Omit<ICoupon, "_id"> = {
        ...couponData,
        code: couponData.code.toUpperCase(),
        usedCount: 0,
        createdAt: now,
        updatedAt: now,
      }

      const result = await collection.insertOne(newCoupon as any)
      const createdCoupon = await collection.findOne({ _id: result.insertedId })

      if (!createdCoupon) {
        throw new Error("Failed to create coupon")
      }

      return {
        ...createdCoupon,
        _id: createdCoupon._id?.toString(),
      }
    } catch (error) {
      console.error("Error creating coupon:", error)
      throw error
    }
  }

  async updateCoupon(id: string, updateData: Partial<ICoupon>): Promise<ICoupon | null> {
    try {
      const collection = await this.getCouponsCollection()

      const updateDoc = {
        ...updateData,
        updatedAt: new Date(),
      }

      if (updateData.code) {
        updateDoc.code = updateData.code.toUpperCase()
      }

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateDoc },
        { returnDocument: "after" },
      )

      if (!result) return null

      return {
        ...result,
        _id: result._id?.toString(),
      }
    } catch (error) {
      console.error("Error updating coupon:", error)
      throw new Error("Failed to update coupon")
    }
  }

  async deleteCoupon(id: string): Promise<boolean> {
    try {
      const collection = await this.getCouponsCollection()
      const result = await collection.deleteOne({ _id: new ObjectId(id) })
      return result.deletedCount > 0
    } catch (error) {
      console.error("Error deleting coupon:", error)
      throw new Error("Failed to delete coupon")
    }
  }

  async toggleCouponStatus(id: string): Promise<ICoupon | null> {
    try {
      const collection = await this.getCouponsCollection()
      const coupon = await collection.findOne({ _id: new ObjectId(id) })

      if (!coupon) return null

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            isActive: !coupon.isActive,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" },
      )

      if (!result) return null

      return {
        ...result,
        _id: result._id?.toString(),
      }
    } catch (error) {
      console.error("Error toggling coupon status:", error)
      throw new Error("Failed to toggle coupon status")
    }
  }

  async validateCoupon(
    code: string,
    orderAmount: number,
  ): Promise<{
    valid: boolean
    coupon?: ICoupon
    error?: string
    discountAmount?: number
  }> {
    try {
      const collection = await this.getCouponsCollection()
      const coupon = await collection.findOne({ code: code.toUpperCase() })

      if (!coupon) {
        return { valid: false, error: "Coupon not found" }
      }

      if (!coupon.isActive) {
        return { valid: false, error: "Coupon is not active" }
      }

      const now = new Date()
      if (now < coupon.validFrom) {
        return { valid: false, error: "Coupon is not yet valid" }
      }

      if (now > coupon.validUntil) {
        return { valid: false, error: "Coupon has expired" }
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return { valid: false, error: "Coupon usage limit reached" }
      }

      if (orderAmount < coupon.minimumOrderAmount) {
        return {
          valid: false,
          error: `Minimum order amount of ₹${coupon.minimumOrderAmount} required`,
        }
      }

      let discountAmount = 0
      if (coupon.discountType === "percentage") {
        discountAmount = (orderAmount * coupon.discountValue) / 100
        if (coupon.maximumDiscountAmount && discountAmount > coupon.maximumDiscountAmount) {
          discountAmount = coupon.maximumDiscountAmount
        }
      } else {
        discountAmount = coupon.discountValue
      }

      return {
        valid: true,
        coupon: {
          ...coupon,
          _id: coupon._id?.toString(),
        },
        discountAmount,
      }
    } catch (error) {
      console.error("Error validating coupon:", error)
      return { valid: false, error: "Failed to validate coupon" }
    }
  }

  async useCoupon(id: string): Promise<ICoupon | null> {
    try {
      const collection = await this.getCouponsCollection()
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $inc: { usedCount: 1 },
          $set: { updatedAt: new Date() },
        },
        { returnDocument: "after" },
      )

      if (!result) return null

      return {
        ...result,
        _id: result._id?.toString(),
      }
    } catch (error) {
      console.error("Error using coupon:", error)
      throw new Error("Failed to use coupon")
    }
  }

  async getCouponStats(): Promise<{
    total: number
    active: number
    expired: number
    used: number
  }> {
    try {
      const collection = await this.getCouponsCollection()
      const now = new Date()

      const [total, active, expired, used] = await Promise.all([
        collection.countDocuments({}),
        collection.countDocuments({
          isActive: true,
          validUntil: { $gt: now },
          validFrom: { $lte: now },
        }),
        collection.countDocuments({ validUntil: { $lt: now } }),
        collection.countDocuments({ usedCount: { $gt: 0 } }),
      ])

      return { total, active, expired, used }
    } catch (error) {
      console.error("Error fetching coupon stats:", error)
      throw new Error("Failed to fetch coupon stats")
    }
  }
}

export const couponService = new CouponService()
