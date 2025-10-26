"use client"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { Separator } from "@/components/ui/separator"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-green-50 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-800">Your cart is empty</h1>
          <p className="mt-4 text-green-600">Looks like you haven't added any wellness products to your cart yet.</p>
          <Link href="/menu">
            <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white">Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-3xl font-bold text-green-800 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Shopping Cart
      </motion.h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <motion.div
          className="lg:w-2/3"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-green-800 font-medium">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
              </div>

              <Separator className="mb-6 hidden md:block" />

              {items.map((item) => (
                <div key={item.id} className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="col-span-6 flex items-center gap-4">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={
                            item.image && item.image.startsWith("data:")
                              ? item.image
                              : item.image
                                ? `data:image/jpeg;base64,${item.image}`
                                : "/placeholder.svg?height=80&width=80"
                          }
                          alt={item.name}
                          fill
                          className="object-cover"
                          unoptimized={item.image ? true : false}
                        />
                      </div>
                      <div>
                        <Link
                          href={`/product/${item.id}`}
                          className="font-medium text-green-800 hover:text-emerald-600 transition"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center text-sm text-red-500 hover:text-red-700 mt-1"
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Remove
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2 text-center text-green-600">
                      <div className="md:hidden inline-block font-medium text-green-800 mr-2">Price:</div>₹
                      {item.price.toFixed(2)}
                    </div>

                    <div className="col-span-2 flex items-center justify-center">
                      <div className="flex items-center border border-green-200 rounded-md overflow-hidden">
                        <button
                          className="px-2 py-1 text-green-800 hover:bg-green-50"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 py-1 text-green-800">{item.quantity}</span>
                        <button
                          className="px-2 py-1 text-green-800 hover:bg-green-50"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2 text-center font-medium text-emerald-600">
                      <div className="md:hidden inline-block font-medium text-green-800 mr-2">Total:</div>₹
                      {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  {items.indexOf(item) < items.length - 1 && <Separator className="my-6" />}
                </div>
              ))}
            </div>

            <div className="bg-green-50 p-6 flex flex-wrap justify-between items-center gap-4">
              <Button
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-white bg-transparent"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
              <Link href="/menu">
                <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-white hover:text-emerald-600 bg-transparent">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="lg:w-1/3"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-green-800 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-green-600">Subtotal ({totalItems} items)</span>
                  <span className="text-green-800">₹{totalPrice.toFixed(2)}</span>
                </div>

              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-bold mb-6">
                <span className="text-green-800">Total</span>
                <span className="text-emerald-600">₹{totalPrice.toFixed(2)}</span>
              </div>

              <Link href="/checkout">
                <Button className="w-full bg-green-800 hover:bg-green-900 text-white">
                  Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6 p-6">
            <h3 className="font-medium text-green-800 mb-2">We Accept</h3>
            <div className="flex gap-2">
              <div className="bg-green-50 border border-green-200 rounded p-2 text-xs text-green-600">Credit Card</div>
              <div className="bg-green-50 border border-green-200 rounded p-2 text-xs text-green-600">Debit Card</div>
              <div className="bg-green-50 border border-green-200 rounded p-2 text-xs text-green-600">UPI</div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
