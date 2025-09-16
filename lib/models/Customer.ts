import type { ObjectId } from "mongodb"

export interface Customer {
  _id: ObjectId
  firstName: string
  lastName: string
  email: string
  phone: string
  address?: string
  city?: string
  pincode?: string
  state?: string
  totalOrders: number
  totalSpent: number
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}
