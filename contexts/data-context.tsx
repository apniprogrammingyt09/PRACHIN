"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Types for cached data
export type Product = {
  _id: string
  name: string
  price: number
  image: string
  category: string
  stockQuantity: number
  inStock: boolean
  description?: string
  skinTypes?: string[]
  images?: Array<{ id: string; url: string; isMain: boolean }>
}

export type Order = {
  _id: string
  orderNumber: string
  customer: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  items: any[]
  total: number
  status: string
  paymentStatus: string
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

export type Customer = {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  status: string
  totalOrders: number
  totalSpent: number
  createdAt: string
}

export type Coupon = {
  _id: string
  code: string
  description: string
  discountType: string
  discountValue: number
  isActive: boolean
  usageLimit?: number
  usedCount: number
  validUntil: string
  createdAt: string
}

export type DashboardStats = {
  orders: {
    totalRevenue: number
    totalOrders: number
    pendingOrders: number
    todayOrders: number
  }
  customers: {
    totalCustomers: number
    activeCustomers: number
  }
  products: {
    total: number
    lowStock: number
  }
}

type DataContextType = {
  // Products
  products: Product[]
  getProduct: (id: string) => Product | undefined
  updateProductCache: (product: Product) => void
  refreshProducts: () => Promise<void>

  // Orders
  orders: Order[]
  getOrder: (id: string) => Order | undefined
  updateOrderCache: (order: Order) => void
  refreshOrders: () => Promise<void>

  // Customers
  customers: Customer[]
  getCustomer: (id: string) => Customer | undefined
  updateCustomerCache: (customer: Customer) => void
  refreshCustomers: () => Promise<void>

  // Coupons
  coupons: Coupon[]
  getCoupon: (id: string) => Coupon | undefined
  updateCouponCache: (coupon: Coupon) => void
  refreshCoupons: () => Promise<void>

  // Dashboard Stats
  dashboardStats: DashboardStats | null
  refreshDashboardStats: () => Promise<void>

  // Cache status
  isProductsCached: boolean
  isOrdersCached: boolean
  isCustomersCached: boolean
  isCouponsCached: boolean
  isDashboardStatsCached: boolean
}

const DataContext = createContext<DataContextType>({
  products: [],
  getProduct: () => undefined,
  updateProductCache: () => {},
  refreshProducts: async () => {},
  orders: [],
  getOrder: () => undefined,
  updateOrderCache: () => {},
  refreshOrders: async () => {},
  customers: [],
  getCustomer: () => undefined,
  updateCustomerCache: () => {},
  refreshCustomers: async () => {},
  coupons: [],
  getCoupon: () => undefined,
  updateCouponCache: () => {},
  refreshCoupons: async () => {},
  dashboardStats: null,
  refreshDashboardStats: async () => {},
  isProductsCached: false,
  isOrdersCached: false,
  isCustomersCached: false,
  isCouponsCached: false,
  isDashboardStatsCached: false,
})

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)

  const [isProductsCached, setIsProductsCached] = useState(false)
  const [isOrdersCached, setIsOrdersCached] = useState(false)
  const [isCustomersCached, setIsCustomersCached] = useState(false)
  const [isCouponsCached, setIsCouponsCached] = useState(false)
  const [isDashboardStatsCached, setIsDashboardStatsCached] = useState(false)

  // Load cached data from localStorage on mount
  useEffect(() => {
    const cacheValidTime = 5 * 60 * 1000 // 5 minutes
    const now = Date.now()

    const cacheItems = [
      {
        key: "cached_products",
        timeKey: "products_cache_time",
        setter: setProducts,
        statusSetter: setIsProductsCached,
      },
      { key: "cached_orders", timeKey: "orders_cache_time", setter: setOrders, statusSetter: setIsOrdersCached },
      {
        key: "cached_customers",
        timeKey: "customers_cache_time",
        setter: setCustomers,
        statusSetter: setIsCustomersCached,
      },
      { key: "cached_coupons", timeKey: "coupons_cache_time", setter: setCoupons, statusSetter: setIsCouponsCached },
      {
        key: "cached_dashboard_stats",
        timeKey: "dashboard_stats_cache_time",
        setter: setDashboardStats,
        statusSetter: setIsDashboardStatsCached,
      },
    ]

    cacheItems.forEach(({ key, timeKey, setter, statusSetter }) => {
      const cachedData = localStorage.getItem(key)
      const timestamp = localStorage.getItem(timeKey)

      if (cachedData && timestamp) {
        const cacheTime = Number.parseInt(timestamp)
        if (now - cacheTime < cacheValidTime) {
          try {
            setter(JSON.parse(cachedData))
            statusSetter(true)
          } catch (e) {
            console.error(`Failed to parse ${key}`, e)
          }
        }
      }
    })

    // Fetch fresh data in background if not cached
    if (!isProductsCached) refreshProducts()
  }, [])

  const refreshProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
        setIsProductsCached(true)
        localStorage.setItem("cached_products", JSON.stringify(data))
        localStorage.setItem("products_cache_time", Date.now().toString())
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const refreshOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
        setIsOrdersCached(true)
        localStorage.setItem("cached_orders", JSON.stringify(data))
        localStorage.setItem("orders_cache_time", Date.now().toString())
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const refreshCustomers = async () => {
    try {
      const response = await fetch("/api/customers")
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
        setIsCustomersCached(true)
        localStorage.setItem("cached_customers", JSON.stringify(data))
        localStorage.setItem("customers_cache_time", Date.now().toString())
      }
    } catch (error) {
      console.error("Error fetching customers:", error)
    }
  }

  const refreshCoupons = async () => {
    try {
      const response = await fetch("/api/coupons")
      if (response.ok) {
        const data = await response.json()
        setCoupons(data)
        setIsCouponsCached(true)
        localStorage.setItem("cached_coupons", JSON.stringify(data))
        localStorage.setItem("coupons_cache_time", Date.now().toString())
      }
    } catch (error) {
      console.error("Error fetching coupons:", error)
    }
  }

  const refreshDashboardStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats")
      if (response.ok) {
        const data = await response.json()
        setDashboardStats(data)
        setIsDashboardStatsCached(true)
        localStorage.setItem("cached_dashboard_stats", JSON.stringify(data))
        localStorage.setItem("dashboard_stats_cache_time", Date.now().toString())
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    }
  }

  const getProduct = (id: string) => products.find((p) => p._id === id)
  const getOrder = (id: string) => orders.find((o) => o._id === id)
  const getCustomer = (id: string) => customers.find((c) => c._id === id)
  const getCoupon = (id: string) => coupons.find((c) => c._id === id)

  const updateProductCache = (product: Product) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p._id === product._id ? product : p))
      if (!updated.find((p) => p._id === product._id)) {
        updated.push(product)
      }
      localStorage.setItem("cached_products", JSON.stringify(updated))
      localStorage.setItem("products_cache_time", Date.now().toString())
      return updated
    })
  }

  const updateOrderCache = (order: Order) => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o._id === order._id ? order : o))
      if (!updated.find((o) => o._id === order._id)) {
        updated.push(order)
      }
      localStorage.setItem("cached_orders", JSON.stringify(updated))
      localStorage.setItem("orders_cache_time", Date.now().toString())
      return updated
    })
  }

  const updateCustomerCache = (customer: Customer) => {
    setCustomers((prev) => {
      const updated = prev.map((c) => (c._id === customer._id ? customer : c))
      if (!updated.find((c) => c._id === customer._id)) {
        updated.push(customer)
      }
      localStorage.setItem("cached_customers", JSON.stringify(updated))
      localStorage.setItem("customers_cache_time", Date.now().toString())
      return updated
    })
  }

  const updateCouponCache = (coupon: Coupon) => {
    setCoupons((prev) => {
      const updated = prev.map((c) => (c._id === coupon._id ? coupon : c))
      if (!updated.find((c) => c._id === coupon._id)) {
        updated.push(coupon)
      }
      localStorage.setItem("cached_coupons", JSON.stringify(updated))
      localStorage.setItem("coupons_cache_time", Date.now().toString())
      return updated
    })
  }

  return (
    <DataContext.Provider
      value={{
        products,
        getProduct,
        updateProductCache,
        refreshProducts,
        orders,
        getOrder,
        updateOrderCache,
        refreshOrders,
        customers,
        getCustomer,
        updateCustomerCache,
        refreshCustomers,
        coupons,
        getCoupon,
        updateCouponCache,
        refreshCoupons,
        dashboardStats,
        refreshDashboardStats,
        isProductsCached,
        isOrdersCached,
        isCustomersCached,
        isCouponsCached,
        isDashboardStatsCached,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
