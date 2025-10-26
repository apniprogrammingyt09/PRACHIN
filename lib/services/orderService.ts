import { getDatabase } from "@/lib/mongodb"
import type { Order, CreateOrderData, RazorpayPayment } from "@/lib/models/Order"
import { ObjectId } from "mongodb"

export class OrderService {
  private async getCollection() {
    const db = await getDatabase()
    return db.collection<Order>("orders")
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `ORD-${timestamp}${random}`
  }

  async getAllOrders(): Promise<Order[]> {
    const collection = await this.getCollection()
    return await collection.find({}).sort({ createdAt: -1 }).toArray()
  }

  async getOrderById(id: string): Promise<Order | null> {
    const collection = await this.getCollection()
    try {
      return await collection.findOne({ _id: new ObjectId(id) })
    } catch (error) {
      console.error("Error in getOrderById:", error)
      // Try finding by orderNumber if ObjectId conversion fails
      return await collection.findOne({ orderNumber: id })
    }
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ orderNumber })
  }

  async getOrdersByStatus(status: Order["status"]): Promise<Order[]> {
    const collection = await this.getCollection()
    return await collection.find({ status }).sort({ createdAt: -1 }).toArray()
  }

  async getOrdersByCustomer(email: string): Promise<Order[]> {
    const collection = await this.getCollection()
    return await collection.find({ "customer.email": email }).sort({ createdAt: -1 }).toArray()
  }

  async createOrder(data: CreateOrderData): Promise<Order> {
    const collection = await this.getCollection()
    const order: Omit<Order, "_id"> = {
      ...data,
      orderNumber: this.generateOrderNumber(),
      paymentStatus: data.razorpayPayment ? "paid" : data.paymentMethod === "cod" ? "pending" : "paid",
      status: data.razorpayPayment ? "confirmed" : "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(order)
    return { ...order, _id: result.insertedId }
  }

  async updateOrderStatus(id: string, status: Order["status"]): Promise<Order | null> {
    const collection = await this.getCollection()
    try {
      const objectId = new ObjectId(id)
      const result = await collection.findOneAndUpdate(
        { _id: objectId },
        {
          $set: {
            status,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" },
      )

      if (result) {
        return result
      }

      // If no document was updated with ObjectId, try with orderNumber
      const resultByNumber = await collection.findOneAndUpdate(
        { orderNumber: id },
        {
          $set: {
            status,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" },
      )

      return resultByNumber
    } catch (error) {
      console.error("Error in updateOrderStatus:", error)
      // If ObjectId conversion fails, try with orderNumber
      const result = await collection.findOneAndUpdate(
        { orderNumber: id },
        {
          $set: {
            status,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" },
      )

      return result
    }
  }

  async updatePaymentStatus(id: string, paymentStatus: Order["paymentStatus"]): Promise<Order | null> {
    const collection = await this.getCollection()
    try {
      const objectId = new ObjectId(id)
      const result = await collection.findOneAndUpdate(
        { _id: objectId },
        {
          $set: {
            paymentStatus,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" },
      )

      if (result) {
        return result
      }

      // If no document was updated with ObjectId, try with orderNumber
      const resultByNumber = await collection.findOneAndUpdate(
        { orderNumber: id },
        {
          $set: {
            paymentStatus,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" },
      )

      return resultByNumber
    } catch (error) {
      console.error("Error in updatePaymentStatus:", error)
      // If ObjectId conversion fails, try with orderNumber
      const result = await collection.findOneAndUpdate(
        { orderNumber: id },
        {
          $set: {
            paymentStatus,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" },
      )

      return result
    }
  }

  async updatePaymentDetails(id: string, paymentDetails: RazorpayPayment): Promise<Order | null> {
    const collection = await this.getCollection()
    try {
      const objectId = new ObjectId(id)
      const result = await collection.findOneAndUpdate(
        { _id: objectId },
        {
          $set: {
            razorpayPayment: paymentDetails,
            paymentStatus: paymentDetails.status === "captured" ? "paid" : "pending",
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" },
      )

      if (result) {
        return result
      }

      // If no document was updated with ObjectId, try with orderNumber
      const resultByNumber = await collection.findOneAndUpdate(
        { orderNumber: id },
        {
          $set: {
            razorpayPayment: paymentDetails,
            paymentStatus: paymentDetails.status === "captured" ? "paid" : "pending",
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" },
      )

      return resultByNumber
    } catch (error) {
      console.error("Error in updatePaymentDetails:", error)
      // If ObjectId conversion fails, try with orderNumber
      const result = await collection.findOneAndUpdate(
        { orderNumber: id },
        {
          $set: {
            razorpayPayment: paymentDetails,
            paymentStatus: paymentDetails.status === "captured" ? "paid" : "pending",
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" },
      )

      return result
    }
  }

  async getOrderByRazorpayOrderId(razorpayOrderId: string): Promise<Order | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ "razorpayPayment.orderId": razorpayOrderId })
  }

  async getOrderStats() {
    const collection = await this.getCollection()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [totalOrders, todayOrders, totalRevenue, pendingOrders] = await Promise.all([
      collection.countDocuments({}),
      collection.countDocuments({ createdAt: { $gte: today } }),
      collection
        .aggregate([{ $match: { paymentStatus: "paid" } }, { $group: { _id: null, total: { $sum: "$total" } } }])
        .toArray(),
      collection.countDocuments({ status: { $in: ["pending", "confirmed", "preparing"] } }),
    ])

    return {
      totalOrders,
      todayOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
    }
  }
}

export const orderService = new OrderService()

export const getOrderById = (id: string) => orderService.getOrderById(id)
