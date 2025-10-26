"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/contexts/cart-context"
import { Check, ShoppingCart, Plus } from "lucide-react"
import { useState } from "react"

interface ProductCardProps {
  id: string
  image?: string
  title: string
  price: number
  category: string
  stockQuantity?: number
  inStock?: boolean
}

export function ProductCard({
  id,
  image,
  title,
  price,
  category,
  stockQuantity = 0,
  inStock = true,
}: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = async () => {
    if (isAdding || isAdded || !inStock || stockQuantity === 0) return

    setIsAdding(true)

    // Add item to cart
    addItem({
      id,
      name: title,
      price,
      image: image || "",
    })

    // Simulate brief loading
    await new Promise((resolve) => setTimeout(resolve, 300))

    setIsAdding(false)
    setIsAdded(true)

    // Reset after showing success
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  // Create a data URL for base64 images or use placeholder
  const imageUrl =
    image && image.startsWith("data:")
      ? image
      : image
        ? `data:image/jpeg;base64,${image}`
        : "/placeholder.svg?height=300&width=300&text=" + encodeURIComponent(title)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="bg-white shadow-md h-full">
        <CardContent className="p-0 flex flex-col h-full">
          <Link href={`/product/${id}`} className="block relative h-48 overflow-hidden">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              fill
              className="object-contain w-full h-full bg-gray-50"
              unoptimized={image ? true : false}
            />
          </Link>
          <div className="p-6 space-y-2 flex flex-col flex-grow">
            <div className="flex-grow">
              <span className="text-xs text-[#D4915D] bg-[#FEEBD7] px-2 py-1 rounded-full">{category}</span>
              <Link href={`/product/${id}`}>
                <h3 className="font-semibold text-[#8B4513] mt-2 hover:text-[#D4915D] transition">{title}</h3>
              </Link>
              <p className="font-medium text-[#D4915D] mt-1">₹{price.toFixed(2)}</p>
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    !inStock || stockQuantity === 0
                      ? "bg-red-100 text-red-600"
                      : stockQuantity < 10
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                  }`}
                >
                  {!inStock || stockQuantity === 0 ? "Out of Stock" : `${stockQuantity} in stock`}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-auto pt-2">
              <motion.div
                className="flex-1"
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: isAdding ? 0.95 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  className={`w-full rounded-full text-white text-sm transition-all duration-300 ${
                    !inStock || stockQuantity === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : isAdded
                        ? "bg-green-600 hover:bg-green-700"
                        : isAdding
                          ? "bg-[#7A3A0D] opacity-80"
                          : "bg-[#8B4513] hover:bg-[#7A3A0D]"
                  }`}
                  onClick={handleAddToCart}
                  disabled={isAdding || !inStock || stockQuantity === 0}
                >
                  <AnimatePresence mode="wait">
                    {!inStock || stockQuantity === 0 ? (
                      <span>Out of Stock</span>
                    ) : isAdded ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Added!</span>
                      </motion.div>
                    ) : isAdding ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Plus className="w-4 h-4" />
                        </motion.div>
                        <span>Adding...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
              <Link href={`/product/${id}`} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full rounded-full border-[#D4915D] text-[#D4915D] hover:bg-[#FFF9F0] text-sm"
                >
                  View
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
