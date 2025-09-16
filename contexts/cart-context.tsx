"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
})

const safeLocalStorageSetItem = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      console.warn("LocalStorage quota exceeded. Attempting to clear old cache data.")

      // Clear old cache data to free up space
      const keysToRemove = [
        "cached_products",
        "products_cache_time",
        "cached_blogs",
        "blogs_cache_time",
        "cached_orders",
        "orders_cache_time",
        "cached_customers",
        "customers_cache_time",
        "cached_coupons",
        "coupons_cache_time",
        "cached_dashboard_stats",
        "dashboard_stats_cache_time",
      ]

      keysToRemove.forEach((k) => {
        try {
          localStorage.removeItem(k)
        } catch (e) {
          // Ignore errors when removing items
        }
      })

      // Try again after clearing cache
      try {
        localStorage.setItem(key, value)
        return true
      } catch (retryError) {
        console.error("Failed to save cart even after clearing cache:", retryError)
        return false
      }
    } else {
      console.error("Failed to save cart to localStorage:", error)
      return false
    }
  }
}

const optimizeCartItem = (item: Omit<CartItem, "quantity">): Omit<CartItem, "quantity"> => {
  // Convert base64 images to simple image paths to reduce storage size
  let optimizedImage = item.image

  if (item.image && item.image.startsWith("data:image/")) {
    // Extract filename from base64 data URL if possible, otherwise use a placeholder
    const base64Match = item.image.match(/data:image\/[^;]+;base64,(.+)/)
    if (base64Match) {
      // For now, just use the image path without base64 data
      // In a real app, you'd want to upload the image to a server
      optimizedImage = `/images/${item.name.toLowerCase().replace(/\s+/g, "-")}.jpg`
    }
  }

  return {
    ...item,
    image: optimizedImage,
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on client side
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setItems(parsedCart)
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e)
        // Clear corrupted cart data
        localStorage.removeItem("cart")
      }
    }
  }, [])

  useEffect(() => {
    if (items.length === 0) {
      // Remove cart from storage if empty
      try {
        localStorage.removeItem("cart")
      } catch (e) {
        // Ignore errors when removing
      }
      return
    }

    const cartData = JSON.stringify(items)
    const success = safeLocalStorageSetItem("cart", cartData)

    if (!success) {
      // If we still can't save, show a warning to the user
      console.warn("Unable to save cart. Your cart items may not persist between sessions.")
    }
  }, [items])

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        return prevItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }

      const optimizedItem = optimizeCartItem(item)
      return [...prevItems, { ...optimizedItem, quantity: 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
