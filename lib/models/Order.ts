import type { ObjectId } from "mongodb"

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface Customer {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  pincode: string
  state: string
}

export interface OrderCoupon {
  id: string
  code: string
  discountAmount: number
}

export interface RazorpayPayment {
  orderId?: string
  paymentId?: string
  signature?: string
  status?: string
}

export interface Order {
  _id: ObjectId
  orderNumber: string
  customer: Customer
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  tax: number
  discount?: number
  total: number
  paymentMethod: "card" | "upi" | "cod" | "razorpay"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  status: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled"
  notes?: string
  coupon?: OrderCoupon
  razorpayPayment?: RazorpayPayment
  createdAt: Date
  updatedAt: Date
}

export interface CreateOrderData {
  customer: Customer
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  tax: number
  discount?: number
  total: number
  paymentMethod: "card" | "upi" | "cod" | "razorpay"
  notes?: string
  coupon?: OrderCoupon
  razorpayPayment?: RazorpayPayment
}
