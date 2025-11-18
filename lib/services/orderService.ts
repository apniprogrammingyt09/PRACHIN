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
        // Auto-create Shiprocket order when confirmed
        if (status === 'confirmed' && !result.shiprocket?.orderId) {
          this.createShiprocketOrder(result).catch(console.error)
        }
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

      if (resultByNumber && status === 'confirmed' && !resultByNumber.shiprocket?.orderId) {
        this.createShiprocketOrder(resultByNumber).catch(console.error)
      }

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

      if (result && status === 'confirmed' && !result.shiprocket?.orderId) {
        this.createShiprocketOrder(result).catch(console.error)
      }

      return result
    }
  }

  private async createShiprocketOrder(order: Order) {
    try {
      const db = await getDatabase()
      const settings = await db.collection('shiprocket_settings').findOne({})
      
      if (!settings?.email || !settings?.password) {
        console.error('Shiprocket credentials not configured')
        return
      }

      // Authenticate
      const authResponse = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: settings.email, password: settings.password })
      })

      const authResult = await authResponse.json()
      if (!authResult.token) {
        console.error('Shiprocket authentication failed:', authResult)
        return
      }

      // Create order
      const shiprocketOrder = {
        order_id: order.orderNumber,
        order_date: order.createdAt.toISOString().split('T')[0] + ' ' + order.createdAt.toTimeString().slice(0, 5),
        pickup_location: "Home",
        billing_customer_name: order.customer.firstName,
        billing_last_name: order.customer.lastName,
        billing_address: order.customer.address,
        billing_city: order.customer.city,
        billing_pincode: parseInt(order.customer.pincode),
        billing_state: order.customer.state,
        billing_country: "India",
        billing_email: order.customer.email,
        billing_phone: parseInt(order.customer.phone),
        shipping_is_billing: true,
        order_items: order.items.map(item => ({
          name: item.name,
          sku: item.productId,
          units: item.quantity,
          selling_price: item.price,
          hsn: 441122
        })),
        payment_method: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
        sub_total: order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        length: 10,
        breadth: 10,
        height: 5,
        weight: 0.5
      }

      const orderResponse = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authResult.token}`
        },
        body: JSON.stringify(shiprocketOrder)
      })

      const orderResult = await orderResponse.json()
      
      if (orderResult.order_id) {
        await this.updateShiprocketData(order._id.toString(), {
          orderId: orderResult.order_id,
          shipmentId: orderResult.shipment_id
        })
        console.log('Shiprocket order created:', orderResult.order_id)
      } else {
        console.error('Failed to create Shiprocket order:', orderResult)
      }
    } catch (error) {
      console.error('Error creating Shiprocket order:', error)
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

  async updateShiprocketData(id: string, shiprocketData: any): Promise<Order | null> {
    const collection = await this.getCollection()
    try {
      const objectId = new ObjectId(id)
      const result = await collection.findOneAndUpdate(
        { _id: objectId },
        {
          $set: {
            shiprocket: shiprocketData,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" },
      )
      return result
    } catch (error) {
      console.error("Error in updateShiprocketData:", error)
      return null
    }
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
