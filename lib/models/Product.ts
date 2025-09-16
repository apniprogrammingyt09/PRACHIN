import type { ObjectId } from "mongodb"

export interface Product {
  _id: ObjectId
  name: string
  description: string
  price: number
  category: string
  image?: string // This will store base64 encoded image
  featured: boolean
  inStock: boolean
  stockQuantity: number
  benefits?: string[]
  ingredients?: string[]
  usage?: string
  skinType?: string[]
  tags?: string[]
  volume?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateProductData {
  name: string
  description: string
  price: number
  category: string
  image?: string // base64 encoded image
  featured?: boolean
  stockQuantity?: number
  benefits?: string[]
  ingredients?: string[]
  usage?: string
  skinType?: string[]
  tags?: string[]
  volume?: string
}

export const categories = ["All", "Face Oils", "Hair Oils", "Pain Relief Oils", "Face Packs", "Shampoos", "Body Care"]
