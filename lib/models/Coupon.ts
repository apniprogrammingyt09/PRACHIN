export interface ICoupon {
  _id?: string
  code: string
  description: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minimumOrderAmount: number
  maximumDiscountAmount?: number
  usageLimit?: number
  usedCount: number
  isActive: boolean
  validFrom: Date
  validUntil: Date
  createdAt: Date
  updatedAt: Date
}

export const CouponSchema = {
  code: { type: "string", required: true, unique: true },
  description: { type: "string", required: true },
  discountType: { type: "string", enum: ["percentage", "fixed"], required: true },
  discountValue: { type: "number", required: true, min: 0 },
  minimumOrderAmount: { type: "number", default: 0, min: 0 },
  maximumDiscountAmount: { type: "number", min: 0 },
  usageLimit: { type: "number", min: 1 },
  usedCount: { type: "number", default: 0, min: 0 },
  isActive: { type: "boolean", default: true },
  validFrom: { type: "date", required: true },
  validUntil: { type: "date", required: true },
  createdAt: { type: "date", default: () => new Date() },
  updatedAt: { type: "date", default: () => new Date() },
}
