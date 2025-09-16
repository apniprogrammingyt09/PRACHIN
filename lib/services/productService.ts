import { getDatabase } from "@/lib/mongodb"
import type { Product, CreateProductData } from "@/lib/models/Product"
import { ObjectId } from "mongodb"

export class ProductService {
  private async getCollection() {
    const db = await getDatabase()
    return db.collection<Product>("products")
  }

  async getAllProducts(): Promise<Product[]> {
    const collection = await this.getCollection()
    return await collection.find({}).sort({ createdAt: -1 }).toArray()
  }

  async getProductById(id: string): Promise<Product | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ _id: new ObjectId(id) })
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const collection = await this.getCollection()
    const filter = category === "All" ? {} : { category }
    return await collection.find(filter).sort({ createdAt: -1 }).toArray()
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const collection = await this.getCollection()
    return await collection.find({ featured: true }).sort({ createdAt: -1 }).toArray()
  }

  async searchProducts(query: string): Promise<Product[]> {
    const collection = await this.getCollection()
    return await collection
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
          { tags: { $in: [new RegExp(query, "i")] } },
        ],
      })
      .toArray()
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    const collection = await this.getCollection()
    const product: Omit<Product, "_id"> = {
      ...data,
      featured: data.featured || false,
      inStock: true,
      stockQuantity: data.stockQuantity || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(product)
    return { ...product, _id: result.insertedId }
  }

  async updateProduct(id: string, data: Partial<CreateProductData>): Promise<Product | null> {
    const collection = await this.getCollection()
    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" },
    )

    return result
  }

  async deleteProduct(id: string): Promise<boolean> {
    const collection = await this.getCollection()
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  async updateStock(id: string, quantity: number): Promise<boolean> {
    const collection = await this.getCollection()
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          stockQuantity: quantity,
          inStock: quantity > 0,
          updatedAt: new Date(),
        },
      },
    )
    return result.modifiedCount > 0
  }
}

export const productService = new ProductService()
