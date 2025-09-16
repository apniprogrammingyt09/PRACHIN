import { getDatabase } from "@/lib/mongodb"
import type { Customer } from "@/lib/models/Customer"
import { ObjectId } from "mongodb"

export class CustomerService {
  private async getCollection() {
    const db = await getDatabase()
    return db.collection<Customer>("customers")
  }

  async getAllCustomers(): Promise<Customer[]> {
    const collection = await this.getCollection()
    return await collection.find({}).sort({ createdAt: -1 }).toArray()
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ _id: new ObjectId(id) })
  }

  async getCustomerByEmail(email: string): Promise<Customer | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ email })
  }

  async createOrUpdateCustomer(customerData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address?: string
    city?: string
    pincode?: string
    state?: string
  }): Promise<Customer> {
    const collection = await this.getCollection()

    const existingCustomer = await this.getCustomerByEmail(customerData.email)

    if (existingCustomer) {
      const result = await collection.findOneAndUpdate(
        { email: customerData.email },
        {
          $set: {
            ...customerData,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" },
      )
      return result.value!
    } else {
      const customer: Omit<Customer, "_id"> = {
        ...customerData,
        totalOrders: 0,
        totalSpent: 0,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await collection.insertOne(customer)
      return { ...customer, _id: result.insertedId }
    }
  }

  async updateCustomerStats(email: string, orderTotal: number): Promise<void> {
    const collection = await this.getCollection()
    await collection.updateOne(
      { email },
      {
        $inc: {
          totalOrders: 1,
          totalSpent: orderTotal,
        },
        $set: {
          updatedAt: new Date(),
        },
      },
    )
  }

  async getCustomerStats() {
    const collection = await this.getCollection()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [totalCustomers, newCustomers, activeCustomers] = await Promise.all([
      collection.countDocuments({}),
      collection.countDocuments({ createdAt: { $gte: today } }),
      collection.countDocuments({ status: "active" }),
    ])

    return {
      totalCustomers,
      newCustomers,
      activeCustomers,
    }
  }
}

export const customerService = new CustomerService()
