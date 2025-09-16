import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  username: string
  email: string
  password: string
  role: "admin" | "staff"
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface UserWithoutPassword {
  _id?: ObjectId
  username: string
  email: string
  role: "admin" | "staff"
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}
